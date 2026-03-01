/**
 * Serve assets from R2 storage
 * This allows public access to uploaded files via the worker
 */
interface Env {
  R2_ASSETS: any
}

export async function onRequest(context: {
  request: Request
  env: Env
  params: { key: string }
}): Promise<Response> {
  const { env, params } = context
  const key = params.key

  const object = await env.R2_ASSETS.get(key)

  if (!object) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year

  return new Response(object.body, { headers })
}
