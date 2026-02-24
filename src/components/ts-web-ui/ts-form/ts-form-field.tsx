"use client"

import { format, isValid as isValidDate, parse } from "date-fns"
import { cs } from "date-fns/locale"
import {
  AlertTriangle,
  CalendarIcon,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  CloudUpload,
  Download,
  FileText as FileTextIcon,
  Info,
  X as XIcon,
} from "lucide-react"
import remarkGfm from "remark-gfm"

import * as React from "react"
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form"
import Markdown from "react-markdown"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"

import { TsTable } from "../ts-table"
import {
  TsButtonGroupField,
  TsButtonVariant,
  TsComboboxField,
  TsDateField,
  TsDateTimeField,
  TsFieldDef,
  TsFieldOptions,
  TsFileField,
  TsMultiselectField,
  TsNumberField,
  TsRelationshipField,
  TsSliderField,
} from "./types"

interface TsFormFieldProps {
  name: string
  fieldDef: TsFieldDef
}

export function TsFormField({ name, fieldDef }: TsFormFieldProps) {
  const form = useFormContext()
  const hasError = !!fieldDef.error

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(fieldDef.hidden && "hidden", hasError && "[&_label]:text-destructive")}
        >
          {/* Label is rendered unless it's a checkbox/switch/infobox/button/separator/empty/markdown */}
          {fieldDef.type !== "checkbox" &&
            fieldDef.type !== "switch" &&
            fieldDef.type !== "infobox" &&
            fieldDef.type !== "button" &&
            fieldDef.type !== "separator" &&
            fieldDef.type !== "empty" &&
            fieldDef.type !== "markdown" && (
              <FormLabel className={cn(hasError && "text-destructive")}>
                {fieldDef.required ? `${fieldDef.label} *` : fieldDef.label}
              </FormLabel>
            )}

          <FormControl>{renderWidget(field, fieldDef, name, hasError)}</FormControl>

          {/* Error message has priority over hint */}
          {hasError ? (
            <p className="text-sm text-destructive leading-none">{fieldDef.error}</p>
          ) : (
            fieldDef.hint && (
              <FormDescription className="leading-none">{fieldDef.hint}</FormDescription>
            )
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function renderWidget(
  field: ControllerRenderProps<FieldValues, string>,
  def: TsFieldDef,
  name: string,
  hasError: boolean = false
) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enterAction = "enterAction" in def ? def.enterAction : undefined
    const escapeAction = "escapeAction" in def ? def.escapeAction : undefined
    if (e.key === "Enter") {
      if (enterAction) {
        e.preventDefault()
        e.stopPropagation()
        const event = new CustomEvent("form-key-action", {
          detail: { key: "Enter", action: enterAction, field: name },
          bubbles: true,
        })
        ;(e.currentTarget as HTMLElement).dispatchEvent(event)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      if (!escapeAction || escapeAction === "clear") {
        field.onChange("")
      } else {
        const event = new CustomEvent("form-key-action", {
          detail: { key: "Escape", action: escapeAction, field: name },
          bubbles: true,
        })
        ;(e.currentTarget as HTMLElement).dispatchEvent(event)
      }
    }
  }

  // Shared classes for error state and readonly styling
  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""
  // For button/interactive widgets: block pointer events instead of disabling (to preserve normal look)
  const readonlyPointerClass = def.readonly ? "pointer-events-none" : ""

  switch (def.type) {
    case "text":
    case "password":
      return (
        <Input
          type={def.type}
          placeholder={def.placeholder}
          {...field}
          value={(field.value as string) ?? ""}
          onKeyDown={handleKeyDown}
          disabled={def.disabled}
          readOnly={def.readonly}
          tabIndex={def.readonly ? -1 : undefined}
          onFocus={(e) => {
            if (def.readonly) {
              e.currentTarget.blur()
              return
            }
            if (def.selectAllOnFocus) {
              const el = e.currentTarget
              setTimeout(() => el.select(), 0)
            }
          }}
          onClick={(e) => {
            if (def.selectAllOnFocus) e.currentTarget.select()
          }}
          className={cn(errorClass, readonlyClass)}
        />
      )

    case "number":
      return <NumberWidget field={field} def={def} hasError={hasError} name={name} />

    case "textarea":
      return (
        <Textarea
          placeholder={def.placeholder}
          {...field}
          value={(field.value as string) ?? ""}
          rows={def.rows || 3}
          onKeyDown={handleKeyDown}
          disabled={def.disabled}
          readOnly={def.readonly}
          tabIndex={def.readonly ? -1 : undefined}
          onFocus={(e) => {
            if (def.readonly) {
              e.currentTarget.blur()
              return
            }
            if (def.selectAllOnFocus) {
              const el = e.currentTarget
              setTimeout(() => el.select(), 0)
            }
          }}
          onClick={(e) => {
            if (def.selectAllOnFocus) e.currentTarget.select()
          }}
          className={cn("field-sizing-fixed", errorClass, readonlyClass)}
          style={def.rows ? { height: `${def.rows * 1.5 + 1}rem` } : undefined}
        />
      )

    case "checkbox":
      return (
        <div className={cn("flex items-center space-x-2", readonlyPointerClass)}>
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={def.disabled}
            className={cn(hasError && "border-destructive data-[state=checked]:bg-destructive")}
          />
          <FormLabel className={cn("font-normal cursor-pointer", hasError && "text-destructive")}>
            {def.required ? `${def.label} *` : def.label}
          </FormLabel>
        </div>
      )

    case "switch":
      return (
        <div className={cn("flex items-center space-x-2", readonlyPointerClass)}>
          <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={def.disabled}
            className={cn(
              hasError &&
                "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-destructive/30"
            )}
          />
          <FormLabel className={cn("font-normal cursor-pointer", hasError && "text-destructive")}>
            {def.required ? `${def.label} *` : def.label}
          </FormLabel>
        </div>
      )

    case "radio":
      return (
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={def.disabled}
          className={cn(
            "flex flex-col space-y-1",
            hasError && "[&_button]:border-destructive",
            readonlyPointerClass
          )}
        >
          {(def.options || []).map((opt: TsFieldOptions | string) => {
            const value = typeof opt === "string" ? opt : String(opt.value)
            const label = typeof opt === "string" ? opt : opt.label
            return (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${field.name}-${value}`} />
                <FormLabel
                  htmlFor={`${field.name}-${value}`}
                  className={cn("font-normal cursor-pointer", hasError && "text-destructive")}
                >
                  {label}
                </FormLabel>
              </div>
            )
          })}
        </RadioGroup>
      )

    case "button-group":
      if (def.variant === "process") {
        return <ProcessButtonGroup field={field} def={def} hasError={hasError} />
      }
      return (
        <div
          className={cn(
            "flex",
            def.disabled && "opacity-50 pointer-events-none",
            readonlyPointerClass
          )}
        >
          {(def.options || []).map((opt: TsFieldOptions | string, index, arr) => {
            let value: string
            let label: string
            let optVariant: string | undefined
            let isDisabled = false

            if (typeof opt === "string") {
              const parts = opt.split("/")
              // Format: value/enabled/variant/label
              value = parts[0]
              isDisabled = parts[1] === "false"
              optVariant = parts[2] || undefined
              label = parts[3] || parts[0]
            } else {
              value = String(opt.value)
              label = opt.label
              optVariant = opt.variant
              isDisabled = !!opt.disabled
            }

            const isActive = field.value === value
            const isFirst = index === 0
            const isLast = index === arr.length - 1

            // In reference: (value === val) ? (variant || 'primary') : (variant || 'default')
            // Mapping to Shadcn/UI variants:
            const variant = isActive
              ? ((optVariant || "default") as TsButtonVariant)
              : optVariant
                ? (optVariant as TsButtonVariant)
                : "outline"

            return (
              <Button
                key={value}
                type="button"
                variant={variant as TsButtonVariant}
                disabled={def.disabled || isDisabled}
                className={cn(
                  !isFirst && "-ml-px",
                  isFirst && !isLast && "rounded-r-none",
                  isLast && !isFirst && "rounded-l-none",
                  !isFirst && !isLast && "rounded-none",
                  isActive && "relative z-10",
                  hasError && "border-destructive text-destructive"
                )}
                onClick={() => {
                  if (!def.disabled && !def.readonly && !isDisabled) field.onChange(value)
                }}
              >
                {label}
              </Button>
            )
          })}
        </div>
      )

    case "slider":
      return <SliderWithTooltip field={field} def={def} hasError={hasError} />

    case "select":
      return (
        <Select onValueChange={field.onChange} value={field.value} disabled={def.disabled}>
          <SelectTrigger className={cn(errorClass, def.readonly ? "pointer-events-none" : "")}>
            <SelectValue placeholder={def.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {(def.options || []).map((opt: TsFieldOptions | string) => {
              const value = typeof opt === "string" ? opt : String(opt.value)
              const label = typeof opt === "string" ? opt : opt.label
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      )

    case "combobox":
      return <ComboboxWidget field={field} def={def} hasError={hasError} />

    case "multiselect":
      return <MultiSelectWidget field={field} def={def} hasError={hasError} />

    case "date":
      return <DatePickerWidget field={field} def={def} hasError={hasError} />

    case "datetime":
      return <DateTimeWidget field={field} def={def} hasError={hasError} />

    case "file":
    case "image":
      return <FileUploadWidget field={field} def={def} hasError={hasError} />

    case "infobox": {
      const v = def.variant || "default"
      const variantClasses: Record<string, string> = {
        destructive:
          "border-destructive/50 bg-destructive/10 text-destructive dark:text-red-400 [&>svg]:text-destructive",
        information:
          "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
        warning:
          "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500",
        success:
          "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 [&>svg]:text-green-500",
      }
      const iconMap: Record<string, React.ReactNode> = {
        default: <Info className="h-4 w-4" />,
        destructive: <Info className="h-4 w-4" />,
        information: <Info className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        success: <CheckCircle2 className="h-4 w-4" />,
      }
      return (
        <Alert variant="default" className={variantClasses[v] || ""}>
          {iconMap[v] || <Info className="h-4 w-4" />}
          {def.label && <AlertTitle>{def.label}</AlertTitle>}
          <AlertDescription>{(def.value as React.ReactNode) || def.content || ""}</AlertDescription>
        </Alert>
      )
    }

    case "markdown":
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2">
          <Markdown remarkPlugins={[remarkGfm]}>
            {(def.value as string) || def.content || ""}
          </Markdown>
        </div>
      )

    case "table":
      return (
        <div className="border rounded-md p-2">
          <TsTable
            data={(field.value as Record<string, unknown>[]) || []}
            columnDefinitions={def.columns || []}
            showCreateButton={def.showCreateButton}
          />
        </div>
      )

    case "button":
      return (
        <Button
          variant={(def.variant as "default") || "default"}
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            // Dispatch custom event for bubbling
            const event = new CustomEvent("form-field-action", {
              detail: { field: name, action: def.action },
              bubbles: true,
            })
            e.currentTarget.dispatchEvent(event)
          }}
        >
          {def.label}
        </Button>
      )

    case "separator":
      // Separator - consistent height with or without label
      return (
        <div className="py-2">
          <div className="relative h-5 flex items-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            {def.label && (
              <div className="relative flex justify-center w-full text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  {def.label}
                </span>
              </div>
            )}
          </div>
        </div>
      )

    case "empty":
      // Empty placeholder for layout purposes
      return <div className="min-h-[40px]" />

    case "relationship":
      // Relationship picker for entity selection
      return <RelationshipWidget field={field} def={def} hasError={hasError} />

    // This default case should never be reached if all TsFieldDef union members are handled above.
    // The compile-time exhaustiveness check below will error if a new type is added to TsFieldDef
    // without a corresponding case in this switch.
    default: {
      const _exhaustive: never = def
      const unknown = _exhaustive as { type: string }
      return (
        <div className="p-2 border border-destructive/50 text-destructive text-sm rounded bg-destructive/10">
          Unsupported widget: {unknown.type}
        </div>
      )
    }
  }
}

function ComboboxWidget({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsComboboxField
  hasError?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
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

  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = def.readonly ? "pointer-events-none" : ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={`popover-content-${name}`}
          className={cn(
            "w-full justify-between hover:bg-background dark:hover:bg-input/30",
            errorClass,
            readonlyClass
          )}
          disabled={def.disabled}
        >
          {field.value
            ? (options.find((framework) => framework.value === field.value)?.label ??
              (field.value as string))
            : def.placeholder || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id={`popover-content-${name}`}
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

function MultiSelectWidget({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsMultiselectField
  hasError?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const selectedValues: string[] = Array.isArray(field.value) ? (field.value as string[]) : []
  const options = (def.options || []).map((opt: TsFieldOptions | string) => {
    const value = typeof opt === "string" ? opt : String(opt.value)
    const label = typeof opt === "string" ? opt : opt.label
    return { value, label }
  })

  const toggleValue = (val: string) => {
    const newValues = selectedValues.includes(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val]
    field.onChange(newValues)
  }

  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {/* Use PopoverAnchor so the container div has no Radix click listener —
          X badge clicks can stopPropagation in React without being overridden */}
      <PopoverAnchor asChild>
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls={`popover-content-${name}`}
          tabIndex={def.disabled || def.readonly ? -1 : 0}
          onClick={() => {
            if (!def.disabled && !def.readonly) setOpen((v) => !v)
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !def.disabled && !def.readonly) {
              e.preventDefault()
              setOpen((v) => !v)
            }
          }}
          className={cn(
            "flex min-h-[40px] w-full cursor-pointer items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-xs",
            "hover:bg-accent dark:hover:bg-input/30",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            errorClass,
            def.disabled && "opacity-50 pointer-events-none",
            def.readonly && "pointer-events-none"
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => (
                <Badge key={val} variant="secondary" className="mr-1">
                  {options.find((o) => o.value === val)?.label || val}
                  {/* Badge applies [&>svg]:pointer-events-none to direct SVG children,
                      so wrap XIcon in a span to keep onClick functional */}
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
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{def.placeholder || "Select..."}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverAnchor>
      <PopoverContent
        id={`popover-content-${name}`}
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
              {options.map((opt) => (
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

/**
 * Relationship Widget - allows selecting entities from a relational table
 * Supports single or multiple selection modes
 */
function RelationshipWidget({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsRelationshipField
  hasError?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Configuration from field definition
  const mode = def.mode || "single"
  const targetEntity = def.targetEntity || ""

  const displayFields = React.useMemo(() => def.displayFields || ["name"], [def.displayFields])
  const chipDisplayFields = React.useMemo(
    () => def.chipDisplayFields || displayFields,
    [def.chipDisplayFields, displayFields]
  )

  const valueField = def.valueField || "id"
  const availableItems = React.useMemo(
    () => (def.options as unknown as Record<string, unknown>[]) || [],
    [def.options]
  )

  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = def.readonly ? "pointer-events-none" : ""

  // Value parsing - can be single ID, array ID or object/objects
  const selectedValues = React.useMemo(() => {
    if (!field.value) return []
    return Array.isArray(field.value) ? (field.value as unknown[]) : [field.value]
  }, [field.value])

  /**
   * Gets display text for an item
   */
  const getDisplayText = (item: unknown, fields: string[]) => {
    if (!item) return ""
    if (typeof item !== "object") {
      // Find item by ID
      const found = availableItems.find((i) => i[valueField] === item)
      if (found) {
        return fields
          .map((f) => String(found[f]))
          .filter(Boolean)
          .join(" ")
      }
      return String(item)
    }
    const obj = item as Record<string, unknown>
    return fields
      .map((f) => String(obj[f]))
      .filter(Boolean)
      .join(" ")
  }

  /**
   * Filters items based on search text
   */
  const filteredItems = React.useMemo(() => {
    if (!searchValue) return availableItems
    const lower = searchValue.toLowerCase()
    return availableItems.filter((item) => {
      const text = displayFields
        .map((f: string) => String(item[f]))
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return text.includes(lower)
    })
  }, [availableItems, searchValue, displayFields])

  /**
   * Selects/removes an item
   */
  const toggleItem = (item: Record<string, unknown>) => {
    const itemValue = item[valueField]

    if (mode === "single") {
      field.onChange(itemValue)
      setOpen(false)
    } else {
      const isSelected = selectedValues.includes(itemValue)
      if (isSelected) {
        field.onChange(selectedValues.filter((v) => v !== itemValue))
      } else {
        field.onChange([...selectedValues, itemValue])
      }
    }
  }

  /**
   * Removes item from selection (for chip)
   */
  const removeItem = (itemValue: unknown) => {
    if (mode === "single") {
      field.onChange(null)
    } else {
      field.onChange(selectedValues.filter((v) => v !== itemValue))
    }
  }

  /**
   * Checks if item is selected
   */
  const isSelected = (item: Record<string, unknown>) => selectedValues.includes(item[valueField])

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {/* Use PopoverAnchor so the container div has no Radix click listener —
          X badge clicks can stopPropagation in React without being overridden */}
      <PopoverAnchor asChild>
        {/* Input-like container with chips inside */}
        <div
          role="combobox"
          aria-expanded={open}
          aria-controls={`popover-content-${name}`}
          tabIndex={def.disabled || def.readonly ? -1 : 0}
          onClick={() => {
            if (!def.disabled && !def.readonly) setOpen((v) => !v)
          }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !def.disabled && !def.readonly) {
              e.preventDefault()
              setOpen((v) => !v)
            }
          }}
          className={cn(
            "flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-1 text-sm shadow-xs cursor-pointer",
            "dark:bg-input/30 transition-[color,box-shadow]",
            !readonlyClass &&
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            def.disabled && "opacity-50 pointer-events-none",
            readonlyClass && "pointer-events-none",
            errorClass
          )}
        >
          {/* Chips + placeholder area */}
          <div className="flex flex-1 items-center gap-1 overflow-hidden min-w-0 flex-nowrap">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground truncate">
                {def.placeholder || `Select ${targetEntity}...`}
              </span>
            ) : (
              <>
                {selectedValues.slice(0, 3).map((val) => (
                  <Badge
                    key={String(val)}
                    variant="secondary"
                    className="shrink-0 gap-1 text-xs h-6 max-w-[120px]"
                  >
                    <span className="truncate">{getDisplayText(val, chipDisplayFields)}</span>
                    {!def.readonly && !def.disabled && (
                      /* Badge applies [&>svg]:pointer-events-none to direct SVG children;
                         wrap in span so onClick fires */
                      <span
                        role="button"
                        tabIndex={0}
                        className="inline-flex cursor-pointer shrink-0 items-center hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeItem(val)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            e.stopPropagation()
                            removeItem(val)
                          }
                        }}
                      >
                        <XIcon className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </Badge>
                ))}
                {selectedValues.length > 3 && (
                  <Badge variant="outline" className="shrink-0 text-xs h-6 whitespace-nowrap">
                    +{selectedValues.length - 3}
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {selectedValues.length > 0 && !def.readonly && !def.disabled && (
              <XIcon
                className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  field.onChange(mode === "single" ? null : [])
                  setOpen(false)
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50" />
          </div>
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-auto min-w-75 p-0"
        align="start"
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
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${targetEntity}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-60">
            <CommandEmpty>
              {availableItems.length === 0 ? `No items in ${targetEntity}` : "Not found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={String(item[valueField])}
                  value={String(item[valueField])}
                  onSelect={() => toggleItem(item)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", isSelected(item) ? "opacity-100" : "opacity-0")}
                  />
                  {getDisplayText(item, displayFields)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ─── Helper functions for number formatting ──────────────────────────────────

function formatNumericValue(val: number | null | undefined, roundTo?: number): string {
  if (val === null || val === undefined || isNaN(val)) return ""
  let num = val
  if (roundTo !== undefined) {
    num = Math.round(num * Math.pow(10, roundTo)) / Math.pow(10, roundTo)
  }
  return new Intl.NumberFormat("cs-CZ", {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: roundTo !== undefined ? roundTo : 10,
  }).format(num)
}

function parseNumericValue(text: string): number | undefined {
  if (!text.trim()) return undefined
  const clean = text.replace(/\s/g, "").replace(",", ".")
  const num = parseFloat(clean)
  return isNaN(num) ? undefined : num
}

// ─── NumberWidget ─────────────────────────────────────────────────────────────

function NumberWidget({
  field,
  def,
  hasError = false,
  name,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsNumberField
  hasError?: boolean
  name: string
}) {
  const [displayValue, setDisplayValue] = React.useState<string>(() =>
    formatNumericValue(field.value as number | undefined, def.roundTo)
  )
  const [isFocused, setIsFocused] = React.useState(false)

  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""

  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumericValue(field.value as number | undefined, def.roundTo))
    }
  }, [field.value, isFocused, def.roundTo])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (def.readonly) {
      e.currentTarget.blur()
      return
    }
    setIsFocused(true)
    // Remove thousands separators for editing
    const clean = displayValue.replace(/\s/g, "")
    setDisplayValue(clean)
    const el = e.currentTarget
    setTimeout(() => el.select(), 0)
  }

  const handleBlur = () => {
    setIsFocused(false)
    const num = parseNumericValue(displayValue)
    field.onChange(num)
    field.onBlur()
    setDisplayValue(formatNumericValue(num, def.roundTo))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Allow: digits, spaces, minus, comma, dot
    const clean = val.replace(/[^0-9 .,-]/g, "")
    setDisplayValue(clean !== val ? clean : val)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (def.enterAction) {
        e.stopPropagation()
        const num = parseNumericValue(displayValue)
        field.onChange(num)
        const event = new CustomEvent("form-key-action", {
          detail: { key: "Enter", action: def.enterAction, field: name },
          bubbles: true,
        })
        ;(e.currentTarget as HTMLElement).dispatchEvent(event)
      } else {
        e.currentTarget.blur()
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      if (def.escapeAction && def.escapeAction !== "clear") {
        const event = new CustomEvent("form-key-action", {
          detail: { key: "Escape", action: def.escapeAction, field: name },
          bubbles: true,
        })
        ;(e.currentTarget as HTMLElement).dispatchEvent(event)
      } else {
        setDisplayValue("")
        field.onChange(undefined)
        e.currentTarget.blur()
      }
    }
  }

  return (
    <Input
      type="text"
      inputMode="decimal"
      placeholder={def.placeholder}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={def.disabled}
      readOnly={def.readonly}
      tabIndex={def.readonly ? -1 : undefined}
      className={cn("text-right tabular-nums", errorClass, readonlyClass)}
    />
  )
}

// ─── DateTimeWidget ───────────────────────────────────────────────────────────

function DateTimeWidget({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsDateTimeField
  hasError?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const dateFormat = def.dateFormat || "d.M.yyyy HH:mm"
  const [inputValue, setInputValue] = React.useState(() => {
    const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
    const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
    return validDate ? format(validDate, dateFormat, { locale: cs }) : ""
  })

  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""

  // Only sync input from field value when not focused
  React.useEffect(() => {
    if (isFocused) return
    const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
    const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
    if (validDate && !open) {
      setInputValue(format(validDate, dateFormat, { locale: cs }))
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
    const parsed = parse(inputValue, dateFormat, new Date(), { locale: cs })
    if (isValidDate(parsed)) {
      field.onChange(parsed)
    } else {
      const vd = getValidDate()
      setInputValue(vd ? format(vd, dateFormat, { locale: cs }) : "")
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
          className={cn(
            "pr-10",
            errorClass,
            def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""
          )}
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
          locale={cs}
        />
        <div className="border-t p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-10">Time</span>
            <Input
              type="time"
              value={getTimeValue()}
              onChange={handleTimeChange}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── FileUploadWidget ─────────────────────────────────────────────────────────

function FileUploadWidget({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsFileField
  hasError?: boolean
}) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const accept = def.accept || (def.type === "image" ? "image/*" : undefined)
  const multiple = def.multiple

  const files: File[] = React.useMemo(() => {
    if (!field.value) return []
    if (Array.isArray(field.value)) return (field.value as File[]).filter((f) => f instanceof File)
    if (field.value instanceof File) return [field.value]
    return []
  }, [field.value])

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
    if (multiple) {
      field.onChange([...files, ...newFiles])
    } else {
      field.onChange(newFiles[0])
    }
  }

  const removeFile = (index: number) => {
    if (multiple) {
      const updated = [...files]
      updated.splice(index, 1)
      field.onChange(updated.length > 0 ? updated : undefined)
    } else {
      field.onChange(undefined)
    }
  }

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const errorBorderClass = hasError
    ? "border-destructive"
    : "border-dashed border-muted-foreground/40"
  const isInteractive = !def.disabled && !def.readonly

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 text-center transition-colors",
          errorBorderClass,
          isInteractive && "cursor-pointer hover:border-primary hover:bg-muted/30",
          isDragOver && "border-primary bg-primary/5",
          !isInteractive && "opacity-50"
        )}
        onClick={() => isInteractive && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          if (isInteractive) setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          if (isInteractive && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
        }}
      >
        <CloudUpload className="h-8 w-8 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          {def.innerLabel ||
            (multiple ? "Drop files here or click to upload" : "Drop file here or click to upload")}
        </div>
        {accept && <div className="text-xs text-muted-foreground/70">{accept}</div>}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
            >
              <FileTextIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => downloadFile(file)}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              {isInteractive && (
                <button
                  type="button"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(index)}
                  title="Remove"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ProcessButtonGroup ───────────────────────────────────────────────────────

function ProcessButtonGroup({
  field,
  def,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsButtonGroupField
  hasError?: boolean
}) {
  const options = (def.options || []).map((opt: TsFieldOptions | string) => {
    if (typeof opt === "string") {
      const parts = opt.split("/")
      // Format: value/enabled/variant/label
      const value = parts[0]
      const isEnabled = parts[1] !== "false"
      const variant = parts[2] || undefined
      const label = parts[3] || parts[0]
      return { value, label, variant, disabled: !isEnabled }
    }
    return {
      value: String(opt.value),
      label: opt.label,
      variant: opt.variant,
      disabled: opt.disabled,
    }
  })

  const ARROW = 12

  const getClipPath = (): string => {
    // Arrow shape: pointed right, notched left (for all buttons)
    return `polygon(0 0, calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%, 0 100%, ${ARROW}px 50%)`
  }

  const getBgClass = (variant: string | undefined, isActive: boolean): string => {
    if (isActive) {
      switch (variant) {
        case "success":
          return "bg-green-600 text-white dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400"
        case "destructive":
        case "danger":
          return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        case "warning":
          return "bg-amber-500 text-white hover:bg-amber-600"
        case "secondary":
          return "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        default:
          return "bg-primary text-primary-foreground hover:bg-primary/90"
      }
    } else {
      // Inactive but with variant - dimmed color
      switch (variant) {
        case "success":
          return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
        case "destructive":
        case "danger":
          return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200"
        case "warning":
          return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200"
        case "secondary":
          return "bg-secondary/30 text-secondary-foreground hover:bg-secondary/50"
        default:
          return "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }
    }
  }

  return (
    <div className="flex items-stretch">
      {options.map((opt, index) => {
        const isActive = field.value === opt.value
        const clipPath = getClipPath()
        const isInteractive = !def.disabled && !def.readonly

        return (
          <div
            key={opt.value}
            className="relative h-10"
            style={{
              marginLeft: index > 0 ? `${-ARROW}px` : undefined,
              // Active button should be on top of its neighbors
              zIndex: isActive ? 10 : options.length - index,
            }}
          >
            <button
              type="button"
              disabled={def.disabled || opt.disabled}
              onClick={() => {
                if (isInteractive && !opt.disabled) field.onChange(opt.value)
              }}
              className={cn(
                "relative h-full px-10 text-sm font-medium transition-colors",
                getBgClass(opt.variant, isActive),
                (def.disabled || opt.disabled) && "opacity-50 cursor-not-allowed",
                def.readonly && "pointer-events-none"
              )}
              style={{ clipPath }}
            >
              {opt.label}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── DatePickerWidget ─────────────────────────────────────────────────────────

function DatePickerWidget({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsDateField
  hasError?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const dateFormat = def.dateFormat || "d.M.yyyy"
  const [inputValue, setInputValue] = React.useState(() => {
    const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
    const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
    return validDate ? format(validDate, dateFormat, { locale: cs }) : ""
  })

  // Compute calendar date from inputValue first, then field.value as fallback
  const calendarDate = React.useMemo(() => {
    if (inputValue.trim()) {
      const parsed = parse(inputValue, dateFormat, new Date(), { locale: cs })
      if (isValidDate(parsed)) return parsed
    }
    const dv = field.value ? new Date(field.value as string | number | Date) : undefined
    return dv && !isNaN(dv.getTime()) ? dv : undefined
  }, [inputValue, dateFormat, field.value])

  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""

  // Only sync input from field value when not focused
  React.useEffect(() => {
    if (isFocused) return
    const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
    const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
    if (validDate && !open) {
      setInputValue(format(validDate, dateFormat, { locale: cs }))
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
    const parsed = parse(inputValue, dateFormat, new Date(), { locale: cs })
    if (isValidDate(parsed)) {
      field.onChange(parsed)
    } else {
      // Revert to valid value if parsing fails
      const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
      const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
      setInputValue(validDate ? format(validDate, dateFormat, { locale: cs }) : "")
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
          className={cn(
            "pr-10",
            errorClass,
            def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""
          )}
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
          locale={cs}
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── SliderWithTooltip ────────────────────────────────────────────────────────

function SliderWithTooltip({
  field,
  def,
  hasError = false,
}: {
  field: ControllerRenderProps<FieldValues, string>
  def: TsSliderField
  hasError?: boolean
}) {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [localValue, setLocalValue] = React.useState<number>(field.value ?? def.min ?? 0)
  const readonlyPointerClass = def.readonly ? "pointer-events-none" : ""

  React.useEffect(() => {
    setLocalValue(field.value ?? def.min ?? 0)
  }, [field.value, def.min])

  const min = def.min ?? 0
  const max = def.max ?? 100
  const percent =
    max !== min ? Math.min(100, Math.max(0, ((localValue - min) / (max - min)) * 100)) : 0

  return (
    <div className={cn("relative py-2", readonlyPointerClass)}>
      {showTooltip && (
        <div
          className="absolute -top-7 -translate-x-1/2 pointer-events-none whitespace-nowrap rounded-md border bg-popover text-popover-foreground px-2 py-0.5 text-xs shadow-md z-50"
          style={{ left: `${percent}%` }}
        >
          {localValue}
        </div>
      )}
      <Slider
        value={[localValue]}
        max={max}
        min={min}
        step={def.step || 1}
        onValueChange={(vals: number[]) => {
          setLocalValue(vals[0])
          setShowTooltip(true)
        }}
        onValueCommit={(vals: number[]) => {
          field.onChange(vals[0])
          setTimeout(() => setShowTooltip(false), 300)
        }}
        onPointerDown={() => setShowTooltip(true)}
        disabled={def.disabled}
        className={cn(
          hasError && "[&_[role=slider]]:border-destructive [&_[role=slider]]:bg-destructive"
        )}
      />
    </div>
  )
}
