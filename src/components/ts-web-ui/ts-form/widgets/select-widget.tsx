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
import { getFieldClasses } from "../utils"

export interface TsSelectWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsSelectField
  name: string
  hasError?: boolean
}

export const SelectWidget = React.forwardRef<HTMLButtonElement, TsSelectWidgetProps>(
  ({ field, def, hasError = false, ...props }, ref) => {
    const { errorClass } = getFieldClasses(hasError, def.readonly)

    return (
      <Select onValueChange={field.onChange} value={field.value} disabled={def.disabled}>
        <SelectTrigger
          className={cn(errorClass, def.readonly ? "pointer-events-none" : "")}
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
