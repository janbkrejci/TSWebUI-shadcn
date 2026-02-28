"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

import { TsButtonField } from "../types"

export interface TsButtonWidgetProps {
  def: TsButtonField
  name: string
}

export const ButtonWidget = React.forwardRef<HTMLButtonElement, TsButtonWidgetProps>(
  ({ def, name, ...props }, ref) => {
    return (
      <Button
        variant={(def.variant as "default") || "default"}
        className="w-full"
        {...props}
        ref={ref}
        onClick={(e) => {
          e.preventDefault()
          const event = new CustomEvent("form-field-action", {
            detail: { field: name, action: def.action },
            bubbles: true,
          })
          e.currentTarget.dispatchEvent(event)
        }}
      >
        {def.label}
      </Button>
    )
  }
)
ButtonWidget.displayName = "ButtonWidget"
