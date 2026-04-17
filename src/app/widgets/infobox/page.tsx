"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function InfoBoxWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: "Title", type: "string", defaultValue: "Information" },
    {
      name: "content",
      label: d.attrContent,
      type: "textarea",
      defaultValue: "This is important information for the form user.",
      hint: "Text displayed in the infobox",
    },
    {
      name: "variant",
      label: d.attrVisualStyle,
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Destructive (Red)", value: "destructive" },
        { label: "Information (Blue)", value: "information" },
        { label: "Warning (Orange)", value: "warning" },
        { label: "Success (Green)", value: "success" },
      ],
      hint: "Alert color variant",
    },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetInfoboxTitle}
      description={d.widgetInfoboxDescription}
      widgetType="infobox"
      attributes={attributes}
    />
  )
}
