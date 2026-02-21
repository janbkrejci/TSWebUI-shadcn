"use client"

import * as React from "react"

import "@/app/globals.css"

import { NavItem, NavSection, Sidebar, SidebarInset, SidebarProvider } from "../ts-sidebar"
import { TopBar } from "../ts-topbar"

export interface TsLayoutProps {
  children: React.ReactNode
  navigation?: NavSection[] | NavItem[]
  logo?: React.ReactNode
  topBarLeft?: React.ReactNode
  topBarCenter?: React.ReactNode
  topBarRight?: React.ReactNode
  topBarHeight?: number
  mobileBreakpoint?: number
  className?: string
  topBarClassName?: string
  sidebarClassName?: string
  contentClassName?: string
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
  className,
  topBarClassName,
  sidebarClassName,
  contentClassName,
}: TsLayoutProps) {
  return (
    <SidebarProvider
      topBarHeight={topBarHeight}
      mobileBreakpoint={mobileBreakpoint}
      className={className}
    >
      {/* TopBar automatically adds Hamburger if placed inside SidebarProvider */}
      <TopBar
        height={topBarHeight}
        leftContent={topBarLeft || logo}
        centerContent={topBarCenter}
        rightContent={topBarRight}
        className={topBarClassName}
      />

      {/* Sidebar handles navigation data */}
      <Sidebar navigation={navigation} logo={logo} className={sidebarClassName} />

      {/* SidebarInset handles main content area with proper margins */}
      <SidebarInset className={contentClassName}>{children}</SidebarInset>
    </SidebarProvider>
  )
}
