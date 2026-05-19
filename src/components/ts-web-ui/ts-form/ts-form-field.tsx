"use client"

import * as React from "react"
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form"
import { useTsLocale } from "@/components/ts-web-ui/locale"
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
  externalError?: string
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

export function TsFormField({ name, fieldDef, externalError }: TsFormFieldProps) {
  const form = useFormContext()
  const tf = useTsLocale().strings.form

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        if (fieldDef.hidden) return <></>

        // External dynamic error (from form props or manual setError) has priority.
        // The fieldDef.error is a static fallback from the JSON definition itself.
        const errorMessage = (fieldState.error?.message || externalError || fieldDef.error) as
          | string
          | undefined
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
              <div className="min-h-8 flex items-end">
                <FormLabel
                  className={cn("pb-0.5 leading-tight", errorMessage && "text-destructive")}
                >
                  {fieldDef.label as string}
                  {!!fieldDef.required && (
                    <>
                      {" "}
                      <span aria-hidden="true">*</span>
                      <span className="sr-only">{tf.required}</span>
                    </>
                  )}
                </FormLabel>
              </div>
            ) : (
              // Empty but sized placeholder for alignment in complex grid layouts
              <div className="min-h-8" aria-hidden="true" />
            )}

            <FormControl>
              {renderWidget(
                field,
                fieldDef,
                name,
                errorMessage || undefined,
                fieldDef.hint as string | undefined,
                fieldDef.readonly as boolean | undefined,
                (fieldDef.hideLabel ? fieldDef.label || name : fieldDef.label || name) as string,
                fieldDef.autofocus as boolean | undefined,
                tf.unsupportedWidget
              )}
            </FormControl>

            {/* Error/Hint slot with fixed minimum height to prevent row jumping */}
            <div className="min-h-4">
              {errorMessage ? (
                <FormMessage className="text-xs leading-tight">{errorMessage}</FormMessage>
              ) : (
                !!fieldDef.hint && (
                  <FormDescription className="text-xs leading-tight">
                    {fieldDef.hint as string}
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
  autoFocus?: boolean,
  unsupportedWidgetLabel?: string
) {
  const commonProps = {
    field,
    name,
    error,
    hint,
    readOnly,
    autoFocus,
    "aria-label": ariaLabel,
    "aria-required": def.required as boolean | undefined,
  }

  // Cast to Exclude to remove the catch-all Record<string, unknown> variant
  // so that the switch statement can properly narrow the discriminated union.
  type KnownFieldDef = Exclude<TsFieldDef, Record<string, unknown> & { type: string }>
  const knownDef = def as KnownFieldDef

  switch (knownDef.type) {
    case "text":
    case "password":
      return <TextWidget {...commonProps} def={knownDef} />
    case "textarea":
      return <TextareaWidget {...commonProps} def={knownDef} />
    case "number":
      return <NumberWidget {...commonProps} def={knownDef} />
    case "slider":
      return <SliderWidget {...commonProps} def={knownDef} />
    case "select":
      return <SelectWidget {...commonProps} def={knownDef} />
    case "combobox":
      return <ComboboxWidget {...commonProps} def={knownDef} />
    case "multiselect":
      return <MultiSelectWidget {...commonProps} def={knownDef} />
    case "checkbox":
      return <CheckboxWidget {...commonProps} def={knownDef} />
    case "switch":
      return <SwitchWidget {...commonProps} def={knownDef} />
    case "radio":
      return <RadioWidget {...commonProps} def={knownDef} />
    case "button-group":
      return <ButtonGroupWidget {...commonProps} def={knownDef} />
    case "date":
      return <DateWidget {...commonProps} def={knownDef} />
    case "datetime":
      return <DateTimeWidget {...commonProps} def={knownDef} />
    case "file":
      return <FileWidget {...commonProps} def={knownDef} />
    case "infobox":
      return <InfoboxWidget {...commonProps} def={knownDef} />
    case "markdown":
      return <MarkdownWidget {...commonProps} def={knownDef} />
    case "table":
      return <TableWidget {...commonProps} def={knownDef} />
    case "button":
      return <ButtonWidget {...commonProps} def={knownDef} />
    case "separator":
      return <SeparatorWidget {...commonProps} def={knownDef} />
    case "empty":
      return <EmptyWidget {...commonProps} def={knownDef} />
    case "relationship":
      return <RelationshipWidget {...commonProps} def={knownDef} />
    default: {
      const _exhaustive: never = knownDef
      return (
        <div className="p-2 border border-destructive/50 text-destructive text-sm rounded bg-destructive/10">
          {unsupportedWidgetLabel ?? "Unsupported widget: "}{" "}
          {(_exhaustive as { type: string }).type}
        </div>
      )
    }
  }
}
