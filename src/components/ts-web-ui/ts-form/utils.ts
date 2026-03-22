import { Locale } from "date-fns"
import * as Locales from "date-fns/locale"

import React from "react"

import { TsFieldDef } from "./types"

/**
 * Default values for widgets to avoid magic numbers.
 */
export const DEFAULT_TEXTAREA_ROWS = 3

/**
 * Resolves a locale string (e.g. 'cs-CZ', 'cs') to a date-fns Locale object.
 * Returns undefined if no matching locale is found.
 */
export function getDateLocale(localeStr?: string): Locale | undefined {
  if (!localeStr) return undefined
  const localesMap = Locales as Record<string, Locale>
  // Try exact match (e.g. 'cs-CZ' -> 'csCZ')
  const exactKey = localeStr.replace("-", "")
  if (localesMap[exactKey]) return localesMap[exactKey]
  // Try generic part (e.g. 'cs')
  const genericKey = localeStr.split("-")[0]
  return localesMap[genericKey] || undefined
}

/**
 * Converts null values to undefined in form output data.
 * Needed because NumberWidget uses null internally (RHF treats undefined as "use defaultValue")
 * but the external API should expose undefined for empty fields.
 */
export function normalizeFormOutput(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === null) {
      result[key] = undefined
    } else if (Array.isArray(value)) {
      result[key] = value
    } else if (value && typeof value === "object") {
      result[key] = normalizeFormOutput(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * Filters out fields marked with excludeFromSubmit: true from the data object.
 * Handles nested paths and array indices by deleting from the end of each array
 * to preserve correct remaining indices.
 * @param data The form data object.
 * @param fields Dictionary of field definitions.
 */
export function filterExcludeFromSubmit(
  data: Record<string, unknown>,
  fields: Record<string, TsFieldDef>
): Record<string, unknown> {
  const keysToDelete = Object.keys(fields).filter((k) => fields[k]?.excludeFromSubmit)
  if (keysToDelete.length === 0) return data

  const filteredData = deepClone(data)
  const arrayElementKeys: string[] = []
  const propertyKeys: string[] = []

  keysToDelete.forEach((path) => {
    const parts = path.split(".")
    const last = parts[parts.length - 1]
    if (/^\d+$/.test(last)) {
      arrayElementKeys.push(path)
    } else {
      propertyKeys.push(path)
    }
  })

  // 1. Delete property keys first. These do not affect array indices.
  propertyKeys.forEach((p) => deleteNestedKey(filteredData, p))

  // 2. Delete array elements. We must group them by parent array path
  // and delete indices from HIGHEST to LOWEST to avoid index shifts.
  const arrayGroups: Record<string, number[]> = {}
  arrayElementKeys.forEach((path) => {
    const parts = path.split(".")
    const indexStr = parts.pop()
    if (indexStr !== undefined) {
      const index = parseInt(indexStr, 10)
      const parent = parts.join(".")
      if (!arrayGroups[parent]) arrayGroups[parent] = []
      if (!arrayGroups[parent].includes(index)) arrayGroups[parent].push(index)
    }
  })

  // Sort parent paths by length descending to handle nested arrays correctly
  Object.keys(arrayGroups)
    .sort((a, b) => b.length - a.length)
    .forEach((parent) => {
      // Sort indices descending to maintain correct indices during splice
      arrayGroups[parent]
        .sort((a, b) => b - a)
        .forEach((index) => {
          deleteNestedKey(filteredData, `${parent}.${index}`)
        })
    })

  return filteredData
}

/**
 * Sanitizes a field name for use in HTML ID/aria-controls attributes.
 * Replaces any non-alphanumeric character with a hyphen for valid DOM IDs.
 */
export function sanitizeId(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Generates standard Tailwind classes for field states (error, readonly).
 * @param error Optional error message to trigger error styling.
 * @param readonly Whether the field is in read-only mode.
 */
export function getFieldClasses(error?: string, readonly?: boolean) {
  const hasError = !!error
  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = readonly
    ? "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
    : ""
  const readonlyPointerClass = readonly ? "cursor-default select-none" : ""
  return { errorClass, readonlyClass, readonlyPointerClass }
}

/**
 * Safely gets a nested value from an object using a dot-notated path (e.g., "user.address.street" or "items.0.name").
 * @param obj The source object.
 * @param path Dot-notated path to the key.
 */
export function getNestedValue(obj: Record<string, unknown> | undefined, path: string): unknown {
  if (!obj || !path) return undefined

  // Prototype pollution protection
  if (path.includes("__proto__") || path.includes("constructor") || path.includes("prototype")) {
    return undefined
  }

  // 1. Try direct key access first (for flat structures or exact matches)
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path]
  }
  // 2. Fallback to deep traversal
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined
    // Check if current part is an array index
    const isArrayIndex = /^\d+$/.test(part)
    current = isArrayIndex
      ? (current as unknown[])[parseInt(part, 10)]
      : (current as Record<string, unknown>)[part]
  }
  return current
}

/**
 * Safely sets a nested value in an object using a dot-notated path.
 * Mutates the original object. Creates missing objects/arrays along the path.
 * @param obj The target object.
 * @param path Dot-notated path.
 * @param value Value to set.
 */
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  if (!path) return

  const parts = path.split(".")
  const last = parts.pop()
  if (!last) return

  let current: unknown = obj
  for (const part of parts) {
    // Prototype pollution protection
    if (part === "__proto__" || part === "constructor" || part === "prototype") {
      return
    }

    const isArrayIndex = /^\d+$/.test(part)
    const key = isArrayIndex ? parseInt(part, 10) : part
    const currentObj = current as Record<string, unknown>

    if (
      currentObj[key] === undefined ||
      currentObj[key] === null ||
      typeof currentObj[key] !== "object"
    ) {
      // Peek ahead to see if the next part is an array index
      const nextPart = parts[parts.indexOf(part) + 1] || last
      currentObj[key] = /^\d+$/.test(nextPart) ? [] : {}
    }
    current = currentObj[key]
  }

  if (last === "__proto__" || last === "constructor" || last === "prototype") {
    return
  }

  const lastIsIndex = /^\d+$/.test(last)
  if (lastIsIndex && Array.isArray(current)) {
    ;(current as unknown[])[parseInt(last, 10)] = value
  } else {
    ;(current as Record<string, unknown>)[last!] = value
  }
}

/**
 * Safely deletes a nested key from an object using a dot-notated path (e.g., "user.address.street" or "items.0.name").
 * Mutates the original object.
 * @param obj The target object.
 * @param path Dot-notated path to the key.
 */
export function deleteNestedKey(obj: Record<string, unknown>, path: string): void {
  if (!path) return

  // Prototype pollution protection
  if (
    path.includes("__proto__") ||
    path.split(".").some((p) => p === "constructor" || p === "prototype")
  ) {
    return
  }

  const parts = path.split(".")
  const last = parts.pop()
  if (!last) return

  let current: unknown = obj
  for (const part of parts) {
    const isArrayIndex = /^\d+$/.test(part)
    const key = isArrayIndex ? parseInt(part, 10) : part
    const currentObj = current as Record<string, unknown>
    const next = currentObj[key]

    if (next && typeof next === "object") {
      current = next
    } else {
      return
    }
  }

  const lastIsIndex = /^\d+$/.test(last)
  if (lastIsIndex && Array.isArray(current)) {
    const index = parseInt(last, 10)
    if (index >= 0 && index < (current as unknown[]).length) {
      ;(current as unknown[]).splice(index, 1)
    }
  } else if (
    current &&
    typeof current === "object" &&
    Object.prototype.hasOwnProperty.call(current, last)
  ) {
    delete (current as Record<string, unknown>)[last]
  }
}

/**
 * A safer alternative to structuredClone for form data.
 * Handles primitives, plain objects, arrays, Dates and Files.
 *
 * NOTE: Files/Blobs are kept by reference (not cloned) because they are immutable
 * and structuredClone is not reliably available for Files in all target environments.
 */
export function deepClone<T>(val: T): T {
  // Primitives and null are returned as-is
  if (val === null || typeof val !== "object") return val

  // Dates are cloned to a new instance.
  // Cast is necessary because T is a generic type and TS cannot guarantee it matches Date.
  if (val instanceof Date) return new Date(val.getTime()) as unknown as T

  // Files and Blobs are considered immutable for our purposes and kept by reference.
  // Cast is necessary because T is generic.
  if (val instanceof File || val instanceof Blob) return val as unknown as T

  // Recursively clone arrays.
  // Cast is necessary because map returns a new array that TS doesn't automatically map back to T.
  if (Array.isArray(val)) {
    return val.map((item) => deepClone(item)) as unknown as T
  }

  // Recursively clone plain objects.
  const clonedObj: Record<string, unknown> = {}
  const sourceObj = val as Record<string, unknown>
  for (const key in sourceObj) {
    if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
      clonedObj[key] = deepClone(sourceObj[key])
    }
  }
  // Cast is necessary to convert our cloned record back to the original generic type T.
  return clonedObj as unknown as T
}

/**
 * Dispatches a custom event for form-level actions (e.g. picker selection, button click).
 */
export function dispatchFormAction(
  ref: React.Ref<HTMLElement> | undefined,
  name: string,
  action: string,
  data?: unknown,
  eventName: "form-field-action" | "form-table-action" = "form-field-action"
) {
  const el =
    (ref && typeof ref === "object" && "current" in ref ? ref.current : null) ||
    document.activeElement
  if (el) {
    el.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { field: name, action, data },
        bubbles: true,
      })
    )
  }
}

export function handleFieldKeyDown(
  e: React.KeyboardEvent,
  name: string,
  enterAction?: string,
  escapeAction?: string,
  onClear?: () => void,
  commitValue?: unknown
) {
  if (e.key === "Enter") {
    // For Textarea we ignore Enter (want new line),
    // unless pressed with Ctrl/Meta (then we perform action)
    const isTextarea = (e.currentTarget as HTMLElement).tagName === "TEXTAREA"
    if (isTextarea && !e.ctrlKey && !e.metaKey) return

    // Always prevent native form submit in regular inputs
    e.preventDefault()
    e.stopPropagation()

    // Dispatch with explicit action or default "submit"
    const action = enterAction || "submit"
    const event = new CustomEvent("form-key-action", {
      detail: {
        key: "Enter",
        action,
        field: name,
        value: commitValue,
      },
      bubbles: true,
    })
    ;(e.currentTarget as HTMLElement).dispatchEvent(event)
  } else if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    if (!escapeAction || escapeAction === "clear") {
      onClear?.()
    }
    // Dispatch with explicit action or default "cancel"
    const action = escapeAction || "cancel"
    const event = new CustomEvent("form-key-action", {
      detail: { key: "Escape", action, field: name },
      bubbles: true,
    })
    ;(e.currentTarget as HTMLElement).dispatchEvent(event)
  }
}

/**
 * Safely evaluates a simple mathematical expression (addition, subtraction, multiplication, division).
 * Supports both dot and comma as decimal separators.
 * Implementation avoids 'eval' or 'new Function' for security.
 */
export function evaluateMath(val: string): number | undefined {
  if (!val || val.trim() === "") return undefined

  // Normalize: remove spaces, replace all commas with dots
  const expression = val.replace(/\s/g, "").replace(/,/g, ".")

  // Only allow numbers and basic math operators
  if (!/^[0-9.+\-*/^()]+$/.test(expression)) return undefined

  try {
    const tokens = expression.match(/[0-9.]+|[+\-*/^()]/g) || []
    if (tokens.length === 0) return undefined

    const ops = {
      "+": (a: number, b: number) => a + b,
      "-": (a: number, b: number) => a - b,
      "*": (a: number, b: number) => a * b,
      "/": (a: number, b: number) => a / b,
      "^": (a: number, b: number) => Math.pow(a, b),
    }

    const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 }
    const values: number[] = []
    const operators: string[] = []

    const applyOp = (): boolean => {
      const op = operators.pop()
      if (!op || values.length < 2) return false
      const b = values.pop()!
      const a = values.pop()!
      const operation = ops[op as keyof typeof ops]
      if (!operation) return false
      values.push(operation(a, b))
      return true
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      // Handle unary minus and plus: if '-' or '+' is the first token or follows an opening parenthesis
      if ((token === "-" || token === "+") && (i === 0 || tokens[i - 1] === "(")) {
        if (token === "-") {
          values.push(0) // Treat -X as 0 - X
          operators.push("-")
        }
        // Unary '+' is just ignored as it doesn't change the value (treat +X as X)
        continue
      }

      if (!isNaN(Number(token))) {
        values.push(Number(token))
      } else if (token === "(") {
        operators.push(token)
      } else if (token === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          if (!applyOp()) return undefined
        }
        operators.pop()
      } else {
        while (
          operators.length &&
          operators[operators.length - 1] !== "(" &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          if (!applyOp()) return undefined
        }
        operators.push(token)
      }
    }

    while (operators.length) {
      if (!applyOp()) return undefined
    }

    const rawResult = values[0]
    // Fix floating point precision (e.g., 0.1 + 0.2) by rounding to 12 decimal places
    const result = typeof rawResult === "number" ? Math.round(rawResult * 1e12) / 1e12 : undefined

    return typeof result === "number" && isFinite(result) && values.length === 1
      ? result
      : undefined
  } catch {
    return undefined
  }
}

/**
 * Parses a string value into a number, supporting localized formats and basic math expressions.
 */
export function parseNumericValue(val: string): number | undefined {
  if (!val || val.trim() === "") return undefined

  // Try direct float parsing first (normalized)
  const normalized = val.replace(/\s/g, "").replace(",", ".")
  const num = parseFloat(normalized)

  // If the whole string is a valid float, return it
  if (!isNaN(num) && String(num) === normalized) {
    return num
  }

  // Otherwise, try evaluating it as a math expression
  return evaluateMath(val)
}

/**
 * Formats a number for display according to locale and rounding settings.
 */
export function formatNumericValue(
  val: number | undefined,
  roundTo?: number,
  locale?: string
): string {
  if (val === undefined || val === null) return ""

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: roundTo !== undefined ? roundTo : 0,
    maximumFractionDigits: roundTo !== undefined ? roundTo : 2,
  }

  return new Intl.NumberFormat(locale || undefined, options).format(val)
}

/**
 * Smart parses a string into a Date object.
 * Supports: DDMMYYYY, DDMMYY, DDMM, DD.MM.YYYY, DD.MM.YY, DD.MM, D.M, D.M.YYYY
 * Missing year defaults to current year.
 */
export function parseSmartDate(val: string): Date | undefined {
  if (!val || val.trim() === "") return undefined

  const trimmed = val.trim()
  const today = new Date()
  const currentYear = today.getFullYear()

  // 1. Try DD.MM.YYYY or D.M.YYYY or DD.MM.YY or D.M.YY (with optional spaces after dots and optional trailing dot)
  const dotPattern = /^(\d{1,2})\.\s*(\d{1,2})(?:\.\s*(\d{2,4}))?\.?$/
  const dotMatch = trimmed.match(dotPattern)
  if (dotMatch) {
    const d = parseInt(dotMatch[1], 10)
    const m = parseInt(dotMatch[2], 10) - 1
    let y = dotMatch[3] ? parseInt(dotMatch[3], 10) : currentYear
    if (dotMatch[3] && dotMatch[3].length === 2) {
      y += y > 50 ? 1900 : 2000
    }
    const res = new Date(y, m, d)
    if (!isNaN(res.getTime())) return res
  }

  // 2. Try compact numeric formats: DDMMYYYY, DDMMYY, DDMM
  const digits = trimmed.replace(/\D/g, "")
  if (digits.length === 8) {
    const d = parseInt(digits.substring(0, 2), 10)
    const m = parseInt(digits.substring(2, 4), 10) - 1
    const y = parseInt(digits.substring(4, 8), 10)
    const res = new Date(y, m, d)
    if (!isNaN(res.getTime())) return res
  } else if (digits.length === 6) {
    const d = parseInt(digits.substring(0, 2), 10)
    const m = parseInt(digits.substring(2, 4), 10) - 1
    let y = parseInt(digits.substring(4, 6), 10)
    y += y > 50 ? 1900 : 2000
    const res = new Date(y, m, d)
    if (!isNaN(res.getTime())) return res
  } else if (digits.length === 4) {
    const d = parseInt(digits.substring(0, 2), 10)
    const m = parseInt(digits.substring(2, 4), 10) - 1
    const res = new Date(currentYear, m, d)
    if (!isNaN(res.getTime())) return res
  }

  // 3. Fallback to standard JS Date parsing
  const fallback = new Date(trimmed)
  if (!isNaN(fallback.getTime())) return fallback

  return undefined
}

/**
 * Smart parses a string into a Date object with time.
 */
export function parseSmartDateTime(val: string): Date | undefined {
  if (!val || val.trim() === "") return undefined
  const trimmed = val.trim()

  // Try splitting date and time
  const parts = trimmed.split(/\s+/)
  if (parts.length === 2) {
    const d = parseSmartDate(parts[0])
    if (d) {
      const timeParts = parts[1].split(/[:.]/)
      if (timeParts.length >= 1) {
        const h = parseInt(timeParts[0], 10)
        const m = timeParts[1] ? parseInt(timeParts[1], 10) : 0
        d.setHours(h, m, 0, 0)
        if (!isNaN(d.getTime())) return d
      }
    }
  } else if (parts.length === 1) {
    // Maybe just date, or compact date time?
    // Let's check for HH:mm format if it doesn't look like a date
    if (trimmed.includes(":") && !trimmed.includes(".")) {
      const today = new Date()
      const timeParts = trimmed.split(":")
      today.setHours(
        parseInt(timeParts[0], 10),
        timeParts[1] ? parseInt(timeParts[1], 10) : 0,
        0,
        0
      )
      if (!isNaN(today.getTime())) return today
    }
    return parseSmartDate(parts[0])
  }

  return undefined
}

/**
 * Maps custom TsButtonVariant to Shadcn button variants and additional CSS classes.
 */
export function getButtonVariantClasses(variant?: string): {
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className: string
} {
  let shadcnVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" =
    "default"
  let className = ""

  if (!variant) return { variant: shadcnVariant, className }

  if (variant === "primary") {
    className = "bg-[oklch(0.5_0.2_250)] text-white! hover:bg-[oklch(0.4_0.2_250)] border-none"
  } else if (variant === "success") {
    className =
      "bg-[oklch(0.627_0.194_149.214)] text-white! hover:bg-[oklch(0.527_0.194_149.214)] border-none"
  } else if (variant === "warning") {
    className =
      "bg-[oklch(0.769_0.188_70.08)] text-white! hover:bg-[oklch(0.669_0.188_70.08)] border-none"
  } else if (variant === "info") {
    className = "bg-blue-600 text-white! hover:bg-blue-700 border-none"
  } else if (variant === "danger" || variant === "destructive") {
    shadcnVariant = "destructive"
    className = "text-white!"
  } else if (["default", "outline", "secondary", "ghost", "link"].includes(variant)) {
    shadcnVariant = variant as typeof shadcnVariant
  }

  return { variant: shadcnVariant, className }
}
