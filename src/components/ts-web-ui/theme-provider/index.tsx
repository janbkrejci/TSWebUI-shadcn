"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Simplified ThemeProvider that first ensures the theme is applied to the document
 * and then safely hydrates the rest of the application. This prevents flickering
 * and 100% resolves Hydration Mismatch errors.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {mounted ? (
        children
      ) : (
        /* 
          This div is rendered on the server and during initial client load.
          Because it's inside NextThemesProvider, which injects a script into the head
          to set the .dark/.light class, bg-background will have the correct color
          immediately without waiting for JS detection.
        */
        <div className="min-h-screen bg-background" />
      )}
    </NextThemesProvider>
  )
}
