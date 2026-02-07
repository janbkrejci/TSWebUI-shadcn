"use client"

/**
 * TsSidebar - Animovaný sidebar s automatickým schováváním
 *
 * Funkce:
 * - Animované otevírání/zavírání
 * - Automatické schování na tablet a menší
 * - Ovládání přes tlačítko hamburger menu
 * - Překrytí obsahu na mobilech (overlay)
 * - Podpora pro umístění pod TopBar
 */
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"

import * as React from "react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

const SIDEBAR_STATE_KEY = "sidebar:state"
const SIDEBAR_COLLAPSED_KEY = "sidebar:collapsed"

/**
 * Kontext pro řízení stavu sidebaru
 */
interface SidebarContextValue {
  /** Je sidebar otevřený? */
  isOpen: boolean
  /** Přepnout stav sidebaru */
  toggle: () => void
  /** Otevřít sidebar */
  open: () => void
  /** Zavřít sidebar */
  close: () => void
  /** Je sidebar ve zkráceném (collapsed) módu? */
  isCollapsed: boolean
  /** Přepnout collapsed mód */
  toggleCollapsed: () => void
  /** Výška top baru (pro offset) */
  topBarHeight: number
  /** Jsme na mobilním zařízení? */
  isMobile: boolean
  /** Šířka sidebaru */
  width: string
  /** Šířka sidebaru v collapsed módu */
  collapsedWidth: string
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

/**
 * Hook pro přístup k sidebar kontextu
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

/**
 * Props pro SidebarProvider
 */
interface SidebarProviderProps {
  children: React.ReactNode
  /** Výchozí stav otevření (desktop) */
  defaultOpen?: boolean
  /** Breakpoint pro automatické schování (px) */
  mobileBreakpoint?: number
  /** Výška top baru pro offset sidebaru */
  topBarHeight?: number
  /** Šířka sidebaru */
  width?: string
  /** Šířka sidebaru v collapsed módu */
  collapsedWidth?: string
}

/**
 * Provider pro správu stavu sidebaru
 */
export function SidebarProvider({
  children,
  defaultOpen = true,
  mobileBreakpoint = 768,
  topBarHeight = 56,
  width = "16rem",
  collapsedWidth = "4rem",
}: SidebarProviderProps) {
  // Inicializace stavu - VŽDY začínáme s defaultními hodnotami bezpečná pro server
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  // Refs pro sledování předchozího stavu
  const wasMobileRef = React.useRef(false)
  const wasOpenRef = React.useRef(defaultOpen)

  // Inicializace stavu z prostředí prohlížeče po namontování
  React.useEffect(() => {
    // Teď jsme na klientu, můžeme bezpečně přistoupit k window a localStorage
    const mobile = window.innerWidth < mobileBreakpoint
    setIsMobile(mobile)
    wasMobileRef.current = mobile

    // Načtení uloženého stavu
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

  // Ukládání stavu do localStorage
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

  // Detekce změny velikosti okna
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      const wasMobile = wasMobileRef.current

      // Automaticky schovat na mobilech
      if (mobile && !wasMobile) {
        setIsMobile(true)
        setIsOpen(false)
        wasMobileRef.current = true
        wasOpenRef.current = false
      }
      // Automaticky otevřít při zvětšení na desktop (respektovat uložený stav)
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

  // Synchronizace refs při manuální změně stavu
  React.useEffect(() => {
    wasOpenRef.current = isOpen
  }, [isOpen])

  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  // Na mobile nikdy nekollapsovat
  const toggleCollapsed = React.useCallback(() => {
    if (!isMobile) {
      setIsCollapsed((prev) => !prev)
    }
  }, [isMobile])

  // Na mobile vždy collapsed=false
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
 * Hlavní sidebar komponenta
 * Umístěna pod TopBarem, animované otevírání/zavírání
 * Na desktopu je součástí layoutu, na mobilech je overlay
 */
export function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { isOpen, close, isCollapsed, topBarHeight, isMobile, width, collapsedWidth } = useSidebar()

  const sidebarHeight = `calc(100vh - ${topBarHeight}px)`
  const currentWidth = isCollapsed ? collapsedWidth : width

  return (
    <>
      {/* Overlay pro mobile - kliknutí zavře sidebar */}
      {isOpen && isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-opacity duration-300"
          )}
          style={{ top: topBarHeight }}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - na desktopu fixed vedle obsahu, na mobile overlay */}
      <aside
        className={cn(
          "fixed left-0",
          isMobile ? "z-[110]" : "z-40",
          "bg-background border-r",
          "transition-all duration-300 ease-in-out",
          // Na mobile: translate animace
          // Na desktop: vždy translate-x-0, šířka se animuje
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
 * Záhlaví sidebaru s logem a tlačítkem pro zavření
 */
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo nebo název aplikace */
  logo?: React.ReactNode
  /** Zobrazit tlačítko pro zavření */
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
        {/* Collapse tlačítko - jen na desktopu */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Rozbalit sidebar" : "Sbalit sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        )}
        {/* Zavírací tlačítko - jen na mobilech */}
        {showCloseButton && isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={close}
            aria-label="Zavřít menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Obsah sidebaru se scrollováním
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
 * Sekce v sidebaru
 */
interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Název sekce */
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
 * Položka navigace v sidebaru
 */
interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ikona položky */
  icon?: React.ReactNode
  /** Je položka aktivní? */
  isActive?: boolean
  /** Jako link wrapper */
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
    // Na mobilech zavřít sidebar po kliknutí na položku
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
 * Tlačítko pro otevření sidebaru (hamburger menu)
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
      aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
      {...props}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

/**
 * Zápatí sidebaru
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
 * Hlavní obsahová oblast vedle sidebaru
 * Automaticky se přizpůsobuje šířce sidebaru na desktopu
 */
export function SidebarInset({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"main">) {
  const { isOpen, isCollapsed, topBarHeight, isMobile, width, collapsedWidth } = useSidebar()

  // Na desktopu přidat margin-left podle sidebaru
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
 * Tlačítko pro kolapsování sidebaru
 * Kroužek na středu pravé hrany sidebaru
 * Zobrazuje se pouze na desktopu (ne na mobile)
 */
export function SidebarCollapseTrigger({ className }: { className?: string }) {
  const { isCollapsed, toggleCollapsed, isMobile, isOpen, topBarHeight } = useSidebar()

  // Na mobile nezobrazovat
  if (isMobile) return null

  // Pokud je sidebar zavřený (closed), nezobrazovat trigger
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
          title={isCollapsed ? "Rozbalit menu" : "Sbalit menu"}
          aria-label={isCollapsed ? "Rozbalit menu" : "Sbalit menu"}
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

// Re-exporty
export { SidebarContext }
