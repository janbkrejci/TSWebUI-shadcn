"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function SeparatorWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    {
      name: "label",
      label: "Label (optional)",
      type: "string",
      defaultValue: "Personal Information",
      hint: "Text displayed in the middle of the separator. If empty, only a line is shown.",
    },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetSeparatorTitle}
      description={d.widgetSeparatorDescription}
      widgetType="separator"
      attributes={attributes}
    />
  )
}
