import Link from "next/link"
import { LayoutGrid, Table2, FormInput, PanelTop, PanelLeft, Pencil, Monitor, Moon, PanelLeftClose, Palette } from "lucide-react"

export default function Home() {
  return (
    <div className="max-w-7xl space-y-8">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">TS Web UI (Shadcn Edition)</h1>
        <p className="text-muted-foreground mt-2">
          A React/Shadcn implementation of the TS Web UI components.
        </p>
      </div>

      {/* Main Components */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Main Components</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          <Link href="/components/ts-window" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-6 flex flex-col items-center justify-center space-y-3 h-40">
                  <LayoutGrid className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold text-lg block">TS Window</span>
                    <span className="text-sm text-muted-foreground">Draggable, resizable windows</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/ts-table" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-6 flex flex-col items-center justify-center space-y-3 h-40">
                  <Table2 className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold text-lg block">TS Table</span>
                    <span className="text-sm text-muted-foreground">Advanced data tables</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/ts-form" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-6 flex flex-col items-center justify-center space-y-3 h-40">
                  <FormInput className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold text-lg block">TS Form</span>
                    <span className="text-sm text-muted-foreground">JSON-driven forms</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/ts-topbar" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-6 flex flex-col items-center justify-center space-y-3 h-40">
                  <PanelTop className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold text-lg block">TS TopBar</span>
                    <span className="text-sm text-muted-foreground">Application top bar</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/ts-sidebar" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-6 flex flex-col items-center justify-center space-y-3 h-40">
                  <PanelLeft className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold text-lg block">TS Sidebar</span>
                    <span className="text-sm text-muted-foreground">Collapsible navigation sidebar</span>
                  </div>
              </div>
          </Link>
          <Link href="/form-editor" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-6 flex flex-col items-center justify-center space-y-3 h-40">
                  <Pencil className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold text-lg block">Form Editor</span>
                    <span className="text-sm text-muted-foreground">Visual form builder</span>
                  </div>
              </div>
          </Link>
        </div>
      </div>

      {/* Utility Components */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Utility Components</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link href="/components/client-only" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-4 flex flex-col items-center justify-center space-y-2 h-32">
                  <Monitor className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold block">Client Only</span>
                    <span className="text-xs text-muted-foreground">SSR bypass wrapper</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/mode-toggle" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-4 flex flex-col items-center justify-center space-y-2 h-32">
                  <Moon className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold block">Mode Toggle</span>
                    <span className="text-xs text-muted-foreground">Theme switcher</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/theme-provider" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-4 flex flex-col items-center justify-center space-y-2 h-32">
                  <Palette className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold block">Theme Provider</span>
                    <span className="text-xs text-muted-foreground">Dark mode support</span>
                  </div>
              </div>
          </Link>
          <Link href="/components/sidebar-collapse-trigger" className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors">
              <div className="p-4 flex flex-col items-center justify-center space-y-2 h-32">
                  <PanelLeftClose className="h-8 w-8 text-muted-foreground" />
                  <div className="text-center">
                    <span className="font-semibold block">Collapse Trigger</span>
                    <span className="text-xs text-muted-foreground">Sidebar toggle button</span>
                  </div>
              </div>
          </Link>
        </div>
      </div>
    </div>
  );
}