"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormLabel } from "@/components/ui/form"

import { cn } from "@/lib/utils"

import { TsCheckboxField } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export interface TsCheckboxWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsCheckboxField
  name: string
  error?: string
}

export const CheckboxWidget = React.forwardRef<HTMLButtonElement, TsCheckboxWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const { readonlyPointerClass } = getFieldClasses(error, def.readonly)
    const safeId = sanitizeId(name)
    const hasError = !!error

    return (
      <div className={cn("flex items-center space-x-2", readonlyPointerClass)}>
        <Checkbox
          id={`${safeId}-checkbox`}
          checked={!!field.value}
          onCheckedChange={field.onChange}
          disabled={def.disabled}
          aria-invalid={hasError}
          {...props}
          ref={ref || field.ref}
        />
        <FormLabel
          htmlFor={`${safeId}-checkbox`}
          className={cn("font-normal cursor-pointer", hasError && "text-destructive")}
        >
          {def.label}
          {def.required && " *"}
        </FormLabel>
      </div>
    )
  }
)
CheckboxWidget.displayName = "CheckboxWidget"
