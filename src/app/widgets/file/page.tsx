"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function FileWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: "Attachments" },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "Maximum size 10MB" },
    {
      name: "innerLabel",
      label: "Drop zone text",
      type: "string",
      defaultValue: "",
      hint: "Text shown inside the drop zone (leave empty for default)",
    },
    {
      name: "accept",
      label: "Allowed file types",
      type: "string",
      defaultValue: "",
      hint: "e.g., .pdf,.doc,.docx or application/pdf",
    },
    {
      name: "multiple",
      label: "Multiple files",
      type: "boolean",
      defaultValue: false,
      hint: "Allows uploading multiple files",
    },
    {
      name: "showDropZone",
      label: "Show Drop Zone",
      type: "boolean",
      defaultValue: true,
      hint: "If false, shows a simple Add button instead",
    },
    {
      name: "addFileLabel",
      label: "Add File Link Label",
      type: "string",
      defaultValue: "Attach document",
      hint: "Label for the link when dropzone is hidden",
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
      title={d.widgetFileTitle}
      description={d.widgetFileDescription}
      widgetType="file"
      attributes={attributes}
    />
  )
}
