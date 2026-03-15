import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"

import { TsTextareaField } from "../types"
import { DEFAULT_TEXTAREA_ROWS, getFieldClasses, handleFieldKeyDown, sanitizeId } from "../utils"

export interface TsTextareaWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsTextareaField
  name: string
  error?: string
  hint?: string
}

export const TextareaWidget = React.forwardRef<HTMLTextAreaElement, TsTextareaWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    return (
      <Textarea
        id={safeId}
        placeholder={def.placeholder}
        {...field}
        {...props}
        ref={ref || field.ref}
        value={(field.value as string) ?? ""}
        rows={def.rows || DEFAULT_TEXTAREA_ROWS}
        onKeyDown={(e) =>
          handleFieldKeyDown(e, name, def.enterAction, def.escapeAction, () => field.onChange(""))
        }
        disabled={def.disabled}
        readOnly={def.readonly}
        tabIndex={def.readonly ? -1 : undefined}
        aria-invalid={!!error}
        onFocus={(e) => {
          if (def.selectAllOnFocus && !def.readonly) {
            const el = e.currentTarget
            setTimeout(() => el.select(), 0)
          }
        }}
        onClick={(e) => {
          if (def.selectAllOnFocus && !def.readonly && document.activeElement !== e.currentTarget) {
            e.currentTarget.select()
          }
        }}
        className={cn(errorClass, readonlyClass)}
      />
    )
  }
)
TextareaWidget.displayName = "TextareaWidget"
