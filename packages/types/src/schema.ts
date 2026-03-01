// Database schema types extracted from Drizzle ORM
// This package provides TypeScript types without runtime dependencies

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

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[keyof typeof SOCIAL_PLATFORMS]

// Button variants
export const BUTTON_VARIANTS = ['default', 'outline', 'ghost', 'secondary'] as const
export const BUTTON_SIZES = ['sm', 'default', 'lg'] as const

// Theme IDs for multi-theme system
export const THEME_IDS = [
  'editorial-brutalist',
  'retro-terminal',
  'soft-luxury',
  'vaporwave',
  'swiss-minimalist',
  'dark-cyberpunk',
] as const

export type ThemeId = (typeof THEME_IDS)[number]

// Database table types
export interface Tenant {
  id: string
  slug: string
  name: string
  tagline: string | null
  logoSvg: string | null
  logoUrl: string | null
  metaTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  createdAt: string
  updatedAt: string
  isActive: boolean
  themeId: ThemeId // NEW: Theme selection
}

export interface NewTenant {
  id: string
  slug: string
  name: string
  tagline?: string | null
  logoSvg?: string | null
  logoUrl?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: string | null
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
  themeId?: ThemeId
}

export interface TenantTheme {
  id: string
  tenantId: string
  backgroundColor: string
  foregroundColor: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  mutedColor: string
  borderColor: string
  cardColor: string
  radius: string
}

export interface NewTenantTheme {
  id: string
  tenantId: string
  backgroundColor?: string
  foregroundColor?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  mutedColor?: string
  borderColor?: string
  cardColor?: string
  radius?: string
}

export interface TenantSocialLink {
  id: string
  tenantId: string
  platform: SocialPlatform
  url: string
  displayName: string | null
  iconSvg: string | null
  isEnabled: boolean
  displayOrder: number
}

export interface NewTenantSocialLink {
  id: string
  tenantId: string
  platform: SocialPlatform
  url: string
  displayName?: string | null
  iconSvg?: string | null
  isEnabled?: boolean
  displayOrder?: number
}

export interface TenantCustomButton {
  id: string
  tenantId: string
  label: string
  url: string
  iconName: string | null
  iconSvg: string | null
  buttonVariant: 'default' | 'outline' | 'ghost' | 'secondary'
  buttonSize: 'sm' | 'default' | 'lg'
  isEnabled: boolean
  displayOrder: number
}

export interface NewTenantCustomButton {
  id: string
  tenantId: string
  label: string
  url: string
  iconName?: string | null
  iconSvg?: string | null
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary'
  buttonSize?: 'sm' | 'default' | 'lg'
  isEnabled?: boolean
  displayOrder?: number
}

export interface AdminUser {
  id: string
  email: string
  passwordHash: string
  name: string | null
  role: 'superadmin' | 'tenant_admin'
  tenantId: string | null
  createdAt: string
  lastLogin: string | null
}

export interface NewAdminUser {
  id: string
  email: string
  passwordHash: string
  name?: string | null
  role: 'superadmin' | 'tenant_admin'
  tenantId?: string | null
  createdAt?: string
  lastLogin?: string | null
}

export interface AdminSession {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

export interface NewAdminSession {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt?: string
}

export interface AuditLog {
  id: string
  userId: string | null
  tenantId: string | null
  action: string
  details: string | null
  ipAddress: string | null
  createdAt: string
}

export interface LoginAttempt {
  id: string
  identifier: string
  ipAddress: string
  success: boolean
  attemptsCount: number
  lockoutUntil: string | null
  createdAt: string
}

// API Response types
export interface TenantWithData extends Tenant {
  theme?: TenantTheme
  socialLinks?: TenantSocialLink[]
  customButtons?: TenantCustomButton[]
}

export interface AdminData {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
  tenants?: Tenant[]
  tenant?: TenantWithData
}

export interface InjectedTenantData {
  tenant: Tenant
  theme: TenantTheme
  socialLinks: TenantSocialLink[]
  customButtons: TenantCustomButton[]
}

// Theme system types
export interface ThemeFonts {
  display: { family: string; weights: number[]; url?: string }
  body: { family: string; weights: number[]; url?: string }
  mono: { family: string; weights: number[]; url?: string }
}

export interface ThemeColors {
  bg: string
  fg: string
  primary: string
  secondary: string
  accent: string
  muted: string
  border: string
  surface: string
}

export type ThemeMotionDuration = 'snappy' | 'smooth' | 'slow'
export type ThemeMotionEasing = 'mechanical' | 'bouncy' | 'linear'

export interface ThemeMotion {
  duration: ThemeMotionDuration
  easing: ThemeMotionEasing
}

export interface Theme {
  id: ThemeId
  name: string
  description: string
  fonts: ThemeFonts
  colors: ThemeColors
  spacing: { scale: number }
  radius: { sm: string; md: string; lg: string }
  shadows: boolean
  motifs: string[]
  motion: ThemeMotion
  styles: string // CSS to inject
}
