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
  hasError?: boolean
}

export const SwitchWidget = React.forwardRef<HTMLButtonElement, TsSwitchWidgetProps>(
  ({ field, def, name, hasError = false, ...props }, ref) => {
    const { readonlyPointerClass } = getFieldClasses(hasError, def.readonly)
    const safeId = sanitizeId(name)

    return (
      <div className={cn("flex items-center space-x-2", readonlyPointerClass)}>
        <Switch
          id={`${safeId}-switch`}
          checked={!!field.value}
          onCheckedChange={field.onChange}
          disabled={def.disabled}
          className={cn(
            hasError &&
              "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-destructive/30"
          )}
          {...props}
          ref={ref || field.ref}
        />
        <FormLabel
          htmlFor={`${safeId}-switch`}
          className={cn("font-normal cursor-pointer", hasError && "text-destructive")}
        >
          {def.required ? `${def.label} *` : def.label}
        </FormLabel>
      </div>
    )
  }
)
SwitchWidget.displayName = "SwitchWidget"
