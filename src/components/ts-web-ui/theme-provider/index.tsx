"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Zjednodušený ThemeProvider, který v sobě integruje ClientOnly logiku
 * a má pevně nastavené výchozí hodnoty pro shadcn/ui.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <style>{`
          @keyframes extra-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-150%); }
          }
          .animate-extra-bounce {
            animation: extra-bounce 0.6s infinite ease-in-out;
          }
          :root {
            --background: oklch(1 0 0);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: oklch(0.145 0 0);
            }
          }
        `}</style>
        <div className="flex space-x-3">
          <div className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-extra-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-extra-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-extra-bounce"></div>
        </div>
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
