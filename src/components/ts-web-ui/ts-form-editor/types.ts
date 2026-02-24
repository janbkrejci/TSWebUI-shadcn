import {
  AlignLeft,
  Calendar,
  CalendarClock,
  CheckSquare,
  ChevronDown,
  CircleDot,
  FileText,
  Hash,
  Image,
  Info,
  KeyRound,
  Link2,
  List,
  Minus,
  MousePointerClick,
  Search,
  SlidersHorizontal,
  TableProperties,
  ToggleLeft,
  ToggleRight,
  Type,
  Upload,
} from "lucide-react"

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
export const AVAILABLE_FIELD_TYPES: {
  type: TsFieldDef["type"]
  label: string
  group: string
  icon: React.ElementType
}[] = [
  // Text inputs
  { type: "text", label: "Text", group: "Text", icon: Type },
  { type: "textarea", label: "Textarea", group: "Text", icon: AlignLeft },
  { type: "password", label: "Password", group: "Text", icon: KeyRound },
  { type: "number", label: "Number", group: "Text", icon: Hash },

  // Selection
  { type: "select", label: "Select", group: "Selection", icon: ChevronDown },
  { type: "multiselect", label: "Multi Select", group: "Selection", icon: List },
  { type: "combobox", label: "Combobox", group: "Selection", icon: Search },
  { type: "radio", label: "Radio", group: "Selection", icon: CircleDot },
  { type: "checkbox", label: "Checkbox", group: "Selection", icon: CheckSquare },
  { type: "switch", label: "Switch", group: "Selection", icon: ToggleLeft },
  { type: "button-group", label: "Button Group", group: "Selection", icon: ToggleRight },

  // Date
  { type: "date", label: "Date", group: "Date", icon: Calendar },
  { type: "datetime", label: "Date and Time", group: "Date", icon: CalendarClock },

  // Other inputs
  { type: "slider", label: "Slider", group: "Others", icon: SlidersHorizontal },
  { type: "file", label: "File", group: "Others", icon: Upload },
  { type: "image", label: "Image", group: "Others", icon: Image },
  { type: "relationship", label: "Relationship", group: "Others", icon: Link2 },

  // Layout and display
  { type: "separator", label: "Separator", group: "Layout", icon: Minus },
  { type: "infobox", label: "Info Box", group: "Layout", icon: Info },
  { type: "markdown", label: "Markdown", group: "Layout", icon: FileText },
  { type: "button", label: "Button", group: "Layout", icon: MousePointerClick },

  // Complex
  { type: "table", label: "Table", group: "Complex", icon: TableProperties },
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
