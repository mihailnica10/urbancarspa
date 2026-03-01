import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      environment: 'production',
    },
  }),
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  site: 'https://clin.ro',
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
