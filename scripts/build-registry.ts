import fs from "fs"
import path from "path"

const REGISTRY_PATH = path.join(process.cwd(), "public", "registry")
const COMPONENTS_BASE_PATH = path.join(process.cwd(), "src", "components", "ts-web-ui")

/**
 * Definition of components and their dependencies
 */
const REGISTRY_COMPONENTS = [
  {
    name: "ts-web-ui/ts-logo",
    dependencies: ["lucide-react"],
    registryDependencies: [],
    files: ["ts-logo.tsx"],
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
    registryDependencies: ["button", "ts-web-ui/ts-logo"],
    files: ["ts-sidebar/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-topbar",
    dependencies: ["lucide-react"],
    registryDependencies: ["ts-web-ui/ts-logo"],
    files: ["ts-topbar/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-window",
    dependencies: ["lucide-react", "react-rnd"],
    registryDependencies: ["button"],
    files: ["ts-window/index.tsx"],
  },
  {
    name: "ts-web-ui/ts-table",
    dependencies: ["@tanstack/react-table", "lucide-react", "xlsx", "date-fns"],
    registryDependencies: ["button", "checkbox", "dropdown-menu", "input", "select", "table"],
    files: [
      "ts-table/index.tsx",
      "ts-table/columns.tsx",
      "ts-table/filters.ts",
      "ts-table/ts-table-pagination.tsx",
      "ts-table/ts-table-toolbar.tsx",
      "ts-table/ts-table-view.tsx",
    ],
  },
  {
    name: "ts-web-ui/ts-form",
    dependencies: [
      "@hookform/resolvers",
      "react-hook-form",
      "zod",
      "lucide-react",
      "date-fns",
      "react-markdown",
    ],
    registryDependencies: [
      "alert-dialog",
      "button",
      "form",
      "alert",
      "badge",
      "calendar",
      "checkbox",
      "command",
      "input",
      "popover",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
      "toggle-group",
      "ts-web-ui/ts-table",
    ],
    files: [
      "ts-form/index.tsx",
      "ts-form/ts-form-field.tsx",
      "ts-form/ts-form-layout.tsx",
      "ts-form/ts-form-schema.ts",
      "ts-form/types.ts",
    ],
  },
  {
    name: "ts-web-ui/integrated-layout",
    dependencies: ["lucide-react"],
    registryDependencies: [
      "ts-web-ui/ts-sidebar",
      "ts-web-ui/ts-topbar",
      "ts-web-ui/theme-provider",
    ],
    files: ["ts-layout.tsx"],
  },
]

async function buildRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    fs.mkdirSync(REGISTRY_PATH, { recursive: true })
  }

  for (const component of REGISTRY_COMPONENTS) {
    const registryItem = {
      name: component.name,
      type: "registry:block",
      dependencies: component.dependencies,
      registryDependencies: component.registryDependencies,
      files: component.files.map((fileRelPath) => {
        const fullPath = path.join(COMPONENTS_BASE_PATH, fileRelPath)
        const content = fs.readFileSync(fullPath, "utf8")

        // Adjust imports to point to the target location in the user's project
        const processedContent = content
          .replace(/@\/components\/ui\//g, "@/components/ui/")
          .replace(/\.\.\/client-only/g, "@/components/ts-web-ui/client-only")
          .replace(/\.\.\/ts-table/g, "@/components/ts-web-ui/ts-table")
          .replace(/\.\.\/ts-form/g, "@/components/ts-web-ui/ts-form")
          .replace(/\.\.\/ts-sidebar/g, "@/components/ts-web-ui/ts-sidebar")
          .replace(/\.\.\/ts-topbar/g, "@/components/ts-web-ui/ts-topbar")
          .replace(/\.\.\/ts-window/g, "@/components/ts-web-ui/ts-window")
          .replace(/\.\/ts-sidebar/g, "@/components/ts-web-ui/ts-sidebar")
          .replace(/\.\/ts-topbar/g, "@/components/ts-web-ui/ts-topbar")

        return {
          path: `ts-web-ui/${fileRelPath}`,
          target: `components/ts-web-ui/${fileRelPath}`,
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

  // Generate main registry index
  const index = REGISTRY_COMPONENTS.map((c) => ({
    name: c.name,
    type: "registry:block",
    href: `https://janbkrejci.github.io/TSWebUI-shadcn/registry/${c.name.split("/").pop()}.json`,
  }))
  fs.writeFileSync(path.join(REGISTRY_PATH, "index.json"), JSON.stringify(index, null, 2))
}

buildRegistry().catch(console.error)
