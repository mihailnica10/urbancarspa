/**
 * Rate limiting utilities for login and other sensitive operations
 * Uses D1 database for persistent tracking across edge functions
 */

import type { Database } from '@/db'
import { eq, and, lt } from 'drizzle-orm'
import { loginAttempts } from '@/db/schema'

// Rate limit configuration
export const RATE_LIMIT_CONFIG = {
  // Maximum failed attempts before lockout
  maxAttempts: 5,
  // Lockout duration in milliseconds (15 minutes)
  lockoutDuration: 15 * 60 * 1000,
  // Window duration for counting attempts (1 hour)
  windowDuration: 60 * 60 * 1000,
} as const

export interface RateLimitResult {
  allowed: boolean
  remainingAttempts: number
  retryAfter?: Date // When lockout expires
  error?: string
}

/**
 * Check if a login attempt should be rate limited
 */
export async function checkLoginRateLimit(
  db: Database,
  identifier: string, // Email or unique identifier
  ipAddress: string
): Promise<RateLimitResult> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - RATE_LIMIT_CONFIG.windowDuration)

  // Clean up old attempts outside the window
  await db
    .delete(loginAttempts)
    .where(
      and(
        eq(loginAttempts.identifier, identifier),
        lt(loginAttempts.createdAt, windowStart.toISOString())
      )
    )

  // Check for active lockout
  const recentAttempts = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.identifier, identifier))
    .orderBy(loginAttempts.createdAt)
    .limit(50)

  // Find active lockout
  const activeLockout = recentAttempts.find(attempt => {
    if (!attempt.lockoutUntil) return false
    return new Date(attempt.lockoutUntil) > now
  })

  if (activeLockout?.lockoutUntil) {
    const lockoutExpires = new Date(activeLockout.lockoutUntil)
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter: lockoutExpires,
      error: 'Too many failed attempts. Please try again later.',
    }
  }

  // Count failed attempts in the window
  const failedAttempts = recentAttempts.filter(a => !a.success && a.createdAt >= windowStart.toISOString())
  const attemptsCount = failedAttempts.length

  if (attemptsCount >= RATE_LIMIT_CONFIG.maxAttempts) {
    // Lockout the account
    const lockoutUntil = new Date(now.getTime() + RATE_LIMIT_CONFIG.lockoutDuration)

    // Update all recent attempts with lockout
    for (const attempt of recentAttempts) {
      await db
        .update(loginAttempts)
        .set({ lockoutUntil: lockoutUntil.toISOString() })
        .where(eq(loginAttempts.id, attempt.id))
    }

    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfter: lockoutUntil,
      error: 'Too many failed attempts. Account locked for 15 minutes.',
    }
  }

  return {
    allowed: true,
    remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts - attemptsCount,
  }
}

/**
 * Record a login attempt (success or failure)
 */
export async function recordLoginAttempt(
  db: Database,
  identifier: string,
  ipAddress: string,
  success: boolean
): Promise<void> {
  const now = new Date()

  await db.insert(loginAttempts).values({
    id: crypto.randomUUID(),
    identifier,
    ipAddress,
    success,
    attemptsCount: 1,
    createdAt: now.toISOString(),
  })

  // Clear lockout on successful login
  if (success) {
    await db
      .update(loginAttempts)
      .set({ lockoutUntil: null })
      .where(eq(loginAttempts.identifier, identifier))
  }
}

/**
 * Check if an identifier is currently locked out
 */
export async function isLockedOut(
  db: Database,
  identifier: string
): Promise<boolean> {
  const now = new Date()

  const attempts = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.identifier, identifier))
    .limit(1)

  const latestAttempt = attempts[0]
  if (!latestAttempt?.lockoutUntil) return false

  return new Date(latestAttempt.lockoutUntil) > now
}

/**
 * Get remaining lockout time
 */
export async function getLockoutRemaining(
  db: Database,
  identifier: string
): Promise<number | null> {
  const now = new Date()

  const attempts = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.identifier, identifier))
    .orderBy(loginAttempts.createdAt)
    .limit(1)

  const latestAttempt = attempts[0]
  if (!latestAttempt?.lockoutUntil) return null

  const lockoutUntil = new Date(latestAttempt.lockoutUntil)
  if (lockoutUntil <= now) return null

  return lockoutUntil.getTime() - now.getTime()
}

/**
 * Clear all rate limit records for an identifier (e.g., after password reset)
 */
export async function clearRateLimit(
  db: Database,
  identifier: string
): Promise<void> {
  await db.delete(loginAttempts).where(eq(loginAttempts.identifier, identifier))
}

/**
 * Generic rate limiter for any operation
 */
export class RateLimiter {
  constructor(
    private db: Database,
    private options: {
      maxAttempts: number
      windowMs: number
      lockoutMs?: number
    } = {}
  ) {
    this.options = {
      maxAttempts: options.maxAttempts ?? 10,
      windowMs: options.windowMs ?? 60_000, // 1 minute default
      lockoutMs: options.lockoutMs,
    }
  }

  async check(
    key: string,
    ipAddress: string
  ): Promise<RateLimitResult> {
    const now = new Date()
    const windowStart = new Date(now.getTime() - this.options.windowMs)

    // Clean old attempts
    await this.db
      .delete(loginAttempts)
      .where(
        and(
          eq(loginAttempts.identifier, key),
          lt(loginAttempts.createdAt, windowStart.toISOString())
        )
      )

    // Get recent attempts
    const recentAttempts = await this.db
      .select()
      .from(loginAttempts)
      .where(eq(loginAttempts.identifier, key))
      .limit(100)

    // Check for active lockout
    const activeLockout = recentAttempts.find((attempt: typeof loginAttempts.$inferSelect) => {
      if (!attempt.lockoutUntil) return false
      return new Date(attempt.lockoutUntil) > now
    })

    if (activeLockout?.lockoutUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfter: new Date(activeLockout.lockoutUntil),
        error: 'Rate limit exceeded. Please try again later.',
      }
    }

    // Count attempts in window
    const attemptsInWindow = recentAttempts.filter(
      (a: typeof loginAttempts.$inferSelect) => (a.createdAt ?? '') >= windowStart.toISOString()
    )

    if (attemptsInWindow.length >= this.options.maxAttempts && this.options.lockoutMs) {
      const lockoutUntil = new Date(now.getTime() + this.options.lockoutMs)

      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfter: lockoutUntil,
        error: 'Rate limit exceeded. Please try again later.',
      }
    }

    return {
      allowed: true,
      remainingAttempts: this.options.maxAttempts - attemptsInWindow.length,
    }
  }

  async record(key: string, ipAddress: string, success = true): Promise<void> {
    await this.db.insert(loginAttempts).values({
      id: crypto.randomUUID(),
      identifier: key,
      ipAddress,
      success,
      attemptsCount: 1,
      createdAt: new Date().toISOString(),
    })
  }

  async reset(key: string): Promise<void> {
    await this.db.delete(loginAttempts).where(eq(loginAttempts.identifier, key))
  }
}
