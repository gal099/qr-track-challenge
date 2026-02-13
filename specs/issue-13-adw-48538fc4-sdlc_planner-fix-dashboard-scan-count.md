# Bug: Analytics Dashboard Shows Incorrect Scan Count (0 instead of actual count)

## Metadata
issue_number: `13`
adw_id: `48538fc4`
issue_json: `{"number":13,"title":"Bug: Analytics Dashboard Shows Incorrect Scan Count (0 instead of actual count)","body":"## Bug Description\nThe Analytics Dashboard displays incorrect scan counts for QR codes. QR codes that have scans registered show \"0 total scans\" in the dashboard list, but when viewing the individual analytics page, the correct scan count is displayed.\n\n## Steps to Reproduce\n1. Navigate to https://qr-track-challenge.vercel.app/analytics\n2. Observe the QR code with short code \"5B_F4gPM\"\n3. Notice it shows **\"0 total scans\"**\n4. Click \"View Analytics\" for that QR code\n5. Navigate to https://qr-track-challenge.vercel.app/analytics/3\n6. Notice it correctly shows **\"3 Total Scans\"**\n\n## Expected Behavior\nThe Analytics Dashboard should display the same scan count as the individual analytics page. If a QR code has 3 scans, both pages should show \"3 total scans\".\n\n## Actual Behavior\n- **Analytics Dashboard** (`/analytics`): Shows \"0 total scans\"\n- **Individual Analytics** (`/analytics/3`): Shows \"3 Total Scans\" (correct)\n\n## Affected QR Codes\n- Short code: **5B_F4gPM** (ID: 3)\n  - Dashboard shows: 0 scans\n  - Detail page shows: 3 scans (correct)\n\nOther QR codes may also be affected.\n\n## Root Cause (Suspected)\nThe issue is likely in the `/api/qr/list` endpoint or the SQL query that fetches QR codes with their scan counts. The query might be:\n- Not joining the scans table correctly\n- Not counting scans properly\n- Using a cached/stale value\n\nThe individual analytics endpoint (`/api/analytics/[qrCodeId]`) appears to be working correctly.\n\n## Impact\n- Users cannot see accurate scan statistics in the dashboard\n- Misleading information that suggests QR codes have no activity\n- Users must click into each QR code individually to see real scan counts\n\n## Technical Details\n- Endpoint affected: `GET /api/qr/list`\n- Likely file: `src/app/api/qr/list/route.ts`\n- Database query needs review\n\n## Suggested Fix\nReview and fix the SQL query in `src/app/api/qr/list/route.ts` to properly count scans for each QR code. Ensure the query uses a LEFT JOIN with COUNT() or similar aggregation.\n\n## Production URL\nhttps://qr-track-challenge.vercel.app/analytics"}`

## Bug Description
The Analytics Dashboard displays incorrect scan counts for QR codes. When viewing the main analytics dashboard at `/analytics`, QR codes show "0 total scans" even though they have scans registered in the database. However, when navigating to the individual analytics page for the same QR code at `/analytics/[id]`, the correct scan count is displayed.

This is a data inconsistency bug where the same underlying scan data is being reported differently between two views. The individual analytics page uses the `getQRCodeAnalytics()` function which correctly counts scans, while the dashboard list uses `getAllQRCodes()` which appears to return 0 for the total_scans field.

## Problem Statement
The `getAllQRCodes()` database function in `src/lib/db.ts` returns `total_scans: 0` for all QR codes regardless of their actual scan count, causing the Analytics Dashboard to display misleading information to users.

## Solution Statement
Fix the `getAllQRCodes()` function in `src/lib/db.ts` to properly convert the PostgreSQL `BIGINT` return type from `COUNT()` to a JavaScript number. The PostgreSQL `pg` library returns `BIGINT` values as strings, and the current `parseInt()` conversion may be failing silently. Cast the count to `INTEGER` in the SQL query to ensure proper type handling.

## Steps to Reproduce
1. Navigate to https://qr-track-challenge.vercel.app/analytics (or http://localhost:3000/analytics locally)
2. Observe any QR code with short code "5B_F4gPM" (ID: 3)
3. Notice it shows **"0 total scans"** in the dashboard
4. Click "View Analytics" for that QR code
5. Navigate to https://qr-track-challenge.vercel.app/analytics/3 (or http://localhost:3000/analytics/3)
6. Notice it correctly shows **"3 Total Scans"**

## Root Cause Analysis
The root cause is in the `getAllQRCodes()` function in `src/lib/db.ts` at line 116-140. The function executes a SQL query with `LEFT JOIN` and `COUNT()`:

```sql
SELECT
   qr.id,
   qr.short_code,
   qr.target_url,
   qr.fg_color,
   qr.bg_color,
   qr.created_at,
   COALESCE(COUNT(s.id), 0) as total_scans
 FROM qr_codes qr
 LEFT JOIN scans s ON qr.id = s.qr_code_id
 GROUP BY qr.id, qr.short_code, qr.target_url, qr.fg_color, qr.bg_color, qr.created_at
 ORDER BY qr.created_at DESC
```

The PostgreSQL `COUNT()` function returns a `BIGINT` type. When using the `pg` (node-postgres) library, `BIGINT` values are returned as **strings** to avoid JavaScript number precision issues for very large numbers.

The current code attempts to parse this string:
```typescript
total_scans: parseInt(row.total_scans),
```

However, `parseInt()` may not be handling this correctly in all cases. The fix is to:
1. Cast the `COUNT()` result to `INTEGER` in SQL (since scan counts won't exceed JavaScript's safe integer limit)
2. Use `Number()` instead of `parseInt()` for safer type conversion with a fallback

The individual analytics endpoint (`getQRCodeAnalytics()`) works correctly because it uses a simpler direct `COUNT(*)` query that may be handled differently.

## Relevant Files
Use these files to fix the bug:

- `src/lib/db.ts` - Contains the `getAllQRCodes()` function (lines 115-140) with the SQL query that needs to be fixed. This is the primary file where the bug fix will be applied.
- `src/app/api/qr/list/route.ts` - The API route that calls `getAllQRCodes()`. May need to add logging for debugging during validation.
- `src/components/analytics/QRCodeList.tsx` - The component that displays the scan counts. Useful for understanding how `total_scans` is rendered (line 135).
- `db/schema.sql` - Database schema showing the relationship between `qr_codes` and `scans` tables. Useful for understanding the data model.
- `src/types/database.ts` - TypeScript types including `QRCodeWithScans` interface that defines the expected shape of the data.
- Read `.claude/commands/test_e2e.md` - Instructions for running E2E tests
- Read `.claude/commands/e2e/test_analytics_dashboard.md` - Existing E2E test for the analytics dashboard to understand the test format

### New Files
- `.claude/commands/e2e/test_dashboard_scan_count.md` - New E2E test file to validate that scan counts are displayed correctly on the analytics dashboard

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Fix the SQL Query in getAllQRCodes()
- Open `src/lib/db.ts`
- Locate the `getAllQRCodes()` function (lines 115-140)
- Modify the SQL query to cast the `COUNT()` result to `INTEGER`:
  - Change `COALESCE(COUNT(s.id), 0) as total_scans` to `COALESCE(COUNT(s.id), 0)::INTEGER as total_scans`
- This ensures PostgreSQL returns an integer value that the `pg` library can handle consistently

### 2. Update the Type Conversion in the Result Mapping
- In the same function, update the result mapping (lines 131-139)
- Change `parseInt(row.total_scans)` to `Number(row.total_scans) || 0`
- This provides a safer conversion that handles both strings and numbers, with a fallback to 0 for any edge cases

### 3. Create E2E Test for Dashboard Scan Count
- Read `.claude/commands/e2e/test_analytics_dashboard.md` to understand the E2E test format
- Create a new E2E test file at `.claude/commands/e2e/test_dashboard_scan_count.md`
- The test should:
  1. Navigate to `/analytics` dashboard
  2. Verify that QR codes with scans display the correct (non-zero) scan count
  3. Click on a QR code to view individual analytics
  4. Verify that the scan count on the individual page matches the dashboard count
  5. Take screenshots to prove both pages show the same count

### 4. Run Validation Commands
- Execute all validation commands to ensure the fix works correctly and introduces no regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_dashboard_scan_count.md` to validate the scan count fix
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run type-check` - Run TypeScript type checking to ensure no type errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run lint` - Run linting to ensure code quality
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run build` - Run production build to ensure no build errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm test` - Run unit tests to ensure no regressions

## Notes
- The PostgreSQL `pg` library returns `BIGINT` values as strings by default to prevent precision loss for numbers larger than JavaScript's `Number.MAX_SAFE_INTEGER` (2^53 - 1). Since scan counts will never realistically approach this limit, casting to `INTEGER` is safe and provides consistent behavior.
- The individual analytics endpoint (`getQRCodeAnalytics()`) at line 145-223 in `src/lib/db.ts` uses the same `parseInt()` pattern but works correctly. This may be due to differences in how the direct `COUNT(*)` query versus the `LEFT JOIN` aggregate query returns data. For consistency, consider applying the same `::INTEGER` cast fix there as well.
- This bug affects production at https://qr-track-challenge.vercel.app/analytics - users are seeing incorrect scan counts.
