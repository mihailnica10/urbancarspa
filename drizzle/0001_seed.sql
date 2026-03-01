-- =====================================================
-- SEED DATA FOR clin.ro
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
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
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
