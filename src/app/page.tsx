"use client"

import {
  FormInput,
  Globe,
  LayoutGrid,
  Moon,
  Palette,
  PanelLeft,
  PanelTop,
  Pencil,
  Table2,
} from "lucide-react"

import Link from "next/link"
import { useTsLocale } from "@/components/ts-web-ui/locale"

export default function Home() {
  const locale = useTsLocale()
  const d = locale.strings.demo
  const n = locale.strings.nav

  return (
    <div className="space-y-4">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">TS Web UI (Shadcn Edition)</h1>
        <p className="text-muted-foreground mt-1">
          A React/Shadcn implementation of the TS Web UI components.
        </p>
      </div>

      {/* Main Components */}
      <div>
        <h2 className="text-base font-semibold mb-2">{d.mainComponents}</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          <Link
            href="/components/ts-window"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <LayoutGrid className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">TS Window</span>
                <span className="text-sm text-muted-foreground">{d.windowDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/ts-table"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <Table2 className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">TS Table</span>
                <span className="text-sm text-muted-foreground">{d.tableDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/ts-form"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <FormInput className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">TS Form</span>
                <span className="text-sm text-muted-foreground">{d.formDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/ts-topbar"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <PanelTop className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">{n.topbar}</span>
                <span className="text-sm text-muted-foreground">{d.topbarDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/ts-sidebar"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <PanelLeft className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">{n.sidebar}</span>
                <span className="text-sm text-muted-foreground">{d.sidebarDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/integrated-layout"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <LayoutGrid className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">{n.integratedLayout}</span>
                <span className="text-sm text-muted-foreground">{d.integratedLayoutDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/form-editor"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-3 h-32">
              <Pencil className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold text-lg block">{n.formEditor}</span>
                <span className="text-sm text-muted-foreground">{d.formEditorDesc}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Utility Components */}
      <div>
        <h2 className="text-base font-semibold mb-2">{d.utilityComponents}</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Link
            href="/components/theme-provider"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-2 h-28">
              <Palette className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold block">{n.themeProvider}</span>
                <span className="text-xs text-muted-foreground">{d.themeProviderDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/mode-toggle"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-2 h-28">
              <Moon className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold block">{n.modeToggle}</span>
                <span className="text-xs text-muted-foreground">{d.modeToggleDesc}</span>
              </div>
            </div>
          </Link>
          <Link
            href="/components/locale-toggle"
            className="rounded-xl border bg-card text-card-foreground shadow block hover:border-primary transition-colors"
          >
            <div className="p-4 flex flex-col items-center justify-center space-y-2 h-28">
              <Globe className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <span className="font-semibold block">{d.localeToggleTitle}</span>
                <span className="text-xs text-muted-foreground">{d.localeToggleDesc}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
