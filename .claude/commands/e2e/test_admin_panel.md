# E2E Test: Admin Panel - QR Management

Test the admin panel authentication and QR code management functionality.

## User Story

As an administrator
I want to access a password-protected admin panel to manage QR codes
So that I can delete test QR codes and duplicates that accumulate in the system

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Navigate to `/admin`
3. Take a screenshot of the admin login page
4. **Verify** the page contains:
   - Page title "QR Track Admin Panel"
   - Password input field with label "Enter your password here"
   - "Access Admin Panel" submit button

5. Enter an incorrect password: "wrongpassword"
6. Click the "Access Admin Panel" button
7. Take a screenshot of the error state
8. **Verify** an error message is displayed indicating invalid password

9. Clear the password field
10. Enter the correct password: "yourpasswordhere"
11. Click the "Access Admin Panel" button
12. Wait for navigation to complete
13. Take a screenshot of the admin dashboard
14. **Verify** the user is redirected to `/admin/dashboard`
15. **Verify** the dashboard displays:
    - Page title "QR Track Admin"
    - Table/list of QR codes with columns: Short Code, Target URL, Scans, Created, Actions
    - Delete button for each QR code
    - Logout button

16. If QR codes exist in the list, click the "Delete" button on the first QR code
17. Take a screenshot of the delete confirmation modal
18. **Verify** the confirmation modal displays:
    - QR code short code
    - Target URL
    - Scan count message
    - Warning "This action cannot be undone"
    - "Cancel" button
    - "Delete QR Code" button (red/destructive style)

19. Click the "Cancel" button
20. **Verify** the modal closes and the QR code is still in the list

21. Click the "Delete" button on the same QR code again
22. Click the "Delete QR Code" button in the confirmation modal
23. Take a screenshot showing the success toast
24. **Verify**:
    - A success toast notification appears
    - The QR code is removed from the list

25. Click the "Logout" button
26. **Verify** the user is redirected to `/admin` (login page)
27. Take a screenshot of the final logged out state

## Success Criteria

- Admin login page displays at /admin with password form
- Incorrect password shows error message
- Correct password ("yourpasswordhere") grants access to dashboard
- Dashboard displays QR code list with delete buttons
- Delete button opens confirmation modal with QR details
- Cancel button closes modal without deleting
- Confirm delete removes QR code and shows success toast
- Deleted QR code is removed from list immediately
- Logout button clears session and redirects to login
- 7 screenshots are taken: login page, error state, dashboard, delete modal, success toast, logged out state
