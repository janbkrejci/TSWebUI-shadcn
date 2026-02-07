"use client"

import * as React from "react"
import { TsFormLayout as LayoutType, TsFormRow, TsFieldDef } from "./types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { TsFormField } from "./ts-form-field"
import { useFormContext } from "react-hook-form"

interface TsFormLayoutProps {
  layout: LayoutType
  fields: Record<string, TsFieldDef>
}

export function TsFormLayout({ layout, fields }: TsFormLayoutProps) {
  if (layout.tabs) {
    return (
      <Tabs defaultValue={layout.tabs[0].label} className="w-full">
        <TabsList className="w-full justify-start">
          {layout.tabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.label}>
              {tab.label}
            </TabsTrigger>
          ))}
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

function renderRows(rows: TsFormRow[], fields: Record<string, TsFieldDef>) {
  return rows.map((row, rowIndex) => {
    // Calculate grid template columns based on widths
    // Default width is 1fr if not specified
    const gridTemplateColumns = row
      .map((item) => item.width || "1fr")
      .join(" ")

    return (
      <div
        key={rowIndex}
        className="grid gap-4 items-start"
        style={{ gridTemplateColumns }}
      >
        {row.map((item, colIndex) => {
            if (item.type === 'empty') {
                return <div key={colIndex} />
            }
            
            if (item.type === 'separator') {
                return (
                    <div key={colIndex} className="col-span-full py-2">
                        {item.label && <h4 className="text-sm font-medium text-muted-foreground mb-2">{item.label}</h4>}
                        <Separator />
                    </div>
                )
            }

            const fieldDef = fields[item.field]
            if (!fieldDef) {
                return <div key={colIndex} className="text-destructive text-sm">Field '{item.field}' not found</div>
            }

            return (
                <TsFormField 
                    key={colIndex} 
                    name={item.field} 
                    fieldDef={fieldDef} 
                />
            )
        })}
      </div>
    )
  })
}
