import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"

import { TsTextareaField } from "../types"
import { getFieldClasses, handleFieldKeyDown } from "../utils"

export interface TsTextareaWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsTextareaField
  name: string
  error?: string
}

export const TextareaWidget = React.forwardRef<HTMLTextAreaElement, TsTextareaWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    return (
      <Textarea
        placeholder={def.placeholder}
        {...field}
        {...props}
        ref={ref || field.ref}
        value={(field.value as string) ?? ""}
        rows={def.rows || 3}
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
        className={cn("field-sizing-fixed", errorClass, readonlyClass)}
        style={def.rows ? { height: `${def.rows * 1.5 + 1}rem` } : undefined}
      />
    )
  }
)
TextareaWidget.displayName = "TextareaWidget"
