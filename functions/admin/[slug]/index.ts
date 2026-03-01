import { createClient } from '../../../src/db'
import { eq } from 'drizzle-orm'
import { tenants, tenantThemes, tenantSocialLinks, tenantCustomButtons } from '../../../src/db/schema'

interface Env {
  DB: any
}

export async function onRequest(context: {
  request: Request
  env: Env
  params: { slug: string }
}): Promise<Response> {
  const { request, env, params } = context
  const user = (request as any).user
  const slug = params.slug

  const db = createClient(env.DB)

  // Check if user has access to this tenant
  if (user.role !== 'superadmin' && user.tenantId !== slug) {
    return new Response('Forbidden', { status: 403 })
  }

  // Fetch tenant by slug
  const tenantResult = await db
    .select({
      tenant: tenants,
      theme: tenantThemes,
    })
    .from(tenants)
    .leftJoin(tenantThemes, eq(tenants.id, tenantThemes.tenantId))
    .where(eq(tenants.slug, slug))
    .limit(1)

  if (!tenantResult || tenantResult.length === 0) {
    return new Response('Tenant not found', { status: 404 })
  }

  const { tenant, theme } = tenantResult[0]

  // Fetch social links
  const socialLinks = await db
    .select()
    .from(tenantSocialLinks)
    .where(eq(tenantSocialLinks.tenantId, tenant.id))

  // Fetch custom buttons
  const customButtons = await db
    .select()
    .from(tenantCustomButtons)
    .where(eq(tenantCustomButtons.tenantId, tenant.id))

  // Inject admin data into HTML
  const adminData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tenant: {
      ...tenant,
      theme: theme || {},
      socialLinks,
      customButtons,
    },
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Edit ${tenant.name} - clin.ro Admin</title>
        <script type="module" src="/src/main.tsx"></script>
        <script id="__ADMIN_DATA__" type="application/json">
          ${JSON.stringify(adminData)}
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  })
}
