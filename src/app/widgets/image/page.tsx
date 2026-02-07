import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Image Upload widget
 * Specialized image uploading
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Profile Picture" },
  {
    name: "hint",
    label: "Hint",
    type: "string",
    defaultValue: "Recommended size: 400x400 px",
  },
  {
    name: "accept",
    label: "Allowed types",
    type: "string",
    defaultValue: "image/*",
    hint: "Default: image/*",
  },
  {
    name: "multiple",
    label: "Multiple images",
    type: "boolean",
    defaultValue: false,
    hint: "Allows uploading multiple images",
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

export default function ImageWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Image Upload"
      description="A specialized widget for uploading images. Automatically restricts 'accept' to image/*."
      widgetType="image"
      attributes={attributes}
    />
  )
}
