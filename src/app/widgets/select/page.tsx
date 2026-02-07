import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Select widget
 * Dropdown list for selecting one option
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Category" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "Select category..." },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "options",
    label: "Options (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Food", value: "food" },
        { label: "Household", value: "home" },
        { label: "Services", value: "services" },
      ],
      null,
      2
    ),
    hint: "Array of {label, value} objects",
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

export default function SelectWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Select"
      description="A dropdown list for selecting a single value from predefined options."
      widgetType="select"
      attributes={attributes}
      defaultFieldValue="electronics"
    />
  )
}
