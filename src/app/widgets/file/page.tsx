import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for File Upload widget
 * File uploading
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Attachments" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "Maximum size 10MB" },
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
    hint: "Allows uploading multiple files at once",
  },
  {
    name: "error",
    label: "Error message",
    type: "string",
    defaultValue: "",
    hint: "If provided, the widget will be displayed in an error state",
  },
  { name: "required", label: "Required", type: "boolean", defaultValue: false },
  { name: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
  { name: "readonly", label: "Read-only", type: "boolean", defaultValue: false },
  { name: "hidden", label: "Hidden", type: "boolean", defaultValue: false },
]

export default function FileWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="File Upload"
      description="A widget for uploading files. Supports file type restrictions and multiple file selection."
      widgetType="file"
      attributes={attributes}
    />
  )
}
