declare namespace Astro {
  interface Locals {
    locale?: string
    runtime?: {
      env: {
        DB: D1Database
        SESSION: KVNamespace
        R2_ASSETS: R2Bucket
      }
    }
  }
}
