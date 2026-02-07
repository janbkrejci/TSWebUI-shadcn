import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Switch widget
 * Switch for toggle values
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Active" },
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

export default function SwitchWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Switch"
      description="An iOS-style switch for toggling a function on/off. An alternative to a checkbox for binary settings."
      widgetType="switch"
      attributes={attributes}
      defaultFieldValue={true}
    />
  )
}
