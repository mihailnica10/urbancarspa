/**
 * Seed script for clin-ro database
 *
 * This script populates the database with:
 * 1. Default superadmin user
 * 2. urbancarspa tenant with default black/red theme
 * 3. Social media links for urbancarspa
 *
 * Usage:
 *   wrangler d1 execute clin-ro-db --local --file=./drizzle/0000_seed.sql
 *   wrangler d1 execute clin-ro-db --remote --file=./drizzle/0000_seed.sql
 */

import { hashPassword } from '../src/lib/auth'

// SQL seed script
export const seedSQL = `
-- =====================================================
-- SEED DATA FOR clin-ro
-- =====================================================

-- Insert default superadmin user
-- Email: admin@clin.ro
-- Password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)
INSERT INTO admin_users (
  id,
  email,
  password_hash,
  name,
  role
) VALUES (
  'admin-001',
  'admin@clin.ro',
  '${await hashPassword('admin123')}',
  'Super Admin',
  'superadmin'
);

-- Insert urbancarspa tenant
INSERT INTO tenants (
  id,
  slug,
  name,
  tagline,
  logo_svg,
  is_active
) VALUES (
  'tenant-001',
  'urbancarspa',
  'URBANCARSPA',
  'Premium Auto Detailing',
  '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 65 L20 35 L35 35 L35 30 Q35 20 45 20 L55 20 Q65 20 65 30 L65 65 L50 65 L50 40 L45 40 L45 65 L30 65 L30 40 L20 40 Z" stroke-linejoin="round"/>
    <circle cx="75" cy="45" r="8" />
  </svg>',
  1
);

-- Insert urbancarspa theme (black/red)
INSERT INTO tenant_themes (
  id,
  tenant_id,
  background_color,
  foreground_color,
  primary_color,
  secondary_color,
  accent_color,
  muted_color,
  border_color,
  card_color,
  radius
) VALUES (
  'theme-001',
  'tenant-001',
  '0 0 0',           -- black background
  '255 255 255',      -- white foreground
  '220 38 38',        -- red primary
  '39 39 42',         -- dark gray secondary
  '220 38 38',        -- red accent
  '39 39 42',         -- dark gray muted
  '39 39 42',         -- dark gray border
  '24 24 24',         -- darker card
  '0.625rem'          -- border radius
);

-- Insert social media links for urbancarspa
INSERT INTO tenant_social_links (id, tenant_id, platform, url, display_name, is_enabled, display_order) VALUES
  ('social-001', 'tenant-001', 'instagram', 'https://instagram.com/urbancarspa', 'Instagram', 1, 1),
  ('social-002', 'tenant-001', 'facebook', 'https://facebook.com/urbancarspa', 'Facebook', 1, 2),
  ('social-003', 'tenant-001', 'tiktok', 'https://tiktok.com/@urbancarspa', 'TikTok', 1, 3);

-- Insert custom button for appointments (example)
INSERT INTO tenant_custom_buttons (
  id,
  tenant_id,
  label,
  url,
  icon_name,
  button_variant,
  button_size,
  is_enabled,
  display_order
) VALUES (
  'button-001',
  'tenant-001',
  'Book Appointment',
  'https://calendly.com/urbancarspa',
  'calendar',
  'default',
  'default',
  1,
  0
);

-- =====================================================
-- END SEED DATA
-- =====================================================
`

// Write to file
if (typeof Deno !== 'undefined') {
  await Deno.writeTextFile('./drizzle/0000_seed.sql', seedSQL)
  console.log('Seed SQL written to ./drizzle/0000_seed.sql')
}
