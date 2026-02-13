# Bug: UI: Low Contrast Text - Input Placeholders and Copy Button Not Visible

## Metadata
issue_number: `12`
adw_id: `b0a25929`
issue_json: `{"number":12,"title":"UI: Low Contrast Text - Input Placeholders and Copy Button Not Visible","body":"## Bug Description\nSeveral text elements in the QR generator UI have insufficient color contrast, making them difficult or impossible to read.\n\n## Affected Elements\n\n### 1. Target URL Input Field\n- **Location:** Main QR generator form\n- **Issue:** Placeholder text \"the text is not visible\" appears in very light gray/white\n- **Impact:** Users cannot see the placeholder text to understand what to enter\n\n### 2. Color Code Labels\n- **Location:** Foreground Color and Background Color fields\n- **Issue:** Hex color codes (#000000, #FFFFFF) displayed in very light gray\n- **Impact:** Hard to read the color values\n\n### 3. Short URL Input Field\n- **Location:** Appears after clicking \"Generate QR Code\"\n- **Issue:** The generated short URL text (e.g., https://qr-track-challenge.vercel.app/r/alkXYfbW) has very low contrast\n- **Impact:** Users cannot easily read the generated short URL\n\n### 4. Copy Button\n- **Location:** Next to Short URL field\n- **Issue:** Button text \"Copy\" appears in very light color (almost white on light gray background)\n- **Impact:** Button text is barely visible\n\n## Expected Behavior\n- Input placeholder text should have sufficient contrast (WCAG AA: 4.5:1 minimum)\n- Color code labels should be clearly readable\n- Generated short URL should be displayed in dark, high-contrast text\n- Copy button should have visible, high-contrast text\n\n## Current Behavior\nAll mentioned text elements appear in very light colors (likely light gray or near-white) making them difficult to read against light backgrounds.\n\n## Steps to Reproduce\n1. Visit https://qr-track-challenge.vercel.app/\n2. Observe the placeholder text in \"Target URL\" field\n3. Observe the color code labels (#000000, #FFFFFF)\n4. Generate a QR code\n5. Observe the \"Short URL\" field text\n6. Observe the \"Copy\" button text\n\n## Suggested Fix\nUpdate text colors to ensure proper contrast ratios:\n- Input placeholders: Use gray-500 or darker\n- Color codes: Use gray-700 or darker\n- Short URL text: Use gray-900 or black\n- Copy button: Use proper button styling with dark text or white text on dark background\n\n## Accessibility Impact\nThis is a WCAG Level AA accessibility issue affecting readability for all users, especially those with visual impairments.\n\n## Screenshots\nSee attached screenshots showing the low contrast issues."}`

## Bug Description
Several text elements in the QR generator UI have insufficient color contrast, making them difficult or impossible to read. The affected elements include:

1. **Target URL Input Field** - Placeholder text appears in very light gray/white
2. **Color Code Labels** - Hex color codes (#000000, #FFFFFF) displayed in very light gray
3. **Short URL Input Field** - Generated short URL text has very low contrast
4. **Copy Button** - Button text "Copy" appears in very light color (almost white on light gray background)

This is a WCAG Level AA accessibility issue affecting readability for all users, especially those with visual impairments.

## Problem Statement
The QR Generator component (`src/components/qr-generator/QRGenerator.tsx`) has multiple text elements with missing or inadequate text color classes for light mode, causing poor readability against light backgrounds. The issue stems from:

1. Input fields missing explicit `text-gray-900` classes (only `dark:text-white` is specified)
2. Placeholder text lacking `placeholder:text-gray-500` styling
3. Copy button using `bg-gray-200` background with no explicit dark text color for light mode

## Solution Statement
Add explicit text color classes to all affected elements to ensure WCAG AA compliant contrast ratios (4.5:1 minimum):

1. Add `placeholder:text-gray-500` to the Target URL input
2. Add `text-gray-900` to hex color code spans (in addition to existing `dark:text-white`)
3. Add `text-gray-900` to the Short URL readonly input (in addition to existing `dark:text-white`)
4. Add `text-gray-700` to the Copy button for light mode styling

## Steps to Reproduce
1. Visit the application at localhost:3000 (or production URL)
2. Observe the placeholder text in "Target URL" field - barely visible
3. Observe the color code labels (#000000, #FFFFFF) - very faint
4. Generate a QR code by entering a URL and clicking "Generate QR Code"
5. Observe the "Short URL" field text - hard to read
6. Observe the "Copy" button text - nearly invisible

## Root Cause Analysis
The root cause is incomplete Tailwind CSS styling in the QRGenerator component. The component uses `dark:text-white` classes for dark mode but relies on inherited or default text colors for light mode. Since the component uses a white background (`bg-white`) and the inherited text color may be light (or not explicitly set to a dark value), the text appears with insufficient contrast.

Specific issues in `src/components/qr-generator/QRGenerator.tsx`:
- Line 148: Input field has no placeholder styling and no explicit light-mode text color
- Lines 169-171 and 203-205: Hex color spans only have `dark:text-white`
- Line 294: Short URL input only has `dark:text-white`
- Lines 298-304: Copy button lacks explicit text color for non-copied state in light mode

## Relevant Files
Use these files to fix the bug:

- `src/components/qr-generator/QRGenerator.tsx` - Main component containing all affected UI elements. This is the only file that needs modification:
  - Line 148: Target URL input needs `placeholder:text-gray-500` and `text-gray-900`
  - Lines 169-171: Foreground color hex span needs `text-gray-900`
  - Lines 203-205: Background color hex span needs `text-gray-900`
  - Line 294: Short URL input needs `text-gray-900`
  - Lines 298-304: Copy button needs `text-gray-700` for light mode
- `src/app/globals.css` - Global styles (for reference, no changes needed)
- `tailwind.config.ts` - Tailwind configuration confirming dark mode is class-based (for reference, no changes needed)
- `.claude/commands/test_e2e.md` - Instructions for running E2E tests
- `.claude/commands/e2e/test_qr_code_generation.md` - Existing E2E test for reference

### New Files
- `.claude/commands/e2e/test_low_contrast_fix.md` - E2E test to validate the contrast fix

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Fix Target URL Input Placeholder and Text Contrast
- Open `src/components/qr-generator/QRGenerator.tsx`
- Locate the Target URL input field (around line 142-149)
- Update the className to add `text-gray-900` and `placeholder:text-gray-500`:
  ```tsx
  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
  ```

### 2. Fix Foreground Color Hex Code Contrast
- Locate the foreground color picker button span (around line 169)
- Update the span className to add `text-gray-900`:
  ```tsx
  <span className="font-mono text-sm text-gray-900 dark:text-white">
  ```

### 3. Fix Background Color Hex Code Contrast
- Locate the background color picker button span (around line 203)
- Update the span className to add `text-gray-900`:
  ```tsx
  <span className="font-mono text-sm text-gray-900 dark:text-white">
  ```

### 4. Fix Short URL Input Text Contrast
- Locate the Short URL readonly input field (around line 290-295)
- Update the className to add `text-gray-900`:
  ```tsx
  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
  ```

### 5. Fix Copy Button Text Contrast
- Locate the Copy button (around line 296-305)
- Update the non-copied state styling to include explicit text color `text-gray-700`:
  ```tsx
  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    copied
      ? 'bg-green-500 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
  }`}
  ```

### 6. Create E2E Test for Contrast Validation
- Read `.claude/commands/e2e/test_qr_code_generation.md` for reference
- Create a new E2E test file at `.claude/commands/e2e/test_low_contrast_fix.md` that validates:
  - Placeholder text is visible in the Target URL field
  - Hex color codes are readable in both color picker buttons
  - After generating a QR code, the Short URL text is readable
  - The Copy button text is clearly visible
  - Take screenshots to document proper contrast

### 7. Run Validation Commands
- Execute all validation commands listed below to ensure zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_low_contrast_fix.md` to validate text contrast is fixed
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run type-check` - Run TypeScript type checking to validate no type errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run build` - Run production build to validate no build errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run lint` - Run linting to validate code quality

## Notes
- All text color changes use Tailwind's built-in color palette which ensures consistent design
- The `text-gray-900` provides excellent contrast (ratio > 10:1) against white backgrounds
- The `text-gray-700` on the Copy button provides good contrast (ratio > 4.5:1) against gray-200 background
- The `placeholder:text-gray-500` ensures placeholder text meets WCAG AA requirements
- Dark mode classes are preserved to maintain proper contrast in dark mode
- No new dependencies are required for this fix
