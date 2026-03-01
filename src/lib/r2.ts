import type { R2Bucket } from '@cloudflare/workers-types'

/**
 * Upload a file to R2 storage
 * @param bucket - R2 bucket binding
 * @param key - File key (e.g., "tenants/{tenantId}/logo.svg")
 * @param body - File content (string, ArrayBuffer, or ReadableStream)
 * @param contentType - MIME type
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  bucket: any,
  key: string,
  body: string | ArrayBuffer | ReadableStream,
  contentType: string = 'image/svg+xml'
): Promise<string> {
  await bucket.put(key, body, {
    httpMetadata: {
      contentType,
    },
  })

  // Return the public URL (you'll need to configure R2 public access or use a worker proxy)
  return `/api/assets/${key}`
}

/**
 * Delete a file from R2 storage
 * @param bucket - R2 bucket binding
 * @param key - File key to delete
 */
export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key)
}

/**
 * Get a file from R2 storage
 * @param bucket - R2 bucket binding
 * @param key - File key
 * @returns The file object or null if not found
 */
export async function getFromR2(
  bucket: any,
  key: string
): Promise<any> {
  return await bucket.get(key)
}

/**
 * Generate a tenant asset key
 * @param tenantId - Tenant ID
 * @param type - Asset type (logo, icon, etc.)
 * @param filename - Original filename
 * @returns R2 key path
 */
export function generateTenantKey(tenantId: string, type: string, filename: string): string {
  const ext = filename.split('.').pop()
  const timestamp = Date.now()
  return `tenants/${tenantId}/${type}/${timestamp}.${ext}`
}

/**
 * Generate a public asset URL for R2 files served via worker
 * @param key - R2 key
 * @returns Public URL path
 */
export function getAssetUrl(key: string): string {
  return `/api/assets/${key}`
}

/**
 * Check if a file exists in R2
 * @param bucket - R2 bucket binding
 * @param key - File key
 * @returns true if file exists
 */
export async function existsInR2(bucket: R2Bucket, key: string): Promise<boolean> {
  const object = await bucket.head(key)
  return object !== null
}
