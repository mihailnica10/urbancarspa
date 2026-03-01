/**
 * SVG sanitization utilities to prevent XSS attacks
 * Uses DOMPurify for safe HTML/SVG rendering
 */

import DOMPurify from 'dompurify'

// Configure DOMPurify for SVG content
const purify = DOMPurify

// Add hook to allow only safe SVG elements and attributes
purify.addHook('uponSanitizeAttribute', (_node, data) => {
  // Allow data-* attributes
  if (data.attrName?.startsWith('data-')) {
    data.keepAttr = true
  }

  // Allow specific SVG attributes
  const allowedSvgAttrs = [
    'viewBox',
    'width',
    'height',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-opacity',
    'stroke-miterlimit',
    'opacity',
    'color',
    'class',
    'xmlns',
    'd',
    'cx',
    'cy',
    'r',
    'rx',
    'ry',
    'x',
    'y',
    'x1',
    'y1',
    'x2',
    'y2',
    'path',
    'transform',
    'points',
    'preserveAspectRatio',
  ]

  if (allowedSvgAttrs.includes(data.attrName || '')) {
    data.keepAttr = true
  }
})

// Sanitize SVG content
export function sanitizeSvg(svg: string | null | undefined): string | null {
  if (!svg) return null

  const clean = purify.sanitize(svg, {
    // Allow only safe SVG elements
    ALLOWED_TAGS: [
      'svg',
      'path',
      'circle',
      'rect',
      'ellipse',
      'line',
      'polygon',
      'polyline',
      'g',
      'text',
      'tspan',
      'defs',
      'use',
      'linearGradient',
      'radialGradient',
      'stop',
      'clipPath',
      'mask',
    ],
    // Disallow dangerous elements
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    // Disallow dangerous attributes
    FORBID_ATTR: [
      'onload',
      'onerror',
      'onclick',
      'onmouseover',
      'onfocus',
      'onblur',
      'xlink:href',
      'href',
      'style', // Inline styles can be dangerous
    ],
    // Allow namespaces
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Return safe string
    RETURN_TRUSTED_TYPE: false,
  })

  return clean || null
}

// Sanitize HTML content (for descriptions, etc.)
export function sanitizeHtml(html: string | null | undefined): string | null {
  if (!html) return null

  return purify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'style'],
    ALLOW_DATA_ATTR: false,
  })
}

// Validate SVG format (basic check before sanitization)
export function isValidSvg(svg: string): boolean {
  return /<svg[\s\S]*<\/svg>|<svg[^>]*\/>/i.test(svg)
}

// Sanitize and validate SVG
export function safeSvg(svg: string | null | undefined): string | null {
  if (!svg) return null

  // Quick format check
  if (!isValidSvg(svg)) {
    return null
  }

  return sanitizeSvg(svg)
}
