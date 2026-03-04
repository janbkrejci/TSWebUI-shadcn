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
}

export const TextWidget = React.forwardRef<HTMLInputElement, TsTextWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const safeId = sanitizeId(name)
    const [showPassword, setShowPassword] = React.useState(false)
    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    const isPassword = def.type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : def.type

    return (
      <div className="relative">
        <Input
          id={safeId}
          type={inputType}
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
            if (def.selectAllOnFocus && !def.readonly) {
              const el = e.currentTarget
              setTimeout(() => el.select(), 0)
            }
          }}
          onClick={(e) => {
            if (
              def.selectAllOnFocus &&
              !def.readonly &&
              document.activeElement !== e.currentTarget
            ) {
              e.currentTarget.select()
            }
          }}
          className={cn(errorClass, readonlyClass, isPassword && "pr-10")}
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
