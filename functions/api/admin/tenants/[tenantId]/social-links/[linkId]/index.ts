import { createClient } from '../../../../../../../src/db'
import { eq, and } from 'drizzle-orm'
import { tenantSocialLinks, tenants, auditLogs } from '../../../../../../../src/db/schema'
import { socialLinkUpdateSchema } from '../../../../../../../src/lib/validations/social'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
  params: { tenantId: string; linkId: string }
}

// GET - Get single social link
export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const linkId = params.linkId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  const link = await db
    .select()
    .from(tenantSocialLinks)
    .where(and(
      eq(tenantSocialLinks.id, linkId),
      eq(tenantSocialLinks.tenantId, tenantId)
    ))
    .limit(1)

  if (!link || link.length === 0) {
    return new Response('Social link not found', { status: 404 })
  }

  return Response.json({ link: link[0] })
}

// PUT - Update social link
export async function onRequestPut(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const linkId = params.linkId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()

    // Validate input
    const validationResult = socialLinkUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return Response.json({
        error: 'Validation failed',
        details: validationResult.error.flatten()
      }, { status: 400 })
    }

    const data = validationResult.data

    const result = await db
      .update(tenantSocialLinks)
      .set({
        platform: data.platform,
        url: data.url,
        displayName: data.displayName,
        iconSvg: data.iconSvg,
        isEnabled: data.isEnabled,
        // displayOrder can be updated through reorder endpoint
      })
      .where(and(
        eq(tenantSocialLinks.id, linkId),
        eq(tenantSocialLinks.tenantId, tenantId)
      ))
      .returning()

    if (!result || result.length === 0) {
      return new Response('Social link not found', { status: 404 })
    }

    // Log action
    await logAuditAction(db, user.id, tenantId, 'social_link_updated', { linkId })

    return Response.json({ link: result[0] })
  } catch (error) {
    console.error('Update social link error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Toggle enabled/disabled
export async function onRequestPatch(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const linkId = params.linkId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const { isEnabled } = await request.json()

    const result = await db
      .update(tenantSocialLinks)
      .set({ isEnabled: isEnabled ?? false })
      .where(and(
        eq(tenantSocialLinks.id, linkId),
        eq(tenantSocialLinks.tenantId, tenantId)
      ))
      .returning()

    if (!result || result.length === 0) {
      return new Response('Social link not found', { status: 404 })
    }

    // Log action
    await logAuditAction(db, user.id, tenantId, 'social_link_toggled', { linkId, isEnabled })

    return Response.json({ link: result[0] })
  } catch (error) {
    console.error('Toggle social link error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete social link
export async function onRequestDelete(context: Context): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const tenantId = params.tenantId
  const linkId = params.linkId

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    await db
      .delete(tenantSocialLinks)
      .where(and(
        eq(tenantSocialLinks.id, linkId),
        eq(tenantSocialLinks.tenantId, tenantId)
      ))

    // Log action
    await logAuditAction(db, user.id, tenantId, 'social_link_deleted', { linkId })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Delete social link error:', error)
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
