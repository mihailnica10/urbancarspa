import { createClient } from '../../../../../../src/db'
import { eq, and } from 'drizzle-orm'
import { tenantSocialLinks, tenants, auditLogs } from '../../../../../../src/db/schema'
import { socialLinkSchema, socialLinksReorderSchema } from '../../../../../../src/lib/validations/social'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
  params: { tenantId: string }
}

// GET - List all social links for a tenant
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

  const links = await db
    .select()
    .from(tenantSocialLinks)
    .where(eq(tenantSocialLinks.tenantId, tenantId))
    .orderBy(tenantSocialLinks.displayOrder)

  return Response.json({ links })
}

// POST - Create new social link
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
    const validationResult = socialLinkSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const data = validationResult.data

    // Get current max display order
    const existingLinks = await db
      .select()
      .from(tenantSocialLinks)
      .where(eq(tenantSocialLinks.tenantId, tenantId))

    const maxOrder = existingLinks.length > 0
      ? Math.max(...existingLinks.map(l => l.displayOrder || 0))
      : -1

    const newLink = await db
      .insert(tenantSocialLinks)
      .values({
        id: crypto.randomUUID(),
        tenantId,
        platform: data.platform,
        url: data.url,
        displayName: data.displayName,
        iconSvg: data.iconSvg,
        isEnabled: data.isEnabled ?? true,
        displayOrder: data.displayOrder ?? (maxOrder + 1),
      })
      .returning()

    // Log action
    await logAuditAction(db, user.id, tenantId, 'social_link_created', { linkId: newLink[0].id })

    return Response.json({ link: newLink[0] }, { status: 201 })
  } catch (error) {
    console.error('Create social link error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Reorder social links
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
    const validationResult = socialLinksReorderSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const { links } = validationResult.data

    // Update display orders
    for (const item of links) {
      await db
        .update(tenantSocialLinks)
        .set({ displayOrder: item.displayOrder })
        .where(and(
          eq(tenantSocialLinks.id, item.id),
          eq(tenantSocialLinks.tenantId, tenantId)
        ))
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Reorder social links error:', error)
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
