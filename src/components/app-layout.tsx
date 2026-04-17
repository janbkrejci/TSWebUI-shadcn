"use client"

import {
  AlignLeft,
  Calendar,
  CalendarClock,
  CheckSquare,
  ChevronDown,
  CircleDot,
  FileText,
  FormInput,
  Hash,
  Home,
  Info,
  KeyRound,
  LayoutGrid,
  Link2,
  List,
  Minus,
  Moon,
  MousePointerClick,
  Palette,
  PanelLeft,
  PanelTop,
  Pencil,
  Search,
  SlidersHorizontal,
  Table2,
  TableProperties,
  ToggleLeft,
  ToggleRight,
  Type,
  Upload,
} from "lucide-react"

import * as React from "react"
import { TsLocaleProvider, useTsLocale } from "@/components/ts-web-ui/locale"
import { LocaleToggle } from "@/components/ts-web-ui/locale-toggle"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import {
  NavSection,
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ts-web-ui/ts-sidebar"
import { TopBar, TopBarGroup } from "@/components/ts-web-ui/ts-topbar"

const TOP_BAR_HEIGHT = 56

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const locale = useTsLocale()
  const n = locale.strings.nav

  const navigation: NavSection[] = React.useMemo(
    () => [
      {
        title: n.sectionOverview,
        items: [{ name: "overview", href: "/", label: n.overview, icon: Home, exact: true }],
      },
      {
        title: n.sectionComponents,
        items: [
          { name: "window", href: "/components/ts-window", label: n.window, icon: LayoutGrid },
          { name: "table", href: "/components/ts-table", label: n.table, icon: Table2 },
          { name: "form", href: "/components/ts-form", label: n.form, icon: FormInput },
          { name: "topbar", href: "/components/ts-topbar", label: n.topbar, icon: PanelTop },
          { name: "sidebar", href: "/components/ts-sidebar", label: n.sidebar, icon: PanelLeft },
          {
            name: "integrated-layout",
            href: "/components/integrated-layout",
            label: n.integratedLayout,
            icon: LayoutGrid,
          },
          { name: "form-editor", href: "/form-editor", label: n.formEditor, icon: Pencil },
        ],
      },
      {
        title: n.sectionUtilities,
        items: [
          {
            name: "theme-provider",
            href: "/components/theme-provider",
            label: n.themeProvider,
            icon: Palette,
          },
          { name: "mode-toggle", href: "/components/mode-toggle", label: n.modeToggle, icon: Moon },
        ],
      },
      {
        title: n.sectionFormWidgets,
        items: [
          { name: "text", href: "/widgets/text", label: "Text Input", icon: Type, exact: true },
          { name: "textarea", href: "/widgets/textarea", label: "Textarea", icon: AlignLeft },
          { name: "password", href: "/widgets/password", label: "Password", icon: KeyRound },
          { name: "number", href: "/widgets/number", label: "Number", icon: Hash },
          { name: "select", href: "/widgets/select", label: "Select", icon: ChevronDown },
          { name: "multiselect", href: "/widgets/multiselect", label: "Multi Select", icon: List },
          { name: "combobox", href: "/widgets/combobox", label: "Combobox", icon: Search },
          { name: "radio", href: "/widgets/radio", label: "Radio Group", icon: CircleDot },
          { name: "checkbox", href: "/widgets/checkbox", label: "Checkbox", icon: CheckSquare },
          { name: "switch", href: "/widgets/switch", label: "Switch", icon: ToggleLeft },
          {
            name: "button-group",
            href: "/widgets/button-group",
            label: "Button Group",
            icon: ToggleRight,
          },
          {
            name: "date",
            href: "/widgets/date",
            label: "Date Picker",
            icon: Calendar,
            exact: true,
          },
          { name: "datetime", href: "/widgets/datetime", label: "Date Time", icon: CalendarClock },
          { name: "slider", href: "/widgets/slider", label: "Slider", icon: SlidersHorizontal },
          { name: "file", href: "/widgets/file", label: "File Upload", icon: Upload },
          {
            name: "relationship",
            href: "/widgets/relationship",
            label: "Relationship Picker",
            icon: Link2,
          },
          {
            name: "button",
            href: "/widgets/button",
            label: "Button",
            icon: MousePointerClick,
            exact: true,
          },
          { name: "separator", href: "/widgets/separator", label: "Separator", icon: Minus },
          { name: "infobox", href: "/widgets/infobox", label: "Info Box", icon: Info },
          { name: "markdown", href: "/widgets/markdown", label: "Markdown", icon: FileText },
          { name: "table", href: "/widgets/table", label: "Nested Table", icon: TableProperties },
        ],
      },
    ],
    [n]
  )

  return (
    <SidebarProvider mobileBreakpoint={1024} topBarHeight={TOP_BAR_HEIGHT}>
      {/* Fixed TopBar - now handles Hamburger automatically */}
      <TopBar
        height={TOP_BAR_HEIGHT}
        leftContent={<Logo text={n.logoText} href="/" />}
        rightContent={
          <TopBarGroup>
            <LocaleToggle />
            <ModeToggle />
          </TopBarGroup>
        }
      />

      {/* Sidebar with navigation data */}
      <Sidebar navigation={navigation} />

      {/* Main Content Area */}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TsLocaleProvider locale="en">
        <AppLayoutInner>{children}</AppLayoutInner>
      </TsLocaleProvider>
    </ThemeProvider>
  )
}
