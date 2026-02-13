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