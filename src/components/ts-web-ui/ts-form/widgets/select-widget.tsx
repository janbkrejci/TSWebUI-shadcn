"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

import { TsFieldOptions, TsSelectField } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export interface TsSelectWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsSelectField
  name: string
  error?: string
}

export const SelectWidget = React.forwardRef<HTMLButtonElement, TsSelectWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    return (
      <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={def.disabled}>
        <SelectTrigger
          id={`${safeId}-select`}
          className={cn(errorClass, readonlyClass)}
          aria-invalid={!!error}
          {...props}
          ref={ref || field.ref}
        >
          <SelectValue placeholder={def.placeholder || "Select..."} />
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
