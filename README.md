# TS Web UI (Shadcn Edition)

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions)

> **Note:** Replace `YOUR_USERNAME/YOUR_REPO` with your actual GitHub repository path.

A React/Shadcn implementation of the TS Web UI components - a comprehensive UI component library with JSON-driven forms, draggable windows, advanced tables, and more.

## Features

- 🎨 **JSON-Driven Forms** - Build complex forms from JSON definitions with 20+ field types
- 🖱️ **Draggable Windows** - Resizable, draggable window components
- 📊 **Advanced Tables** - Powered by TanStack Table with sorting, filtering, and pagination
- 🎭 **Dark Mode** - Full theme support with next-themes
- 📝 **Form Builder** - Visual form editor with drag & drop
- 🧩 **shadcn/ui** - Built on top of high-quality Radix UI primitives

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4
- **UI Library:** Shadcn/UI (Radix UI + Tailwind)
- **Forms:** React Hook Form + Zod validation
- **Tables:** TanStack Table v8
- **Drag & Drop:** @dnd-kit (form editor), react-rnd (windows)
- **State:** Zustand
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

```bash
# Development
pnpm dev              # Start dev server

# Code Quality
pnpm lint             # Check for linting errors
pnpm lint:fix         # Fix auto-fixable errors
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Run tests with coverage report

# Build
pnpm build            # Create production build
pnpm start            # Start production server
```

## Code Quality

This project maintains strict code quality standards:

- ✅ **ESLint** - Enforces code quality and consistency
- ✅ **Prettier** - Automatic code formatting
- ✅ **TypeScript** - Type safety throughout
- ✅ **Vitest** - Comprehensive test coverage (80%+ threshold)
- ✅ **Pre-commit Hooks** - Automatic formatting and linting before commits
- ✅ **CI/CD** - Automated testing and builds on every push

### Pre-commit Hooks

Husky and lint-staged automatically run before each commit:

- Prettier formats all staged files
- ESLint checks and fixes staged files
- Commits are blocked if checks fail

To bypass (not recommended): `git commit --no-verify`

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
├── components/
│   ├── ui/                 # Shadcn UI primitives
│   └── ts-web-ui/         # Custom components
│       ├── ts-form/       # JSON-driven forms
│       ├── ts-form-editor/# Visual form builder
│       ├── ts-table/      # Advanced tables
│       ├── ts-window/     # Draggable windows
│       └── ...
└── lib/                    # Utilities
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed development documentation and architecture guide.

## License

MIT
