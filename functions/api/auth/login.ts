import { createClient } from '../../../src/db'
import { eq } from 'drizzle-orm'
import { adminUsers } from '../../../src/db/schema'
import { verifyPassword, createSession, setSessionCookie, validatePasswordStrength } from '../../../src/lib/auth'
import { checkLoginRateLimit, recordLoginAttempt } from '../../../src/lib/rate-limit'

interface Env {
  DB: any
}

export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Get IP address for rate limiting
    const ipAddress = request.headers.get('CF-Connecting-IP') ||
                      request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                      'unknown'

    const db = createClient(env.DB)

    // Check rate limit BEFORE verifying credentials (prevent enumeration)
    const rateLimitResult = await checkLoginRateLimit(db, email, ipAddress)

    if (!rateLimitResult.allowed) {
      // Still record the failed attempt
      await recordLoginAttempt(db, email, ipAddress, false)

      return Response.json({
        error: rateLimitResult.error,
        retryAfter: rateLimitResult.retryAfter?.toISOString(),
      }, { status: 429 })
    }

    const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)

    if (!result || result.length === 0) {
      // Record failed attempt (user not found)
      await recordLoginAttempt(db, email, ipAddress, false)
      return Response.json({
        error: 'Invalid credentials',
        remainingAttempts: rateLimitResult.remainingAttempts - 1,
      }, { status: 401 })
    }

    const user = result[0]

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      // Record failed attempt (wrong password)
      await recordLoginAttempt(db, email, ipAddress, false)
      return Response.json({
        error: 'Invalid credentials',
        remainingAttempts: rateLimitResult.remainingAttempts - 1,
      }, { status: 401 })
    }

    // Record successful attempt
    await recordLoginAttempt(db, email, ipAddress, true)

    const sessionToken = await createSession(user.id, db)

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date().toISOString() })
      .where(eq(adminUsers.id, user.id))

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': setSessionCookie(sessionToken),
        },
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
