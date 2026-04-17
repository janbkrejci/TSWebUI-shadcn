"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function RelationshipWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: "Assigned User" },
    {
      name: "placeholder",
      label: d.attrPlaceholder,
      type: "string",
      defaultValue: "Select user...",
    },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
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
      label: d.attrError,
      type: "string",
      defaultValue: "",
      hint: d.attrErrorHint,
    },
    { name: "required", label: d.attrRequired, type: "boolean", defaultValue: false },
    { name: "disabled", label: d.attrDisabled, type: "boolean", defaultValue: false },
    { name: "readonly", label: d.attrReadOnly, type: "boolean", defaultValue: false },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetRelationshipTitle}
      description={d.widgetRelationshipDescription}
      widgetType="relationship"
      attributes={attributes}
      defaultFieldValue={1}
    />
  )
}
