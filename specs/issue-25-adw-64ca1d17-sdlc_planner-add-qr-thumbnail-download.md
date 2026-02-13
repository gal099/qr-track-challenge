# Feature: Add QR code thumbnail with download in analytics view

## Metadata
issue_number: `25`
adw_id: `64ca1d17`
issue_json: `{"number":25,"title":"Feature: Add QR code thumbnail with download in analytics view","body":"## Feature Description\n\nAdd a QR code thumbnail to the individual analytics page (\"QR Code Analytics\" card) so users can view and download the QR code without having to return to the home page to regenerate it.\n\n## Problem Statement\n\nCurrently, once a QR code is generated, there's no way to view or download it again from the analytics page. Users must:\n- Navigate back to home\n- Re-enter the URL\n- Generate the QR again to download it\n\nThis is inconvenient when users want to share the QR code after viewing analytics.\n\n## Proposed Solution\n\nAdd a QR code thumbnail (80x80px) to the \"QR Code Analytics\" card with:\n- **Visual**: Miniature QR code displayed on the right side of the card\n- **Interactive**: Hover shows download icon overlay\n- **Action**: Click anywhere on the thumbnail to download as PNG (256x256px)\n\n## Design Specs\n\n### Layout\n```\n┌─────────────────────────────────────────────────┐\n│ QR Code Analytics              [QR MINIATURE]   │\n│                                      80x80      │\n│ Target URL: https://...              ⬇️ hover   │\n│ Created: February 13th, 2026                    │\n│ Author: funko poppy                             │\n└─────────────────────────────────────────────────┘\n```\n\n### Technical Specs\n\n**Display Size (in card):**\n- 80x80px thumbnail\n- Positioned on the right side\n- Layout: `flex justify-between` to maintain spacing\n\n**Download Size:**\n- 256x256px PNG\n- Same size as generation preview (consistency)\n- File size: ~5-15KB\n- Quality: Sufficient for digital sharing and mobile scanning\n\n**Interaction:**\n- **Default state**: QR visible at 80x80px\n- **Hover state**: Semi-transparent overlay with download icon (⬇️)\n- **Click action**: Download QR as PNG (256x256px)\n- **Cursor**: `cursor-pointer` to indicate clickability\n- **Filename**: `qr-code-{shortCode}.png`\n\n## Implementation Details\n\n### Files to Modify\n\n#### 1. Analytics Dashboard Component (`src/components/analytics/AnalyticsDashboard.tsx`)\n- Add QRCodeSVG component import from `qrcode.react`\n- Render 80x80px QR thumbnail in the info card\n- Add hover state styling\n- Implement click handler to trigger download\n\n#### 2. Utility Function (new or in utils)\n- Create `downloadQRCode()` function:\n  - Generate QR at 256x256px\n  - Convert SVG to PNG canvas\n  - Trigger browser download with proper filename\n\n#### 3. Styling\n- Use Tailwind for hover effects\n- Overlay with semi-transparent background on hover\n- Download icon centered on hover\n- Smooth transitions\n\n## Implementation Approach\n\n### Option A: Client-side generation on-demand\n```typescript\n// Display: 80x80 QR in card\n<QRCodeSVG \n  value={shortUrl} \n  size={80}\n  fgColor={qrCode.fg_color}\n  bgColor={qrCode.bg_color}\n/>\n\n// Download: Generate 256x256 on click\nconst downloadQR = () => {\n  const canvas = document.createElement('canvas')\n  const svg = generateQRSVG(shortUrl, 256, colors)\n  // Convert to PNG and download\n}\n```\n\n### Option B: Store both sizes\n- Store/generate both 80x80 and 256x256 versions\n- Use data URLs or separate endpoints\n- *Note: Might be overkill for this use case*\n\n**Recommendation**: Use **Option A** (on-demand generation) - simpler, no storage needed.\n\n## Acceptance Criteria\n\n- [ ] QR thumbnail (80x80px) is visible in the \"QR Code Analytics\" card\n- [ ] Thumbnail is positioned on the right side without increasing card height\n- [ ] QR thumbnail respects the original colors (fg_color, bg_color) from generation\n- [ ] Hovering over thumbnail shows download icon overlay\n- [ ] Clicking thumbnail downloads QR as PNG (256x256px)\n- [ ] Downloaded file has proper naming: `qr-code-{shortCode}.png`\n- [ ] Download works in all major browsers (Chrome, Firefox, Safari, Edge)\n- [ ] Cursor changes to pointer on hover\n- [ ] Card layout remains unchanged (responsive behavior maintained)\n- [ ] No layout shift when QR loads\n- [ ] Works with all QR codes (different colors, URLs)\n\n## Edge Cases\n\n- Handle very long URLs in QR generation\n- Ensure colors with low contrast still generate readable QR codes\n- Mobile responsive: thumbnail should scale appropriately\n- Loading state if QR generation takes time (though should be instant)\n\n## Benefits\n\n✅ **Improved UX**: Download QR without leaving analytics  \n✅ **Consistency**: Same 256x256 size as generation preview  \n✅ **Discoverability**: QR always visible, not hidden behind a button  \n✅ **Intuitive**: Click-to-download is a familiar pattern  \n✅ **Lightweight**: Client-side generation, no additional storage\n\n## Technical Notes\n\n- Use existing `qrcode.react` library (already in dependencies)\n- SVG-to-PNG conversion can use Canvas API\n- Maintain color customization from original generation\n- Short code URL format: `{baseUrl}/r/{shortCode}`\n\n## Priority\n\nMedium - Quality of life improvement that enhances user experience\n\n## Labels\n\nenhancement, ui-improvement"}`

## Feature Description
Add a QR code thumbnail (80x80px) to the individual analytics page ("QR Code Analytics" card) so users can view and download the QR code without having to return to the home page to regenerate it. The thumbnail will display on the right side of the header card, show a download icon overlay on hover, and clicking it will download the QR code as a 256x256px PNG file with the proper naming convention (`qr-code-{shortCode}.png`).

## User Story
As a user viewing analytics for a QR code
I want to see and download the QR code directly from the analytics page
So that I can easily share the QR code without navigating back to regenerate it

## Problem Statement
Currently, once a QR code is generated, there's no way to view or download it again from the analytics page. Users must navigate back to home, re-enter the URL, and generate the QR code again to download it. This is inconvenient when users want to share the QR code after viewing analytics.

## Solution Statement
Add a QR code thumbnail (80x80px) to the "QR Code Analytics" header card with:
- **Visual**: Miniature QR code displayed on the right side using the original colors (fg_color, bg_color)
- **Interactive**: Hover shows semi-transparent overlay with download icon
- **Action**: Click anywhere on the thumbnail to download as PNG (256x256px)
- **Client-side generation**: Use the existing `qrcode.react` library to generate QR codes on-demand, no additional storage needed

## Relevant Files
Use these files to implement the feature:

- `src/components/analytics/AnalyticsDashboard.tsx` - Main component to modify; add QR thumbnail to the header card with hover/download functionality
- `src/app/api/analytics/[qrCodeId]/route.ts` - API route to modify; add `fg_color` and `bg_color` to the response so the component can render the QR with correct colors
- `src/lib/db.ts` - Database queries; the `getQRCodeById` already returns `fg_color` and `bg_color`, just need to ensure they're passed through
- `src/types/database.ts` - TypeScript types; already has `fg_color` and `bg_color` in `QRCode` interface
- `src/components/qr-generator/QRGenerator.tsx` - Reference for existing QR code generation patterns and download implementation
- `.claude/commands/test_e2e.md` - E2E test runner documentation
- `.claude/commands/e2e/test_qr_code_generation.md` - Reference E2E test file structure
- `src/components/analytics/__tests__/AnalyticsDashboard.test.tsx` - Existing unit tests to update

### New Files
- `.claude/commands/e2e/test_qr_thumbnail_download.md` - E2E test specification for the QR thumbnail download feature

## Implementation Plan
### Phase 1: Foundation
1. Update the analytics API to include `fg_color` and `bg_color` in the response
2. Update the `AnalyticsData` TypeScript interface in the component to include the new color fields

### Phase 2: Core Implementation
1. Add the QR code thumbnail to the header card using `qrcode.react` library
2. Implement the hover overlay with download icon
3. Implement the download functionality using Canvas API to convert QR to PNG

### Phase 3: Integration
1. Update existing unit tests to cover the new functionality
2. Create E2E test specification to validate the feature end-to-end
3. Ensure responsive design and cross-browser compatibility

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E Test Specification
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_qr_code_generation.md` to understand the E2E test structure
- Create `.claude/commands/e2e/test_qr_thumbnail_download.md` with test steps that:
  1. Navigate to the analytics page for an existing QR code
  2. Verify the QR thumbnail is visible in the header card
  3. Verify the QR thumbnail uses the correct colors
  4. Verify hover shows download overlay with icon
  5. Click the thumbnail and verify download triggers
  6. Verify the downloaded file has correct naming

### Step 2: Update Analytics API Response
- Modify `src/app/api/analytics/[qrCodeId]/route.ts` to include `fg_color` and `bg_color` in the `qr_code` object response
- The data is already available from `getQRCodeById()` - just pass it through to the response

### Step 3: Update AnalyticsDashboard Component TypeScript Interface
- Modify the `AnalyticsData` interface in `src/components/analytics/AnalyticsDashboard.tsx` to add `fg_color` and `bg_color` fields to the `qr_code` object

### Step 4: Add QR Thumbnail to Header Card
- Import `QRCodeSVG` from `qrcode.react` library
- Create the short URL using the pattern: `${window.location.origin}/r/${short_code}`
- Add the QR thumbnail (80x80px) to the header card, positioned on the right side
- Use `flex justify-between` layout to maintain proper spacing
- Ensure the QR uses `fg_color` and `bg_color` from the API response

### Step 5: Implement Hover Overlay
- Add a wrapper div around the QR thumbnail with `relative` positioning
- Add an overlay div with:
  - `absolute inset-0` positioning
  - Semi-transparent background (`bg-black/50`)
  - `opacity-0` by default, `opacity-100` on hover
  - Transition effect for smooth appearance
  - Download icon (arrow down) centered in the overlay
- Add `cursor-pointer` to indicate clickability

### Step 6: Implement Download Functionality
- Create a `handleDownloadQR` function that:
  1. Creates a hidden canvas element at 256x256px
  2. Uses the `qrcode` library (already available) to generate QR code data
  3. Draws the QR code on the canvas with correct colors
  4. Converts canvas to PNG data URL using `canvas.toDataURL('image/png')`
  5. Creates a download link and triggers click
  6. Uses filename: `qr-code-{shortCode}.png`
- Add `onClick` handler to the thumbnail wrapper to trigger download

### Step 7: Update Unit Tests
- Update `src/components/analytics/__tests__/AnalyticsDashboard.test.tsx` to:
  - Add `fg_color` and `bg_color` to mock data
  - Test that QR thumbnail is rendered
  - Test that download functionality works (mock canvas operations)
  - Test hover state behavior

### Step 8: Run Validation Commands
- Run all validation commands to ensure zero regressions
- Execute the E2E test to validate the feature works end-to-end

## Testing Strategy
### Unit Tests
- Test that QR thumbnail renders with correct dimensions (80x80)
- Test that QR thumbnail uses the colors from API response
- Test that hover overlay appears on mouse enter
- Test that download function is called on click
- Test that download creates file with correct naming convention
- Test error handling for edge cases

### Edge Cases
- Very long URLs in QR generation (should still generate valid QR)
- Custom colors with low contrast (should still render)
- Mobile responsive behavior (thumbnail should scale appropriately)
- Missing color data (fallback to default black/white)
- Browser compatibility for Canvas API and download

## Acceptance Criteria
- [ ] QR thumbnail (80x80px) is visible in the "QR Code Analytics" card
- [ ] Thumbnail is positioned on the right side without increasing card height
- [ ] QR thumbnail respects the original colors (fg_color, bg_color) from generation
- [ ] Hovering over thumbnail shows download icon overlay
- [ ] Clicking thumbnail downloads QR as PNG (256x256px)
- [ ] Downloaded file has proper naming: `qr-code-{shortCode}.png`
- [ ] Download works in all major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Cursor changes to pointer on hover
- [ ] Card layout remains unchanged (responsive behavior maintained)
- [ ] No layout shift when QR loads
- [ ] Works with all QR codes (different colors, URLs)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_qr_thumbnail_download.md` to validate this functionality works
- `cd /Users/juanbaez/Documents/qr-track-challenge && pnpm test` - Run unit tests to validate the feature works with zero regressions
- `cd /Users/juanbaez/Documents/qr-track-challenge && pnpm tsc --noEmit` - Run TypeScript checks to validate type safety
- `cd /Users/juanbaez/Documents/qr-track-challenge && pnpm build` - Run production build to validate the feature compiles correctly

## Notes
- The `qrcode.react` library is already installed and used in `QRGenerator.tsx` for preview functionality
- The download implementation pattern can be referenced from `QRGenerator.tsx` `handleDownload` function
- The Canvas API is well-supported across all major browsers
- Default colors should be black (#000000) foreground and white (#FFFFFF) background if not provided
- The short URL format is `{baseUrl}/r/{shortCode}` as established in the codebase
- Consider adding a loading state while the QR is being generated for download, though it should be near-instant
