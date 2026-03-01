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
} from "../utils"

export interface TsNumberWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsNumberField
  error?: string
  name: string
}

export const NumberWidget = React.forwardRef<HTMLInputElement, TsNumberWidgetProps>(
  ({ field, def, error, name, ...props }, ref) => {
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
      if (def.readonly) {
        e.currentTarget.blur()
        return
      }
      setIsFocused(true)
      isClearingRef.current = false
      const clean = displayValue.replace(/\s/g, "")
      setDisplayValue(clean)
      if (def.selectAllOnFocus) {
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
      const clean = val.replace(/[^0-9 .,+*/^()-]/g, "")
      setDisplayValue(clean !== val ? clean : val)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // For Enter, we MUST sync the parsed value BEFORE handleFieldKeyDown
      // triggers a submit action (which uses form values from react-hook-form).
      // We use a microtask to ensure RHF has processed the change before the custom event bubbles up.
      if (e.key === "Enter") {
        const num = parseNumericValue(displayValue)
        field.onChange(num)

        if (def.enterAction) {
          e.preventDefault()
          e.stopPropagation()
          // Small delay ensures react-hook-form state is updated before the action handler runs
          setTimeout(() => {
            handleFieldKeyDown(e, name, def.enterAction, def.escapeAction, () => {
              isClearingRef.current = true
              setDisplayValue("")
              field.onChange(undefined)
            })
          }, 0)
          return
        }
      }

      handleFieldKeyDown(e, name, def.enterAction, def.escapeAction, () => {
        isClearingRef.current = true
        setDisplayValue("")
        field.onChange(undefined)
      })
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
        aria-invalid={!!error}
        className={cn("text-right tabular-nums", errorClass, readonlyClass)}
        {...props}
        ref={ref || field.ref}
      />
    )
  }
)
NumberWidget.displayName = "NumberWidget"
