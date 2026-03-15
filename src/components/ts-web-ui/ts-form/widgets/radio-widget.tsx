"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils"

import { TsFieldOptions, TsRadioField } from "../types"
import { sanitizeId } from "../utils"

export interface TsRadioWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsRadioField
  name: string
  error?: string
  hint?: string
}

export const RadioWidget = React.forwardRef<HTMLDivElement, TsRadioWidgetProps>(
  ({ field, def, name, error, hint: _hint, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const hasError = !!error

    return (
      <RadioGroup
        onValueChange={field.onChange}
        value={field.value}
        disabled={def.disabled}
        aria-invalid={hasError}
        className={cn("flex flex-col gap-2", def.readonly && "opacity-100 pointer-events-none")}
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
                className={cn(def.readonly && "opacity-100")}
              />
              <FormLabel
                htmlFor={itemId}
                className={cn(
                  "font-normal cursor-pointer",
                  hasError && "text-destructive",
                  def.readonly && "cursor-default opacity-100"
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
