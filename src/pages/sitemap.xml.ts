import type { APIRoute } from 'astro'

export async function GET(context: { site?: string | URL }) {
  const site = context.site ? new URL(context.site) : new URL('https://clin.ro')
  const baseUrl = site.href

  // Get all tenants from D1
  // For now, use static data as D1 may not be available at build time
  // In production, you'd fetch from the actual D1 database
  const tenants = [
    { slug: 'urbancarspa', updatedAt: new Date() },
  ]

  const locales = ['ro', 'en']

  // Build sitemap entries
  const entries = tenants.flatMap(tenant =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/${tenant.slug}`,
      lastmod: tenant.updatedAt,
      changefreq: 'weekly',
      alternates: locales.map(alt => ({
        hreflang: alt,
        href: `${baseUrl}/${alt}/${tenant.slug}`,
      })),
    }))
  )

  // Add main pages
  const mainPages = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastmod: new Date(),
    changefreq: 'daily',
    alternates: locales.map(alt => ({
      hreflang: alt,
      href: `${baseUrl}/${alt}`,
    })),
  }))

  const allEntries = [...mainPages, ...entries]

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod.toISOString()}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
${entry.alternates.map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`).join('\n')}
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
