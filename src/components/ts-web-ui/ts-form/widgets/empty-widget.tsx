"use client"

import * as React from "react"

import { TsEmptyField, TsWidgetProps } from "../types"

export type TsEmptyWidgetProps = TsWidgetProps<TsEmptyField>

export const EmptyWidget = React.forwardRef<HTMLDivElement, TsEmptyWidgetProps>(
  (
    {
      field: _field,
      def: _def,
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
    return <div className="min-h-10" aria-label={ariaLabel} {...props} ref={ref} />
  }
)
EmptyWidget.displayName = "EmptyWidget"
