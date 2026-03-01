import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

import { TsTextField } from "../types"
import { getFieldClasses, handleFieldKeyDown } from "../utils"

export interface TsTextWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsTextField
  name: string
  error?: string
}

export const TextWidget = React.forwardRef<HTMLInputElement, TsTextWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const { readonlyClass } = getFieldClasses(error, def.readonly)

    return (
      <Input
        type={def.type}
        placeholder={def.placeholder}
        {...field}
        {...props}
        ref={ref || field.ref}
        value={(field.value as string) ?? ""}
        onKeyDown={(e) =>
          handleFieldKeyDown(e, name, def.enterAction, def.escapeAction, () => field.onChange(""))
        }
        disabled={def.disabled}
        readOnly={def.readonly}
        tabIndex={def.readonly ? -1 : undefined}
        aria-invalid={!!error}
        onFocus={(e) => {
          if (def.readonly) {
            e.currentTarget.blur()
            return
          }
          if (def.selectAllOnFocus) {
            const el = e.currentTarget
            setTimeout(() => el.select(), 0)
          }
        }}
        onClick={(e) => {
          if (def.selectAllOnFocus) e.currentTarget.select()
        }}
        className={cn(readonlyClass)}
      />
    )
  }
)
TextWidget.displayName = "TextWidget"
