import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for DateTime widget
 * Selection of date and time
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Appointment" },
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

export default function DateTimeWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Date Time"
      description="Select both date and time using a native datetime-local input. Useful for scheduling appointments, deadlines, etc."
      widgetType="datetime"
      attributes={attributes}
      defaultFieldValue={new Date().toISOString()}
    />
  )
}
