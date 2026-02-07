import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Nested Table widget
 * An embedded table within a form
 */

const attributes: WidgetAttribute[] = [
  { name: "label", label: "Label", type: "string", defaultValue: "Order Items" },
  { name: "hint", label: "Hint", type: "string", defaultValue: "" },
  {
    name: "columns",
    label: "Column Definition (JSON)",
    type: "json",
    defaultValue: JSON.stringify(
      [
        { field: "name", header: "Name", width: "200px" },
        { field: "quantity", header: "Quantity", width: "100px" },
        { field: "price", header: "Price", width: "100px" },
      ],
      null,
      2
    ),
    hint: "Array of table column definitions",
  },
  {
    name: "showCreateButton",
    label: "Create Button",
    type: "boolean",
    defaultValue: true,
    hint: "Show the button to add a new row",
  },
  { name: "hidden", label: "Hidden", type: "boolean", defaultValue: false },
]

export default function TableWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Nested Table"
      description="An embedded table for managing a list of items within a form (e.g., invoice items, addresses)."
      widgetType="table"
      attributes={attributes}
      defaultFieldValue={[
        { name: "Product A", quantity: 2, price: 199 },
        { name: "Product B", quantity: 1, price: 499 },
      ]}
    />
  )
}
