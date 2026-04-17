"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function ComboboxWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.comboboxDefaultLabel },
    {
      name: "placeholder",
      label: d.attrPlaceholder,
      type: "string",
      defaultValue: d.comboboxDefaultPlaceholder,
    },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
    {
      name: "options",
      label: d.attrOptions,
      type: "json",
      defaultValue: JSON.stringify(
        [
          { label: "New York", value: "new-york" },
          { label: "London", value: "london" },
          { label: "Paris", value: "paris" },
          { label: "Berlin", value: "berlin" },
          { label: "Tokyo", value: "tokyo" },
        ],
        null,
        2
      ),
      hint: d.attrOptionsHint,
    },
    {
      name: "allowCustom",
      label: d.attrAllowCustom,
      type: "boolean",
      defaultValue: false,
      hint: d.attrAllowCustomHint,
    },
    {
      name: "clearable",
      label: d.attrClearable,
      type: "boolean",
      defaultValue: true,
      hint: d.attrClearableHint,
    },
    {
      name: "error",
      label: d.attrError,
      type: "string",
      defaultValue: "",
      hint: d.attrErrorHint,
    },
    { name: "required", label: d.attrRequired, type: "boolean", defaultValue: false },
    { name: "disabled", label: d.attrDisabled, type: "boolean", defaultValue: false },
    { name: "readonly", label: d.attrReadOnly, type: "boolean", defaultValue: false },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetComboboxTitle}
      description={d.widgetComboboxDescription}
      widgetType="combobox"
      attributes={attributes}
      defaultFieldValue="new-york"
    />
  )
}
