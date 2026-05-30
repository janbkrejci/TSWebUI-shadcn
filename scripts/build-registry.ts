import fs from "fs"
import path from "path"

const REGISTRY_PATH = path.join(process.cwd(), "public", "registry")
const COMPONENTS_BASE_PATH = path.join(process.cwd(), "src", "components", "ts-web-ui")

/**
 * Base URL for the registry.
 * Override with REGISTRY_BASE_URL env var for local dev:
 *   REGISTRY_BASE_URL=http://localhost:3000/registry pnpm build:registry
 */
const REGISTRY_BASE_URL =
  process.env.REGISTRY_BASE_URL ?? "https://janbkrejci.github.io/TSWebUI-shadcn/registry"

/**
 * Definition of components and their dependencies
 */
const REGISTRY_COMPONENTS = [
  {
    name: "ts-web-ui/locale",
    dependencies: [],
    registryDependencies: [],
    files: [
      "locale/index.ts",
      "locale/types.ts",
      "locale/context.tsx",
      "locale/cs.ts",
      "locale/en.ts",
    ],
  },
  {
    name: "ts-web-ui/locale-toggle",
    dependencies: ["lucide-react"],
    registryDependencies: ["ts-web-ui/locale", "button", "dropdown-menu"],
    files: ["locale-toggle/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-logo",
    dependencies: ["lucide-react"],
    registryDependencies: [],
    files: ["ts-logo/index.tsx"],
  },
  {
    name: "ts-web-ui/theme-provider",
    dependencies: ["next-themes"],
    registryDependencies: [],
    files: ["theme-provider/index.tsx"],
  },
  {
    name: "ts-web-ui/mode-toggle",
    dependencies: ["lucide-react", "next-themes"],
    registryDependencies: ["button", "dropdown-menu"],
    files: ["mode-toggle/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-sidebar",
    dependencies: ["lucide-react"],
    registryDependencies: ["ts-web-ui/locale", "button", "tooltip", "ts-web-ui/ts-logo"],
    files: ["ts-sidebar/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-topbar",
    dependencies: ["lucide-react"],
    registryDependencies: ["ts-web-ui/ts-sidebar"],
    files: ["ts-topbar/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-window",
    dependencies: ["lucide-react", "react-rnd"],
    registryDependencies: ["ts-web-ui/locale", "button"],
    files: ["ts-window/index.tsx"],
  },
  {
    name: "ts-web-ui/dialog",
    dependencies: ["lucide-react", "radix-ui"],
    registryDependencies: [],
    files: ["../ui/dialog.tsx"],
  },
  {
    name: "ts-web-ui/alert-dialog",
    dependencies: ["radix-ui"],
    registryDependencies: ["button"],
    files: ["../ui/alert-dialog.tsx"],
  },
  {
    name: "ts-web-ui/ts-table",
    dependencies: ["@tanstack/react-table", "lucide-react", "xlsx", "sonner"],
    registryDependencies: [
      "ts-web-ui/locale",
      "button",
      "checkbox",
      "dropdown-menu",
      "input",
      "select",
      "table",
      "badge",
    ],
    files: [
      "ts-table/index.tsx",
      "ts-table/columns.tsx",
      "ts-table/filters.ts",
      "ts-table/persistence.ts",
      "ts-table/ts-table-pagination.tsx",
      "ts-table/ts-table-toolbar.tsx",
      "ts-table/ts-table-view.tsx",
    ],
  },
  {
    name: "ts-web-ui/ts-form",
    dependencies: [
      "react-hook-form",
      "lucide-react",
      "date-fns",
      "react-markdown",
      "remark-gfm",
      "react-syntax-highlighter",
    ],
    registryDependencies: [
      "ts-web-ui/locale",
      "ts-web-ui/alert-dialog",
      "button",
      "form",
      "alert",
      "badge",
      "ts-web-ui/calendar",
      "checkbox",
      "command",
      "ts-web-ui/dialog",
      "input",
      "popover",
      "radio-group",
      "select",
      "separator",
      "slider",
      "switch",
      "tabs",
      "textarea",
      "ts-web-ui/ts-table",
    ],
    files: [
      "ts-form/index.tsx",
      "ts-form/ts-form-field.tsx",
      "ts-form/ts-form-layout.tsx",
      "ts-form/ts-form-confirmation-dialog.tsx",
      "ts-form/types.ts",
      "ts-form/widget-types.ts",
      "ts-form/utils.ts",
      ...fs
        .readdirSync(path.join(COMPONENTS_BASE_PATH, "ts-form", "widgets"))
        .filter((file) => file.endsWith(".tsx"))
        .map((file) => `ts-form/widgets/${file}`),
    ],
  },
  {
    name: "ts-web-ui/ts-form-editor",
    dependencies: [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "lucide-react",
      "zustand",
    ],
    registryDependencies: [
      "ts-web-ui/locale",
      "ts-web-ui/ts-form",
      "badge",
      "button",
      "card",
      "ts-web-ui/dialog",
      "input",
      "label",
      "scroll-area",
      "select",
      "separator",
      "switch",
      "textarea",
      "tooltip",
    ],
    files: [
      "ts-form-editor/index.tsx",
      "ts-form-editor/form-editor.tsx",
      "ts-form-editor/store.ts",
      "ts-form-editor/types.ts",
    ],
  },
  {
    name: "ts-web-ui/calendar",
    dependencies: ["react-day-picker", "lucide-react"],
    registryDependencies: ["button"],
    files: ["../ui/calendar.tsx"],
  },
  {
    name: "ts-web-ui/ts-layout",
    dependencies: [],
    registryDependencies: ["ts-web-ui/ts-sidebar", "ts-web-ui/ts-topbar"],
    files: ["ts-layout/index.tsx"],
  },
]

async function buildRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    fs.mkdirSync(REGISTRY_PATH, { recursive: true })
  }

  const expectedJsonFiles = new Set([
    "index.json",
    ...REGISTRY_COMPONENTS.map((component) => `${component.name.split("/").pop()}.json`),
  ])

  for (const entry of fs.readdirSync(REGISTRY_PATH)) {
    if (!entry.endsWith(".json") || expectedJsonFiles.has(entry)) {
      continue
    }

    fs.unlinkSync(path.join(REGISTRY_PATH, entry))
  }

  for (const component of REGISTRY_COMPONENTS) {
    const registryItem = {
      name: component.name,
      type: "registry:block",
      dependencies: component.dependencies,
      registryDependencies: component.registryDependencies.map((dep) => {
        // Custom ts-web-ui components must use absolute URLs.
        // The shadcn CLI does NOT resolve relative paths against the remote
        // registry URL — it treats "./foo.json" as a local file on the user's
        // machine, which causes an ENOENT error.
        // Standard shadcn components (button, tooltip, …) are kept as plain
        // names so the CLI resolves them from the default shadcn registry.
        if (dep.startsWith("ts-web-ui/")) {
          const componentFileName = dep.split("/").pop()
          return `${REGISTRY_BASE_URL}/${componentFileName}.json`
        }
        return dep
      }),
      files: component.files.map((fileRelPath) => {
        const normalizedFilePath = fileRelPath.replaceAll("\\", "/")
        const fullPath = path.resolve(COMPONENTS_BASE_PATH, normalizedFilePath)
        const content = fs.readFileSync(fullPath, "utf8")

        const isUiComponent = normalizedFilePath.startsWith("../ui/")
        const cleanRelativePath = isUiComponent
          ? normalizedFilePath.slice("../ui/".length)
          : normalizedFilePath

        // Adjust imports to point to the target location in the user's project
        const processedContent = content
          .replace(/@\/components\/ts-web-ui\/locale/g, "@/components/ts-web-ui/locale")
          .replace(/from "\.\.\/locale"/g, 'from "@/components/ts-web-ui/locale"')
          .replace(/from '\.\.\/locale'/g, "from '@/components/ts-web-ui/locale'")
          .replace(/@\/components\/ui\//g, "@/components/ui/")
          .replace(/\.\.\/client-only/g, "@/components/ts-web-ui/client-only")
          .replace(/\.\.\/\.\.\/ts-table/g, "@/components/ts-web-ui/ts-table") // Handle widget depth
          .replace(/\.\.\/ts-table/g, "@/components/ts-web-ui/ts-table")
          .replace(/\.\.\/ts-form/g, "@/components/ts-web-ui/ts-form")
          .replace(/\.\.\/ts-logo/g, "@/components/ts-web-ui/ts-logo")
          .replace(/\.\.\/theme-provider/g, "@/components/ts-web-ui/theme-provider")
          .replace(/\.\.\/ts-sidebar/g, "@/components/ts-web-ui/ts-sidebar")
          .replace(/\.\.\/ts-topbar/g, "@/components/ts-web-ui/ts-topbar")
          .replace(/\.\.\/ts-window/g, "@/components/ts-web-ui/ts-window")
          .replace(/\.\/ts-sidebar/g, "@/components/ts-web-ui/ts-sidebar")
          .replace(/\.\/ts-topbar/g, "@/components/ts-web-ui/ts-topbar")

        return {
          path: isUiComponent ? `ui/${cleanRelativePath}` : `ts-web-ui/${cleanRelativePath}`,
          target: isUiComponent
            ? `components/ui/${cleanRelativePath}`
            : `components/ts-web-ui/${cleanRelativePath}`,
          content: processedContent,
          type: "registry:component",
        }
      }),
    }

    // Use the last part of the name for the JSON filename
    const jsonFileName = component.name.split("/").pop()
    const outputPath = path.join(REGISTRY_PATH, `${jsonFileName}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(registryItem, null, 2))
    console.log(`✅ Generated registry for ${component.name}`)
  }

  // Generate main registry index with absolute URLs
  const index = REGISTRY_COMPONENTS.map((c) => ({
    name: c.name,
    type: "registry:block",
    href: `${REGISTRY_BASE_URL}/${c.name.split("/").pop()}.json`,
  }))
  fs.writeFileSync(path.join(REGISTRY_PATH, "index.json"), JSON.stringify(index, null, 2))
}

buildRegistry().catch(console.error)
