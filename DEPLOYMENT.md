# CLIN-RO Deployment Guide

## Deployment Status

✅ **Project deployed**: https://clin-ro.pages.dev
✅ **D1 Database**: `clin-ro-db` (migrations + seed applied)
✅ **R2 Storage**: `clin-ro-assets` bucket created
✅ **KV Namespace**: `SESSION` for session storage
✅ **Secrets**: `SESSION_SECRET` and `CSRF_SECRET` configured

## Step 1: Configure Custom Domains

### Main Domain (clin.ro)

1. Go to **Cloudflare Dashboard** > **Pages** > **clin-ro**
2. Click **Custom domains** > **Set up a custom domain**
3. Enter: `clin.ro`
4. Click **Continue** and verify DNS records

### Admin Subdomain (admin.clin.ro)

1. In the same project, click **Add custom domain**
2. Enter: `admin.clin.ro`
3. Click **Continue** and verify DNS records

### DNS Records

Add these records in your DNS zone (clin.ro):

```
Type    Name    Target
A       @       (Cloudflare proxy)
CNAME   admin   clin-ro.pages.dev
CNAME   *       clin-ro.pages.dev
```

## Step 2: Environment Variables

The following are already configured via `wrangler.toml`:

```bash
ENVIRONMENT=production
APP_URL=https://clin.ro
ADMIN_URL=https://admin.clin.ro
SUPPORTED_LOCALES=["ro", "en"]
DEFAULT_LOCALE=ro
```

### Secrets (configured)

- `SESSION_SECRET`: Set via `wrangler pages secret put`
- `CSRF_SECRET`: Set via `wrangler pages secret put`

## Step 3: Database Management

### Run migrations
```bash
bun run db:migrate:remote
```

### Seed database
```bash
bun run db:seed:remote
```

### Reset database
```bash
bun run db:generate
bun run db:migrate:remote
bun run db:seed:remote
```

## Step 4: Deploy

### Full deployment
```bash
bun run deploy
```

### Quick deployment (without build)
```bash
bunx wrangler pages deploy dist --project-name=clin-ro
```

## Architecture

- **Framework**: Astro 5 with SSR
- **Runtime**: Cloudflare Pages with Functions
- **Database**: D1 (SQLite)
- **Storage**: R2 for assets
- **Sessions**: KV for session storage
- **i18n**: i18next (Romanian, English)
- **Package Manager**: Bun

## Features Implemented

- ✅ Multi-tenant landing pages
- ✅ Admin panel (React)
- ✅ Authentication with rate limiting
- ✅ Password hashing (PBKDF2-SHA256)
- ✅ XSS protection (DOMPurify)
- ✅ Input validation (Zod)
- ✅ Audit logging
- ✅ Social links CRUD
- ✅ Custom buttons CRUD
- ✅ User management
- ✅ SEO optimized (hreflang, sitemap)

## Default Credentials

The seed data creates a superadmin user:

- **Email**: `admin@clin.ro`
- **Password**: `Admin123!`

**Important**: Change this password after first login!

## Troubleshooting

### Build fails
```bash
rm -rf node_modules dist
bun install
bun run build
```

### Database issues
```bash
bunx wrangler d1 execute clin-ro-db --remote --command="SELECT * FROM tenants"
```

### Clear cache
```bash
bunx wrangler pages cache purge --project-name=clin-ro
```

## Monitoring

- **Dashboard**: https://dash.cloudflare.com/
- **Analytics**: Cloudflare Pages > clin-ro > Analytics
- **Logs**: `bunx wrangler pages deployment tail --project-name=clin-ro`
