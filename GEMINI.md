# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Project Overview

This is a **Next.js 16 + React 19 + Shadcn/UI** implementation of TS Web UI components - a comprehensive UI component library with JSON-driven forms, draggable windows, advanced tables, and more. The project uses TypeScript, Tailwind CSS v4, and modern React patterns.

**Package Manager:** pnpm (v11.0.0-dev)

## Reference Repository

The folder `reference-tswebui/` contains a clone of the original `TSWebUI` project.
This folder is `.gitignore`d and serves as a reference for implementing missing features.
AI Agents should check this folder when looking for implementation details of features that need to be ported.
WARNING: do not edit files in `reference-tswebui/`. Only read them.

## Development Commands

```bash
# Development server (port 3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Code quality
pnpm lint              # Check for linting errors
pnpm lint:fix          # Fix auto-fixable linting errors
pnpm format            # Format all files with Prettier
pnpm format:check      # Check formatting without modifying files
pnpm test              # Run tests (placeholder for now)
```

## Pre-commit Hooks

This project uses **Husky** and **lint-staged** to ensure code quality:

- **Prettier** automatically formats staged files
- **ESLint** checks and fixes staged files
- Commits are blocked if linting/formatting fails

The pre-commit hook runs automatically on `git commit`. To bypass (not recommended):

```bash
git commit --no-verify
```

## Continuous Integration & Deployment

- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/ci-cd.yml`) manages the entire lifecycle.
- **Verification**: Linting, formatting, and tests must pass before any deployment.
- **Deployment**: Automatic static export and deployment to GitHub Pages on push to `main`.
- **Base Path**: The production build uses `/TSWebUI-shadcn` as the base path.

## Project Architecture

### Directory Structure

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout with sidebar/topbar
│   ├── page.tsx                # Homepage with component gallery
│   ├── components/             # Component demo pages
│   ├── widgets/                # Individual widget demos
│   └── form-editor/            # Form builder application
├── components/
│   ├── ui/                     # Shadcn UI primitives (badges, buttons, etc.)
│   ├── ts-web-ui/             # Main component library
│   │   ├── ts-form/           # JSON-driven form system
│   │   ├── ts-form-editor/    # Visual form builder
│   │   ├── ts-table/          # Advanced data tables
│   │   ├── ts-window/         # Draggable/resizable windows
│   │   ├── ts-sidebar/        # Collapsible sidebar
│   │   ├── ts-topbar/         # Application top bar
│   │   ├── theme-provider/    # Dark mode support
│   │   ├── mode-toggle/       # Theme switcher
│   │   └── client-only/       # SSR bypass wrapper
│   └── app-sidebar/           # App navigation sidebar
└── lib/
    └── utils.ts               # cn() utility for class merging
```

### Key Technologies

- **Framework:** Next.js 16 (App Router, React Server Components)
- **UI Library:** Shadcn/UI (Radix UI primitives + Tailwind CSS)
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **State Management:** Zustand (used in form editor)
- **Forms:** React Hook Form + Zod validation
- **Tables:** TanStack Table v8
- **Drag & Drop:** @dnd-kit (form editor), react-rnd (windows)
- **Theming:** next-themes (dark/light/system modes)

## Core Component Systems

### 1. TsForm - JSON-Driven Forms

The form system is **entirely JSON-driven** and supports 20+ field types.

**Location:** `src/components/ts-web-ui/ts-form/`

**Key Files:**

- `types.ts` - TypeScript definitions for all field types and layouts
- `index.tsx` - Main form component with validation
- `ts-form-field.tsx` - Field renderer (maps types to widgets)
- `ts-form-layout.tsx` - Layout engine (rows/columns/tabs)
- `ts-form-schema.ts` - Zod schema generator

**Field Types:** text, textarea, password, number, slider, select, multiselect, combobox, radio, checkbox, switch, date, datetime, file, image, button, separator, table, relationship, infobox, markdown, button-group

**JSON Structure:**

```typescript
{
  layout: {
    tabs?: [{ label: string, rows: Row[] }],  // Multi-tab forms
    rows?: Row[]                               // Single-page forms
  },
  fields: {
    [fieldName]: {
      type: FieldType,
      label?: string,
      required?: boolean,
      // ... type-specific options
    }
  },
  buttons: [{
    action: string,
    label: string,
    type?: 'submit' | 'button',
    variant?: 'default' | 'outline' | 'destructive',
    confirmation?: { title, text, buttons }  // Optional confirmation dialog
  }]
}
```

**Layout System:**

- Each row is a CSS Grid with configurable column widths (e.g., "1fr", "2fr", "200px")
- Supports tabs for multi-page forms
- Fields reference the `fields` object by key
- Special types: `empty` (placeholder), `separator` (section divider)

### 2. TsFormEditor - Visual Form Builder

**Location:** `src/components/ts-web-ui/ts-form-editor/`

**State Management:** Zustand store (`store.ts`) with full undo/redo support

**Core Concepts:**

- **EditorFormDefinition:** Internal representation with IDs for drag/drop
- **Export/Import:** Converts between editor format and TsForm JSON
- **Layout Operations:** Add/remove/move tabs, rows, columns
- **Field Operations:** Add/remove/configure fields, drag between positions
- **Button Management:** Add/remove/reorder form buttons
- **History:** 50-step undo/redo stack

**Important:** The editor maintains its own ID-based structure separate from the TsForm JSON format. Always use `exportJson()` to get the proper TsForm definition.

### 3. TsTable - Advanced Data Tables

**Location:** `src/components/ts-web-ui/ts-table/`

Built on **TanStack Table v8** with:

- Column sorting, filtering, visibility toggles
- Pagination controls
- Row selection (single/multi)
- Custom toolbar with search
- Fully typed column definitions

### 4. TsWindow - Draggable Windows

**Location:** `src/components/ts-web-ui/ts-window/`

Uses **react-rnd** for dragging and resizing. Features:

- Configurable default position and size
- Min/max dimensions
- Focus management
- Modal-style overlays

### 5. Sidebar System

**Location:** `src/components/ts-web-ui/ts-sidebar/`

**Components:**

- `SidebarProvider` - Context for open/closed state
- `Sidebar` - Container with animations
- `SidebarContent` - Scrollable content area
- `SidebarTrigger` - Toggle button
- `SidebarInset` - Main content area that responds to sidebar state
- `SidebarCollapseTrigger` - Alternative collapse button

**Integration:** The sidebar automatically adjusts layout margins. Main content uses `SidebarInset` to respond to open/closed states.

## Important Patterns

### Path Aliases

All imports use `@/` prefix (defined in `tsconfig.json`):

```typescript
import { Button } from "@/components/ui/button"

import { TsForm } from "@/components/ts-web-ui/ts-form"
```

### Client vs Server Components

- **Default:** Server Components (Next.js 16)
- **Use `"use client"`** for:
  - Hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - All Zustand stores
  - Theme/dark mode components

### ClientOnly Wrapper

For components that fail SSR (e.g., react-rnd, browser-only libraries):

```tsx
import { ClientOnly } from "@/components/ts-web-ui/client-only"

;<ClientOnly fallback={<div>Loading...</div>}>
  <TsWindow />
</ClientOnly>
```

### Styling with Tailwind v4

This project uses **Tailwind CSS v4** (CSS-first configuration):

- Global styles in `src/app/globals.css`
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Shadcn components use CSS variables for theming (e.g., `bg-background`, `text-foreground`)

### Theme System

Dark mode is handled by `next-themes`:

- Provider in `layout.tsx`
- Toggle with `<ModeToggle />` component
- CSS variables defined in `globals.css` with dark mode variants
- Use semantic color names: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`

## Form Development Workflow

### Creating a New Form

1. **Design the JSON definition:**

   ```typescript
   const formDef = {
     layout: { rows: [...] },
     fields: { ... },
     buttons: [...]
   }
   ```

2. **Render with TsForm:**

   ```tsx
   <TsForm
     layout={formDef.layout}
     fields={formDef.fields}
     buttons={formDef.buttons}
     values={initialValues}
     onSubmit={(data, action) => console.log(data, action)}
   />
   ```

3. **Add validation:** Fields with `required: true` are automatically validated via Zod schema

### Adding a New Field Type

1. Add type to `FieldType` union in `ts-form/types.ts`
2. Create widget component in `ts-form-field.tsx`
3. Add to type switch in `renderField()`
4. Update schema generator in `ts-form-schema.ts`
5. Add default config in form editor's `createDefaultFieldDef()`
6. Update `getDefaultLabel()` in form editor

## Testing & Development

### Running Demo Pages

- Homepage: `/` - Component gallery
- Form demos: `/components/ts-form`
- Form editor: `/form-editor`
- Widget demos: `/widgets/[widgetType]`
- Component demos: `/components/[componentName]`

### Development Server

```bash
pnpm dev
```

The dev server includes:

- Hot module reloading
- Fast Refresh for React components
- TypeScript error overlay
- Detailed error messages

## Common Issues

### Hydration Errors

If seeing "Text content does not match server-rendered HTML":

- Wrap component in `<ClientOnly>`
- Check for browser-only APIs (localStorage, Date.now(), etc.)
- Ensure consistent rendering between server and client

### Import Errors

- Always use `@/` alias for imports
- Server Components cannot import client-only code directly
- Use dynamic imports with `{ ssr: false }` for problematic libraries

### Tailwind Classes Not Working

- Check `globals.css` for CSS variable definitions
- Ensure class names match Tailwind v4 syntax
- Use `cn()` from `@/lib/utils` for conditional classes

## Code Style

- **TypeScript:** Use explicit types for props and return values
- **React:** Prefer function components with hooks
- **Forms:** Use react-hook-form with zodResolver
- **State:** Local state with useState, global state with Zustand
- **Naming:** PascalCase for components, camelCase for functions/variables
- **Files:** Component files match component name (PascalCase)
