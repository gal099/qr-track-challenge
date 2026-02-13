# E2E Test: QR Thumbnail Download

Test the QR code thumbnail display and download functionality in the analytics view.

## User Story

As a user viewing analytics for a QR code
I want to see and download the QR code directly from the analytics page
So that I can easily share the QR code without navigating back to regenerate it

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Enter a valid URL in the input field: "https://example.com/thumbnail-test"
3. Wait for 500ms (debounce delay)
4. **Verify** the QR code preview appears in the preview section

5. Click the "Generate QR Code" button
6. Wait for the loading state to complete
7. **Verify** the success result displays with the View Analytics button

8. Click the "View Analytics" button/link
9. Wait for the analytics page to load
10. Take a screenshot of the analytics page initial state

11. **Verify** the "QR Code Analytics" card is visible
12. **Verify** the QR thumbnail (80x80px) is visible in the header card on the right side
13. Take a screenshot showing the QR thumbnail in the header card

14. Hover over the QR thumbnail
15. **Verify** a download overlay appears with a download icon
16. **Verify** the cursor changes to pointer
17. Take a screenshot showing the hover overlay state

18. Click the QR thumbnail to trigger download
19. **Verify** no error occurs during the download process
20. Take a screenshot of the final state after download

21. **Verify** the card layout is maintained (no layout shift)
22. **Verify** the QR thumbnail respects the original colors from generation

## Success Criteria

- QR thumbnail (80x80px) is visible in the "QR Code Analytics" card
- Thumbnail is positioned on the right side of the header card
- QR thumbnail renders with correct colors (black foreground, white background by default)
- Hovering over thumbnail shows semi-transparent overlay with download icon
- Cursor changes to pointer on hover
- Clicking thumbnail triggers file download
- Card layout remains unchanged (responsive behavior maintained)
- No layout shift when QR loads
- 4 screenshots are taken: analytics page, QR thumbnail visible, hover overlay, final state
