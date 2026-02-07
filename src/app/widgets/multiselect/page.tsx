import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Multi Select widget
 * Selection of multiple values from a predefined list
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Tags" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "Select tags..." },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "options",
    label: "Options (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { label: "Important", value: "important" },
        { label: "Urgent", value: "urgent" },
        { label: "Low Priority", value: "low" },
        { label: "Internal", value: "internal" },
        { label: "External", value: "external" },
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

export default function MultiSelectWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Multi Select"
      description="Select multiple values from a predefined list. Selected values are displayed as chips."
      widgetType="multiselect"
      attributes={attributes}
      defaultFieldValue={["important", "internal"]}
    />
  )
}
