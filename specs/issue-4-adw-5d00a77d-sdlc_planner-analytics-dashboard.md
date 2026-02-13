# Feature: Analytics Dashboard

## Metadata
issue_number: `4`
adw_id: `5d00a77d`
issue_json: `{"number":4,"title":"Analytics Dashboard","body":"Build analytics dashboard to visualize QR code scan data.\n\n**Tasks:**\n- Create analytics page with QR list\n- Implement API GET /api/analytics/[qrId]\n- Add charts for scans over time (recharts)\n- Display device breakdown (mobile/desktop)\n- Show browser statistics\n- Add geographic distribution (country/city)\n- Create shareable analytics URL\n- Write component tests\n- Add E2E tests for dashboard\n\n**Acceptance Criteria:**\n- Dashboard displays all QR codes\n- Charts render correctly\n- Analytics data accurate\n- Shareable URLs work\n- Tests pass"}`

## Feature Description
Build a comprehensive analytics dashboard that allows users to visualize QR code scan data. The dashboard will display a list of all generated QR codes with their analytics, including charts for scans over time, device breakdown (mobile/tablet/desktop), browser statistics, and geographic distribution (country/city). Each QR code's analytics page should have a shareable public URL.

## User Story
As a user who has generated QR codes
I want to view analytics dashboards showing scan data for my QR codes
So that I can understand how my QR codes are being used, from which devices and locations

## Problem Statement
Currently, users can view analytics for individual QR codes if they know the analytics URL, but there's no central dashboard to browse all QR codes and their analytics. Users need a way to see all their QR codes in one place and easily access individual analytics.

## Solution Statement
Create an analytics dashboard page (`/analytics`) that lists all QR codes with summary metrics, and enhance the individual analytics page (`/analytics/[qrCodeId]`) with proper charts. The solution leverages the existing `AnalyticsDashboard` component and API endpoint (`/api/analytics/[qrCodeId]`) while adding a new QR list endpoint and main dashboard page.

## Relevant Files
Use these files to implement the feature:

- `src/app/api/analytics/[qrCodeId]/route.ts` - Existing analytics API for individual QR codes, already implements all analytics data retrieval
- `src/app/analytics/[qrCodeId]/page.tsx` - Existing analytics page for individual QR codes, renders the AnalyticsDashboard component
- `src/components/analytics/AnalyticsDashboard.tsx` - Existing analytics dashboard component with all charts (LineChart, PieChart, BarChart) using Recharts - already fully implemented
- `src/lib/db.ts` - Database queries, need to add `getAllQRCodes` function for listing all QR codes
- `src/types/database.ts` - TypeScript types for QRCode and analytics data
- `src/app/page.tsx` - Home page, reference for page layout patterns
- `src/app/globals.css` - Global styles
- `src/components/qr-generator/__tests__/QRGenerator.test.tsx` - Reference for component testing patterns
- `.claude/commands/test_e2e.md` - E2E test runner instructions
- `.claude/commands/e2e/test_basic_query.md` - E2E test format reference
- `.claude/commands/e2e/test_qr_code_generation.md` - QR-specific E2E test reference

### New Files
- `src/app/analytics/page.tsx` - New main analytics dashboard page listing all QR codes
- `src/app/api/qr/list/route.ts` - New API endpoint to list all QR codes with summary data
- `src/components/analytics/QRCodeList.tsx` - New component to display list of QR codes with summary metrics
- `src/components/analytics/__tests__/QRCodeList.test.tsx` - Unit tests for QRCodeList component
- `src/components/analytics/__tests__/AnalyticsDashboard.test.tsx` - Unit tests for AnalyticsDashboard component
- `.claude/commands/e2e/test_analytics_dashboard.md` - E2E test for analytics dashboard functionality

## Implementation Plan
### Phase 1: Foundation
Set up the database query and API endpoint needed to list all QR codes with their basic analytics summary. This involves adding a new database function and creating the list API endpoint.

### Phase 2: Core Implementation
Build the QRCodeList component to display QR codes in a grid/list format with key metrics (total scans, creation date, target URL). Then create the main analytics dashboard page that uses this component.

### Phase 3: Integration
Add navigation between the QR code list and individual analytics pages. Ensure shareable URLs work properly. Add comprehensive tests for all new components and functionality.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E Test Specification
- Read `.claude/commands/test_e2e.md` to understand E2E testing framework
- Read `.claude/commands/e2e/test_qr_code_generation.md` as reference for QR-specific tests
- Create `.claude/commands/e2e/test_analytics_dashboard.md` with test steps for:
  - Navigating to `/analytics` page
  - Verifying QR code list displays
  - Clicking on a QR code to view its analytics
  - Verifying charts render correctly
  - Testing shareable URL functionality

### Step 2: Add Database Function for Listing QR Codes
- Edit `src/lib/db.ts` to add `getAllQRCodes` function
- Function should return all QR codes ordered by creation date (newest first)
- Include total scan count for each QR code using a JOIN query

### Step 3: Create QR Codes List API Endpoint
- Create `src/app/api/qr/list/route.ts`
- Implement GET endpoint that returns all QR codes with summary data
- Response format: `{ success: true, data: { qr_codes: [...] } }`
- Each QR code should include: id, short_code, target_url, created_at, total_scans

### Step 4: Create QRCodeList Component
- Create `src/components/analytics/QRCodeList.tsx`
- Display QR codes in a responsive grid layout
- Each card shows: target URL (truncated), short code, total scans, creation date
- Include link to individual analytics page (`/analytics/[id]`)
- Add loading state and empty state handling
- Follow existing component patterns (use client, TypeScript, Tailwind)

### Step 5: Create Main Analytics Dashboard Page
- Create `src/app/analytics/page.tsx`
- Use similar layout structure as existing pages
- Include page header with title "Analytics Dashboard"
- Render QRCodeList component
- Add link back to home page

### Step 6: Add Navigation Link from Home Page
- Edit `src/app/page.tsx` to add a "View Analytics" link in the header
- Link should navigate to `/analytics`

### Step 7: Add Copy Shareable Link Button to Individual Analytics
- Edit `src/components/analytics/AnalyticsDashboard.tsx`
- Add a "Share" or "Copy Link" button that copies the current analytics URL to clipboard
- Display success feedback when copied

### Step 8: Write QRCodeList Component Tests
- Create `src/components/analytics/__tests__/QRCodeList.test.tsx`
- Test initial render with loading state
- Test rendering QR code cards with correct data
- Test empty state when no QR codes exist
- Test navigation links are correct
- Follow patterns from `QRGenerator.test.tsx`

### Step 9: Write AnalyticsDashboard Component Tests
- Create `src/components/analytics/__tests__/AnalyticsDashboard.test.tsx`
- Test loading state
- Test error state
- Test rendering analytics data
- Test share link functionality
- Mock fetch API and Recharts components

### Step 10: Run Validation Commands
- Execute all validation commands to ensure the feature works with zero regressions

## Testing Strategy
### Unit Tests
- `QRCodeList.test.tsx`: Test component rendering, loading states, empty states, and navigation
- `AnalyticsDashboard.test.tsx`: Test analytics display, chart rendering, and share functionality
- Mock fetch API calls and database queries in tests

### Edge Cases
- No QR codes exist (empty state)
- QR code has zero scans
- Very long target URLs (truncation)
- Invalid QR code ID in analytics URL (404 handling - already implemented)
- Network errors when fetching data (error state handling)

## Acceptance Criteria
- Analytics dashboard page (`/analytics`) displays all QR codes in a list
- Each QR code card shows target URL, short code, total scans, and creation date
- Clicking a QR code navigates to its individual analytics page
- Individual analytics page renders all charts correctly (scans over time, device breakdown, browser breakdown, geographic distribution)
- Share button copies the analytics URL to clipboard
- Navigation works smoothly between list and individual views
- All unit tests pass
- E2E test passes
- Build completes without errors
- No TypeScript errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run lint` - Run linting to check code quality
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run type-check` - Run TypeScript type checking
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm test` - Run all unit tests
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run build` - Run production build
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_analytics_dashboard.md` E2E test file to validate this functionality works

## Notes
- The existing `AnalyticsDashboard` component already has all chart implementations using Recharts (LineChart, PieChart, BarChart)
- The existing `/api/analytics/[qrCodeId]` endpoint already returns all required analytics data
- The feature builds on existing patterns and styling from the codebase
- No new external libraries are required - Recharts is already installed and used
- The shareable URL feature leverages the existing public analytics page structure - all analytics pages are already publicly accessible via `/analytics/[id]`
