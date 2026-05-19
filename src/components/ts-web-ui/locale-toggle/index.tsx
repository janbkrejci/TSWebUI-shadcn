"use client"

import { Check } from "lucide-react"

import { Button } from "@/components/ts-web-ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTsLocaleSetter } from "../locale"

/** Inline SVG flag for Czech Republic */
function FlagCZ({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
      aria-label="Czech"
    >
      <rect width="900" height="600" fill="#fff" />
      <rect width="900" height="300" y="300" fill="#d7141a" />
      <polygon points="0,0 450,300 0,600" fill="#11457e" />
    </svg>
  )
}

/** Inline SVG flag for United Kingdom */
function FlagGB({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      className={className}
      aria-label="English"
    >
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#t)" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

const LOCALES = [
  { name: "cs", label: "Česky", Flag: FlagCZ },
  { name: "en", label: "English", Flag: FlagGB },
] as const

/**
 * LocaleToggle - Language selector component for the TopBar.
 * Shows the flag of the active language on the button and only text labels in the dropdown.
 * Reads and sets the active locale via TsLocaleProvider context.
 */
export function LocaleToggle() {
  const { localeName, setLocaleName } = useTsLocaleSetter()

  const current = LOCALES.find((l) => l.name === localeName) ?? LOCALES[0]
  const { Flag: CurrentFlag } = current

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0" aria-label={current.label}>
          <CurrentFlag className="h-5 w-7 rounded-[2px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.name}
            onClick={() => setLocaleName(locale.name)}
            className="justify-between gap-4"
          >
            <span>{locale.label}</span>
            {localeName === locale.name && <Check className="h-4 w-4 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
