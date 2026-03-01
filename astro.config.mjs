import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://clin.ro',
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      i18n: {
        defaultLocale: 'ro',
        locales: ['ro', 'en']
      }
    })
  ],
  output: 'server',
  adapter: cloudflare({
    platformProxies: true,
    mode: 'directory'
  }),
  vite: {
    ssr: {
      external: ['@cloudflare/workers-types']
    }
  },
  // Prefetch all links for better UX
  prefetch: true,
  // Optimize build
  build: {
    inlineStylesheets: 'auto'
  }
})
