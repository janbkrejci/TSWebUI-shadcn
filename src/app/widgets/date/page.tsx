import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Date Picker widget
 * Date selection using a calendar
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Date of Birth" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "Select date..." },
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

export default function DateWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Date Picker"
      description="Select a date using an interactive calendar. Supports English formatting and localization."
      widgetType="date"
      attributes={attributes}
      defaultFieldValue={new Date()}
    />
  )
}
