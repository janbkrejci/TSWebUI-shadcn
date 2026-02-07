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

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useSidebar } from "@/components/ts-web-ui/ts-sidebar"

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
 * Navigation button component with support for collapsed mode
 */
function NavButton({
  href,
  label,
  icon: Icon,
  isActive,
  isCollapsed,
  onClick,
}: {
  href: string
  label: string
  icon: LucideIcon
  isActive: boolean
  isCollapsed: boolean
  onClick: () => void
}) {
  const button = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full h-9 text-sm",
        isCollapsed ? "justify-center px-2" : "justify-start px-3"
      )}
      asChild
      onClick={onClick}
    >
      <Link href={href}>
        <Icon className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-2")} />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </Link>
    </Button>
  )

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

/**
 * Main application sidebar with navigation
 * Contains links to components and all form widgets
 */
export function AppSidebar({ className }: React.ComponentProps<"div">) {
  const pathname = usePathname()
  const { close, isCollapsed } = useSidebar()

  // On mobile, close the sidebar after clicking a link
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      close()
    }
  }

  return (
    <TooltipProvider>
      <div className={cn("py-2", className)}>
        {/* Main Section */}
        <div className={cn("py-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed && (
            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-tight">
              Overview
            </h3>
          )}
          <div className="space-y-1">
            <NavButton
              href="/"
              label="Overview"
              icon={Home}
              isActive={pathname === "/"}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          </div>
        </div>

        {/* Components */}
        <div className={cn("py-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed && (
            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-tight">
              Components
            </h3>
          )}
          <div className="space-y-1">
            <NavButton
              href="/components/ts-window"
              label="Window"
              icon={LayoutGrid}
              isActive={pathname.startsWith("/components/ts-window")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <NavButton
              href="/components/ts-table"
              label="Table"
              icon={Table2}
              isActive={pathname.startsWith("/components/ts-table")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <NavButton
              href="/components/ts-form"
              label="Form"
              icon={FormInput}
              isActive={pathname.startsWith("/components/ts-form")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <NavButton
              href="/components/ts-topbar"
              label="TopBar"
              icon={PanelTop}
              isActive={pathname.startsWith("/components/ts-topbar")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <NavButton
              href="/components/ts-sidebar"
              label="Sidebar"
              icon={PanelLeft}
              isActive={pathname.startsWith("/components/ts-sidebar")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <NavButton
              href="/form-editor"
              label="Form Editor"
              icon={Pencil}
              isActive={pathname.startsWith("/form-editor")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          </div>
        </div>

        {/* Utility Components */}
        <div className={cn("py-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed && (
            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-tight">
              Utilities
            </h3>
          )}
          <div className="space-y-1">
            <NavButton
              href="/components/theme-provider"
              label="Theme Provider"
              icon={Palette}
              isActive={pathname.startsWith("/components/theme-provider")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <NavButton
              href="/components/mode-toggle"
              label="Mode Toggle"
              icon={Moon}
              isActive={pathname.startsWith("/components/mode-toggle")}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          </div>
        </div>

        {/* Form Widgets */}
        <div className={cn("py-2", isCollapsed ? "px-2" : "px-3")}>
          {!isCollapsed && (
            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-tight">
              Form Widgets
            </h3>
          )}
          <div className="space-y-1">
            {FORM_WIDGETS.map((widget) => (
              <NavButton
                key={widget.name}
                href={widget.href}
                label={widget.label}
                icon={widget.icon}
                isActive={pathname.startsWith(widget.href)}
                isCollapsed={isCollapsed}
                onClick={handleLinkClick}
              />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
