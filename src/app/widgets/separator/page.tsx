import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Separator widget
 * Visual separator for form sections
 */

const attributes: WidgetAttribute[] = [
  {
    name: "label",
    label: "Label (optional)",
    type: "string",
    defaultValue: "Personal Information",
    hint: "Text displayed in the middle of the separator. If empty, only a line is shown.",
  },
  { name: "hidden", label: "Hidden", type: "boolean", defaultValue: false },
]

export default function SeparatorWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Separator"
      description="A visual separator for dividing a form into logical sections. It can have an optional text label."
      widgetType="separator"
      attributes={attributes}
    />
  )
}
