import { TsButtonVariant, TsFieldDef } from "./widget-types"

// Re-export commonly used types for easier imports
export * from "./widget-types"

// ─── Form definition ──────────────────────────────────────────────────────────

/**
 * Complete structure of a TsForm.
 * This object can be serialized/deserialized for dynamic form generation.
 */
export interface TsFormDef {
  /** Layout configuration (tabs or rows) */
  layout: TsLayout
  /** Dictionary of field definitions by key */
  fields: Record<string, TsFieldDef>
  /** Optional bottom buttons configuration */
  buttons?: TsButton[]
}

// ─── Form layout ──────────────────────────────────────────────────────────────

/**
 * Single item in a form row (field reference or special layout type).
 */
export interface TsRowItem {
  /** Key referencing fields object, or special type like 'empty' or 'separator' */
  field: string
  /** CSS grid width (e.g. '1fr', '200px', '50%') */
  width?: string
  /** Special layout type override */
  type?: "empty" | "separator"
  /** Label for 'separator' type */
  label?: string
  /** Horizontal alignment of the widget within its grid cell */
  align?: "left" | "center" | "right"
}

/**
 * Array of items forming one horizontal row in the layout grid.
 */
export type TsRow = TsRowItem[]

/**
 * Tab configuration for multi-page forms.
 */
export interface TsTab {
  /** Human-readable label for the tab */
  label: string
  /** Rows content within this tab */
  rows: TsRow[]
}

/**
 * Main layout definition for TsForm.
 * Supports either a multi-tab view or a flat list of rows.
 */
export interface TsLayout {
  /** Optional multi-tab configuration */
  tabs?: TsTab[]
  /** Flat row list for single-page forms (ignored if tabs is provided) */
  rows?: TsRow[]
}

// ─── Form buttons ─────────────────────────────────────────────────────────────

/**
 * Configuration for confirmation dialogs used by buttons.
 */
export interface TsConfirmation {
  /** Title text shown in the dialog header */
  title: string
  /** Detailed text message explaining the action and its consequences */
  text: string
  /** Buttons shown within the confirmation dialog */
  buttons: {
    /** Technical action name emitted if clicked */
    action: string
    /** Label text for the button */
    label: string
    /** Visual style variant */
    variant?: TsButtonVariant
    /** Whether this button triggers the 'confirm' action of the parent button */
    confirm?: boolean
    /** Visual position within the footer */
    position?: "left" | "center" | "right"
  }[]
}

/**
 * Configuration for a form action button.
 */
export interface TsButton {
  /** Technical action name emitted on click */
  action: string
  /** Human-readable label shown on the button */
  label: string
  /** Visual style variant from Shadcn/UI (e.g. 'default', 'outline', 'destructive') */
  variant?: TsButtonVariant
  /** HTML button type. 'submit' triggers form submission and internal validation check. */
  type?: "submit" | "button" | "reset"
  /** Lucide icon name (optional) */
  icon?: string
  /** Position in the bottom button bar */
  position?: "left" | "center" | "right"
  /** Optional confirmation dialog config before executing the action */
  confirmation?: TsConfirmation
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is hidden */
  hidden?: boolean
}

// ─── Main Form Props ──────────────────────────────────────────────────────────

/**
 * Recursive structure for form validation errors.
 */
export type TsErrors = {
  [key: string]: string | TsErrors | TsErrors[] | Record<string, unknown> | undefined
}

/**
 * Props for the TsForm component.
 */
export interface TsFormProps {
  /** Layout definition (tabs or rows) */
  layout: TsLayout
  /** Dictionary of field definitions */
  fields: Record<string, TsFieldDef>
  /** Initial or current values of form fields (deep object support) */
  values?: Record<string, unknown>
  /** Bottom button bar configuration */
  buttons?: TsButton[]
  /** External validation errors from parent/backend */
  errors?: TsErrors
  /** Callback triggered when any button action is executed */
  onAction?: (action: string, data: Record<string, unknown>) => void
  /** Callback triggered on every field change (user interaction) */
  onFieldChange?: (name: string, value: unknown, data: Record<string, unknown>) => void
  /** Set the whole form to read-only mode */
  readOnly?: boolean
  /** Custom CSS classes for the container */
  className?: string
  /** Global locale for widgets (e.g. 'cs-CZ') */
  locale?: string
}
