"use client"

import * as React from "react"

import { NavItem, NavSection, Sidebar, SidebarInset, SidebarProvider } from "./ts-sidebar"
import { TopBar } from "./ts-topbar"

export interface TsLayoutProps {
  children: React.ReactNode
  navigation?: NavSection[] | NavItem[]
  logo?: React.ReactNode
  topBarLeft?: React.ReactNode
  topBarCenter?: React.ReactNode
  topBarRight?: React.ReactNode
  topBarHeight?: number
  mobileBreakpoint?: number
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
  topBarHeight = 56,
  mobileBreakpoint = 1024,
}: TsLayoutProps) {
  return (
    <SidebarProvider topBarHeight={topBarHeight} mobileBreakpoint={mobileBreakpoint}>
      {/* TopBar automatically adds Hamburger if placed inside SidebarProvider */}
      <TopBar
        height={topBarHeight}
        leftContent={topBarLeft || logo}
        centerContent={topBarCenter}
        rightContent={topBarRight}
      />

      {/* Sidebar handles navigation data */}
      <Sidebar navigation={navigation} logo={logo} />

      {/* SidebarInset handles main content area with proper margins */}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
