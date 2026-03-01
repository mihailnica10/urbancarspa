# CLIN-RO Migration Guide

## Status: Turborepo Foundation Complete

The turborepo structure has been set up with all packages and apps. This document outlines the remaining steps to complete the migration.

---

## Completed Steps

✅ **Phase 1: Foundation**
- Created `turbo.json`, root `package.json` with Bun workspaces
- Created `packages/config` with shared TSConfig, ESLint, Prettier

✅ **Phase 2: Shared Packages**
- `packages/types` - Database schema types
- `packages/utils` - `cn()` utility, validation schemas
- `packages/api` - Database client, auth, rate-limit, R2, sanitize
- `packages/i18n` - Translation files and i18next configs
- `packages/ui` - Multi-theme system with 6 themes

✅ **Phase 3: Apps Structure**
- `apps/admin` - React admin dashboard with Vite
- `apps/web` - Astro landing/tenant pages

✅ **Phase 4: Database**
- Created migration `0002_add_theme_id.sql` to add theme selection

---

## Remaining Steps

### 1. Install Dependencies

```bash
bun install
```

### 2. Link Workspace Packages

The packages reference each other using `workspace:*`. Run:

```bash
bun install --force
```

### 3. Apply Database Migration

```bash
# Local
wrangler d1 migrations apply clin-ro-db --local

# Production
wrangler d1 migrations apply clin-ro-db --remote
```

### 4. Build and Test

```bash
# Build all packages
bun run turbo build

# Run dev servers
bun run turbo dev
```

### 5. Deploy

```bash
# Deploy admin (to admin.clin.ro)
cd apps/admin && bun run deploy

# Deploy web (to clin.ro)
cd apps/web && bun run deploy
```

---

## File Migration (Manual)

The following files from the original `src/` directory need to be migrated or referenced:

### From `src/db/schema.ts`
- ✅ Already migrated to `packages/types/src/schema.ts`
- ✅ Original updated with `theme_id` column

### From `src/components/admin/*`
- ✅ Migrated to `apps/admin/src/pages/`
- Dashboard → DashboardPage.tsx
- TenantEditor → TenantEditorPage.tsx
- Login → LoginPage.tsx

### From `src/components/landing/*`
- ✅ Migrated to `apps/web/src/pages/[locale]/index.astro`

### From `src/components/tenant/*`
- ✅ Migrated to `apps/web/src/pages/[locale]/[slug].astro`

### From `functions/*`
- Need to be migrated to `apps/web/functions/` for Cloudflare Pages deployment

---

## Old Directory Cleanup

Once everything is verified working:

```bash
# Backup old directories
mv src src_old
mv functions functions_old

# Or delete if confident
# rm -rf src functions
```

---

## DNS Configuration

After deployment, configure DNS:

| Domain | Target |
|--------|--------|
| admin.clin.ro | Cloudflare Workers (admin app) |
| clin.ro | Cloudflare Pages (web app) |
| *.clin.ro | Cloudflare Pages (tenant subdomains) |

---

## Theme System Usage

### For SaaS Landing Page (`/` or `/{locale}/`)
Themes auto-cycle every 15 seconds. Users can manually select a theme from the theme switcher.

### For Tenant Pages (`/{locale}/{slug}`)
Tenants select ONE theme from the admin panel. The theme is persisted in the database.

### Available Themes
1. **editorial-brutalist** - Magazine-inspired, raw typography
2. **retro-terminal** - 80s/90s computing, CRT effects
3. **soft-luxury** - Refined elegance, generous whitespace
4. **vaporwave** - Neon, gradients, retro-3D
5. **swiss-minimalist** - Strict grids, functional
6. **dark-cyberpunk** - High contrast neon, glitch effects
