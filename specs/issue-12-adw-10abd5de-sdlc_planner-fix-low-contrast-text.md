# Bug: UI Low Contrast Text - Input Placeholders and Copy Button Not Visible

## Metadata
issue_number: `12`
adw_id: `10abd5de`
issue_json: `{"number":12,"title":"UI: Low Contrast Text - Input Placeholders and Copy Button Not Visible","body":"## Bug Description\nSeveral text elements in the QR generator UI have insufficient color contrast, making them difficult or impossible to read.\n\n## Affected Elements\n\n### 1. Target URL Input Field\n- **Location:** Main QR generator form\n- **Issue:** Placeholder text \"the text is not visible\" appears in very light gray/white\n- **Impact:** Users cannot see the placeholder text to understand what to enter\n\n### 2. Color Code Labels\n- **Location:** Foreground Color and Background Color fields\n- **Issue:** Hex color codes (#000000, #FFFFFF) displayed in very light gray\n- **Impact:** Hard to read the color values\n\n### 3. Short URL Input Field\n- **Location:** Appears after clicking \"Generate QR Code\"\n- **Issue:** The generated short URL text (e.g., https://qr-track-challenge.vercel.app/r/alkXYfbW) has very low contrast\n- **Impact:** Users cannot easily read the generated short URL\n\n### 4. Copy Button\n- **Location:** Next to Short URL field\n- **Issue:** Button text \"Copy\" appears in very light color (almost white on light gray background)\n- **Impact:** Button text is barely visible\n\n## Expected Behavior\n- Input placeholder text should have sufficient contrast (WCAG AA: 4.5:1 minimum)\n- Color code labels should be clearly readable\n- Generated short URL should be displayed in dark, high-contrast text\n- Copy button should have visible, high-contrast text\n\n## Current Behavior\nAll mentioned text elements appear in very light colors (likely light gray or near-white) making them difficult to read against light backgrounds.\n\n## Steps to Reproduce\n1. Visit https://qr-track-challenge.vercel.app/\n2. Observe the placeholder text in \"Target URL\" field\n3. Observe the color code labels (#000000, #FFFFFF)\n4. Generate a QR code\n5. Observe the \"Short URL\" field text\n6. Observe the \"Copy\" button text\n\n## Suggested Fix\nUpdate text colors to ensure proper contrast ratios:\n- Input placeholders: Use gray-500 or darker\n- Color codes: Use gray-700 or darker\n- Short URL text: Use gray-900 or black\n- Copy button: Use proper button styling with dark text or white text on dark background\n\n## Accessibility Impact\nThis is a WCAG Level AA accessibility issue affecting readability for all users, especially those with visual impairments.\n\n## Screenshots\nSee attached screenshots showing the low contrast issues."}`

## Bug Description
Several text elements in the QR generator UI have insufficient color contrast, making them difficult or impossible to read. The affected elements include the Target URL placeholder text, color code hex labels, the generated Short URL text, and the Copy button text. All these elements appear in very light colors against light backgrounds, failing WCAG AA accessibility guidelines.

## Problem Statement
The QRGenerator component (`src/components/qr-generator/QRGenerator.tsx`) uses Tailwind CSS classes that do not explicitly set light-mode text colors for several elements, causing them to inherit default colors that have insufficient contrast:
1. Input placeholders lack explicit `placeholder:text-gray-*` styling
2. Hex color code spans only have `dark:text-white` without light-mode text color
3. Short URL input lacks explicit light-mode text color
4. Copy button has `bg-gray-200` background but no explicit text color

## Solution Statement
Add explicit Tailwind CSS text color classes to all affected elements in the QRGenerator component:
1. Add `placeholder:text-gray-500` to input fields for WCAG-compliant placeholder contrast
2. Add `text-gray-700` (light mode) to hex color code spans alongside existing `dark:text-white`
3. Add `text-gray-900` to Short URL input for high-contrast readable text
4. Add `text-gray-700` to the Copy button for visible button text in light mode

## Steps to Reproduce
1. Visit the QR generator page
2. Observe the placeholder text in "Target URL" field - barely visible
3. Observe the color code labels (#000000, #FFFFFF) - very light gray
4. Generate a QR code by entering a URL and clicking "Generate QR Code"
5. Observe the "Short URL" field text - low contrast
6. Observe the "Copy" button text - almost invisible on light gray background

## Root Cause Analysis
The root cause is missing explicit text color classes in the Tailwind CSS styling:

1. **Target URL Input (line 148)**: The input element has `dark:text-white` for dark mode but relies on browser defaults for light mode placeholder text, which can vary and often defaults to very light gray.

2. **Color Code Labels (lines 169-171, 202-204)**: The `<span>` elements showing hex values only specify `dark:text-white` but have no explicit light-mode text color, causing them to inherit potentially light colors.

3. **Short URL Input (line 294)**: Similar to above, only `dark:text-white` is specified with no light-mode text color.

4. **Copy Button (lines 298-305)**: The non-copied state uses `bg-gray-200` background but doesn't specify a text color, defaulting to potentially light text.

## Relevant Files
Use these files to fix the bug:

- `src/components/qr-generator/QRGenerator.tsx` - The main QR generator component containing all affected UI elements. This is the only file that needs modifications.
- `.claude/commands/test_e2e.md` - E2E test runner documentation for understanding how to validate the fix
- `.claude/commands/e2e/test_qr_code_generation.md` - Existing E2E test for QR code generation, useful as reference for creating a new contrast-focused E2E test

### New Files
- `.claude/commands/e2e/test_low_contrast_fix.md` - New E2E test file to validate that text contrast issues are fixed and all UI elements are visible

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Fix Target URL Input Placeholder Contrast
- Open `src/components/qr-generator/QRGenerator.tsx`
- Locate the Target URL input element (around line 142-149)
- Add `placeholder:text-gray-500` class to ensure placeholder text has sufficient contrast
- The updated className should include both light and dark mode placeholder styling

### 2. Fix Foreground Color Hex Code Label Contrast
- Locate the foreground color hex code span element (around line 169-171)
- Add `text-gray-700` class before the existing `dark:text-white` class
- This ensures the hex code (#000000) is readable in light mode

### 3. Fix Background Color Hex Code Label Contrast
- Locate the background color hex code span element (around line 202-204)
- Add `text-gray-700` class before the existing `dark:text-white` class
- This ensures the hex code (#FFFFFF) is readable in light mode

### 4. Fix Short URL Input Text Contrast
- Locate the Short URL readonly input element (around line 290-295)
- Add `text-gray-900` class before the existing `dark:text-white` class
- This ensures the generated short URL is clearly readable in light mode

### 5. Fix Copy Button Text Contrast
- Locate the Copy button element (around line 296-305)
- Add `text-gray-700` class to the non-copied state styling
- The button should have dark text on the light gray background for proper contrast

### 6. Create E2E Test File for Low Contrast Fix Validation
- Read `.claude/commands/e2e/test_qr_code_generation.md` for format reference
- Create a new E2E test file at `.claude/commands/e2e/test_low_contrast_fix.md` that validates:
  - Target URL placeholder text is visible (gray-500 color)
  - Foreground color hex code (#000000) is clearly readable
  - Background color hex code (#FFFFFF) is clearly readable
  - After generating QR code, the Short URL text is clearly readable
  - Copy button text is visible with proper contrast
- Include screenshots at each step to document the fix

### 7. Run Validation Commands
Execute the validation commands to ensure the bug is fixed with zero regressions.

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run lint` - Run linting to check for any style issues
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run type-check` - Run TypeScript type checking to ensure no type errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run build` - Run production build to verify no build errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run test` - Run all tests to ensure no regressions
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_low_contrast_fix.md` E2E test file to validate the contrast fixes are working correctly with visual verification via screenshots

## Notes
- All fixes are CSS-only changes using Tailwind utility classes - no JavaScript logic changes required
- The fixes follow WCAG AA accessibility guidelines (4.5:1 minimum contrast ratio for normal text)
- The dark mode styling (`dark:text-white`) is already in place and should not be modified
- Consider using `text-gray-700` for secondary text and `text-gray-900` for primary text to establish consistent hierarchy
- The placeholder contrast of `gray-500` provides approximately 4.6:1 contrast ratio against white background, meeting WCAG AA requirements
