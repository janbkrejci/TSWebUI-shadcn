import { Eye, EyeOff } from "lucide-react"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"

import { TsTextField, TsWidgetProps } from "../types"
import { getFieldClasses, handleFieldKeyDown, sanitizeId } from "../utils"

export type TsTextWidgetProps = TsWidgetProps<TsTextField>

export const TextWidget = React.forwardRef<HTMLInputElement, TsTextWidgetProps>(
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
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState((field.value as string) ?? "")
    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

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
          autoFocus={autoFocus}
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
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={!!error}
          aria-readonly={readOnly}
          aria-label={ariaLabel}
          aria-required={ariaRequired}
          onFocus={(e) => {
            if (def.selectAllOnFocus !== false && !readOnly) {
              const el = e.currentTarget
              setTimeout(() => el.select(), 0)
            }
          }}
          onClick={(e) => {
            if (
              def.selectAllOnFocus !== false &&
              !readOnly &&
              document.activeElement !== e.currentTarget
            ) {
              e.currentTarget.select()
            }
          }}
          className={cn(errorClass, readonlyClass, readonlyPointerClass, isPassword && "pr-10")}
        />
        {isPassword && !readOnly && !def.disabled && (
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
