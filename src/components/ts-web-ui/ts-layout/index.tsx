"use client"

import * as React from "react"

import { NavItem, NavSection, Sidebar, SidebarInset, SidebarProvider } from "../ts-sidebar"
import { TopBar } from "../ts-topbar"

export interface TsLayoutProps {
  children: React.ReactNode
  navigation?: NavSection[] | NavItem[]
  logo?: React.ReactNode
  topBarLeft?: React.ReactNode
  topBarCenter?: React.ReactNode
  topBarRight?: React.ReactNode
  /**
   * Contained mode: use absolute positioning so the layout fits inside a
   * bounded demo container (e.g. a div with overflow-hidden).
   * In normal full-page usage leave this false (default).
   */
  contained?: boolean
}

/**
 * TsLayout - Integrated layout component combining TopBar and Sidebar
 *
 * This component provides a ready-to-use application shell with:
 * - Collapsible sidebar with navigation
 * - Top bar with hamburger menu, logo, and custom actions
 * - Responsive design (auto-hides on mobile)
 */
export function TsLayout({
  children,
  navigation,
  logo,
  topBarLeft,
  topBarCenter,
  topBarRight,
  contained = false,
}: TsLayoutProps) {
  return (
    <SidebarProvider>
      {/* TopBar automatically adds Hamburger if placed inside SidebarProvider */}
      <TopBar
        leftContent={topBarLeft || logo}
        centerContent={topBarCenter}
        rightContent={topBarRight}
        className={contained ? "absolute! top-0! left-0! right-0!" : undefined}
      />

      {/* Sidebar handles navigation data */}
      <Sidebar
        navigation={navigation}
        logo={logo}
        className={contained ? "absolute!" : undefined}
      />

      {/* SidebarInset handles main content area with proper margins */}
      <SidebarInset
        className={contained ? "absolute! inset-0! overflow-auto bg-transparent" : undefined}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
