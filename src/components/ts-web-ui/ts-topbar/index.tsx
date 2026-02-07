"use client"

/**
 * TsTopBar - Application top bar
 *
 * Features:
 * - Fixed to the top edge of the window
 * - Full width
 * - Slots for hamburger menu, logo, and actions
 */
import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * TopBar Context - allows components to access the top bar height
 */
interface TopBarContextValue {
  /** Top bar height in pixels */
  height: number
}

const TopBarContext = React.createContext<TopBarContextValue>({ height: 56 })

/**
 * Hook to access TopBar context
 */
export function useTopBar() {
  return React.useContext(TopBarContext)
}

/**
 * Props for TopBarProvider
 */
interface TopBarProviderProps {
  children: React.ReactNode
  /** Top bar height (default 56px = h-14) */
  height?: number
}

/**
 * Provider for TopBar - provides height to other components
 */
export function TopBarProvider({ children, height = 56 }: TopBarProviderProps) {
  const value = React.useMemo(() => ({ height }), [height])

  return <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>
}

/**
 * Props for TsTopBar
 */
interface TsTopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Content on the left side (hamburger, logo) */
  leftContent?: React.ReactNode
  /** Content in the middle (name, breadcrumbs) */
  centerContent?: React.ReactNode
  /** Content on the right side (actions, user menu) */
  rightContent?: React.ReactNode
  /** Height in pixels */
  height?: number
  /** Should have a bottom border? */
  bordered?: boolean
}

/**
 * TsTopBar - main application top bar
 *
 * Usage:
 * ```tsx
 * <TsTopBar
 *   leftContent={<SidebarTrigger />}
 *   centerContent={<span>Application Name</span>}
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
      {/* Left side */}
      <div className="flex items-center gap-2 shrink-0">{leftContent}</div>

      {/* Middle part - expands only if it has content */}
      {centerContent && (
        <div className="flex-1 flex items-center justify-center min-w-0">{centerContent}</div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">{rightContent}</div>
    </header>
  )
}

/**
 * Spacer for content under the TopBar
 * Ensures content doesn't start hidden under the fixed TopBar
 */
export function TopBarSpacer({ className }: { className?: string }) {
  const { height } = useTopBar()

  return <div className={className} style={{ height }} />
}

/**
 * Logo in the TopBar
 */
interface TopBarLogoProps {
  className?: string
  children?: React.ReactNode
  /** Logo text */
  text?: string
  /** Logo icon */
  icon?: React.ReactNode
  /** URL for link (if provided, logo will be a link) */
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
        className={cn(
          "flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity",
          className
        )}
      >
        {content}
      </Link>
    )
  }

  return <div className={cn("flex items-center gap-2 font-semibold", className)}>{content}</div>
}

/**
 * Actions section in the TopBar
 */
export function TopBarActions({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

// Re-exports
export { TopBarContext }
