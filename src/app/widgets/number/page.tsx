import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Number widget
 * Numeric input field with min/max and step support
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Amount" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "0" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "roundTo",
    label: "Decimal places",
    type: "number",
    defaultValue: 2,
    hint: "Number of decimal places for rounding and display",
  },
  {
    name: "step",
    label: "Step",
    type: "number",
    defaultValue: 1,
    hint: "How much the value changes per increment",
  },
  {
    name: "selectAllOnFocus",
    label: "Select all on focus",
    type: "boolean",
    defaultValue: true,
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

export default function NumberWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Number Input"
      description="A numeric input with locale-aware formatting (space for thousands, comma for decimals). Supports math calculations (e.g., 10+5*2), rounding, Enter/Escape key actions, and select-all-on-focus."
      widgetType="number"
      attributes={attributes}
      defaultFieldValue={1234.56}
    />
  )
}
