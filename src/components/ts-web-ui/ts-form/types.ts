import { TsButtonVariant, TsFieldDef } from "./widget-types"

// Re-export commonly used types for easier imports
export * from "./widget-types"

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

// ─── Main Form Props ──────────────────────────────────────────────────────────

export interface TsFormProps {
  layout: TsFormLayout
  fields: Record<string, TsFieldDef>
  values?: Record<string, unknown>
  buttons?: TsFormButton[]
  errors?: Record<string, string>
  onAction?: (action: string, data: Record<string, unknown>) => void
  onFieldChange?: (field: string, value: unknown, formData: Record<string, unknown>) => void
  readOnly?: boolean
  className?: string
  activeTab?: string
}
