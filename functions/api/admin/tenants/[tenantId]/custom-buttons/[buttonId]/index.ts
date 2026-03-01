import { createClient } from '../../../../../../../src/db'
import { eq, and } from 'drizzle-orm'
import { tenantCustomButtons, tenants, auditLogs } from '../../../../../../../src/db/schema'
import { customButtonUpdateSchema } from '../../../../../../../src/lib/validations/button'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
  params: { tenantId: string; buttonId: string }
}

// GET - Get single custom button
export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const buttonId = params.buttonId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  const button = await db
    .select()
    .from(tenantCustomButtons)
    .where(and(
      eq(tenantCustomButtons.id, buttonId),
      eq(tenantCustomButtons.tenantId, tenantId)
    ))
    .limit(1)

  if (!button || button.length === 0) {
    return new Response('Custom button not found', { status: 404 })
  }

  return Response.json({ button: button[0] })
}

// PUT - Update custom button
export async function onRequestPut(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const buttonId = params.buttonId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()

    // Validate input
    const validationResult = customButtonUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const data = validationResult.data

    const result = await db
      .update(tenantCustomButtons)
      .set({
        label: data.label,
        url: data.url,
        iconName: data.iconName,
        iconSvg: data.iconSvg,
        buttonVariant: data.buttonVariant,
        buttonSize: data.buttonSize,
        isEnabled: data.isEnabled,
      })
      .where(and(
        eq(tenantCustomButtons.id, buttonId),
        eq(tenantCustomButtons.tenantId, tenantId)
      ))
      .returning()

    if (!result || result.length === 0) {
      return new Response('Custom button not found', { status: 404 })
    }

    // Log action
    await logAuditAction(db, user.id, tenantId, 'custom_button_updated', { buttonId })

    return Response.json({ button: result[0] })
  } catch (error) {
    console.error('Update custom button error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Toggle enabled/disabled
export async function onRequestPatch(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const buttonId = params.buttonId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const { isEnabled } = await request.json()

    const result = await db
      .update(tenantCustomButtons)
      .set({ isEnabled: isEnabled ?? false })
      .where(and(
        eq(tenantCustomButtons.id, buttonId),
        eq(tenantCustomButtons.tenantId, tenantId)
      ))
      .returning()

    if (!result || result.length === 0) {
      return new Response('Custom button not found', { status: 404 })
    }

    // Log action
    await logAuditAction(db, user.id, tenantId, 'custom_button_toggled', { buttonId, isEnabled })

    return Response.json({ button: result[0] })
  } catch (error) {
    console.error('Toggle custom button error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete custom button
export async function onRequestDelete(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const buttonId = params.buttonId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    await db
      .delete(tenantCustomButtons)
      .where(and(
        eq(tenantCustomButtons.id, buttonId),
        eq(tenantCustomButtons.tenantId, tenantId)
      ))

    // Log action
    await logAuditAction(db, user.id, tenantId, 'custom_button_deleted', { buttonId })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Delete custom button error:', error)
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
    ipAddress: null, // Will be set by middleware
    createdAt: new Date().toISOString(),
  })
}
