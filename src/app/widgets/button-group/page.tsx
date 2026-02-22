import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Button Group widget
 * A group of buttons for quick value selection
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Priority" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "Select one option" },
  {
    name: "variant",
    label: "Variant",
    type: "select",
    defaultValue: "",
    options: [
      { label: "Standard (toggle)", value: "" },
      { label: "Process (chevron steps)", value: "process" },
    ],
    hint: "Visual style of the button group",
  },
  {
    name: "options",
    label: "Options (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
        { label: "Critical", value: "critical" },
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

export default function ButtonGroupWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Button Group"
      description="A toggle group for quick selection of a single value. Suitable for a small number of options like priority or status."
      widgetType="button-group"
      attributes={attributes}
      defaultFieldValue="medium"
    />
  )
}
