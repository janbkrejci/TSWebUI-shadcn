"use client"

import { AlertTriangle, CheckCircle2, Info, X, icons } from "lucide-react"

import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import { TsInfoboxField, TsWidgetProps } from "../types"

export type TsInfoboxWidgetProps = TsWidgetProps<TsInfoboxField>

export const InfoboxWidget = React.forwardRef<HTMLDivElement, TsInfoboxWidgetProps>(
  (
    {
      field: _field,
      name: _name,
      error: _error,
      hint: _hint,
      readOnly: _readOnly,
      autoFocus: _autoFocus,
      "aria-label": ariaLabel,
      "aria-required": _ariaRequired,
      def,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true)

    if (!isVisible) return null

    const v = def.variant || "default"
    const variantClasses: Record<string, string> = {
      destructive:
        "border-destructive/50 bg-destructive/10 text-destructive dark:text-red-400 [&>svg]:text-destructive [&_div]:text-current",
      information:
        "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500 [&_div]:text-current",
      warning:
        "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500 [&_div]:text-current",
      success:
        "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-500 [&_div]:text-current",
    }

    const defaultIconMap: Record<string, React.ReactNode> = {
      default: <Info className="h-4 w-4" />,
      destructive: <Info className="h-4 w-4" />,
      information: <Info className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      success: <CheckCircle2 className="h-4 w-4" />,
    }

    let IconElement = defaultIconMap[v] || <Info className="h-4 w-4" />

    if (def.icon) {
      const CustomIcon = icons[def.icon as keyof typeof icons]
      if (CustomIcon) {
        IconElement = <CustomIcon className="h-4 w-4" />
      }
    }

    return (
      <Alert
        variant="default"
        className={variantClasses[v] || ""}
        aria-label={ariaLabel || def.label}
        role={v === "destructive" ? "alert" : "status"}
        {...props}
        ref={ref}
      >
        {IconElement}
        {def.label && <AlertTitle>{def.label}</AlertTitle>}
        <AlertDescription className="pr-8">
          {(def.value as React.ReactNode) || def.content || ""}
        </AlertDescription>
        {def.closable && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-2 h-6 w-6 text-current opacity-70 hover:opacity-100"
            onClick={() => setIsVisible(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </Alert>
    )
  }
)
InfoboxWidget.displayName = "InfoboxWidget"
