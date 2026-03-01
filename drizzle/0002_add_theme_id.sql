-- Migration: Add theme_id column to tenants table
-- This allows each tenant to select their preferred theme

-- Add theme_id column to tenants table
ALTER TABLE tenants ADD COLUMN theme_id TEXT DEFAULT 'editorial-brutalist';

-- Update existing tenant to have default theme
UPDATE tenants SET theme_id = 'editorial-brutalist' WHERE theme_id IS NULL;
