"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import Markdown from "react-markdown"
import { TsFieldDef } from "./types"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, Info, Upload, X as XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import { TsTable } from "../ts-table"

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
        <FormItem className={cn(
          fieldDef.hidden && "hidden",
          hasError && "[&_label]:text-destructive"
        )}>
          {/* Label is rendered unless it's a checkbox/switch/infobox/button/separator/empty/markdown */}
          {fieldDef.type !== "checkbox" && 
           fieldDef.type !== "switch" && 
           fieldDef.type !== "infobox" && 
           fieldDef.type !== "button" && 
           fieldDef.type !== "separator" && 
           fieldDef.type !== "empty" && 
           fieldDef.type !== "markdown" && (
            <FormLabel className={cn(hasError && "text-destructive")}>
                {fieldDef.label} 
                {fieldDef.required && <span className="ml-1">*</span>}
            </FormLabel>
          )}
          
          <FormControl>
            {renderWidget(field, fieldDef, name, hasError)}
          </FormControl>
          
          {/* Error message has priority over hint */}
          {hasError ? (
            <p className="text-sm text-destructive">{fieldDef.error}</p>
          ) : (
            fieldDef.hint && <FormDescription>{fieldDef.hint}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function renderWidget(field: any, def: TsFieldDef, name: string, hasError: boolean = false) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
          e.preventDefault()
          if (def.type === 'number') {
              field.onChange(undefined)
          } else {
              field.onChange("")
          }
      }
  }

  // Shared classes for error state and readonly styling
  const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
  const readonlyClass = def.readonly ? "bg-muted/50 cursor-default focus:ring-0" : ""

  switch (def.type) {
    case "text":
    case "password":
      return (
        <Input 
          type={def.type} 
          placeholder={def.placeholder} 
          {...field} 
          value={field.value ?? ""} 
          onKeyDown={handleKeyDown} 
          disabled={def.disabled}
          readOnly={def.readonly}
          className={cn(errorClass, readonlyClass)}
        />
      )
    
    case "number":
      return (
        <Input 
            type="number" 
            placeholder={def.placeholder} 
            {...field} 
            value={field.value ?? ""}
            onChange={e => {
                const val = e.target.value
                field.onChange(val === "" ? undefined : e.target.valueAsNumber)
            }}
            onKeyDown={handleKeyDown}
            min={def.min}
            max={def.max}
            step={def.step}
            disabled={def.disabled}
            readOnly={def.readonly}
            className={cn(errorClass, readonlyClass)}
        />
      )

    case "textarea":
      return (
        <Textarea 
          placeholder={def.placeholder} 
          {...field} 
          value={field.value ?? ""} 
          rows={def.rows || 3} 
          onKeyDown={handleKeyDown} 
          disabled={def.disabled}
          readOnly={def.readonly}
          className={cn(errorClass, readonlyClass)}
        />
      )

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
            <Checkbox 
                checked={!!field.value} 
                onCheckedChange={field.onChange} 
                disabled={def.disabled || def.readonly}
                className={cn(hasError && "border-destructive data-[state=checked]:bg-destructive")}
            />
            <FormLabel className={cn("font-normal cursor-pointer", hasError && "text-destructive")}>
                {def.label}
                {def.required && <span className="ml-1">*</span>}
            </FormLabel>
        </div>
      )

    case "switch":
        return (
            <div className="flex items-center space-x-2">
                <Switch 
                    checked={!!field.value} 
                    onCheckedChange={field.onChange}
                    disabled={def.disabled || def.readonly}
                    className={cn(hasError && "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-destructive/30")}
                />
                <FormLabel className={cn("font-normal cursor-pointer", hasError && "text-destructive")}>
                    {def.label}
                    {def.required && <span className="ml-1">*</span>}
                </FormLabel>
            </div>
        )

    case "radio":
        return (
            <RadioGroup 
                onValueChange={field.onChange} 
                defaultValue={field.value} 
                disabled={def.disabled || def.readonly} 
                className={cn("flex flex-col space-y-1", hasError && "[&_button]:border-destructive")}
            >
                {(def.options || []).map((opt: any) => {
                    const value = typeof opt === 'string' ? opt : opt.value
                    const label = typeof opt === 'string' ? opt : opt.label
                    return (
                        <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={`${field.name}-${value}`} />
                            <FormLabel htmlFor={`${field.name}-${value}`} className={cn("font-normal cursor-pointer", hasError && "text-destructive")}>{label}</FormLabel>
                        </div>
                    )
                })}
            </RadioGroup>
        )

    case "button-group":
        return (
            <ToggleGroup 
                type="single" 
                value={field.value} 
                onValueChange={field.onChange} 
                disabled={def.disabled || def.readonly}
                className={cn(hasError && "[&_button]:border-destructive [&_button[data-state=on]]:bg-destructive")}
            >
                {(def.options || []).map((opt: any) => {
                    // format value/enabled/variant/Label or just value/label or object
                    // Assuming object {value, label} or string "value/Label"
                    let value = typeof opt === 'string' ? opt.split('/')[0] : opt.value
                    let label = typeof opt === 'string' ? opt.split('/').pop() : opt.label
                    
                    return (
                        <ToggleGroupItem key={value} value={value} aria-label={label}>
                            {label}
                        </ToggleGroupItem>
                    )
                })}
            </ToggleGroup>
        )

    case "slider":
        return (
            <div className="py-4">
                <Slider 
                    defaultValue={[field.value || def.min || 0]} 
                    max={def.max || 100} 
                    min={def.min || 0} 
                    step={def.step || 1}
                    onValueChange={(vals: number[]) => field.onChange(vals[0])}
                    disabled={def.disabled || def.readonly}
                    className={cn(hasError && "[&_[role=slider]]:border-destructive [&_[role=slider]]:bg-destructive")}
                />
            </div>
        )

    case "select":
      return (
        <Select onValueChange={field.onChange} value={field.value} disabled={def.disabled || def.readonly}>
          <SelectTrigger className={cn(errorClass, readonlyClass)}>
            <SelectValue placeholder={def.placeholder || "Vyberte..."} />
          </SelectTrigger>
          <SelectContent>
            {(def.options || []).map((opt: any) => {
                const value = typeof opt === 'string' ? opt : opt.value
                const label = typeof opt === 'string' ? opt : opt.label
                return <SelectItem key={value} value={value}>{label}</SelectItem>
            })}
          </SelectContent>
        </Select>
      )

    case "combobox":
        return <ComboboxWidget field={field} def={def} hasError={hasError} />

    case "multiselect":
        return <MultiSelectWidget field={field} def={def} hasError={hasError} />

    case "date":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !field.value && "text-muted-foreground",
                errorClass,
                readonlyClass
              )}
              disabled={def.disabled || def.readonly}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, "PPP", { locale: cs }) : <span>{def.placeholder || "Vyberte datum"}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
              locale={cs}
            />
          </PopoverContent>
        </Popover>
      )

    case "datetime":
        return (
            <Input 
                type="datetime-local" 
                {...field} 
                value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                disabled={def.disabled}
                readOnly={def.readonly}
                className={cn(errorClass, readonlyClass)}
            />
        )

    case "file":
    case "image":
        return (
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input 
                    type="file" 
                    accept={def.accept || (def.type === 'image' ? "image/*" : undefined)}
                    multiple={def.multiple}
                    disabled={def.disabled}
                    readOnly={def.readonly}
                    className={cn(errorClass, readonlyClass, def.readonly && "pointer-events-none")}
                    onChange={(e) => {
                        const files = e.target.files
                        if (def.multiple) {
                            field.onChange(files)
                        } else {
                            field.onChange(files?.[0])
                        }
                    }}
                />
            </div>
        )

    case "infobox":
        return (
            <Alert variant={def.variant as any || "default"}>
                <Info className="h-4 w-4" />
                <AlertTitle>{def.label || "Info"}</AlertTitle>
                <AlertDescription>
                    {def.value || def.content || "Obsah infoboxu"}
                </AlertDescription>
            </Alert>
        )
    
    case "markdown":
        return (
            <div className="prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/50 text-sm">
                <Markdown>{def.value || def.content || ""}</Markdown>
            </div>
        )

    case "table":
        return (
            <div className="border rounded-md p-2">
                <TsTable 
                    data={field.value || []} 
                    columnDefinitions={(def as any).columns || []}
                    showCreateButton={(def as any).showCreateButton}
                    // Pass other props if needed, but data binding is tricky without specific table editing features
                />
            </div>
        )

    case "button":
        return (
            <Button 
                variant={def.variant as any} 
                className="w-full"
                onClick={(e) => {
                    e.preventDefault()
                    // Dispatch custom event for bubbling
                    const event = new CustomEvent('form-field-action', { 
                        detail: { field: name, action: (def as any).action },
                        bubbles: true 
                    })
                    e.target.dispatchEvent(event)
                }}
            >
                {def.label}
            </Button>
        )

    case "separator":
        // Oddělovač - vizuální prvek bez hodnoty
        return (
            <div className="py-2">
                {def.label ? (
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium">
                                {def.label}
                            </span>
                        </div>
                    </div>
                ) : (
                    <hr className="border-t" />
                )}
            </div>
        )

    case "empty":
        // Prázdný placeholder pro layout účely
        return <div className="min-h-[40px]" />

    case "relationship":
        // Relationship picker pro výběr entit
        return <RelationshipWidget field={field} def={def} hasError={hasError} />
    
    // Fallback for not implemented
    default:
        return <div className="p-2 border border-destructive/50 text-destructive text-sm rounded bg-destructive/10">Unsupported widget: {def.type}</div>
  }
}

function ComboboxWidget({ field, def, hasError = false }: { field: any, def: TsFieldDef, hasError?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    const options = (def.options || []).map((opt: any) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return { value, label }
    })

    // Allow custom value if not found
    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchValue.toLowerCase()))
    const showCustom = (def as any).allowCustom && searchValue && !options.find(o => o.label.toLowerCase() === searchValue.toLowerCase())

    const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
    const readonlyClass = def.readonly ? "bg-muted/50 cursor-default" : ""

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", errorClass, readonlyClass)}
                    disabled={def.disabled || def.readonly}
                >
                    {field.value
                        ? options.find((framework) => framework.value === field.value)?.label ?? field.value
                        : (def.placeholder || "Vyberte...")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput 
                        placeholder={def.placeholder || "Hledat..."} 
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {showCustom ? (
                                <div 
                                    className="p-2 cursor-pointer hover:bg-muted text-sm"
                                    onClick={() => {
                                        field.onChange(searchValue)
                                        setOpen(false)
                                    }}
                                >
                                    Použít: "{searchValue}"
                                </div>
                            ) : "Nenalezeno."}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.label} 
                                    onSelect={(currentValue: string) => {
                                        // Shadcn command returns lowercase label as value
                                        // We need to map back to original value
                                        // Simple lookup by label
                                        const original = options.find(o => o.label.toLowerCase() === currentValue.toLowerCase())
                                        field.onChange(original ? original.value : currentValue)
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
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function MultiSelectWidget({ field, def, hasError = false }: { field: any, def: TsFieldDef, hasError?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const selectedValues: string[] = Array.isArray(field.value) ? field.value : []
    const options = (def.options || []).map((opt: any) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return { value, label }
    })

    const toggleValue = (val: string) => {
        const newValues = selectedValues.includes(val)
            ? selectedValues.filter(v => v !== val)
            : [...selectedValues, val]
        field.onChange(newValues)
    }

    const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
    const readonlyClass = def.readonly ? "bg-muted/50 cursor-default" : ""

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between h-auto min-h-[40px]", errorClass, readonlyClass)}
                    disabled={def.disabled || def.readonly}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedValues.length > 0 ? (
                            selectedValues.map(val => (
                                <Badge key={val} variant="secondary" className="mr-1">
                                    {options.find(o => o.value === val)?.label || val}
                                    <XIcon 
                                        className="ml-1 h-3 w-3 cursor-pointer" 
                                        onClick={(e) => { e.stopPropagation(); toggleValue(val) }}
                                    />
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">{def.placeholder || "Vyberte..."}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={def.placeholder || "Hledat..."} />
                    <CommandList>
                        <CommandEmpty>Nenalezeno.</CommandEmpty>
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
 * Relationship Widget - umožňuje vybírat entity z relacionální tabulky
 * Podporuje single (jeden záznam) nebo multiple (více záznamů) režim
 */
function RelationshipWidget({ field, def, hasError = false }: { field: any, def: TsFieldDef, hasError?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    
    // Konfigurace z field definice
    const mode = (def as any).mode || 'single'
    const targetEntity = (def as any).targetEntity || ''
    const displayFields = (def as any).displayFields || ['name']
    const chipDisplayFields = (def as any).chipDisplayFields || displayFields
    const valueField = (def as any).valueField || 'id'
    const availableItems = (def as any).options || []

    const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
    const readonlyClass = def.readonly ? "bg-muted/50 cursor-default" : ""
    
    // Parsování hodnoty - může být single ID nebo array ID nebo objekt/objekty
    const selectedValues = React.useMemo(() => {
        if (!field.value) return []
        if (mode === 'single') {
            return Array.isArray(field.value) ? field.value : [field.value]
        }
        return Array.isArray(field.value) ? field.value : [field.value]
    }, [field.value, mode])

    /**
     * Získá zobrazovaný text pro položku
     */
    const getDisplayText = (item: any, fields: string[]) => {
        if (!item) return ''
        if (typeof item !== 'object') {
            // Najdi položku podle ID
            const found = availableItems.find((i: any) => i[valueField] === item)
            if (found) {
                return fields.map(f => found[f]).filter(Boolean).join(' ')
            }
            return String(item)
        }
        return fields.map(f => item[f]).filter(Boolean).join(' ')
    }

    /**
     * Filtruje položky podle vyhledávacího textu
     */
    const filteredItems = React.useMemo(() => {
        if (!searchValue) return availableItems
        const lower = searchValue.toLowerCase()
        return availableItems.filter((item: any) => {
            const text = displayFields.map((f: string) => item[f]).filter(Boolean).join(' ').toLowerCase()
            return text.includes(lower)
        })
    }, [availableItems, searchValue, displayFields])

    /**
     * Vybere/odebere položku
     */
    const toggleItem = (item: any) => {
        const itemValue = item[valueField]
        
        if (mode === 'single') {
            field.onChange(itemValue)
            setOpen(false)
        } else {
            const isSelected = selectedValues.includes(itemValue)
            if (isSelected) {
                field.onChange(selectedValues.filter((v: any) => v !== itemValue))
            } else {
                field.onChange([...selectedValues, itemValue])
            }
        }
    }

    /**
     * Odebere položku z výběru (pro chip)
     */
    const removeItem = (itemValue: any) => {
        if (mode === 'single') {
            field.onChange(null)
        } else {
            field.onChange(selectedValues.filter((v: any) => v !== itemValue))
        }
    }

    /**
     * Zjistí, zda je položka vybrána
     */
    const isSelected = (item: any) => selectedValues.includes(item[valueField])

    return (
        <div className="space-y-2">
            {/* Vybrané položky jako chipy */}
            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedValues.map((val: any) => (
                        <Badge key={val} variant="secondary">
                            {getDisplayText(val, chipDisplayFields)}
                            <XIcon 
                                className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                                onClick={() => removeItem(val)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Picker button */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between", errorClass, readonlyClass)}
                        disabled={def.disabled || def.readonly}
                    >
                        {selectedValues.length === 0 ? (
                            <span className="text-muted-foreground">
                                {def.placeholder || `Vyberte ${targetEntity}...`}
                            </span>
                        ) : (
                            <span className="text-muted-foreground text-sm">
                                {mode === 'single' ? 'Změnit výběr' : 'Přidat další'}
                            </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput 
                            placeholder={`Hledat ${targetEntity}...`}
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {availableItems.length === 0 
                                    ? `Žádné položky v ${targetEntity}`
                                    : 'Nenalezeno.'
                                }
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredItems.map((item: any) => (
                                    <CommandItem
                                        key={item[valueField]}
                                        value={String(item[valueField])}
                                        onSelect={() => toggleItem(item)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected(item) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {getDisplayText(item, displayFields)}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}