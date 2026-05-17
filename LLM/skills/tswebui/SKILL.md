---
name: tswebui
description: Comprehensive guide for installing and using TSWebUI-shadcn components in Next.js projects. Covers ThemeProvider, ModeToggle, LocaleToggle, TsLayout, TsTopbar, TsSidebar, TsWindow, TsForm (JSON-driven forms with 20+ field types), and TsTable (advanced data grid). Use when building admin dashboards, form-heavy apps, or any UI requiring draggable windows, data tables, or dynamic forms.
---

# TSWebUI-shadcn Component Library

A comprehensive UI component library built on **Next.js 16 + React 19 + Shadcn/UI + Tailwind CSS v4**. All components are client components (`"use client"`).

## Table of Contents

- [Prerequisites & Installation](#prerequisites--installation)
- [Localization](#localization)
- [ThemeProvider](#themeprovider)
- [ModeToggle](#modetoggle)
- [TsLayout](#tslayout)
- [TopBar](#topbar)
- [Sidebar](#sidebar)
- [TsWindow](#tswindow)
- [TsForm](#tsform)
- [TsTable](#tstable)
- [TsFormEditor](#tsformeditor)

---

## Prerequisites & Installation

### Required Stack

The consuming project must have:

- **Next.js 16+** (App Router with `"use client"` support)
- **React 19+**
- **Tailwind CSS v4** (CSS-first config)
- **Shadcn/UI initialized** — if not yet set up, run:
  ```bash
  npx shadcn@latest init
  ```
  This creates `components.json`, `src/lib/utils.ts` (with the `cn()` helper using `clsx` + `tailwind-merge`), and the `@/` path alias in `tsconfig.json`. All TSWebUI components depend on these.

### How to Install a Component

All TSWebUI components are published in an **online Shadcn registry**. Install any component with a single command:

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/<component>.json
```

This command:

1. Downloads the component source files into `src/components/ts-web-ui/<component>/`
2. Installs all required **npm dependencies** (e.g. `react-hook-form`, `@tanstack/react-table`)
3. Installs all required **Shadcn UI primitives** (e.g. `input`, `checkbox`, `select`)
4. Installs all required **other TSWebUI components** (transitive dependencies)

No manual npm installs or file copying needed — one command does everything.

### Available Components

| Component                 | Install Command                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **ThemeProvider**         | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/theme-provider.json`    |
| **ModeToggle**            | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/mode-toggle.json`       |
| **LocaleToggle**          | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/locale-toggle.json`     |
| **Locale (system)**       | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/locale.json`            |
| **TsLogo**                | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-logo.json`           |
| **TsTopbar**              | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-topbar.json`         |
| **TsSidebar**             | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-sidebar.json`        |
| **TsLayout** (integrated) | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/integrated-layout.json` |
| **TsWindow**              | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-window.json`         |
| **TsTable**               | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-table.json`          |
| **TsForm**                | `npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-form.json`           |

### Dependency Graph

You don't need to install transitive dependencies manually. For reference, here's what each component pulls in:

- **LocaleToggle** → `locale`, `button` + Shadcn `dropdown-menu` + npm: `lucide-react`
- **TsForm** → `locale`, `ts-table`, `button`, `alert-dialog` + 15 Shadcn primitives (`form`, `input`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `popover`, `calendar`, `command`, `dialog`, `separator`, `tabs`, `textarea`, `toggle-group`) + npm: `react-hook-form`, `lucide-react`, `date-fns`, `react-markdown`, `remark-gfm`, `react-syntax-highlighter`
- **TsTable** → `locale`, `button` + Shadcn `checkbox`, `dropdown-menu`, `input`, `select`, `table`, `badge` + npm: `@tanstack/react-table`, `lucide-react`, `xlsx`, `date-fns`
- **TsLayout** (integrated) → `ts-sidebar`, `ts-topbar`, `theme-provider` (and their transitive deps)
- **TsSidebar** → `locale`, `button`, `ts-logo` + Shadcn `tooltip`
- **TsTopbar** → `ts-logo`
- **TsWindow** → `locale`, `button` + npm: `react-rnd`, `lucide-react`
- **ModeToggle** → `button` + Shadcn `dropdown-menu` + npm: `next-themes`, `lucide-react`
- **ThemeProvider** → npm: `next-themes`
- **TsLogo** → npm: `lucide-react`

### Where Files Are Installed

After running the install command, files appear at:

```
src/
├── components/
│   ├── ui/                          # Shadcn primitives (input, checkbox, etc.)
│   └── ts-web-ui/                   # TSWebUI components
│       ├── ui/                      # TSWebUI overrides (button, alert-dialog)
│       ├── ts-form/                 # TsForm + all widgets
│       │   ├── index.tsx
│       │   ├── types.ts
│       │   ├── widget-types.ts
│       │   ├── utils.ts
│       │   ├── ts-form-field.tsx
│       │   ├── ts-form-layout.tsx
│       │   ├── ts-form-confirmation-dialog.tsx
│       │   └── widgets/             # 20+ field type widgets
│       ├── ts-table/                # TsTable + sub-components
│       ├── ts-window/               # TsWindow + WindowProvider
│       ├── locale/                  # Localization (TsLocaleProvider, en, cs)
│       ├── locale-toggle/           # LocaleToggle (language switcher for TopBar)
│       ├── ts-layout/               # TsLayout (integrated shell)
│       ├── ts-sidebar/              # Sidebar system
│       ├── ts-topbar/               # TopBar
│       ├── ts-logo/                 # Logo component
│       ├── theme-provider/          # ThemeProvider
│       └── mode-toggle/             # ModeToggle
└── lib/
    └── utils.ts                     # cn() utility (created by shadcn init)
```

### Import Convention

All imports use the `@/` path alias (configured in `tsconfig.json` by `shadcn init`):

```ts
import { TsLocaleProvider, cs, en, useTsLocale, useTsLocaleSetter } from "@/components/ts-web-ui/locale"
import { LocaleToggle } from "@/components/ts-web-ui/locale-toggle"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"
import { TsForm } from "@/components/ts-web-ui/ts-form"
import { TsLayout } from "@/components/ts-web-ui/ts-layout"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import { TsTable } from "@/components/ts-web-ui/ts-table"
import { TopBar, TopBarGroup } from "@/components/ts-web-ui/ts-topbar"
import {
  TsWindow,
  WindowOutlet,
  WindowProvider,
  useWindowManager,
} from "@/components/ts-web-ui/ts-window"
```

### Quick Start Example

To add a complete application shell with forms and theme switching to a fresh Next.js project:

```bash
# 1. Initialize shadcn (if not done yet)
npx shadcn@latest init

# 2. Install the integrated layout (includes sidebar, topbar, theme provider)
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/integrated-layout.json

# 3. Install the form system (includes table and all field widgets)
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-form.json

# 4. Install the theme toggle button
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/mode-toggle.json

# 5. Install the window system (if needed)
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-window.json
```

---

## Localization

**Location:** `src/components/ts-web-ui/locale/`

All static UI texts in every TSWebUI component are localizable. The library ships with **English** (default) and **Czech** presets and supports fully custom locale objects.

### Architecture

| Export               | Source               | Description                                                                                  |
| -------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `TsLocaleProvider`   | `locale/context.tsx` | React context provider — wrap app or subtree                                                 |
| `useTsLocale()`      | `locale/context.tsx` | Hook returning the current `TsLocale` (accepts optional override)                            |
| `useTsLocaleSetter()`| `locale/context.tsx` | Hook returning `{ localeName, setLocaleName }` — use in locale switcher components           |
| `en`                 | `locale/en.ts`       | English locale preset (default)                                                              |
| `cs`                 | `locale/cs.ts`       | Czech locale preset                                                                          |
| `TsLocale`           | `locale/types.ts`    | Full locale type (`strings` + `formatting`)                                                  |
| `TsLocaleStrings`    | `locale/types.ts`    | All translatable string keys (table, form, window, sidebar, formEditor)                      |
| `TsLocaleFormatting` | `locale/types.ts`    | `locale` (BCP 47 tag, e.g. `"en-US"`) and optional `timezone` (IANA, e.g. `"Europe/Prague"`) |

### Import

```ts
import { TsLocaleProvider, cs, en, useTsLocale, useTsLocaleSetter } from "@/components/ts-web-ui/locale"
import type { TsLocale, TsLocaleFormatting, TsLocaleStrings } from "@/components/ts-web-ui/locale"
```

### Usage — Context Provider

Wrap your app (or a subtree) with `TsLocaleProvider`. All TSWebUI components inside the provider automatically pick up the locale:

```tsx
import { TsLocaleProvider } from "@/components/ts-web-ui/locale"

// Preset by name
<TsLocaleProvider locale="cs">
  {children}
</TsLocaleProvider>

// Full custom object
<TsLocaleProvider locale={myCustomLocale}>
  {children}
</TsLocaleProvider>
```

If no provider is present, English (`en`) is used.

`TsLocaleProvider` holds **mutable state** internally — the active locale can be changed at runtime by any child component using `useTsLocaleSetter()`.

### Usage — Locale Setter Hook

Use `useTsLocaleSetter()` in custom locale-switcher components. It returns `{ localeName, setLocaleName }` where `localeName` is the active preset name string and `setLocaleName` changes the locale globally:

```tsx
import { useTsLocaleSetter } from "@/components/ts-web-ui/locale"

function MyLocaleSwitcher() {
  const { localeName, setLocaleName } = useTsLocaleSetter()
  return (
    <button onClick={() => setLocaleName(localeName === "en" ? "cs" : "en")}>
      {localeName === "en" ? "Switch to Czech" : "Switch to English"}
    </button>
  )
}
```

### LocaleToggle — Ready-Made Language Switcher

`LocaleToggle` is a pre-built dropdown for the TopBar. It uses `useTsLocaleSetter()` internally and shows SVG-flag buttons. Czech (🇨🇿 Česky) is listed first and is the default locale in the demo app. Install it with:

```tsx
import { LocaleToggle } from "@/components/ts-web-ui/locale-toggle"
import { TopBar, TopBarGroup } from "@/components/ts-web-ui/ts-topbar"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"

<TopBar
  rightContent={
    <TopBarGroup>
      <LocaleToggle />
      <ModeToggle />
    </TopBarGroup>
  }
/>
```

### Usage — Component-Level Override

`TsTable` and `TsForm` accept a `locale` prop that overrides the context for that component and its children:

```tsx
import { cs } from "@/components/ts-web-ui/locale"

<TsTable data={data} columnDefinitions={cols} locale={cs} />
<TsForm layout={layout} fields={fields} locale="cs" />
```

The `locale` prop accepts either a preset name string (`"en"`, `"cs"`) or a full `TsLocale` object.

### Usage — Hook

`useTsLocale(override?)` returns the resolved `TsLocale`. It reads from context by default but accepts an optional override (string or object):

```ts
const locale = useTsLocale()         // from context
const locale = useTsLocale("cs")     // force Czech
const { strings, formatting } = locale
```

### Creating a Custom Locale

Spread an existing preset and override only what you need:

```ts
import { en } from "@/components/ts-web-ui/locale"
import type { TsLocale } from "@/components/ts-web-ui/locale"

const myLocale: TsLocale = {
  strings: {
    ...en.strings,
    table: { ...en.strings.table, search: "Find...", noRecords: "Nothing here" },
    form: { ...en.strings.form, required: "Mandatory" },
  },
  formatting: { locale: "en-GB", timezone: "Europe/London" },
}
```

### String Categories

`TsLocaleStrings` is organized into five groups:

| Group        | Keys (selected)                                                                                                                                                                                                                       | Used By                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `table`      | search, columns, viewColumns, searchColumns, clearAllFilters, export, exportAll(count), exportFiltered(count), exportSelected(count), import, newRecord, noRecords, rowsPerPage, pageOf, rowsSelected, selectAll, copyToClipboard, moveLeft, moveRight, first/previous/next/last, importResults, etc. | TsTable (toolbar, view, pagination, columns) |
| `form`       | required, showPassword, hidePassword, selectPlaceholder, searchPlaceholder, notFound, customValueAdd, clear, today, addFile(s), selectEntity, chooseFromList, etc.                                                                    | TsForm (all field widgets)                   |
| `window`     | centerOnScreen, fitToContent                                                                                                                                                                                                          | TsWindow (titlebar buttons)                  |
| `sidebar`    | closeMenu, openMenu, expandMenu, collapseMenu                                                                                                                                                                                         | TsSidebar (aria-labels, tooltips)            |
| `nav`        | logoText, sectionOverview, sectionComponents, sectionUtilities, sectionFormWidgets, overview, window, table, form, topbar, sidebar, integratedLayout, formEditor, themeProvider, modeToggle | App layout (sidebar nav labels, logo text)   |
| `formEditor` | ~120 keys covering toolbar (undo/redo/reset/import/export/preview), canvas (addRow, dragFieldHere, field palette group labels, field palette type labels), drag overlay, properties panel (all field properties, button properties, every section heading, all variant options, all validation error messages). Also contains nested objects `fieldTypeLabels` (21 entries, one per field type) and `fieldGroupLabels` (6 entries for palette groups). | TsFormEditor |

Some keys are functions for interpolation: `pageOf(page, total)`, `rowsSelected(selected, total)`, `selected(count)`, `fieldNotFound(field)`, `customValueAdd(value)`, `selectEntity(entity)`, etc.

---

## ThemeProvider

**Location:** `src/components/ts-web-ui/theme-provider/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/theme-provider.json
```

Auto-installed dependencies: `next-themes`

Wraps `next-themes` to eliminate hydration mismatch errors. Renders a placeholder `<div>` until the client is mounted.

### Usage

Place in your root `layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

### Behavior

- `attribute="class"` — adds `.dark` / `.light` class to `<html>`
- `defaultTheme="system"` — respects OS preference
- `enableSystem` — allows system theme detection
- `disableTransitionOnChange` — prevents flash on theme switch
- Until mounted, renders `<div className="min-h-screen bg-background" />` to avoid hydration errors

### Theme CSS Variables

Define in `globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... more semantic colors ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark variants ... */
}
```

Use in components: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, etc.

---

## ModeToggle

**Location:** `src/components/ts-web-ui/mode-toggle/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/mode-toggle.json
```

Auto-installed dependencies: `next-themes`, `lucide-react`, TSWebUI `button`, Shadcn `dropdown-menu`

A dropdown button that switches between Light / Dark / System themes.

### Usage

```tsx
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"

;<ModeToggle />
```

### Props

None. This component is self-contained. It uses `useTheme()` from `next-themes` internally.

### Features

- Sun icon in light mode, Moon icon in dark mode (animated rotation/scale)
- Dropdown with three options: Light, Dark, System
- Checkmark indicator on the currently active theme

---

## TsLayout

**Location:** `src/components/ts-web-ui/ts-layout/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/integrated-layout.json
```

Auto-installed dependencies: `lucide-react`, `ts-sidebar`, `ts-topbar`, `theme-provider` (and their transitive dependencies: `ts-logo`, `button`, Shadcn `tooltip`)

An integrated application shell that combines TopBar + Sidebar + main content area into a single component.

### Props

| Prop           | Type                        | Default     | Description                                                                                     |
| -------------- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `children`     | `ReactNode`                 | —           | Main content area                                                                               |
| `navigation`   | `NavSection[] \| NavItem[]` | `undefined` | Sidebar navigation data                                                                         |
| `logo`         | `ReactNode`                 | `undefined` | Logo element for sidebar and topbar                                                             |
| `topBarLeft`   | `ReactNode`                 | `undefined` | Content for the left side of the topbar                                                         |
| `topBarCenter` | `ReactNode`                 | `undefined` | Content for the center of the topbar                                                            |
| `topBarRight`  | `ReactNode`                 | `undefined` | Content for the right side of the topbar                                                        |
| `contained`    | `boolean`                   | `false`     | If `true`, uses absolute positioning to fit inside a bounded container instead of full viewport |

### Navigation Data Types

```ts
interface NavItem {
  name: string // Unique identifier
  href: string // URL path
  label: string // Display text
  icon: LucideIcon | ReactNode // Icon component or element
  exact?: boolean // If true, match href exactly (not prefix)
}

interface NavSection {
  title: string // Section heading
  items: NavItem[] // Items in this section
}
```

### Full Application Layout Example

```tsx
"use client"

import { Home, Settings, Users } from "lucide-react"

import { TsLocaleProvider } from "@/components/ts-web-ui/locale"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"
import { TsLayout } from "@/components/ts-web-ui/ts-layout"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import { TopBarGroup } from "@/components/ts-web-ui/ts-topbar"

const NAVIGATION = [
  {
    title: "Application",
    items: [
      { name: "dashboard", label: "Dashboard", href: "/", icon: Home, exact: true },
      { name: "users", label: "Users", href: "/users", icon: Users },
      { name: "settings", label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TsLocaleProvider locale="en">
            <TsLayout
              navigation={NAVIGATION}
              logo={<Logo text="My App" href="/" />}
              topBarRight={
                <TopBarGroup>
                  <ModeToggle />
                </TopBarGroup>
              }
            >
              {children}
            </TsLayout>
          </TsLocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## TopBar

**Location:** `src/components/ts-web-ui/ts-topbar/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-topbar.json
```

Auto-installed dependencies: `lucide-react`, `ts-logo`

> **Tip:** If you plan to use the full layout, install `integrated-layout` instead — it includes TopBar, Sidebar, and ThemeProvider.

A sticky top bar with three content slots (left, center, right). Auto-detects `SidebarProvider` and shows a hamburger trigger.

### Props

| Prop            | Type        | Default     | Description                                         |
| --------------- | ----------- | ----------- | --------------------------------------------------- |
| `leftContent`   | `ReactNode` | `undefined` | Content on the left side                            |
| `centerContent` | `ReactNode` | `undefined` | Content in the center (flex-1)                      |
| `rightContent`  | `ReactNode` | `undefined` | Content on the right side                           |
| `height`        | `number`    | `56`        | Height in pixels                                    |
| `bordered`      | `boolean`   | `true`      | Show bottom border                                  |
| `showTrigger`   | `boolean`   | `true`      | Auto-show sidebar trigger if inside SidebarProvider |
| `className`     | `string`    | `undefined` | Additional CSS classes                              |

### Exported Sub-components

| Component     | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| `TopBarGroup` | Flexbox wrapper (`flex items-center gap-2`) for grouping topbar items |
| `Logo`        | Re-exported from `ts-logo` — renders text/icon with optional link     |

### TopBarProvider (Optional)

Provides topbar height to child components via context:

```tsx
import { TopBarProvider, useTopBar } from "@/components/ts-web-ui/ts-topbar"

;<TopBarProvider height={56}>
  {/* children can call useTopBar() to get { height } */}
</TopBarProvider>
```

### Standalone Usage

```tsx
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import { TopBar, TopBarGroup } from "@/components/ts-web-ui/ts-topbar"

;<TopBar
  leftContent={<Logo text="My App" href="/" />}
  centerContent={<Input placeholder="Search..." />}
  rightContent={
    <TopBarGroup>
      <ModeToggle />
    </TopBarGroup>
  }
  height={56}
  bordered
/>
```

---

## Sidebar

**Location:** `src/components/ts-web-ui/ts-sidebar/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-sidebar.json
```

Auto-installed dependencies: `lucide-react`, TSWebUI `button`, `ts-logo`, Shadcn `tooltip`

> **Tip:** If you plan to use the full layout, install `integrated-layout` instead — it includes TopBar, Sidebar, and ThemeProvider.

A fully-featured collapsible sidebar with data-driven navigation, mobile responsiveness, and localStorage persistence. All accessibility labels (close/open menu, expand/collapse) are automatically localized via `useTsLocale()` context.

### System Components

| Component                | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `SidebarProvider`        | Context provider — wraps the entire layout                    |
| `Sidebar`                | The sidebar element itself                                    |
| `SidebarContent`         | Scrollable content area                                       |
| `SidebarHeader`          | Header with logo and close button                             |
| `SidebarSection`         | Grouped navigation section with title                         |
| `SidebarItem`            | Single navigation item with icon                              |
| `SidebarFooter`          | Bottom section with border                                    |
| `SidebarInset`           | Main content area that adjusts margins based on sidebar state |
| `SidebarTrigger`         | Hamburger toggle button                                       |
| `SidebarCollapseTrigger` | Circular collapse/expand button on sidebar edge               |

### SidebarProvider Props

| Prop               | Type      | Default   | Description                                              |
| ------------------ | --------- | --------- | -------------------------------------------------------- |
| `defaultOpen`      | `boolean` | `true`    | Initial open state                                       |
| `mobileBreakpoint` | `number`  | `768`     | Pixel width below which mobile behavior activates        |
| `topBarHeight`     | `number`  | `56`      | Height of the topbar in pixels (for offset calculations) |
| `width`            | `string`  | `"16rem"` | Sidebar width when expanded                              |
| `collapsedWidth`   | `string`  | `"4rem"`  | Sidebar width when collapsed (icons only)                |

### Sidebar Props

| Prop         | Type                        | Default     | Description                                 |
| ------------ | --------------------------- | ----------- | ------------------------------------------- |
| `navigation` | `NavSection[] \| NavItem[]` | `undefined` | Data-driven navigation (auto-renders items) |
| `logo`       | `ReactNode`                 | `undefined` | Logo element for the sidebar header         |
| `className`  | `string`                    | `undefined` | Additional CSS classes                      |

### useSidebar() Hook

Returns the sidebar context:

```ts
const {
  isOpen, // boolean — sidebar visibility
  toggle, // () => void — toggle open/closed
  open, // () => void — force open
  close, // () => void — force close
  isCollapsed, // boolean — collapsed to icon-only mode
  toggleCollapsed, // () => void — toggle collapsed state
  isMobile, // boolean — mobile viewport detected
  topBarHeight, // number — topbar height in px
  width, // string — expanded width
  collapsedWidth, // string — collapsed width
} = useSidebar()
```

### Features

- **Responsive**: Auto-closes on mobile, overlay mode with backdrop
- **Collapsible**: Icon-only mode with tooltips on desktop
- **Persistent**: Saves open/collapsed state to localStorage
- **Active detection**: Highlights current route using `usePathname()`
- **Data-driven**: Pass `navigation` prop for auto-rendered nav items with Lucide icons

---

## TsWindow

**Location:** `src/components/ts-web-ui/ts-window/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-window.json
```

Auto-installed dependencies: `react-rnd`, `lucide-react`, TSWebUI `button`

A draggable, resizable window system with minimize/maximize/restore, Z-index management, and an imperative API. Titlebar button tooltips ("Center on Screen", "Fit to Content") are automatically localized via `useTsLocale()` context.

### Architecture

Three components work together:

1. **`WindowProvider`** — React context providing the window manager
2. **`WindowOutlet`** — Renders all open windows (place inside a relative-positioned container)
3. **`useWindowManager()`** — Hook to interact with the window system

### TsWindowProps

| Prop            | Type               | Default    | Description                       |
| --------------- | ------------------ | ---------- | --------------------------------- |
| `id`            | `string \| number` | —          | Unique window identifier          |
| `title`         | `string`           | `"Window"` | Title displayed in the header bar |
| `defaultWidth`  | `number`           | `400`      | Initial width in pixels           |
| `defaultHeight` | `number`           | `300`      | Initial height in pixels          |
| `defaultTop`    | `number`           | `100`      | Initial Y position in pixels      |
| `defaultLeft`   | `number`           | `100`      | Initial X position in pixels      |
| `minWidth`      | `number`           | `200`      | Minimum allowed width             |
| `minHeight`     | `number`           | `100`      | Minimum allowed height            |
| `children`      | `ReactNode`        | —          | Window content                    |

### useWindowManager() Hook

| Method/Property  | Signature                                                                          | Description                                                     |
| ---------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `openWindow`     | `(content: ReactNode, options?: Partial<TsWindowProps> & { id?: string }) => void` | Opens a new window. If `id` already exists, brings it to front. |
| `closeWindow`    | `(id: string) => void`                                                             | Closes the window with the given ID                             |
| `getWindow`      | `(id: string) => TsWindowRef \| null`                                              | Returns the imperative handle for a window                      |
| `windows`        | `WindowItem[]`                                                                     | Array of currently open window objects                          |
| `isInteracting`  | `boolean`                                                                          | Whether any window is being dragged/resized                     |
| `setInteracting` | `(interacting: boolean) => void`                                                   | Set the interaction state                                       |

### TsWindowRef (Imperative API)

Retrieved via `getWindow(id)` or React `ref`:

| Method             | Description                                       |
| ------------------ | ------------------------------------------------- |
| `minimize()`       | Minimizes the window to a small title-only bar    |
| `maximize()`       | Maximizes the window to fill its parent container |
| `restore()`        | Restores from minimized or maximized state        |
| `close()`          | Closes the window (removes from DOM)              |
| `centerOnScreen()` | Centers the window within its parent container    |
| `fitToContent()`   | Adjusts height to match content scroll height     |
| `bringToFront()`   | Increments Z-index to place above other windows   |

### Window Features

- **macOS-style traffic lights**: Red (close), Yellow (minimize), Green (maximize/restore)
- **Double-click titlebar**: Toggles maximize/restore
- **Center button**: Target icon in titlebar centers window
- **Fit-to-content button**: Adjusts height to content
- **Drag containment**: Window header always stays within parent bounds
- **Resize containment**: Window cannot be resized outside parent
- **Z-index management**: Global counter ensures focused window is always on top
- **Auto-fit on mount**: Window adjusts height to content on initial render
- **ResizeObserver**: Adapts when parent container resizes

### Complete Usage Example

```tsx
"use client"

import { Button } from "@/components/ui/button"

import { WindowOutlet, WindowProvider, useWindowManager } from "@/components/ts-web-ui/ts-window"

function WindowContent({ id }: { id: string }) {
  const { getWindow } = useWindowManager()

  return (
    <div className="space-y-4">
      <p>
        Content for window <strong>{id}</strong>
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => getWindow(id)?.centerOnScreen()}>
          Center
        </Button>
        <Button size="sm" variant="outline" onClick={() => getWindow(id)?.minimize()}>
          Minimize
        </Button>
        <Button size="sm" variant="destructive" onClick={() => getWindow(id)?.close()}>
          Close
        </Button>
      </div>
    </div>
  )
}

function MyApp() {
  const { openWindow } = useWindowManager()

  const handleOpen = () => {
    const id = `win-${Math.random().toString(36).substring(7)}`
    openWindow(<WindowContent id={id} />, {
      id,
      title: "My Window",
      defaultWidth: 400,
      defaultHeight: 300,
      defaultLeft: 150,
      defaultTop: 100,
    })
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        <Button onClick={handleOpen}>Open Window</Button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <WindowOutlet />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <WindowProvider>
      <MyApp />
    </WindowProvider>
  )
}
```

### WindowOutlet Props

| Prop        | Type     | Default     | Description                                                                           |
| ----------- | -------- | ----------- | ------------------------------------------------------------------------------------- |
| `className` | `string` | `undefined` | Additional CSS classes (default includes `absolute inset-0 pointer-events-none z-50`) |

---

## TsForm

**Location:** `src/components/ts-web-ui/ts-form/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-form.json
```

Auto-installed dependencies:

- **npm:** `react-hook-form`, `lucide-react`, `date-fns`, `react-markdown`, `remark-gfm`, `react-syntax-highlighter`
- **TSWebUI:** `button`, `alert-dialog`, `ts-table`
- **Shadcn:** `form`, `alert`, `badge`, `calendar`, `checkbox`, `command`, `dialog`, `input`, `popover`, `radio-group`, `select`, `separator`, `slider`, `switch`, `tabs`, `textarea`, `toggle-group`

A fully JSON-driven form engine that generates complete forms from data definitions — including layout, validation, field types, buttons, and confirmation dialogs.

### TsFormProps

| Prop            | Type                                                                    | Default     | Description                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`        | `TsLayout`                                                              | —           | **Required.** Layout structure defining rows and/or tabs                                                                                                                        |
| `fields`        | `Record<string, TsFieldDef>`                                            | —           | **Required.** Dictionary of field definitions keyed by field name                                                                                                               |
| `values`        | `Record<string, unknown>`                                               | `{}`        | Initial/current form values                                                                                                                                                     |
| `buttons`       | `TsButton[]`                                                            | `[]`        | Action buttons rendered at the bottom of the form                                                                                                                               |
| `errors`        | `TsErrors`                                                              | `undefined` | External validation errors (from server/parent)                                                                                                                                 |
| `activeTab`     | `string \| number`                                                      | `undefined` | Controlled active tab (label string or 0-based index)                                                                                                                           |
| `onTabChange`   | `(tab: string \| number) => void`                                       | `undefined` | Callback when user switches tabs                                                                                                                                                |
| `onAction`      | `(action: string, data: Record<string, unknown>) => void`               | `undefined` | **Primary callback.** Fires for all button actions (submit, delete, custom, etc.)                                                                                               |
| `onFieldChange` | `(name: string, value: unknown, data: Record<string, unknown>) => void` | `undefined` | Fires when a field value changes. For text/number/textarea/password: on blur. For everything else: immediately.                                                                 |
| `readOnly`      | `boolean`                                                               | `false`     | Sets all fields to read-only and hides the button bar                                                                                                                           |
| `className`     | `string`                                                                | `undefined` | Additional CSS classes for the form element                                                                                                                                     |
| `locale`        | `string \| TsLocale`                                                    | `undefined` | UI locale override — preset name (`"en"`, `"cs"`) or full `TsLocale` object for all static texts. Also used for date/number formatting when `TsLocale.formatting.locale` is set |

### Layout System

#### TsLayout

```ts
interface TsLayout {
  tabs?: TsTab[] // Multi-tab form (takes priority over rows)
  rows?: TsRow[] // Single-page form
}
```

#### TsTab

```ts
interface TsTab {
  label: string // Tab display name
  rows: TsRow[] // Rows within this tab
}
```

#### TsRow

An array of `TsRowItem`:

```ts
type TsRow = TsRowItem[]

interface TsRowItem {
  field: string // Key from the fields dictionary
  width?: string // CSS grid width: "1fr", "200px", "50%", etc. (default: "1fr")
  type?: "empty" | "separator" // Special layout types (overrides field lookup)
  label?: string // Label for separator type
  align?: "left" | "center" | "right" // Horizontal alignment within grid cell
}
```

#### Layout Example

```ts
const layout: TsLayout = {
  tabs: [
    {
      label: "General",
      rows: [
        [
          { field: "firstName", width: "1fr" },
          { field: "lastName", width: "1fr" },
        ],
        [
          { field: "email", width: "2fr" },
          { field: "age", width: "100px" },
        ],
        [{ type: "separator", label: "Additional Info", field: "sep1" }],
        [{ field: "bio" }],
      ],
    },
    {
      label: "Settings",
      rows: [[{ field: "role" }, { field: "active" }]],
    },
  ],
}
```

### Field Types Reference

All field types share these **base properties**:

| Property            | Type          | Default     | Description                                                             |
| ------------------- | ------------- | ----------- | ----------------------------------------------------------------------- |
| `type`              | `TsFieldType` | —           | **Required.** Discriminator for the field type                          |
| `label`             | `string`      | `undefined` | Label text above the field                                              |
| `required`          | `boolean`     | `false`     | Visual indicator and validation check                                   |
| `hidden`            | `boolean`     | `false`     | Hidden from UI but present in data                                      |
| `hideLabel`         | `boolean`     | `false`     | Hides label but preserves layout slot                                   |
| `disabled`          | `boolean`     | `false`     | Disables user interaction                                               |
| `readonly`          | `boolean`     | `false`     | Read-only visual state                                                  |
| `hint`              | `string`      | `undefined` | Help text below the field                                               |
| `error`             | `string`      | `undefined` | Static error message (prefer `errors` prop for dynamic validation)      |
| `excludeFromSubmit` | `boolean`     | `false`     | Exclude value from submitted data                                       |
| `autofocus`         | `boolean`     | `false`     | Auto-focus on mount or tab change                                       |
| `enterAction`       | `string`      | `undefined` | Action on Enter key: `"submit"`, `"focus:next"`, or custom action       |
| `escapeAction`      | `string`      | `undefined` | Action on Escape key: `"clear"` clears value, other strings emit action |

#### Text / Password

```ts
{ type: "text", label: "Name", placeholder: "John", selectAllOnFocus: true }
{ type: "password", label: "Password", placeholder: "••••••" }
```

| Property           | Type      | Description              |
| ------------------ | --------- | ------------------------ |
| `placeholder`      | `string`  | Placeholder text         |
| `selectAllOnFocus` | `boolean` | Select all text on focus |

#### Textarea

```ts
{ type: "textarea", label: "Bio", rows: 4, placeholder: "Tell us about yourself" }
```

| Property           | Type      | Default | Description                  |
| ------------------ | --------- | ------- | ---------------------------- |
| `placeholder`      | `string`  | —       | Placeholder text             |
| `rows`             | `number`  | `3`     | Number of visible text lines |
| `selectAllOnFocus` | `boolean` | —       | Select all text on focus     |

#### Number

```ts
{ type: "number", label: "Age", min: 0, max: 150, step: 1, roundTo: 0, locale: "en-US" }
```

| Property           | Type      | Description                                   |
| ------------------ | --------- | --------------------------------------------- |
| `placeholder`      | `string`  | Placeholder text                              |
| `min`              | `number`  | Minimum value                                 |
| `max`              | `number`  | Maximum value                                 |
| `step`             | `number`  | Step increment                                |
| `roundTo`          | `number`  | Decimal places for rounding/display           |
| `locale`           | `string`  | Locale for number formatting (e.g. `"cs-CZ"`) |
| `selectAllOnFocus` | `boolean` | Select all text on focus                      |

#### Slider

```ts
{ type: "slider", label: "Volume", min: 0, max: 100, step: 1 }
```

| Property | Type     | Description    |
| -------- | -------- | -------------- |
| `min`    | `number` | Minimum value  |
| `max`    | `number` | Maximum value  |
| `step`   | `number` | Step increment |

#### Select

```ts
{
  type: "select",
  label: "Role",
  placeholder: "Choose a role",
  options: [
    { value: "admin", label: "Administrator" },
    { value: "user", label: "User" },
  ]
}
```

| Property      | Type                           | Description                         |
| ------------- | ------------------------------ | ----------------------------------- |
| `placeholder` | `string`                       | Placeholder when no option selected |
| `options`     | `TsFieldOptions[] \| string[]` | Available options                   |

#### Multiselect

```ts
{
  type: "multiselect",
  label: "Skills",
  placeholder: "Select skills...",
  options: ["JavaScript", "TypeScript", "React"],
  allowCustom: true,
  notFoundMessage: "No skills match."
}
```

| Property          | Type                           | Description                                              |
| ----------------- | ------------------------------ | -------------------------------------------------------- |
| `placeholder`     | `string`                       | Placeholder text                                         |
| `options`         | `TsFieldOptions[] \| string[]` | Available options                                        |
| `allowCustom`     | `boolean`                      | Allow adding custom values directly from search          |
| `notFoundMessage` | `string`                       | Message when search has no results (or custom add prompt) |

#### Combobox

```ts
{
  type: "combobox",
  label: "Country",
  options: [{ value: "us", label: "United States" }],
  allowCustom: true,
  clearable: true,
  selectAllOnFocus: true
}
```

| Property           | Type                           | Description                        |
| ------------------ | ------------------------------ | ---------------------------------- |
| `placeholder`      | `string`                       | Placeholder text                   |
| `options`          | `TsFieldOptions[] \| string[]` | Available options                  |
| `allowCustom`      | `boolean`                      | Allow custom values not in options |
| `clearable`        | `boolean`                      | Show a clear button                |
| `selectAllOnFocus` | `boolean`                      | Select all text on focus           |
| `notFoundMessage`  | `string`                       | Message when no options match      |

#### Radio

```ts
{
  type: "radio",
  label: "Gender",
  options: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ]
}
```

| Property  | Type                           | Description       |
| --------- | ------------------------------ | ----------------- |
| `options` | `TsFieldOptions[] \| string[]` | Available options |

#### Checkbox

```ts
{ type: "checkbox", label: "I agree to the terms" }
```

Boolean value. No additional properties beyond base.

#### Switch

```ts
{ type: "switch", label: "Active Account" }
```

Boolean toggle. No additional properties beyond base.

#### Button Group

```ts
{
  type: "button-group",
  label: "Status",
  options: [
    { value: "draft", label: "Draft", variant: "outline" },
    { value: "published", label: "Published", variant: "default" },
  ],
  variant: "process"  // Optional: renders as chevron process stepper
}
```

| Property  | Type                           | Description                                                     |
| --------- | ------------------------------ | --------------------------------------------------------------- |
| `options` | `TsFieldOptions[] \| string[]` | Available options (each can have `variant`)                     |
| `variant` | `"process"`                    | Optional: renders as a horizontal process stepper with chevrons |

#### Date

```ts
{
  type: "date",
  label: "Birth Date",
  dateFormat: "d.M.yyyy",
  locale: "cs-CZ",
  showTodayButton: true,
  showClearButton: true,
  todayButtonText: "Today",
  clearButtonText: "Clear"
}
```

| Property           | Type      | Default      | Description                          |
| ------------------ | --------- | ------------ | ------------------------------------ |
| `placeholder`      | `string`  | —            | Placeholder for text input           |
| `dateFormat`       | `string`  | `"d.M.yyyy"` | date-fns format string               |
| `locale`           | `string`  | —            | Locale for calendar (e.g. `"cs-CZ"`) |
| `selectAllOnFocus` | `boolean` | —            | Select text on focus                 |
| `showTodayButton`  | `boolean` | —            | Show "Today" button in popup         |
| `showClearButton`  | `boolean` | —            | Show "Clear" button in popup         |
| `todayButtonText`  | `string`  | —            | Custom label for Today button        |
| `clearButtonText`  | `string`  | —            | Custom label for Clear button        |

#### DateTime

Same properties as Date, but with time component. Default format: `"d.M.yyyy HH:mm"`.

```ts
{ type: "datetime", label: "Event Start", dateFormat: "d.M.yyyy HH:mm" }
```

#### File

```ts
{
  type: "file",
  label: "Attachments",
  accept: ".pdf,.doc,image/*",
  multiple: true,
  innerLabel: "Drop files here",
  showDropZone: true,
  addFileLabel: "Add file"
}
```

| Property       | Type      | Default | Description                              |
| -------------- | --------- | ------- | ---------------------------------------- |
| `accept`       | `string`  | —       | Accepted file types (MIME or extensions) |
| `multiple`     | `boolean` | —       | Allow multiple file selection            |
| `innerLabel`   | `string`  | —       | Label inside the drop zone               |
| `showDropZone` | `boolean` | `true`  | Show drag-and-drop area                  |
| `addFileLabel` | `string`  | —       | Label for the "Add file" link            |

File value format: `Array<File | TsFileDescriptor>` where:

```ts
interface TsFileDescriptor {
  id?: string | number
  name: string
  size?: number
  url?: string
  type?: string
}
```

#### Button (In-Form)

```ts
{ type: "button", label: "Generate Report", action: "generate", variant: "outline" }
```

| Property  | Type              | Description                  |
| --------- | ----------------- | ---------------------------- |
| `action`  | `string`          | Action name emitted on click |
| `variant` | `TsButtonVariant` | Visual variant               |

#### Separator

```ts
{ type: "separator", label: "Section Title" }
```

Used via layout `type: "separator"` in row items. Renders a horizontal rule with optional label.

#### Empty

```ts
{
  type: "empty"
}
```

Used via layout `type: "empty"`. Creates an invisible placeholder in the grid.

#### Table (Nested)

```ts
{
  type: "table",
  label: "Line Items",
  columns: [
    { key: "product", title: "Product", type: "text" },
    { key: "qty", title: "Qty", type: "number", align: "right" },
    { key: "price", title: "Price", type: "number", align: "right" },
  ],
  showCreateButton: true
}
```

| Property           | Type                 | Description                                 |
| ------------------ | -------------------- | ------------------------------------------- |
| `columns`          | `TsTableColumnDef[]` | Column definitions (same format as TsTable) |
| `showCreateButton` | `boolean`            | Show "Add row" button                       |

Value: `Array<Record<string, unknown>>` — array of row objects.

#### Relationship

```ts
{
  type: "relationship",
  label: "Assigned User",
  targetEntity: "User",
  mode: "single",            // or "multiple"
  variant: "dropdown",       // or "dialog"
  displayFields: ["name", "email"],
  chipDisplayFields: ["name"],
  valueField: "id",
  options: [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ]
}
```

| Property            | Type                        | Default      | Description                                       |
| ------------------- | --------------------------- | ------------ | ------------------------------------------------- |
| `placeholder`       | `string`                    | —            | Placeholder text                                  |
| `targetEntity`      | `string`                    | —            | Entity name for labels                            |
| `mode`              | `"single" \| "multiple"`    | `"single"`   | Selection mode                                    |
| `variant`           | `"dropdown" \| "dialog"`    | `"dropdown"` | UI variant (popover or modal)                     |
| `displayFields`     | `string[]`                  | —            | Fields shown in search results                    |
| `chipDisplayFields` | `string[]`                  | —            | Fields shown in selected chip                     |
| `columns`           | `TsTableColumnDef[]`        | —            | Full column definitions (overrides displayFields) |
| `valueField`        | `string`                    | —            | Primary key field for stored value                |
| `options`           | `Record<string, unknown>[]` | —            | Available records to select from                  |

#### Infobox

```ts
{
  type: "infobox",
  label: "Notice",
  content: "This form is read-only.",
  variant: "warning",  // "default" | "information" | "warning" | "success" | "destructive"
  icon: "AlertTriangle",
  closable: true
}
```

| Property   | Type               | Description                                  |
| ---------- | ------------------ | -------------------------------------------- |
| `content`  | `string`           | Static text content                          |
| `value`    | `ReactNode`        | Dynamic content                              |
| `variant`  | `TsInfoboxVariant` | Visual style                                 |
| `icon`     | `string`           | Lucide icon name (overrides variant default) |
| `closable` | `boolean`          | Allow user to dismiss                        |

#### Markdown

```ts
{
  type: "markdown",
  content: "### Title\n\n**Bold** text with [links](https://example.com)"
}
```

| Property  | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `content` | `string` | Static markdown content                 |
| `value`   | `string` | Dynamic markdown content from form data |

### Buttons Configuration

```ts
interface TsButton {
  action: string // Technical action name
  label: string // Display text
  variant?: TsButtonVariant // "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "danger" | "success" | "warning"
  type?: "submit" | "button" | "reset" // HTML button type (default: "submit")
  icon?: string // Lucide icon name
  position?: "left" | "center" | "right" // Position in button bar (default: "right")
  disabled?: boolean // Disable the button
  hidden?: boolean // Hide the button
  confirmation?: TsConfirmation // Optional confirmation dialog
}
```

#### Button Bar Positioning

Buttons are placed in a three-column flex layout:

- `position: "left"` — left-aligned
- `position: "center"` — centered
- `position: "right"` (default) — right-aligned

#### Confirmation Dialogs

```ts
{
  action: "delete",
  label: "Delete",
  variant: "destructive",
  type: "button",
  confirmation: {
    title: "Are you sure?",
    text: "This action cannot be undone.",
    buttons: [
      { action: "cancel", label: "Cancel" },
      { action: "confirm", label: "Delete", variant: "destructive", confirm: true },
    ]
  }
}
```

When `confirm: true` is set on a confirmation button, clicking it executes the parent button's action. Otherwise, the dialog simply closes.

### TsErrors (External Validation)

Pass errors as a nested object matching the field structure:

```ts
const errors = {
  email: "Email is required",
  "address.city": "City is required", // Dot-notation for nested fields
}
```

Errors can also be nested objects:

```ts
const errors = {
  email: "Invalid email",
  address: {
    city: "Required",
    zip: "Invalid format",
  },
}
```

### Keyboard Actions

Fields with `enterAction` / `escapeAction` emit `form-key-action` custom DOM events:

- `enterAction: "submit"` — triggers the first submit button
- `enterAction: "focus:next"` — focuses the next focusable input
- `enterAction: "myAction"` — emits action `"myAction"` via `onAction`
- `escapeAction: "clear"` — clears the field value
- `escapeAction: "cancel"` — emits action `"cancel"` via `onAction`

### Options Format

Options can be either strings or objects:

```ts
// Simple strings (value = label)
options: ["Admin", "User", "Guest"]

// Object form (full control)
options: [
  { value: "admin", label: "Administrator", disabled: false },
  { value: "user", label: "Standard User" },
]
```

### Complete Form Example

```tsx
"use client"

import { TsForm } from "@/components/ts-web-ui/ts-form"
import { TsFormProps } from "@/components/ts-web-ui/ts-form/types"

const formDef = {
  layout: {
    tabs: [
      {
        label: "Personal",
        rows: [
          [
            { field: "name", width: "1fr" },
            { field: "email", width: "1fr" },
          ],
          [
            { field: "age", width: "100px" },
            { field: "role", width: "1fr" },
          ],
          [{ type: "separator", label: "Additional", field: "sep" }],
          [{ field: "bio" }],
        ],
      },
      {
        label: "Settings",
        rows: [[{ field: "active" }, { field: "notifications" }]],
      },
    ],
  },
  fields: {
    name: { type: "text", label: "Name", required: true, placeholder: "John Doe" },
    email: { type: "text", label: "Email", required: true },
    age: { type: "number", label: "Age", min: 18, max: 120 },
    role: {
      type: "select",
      label: "Role",
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
      ],
    },
    bio: { type: "textarea", label: "Biography", rows: 3 },
    active: { type: "switch", label: "Active" },
    notifications: { type: "checkbox", label: "Enable notifications" },
  },
  buttons: [
    { action: "cancel", label: "Cancel", variant: "outline", type: "button", position: "left" },
    { action: "save", label: "Save", variant: "default", type: "submit" },
  ],
}

export default function MyPage() {
  const [errors, setErrors] = React.useState({})

  const handleAction = (action: string, data: Record<string, unknown>) => {
    if (action === "save") {
      // Validate
      const newErrors: Record<string, string> = {}
      if (!data.name) newErrors.name = "Name is required"
      if (!data.email) newErrors.email = "Email is required"

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      setErrors({})
      console.log("Saved:", data)
    } else if (action === "cancel") {
      console.log("Cancelled")
    }
  }

  return (
    <TsForm
      layout={formDef.layout}
      fields={formDef.fields}
      buttons={formDef.buttons}
      values={{ name: "John", active: true }}
      errors={errors}
      onAction={handleAction}
      onFieldChange={(field, value, allData) => {
        console.log(`Field ${field} changed to:`, value)
      }}
    />
  )
}
```

---

## TsTable

**Location:** `src/components/ts-web-ui/ts-table/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-table.json
```

Auto-installed dependencies:

- **npm:** `@tanstack/react-table`, `lucide-react`, `xlsx`, `date-fns`
- **TSWebUI:** `button`
- **Shadcn:** `checkbox`, `dropdown-menu`, `input`, `select`, `table`, `badge`

An advanced data grid built on TanStack Table v8 with sorting, filtering, pagination, column visibility/reordering/resizing, row selection with bulk actions, Excel import/export, clickable columns, and row actions.

React 19 compatibility note: debounced filter timeout refs should use `useRef<ReturnType<typeof setTimeout> | undefined>(undefined)` (instead of `null`) for strict TypeScript compatibility.

### TsTableProps

| Prop                       | Type                      | Default                | Description                                                                                             |
| -------------------------- | ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `data`                     | `TData[]`                 | —                      | **Required.** Array of data objects to display                                                          |
| `columnDefinitions`        | `TsTableColumnDef[]`      | —                      | **Required.** Column configuration array                                                                |
| `title`                    | `string`                  | `undefined`            | Title displayed in the toolbar                                                                          |
| `showCreateButton`         | `boolean`                 | `true`                 | Show "New record" button                                                                                |
| `showImportButton`         | `boolean`                 | `true`                 | Show "Import" button (Excel/CSV)                                                                        |
| `showExportButton`         | `boolean`                 | `true`                 | Show "Export" button (Excel). Behavior is context-aware: when no filter is active and no rows are selected, shows a plain button that exports all rows. When a column filter, global search, or row selection is active, shows a dropdown with up to three options: "Export all (N rows)", "Export selected (N rows)" (only when rows are selected), "Export filtered (N rows)" (disabled if filter matches 0 rows). |
| `showColumnSelector`       | `boolean`                 | `true`                 | Show column visibility toggle dropdown                                                                  |
| `enableSelection`          | `boolean`                 | `true`                 | Show row selection checkboxes                                                                           |
| `enableSorting`            | `boolean`                 | `true`                 | Enable column header sorting                                                                            |
| `enableFiltering`          | `boolean`                 | `true`                 | Show filter row below headers                                                                           |
| `enablePagination`         | `boolean`                 | `true`                 | Show pagination controls                                                                                |
| `enableRowMenu`            | `boolean`                 | `true`                 | Show per-row action dropdown (requires `singleItemActions`)                                             |
| `enableClickableRows`      | `boolean`                 | `true`                 | Make entire rows clickable (fires `onRowClick`)                                                         |
| `enableClickableColumns`   | `boolean`                 | `false`                | Enable per-column clickable cells (columns with `isClickable: true` fire `onRowClick` with `columnKey`) |
| `enableColumnResizing`     | `boolean`                 | `true`                 | Allow drag-resizing columns. Resize handles appear as subtle vertical lines between headers             |
| `enableColumnReordering`   | `boolean`                 | `true`                 | Show left/right arrows on hover to reorder data columns                                                 |
| `unhideableColumns`        | `string[]`                | `[]`                   | Column keys that cannot be hidden via column selector (shown but with disabled toggle)                  |
| `pageSize`                 | `number`                  | `10`                   | Default number of rows per page                                                                         |
| `pageSizeOptions`          | `number[]`                | `[5, 10, 20, 50, 100]` | Available page size options                                                                             |
| `singleItemActions`        | `string`                  | `undefined`            | Row actions in `"action/Label,action/Label"` format                                                     |
| `multipleItemsActions`     | `string`                  | `undefined`            | Bulk actions in `"action/Label,action/Label"` format (shown in header when rows selected)               |
| `predefinedFilters`        | `Record<string, unknown>` | `undefined`            | Pre-set column filters (key = column key, value = filter text). These are read-only for user            |
| `columnsRequiredForImport` | `string[]`                | `undefined`            | Column keys that must be present in imported files. If not set, all column keys are validated           |
| `getRowId`                 | `(row: TData) => string`  | `undefined`            | Custom row ID function for stable selection                                                             |
| `initialRowSelection`      | `Record<string, boolean>` | `undefined`            | Pre-selected row IDs (keyed by row ID)                                                                  |
| `importResult`             | `ImportResult \| null`    | `null`                 | Import results to display in a dialog (set by parent after processing import data)                      |
| `onImportResultClose`      | `() => void`              | `undefined`            | Called when user closes the import results dialog                                                       |
| `locale`                   | `string \| TsLocale`      | `undefined`            | UI locale override — preset name (`"en"`, `"cs"`) or full `TsLocale` object. Falls back to context      |

### Event Callbacks

| Callback            | Signature                                   | Description                                                                                            |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `onRowClick`        | `(row: TData, columnKey?: string) => void`  | Fires when a row or clickable cell is clicked. `columnKey` is provided only for `isClickable` columns. |
| `onCreateClick`     | `() => void`                                | Fires when "New record" button is clicked                                                              |
| `onAction`          | `(action: string, row: TData) => void`      | Fires when a single-row action is triggered from the dropdown menu                                     |
| `onImport`          | `(data: Record<string, unknown>[]) => void` | Fires when import file is parsed. Table validates columns and maps data. Parent processes the import   |
| `onBulkAction`      | `(action: string, rows: TData[]) => void`   | Fires when a bulk action is triggered (receives all currently selected rows)                           |
| `onDataChange`      | `(data: TData[]) => void`                   | Fires when data changes                                                                                |
| `onSelectionChange` | `(selectedRows: TData[]) => void`           | Fires when row selection changes                                                                       |

### ImportResult

The `ImportResult` interface is used to display import results in a dialog:

```ts
interface ImportResult {
  added: number
  updated: number
  rejected: number
  skipped: number
  rejectedRowsData?: Record<string, unknown>[]
}
```

### Import Flow

The import follows a two-phase pattern matching the reference implementation:

1. **Table handles file reading**: User selects a file → table reads it, validates column headers against `columnsRequiredForImport` (or all column definitions if not specified), and maps rows to known column keys only.
2. **Parent handles processing**: `onImport(data)` is called with the mapped data. The parent processes it (e.g., API call) and then sets the `importResult` prop with the result.
3. **Table shows results**: When `importResult` is set, a dialog shows counts (added, updated, rejected, skipped). If there are rejected rows with `rejectedRowsData`, user can download them as XLSX.
4. **Cleanup**: When user closes the dialog, `onImportResultClose` is called. Parent should set `importResult` back to `null`.

### TsTableColumnDef

| Property        | Type                                        | Default   | Description                                                                                                                   |
| --------------- | ------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `key`           | `string`                                    | —         | **Required.** Data key for the column (matches object property name)                                                          |
| `title`         | `string`                                    | —         | **Required.** Header label                                                                                                    |
| `type`          | `"text" \| "number" \| "date" \| "boolean"` | `"text"`  | Data type (affects rendering and filtering)                                                                                   |
| `sortable`      | `boolean`                                   | `true`    | Enable sorting for this column                                                                                                |
| `filterable`    | `boolean`                                   | `true`    | Enable filtering for this column                                                                                              |
| `visible`       | `boolean`                                   | `true`    | Initial column visibility (user can toggle via column selector)                                                               |
| `unshowable`    | `boolean`                                   | `false`   | Column is never shown in the table. Appears dimmed in column selector, not toggleable                                         |
| `width`         | `number \| string`                          | `200`     | Column width in pixels                                                                                                        |
| `align`         | `"left" \| "center" \| "right"`             | `"left"`  | Content alignment (affects header label, sort icon position, and reorder arrows)                                              |
| `canBeCopied`   | `boolean`                                   | `false`   | Show copy-to-clipboard icon on row hover                                                                                      |
| `isClickable`   | `boolean`                                   | `false`   | Make cell text clickable (styled as link, passes `columnKey` to `onRowClick`). Requires `enableClickableColumns` on the table |
| `locale`        | `string`                                    | `"cs-CZ"` | Locale for number and date formatting                                                                                         |
| `decimalPlaces` | `number`                                    | `2`       | Decimal places for number-type columns                                                                                        |

### Column Type Rendering

| Type        | Rendering                                         | Filter Input                 | Filter Behavior                                                                                   |
| ----------- | ------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `"text"`    | Plain text                                        | Text input                   | Substring match; supports `*` (any chars) and `?` (single char) wildcards                         |
| `"number"`  | Locale-formatted with configurable decimal places | Text input                   | `10..20` range, `10..` (≥10), `..20` (≤20), exact number matches via startsWith, fallback to text |
| `"date"`    | Locale-formatted date                             | Text input                   | Supports `DD.MM.YYYY`, `DD.MM.YY`, `YYYY-MM-DD`, `YYYY`, `MM.YYYY`. Range with `..` separator     |
| `"boolean"` | Read-only Switch component                        | Select dropdown (All/Yes/No) | Exact boolean match                                                                               |

### Sorting

Sorting uses **3-state cycling**: unsorted → ascending → descending → unsorted. Sort icons: `↑` (ascending), `↓` (descending). The unsorted `↕` icon is only visible on **column header hover** (dimmed). For right-aligned columns, the sort icon appears on the left of the label; for left-aligned columns, on the right.

### Row Actions and Bulk Actions

**Single-row actions** appear as a `⋮` (vertical dots) dropdown menu on each row:

```tsx
<TsTable
  singleItemActions="edit/Edit,delete/Delete,details/View Details"
  onAction={(action, row) => console.log(action, row)}
/>
```

**Bulk actions** appear in the header actions column when rows are selected:

```tsx
<TsTable
  multipleItemsActions="delete/Delete Selected,export/Export Selected"
  onBulkAction={(action, selectedRows) => console.log(action, selectedRows)}
/>
```

The bulk actions dropdown shows the count of selected rows and includes an "Unselect all" option.

### Selection View Mode

When rows are selected, a filter icon appears in the selection column (filter row). Clicking it cycles through three modes:

1. **All** — Show all rows (default)
2. **Selected** — Show only selected rows (check icon badge)
3. **Unselected** — Show only unselected rows (X icon badge)

### Column Selector

The column selector dropdown includes:

- **Search field** with persistent focus (clicking within dropdown keeps focus)
- **Two-stage Escape**: pressing Escape clears the search text first; a second Escape (when the search field is already empty) closes the dropdown
- Columns maintain their definition order (hidden columns stay in their original position)
- Columns with `unshowable: true` appear dimmed and cannot be toggled
- Columns in `unhideableColumns` array appear checked but cannot be unchecked
- Active filter indicator (filter icon) shown right-aligned for columns that have active filters
- "Clear all filters" button keeps the dropdown open (does not close on click)

### Column Resizing

When `enableColumnResizing` is enabled:

- Drag resize handles between column headers (subtle vertical line, always visible)
- Double-click a resize handle to reset column to default width
- **Independent sizing**: each column's width is its own; resizing one column does not affect others. The table's total width equals the sum of all column widths (it does not stretch to fill the container)
- Minimum column width is determined by the header controls (sort indicator + reorder arrows + padding). The column label truncates with ellipsis when the column is narrower than the label
- Select column (checkbox) and actions column (row menu) always have a fixed width of 40px, enforced via colgroup and inline styles regardless of table layout

### Column Reordering

When `enableColumnReordering` is enabled, left/right chevron arrows appear on header hover. The arrows respect alignment:

- **Left-aligned**: arrows appear on the right of the label
- **Right-aligned**: arrows appear on the left of the label
- **Center-aligned**: left arrow on the left, right arrow on the right

### Features Summary

- **Global search**: Full-text search toolbar with text input
- **Column sorting**: 3-state cycling (unsorted → asc → desc → unsorted)
- **Column filters**: Per-column filters in a dedicated row below headers. Text wildcards, number ranges, date ranges, boolean select
- **Column visibility**: Toggle via column selector dropdown with search
- **Column resizing**: Drag handles with subtle always-visible separator lines
- **Column reordering**: Hover arrows respecting column alignment
- **Pagination**: Configurable page size with first/prev/next/last navigation
- **Row selection**: Checkbox-based with select-all, selection view filter, bulk actions
- **Excel export**: Downloads filtered/visible data as `.xlsx` file
- **Excel/CSV import**: Upload `.xlsx`, `.xls`, `.csv`, or `.json`. Table validates columns and maps data, then calls `onImport`. Parent processes import and shows results via `importResult` prop
- **Predefined filters**: Lock specific column filters that users cannot modify
- **Clickable columns**: Individual columns can be marked clickable (styled as links)
- **Copy to clipboard**: Per-cell copy button on hover for enabled columns
- **Row count**: Footer shows "X of Y rows selected" and total row count

### Complete Usage Example

```tsx
"use client"

import * as React from "react"

import { TsTable } from "@/components/ts-web-ui/ts-table"
import { ImportResult, TsTableColumnDef } from "@/components/ts-web-ui/ts-table"

interface User {
  [key: string]: unknown
  id: number
  name: string
  email: string
  role: string
  active: boolean
  salary: number
  joinDate: string
}

const columns: TsTableColumnDef[] = [
  { key: "id", title: "ID", type: "number", visible: false },
  { key: "name", title: "Name", type: "text", isClickable: true },
  { key: "email", title: "Email", type: "text", canBeCopied: true },
  { key: "role", title: "Role", type: "text" },
  {
    key: "salary",
    title: "Salary",
    type: "number",
    align: "right",
    locale: "en-US",
    decimalPlaces: 0,
  },
  { key: "joinDate", title: "Joined", type: "date", align: "right" },
  { key: "active", title: "Active", type: "boolean", align: "center" },
  { key: "internalId", title: "Internal", type: "text", unshowable: true },
]

const data: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "Admin",
    active: true,
    salary: 95000,
    joinDate: "2021-03-15",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "User",
    active: false,
    salary: 72000,
    joinDate: "2022-07-22",
  },
]

export default function UsersPage() {
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null)

  const handleImport = (data: Record<string, unknown>[]) => {
    // Process import (e.g., API call), then show results:
    setImportResult({ added: data.length, updated: 0, rejected: 0, skipped: 0 })
  }

  return (
    <TsTable
      data={data}
      columnDefinitions={columns}
      title="User Management"
      enableClickableColumns
      enableColumnResizing
      enableColumnReordering
      singleItemActions="edit/Edit,delete/Delete"
      multipleItemsActions="delete/Delete Selected,export/Export"
      unhideableColumns={["name"]}
      pageSize={10}
      onRowClick={(row, col) => console.log("Clicked:", row.name, col)}
      onCreateClick={() => console.log("Create new user")}
      onAction={(action, row) => console.log(action, row)}
      onImport={handleImport}
      importResult={importResult}
      onImportResultClose={() => setImportResult(null)}
      onBulkAction={(action, rows) => console.log(action, rows.length)}
      onSelectionChange={(rows) => console.log("Selected:", rows.length)}
    />
  )
}
```

### Data Type Requirements

Data objects **must** extend `Record<string, unknown>`:

```ts
interface MyDataType {
  [key: string]: unknown // Required by TsTable generic constraint
  id: number
  name: string
  // ... other fields
}
```

---

## TsFormEditor

**Location:** `src/components/ts-web-ui/ts-form-editor/`

A visual drag-and-drop form builder. Users design forms interactively and export a JSON configuration that can then be passed directly to `TsForm`.

### Import

```tsx
import { TsFormEditor } from "@/components/ts-web-ui/ts-form-editor/form-editor"
```

### Usage

```tsx
"use client"

import { TsLocaleProvider } from "@/components/ts-web-ui/locale"
import { TsFormEditor } from "@/components/ts-web-ui/ts-form-editor/form-editor"

export default function FormBuilderPage() {
  return (
    <TsLocaleProvider locale="en">
      <div className="h-screen">
        <TsFormEditor />
      </div>
    </TsLocaleProvider>
  )
}
```

`TsFormEditor` takes no props. It is a fully controlled component backed by Zustand store (`useFormEditorStore`).

### Features

- **Drag-and-drop**: Drag field types from the left palette onto canvas rows/cells
- **Row management**: Add/remove/reorder rows via drag (using `@dnd-kit/core`)
- **Multi-column layout**: Add columns to rows; set each column's CSS grid width (`1fr`, `2fr`, `100px`, etc.)
- **Tabs or single-page mode**: Toggle via the mode selector in the toolbar
- **Field properties**: Click any field or button to inspect/edit its properties in the right panel
- **Button configuration**: Add, reorder (drag), delete and configure action buttons including confirmation dialogs
- **Undo/Redo**: Ctrl+Z / Ctrl+Shift+Z with full history stack
- **Import/Export**: Load or save the form definition as JSON
- **Live preview**: Open a modal dialog showing the actual `TsForm` rendered from the current definition
- **Event log**: The preview dialog logs all form events in real time

### Locale

All ~120 UI strings inside `TsFormEditor` are localized via `useTsLocale()`. Wrap with `TsLocaleProvider` to switch language:

```tsx
<TsLocaleProvider locale="cs">
  <TsFormEditor />
</TsLocaleProvider>
```

The `formEditor` locale section includes:
- **Toolbar**: `undo`, `redo`, `resetForm`, `import`, `export`, `preview`, `importJsonConfig`, `importDescription`, `cancel`, `invalidJsonError`, `copyToClipboard`, `downloadAsFile`
- **Canvas**: `components`, `formLayout`, `buttons`, `addRow`, `addButtonLabel`, `addColumn`, `deleteRow`, `insertColumnBefore`, `dragFieldHere`, `properties`, `selectFieldOrButton`
- **Drag overlay**: `dragAdding`, `dragMovingRow`, `dragMovingField`, `dragButton`, `dragRow`
- **Preview dialog**: `formPreview`, `interactivePreview`, `eventLog`, `clearLog`, `noEvents`
- **Button properties**: `buttonLabel`, `position`, `positionLeft/Center/Right`, `label`, `action`, `iconLucideName`, `variant`, `variantDefault/Primary/PrimaryBlue/Secondary/...`, `confirmationDialog`, `confirmEnabled`, `title`, `message`, `confirmButtonsJson`
- **Field properties**: `fieldId`, `fieldIdRequired/Invalid/NotUnique/RenameFailed`, `placeholder`, `hint`, `states`, `required`, `disabled`, `readOnly`, `selectAllOnFocus`, `enterAction`, `escapeAction`, `hidden`, `autoFocus`, `hideLabel`, `excludeFromSubmit`
- **Type-specific**: `numericSettings`, `min`, `max`, `step`, `roundTo`, `rowCount`, `options`, `allowCustom`, `processStyle`, `optionsJson`, `optionsFormatHint`, `dateSettings`, `dateFormat`, `dateFnsHint`, `fileUploadTitle`, `accept`, `acceptPlaceholder`, `innerLabel`, `innerLabelPlaceholder`, `allowMultiple`, `content`, `visualStyle`, `variantStandard`, `variantProcess`, `actionName`, `buttonVariant`, `relationshipSettings`, `targetEntity`, `selectionMode`, `selectionSingle/Multiple`, `valueField`, `displayFields`, `mockOptions`, `tableConfiguration`, `columnsJson`, `showCreateButton`, `delete`
- **Palette labels**: `fieldTypeLabels` (nested object with 21 field type keys) and `fieldGroupLabels` (nested object with 6 group keys: `text`, `selection`, `date`, `others`, `layout`, `complex`)

### Keyboard Shortcuts (inside TsFormEditor)

| Shortcut         | Action                                    |
| ---------------- | ----------------------------------------- |
| `Ctrl+Z`         | Undo                                      |
| `Ctrl+Shift+Z`   | Redo                                      |
| `Delete/Backspace` | Delete selected field                   |
| `Escape`         | Clear field selection                     |

### Store API (useFormEditorStore)

The editor state is managed by a Zustand store. You can import the hook directly if you need programmatic control:

```tsx
import { useFormEditorStore } from "@/components/ts-web-ui/ts-form-editor/store"

const { form, importJson, exportJson, resetForm } = useFormEditorStore()
```

Key store methods:

| Method              | Signature                                                       | Description                                    |
| ------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `importJson`        | `(json: string) => boolean`                                     | Load form definition from JSON string          |
| `exportJson`        | `() => string`                                                  | Serialize current form definition to JSON      |
| `resetForm`         | `() => void`                                                    | Reset to empty default form                    |
| `undo`              | `() => void`                                                    | Go back one history step                       |
| `redo`              | `() => void`                                                    | Go forward one history step                    |
| `addField`          | `(type, tabIndex, rowIndex, itemIndex) => void`                  | Add a field to a specific cell                 |
| `updateFieldConfig` | `(fieldId, config) => void`                                     | Update a field's configuration                 |

The exported JSON is compatible with `TsForm`'s `layout`, `fields`, and `buttons` props.

**Location:** `src/components/ts-web-ui/ts-logo/index.tsx`

**Install:**

```bash
npx shadcn@latest add https://janbkrejci.github.io/TSWebUI-shadcn/registry/ts-logo.json
```

Auto-installed dependencies: `lucide-react`

> **Note:** Logo is automatically installed as a dependency of `ts-topbar`, `ts-sidebar`, and `integrated-layout`.

Used with TopBar and Sidebar.

### Props

| Prop        | Type        | Description                              |
| ----------- | ----------- | ---------------------------------------- |
| `text`      | `string`    | Logo text                                |
| `icon`      | `ReactNode` | Logo icon element                        |
| `href`      | `string`    | If provided, logo becomes a Next.js Link |
| `className` | `string`    | Additional CSS classes                   |
| `children`  | `ReactNode` | Custom content                           |

```tsx
import { Hexagon } from "lucide-react"

import { Logo } from "@/components/ts-web-ui/ts-logo"

;<Logo text="My App" href="/" icon={<Hexagon className="h-6 w-6" />} />
```
