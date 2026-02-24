import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Button Group widget
 * A group of buttons for quick value selection
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Order Status" },
  {
    name: "hint",
    label: "Hint",
    type: "string",
    defaultValue: "Select the current state of the order",
  },
  {
    name: "variant",
    label: "Variant",
    type: "select",
    defaultValue: "process",
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
        "pending/true/secondary/Pending",
        "processing/true/warning/Processing",
        "shipped/true/default/Shipped",
        "delivered/true/success/Delivered",
        "cancelled/true/destructive/Cancelled",
      ],
      null,
      2
    ),
    hint: "Array of strings in format: value/enabled/variant/label",
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
]

export default function ButtonGroupWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Button Group"
      description="A toggle group for quick selection of a single value. Supports standard and process variants with status-based coloring."
      widgetType="button-group"
      attributes={attributes}
      defaultFieldValue="processing"
    />
  )
}
