# QR Track - QR Code Generator with Analytics

A web application that enables users to generate customizable QR codes with built-in analytics tracking. Generate QR codes with custom colors, track scans in real-time, and view detailed analytics dashboards.

Built using Agentic Development Workflows (ADW) and TAC (Tactical Agentic Coding) methodology.

## Features

- **QR Code Generation**
  - Generate QR codes from any URL
  - Customize foreground and background colors
  - Real-time preview
  - Download as PNG (512x512px)

- **Short URL System**
  - Automatic short URL generation
  - Self-hosted URL shortener
  - Collision-resistant short codes

- **Analytics Tracking**
  - Track scan events (timestamp, device, browser, location)
  - Total scan count
  - Scans over time (daily chart)
  - Device breakdown (mobile, tablet, desktop)
  - Browser distribution
  - Geographic distribution (country/city)

- **Analytics Dashboard**
  - Beautiful visualizations with Recharts
  - Real-time data updates
  - Shareable public analytics URLs
  - No authentication required

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS 3
- **Database:** Vercel Postgres (PostgreSQL 15+)
- **Deployment:** Vercel
- **Analytics:** Recharts
- **QR Generation:** qrcode library
- **Color Picker:** react-colorful

## Prerequisites

- Node.js 18.17.0 or higher
- pnpm 8.0.0 or higher (recommended) or npm
- Vercel account (for deployment and database)

## Quick Start

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then configure your Vercel Postgres credentials:

```env
POSTGRES_URL="postgres://user:password@host:5432/database"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Run Database Migrations

```bash
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Project Structure

```
qr-track-challenge/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── qr/generate/    # POST - Generate QR code
│   │   │   └── analytics/      # GET - Fetch analytics
│   │   ├── r/[shortCode]/      # GET - Redirect & track scans
│   │   ├── analytics/[id]/     # Analytics dashboard page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── qr-generator/       # QR code generator UI
│   │   └── analytics/          # Analytics dashboard
│   ├── lib/
│   │   ├── db.ts               # Database queries
│   │   ├── utils.ts            # Utility functions
│   │   └── validations.ts      # Zod schemas
│   └── types/
│       └── database.ts         # TypeScript types
├── db/
│   ├── migrations/             # SQL migration files
│   ├── schema.sql              # Full database schema
│   └── run-migrations.js       # Migration runner
├── docs/                       # Architecture documentation
│   ├── PRD.md                  # Product requirements
│   ├── ARCHITECTURE.md         # System architecture
│   ├── TECH_STACK.md           # Technology choices
│   └── DATA_MODEL.md           # Database schema
├── .claude/                    # Claude Code configuration
│   └── commands/               # Custom slash commands
└── public/                     # Static assets
```

## Database Schema

### qr_codes Table
Stores QR code metadata including target URL, colors, and short code.

| Column      | Type      | Description                  |
|-------------|-----------|------------------------------|
| id          | SERIAL    | Primary key                  |
| short_code  | VARCHAR   | Unique short URL code        |
| target_url  | TEXT      | Destination URL              |
| fg_color    | VARCHAR   | Foreground color (hex)       |
| bg_color    | VARCHAR   | Background color (hex)       |
| created_at  | TIMESTAMP | Creation timestamp           |

### scans Table
Stores individual scan events for analytics.

| Column        | Type      | Description                  |
|---------------|-----------|------------------------------|
| id            | SERIAL    | Primary key                  |
| qr_code_id    | INTEGER   | Foreign key to qr_codes      |
| scanned_at    | TIMESTAMP | Scan timestamp               |
| user_agent    | TEXT      | Browser user agent           |
| ip_address    | VARCHAR   | Truncated IP (privacy)       |
| country       | VARCHAR   | Country code (from IP)       |
| city          | VARCHAR   | City name (from IP)          |
| device_type   | VARCHAR   | mobile/tablet/desktop        |
| browser       | VARCHAR   | Browser name                 |

## API Endpoints

### POST /api/qr/generate
Generate a new QR code with analytics tracking.

**Request Body:**
```json
{
  "target_url": "https://example.com",
  "fg_color": "#000000",
  "bg_color": "#FFFFFF"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_code_id": 1,
    "short_code": "abc123xy",
    "short_url": "https://yourapp.com/r/abc123xy",
    "target_url": "https://example.com",
    "qr_code_data_url": "data:image/png;base64,...",
    "analytics_url": "https://yourapp.com/analytics/1"
  }
}
```

### GET /api/analytics/[qrCodeId]
Fetch analytics data for a QR code.

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_code": { ... },
    "analytics": {
      "total_scans": 42,
      "scans_by_date": [...],
      "device_breakdown": [...],
      "browser_breakdown": [...],
      "location_breakdown": [...]
    }
  }
}
```

### GET /r/[shortCode]
Redirect to target URL and track scan event.

**Response:** 302 redirect to target URL

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables (see .env.example)

3. Setup Vercel Postgres:
   - Go to your project dashboard
   - Navigate to Storage tab
   - Create a Postgres database
   - Copy connection string to environment variables

4. Run migrations:
   ```bash
   # Connect to your Vercel Postgres database
   npm run db:migrate
   ```

5. Deploy:
   ```bash
   vercel --prod
   ```

Your app will be live at https://your-project.vercel.app

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npm run type-check

# Run database migrations
npm run db:migrate
```

## Architecture Documentation

Comprehensive architecture documentation is available in the `docs/` directory:

- **PRD.md** - Product Requirements Document
- **ARCHITECTURE.md** - System Architecture and Design Decisions
- **TECH_STACK.md** - Technology Stack and Justifications
- **DATA_MODEL.md** - Database Schema and Queries

## Agentic Development Workflows (ADW)

This project was built using ADW methodology with Claude Code. Available slash commands:

### Core Workflow
- `/architect` - Design project architecture (interactive)
- `/scaffold` - Generate project structure
- `/feature` - Plan new features
- `/implement` - Implement a plan
- `/test` - Generate tests
- `/review` - Code review
- `/document` - Generate documentation

### Advanced
- `/bug` - Plan bug fixes
- `/patch` - Fix review issues
- `/pull_request` - Create PR
- `/test_e2e` - End-to-end testing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

---

🤖 Built with [Claude Code](https://claude.com/claude-code) and TAC (Tactical Agentic Coding) methodology
