import React from "react"

/**
 * Sanitizes a field name for use in HTML ID/aria-controls attributes.
 * Replaces dots, brackets and other non-alphanumeric characters with hyphens.
 */
export function sanitizeId(name: string): string {
  return name
    .replace(/[\[\]\.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getFieldClasses(error?: string, readonly?: boolean) {
  const hasError = !!error
  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""
  const readonlyPointerClass = readonly ? "pointer-events-none" : ""
  return { errorClass, readonlyClass, readonlyPointerClass }
}

export function handleFieldKeyDown(
  e: React.KeyboardEvent,
  name: string,
  enterAction?: string,
  escapeAction?: string,
  onClear?: () => void
) {
  if (e.key === "Enter") {
    if (enterAction) {
      e.preventDefault()
      e.stopPropagation()
      const event = new CustomEvent("form-key-action", {
        detail: { key: "Enter", action: enterAction, field: name },
        bubbles: true,
      })
      ;(e.currentTarget as HTMLElement).dispatchEvent(event)
    }
  } else if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    if (!escapeAction || escapeAction === "clear") {
      onClear?.()
    }
    if (escapeAction) {
      const event = new CustomEvent("form-key-action", {
        detail: { key: "Escape", action: escapeAction, field: name },
        bubbles: true,
      })
      ;(e.currentTarget as HTMLElement).dispatchEvent(event)
    }
  }
}

/**
 * Parses a string value into a number, supporting localized formats (comma/dot as decimal separator).
 */
export function parseNumericValue(val: string): number | undefined {
  if (!val || val.trim() === "") return undefined
  // Normalize by replacing common separators and removing spaces
  const normalized = val.replace(/\s/g, "").replace(",", ".")
  const num = parseFloat(normalized)
  return isNaN(num) ? undefined : num
}

/**
 * Formats a number for display according to locale and rounding settings.
 */
export function formatNumericValue(
  val: number | undefined,
  roundTo?: number,
  locale: string = "cs-CZ"
): string {
  if (val === undefined || val === null) return ""

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: roundTo !== undefined ? roundTo : 0,
    maximumFractionDigits: roundTo !== undefined ? roundTo : 2,
  }

  return new Intl.NumberFormat(locale, options).format(val)
}
