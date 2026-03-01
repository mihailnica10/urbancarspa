import { detectLocale } from '@/i18n/config'
import type { APIRoute } from 'astro'

// Redirect root to locale-prefixed path
export const GET: APIRoute = ({ request, redirect }) => {
  const url = new URL(request.url)
  const locale = detectLocale(url, request.headers, Object.fromEntries(request.headers))

  // Redirect to /{locale}
  return redirect(`/${locale}/`, 302)
}
