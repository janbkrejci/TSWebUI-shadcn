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
