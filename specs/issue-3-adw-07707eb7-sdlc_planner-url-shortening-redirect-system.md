# Feature: URL Shortening & Redirect System

## Metadata
issue_number: `3`
adw_id: `07707eb7`
issue_json: `{"number":3,"title":"URL Shortening & Redirect System","body":"Implement URL shortening and redirect tracking system.\n\n**Tasks:**\n- Create API endpoint POST /api/qr for short URL generation\n- Generate unique short codes (nanoid)\n- Store QR metadata in database (colors, target URL)\n- Implement redirect route /r/[shortCode]\n- Track scan events (timestamp, user agent, IP)\n- Add error handling for invalid codes\n- Write API tests\n- Add E2E tests for redirect flow\n\n**Acceptance Criteria:**\n- Short URLs generated successfully\n- Redirects work correctly\n- Scan events tracked in database\n- Error handling works\n- Tests pass"}`

## Feature Description
The URL Shortening & Redirect System enables the generation of short URLs for QR codes, handling redirects to target URLs while tracking scan events for analytics. When a user scans a QR code, they are redirected through a short URL (e.g., `/r/abc12345`) that logs metadata (timestamp, user agent, IP address, device type, browser, geolocation) before redirecting to the original target URL.

## User Story
As a QR code creator
I want my QR codes to use short URLs that track scans
So that I can see analytics about who scans my QR codes and when

## Problem Statement
The application needs a URL shortening system that:
1. Generates collision-resistant short codes for QR codes
2. Stores QR code metadata (target URL, colors) in the database
3. Handles redirects efficiently while tracking scan events
4. Provides proper error handling for invalid or non-existent short codes
5. Has comprehensive test coverage for reliability

## Solution Statement
Build upon the existing implementation by:
1. Verifying the existing POST `/api/qr/generate` endpoint works correctly with short URL generation
2. Confirming the redirect route `/r/[shortCode]` properly tracks scan events and redirects
3. Adding comprehensive unit tests for the redirect route
4. Creating E2E tests to validate the complete flow from QR generation to redirect tracking

**Note:** After codebase analysis, the core functionality already exists:
- `POST /api/qr/generate` - Creates QR codes with short URLs (exists in `src/app/api/qr/generate/route.ts`)
- `/r/[shortCode]` redirect route - Handles redirects with scan tracking (exists in `src/app/r/[shortCode]/route.ts`)
- Short code generation with nanoid - Implemented in `src/lib/utils.ts`
- Database operations - Implemented in `src/lib/db.ts`

The primary work is adding test coverage for the redirect route and E2E testing.

## Relevant Files
Use these files to implement the feature:

- `src/app/r/[shortCode]/route.ts` - The redirect route handler that needs test coverage. Contains GET handler for redirects and scan tracking.
- `src/app/api/qr/generate/route.ts` - The QR generation API endpoint (already tested). Reference for testing patterns.
- `src/app/api/qr/generate/__tests__/route.test.ts` - Existing test file showing testing patterns for API routes.
- `src/lib/db.ts` - Database operations including `getQRCodeByShortCode`, `createScan`. Need to mock these in tests.
- `src/lib/utils.ts` - Utility functions including `parseUserAgent`, `getGeolocationFromHeaders`, `getClientIP`. Already has tests.
- `src/lib/__tests__/utils.test.ts` - Reference for testing utility functions.
- `src/types/database.ts` - TypeScript types for database entities.
- `jest.config.js` - Jest configuration for test setup.
- `.claude/commands/test_e2e.md` - Instructions for creating E2E tests.
- `.claude/commands/e2e/test_basic_query.md` - Example E2E test file structure.
- `.claude/commands/e2e/test_qr_code_generation.md` - E2E test for QR generation (related functionality).

### New Files
- `src/app/r/[shortCode]/__tests__/route.test.ts` - Unit tests for the redirect route
- `.claude/commands/e2e/test_redirect_flow.md` - E2E test specification for redirect flow

## Implementation Plan
### Phase 1: Foundation
- Review existing redirect route implementation to understand current behavior
- Analyze existing test patterns from `src/app/api/qr/generate/__tests__/route.test.ts`
- Identify all test scenarios for the redirect route

### Phase 2: Core Implementation
- Create unit tests for the redirect route covering:
  - Successful redirect scenarios
  - 404 handling for invalid short codes
  - Scan event tracking verification
  - User agent parsing integration
  - Geolocation header handling
  - Error handling scenarios
- Create E2E test specification for the complete redirect flow

### Phase 3: Integration
- Run all tests to ensure no regressions
- Validate E2E test executes successfully
- Verify build and type checking pass

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E Test Specification for Redirect Flow
- Read `.claude/commands/test_e2e.md` to understand E2E test structure
- Read `.claude/commands/e2e/test_basic_query.md` and `.claude/commands/e2e/test_qr_code_generation.md` for examples
- Create `.claude/commands/e2e/test_redirect_flow.md` with test steps:
  1. Navigate to the application
  2. Generate a QR code with a known target URL
  3. Extract the short URL from the result
  4. Navigate to the short URL
  5. Verify redirect to target URL occurs
  6. Verify scan was tracked (via analytics page or API)

### Step 2: Create Unit Tests for Redirect Route
- Create test file `src/app/r/[shortCode]/__tests__/route.test.ts`
- Add tests for successful redirect scenario:
  - Mock `getQRCodeByShortCode` to return a valid QR code
  - Mock `createScan` to track the call
  - Verify 302 redirect response with correct target URL
  - Verify `createScan` called with correct parameters
- Add tests for invalid short code (404):
  - Mock `getQRCodeByShortCode` to return null
  - Verify 404 JSON response with error message
- Add tests for user agent parsing:
  - Verify mobile user agent is parsed correctly
  - Verify desktop user agent is parsed correctly
- Add tests for geolocation extraction:
  - Test with Vercel geo headers present
  - Test without geo headers (fallback to undefined)
- Add tests for IP address handling:
  - Test with x-forwarded-for header
  - Test with x-real-ip header
  - Test IP truncation for privacy
- Add tests for error handling:
  - Mock database error and verify 500 response

### Step 3: Run Unit Tests and Fix Any Issues
- Run `pnpm test` to execute all unit tests
- Fix any failing tests
- Ensure all new tests pass

### Step 4: Validate Type Checking
- Run `pnpm type-check` to verify no TypeScript errors
- Fix any type errors if found

### Step 5: Validate Build
- Run `pnpm build` to ensure production build succeeds
- Fix any build errors if found

### Step 6: Run Full Validation Suite
- Execute all validation commands to ensure zero regressions
- Run E2E test using the test_e2e.md instructions with the new test_redirect_flow.md file

## Testing Strategy
### Unit Tests
- **Redirect Route Tests** (`src/app/r/[shortCode]/__tests__/route.test.ts`):
  - Successful redirect with scan tracking
  - 404 response for non-existent short codes
  - User agent parsing and device type detection
  - Geolocation extraction from Vercel headers
  - IP address extraction and privacy truncation
  - Database error handling (500 response)
  - Non-blocking scan creation (redirect should not fail if scan tracking fails)

### Edge Cases
- Empty user agent string
- Missing geolocation headers
- IPv6 address handling
- Database connection failure during redirect
- Very long target URLs
- Short codes with special characters (should be filtered by route)
- Concurrent scan tracking (should not block redirect)

## Acceptance Criteria
- [x] Short URLs generated successfully (existing functionality)
- [x] Redirects work correctly (existing functionality)
- [x] Scan events tracked in database (existing functionality)
- [x] Error handling works for invalid codes (existing functionality)
- [ ] Unit tests pass for redirect route (NEW)
- [ ] E2E tests pass for redirect flow (NEW)
- [ ] All existing tests continue to pass
- [ ] TypeScript type checking passes
- [ ] Production build succeeds

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `pnpm test` - Run all unit tests including new redirect route tests
- `pnpm type-check` - Verify TypeScript types are correct
- `pnpm build` - Verify production build succeeds
- `pnpm lint` - Verify code style compliance
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_redirect_flow.md` to validate the redirect functionality works end-to-end

## Notes
- The core URL shortening and redirect functionality already exists and has been implemented in a previous feature (QR Code Generation - Issue #2)
- The primary focus of this implementation is adding comprehensive test coverage for the redirect route
- The redirect route uses non-blocking scan creation - the redirect happens immediately while scan tracking runs in the background
- Scan tracking failures are logged but do not prevent the redirect from succeeding
- IP addresses are truncated (last octet replaced with `xxx`) for privacy compliance
- Geolocation is extracted from Vercel Edge headers (`x-vercel-ip-country`, `x-vercel-ip-city`)
- The test patterns follow the existing codebase conventions seen in `src/app/api/qr/generate/__tests__/route.test.ts`
