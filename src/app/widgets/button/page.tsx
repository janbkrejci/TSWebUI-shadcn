"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function ButtonWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: "Submit Form" },
    {
      name: "action",
      label: "Action ID",
      type: "string",
      defaultValue: "submit",
      hint: "Action identifier sent in the event",
    },
    {
      name: "variant",
      label: d.attrVisualStyle,
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
        { label: "Link", value: "link" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Info", value: "info" },
        { label: "Danger / Destructive", value: "destructive" },
      ],
      hint: "Visual style of the button",
    },
    {
      name: "icon",
      label: "Icon (Lucide name)",
      type: "string",
      defaultValue: "",
      hint: "Lucide icon name rendered inside the button, e.g. ArrowLeftRight",
    },
    {
      name: "iconOnly",
      label: "Icon-only button",
      type: "boolean",
      defaultValue: false,
      hint: "Render a compact, square icon-only button (no label)",
    },
    { name: "disabled", label: d.attrDisabled, type: "boolean", defaultValue: false },
    { name: "readonly", label: d.attrReadOnly, type: "boolean", defaultValue: false },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetButtonTitle}
      description={d.widgetButtonDescription}
      widgetType="button"
      attributes={attributes}
    />
  )
}
