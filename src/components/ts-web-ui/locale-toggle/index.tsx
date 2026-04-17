"use client"

import { Check, Languages } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ts-web-ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTsLocaleSetter } from "../locale"

const LOCALES = [
  { name: "en", label: "English", flag: "🇬🇧" },
  { name: "cs", label: "Česky", flag: "🇨🇿" },
] as const

/**
 * LocaleToggle - Language selector component for the TopBar.
 * Reads and sets the active locale via TsLocaleProvider context.
 */
export function LocaleToggle() {
  const { localeName, setLocaleName } = useTsLocaleSetter()

  const current = LOCALES.find((l) => l.name === localeName) ?? LOCALES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">
            {current.flag} {current.label}
          </span>
          <span className="sm:hidden">{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.name}
            onClick={() => setLocaleName(locale.name)}
            className="justify-between"
          >
            <span>
              {locale.flag} {locale.label}
            </span>
            {localeName === locale.name && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
