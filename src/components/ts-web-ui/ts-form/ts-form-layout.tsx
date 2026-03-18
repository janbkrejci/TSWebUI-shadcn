"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn } from "@/lib/utils"

import { TsFormField } from "./ts-form-field"
import { TsFieldDef, TsLayout, TsRow } from "./types"
import { getNestedValue } from "./utils"

interface TsFormLayoutProps {
  layout: TsLayout
  fields: Record<string, TsFieldDef>
  activeTab?: string | number
  onTabChange?: (tab: string | number) => void
}

export function TsFormLayout({ layout, fields, activeTab, onTabChange }: TsFormLayoutProps) {
  const {
    formState: { errors },
  } = useFormContext()

  // Internal state for uncontrolled mode (when activeTab prop is not provided)
  const [internalActiveTabIndex, setInternalActiveTabIndex] = React.useState<number>(0)

  // Sync internal state when layout changes
  React.useEffect(() => {
    if (layout.tabs && layout.tabs.length > 0) {
      if (internalActiveTabIndex >= layout.tabs.length) {
        setInternalActiveTabIndex(0)
      }
    }
  }, [layout.tabs, internalActiveTabIndex])

  // Helper to check if a field has any error (from RHF state or static definition)
  const hasFieldAnyError = React.useCallback(
    (fieldKey: string) => {
      const fieldDef = fields[fieldKey]
      if (!fieldDef || fieldDef.hidden) return false
      const hasRhfError = !!getNestedValue(errors as Record<string, unknown>, fieldKey)
      return hasRhfError || !!fieldDef.error
    },
    [errors, fields]
  )

  // Pre-calculate which tabs have errors
  const tabErrors = React.useMemo(() => {
    if (!layout.tabs) return []
    return layout.tabs.map((tab) => {
      return tab.rows.some((row) => row.some((item) => item.field && hasFieldAnyError(item.field)))
    })
  }, [layout.tabs, hasFieldAnyError])

  if (layout.tabs && layout.tabs.length > 0) {
    // Determine which tab index to show (prop has priority, fallback to internal state)
    let currentIndex = internalActiveTabIndex

    if (activeTab !== undefined) {
      if (typeof activeTab === "number") {
        if (activeTab >= 0 && activeTab < layout.tabs.length) {
          currentIndex = activeTab
        }
      } else {
        const foundIndex = layout.tabs.findIndex((t) => t.label === activeTab)
        if (foundIndex !== -1) {
          currentIndex = foundIndex
        }
      }
    }

    const currentTabValue = String(currentIndex)

    const handleValueChange = (value: string) => {
      const index = parseInt(value, 10)
      const tab = layout.tabs![index]
      if (!tab) return

      // In uncontrolled mode, update internal state
      if (activeTab === undefined) {
        setInternalActiveTabIndex(index)
      }

      // Always notify parent of the change
      if (onTabChange) {
        if (typeof activeTab === "number") {
          onTabChange(index)
        } else {
          onTabChange(tab.label)
        }
      }
    }

    return (
      <Tabs value={currentTabValue} onValueChange={handleValueChange} className="w-full">
        <TabsList className="bg-muted/50 w-full justify-start overflow-x-auto scrollbar-hidden">
          {layout.tabs.map((tab, index) => {
            const hasError = tabErrors[index]

            return (
              <TabsTrigger
                key={index}
                value={String(index)}
                aria-invalid={hasError ? "true" : undefined}
                className={cn(
                  "relative flex-none px-4 py-2 transition-colors",
                  hasError &&
                    "data-[state=active]:bg-destructive/15 data-[state=active]:text-destructive data-[state=active]:border-destructive/30"
                )}
              >
                {tab.label}
                {hasError && (
                  <span
                    className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {layout.tabs.map((tab, index) => (
          <TabsContent key={index} value={String(index)} className="space-y-4 pt-4">
            {renderRows(tab.rows, fields)}
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  if (layout.rows) {
    return <div className="space-y-4">{renderRows(layout.rows, fields)}</div>
  }

  return null
}

function renderRows(rows: TsRow[], fields: Record<string, TsFieldDef>) {
  const alignmentClasses = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  }

  return rows.map((row, rowIndex) => {
    // Filter out hidden fields before calculating columns and rendering
    const visibleItems = row.filter((item) => {
      if (!item.field) return true // empty or separator
      const fieldDef = fields[item.field]
      return !fieldDef?.hidden
    })

    if (visibleItems.length === 0) return null

    // Calculate grid template columns based on widths of visible items
    const gridTemplateColumns = visibleItems.map((item) => item.width || "1fr").join(" ")

    return (
      <div
        key={rowIndex}
        className="grid gap-4 items-start [grid-template-columns:var(--grid-cols)]"
        style={{ "--grid-cols": gridTemplateColumns } as React.CSSProperties}
      >
        {visibleItems.map((item, colIndex) => {
          const alignmentClass = item.align ? alignmentClasses[item.align] : ""

          if (item.type === "empty") {
            return <div key={colIndex} />
          }

          if (item.type === "separator") {
            return (
              <div
                key={colIndex}
                className={cn("min-w-0 py-2", item.align && "flex flex-col", alignmentClass)}
              >
                <div className="w-full">
                  {item.label && (
                    <h4
                      className={cn(
                        "text-sm font-medium text-muted-foreground mb-2",
                        item.align && alignmentClass.split(" ").pop()
                      )}
                    >
                      {item.label}
                    </h4>
                  )}
                  <Separator />
                </div>
              </div>
            )
          }

          const fieldDef = fields[item.field]
          if (!fieldDef) {
            return (
              <div key={colIndex} className="text-destructive text-sm">
                Field &apos;{item.field}&apos; not found
              </div>
            )
          }

          return (
            <div
              key={item.field}
              className={cn("min-w-0", item.align && "flex w-full", alignmentClass)}
            >
              <div className={cn(item.align ? "w-fit" : "w-full")}>
                <TsFormField name={item.field} fieldDef={fieldDef} />
              </div>
            </div>
          )
        })}
      </div>
    )
  })
}
