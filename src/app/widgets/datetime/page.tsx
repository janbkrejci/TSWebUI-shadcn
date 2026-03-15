import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for DateTime widget
 * Selection of date and time
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Appointment" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "dateFormat",
    label: "Date format",
    type: "string",
    defaultValue: "d.M.yyyy HH:mm",
    hint: "date-fns format string (e.g. d.M.yyyy HH:mm, dd/MM/yyyy HH:mm)",
  },
  {
    name: "selectAllOnFocus",
    label: "Select all on focus",
    type: "boolean",
    defaultValue: true,
    hint: "Select all text when the input gets focus",
  },
  {
    name: "error",
    label: "Error message",
    type: "string",
    defaultValue: "",
    hint: "If provided, the widget will be displayed in an error state",
  },
  {
    name: "enterAction",
    label: "Enter Action",
    type: "string",
    defaultValue: "",
    hint: "Action to trigger on Enter key",
  },
  {
    name: "escapeAction",
    label: "Escape Action",
    type: "string",
    defaultValue: "",
    hint: "Action to trigger on Escape key (e.g. clear)",
  },
  {
    name: "locale",
    label: "Locale",
    type: "string",
    defaultValue: "cs",
    hint: "Date-fns locale code (e.g. cs, en-US, de)",
  },
  {
    name: "showTodayButton",
    label: "Show Today",
    type: "boolean",
    defaultValue: true,
  },
  {
    name: "showClearButton",
    label: "Show Clear",
    type: "boolean",
    defaultValue: true,
  },
  {
    name: "todayButtonText",
    label: "Today Button Text",
    type: "string",
    defaultValue: "Today",
  },
  {
    name: "clearButtonText",
    label: "Clear Button Text",
    type: "string",
    defaultValue: "Clear",
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
      description="Select date and time using an editable text input with calendar popup. The value is formatted according to a configurable date-fns format string."
      widgetType="datetime"
      attributes={attributes}
      defaultFieldValue={new Date().toISOString()}
    />
  )
}
