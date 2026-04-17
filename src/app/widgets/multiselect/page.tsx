"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function MultiSelectWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.multiselectDefaultLabel },
    {
      name: "placeholder",
      label: d.attrPlaceholder,
      type: "string",
      defaultValue: d.multiselectDefaultPlaceholder,
    },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
    {
      name: "options",
      label: d.attrOptions,
      type: "json",
      defaultValue: JSON.stringify(
        [
          { label: "Important", value: "important" },
          { label: "Urgent", value: "urgent" },
          { label: "Low Priority", value: "low" },
          { label: "Internal", value: "internal" },
          { label: "External", value: "external" },
        ],
        null,
        2
      ),
      hint: d.attrOptionsHint,
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
      title={d.widgetMultiselectTitle}
      description={d.widgetMultiselectDescription}
      widgetType="multiselect"
      attributes={attributes}
      defaultFieldValue={["important", "internal"]}
    />
  )
}
