# Feature: Add Author Field to QR Code Creation

## Metadata
issue_number: `23`
adw_id: `189d1c96`
issue_json: `{"number":23,"title":"Feature: Add author field to QR code creation","body":"..."}`

## Feature Description
Add a mandatory **author** field to the QR code creation form to track who created each QR code. This enhances organization and traceability when multiple people use the application by capturing the creator's name at the time of QR code generation.

## User Story
As a QR code creator
I want to add my name/identifier when generating a QR code
So that I can track ownership and know who created each QR code for better organization

## Problem Statement
Currently, there's no way to identify who created a specific QR code. When multiple users generate QR codes, it becomes difficult to:
- Track ownership of QR codes
- Organize QRs by creator
- Know who to contact about a specific QR code

## Solution Statement
Add a simple text field "Author" to the QR code creation form that:
- Captures the creator's name (required field)
- Validates input (2-30 characters, alphanumeric + spaces only)
- Stores the author in the database
- Displays the author on the analytics dashboard and individual analytics pages

## Relevant Files
Use these files to implement the feature:

### Database & Types
- `db/migrations/003_add_deleted_at_column.sql` - Reference for migration format
- `src/types/database.ts` - TypeScript types for QRCode, QRCodeWithScans, CreateQRCodeInput interfaces - add `author` field
- `src/lib/db.ts` - Database functions: `createQRCode()`, `getAllQRCodes()`, `getQRCodeAnalytics()` - add author support

### Validation
- `src/lib/validations.ts` - Zod schemas: `generateQRCodeSchema` - add author validation

### API Routes
- `src/app/api/qr/generate/route.ts` - POST endpoint: accepts and stores author field
- `src/app/api/qr/list/route.ts` - GET endpoint: returns author in response (already uses getAllQRCodes)
- `src/app/api/analytics/[qrCodeId]/route.ts` - GET endpoint: returns author in response

### UI Components
- `src/components/qr-generator/QRGenerator.tsx` - QR creation form: add Author input field
- `src/components/analytics/QRCodeList.tsx` - Dashboard QR card list: display "Created by: [Author]"
- `src/components/analytics/AnalyticsDashboard.tsx` - Individual analytics page: display author info

### Tests
- `src/lib/__tests__/validations.test.ts` - Add tests for author validation
- `src/components/qr-generator/__tests__/QRGenerator.test.tsx` - Update tests for author field
- `src/app/api/qr/generate/__tests__/route.test.ts` - Update API tests for author

### E2E Testing
- `.claude/commands/test_e2e.md` - Read to understand E2E test execution
- `.claude/commands/e2e/test_qr_code_generation.md` - Reference for E2E test format

### New Files
- `db/migrations/004_add_author_field.sql` - Database migration to add author column
- `.claude/commands/e2e/test_author_field.md` - E2E test for author field functionality

## Implementation Plan

### Phase 1: Foundation (Database & Types)
1. Create database migration to add `author` column to `qr_codes` table
2. Update TypeScript types to include `author` field in all relevant interfaces
3. Add author validation function to validations.ts

### Phase 2: Core Implementation (Backend)
1. Update `createQRCode()` database function to accept and store author
2. Update `getAllQRCodes()` to return author field
3. Update analytics query to return author field
4. Update generate API endpoint to validate and pass author
5. Verify list and analytics endpoints return author

### Phase 3: Integration (Frontend)
1. Add Author input field to QRGenerator component
2. Add client-side validation with error messaging
3. Update form submission to include author
4. Display author on QRCodeList cards ("Created by: [Author]")
5. Display author on AnalyticsDashboard individual page

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E Test File
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_qr_code_generation.md` to understand E2E test format
- Create `.claude/commands/e2e/test_author_field.md` with test steps to:
  - Navigate to homepage
  - Verify Author input field is present with correct label
  - Test validation error when author is empty or invalid
  - Test validation error when author is too short (< 2 chars)
  - Test validation error when author is too long (> 30 chars)
  - Test successful QR generation with valid author
  - Navigate to analytics dashboard and verify author is displayed
  - Navigate to individual analytics page and verify author is displayed

### Step 2: Create Database Migration
- Create `db/migrations/004_add_author_field.sql`:
  - Add `author VARCHAR(30) NOT NULL DEFAULT 'Unknown'` column to `qr_codes` table
  - Set default value 'Unknown' for existing records
  - Track migration version in schema_migrations table

### Step 3: Update TypeScript Types
- Edit `src/types/database.ts`:
  - Add `author: string` to `QRCode` interface
  - Add `author: string` to `QRCodeWithScans` interface
  - Add `author: string` to `CreateQRCodeInput` interface (required)

### Step 4: Add Author Validation
- Edit `src/lib/validations.ts`:
  - Add `author` field to `generateQRCodeSchema` with Zod validation:
    - Required string
    - Min length 2, max length 30
    - Regex pattern: `/^[a-zA-Z0-9\s]+$/` (alphanumeric + spaces)
    - Transform to trim whitespace

### Step 5: Update Database Functions
- Edit `src/lib/db.ts`:
  - Update `createQRCode()` function:
    - Add `author` parameter to input type
    - Include `author` in INSERT query
  - Update `getAllQRCodes()` function:
    - Add `qr.author` to SELECT columns
    - Add `qr.author` to GROUP BY clause
    - Include `author` in return mapping
  - Update `getQRCodeAnalytics()` function (if it returns qr_code data):
    - Ensure author field is included in query

### Step 6: Update API Endpoint - Generate
- Edit `src/app/api/qr/generate/route.ts`:
  - `validatedData` already gets author from schema
  - Pass `author: validatedData.author` to `createQRCode()`
  - Include author in response data

### Step 7: Update QR Generator Component
- Edit `src/components/qr-generator/QRGenerator.tsx`:
  - Add `author` state variable
  - Add `authorError` state variable for validation feedback
  - Add Author input field after URL input:
    - Label: "Author"
    - Placeholder: "Your name or identifier"
    - Max length: 30
  - Add client-side validation on change and on submit:
    - Check length (2-30)
    - Check pattern (alphanumeric + spaces)
    - Show error message below input
  - Include `author: author.trim()` in API request body
  - Update disabled state on Generate button to check author validity

### Step 8: Update QRCodeList Component
- Edit `src/components/analytics/QRCodeList.tsx`:
  - Add `author: string` to `QRCodeSummary` interface
  - Display author on each QR code card:
    - Add below target URL or in a suitable location
    - Format: "Created by: {qrCode.author}"
    - Style with text-sm text-gray-500 to match existing design

### Step 9: Update AnalyticsDashboard Component
- Edit `src/components/analytics/AnalyticsDashboard.tsx`:
  - Add `author: string` to `qr_code` interface in `AnalyticsData`
  - Display author in the Header section:
    - Add after "Created: [date]" line
    - Format: "Author: {qr_code.author}" or "Created by: {qr_code.author}"
    - Style consistently with existing text

### Step 10: Update Unit Tests - Validations
- Edit `src/lib/__tests__/validations.test.ts`:
  - Add test cases for author validation:
    - Valid author: "John Doe"
    - Valid author with numbers: "User123"
    - Invalid: empty string
    - Invalid: single character
    - Invalid: more than 30 characters
    - Invalid: special characters

### Step 11: Update Unit Tests - QRGenerator Component
- Edit `src/components/qr-generator/__tests__/QRGenerator.test.tsx`:
  - Add test for Author input field presence
  - Add test for author validation error display
  - Update existing generation tests to include author field

### Step 12: Update Unit Tests - API Route
- Edit `src/app/api/qr/generate/__tests__/route.test.ts`:
  - Add test for successful generation with author
  - Add test for missing author (should fail validation)
  - Add test for invalid author (should fail validation)

### Step 13: Run Database Migration
- Execute migration on local database to apply schema changes

### Step 14: Run Validation Commands
- Execute all validation commands to ensure zero regressions

## Testing Strategy

### Unit Tests
- Validation tests for `generateQRCodeSchema` with author field
- Component tests for QRGenerator with author input
- API route tests for author validation and storage
- Verify author is returned in list and analytics responses

### Edge Cases
- Handle existing QR codes without author (display "Unknown")
- Trim whitespace from author input before validation
- Reject special characters (!@#$%^&*()_+=[]{}|;:'",.<>?/\)
- Handle very long names gracefully in UI (CSS truncation with ellipsis if needed)
- Handle author with leading/trailing spaces (trim before save)
- Author with only spaces should fail validation

## Acceptance Criteria
- [ ] Author field is visible in QR code creation form with label "Author"
- [ ] Form validation prevents submission without author (min 2, max 30 chars)
- [ ] Form shows validation error if author is invalid (empty, too short, too long, special chars)
- [ ] Author is saved to database when QR code is created
- [ ] Author is displayed on analytics dashboard QR cards as "Created by: [Author Name]"
- [ ] Author is displayed on individual analytics page
- [ ] Database migration creates `author` column and sets default 'Unknown' for existing QRs
- [ ] All existing unit tests pass
- [ ] New unit tests added for author validation
- [ ] E2E test file created and validates author functionality
- [ ] TypeScript types updated in `src/types/database.ts`

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npm run db:migrate` - Apply database migration to add author column
- `npm run test` - Run all unit tests to ensure zero regressions
- `npm run type-check` - Verify TypeScript types are correct
- `npm run lint` - Check for linting errors
- `npm run build` - Build the project to ensure no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_author_field.md` to validate the author field E2E

## Notes
- The default value "Unknown" for existing QR codes ensures backward compatibility
- Author field validation is intentionally simple (alphanumeric + spaces) to avoid complexity with international characters in the initial implementation
- Future enhancement: Consider adding email validation option or linking to user accounts
- The author field is displayed but not currently filterable - this could be a future enhancement
- Consider rate limiting or spam prevention if author field is abused
