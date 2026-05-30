"use client"

import { format, isValid as isValidDate } from "date-fns"
import { CalendarIcon } from "lucide-react"

import * as React from "react"
import type { Matcher } from "react-day-picker"
import { useTsLocale } from "@/components/ts-web-ui/locale"
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

function toDateOnlyString(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

function parseDateValue(value: unknown): Date | undefined {
  if (!value) return undefined

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? undefined : value
  }

  if (typeof value === "string") {
    const trimmed = value.trim()

    // Preferred storage for date-only fields.
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
    if (m) {
      const y = Number(m[1])
      const mo = Number(m[2])
      const d = Number(m[3])
      const localDate = new Date(y, mo - 1, d)
      return isNaN(localDate.getTime()) ? undefined : localDate
    }

    const parsed = new Date(trimmed)
    return isNaN(parsed.getTime()) ? undefined : parsed
  }

  if (typeof value === "number") {
    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? undefined : parsed
  }

  return undefined
}

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
    const tf = useTsLocale().strings.form

    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

    const dateFormat = def.dateFormat || "d.M.yyyy"
    const [inputValue, setInputValue] = React.useState(() => {
      const validDate = parseDateValue(field.value)
      return validDate ? format(validDate, dateFormat) : ""
    })

    // Compute calendar date from inputValue first, then field.value as fallback
    const calendarDate = React.useMemo(() => {
      if (inputValue.trim()) {
        const parsed = parseSmartDate(inputValue)
        if (parsed) return parsed
      }
      return parseDateValue(field.value)
    }, [inputValue, field.value])

    // Only sync input from field value when not focused
    React.useEffect(() => {
      if (isFocused) return
      if (!field.value) {
        setInputValue("")
        return
      }
      const validDate = parseDateValue(field.value)
      if (validDate && !open) {
        setInputValue(format(validDate, dateFormat))
      }
    }, [field.value, dateFormat, open, isFocused])

    // Get date-fns locale object from string
    const dateLocale = React.useMemo(() => getDateLocale(def.locale), [def.locale])

    // Upper/lower date bounds (disableFuture / maxDate / minDate).
    const maxBound = React.useMemo(() => {
      if (def.disableFuture) {
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        return end
      }
      if (def.maxDate) {
        const d = new Date(def.maxDate)
        if (!isNaN(d.getTime())) return d
      }
      return undefined
    }, [def.disableFuture, def.maxDate])

    const minBound = React.useMemo(() => {
      if (def.minDate) {
        const d = new Date(def.minDate)
        if (!isNaN(d.getTime())) return d
      }
      return undefined
    }, [def.minDate])

    const disabledMatcher = React.useMemo<Matcher[] | undefined>(() => {
      const matchers: Matcher[] = []
      if (maxBound) matchers.push({ after: maxBound })
      if (minBound) matchers.push({ before: minBound })
      return matchers.length > 0 ? matchers : undefined
    }, [maxBound, minBound])

    const isDateAllowed = React.useCallback(
      (date: Date) => {
        if (maxBound && date.getTime() > maxBound.getTime()) return false
        if (minBound && date.getTime() < minBound.getTime()) return false
        return true
      },
      [maxBound, minBound]
    )

    const resetInputFromField = React.useCallback(() => {
      const dv = field.value ? new Date(field.value as string | number | Date) : undefined
      setInputValue(dv && !isNaN(dv.getTime()) ? format(dv, dateFormat) : "")
    }, [field.value, dateFormat])

    const handleInputBlur = () => {
      setIsFocused(false)
      const trimmed = inputValue.trim()
      if (!trimmed) {
        if (field.value) field.onChange(null)
        return
      }

      const parsed = parseSmartDate(trimmed)

      if (parsed && isValidDate(parsed) && isDateAllowed(parsed)) {
        field.onChange(toDateOnlyString(parsed))
        setInputValue(format(parsed, dateFormat))
      } else {
        // Out-of-range or invalid manual entry: revert to the last valid value.
        resetInputFromField()
      }
    }

    return (
      <Popover open={open} onOpenChange={readOnly || def.disabled ? undefined : setOpen}>
        <div className={cn("relative", readOnly && "pointer-events-none")}>
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

                if (parsed && isValidDate(parsed) && isDateAllowed(parsed)) {
                  field.onChange(toDateOnlyString(parsed))
                  setInputValue(format(parsed, dateFormat))

                  // If it was a manual entry, stop propagation to prevent form action
                  // unless it's the exact same as current field value
                  const wasNew = !field.value || toDateOnlyString(parsed) !== String(field.value)
                  if (wasNew) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                  }
                } else if (parsed && isValidDate(parsed) && !isDateAllowed(parsed)) {
                  // Reject out-of-range manual entry.
                  e.preventDefault()
                  e.stopPropagation()
                  resetInputFromField()
                  return
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
            disabled={disabledMatcher}
            onSelect={(date) => {
              if (date && isDateAllowed(date)) {
                field.onChange(toDateOnlyString(date))
                setInputValue(format(date, dateFormat))
              }
              setOpen(false)
            }}
            autoFocus
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
                  {def.clearButtonText || tf.clear}
                </Button>
              )}
              {def.showTodayButton !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 px-2 flex-1"
                  onClick={() => {
                    const today = new Date()
                    field.onChange(toDateOnlyString(today))
                    setInputValue(format(today, dateFormat))
                    setOpen(false)
                  }}
                >
                  {def.todayButtonText || tf.today}
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
