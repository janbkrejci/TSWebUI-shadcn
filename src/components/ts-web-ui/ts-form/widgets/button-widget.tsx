"use client"

import { icons } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"

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

    const Icon = def.icon ? icons[def.icon as keyof typeof icons] : undefined
    // Icon-only button: explicitly requested, or an icon with no label.
    const isIconOnly = !!Icon && (def.iconOnly || !def.label)

    return (
      <Button
        variant={variant}
        size={isIconOnly ? "icon" : undefined}
        className={cn(
          !isIconOnly && "w-full",
          customClass,
          readOnly && "pointer-events-none opacity-100"
        )}
        aria-label={ariaLabel || def.label || def.action}
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
        {Icon ? <Icon className="h-4 w-4" /> : null}
        {isIconOnly ? null : def.label}
      </Button>
    )
  }
)
ButtonWidget.displayName = "ButtonWidget"
