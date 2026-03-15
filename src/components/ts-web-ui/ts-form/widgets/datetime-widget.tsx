"use client"

import { format, isValid as isValidDate, parse } from "date-fns"
import * as Locales from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsDateTimeField } from "../types"
import { getFieldClasses, handleFieldKeyDown, sanitizeId } from "../utils"

export interface TsDateTimeWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsDateTimeField
  error?: string
  hint?: string
  name: string
}

export const DateTimeWidget = React.forwardRef<HTMLInputElement, TsDateTimeWidgetProps>(
  ({ field, def, error, hint: _hint, name, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const safeId = sanitizeId(name)

    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    const dateFormat = def.dateFormat || "d.M.yyyy HH:mm"
    const [inputValue, setInputValue] = React.useState(() => {
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
      return validDate ? format(validDate, dateFormat) : ""
    })

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
    const dateLocale = React.useMemo(() => {
      if (!def.locale) return undefined
      const localeKey = def.locale.replace("-", "") as keyof typeof Locales
      const localeObj = Locales[localeKey]
      if (localeObj) return localeObj as unknown as Locales.Locale
      const genericKey = def.locale.split("-")[0] as keyof typeof Locales
      return (Locales[genericKey] as unknown as Locales.Locale) || undefined
    }, [def.locale])

    const getValidDate = () => {
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      return dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
    }

    const getTimeValue = () => {
      const vd = getValidDate()
      return vd
        ? `${String(vd.getHours()).padStart(2, "0")}:${String(vd.getMinutes()).padStart(2, "0")}`
        : ""
    }

    const handleDateSelect = (date: Date | undefined) => {
      if (!date) {
        field.onChange(undefined)
        return
      }
      const newDate = new Date(date)
      const vd = getValidDate()
      if (vd) {
        newDate.setHours(vd.getHours(), vd.getMinutes(), 0, 0)
      }
      field.onChange(newDate)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parts = e.target.value.split(":")
      const hours = parseInt(parts[0] || "0")
      const minutes = parseInt(parts[1] || "0")
      const newDate = getValidDate() ? new Date(getValidDate()!) : new Date()
      newDate.setHours(hours, minutes, 0, 0)
      field.onChange(newDate)
    }

    const handleInputBlur = () => {
      setIsFocused(false)
      const trimmed = inputValue.trim()
      if (!trimmed) {
        if (field.value) field.onChange(null)
        return
      }

      let parsed = parse(trimmed, dateFormat, new Date())
      // Fallback for compact formats like 01012025
      if (!isValidDate(parsed)) {
        const digits = trimmed.replace(/\D/g, "")
        if (digits.length >= 8) {
          const d = parseInt(digits.substring(0, 2), 10)
          const m = parseInt(digits.substring(2, 4), 10) - 1
          const y = parseInt(digits.substring(4, 8), 10)
          let h = 0,
            min = 0
          if (digits.length === 12) {
            h = parseInt(digits.substring(8, 10), 10)
            min = parseInt(digits.substring(10, 12), 10)
          }
          parsed = new Date(y, m, d, h, min)
        }
      }

      if (isValidDate(parsed)) {
        field.onChange(parsed)
        setInputValue(format(parsed, dateFormat))
      }
    }

    return (
      <Popover open={open} onOpenChange={def.readonly || def.disabled ? undefined : setOpen}>
        <div className="relative">
          <Input
            id={safeId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => {
              if (def.readonly) return
              setIsFocused(true)
              if (def.selectAllOnFocus !== false) {
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                let parsed = parse(inputValue, dateFormat, new Date())
                // Fallback for compact formats like 01012025
                if (!isValidDate(parsed)) {
                  const digits = inputValue.replace(/\D/g, "")
                  if (digits.length >= 8) {
                    const d = parseInt(digits.substring(0, 2), 10)
                    const m = parseInt(digits.substring(2, 4), 10) - 1
                    const y = parseInt(digits.substring(4, 8), 10)
                    let h = 0,
                      min = 0
                    if (digits.length === 12) {
                      h = parseInt(digits.substring(8, 10), 10)
                      min = parseInt(digits.substring(10, 12), 10)
                    }
                    parsed = new Date(y, m, d, h, min)
                  }
                }

                if (isValidDate(parsed)) {
                  field.onChange(parsed)
                  setInputValue(format(parsed, dateFormat))

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
            readOnly={def.readonly}
            tabIndex={def.readonly ? -1 : undefined}
            aria-invalid={!!error}
            className={cn("pr-10 text-right", errorClass, readonlyClass)}
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
            selected={getValidDate()}
            onSelect={handleDateSelect}
            locale={dateLocale}
            initialFocus
          />
          {(def.showTodayButton !== false || def.showClearButton !== false) && (
            <div className="flex items-center justify-between p-2 border-t gap-2 bg-muted/10 px-3">
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
          <div className="border-t p-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-10">Time</span>
              <Input
                type="time"
                value={getTimeValue()}
                onChange={handleTimeChange}
                className="h-8 text-sm text-right"
                disabled={def.readonly || def.disabled}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)
DateTimeWidget.displayName = "DateTimeWidget"
