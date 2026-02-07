"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Simplified ThemeProvider with hardcoded shadcn/ui defaults.
 * It provides theme support without an intrusive loading screen.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
