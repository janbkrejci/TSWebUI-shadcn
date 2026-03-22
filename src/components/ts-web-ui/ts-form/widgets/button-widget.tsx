"use client"

import * as React from "react"

import { Button } from "@/components/ts-web-ui/ui/button"

import { cn } from "@/lib/utils"

import { TsButtonField, TsWidgetProps } from "../types"
import { getButtonVariantClasses } from "../utils"

export type TsButtonWidgetProps = TsWidgetProps<TsButtonField>

export const ButtonWidget = React.forwardRef<HTMLButtonElement, TsButtonWidgetProps>(
  (
    {
      field: _field,
      def,
      name,
      error: _error,
      hint: _hint,
      readOnly,
      autoFocus,
      "aria-label": ariaLabel,
      "aria-required": _ariaRequired,
      ...props
    },
    ref
  ) => {
    const { variant, className: customClass } = getButtonVariantClasses(def.variant)

    return (
      <Button
        variant={variant}
        className={cn("w-full", customClass, readOnly && "pointer-events-none opacity-100")}
        aria-label={ariaLabel || def.label}
        autoFocus={autoFocus}
        {...props}
        ref={ref}
        disabled={def.disabled}
        onClick={(e) => {
          if (readOnly || def.disabled) return
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
