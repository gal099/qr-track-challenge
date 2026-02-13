# E2E Test: Author Field

Test the author field functionality in QR code creation and display across the application.

## User Story

As a QR code creator
I want to add my name/identifier when generating a QR code
So that I can track ownership and know who created each QR code for better organization

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the initial state
3. **Verify** the page contains the Author input field:
   - Author input field with label "Author"
   - Placeholder text "Your name or identifier"

4. Attempt to click "Generate QR Code" button without entering author
5. **Verify** the Generate button is disabled or shows validation error

6. Enter a single character "A" in the Author field
7. Enter a valid URL "https://example.com" in the Target URL field
8. Click "Generate QR Code" button
9. **Verify** validation error appears for author being too short (min 2 characters)
10. Take a screenshot showing the validation error

11. Clear the Author field and enter a very long name (more than 30 characters): "This Is A Very Long Author Name That Exceeds Limit"
12. Click "Generate QR Code" button
13. **Verify** validation error appears for author being too long (max 30 characters)

14. Clear the Author field and enter special characters: "Test@User#123"
15. Click "Generate QR Code" button
16. **Verify** validation error appears for invalid characters (only alphanumeric and spaces allowed)

17. Clear the Author field and enter a valid author name: "John Doe"
18. **Verify** URL is still "https://example.com"
19. Take a screenshot showing valid author entered
20. Click "Generate QR Code" button
21. Wait for the loading state to complete
22. Take a screenshot of the generated result

23. **Verify** the success result displays:
    - QR code image
    - Short URL field
    - Copy button
    - Download PNG button
    - View Analytics button

24. Navigate to the analytics dashboard page (/analytics)
25. Wait for the page to load
26. Take a screenshot of the analytics dashboard
27. **Verify** the QR code card displays "Created by: John Doe"

28. Click on the QR code card to view individual analytics
29. Wait for the page to load
30. Take a screenshot of the individual analytics page
31. **Verify** the author is displayed in the header section

## Success Criteria

- Author input field is present with correct label "Author"
- Author input field has placeholder "Your name or identifier"
- Form validation prevents submission with empty author
- Form validation shows error for author less than 2 characters
- Form validation shows error for author more than 30 characters
- Form validation shows error for author with special characters
- Valid author (alphanumeric + spaces, 2-30 chars) allows form submission
- Author is saved and displayed on analytics dashboard as "Created by: [Author]"
- Author is displayed on individual analytics page
- 6 screenshots are taken: initial state, validation error, valid author entered, generated result, analytics dashboard, individual analytics
