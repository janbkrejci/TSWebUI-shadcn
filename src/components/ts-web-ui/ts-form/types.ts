import { TsTableColumnDef } from "../ts-table/columns"

export type FieldType =
  | "text"
  | "textarea"
  | "password"
  | "number"
  | "slider"
  | "select"
  | "multiselect"
  | "combobox"
  | "radio"
  | "checkbox"
  | "switch"
  | "date"
  | "datetime"
  | "file"
  | "image"
  | "button"
  | "separator"
  | "empty"
  | "table" // nested
  | "relationship"
  | "infobox"
  | "markdown"
  | "button-group"

export interface TsFieldOptions {
  label: string
  value: string | number | boolean
  variant?: string
}

export interface TsFieldDef {
  type: FieldType
  label?: string
  required?: boolean
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  hint?: string
  /** Error message - when set, widget displays in danger/error state */
  error?: string

  // Number specific
  min?: number
  max?: number
  step?: number
  /** Number of decimal places for rounding and display */
  roundTo?: number

  // Select/Radio specific
  options?: TsFieldOptions[] | string[]

  // Textarea
  rows?: number

  // File
  accept?: string
  multiple?: boolean

  // Relationship
  targetEntity?: string
  mode?: "single" | "multiple"
  displayFields?: string[]
  chipDisplayFields?: string[]
  valueField?: string

  // Table
  columns?: TsTableColumnDef[]
  showCreateButton?: boolean

  // Button
  action?: string

  // Combobox
  allowCustom?: boolean
  /** Message shown when no option matches search (default: "Not found.") */
  notFoundMessage?: string

  // Text/Number inputs
  /** Select all text on focus */
  selectAllOnFocus?: boolean

  // Key actions for text/textarea/number inputs
  /** Action name emitted when Enter is pressed (e.g. 'focus:next', 'submit', 'click:save') */
  enterAction?: string
  /** Action on Escape: 'clear' clears the value, any other string emits form-key-action */
  escapeAction?: string

  // Date/DateTime
  /** Date format string using date-fns tokens (default: "d.M.yyyy" for date, "d.M.yyyy HH:mm" for datetime) */
  dateFormat?: string

  // File upload
  /** Label shown inside the drop zone */
  innerLabel?: string

  // Infobox/Markdown
  content?: string
  value?: unknown
  variant?: string
}

export interface TsFormRowItem {
  field: string // Key referencing fields object, or special type like 'empty'
  width?: string // CSS grid width (e.g. '1fr', '200px')
  type?: "empty" | "separator"
  label?: string // For separator
  align?: "left" | "center" | "right"
}

export type TsFormRow = TsFormRowItem[]

export interface TsFormTab {
  label: string
  rows: TsFormRow[]
}

export interface TsFormLayout {
  tabs?: TsFormTab[]
  rows?: TsFormRow[]
}

export interface TsFormConfirmation {
  title: string
  text: string
  buttons: {
    action: string
    label: string
    variant?: string
    confirm?: boolean
  }[]
}

export interface TsFormButton {
  action: string
  label: string
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "default"
    | "danger"
    | "success"
    | "warning"
  type?: "submit" | "button" | "reset"
  icon?: string
  confirmation?: TsFormConfirmation
}
