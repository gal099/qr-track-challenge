# E2E Test: City Name Decoding

Test that city names in the Geographic Distribution table are properly decoded and display human-readable text instead of URL-encoded values.

## User Story

As a user viewing QR code analytics
I want to see properly formatted city names in the Geographic Distribution table
So that I can easily understand where scans are coming from without seeing URL-encoded text

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the home page
3. **Verify** the page contains a "View Analytics" link in the header

4. Generate a QR code if needed:
   - If no QR codes exist yet, enter a valid URL (e.g., "https://example.com")
   - Click "Generate QR Code" button
   - Wait for generation to complete

5. Navigate to `/analytics` page
6. Take a screenshot of the analytics dashboard
7. **Verify** at least one QR code exists in the list

8. Click on a QR code to navigate to its individual analytics page
9. Scroll down to the "Geographic Distribution" section
10. Take a screenshot of the Geographic Distribution table
11. **Verify** the Geographic Distribution section exists with a table containing:
    - "City" column header
    - "Country" column header
    - "Scans" column header

12. If scan data exists in the Geographic Distribution table:
    - **Verify** city names do NOT contain URL-encoded characters like `%20` or `%C3%`
    - **Verify** city names with spaces display properly (e.g., "Tres Arroyos" not "Tres%20Arroyos")
    - **Verify** city names with special characters display properly (e.g., "General Fernández Oro" not "General%20Fern%C3%A1ndez%20Oro")
    - **Verify** simple city names without encoding display correctly (e.g., "Tokyo")
    - Take a screenshot highlighting the city names column

13. If no scan data exists yet:
    - Take a screenshot showing the empty state or "No data" message
    - **Note**: This is expected if no scans have occurred yet
    - The test passes as long as the structure is correct

14. Navigate back to the analytics dashboard using browser back button
15. Take a screenshot of the final state

## Success Criteria

- Geographic Distribution section is visible on individual analytics page
- Table displays with City, Country, and Scans columns
- If scan data exists:
  - City names are human-readable (no URL encoding like %20 or %C3%)
  - City names with spaces display correctly (e.g., "Tres Arroyos")
  - City names with special characters display correctly (e.g., "Fernández")
  - No `%` characters appear in city names
- If no scan data exists, empty state is handled gracefully
- 4-5 screenshots are taken: home page, analytics dashboard, geographic distribution, city names detail, final state

## Edge Cases to Note

- City names with spaces should display with actual spaces, not %20
- City names with non-ASCII characters (accents, umlauts, etc.) should display correctly
- Simple city names without encoding should pass through unchanged
- The fix applies to new scans; existing URL-encoded data in the database may still appear encoded until re-scanned
