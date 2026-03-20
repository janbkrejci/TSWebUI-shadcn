"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

import { TsFieldOptions, TsSelectField, TsWidgetProps } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export type TsSelectWidgetProps = TsWidgetProps<TsSelectField>

export const SelectWidget = React.forwardRef<HTMLButtonElement, TsSelectWidgetProps>(
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
    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)
    return (
      <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={def.disabled}>
        <SelectTrigger
          id={`${safeId}-select`}
          className={cn(
            errorClass,
            readonlyClass,
            readonlyPointerClass,
            readOnly && "opacity-100 pointer-events-none"
          )}
          aria-invalid={!!error}
          aria-readonly={readOnly}
          aria-label={ariaLabel}
          aria-required={ariaRequired}
          tabIndex={readOnly ? -1 : undefined}
          autoFocus={autoFocus}
          {...props}
          ref={ref || field.ref}
        >
          <SelectValue placeholder={def.placeholder || "Select category"} />
        </SelectTrigger>
        <SelectContent>
          {(def.options || []).map((opt: TsFieldOptions | string) => {
            const value = typeof opt === "string" ? opt : String(opt.value)
            const label = typeof opt === "string" ? opt : opt.label
            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    )
  }
)
SelectWidget.displayName = "SelectWidget"
