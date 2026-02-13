# Contributing to QR Track

Thank you for your interest in contributing to QR Track! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- pnpm (recommended) or npm
- Git
- A Vercel account (for database access)

### Local Development Setup

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/qr-track-challenge.git
   cd qr-track-challenge
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your database credentials (see [DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup).

5. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Visit http://localhost:3000 to see the application.

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-qr-logo-support`)
- `fix/` - Bug fixes (e.g., `fix/analytics-chart-overflow`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` - Documentation updates (e.g., `docs/improve-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/extract-validation-utils`)

### Commit Message Format

Follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(qr-generator): add support for custom logo overlay
fix(analytics): resolve chart rendering on mobile devices
docs(readme): update deployment instructions
test(api): add tests for QR generation endpoint
```

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Run quality checks**

   ```bash
   npm run lint        # Check for linting errors
   npm run type-check  # Check TypeScript types
   npm run test        # Run tests
   npm run build       # Verify build succeeds
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### PR Requirements

Before a PR can be merged:

- [ ] All tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Code review approved
- [ ] Documentation updated (if applicable)

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Export types from dedicated files

```typescript
// Good
interface QRCodeInput {
  target_url: string
  fg_color?: string
  bg_color?: string
}

// Avoid
const input: any = { ... }
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use TypeScript props interfaces

```typescript
interface Props {
  qrCodeId: string
}

export default function AnalyticsDashboard({ qrCodeId }: Props) {
  // ...
}
```

### File Organization

- Place components in `/src/components/`
- Place utilities in `/src/lib/`
- Place types in `/src/types/`
- Co-locate tests with source files

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Support dark mode with `dark:` variants

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- path/to/test.ts
```

### Writing Tests

- Test public APIs and user-facing behavior
- Use descriptive test names
- Follow Arrange-Act-Assert pattern

```typescript
describe('QR Code Generation', () => {
  it('generates a valid QR code for a URL', async () => {
    // Arrange
    const input = { target_url: 'https://example.com' }

    // Act
    const result = await generateQRCode(input)

    // Assert
    expect(result.short_code).toBeDefined()
    expect(result.qr_code_data_url).toContain('data:image/png')
  })
})
```

## API Guidelines

### Error Handling

Return consistent error responses:

```typescript
// Success response
return NextResponse.json({
  success: true,
  data: { ... }
})

// Error response
return NextResponse.json(
  { success: false, error: 'User-friendly message' },
  { status: 400 }
)
```

### Validation

Use Zod schemas for input validation:

```typescript
const schema = z.object({
  target_url: z.string().url('Invalid URL format'),
  fg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000')
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Document complex logic inline
- Keep comments up-to-date with code changes

```typescript
/**
 * Generate a unique short code for a QR code
 * @returns A unique 8-character alphanumeric string
 */
export async function generateUniqueShortCode(): Promise<string> {
  // ...
}
```

### Feature Documentation

When adding new features:

1. Update README.md if user-facing
2. Add/update API documentation
3. Create feature documentation in `app_docs/` if substantial

## Questions?

If you have questions about contributing:

1. Check existing issues and PRs
2. Open a new issue with the "question" label
3. Join discussions in existing issues

Thank you for contributing to QR Track!
