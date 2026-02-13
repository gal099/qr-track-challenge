# E2E Test: Analytics Dashboard Cache Fix

Test that the analytics dashboard properly reflects real-time database changes without caching issues.

## User Story

As a user viewing analytics
I want the analytics dashboard to show fresh data on every page load
So that database changes are immediately visible without needing to clear caches

## Prerequisites

- At least one QR code must exist in the system
- The dev server must be running at http://localhost:3000
- Server console must be visible to observe debug logging

## Test Steps

### Part 1: Verify Dynamic Data Fetching

1. Navigate to the `Application URL` (http://localhost:3000)
2. Navigate to `/analytics`
3. Take a screenshot of the analytics dashboard
4. **Verify** the page displays a list of QR codes with their data
5. Note the current data displayed (author names, scan counts, etc.)
6. Observe the server console - **Verify** a log message appears: `[DB] getAllQRCodes() called at <timestamp>`

### Part 2: Verify Fresh Data on Refresh

7. Hard refresh the page (Cmd + Shift + R or Ctrl + Shift + R)
8. Take a screenshot after the refresh
9. Observe the server console - **Verify** a NEW log message appears with a more recent timestamp
10. **Verify** the timestamp in the second log is different from the first, confirming a fresh database query
11. Refresh the page a third time
12. Observe the server console - **Verify** another NEW log message appears with an even more recent timestamp

### Part 3: Verify Data Consistency

13. Note the author field and scan count for the first QR code in the list
14. Take a screenshot of the current data
15. Navigate to the individual analytics page for that QR code by clicking on it
16. Take a screenshot of the individual analytics page
17. **Verify** the data on the individual page matches the data from the list view
18. Navigate back to `/analytics`
19. **Verify** the data is still consistent and fresh

### Part 4: Verify No Browser Cache Issues

20. Open the analytics page in an incognito/private window
21. Take a screenshot of the analytics dashboard in incognito mode
22. **Verify** the data matches what was shown in the normal browser window
23. **Verify** server console shows a new database query log for this request

## Success Criteria

- Analytics dashboard displays QR code list on initial load
- Server console shows `[DB] getAllQRCodes() called at` log on each page load
- Each page refresh triggers a new database query (verified by unique timestamps in logs)
- Hard refresh shows fresh data
- Incognito mode shows the same current data (no stale cached data)
- Data is consistent between list view and individual analytics pages
- At least 6 screenshots are taken documenting the test steps

## Technical Notes

- The fix adds `export const dynamic = 'force-dynamic'` to `/api/qr/list/route.ts`
- This disables Next.js route handler caching
- The `[DB] getAllQRCodes() called at` log confirms the database is queried on each request
- Each log timestamp should be unique, proving no caching is occurring
- This ensures changes made in Supabase are immediately visible in the dashboard
