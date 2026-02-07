/**
 * Types for Form Editor
 * Defines the structure of the form, fields, and layout
 */
import { TsFieldDef, TsFormButton } from "../ts-form/types"

/**
 * Extended field definition for the editor with a unique ID
 */
export interface EditorField {
  /** Unique ID of the field in the editor */
  id: string
  /** Field name (key in the fields object) */
  name: string
  /** Field definition */
  config: TsFieldDef
}

/**
 * Row item in the editor with extended metadata
 * Extends TsFormRowItem with an ID and field type
 */
export interface EditorRowItem {
  /** Unique ID of the item */
  id: string
  /** Reference to the field (key in the fields object) or empty string */
  field: string
  /** Column width in CSS grid */
  width?: string
  /** Field type for display in the editor */
  type?: TsFieldDef["type"] | "empty" | "separator"
  /** Label for separator */
  label?: string
  /** Alignment */
  align?: "left" | "center" | "right"
}

/**
 * Row in the editor
 */
export interface EditorRow {
  /** Unique ID of the row */
  id: string
  /** Row items */
  items: EditorRowItem[]
}

/**
 * Tab in the editor
 */
export interface EditorTab {
  /** Unique ID of the tab */
  id: string
  /** Tab label */
  label: string
  /** Rows in the tab */
  rows: EditorRow[]
}

/**
 * Overall form structure in the editor
 */
export interface EditorFormDefinition {
  /** Layout mode - with or without tabs */
  mode: "tabs" | "single"
  /** Tabs (if mode === 'tabs') */
  tabs?: EditorTab[]
  /** Rows (if mode === 'single') */
  rows?: EditorRow[]
  /** Definitions of all fields */
  fields: Record<string, TsFieldDef>
  /** Form buttons */
  buttons: TsFormButton[]
}

/**
 * Currently selected element in the editor
 */
export interface EditorSelection {
  type: "field" | "row" | "tab" | "button" | null
  id: string | null
  /** Tab index (for field and row) */
  tabIndex?: number
  /** Row index (for field) */
  rowIndex?: number
  /** Item index in row (for field) */
  itemIndex?: number
}

/**
 * Available field types for adding to the form
 */
export const AVAILABLE_FIELD_TYPES: { type: TsFieldDef["type"]; label: string; group: string }[] = [
  // Text inputs
  { type: "text", label: "Text", group: "Text" },
  { type: "textarea", label: "Textarea", group: "Text" },
  { type: "password", label: "Password", group: "Text" },
  { type: "number", label: "Number", group: "Text" },

  // Selection
  { type: "select", label: "Select", group: "Selection" },
  { type: "multiselect", label: "Multi Select", group: "Selection" },
  { type: "combobox", label: "Combobox", group: "Selection" },
  { type: "radio", label: "Radio", group: "Selection" },
  { type: "checkbox", label: "Checkbox", group: "Selection" },
  { type: "switch", label: "Switch", group: "Selection" },
  { type: "button-group", label: "Button Group", group: "Selection" },

  // Date
  { type: "date", label: "Date", group: "Date" },
  { type: "datetime", label: "Date and Time", group: "Date" },

  // Other inputs
  { type: "slider", label: "Slider", group: "Others" },
  { type: "file", label: "File", group: "Others" },
  { type: "image", label: "Image", group: "Others" },
  { type: "relationship", label: "Relationship", group: "Others" },

  // Layout and display
  { type: "separator", label: "Separator", group: "Layout" },
  { type: "infobox", label: "Info Box", group: "Layout" },
  { type: "markdown", label: "Markdown", group: "Layout" },
  { type: "button", label: "Button", group: "Layout" },

  // Complex
  { type: "table", label: "Table", group: "Complex" },
]

/**
 * Grouped field types for the sidebar
 */
export const GROUPED_FIELD_TYPES = AVAILABLE_FIELD_TYPES.reduce(
  (acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = []
    }
    acc[field.group].push(field)
    return acc
  },
  {} as Record<string, typeof AVAILABLE_FIELD_TYPES>
)
