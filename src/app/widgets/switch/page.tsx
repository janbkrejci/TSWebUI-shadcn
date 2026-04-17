"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function SwitchWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.switchDefaultLabel },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
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
      title={d.widgetSwitchTitle}
      description={d.widgetSwitchDescription}
      widgetType="switch"
      attributes={attributes}
      defaultFieldValue={true}
    />
  )
}
