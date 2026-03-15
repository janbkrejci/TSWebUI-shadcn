"use client"

import * as React from "react"

import { TsSeparatorField } from "../types"

export interface TsSeparatorWidgetProps {
  def: TsSeparatorField
  name?: string
  error?: string
}

export const SeparatorWidget = React.forwardRef<HTMLDivElement, TsSeparatorWidgetProps>(
  ({ def, ...props }, ref) => {
    return (
      <div className="py-2" {...props} ref={ref}>
        <div className="relative h-5 flex items-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          {def.label && (
            <div className="relative flex justify-center w-full text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">
                {def.label}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
SeparatorWidget.displayName = "SeparatorWidget"
