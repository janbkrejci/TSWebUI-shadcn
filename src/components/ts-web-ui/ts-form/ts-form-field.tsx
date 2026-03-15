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
        if (fieldDef.hidden) return <></>

        // External dynamic error (from form props or manual setError) has priority.
        // The fieldDef.error is a static fallback from the JSON definition itself.
        const errorMessage = fieldState.error?.message || fieldDef.error
        const showExternalLabel = !WIDGETS_WITHOUT_EXTERNAL_LABEL.has(fieldDef.type)

        return (
          <FormItem className="flex flex-col" data-field={name}>
            {/* 
              Top-aligned grid rule: Only render the label slot if needed.
              We still use min-h-6 to keep interactive elements aligned across the row 
              if other fields in the same row have labels.
            */}
            {showExternalLabel ? (
              <div className="min-h-6 flex items-end">
                <FormLabel className={cn("pb-1", errorMessage && "text-destructive")}>
                  {fieldDef.label}
                  {fieldDef.required ? " *" : ""}
                </FormLabel>
              </div>
            ) : (
              // Empty but sized placeholder for alignment in complex grid layouts
              <div className="min-h-6" aria-hidden="true" />
            )}

            <FormControl>
              {renderWidget(field, fieldDef, name, errorMessage || undefined, fieldDef.hint)}
            </FormControl>

            <div className="min-h-5 mt-1 space-y-1">
              {errorMessage ? (
                <FormMessage>{errorMessage}</FormMessage>
              ) : (
                fieldDef.hint && (
                  <FormDescription className="leading-tight">{fieldDef.hint}</FormDescription>
                )
              )}
            </div>
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
  error?: string | undefined,
  hint?: string | undefined
) {
  const commonProps = {
    field,
    name,
    error,
    hint,
    "aria-required": def.required,
  }

  switch (def.type) {
    case "text":
    case "password":
      return <TextWidget {...commonProps} def={def} />
    case "textarea":
      return <TextareaWidget {...commonProps} def={def} />
    case "number":
      return <NumberWidget {...commonProps} def={def} />
    case "slider":
      return <SliderWidget {...commonProps} def={def} />
    case "select":
      return <SelectWidget {...commonProps} def={def} />
    case "combobox":
      return <ComboboxWidget {...commonProps} def={def} />
    case "multiselect":
      return <MultiSelectWidget {...commonProps} def={def} />
    case "checkbox":
      return <CheckboxWidget {...commonProps} def={def} />
    case "switch":
      return <SwitchWidget {...commonProps} def={def} />
    case "radio":
      return <RadioWidget {...commonProps} def={def} />
    case "button-group":
      return <ButtonGroupWidget {...commonProps} def={def} />
    case "date":
      return <DateWidget {...commonProps} def={def} />
    case "datetime":
      return <DateTimeWidget {...commonProps} def={def} />
    case "file":
      return <FileWidget {...commonProps} def={def} />
    case "infobox":
      return <InfoboxWidget def={def} />
    case "markdown":
      return <MarkdownWidget def={def} error={error} />
    case "table":
      return <TableWidget field={field} def={def} name={name} error={error} />
    case "button":
      return <ButtonWidget def={def} name={name} />
    case "separator":
      return <SeparatorWidget def={def} />
    case "empty":
      return <EmptyWidget def={def} error={error} />
    case "relationship":
      return <RelationshipWidget {...commonProps} def={def} />
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
