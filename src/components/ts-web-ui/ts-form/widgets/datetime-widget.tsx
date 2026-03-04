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

import { TsDateTimeField } from "../types"
import { getFieldClasses } from "../utils"

export interface TsDateTimeWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsDateTimeField
  error?: string
  name: string
}

export const DateTimeWidget = React.forwardRef<HTMLInputElement, TsDateTimeWidgetProps>(
  ({ field, def, error, name, ...props }, ref) => {
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
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
      if (validDate && !open) {
        setInputValue(format(validDate, dateFormat))
      } else if (!field.value) {
        setInputValue("")
      }
    }, [field.value, dateFormat, open, isFocused])

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
      if (!inputValue.trim()) {
        field.onChange(undefined)
        return
      }
      const parsed = parse(inputValue, dateFormat, new Date())
      if (isValidDate(parsed)) {
        field.onChange(parsed)
      } else {
        const vd = getValidDate()
        setInputValue(vd ? format(vd, dateFormat) : "")
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
              if (
                def.selectAllOnFocus &&
                !def.readonly &&
                document.activeElement !== e.currentTarget
              ) {
                e.currentTarget.select()
              }
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
            initialFocus
          />
          <div className="border-t p-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-10">Time</span>
              <Input
                type="time"
                value={getTimeValue()}
                onChange={handleTimeChange}
                className="h-8 text-sm text-right"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs"
              onClick={() => setOpen(false)}
            >
              Zavřít
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)
DateTimeWidget.displayName = "DateTimeWidget"
