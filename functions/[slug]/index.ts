import { createClient } from '../../src/db'
import { eq } from 'drizzle-orm'
import { tenants, tenantThemes, tenantSocialLinks, tenantCustomButtons } from '../../src/db/schema'

interface Env {
  DB: any
}

interface RequestContext {
  request: Request
  params: { slug: string }
  env: Env
}

export async function onRequest(context: RequestContext): Promise<Response> {
  const { request, env, params } = context
  const slug = params.slug

  const db = createClient(env.DB)

  try {
    // Fetch tenant configuration
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

    // Check if tenant is active
    if (!tenant.isActive) {
      return new Response('Tenant not found', { status: 404 })
    }

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

    // Inject tenant data into HTML
    const tenantData = {
      tenant: {
        ...tenant,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      theme: theme || {
        id: '',
        tenantId: tenant.id,
        backgroundColor: '0 0 0',
        foregroundColor: '255 255 255',
        primaryColor: '220 38 38',
        secondaryColor: '39 39 42',
        accentColor: '220 38 38',
        mutedColor: '39 39 42',
        borderColor: '39 39 42',
        cardColor: '24 24 24',
        radius: '0.625rem',
      },
      socialLinks,
      customButtons,
    }

    // Read the index.html file
    const indexHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${tenant.name}</title>
          <script type="module" src="/src/main.tsx"></script>
          <script id="__TENANT_DATA__" type="application/json">
            ${JSON.stringify(tenantData)}
          </script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `

    return new Response(indexHtml, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error('Error loading tenant:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
