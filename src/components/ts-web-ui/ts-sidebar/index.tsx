"use client"

/**
 * TsSidebar - Animated sidebar with automatic hiding
 *
 * Features:
 * - Animated opening/closing
 * - Automatic hiding on tablet and smaller
 * - Control via hamburger menu button
 * - Content overlay on mobile (overlay)
 * - Support for placement under TopBar
 */
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"

import * as React from "react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

const SIDEBAR_STATE_KEY = "sidebar:state"
const SIDEBAR_COLLAPSED_KEY = "sidebar:collapsed"

/**
 * Context for controlling sidebar state
 */
interface SidebarContextValue {
  /** Is the sidebar open? */
  isOpen: boolean
  /** Toggle sidebar state */
  toggle: () => void
  /** Open sidebar */
  open: () => void
  /** Close sidebar */
  close: () => void
  /** Is the sidebar in collapsed mode? */
  isCollapsed: boolean
  /** Toggle collapsed mode */
  toggleCollapsed: () => void
  /** Top bar height (for offset) */
  topBarHeight: number
  /** Are we on a mobile device? */
  isMobile: boolean
  /** Sidebar width */
  width: string
  /** Sidebar width in collapsed mode */
  collapsedWidth: string
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

/**
 * Hook to access sidebar context
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

/**
 * Props for SidebarProvider
 */
interface SidebarProviderProps {
  children: React.ReactNode
  /** Default open state (desktop) */
  defaultOpen?: boolean
  /** Breakpoint for automatic hiding (px) */
  mobileBreakpoint?: number
  /** Top bar height for sidebar offset */
  topBarHeight?: number
  /** Sidebar width */
  width?: string
  /** Sidebar width in collapsed mode */
  collapsedWidth?: string
}

/**
 * Provider for sidebar state management
 */
export function SidebarProvider({
  children,
  defaultOpen = true,
  mobileBreakpoint = 768,
  topBarHeight = 56,
  width = "16rem",
  collapsedWidth = "4rem",
}: SidebarProviderProps) {
  // Initialization - ALWAYS start with server-safe default values
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  // Refs for tracking previous state
  const wasMobileRef = React.useRef(false)
  const wasOpenRef = React.useRef(defaultOpen)

  // Initialize state from browser environment after mounting
  React.useEffect(() => {
    // Now on client, safely access window and localStorage
    const mobile = window.innerWidth < mobileBreakpoint
    setIsMobile(mobile)
    wasMobileRef.current = mobile

    // Load saved state
    let initialOpen = defaultOpen
    if (mobile) {
      initialOpen = false
    } else {
      try {
        const stored = window.localStorage.getItem(SIDEBAR_STATE_KEY)
        if (stored !== null) {
          initialOpen = stored === "true"
        }
      } catch {
        // ignore
      }
    }

    setIsOpen(initialOpen)
    wasOpenRef.current = initialOpen

    try {
      const storedCollapsed = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (storedCollapsed !== null) {
        setIsCollapsed(storedCollapsed === "true")
      }
    } catch {
      // ignore
    }
  }, [defaultOpen, mobileBreakpoint])

  // Save state to localStorage
  React.useEffect(() => {
    if (!isMobile) {
      try {
        window.localStorage.setItem(SIDEBAR_STATE_KEY, String(isOpen))
      } catch {
        // ignore
      }
    }
  }, [isOpen, isMobile])

  React.useEffect(() => {
    if (!isMobile) {
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed))
      } catch {
        // ignore
      }
    }
  }, [isCollapsed, isMobile])

  // Detect window resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      const wasMobile = wasMobileRef.current

      // Automatically hide on mobile
      if (mobile && !wasMobile) {
        setIsMobile(true)
        setIsOpen(false)
        wasMobileRef.current = true
        wasOpenRef.current = false
      }
      // Automatically open when enlarged to desktop (respect saved state)
      else if (!mobile && wasMobile) {
        setIsMobile(false)

        let shouldBeOpen = defaultOpen
        try {
          const stored = window.localStorage.getItem(SIDEBAR_STATE_KEY)
          if (stored !== null) {
            shouldBeOpen = stored === "true"
          }
        } catch {
          // ignore
        }

        setIsOpen(shouldBeOpen)
        wasMobileRef.current = false
        wasOpenRef.current = shouldBeOpen
      }
    }

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mobileBreakpoint, defaultOpen])

  // Synchronize refs on manual state change
  React.useEffect(() => {
    wasOpenRef.current = isOpen
  }, [isOpen])

  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  // Never collapse on mobile
  const toggleCollapsed = React.useCallback(() => {
    if (!isMobile) {
      setIsCollapsed((prev) => !prev)
    }
  }, [isMobile])

  // On mobile always collapsed=false
  const effectiveCollapsed = isMobile ? false : isCollapsed

  const value = React.useMemo(
    () => ({
      isOpen,
      toggle,
      open,
      close,
      isCollapsed: effectiveCollapsed,
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
      toggleCollapsed,
      topBarHeight,
      isMobile,
      width,
      collapsedWidth,
    ]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

/**
 * Main sidebar component
 * Located under TopBar, animated opening/closing
 * On desktop it is part of the layout, on mobile it's an overlay
 */
export function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { isOpen, close, isCollapsed, topBarHeight, isMobile, width, collapsedWidth } = useSidebar()

  const sidebarHeight = `calc(100vh - ${topBarHeight}px)`
  const currentWidth = isCollapsed ? collapsedWidth : width
  const isAbsolute = className?.includes("absolute")

  return (
    <>
      {/* Overlay for mobile - clicking closes sidebar */}
      {isOpen && isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            isAbsolute && "absolute"
          )}
          style={{ top: topBarHeight }}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - on desktop fixed next to content, on mobile overlay */}
      <aside
        className={cn(
          "fixed left-0",
          isMobile ? "z-[110]" : "z-40",
          "bg-background border-r",
          "transition-all duration-300 ease-in-out",
          // On mobile: translate animation
          // On desktop: always translate-x-0, width animates
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          !isMobile && "overflow-visible",
          className
        )}
        style={{
          top: topBarHeight,
          height: sidebarHeight,
          width: isOpen ? currentWidth : 0,
        }}
        {...props}
      >
        <div className="flex flex-col h-full overflow-hidden">{children}</div>
        <SidebarCollapseTrigger />
      </aside>
    </>
  )
}

/**
 * Sidebar header with logo and close button
 */
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo or application name */
  logo?: React.ReactNode
  /** Show close button */
  showCloseButton?: boolean
}

export function SidebarHeader({
  className,
  children,
  logo,
  showCloseButton = true,
  ...props
}: SidebarHeaderProps) {
  const { close, isCollapsed, toggleCollapsed } = useSidebar()
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  return (
    <div
      className={cn(
        "flex items-center justify-between h-14 px-4 border-b flex-shrink-0",
        className
      )}
      {...props}
    >
      {!isCollapsed && (logo || children)}
      <div className="flex items-center gap-1">
        {/* Collapse button - only on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        )}
        {/* Close button - only on mobile */}
        {showCloseButton && isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={close}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Sidebar content with scrolling
 */
export function SidebarContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto scrollbar-hidden", className)}>
      <div className="py-2">{children}</div>
    </div>
  )
}

/**
 * Sidebar section
 */
interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string
}

export function SidebarSection({ className, title, children, ...props }: SidebarSectionProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {title && !isCollapsed && (
        <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-tight">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

/**
 * Sidebar navigation item
 */
interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Item icon */
  icon?: React.ReactNode
  /** Is the item active? */
  isActive?: boolean
  /** As a link wrapper */
  asChild?: boolean
}

export function SidebarItem({
  className,
  children,
  icon,
  isActive,
  asChild,
  ...props
}: SidebarItemProps) {
  const { isCollapsed, close } = useSidebar()
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // On mobile close sidebar after clicking an item
    if (isMobile) {
      close()
    }
    props.onClick?.(e)
  }

  const content = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-9 px-3 text-sm",
        isCollapsed && "justify-center px-2",
        className
      )}
      onClick={handleClick}
      {...(asChild ? {} : props)}
    >
      {icon && <span className={cn("flex-shrink-0", !isCollapsed && "mr-2")}>{icon}</span>}
      {!isCollapsed && children}
    </Button>
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ className?: string; onClick?: React.MouseEventHandler }>,
      {
        className: cn(
          "flex items-center w-full h-9 px-3 text-sm rounded-md transition-colors",
          isActive
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
          isCollapsed && "justify-center px-2",
          className
        ),
        onClick: handleClick,
      }
    )
  }

  return content
}

/**
 * Sidebar trigger button (hamburger menu)
 */
export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, isOpen } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={toggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      {...props}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

/**
 * Sidebar footer
 */
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

/**
 * Main content area next to sidebar
 * Automatically adjusts based on sidebar width on desktop
 */
export function SidebarInset({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"main">) {
  const { isOpen, isCollapsed, topBarHeight, isMobile, width, collapsedWidth } = useSidebar()

  // On desktop add margin-left based on sidebar
  const currentWidth = isCollapsed ? collapsedWidth : width
  const marginLeft = !isMobile && isOpen ? currentWidth : 0

  return (
    <main
      className={cn(
        "flex-1 flex flex-col overflow-auto transition-[margin-left] duration-300 ease-in-out",
        className
      )}
      style={{
        marginTop: topBarHeight,
        marginLeft,
        ...style,
      }}
      {...props}
    >
      {children}
    </main>
  )
}

/**
 * Sidebar collapse trigger button
 * Circle in the middle of the right edge of the sidebar
 * Displayed only on desktop (not mobile)
 */
export function SidebarCollapseTrigger({ className }: { className?: string }) {
  const { isCollapsed, toggleCollapsed, isMobile, isOpen, topBarHeight } = useSidebar()

  // Do not show on mobile
  if (isMobile) return null

  // If the sidebar is closed, do not show trigger
  if (!isOpen) return null

  return (
    <div className="absolute inset-y-0 -right-3 z-50 w-6 pointer-events-none">
      <div
        className="sticky flex justify-center -translate-y-1/2"
        style={{ top: `calc(50% + ${topBarHeight / 2}px)` }}
      >
        <button
          className={cn(
            "h-6 w-6 rounded-full",
            "bg-background border shadow-sm",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "pointer-events-auto",
            className
          )}
          onClick={toggleCollapsed}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
          aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
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

// Re-exports
export { SidebarContext }
