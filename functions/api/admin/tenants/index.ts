import { createClient } from '../../../../src/db'
import { tenants } from '../../../../src/db/schema'

interface Env {
  DB: any
}

// GET - List all tenants
export async function onRequestGet(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  // Only superadmin can list tenants
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  const db = createClient(env.DB)
  const allTenants = await db.select().from(tenants).orderBy(tenants.createdAt)

  return Response.json({ tenants: allTenants })
}

// POST - Create new tenant
export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  // Only superadmin can create tenants
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const { slug, name, tagline, logoSvg, logoUrl } = await request.json()

    if (!slug || !name) {
      return Response.json({ error: 'Slug and name are required' }, { status: 400 })
    }

    const db = createClient(env.DB)

    // Check if slug already exists
    const existing = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1)
    if (existing && existing.length > 0) {
      return Response.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const newTenant = await db
      .insert(tenants)
      .values({
        id: crypto.randomUUID(),
        slug,
        name,
        tagline,
        logoSvg,
        logoUrl,
        isActive: true,
      })
      .returning()

    return Response.json({ tenant: newTenant[0] }, { status: 201 })
  } catch (error) {
    console.error('Create tenant error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { eq } from 'drizzle-orm'
