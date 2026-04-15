"use client"

import { Check, ChevronsUpDown, X as XIcon } from "lucide-react"

import * as React from "react"
import { useTsLocale } from "@/components/ts-web-ui/locale"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsFieldOptions, TsMultiselectField, TsWidgetProps } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export type TsMultiSelectWidgetProps = TsWidgetProps<TsMultiselectField>

export const MultiSelectWidget = React.forwardRef<HTMLDivElement, TsMultiSelectWidgetProps>(
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
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    const safeId = sanitizeId(name)
    const tf = useTsLocale().strings.form
    const selectedValues: string[] = Array.isArray(field.value) ? (field.value as string[]) : []
    const options = (def.options || []).map((opt: TsFieldOptions | string) => {
      const value = typeof opt === "string" ? opt : String(opt.value)
      const label = typeof opt === "string" ? opt : opt.label
      return { value, label }
    })

    const toggleValue = (val: string) => {
      if (readOnly) return
      const newValues = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val]
      field.onChange(newValues)
    }

    const { errorClass, readonlyClass, readonlyPointerClass } = getFieldClasses(error, readOnly)

    return (
      <Popover open={open} onOpenChange={(v) => !readOnly && !def.disabled && setOpen(v)} modal>
        <PopoverAnchor asChild>
          <div
            id={safeId}
            role="combobox"
            aria-expanded={open}
            aria-controls={`popover-content-${safeId}`}
            aria-label={ariaLabel || def.label}
            aria-required={ariaRequired}
            aria-readonly={readOnly}
            tabIndex={def.disabled || readOnly ? -1 : 0}
            autoFocus={autoFocus}
            onClick={() => {
              if (!def.disabled && !readOnly) setOpen((v) => !v)
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !def.disabled && !readOnly) {
                e.preventDefault()
                setOpen((v) => !v)
              }
            }}
            className={cn(
              "flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-xs",
              !readOnly && "hover:bg-accent dark:hover:bg-input/30",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              errorClass,
              readonlyClass,
              readonlyPointerClass,
              def.disabled && "opacity-50 pointer-events-none",
              readOnly && "opacity-100"
            )}
            {...props}
            ref={ref}
            aria-invalid={!!error}
          >
            <div className="flex flex-wrap gap-1">
              {selectedValues.length > 0 ? (
                selectedValues.map((val) => (
                  <Badge key={val} variant="secondary" className="mr-1">
                    {options.find((o: { value: string; label: string }) => o.value === val)
                      ?.label || val}
                    {!readOnly && (
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 inline-flex cursor-pointer items-center hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleValue(val)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleValue(val)
                          }
                        }}
                      >
                        <XIcon className="h-3 w-3" />
                      </span>
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">
                  {def.placeholder || tf.selectPlaceholder}
                </span>
              )}
            </div>
            {!readOnly && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          </div>
        </PopoverAnchor>
        <PopoverContent
          id={`popover-content-${safeId}`}
          className="w-[--radix-popover-trigger-width] p-0"
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLElement).querySelector("input")?.focus()
          }}
          onEscapeKeyDown={(e) => {
            if (searchValue) {
              e.preventDefault()
              setSearchValue("")
            }
          }}
        >
          <Command
            filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
          >
            <CommandInput
              placeholder={def.placeholder || tf.searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty className="py-1.5 px-2 text-left">
                <span className="italic text-muted-foreground text-sm">
                  {def.notFoundMessage || tf.notFound}
                </span>
              </CommandEmpty>
              <CommandGroup>
                {options.map((opt: { value: string; label: string }) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => toggleValue(opt.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(opt.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
MultiSelectWidget.displayName = "MultiSelectWidget"
