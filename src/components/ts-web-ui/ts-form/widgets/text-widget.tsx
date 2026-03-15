import { Eye, EyeOff } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

import { TsTextField } from "../types"
import { getFieldClasses, handleFieldKeyDown, sanitizeId } from "../utils"

export interface TsTextWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsTextField
  name: string
  error?: string
  hint?: string
}

export const TextWidget = React.forwardRef<HTMLInputElement, TsTextWidgetProps>(
  ({ field, def, name, error, hint: _hint, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState((field.value as string) ?? "")
    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, def.readonly)

    // Sync internal value with external changes only when not focused or value changed significantly
    React.useEffect(() => {
      const newVal = (field.value as string) ?? ""
      if (newVal !== internalValue) {
        setInternalValue(newVal)
      }
    }, [field.value, internalValue])

    const isPassword = def.type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : def.type

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInternalValue(val)
      field.onChange(val)
    }

    return (
      <div className="relative">
        <Input
          id={safeId}
          type={inputType}
          placeholder={def.placeholder}
          {...field}
          {...props}
          ref={ref || field.ref}
          value={internalValue}
          onChange={handleChange}
          onKeyDown={(e) =>
            handleFieldKeyDown(
              e,
              name,
              def.enterAction,
              def.escapeAction,
              () => {
                setInternalValue("")
                field.onChange("")
              },
              internalValue
            )
          }
          disabled={def.disabled}
          readOnly={def.readonly}
          tabIndex={def.readonly ? -1 : undefined}
          aria-invalid={!!error}
          onFocus={(e) => {
            if (def.selectAllOnFocus !== false && !def.readonly) {
              const el = e.currentTarget
              setTimeout(() => el.select(), 0)
            }
          }}
          onClick={(e) => {
            if (
              def.selectAllOnFocus !== false &&
              !def.readonly &&
              document.activeElement !== e.currentTarget
            ) {
              e.currentTarget.select()
            }
          }}
          className={cn(errorClass, readonlyClass, readonlyPointerClass, isPassword && "pr-10")}
        />
        {isPassword && !def.readonly && !def.disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        )}
      </div>
    )
  }
)
TextWidget.displayName = "TextWidget"
