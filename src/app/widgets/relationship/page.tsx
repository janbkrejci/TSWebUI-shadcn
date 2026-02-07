import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Relationship Picker widget
 * Selection of related entities from another table
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Assigned User" },
  {
    name: "placeholder",
    label: "Placeholder",
    type: "string",
    defaultValue: "Select user...",
  },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "targetEntity",
    label: "Target Entity",
    type: "string",
    defaultValue: "users",
    hint: "Name of the table/entity",
  },
  {
    name: "mode",
    label: "Mode",
    type: "select",
    defaultValue: "single",
    options: [
      { label: "Single Record", value: "single" },
      { label: "Multiple Records", value: "multiple" },
    ],
    hint: "single = 1 record, multiple = multiple records",
  },
  {
    name: "displayFields",
    label: "Display Fields (JSON)",
    type: "json",
    defaultValue: '["name", "email"]',
    hint: "Fields to display in the list",
  },
  {
    name: "chipDisplayFields",
    label: "Chip Fields (JSON)",
    type: "json",
    defaultValue: '["name"]',
    hint: "Fields to display in the selected chips",
  },
  {
    name: "valueField",
    label: "Value Field",
    type: "string",
    defaultValue: "id",
    hint: "Field used as value (usually id)",
  },
  {
    name: "options",
    label: "Mock Data (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
        { id: 4, name: "Alice Williams", email: "alice.williams@example.com" },
        { id: 5, name: "Tom Brown", email: "tom.brown@example.com" },
      ],
      null,
      2
    ),
    hint: "Array of objects with available records",
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

export default function RelationshipWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Relationship Picker"
      description="A widget for selecting related entities (1:N or M:N relationship). Allows selecting records from another table with search functionality."
      widgetType="relationship"
      attributes={attributes}
      defaultFieldValue={1}
    />
  )
}
