# E2E Test: Deleted QR Codes Filtered from Analytics

Test that soft-deleted QR codes are properly filtered from the analytics dashboard and return 404 when accessed directly.

## User Story

As a user viewing analytics
I want deleted QR codes to be hidden from the analytics dashboard
So that I only see active QR codes and don't get confused by deleted entries

## Prerequisites

- At least one QR code must exist in the system
- The dev server must be running at http://localhost:3000

## Test Steps

### Part 1: Initial Analytics State

1. Navigate to the `Application URL` (http://localhost:3000)
2. Navigate to `/analytics`
3. Take a screenshot of the analytics dashboard
4. **Verify** the page displays a list of QR codes
5. Count and note the number of QR code cards displayed
6. Note the short code of the first QR code in the list for later verification

### Part 2: Delete a QR Code via Admin Panel

7. Navigate to `/admin`
8. Take a screenshot of the admin login page
9. Enter the password: "yourpasswordhere"
10. Click the "Access Admin Panel" button
11. Wait for navigation to `/admin/dashboard`
12. Take a screenshot of the admin dashboard
13. **Verify** the dashboard displays a list of QR codes
14. Note the short code of the first QR code in the admin list
15. Click the "Delete" button on the first QR code
16. Take a screenshot of the delete confirmation modal
17. Click the "Delete QR Code" button to confirm deletion
18. Wait for the success toast notification
19. Take a screenshot showing the QR code has been removed from the admin list
20. **Verify** the deleted QR code is no longer in the admin list

### Part 3: Verify Deleted QR Code is Hidden from Analytics

21. Navigate to `/analytics`
22. Take a screenshot of the analytics dashboard after deletion
23. **Verify** the deleted QR code (noted in step 14) is NOT displayed in the analytics list
24. **Verify** the count of QR codes is one less than the initial count (from step 5)

### Part 4: Verify Direct Access to Deleted QR Analytics Returns 404

25. Note the ID of the deleted QR code (if known) or attempt to access `/analytics/[id]` for the deleted QR
26. Navigate directly to the deleted QR code's analytics page URL
27. Take a screenshot of the 404 or "not found" response
28. **Verify** the page displays a 404 error or "QR Code not found" message

### Part 5: Cleanup

29. Click the "Logout" button in the admin panel (if still logged in)
30. Take a final screenshot

## Success Criteria

- Analytics dashboard displays list of QR codes initially
- After deleting a QR code in admin panel, it is immediately removed from admin list
- Navigating to analytics dashboard shows the deleted QR code is no longer visible
- The count of QR codes in analytics is reduced by one after deletion
- Direct URL access to deleted QR code's analytics returns a 404 or "not found" page
- 8+ screenshots are taken documenting each major step

## Technical Notes

- Soft delete sets the `deleted_at` timestamp in the database
- The `getAllQRCodes()` function filters with `WHERE qr.deleted_at IS NULL`
- The `getQRCodeById()` function filters with `AND deleted_at IS NULL`
- This ensures deleted QR codes are excluded from both list views and direct access
