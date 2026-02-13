# Bug: Fix Supabase Database Connection Error in Production

## Metadata
issue_number: `10`
adw_id: `6d335ed1`
issue_json: `{"number":10,"title":"Database Connection Error in Production - Incompatible with Supabase","body":"## Bug Description\nProduction deployment is failing with database connection errors when trying to access API endpoints.\n\n## Error Message\n```\nVercelPostgresError - 'invalid_connection_string': This connection string is meant to...\n```\n\n## Root Cause\nThe codebase uses `@vercel/postgres` library which is only compatible with Vercel Postgres databases. However, the project uses Supabase Postgres, which requires a different connection library.\n\n## Affected Routes\n- `/api/analytics/[qrCodeId]`\n- `/api/qr/list`\n- All other API routes that use the database\n\n## Current Setup\n- Database: Supabase Postgres (already configured and migrated)\n- Environment variables: Correctly set in Vercel\n- Local development: Works fine\n- Production: Fails with connection error\n\n## Required Fix\nReplace `@vercel/postgres` with `postgres` (or similar library) that is compatible with standard Postgres connection strings, including Supabase.\n\n## Acceptance Criteria\n- [ ] Database connection library changed to Supabase-compatible option\n- [ ] All API routes work in production\n- [ ] QR code generation works\n- [ ] Analytics endpoints return data\n- [ ] Redirect route works\n- [ ] Tests pass\n- [ ] Production deployment successful\n\n## Steps to Reproduce\n1. Deploy to Vercel with Supabase credentials\n2. Try to access `https://qr-track-challenge.vercel.app/api/qr/list`\n3. Observe error in deployment logs\n\n## Production URL\nhttps://qr-track-challenge.vercel.app/"}`

## Bug Description
Production deployment is failing with a `VercelPostgresError - 'invalid_connection_string'` error when trying to access any API endpoint that interacts with the database. The application uses `@vercel/postgres` library which is designed exclusively for Vercel Postgres databases. However, the project uses Supabase Postgres as the database provider, which requires a standard PostgreSQL client library.

**Expected Behavior:** API endpoints should successfully connect to the Supabase Postgres database and return data.

**Actual Behavior:** All API endpoints that use the database fail with `VercelPostgresError - 'invalid_connection_string'` error in production. The error occurs because `@vercel/postgres` validates connection strings against Vercel-specific patterns and rejects standard Postgres connection strings (like Supabase's).

## Problem Statement
The `@vercel/postgres` library cannot connect to Supabase Postgres databases because it validates that the connection string matches Vercel's internal database format. This validation fails for any non-Vercel Postgres database, including Supabase.

## Solution Statement
Replace `@vercel/postgres` with the standard `pg` (node-postgres) library that is already installed in the project. The `pg` library works with any PostgreSQL-compatible database, including Supabase. The migration runner (`db/run-migrations.js`) already uses `pg` successfully, proving it works with the current Supabase setup.

Key changes:
1. Refactor `src/lib/db.ts` to use `pg` Pool instead of `@vercel/postgres` sql template
2. Use parameterized queries for SQL injection protection (same security as tagged templates)
3. Configure connection pooling for serverless environment optimization
4. Remove `@vercel/postgres` dependency from package.json

## Steps to Reproduce
1. Deploy the application to Vercel with Supabase credentials in `POSTGRES_URL`
2. Visit `https://qr-track-challenge.vercel.app/api/qr/list`
3. Observe the error: `VercelPostgresError - 'invalid_connection_string'`
4. Check Vercel deployment logs to see the full error stack trace

## Root Cause Analysis
The root cause is a library incompatibility:

1. **`@vercel/postgres` library limitations:** This library is a thin wrapper around `pg` that adds Vercel-specific connection string validation. It expects connection strings in Vercel's internal format and rejects standard PostgreSQL connection strings.

2. **Supabase connection string format:** Supabase provides standard PostgreSQL connection strings (e.g., `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`) which are valid for any PostgreSQL client but fail `@vercel/postgres` validation.

3. **Why local development works:** Local development may use different environment variables or the validation may be more lenient in certain configurations.

4. **The `pg` library already works:** The migration runner at `db/run-migrations.js` uses the `pg` library directly with `{ Client } = require('pg')` and connects successfully to Supabase, proving the solution is viable.

## Relevant Files
Use these files to fix the bug:

- **`src/lib/db.ts`** - The main database connection file. Currently imports `sql` from `@vercel/postgres`. Must be refactored to use `pg` Pool with parameterized queries. This is the only file that needs code changes.

- **`package.json`** - Contains dependency `@vercel/postgres: ^0.5.1` which needs to be removed. The `pg: ^8.18.0` dependency is already installed and will be used instead.

- **`db/run-migrations.js`** - Reference implementation showing how `pg` Client is used with Supabase. Use this as a pattern for the db.ts refactor (connection configuration, SSL settings).

- **`src/types/database.ts`** - Database type definitions. No changes needed but important for understanding return types.

- **`src/app/api/qr/generate/route.ts`** - API route that uses db functions. No changes needed but should be tested.

- **`src/app/api/qr/list/route.ts`** - API route that uses `getAllQRCodes`. No changes needed but should be tested.

- **`src/app/api/analytics/[qrCodeId]/route.ts`** - API route that uses `getQRCodeById` and `getQRCodeAnalytics`. No changes needed but should be tested.

- **`src/app/r/[shortCode]/route.ts`** - Redirect route that uses `getQRCodeByShortCode` and `createScan`. No changes needed but should be tested.

### New Files
No new files need to be created.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Refactor Database Connection Library
Replace `@vercel/postgres` with `pg` Pool in `src/lib/db.ts`:

- Replace `import { sql } from '@vercel/postgres'` with `import { Pool } from 'pg'`
- Create a Pool instance with configuration:
  ```typescript
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  })
  ```
- Refactor each function to use `pool.query()` with parameterized queries instead of tagged template literals
- Ensure all existing functions maintain the same signatures and return types:
  - `createQRCode(input)` - INSERT query with RETURNING *
  - `getQRCodeByShortCode(shortCode)` - SELECT query
  - `getQRCodeById(id)` - SELECT query
  - `shortCodeExists(shortCode)` - SELECT 1 query
  - `createScan(input)` - INSERT query with RETURNING *
  - `getAllQRCodes()` - SELECT with JOIN and aggregation
  - `getQRCodeAnalytics(qrCodeId)` - Multiple SELECT queries for analytics

### Step 2: Remove @vercel/postgres Dependency
Update `package.json` to remove the incompatible dependency:

- Run `npm uninstall @vercel/postgres` to remove the dependency
- Verify `pg` is still in dependencies (already present at `^8.18.0`)

### Step 3: Run Tests to Verify No Regressions
Execute the existing test suite to ensure the refactor maintains all functionality:

- Run `npm run test` to execute all Jest tests
- Tests mock the database module, so they should pass without database connection
- Verify all 165 tests pass (or current count)

### Step 4: Run TypeScript Type Check
Ensure the refactored code has no type errors:

- Run `npm run type-check` (or `npx tsc --noEmit`)
- Fix any type errors that arise from the refactor
- Ensure all database function return types match existing interfaces

### Step 5: Run Production Build
Verify the application builds successfully:

- Run `npm run build`
- Ensure no build errors occur
- Verify the build completes without warnings related to database

### Step 6: Test Database Connection Locally
Verify the refactored database layer works with a real database:

- Ensure `POSTGRES_URL` is set in `.env` or `.env.local`
- Run `npm run dev` to start the development server
- Test `http://localhost:3000/api/qr/list` endpoint
- Test QR code generation via the UI
- Test analytics page loads correctly

### Step 7: Run All Validation Commands
Execute the final validation to confirm the bug is fixed with zero regressions.

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `npm run test` - Run all Jest tests to verify no regressions (expect all tests to pass)
- `npm run type-check` - Verify TypeScript compiles without errors
- `npm run build` - Verify production build succeeds
- `npm run lint` - Verify no linting errors were introduced
- `npm run dev` and manually test:
  - Visit `http://localhost:3000` - Homepage loads
  - Generate a QR code - Should succeed and show QR code
  - Visit `http://localhost:3000/api/qr/list` - Should return JSON with `success: true`
  - Visit analytics page for generated QR code - Should display analytics

Post-deployment validation (after deploying to Vercel):
- Visit `https://qr-track-challenge.vercel.app/api/qr/list` - Should return JSON, not error
- Generate a QR code in production - Should succeed
- Test redirect URL - Should redirect and track scan
- Check analytics page - Should display data

## Notes

### Key Implementation Details

1. **Connection Pooling:** Use `Pool` instead of `Client` for serverless environments. Pool manages connection lifecycle automatically and is more efficient for serverless functions that may be called repeatedly.

2. **SSL Configuration:** Use `ssl: { rejectUnauthorized: false }` to work with Supabase's SSL certificates. This matches the configuration in the working migration runner.

3. **Parameterized Queries:** Convert from tagged template literals to parameterized queries:
   ```typescript
   // Before (@vercel/postgres):
   const result = await sql`SELECT * FROM qr_codes WHERE id = ${id}`

   // After (pg):
   const result = await pool.query('SELECT * FROM qr_codes WHERE id = $1', [id])
   ```

4. **Type Safety:** The `pg` library returns `QueryResult<T>` with a `rows` array. The existing code already accesses `result.rows[0]`, so the refactor is straightforward.

5. **No API Route Changes:** All database functions maintain the same signatures, so API routes (`/api/qr/generate`, `/api/qr/list`, `/api/analytics/[qrCodeId]`, `/r/[shortCode]`) require no changes.

### Dependencies
- **Removed:** `@vercel/postgres` (^0.5.1)
- **Existing (no changes):** `pg` (^8.18.0) - already installed
- **Dev dependency (no changes):** `@types/pg` may be needed if not present (check if types are bundled)

### Security Considerations
- Parameterized queries provide the same SQL injection protection as tagged template literals
- Connection string remains in environment variables (no exposure)
- SSL is enforced for production connections

### Backwards Compatibility
- All function signatures remain unchanged
- All return types remain unchanged
- API response formats remain unchanged
- No database schema changes required
