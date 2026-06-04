"use client"

/**
 * TsSidebar - Animated sidebar with automatic hiding and data-driven navigation
 */
import { ChevronLeft, ChevronRight, LucideIcon, Menu, X } from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { useTsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

import { Logo } from "../ts-logo"

const SIDEBAR_STATE_KEY = "sidebar:state"
const SIDEBAR_COLLAPSED_KEY = "sidebar:collapsed"

export interface NavItem {
  name: string
  href: string
  label: string
  icon: LucideIcon | React.ReactNode
  exact?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
  isCollapsed: boolean
  isTransitioning: boolean
  toggleCollapsed: () => void
  topBarHeight: number
  isMobile: boolean
  width: string
  collapsedWidth: string
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

/** Returns sidebar context or undefined when used outside a SidebarProvider */
export function useOptionalSidebar(): SidebarContextValue | undefined {
  return React.useContext(SidebarContext)
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  mobileBreakpoint?: number
  topBarHeight?: number
  width?: string
  collapsedWidth?: string
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  mobileBreakpoint = 768,
  topBarHeight = 56,
  width = "16rem",
  collapsedWidth = "4rem",
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const wasMobileRef = React.useRef(false)

  React.useEffect(() => {
    const mobile = window.innerWidth < mobileBreakpoint
    setIsMobile(mobile)
    wasMobileRef.current = mobile

    let initialOpen = defaultOpen
    if (mobile) {
      initialOpen = false
    } else {
      try {
        const stored = window.localStorage.getItem(SIDEBAR_STATE_KEY)
        if (stored !== null) initialOpen = stored === "true"
      } catch {
        /* ignore */
      }
    }

    setIsOpen(initialOpen)

    try {
      const storedCollapsed = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (storedCollapsed !== null) setIsCollapsed(storedCollapsed === "true")
    } catch {
      /* ignore */
    }
  }, [defaultOpen, mobileBreakpoint])

  React.useEffect(() => {
    if (!isMobile) {
      try {
        window.localStorage.setItem(SIDEBAR_STATE_KEY, String(isOpen))
      } catch {
        /* ignore */
      }
    }
  }, [isOpen, isMobile])

  React.useEffect(() => {
    if (!isMobile) {
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed))
      } catch {
        /* ignore */
      }
    }
  }, [isCollapsed, isMobile])

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      const wasMobile = wasMobileRef.current

      if (mobile && !wasMobile) {
        setIsMobile(true)
        setIsOpen(false)
        wasMobileRef.current = true
      } else if (!mobile && wasMobile) {
        setIsMobile(false)
        wasMobileRef.current = false
        try {
          const stored = window.localStorage.getItem(SIDEBAR_STATE_KEY)
          if (stored !== null) setIsOpen(stored === "true")
        } catch {
          /* ignore */
        }
      }
    }

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mobileBreakpoint])

  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  const toggleCollapsed = React.useCallback(() => {
    if (!isMobile) {
      setIsTransitioning(true)
      setIsCollapsed((prev) => !prev)
      setTimeout(() => setIsTransitioning(false), 290)
    }
  }, [isMobile])

  const effectiveCollapsed = isMobile ? false : isCollapsed

  const value = React.useMemo(
    () => ({
      isOpen,
      toggle,
      open,
      close,
      isCollapsed: effectiveCollapsed,
      isTransitioning,
      toggleCollapsed,
      topBarHeight,
      isMobile,
      width,
      collapsedWidth,
    }),
    [
      isOpen,
      toggle,
      open,
      close,
      effectiveCollapsed,
      isTransitioning,
      toggleCollapsed,
      topBarHeight,
      isMobile,
      width,
      collapsedWidth,
    ]
  )

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.ComponentProps<"aside"> {
  navigation?: NavSection[] | NavItem[]
  logo?: React.ReactNode
}

export function Sidebar({ className, children, navigation, logo, ...props }: SidebarProps) {
  const { isOpen, close, isCollapsed, topBarHeight, isMobile, width, collapsedWidth } = useSidebar()
  const pathname = usePathname()

  // When className includes "absolute" the sidebar is rendered inside a bounded
  // container (demo / widget), so we switch from viewport-based units to
  // container-relative units.
  const isAbsolute = className?.includes("absolute")

  const sidebarHeight = isAbsolute
    ? `calc(100% - ${topBarHeight}px)`
    : `calc(100vh - ${topBarHeight}px)`
  const currentWidth = isCollapsed ? collapsedWidth : width

  const renderContent = () => {
    if (!navigation) return children

    const isSections = (nav: NavSection[] | NavItem[]): nav is NavSection[] => {
      return nav.length > 0 && "items" in nav[0]
    }

    if (isSections(navigation)) {
      return navigation.map((section) => (
        <SidebarSection key={section.title} title={section.title}>
          {section.items.map((item) => (
            <SidebarItem
              key={item.name}
              icon={
                React.isValidElement(item.icon)
                  ? item.icon
                  : React.createElement(item.icon as React.ElementType, { className: "h-4 w-4" })
              }
              isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
              tooltip={item.label}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </SidebarItem>
          ))}
        </SidebarSection>
      ))
    }

    return (
      <SidebarSection>
        {navigation.map((item) => (
          <SidebarItem
            key={item.name}
            icon={
              React.isValidElement(item.icon)
                ? item.icon
                : React.createElement(item.icon as React.ElementType, { className: "h-4 w-4" })
            }
            isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
            tooltip={item.label}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </SidebarItem>
        ))}
      </SidebarSection>
    )
  }

  return (
    <>
      {/* Standalone floating trigger when sidebar is closed and NO TopBar is present */}
      {!isOpen && topBarHeight === 0 && (
        <div
          className={cn("z-60 bg-transparent", isAbsolute ? "absolute" : "fixed")}
          style={{ top: "12px", left: "16px" }}
        >
          <SidebarTrigger />
        </div>
      )}

      {isOpen && isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-100 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            isAbsolute && "absolute"
          )}
          style={{ top: topBarHeight }}
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 bg-background border-r transition-all duration-300 ease-in-out",
          isMobile ? "z-110" : "z-40",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          className
        )}
        style={{
          top: topBarHeight,
          height: sidebarHeight,
          width: isOpen ? currentWidth : 0,
        }}
        {...props}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <SidebarHeader logo={logo} />
          <SidebarContent>{renderContent()}</SidebarContent>
        </div>
        <SidebarCollapseTrigger />
      </aside>
    </>
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
  showCloseButton?: boolean
}

export function SidebarHeader({
  className,
  children,
  logo,
  showCloseButton = true,
  ...props
}: SidebarHeaderProps) {
  const { close, isCollapsed, isTransitioning, isMobile, topBarHeight } = useSidebar()
  const ts = useTsLocale().strings.sidebar

  const hasTopBar = topBarHeight > 0

  if (hasTopBar) return null

  // Header content stays visible during transition when collapsing
  const showContent = !isCollapsed || isTransitioning

  return (
    <div
      className={cn(
        "flex items-center justify-between h-14 px-4 shrink-0 transition-all duration-300",
        showContent && "border-b",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 overflow-hidden h-full">
        {!hasTopBar && !isMobile && (
          <>
            <SidebarTrigger />
            {showContent && (logo || children) && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                {typeof logo === "string" ? <Logo text={logo} /> : logo || children}
              </div>
            )}
          </>
        )}
        {/* On mobile show logo/label if it exists */}
        {isMobile && (logo || children) && (
          <div>{typeof logo === "string" ? <Logo text={logo} /> : logo || children}</div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {showCloseButton && isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={close}
            aria-label={ts.closeMenu}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function SidebarContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none",
        className
      )}
    >
      <div className="py-2">{children}</div>
    </div>
  )
}

interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

export function SidebarSection({ className, title, children, ...props }: SidebarSectionProps) {
  const { isCollapsed, isTransitioning } = useSidebar()

  const showTitle = !isCollapsed || isTransitioning

  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {title && (
        <div className="h-8 flex items-center px-2 mb-2 overflow-hidden">
          {showTitle && (
            <h3 className="text-sm font-semibold text-muted-foreground tracking-tight truncate animate-in fade-in duration-300">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  isActive?: boolean
  asChild?: boolean
  tooltip?: string
}

export function SidebarItem({
  className,
  children,
  icon,
  isActive,
  asChild,
  tooltip,
  ...props
}: SidebarItemProps) {
  const { isCollapsed, isTransitioning, close, isMobile } = useSidebar()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) close()
    props.onClick?.(e)
  }

  const tooltipText = tooltip || (typeof children === "string" ? children : undefined)

  const showLabel = !isCollapsed || isTransitioning

  const renderLabel = (label: React.ReactNode) => (
    <span
      className={cn(
        "transition-all duration-300 overflow-hidden whitespace-nowrap text-ellipsis flex-1 text-left",
        !showLabel ? "max-w-0 opacity-0 invisible ml-0" : "max-w-50 opacity-100 visible ml-2"
      )}
    >
      {label}
    </span>
  )

  const commonClasses = cn(
    "flex items-center w-full h-9 transition-all duration-300 rounded-md overflow-hidden px-0",
    isActive
      ? "bg-secondary text-secondary-foreground font-medium"
      : "hover:bg-accent hover:text-accent-foreground",
    className
  )

  const content = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-9 transition-all duration-300 flex items-center overflow-hidden px-0",
        className
      )}
      onClick={handleClick}
      {...(asChild ? {} : props)}
    >
      <div className="w-10 h-9 shrink-0 flex items-center justify-center">{icon}</div>
      {renderLabel(children)}
    </Button>
  )

  const finalItem =
    asChild && React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<{ className?: string; onClick?: React.MouseEventHandler }>,
          { className: commonClasses, onClick: handleClick },
          <>
            <div className="w-10 h-9 shrink-0 flex items-center justify-center">{icon}</div>
            {renderLabel((children.props as { children?: React.ReactNode }).children)}
          </>
        )
      : content

  if (isCollapsed && !isTransitioning && tooltipText) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{finalItem}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    )
  }

  return finalItem
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, isOpen } = useSidebar()
  const ts = useTsLocale().strings.sidebar

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={toggle}
      aria-label={isOpen ? ts.closeMenu : ts.openMenu}
      {...props}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("shrink-0 border-t p-3", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarInset({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"main">) {
  const { isOpen, isCollapsed, topBarHeight, isMobile, width, collapsedWidth } = useSidebar()

  const currentWidth = isCollapsed ? collapsedWidth : width
  const marginLeft = !isMobile && isOpen ? currentWidth : 0

  // When rendered in a bounded container (className contains "absolute") avoid
  // fixing the height to 100vh – let the container define the height instead.
  const isContained = className?.includes("absolute")

  if (isContained) {
    return (
      <main
        className={cn("flex flex-col transition-[margin-left] duration-300 ease-in-out", className)}
        style={{ marginLeft, paddingTop: topBarHeight, ...style }}
        {...props}
      >
        <div className="flex-1 relative overflow-auto p-4">{children}</div>
      </main>
    )
  }

  return (
    <main
      className={cn("flex flex-col transition-[margin-left] duration-300 ease-in-out", className)}
      style={{
        marginLeft,
        ...style,
      }}
      {...props}
    >
      {/*
       * No paddingTop here: the TopBar uses `sticky` positioning, so it already occupies its
       * height in the normal document flow and the main content starts right below it. Adding a
       * paddingTop of topBarHeight would both leave an empty gap below the bar and push total
       * content to 100vh + topBarHeight, making the page overscroll (rubber-band) the sticky bar.
       */}
      <div
        className="p-4 flex flex-col overflow-hidden"
        style={{ height: `calc(100vh - ${topBarHeight}px)` }}
      >
        <div className="flex-1 relative overflow-auto">{children}</div>
      </div>
    </main>
  )
}

export function SidebarCollapseTrigger({ className }: { className?: string }) {
  const { isCollapsed, toggleCollapsed, isMobile, isOpen, topBarHeight } = useSidebar()
  const ts = useTsLocale().strings.sidebar

  if (isMobile || !isOpen) return null

  return (
    <div className="absolute inset-y-0 -right-3 z-50 w-6 pointer-events-none">
      <div
        className="sticky flex justify-center -translate-y-1/2"
        style={{ top: `calc(50% + ${topBarHeight / 2}px)` }}
      >
        <button
          type="button"
          className={cn(
            "h-6 w-6 rounded-full bg-background border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pointer-events-auto",
            className
          )}
          onClick={toggleCollapsed}
          title={isCollapsed ? ts.expandMenu : ts.collapseMenu}
          aria-label={isCollapsed ? ts.expandMenu : ts.collapseMenu}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}

export { Logo } from "../ts-logo"
