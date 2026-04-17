"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function SelectWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.selectDefaultLabel },
    {
      name: "placeholder",
      label: d.attrPlaceholder,
      type: "string",
      defaultValue: d.selectDefaultPlaceholder,
    },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
    {
      name: "options",
      label: d.attrOptions,
      type: "json",
      defaultValue: JSON.stringify(
        [
          { label: "Electronics", value: "electronics" },
          { label: "Clothing", value: "clothing" },
          { label: "Food", value: "food" },
          { label: "Household", value: "home" },
          { label: "Services", value: "services" },
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
      title={d.widgetSelectTitle}
      description={d.widgetSelectDescription}
      widgetType="select"
      attributes={attributes}
      defaultFieldValue="electronics"
    />
  )
}
