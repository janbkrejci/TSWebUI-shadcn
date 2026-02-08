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
  Image,
  Info,
  KeyRound,
  LayoutGrid,
  Link2,
  List,
  LucideIcon,
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

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarItem, SidebarSection } from "@/components/ts-web-ui/ts-sidebar"

import { cn } from "@/lib/utils"

/**
 * Sidebar navigation item
 */
interface NavItem {
  name: string
  href: string
  label: string
  icon: LucideIcon
}

/**
 * Definition of all form widgets available in the system
 * Each widget has its own demo page
 */
const FORM_WIDGETS: NavItem[] = [
  // Text inputs
  { name: "text", href: "/widgets/text", label: "Text Input", icon: Type },
  { name: "textarea", href: "/widgets/textarea", label: "Textarea", icon: AlignLeft },
  { name: "password", href: "/widgets/password", label: "Password", icon: KeyRound },
  { name: "number", href: "/widgets/number", label: "Number", icon: Hash },

  // Value selection
  { name: "select", href: "/widgets/select", label: "Select", icon: ChevronDown },
  { name: "multiselect", href: "/widgets/multiselect", label: "Multi Select", icon: List },
  { name: "combobox", href: "/widgets/combobox", label: "Combobox", icon: Search },
  { name: "radio", href: "/widgets/radio", label: "Radio Group", icon: CircleDot },
  { name: "checkbox", href: "/widgets/checkbox", label: "Checkbox", icon: CheckSquare },
  { name: "switch", href: "/widgets/switch", label: "Switch", icon: ToggleLeft },
  { name: "button-group", href: "/widgets/button-group", label: "Button Group", icon: ToggleRight },

  // Date and Time
  { name: "date", href: "/widgets/date", label: "Date Picker", icon: Calendar },
  { name: "datetime", href: "/widgets/datetime", label: "Date Time", icon: CalendarClock },

  // Sliders
  { name: "slider", href: "/widgets/slider", label: "Slider", icon: SlidersHorizontal },

  // Files
  { name: "file", href: "/widgets/file", label: "File Upload", icon: Upload },
  { name: "image", href: "/widgets/image", label: "Image Upload", icon: Image },

  // Relationships
  {
    name: "relationship",
    href: "/widgets/relationship",
    label: "Relationship Picker",
    icon: Link2,
  },

  // Action elements
  { name: "button", href: "/widgets/button", label: "Button", icon: MousePointerClick },

  // Layout and display
  { name: "separator", href: "/widgets/separator", label: "Separator", icon: Minus },
  { name: "infobox", href: "/widgets/infobox", label: "Info Box", icon: Info },
  { name: "markdown", href: "/widgets/markdown", label: "Markdown", icon: FileText },

  // Complex widgets
  { name: "table", href: "/widgets/table", label: "Nested Table", icon: TableProperties },
]

/**
 * Main application sidebar with navigation
 * Contains links to components and all form widgets
 */
export function AppSidebar({ className }: React.ComponentProps<"div">) {
  const pathname = usePathname()

  return (
    <div className={cn(className)}>
      {/* Main Section */}
      <SidebarSection title="Overview">
        <SidebarItem icon={<Home className="h-4 w-4" />} isActive={pathname === "/"} asChild>
          <Link href="/">Overview</Link>
        </SidebarItem>
      </SidebarSection>

      {/* Components */}
      <SidebarSection title="Components">
        <SidebarItem
          icon={<LayoutGrid className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/ts-window")}
          asChild
        >
          <Link href="/components/ts-window">Window</Link>
        </SidebarItem>
        <SidebarItem
          icon={<Table2 className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/ts-table")}
          asChild
        >
          <Link href="/components/ts-table">Table</Link>
        </SidebarItem>
        <SidebarItem
          icon={<FormInput className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/ts-form")}
          asChild
        >
          <Link href="/components/ts-form">Form</Link>
        </SidebarItem>
        <SidebarItem
          icon={<PanelTop className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/ts-topbar")}
          asChild
        >
          <Link href="/components/ts-topbar">TopBar</Link>
        </SidebarItem>
        <SidebarItem
          icon={<PanelLeft className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/ts-sidebar")}
          asChild
        >
          <Link href="/components/ts-sidebar">Sidebar</Link>
        </SidebarItem>
        <SidebarItem
          icon={<Pencil className="h-4 w-4" />}
          isActive={pathname.startsWith("/form-editor")}
          asChild
        >
          <Link href="/form-editor">Form Editor</Link>
        </SidebarItem>
      </SidebarSection>

      {/* Utility Components */}
      <SidebarSection title="Utilities">
        <SidebarItem
          icon={<Palette className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/theme-provider")}
          asChild
        >
          <Link href="/components/theme-provider">Theme Provider</Link>
        </SidebarItem>
        <SidebarItem
          icon={<Moon className="h-4 w-4" />}
          isActive={pathname.startsWith("/components/mode-toggle")}
          asChild
        >
          <Link href="/components/mode-toggle">Mode Toggle</Link>
        </SidebarItem>
      </SidebarSection>

      {/* Form Widgets */}
      <SidebarSection title="Form Widgets">
        {FORM_WIDGETS.map((widget) => (
          <SidebarItem
            key={widget.name}
            icon={<widget.icon className="h-4 w-4" />}
            isActive={pathname.startsWith(widget.href)}
            asChild
          >
            <Link href={widget.href}>{widget.label}</Link>
          </SidebarItem>
        ))}
      </SidebarSection>
    </div>
  )
}
