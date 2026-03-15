"use client"

import { Search, X as XIcon } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"

import { TsTable } from "../../ts-table"
import { TsRelationshipField } from "../types"
import { getFieldClasses } from "../utils"

// ─── RelationshipWidget ───────────────────────────────────────────────────────

export interface TsRelationshipWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsRelationshipField
  name: string
  error?: string
  hint?: string
}

export const RelationshipWidget = React.forwardRef<HTMLDivElement, TsRelationshipWidgetProps>(
  ({ field, def, name, error, hint, ...props }, ref) => {
    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    const [pickerOpen, setPickerOpen] = React.useState(false)
    const mode = def.mode || "single"
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
      return displayFields.map((f) => ({
        key: f,
        title: f.charAt(0).toUpperCase() + f.slice(1),
        sortable: true,
        filterable: true,
      }))
    }, [displayFields])

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
      if (mode === "single") {
        field.onChange(null)
      } else {
        field.onChange(selectedValues.filter((v) => v !== itemValue))
      }
    }

    const dispatchAction = (action: string, data?: unknown) => {
      const el =
        (ref && typeof ref === "object" && "current" in ref ? ref.current : null) ||
        document.activeElement
      if (el) {
        el.dispatchEvent(
          new CustomEvent("form-field-action", {
            detail: { field: name, action, data },
            bubbles: true,
          })
        )
      }
    }

    const initialRowSelection = React.useMemo(() => {
      const selection: Record<string, boolean> = {}
      selectedValues.forEach((val) => {
        selection[String(val)] = true
      })
      return selection
    }, [selectedValues])

    return (
      <div className="flex flex-col gap-2">
        <Dialog
          open={pickerOpen}
          onOpenChange={def.readonly || def.disabled ? undefined : setPickerOpen}
        >
          <div className="flex gap-2 w-full">
            <DialogTrigger asChild>
              <div
                role="button"
                tabIndex={def.disabled || def.readonly ? -1 : 0}
                {...props}
                ref={ref}
                onClick={() => {
                  if (!def.disabled && !def.readonly) setPickerOpen(true)
                }}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !def.disabled && !def.readonly) {
                    e.preventDefault()
                    setPickerOpen(true)
                  }
                }}
                className={cn(
                  "flex h-9 flex-1 items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-sm shadow-xs cursor-pointer",
                  "dark:bg-input/30 transition-[color,box-shadow]",
                  errorClass,
                  !readonlyClass &&
                    "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  def.disabled && "opacity-50 pointer-events-none",
                  readonlyClass && "opacity-100 cursor-default"
                )}
              >
                <div className="flex flex-1 items-center gap-1 overflow-hidden min-w-0 flex-nowrap">
                  {selectedValues.length === 0 ? (
                    <span className="text-muted-foreground truncate">
                      {def.placeholder || `Select ${targetEntity}...`}
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
                          {!def.readonly && !def.disabled && (
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
                  {selectedValues.length > 0 && !def.readonly && !def.disabled && (
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
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] flex flex-col p-0">
            <DialogHeader className="px-6 py-4 border-b text-left">
              <DialogTitle>Select {targetEntity}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-6 pt-2">
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
                    const newValues = selectedRows.map(
                      (r) => (r as Record<string, unknown>)[valueField]
                    )
                    // Only update if something actually changed to avoid cycles
                    if (JSON.stringify(field.value) !== JSON.stringify(newValues)) {
                      field.onChange(newValues)
                    }
                  }
                }}
                onAction={(action, row) => dispatchAction(action, row)}
                onCreateClick={() => dispatchAction(`picker:create:${targetEntity}`)}
              />
            </div>
            {mode === "multiple" && (
              <div className="p-4 border-t flex justify-end">
                <Button onClick={() => setPickerOpen(false)}>Done</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Unified message area: Error replaces Hint */}
        {(!!error || hint) && (
          <div className="min-h-5 space-y-1">
            {error ? (
              <p className="text-xs text-destructive font-medium leading-tight">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground leading-tight">{hint}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)
RelationshipWidget.displayName = "RelationshipWidget"
