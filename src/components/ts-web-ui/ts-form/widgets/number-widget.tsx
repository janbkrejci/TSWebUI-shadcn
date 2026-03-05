"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

import { TsNumberField } from "../types"
import {
  formatNumericValue,
  getFieldClasses,
  handleFieldKeyDown,
  parseNumericValue,
  sanitizeId,
} from "../utils"

export interface TsNumberWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsNumberField
  error?: string
  name: string
}

export const NumberWidget = React.forwardRef<HTMLInputElement, TsNumberWidgetProps>(
  ({ field, def, error, name, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const [displayValue, setDisplayValue] = React.useState<string>(() =>
      formatNumericValue(field.value as number | undefined, def.roundTo, def.locale)
    )
    const [isFocused, setIsFocused] = React.useState(false)
    const isClearingRef = React.useRef(false)

    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(
          formatNumericValue(field.value as number | undefined, def.roundTo, def.locale)
        )
      }
    }, [field.value, isFocused, def.roundTo, def.locale])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      isClearingRef.current = false

      // Store current selection range to prevent jumping
      const selectionStart = e.currentTarget.selectionStart
      const selectionEnd = e.currentTarget.selectionEnd

      const clean = displayValue.replace(/\s/g, "")
      setDisplayValue(clean)

      // Restore selection if applicable
      if (selectionStart !== null && selectionEnd !== null && !def.selectAllOnFocus) {
        // Calculate new position after spaces removal
        const spacesBefore = (displayValue.substring(0, selectionStart).match(/\s/g) || []).length
        const newStart = selectionStart - spacesBefore
        const newEnd = selectionEnd - spacesBefore

        setTimeout(() => {
          e.target.setSelectionRange(newStart, newEnd)
        }, 0)
      } else if (def.selectAllOnFocus && !def.readonly) {
        e.currentTarget.select()
      }
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
      setDisplayValue(formatNumericValue(num, def.roundTo, def.locale))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      // Support numbers and basic math operators matching evaluator
      const clean = val.replace(/[^0-9 .,+*/^()-]/g, "")
      const finalVal = clean !== val ? clean : val
      setDisplayValue(finalVal)

      // Emit change if the current input is a valid numeric value or expression
      const num = parseNumericValue(finalVal)
      if (num !== undefined) {
        field.onChange(num)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // For Enter, we MUST sync the parsed value BEFORE handleFieldKeyDown
      // triggers a submit action (which uses form values from react-hook-form).
      if (e.key === "Enter") {
        const num = parseNumericValue(displayValue)
        field.onChange(num)
        setDisplayValue(formatNumericValue(num, def.roundTo, def.locale))

        // Let the event bubble up to TsForm for action handling
        handleFieldKeyDown(
          e,
          name,
          def.enterAction,
          def.escapeAction,
          () => {
            isClearingRef.current = true
            setDisplayValue("")
            field.onChange(undefined)
          },
          num // Pass committed value
        )
        return
      }

      handleFieldKeyDown(e, name, def.enterAction, def.escapeAction, () => {
        isClearingRef.current = true
        setDisplayValue("")
        field.onChange(undefined)
      })
    }

    return (
      <Input
        id={safeId}
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
        aria-invalid={!!error}
        aria-valuemin={def.min}
        aria-valuemax={def.max}
        min={def.min}
        max={def.max}
        className={cn("text-right tabular-nums", errorClass, readonlyClass)}
        {...props}
        ref={ref || field.ref}
      />
    )
  }
)
NumberWidget.displayName = "NumberWidget"
