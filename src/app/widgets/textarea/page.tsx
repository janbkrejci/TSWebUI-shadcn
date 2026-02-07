import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Textarea widget
 * Multi-line text field for longer texts
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Notes" },
  {
    name: "placeholder",
    label: "Placeholder",
    type: "string",
    defaultValue: "Enter longer text...",
  },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "rows",
    label: "Number of Rows",
    type: "number",
    defaultValue: 3,
    hint: "Height of the textarea in lines",
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

export default function TextareaWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Textarea"
      description="A multi-line text field for longer texts like descriptions, notes, or comments."
      widgetType="textarea"
      attributes={attributes}
    />
  )
}
