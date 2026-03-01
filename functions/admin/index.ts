import { createClient } from '../../src/db'
import { tenants } from '../../src/db/schema'

interface Env {
  DB: any
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  // Only superadmin can access global admin
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  const db = createClient(env.DB)

  // Fetch all tenants
  const allTenants = await db.select().from(tenants).orderBy(tenants.createdAt)

  // Inject admin data into HTML
  const adminData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tenants: allTenants,
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard - clin.ro</title>
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
