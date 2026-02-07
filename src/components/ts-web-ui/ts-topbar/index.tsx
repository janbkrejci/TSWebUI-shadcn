"use client"

/**
 * TsTopBar - Aplikační horní lišta
 * 
 * Funkce:
 * - Fixovaná k horní hraně okna
 * - Přes celou šířku
 * - Slot pro hamburger menu, logo, akce
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

/**
 * Kontext pro TopBar - umožňuje komponentám přistupovat k výšce
 */
interface TopBarContextValue {
  /** Výška top baru v pixelech */
  height: number
}

const TopBarContext = React.createContext<TopBarContextValue>({ height: 56 })

/**
 * Hook pro přístup k TopBar kontextu
 */
export function useTopBar() {
  return React.useContext(TopBarContext)
}

/**
 * Props pro TopBarProvider
 */
interface TopBarProviderProps {
  children: React.ReactNode
  /** Výška top baru (default 56px = h-14) */
  height?: number
}

/**
 * Provider pro TopBar - poskytuje výšku dalším komponentám
 */
export function TopBarProvider({ children, height = 56 }: TopBarProviderProps) {
  const value = React.useMemo(() => ({ height }), [height])
  
  return (
    <TopBarContext.Provider value={value}>
      {children}
    </TopBarContext.Provider>
  )
}

/**
 * Props pro TsTopBar
 */
interface TsTopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Obsah na levé straně (hamburger, logo) */
  leftContent?: React.ReactNode
  /** Obsah uprostřed (název, breadcrumbs) */
  centerContent?: React.ReactNode
  /** Obsah na pravé straně (akce, user menu) */
  rightContent?: React.ReactNode
  /** Výška v pixelech */
  height?: number
  /** Má mít border dole? */
  bordered?: boolean
}

/**
 * TsTopBar - hlavní aplikační horní lišta
 * 
 * Použití:
 * ```tsx
 * <TsTopBar
 *   leftContent={<SidebarTrigger />}
 *   centerContent={<span>Název aplikace</span>}
 *   rightContent={<ModeToggle />}
 * />
 * ```
 */
export function TsTopBar({
  className,
  leftContent,
  centerContent,
  rightContent,
  height = 56,
  bordered = true,
  ...props
}: TsTopBarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "flex items-center justify-between gap-4 px-4",
        "bg-background",
        bordered && "border-b",
        className
      )}
      style={{ height }}
      {...props}
    >
      {/* Levá část */}
      <div className="flex items-center gap-2 shrink-0">
        {leftContent}
      </div>
      
      {/* Střední část - roztáhne se pouze pokud má obsah */}
      {centerContent && (
        <div className="flex-1 flex items-center justify-center min-w-0">
          {centerContent}
        </div>
      )}
      
      {/* Pravá část */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {rightContent}
      </div>
    </header>
  )
}

/**
 * Spacer pro obsah pod TopBarem
 * Zajistí, že obsah nezačíná pod fixovaným TopBarem
 */
export function TopBarSpacer({ className }: { className?: string }) {
  const { height } = useTopBar()
  
  return <div className={className} style={{ height }} />
}

/**
 * Logo v TopBaru
 */
interface TopBarLogoProps {
  className?: string
  children?: React.ReactNode
  /** Text loga */
  text?: string
  /** Ikona loga */
  icon?: React.ReactNode
  /** URL pro link (pokud je zadáno, logo bude odkaz) */
  href?: string
}

export function TopBarLogo({ className, text, icon, href, children }: TopBarLogoProps) {
  const content = (
    <>
      {icon}
      {text && <span>{text}</span>}
      {children}
    </>
  )

  if (href) {
    return (
      <Link 
        href={href} 
        className={cn("flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity", className)} 
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      {content}
    </div>
  )
}

/**
 * Sekce akcí v TopBaru
 */
export function TopBarActions({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

// Re-exporty
export { TopBarContext }
