# E2E Test: Redirect Flow

Test the URL shortening redirect functionality with scan tracking.

## User Story

As a user
I want my QR code short URLs to redirect to the target URL
So that users can access my content when scanning the QR code while I track analytics

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the initial state
3. **Verify** the QR generator form is present with:
   - URL input field
   - Generate QR Code button

4. Enter a valid URL in the input field: "https://example.com"
5. Wait for 500ms (debounce delay)
6. Take a screenshot of the URL entered state

7. Click the "Generate QR Code" button
8. Wait for the loading state to complete
9. Take a screenshot of the generated result
10. **Verify** the success result displays with:
    - Short URL field (readonly input)
    - The short URL should match pattern: `http://localhost:3000/r/<shortCode>`

11. Extract the short URL value from the readonly input field
12. Store the short code extracted from the URL (the part after `/r/`)

13. Open a new browser tab/page
14. Navigate to the extracted short URL (e.g., `http://localhost:3000/r/<shortCode>`)
15. Wait for redirect to complete
16. Take a screenshot after redirect
17. **Verify** the browser redirected to `https://example.com`

18. Navigate to the analytics page for the QR code
    - Go to `http://localhost:3000/analytics/1` (assuming first QR code in database)
    - If analytics page shows the scan count, verify it's at least 1
19. Take a screenshot of the analytics page (if accessible)

## Success Criteria

- QR code generation form is present and functional
- Short URL is generated with correct format (`/r/<shortCode>`)
- Navigating to short URL redirects to target URL
- Redirect is a 302 temporary redirect
- Scan event is tracked (verified via analytics page if accessible)
- 5 screenshots are taken: initial state, URL entered, generated result, after redirect, analytics page

## Edge Cases to Note

- The redirect should work even if the target URL has query parameters
- The redirect should happen quickly (within 1-2 seconds)
- If analytics page is not fully implemented, just verify the redirect works
