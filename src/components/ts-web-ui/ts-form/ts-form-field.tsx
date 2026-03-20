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
import { TextWidget } from "./widgets/text-widget"
import { TextareaWidget } from "./widgets/textarea-widget"
import { TableWidget } from "./widgets/ts-table-widget"

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
        const shouldShowLabel =
          !WIDGETS_WITHOUT_EXTERNAL_LABEL.has(fieldDef.type) && !fieldDef.hideLabel

        return (
          <FormItem className="space-y-0" data-field={name}>
            {/* 
              Top-aligned grid rule: We use a fixed-height label slot (min-h-14) 
              to ensure all widgets in the same row start at the same vertical position
              even if labels wrap up to 3 lines or are missing.
            */}
            {shouldShowLabel ? (
              <div className="min-h-14 flex items-end">
                <FormLabel className={cn("pb-1 leading-tight", errorMessage && "text-destructive")}>
                  {fieldDef.label}
                  {fieldDef.required && (
                    <>
                      {" "}
                      <span aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </>
                  )}
                </FormLabel>
              </div>
            ) : (
              // Empty but sized placeholder for alignment in complex grid layouts
              <div className="min-h-14" aria-hidden="true" />
            )}

            <FormControl>
              {renderWidget(
                field,
                fieldDef,
                name,
                errorMessage || undefined,
                fieldDef.hint,
                fieldDef.readonly,
                fieldDef.hideLabel ? fieldDef.label || name : fieldDef.label || name,
                fieldDef.autofocus
              )}
            </FormControl>

            {/* Error/Hint slot with fixed minimum height to prevent row jumping */}
            <div className="min-h-8 mt-1">
              {errorMessage ? (
                <FormMessage className="text-xs leading-tight">{errorMessage}</FormMessage>
              ) : (
                fieldDef.hint && (
                  <FormDescription className="text-xs leading-tight">
                    {fieldDef.hint}
                  </FormDescription>
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
  hint?: string | undefined,
  readOnly?: boolean,
  ariaLabel?: string,
  autoFocus?: boolean
) {
  const commonProps = {
    field,
    name,
    error,
    hint,
    readOnly,
    autoFocus,
    "aria-label": ariaLabel,
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
      return <InfoboxWidget {...commonProps} def={def} />
    case "markdown":
      return <MarkdownWidget {...commonProps} def={def} />
    case "table":
      return <TableWidget {...commonProps} def={def} />
    case "button":
      return <ButtonWidget {...commonProps} def={def} />
    case "separator":
      return <SeparatorWidget {...commonProps} def={def} />
    case "empty":
      return <EmptyWidget {...commonProps} def={def} />
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
