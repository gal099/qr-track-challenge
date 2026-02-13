# QR Code Generation with Real-Time Preview

**ADW ID:** 80778bfe
**Date:** 2026-02-12
**Specification:** specs/issue-2-adw-80778bfe-sdlc_planner-qr-code-generation.md

## Overview

A complete QR code generation system with real-time preview, color customization, and comprehensive test coverage. Users can enter URLs, customize colors, see live previews as they type, and generate trackable QR codes with analytics integration.

## Screenshots

![Initial State](assets/01_initial_state.png)

## What Was Built

- Real-time QR code preview with debounced updates
- Client-side QR code generation using the qrcode library
- Color customization with hex color pickers (foreground/background)
- Server-side QR code generation with database persistence
- Short URL generation with tracking capabilities
- Download QR codes as PNG files
- Analytics integration for tracking scans
- Comprehensive test suite with 100% coverage for critical paths

## Technical Implementation

### Files Modified

- `src/components/qr-generator/QRGenerator.tsx`: Enhanced with real-time preview functionality using client-side QR code generation with 300ms debouncing
- `src/lib/utils.ts`: Added utility functions for URL and hex color validation
- `src/app/api/qr/generate/route.ts`: API endpoint for server-side generation with database persistence
- `jest.config.js`: Jest configuration for Next.js with module path mapping
- `jest.setup.js`: Test environment setup with Testing Library extensions
- `package.json`: Added testing dependencies and test scripts

### New Test Files Created

- `src/components/qr-generator/__tests__/QRGenerator.test.tsx`: Component tests with 419 lines covering all user interactions
- `src/app/api/qr/generate/__tests__/route.test.ts`: Integration tests for API endpoint with 253 lines
- `src/lib/__tests__/utils.test.ts`: Utility function tests with 245 lines
- `src/lib/__tests__/validations.test.ts`: Validation schema tests with 215 lines
- `.claude/commands/e2e/test_qr_code_generation.md`: E2E test specification with 69 lines

### Key Changes

- **Real-time preview**: Implemented client-side QR code generation that updates as users type or change colors, with 300ms debouncing to prevent excessive re-renders
- **Dual QR generation**: Preview shows the actual target URL, while the generated QR code uses a tracking short URL for analytics
- **Comprehensive validation**: URL format validation and hex color validation with clear error messages
- **Test infrastructure**: Set up Jest with React Testing Library and achieved high test coverage across all layers
- **Loading states**: Visual feedback during preview generation and API calls

## How to Use

1. **Enter a URL**: Type or paste a URL in the "Target URL" field (e.g., https://example.com)
2. **Customize colors** (optional):
   - Click the "Foreground Color" button to choose the QR code dot color
   - Click the "Background Color" button to choose the background color
   - Click outside the color picker to close it
3. **Preview**: The QR code preview updates automatically as you type or change colors
4. **Generate**: Click "Generate QR Code" to save the QR code to the database and get a tracking URL
5. **Download**: Click "Download PNG" to save the QR code as a PNG file
6. **View Analytics**: Click "View Analytics" to see scan statistics for the generated QR code

## Configuration

### Environment Variables
- Database connection variables for Vercel Postgres (inherited from existing setup)
- No additional configuration required

### Default Colors
- Foreground: `#000000` (black)
- Background: `#FFFFFF` (white)

### QR Code Settings
- Width: 256px
- Margin: 2 modules
- Error correction: Medium (default)

## Testing

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Generate Coverage Report
```bash
pnpm test:coverage
```

### Run E2E Tests
1. Start the development server: `pnpm dev`
2. Read `.claude/commands/test_e2e.md`
3. Execute `.claude/commands/e2e/test_qr_code_generation.md`

### Type Checking
```bash
pnpm type-check
```

### Build Validation
```bash
pnpm build
```

## Notes

- The preview QR code encodes the target URL directly, while the generated QR code encodes a tracking short URL - this allows users to verify their content while enabling analytics
- Preview generation happens entirely client-side for instant feedback without database writes
- The 300ms debounce delay strikes a balance between responsiveness and performance
- All test files use mocked database connections and external dependencies for reliable testing
- The qrcode library works in both Node.js (server) and browser (client) environments
- Color pickers use the react-colorful library for a consistent UI experience
- Future enhancement: Add contrast checking to warn users when foreground/background colors are too similar for reliable scanning
