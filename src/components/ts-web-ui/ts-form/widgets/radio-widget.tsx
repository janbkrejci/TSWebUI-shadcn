"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { cn } from "@/lib/utils"

import { TsFieldOptions, TsRadioField } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export interface TsRadioWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsRadioField
  name: string
  error?: string
}

export const RadioWidget = React.forwardRef<HTMLDivElement, TsRadioWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const { readonlyPointerClass } = getFieldClasses(error, def.readonly)
    const safeId = sanitizeId(name)
    const hasError = !!error

    return (
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        disabled={def.disabled}
        className={cn("flex flex-col gap-2", readonlyPointerClass)}
        {...props}
        ref={ref}
      >
        {(def.options || []).map((opt: TsFieldOptions | string) => {
          const value = typeof opt === "string" ? opt : String(opt.value)
          const label = typeof opt === "string" ? opt : opt.label
          const itemId = `${safeId}-${value}`
          return (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={itemId} aria-invalid={hasError} />
              <FormLabel
                htmlFor={itemId}
                className={cn("font-normal cursor-pointer", hasError && "text-destructive")}
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
