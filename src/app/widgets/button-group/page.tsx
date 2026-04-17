"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function ButtonGroupWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: "Order Status" },
    {
      name: "hint",
      label: d.attrHint,
      type: "string",
      defaultValue: "Select the current state of the order",
    },
    {
      name: "variant",
      label: "Variant",
      type: "select",
      defaultValue: "process",
      options: [
        { label: "Standard (toggle)", value: "" },
        { label: "Process (chevron steps)", value: "process" },
      ],
      hint: "Visual style of the button group",
    },
    {
      name: "options",
      label: d.attrOptions,
      type: "json",
      defaultValue: JSON.stringify(
        [
          "pending/true/secondary/Pending",
          "processing/true/warning/Processing",
          "shipped/true/default/Shipped",
          "delivered/true/success/Delivered",
          "cancelled/true/destructive/Cancelled",
        ],
        null,
        2
      ),
      hint: "Array of strings in format: value/enabled/variant/label",
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
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetButtonGroupTitle}
      description={d.widgetButtonGroupDescription}
      widgetType="button-group"
      attributes={attributes}
      defaultFieldValue="processing"
    />
  )
}
