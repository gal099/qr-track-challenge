# Feature: Add logo to main screen

## Metadata
issue_number: `31`
adw_id: `2a8b5aed`
issue_json: `{"number":31,"title":"Add logo to main screen","body":"Add the company logo to the top of the landing page.\n\nPlease use the logo image attached to this issue and display it prominently on the main screen.\n\n**Acceptance criteria:**\n- Logo should be visible on the landing page\n- Logo should be properly sized and positioned\n- Image should be optimized for web use\n\n![Image](https://github.com/user-attachments/assets/2c2fc82e-378a-4de9-a368-73ebc9917c7c)"}`

## Feature Description
Add a company logo to the top of the QR Track landing page (main screen). The logo will be displayed prominently above the main heading to improve brand identity and visual hierarchy. The logo will be sourced from the GitHub issue attachment, downloaded, optimized for web use, and integrated into the Next.js application using best practices.

## User Story
As a visitor to the QR Track application
I want to see the company logo prominently displayed on the landing page
So that I can quickly identify the brand and have a more professional user experience

## Problem Statement
The current landing page lacks a visual brand identity element at the top of the page. Users landing on the application see only text-based headers without any logo or brand mark, which makes the page feel incomplete and less professional. A logo would enhance brand recognition and improve the overall visual appeal of the landing page.

## Solution Statement
We will download the logo image from the GitHub issue attachment, save it to a public assets directory in the Next.js project, optimize it for web use, and integrate it into the landing page (page.tsx) above the "QR Track" heading using Next.js Image component for optimal performance. The logo will be properly sized, centered, and responsive across different screen sizes.

## Relevant Files
Use these files to implement the feature:

- `src/app/page.tsx` - Main landing page component where the logo will be displayed. Currently shows the "QR Track" heading and QR generator. We'll add the logo above the heading in the header section.
- `src/app/globals.css` - Global styles file where we may need to add custom styles for the logo if needed (for sizing, spacing, or responsive behavior).
- `src/app/layout.tsx` - Root layout that includes metadata. We may need to add favicon reference if the logo will also serve as the site icon.
- `next.config.mjs` - Next.js configuration file where we may need to configure image optimization settings if using external image domains.
- `.claude/commands/test_e2e.md` - E2E test runner command documentation to understand how to create E2E tests.
- `.claude/commands/e2e/test_qr_code_generation.md` - Example E2E test file to understand the test structure and format.

### New Files

- `public/logo.png` (or appropriate format) - The company logo image downloaded from the GitHub issue and optimized for web use.
- `.claude/commands/e2e/test_logo_display.md` - E2E test file to validate the logo is properly displayed on the landing page.

## Implementation Plan

### Phase 1: Foundation
1. Create the `public` directory if it doesn't exist (standard Next.js location for static assets)
2. Download the logo image from the GitHub issue attachment URL: `https://github.com/user-attachments/assets/2c2fc82e-378a-4de9-a368-73ebc9917c7c`
3. Optimize the image for web use (check file size, ensure reasonable dimensions, convert to appropriate format if needed)
4. Save the optimized logo to `public/logo.png` (or appropriate extension based on the image format)

### Phase 2: Core Implementation
1. Update `src/app/page.tsx` to import and display the logo using Next.js Image component
2. Position the logo above the "QR Track" heading in the header section
3. Apply proper styling for size, centering, and spacing using Tailwind CSS classes
4. Ensure the logo is responsive and looks good on mobile, tablet, and desktop screens
5. Add alt text for accessibility

### Phase 3: Integration
1. Test the logo display in development mode to ensure it loads correctly
2. Verify the logo doesn't break existing layout or styling
3. Ensure the logo works in both light and dark mode (the page supports dark mode)
4. Create an E2E test to validate the logo is visible and properly positioned

## Step by Step Tasks

### 1. Create public directory and download logo
- Create the `public` directory in the project root if it doesn't exist
- Download the logo image from `https://github.com/user-attachments/assets/2c2fc82e-378a-4de9-a368-73ebc9917c7c`
- Save it to `public/logo.png` (or appropriate extension based on actual image format)
- Verify the image is web-optimized (reasonable file size and dimensions)

### 2. Update landing page to display logo
- Open `src/app/page.tsx`
- Import the Next.js Image component if not already imported
- Add the logo above the h1 "QR Track" heading in the header section
- Use Next.js Image component with proper width, height, and priority props
- Center the logo horizontally using Tailwind CSS classes
- Add appropriate margin/padding for spacing
- Include descriptive alt text: "QR Track Logo"
- Ensure the logo is responsive (looks good on all screen sizes)

### 3. Test logo display in light and dark mode
- Start the development server
- Navigate to the landing page
- Verify the logo is visible and properly positioned
- Check that the logo looks good in both light and dark mode
- Test on different screen sizes (mobile, tablet, desktop)

### 4. Create E2E test for logo display
- Read `.claude/commands/test_e2e.md` to understand the E2E test structure
- Read `.claude/commands/e2e/test_qr_code_generation.md` as an example
- Create `.claude/commands/e2e/test_logo_display.md` with test steps to:
  - Navigate to the landing page
  - Verify the logo element exists
  - Verify the logo is visible (has src attribute pointing to `/logo.png` or correct path)
  - Verify the logo has proper alt text
  - Take screenshots showing the logo on the page
  - Verify the logo appears above the "QR Track" heading

### 5. Run validation commands
- Execute all validation commands listed in the Validation Commands section
- Ensure all tests pass with zero errors
- Execute the new E2E test for logo display
- Fix any issues that arise

## Testing Strategy

### Unit Tests
- No specific unit tests needed for this feature (static image display)
- Existing tests should continue to pass without modifications

### Edge Cases
- Logo file doesn't exist or fails to load: Next.js Image component will show broken image or placeholder
- Large image file size: Ensure the logo is optimized to avoid slow page loads
- Dark mode display: Verify the logo is visible and looks good on dark backgrounds
- Mobile viewport: Ensure the logo scales appropriately and doesn't overflow or cause layout shifts
- Accessibility: Ensure alt text is present and descriptive for screen readers

## Acceptance Criteria
- Logo is visible on the landing page above the "QR Track" heading
- Logo is properly sized (not too large or too small)
- Logo is centered horizontally on the page
- Logo is responsive and looks good on mobile, tablet, and desktop screens
- Logo works in both light and dark mode
- Logo has descriptive alt text for accessibility
- Logo file is optimized for web use (reasonable file size)
- Logo loads quickly without causing layout shifts
- E2E test validates logo display successfully
- All existing tests continue to pass

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run type-check` - Run TypeScript type checking to ensure no type errors
- `npm run lint` - Run ESLint to ensure code follows style guidelines
- `npm run build` - Build the application to ensure no build errors and logo is properly bundled
- `npm run dev` - Start development server and manually verify logo displays correctly at http://localhost:3000
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_logo_display.md` to validate logo display functionality
- `npm run test` - Run existing tests to ensure no regressions

## Notes
- The logo image is provided via GitHub issue attachment. We'll need to download it and inspect it to determine the actual file format and dimensions.
- Next.js Image component provides automatic optimization, so we should use it instead of a regular `<img>` tag.
- The logo should work well in both light and dark mode - we may need to adjust opacity, add a background, or use a logo variant depending on the image content.
- Consider using the `priority` prop on the Image component since the logo is above the fold.
- If the logo has transparency and doesn't work well in dark mode, we may need to add a background or use CSS filters.
- The landing page already has a responsive design with Tailwind CSS, so we should follow the same pattern for the logo.
