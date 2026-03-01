"use client"

import { AlertTriangle, CheckCircle2, Info } from "lucide-react"

import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { TsInfoboxField } from "../types"

export interface TsInfoboxWidgetProps {
  def: TsInfoboxField
}

export const InfoboxWidget = React.forwardRef<HTMLDivElement, TsInfoboxWidgetProps>(
  ({ def, ...props }, ref) => {
    const v = def.variant || "default"
    const variantClasses: Record<string, string> = {
      destructive:
        "border-destructive/50 bg-destructive/10 text-destructive dark:text-red-400 [&>svg]:text-destructive",
      information:
        "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
      warning:
        "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500",
      success:
        "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-500",
    }
    const iconMap: Record<string, React.ReactNode> = {
      default: <Info className="h-4 w-4" />,
      destructive: <Info className="h-4 w-4" />,
      information: <Info className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      success: <CheckCircle2 className="h-4 w-4" />,
    }

    return (
      <Alert variant="default" className={variantClasses[v] || ""} {...props} ref={ref}>
        {iconMap[v] || <Info className="h-4 w-4" />}
        {def.label && <AlertTitle>{def.label}</AlertTitle>}
        <AlertDescription>{(def.value as React.ReactNode) || def.content || ""}</AlertDescription>
      </Alert>
    )
  }
)
InfoboxWidget.displayName = "InfoboxWidget"
