"use client"

import * as React from "react"

import { cs } from "./cs"
import { en } from "./en"
import { TsLocale } from "./types"

const localeMap: Record<string, TsLocale> = { en, cs }

const TsLocaleContext = React.createContext<TsLocale>(en)

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

export function TsLocaleProvider({ locale, children }: TsLocaleProviderProps) {
  const resolved = React.useMemo(() => resolveLocale(locale), [locale])
  return <TsLocaleContext.Provider value={resolved}>{children}</TsLocaleContext.Provider>
}

/**
 * Hook to get the current locale. An optional override (from component prop)
 * takes precedence over the context value.
 */
export function useTsLocale(override?: string | TsLocale): TsLocale {
  const contextLocale = React.useContext(TsLocaleContext)
  return React.useMemo(() => {
    if (!override) return contextLocale
    return resolveLocale(override)
  }, [override, contextLocale])
}
