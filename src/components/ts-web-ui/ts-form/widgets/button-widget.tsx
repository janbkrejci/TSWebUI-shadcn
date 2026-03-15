"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import { TsButtonField } from "../types"
import { getButtonVariantClasses } from "../utils"

export interface TsButtonWidgetProps {
  def: TsButtonField
  name: string
}

export const ButtonWidget = React.forwardRef<HTMLButtonElement, TsButtonWidgetProps>(
  ({ def, name, ...props }, ref) => {
    const { variant, className: customClass } = getButtonVariantClasses(def.variant)

    return (
      <Button
        variant={variant}
        className={cn("w-full", customClass, def.readonly && "pointer-events-none opacity-100")}
        {...props}
        ref={ref}
        disabled={def.disabled}
        onClick={(e) => {
          if (def.readonly || def.disabled) return
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
