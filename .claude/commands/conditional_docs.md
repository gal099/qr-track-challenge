# Conditional Documentation Guide

This prompt helps you determine what documentation you should read based on the specific changes you need to make in the codebase. Review the conditions below and read the relevant documentation before proceeding with your task.

## Instructions
- Review the task you've been asked to perform
- Check each documentation path in the Conditional Documentation section
- For each path, evaluate if any of the listed conditions apply to your task
  - IMPORTANT: Only read the documentation if any one of the conditions match your task
- IMPORTANT: You don't want to excessively read documentation. Only read the documentation if it's relevant to your task.

## Conditional Documentation

- README.md
  - Conditions:
    - When operating on anything under app/server
    - When operating on anything under app/client
    - When first understanding the project structure
    - When you want to learn the commands to start or stop the server or client

- app/client/src/style.css
  - Conditions:
    - When you need to make changes to the client's style

- .claude/commands/classify_adw.md
  - Conditions:
    - When adding or removing new `adws/adw_*.py` files

- adws/README.md
  - Conditions:
    - When you're operating in the `adws/` directory

- app_docs/feature-80778bfe-qr-code-generation.md
  - Conditions:
    - When working with QR code generation features
    - When implementing real-time preview functionality
    - When troubleshooting QR code rendering issues
    - When modifying the QRGenerator component
    - When adding or updating QR code tests
    - When working with color customization features
    - When debugging QR code download functionality

- app_docs/feature-07707eb7-url-shortening-redirect.md
  - Conditions:
    - When working with URL shortening or redirect functionality
    - When implementing or modifying the /r/[shortCode] route
    - When adding tests for redirect routes or scan tracking
    - When troubleshooting redirect issues or 404 errors
    - When working with scan event tracking or analytics
    - When implementing user agent parsing or device detection
    - When working with geolocation extraction from headers
    - When debugging IP address handling or privacy features

- app_docs/feature-5d00a77d-analytics-dashboard.md
  - Conditions:
    - When working with analytics dashboard features
    - When implementing or modifying the /analytics route or pages
    - When working with QR code listing or summary views
    - When implementing data visualization or charts with Recharts
    - When adding share link or clipboard functionality
    - When working with the QRCodeList or AnalyticsDashboard components
    - When troubleshooting analytics data aggregation or scan counting
    - When implementing navigation between QR list and individual analytics
    - When working with the /api/qr/list endpoint
    - When debugging getAllQRCodes database queries

- app_docs/feature-2dbc705d-production-deployment-polish.md
  - Conditions:
    - When deploying the application to production
    - When setting up Vercel or configuring deployment settings
    - When working with environment variables or configuration
    - When implementing loading states or skeleton loaders
    - When improving error handling in API routes
    - When enhancing input validation or user feedback
    - When adding security headers or production configurations
    - When troubleshooting production deployment issues
    - When working with vercel.json or .vercelignore files
    - When implementing copy-to-clipboard functionality
    - When optimizing images with Next.js Image component

- app_docs/feature-6d335ed1-supabase-connection-fix.md
  - Conditions:
    - When troubleshooting database connection errors
    - When working with database connection configuration in src/lib/db.ts
    - When migrating database libraries or connection methods
    - When setting up Supabase Postgres connections
    - When replacing @vercel/postgres with pg library
    - When implementing or modifying connection pooling
    - When working with parameterized queries
    - When debugging production database connection issues
    - When separating client-safe utilities from server-only utilities
    - When working with src/lib/utils.ts or src/lib/utils-client.ts

- app_docs/feature-79ac0b83-plan-file-retry.md
  - Conditions:
    - When working with ADW plan file verification logic
    - When implementing retry mechanisms for file system operations
    - When troubleshooting race conditions in file existence checks
    - When debugging "Plan file does not exist" errors in adws/adw_plan.py
    - When adding polling or retry logic to ADW workflows
    - When handling filesystem synchronization delays

- app_docs/feature-10abd5de-ui-text-contrast-fix.md
  - Conditions:
    - When working on UI accessibility improvements
    - When fixing text contrast or color visibility issues
    - When implementing WCAG compliance fixes
    - When modifying text colors in the QRGenerator component
    - When working with Tailwind CSS text color utilities
    - When troubleshooting placeholder or input text visibility
    - When adding or modifying color code displays
    - When improving button text contrast
    - When creating E2E tests for visual accessibility

- app_docs/feature-48538fc4-dashboard-scan-count-fix.md
  - Conditions:
    - When troubleshooting scan count display issues in analytics dashboard
    - When working with the getAllQRCodes() database function in src/lib/db.ts
    - When debugging PostgreSQL COUNT() queries or BIGINT type handling
    - When fixing data inconsistencies between dashboard list and detail views
    - When implementing scan count aggregation with LEFT JOIN queries
    - When working with node-postgres (pg) library type conversions
    - When creating E2E tests for analytics data accuracy

- app_docs/feature-d059652c-city-name-decoding.md
  - Conditions:
    - When working with geolocation data from Vercel Edge headers
    - When troubleshooting URL-encoded city names in analytics
    - When implementing or modifying getGeolocationFromHeaders() in src/lib/utils-client.ts
    - When debugging Geographic Distribution table display issues
    - When adding URL decoding logic for user-facing text
    - When working with special characters or international city names
    - When creating E2E tests for city name display validation

- app_docs/feature-350ce5e4-admin-panel-qr-management.md
  - Conditions:
    - When working with admin panel authentication or authorization
    - When implementing or modifying password-protected routes
    - When working with session management or cookie-based authentication
    - When implementing rate limiting for authentication attempts
    - When working with soft delete functionality in the database
    - When modifying QR code deletion features
    - When troubleshooting deleted QR code filtering in queries
    - When working with the /admin or /admin/dashboard routes
    - When implementing delete confirmation modals or UI feedback
    - When working with toast notifications for success/error messages
    - When creating E2E tests for admin functionality
    - When debugging deleted_at column queries or database migrations

- app_docs/feature-189d1c96-author-field.md
  - Conditions:
    - When working with QR code author tracking or creator identification
    - When implementing or modifying the author field in QR code generation
    - When adding validation for text input fields with character limits
    - When working with the QRGenerator component's form fields
    - When troubleshooting author display in analytics dashboard or QR code cards
    - When implementing client-side and server-side validation synchronization
    - When creating database migrations for new columns with default values
    - When working with Zod schema validation for alphanumeric inputs
    - When debugging author field validation errors
    - When creating E2E tests for form input validation

- app_docs/feature-64ca1d17-qr-thumbnail-download.md
  - Conditions:
    - When working with QR code thumbnails or preview images in analytics
    - When implementing download functionality for QR codes
    - When adding interactive hover states with overlays
    - When working with the qrcode library for client-side QR generation
    - When implementing Canvas API for image conversion (SVG to PNG)
    - When troubleshooting QR code color preservation in analytics views
    - When adding click-to-download features
    - When implementing keyboard accessibility for interactive elements
    - When working with the AnalyticsDashboard component's header section
    - When debugging QR code generation or download issues in analytics
    - When creating E2E tests for QR code download functionality

- app_docs/feature-a8e0635d-deleted-qr-analytics-filter.md
  - Conditions:
    - When working with deleted QR code filtering in analytics
    - When troubleshooting deleted QR codes appearing in analytics dashboard
    - When implementing or debugging soft delete behavior in analytics
    - When adding tests for deleted QR code filtering
    - When working with the QRCodeList component's display logic
    - When verifying database filtering of deleted records in getAllQRCodes()
    - When implementing 404 handling for deleted QR code access
    - When creating E2E tests for QR code deletion workflows
    - When debugging issues with QR codes not disappearing after deletion

- app_docs/feature-f9c10ae5-analytics-cache-fix.md
  - Conditions:
    - When troubleshooting analytics dashboard not reflecting database changes
    - When working with Next.js App Router caching behavior
    - When implementing or modifying the /api/qr/list route handler
    - When debugging stale data issues in analytics dashboard
    - When adding dynamic rendering configuration to route handlers
    - When working with export const dynamic = 'force-dynamic' in Next.js
    - When troubleshooting hard refresh not fetching fresh data
    - When implementing cache disabling for API endpoints
    - When debugging Next.js route handler caching
    - When ensuring real-time data reflection in analytics views

- app_docs/feature-2a8b5aed-logo-main-screen.md
  - Conditions:
    - When working with the landing page logo or branding elements
    - When implementing or modifying images on the main screen
    - When working with Next.js Image component for static assets
    - When adding or replacing brand assets in the public directory
    - When troubleshooting logo display or positioning issues
    - When implementing responsive images on the landing page
    - When creating E2E tests for visual branding elements

- app_docs/bug-b9c63120-feature-card-spacing.md
  - Conditions:
    - When working with feature cards on the homepage landing page
    - When fixing spacing or layout inconsistencies in card components
    - When troubleshooting card height alignment issues
    - When modifying Tailwind CSS classes for consistent spacing
    - When implementing or debugging icon-to-heading spacing
    - When working with the Features section in src/app/page.tsx
    - When creating E2E tests for feature card layout validation
