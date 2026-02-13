# Analytics Dashboard Cache Fix

**ADW ID:** f9c10ae5
**Date:** 2026-02-13
**Specification:** specs/issue-29-adw-f9c10ae5-sdlc_planner-fix-analytics-dashboard-cache.md

## Overview

Fixed a critical caching issue where the analytics dashboard did not reflect real-time database changes. The Next.js App Router was caching the `/api/qr/list` endpoint by default, causing stale data to persist even after hard refresh and in incognito mode. The fix disables Next.js route caching by adding `export const dynamic = 'force-dynamic'` to ensure fresh data is fetched on every request.

## Screenshots

![Analytics Dashboard showing QR codes with scan counts](assets/01_analytics_dashboard.png)

*Analytics dashboard now displays real-time data from the database*

![Individual QR code analytics page](assets/02_individual_analytics.png)

*Individual analytics pages correctly showed fresh data (this endpoint was already working)*

## What Was Built

- Added dynamic rendering configuration to the QR list API endpoint
- Added debug logging to database queries for verification
- Created E2E test specification for validating the cache fix
- Ensured analytics dashboard reflects database changes in real-time

## Technical Implementation

### Files Modified

- `src/app/api/qr/list/route.ts`: Added `export const dynamic = 'force-dynamic'` to disable Next.js route caching
- `src/lib/db.ts`: Added debug logging to `getAllQRCodes()` function to verify queries execute on each request
- `.claude/commands/e2e/test_analytics_cache_fix.md`: Created E2E test specification to validate the fix

### Key Changes

- **Route Cache Disabling**: Added `export const dynamic = 'force-dynamic'` at the top of the QR list route handler. This tells Next.js to always run this route dynamically and never cache responses.

- **Debug Logging**: Added `console.log('[DB] getAllQRCodes() called at', new Date().toISOString())` to track when database queries execute, helping verify that caching is disabled.

- **Root Cause**: Next.js App Router caches GET route handlers by default for static routes (routes without dynamic segments). The `/api/qr/list` endpoint had no dynamic parameters, so Next.js cached it. The individual analytics endpoint (`/api/analytics/[qrCodeId]`) worked correctly because its dynamic segment `[qrCodeId]` made it dynamic by default.

- **Minimal Fix**: Only one line of code was needed to fix the issue - the most surgical solution possible.

## How to Use

The fix is transparent to end users. The analytics dashboard now automatically displays current database state:

1. Navigate to `/analytics` to view the analytics dashboard
2. Any changes made to QR code data in the database (e.g., via Supabase dashboard or API calls) will immediately appear on page refresh
3. Hard refresh (Cmd + Shift + R) now correctly fetches fresh data
4. Data consistency is maintained between the dashboard list view and individual analytics pages

## Configuration

No configuration required. The fix works automatically by disabling Next.js route caching for the QR list endpoint.

**Debug Logging**: The console log statement in `getAllQRCodes()` can be removed after verification if desired, though it provides useful debugging information in development.

## Testing

### Manual Testing

1. Navigate to `/analytics` and note current QR code data
2. Go to Supabase dashboard and modify a QR code (e.g., change author field)
3. Return to `/analytics` and hard refresh
4. Verify that changes are immediately reflected

### E2E Testing

Run the E2E test specification in `.claude/commands/e2e/test_analytics_cache_fix.md` to validate:
- Analytics dashboard loads current data
- Multiple page refreshes fetch fresh data (verified via server logs)
- Data displayed matches current database state

### Validation Commands

```bash
bun tsc --noEmit          # Type check
bun run build             # Production build
bun run lint              # Code quality
```

## Notes

1. **Performance Consideration**: Disabling caching means each request queries the database. For small-scale analytics dashboards, this is acceptable and ensures data accuracy. For high-traffic scenarios, consider implementing on-demand revalidation with `revalidatePath()`.

2. **Alternative Approaches Considered**: Other solutions like `export const revalidate = 0`, adding `headers()` or `cookies()` calls, or client-side cache busting were considered but rejected in favor of the explicit and clear `dynamic = 'force-dynamic'` approach.

3. **Related to Issue #27**: This fix ensures that soft-delete filtering from issue #27 is properly reflected in real-time, as the cache was preventing immediate visibility of deletion changes.

4. **Why Individual Analytics Worked**: The `/api/analytics/[qrCodeId]` endpoint already worked correctly because routes with dynamic segments are treated as dynamic by default in Next.js, bypassing the cache.
