import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Number widget
 * Numeric input field with min/max and step support
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Quantity" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "0" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  { name: "min", label: "Minimum value", type: "number", defaultValue: undefined },
  { name: "max", label: "Maximum value", type: "number", defaultValue: undefined },
  {
    name: "step",
    label: "Step",
    type: "number",
    defaultValue: 1,
    hint: "How much the value changes when using arrows",
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
      description="A numeric input field for entering numbers. Supports range constraints via min/max and step configuration."
      widgetType="number"
      attributes={attributes}
      defaultFieldValue={10}
    />
  )
}
