import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Slider widget
 * Slider for selecting a value from a range
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Volume" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "Adjust the value" },
  { name: "min", label: "Minimum value", type: "number", defaultValue: 0 },
  { name: "max", label: "Maximum value", type: "number", defaultValue: 100 },
  {
    name: "step",
    label: "Step",
    type: "number",
    defaultValue: 1,
    hint: "How much the value changes when sliding",
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

export default function SliderWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Slider"
      description="A slider for selecting a numeric value from a defined range. Suitable for settings like volume, opacity, etc."
      widgetType="slider"
      attributes={attributes}
      defaultFieldValue={50}
    />
  )
}
