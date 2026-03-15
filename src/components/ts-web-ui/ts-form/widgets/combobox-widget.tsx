"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { TsComboboxField, TsFieldOptions } from "../types"
import { getFieldClasses, sanitizeId } from "../utils"

export interface TsComboboxWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsComboboxField
  name: string
  error?: string
  hint?: string
}

export const ComboboxWidget = React.forwardRef<HTMLButtonElement, TsComboboxWidgetProps>(
  ({ field, def, name, error, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    const safeId = sanitizeId(name)
    const options = (def.options || []).map((opt: TsFieldOptions | string) => {
      const value = typeof opt === "string" ? opt : String(opt.value)
      const label = typeof opt === "string" ? opt : opt.label
      return { value, label }
    })

    // Allow custom value if not found (exact match)
    const showCustom =
      def.allowCustom &&
      searchValue &&
      !options.find((o) => o.label.toLowerCase() === searchValue.toLowerCase())

    const { errorClass, readonlyClass } = getFieldClasses(error, def.readonly)

    return (
      <Popover
        open={open}
        onOpenChange={(v) => {
          if (!def.readonly && !def.disabled) setOpen(v)
        }}
      >
        <PopoverTrigger asChild>
          <div className="relative group/combobox w-full">
            <Button
              id={safeId}
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-invalid={!!error}
              aria-controls={`popover-content-${safeId}`}
              className={cn(
                "w-full justify-between hover:bg-background dark:hover:bg-input/30 pr-8",
                errorClass,
                readonlyClass,
                def.readonly && "opacity-100 cursor-default pointer-events-none pr-3"
              )}
              disabled={def.disabled}
              {...props}
              ref={ref || (field.ref as React.Ref<HTMLButtonElement>)}
            >
              <span className="truncate">
                {field.value
                  ? (options.find((framework) => framework.value === field.value)?.label ??
                    (field.value as string))
                  : def.placeholder || "Select..."}
              </span>
              <ChevronsUpDown
                className={cn("ml-2 h-4 w-4 shrink-0 opacity-50", def.readonly && "hidden")}
              />
            </Button>
            {!def.readonly && !def.disabled && def.clearable && field.value && (
              <button
                type="button"
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover/combobox:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  field.onChange("")
                  setOpen(false)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          id={`popover-content-${safeId}`}
          className="w-full p-0"
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
              placeholder={def.placeholder || "Search..."}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty className="py-1.5 px-2 text-left">
                <span className="italic text-muted-foreground text-sm">
                  {def.notFoundMessage || "Not found."}
                </span>
              </CommandEmpty>
              <CommandGroup>
                {options.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.label}
                    onSelect={(currentValue: string) => {
                      const original = options.find(
                        (o) => o.label.toLowerCase() === currentValue.toLowerCase()
                      )
                      field.onChange(original ? original.value : currentValue)
                      setSearchValue("")
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
                {showCustom && (
                  <CommandItem
                    value={`\x00custom:${searchValue}`}
                    onSelect={() => {
                      field.onChange(searchValue)
                      setSearchValue("")
                      setOpen(false)
                    }}
                  >
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    Use: &quot;{searchValue}&quot;
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
ComboboxWidget.displayName = "ComboboxWidget"
