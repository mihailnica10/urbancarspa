import { eq } from 'drizzle-orm'
import { adminUsers, adminSessions } from '@/db/schema'
import type { Database } from '@/db'
export { hashPassword, verifyPassword, needsRehash, validatePasswordStrength } from './password'

export async function createSession(
  userId: string,
  db: Database,
  expiresInDays = 7
): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  await db.insert(adminSessions).values({
    id: crypto.randomUUID(),
    userId,
    token,
    expiresAt: expiresAt.toISOString(),
  })

  return token
}

export async function validateSession(
  token: string,
  db: Database
): Promise<(typeof adminUsers.$inferSelect) | null> {
  const result = await db
    .select({
      user: adminUsers,
      session: adminSessions,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(eq(adminSessions.token, token))
    .limit(1)

  if (!result || result.length === 0) return null

  const { user, session } = result[0]

  // Check expiration
  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(adminSessions).where(eq(adminSessions.id, session.id))
    return null
  }

  return user
}

export function setSessionCookie(token: string): string {
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)
  return `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=${expires.toUTCString()}`
}

export function clearSessionCookie(): string {
  return 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
}

export function getSessionTokenFromCookie(cookieHeader: string): string | null {
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const sessionCookie = cookies.find(c => c.startsWith('session='))
  return sessionCookie ? sessionCookie.slice(8) : null
}

export async function requireAuth(
  request: Request,
  db: Database
): Promise<{ user: typeof adminUsers.$inferSelect; token: string } | never> {
  const cookieHeader = request.headers.get('Cookie') || ''
  const token = getSessionTokenFromCookie(cookieHeader)

  if (!token) {
    throw new Error('Unauthorized')
  }

  const user = await validateSession(token, db)
  if (!user) {
    throw new Error('Unauthorized')
  }

  return { user, token }
}
