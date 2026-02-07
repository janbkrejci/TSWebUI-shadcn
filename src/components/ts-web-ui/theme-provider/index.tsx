"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Zjednodušený ThemeProvider, který nejprve zajistí aplikaci tématu na dokument
 * a následně bezpečně hydratuje zbytek aplikace. Tím předchází problikávání
 * a zároveň 100% řeší chyby typu Hydration Mismatch.
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
          Tento div se vyrenderuje na serveru a při startu klienta. 
          Protože je uvnitř NextThemesProvideru, který do head vkládá script 
          pro nastavení třídy .dark/.light, bude mít bg-background 
          okamžitě správnou barvu bez nutnosti detekce v JS.
        */
        <div className="min-h-screen bg-background" />
      )}
    </NextThemesProvider>
  )
}
