"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"

import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { TsFormField } from "./ts-form-field"
import { TsFieldDef, TsLayout, TsRow } from "./types"

interface TsFormLayoutProps {
  layout: TsLayout
  fields: Record<string, TsFieldDef>
}

export function TsFormLayout({ layout, fields }: TsFormLayoutProps) {
  const {
    formState: { errors },
  } = useFormContext()

  if (layout.tabs && layout.tabs.length > 0) {
    return (
      <Tabs defaultValue={layout.tabs[0].label} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hidden">
          {layout.tabs.map((tab, index) => {
            // Check if any field in this tab has an error (from state or definition)
            const hasError = tab.rows.some((row) =>
              row.some((item) => {
                if (!item.field) return false
                const fieldDef = fields[item.field]
                return errors[item.field] || (fieldDef && fieldDef.error)
              })
            )

            return (
              <TabsTrigger key={index} value={tab.label} className="relative">
                {tab.label}
                {hasError && (
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive" />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {layout.tabs.map((tab, index) => (
          <TabsContent key={index} value={tab.label} className="space-y-4 pt-4">
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
      <div key={rowIndex} className="grid gap-4 items-start" style={{ gridTemplateColumns }}>
        {visibleItems.map((item, colIndex) => {
          if (item.type === "empty") {
            return <div key={colIndex} />
          }

          if (item.type === "separator") {
            return (
              <div key={colIndex} className="col-span-full py-2">
                {item.label && (
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{item.label}</h4>
                )}
                <Separator />
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

          return <TsFormField key={item.field} name={item.field} fieldDef={fieldDef} />
        })}
      </div>
    )
  })
}
