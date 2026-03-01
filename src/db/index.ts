import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export function createClient(db: any) {
  return drizzle(db, { schema })
}

export type Database = ReturnType<typeof createClient>
export { schema }

/**
 * Get tenant by slug with all related data for SSR
 */
export async function getTenantBySlug(
  db: any,
  slug: string
) {
  const client = createClient(db)

  // Get tenant using ORM
  const tenants = await client.query.tenants.findMany({
    where: (tenants, { eq, and }) => and(eq(tenants.slug, slug), eq(tenants.isActive, true)),
    limit: 1,
  })

  if (!tenants || tenants.length === 0) {
    return null
  }

  const tenant = tenants[0]

  // Get theme
  const themes = await client.query.tenantThemes.findMany({
    where: (tenantThemes, { eq }) => eq(tenantThemes.tenantId, tenant.id),
    limit: 1,
  })

  const theme = themes[0] || {
    backgroundColor: '0 0 0',
    foregroundColor: '255 255 255',
    primaryColor: '220 38 38',
    secondaryColor: '39 39 42',
    accentColor: '220 38 38',
    mutedColor: '39 39 42',
    borderColor: '39 39 42',
    cardColor: '24 24 24',
    radius: '0.625rem',
  }

  // Get social links
  const socialLinks = await client.query.tenantSocialLinks.findMany({
    where: (tenantSocialLinks, { eq }) => eq(tenantSocialLinks.tenantId, tenant.id),
    orderBy: (tenantSocialLinks, { asc }) => [asc(tenantSocialLinks.displayOrder)],
  })

  // Get custom buttons
  const customButtons = await client.query.tenantCustomButtons.findMany({
    where: (tenantCustomButtons, { eq }) => eq(tenantCustomButtons.tenantId, tenant.id),
    orderBy: (tenantCustomButtons, { asc }) => [asc(tenantCustomButtons.displayOrder)],
  })

  return {
    tenant: {
      ...tenant,
      isActive: Boolean(tenant.isActive),
    },
    theme,
    socialLinks,
    customButtons,
  }
}

/**
 * Get all active tenants for sitemap generation
 */
export async function getAllTenants(db: any) {
  const client = createClient(db)

  const tenants = await client.query.tenants.findMany({
    where: (tenants, { eq }) => eq(tenants.isActive, true),
    orderBy: (tenants, { desc }) => [tenants.createdAt],
  })

  return tenants || []
}
