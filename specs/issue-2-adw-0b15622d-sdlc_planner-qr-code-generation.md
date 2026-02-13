# Feature: QR Code Generation

## Metadata
issue_number: `2`
adw_id: `0b15622d`
issue_json: `{"number":2,"title":"QR Code Generation Feature","body":"Implement QR code generation with real-time preview and customization.\n\n**Tasks:**\n- Create form for URL input with validation\n- Integrate QR code library (qrcode)\n- Add real-time preview\n- Implement color customization (foreground/background)\n- Add download as PNG functionality\n- Write unit tests\n- Add integration tests\n\n**Acceptance Criteria:**\n- Form validates URL input\n- QR code displays on input change\n- Color customization works\n- Download button generates PNG file\n- Tests pass with good coverage"}`

## Feature Description
Implement a complete QR code generation feature with real-time preview capability and color customization. Users can enter a URL, customize foreground and background colors, see a live preview as they type or change colors, and download the final QR code as a PNG file. The feature integrates with the existing analytics tracking system to provide scan insights.

## User Story
As a user
I want to generate customizable QR codes with real-time preview
So that I can quickly create branded QR codes and see exactly how they look before downloading

## Problem Statement
Currently, the QR code generation requires users to click a "Generate" button to see the result. Users cannot preview the QR code in real-time as they customize colors or modify the URL. This creates a friction-heavy workflow where users must repeatedly generate to see changes. Additionally, the codebase lacks comprehensive unit and integration tests to ensure reliability.

## Solution Statement
Enhance the existing QR code generator component to provide:
1. Real-time QR code preview that updates as the user types a URL or changes colors (client-side generation using the qrcode library)
2. Maintain the existing "Generate" button flow for saving to the database with tracking URL
3. Comprehensive unit tests for validation logic and utility functions
4. Integration tests for the API endpoints
5. E2E tests to validate the complete user flow

## Relevant Files
Use these files to implement the feature:

- `src/components/qr-generator/QRGenerator.tsx` - Main UI component that handles form input, color pickers, and result display. Will be enhanced with real-time preview functionality.
- `src/lib/validations.ts` - Contains Zod schema for URL and color validation. Used for input validation in both client and server.
- `src/lib/utils.ts` - Utility functions including URL validation helpers. Will be tested.
- `src/app/api/qr/generate/route.ts` - API endpoint for QR code generation and database persistence. Will have integration tests.
- `src/lib/db.ts` - Database query functions for QR codes. May need mocking in tests.
- `src/types/database.ts` - TypeScript type definitions for database entities.
- `package.json` - Project dependencies. Testing libraries need to be added.
- `.claude/commands/test_e2e.md` - Reference for creating E2E test format.
- `.claude/commands/e2e/test_basic_query.md` - Example E2E test format to follow.

### New Files
- `src/components/qr-generator/__tests__/QRGenerator.test.tsx` - Unit tests for the QRGenerator component
- `src/lib/__tests__/validations.test.ts` - Unit tests for validation schemas
- `src/lib/__tests__/utils.test.ts` - Unit tests for utility functions
- `src/app/api/qr/generate/__tests__/route.test.ts` - Integration tests for the generate API endpoint
- `.claude/commands/e2e/test_qr_code_generation.md` - E2E test file for validating QR code generation flow
- `jest.config.js` - Jest configuration for running tests
- `jest.setup.js` - Jest setup file for testing environment

## Implementation Plan
### Phase 1: Foundation
Set up the testing infrastructure by installing Jest, React Testing Library, and necessary dependencies. Create Jest configuration files and test setup utilities.

### Phase 2: Core Implementation
1. Enhance the QRGenerator component with real-time preview functionality using client-side QR code generation
2. Implement debounced preview updates to avoid excessive re-rendering
3. Add visual feedback during preview generation

### Phase 3: Testing
1. Write unit tests for validation schemas and utility functions
2. Write component tests for the QRGenerator with real-time preview
3. Write integration tests for the API endpoint
4. Create E2E test specification for full user flow validation

### Phase 4: Integration
Ensure all tests pass and the real-time preview integrates seamlessly with the existing "Generate" button flow that persists to the database.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Set Up Testing Infrastructure
- Install testing dependencies: `pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest @types/jest`
- Create `jest.config.js` at project root with Next.js configuration
- Create `jest.setup.js` for test environment setup (extend expect with jest-dom matchers)
- Add test scripts to `package.json`: `"test": "jest"`, `"test:watch": "jest --watch"`, `"test:coverage": "jest --coverage"`

### Step 2: Create E2E Test Specification
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_basic_query.md` for E2E test format
- Create `.claude/commands/e2e/test_qr_code_generation.md` with test steps:
  - Navigate to homepage
  - Verify QR generator form elements are present
  - Enter a valid URL in the input field
  - Verify real-time preview updates
  - Change foreground color using color picker
  - Verify preview reflects color change
  - Change background color using color picker
  - Verify preview reflects color change
  - Click "Generate QR Code" button
  - Verify success result with QR code image, short URL, and analytics link
  - Click "Download PNG" button
  - Verify download initiates
  - Capture screenshots at each key step

### Step 3: Write Unit Tests for Validation Schema
- Create `src/lib/__tests__/validations.test.ts`
- Test `generateQRCodeSchema` with:
  - Valid URL input (https://example.com)
  - Invalid URL formats (missing protocol, malformed)
  - Valid hex color formats (#000000, #FFFFFF)
  - Invalid hex color formats (missing #, wrong length, invalid chars)
  - Default value application when colors omitted
  - Edge cases (empty URL, very long URLs)

### Step 4: Write Unit Tests for Utility Functions
- Create `src/lib/__tests__/utils.test.ts`
- Test `isValidUrl` function:
  - Valid HTTP URLs
  - Valid HTTPS URLs
  - Invalid protocols (ftp://, file://)
  - Malformed URLs
  - Empty strings
- Test `isValidHexColor` function:
  - Valid 6-character hex colors
  - Invalid formats (3-char, 8-char, no hash)
- Test `parseUserAgent` function:
  - Mobile device detection
  - Tablet device detection
  - Desktop device detection
  - Browser extraction
  - Unknown user agent handling

### Step 5: Add Real-Time QR Code Preview
- Modify `src/components/qr-generator/QRGenerator.tsx`:
  - Import `qrcode` library for client-side generation
  - Add state for `previewDataUrl` to store the live preview
  - Create `generatePreview` async function that generates QR code client-side
  - Add `useEffect` hook that calls `generatePreview` when URL, fgColor, or bgColor changes
  - Implement debouncing (300ms) to avoid excessive regeneration
  - Add preview section that shows the QR code before "Generate" is clicked
  - Add loading state indicator during preview generation
  - Show placeholder or message when URL is empty/invalid

### Step 6: Write Component Tests for QRGenerator
- Create `src/components/qr-generator/__tests__/QRGenerator.test.tsx`
- Test initial render:
  - URL input field is present
  - Color picker buttons are present
  - Generate button is present and disabled when URL is empty
- Test URL input:
  - Input accepts text
  - Generate button enables when valid URL entered
- Test color pickers:
  - Foreground color picker opens on click
  - Background color picker opens on click
  - Color selection updates display
- Test real-time preview:
  - Preview appears after entering valid URL (debounced)
  - Preview updates when colors change
  - Preview shows loading state during generation
- Test form submission:
  - Generate button triggers API call
  - Loading state shows during submission
  - Success result displays QR code, short URL, analytics link
  - Error state displays error message
- Test download functionality:
  - Download button creates anchor element with correct attributes
  - Download triggers with correct filename

### Step 7: Write Integration Tests for API Endpoint
- Create `src/app/api/qr/generate/__tests__/route.test.ts`
- Mock `@vercel/postgres` sql function
- Mock `nanoid` for deterministic short codes
- Test POST /api/qr/generate:
  - Valid request returns success response with expected shape
  - Missing target_url returns 400 error
  - Invalid URL format returns 400 error
  - Invalid color format returns 400 error
  - Database error returns 500 error
  - Response includes qr_code_id, short_code, short_url, target_url, qr_code_data_url, analytics_url

### Step 8: Run All Validation Commands
- Run `pnpm test` to execute all unit and integration tests
- Run `pnpm type-check` to verify TypeScript compilation
- Run `pnpm build` to verify production build succeeds
- Run `pnpm lint` to verify no linting errors
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_qr_code_generation.md` to validate E2E functionality

## Testing Strategy
### Unit Tests
- **Validation Tests**: Test Zod schemas with valid/invalid inputs, edge cases, and default values
- **Utility Tests**: Test `isValidUrl`, `isValidHexColor`, `parseUserAgent` functions with various inputs
- **Component Tests**: Test QRGenerator rendering, user interactions, state changes, and real-time preview behavior

### Edge Cases
- Empty URL input
- Very long URLs (>2000 characters)
- URLs with special characters and query parameters
- Invalid URL protocols (ftp://, file://, javascript:)
- Malformed hex colors
- Same foreground and background colors (low contrast)
- Network failures during API call
- Slow network conditions (preview generation race conditions)
- Rapid color changes (debounce handling)
- Browser clipboard API unavailable (copy button fallback)

## Acceptance Criteria
- [ ] Form validates URL input with clear error messages for invalid formats
- [ ] QR code preview displays in real-time as user types URL (with debouncing)
- [ ] QR code preview updates when foreground color is changed
- [ ] QR code preview updates when background color is changed
- [ ] Generate button saves QR code to database and returns tracking URL
- [ ] Download button generates and downloads PNG file with correct name
- [ ] All unit tests pass with >80% code coverage for new code
- [ ] All integration tests pass
- [ ] E2E test validates complete user flow
- [ ] TypeScript compilation succeeds without errors
- [ ] Production build succeeds without errors
- [ ] No linting errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `pnpm test` - Run all unit and integration tests to validate feature works with zero regressions
- `pnpm test:coverage` - Run tests with coverage report to verify adequate test coverage
- `pnpm type-check` - Run TypeScript compiler to verify no type errors
- `pnpm build` - Run production build to verify feature compiles correctly
- `pnpm lint` - Run ESLint to verify no linting errors
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_qr_code_generation.md` to validate this functionality works

## Notes
- The `qrcode` library is already installed (`"qrcode": "^1.5.3"`) and used in the API route, so we can use it client-side for preview generation as well
- The `react-colorful` library is already installed and provides the `HexColorPicker` component used in the existing implementation
- Real-time preview generation happens client-side and does not persist to database - only the "Generate" button flow saves to the database with a tracking URL
- Consider adding a toast notification for successful copy-to-clipboard action in future iterations
- The preview QR code will encode a placeholder URL (the target URL directly) while the generated QR code encodes the tracking short URL - this is intentional so users see what their URL looks like
- For testing, we need to mock the database calls since they require a Vercel Postgres connection
