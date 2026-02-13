# Bug: Deleted QR codes still appear in analytics dashboard

## Metadata
issue_number: `27`
adw_id: `a8e0635d`
issue_json: `{"number":27,"title":"Bug: Deleted QR codes still appear in analytics dashboard","body":"..."}`

## Bug Description
QR codes deleted from the Admin Panel continue to appear in the Analytics dashboard. After soft-deleting QR codes (setting `deleted_at` timestamp), they should be filtered out from the analytics list view. Users report that deleted QR codes remain visible in the analytics list, can be clicked to view analytics, and there's no visual indication that the QR has been deleted.

## Problem Statement
The analytics dashboard and related API endpoints must filter out soft-deleted QR codes (those with a non-null `deleted_at` timestamp) to ensure users only see active QR codes. Additionally, direct access to deleted QR code analytics should return a 404 response.

## Solution Statement
After investigating the codebase, **the core fix has already been implemented**:
- `getAllQRCodes()` in `src/lib/db.ts:129` includes `WHERE qr.deleted_at IS NULL`
- `getQRCodeById()` in `src/lib/db.ts:59` includes `AND deleted_at IS NULL`

The remaining work is to:
1. **Verify** the existing fix works correctly by running the application
2. **Add unit tests** to ensure deleted QR codes are filtered (regression prevention)
3. **Add E2E tests** to validate the complete delete-to-analytics workflow
4. **Document** the verification to close the issue

## Steps to Reproduce
1. Navigate to Admin Panel (`/admin`)
2. Login with admin credentials (`yourpasswordhere`)
3. Delete one or more QR codes using the delete button
4. Confirm deletion in the modal
5. Navigate to Analytics page (`/analytics`)
6. **Expected**: Deleted QR codes should NOT be visible in the list
7. **Bug claim**: Deleted QR codes are still visible (needs verification)

## Root Cause Analysis
The original bug was that database queries in `src/lib/db.ts` were not filtering by `deleted_at` column when fetching QR codes. This was fixed in commit `0dfa1f7` (feature: #19 - Admin Panel - QR Management with Delete) which added:
- `WHERE qr.deleted_at IS NULL` to `getAllQRCodes()`
- `AND deleted_at IS NULL` to `getQRCodeByShortCode()`
- `AND deleted_at IS NULL` to `getQRCodeById()`

The issue may have been reported based on:
1. An older version of the code before the fix was deployed
2. Browser caching showing stale data
3. A race condition or edge case we haven't identified

## Relevant Files
Use these files to verify and test the bug fix:

**Database Layer (Core Fix Location):**
- `src/lib/db.ts` - Contains `getAllQRCodes()` and `getQRCodeById()` functions with `deleted_at IS NULL` filters already implemented (lines 57-64, 115-145)

**API Endpoints:**
- `src/app/api/qr/list/route.ts` - Uses `getAllQRCodes()` which filters deleted codes
- `src/app/api/analytics/[qrCodeId]/route.ts` - Uses `getQRCodeById()` which filters deleted codes and returns 404 for deleted QRs

**UI Components:**
- `src/app/analytics/page.tsx` - Analytics dashboard page
- `src/components/analytics/QRCodeList.tsx` - QR code list component that displays the data

**Existing Tests:**
- `src/components/analytics/__tests__/QRCodeList.test.tsx` - Unit tests for QRCodeList (needs test for deleted filtering)

**Existing E2E Tests (for reference):**
- `.claude/commands/e2e/test_admin_panel.md` - E2E test for admin panel functionality
- `.claude/commands/e2e/test_analytics_dashboard.md` - E2E test for analytics dashboard
- `.claude/commands/test_e2e.md` - E2E test runner instructions

**Documentation:**
- `app_docs/feature-350ce5e4-admin-panel-qr-management.md` - Admin panel documentation confirming soft delete implementation
- `app_docs/feature-5d00a77d-analytics-dashboard.md` - Analytics dashboard documentation

### New Files
- `.claude/commands/e2e/test_deleted_qr_analytics.md` - New E2E test to validate deleted QR codes don't appear in analytics

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Verify the existing fix is working
- Start the development server with `npm run dev`
- Navigate to `/admin` and login with password `yourpasswordhere`
- Note the list of QR codes displayed
- Navigate to `/analytics` and note which QR codes are shown
- Return to admin panel and delete a QR code
- Navigate back to `/analytics` and verify the deleted QR code is no longer visible
- Try accessing the deleted QR code's analytics directly via `/analytics/[id]` to verify it returns 404
- Document the verification results

### 2. Add unit test for deleted QR filtering behavior
- Open `src/components/analytics/__tests__/QRCodeList.test.tsx`
- Add a test case that verifies the API response only contains non-deleted QR codes
- The test should mock the API to return QR codes and verify the component properly displays them (the filtering happens server-side, but we can add a comment noting the server filters deleted records)

### 3. Create E2E test for deleted QR analytics workflow
- Read `.claude/commands/e2e/test_admin_panel.md` and `.claude/commands/e2e/test_analytics_dashboard.md` as reference
- Create `.claude/commands/e2e/test_deleted_qr_analytics.md` with the following test steps:
  1. Navigate to `/analytics` and count the number of QR codes displayed
  2. Navigate to `/admin` and login
  3. Note the short_code of the first QR code in the list
  4. Delete the first QR code
  5. Navigate to `/analytics`
  6. Verify the deleted QR code is no longer in the list
  7. Attempt to access `/analytics/[id]` directly for the deleted QR
  8. Verify a 404 or "not found" message is displayed
  9. Take screenshots at each step to document the behavior

### 4. Run validation commands to ensure no regressions
- Run the test suite to verify all existing tests pass
- Run the build to ensure no TypeScript errors
- Execute the new E2E test to validate the fix

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

**Pre-verification (confirm bug is not present):**
```bash
# Start the dev server (in a separate terminal)
npm run dev
```
Manually verify in the browser that:
1. Deleting a QR in admin removes it from analytics
2. Direct URL access to deleted QR analytics returns 404

**Unit Tests:**
```bash
npm test
```

**TypeScript Check:**
```bash
npm run type-check
```

**Build:**
```bash
npm run build
```

**E2E Test:**
Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_deleted_qr_analytics.md` to validate the deleted QR filtering works end-to-end.

## Notes

1. **Fix Already Implemented**: The core database-level fix is already in place in `src/lib/db.ts`. The `WHERE qr.deleted_at IS NULL` clause was added in commit `0dfa1f7` as part of the Admin Panel feature.

2. **Issue May Be Invalid**: This bug report might be based on:
   - An older codebase version before the fix
   - Browser/API caching showing stale data
   - Testing in an environment without the latest code deployed

3. **Verification is Key**: The primary goal is to verify the fix works and add regression tests, not to re-implement a fix that already exists.

4. **No Code Changes Expected**: Unless verification reveals the bug still exists, no code changes to `db.ts` should be necessary. The focus is on adding tests and documentation.

5. **E2E Test Coverage**: Creating an E2E test for this specific workflow ensures we can detect regressions in the future and provides documentation of expected behavior.
