# Product Backlog - QR Track

## 🚀 Current Sprint (Priority 1)

### In Progress
- [x] #14 - Fix: Race condition in ADW plan file verification
- [ ] #12 - UI: Low contrast text (placeholders, buttons)
- [ ] #13 - Bug: Analytics dashboard shows incorrect scan count

### Ready to Start
- [ ] #19 - Feature: Admin panel with QR delete functionality (password-protected)

---

## 📋 Next Sprint (Priority 2)

### Authentication & User Management
- [ ] **Auth Setup**: Implement NextAuth.js
  - GitHub OAuth provider
  - Google OAuth provider (optional)
  - Session management

- [ ] **QR Ownership**: Add user association
  - Migration: Add `user_id` column to `qr_codes` table
  - Legacy QRs remain public (null user_id)
  - New QRs automatically assigned to logged-in user

- [ ] **User Dashboard**: Personal QR management
  - Route: `/dashboard` (requires authentication)
  - List only user's QR codes
  - Delete, edit, view analytics (own QRs only)
  - Empty state for new users

---

## 🔮 Future Features (Priority 3)

### Anonymous Mode
- [ ] **Client-side QR Generation**
  - Checkbox: "Don't save to database"
  - Generate QR using qrcode library (client-side only)
  - Show QR preview + download button
  - No tracking, no analytics
  - Banner: "Want analytics? Create an account"

### QR Management Enhancements
- [ ] **Edit QR Target URL**
  - Update target_url for existing QR
  - Keep short code, update redirect
  - History/audit log of changes

- [ ] **Bulk Operations**
  - Select multiple QRs
  - Bulk delete
  - Bulk export

- [ ] **Custom Short Codes**
  - Allow users to specify custom short codes
  - Validation: unique, alphanumeric, 6-12 chars
  - Fallback to auto-generated if taken

### UI/UX Improvements
- [ ] **Custom 404 Page**
  - Branded 404 for deleted/invalid QR short URLs
  - Helpful message
  - Link back to homepage
  - Analytics tracking for 404s

- [ ] **QR Templates/Designs**
  - Pre-made color schemes
  - Logo embedding
  - Different QR styles (rounded, dots, etc.)

- [ ] **Analytics Export**
  - Export to CSV
  - Date range filtering
  - Scheduled reports (email)

### Team Features
- [ ] **Sharing & Collaboration**
  - Share QR with specific users
  - View-only vs edit permissions
  - Transfer ownership

- [ ] **Organizations/Teams**
  - Create team workspaces
  - Team-wide analytics
  - Role-based access control

---

## 🐛 Known Issues

### Active Bugs
- [x] #14 - Race condition in PLAN phase (fixed, merged)
- [x] #15 - Backtick parsing in plan file path (fixed in #14, closed)
- [ ] #12 - Low contrast text accessibility issue
- [ ] #13 - Analytics scan count showing 0 instead of actual count

### Tech Debt
- [ ] Add comprehensive error handling to API routes
- [ ] Implement rate limiting for QR generation
- [ ] Add database indexes for performance
- [ ] Set up monitoring/logging (Sentry, LogRocket, etc.)
- [ ] Add E2E tests for critical user flows

---

## 📊 Metrics & Goals

### MVP Goals (Completed ✅)
- [x] QR code generation with customization
- [x] Short URL system with redirects
- [x] Analytics tracking (scans, devices, locations)
- [x] Public analytics dashboard

### V1.0 Goals (In Progress 🔄)
- [ ] User authentication & ownership
- [ ] Personal QR management dashboard
- [ ] Delete functionality
- [ ] Anonymous mode

### V2.0 Goals (Future 🔮)
- [ ] Custom short codes
- [ ] QR templates & designs
- [ ] Teams & collaboration
- [ ] Advanced analytics & exports

---

## 🎯 Sprint Planning Notes

**Current Focus:** Bug fixes + Admin panel MVP
**Next Focus:** Authentication system
**Timeline:** 2-3 week sprints

**Decision Log:**
- 2026-02-13: Decided on soft delete (deleted_at) over hard delete
- 2026-02-13: Admin panel with password protection as interim solution before full auth
- 2026-02-13: Custom 404 page added to backlog for better UX
- 2026-02-13: Easter egg password "yourpasswordhere" for admin panel MVP
- 2026-02-13: Issue #15 closed as duplicate - fixed together with #14 to avoid conflicts

---

*Last updated: 2026-02-13*
