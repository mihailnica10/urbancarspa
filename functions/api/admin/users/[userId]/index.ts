import { createClient } from '../../../../../src/db'
import { eq, and } from 'drizzle-orm'
import { adminUsers, tenants, adminSessions, auditLogs } from '../../../../../src/db/schema'
import { changePasswordSchema } from '../../../../../src/lib/validations/auth'
import { verifyPassword, hashPassword, validatePasswordStrength } from '../../../../../src/lib/password'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
  params: { userId: string }
}

// GET - Get single user
export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const userId = params.userId

  // Only superadmin can view any user
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  const db = createClient(env.DB)

  const result = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, userId))
    .limit(1)

  if (!result || result.length === 0) {
    return new Response('User not found', { status: 404 })
  }

  // Include tenant name if applicable
  let tenantName = null
  if (result[0].tenantId) {
    const tenant = await db
      .select({ name: tenants.name })
      .from(tenants)
      .where(eq(tenants.id, result[0].tenantId))
      .limit(1)
    tenantName = tenant[0]?.name || null
  }

  // Return user without password hash
  const { passwordHash, ...userWithoutPassword } = result[0]

  return Response.json({ user: { ...userWithoutPassword, tenantName } })
}

// PUT - Update user
export async function onRequestPut(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const userId = params.userId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.id !== userId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()

    // Don't allow role changes (except by superadmin)
    if (body.role && user.role !== 'superadmin') {
      return Response.json({ error: 'Cannot change role' }, { status: 403 })
    }

    // If changing email, check it's not taken
    if (body.email) {
      const existing = await db
        .select()
        .from(adminUsers)
        .where(and(
          eq(adminUsers.email, body.email),
          // Exclude current user
          eq(adminUsers.id, userId)
        ))
        .limit(1)

      if (existing && existing.length > 0) {
        return Response.json({ error: 'Email already exists' }, { status: 409 })
      }
    }

    // If changing tenant, verify tenant exists (only for tenant_admin role)
    if (body.tenantId) {
      const tenant = await db
        .select()
        .from(tenants)
        .where(eq(tenants.id, body.tenantId))
        .limit(1)

      if (!tenant || tenant.length === 0) {
        return Response.json({ error: 'Tenant not found' }, { status: 404 })
      }
    }

    const result = await db
      .update(adminUsers)
      .set({
        ...body,
        // Never update password through this endpoint
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUsers.id, userId))
      .returning()

    if (!result || result.length === 0) {
      return new Response('User not found', { status: 404 })
    }

    // Log action
    await logAuditAction(db, user.id, null, 'user_updated', { userId, updates: body })

    const { passwordHash, ...userWithoutPassword } = result[0]
    return Response.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Update user error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Change password
export async function onRequestPatch(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const userId = params.userId

  const db = createClient(env.DB)

  // Users can change their own password, superadmin can change any
  if (user.role !== 'superadmin' && user.id !== userId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()

    // Validate input
    const validationResult = changePasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const { currentPassword, newPassword } = validationResult.data

    // Get user
    const userRecord = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, userId))
      .limit(1)

    if (!userRecord || userRecord.length === 0) {
      return new Response('User not found', { status: 404 })
    }

    // Verify current password (unless superadmin changing someone else's)
    if (user.id === userId) {
      const isValid = await verifyPassword(currentPassword, userRecord[0].passwordHash)
      if (!isValid) {
        return Response.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
    }

    // Validate new password strength
    const passwordCheck = validatePasswordStrength(newPassword)
    if (!passwordCheck.valid) {
      return Response.json({
        error: 'Password does not meet requirements',
        details: passwordCheck.errors
      }, { status: 400 })
    }

    // Update password
    await db
      .update(adminUsers)
      .set({ passwordHash: await hashPassword(newPassword) })
      .where(eq(adminUsers.id, userId))

    // Log action
    await logAuditAction(db, user.id, null, 'password_changed', { userId })

    return Response.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete user
export async function onRequestDelete(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const userId = params.userId

  const db = createClient(env.DB)

  // Only superadmin can delete users, and cannot delete themselves
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  if (user.id === userId) {
    return Response.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  try {
    // Delete user (cascade will handle sessions and audit logs)
    await db.delete(adminUsers).where(eq(adminUsers.id, userId))

    // Log action
    await logAuditAction(db, user.id, null, 'user_deleted', { deletedUserId: userId })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Delete user error:', error)
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
