import { clearSessionCookie } from '../../../src/lib/auth'

export async function onRequestPost(): Promise<Response> {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
    },
  })
}
