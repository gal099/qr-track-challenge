# Bug: Geographic Distribution displays URL-encoded city names

## Metadata
issue_number: `20`
adw_id: `d059652c`
issue_json: `{"number":20,"title":"Bug: Geographic Distribution displays URL-encoded city names","body":"## Bug Description\nThe Geographic Distribution table in the analytics dashboard is displaying URL-encoded city names instead of human-readable text.\n\n## Current Behavior\nCity names appear as:\n- `General%20Fern%C3%A1ndez%20Oro` \n- `Tres%20Arroyos`\n\n## Expected Behavior\nCity names should display as:\n- `General Fernández Oro`\n- `Tres Arroyos`\n\n## Location\n**Component**: Analytics Dashboard - Geographic Distribution section\n**File**: Likely in `src/app/analytics/[shortCode]/page.tsx` or related component\n\n## Root Cause\nCity names from the geolocation API are being stored/displayed with URL encoding without proper decoding using `decodeURIComponent()`.\n\n## Proposed Fix\nApply `decodeURIComponent()` to city names before displaying:\n\n```typescript\nconst decodedCity = decodeURIComponent(scan.city || 'Unknown')\n```\n\n## Steps to Reproduce\n1. Visit analytics dashboard for any QR code\n2. Scroll to \"Geographic Distribution\" section\n3. Observe city names with special characters or spaces\n\n## Impact\n- **Severity**: Low (cosmetic issue, doesn't affect functionality)\n- **User Experience**: Confusing display, looks unprofessional\n- **Affected**: All city names with special characters or spaces\n\n## Screenshot\nSee attached screenshot showing `General%20Fern%C3%A1ndez%20Oro` instead of proper city name.\n\n## Additional Context\n- Country codes (AR) display correctly\n- Only affects city column\n- Likely affects all non-ASCII city names globally"}`

## Bug Description
The Geographic Distribution table in the analytics dashboard displays URL-encoded city names instead of human-readable text. For example, `General%20Fern%C3%A1ndez%20Oro` is shown instead of `General Fernández Oro`, and `Tres%20Arroyos` instead of `Tres Arroyos`. This is a cosmetic issue that affects all city names containing spaces or special characters.

## Problem Statement
Vercel's Edge headers (`x-vercel-ip-city`) provide city names in URL-encoded format. The application stores these encoded values directly in the database and displays them without decoding, resulting in an unprofessional appearance in the analytics dashboard.

## Solution Statement
Apply `decodeURIComponent()` to the city name when extracting it from Vercel headers in `src/lib/utils-client.ts`. This ensures the city is stored in a human-readable format in the database and displayed correctly everywhere without requiring changes to the display layer.

## Steps to Reproduce
1. Scan a QR code from a location with a city name containing spaces or special characters (e.g., "General Fernández Oro" in Argentina)
2. Visit the analytics dashboard for that QR code at `/analytics/[qrCodeId]`
3. Scroll to the "Geographic Distribution" section
4. Observe that the city name displays as `General%20Fern%C3%A1ndez%20Oro` instead of `General Fernández Oro`

## Root Cause Analysis
The bug originates in `src/lib/utils-client.ts` in the `getGeolocationFromHeaders` function (lines 36-41). This function extracts the city from Vercel's `x-vercel-ip-city` header and returns it as-is:

```typescript
export function getGeolocationFromHeaders(headers: Headers) {
  const country = headers.get('x-vercel-ip-country') || undefined
  const city = headers.get('x-vercel-ip-city') || undefined

  return { country, city }
}
```

Vercel sends city names URL-encoded (e.g., `General%20Fern%C3%A1ndez%20Oro`). Since no decoding is applied:
1. The encoded value is stored in the database via `createScan()` in `src/lib/db.ts`
2. The encoded value is returned by `getQRCodeAnalytics()` in `src/lib/db.ts`
3. The encoded value is displayed in `AnalyticsDashboard.tsx` at line 299

Country codes do not have this issue because they are 2-letter ISO codes (e.g., "AR") that don't contain spaces or special characters.

## Relevant Files
Use these files to fix the bug:

- `src/lib/utils-client.ts` - Contains `getGeolocationFromHeaders()` where the city is extracted from Vercel headers. **This is where the fix should be applied** by adding `decodeURIComponent()` to decode the city name.
- `src/lib/utils-client.test.ts` - Unit tests for `utils-client.ts`. **Should add tests** to verify city name decoding works correctly.
- `src/components/analytics/AnalyticsDashboard.tsx` - Displays the city name in the Geographic Distribution table (line 299). No changes needed here since the fix will be applied at the source.
- `src/lib/db.ts` - Contains `createScan()` that stores the city and `getQRCodeAnalytics()` that retrieves it. No changes needed.
- `src/app/r/[shortCode]/route.ts` - Calls `getGeolocationFromHeaders()` to get the city before storing. No changes needed.
- `.claude/commands/test_e2e.md` - E2E test runner instructions.
- `.claude/commands/e2e/test_analytics_dashboard.md` - Reference for E2E test format.

### New Files

- `.claude/commands/e2e/test_city_name_decoding.md` - E2E test to verify city names display correctly in the Geographic Distribution table.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Fix the `getGeolocationFromHeaders` function

- Open `src/lib/utils-client.ts`
- Modify the `getGeolocationFromHeaders` function to decode the city name using `decodeURIComponent()`
- Wrap in try-catch to handle malformed URI encoding gracefully (return original value if decoding fails)
- The updated function should:
  ```typescript
  export function getGeolocationFromHeaders(headers: Headers) {
    const country = headers.get('x-vercel-ip-country') || undefined
    const rawCity = headers.get('x-vercel-ip-city') || undefined

    let city = rawCity
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity)
      } catch {
        // Keep original value if decoding fails
        city = rawCity
      }
    }

    return { country, city }
  }
  ```

### 2. Add unit tests for city name decoding

- Open or create `src/lib/__tests__/utils-client.test.ts`
- Add test cases for `getGeolocationFromHeaders`:
  - Test that URL-encoded city names are decoded (e.g., `General%20Fern%C3%A1ndez%20Oro` becomes `General Fernández Oro`)
  - Test that simple city names without encoding pass through unchanged
  - Test that missing city header returns undefined
  - Test that malformed encoding returns the original value gracefully

### 3. Create E2E test file for city name decoding validation

- Read `.claude/commands/e2e/test_analytics_dashboard.md` and `.claude/commands/e2e/test_redirect_flow.md` for reference
- Create `.claude/commands/e2e/test_city_name_decoding.md` that validates:
  - Navigate to an analytics page with scan data
  - Locate the Geographic Distribution table
  - Verify city names do not contain `%` URL encoding characters
  - Verify city names display with proper spaces and special characters
  - Take screenshots of the Geographic Distribution section

### 4. Run validation commands

Execute the validation commands below to confirm the bug is fixed with zero regressions.

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run test` - Run all unit tests including new tests for city decoding
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run type-check` - Verify TypeScript types are correct
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run lint` - Verify linting passes
- `cd /Users/juanbaez/Documents/qr-track-challenge && npm run build` - Verify production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_city_name_decoding.md` to validate city names display correctly in the analytics dashboard

## Notes

- **Backward compatibility**: Existing data in the database will still be URL-encoded. The fix only affects new scans. To fix historical data, a database migration script could be run, but this is out of scope for this bug fix since it's a cosmetic issue.
- **No library additions required**: `decodeURIComponent()` is a built-in JavaScript function.
- **Defensive coding**: The try-catch wrapper ensures that if Vercel ever sends a malformed encoded string, the application won't crash and will gracefully display the original value.
- **Root cause location**: The fix is applied at the data extraction layer (`getGeolocationFromHeaders`) rather than the display layer (`AnalyticsDashboard.tsx`) to ensure all consumers of this data benefit from the fix.
