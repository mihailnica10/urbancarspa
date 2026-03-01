/**
 * Generate seed SQL for clin-ro database
 * Run with: node scripts/seed.js
 */

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'clin-ro-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function generateSeed() {
  const passwordHash = await hashPassword('admin123')

  const sql = `
-- =====================================================
-- SEED DATA FOR clin-ro
-- =====================================================
-- Default credentials:
-- Email: admin@clin.ro
-- Password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)
-- =====================================================

-- Insert default superadmin user
INSERT OR REPLACE INTO admin_users (
  id,
  email,
  password_hash,
  name,
  role
) VALUES (
  'admin-001',
  'admin@clin.ro',
  '${passwordHash}',
  'Super Admin',
  'superadmin'
);

-- Insert urbancarspa tenant
INSERT OR REPLACE INTO tenants (
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
INSERT OR REPLACE INTO tenant_themes (
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
  '0 0 0',
  '255 255 255',
  '220 38 38',
  '39 39 42',
  '220 38 38',
  '39 39 42',
  '39 39 42',
  '24 24 24',
  '0.625rem'
);

-- Insert social media links for urbancarspa
INSERT OR REPLACE INTO tenant_social_links (id, tenant_id, platform, url, display_name, is_enabled, display_order) VALUES
  ('social-001', 'tenant-001', 'instagram', 'https://instagram.com', 'Instagram', 1, 1),
  ('social-002', 'tenant-001', 'facebook', 'https://facebook.com', 'Facebook', 1, 2),
  ('social-003', 'tenant-001', 'tiktok', 'https://tiktok.com', 'TikTok', 1, 3);

-- Insert custom button for appointments
INSERT OR REPLACE INTO tenant_custom_buttons (
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

  return sql
}

generateSeed().then(sql => {
  console.log(sql)
  console.log('\n--- Copy the SQL above and save to drizzle/0000_seed.sql ---')
})
