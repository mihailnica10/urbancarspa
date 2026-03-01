/**
 * Upload endpoint for tenant assets (logos, images, etc.)
 * Uploads to R2 storage
 */

// Inline R2 utility functions
function generateTenantKey(tenantId: string, type: string, filename: string): string {
  const ext = filename.split('.').pop()
  const timestamp = Date.now()
  return `tenants/${tenantId}/${type}/${timestamp}.${ext}`
}

function getAssetUrl(key: string): string {
  return `/api/assets/${key}`
}

interface Env {
  DB: any
  ASSETS: any
}

export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context
  const user = (request as any).user

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tenantId = formData.get('tenantId') as string
    const type = formData.get('type') as string || 'logo' // logo, icon, image, etc.

    if (!file || !tenantId) {
      return Response.json({ error: 'File and tenantId are required' }, { status: 400 })
    }

    // Check if user has access to this tenant
    if (user.role !== 'superadmin' && user.tenantId !== tenantId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate R2 key
    const key = generateTenantKey(tenantId, type, file.name)

    // Upload to R2
    await env.ASSETS.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Return the public URL
    const url = getAssetUrl(key)

    return Response.json({
      success: true,
      url,
      key,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
