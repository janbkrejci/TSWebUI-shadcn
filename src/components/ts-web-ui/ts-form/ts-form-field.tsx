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

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        // External errors from TsForm's 'errors' prop are synchronized into react-hook-form's state.
        // We prioritize this live state over the static definition.
        const errorMessage = fieldState.error?.message || fieldDef.error
        const hasError = !!errorMessage

        return (
          <FormItem
            className={cn(fieldDef.hidden && "hidden", hasError && "[&_label]:text-destructive")}
          >
            {!WIDGETS_WITHOUT_EXTERNAL_LABEL.has(fieldDef.type) && (
              <FormLabel className={cn(hasError && "text-destructive")}>
                {fieldDef.required ? `${fieldDef.label} *` : fieldDef.label}
              </FormLabel>
            )}

            <FormControl>{renderWidget(field, fieldDef, name, errorMessage)}</FormControl>

            <FormMessage />

            {/* Hint message (only shown if no error) */}
            {!hasError && fieldDef.hint && (
              <FormDescription className="leading-none">{fieldDef.hint}</FormDescription>
            )}
          </FormItem>
        )
      }}
    />
  )
}

function renderWidget(
  field: ControllerRenderProps<FieldValues, string>,
  def: TsFieldDef,
  name: string,
  error?: string
) {
  switch (def.type) {
    case "text":
    case "password":
      return <TextWidget field={field} def={def} name={name} error={error} />
    case "textarea":
      return <TextareaWidget field={field} def={def} name={name} error={error} />
    case "number":
      return <NumberWidget field={field} def={def} name={name} error={error} />
    case "slider":
      return <SliderWidget field={field} def={def} name={name} error={error} />
    case "select":
      return <SelectWidget field={field} def={def} name={name} error={error} />
    case "combobox":
      return <ComboboxWidget field={field} def={def} name={name} error={error} />
    case "multiselect":
      return <MultiSelectWidget field={field} def={def} name={name} error={error} />
    case "checkbox":
      return <CheckboxWidget field={field} def={def} name={name} error={error} />
    case "switch":
      return <SwitchWidget field={field} def={def} name={name} error={error} />
    case "radio":
      return <RadioWidget field={field} def={def} name={name} error={error} />
    case "button-group":
      return <ButtonGroupWidget field={field} def={def} name={name} error={error} />
    case "date":
      return <DateWidget field={field} def={def} name={name} error={error} />
    case "datetime":
      return <DateTimeWidget field={field} def={def} name={name} error={error} />
    case "file":
    case "image":
      return <FileWidget field={field} def={def} name={name} error={error} />
    case "infobox":
      return <InfoboxWidget def={def} />
    case "markdown":
      return <MarkdownWidget def={def} error={error} />
    case "table":
      return <TableWidget field={field} def={def} error={error} />
    case "button":
      return <ButtonWidget def={def} name={name} />
    case "separator":
      return <SeparatorWidget def={def} />
    case "empty":
      return <EmptyWidget def={def} error={error} />
    case "relationship":
      return <RelationshipWidget field={field} def={def} name={name} error={error} />
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
