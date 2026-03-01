import type { APIRoute } from 'astro'
import { createClient } from '@/db'
import { eq } from 'drizzle-orm'
import { adminUsers } from '@/db/schema'
import { verifyPassword, createSession, setSessionCookie } from '@/lib/auth'
import { checkLoginRateLimit, recordLoginAttempt } from '@/lib/rate-limit'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const ipAddress = request.headers.get('CF-Connecting-IP') ||
                      request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                      'unknown'

    // Access D1 via locals (set by Cloudflare adapter)
    const db = createClient(locals.runtime?.env.DB)

    // Check rate limit
    const rateLimitResult = await checkLoginRateLimit(db, email, ipAddress)

    if (!rateLimitResult.allowed) {
      await recordLoginAttempt(db, email, ipAddress, false)
      return new Response(
        JSON.stringify({
          error: rateLimitResult.error,
          retryAfter: rateLimitResult.retryAfter?.toISOString(),
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)

    if (!result || result.length === 0) {
      await recordLoginAttempt(db, email, ipAddress, false)
      return new Response(
        JSON.stringify({
          error: 'Invalid credentials',
          remainingAttempts: rateLimitResult.remainingAttempts - 1,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const user = result[0]

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      await recordLoginAttempt(db, email, ipAddress, false)
      return new Response(
        JSON.stringify({
          error: 'Invalid credentials',
          remainingAttempts: rateLimitResult.remainingAttempts - 1,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    await recordLoginAttempt(db, email, ipAddress, true)

    const sessionToken = await createSession(user.id, db)

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
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
