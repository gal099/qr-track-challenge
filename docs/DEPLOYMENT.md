# QR Track Deployment Guide

This guide provides step-by-step instructions for deploying QR Track to Vercel.

## Prerequisites

Before you begin, ensure you have:

- [ ] A GitHub account with your code pushed to a repository
- [ ] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Node.js 18.17.0+ installed locally (for running migrations)
- [ ] Vercel CLI installed (`npm i -g vercel`)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Log in to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Vercel will auto-detect the Next.js framework

### 3. Create Vercel Postgres Database

1. In your project dashboard, click the **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Configure your database:
   - **Name:** `qr-track-db` (or your preference)
   - **Region:** Choose the region closest to your users
5. Click **"Create"**

Vercel automatically adds these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 4. Configure Additional Environment Variables

Go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_BASE_URL` | `https://your-project.vercel.app` | Production |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Development |

> **Important:** Replace `your-project.vercel.app` with your actual Vercel URL or custom domain.

### 5. Run Database Migrations

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link your local project to Vercel
vercel link

# Pull environment variables to local .env.local
vercel env pull .env.local

# Run the migration script
npm run db:migrate
```

#### Option B: Using Vercel Dashboard

1. Go to your Vercel project → **Storage** → Your database
2. Click the **"Query"** tab
3. Copy the contents of `db/schema.sql`
4. Paste into the query editor and click **"Run"**

### 6. Deploy

#### Automatic Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git push origin main
```

#### Manual Deployment

```bash
vercel --prod
```

### 7. Verify Deployment

After deployment completes:

1. **Test Homepage:** Visit your production URL
2. **Generate QR Code:** Create a test QR code
3. **Test Redirect:** Scan the QR code or visit the short URL
4. **Check Analytics:** View the analytics dashboard

## Custom Domain Setup

### Add a Custom Domain

1. Go to **Settings** → **Domains**
2. Enter your domain name
3. Click **"Add"**

### Configure DNS

Add these DNS records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### Update Environment Variable

After adding a custom domain, update `NEXT_PUBLIC_BASE_URL`:

1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_BASE_URL` to your custom domain
3. Redeploy for changes to take effect

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_URL` | Yes | Database connection string (auto-set by Vercel) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Your application's public URL |
| `POSTGRES_PRISMA_URL` | No | Pooled connection for Prisma (auto-set) |
| `POSTGRES_URL_NON_POOLING` | No | Direct connection for migrations (auto-set) |

## Security Checklist

- [ ] `NEXT_PUBLIC_BASE_URL` is set to HTTPS URL
- [ ] Database credentials are not exposed in client code
- [ ] No `.env` files are committed to repository
- [ ] Vercel Postgres uses SSL by default

## Troubleshooting

### Common Issues

#### QR Codes Show Wrong URL

**Problem:** Generated QR codes point to `localhost` or wrong domain.

**Solution:**
1. Check `NEXT_PUBLIC_BASE_URL` in Vercel environment variables
2. Ensure it matches your production URL exactly
3. Redeploy after changing environment variables

#### Database Connection Errors

**Problem:** "Failed to connect to database" or similar errors.

**Solution:**
1. Verify Postgres is linked to your project in Vercel dashboard
2. Check that all `POSTGRES_*` variables are set
3. Try restarting the database from Vercel dashboard

#### 404 on Redirect URLs

**Problem:** Short URLs return 404 errors.

**Solution:**
1. Verify database migrations ran successfully
2. Check that `qr_codes` table exists in your database
3. Ensure the QR code record was created successfully

#### Scans Not Being Tracked

**Problem:** Analytics shows 0 scans despite scanning QR codes.

**Solution:**
1. Check browser console for API errors
2. Verify the `scans` table exists in database
3. Check Vercel function logs for errors

### Checking Logs

1. Go to your Vercel project dashboard
2. Click **"Deployments"** → Select latest deployment
3. Click **"Functions"** tab
4. View logs for each function

## Rollback

If something goes wrong, rollback to a previous deployment:

1. Go to **Deployments** tab
2. Find a working deployment
3. Click the **"..."** menu
4. Select **"Promote to Production"**

## Performance Optimization

### Enable Analytics

Vercel provides built-in analytics:

1. Go to **Settings** → **Analytics**
2. Enable **Web Analytics**
3. Enable **Speed Insights** for performance monitoring

### Edge Configuration

The `vercel.json` file configures:
- Security headers (X-Frame-Options, CSP, etc.)
- API caching policies
- Regional deployment

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review [Next.js deployment docs](https://nextjs.org/docs/deployment)
3. Open an issue in the project repository
