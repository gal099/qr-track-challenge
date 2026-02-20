# E2E Test: Logo Display

Test that the company logo is properly displayed on the landing page.

## User Story

As a visitor to the QR Track application
I want to see the company logo prominently displayed on the landing page
So that I can quickly identify the brand and have a more professional user experience

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the landing page
3. **Verify** the page contains the logo element:
   - Logo image is visible above the "QR Track" heading
   - Logo has proper alt text: "QR Track Logo"
   - Logo src points to "/logo.svg"
   - Logo is centered horizontally on the page

4. **Verify** the logo dimensions and layout:
   - Logo has width of 120px (w-24 class on mobile, w-32 on desktop)
   - Logo has height of 120px
   - Logo is positioned above the main heading
   - Logo has appropriate spacing (mb-6 class on container)

5. **Verify** the logo is responsive:
   - On mobile viewport (375px width), logo displays at smaller size (w-24)
   - On desktop viewport (1024px width), logo displays at larger size (w-32)
   - Logo remains centered at all viewport sizes

6. **Verify** dark mode compatibility:
   - Toggle dark mode (if available)
   - Take a screenshot in dark mode
   - Logo is visible and properly displayed on dark background

7. Take a final screenshot showing the complete landing page with logo

## Success Criteria

- Logo image element exists on the page
- Logo is visible above the "QR Track" heading
- Logo has descriptive alt text "QR Track Logo"
- Logo src attribute points to "/logo.svg"
- Logo is horizontally centered
- Logo has appropriate spacing from the heading below
- Logo is responsive and scales appropriately on different screen sizes
- Logo works in both light and dark mode
- Logo loads without errors
- At least 2 screenshots are taken: initial state and dark mode (if applicable)
