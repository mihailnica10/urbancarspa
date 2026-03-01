import { createClient } from '../../../../../../src/db'
import { eq, and } from 'drizzle-orm'
import { tenantCustomButtons, tenants, auditLogs } from '../../../../../../src/db/schema'
import { customButtonSchema, customButtonsReorderSchema } from '../../../../../../src/lib/validations/button'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
  params: { tenantId: string }
}

// GET - List all custom buttons for a tenant
export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId

  const db = createClient(env.DB)

  // Check access (superadmin or tenant admin)
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  // Verify tenant exists
  const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1)
  if (!tenant || tenant.length === 0) {
    return new Response('Tenant not found', { status: 404 })
  }

  const buttons = await db
    .select()
    .from(tenantCustomButtons)
    .where(eq(tenantCustomButtons.tenantId, tenantId))
    .orderBy(tenantCustomButtons.displayOrder)

  return Response.json({ buttons })
}

// POST - Create new custom button
export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  // Verify tenant exists
  const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1)
  if (!tenant || tenant.length === 0) {
    return new Response('Tenant not found', { status: 404 })
  }

  try {
    const body = await request.json()

    // Validate input
    const validationResult = customButtonSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const data = validationResult.data

    // Get current max display order
    const existingButtons = await db
      .select()
      .from(tenantCustomButtons)
      .where(eq(tenantCustomButtons.tenantId, tenantId))

    const maxOrder = existingButtons.length > 0
      ? Math.max(...existingButtons.map(b => b.displayOrder || 0))
      : -1

    const newButton = await db
      .insert(tenantCustomButtons)
      .values({
        id: crypto.randomUUID(),
        tenantId,
        label: data.label,
        url: data.url,
        iconName: data.iconName,
        iconSvg: data.iconSvg,
        buttonVariant: data.buttonVariant,
        buttonSize: data.buttonSize,
        isEnabled: data.isEnabled ?? true,
        displayOrder: data.displayOrder ?? (maxOrder + 1),
      })
      .returning()

    // Log action
    await logAuditAction(db, user.id, tenantId, 'custom_button_created', { buttonId: newButton[0].id })

    return Response.json({ button: newButton[0] }, { status: 201 })
  } catch (error) {
    console.error('Create custom button error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Reorder custom buttons
export async function onRequestPut(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()

    // Validate input
    const validationResult = customButtonsReorderSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const { buttons } = validationResult.data

    // Update display orders
    for (const item of buttons) {
      await db
        .update(tenantCustomButtons)
        .set({ displayOrder: item.displayOrder })
        .where(and(
          eq(tenantCustomButtons.id, item.id),
          eq(tenantCustomButtons.tenantId, tenantId)
        ))
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Reorder custom buttons error:', error)
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
