"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Zjednodušený ThemeProvider, který v sobě plně integruje logiku ClientOnly.
 * Zajišťuje, že se aplikace začne renderovat až na klientu, čímž 100% předchází
 * chybám typu Hydration Mismatch a umožňuje bezpečné použití prohlížečových API
 * kdekoliv v podřízených komponentách.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Dokud nejsme na klientu, renderujeme pouze prázdný obal se správným pozadím.
  // Používáme CSS proměnnou a media query, aby barva seděla ještě před hydratací třídy .dark.
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <style>{`
          :root { --background: oklch(1 0 0); }
          @media (prefers-color-scheme: dark) { :root { --background: oklch(0.145 0 0); } }
        `}</style>
      </div>
    )
  }

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
