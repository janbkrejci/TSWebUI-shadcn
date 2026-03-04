"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

import { cn } from "@/lib/utils"

import { TsSwitchField } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export interface TsSwitchWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsSwitchField
  name: string
  error?: string
}

export const SwitchWidget = React.forwardRef<HTMLButtonElement, TsSwitchWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const { errorClass } = getFieldClasses(error, def.readonly)

    return (
      <div className={cn("flex items-center space-x-2 min-h-10")}>
        <Switch
          id={`${safeId}-switch`}
          checked={!!field.value}
          onCheckedChange={field.onChange}
          disabled={def.disabled}
          aria-invalid={!!error}
          className={errorClass}
          {...props}
          ref={ref || field.ref}
        />
        <FormLabel
          htmlFor={`${safeId}-switch`}
          className={cn("font-normal cursor-pointer", !!error && "text-destructive")}
        >
          {def.required ? `${def.label} *` : def.label}
        </FormLabel>
      </div>
    )
  }
)
SwitchWidget.displayName = "SwitchWidget"
