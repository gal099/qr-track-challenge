# QR Track - TAC Challenge

QR Code Generator with Analytics - Built using Agentic Development Workflows (ADW)

## Project Structure

```
qr-track-challenge/
├── .claude/
│   └── commands/        # 25 slash commands including review, test, document
├── adws/               # ADW workflow scripts
│   ├── adw_sdlc.py     # Complete SDLC workflow
│   ├── adw_plan_build.py
│   ├── adw_test.py
│   ├── adw_review.py
│   ├── adw_document.py
│   └── adw_modules/    # Shared modules
└── README.md

```

## Workflow Scripts

- **adw_sdlc.py** - Complete Software Development Life Cycle (Plan → Build → Test → Review → Document)
- **adw_plan_build.py** - Plan + Build only
- **adw_plan_build_test.py** - Plan + Build + Test
- **adw_plan_build_test_review.py** - Plan + Build + Test + Review

## Slash Commands

### Core Workflow
- `/feature` - Plan new features
- `/bug` - Plan bug fixes
- `/chore` - Plan maintenance tasks
- `/implement` - Implement a plan
- `/test` - Generate tests
- `/review` - Code review
- `/document` - Generate documentation

### Setup & Architecture
- `/architect` - Design project architecture (interactive)
- `/scaffold` - Generate project structure
- `/prime` - Analyze existing codebase
- `/install` - Install dependencies

### Advanced
- `/patch` - Fix review issues
- `/resolve_failed_test` - Fix failing tests
- `/test_e2e` - End-to-end testing
- `/pull_request` - Create PR

## Usage

### Complete SDLC for an issue:
```bash
uv run adws/adw_sdlc.py <issue-number>
```

### Plan + Build only:
```bash
uv run adws/adw_plan_build.py <issue-number>
```

## Challenge Requirements

- ✅ 5 GitHub issues created
- ✅ Issues resolved using ADW workflows
- ✅ Commits with `Co-Authored-By: Claude Sonnet 4.5`
- ✅ Full SDLC: Plan → Build → Test → Review → Document
- ✅ Deploy to Vercel

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript 5+
- Tailwind CSS
- Vercel Postgres
- Vercel Deployment

---

🤖 Built with [Claude Code](https://claude.com/claude-code) and TAC (Tactical Agentic Coding) methodology
