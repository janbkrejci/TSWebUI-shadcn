import React from "react"

/**
 * Default values for widgets to avoid magic numbers.
 */
export const DEFAULT_TEXTAREA_ROWS = 3

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
    const tokens = expression.match(/[0-9.]+|[+\-*/()]/g) || []
    if (tokens.length === 0) return undefined

    const ops = {
      "+": (a: number, b: number) => a + b,
      "-": (a: number, b: number) => a - b,
      "*": (a: number, b: number) => a * b,
      "/": (a: number, b: number) => a / b,
    }

    const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 }
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

      // Handle unary minus: if '-' is the first token or follows an opening parenthesis
      if (token === "-" && (i === 0 || tokens[i - 1] === "(")) {
        values.push(0) // Treat -X as 0 - X
        operators.push("-")
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

    const result = values[0]
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
  locale: string = "cs-CZ"
): string {
  if (val === undefined || val === null) return ""

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: roundTo !== undefined ? roundTo : 0,
    maximumFractionDigits: roundTo !== undefined ? roundTo : 2,
  }

  return new Intl.NumberFormat(locale, options).format(val)
}
