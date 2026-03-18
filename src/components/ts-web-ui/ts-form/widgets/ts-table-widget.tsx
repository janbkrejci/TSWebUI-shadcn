import * as React from "react"

import { cn } from "@/lib/utils"

import { TsTable } from "../../ts-table"
import { TsTableField, TsWidgetProps } from "../types"
import { dispatchFormAction, getFieldClasses } from "../utils"

export type TsTableWidgetProps = TsWidgetProps<TsTableField>

export const TableWidget = React.forwardRef<HTMLDivElement, TsTableWidgetProps>(
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
    const { errorClass } = getFieldClasses(error, readOnly)
    const hasError = !!error

    const dispatchAction = (action: string, data?: unknown) => {
      dispatchFormAction(ref, name, action, data, "form-table-action")
    }

    // Performance: Only update if the data actually changed
    const handleDataChange = React.useCallback(
      (newData: Record<string, unknown>[]) => {
        if (readOnly) return
        // We still need to compare, but at least we're doing it in a callback
        // For large tables, we might want to consider a more efficient check
        if (JSON.stringify(field.value) !== JSON.stringify(newData)) {
          field.onChange(newData)
        }
      },
      [readOnly, field]
    )

    return (
      <div
        className={cn("border rounded-md p-2", errorClass)}
        aria-label={ariaLabel || def.label || name}
        aria-required={ariaRequired}
        aria-readonly={readOnly}
        tabIndex={autoFocus ? 0 : undefined}
        {...props}
        ref={ref}
        aria-invalid={hasError}
      >
        <TsTable
          data={(field.value as Record<string, unknown>[]) || []}
          columnDefinitions={def.columns || []}
          showCreateButton={def.showCreateButton && !readOnly}
          onCreateClick={() => dispatchAction(`table:create:${name}`)}
          onDataChange={handleDataChange}
          onAction={(action, row) => dispatchAction(action, row)}
        />
      </div>
    )
  }
)
TableWidget.displayName = "TableWidget"
