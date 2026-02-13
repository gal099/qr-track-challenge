# Feature: Admin Panel - QR Management with Delete

## Metadata
issue_number: `19`
adw_id: `350ce5e4`
issue_json: `{"number":19,"title":"Feature: Admin Panel - QR Management with Delete","body":"## Overview\nImplement a password-protected admin panel that allows authorized users to manage and delete QR codes from the system.\n\n## Problem Statement\nCurrently there is no way to delete QR codes from the dashboard. Test QRs and duplicates accumulate without a management interface.\n\n## Proposed Solution\n\n### Phase 1: Password-Protected Admin Panel (This Issue)\nCreate a simple admin interface with password authentication as an interim solution before implementing full user authentication.\n\n### Password Protection\n- **Access Route**: `/admin`\n- **Password Screen**: Simple form with password input\n- **Easter Egg Password**: `yourpasswordhere` (literal - the phrase \"your password here\")\n- **UI Copy**: \"Enter your password here\" (creates amusing wordplay)\n- **Session**: Store auth state in session/cookie (expires after 1 hour)\n- **Security**: Rate limiting on password attempts (max 5 attempts per IP per hour)\n\n### Admin Panel Features\n\n#### QR Code List\n- Display all QR codes in a table/grid\n- Show: Short code, target URL, scan count, created date\n- Sort by: date created (newest first by default)\n- Filter by: date range (optional)\n- Delete action button per QR\n\n#### Delete Flow\n1. User clicks \"Delete\" button\n2. Show confirmation modal with:\n   - QR short code\n   - Target URL\n   - Scan count (\"This QR has been scanned X times\")\n   - Warning: \"This action cannot be undone\"\n   - Buttons: \"Cancel\" | \"Delete QR Code\" (red/destructive)\n3. On confirm: Soft delete (set `deleted_at` timestamp)\n4. Show success toast notification\n5. Remove from list immediately\n\n### Database Changes\n\n#### Migration: Add Soft Delete Column\n```sql\nALTER TABLE qr_codes \nADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;\n\n-- Add index for performance\nCREATE INDEX idx_qr_codes_deleted_at ON qr_codes(deleted_at);\n```\n\n#### Query Updates\n- List queries: Add `WHERE deleted_at IS NULL`\n- Delete endpoint: `UPDATE qr_codes SET deleted_at = NOW() WHERE id = ?`\n\n### API Endpoints\n\n#### POST /api/admin/auth\n```typescript\nRequest: { password: string }\nResponse: { success: boolean, error?: string }\n// Sets session cookie on success\n```\n\n#### DELETE /api/admin/qr/:shortCode\n```typescript\n// Requires valid admin session\nResponse: { success: boolean, error?: string }\n// Soft deletes QR code\n```\n\n### UI Components\n\n#### Password Screen (`/admin`)\n```\n┌─────────────────────────────────┐\n│     QR Track Admin Panel        │\n│                                 │\n│  Enter your password here       │\n│  [___________________________]  │\n│                                 │\n│  [      Access Admin Panel    ] │\n└─────────────────────────────────┘\n```\n\n#### Admin Dashboard (`/admin/dashboard`)\n```\n┌──────────────────────────────────────────┐\n│  QR Track Admin                          │\n│  ──────────────────────────────────────  │\n│  Short Code  │ Target URL  │ Scans │ Del│\n│  abc123      │ google.com  │  42   │ [X]│\n│  def456      │ github.com  │   3   │ [X]│\n└──────────────────────────────────────────┘\n```\n\n#### Delete Confirmation Modal\n```\n┌─────────────────────────────────┐\n│  Delete QR Code?                │\n│                                 │\n│  Short Code: abc123             │\n│  Target: https://google.com     │\n│                                 │\n│  ⚠️ This QR has been scanned    │\n│     42 times                    │\n│                                 │\n│  This action cannot be undone   │\n│                                 │\n│  [Cancel]  [Delete QR Code]     │\n└─────────────────────────────────┘\n```\n\n### Security Considerations\n- Rate limit password attempts\n- Use secure session cookies (httpOnly, secure, sameSite)\n- Log admin actions for audit trail\n- Consider adding CSRF protection\n\n## Acceptance Criteria\n- [ ] Password screen at /admin with \"yourpasswordhere\" authentication\n- [ ] Session management with 1-hour expiration\n- [ ] Rate limiting on password attempts (5 max per hour)\n- [ ] Admin dashboard lists all non-deleted QR codes\n- [ ] Delete button shows confirmation modal with scan count\n- [ ] Soft delete implementation (deleted_at column)\n- [ ] API endpoint for soft delete\n- [ ] Deleted QRs excluded from all list queries\n- [ ] Success/error toast notifications\n- [ ] Redirect system continues working (301 to deleted QRs shows 404)\n\n## Future Enhancements (Not in this issue)\n- Full authentication system (NextAuth.js)\n- User ownership of QR codes\n- Personal dashboards\n- Role-based access control\n\n## Technical Notes\n- Use soft delete pattern for potential data recovery\n- Keep scan analytics even for deleted QRs (for historical data)\n- Consider adding admin activity logging table\n- Ensure /api/qr/list excludes deleted QRs\n\n## Related Issues\n- Blocked by: #14 (race condition fix - in progress)\n- See: BACKLOG.md for full roadmap"}`

## Feature Description
Implement a password-protected admin panel that allows authorized users to manage and delete QR codes from the system. The admin panel provides a simple authentication mechanism using a static password (`yourpasswordhere`) with session-based access control, rate limiting for security, and a comprehensive QR code management interface with soft delete functionality.

## User Story
As an administrator
I want to access a password-protected admin panel to manage QR codes
So that I can delete test QR codes and duplicates that accumulate in the system

## Problem Statement
Currently there is no way to delete QR codes from the dashboard. Test QRs and duplicates accumulate without a management interface, leading to clutter and potential confusion when viewing analytics.

## Solution Statement
Create a simple admin interface with password authentication as an interim solution. The admin panel will display all QR codes with their metadata (short code, target URL, scan count, created date) and provide delete functionality with confirmation modals. Soft delete will be implemented to preserve data integrity while hiding deleted QR codes from all public views.

## Relevant Files
Use these files to implement the feature:

**Database & Types:**
- `db/migrations/001_create_qr_codes_table.sql` - Reference for migration pattern; need to create new migration for `deleted_at` column
- `db/migrations/002_create_scans_table.sql` - Reference for migration pattern
- `src/types/database.ts` - Add `deleted_at` field to QRCode interface
- `src/lib/db.ts` - Add soft delete function, update all list queries to filter deleted records

**API Routes (existing patterns to follow):**
- `src/app/api/qr/generate/route.ts` - Reference for API route patterns, error handling, and response format
- `src/app/api/qr/list/route.ts` - Update to exclude soft-deleted QR codes
- `src/app/api/analytics/[qrCodeId]/route.ts` - Reference for route parameter handling
- `src/app/r/[shortCode]/route.ts` - Update to return 404 for deleted QR codes

**Validation:**
- `src/lib/validations.ts` - Add admin authentication schema

**Frontend Components (existing patterns to follow):**
- `src/components/qr-generator/QRGenerator.tsx` - Reference for component patterns, state management, error handling, button styles
- `src/components/analytics/QRCodeList.tsx` - Reference for list display pattern, loading skeletons, pagination

**Pages (existing patterns to follow):**
- `src/app/page.tsx` - Reference for page layout structure
- `src/app/analytics/page.tsx` - Reference for page with data fetching
- `src/app/layout.tsx` - Reference for root layout

**E2E Testing:**
- `.claude/commands/test_e2e.md` - Instructions for creating E2E tests
- `.claude/commands/e2e/test_qr_code_generation.md` - Reference for E2E test format and structure

### New Files
- `db/migrations/003_add_deleted_at_column.sql` - Migration to add soft delete column
- `src/app/admin/page.tsx` - Admin login page
- `src/app/admin/dashboard/page.tsx` - Admin dashboard page
- `src/components/admin/AdminLoginForm.tsx` - Login form component
- `src/components/admin/AdminQRList.tsx` - QR code list with delete functionality
- `src/components/admin/DeleteConfirmationModal.tsx` - Confirmation modal for delete
- `src/components/admin/Toast.tsx` - Toast notification component
- `src/app/api/admin/auth/route.ts` - Admin authentication endpoint
- `src/app/api/admin/qr/[shortCode]/route.ts` - QR code delete endpoint
- `src/lib/admin-session.ts` - Session management utilities
- `src/lib/rate-limit.ts` - Rate limiting utilities
- `.claude/commands/e2e/test_admin_panel.md` - E2E test file for admin panel functionality

## Implementation Plan
### Phase 1: Foundation
1. Create database migration to add `deleted_at` column to `qr_codes` table
2. Update TypeScript types to include `deleted_at` field
3. Implement session management utilities for admin authentication
4. Implement rate limiting utilities for password attempts
5. Create validation schemas for admin authentication

### Phase 2: Core Implementation
1. Create admin authentication API endpoint (`POST /api/admin/auth`)
2. Create admin QR delete API endpoint (`DELETE /api/admin/qr/[shortCode]`)
3. Update existing database queries to filter out soft-deleted records:
   - `getAllQRCodes()` - exclude deleted QR codes
   - `getQRCodeByShortCode()` - return null for deleted QR codes (for redirect route)
4. Update redirect route to return 404 for deleted QR codes
5. Create admin login page and form component
6. Create admin dashboard page with QR code list
7. Create delete confirmation modal component
8. Create toast notification component for success/error feedback

### Phase 3: Integration
1. Connect admin login form to authentication API
2. Implement session-based access control for admin pages
3. Connect delete functionality to API with optimistic UI updates
4. Add proper error handling and loading states throughout
5. Create E2E tests to validate the complete admin flow

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E Test Specification
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_qr_code_generation.md` to understand E2E test format
- Create `.claude/commands/e2e/test_admin_panel.md` with test steps for:
  - Navigating to `/admin` and seeing the login form
  - Entering incorrect password and seeing error message
  - Entering correct password (`yourpasswordhere`) and accessing dashboard
  - Viewing QR code list with delete buttons
  - Clicking delete and seeing confirmation modal
  - Confirming delete and seeing success toast
  - Verifying QR code is removed from list

### Step 2: Create Database Migration for Soft Delete
- Create `db/migrations/003_add_deleted_at_column.sql`:
  - Add `deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL` column to `qr_codes` table
  - Create index `idx_qr_codes_deleted_at` for performance
  - Insert migration version record

### Step 3: Update TypeScript Types
- Update `src/types/database.ts`:
  - Add `deleted_at: Date | null` to `QRCode` interface
  - Add `deleted_at: Date | null` to `QRCodeWithScans` interface

### Step 4: Create Rate Limiting Utility
- Create `src/lib/rate-limit.ts`:
  - Implement in-memory rate limiter (suitable for single-instance deployment)
  - Track attempts by IP address
  - Allow maximum 5 attempts per IP per hour
  - Export `checkRateLimit(ip: string): { allowed: boolean, remainingAttempts: number, resetTime: Date }`
  - Export `recordFailedAttempt(ip: string): void`
  - Export `clearAttempts(ip: string): void`

### Step 5: Create Admin Session Management
- Create `src/lib/admin-session.ts`:
  - Define admin session cookie name and configuration
  - Export `createAdminSession(response: NextResponse): void` - sets httpOnly cookie with 1-hour expiration
  - Export `validateAdminSession(request: NextRequest): boolean` - checks if valid admin session exists
  - Export `clearAdminSession(response: NextResponse): void` - removes admin session cookie
  - Use secure cookie settings (httpOnly, secure in production, sameSite: 'lax')

### Step 6: Create Admin Validation Schema
- Update `src/lib/validations.ts`:
  - Add `adminAuthSchema` with password field validation
  - Password must be a non-empty string

### Step 7: Update Database Queries
- Update `src/lib/db.ts`:
  - Modify `getAllQRCodes()` to add `WHERE deleted_at IS NULL` filter
  - Modify `getQRCodeByShortCode()` to add `AND deleted_at IS NULL` filter
  - Modify `getQRCodeById()` to add `AND deleted_at IS NULL` filter
  - Add `softDeleteQRCode(shortCode: string): Promise<boolean>` function that sets `deleted_at = NOW()`
  - Add `getQRCodeByShortCodeIncludeDeleted(shortCode: string): Promise<QRCode | null>` for admin view

### Step 8: Create Admin Authentication API Endpoint
- Create `src/app/api/admin/auth/route.ts`:
  - POST handler for password authentication
  - Validate request body with `adminAuthSchema`
  - Check rate limit before processing
  - Compare password with `yourpasswordhere`
  - On success: create admin session, return `{ success: true }`
  - On failure: record failed attempt, return `{ success: false, error: 'Invalid password' }` with remaining attempts info
  - Handle rate limit exceeded: return `{ success: false, error: 'Too many attempts. Try again later.' }` with 429 status

### Step 9: Create Admin QR Delete API Endpoint
- Create `src/app/api/admin/qr/[shortCode]/route.ts`:
  - DELETE handler for soft deleting QR codes
  - Validate admin session (return 401 if invalid)
  - Validate shortCode parameter
  - Call `softDeleteQRCode(shortCode)`
  - Return `{ success: true }` on success
  - Return `{ success: false, error: 'QR code not found' }` with 404 if not found
  - Handle errors with proper status codes

### Step 10: Create Toast Notification Component
- Create `src/components/admin/Toast.tsx`:
  - Client component with success and error variants
  - Props: `type: 'success' | 'error'`, `message: string`, `onClose: () => void`
  - Auto-dismiss after 3 seconds
  - Use Tailwind for styling (green for success, red for error)
  - Positioned fixed at top-right of screen
  - Include close button

### Step 11: Create Delete Confirmation Modal
- Create `src/components/admin/DeleteConfirmationModal.tsx`:
  - Client component
  - Props: `qrCode: { short_code: string, target_url: string, total_scans: number }`, `onConfirm: () => void`, `onCancel: () => void`, `isDeleting: boolean`
  - Display QR code details (short code, target URL, scan count)
  - Show warning message "This action cannot be undone"
  - Cancel button (gray) and Delete button (red, destructive)
  - Disable buttons and show loading state while deleting
  - Use fixed backdrop with centered modal

### Step 12: Create Admin Login Form Component
- Create `src/components/admin/AdminLoginForm.tsx`:
  - Client component
  - State: password input, loading, error message
  - Form with password input and submit button
  - Label: "Enter your password here" (the Easter egg wordplay)
  - On submit: POST to `/api/admin/auth`
  - On success: redirect to `/admin/dashboard`
  - On error: display error message with remaining attempts if applicable
  - Follow existing form styling patterns from QRGenerator.tsx

### Step 13: Create Admin QR List Component
- Create `src/components/admin/AdminQRList.tsx`:
  - Client component
  - Fetch QR codes from `/api/qr/list`
  - Display in table format: Short Code | Target URL | Scans | Created | Actions
  - Sort by created_at DESC (newest first)
  - Include delete button per row
  - Handle delete click: open DeleteConfirmationModal
  - On delete confirm: call DELETE `/api/admin/qr/[shortCode]`
  - On success: remove from local state, show success toast
  - On error: show error toast
  - Include loading skeleton and error states
  - Include logout button that clears session and redirects to `/admin`

### Step 14: Create Admin Login Page
- Create `src/app/admin/page.tsx`:
  - Check if already authenticated (redirect to dashboard if so)
  - Render AdminLoginForm component
  - Page title: "QR Track Admin Panel"
  - Follow existing page layout patterns

### Step 15: Create Admin Dashboard Page
- Create `src/app/admin/dashboard/page.tsx`:
  - Validate admin session (redirect to /admin if not authenticated)
  - Render AdminQRList component
  - Page title: "QR Track Admin"
  - Include header with logout option
  - Follow existing page layout patterns

### Step 16: Run Database Migration
- Run database migration to add `deleted_at` column
- Verify migration applied successfully

### Step 17: Test Redirect Behavior for Deleted QR Codes
- Verify that accessing `/r/[shortCode]` for a deleted QR code returns 404
- The existing `getQRCodeByShortCode()` function should now return null for deleted codes

### Step 18: Run Validation Commands
- Execute all validation commands to ensure the feature works correctly with zero regressions

## Testing Strategy
### Unit Tests
- Test rate limiting utility: verify attempts are tracked correctly, limits are enforced, reset after expiration
- Test session management: verify cookie creation, validation, and expiration
- Test soft delete database function: verify `deleted_at` is set correctly
- Test updated queries exclude deleted records

### Edge Cases
- Rate limit boundary: exactly 5 attempts allowed, 6th blocked
- Session expiration: access denied after 1 hour
- Delete non-existent QR code: proper error handling
- Delete already deleted QR code: proper error handling
- Concurrent delete attempts: proper handling
- Empty QR code list: proper empty state display
- Very long target URLs: proper truncation in table display
- Invalid session cookie: proper redirect to login
- Network errors during delete: proper error toast and state recovery

## Acceptance Criteria
- Password screen at /admin with "yourpasswordhere" authentication
- Session management with 1-hour expiration
- Rate limiting on password attempts (5 max per hour per IP)
- Admin dashboard lists all non-deleted QR codes
- Delete button shows confirmation modal with scan count
- Soft delete implementation (deleted_at column)
- API endpoint for soft delete with session validation
- Deleted QRs excluded from all list queries
- Success/error toast notifications
- Redirect system returns 404 for deleted QRs
- Proper loading states and error handling throughout

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_admin_panel.md` to validate admin panel functionality works
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run db:migrate` - Run database migration to apply the `deleted_at` column
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run type-check` - Run TypeScript type checking to validate types are correct
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run lint` - Run linting to ensure code quality
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run build` - Run production build to validate no build errors
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run test` - Run all tests to validate zero regressions

## Notes
- The password `yourpasswordhere` is intentional as an Easter egg - the UI says "Enter your password here" which makes it a fun wordplay
- Soft delete is used instead of hard delete to preserve scan analytics data for historical analysis and potential data recovery
- In-memory rate limiting is used which works for single-instance deployments but would need Redis for multi-instance production deployments
- The admin panel is a temporary solution before implementing full authentication with NextAuth.js
- Session cookies use `sameSite: 'lax'` to allow navigation from bookmarks while protecting against CSRF
- The `deleted_at` index improves query performance when filtering out deleted records
- Consider adding admin activity logging in a future enhancement for audit trails
