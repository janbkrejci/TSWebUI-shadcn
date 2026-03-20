"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { FormLabel } from "@/components/ui/form"

import { cn } from "@/lib/utils"

import { TsCheckboxField, TsWidgetProps } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export type TsCheckboxWidgetProps = TsWidgetProps<TsCheckboxField>

export const CheckboxWidget = React.forwardRef<HTMLButtonElement, TsCheckboxWidgetProps>(
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
        <Checkbox
          id={`${safeId}-checkbox`}
          checked={!!field.value}
          onCheckedChange={field.onChange}
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
          htmlFor={`${safeId}-checkbox`}
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
CheckboxWidget.displayName = "CheckboxWidget"
