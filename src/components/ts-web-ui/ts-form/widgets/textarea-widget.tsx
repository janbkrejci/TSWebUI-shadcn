import * as React from "react"

import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"

import { TsTextareaField, TsWidgetProps } from "../types"
import { DEFAULT_TEXTAREA_ROWS, getFieldClasses, handleFieldKeyDown, sanitizeId } from "../utils"

export type TsTextareaWidgetProps = TsWidgetProps<TsTextareaField>

export const TextareaWidget = React.forwardRef<HTMLTextAreaElement, TsTextareaWidgetProps>(
  (
    {
      field,
      def,
      name,
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
    const safeId = sanitizeId(name)
    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

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
        readOnly={readOnly}
        autoFocus={autoFocus}
        tabIndex={readOnly ? -1 : undefined}
        aria-invalid={!!error}
        aria-label={ariaLabel}
        aria-required={ariaRequired}
        onFocus={(e) => {
          if (def.selectAllOnFocus && !readOnly) {
            const el = e.currentTarget
            setTimeout(() => el.select(), 0)
          }
        }}
        onClick={(e) => {
          if (def.selectAllOnFocus && !readOnly && document.activeElement !== e.currentTarget) {
            e.currentTarget.select()
          }
        }}
        className={cn(errorClass, readonlyClass, readonlyPointerClass)}
      />
    )
  }
)
TextareaWidget.displayName = "TextareaWidget"
