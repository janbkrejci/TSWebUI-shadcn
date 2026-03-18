"use client"

import * as React from "react"

import { FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils"

import { TsFieldOptions, TsRadioField, TsWidgetProps } from "../types"
import { sanitizeId } from "../utils"

export type TsRadioWidgetProps = TsWidgetProps<TsRadioField>

export const RadioWidget = React.forwardRef<HTMLDivElement, TsRadioWidgetProps>(
  (
    {
      field,
      def,
      name,
      error,
      hint: _hint,
      readOnly,
      autoFocus,
      "aria-label": ariaLabel,
      "aria-required": ariaRequired,
      ...props
    },
    ref
  ) => {
    const safeId = sanitizeId(name)
    const hasError = !!error

    return (
      <RadioGroup
        onValueChange={field.onChange}
        value={field.value}
        disabled={def.disabled}
        aria-invalid={hasError}
        aria-label={ariaLabel || def.label}
        aria-required={ariaRequired}
        aria-readonly={readOnly}
        className={cn("flex flex-col gap-2", readOnly && "opacity-100 pointer-events-none")}
        {...props}
        ref={ref}
      >
        {(def.options || []).map((opt: TsFieldOptions | string) => {
          const value = typeof opt === "string" ? opt : String(opt.value)
          const label = typeof opt === "string" ? opt : opt.label
          const itemId = `${safeId}-${value}`
          return (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={value}
                id={itemId}
                aria-invalid={hasError}
                className={cn(readOnly && "opacity-100")}
                autoFocus={autoFocus && value === field.value}
              />
              <FormLabel
                htmlFor={itemId}
                className={cn(
                  "font-normal cursor-pointer",
                  hasError && "text-destructive",
                  readOnly && "cursor-default opacity-100"
                )}
              >
                {label}
              </FormLabel>
            </div>
          )
        })}
      </RadioGroup>
    )
  }
)
RadioWidget.displayName = "RadioWidget"
