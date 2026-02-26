import type { ReactNode } from "react"

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

// ─── Variant unions ────────────────────────────────────────────────────────────

export type TsButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"
  | "danger"
  | "success"
  | "warning"

export type TsInfoboxVariant = "default" | "information" | "warning" | "success" | "destructive"

// ─── Options ──────────────────────────────────────────────────────────────────

export interface TsFieldOptions {
  label: string
  value: string | number | boolean
  /** Button variant used when this option is the active selection (button-group) */
  variant?: TsButtonVariant
  disabled?: boolean
}

// ─── Shared base properties (present on every field type) ─────────────────────

interface TsFieldBase {
  label?: string
  required?: boolean
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  hint?: string
  /** Error message – when set, the widget renders in error/danger state */
  error?: string
}

// ─── Shared behaviour mixins ───────────────────────────────────────────────────

interface TsFieldInputBehavior {
  placeholder?: string
  /** Select all text when the field is focused or clicked */
  selectAllOnFocus?: boolean
  /** Action emitted when Enter is pressed (e.g. 'focus:next', 'submit', 'click:save') */
  enterAction?: string
  /** Action on Escape: 'clear' clears the value, any other string emits form-key-action */
  escapeAction?: string
}

interface TsFieldNumericRange {
  min?: number
  max?: number
  step?: number
}

interface TsFieldWithOptions {
  placeholder?: string
  options?: TsFieldOptions[] | string[]
  /** Message shown when no option matches the search (default: "Not found.") */
  notFoundMessage?: string
}

// ─── Per-type field interfaces ─────────────────────────────────────────────────

export interface TsTextField extends TsFieldBase, TsFieldInputBehavior {
  type: "text" | "password"
}

export interface TsTextareaField extends TsFieldBase, TsFieldInputBehavior {
  type: "textarea"
  rows?: number
}

export interface TsNumberField extends TsFieldBase, TsFieldInputBehavior, TsFieldNumericRange {
  type: "number"
  /** Number of decimal places for rounding and display */
  roundTo?: number
}

export interface TsSliderField extends TsFieldBase, TsFieldNumericRange {
  type: "slider"
}

export interface TsSelectField extends TsFieldBase {
  type: "select"
  placeholder?: string
  options?: TsFieldOptions[] | string[]
}

export interface TsMultiselectField extends TsFieldBase, TsFieldWithOptions {
  type: "multiselect"
}

export interface TsComboboxField extends TsFieldBase, TsFieldWithOptions {
  type: "combobox"
  /** Allow the user to enter a custom value not present in the options list */
  allowCustom?: boolean
  selectAllOnFocus?: boolean
}

export interface TsRadioField extends TsFieldBase {
  type: "radio"
  options?: TsFieldOptions[] | string[]
}

export interface TsCheckboxField extends TsFieldBase {
  type: "checkbox"
}

export interface TsSwitchField extends TsFieldBase {
  type: "switch"
}

export interface TsButtonGroupField extends TsFieldBase {
  type: "button-group"
  options?: TsFieldOptions[] | string[]
  /** "process" renders a chevron-style process stepper; omit for a standard button group */
  variant?: "process"
}

export interface TsDateField extends TsFieldBase {
  type: "date"
  placeholder?: string
  /** Date format string using date-fns tokens (default: "d.M.yyyy") */
  dateFormat?: string
  selectAllOnFocus?: boolean
}

export interface TsDateTimeField extends TsFieldBase {
  type: "datetime"
  placeholder?: string
  /** Date format string using date-fns tokens (default: "d.M.yyyy HH:mm") */
  dateFormat?: string
  selectAllOnFocus?: boolean
}

export interface TsFileField extends TsFieldBase {
  type: "file" | "image"
  /** Accepted file types (e.g. ".pdf,.doc" or "image/*") */
  accept?: string
  /** Allow multiple file selection */
  multiple?: boolean
  /** Label shown inside the drop zone */
  innerLabel?: string
}

export interface TsButtonField extends TsFieldBase {
  type: "button"
  /** Action name emitted when the button is clicked */
  action?: string
  variant?: TsButtonVariant
}

export interface TsSeparatorField extends TsFieldBase {
  type: "separator"
}

export interface TsEmptyField extends TsFieldBase {
  type: "empty"
}

export interface TsTableField extends TsFieldBase {
  type: "table"
  columns?: TsTableColumnDef[]
  showCreateButton?: boolean
}

export interface TsRelationshipField extends TsFieldBase {
  type: "relationship"
  placeholder?: string
  /** Entity name used for placeholder text and search label */
  targetEntity?: string
  /** Single or multiple selection */
  mode?: "single" | "multiple"
  /** Field names to display in search results */
  displayFields?: string[]
  /** Field names to display inside the selected chip */
  chipDisplayFields?: string[]
  /** Field used as the stored value / primary key */
  valueField?: string
  /** Available records to select from */
  options?: Record<string, unknown>[]
}

export interface TsInfoboxField extends TsFieldBase {
  type: "infobox"
  content?: string
  value?: ReactNode
  variant?: TsInfoboxVariant
}

export interface TsMarkdownField extends TsFieldBase {
  type: "markdown"
  content?: string
  value?: string
}

// ─── Main discriminated union ──────────────────────────────────────────────────
/**
 * Field definition for a single form widget.
 *
 * The `type` discriminant narrows all other properties so IDE autocomplete only
 * shows properties that are valid for the chosen widget type.
 *
 * @example
 * ```ts
 * const fields: Record<string, TsFieldDef> = {
 *   name:   { type: "text",   label: "Name", required: true },
 *   age:    { type: "number", min: 0, max: 150, roundTo: 0 },
 *   status: { type: "infobox", variant: "warning", content: "..." },
 * }
 * ```
 */
export type TsFieldDef =
  | TsTextField
  | TsTextareaField
  | TsNumberField
  | TsSliderField
  | TsSelectField
  | TsMultiselectField
  | TsComboboxField
  | TsRadioField
  | TsCheckboxField
  | TsSwitchField
  | TsButtonGroupField
  | TsDateField
  | TsDateTimeField
  | TsFileField
  | TsButtonField
  | TsSeparatorField
  | TsEmptyField
  | TsTableField
  | TsRelationshipField
  | TsInfoboxField
  | TsMarkdownField

// ─── Utility type for partial updates (used internally by the form editor) ────
/**
 * All possible field properties combined as optional.
 * Use this for partial config updates in the form editor instead of `Partial<TsFieldDef>`.
 */
export interface TsFieldUpdate {
  type?: FieldType
  label?: string
  required?: boolean
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  hint?: string
  error?: string
  // Number / slider
  min?: number
  max?: number
  step?: number
  roundTo?: number
  // Options-bearing fields
  options?: TsFieldOptions[] | string[] | Record<string, unknown>[]
  notFoundMessage?: string
  // Textarea
  rows?: number
  // File
  accept?: string
  multiple?: boolean
  innerLabel?: string
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
  // Text / number / date inputs
  selectAllOnFocus?: boolean
  enterAction?: string
  escapeAction?: string
  // Date / datetime
  dateFormat?: string
  // Infobox / markdown
  content?: string
  value?: unknown
  // Variant (infobox, button, button-group)
  variant?: TsButtonVariant | TsInfoboxVariant | "process"
}

// ─── Form layout ──────────────────────────────────────────────────────────────

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

// ─── Form buttons ─────────────────────────────────────────────────────────────

export interface TsFormConfirmation {
  title: string
  text: string
  buttons: {
    action: string
    label: string
    variant?: TsButtonVariant
    confirm?: boolean
    position?: "left" | "center" | "right"
  }[]
}

export interface TsFormButton {
  action: string
  label: string
  variant?: TsButtonVariant
  type?: "submit" | "button" | "reset"
  icon?: string
  position?: "left" | "center" | "right"
  confirmation?: TsFormConfirmation
}
