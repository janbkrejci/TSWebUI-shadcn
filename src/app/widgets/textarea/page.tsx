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
    name: "selectAllOnFocus",
    label: "Select all on focus",
    type: "boolean",
    defaultValue: false,
    hint: "Select all text when the input gets focus",
  },
  {
    name: "enterAction",
    label: "Enter action",
    type: "select",
    defaultValue: "",
    options: [
      { label: "None", value: "" },
      { label: "Focus next field", value: "focus:next" },
      { label: "Submit form", value: "submit" },
    ],
    hint: "Action when Enter is pressed",
  },
  {
    name: "escapeAction",
    label: "Escape action",
    type: "select",
    defaultValue: "clear",
    options: [
      { label: "Clear field", value: "clear" },
      { label: "Focus next field", value: "focus:next" },
    ],
    hint: "Action when Escape is pressed",
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
