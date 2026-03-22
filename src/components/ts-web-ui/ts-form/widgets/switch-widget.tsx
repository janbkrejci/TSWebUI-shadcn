"use client"

import * as React from "react"

import { FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

import { cn } from "@/lib/utils"

import { TsSwitchField, TsWidgetProps } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export type TsSwitchWidgetProps = TsWidgetProps<TsSwitchField>

export const SwitchWidget = React.forwardRef<HTMLButtonElement, TsSwitchWidgetProps>(
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
    const { errorClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

    return (
      <div className={cn("flex items-center space-x-2 min-h-9", readOnly && "pointer-events-none")}>
        <Switch
          id={`${safeId}-switch`}
          checked={!!field.value}
          onCheckedChange={(checked) => {
            if (!readOnly) field.onChange(checked)
          }}
          disabled={def.disabled}
          autoFocus={autoFocus}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={!!error}
          aria-label={ariaLabel || def.label}
          aria-required={ariaRequired}
          aria-readonly={readOnly}
          className={cn(errorClass, readonlyPointerClass, readOnly && "opacity-100")}
          {...props}
          ref={ref || field.ref}
        />
        <FormLabel
          htmlFor={`${safeId}-switch`}
          className={cn(
            "font-normal cursor-pointer",
            !!error && "text-destructive",
            readOnly && "cursor-default opacity-100"
          )}
        >
          {def.label}
          {def.required && " *"}
        </FormLabel>
      </div>
    )
  }
)
SwitchWidget.displayName = "SwitchWidget"
