"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { cn } from "@/lib/utils"

import { TsFieldDef } from "./types"
import { ButtonGroupWidget } from "./widgets/button-group-widget"
import { ButtonWidget } from "./widgets/button-widget"
import { CheckboxWidget } from "./widgets/checkbox-widget"
import { ComboboxWidget } from "./widgets/combobox-widget"
import { DateWidget } from "./widgets/date-widget"
import { DateTimeWidget } from "./widgets/datetime-widget"
import { EmptyWidget } from "./widgets/empty-widget"
import { FileWidget } from "./widgets/file-widget"
import { InfoboxWidget } from "./widgets/infobox-widget"
import { MarkdownWidget } from "./widgets/markdown-widget"
import { MultiSelectWidget } from "./widgets/multi-select-widget"
import { NumberWidget } from "./widgets/number-widget"
import { RadioWidget } from "./widgets/radio-widget"
import { RelationshipWidget } from "./widgets/relationship-widget"
import { SelectWidget } from "./widgets/select-widget"
import { SeparatorWidget } from "./widgets/separator-widget"
import { SliderWidget } from "./widgets/slider-widget"
import { SwitchWidget } from "./widgets/switch-widget"
import { TableWidget } from "./widgets/table-widget"
import { TextWidget } from "./widgets/text-widget"
import { TextareaWidget } from "./widgets/textarea-widget"

interface TsFormFieldProps {
  name: string
  fieldDef: TsFieldDef
}

/**
 * Mapping of widget types that handle their own labels internally or don't need one.
 */
const WIDGETS_WITHOUT_EXTERNAL_LABEL: Set<TsFieldDef["type"]> = new Set([
  "checkbox",
  "switch",
  "infobox",
  "button",
  "separator",
  "empty",
  "markdown",
])

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
          {!WIDGETS_WITHOUT_EXTERNAL_LABEL.has(fieldDef.type) && (
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
  switch (def.type) {
    case "text":
    case "password":
      return <TextWidget field={field} def={def} name={name} hasError={hasError} />
    case "textarea":
      return <TextareaWidget field={field} def={def} name={name} hasError={hasError} />
    case "number":
      return <NumberWidget field={field} def={def} name={name} hasError={hasError} />
    case "slider":
      return <SliderWidget field={field} def={def} name={name} hasError={hasError} />
    case "select":
      return <SelectWidget field={field} def={def} name={name} hasError={hasError} />
    case "combobox":
      return <ComboboxWidget field={field} def={def} name={name} hasError={hasError} />
    case "multiselect":
      return <MultiSelectWidget field={field} def={def} name={name} hasError={hasError} />
    case "checkbox":
      return <CheckboxWidget field={field} def={def} name={name} hasError={hasError} />
    case "switch":
      return <SwitchWidget field={field} def={def} name={name} hasError={hasError} />
    case "radio":
      return <RadioWidget field={field} def={def} name={name} hasError={hasError} />
    case "button-group":
      return <ButtonGroupWidget field={field} def={def} name={name} hasError={hasError} />
    case "date":
      return <DateWidget field={field} def={def} name={name} hasError={hasError} />
    case "datetime":
      return <DateTimeWidget field={field} def={def} name={name} hasError={hasError} />
    case "file":
    case "image":
      return <FileWidget field={field} def={def} name={name} hasError={hasError} />
    case "infobox":
      return <InfoboxWidget def={def} name={name} hasError={hasError} />
    case "markdown":
      return <MarkdownWidget def={def} name={name} hasError={hasError} />
    case "table":
      return <TableWidget field={field} def={def} name={name} hasError={hasError} />
    case "button":
      return <ButtonWidget def={def} name={name} />
    case "separator":
      return <SeparatorWidget def={def} name={name} hasError={hasError} />
    case "empty":
      return <EmptyWidget def={def} name={name} hasError={hasError} />
    case "relationship":
      return <RelationshipWidget field={field} def={def} name={name} hasError={hasError} />
    default: {
      const _exhaustive: never = def
      return (
        <div className="p-2 border border-destructive/50 text-destructive text-sm rounded bg-destructive/10">
          Unsupported widget: {(_exhaustive as { type: string }).type}
        </div>
      )
    }
  }
}
