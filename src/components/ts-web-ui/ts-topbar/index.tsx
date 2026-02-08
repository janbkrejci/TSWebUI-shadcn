"use client"

/**
 * TopBar - Application top bar
 */
import * as React from "react"

import { cn } from "@/lib/utils"

import { SidebarContext, SidebarTrigger } from "../ts-sidebar"

/**
 * TopBar Context - allows components to access the top bar height
 */
interface TopBarContextValue {
  /** Top bar height in pixels */
  height: number
}

const TopBarContext = React.createContext<TopBarContextValue>({ height: 56 })

export function useTopBar() {
  return React.useContext(TopBarContext)
}

interface TopBarProviderProps {
  children: React.ReactNode
  /** Top bar height (default 56px = h-14) */
  height?: number
}

export function TopBarProvider({ children, height = 56 }: TopBarProviderProps) {
  const value = React.useMemo(() => ({ height }), [height])
  return <TopBarContext.Provider value={value}>{children}</TopBarContext.Provider>
}

interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Content on the left side */
  leftContent?: React.ReactNode
  /** Content in the middle */
  centerContent?: React.ReactNode
  /** Content on the right side */
  rightContent?: React.ReactNode
  /** Height in pixels */
  height?: number
  /** Should have a bottom border? */
  bordered?: boolean
  /** Automatically show sidebar trigger if available? */
  showTrigger?: boolean
}

/**
 * TopBar - main application top bar
 * Now uses 'sticky' positioning to stay in the document flow.
 */
export function TopBar({
  className,
  leftContent,
  centerContent,
  rightContent,
  height = 56,
  bordered = true,
  showTrigger = true,
  ...props
}: TopBarProps) {
  const sidebarContext = React.useContext(SidebarContext)
  const hasSidebar = !!sidebarContext && showTrigger

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "flex items-center justify-between gap-4 px-4",
        "bg-background",
        bordered && "border-b",
        className
      )}
      style={{ height }}
      {...props}
    >
      {/* Left side */}
      <div className="flex items-center gap-2 shrink-0">
        {hasSidebar && <SidebarTrigger />}
        {leftContent}
      </div>

      {/* Middle part */}
      {centerContent && (
        <div className="flex-1 flex items-center justify-center min-w-0">{centerContent}</div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">{rightContent}</div>
    </header>
  )
}

/**
 * Group wrapper for TopBar content (used for left, center, or right slots)
 */
export function TopBarGroup({
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

export { TopBarContext }
export { Logo } from "../ts-logo"
