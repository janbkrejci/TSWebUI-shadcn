"use client"

import { format, isValid as isValidDate } from "date-fns"
import { CalendarIcon } from "lucide-react"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsDateField, TsWidgetProps } from "../types"
import {
  getDateLocale,
  getFieldClasses,
  handleFieldKeyDown,
  parseSmartDate,
  sanitizeId,
} from "../utils"

export type TsDateWidgetProps = TsWidgetProps<TsDateField>

export const DateWidget = React.forwardRef<HTMLInputElement, TsDateWidgetProps>(
  (
    {
      field,
      def,
      error,
      hint: _hint,
      name,
      readOnly,
      autoFocus,
      "aria-label": ariaLabel,
      "aria-required": ariaRequired,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const safeId = sanitizeId(name)

    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

    const dateFormat = def.dateFormat || "d.M.yyyy"
    const [inputValue, setInputValue] = React.useState(() => {
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
      return validDate ? format(validDate, dateFormat) : ""
    })

    // Compute calendar date from inputValue first, then field.value as fallback
    const calendarDate = React.useMemo(() => {
      if (inputValue.trim()) {
        const parsed = parseSmartDate(inputValue)
        if (parsed) return parsed
      }
      const dv = field.value ? new Date(field.value as string | number | Date) : undefined
      return dv && !isNaN(dv.getTime()) ? dv : undefined
    }, [inputValue, field.value])

    // Only sync input from field value when not focused
    React.useEffect(() => {
      if (isFocused) return
      if (!field.value) {
        setInputValue("")
        return
      }
      const dateValue = new Date(field.value as string | number | Date)
      const validDate = !isNaN(dateValue.getTime()) ? dateValue : undefined
      if (validDate && !open) {
        setInputValue(format(validDate, dateFormat))
      }
    }, [field.value, dateFormat, open, isFocused])

    // Get date-fns locale object from string
    const dateLocale = React.useMemo(() => getDateLocale(def.locale), [def.locale])

    const handleInputBlur = () => {
      setIsFocused(false)
      const trimmed = inputValue.trim()
      if (!trimmed) {
        if (field.value) field.onChange(null)
        return
      }

      const parsed = parseSmartDate(trimmed)

      if (parsed && isValidDate(parsed)) {
        field.onChange(parsed)
        setInputValue(format(parsed, dateFormat))
      }
    }

    return (
      <Popover open={open} onOpenChange={readOnly || def.disabled ? undefined : setOpen}>
        <div className="relative">
          <Input
            id={safeId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => {
              if (readOnly) return
              setIsFocused(true)
              if (def.selectAllOnFocus !== false) {
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const parsed = parseSmartDate(inputValue)

                if (parsed && isValidDate(parsed)) {
                  field.onChange(parsed)
                  setInputValue(format(parsed, dateFormat))

                  // If it was a manual entry, stop propagation to prevent form action
                  // unless it's the exact same as current field value
                  const wasNew =
                    !field.value || new Date(field.value as string).getTime() !== parsed.getTime()
                  if (wasNew) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                  }
                }
              }
              handleFieldKeyDown(
                e,
                name,
                def.enterAction,
                def.escapeAction,
                () => {
                  setInputValue("")
                  field.onChange(undefined)
                },
                field.value
              )
            }}
            onBlur={handleInputBlur}
            placeholder={def.placeholder || dateFormat.toLowerCase()}
            disabled={def.disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            tabIndex={readOnly ? -1 : undefined}
            aria-invalid={!!error}
            aria-readonly={readOnly}
            aria-label={ariaLabel}
            aria-required={ariaRequired}
            className={cn("pr-10 text-right", errorClass, readonlyClass, readonlyPointerClass)}
            {...props}
            ref={ref || field.ref}
          />
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-0 top-0 h-full w-9 rounded-l-none text-muted-foreground hover:text-foreground",
                (readOnly || def.disabled) && "pointer-events-none"
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
            locale={dateLocale}
            onSelect={(date) => {
              if (date) field.onChange(date)
              setOpen(false)
            }}
            initialFocus
          />
          {(def.showTodayButton !== false || def.showClearButton !== false) && (
            <div className="flex items-center justify-between p-2 border-t gap-2 bg-muted/10">
              {def.showClearButton !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 px-2 flex-1"
                  onClick={() => {
                    field.onChange(null)
                    setInputValue("")
                    setOpen(false)
                  }}
                >
                  {def.clearButtonText || "Clear"}
                </Button>
              )}
              {def.showTodayButton !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 px-2 flex-1"
                  onClick={() => {
                    const today = new Date()
                    field.onChange(today)
                    setInputValue(format(today, dateFormat))
                    setOpen(false)
                  }}
                >
                  {def.todayButtonText || "Today"}
                </Button>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }
)
DateWidget.displayName = "DateWidget"
