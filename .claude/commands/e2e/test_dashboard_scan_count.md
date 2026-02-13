# E2E Test: Dashboard Scan Count

Test that the analytics dashboard displays correct scan counts that match the individual analytics page.

## User Story

As a user viewing the analytics dashboard
I want to see accurate scan counts for each QR code
So that I can quickly assess QR code performance without navigating to each individual page

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the home page

3. Click the "View Analytics" link to navigate to `/analytics`
4. Take a screenshot of the analytics dashboard page
5. **Verify** the page contains the "Analytics Dashboard" header

6. **Verify** at least one QR code is displayed in the list
   - If no QR codes exist, the test cannot proceed - report this as a test environment issue

7. For the first QR code in the list:
   - **Verify** it displays a scan count (look for text containing "total scans" or a number followed by "scans")
   - Record the displayed scan count value from the dashboard
   - Record the QR code's ID or short code for reference

8. Click on the first QR code card (or "View Analytics" link) to navigate to its individual analytics page
9. Take a screenshot of the individual analytics page
10. **Verify** the individual analytics page displays:
    - A "Total Scans" section with a number
    - Record the total scans value displayed

11. **Verify** the scan count from the dashboard (Step 7) matches the scan count on the individual analytics page (Step 10)
    - If they don't match, this is a CRITICAL FAILURE - the bug is not fixed
    - Take a screenshot highlighting the mismatch if found

12. Navigate back to `/analytics` dashboard
13. Take a screenshot of the dashboard showing the scan count

14. **Verify** the scan count is still displayed correctly after navigating back

## Success Criteria

- Analytics dashboard (`/analytics`) loads successfully
- At least one QR code is displayed with a visible scan count
- The scan count displayed on the dashboard matches the scan count on the individual analytics page
- Scan counts are displayed as numbers (not showing "0" when there are actual scans)
- Navigation between dashboard and individual analytics works correctly
- 4 screenshots are taken: home page, analytics dashboard, individual analytics, final dashboard state

## Critical Assertion

The primary goal of this test is to verify that:
**Dashboard scan count === Individual analytics page scan count**

If these values don't match, the test MUST fail with a clear error message indicating the discrepancy:
- Expected: [value from individual analytics page]
- Actual: [value from dashboard]
