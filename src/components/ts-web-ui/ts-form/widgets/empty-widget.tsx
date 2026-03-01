"use client"

import * as React from "react"

import { TsEmptyField } from "../types"

export interface TsEmptyWidgetProps {
  def: TsEmptyField
  name?: string
  error?: string
}

export const EmptyWidget = React.forwardRef<HTMLDivElement, TsEmptyWidgetProps>(
  ({ error, ...props }, ref) => {
    return <div className="min-h-10" {...props} ref={ref} aria-invalid={!!error} />
  }
)
EmptyWidget.displayName = "EmptyWidget"
