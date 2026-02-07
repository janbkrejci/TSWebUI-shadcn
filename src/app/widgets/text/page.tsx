import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Text Input widget
 * Displays all configuration options for a text input field
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Text Field" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "Enter text..." },
  { name: "hint", label: "Hint", type: "string", defaultValue: "Enter a single line of text" },
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

export default function TextWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Text Input"
      description="A basic text input field for single-line text. Supports validation, placeholders, and various states."
      widgetType="text"
      attributes={attributes}
    />
  )
}
