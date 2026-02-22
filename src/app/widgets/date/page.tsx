import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Date Picker widget
 * Date selection using a calendar
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Date of Birth" },
  { name: "placeholder", label: "Placeholder", type: "string", defaultValue: "d.m.yyyy" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "dateFormat",
    label: "Date format",
    type: "string",
    defaultValue: "d.M.yyyy",
    hint: "date-fns format string (e.g. d.M.yyyy, dd/MM/yyyy, MM/dd/yyyy)",
  },
  {
    name: "selectAllOnFocus",
    label: "Select all on focus",
    type: "boolean",
    defaultValue: false,
    hint: "Select all text when the input gets focus",
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

export default function DateWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Date Picker"
      description="Select a date using an editable text input with calendar popup. The value is formatted according to a configurable date-fns format string with Czech locale."
      widgetType="date"
      attributes={attributes}
      defaultFieldValue={new Date()}
    />
  )
}
