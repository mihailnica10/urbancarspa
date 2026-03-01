import { createClient } from '../../../../src/db'
import { eq, and } from 'drizzle-orm'
import { adminUsers, tenants, auditLogs } from '../../../../src/db/schema'
import { registerSchema } from '../../../../src/lib/validations/auth'
import { validatePasswordStrength } from '../../../../src/lib/password'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
}

// GET - List all admin users
export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  // Only superadmin can list users
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  const db = createClient(env.DB)

  const users = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      tenantId: adminUsers.tenantId,
      createdAt: adminUsers.createdAt,
      lastLogin: adminUsers.lastLogin,
    })
    .from(adminUsers)
    .orderBy(adminUsers.createdAt)

  // Fetch tenant names for tenant admins
  const usersWithTenants = await Promise.all(
    users.map(async (u) => {
      if (u.tenantId) {
        const tenant = await db
          .select({ name: tenants.name })
          .from(tenants)
          .where(eq(tenants.id, u.tenantId))
          .limit(1)
        return {
          ...u,
          tenantName: tenant[0]?.name || null,
        }
      }
      return u
    })
  )

  return Response.json({ users: usersWithTenants })
}

// POST - Create new admin user
export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  // Only superadmin can create users
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()

    // Validate core input (email, password, name)
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const { email, password, name } = validationResult.data
    const { role, tenantId } = body

    // Validate role
    if (role && role !== 'superadmin' && role !== 'tenant_admin') {
      return Response.json({ error: 'Invalid role. Must be superadmin or tenant_admin' }, { status: 400 })
    }

    // Validate password strength
    const passwordCheck = validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      return Response.json({
        error: 'Password does not meet requirements',
        details: passwordCheck.errors
      }, { status: 400 })
    }

    const db = createClient(env.DB)

    // Check if email already exists
    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1)

    if (existing && existing.length > 0) {
      return Response.json({ error: 'Email already exists' }, { status: 409 })
    }

    // If creating tenant admin, verify tenant exists
    if (role === 'tenant_admin' && tenantId) {
      const tenant = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, tenantId))
        .limit(1)

      if (!tenant || tenant.length === 0) {
        return Response.json({ error: 'Tenant not found' }, { status: 404 })
      }
    }

    // Import hashPassword function
    const { hashPassword } = await import('../../../../src/lib/password.ts')

    // Create user
    const newUser = await db
      .insert(adminUsers)
      .values({
        id: crypto.randomUUID(),
        email,
        passwordHash: await hashPassword(password),
        name: name || null,
        role: role || 'tenant_admin',
        tenantId: tenantId || null,
      })
      .returning()

    // Log action
    await logAuditAction(db, user.id, null, 'user_created', {
      newUserId: newUser[0].id,
      email,
      role,
    })

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = newUser[0]
    return Response.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper: Log audit action
async function logAuditAction(
  db: any,
  userId: string,
  tenantId: string | null,
  action: string,
  details: Record<string, unknown>
) {
  await db.insert(auditLogs).values({
    id: crypto.randomUUID(),
    userId,
    tenantId,
    action,
    details: JSON.stringify(details),
    ipAddress: null,
    createdAt: new Date().toISOString(),
  })
}
