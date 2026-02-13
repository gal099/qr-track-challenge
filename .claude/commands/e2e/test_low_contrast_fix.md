# E2E Test: Low Contrast Text Fix Validation

Validate that all text elements in the QR generator UI have sufficient color contrast for accessibility compliance.

## User Story

As a user with normal or impaired vision
I want all text elements to have sufficient contrast
So that I can read and interact with the QR generator UI without difficulty

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the initial state focusing on text visibility

3. **Verify** the Target URL input placeholder text is visible:
   - The placeholder "https://example.com" should be clearly readable
   - Should have gray-500 color styling (not too light)

4. **Verify** the Foreground Color hex code label is readable:
   - The hex code "#000000" should be clearly visible
   - Should have gray-700 text color in light mode

5. **Verify** the Background Color hex code label is readable:
   - The hex code "#FFFFFF" should be clearly visible
   - Should have gray-700 text color in light mode

6. Take a screenshot showing the color code labels are readable

7. Enter a valid URL in the input field: "https://example.com"
8. Wait for 500ms (debounce delay for preview)
9. Click the "Generate QR Code" button
10. Wait for the loading state to complete
11. Take a screenshot of the generated result

12. **Verify** the Short URL input text is clearly readable:
    - The generated short URL should be visible with high contrast
    - Should have gray-900 text color in light mode

13. **Verify** the Copy button text is visible:
    - "Copy" text should be clearly readable on the gray-200 background
    - Should have gray-700 text color in light mode

14. Click the "Copy" button
15. **Verify** the "Copied!" state shows white text on green background (already correct)

16. Take a final screenshot showing all text elements are visible

## Success Criteria

- Target URL placeholder text is visible and readable (gray-500)
- Foreground color hex code (#000000) is clearly readable (gray-700)
- Background color hex code (#FFFFFF) is clearly readable (gray-700)
- Generated short URL text is highly visible (gray-900)
- Copy button text is readable before clicking (gray-700 on gray-200)
- All text meets WCAG AA contrast requirements (4.5:1 minimum)
- 4 screenshots are taken: initial state, color labels, generated result, final state

## Accessibility Notes

- WCAG AA requires 4.5:1 contrast ratio for normal text
- gray-500 on white background provides ~4.6:1 contrast ratio
- gray-700 on white background provides ~8.6:1 contrast ratio
- gray-900 on white background provides ~16:1 contrast ratio
