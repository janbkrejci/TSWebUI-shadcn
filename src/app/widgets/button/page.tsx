import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Button widget
 * Action button within a form
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Submit Form" },
  {
    name: "action",
    label: "Action ID",
    type: "string",
    defaultValue: "submit",
    hint: "Action identifier sent in the event",
  },
  {
    name: "variant",
    label: "Variant",
    type: "select",
    defaultValue: "default",
    options: [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Outline", value: "outline" },
      { label: "Ghost", value: "ghost" },
      { label: "Link", value: "link" },
      { label: "Success", value: "success" },
      { label: "Warning", value: "warning" },
      { label: "Info", value: "info" },
      { label: "Danger / Destructive", value: "destructive" },
    ],
    hint: "Visual style of the button",
  },
  { name: "disabled", label: "Disabled", type: "boolean", defaultValue: false },
  { name: "readonly", label: "Read-only", type: "boolean", defaultValue: false },
  { name: "hidden", label: "Hidden", type: "boolean", defaultValue: false },
]

export default function ButtonWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Button"
      description="A button for triggering actions within a form. When clicked, it dispatches a form-field-action event with the action identifier."
      widgetType="button"
      attributes={attributes}
    />
  )
}
