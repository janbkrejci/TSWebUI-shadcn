import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Info Box widget
 * Information box/alert for displaying important information
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Title", type: "string", defaultValue: "Information" },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    defaultValue: "This is important information for the form user.",
    hint: "Text displayed in the infobox",
  },
  {
    name: "variant",
    label: "Variant",
    type: "select",
    defaultValue: "default",
    options: [
      { label: "Default", value: "default" },
      { label: "Destructive (Red)", value: "destructive" },
      { label: "Information (Blue)", value: "information" },
      { label: "Warning (Orange)", value: "warning" },
      { label: "Success (Green)", value: "success" },
    ],
    hint: "Alert color variant",
  },
  { name: "hidden", label: "Hidden", type: "boolean", defaultValue: false },
]

export default function InfoBoxWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Info Box"
      description="An information box (alert) for displaying important info, warnings, or errors within a form."
      widgetType="infobox"
      attributes={attributes}
    />
  )
}
