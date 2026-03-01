import { createClient } from '../../../../src/db'
import { eq, desc } from 'drizzle-orm'
import { auditLogs, adminUsers } from '../../../../src/db/schema'

interface Env {
  DB: any
}

interface Context {
  request: Request
  env: Env
}

// GET - List audit logs
export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  // Only superadmin can view audit logs
  if (user.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100)
    const offset = (page - 1) * limit

    const userId = url.searchParams.get('userId')
    const tenantId = url.searchParams.get('tenantId')
    const action = url.searchParams.get('action')

    const db = createClient(env.DB)

    // Fetch all logs first, then filter (simplified for D1)
    let allLogs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))

    // Apply filters in-memory (D1 has limited complex query support)
    if (userId) {
      allLogs = allLogs.filter(log => log.userId === userId)
    }
    if (tenantId) {
      allLogs = allLogs.filter(log => log.tenantId === tenantId)
    }
    if (action) {
      allLogs = allLogs.filter(log => log.action === action)
    }

    // Get total count
    const total = allLogs.length

    // Paginate
    const logs = allLogs.slice(offset, offset + limit)

    // Fetch user details for each log
    const logsWithUsers = await Promise.all(
      logs.map(async (log) => {
        let userDetails: { email: string; name: string | null } | null = null
        if (log.userId) {
          const userResult = await db
            .select({ email: adminUsers.email, name: adminUsers.name })
            .from(adminUsers)
            .where(eq(adminUsers.id, log.userId))
            .limit(1)

          userDetails = userResult[0] || null
        }

        return {
          ...log,
          user: userDetails,
        }
      })
    )

    return Response.json({
      logs: logsWithUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get audit logs error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
