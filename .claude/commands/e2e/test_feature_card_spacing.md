# E2E Test: Feature Card Spacing

Test that all three feature cards have consistent spacing and height on the landing page.

## User Story

As a visitor to the QR Track application
I want all three feature cards to have consistent spacing and height
So that the landing page looks balanced, professional, and aligned

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the landing page showing the feature cards section

3. **Verify** all three feature cards are visible:
   - First card: "Customizable" with 🎨 icon
   - Second card: "Analytics" with 📊 icon
   - Third card: "Instant" with ⚡ icon

4. **Verify** icon-to-heading spacing is consistent:
   - Each icon div should have the `mb-4` class (16px margin-bottom)
   - Measure the spacing between the icon and the heading for each card
   - All three cards should have identical spacing (16px ± 1px tolerance)

5. **Verify** card container structure is consistent:
   - Each card container should have: `rounded-lg bg-white p-6 shadow-md dark:bg-gray-800`
   - No card container should have an extra `mb-4` class
   - All three cards should have identical padding and styling

6. **Verify** all cards have the same height:
   - Measure the height of each card element
   - All three cards should have the same height (within 1-2px tolerance for rounding)
   - Cards should be aligned horizontally at the top

7. Take a screenshot with measurement annotations showing:
   - Icon-to-heading spacing for all three cards
   - Total height of each card
   - Confirmation that all measurements are consistent

8. **Verify** dark mode compatibility:
   - Toggle dark mode (if available)
   - Take a screenshot in dark mode
   - Verify all three cards maintain consistent spacing and height
   - Cards should display with dark background (dark:bg-gray-800)

9. **Verify** responsive layout:
   - Test on mobile viewport (375px width)
   - Cards should stack vertically but maintain consistent spacing
   - Test on desktop viewport (1024px width)
   - Cards should display in a three-column grid with consistent spacing

10. Take a final screenshot showing the complete balanced layout

## Success Criteria

- All three feature cards are visible on the homepage
- Icon-to-heading spacing is consistent across all three cards (16px)
- All icon divs have the `mb-4` class
- No card container divs have an extra `mb-4` class
- All three cards have the same height (within 1-2px tolerance)
- Cards are aligned at the top in the grid layout
- Layout appears balanced and professional
- Cards display correctly in both light and dark mode
- Responsive layout maintains consistency at all viewport sizes
- At least 3 screenshots are taken: light mode, measurements, dark mode

## Technical Details

- Icon spacing class: `mb-4` (margin-bottom: 1rem = 16px)
- Card structure should be identical for all three cards:
  - Container: `rounded-lg bg-white p-6 shadow-md dark:bg-gray-800`
  - Icon: `mb-4 text-3xl`
  - Heading: `mb-2 text-lg font-semibold text-gray-900 dark:text-white`
  - Description: `text-gray-600 dark:text-gray-300`
