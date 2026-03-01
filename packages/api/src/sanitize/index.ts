/**
 * Content sanitization utilities
 * Uses DOMPurify for XSS protection
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Note: DOMPurify must be available in the environment
 * For Cloudflare Workers, use a lightweight alternative or server-side sanitization
 */

/**
 * Basic HTML sanitization (for environments without DOMPurify)
 * Removes dangerous tags and attributes
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Remove data: protocol (except for images)
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '')

  // Remove style tags (can contain javascript)
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  return sanitized
}

/**
 * Sanitize a URL to prevent javascript: and other dangerous protocols
 */
export function sanitizeURL(url: string): string {
  if (!url) return ''

  try {
    const parsed = new URL(url)

    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'sms:']

    if (!allowedProtocols.includes(parsed.protocol)) {
      return ''
    }

    return url
  } catch {
    // Invalid URL
    return ''
  }
}

/**
 * Sanitize user input for display as plain text
 * Escapes HTML special characters
 */
export function escapeHTML(text: string): string {
  if (!text) return ''

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return text.replace(/[&<>"'/]/g, char => map[char]!)
}

/**
 * Strip all HTML tags from content
 */
export function stripHTML(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Clean and validate a slug
 */
export function cleanSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}
