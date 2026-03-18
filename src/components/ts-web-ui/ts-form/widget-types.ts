import type { ReactNode } from "react"

import { TsTableColumnDef } from "../ts-table/columns"

/**
 * All available field types in the TsForm system.
 */
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
  | "button"
  | "separator"
  | "empty"
  | "table" // nested
  | "relationship"
  | "infobox"
  | "markdown"
  | "button-group"

// ─── Variant unions ────────────────────────────────────────────────────────────

/**
 * Standard visual variants for buttons based on Shadcn UI.
 */
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

/**
 * Visual variants for the Infobox widget.
 */
export type TsInfoboxVariant = "default" | "information" | "warning" | "success" | "destructive"

// ─── Options ──────────────────────────────────────────────────────────────────

/**
 * Represents a single selectable option in fields like Select, Radio, or Combobox.
 */
export interface TsFieldOptions {
  /** Human-readable text shown to the user */
  label: string
  /** Technical value stored in the form state */
  value: string | number | boolean
  /** Button variant used when this option is the active selection (button-group) */
  variant?: TsButtonVariant
  /** Whether the option is selectable */
  disabled?: boolean
}

// ─── Shared base properties (present on every field type) ─────────────────────

/**
 * Base properties shared by all field definitions in the TsForm system.
 */
export interface TsFieldBase {
  /** Label text shown above or next to the field */
  label?: string
  /** Whether the field is mandatory (visual indicator and validator check) */
  required?: boolean
  /** Whether the field is hidden from the UI (but still present in DOM and data) */
  hidden?: boolean
  /** Whether the field's label is hidden but its layout slot is preserved */
  hideLabel?: boolean
  /** Whether the field is disabled for user interaction */
  disabled?: boolean
  /** Whether the field is read-only (visual state, not necessarily disabling interaction) */
  readonly?: boolean
  /** Hint text shown below the field */
  hint?: string
  /** Do not include this field's value in the final submission data */
  excludeFromSubmit?: boolean
  /**
   * Static error message from definition.
   * NOTE: For dynamic validation, prefer passing errors via the `errors` prop of TsForm.
   * This field serves as a fallback or for static validation states.
   */
  error?: string
  /** Whether the field should be automatically focused on mount or tab change */
  autofocus?: boolean
  /** Action emitted when Enter is pressed (e.g. 'focus:next', 'submit', 'click:save') */
  enterAction?: string
  /** Action on Escape: 'clear' clears the value, any other string emits form-key-action */
  escapeAction?: string
}

// ─── Shared behaviour mixins ───────────────────────────────────────────────────

/**
 * Mixin for fields with text-based input behavior.
 */
export interface TsFieldInputBehavior {
  /** Placeholder text shown when the field is empty */
  placeholder?: string
  /** Select all text when the field is focused or clicked */
  selectAllOnFocus?: boolean
}

/**
 * Mixin for fields that support numeric ranges (Number, Slider).
 */
export interface TsFieldNumericRange {
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Step increment for the value */
  step?: number
}

/**
 * Mixin for fields that provide a list of options.
 */
export interface TsFieldWithOptions {
  /** Placeholder shown when no option is selected */
  placeholder?: string
  /** Static list of options or a reference to a dynamic source */
  options?: TsFieldOptions[] | string[]
  /** Message shown when no option matches the search (default: "Not found.") */
  notFoundMessage?: string
}

// ─── Per-type field interfaces ─────────────────────────────────────────────────

/** Definition for standard text and password input fields. */
export interface TsTextField extends TsFieldBase, TsFieldInputBehavior {
  type: "text" | "password"
}

/** Definition for multi-line text input fields. */
export interface TsTextareaField extends TsFieldBase, TsFieldInputBehavior {
  type: "textarea"
  /** Number of visible text lines */
  rows?: number
}

/** Definition for numeric input fields with rounding and localization. */
export interface TsNumberField extends TsFieldBase, TsFieldInputBehavior, TsFieldNumericRange {
  type: "number"
  /** Number of decimal places for rounding and display */
  roundTo?: number
  /** Locale for number formatting (e.g. 'cs-CZ', 'en-US') */
  locale?: string
}

/** Definition for slider-based numeric input. */
export interface TsSliderField extends TsFieldBase, TsFieldNumericRange {
  type: "slider"
}

/** Definition for standard single-selection dropdown. */
export interface TsSelectField extends TsFieldBase {
  type: "select"
  /** Placeholder shown when no option is selected */
  placeholder?: string
  /** Available options */
  options?: TsFieldOptions[] | string[]
}

/** Definition for multi-selection tag-based field. */
export interface TsMultiselectField extends TsFieldBase, TsFieldWithOptions {
  type: "multiselect"
}

/** Definition for searchable dropdown with optional custom values. */
export interface TsComboboxField extends TsFieldBase, TsFieldWithOptions {
  type: "combobox"
  /** Allow the user to enter a custom value not present in the options list */
  allowCustom?: boolean
  /** Select all text when the field is focused or clicked */
  selectAllOnFocus?: boolean
  /** Whether the field can be cleared by the user */
  clearable?: boolean
}

/** Definition for radio button groups. */
export interface TsRadioField extends TsFieldBase {
  type: "radio"
  /** Available options */
  options?: TsFieldOptions[] | string[]
}

/** Definition for standard boolean checkbox. */
export interface TsCheckboxField extends TsFieldBase {
  type: "checkbox"
}

/** Definition for standard boolean toggle switch. */
export interface TsSwitchField extends TsFieldBase {
  type: "switch"
}

/** Definition for a group of buttons acting as a selection field. */
export interface TsButtonGroupField extends TsFieldBase {
  type: "button-group"
  /** Available options */
  options?: TsFieldOptions[] | string[]
  /** "process" renders a chevron-style process stepper; omit for a standard button group */
  variant?: "process"
}

/** Definition for date picker. */
export interface TsDateField extends TsFieldBase {
  type: "date"
  /** Placeholder for the text input part */
  placeholder?: string
  /** Date format string using date-fns tokens (default: "d.M.yyyy") */
  dateFormat?: string
  /** Select all text when the field is focused or clicked */
  selectAllOnFocus?: boolean
  /** Global locale for widgets (e.g. 'cs-CZ') */
  locale?: string
  /** Show Today button in calendar popup */
  showTodayButton?: boolean
  /** Show Clear button in calendar popup */
  showClearButton?: boolean
  /** Custom label for Today button */
  todayButtonText?: string
  /** Custom label for Clear button */
  clearButtonText?: string
}

/** Definition for date and time picker. */
export interface TsDateTimeField extends TsFieldBase {
  type: "datetime"
  /** Placeholder for the text input part */
  placeholder?: string
  /** Date format string using date-fns tokens (default: "d.M.yyyy HH:mm") */
  dateFormat?: string
  /** Select all text when the field is focused or clicked */
  selectAllOnFocus?: boolean
  /** Global locale for widgets (e.g. 'cs-CZ') */
  locale?: string
  /** Show Today button in calendar popup */
  showTodayButton?: boolean
  /** Show Clear button in calendar popup */
  showClearButton?: boolean
  /** Custom label for Today button */
  todayButtonText?: string
  /** Custom label for Clear button */
  clearButtonText?: string
}

/**
 * Represents a pre-existing file (e.g. from a database) in the File widget.
 */
export interface TsFileDescriptor {
  /** Unique identifier for the file */
  id?: string | number
  /** Filename for display and download */
  name: string
  /** Size in bytes */
  size?: number
  /** URL for downloading the file */
  url?: string
  /** MIME type */
  type?: string
  /** Any other custom metadata */
  [key: string]: unknown
}

/** Definition for file uploaders. */
export interface TsFileField extends TsFieldBase {
  type: "file"
  /** Accepted file types (e.g. ".pdf,.doc" or "image/*") */
  accept?: string
  /** Allow multiple file selection */
  multiple?: boolean
  /** Label shown inside the drop zone */
  innerLabel?: string
  /** Whether to show the drag and drop area (default: true) */
  showDropZone?: boolean
  /** Label for the 'Add file' link (used when dropzone is hidden) */
  addFileLabel?: string
}

/** Definition for action-only buttons within the form layout. */
export interface TsButtonField extends TsFieldBase {
  type: "button"
  /** Action name emitted when the button is clicked */
  action?: string
  /** Visual variant of the button */
  variant?: TsButtonVariant
}

/** Definition for horizontal section dividers. */
export interface TsSeparatorField extends TsFieldBase {
  type: "separator"
}

/** Definition for empty layout placeholders. */
export interface TsEmptyField extends TsFieldBase {
  type: "empty"
}

/** Definition for nested editable data tables. */
export interface TsTableField extends TsFieldBase {
  type: "table"
  /** Column definitions for the nested table */
  columns?: TsTableColumnDef[]
  /** Whether to show a button for adding new rows */
  showCreateButton?: boolean
}

/** Definition for complex entity relationship selectors. */
export interface TsRelationshipField extends TsFieldBase {
  type: "relationship"
  /** Placeholder text */
  placeholder?: string
  /** Entity name used for placeholder text and search label */
  targetEntity?: string
  /** Single or multiple selection */
  mode?: "single" | "multiple"
  /** Whether to use a dropdown (Popover) or a full Dialog for selection */
  variant?: "dropdown" | "dialog"
  /** Field names to display in search results */
  displayFields?: string[]
  /** Field names to display inside the selected chip */
  chipDisplayFields?: string[]
  /** Full column definitions for the search table (optional, overrides displayFields) */
  columns?: TsTableColumnDef[]
  /** Field used as the stored value / primary key */
  valueField?: string
  /** Available records to select from (static or pre-fetched) */
  options?: Record<string, unknown>[]
}

/** Definition for information display boxes. */
export interface TsInfoboxField extends TsFieldBase {
  type: "infobox"
  /** Static string content */
  content?: string
  /** Dynamic ReactNode content */
  value?: ReactNode
  /** Visual variant of the box */
  variant?: TsInfoboxVariant
  /** Name of the Lucide icon to display (overrides default variant icon) */
  icon?: string
  /** Whether the infobox can be closed by the user */
  closable?: boolean
}

/** Definition for read-only markdown rendering. */
export interface TsMarkdownField extends TsFieldBase {
  type: "markdown"
  /** Static markdown content */
  content?: string
  /** Dynamic markdown content from form data */
  value?: string
}

// ─── Main discriminated union ──────────────────────────────────────────────────

/**
 * Union of all possible field definitions.
 * Discriminated by the 'type' property.
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

// ─── Utility type for partial updates ──────────────────────────────────────────

/**
 * Flat structure containing all possible field properties for easier partial updates.
 * Used primarily in the Form Editor or for dynamic field modifications.
 */
export interface TsFieldUpdate {
  type?: TsFieldType
  label?: string
  required?: boolean
  hidden?: boolean
  hideLabel?: boolean
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
  autofocus?: boolean
  dateFormat?: string
  content?: string
  value?: unknown
  variant?: TsButtonVariant | TsInfoboxVariant | "process"
}
