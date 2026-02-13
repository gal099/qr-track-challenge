# Feature: QR Code Generation

## Metadata
issue_number: `2`
adw_id: `80778bfe`
issue_json: `{"number":2,"title":"QR Code Generation Feature","body":"Implement QR code generation with real-time preview and customization.\n\n**Tasks:**\n- Create form for URL input with validation\n- Integrate QR code library (qrcode)\n- Add real-time preview\n- Implement color customization (foreground/background)\n- Add download as PNG functionality\n- Write unit tests\n- Add integration tests\n\n**Acceptance Criteria:**\n- Form validates URL input\n- QR code displays on input change\n- Color customization works\n- Download button generates PNG file\n- Tests pass with good coverage"}`

## Feature Description
Implement a complete QR code generation feature with real-time preview capability and color customization. Users can enter a URL, customize foreground and background colors, see a live preview as they modify inputs, and download the final QR code as a PNG file. The feature integrates with the existing short URL system and analytics tracking to provide scan insights.

## User Story
As a user
I want to generate customizable QR codes with real-time preview
So that I can quickly create branded QR codes and see exactly how they look before saving them

## Problem Statement
Users need the ability to generate QR codes from URLs with customizable colors and the ability to track scan analytics. The current implementation has the core UI and API in place but lacks comprehensive test coverage and a real-time preview feature that updates as the user types or changes colors without requiring a "Generate" button click.

## Solution Statement
Enhance the existing QR code generator to provide:
1. Real-time QR code preview that updates as the user types a URL or changes colors (client-side generation using the qrcode library)
2. Maintain the existing "Generate" button flow for saving to the database with tracking URL
3. Comprehensive unit tests for validation logic and utility functions
4. Integration tests for the API endpoints
5. E2E tests to validate the complete user flow

## Relevant Files
Use these files to implement the feature:

- `src/components/qr-generator/QRGenerator.tsx` - Main UI component that handles form input, color pickers, and result display. Will be enhanced with real-time preview functionality.
- `src/lib/validations.ts` - Contains Zod schema for URL and color validation. Used for input validation in both client and server. Will have unit tests written.
- `src/lib/utils.ts` - Utility functions including URL validation helpers (`isValidUrl`, `isValidHexColor`, `parseUserAgent`). Will have unit tests written.
- `src/app/api/qr/generate/route.ts` - API endpoint for QR code generation and database persistence. Will have integration tests written.
- `src/lib/db.ts` - Database query functions for QR codes. Will need mocking in tests.
- `src/types/database.ts` - TypeScript type definitions for database entities.
- `package.json` - Project dependencies. Testing libraries need to be added.
- `.claude/commands/test_e2e.md` - Reference for creating E2E test format.
- `.claude/commands/e2e/test_basic_query.md` - Example E2E test format to follow.

### New Files
- `src/lib/__tests__/validations.test.ts` - Unit tests for validation schemas
- `src/lib/__tests__/utils.test.ts` - Unit tests for utility functions
- `src/components/qr-generator/__tests__/QRGenerator.test.tsx` - Unit tests for the QRGenerator component
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
- Create `jest.config.js` at project root with Next.js configuration:
  ```js
  const nextJest = require('next/jest')
  const createJestConfig = nextJest({ dir: './' })
  const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  }
  module.exports = createJestConfig(customJestConfig)
  ```
- Create `jest.setup.js` for test environment setup:
  ```js
  import '@testing-library/jest-dom'
  ```
- Add test scripts to `package.json`:
  - `"test": "jest"`
  - `"test:watch": "jest --watch"`
  - `"test:coverage": "jest --coverage"`

### Step 2: Create E2E Test Specification
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_basic_query.md` for E2E test format
- Create `.claude/commands/e2e/test_qr_code_generation.md` with test steps:
  - Navigate to homepage at http://localhost:3000
  - Verify QR generator form elements are present (URL input, color pickers, Generate button)
  - Take screenshot of initial state
  - Enter a valid URL in the input field (e.g., "https://example.com")
  - Take screenshot of URL entered state
  - Click foreground color picker button
  - Select a new foreground color (e.g., blue #0000FF)
  - Verify color picker closes when clicking outside
  - Click background color picker button
  - Select a new background color (e.g., yellow #FFFF00)
  - Take screenshot showing customized colors
  - Click "Generate QR Code" button
  - Wait for loading to complete
  - Verify success result displays with:
    - QR code image
    - Short URL field
    - Copy button
    - Download PNG button
    - View Analytics button
  - Take screenshot of generated result
  - Click "Download PNG" button
  - Verify download initiates (check download attribute on anchor element)
  - Take screenshot of final state

### Step 3: Write Unit Tests for Validation Schema
- Create `src/lib/__tests__/validations.test.ts`
- Test `generateQRCodeSchema` with:
  - Valid URL input (https://example.com) - should pass
  - Invalid URL format (missing protocol) - should fail with "Invalid URL format"
  - Invalid URL format (malformed) - should fail
  - Valid hex color formats (#000000, #FFFFFF, #AbCdEf) - should pass
  - Invalid hex color formats (missing #, wrong length, invalid chars) - should fail with "Invalid hex color format"
  - Default value application when colors omitted - should default to #000000/#FFFFFF
  - Empty URL - should fail with "URL is required"
  - Edge case: URL with query parameters and fragments - should pass

### Step 4: Write Unit Tests for Utility Functions
- Create `src/lib/__tests__/utils.test.ts`
- Test `isValidUrl` function:
  - Valid HTTP URLs (http://example.com) - return true
  - Valid HTTPS URLs (https://example.com) - return true
  - Invalid protocols (ftp://example.com, file://path) - return false
  - Malformed URLs (not-a-url) - return false
  - Empty strings - return false
- Test `isValidHexColor` function:
  - Valid 6-character hex colors (#000000, #FFFFFF, #AbCdEf) - return true
  - Invalid formats (000000 without #, #FFF 3-char, #00000000 8-char) - return false
- Test `parseUserAgent` function:
  - Mobile device user agent - return { device_type: 'mobile', browser: '...' }
  - Tablet device user agent - return { device_type: 'tablet', browser: '...' }
  - Desktop device user agent - return { device_type: 'desktop', browser: '...' }
  - Unknown/empty user agent - return { device_type: 'desktop', browser: 'unknown' }
  - Extract correct browser name (Chrome, Firefox, Safari, etc.)

### Step 5: Add Real-Time QR Code Preview
- Modify `src/components/qr-generator/QRGenerator.tsx`:
  - Import `QRCode` from 'qrcode' for client-side generation
  - Add state: `const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)`
  - Add state: `const [isPreviewLoading, setIsPreviewLoading] = useState(false)`
  - Create `generatePreview` async function:
    ```tsx
    const generatePreview = async () => {
      if (!targetUrl || !isValidUrl(targetUrl)) {
        setPreviewDataUrl(null)
        return
      }
      setIsPreviewLoading(true)
      try {
        const dataUrl = await QRCode.toDataURL(targetUrl, {
          color: { dark: fgColor, light: bgColor },
          width: 256,
          margin: 2,
        })
        setPreviewDataUrl(dataUrl)
      } catch (err) {
        setPreviewDataUrl(null)
      } finally {
        setIsPreviewLoading(false)
      }
    }
    ```
  - Add `useEffect` with debouncing (300ms) that calls `generatePreview` when URL or colors change
  - Add preview section above the Generate button:
    - Show loading spinner when `isPreviewLoading` is true
    - Show QR code preview when `previewDataUrl` exists
    - Show placeholder text "Enter a valid URL to see preview" when URL is empty/invalid
  - Keep existing result section for the generated QR code with tracking URL

### Step 6: Write Component Tests for QRGenerator
- Create `src/components/qr-generator/__tests__/QRGenerator.test.tsx`
- Mock the fetch API for API calls
- Mock the qrcode library for client-side generation
- Test initial render:
  - URL input field is present with correct label
  - Foreground color picker button is present showing #000000
  - Background color picker button is present showing #FFFFFF
  - Generate button is present and disabled when URL is empty
  - Preview section shows placeholder message
- Test URL input:
  - User can type in the URL input
  - Generate button becomes enabled with valid URL
  - Preview updates after debounce delay (test with fake timers)
- Test color pickers:
  - Clicking foreground color button opens color picker
  - Clicking background color button opens color picker
  - Clicking outside closes color picker
- Test real-time preview (mock QRCode.toDataURL):
  - Preview shows loading state initially
  - Preview displays QR code image when URL is valid
  - Preview clears when URL becomes invalid
  - Preview updates when colors change
- Test form submission:
  - Clicking Generate button calls /api/qr/generate
  - Loading state shows during API call
  - Success response displays result section with QR code, short URL, download and analytics buttons
  - Error response displays error message
- Test download:
  - Download button creates anchor with href pointing to data URL
  - Download attribute is set to 'qr-code.png'

### Step 7: Write Integration Tests for API Endpoint
- Create `src/app/api/qr/generate/__tests__/route.test.ts`
- Mock `@vercel/postgres` sql function to return controlled data
- Mock `nanoid` for deterministic short codes (e.g., always return 'test1234')
- Test POST /api/qr/generate:
  - Valid request:
    - Request: `{ target_url: 'https://example.com', fg_color: '#000000', bg_color: '#FFFFFF' }`
    - Response: 200 with `{ success: true, data: { qr_code_id, short_code, short_url, target_url, qr_code_data_url, analytics_url } }`
    - Verify qr_code_data_url starts with 'data:image/png;base64,'
    - Verify short_url contains short_code
    - Verify analytics_url contains qr_code_id
  - Missing target_url:
    - Request: `{ fg_color: '#000000' }`
    - Response: 400 with `{ success: false, error: 'Invalid input data' }`
  - Invalid URL format:
    - Request: `{ target_url: 'not-a-url' }`
    - Response: 400 with `{ success: false, error: 'Invalid input data' }`
  - Invalid color format:
    - Request: `{ target_url: 'https://example.com', fg_color: 'red' }`
    - Response: 400 with `{ success: false, error: 'Invalid input data' }`
  - Default colors when omitted:
    - Request: `{ target_url: 'https://example.com' }`
    - Should use default #000000 for fg_color and #FFFFFF for bg_color
  - Database error simulation:
    - Mock sql to throw error
    - Response: 500 with `{ success: false, error: 'Failed to generate QR code' }`

### Step 8: Run All Validation Commands
- Run `pnpm test` to execute all unit and integration tests - all tests must pass
- Run `pnpm test:coverage` to verify adequate test coverage (>70% for new code)
- Run `pnpm type-check` to verify TypeScript compilation succeeds without errors
- Run `pnpm build` to verify production build succeeds without errors
- Run `pnpm lint` to verify no linting errors
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_qr_code_generation.md` to validate E2E functionality

## Testing Strategy
### Unit Tests
- **Validation Tests**: Test Zod schemas with valid/invalid inputs, edge cases, and default values
- **Utility Tests**: Test `isValidUrl`, `isValidHexColor`, `parseUserAgent` functions with various inputs
- **Component Tests**: Test QRGenerator rendering, user interactions, state changes, and real-time preview behavior

### Edge Cases
- Empty URL input - should not generate preview or allow submission
- Very long URLs (>2000 characters) - should handle gracefully
- URLs with special characters and query parameters - should encode properly
- Invalid URL protocols (ftp://, file://, javascript:) - should reject
- Malformed hex colors - should use defaults
- Same foreground and background colors (low contrast) - should allow but may not scan well
- Network failures during API call - should show error message
- Rapid input changes - debouncing should prevent excessive preview generation
- Browser without clipboard API - copy button should handle gracefully

## Acceptance Criteria
- [ ] Form validates URL input with clear error messages for invalid formats
- [ ] QR code preview displays in real-time as user types URL (with debouncing)
- [ ] QR code preview updates when foreground color is changed
- [ ] QR code preview updates when background color is changed
- [ ] Generate button saves QR code to database and returns tracking URL
- [ ] Download button generates and downloads PNG file with correct name
- [ ] All unit tests pass with good code coverage for new code
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
- The preview QR code encodes the target URL directly, while the generated QR code encodes the tracking short URL - this is intentional so users see their URL content but generated codes go through tracking
- For testing, we need to mock the database calls since they require a Vercel Postgres connection
- The qrcode library works in both Node.js and browser environments, making it suitable for server-side API and client-side preview
- Consider implementing a contrast check in future iterations to warn users when foreground/background colors are too similar
