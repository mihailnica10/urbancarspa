import { createClient } from '../../../../../src/db'
import { eq } from 'drizzle-orm'
import { tenants } from '../../../../../src/db/schema'

interface Env {
  DB: any
}

// GET - Get single tenant
export async function onRequestGet(context: {
  request: Request
  env: Env
  params: { id: string }
}): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const id = params.id

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== id) {
    return new Response('Forbidden', { status: 403 })
  }

  const result = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1)

  if (!result || result.length === 0) {
    return new Response('Tenant not found', { status: 404 })
  }

  return Response.json({ tenant: result[0] })
}

// PUT - Update tenant
export async function onRequestPut(context: {
  request: Request
  env: Env
  params: { id: string }
}): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const id = params.id

  const db = createClient(env.DB)

  // Check access
  if (user.role !== 'superadmin' && user.tenantId !== id) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const updates = await request.json()

    const result = await db
      .update(tenants)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tenants.id, id))
      .returning()

    if (!result || result.length === 0) {
      return new Response('Tenant not found', { status: 404 })
    }

    return Response.json({ tenant: result[0] })
  } catch (error) {
    console.error('Update tenant error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete tenant
export async function onRequestDelete(context: {
  request: Request
  env: Env
  params: { id: string }
}): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const id = params.id

  // Only superadmin can delete tenants
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  const db = createClient(env.DB)

  try {
    await db.delete(tenants).where(eq(tenants.id, id))

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Delete tenant error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
