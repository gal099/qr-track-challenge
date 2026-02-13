# E2E Test: QR Code Generation

Test the QR code generation functionality with real-time preview and customization.

## User Story

As a user
I want to generate customizable QR codes with real-time preview
So that I can quickly create branded QR codes and see exactly how they look before saving them

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the initial state
3. **Verify** the page contains core UI elements:
   - URL input field with label "Target URL"
   - Foreground color picker button showing #000000
   - Background color picker button showing #FFFFFF
   - "Generate QR Code" button
   - Preview section with placeholder message "Enter a valid URL to see preview"

4. Enter a valid URL in the input field: "https://example.com"
5. Wait for 500ms (debounce delay)
6. Take a screenshot of the URL entered state with preview
7. **Verify** the QR code preview appears in the preview section

8. Click the foreground color picker button
9. Take a screenshot showing the color picker open
10. **Verify** the HexColorPicker component is visible

11. Select a new foreground color by interacting with the color picker (e.g., blue #0000FF)
12. Click outside the color picker to close it
13. **Verify** the foreground color button now shows the new color

14. Click the background color picker button
15. Select a new background color (e.g., yellow #FFFF00)
16. Click outside the color picker to close it
17. Take a screenshot showing customized colors in the preview

18. Click the "Generate QR Code" button
19. Wait for the loading state to complete
20. Take a screenshot of the generated result

21. **Verify** the success result displays with:
    - QR code image
    - Short URL field (readonly input)
    - Copy button
    - Download PNG button
    - View Analytics button (link)

22. Click the "Copy" button
23. **Verify** no error occurs (clipboard API works or fails gracefully)

24. **Verify** the Download PNG button is present
25. Take a screenshot of the final state

## Success Criteria

- QR generator form elements are all present and visible
- URL input accepts text
- Real-time preview displays QR code after entering valid URL
- Foreground color picker opens and closes correctly
- Background color picker opens and closes correctly
- Preview updates when colors change
- Generate button triggers API call and shows loading state
- Success result displays with QR code, short URL, and action buttons
- Download PNG button is properly configured
- View Analytics button links to analytics page
- 5 screenshots are taken: initial state, URL entered with preview, color picker open, customized colors, final result
