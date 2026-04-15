"use client"

import { Search, X as XIcon } from "lucide-react"

import * as React from "react"
import { useTsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ts-web-ui/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsTable } from "../../ts-table"
import { TsRelationshipField, TsWidgetProps } from "../types"
import { dispatchFormAction, getFieldClasses, sanitizeId } from "../utils"

// ─── RelationshipWidget ───────────────────────────────────────────────────────

export type TsRelationshipWidgetProps = TsWidgetProps<TsRelationshipField>

export const RelationshipWidget = React.forwardRef<HTMLDivElement, TsRelationshipWidgetProps>(
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
    const tf = useTsLocale().strings.form
    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

    const [pickerOpen, setPickerOpen] = React.useState(false)
    const mode = def.mode || "single"
    const variant = def.variant || "dialog"
    const targetEntity = def.targetEntity || ""

    const displayFields = React.useMemo(() => def.displayFields || ["name"], [def.displayFields])
    const chipDisplayFields = React.useMemo(
      () => def.chipDisplayFields || displayFields,
      [def.chipDisplayFields, displayFields]
    )

    const valueField = def.valueField || "id"
    const availableItems = React.useMemo(() => def.options || [], [def.options])

    const selectedValues = React.useMemo(() => {
      if (!field.value) return []
      return Array.isArray(field.value) ? (field.value as unknown[]) : [field.value]
    }, [field.value])

    const tableColumns = React.useMemo(() => {
      if (def.columns && def.columns.length > 0) return def.columns
      return displayFields.map((f) => ({
        key: f,
        title: f.charAt(0).toUpperCase() + f.slice(1),
        sortable: true,
        filterable: true,
      }))
    }, [def.columns, displayFields])

    const getDisplayText = (item: unknown, fields: string[]) => {
      if (!item) return ""
      if (typeof item !== "object") {
        const found = availableItems.find((i) => i[valueField] === item)
        if (found) {
          return fields
            .map((f) => String(found[f]))
            .filter(Boolean)
            .join(" ")
        }
        return String(item)
      }
      const obj = item as Record<string, unknown>
      return fields
        .map((f) => String(obj[f]))
        .filter(Boolean)
        .join(" ")
    }

    const toggleItem = (item: Record<string, unknown>) => {
      if (readOnly) return
      const itemValue = item[valueField]

      if (mode === "single") {
        field.onChange(itemValue)
        setPickerOpen(false)
      } else {
        const isSelected = selectedValues.includes(itemValue)
        if (isSelected) {
          field.onChange(selectedValues.filter((v) => v !== itemValue))
        } else {
          field.onChange([...selectedValues, itemValue])
        }
      }
    }

    const removeItem = (itemValue: unknown) => {
      if (readOnly) return
      if (mode === "single") {
        field.onChange(null)
      } else {
        field.onChange(selectedValues.filter((v) => v !== itemValue))
      }
    }

    const dispatchAction = (action: string, data?: unknown) => {
      dispatchFormAction(ref, name, action, data, "form-field-action")
    }

    const initialRowSelection = React.useMemo(() => {
      const selection: Record<string, boolean> = {}
      selectedValues.forEach((val) => {
        selection[String(val)] = true
      })
      return selection
    }, [selectedValues])

    const renderTrigger = () => (
      <div
        role="combobox"
        aria-expanded={pickerOpen}
        aria-haspopup={variant === "dropdown" ? "listbox" : "dialog"}
        aria-controls={`popover-content-${safeId}`}
        aria-label={ariaLabel || def.label}
        aria-required={ariaRequired}
        aria-readonly={readOnly}
        tabIndex={def.disabled || readOnly ? -1 : 0}
        autoFocus={autoFocus}
        {...props}
        ref={ref}
        onClick={() => {
          if (!def.disabled && !readOnly) setPickerOpen(true)
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !def.disabled && !readOnly) {
            e.preventDefault()
            setPickerOpen(true)
          }
        }}
        className={cn(
          "flex h-9 flex-1 items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-sm shadow-xs cursor-pointer",
          "dark:bg-input/30 transition-[color,box-shadow]",
          errorClass,
          readonlyClass,
          readonlyPointerClass,
          !readOnly &&
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          def.disabled && "opacity-50 pointer-events-none",
          readOnly && "opacity-100"
        )}
      >
        <div className="flex flex-1 items-center gap-1 overflow-hidden min-w-0 flex-nowrap">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground truncate">
              {def.placeholder || tf.selectEntity(targetEntity)}
            </span>
          ) : (
            <>
              {selectedValues.slice(0, 3).map((val) => (
                <Badge
                  key={String(val)}
                  variant="secondary"
                  className="shrink-0 gap-1 text-xs h-6 max-w-30"
                >
                  <span className="truncate">{getDisplayText(val, chipDisplayFields)}</span>
                  {!readOnly && !def.disabled && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="inline-flex cursor-pointer shrink-0 items-center hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(val)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          e.stopPropagation()
                          removeItem(val)
                        }
                      }}
                    >
                      <XIcon className="h-2.5 w-2.5" />
                    </span>
                  )}
                </Badge>
              ))}
              {selectedValues.length > 3 && (
                <Badge variant="outline" className="shrink-0 text-xs h-6 whitespace-nowrap">
                  +{selectedValues.length - 3}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {selectedValues.length > 0 && !readOnly && !def.disabled && (
            <XIcon
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                field.onChange(mode === "single" ? null : [])
              }}
            />
          )}
          <Search className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
      </div>
    )

    const renderTable = () => (
      <TsTable
        data={availableItems}
        columnDefinitions={tableColumns}
        enableSelection={mode === "multiple"}
        getRowId={(row) => String(row[valueField])}
        initialRowSelection={initialRowSelection}
        onRowClick={(row) => {
          if (mode === "single") {
            toggleItem(row as Record<string, unknown>)
          }
        }}
        onSelectionChange={(selectedRows) => {
          if (mode === "multiple") {
            const newValues = selectedRows.map((r) => (r as Record<string, unknown>)[valueField])
            // Only update if something actually changed to avoid cycles
            if (JSON.stringify(field.value) !== JSON.stringify(newValues)) {
              field.onChange(newValues)
            }
          }
        }}
        onAction={(action, row) => dispatchAction(action, row)}
        onCreateClick={() => dispatchAction(`picker:create:${targetEntity}`)}
      />
    )

    if (variant === "dropdown") {
      return (
        <div className="flex flex-col gap-2">
          <Popover
            open={pickerOpen}
            onOpenChange={(open) => {
              if (readOnly || def.disabled) return
              setPickerOpen(open)
            }}
          >
            <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
            <PopoverContent
              id={`popover-content-${safeId}`}
              className="w-[90vw] max-w-[800px] p-4"
              align="start"
            >
              <div className="max-h-[400px] overflow-auto">{renderTable()}</div>
              {mode === "multiple" && (
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button size="sm" onClick={() => setPickerOpen(false)}>
                    {tf.done}
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-2">
        <Dialog
          open={pickerOpen}
          onOpenChange={readOnly || def.disabled ? undefined : setPickerOpen}
        >
          <div className="flex gap-2 w-full">
            <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
          </div>
          <DialogContent
            id={`popover-content-${safeId}`}
            className="max-w-[98vw] w-[98vw] max-h-[95vh] flex flex-col p-0"
          >
            <DialogHeader className="px-6 py-4 border-b text-left">
              <DialogTitle>{tf.selectEntity(targetEntity)}</DialogTitle>
              <DialogDescription className="sr-only">{tf.chooseFromList}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-6 pt-2">{renderTable()}</div>
            {mode === "multiple" && (
              <div className="p-4 border-t flex justify-end">
                <Button onClick={() => setPickerOpen(false)}>{tf.done}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }
)
RelationshipWidget.displayName = "RelationshipWidget"
