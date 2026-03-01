import { createClient } from '../src/db'
import { eq } from 'drizzle-orm'
import { adminSessions, adminUsers } from '../src/db/schema'
import { getSessionTokenFromCookie } from '../src/lib/auth'

interface Env {
  DB: any
}

interface MiddlewareContext {
  request: Request
  next: () => Promise<Response>
  env: Env
}

export async function onRequest(context: MiddlewareContext): Promise<Response> {
  const { request, env, next } = context
  const url = new URL(request.url)

  // Skip auth for non-admin routes and public assets
  if (!url.pathname.startsWith('/admin')) {
    return next()
  }

  // Skip auth for admin login page
  if (url.pathname === '/admin/login' || url.pathname === '/admin/auth/login') {
    return next()
  }

  // Check auth for admin routes
  const cookieHeader = request.headers.get('Cookie') || ''
  const sessionToken = getSessionTokenFromCookie(cookieHeader)

  if (!sessionToken) {
    // Redirect to login
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login',
        'Set-Cookie': 'redirect=' + encodeURIComponent(url.pathname) + '; Path=/; Max-Age=300',
      },
    })
  }

  // Validate session
  const db = createClient(env.DB)
  const result = await db
    .select({
      user: adminUsers,
      session: adminSessions,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(eq(adminSessions.token, sessionToken))
    .limit(1)

  if (!result || result.length === 0) {
    // Invalid session, redirect to login
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login',
        'Set-Cookie': 'session=; Path=/; Max-Age=0',
      },
    })
  }

  const { user, session } = result[0]

  // Check expiration
  if (new Date(session.expiresAt) < new Date()) {
    // Session expired, redirect to login
    await db.delete(adminSessions).where(eq(adminSessions.id, session.id))
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login',
        'Set-Cookie': 'session=; Path=/; Max-Age=0',
      },
    })
  }

  // Add user to context for downstream functions
  ;(request as any).user = user

  return next()
}
