import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Tenants table: stores each tenant's core configuration
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  logoSvg: text('logo_svg'),
  logoUrl: text('logo_url'),
  // SEO fields
  metaTitle: text('meta_title'), // Custom page title (defaults to name if not set)
  metaDescription: text('meta_description'), // Meta description for SEO
  ogImage: text('og_image'), // Open Graph image URL
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  // Theme selection
  themeId: text('theme_id').default('editorial-brutalist'), // NEW: Theme preference
})

// Theme configurations: color palettes and styling
export const tenantThemes = sqliteTable('tenant_themes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  backgroundColor: text('background_color').default('0 0 0'),
  foregroundColor: text('foreground_color').default('255 255 255'),
  primaryColor: text('primary_color').default('220 38 38'),
  secondaryColor: text('secondary_color').default('39 39 42'),
  accentColor: text('accent_color').default('220 38 38'),
  mutedColor: text('muted_color').default('39 39 42'),
  borderColor: text('border_color').default('39 39 42'),
  cardColor: text('card_color').default('24 24 24'),
  radius: text('radius').default('0.625rem'),
})

// Social media links for tenants
export const tenantSocialLinks = sqliteTable('tenant_social_links', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  displayName: text('display_name'),
  iconSvg: text('icon_svg'),
  isEnabled: integer('is_enabled', { mode: 'boolean' }).default(true),
  displayOrder: integer('display_order').default(0),
})

// Custom buttons (like "Appointments")
export const tenantCustomButtons = sqliteTable('tenant_custom_buttons', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  url: text('url').notNull(),
  iconName: text('icon_name'), // Lucide icon name
  iconSvg: text('icon_svg'), // Custom SVG upload
  buttonVariant: text('button_variant').default('default'), // 'default', 'outline', 'ghost', 'secondary'
  buttonSize: text('button_size').default('default'), // 'sm', 'default', 'lg'
  isEnabled: integer('is_enabled', { mode: 'boolean' }).default(true),
  displayOrder: integer('display_order').default(0),
})

// Admin users (both global superadmin and tenant admins)
export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role', { enum: ['superadmin', 'tenant_admin'] }).notNull(),
  tenantId: text('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  lastLogin: text('last_login'),
})

// Sessions for authentication
export const adminSessions = sqliteTable('admin_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// Audit log for admin actions
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => adminUsers.id),
  tenantId: text('tenant_id').references(() => tenants.id),
  action: text('action').notNull(),
  details: text('details'), // JSON string
  ipAddress: text('ip_address'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// Login attempt tracking for rate limiting
export const loginAttempts = sqliteTable('login_attempts', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(), // Email or IP address
  ipAddress: text('ip_address').notNull(),
  success: integer('success', { mode: 'boolean' }).notNull(),
  attemptsCount: integer('attempts_count').notNull().default(1),
  lockoutUntil: text('lockout_until'), // ISO timestamp if locked out
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// Social platform constants
export const SOCIAL_PLATFORMS = {
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  DISCORD: 'discord',
  THREADS: 'threads',
} as const

export type SocialPlatform = typeof SOCIAL_PLATFORMS[keyof typeof SOCIAL_PLATFORMS]

// Button variants
export const BUTTON_VARIANTS = ['default', 'outline', 'ghost', 'secondary'] as const
export const BUTTON_SIZES = ['sm', 'default', 'lg'] as const

// Type exports
export type Tenant = typeof tenants.$inferSelect
export type NewTenant = typeof tenants.$inferInsert
export type TenantTheme = typeof tenantThemes.$inferSelect
export type NewTenantTheme = typeof tenantThemes.$inferInsert
export type TenantSocialLink = typeof tenantSocialLinks.$inferSelect
export type NewTenantSocialLink = typeof tenantSocialLinks.$inferInsert
export type TenantCustomButton = typeof tenantCustomButtons.$inferSelect
export type NewTenantCustomButton = typeof tenantCustomButtons.$inferInsert
export type AdminUser = typeof adminUsers.$inferSelect
export type NewAdminUser = typeof adminUsers.$inferInsert
export type AdminSession = typeof adminSessions.$inferSelect
export type NewAdminSession = typeof adminSessions.$inferInsert
