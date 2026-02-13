# City Name Decoding Fix

**ADW ID:** d059652c
**Date:** 2026-02-13
**Specification:** specs/issue-20-adw-d059652c-sdlc_planner-decode-city-names.md

## Overview

Fixed a cosmetic bug where city names in the Geographic Distribution table were displaying URL-encoded characters (e.g., `General%20Fern%C3%A1ndez%20Oro`) instead of human-readable text (e.g., `General Fernández Oro`). The fix decodes city names at the data extraction layer to ensure proper display throughout the application.

## Screenshots

![Analytics Dashboard with Decoded City Names](assets/02_analytics_dashboard.png)

The Geographic Distribution table now displays city names correctly with proper spaces and special characters.

## What Was Built

- Added URL decoding logic for city names extracted from Vercel Edge headers
- Implemented graceful error handling for malformed URI encoding
- Created comprehensive unit tests for city name decoding scenarios
- Updated E2E test suite to validate city name display

## Technical Implementation

### Files Modified

- `src/lib/utils-client.ts`: Modified `getGeolocationFromHeaders()` function to decode URL-encoded city names using `decodeURIComponent()` with try-catch error handling
- `src/lib/__tests__/utils.test.ts`: Added 10 unit tests covering various city name encoding scenarios, including special characters, spaces, malformed encoding, and edge cases
- `.claude/commands/e2e/test_city_name_decoding.md`: Created E2E test specification to validate city names display correctly in analytics dashboard
- `.claude/commands/conditional_docs.md`: Updated to include reference to new documentation
- `package.json` & `package-lock.json`: Added Playwright dependency for E2E testing

### Key Changes

1. **Root cause fix**: Applied `decodeURIComponent()` at the data extraction layer (`getGeolocationFromHeaders`) rather than the display layer, ensuring all consumers benefit from properly decoded city names
2. **Defensive coding**: Wrapped decoding in try-catch block to gracefully handle malformed encoding by returning the original value if decoding fails
3. **Comprehensive testing**: Added unit tests covering URL-encoded spaces (`Tres%20Arroyos`), special characters (`General%20Fern%C3%A1ndez%20Oro`), multiple encoded characters (`S%C3%A3o%20Paulo`), simple names, malformed encoding, and missing headers
4. **Test suite improvements**: Refactored tests to use a helper function (`createHeaders`) for cleaner test setup

## How to Use

No user-facing changes are required. The fix is automatic:

1. When a QR code is scanned, the city name is now automatically decoded from Vercel's URL-encoded format
2. City names display correctly in the Analytics Dashboard's Geographic Distribution table
3. All new scan data will store and display human-readable city names

## Configuration

No configuration required. The fix uses the built-in JavaScript `decodeURIComponent()` function.

## Testing

### Unit Tests
```bash
npm run test
```
Tests verify:
- URL-encoded city names with spaces are decoded correctly
- Special characters (é, á, ã, ü) are decoded properly
- Simple city names pass through unchanged
- Malformed encoding is handled gracefully
- Missing headers return undefined

### E2E Tests
```bash
# Read .claude/commands/test_e2e.md for instructions
# Then execute .claude/commands/e2e/test_city_name_decoding.md
```
E2E tests verify:
- City names in Geographic Distribution table don't contain `%` characters
- Special characters and spaces display correctly
- Visual regression testing with screenshots

### Full Validation
```bash
npm run test          # Unit tests
npm run type-check    # TypeScript validation
npm run lint          # Code quality
npm run build         # Production build
```

## Notes

### Backward Compatibility
Existing data in the database remains URL-encoded. The fix only affects new scans created after deployment. Historical data with URL-encoded city names will continue to display with encoding. A database migration script could be run to fix historical data, but this is out of scope for the initial fix since it's a cosmetic issue.

### Implementation Location
The fix was applied at the data extraction layer (`src/lib/utils-client.ts`) rather than the display layer (`src/components/analytics/AnalyticsDashboard.tsx`) to ensure:
- All consumers of geolocation data automatically benefit
- Data is stored in human-readable format in the database
- No changes needed to display components
- Consistent behavior across the application

### Error Handling
The try-catch wrapper ensures that if Vercel ever sends malformed encoded strings, the application won't crash and will gracefully display the original value.

### Country Codes
Country codes (2-letter ISO codes like "AR", "US") are not affected by this issue as they don't contain spaces or special characters requiring URL encoding.
