import { eq } from 'drizzle-orm'
import type { Database, AdminUser } from '@clinro/types/schema'

// Drizzle schema - we need to import the actual schema for queries
// For now, we'll use a generic approach that works with the schema

export async function createSession(
  userId: string,
  db: Database,
  expiresInDays = 7
): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  // Import schema dynamically to avoid circular dependencies
  const { schema } = await import('../db/client.js')

  await db.insert(schema.adminSessions).values({
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
): Promise<AdminUser | null> {
  const { schema } = await import('../db/client.js')

  const result = await db
    .select({
      user: schema.adminUsers,
      session: schema.adminSessions,
    })
    .from(schema.adminSessions)
    .innerJoin(schema.adminUsers, eq(schema.adminSessions.userId, schema.adminUsers.id))
    .where(eq(schema.adminSessions.token, token))
    .limit(1)

  if (!result || result.length === 0) return null

  const { user, session } = result[0]!

  // Check expiration
  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(schema.adminSessions).where(eq(schema.adminSessions.id, session.id))
    return null
  }

  return user as AdminUser
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
): Promise<{ user: AdminUser; token: string } | never> {
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
