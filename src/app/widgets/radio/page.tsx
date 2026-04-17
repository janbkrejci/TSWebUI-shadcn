"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function RadioWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.radioDefaultLabel },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: d.radioDefaultHint },
    {
      name: "options",
      label: d.attrOptions,
      type: "json",
      defaultValue: JSON.stringify(
        [
          { label: "Credit Card", value: "card" },
          { label: "Bank Transfer", value: "transfer" },
          { label: "Cash on Delivery", value: "cod" },
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
      title={d.widgetRadioTitle}
      description={d.widgetRadioDescription}
      widgetType="radio"
      attributes={attributes}
      defaultFieldValue="card"
    />
  )
}
