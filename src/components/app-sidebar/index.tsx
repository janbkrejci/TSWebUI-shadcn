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
  exact?: boolean
}

/**
 * Sidebar section
 */
interface NavSection {
  title: string
  items: NavItem[]
}

/**
 * Definition of all navigation sections and items
 */
const NAVIGATION: NavSection[] = [
  {
    title: "Overview",
    items: [{ name: "overview", href: "/", label: "Overview", icon: Home, exact: true }],
  },
  {
    title: "Components",
    items: [
      { name: "window", href: "/components/ts-window", label: "Window", icon: LayoutGrid },
      { name: "table", href: "/components/ts-table", label: "Table", icon: Table2 },
      { name: "form", href: "/components/ts-form", label: "Form", icon: FormInput },
      { name: "topbar", href: "/components/ts-topbar", label: "TopBar", icon: PanelTop },
      { name: "sidebar", href: "/components/ts-sidebar", label: "Sidebar", icon: PanelLeft },
      { name: "form-editor", href: "/form-editor", label: "Form Editor", icon: Pencil },
    ],
  },
  {
    title: "Utilities",
    items: [
      {
        name: "theme-provider",
        href: "/components/theme-provider",
        label: "Theme Provider",
        icon: Palette,
      },
      { name: "mode-toggle", href: "/components/mode-toggle", label: "Mode Toggle", icon: Moon },
    ],
  },
  {
    title: "Form Widgets",
    items: [
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
      {
        name: "button-group",
        href: "/widgets/button-group",
        label: "Button Group",
        icon: ToggleRight,
      },

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
    ],
  },
]

/**
 * Main application sidebar with navigation
 * Dynamically generated from the NAVIGATION configuration
 */
export function AppSidebar({ className }: React.ComponentProps<"div">) {
  const pathname = usePathname()

  return (
    <div className={cn(className)}>
      {NAVIGATION.map((section) => (
        <SidebarSection key={section.title} title={section.title}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.name}
              icon={<item.icon className="h-4 w-4" />}
              isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </SidebarItem>
          ))}
        </SidebarSection>
      ))}
    </div>
  )
}
