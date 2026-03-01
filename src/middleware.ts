/**
 * Astro middleware for language detection and routing
 */

import { defineMiddleware } from 'astro:middleware'
import { detectLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from './i18n/config'

// Paths that should skip language detection
const SKIP_LOCALE_PATHS = ['/api', '/admin', '/_next', '/.well-known', '/robots.txt', '/sitemap.xml']

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url)
  const pathname = url.pathname

  // Skip middleware for API routes, admin, static assets
  for (const skipPath of SKIP_LOCALE_PATHS) {
    if (pathname.startsWith(skipPath)) {
      return next()
    }
  }

  // Skip middleware for assets (images, fonts, etc.)
  if (pathname.includes('.')) {
    return next()
  }

  // Extract locale from path
  const pathSegments = pathname.split('/').filter(Boolean)
  const potentialLocale = pathSegments[0] as typeof SUPPORTED_LOCALES[number]

  // If no locale in path, detect and redirect
  if (!SUPPORTED_LOCALES.includes(potentialLocale)) {
    const locale = detectLocale(url, context.request.headers, Object.fromEntries(context.request.headers))

    // Build new URL with locale prefix
    const newPathname = locale + (pathname || '')

    return new Response(null, {
      status: 302,
      headers: {
        Location: newPathname,
        'Set-Cookie': `userLanguage=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`,
      },
    })
  }

  // Set locale in context for components to use
  context.locals.locale = potentialLocale

  // Continue to the page
  return next()
})
