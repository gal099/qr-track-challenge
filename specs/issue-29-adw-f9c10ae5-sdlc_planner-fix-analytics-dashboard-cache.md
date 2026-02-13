# Bug: Analytics dashboard not reflecting database changes in real-time

## Metadata
issue_number: `29`
adw_id: `f9c10ae5`
issue_json: `{"number":29,"title":"Bug: Analytics dashboard not reflecting database changes in real-time","body":"## Bug Description\n\nThe analytics dashboard (`/analytics`) does not reflect database changes made directly in Supabase..."}`

## Bug Description
The analytics dashboard (`/analytics`) does not reflect database changes made directly in Supabase. Changes persist even after hard refresh and testing in incognito mode, suggesting server-side caching or stale data issues rather than browser cache.

Symptoms:
- Database changes (e.g., author field edits) do NOT appear in the analytics dashboard
- Hard refresh (`Cmd + Shift + R`) does NOT fetch fresh data
- Incognito mode shows the same stale data
- Individual analytics pages (`/analytics/[id]`) correctly show fresh data
- Restored QR codes (where `deleted_at = NULL`) do NOT appear in the dashboard list

## Problem Statement
The `/api/qr/list` API endpoint used by the analytics dashboard is being cached by Next.js App Router's default caching behavior. Route handlers without dynamic parameters or explicit cache configuration are cached by default in Next.js 14+. This causes the analytics dashboard to serve stale data even after database changes.

## Solution Statement
Add `export const dynamic = 'force-dynamic'` to the `/api/qr/list/route.ts` file to disable Next.js route caching. This ensures every request to the endpoint fetches fresh data from the database, matching the behavior of the individual analytics endpoint which works correctly due to its dynamic route parameter (`[qrCodeId]`).

## Steps to Reproduce
1. Navigate to `/analytics` page and note the current data
2. Go to Supabase dashboard and manually edit QR code data (e.g., change `author` field)
3. Hard refresh the `/analytics` page (`Cmd + Shift + R`)
4. Test in incognito mode
5. **Observe**: Changes do NOT appear in the dashboard
6. Navigate to individual analytics page (`/analytics/[id]`) for the same QR code
7. **Observe**: Individual page DOES show updated data

## Root Cause Analysis
The root cause is Next.js App Router's default caching behavior for route handlers.

**Why `/api/qr/list` is cached:**
- The route handler in `src/app/api/qr/list/route.ts` is a static route (no dynamic segments)
- Next.js App Router caches GET route handlers by default unless:
  1. The route has dynamic parameters (e.g., `[id]`)
  2. The route uses `cookies()`, `headers()`, or `searchParams`
  3. The route explicitly exports `dynamic = 'force-dynamic'`
  4. The route explicitly exports `revalidate = 0`

**Why `/api/analytics/[qrCodeId]` works correctly:**
- This route has a dynamic segment `[qrCodeId]`
- Next.js treats routes with dynamic segments as dynamic by default
- Therefore, each request fetches fresh data from the database

**Current code in `src/app/api/qr/list/route.ts`:**
```typescript
export async function GET() {
  // No dynamic configuration - cached by default!
  const qrCodes = await getAllQRCodes()
  return NextResponse.json({ success: true, data: { qr_codes: qrCodes }})
}
```

**Required fix:**
```typescript
// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'

export async function GET() {
  const qrCodes = await getAllQRCodes()
  return NextResponse.json({ success: true, data: { qr_codes: qrCodes }})
}
```

## Relevant Files
Use these files to fix the bug:

- `src/app/api/qr/list/route.ts` - The API endpoint that serves the QR code list to the analytics dashboard. This is the primary file that needs to be modified to add the `dynamic = 'force-dynamic'` export.
- `src/app/analytics/page.tsx` - The analytics dashboard page component. Should be verified to ensure it doesn't have any static rendering issues.
- `src/components/analytics/QRCodeList.tsx` - Client component that fetches data from `/api/qr/list`. Uses `useEffect` with `fetch()` which should work correctly once the API is uncached.
- `src/lib/db.ts` - Database query file containing `getAllQRCodes()` function. May add debug logging to verify queries are executed.
- `.claude/commands/test_e2e.md` - E2E test runner instructions for validating the fix.

### New Files
- `.claude/commands/e2e/test_analytics_cache_fix.md` - E2E test to validate the cache fix works correctly and data updates are reflected in real-time.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Add dynamic export to the QR list API endpoint
- Open `src/app/api/qr/list/route.ts`
- Add `export const dynamic = 'force-dynamic'` at the top of the file (after imports, before the GET function)
- This tells Next.js to always run this route handler dynamically, never cache the response

### 2. Add optional debug logging to database function
- Open `src/lib/db.ts`
- In the `getAllQRCodes()` function, add a console.log statement at the beginning to log when the query is executed
- Format: `console.log('[DB] getAllQRCodes() called at', new Date().toISOString())`
- This helps verify the database is being queried on each request during testing
- This logging can be removed after the fix is verified

### 3. Create E2E test file for analytics cache fix validation
- Read `.claude/commands/e2e/test_deleted_qr_analytics.md` and `.claude/commands/e2e/test_analytics_dashboard.md` to understand the E2E test format
- Create `.claude/commands/e2e/test_analytics_cache_fix.md` with the following test scenarios:
  - Navigate to analytics dashboard and note current data
  - Refresh the page multiple times and verify timestamps in server logs show new queries each time
  - Verify data displayed matches current database state
  - The test should validate that the cache fix ensures fresh data is fetched on each page load

### 4. Run TypeScript type check
- Run `bun tsc --noEmit` in the `src` directory to ensure no type errors were introduced
- Fix any type errors if they occur

### 5. Run the build process
- Run `bun run build` to ensure the application builds successfully with the changes
- Fix any build errors if they occur

### 6. Run server tests
- Run any existing server-side tests to ensure no regressions
- Verify the QR list endpoint tests still pass

### 7. Execute E2E test to validate the fix
- Read `.claude/commands/test_e2e.md`
- Read and execute `.claude/commands/e2e/test_analytics_cache_fix.md` to validate the cache fix works
- Take screenshots to document the test results

### 8. Run final validation commands
- Execute all validation commands listed below to confirm the fix is complete with zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `cd /Users/juanbaez/Documents/qr-track-challenge && bun tsc --noEmit` - Run TypeScript type check to ensure no type errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && bun run build` - Run production build to validate no build errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && bun run lint` - Run linter to ensure code quality

Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_analytics_cache_fix.md` E2E test file to validate the cache fix works correctly.

## Notes

1. **Minimal Change**: The fix requires adding only one line (`export const dynamic = 'force-dynamic'`) to the API route file. This is the most surgical fix possible.

2. **Why not add Cache-Control headers?**: While adding `Cache-Control: no-store` headers would help with browser caching, the primary issue is Next.js server-side caching of route handlers. The `dynamic = 'force-dynamic'` export addresses this at the source.

3. **Alternative approaches considered but not used:**
   - `export const revalidate = 0` - This is equivalent to `dynamic = 'force-dynamic'` but less explicit
   - Adding `headers()` or `cookies()` calls - This would make the route dynamic but is a workaround, not a clear intent
   - Client-side cache busting - Would not address server-side caching

4. **Debug logging**: The debug logging added to `getAllQRCodes()` is optional and can be removed after the fix is verified. It helps confirm the database is being queried on each request.

5. **Performance consideration**: Disabling caching means each request will query the database. For a small-scale analytics dashboard, this is acceptable. For high-traffic scenarios, consider implementing on-demand revalidation with `revalidatePath()`.

6. **Related to Issue #27**: This fix ensures that the soft-delete filtering from issue #27 is properly reflected in real-time, as the cache was preventing immediate visibility of deletion changes.
