"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

import { TsNumberField } from "../types"

// ─── Helper functions for number formatting ──────────────────────────────────

function evaluateMathExpression(expression: string): number | undefined {
  try {
    let expr = expression.replace(/,/g, ".")
    expr = expr.replace(/\^/g, "**")
    if (/[^0-9.+*/^() -]/.test(expr)) return undefined
    const result = new Function(`return ${expr}`)()
    if (!isFinite(result) || isNaN(result)) return undefined
    return result
  } catch {
    return undefined
  }
}

function formatNumericValue(val: number | null | undefined, roundTo?: number): string {
  if (val === null || val === undefined || isNaN(val)) return ""
  let num = val
  if (roundTo !== undefined) {
    num = Math.round(num * Math.pow(10, roundTo)) / Math.pow(10, roundTo)
  }
  return new Intl.NumberFormat(undefined, {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: roundTo !== undefined ? roundTo : 10,
  }).format(num)
}

function parseNumericValue(text: string): number | undefined {
  if (!text.trim()) return undefined
  if (/[+*/^() -]/.test(text)) {
    return evaluateMathExpression(text)
  }
  const clean = text.replace(/\s/g, "").replace(",", ".")
  const num = parseFloat(clean)
  return isNaN(num) ? undefined : num
}

export interface TsNumberWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsNumberField
  hasError?: boolean
  name: string
}

export const NumberWidget = React.forwardRef<HTMLInputElement, TsNumberWidgetProps>(
  ({ field, def, hasError = false, name, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() =>
      formatNumericValue(field.value as number | undefined, def.roundTo)
    )
    const [isFocused, setIsFocused] = React.useState(false)
    const isClearingRef = React.useRef(false)

    const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
    const readonlyClass = def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""

    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatNumericValue(field.value as number | undefined, def.roundTo))
      }
    }, [field.value, isFocused, def.roundTo])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (def.readonly) {
        e.currentTarget.blur()
        return
      }
      setIsFocused(true)
      isClearingRef.current = false
      const clean = displayValue.replace(/\s/g, "")
      setDisplayValue(clean)
      const el = e.currentTarget
      setTimeout(() => el.select(), 0)
    }

    const handleBlur = () => {
      setIsFocused(false)
      if (isClearingRef.current) {
        isClearingRef.current = false
        return
      }
      const num = parseNumericValue(displayValue)
      field.onChange(num)
      field.onBlur()
      setDisplayValue(formatNumericValue(num, def.roundTo))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      const clean = val.replace(/[^0-9 .,+*/^()-]/g, "")
      setDisplayValue(clean !== val ? clean : val)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const enterAction = def.enterAction
      const escapeAction = def.escapeAction || "clear"

      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        const num = parseNumericValue(displayValue)
        field.onChange(num)

        if (enterAction) {
          const event = new CustomEvent("form-key-action", {
            detail: { key: "Enter", action: enterAction, field: name },
            bubbles: true,
          })
          ;(e.currentTarget as HTMLElement).dispatchEvent(event)
        } else {
          e.currentTarget.blur()
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()

        if (escapeAction === "clear") {
          isClearingRef.current = true
          setDisplayValue("")
          field.onChange(undefined)
        }

        if (escapeAction) {
          const event = new CustomEvent("form-key-action", {
            detail: { key: "Escape", action: escapeAction, field: name },
            bubbles: true,
          })
          ;(e.currentTarget as HTMLElement).dispatchEvent(event)
        }

        if (!escapeAction || escapeAction === "clear") {
          e.currentTarget.blur()
        }
      }
    }

    return (
      <Input
        type="text"
        inputMode="decimal"
        placeholder={def.placeholder}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={def.disabled}
        readOnly={def.readonly}
        tabIndex={def.readonly ? -1 : undefined}
        className={cn("text-right tabular-nums", errorClass, readonlyClass)}
        {...props}
        ref={ref || field.ref}
      />
    )
  }
)
NumberWidget.displayName = "NumberWidget"
