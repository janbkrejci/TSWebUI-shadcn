"use client"

import { format, isValid as isValidDate, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsDateField } from "../types"

export interface TsDateWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsDateField
  error?: string
  name: string
}

export const DateWidget = React.forwardRef<HTMLInputElement, TsDateWidgetProps>(
  ({ field, def, error, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const dateFormat = def.dateFormat || "d.M.yyyy"
    const [inputValue, setInputValue] = React.useState(() => {
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
      return validDate ? format(validDate, dateFormat) : ""
    })

    // Compute calendar date from inputValue first, then field.value as fallback
    const calendarDate = React.useMemo(() => {
      if (inputValue.trim()) {
        try {
          const parsed = parse(inputValue, dateFormat, new Date())
          if (isValidDate(parsed)) return parsed
        } catch {}
      }
      const dv = field.value ? new Date(field.value as string | number | Date) : undefined
      return dv && !isNaN(dv.getTime()) ? dv : undefined
    }, [inputValue, dateFormat, field.value])

    // Only sync input from field value when not focused
    React.useEffect(() => {
      if (isFocused) return
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
      if (validDate && !open) {
        setInputValue(format(validDate, dateFormat))
      } else if (!field.value) {
        setInputValue("")
      }
    }, [field.value, dateFormat, open, isFocused])

    const handleInputBlur = () => {
      setIsFocused(false)
      if (!inputValue.trim()) {
        field.onChange(undefined)
        return
      }
      const parsed = parse(inputValue, dateFormat, new Date())
      if (isValidDate(parsed)) {
        field.onChange(parsed)
      } else {
        // Revert to valid value if parsing fails
        const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
        const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
        setInputValue(validDate ? format(validDate, dateFormat) : "")
      }
    }

    return (
      <Popover open={open} onOpenChange={def.readonly || def.disabled ? undefined : setOpen}>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => {
              if (def.readonly) {
                e.currentTarget.blur()
                return
              }
              setIsFocused(true)
              if (def.selectAllOnFocus) {
                const el = e.currentTarget
                setTimeout(() => el.select(), 0)
              }
            }}
            onClick={(e) => {
              if (def.selectAllOnFocus) e.currentTarget.select()
            }}
            onBlur={handleInputBlur}
            placeholder={def.placeholder || dateFormat.toLowerCase()}
            disabled={def.disabled}
            readOnly={def.readonly}
            tabIndex={def.readonly ? -1 : undefined}
            aria-invalid={!!error}
            className={cn(
              "pr-10 text-right",
              def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""
            )}
            {...props}
            ref={ref || field.ref}
          />
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-0 top-0 h-full w-9 rounded-l-none text-muted-foreground hover:text-foreground",
                (def.readonly || def.disabled) && "pointer-events-none"
              )}
              disabled={def.disabled}
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={calendarDate}
            defaultMonth={calendarDate}
            onSelect={(date) => {
              if (date) field.onChange(date)
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }
)
DateWidget.displayName = "DateWidget"
