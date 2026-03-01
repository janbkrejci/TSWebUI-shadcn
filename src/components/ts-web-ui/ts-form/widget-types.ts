import type { ReactNode } from "react"

import { TsTableColumnDef } from "../ts-table/columns"

export type TsFieldType =
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

export interface TsFieldBase {
  label?: string
  required?: boolean
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  hint?: string
  /** Do not include this field's value in the final submission data */
  excludeFromSubmit?: boolean
  /**
   * Static error message from definition.
   * NOTE: For dynamic validation, prefer passing errors via the `errors` prop of TsForm.
   * This field serves as a fallback or for static validation states.
   */
  error?: string
}

// ─── Shared behaviour mixins ───────────────────────────────────────────────────

export interface TsFieldInputBehavior {
  placeholder?: string
  /** Select all text when the field is focused or clicked */
  selectAllOnFocus?: boolean
  /** Action emitted when Enter is pressed (e.g. 'focus:next', 'submit', 'click:save') */
  enterAction?: string
  /** Action on Escape: 'clear' clears the value, any other string emits form-key-action */
  escapeAction?: string
}

export interface TsFieldNumericRange {
  min?: number
  max?: number
  step?: number
}

export interface TsFieldWithOptions {
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
  /** Locale for number formatting (e.g. 'cs-CZ', 'en-US') */
  locale?: string
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

// ─── Utility type for partial updates ──────────────────────────────────────────

export interface TsFieldUpdate {
  type?: TsFieldType
  label?: string
  required?: boolean
  hidden?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  hint?: string
  error?: string
  min?: number
  max?: number
  step?: number
  roundTo?: number
  options?: TsFieldOptions[] | string[] | Record<string, unknown>[]
  notFoundMessage?: string
  rows?: number
  accept?: string
  multiple?: boolean
  innerLabel?: string
  targetEntity?: string
  mode?: "single" | "multiple"
  displayFields?: string[]
  chipDisplayFields?: string[]
  valueField?: string
  columns?: TsTableColumnDef[]
  showCreateButton?: boolean
  action?: string
  allowCustom?: boolean
  selectAllOnFocus?: boolean
  enterAction?: string
  escapeAction?: string
  dateFormat?: string
  content?: string
  value?: unknown
  variant?: TsButtonVariant | TsInfoboxVariant | "process"
}
