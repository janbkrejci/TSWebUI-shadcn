"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Slider } from "@/components/ui/slider"

import { cn } from "@/lib/utils"

import { TsSliderField } from "../types"

export interface TsSliderWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsSliderField
  error?: string
  name: string
}

export const SliderWidget = React.forwardRef<HTMLDivElement, TsSliderWidgetProps>(
  ({ field, def, error, ...props }, ref) => {
    const [showTooltip, setShowTooltip] = React.useState(false)
    const [localValue, setLocalValue] = React.useState<number>(field.value ?? def.min ?? 0)

    React.useEffect(() => {
      setLocalValue(field.value ?? def.min ?? 0)
    }, [field.value, def.min])

    const min = def.min ?? 0
    const max = def.max ?? 100
    const percent =
      max !== min ? Math.min(100, Math.max(0, ((localValue - min) / (max - min)) * 100)) : 0

    return (
      <div
        className={cn("relative py-2")}
        {...props}
        ref={ref}
        onPointerEnter={() => setShowTooltip(true)}
        onPointerLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <div
            className="absolute -top-7 -translate-x-1/2 pointer-events-none whitespace-nowrap rounded-md border bg-popover text-popover-foreground px-2 py-0.5 text-xs shadow-md z-50"
            style={{ left: `${percent}%` }}
          >
            {localValue}
          </div>
        )}
        <Slider
          value={[localValue]}
          max={max}
          min={min}
          step={def.step || 1}
          onValueChange={(vals: number[]) => {
            setLocalValue(vals[0])
            setShowTooltip(true)
          }}
          onValueCommit={(vals: number[]) => {
            field.onChange(vals[0])
            setTimeout(() => setShowTooltip(false), 300)
          }}
          disabled={def.disabled}
          aria-invalid={!!error}
          className={cn(
            error && "**:[[role=slider]]:border-destructive **:[[role=slider]]:bg-destructive",
            def.readonly && "pointer-events-none opacity-100"
          )}
        />
      </div>
    )
  }
)
SliderWidget.displayName = "SliderWidget"
