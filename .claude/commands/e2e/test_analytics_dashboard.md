# E2E Test: Analytics Dashboard

Test the analytics dashboard functionality including QR code list display, individual analytics view, and shareable URL functionality.

## User Story

As a user who has generated QR codes
I want to view analytics dashboards showing scan data for my QR codes
So that I can understand how my QR codes are being used, from which devices and locations

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the home page
3. **Verify** the page contains a "View Analytics" link in the header

4. Click the "View Analytics" link to navigate to `/analytics`
5. Take a screenshot of the analytics dashboard page
6. **Verify** the page contains:
   - Page header with title "Analytics Dashboard"
   - Either a list of QR codes or an empty state message

7. If QR codes are present:
   - **Verify** each QR code card displays:
     - Target URL (possibly truncated)
     - Short code
     - Total scans count
     - Creation date
     - A link to view individual analytics

8. If no QR codes are present:
   - **Verify** an empty state message is displayed indicating no QR codes exist
   - Navigate back to home page to generate a QR code first
   - Enter a valid URL (e.g., "https://example.com")
   - Click "Generate QR Code" button
   - Wait for generation to complete
   - Navigate back to `/analytics` page
   - **Verify** the newly created QR code appears in the list

9. Click on a QR code card to navigate to its individual analytics page
10. Take a screenshot of the individual analytics page
11. **Verify** the individual analytics page displays:
    - QR Code Analytics header
    - Target URL
    - Creation date
    - Total Scans section
    - Share Link button

12. Click the "Share Link" or "Copy Link" button
13. Take a screenshot showing the copy confirmation
14. **Verify** a success message appears indicating the link was copied

15. **Verify** the URL in the browser is a shareable link format (`/analytics/[id]`)

16. Navigate back to `/analytics` using browser back or the link
17. Take a screenshot of the final state of the analytics dashboard

## Success Criteria

- Analytics dashboard page (`/analytics`) is accessible
- Navigation from home page to analytics works
- QR code list displays with correct information (or empty state if no QR codes)
- Each QR code card shows: target URL, short code, total scans, creation date
- Clicking a QR code navigates to individual analytics page
- Individual analytics page displays all expected sections
- Share/Copy button exists and provides feedback when clicked
- Shareable URLs are in the correct format
- 5 screenshots are taken: home page, analytics dashboard, individual analytics, copy confirmation, final state
