/**
 * Cloudflare R2 storage utilities
 * For storing and retrieving assets (images, files, etc.)
 */

export interface R2UploadOptions {
  contentType: string
  customMetadata?: Record<string, string>
}

export interface R2UploadedFile {
  key: string
  url: string
  etag: string
}

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  file: File | ArrayBuffer | Uint8Array | string,
  options: R2UploadOptions
): Promise<R2UploadedFile> {
  let body: ReadableStream | ArrayBuffer | Uint8Array | string

  if (file instanceof File) {
    body = file.stream()
  } else {
    body = file
  }

  await bucket.put(key, body, {
    httpMetadata: {
      contentType: options.contentType,
    },
    customMetadata: options.customMetadata,
  })

  // Generate URL (assuming public bucket)
  const url = `https://r2.clins.ro/${key}` // Adjust based on your R2 domain

  return {
    key,
    url,
    etag: '', // R2 doesn't return etag in the same way as S3
  }
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key)
}

/**
 * Get a file from R2
 */
export async function getFromR2(bucket: R2Bucket, key: string): Promise<R2Object | null> {
  return await bucket.get(key)
}

/**
 * List files in R2 with a prefix
 */
export async function listFromR2(
  bucket: R2Bucket,
  prefix?: string,
  limit = 100
): Promise<R2Objects> {
  return await bucket.list({ prefix, limit })
}

/**
 * Generate a unique key for uploaded files
 */
export function generateR2Key(
  userId: string,
  filename: string,
  timestamp = Date.now()
): string {
  const ext = filename.split('.').pop() || ''
  const baseName = filename.replace(/\.[^/.]+$/, '')
  const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `${userId}/${timestamp}-${slug}.${ext}`
}

/**
 * Get public URL for an R2 object
 */
export function getR2PublicUrl(key: string, customDomain?: string): string {
  const baseUrl = customDomain || 'https://r2.clins.ro'
  return `${baseUrl}/${key}`
}
