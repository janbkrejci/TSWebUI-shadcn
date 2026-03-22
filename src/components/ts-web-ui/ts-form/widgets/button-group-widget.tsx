"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Button } from "@/components/ts-web-ui/ui/button"

import { cn } from "@/lib/utils"

import { TsButtonGroupField, TsFieldOptions, TsWidgetProps } from "../types"
import { getButtonVariantClasses, getFieldClasses } from "../utils"

export type TsButtonGroupWidgetProps = TsWidgetProps<TsButtonGroupField>

export const ButtonGroupWidget = React.forwardRef<HTMLDivElement, TsButtonGroupWidgetProps>(
  (
    {
      field,
      def,
      name: _name,
      error,
      hint: _hint,
      readOnly,
      autoFocus,
      "aria-label": ariaLabel,
      "aria-required": ariaRequired,
      ...props
    },
    ref
  ) => {
    const { readonlyPointerClass } = getFieldClasses(error, readOnly)
    const hasError = !!error

    if (def.variant === "process") {
      return <ProcessButtonGroup field={field} def={def} readOnly={readOnly} />
    }

    return (
      <div
        className={cn(
          "flex",
          def.disabled && "opacity-50 pointer-events-none",
          readonlyPointerClass
        )}
        aria-label={ariaLabel || def.label}
        aria-required={ariaRequired}
        aria-readonly={readOnly}
        {...props}
        ref={ref}
      >
        {(def.options || []).map((opt: TsFieldOptions | string, index, arr) => {
          let value: string
          let label: string
          let optVariant: string | undefined
          let isDisabled = false

          if (typeof opt === "string") {
            const parts = opt.split("/")
            value = parts[0]
            isDisabled = parts[1] === "false"
            optVariant = parts[2] || undefined
            label = parts[3] || parts[0]
          } else {
            value = String(opt.value)
            label = opt.label
            optVariant = opt.variant
            isDisabled = !!opt.disabled
          }

          const isActive = field.value === value
          const isFirst = index === 0
          const isLast = index === arr.length - 1
          const rawVariant = isActive
            ? optVariant || "default"
            : optVariant
              ? optVariant
              : "outline"

          const { variant, className: customClass } = getButtonVariantClasses(rawVariant)

          return (
            <Button
              key={value}
              type="button"
              variant={variant}
              disabled={def.disabled || isDisabled}
              autoFocus={autoFocus && isFirst}
              className={cn(
                !isFirst && "-ml-px",
                isFirst && !isLast && "rounded-r-none",
                isLast && !isFirst && "rounded-l-none",
                !isFirst && !isLast && "rounded-none",
                isActive && "relative z-10",
                hasError && "border-destructive text-destructive",
                readOnly && "pointer-events-none opacity-100",
                customClass
              )}
              onClick={() => {
                if (!def.disabled && !readOnly && !isDisabled) field.onChange(value)
              }}
              aria-invalid={hasError}
            >
              {label}
            </Button>
          )
        })}
      </div>
    )
  }
)
ButtonGroupWidget.displayName = "ButtonGroupWidget"

// ─── ProcessButtonGroup ───────────────────────────────────────────────────────

function ProcessButtonGroup({
  field,
  def,
  readOnly,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsButtonGroupField
  readOnly?: boolean
}) {
  const options = (def.options || []).map((opt: TsFieldOptions | string) => {
    if (typeof opt === "string") {
      const parts = opt.split("/")
      const value = parts[0]
      const isEnabled = parts[1] !== "false"
      const variant = parts[2] || undefined
      const label = parts[3] || parts[0]
      return { value, label, variant, disabled: !isEnabled }
    }
    return {
      value: String(opt.value),
      label: opt.label,
      variant: opt.variant,
      disabled: opt.disabled,
    }
  })

  const ARROW = 12

  const getClipPath = (): string => {
    return `polygon(0 0, calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%, 0 100%, ${ARROW}px 50%)`
  }

  const getBgClass = (variant: string | undefined, isActive: boolean): string => {
    if (isActive) {
      switch (variant) {
        case "success":
          return "bg-green-600 text-white dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400"
        case "destructive":
        case "danger":
          return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        case "warning":
          return "bg-amber-500 text-white hover:bg-amber-600"
        case "secondary":
          return "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        default:
          return "bg-primary text-primary-foreground hover:bg-primary/90"
      }
    } else {
      switch (variant) {
        case "success":
          return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
        case "destructive":
        case "danger":
          return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
        case "warning":
          return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200"
        case "secondary":
          return "bg-secondary/30 text-secondary-foreground hover:bg-secondary/50"
        default:
          return "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }
    }
  }

  return (
    <div className="flex items-stretch">
      {options.map((opt, index) => {
        const isActive = field.value === opt.value
        const clipPath = getClipPath()
        const isInteractive = !def.disabled && !readOnly

        return (
          <div
            key={opt.value}
            className="relative h-10"
            style={{
              marginLeft: index > 0 ? `${-ARROW}px` : undefined,
              zIndex: isActive ? 10 : options.length - index,
            }}
          >
            <button
              type="button"
              disabled={def.disabled || opt.disabled}
              onClick={() => {
                if (isInteractive && !opt.disabled) field.onChange(opt.value)
              }}
              className={cn(
                "relative h-full px-10 text-sm font-medium transition-colors",
                getBgClass(opt.variant, isActive),
                (def.disabled || opt.disabled) && "opacity-50 cursor-not-allowed",
                readOnly && "pointer-events-none opacity-100"
              )}
              style={{ clipPath }}
            >
              {opt.label}
            </button>
          </div>
        )
      })}
    </div>
  )
}
