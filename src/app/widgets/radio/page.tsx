import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Radio Group widget
 * Selection of one value from several options using radio buttons
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Payment Method" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "Select how you want to pay" },
  {
    name: "options",
    label: "Options (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { label: "Credit Card", value: "card" },
        { label: "Bank Transfer", value: "transfer" },
        { label: "Cash on Delivery", value: "cod" },
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

export default function RadioWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Radio Group"
      description="A group of radio buttons for selecting exactly one value from several mutually exclusive options."
      widgetType="radio"
      attributes={attributes}
      defaultFieldValue="card"
    />
  )
}
