"use client"

import * as React from "react"

import { TsSeparatorField, TsWidgetProps } from "../types"

export type TsSeparatorWidgetProps = TsWidgetProps<TsSeparatorField>

export const SeparatorWidget = React.forwardRef<HTMLDivElement, TsSeparatorWidgetProps>(
  (
    {
      field: _field,
      def,
      name: _name,
      error: _error,
      hint: _hint,
      readOnly: _readOnly,
      autoFocus: _autoFocus,
      "aria-label": ariaLabel,
      "aria-required": _ariaRequired,
      ...props
    },
    ref
  ) => {
    return (
      <div className="py-2" aria-label={ariaLabel || def.label} {...props} ref={ref}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <span className="w-full border-t border-border" />
          </div>
          {def.label && (
            <div className="relative flex justify-center text-xs uppercase">
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
