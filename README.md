# TS Web UI (Shadcn Edition)

[![CI/CD](https://github.com/janbkrejci/TSWebUI-shadcn/actions/workflows/quality.yml/badge.svg)](https://github.com/janbkrejci/TSWebUI-shadcn/actions/workflows/quality.yml)

A React/Shadcn implementation of the TS Web UI components - a comprehensive UI component library with JSON-driven forms, draggable windows, advanced tables, and more.

## Component Registry (shadcn add)

You can easily add these components to your own project using the shadcn CLI. No need to install a heavy NPM package.

### 1. Initialize shadcn/ui

If you haven't already, initialize shadcn/ui in your project:

```bash
npx shadcn@latest init
```

### 2. Add Components

Add any component using its registry URL:

```bash
# Add TS Window
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-window.json

# Add TS Form
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-form.json

# Add TS Table
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-table.json
```

Each command will automatically:

1. Download the component files to your `components/ts-web-ui/` directory.
2. Install necessary NPM dependencies (like `react-rnd`, etc.).
3. Install required shadcn UI primitives (like `button`, `input`, etc.).

## Features

- **JSON-Driven Forms** - Build complex forms from JSON definitions with 20+ field types
- **Draggable Windows** - Resizable, draggable window components
- **Advanced Tables** - Powered by TanStack Table with sorting, filtering, and pagination
- **Custom MultiSelect Values** - `multiselect` fields can allow ad-hoc entries via `allowCustom: true`
- **Dark Mode** - Full theme support with next-themes
- **Form Builder** - Visual form editor with drag & drop
- **shadcn/ui** - Built on top of high-quality Radix UI primitives

## Notes

- For React 19 + strict TypeScript compatibility, timeout refs in debounced inputs should be typed as `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)`.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4
- **UI Library:** Shadcn/UI (Radix UI + Tailwind)
- **Forms:** React Hook Form + External validation
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

- **Biome** - Unified formatting and linting for source code
- **TypeScript** - Type safety throughout
- **Vitest** - Comprehensive test coverage (80%+ threshold)
- **Pre-commit Hooks** - Automatic formatting and linting before commits
- **CI/CD Workflow** - Automated Biome, registry, and test checks on every push/PR, then build and deploy to GitHub Pages from `main`

### Pre-commit Hooks

Husky and lint-staged automatically run before each commit:

- Biome formats and checks staged files
- The registry JSON files are regenerated and staged automatically
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

## License

MIT
