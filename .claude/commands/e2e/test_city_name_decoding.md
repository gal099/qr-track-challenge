# E2E Test: City Name Decoding

Test that city names in the Geographic Distribution table are properly decoded and displayed without URL encoding.

## User Story

As a user viewing analytics for my QR codes
I want city names to display with proper human-readable text
So that I can understand the geographic distribution of my scans without seeing URL-encoded characters

## Test Steps

1. Navigate to the `Application URL` (http://localhost:3000)
2. Take a screenshot of the home page

3. Navigate to `/analytics` to view the analytics dashboard
4. Take a screenshot of the analytics dashboard

5. If no QR codes exist:
   - Navigate back to home page
   - Enter a valid URL (e.g., "https://example.com")
   - Click "Generate QR Code" button
   - Wait for generation to complete
   - Navigate back to `/analytics`

6. Click on a QR code card to view its individual analytics page
7. Take a screenshot of the individual analytics page

8. Scroll to the "Geographic Distribution" section (if present)
9. Take a screenshot of the Geographic Distribution table

10. **Verify** the Geographic Distribution table (if it has data):
    - City names do NOT contain `%20` (URL-encoded space)
    - City names do NOT contain `%C3%` or other URL-encoded UTF-8 sequences
    - City names display with proper spaces between words
    - City names display special characters correctly (e.g., accented letters like á, é, ñ, ü)

11. If the Geographic Distribution section shows scan data:
    - **Verify** each city name in the table is human-readable
    - **Verify** no row contains visible `%` characters in the city column
    - **Verify** country codes (like "AR", "US", "DE") display correctly

12. Take a final screenshot of the full analytics page

## Success Criteria

- Analytics page loads successfully
- Geographic Distribution section is visible (if scans exist)
- City names are properly decoded and human-readable
- No URL-encoded characters (`%20`, `%C3%A1`, etc.) appear in city names
- Special characters in city names (spaces, accents) display correctly
- 5 screenshots are taken: home page, analytics dashboard, individual analytics, geographic distribution section, final state

## Notes

- This test validates the fix for bug #20 where city names like "General%20Fern%C3%A1ndez%20Oro" were displayed instead of "General Fernández Oro"
- The fix decodes city names at the data extraction layer in `getGeolocationFromHeaders()`
- Existing data in the database may still be URL-encoded; this fix only affects new scans
