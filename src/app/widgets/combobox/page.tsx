import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Combobox widget
 * Combination of text input and filtered list
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "City" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "Select a city..." },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "options",
    label: "Options (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { label: "New York", value: "new-york" },
        { label: "London", value: "london" },
        { label: "Paris", value: "paris" },
        { label: "Berlin", value: "berlin" },
        { label: "Tokyo", value: "tokyo" },
      ],
      null,
      2
    ),
    hint: "Array of {label, value} objects",
  },
  {
    name: "allowCustom",
    label: "Allow custom value",
    type: "boolean",
    defaultValue: false,
    hint: "Allows entering a value not in the list",
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

export default function ComboboxWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Combobox"
      description="A combination of a text input and a searchable dropdown. Optionally supports entering custom values not in the list."
      widgetType="combobox"
      attributes={attributes}
      defaultFieldValue="new-york"
    />
  )
}
