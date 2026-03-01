/**
 * Zod validation schemas for tenant operations
 */

import { z } from 'zod'
import { SOCIAL_PLATFORMS, BUTTON_VARIANTS, BUTTON_SIZES } from '@/db/schema'

// Slug validation: lowercase alphanumeric, hyphens, no spaces
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// URL validation
const urlRegex = /^https?:\/\/.+/

// SVG validation (basic check for SVG content)
const svgRegex = /<svg[\s\S]*<\/svg>|<svg[^>]*\/>/i

export const tenantSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must not exceed 50 characters')
    .regex(slugRegex, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  tagline: z
    .string()
    .max(200, 'Tagline must not exceed 200 characters')
    .optional(),
  logoSvg: z
    .string()
    .refine((val) => !val || svgRegex.test(val), 'Invalid SVG format')
    .optional(),
  logoUrl: z
    .string()
    .url('Invalid URL')
    .optional(),
  isActive: z
    .boolean()
    .optional(),
})

export const tenantUpdateSchema = tenantSchema.partial().extend({
  id: z
    .string()
    .min(1, 'Tenant ID is required'),
})

export const tenantThemeSchema = z.object({
  backgroundColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format (use: "0 0 0")'),
  foregroundColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  primaryColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  secondaryColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  accentColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  mutedColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  borderColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  cardColor: z
    .string()
    .regex(/^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/, 'Invalid HSL format'),
  radius: z
    .string()
    .regex(/^\d+(\.\d+)?(rem|px|em|%|vh|vw)?$/, 'Invalid radius value'),
})

export const tenantSeoSchema = z.object({
  metaTitle: z
    .string()
    .min(10, 'Meta title must be at least 10 characters')
    .max(60, 'Meta title must not exceed 60 characters (SEO best practice)')
    .optional(),
  metaDescription: z
    .string()
    .min(50, 'Meta description must be at least 50 characters')
    .max(160, 'Meta description must not exceed 160 characters (SEO best practice)')
    .optional(),
  ogImage: z
    .string()
    .url('Invalid URL')
    .optional(),
})

export type TenantInput = z.infer<typeof tenantSchema>
export type TenantUpdateInput = z.infer<typeof tenantUpdateSchema>
export type TenantThemeInput = z.infer<typeof tenantThemeSchema>
export type TenantSeoInput = z.infer<typeof tenantSeoSchema>
