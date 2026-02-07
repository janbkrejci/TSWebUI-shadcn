import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Checkbox widget
 * Checkbox for boolean values
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "I agree to the terms" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
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

export default function CheckboxWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Checkbox"
      description="A checkbox for binary choices (yes/no). Suitable for agreeing to terms, activating features, etc."
      widgetType="checkbox"
      attributes={attributes}
      defaultFieldValue={true}
    />
  )
}
