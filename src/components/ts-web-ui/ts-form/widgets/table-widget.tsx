"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"

import { TsTable } from "../../ts-table"
import { TsTableField } from "../types"
import { getFieldClasses } from "../utils"

export interface TsTableWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsTableField
  name: string
  error?: string
}

export const TableWidget = React.forwardRef<HTMLDivElement, TsTableWidgetProps>(
  ({ field, def, error, ...props }, ref) => {
    const { errorClass } = getFieldClasses(error, def.readonly)
    const hasError = !!error

    return (
      <div
        className={cn("border rounded-md p-2", errorClass)}
        {...props}
        ref={ref}
        aria-invalid={hasError}
      >
        <TsTable
          data={(field.value as Record<string, unknown>[]) || []}
          columnDefinitions={def.columns || []}
          showCreateButton={def.showCreateButton}
        />
      </div>
    )
  }
)
TableWidget.displayName = "TableWidget"
