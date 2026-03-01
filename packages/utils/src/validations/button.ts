/**
 * Zod validation schemas for custom button operations
 */

import { z } from 'zod'

// Icon name validation for Lucide icons
// Lucide icon names are lowercase with hyphens, letters only
const iconNameRegex = /^[a-z][a-z0-9-]*[a-z0-9]$|^[a-z]$/

// SVG validation
const svgRegex = /<svg[\s\S]*<\/svg>|<svg[^>]*\/>/i

export const customButtonSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(50, 'Label must not exceed 50 characters'),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Invalid URL format')
    .refine((url) => {
      // Prevent javascript: and other dangerous protocols
      const lowerUrl = url.toLowerCase()
      return !lowerUrl.startsWith('javascript:') &&
             !lowerUrl.startsWith('data:') &&
             !lowerUrl.startsWith('vbscript:')
    }, 'URL protocol not allowed'),
  iconName: z
    .string()
    .regex(iconNameRegex, 'Invalid icon name format')
    .optional(),
  iconSvg: z
    .string()
    .refine((val) => !val || svgRegex.test(val), 'Invalid SVG format')
    .optional(),
  buttonVariant: z
    .enum(['default', 'outline', 'ghost', 'secondary'])
    .default('default'),
  buttonSize: z
    .enum(['sm', 'default', 'lg'])
    .default('default'),
  isEnabled: z
    .boolean()
    .default(true),
  displayOrder: z
    .number()
    .int()
    .min(0, 'Display order must be non-negative')
    .default(0),
}).refine(
  (data) => {
    // Either iconName or iconSvg should be provided, or neither (use default icon)
    return !data.iconName || !data.iconSvg
  },
  {
    message: 'Provide either iconName or iconSvg, not both',
    path: ['iconName'],
  }
)

export const customButtonUpdateSchema = z.object({
  id: z
    .string()
    .min(1, 'Button ID is required'),
  label: z.string().min(1, 'Label is required').optional(),
  url: z.string().min(1, 'URL is required').url('Invalid URL format').optional(),
  iconName: z.string().regex(iconNameRegex, 'Invalid icon name format').optional(),
  iconSvg: z.string().refine((val) => !val || svgRegex.test(val), 'Invalid SVG format').optional(),
  buttonVariant: z.enum(['default', 'outline', 'ghost', 'secondary']).optional(),
  buttonSize: z.enum(['sm', 'default', 'lg']).optional(),
  isEnabled: z.boolean().optional(),
  displayOrder: z.number().int().min(0, 'Display order must be non-negative').optional(),
})

export const customButtonsReorderSchema = z.object({
  buttons: z
    .array(z.object({
      id: z.string().min(1, 'ID is required'),
      displayOrder: z.number().int().min(0),
    }))
    .min(1, 'At least one button is required')
})

export type CustomButtonInput = z.infer<typeof customButtonSchema>
export type CustomButtonUpdateInput = z.infer<typeof customButtonUpdateSchema>
export type CustomButtonsReorderInput = z.infer<typeof customButtonsReorderSchema>
