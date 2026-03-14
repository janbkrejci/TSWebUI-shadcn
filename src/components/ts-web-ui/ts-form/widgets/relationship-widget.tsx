"use client"

import { Check, ChevronsUpDown, X as XIcon } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsRelationshipField } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

// ─── RelationshipWidget ───────────────────────────────────────────────────────

export interface TsRelationshipWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsRelationshipField
  name: string
  error?: string
}

export const RelationshipWidget = React.forwardRef<HTMLDivElement, TsRelationshipWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const { readonlyClass } = getFieldClasses(error, def.readonly)
    const hasError = !!error

    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    const safeId = sanitizeId(name)

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

    const filteredItems = React.useMemo(() => {
      if (!searchValue) return availableItems
      const lower = searchValue.toLowerCase()
      return availableItems.filter((item) => {
        const text = displayFields
          .map((f: string) => String(item[f]))
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return text.includes(lower)
      })
    }, [availableItems, searchValue, displayFields])

    const toggleItem = (item: Record<string, unknown>) => {
      const itemValue = item[valueField]

      if (mode === "single") {
        field.onChange(itemValue)
        setOpen(false)
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

    const isSelected = (item: Record<string, unknown>) => selectedValues.includes(item[valueField])

    return (
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverAnchor asChild>
          <div
            role="combobox"
            aria-expanded={open}
            aria-invalid={hasError}
            aria-controls={`popover-content-${safeId}`}
            tabIndex={def.disabled || def.readonly ? -1 : 0}
            {...props}
            ref={ref}
            onClick={() => {
              if (!def.disabled && !def.readonly) setOpen((v) => !v)
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !def.disabled && !def.readonly) {
                e.preventDefault()
                setOpen((v) => !v)
              }
            }}
            className={cn(
              "flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-sm shadow-xs cursor-pointer",
              "dark:bg-input/30 transition-[color,box-shadow]",
              !readonlyClass &&
                "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              def.disabled && "opacity-50 pointer-events-none",
              readonlyClass && "pointer-events-none"
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
                    setOpen(false)
                  }}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50" />
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          id={`popover-content-${safeId}`}
          className="w-auto min-w-75 p-0"
          align="start"
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLElement).querySelector("input")?.focus()
          }}
          onEscapeKeyDown={(e) => {
            if (searchValue) {
              e.preventDefault()
              setSearchValue("")
            }
          }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${targetEntity}...`}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-60">
              <CommandEmpty className="py-1.5 px-2 text-left">
                <span className="italic text-muted-foreground text-sm">
                  {availableItems.length === 0 ? `No items in ${targetEntity}` : "Not found."}
                </span>
              </CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={String(item[valueField])}
                    value={String(item[valueField])}
                    onSelect={() => toggleItem(item)}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", isSelected(item) ? "opacity-100" : "opacity-0")}
                    />
                    {getDisplayText(item, displayFields)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
RelationshipWidget.displayName = "RelationshipWidget"
