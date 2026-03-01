/**
 * Zod validation schemas for social link operations
 */

import { z } from 'zod'

export const socialLinkSchema = z.object({
  platform: z.enum([
    'instagram',
    'facebook',
    'tiktok',
    'youtube',
    'twitter',
    'linkedin',
    'whatsapp',
    'telegram',
    'discord',
    'threads',
  ]),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Invalid URL format')
    .refine((url) => {
      // Additional validation for known platforms
      try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname.toLowerCase()

        // Check if domain matches platform (basic validation)
        switch (urlObj.href.toLowerCase()) {
          case 'instagram':
            return domain.includes('instagram.com')
          case 'facebook':
            return domain.includes('facebook.com') || domain.includes('fb.com')
          case 'tiktok':
            return domain.includes('tiktok.com')
          case 'youtube':
            return domain.includes('youtube.com') || domain.includes('youtu.be')
          case 'twitter':
            return domain.includes('twitter.com') || domain.includes('x.com')
          case 'linkedin':
            return domain.includes('linkedin.com')
          case 'whatsapp':
            return domain.includes('wa.me') || domain.includes('whatsapp.com')
          case 'telegram':
            return domain.includes('t.me') || domain.includes('telegram.com')
          case 'discord':
            return domain.includes('discord.com') || domain.includes('discord.gg')
          case 'threads':
            return domain.includes('threads.net')
          default:
            return true
        }
      } catch {
        return false
      }
    }, 'URL does not appear to match the selected platform'),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must not exceed 50 characters'),
  iconSvg: z
    .string()
    .refine((val) => !val || /<svg[\s\S]*<\/svg>|<svg[^>]*\/>/i.test(val), 'Invalid SVG format')
    .optional(),
  isEnabled: z
    .boolean()
    .default(true),
  displayOrder: z
    .number()
    .int()
    .min(0, 'Display order must be non-negative')
    .default(0),
})

export const socialLinkUpdateSchema = socialLinkSchema.partial().extend({
  id: z
    .string()
    .min(1, 'Social link ID is required'),
})

export const socialLinksReorderSchema = z.object({
  links: z
    .array(z.object({
      id: z.string().min(1, 'ID is required'),
      displayOrder: z.number().int().min(0),
    }))
    .min(1, 'At least one link is required')
})

export type SocialLinkInput = z.infer<typeof socialLinkSchema>
export type SocialLinkUpdateInput = z.infer<typeof socialLinkUpdateSchema>
export type SocialLinksReorderInput = z.infer<typeof socialLinksReorderSchema>
