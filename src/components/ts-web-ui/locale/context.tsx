"use client"

import * as React from "react"

import { cs } from "./cs"
import { en } from "./en"
import { TsLocale } from "./types"

const localeMap: Record<string, TsLocale> = { en, cs }

interface TsLocaleContextValue {
  locale: TsLocale
  localeName: string
  setLocaleName: (name: string) => void
}

const TsLocaleContext = React.createContext<TsLocaleContextValue>({
  locale: en,
  localeName: "en",
  setLocaleName: () => {},
})

export interface TsLocaleProviderProps {
  /** A locale preset name ("en", "cs") or a full TsLocale object */
  locale?: string | TsLocale
  children: React.ReactNode
}

function resolveLocale(locale?: string | TsLocale): TsLocale {
  if (!locale) return en
  if (typeof locale === "string") return localeMap[locale] ?? en
  return locale
}

function resolveLocaleName(locale?: string | TsLocale): string {
  if (!locale) return "en"
  if (typeof locale === "string") return localeMap[locale] ? locale : "en"
  return "custom"
}

export function TsLocaleProvider({ locale, children }: TsLocaleProviderProps) {
  const initialName = resolveLocaleName(locale)
  const [localeName, setLocaleName] = React.useState(initialName)

  // Sync if locale prop changes externally
  React.useEffect(() => {
    setLocaleName(resolveLocaleName(locale))
  }, [locale])

  const resolved = React.useMemo(
    () => (localeName === "custom" ? resolveLocale(locale) : (localeMap[localeName] ?? en)),
    [localeName, locale]
  )

  const value = React.useMemo(
    () => ({ locale: resolved, localeName, setLocaleName }),
    [resolved, localeName]
  )

  return <TsLocaleContext.Provider value={value}>{children}</TsLocaleContext.Provider>
}

/**
 * Hook to get the current locale. An optional override (from component prop)
 * takes precedence over the context value.
 */
export function useTsLocale(override?: string | TsLocale): TsLocale {
  const { locale } = React.useContext(TsLocaleContext)
  return React.useMemo(() => {
    if (!override) return locale
    return resolveLocale(override)
  }, [override, locale])
}

/**
 * Hook to get and set the current locale name (for locale switchers).
 */
export function useTsLocaleSetter(): { localeName: string; setLocaleName: (name: string) => void } {
  const { localeName, setLocaleName } = React.useContext(TsLocaleContext)
  return { localeName, setLocaleName }
}
