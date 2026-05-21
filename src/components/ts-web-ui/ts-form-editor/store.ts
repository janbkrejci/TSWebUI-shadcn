"use client"

/**
 * Form Editor Store - Zustand store for form editor state management
 * Contains all logic for form manipulation
 */
import { create } from "zustand"

import { TsButton, TsFieldDef, TsFieldUpdate, TsRowItem } from "../ts-form/types"
import { EditorFormDefinition, EditorRow, EditorRowItem, EditorSelection, EditorTab } from "./types"

// ============================================================================
// Helper functions
// ============================================================================

/** Generates a unique ID */
const generateId = (): string => Math.random().toString(36).substring(2, 11)

// Field IDs are used as JSON keys and should stay integration-friendly.
export const VALID_FIELD_KEY = /^[a-zA-Z_][a-zA-Z0-9_-]*$/

/** Gets the default label for a field type */
const getDefaultLabel = (type: TsFieldDef["type"]): string => {
  const labels: Record<string, string> = {
    text: "Text field",
    textarea: "Description",
    password: "Password",
    number: "Number",
    select: "Select",
    multiselect: "Multi select",
    combobox: "Combobox",
    radio: "Choice",
    checkbox: "Checkbox",
    switch: "Switch",
    "button-group": "Button group",
    date: "Date",
    datetime: "Date and time",
    slider: "Slider",
    file: "File",
    relationship: "Relationship",
    separator: "Section",
    infobox: "Information",
    markdown: "Text",
    button: "Button",
    table: "Table",
    empty: "",
  }
  return labels[type] || "Field"
}

/** Creates a default field definition based on type */
const createDefaultFieldDef = (type: TsFieldDef["type"]): TsFieldDef => {
  const label = getDefaultLabel(type)
  const defaultOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ]

  switch (type) {
    case "text":
    case "password":
      return { type, label }
    case "textarea":
      return { type, label }
    case "number":
      return { type, label }
    case "slider":
      return { type, label }
    case "select":
      return { type, label, options: defaultOptions }
    case "multiselect":
      return { type, label, options: defaultOptions }
    case "radio":
      return { type, label, options: defaultOptions }
    case "combobox":
      return { type, label, options: defaultOptions }
    case "button-group":
      return { type, label, options: defaultOptions }
    case "checkbox":
      return { type, label }
    case "switch":
      return { type, label }
    case "date":
      return { type, label }
    case "datetime":
      return { type, label }
    case "file":
      return { type, label }
    case "infobox":
      return { type, label, content: "Information text" }
    case "markdown":
      return { type, label, content: "**Markdown** content" }
    case "separator":
      return { type, label: "Section" }
    case "button":
      return { type, label: "Button" }
    case "table":
      return { type, label }
    case "relationship":
      return { type, label }
    case "empty":
      return { type }
    default:
      return { type, label }
  }
}

/** Creates an empty row */
const createEmptyRow = (columnCount = 1): EditorRow => ({
  id: generateId(),
  items: Array.from({ length: Math.max(1, columnCount) }, () => ({
    id: generateId(),
    field: "",
    type: "empty" as const,
    width: "1fr",
  })),
})

/** Creates a default tab */
const createDefaultTab = (label: string): EditorTab => ({
  id: generateId(),
  label,
  rows: [createEmptyRow()],
})

/** Default form state */
const getInitialForm = (): EditorFormDefinition => ({
  mode: "single",
  rows: [createEmptyRow()],
  fields: {},
  buttons: [
    { action: "cancel", label: "Cancel", variant: "outline" },
    { action: "submit", label: "Save", variant: "default", type: "submit" },
  ],
})

const mapEditorItemToTsRowItem = (item: EditorRowItem): TsRowItem | null => {
  const isSeparator = item.type === "separator"

  if (!item.field && !isSeparator) {
    return null
  }

  const rowItem: TsRowItem = {
    field: item.field,
  }

  // Only export width if it's NOT the default 1fr
  if (item.width && item.width !== "1fr") {
    rowItem.width = item.width
  }

  if (item.align) {
    rowItem.align = item.align
  }

  if (isSeparator) {
    rowItem.type = "separator"
    if (item.label) {
      rowItem.label = item.label
    }
  }

  return rowItem
}

const mapTsRowItemToEditorItem = (
  item: TsRowItem,
  fields: Record<string, TsFieldDef>
): EditorRowItem => {
  const isSeparator = item.type === "separator"

  const fieldExists = !!(item.field && fields[item.field])

  const editorItem: EditorRowItem = {
    id: generateId(),
    field: isSeparator ? item.field || "" : fieldExists ? item.field : "",
    type: isSeparator ? "separator" : fieldExists ? fields[item.field].type || "empty" : "empty",
    width: item.width || "1fr",
  }

  if (item.align) {
    editorItem.align = item.align as "left" | "center" | "right"
  }

  if (item.label) {
    editorItem.label = item.label
  }

  return editorItem
}

// ============================================================================
// State interface
// ============================================================================

export interface FormEditorState {
  // Data
  form: EditorFormDefinition
  selection: EditorSelection
  activeTabIndex: number
  history: EditorFormDefinition[]
  historyIndex: number

  // Layout actions
  setMode: (mode: "tabs" | "single") => void
  addTab: (label?: string) => void
  removeTab: (tabIndex: number) => void
  updateTabLabel: (tabIndex: number, label: string) => void
  moveTab: (fromIndex: number, toIndex: number) => void
  setActiveTabIndex: (index: number) => void

  // Rows
  addRow: (tabIndex: number, afterRowIndex?: number, columnCount?: number) => void
  removeRow: (tabIndex: number, rowIndex: number) => void
  reorderRows: (tabIndex: number, fromIndex: number, toIndex: number) => void

  // Columns (grid)
  addColumnToRow: (tabIndex: number, rowIndex: number) => void
  insertColumnAtPosition: (tabIndex: number, rowIndex: number, itemIndex: number) => void
  removeColumnFromRow: (tabIndex: number, rowIndex: number, itemIndex: number) => void
  updateColumnWidth: (tabIndex: number, rowIndex: number, itemIndex: number, width: string) => void

  // Fields
  addField: (
    type: TsFieldDef["type"],
    tabIndex: number,
    rowIndex: number,
    itemIndex: number
  ) => void
  removeField: (fieldName: string) => void
  renameField: (oldName: string, newName: string) => boolean
  updateFieldConfig: (fieldName: string, config: TsFieldUpdate) => void
  moveField: (
    fromTab: number,
    fromRow: number,
    fromItem: number,
    toTab: number,
    toRow: number,
    toItem: number
  ) => void

  // Buttons
  addButton: () => void
  removeButton: (index: number) => void
  updateButton: (index: number, button: Partial<TsButton>) => void
  moveButton: (fromIndex: number, toIndex: number) => void

  // Selection
  setSelection: (selection: EditorSelection) => void
  clearSelection: () => void

  // Import/Export
  importJson: (json: string) => boolean
  exportJson: () => string
  resetForm: () => void

  // Undo/Redo
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

/** Removes default or empty values from field definition for cleaner export */
const cleanFieldDefinition = (field: TsFieldDef): TsFieldDef => {
  const cleaned = { ...field } as Record<string, unknown>

  // Properties to remove if they match these defaults
  const defaults: Record<string, unknown> = {
    required: false,
    hidden: false,
    disabled: false,
    readonly: false,
    hideLabel: false,
    selectAllOnFocus: false,
    excludeFromSubmit: false,
    autofocus: false,
    step: 1,
    roundTo: undefined,
    min: undefined,
    max: undefined,
    rows: 3,
    variant: "default",
    placeholder: "",
    hint: "",
    error: "",
  }

  // Adjust defaults based on type if needed
  if (field.type === "slider") {
    defaults.min = 0
    defaults.max = 100
  }

  Object.keys(cleaned).forEach((key) => {
    const value = cleaned[key]

    // Remove if matches default
    if (value === defaults[key]) {
      delete cleaned[key]
      return
    }

    // Remove if null or undefined
    if (value === null || value === undefined) {
      delete cleaned[key]
      return
    }

    // Remove empty arrays or objects
    if (Array.isArray(value) && value.length === 0) {
      delete cleaned[key]
      return
    }

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      // Special case: don't delete empty objects if they are required by some types
      // But for our schema, they are usually optional
      delete cleaned[key]
    }
  })

  return cleaned as unknown as TsFieldDef
}

/** Removes default values from button definition for cleaner export */
const cleanButtonDefinition = (button: TsButton): TsButton => {
  const cleaned = { ...button } as Record<string, unknown>

  const defaults: Record<string, unknown> = {
    variant: "default",
    disabled: false,
    hidden: false,
    position: "right",
    type: "button",
  }

  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === defaults[key]) {
      delete cleaned[key]
    }
    if (cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === "") {
      if (key !== "action" && key !== "label") {
        delete cleaned[key]
      }
    }
  })

  return cleaned as unknown as TsButton
}

// ============================================================================
// Store
// ============================================================================

export const useFormEditorStore = create<FormEditorState>()((set, get) => ({
  // === Default state ===
  form: getInitialForm(),
  selection: { type: null, id: null },
  activeTabIndex: 0,
  history: [],
  historyIndex: -1,

  // === Layout actions ===

  setMode: (mode: "tabs" | "single") => {
    const { form, saveToHistory } = get()
    saveToHistory()

    if (mode === "tabs" && form.mode === "single") {
      set({
        form: {
          ...form,
          mode: "tabs",
          tabs: [
            {
              id: generateId(),
              label: "Main",
              rows: form.rows || [createEmptyRow()],
            },
          ],
          rows: undefined,
        },
      })
    } else if (mode === "single" && form.mode === "tabs") {
      const allRows = form.tabs?.flatMap((t: EditorTab) => t.rows) || [createEmptyRow()]
      set({
        form: {
          ...form,
          mode: "single",
          rows: allRows,
          tabs: undefined,
        },
      })
    }
  },

  addTab: (label?: string) => {
    const { form, saveToHistory } = get()
    if (form.mode !== "tabs") return

    saveToHistory()
    const newTab = createDefaultTab(label || `Tab ${(form.tabs?.length || 0) + 1}`)
    set({
      form: {
        ...form,
        tabs: [...(form.tabs || []), newTab],
      },
    })
  },

  removeTab: (tabIndex: number) => {
    const { form, saveToHistory, activeTabIndex } = get()
    if (form.mode !== "tabs" || !form.tabs || form.tabs.length <= 1) return

    saveToHistory()
    const newTabs = form.tabs.filter((_: EditorTab, i: number) => i !== tabIndex)
    set({
      form: { ...form, tabs: newTabs },
      activeTabIndex: Math.min(activeTabIndex, newTabs.length - 1),
    })
  },

  updateTabLabel: (tabIndex: number, label: string) => {
    const { form, saveToHistory } = get()
    if (form.mode !== "tabs" || !form.tabs) return

    saveToHistory()
    const newTabs = [...form.tabs]
    newTabs[tabIndex] = { ...newTabs[tabIndex], label }
    set({ form: { ...form, tabs: newTabs } })
  },

  moveTab: (fromIndex: number, toIndex: number) => {
    const { form, saveToHistory } = get()
    if (form.mode !== "tabs" || !form.tabs) return

    saveToHistory()
    const newTabs = [...form.tabs]
    const [movedTab] = newTabs.splice(fromIndex, 1)
    newTabs.splice(toIndex, 0, movedTab)
    set({ form: { ...form, tabs: newTabs } })
  },

  setActiveTabIndex: (index: number) => set({ activeTabIndex: index }),

  // === Rows ===

  addRow: (tabIndex: number, afterRowIndex?: number, columnCount?: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newRow = createEmptyRow(columnCount)

    if (form.mode === "single") {
      const newRows = [...(form.rows || [])]
      const insertIndex = afterRowIndex !== undefined ? afterRowIndex + 1 : newRows.length
      newRows.splice(insertIndex, 0, newRow)
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      const insertIndex = afterRowIndex !== undefined ? afterRowIndex + 1 : rows.length
      rows.splice(insertIndex, 0, newRow)
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  removeRow: (tabIndex: number, rowIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    // Get fields to remove from row
    const rowToRemove =
      form.mode === "single" ? form.rows?.[rowIndex] : form.tabs?.[tabIndex]?.rows[rowIndex]

    const fieldsToRemove =
      rowToRemove?.items
        .filter(
          (item: EditorRowItem) => item.field && item.type !== "empty" && item.type !== "separator"
        )
        .map((item: EditorRowItem) => item.field) || []

    // Remove field from fields
    const newFields = { ...form.fields }
    fieldsToRemove.forEach((f: string | undefined) => {
      if (f) delete newFields[f]
    })

    if (form.mode === "single") {
      const newRows = form.rows?.filter((_: EditorRow, i: number) => i !== rowIndex)
      set({ form: { ...form, rows: newRows, fields: newFields } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      newTabs[tabIndex] = {
        ...newTabs[tabIndex],
        rows: newTabs[tabIndex].rows.filter((_: EditorRow, i: number) => i !== rowIndex),
      }
      set({ form: { ...form, tabs: newTabs, fields: newFields } })
    }
  },

  moveRow: (tabIndex: number, fromIndex: number, toIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    if (form.mode === "single" && form.rows) {
      const newRows = [...form.rows]
      const [movedRow] = newRows.splice(fromIndex, 1)
      newRows.splice(toIndex, 0, movedRow)
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      const [movedRow] = rows.splice(fromIndex, 1)
      rows.splice(toIndex, 0, movedRow)
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  // === Columns (grid) ===

  addColumnToRow: (tabIndex: number, rowIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newItem: EditorRowItem = {
      id: generateId(),
      field: "",
      type: "empty",
      width: "1fr",
    }

    if (form.mode === "single" && form.rows) {
      const newRows = [...form.rows]
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        items: [...newRows[rowIndex].items, newItem],
      }
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      rows[rowIndex] = {
        ...rows[rowIndex],
        items: [...rows[rowIndex].items, newItem],
      }
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  insertColumnAtPosition: (tabIndex: number, rowIndex: number, itemIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newItem: EditorRowItem = {
      id: generateId(),
      field: "",
      type: "empty",
      width: "1fr",
    }

    if (form.mode === "single" && form.rows) {
      const newRows = [...form.rows]
      const row = newRows[rowIndex]
      const insertIndex = Math.max(0, Math.min(itemIndex, row.items.length))

      newRows[rowIndex] = {
        ...row,
        items: [...row.items.slice(0, insertIndex), newItem, ...row.items.slice(insertIndex)],
      }

      set({ form: { ...form, rows: newRows } })
      return
    }

    if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      const row = rows[rowIndex]
      const insertIndex = Math.max(0, Math.min(itemIndex, row.items.length))

      rows[rowIndex] = {
        ...row,
        items: [...row.items.slice(0, insertIndex), newItem, ...row.items.slice(insertIndex)],
      }

      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  removeColumnFromRow: (tabIndex: number, rowIndex: number, itemIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    if (form.mode === "single" && form.rows) {
      const newRows = [...form.rows]
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        items: newRows[rowIndex].items.filter((_: EditorRowItem, i: number) => i !== itemIndex),
      }
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      rows[rowIndex] = {
        ...rows[rowIndex],
        items: rows[rowIndex].items.filter((_: EditorRowItem, i: number) => i !== itemIndex),
      }
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  updateColumnWidth: (tabIndex: number, rowIndex: number, itemIndex: number, width: string) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    if (form.mode === "single" && form.rows) {
      const newRows = [...form.rows]
      const items = [...newRows[rowIndex].items]
      items[itemIndex] = { ...items[itemIndex], width }
      newRows[rowIndex] = { ...newRows[rowIndex], items }
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      const items = [...rows[rowIndex].items]
      items[itemIndex] = { ...items[itemIndex], width }
      rows[rowIndex] = { ...rows[rowIndex], items }
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  // === Fields ===

  addField: (type: TsFieldDef["type"], tabIndex: number, rowIndex: number, itemIndex: number) => {
    const { form, saveToHistory, setSelection } = get()
    saveToHistory()

    // Generate unique field name
    const baseName = type.replace("-", "_")
    let fieldName = baseName
    let counter = 1
    while (form.fields[fieldName]) {
      fieldName = `${baseName}_${counter++}`
    }

    // Create field definition
    const fieldDef = createDefaultFieldDef(type)

    // Update layout
    if (form.mode === "single" && form.rows) {
      const newRows = [...form.rows]
      const items = [...newRows[rowIndex].items]
      items[itemIndex] = { ...items[itemIndex], field: fieldName, type }
      newRows[rowIndex] = { ...newRows[rowIndex], items }
      set({
        form: {
          ...form,
          rows: newRows,
          fields: { ...form.fields, [fieldName]: fieldDef },
        },
      })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      const items = [...rows[rowIndex].items]
      items[itemIndex] = { ...items[itemIndex], field: fieldName, type }
      rows[rowIndex] = { ...rows[rowIndex], items }
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({
        form: {
          ...form,
          tabs: newTabs,
          fields: { ...form.fields, [fieldName]: fieldDef },
        },
      })
    }

    // Select new field
    setSelection({ type: "field", id: fieldName, tabIndex, rowIndex, itemIndex })
  },

  removeField: (fieldName: string) => {
    const { form, saveToHistory, clearSelection, selection } = get()
    saveToHistory()

    // Remove from fields
    const newFields = { ...form.fields }
    delete newFields[fieldName]

    // Remove from layout or replace with empty
    const clearFieldFromItem = (item: EditorRowItem): EditorRowItem => {
      if (item.field === fieldName) {
        return { ...item, field: "", type: "empty" }
      }
      return item
    }

    if (form.mode === "single" && form.rows) {
      const newRows = form.rows.map((row: EditorRow) => ({
        ...row,
        items: row.items.map(clearFieldFromItem),
      }))
      set({ form: { ...form, rows: newRows, fields: newFields } })
    } else if (form.tabs) {
      const newTabs = form.tabs.map((tab: EditorTab) => ({
        ...tab,
        rows: tab.rows.map((row: EditorRow) => ({
          ...row,
          items: row.items.map(clearFieldFromItem),
        })),
      }))
      set({ form: { ...form, tabs: newTabs, fields: newFields } })
    }

    // Clear selection if field was selected
    if (selection.id === fieldName) {
      clearSelection()
    }
  },

  renameField: (oldName: string, newName: string) => {
    const { form, saveToHistory, selection } = get()

    const trimmedName = newName.trim()

    if (!form.fields[oldName]) {
      return false
    }

    if (!trimmedName) {
      return false
    }

    if (!VALID_FIELD_KEY.test(trimmedName)) {
      return false
    }

    if (oldName === trimmedName) {
      return true
    }

    if (form.fields[trimmedName]) {
      return false
    }

    if (!form.rows && !form.tabs) {
      return false
    }

    saveToHistory()

    const newFields = { ...form.fields }
    newFields[trimmedName] = newFields[oldName]
    delete newFields[oldName]

    const renameFieldInItem = (item: EditorRowItem): EditorRowItem =>
      item.field === oldName ? { ...item, field: trimmedName } : item

    const nextSelection =
      selection.type === "field" && selection.id === oldName
        ? { ...selection, id: trimmedName }
        : selection

    if (form.mode === "single" && form.rows) {
      const newRows = form.rows.map((row: EditorRow) => ({
        ...row,
        items: row.items.map(renameFieldInItem),
      }))

      set({ form: { ...form, rows: newRows, fields: newFields }, selection: nextSelection })
      return true
    }

    if (form.tabs) {
      const newTabs = form.tabs.map((tab: EditorTab) => ({
        ...tab,
        rows: tab.rows.map((row: EditorRow) => ({
          ...row,
          items: row.items.map(renameFieldInItem),
        })),
      }))

      set({ form: { ...form, tabs: newTabs, fields: newFields }, selection: nextSelection })
      return true
    }

    return false
  },

  updateFieldConfig: (fieldName: string, config: TsFieldUpdate) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    set({
      form: {
        ...form,
        fields: {
          ...form.fields,
          [fieldName]: { ...form.fields[fieldName], ...config } as TsFieldDef,
        },
      },
    })
  },

  moveField: (
    fromTab: number,
    fromRow: number,
    fromItem: number,
    toTab: number,
    toRow: number,
    toItem: number
  ) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newForm = JSON.parse(JSON.stringify(form)) as EditorFormDefinition

    // Get source item
    const sourceRows = newForm.mode === "single" ? newForm.rows : newForm.tabs?.[fromTab]?.rows
    if (!sourceRows) return

    const sourceItem = sourceRows[fromRow].items[fromItem]
    const fieldName = sourceItem.field
    const fieldType = sourceItem.type

    // Remove from source (make it empty)
    sourceRows[fromRow].items[fromItem] = {
      id: generateId(),
      field: "",
      type: "empty",
      width: sourceItem.width,
    }

    // Place in target slot
    const targetRows = newForm.mode === "single" ? newForm.rows : newForm.tabs?.[toTab]?.rows
    if (!targetRows) return

    const targetRow = targetRows[toRow]
    const targetItem = targetRow.items[toItem]

    // If target is empty, just place it there
    if (!targetItem.field || targetItem.type === "empty") {
      targetRow.items[toItem] = {
        ...targetItem,
        field: fieldName,
        type: fieldType,
      }
    } else {
      // If target is occupied, swap them or find first empty slot?
      // For now, let's swap for better UX
      const oldTargetField = targetItem.field
      const oldTargetType = targetItem.type

      targetRow.items[toItem] = {
        ...targetItem,
        field: fieldName,
        type: fieldType,
      }

      // Return old target to source position
      sourceRows[fromRow].items[fromItem].field = oldTargetField
      sourceRows[fromRow].items[fromItem].type = oldTargetType
    }

    set({ form: newForm })
  },

  reorderRows: (tabIndex: number, fromIndex: number, toIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newForm = JSON.parse(JSON.stringify(form)) as EditorFormDefinition

    if (newForm.mode === "single" && newForm.rows) {
      const [movedRow] = newForm.rows.splice(fromIndex, 1)
      newForm.rows.splice(toIndex, 0, movedRow)
    } else if (newForm.tabs?.[tabIndex]) {
      const [movedRow] = newForm.tabs[tabIndex].rows.splice(fromIndex, 1)
      newForm.tabs[tabIndex].rows.splice(toIndex, 0, movedRow)
    }

    set({ form: newForm })
  },

  // === Buttons ===

  addButton: () => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newButton: TsButton = {
      action: `action_${form.buttons.length + 1}`,
      label: `Button ${form.buttons.length + 1}`,
      variant: "outline",
    }
    set({ form: { ...form, buttons: [...form.buttons, newButton] } })
  },

  removeButton: (index: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    set({
      form: {
        ...form,
        buttons: form.buttons.filter((_: TsButton, i: number) => i !== index),
      },
    })
  },

  updateButton: (index: number, button: Partial<TsButton>) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newButtons = [...form.buttons]
    newButtons[index] = { ...newButtons[index], ...button }
    set({ form: { ...form, buttons: newButtons } })
  },

  moveButton: (fromIndex: number, toIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()

    const newButtons = [...form.buttons]
    const [movedButton] = newButtons.splice(fromIndex, 1)
    newButtons.splice(toIndex, 0, movedButton)
    set({ form: { ...form, buttons: newButtons } })
  },

  // === Selection ===

  setSelection: (selection: EditorSelection) => set({ selection }),
  clearSelection: () => set({ selection: { type: null, id: null } }),

  // === Import/Export ===

  importJson: (json: string): boolean => {
    const { saveToHistory } = get()

    try {
      const parsed = JSON.parse(json)

      // Basic structure validation
      if (!parsed.fields || typeof parsed.fields !== "object") {
        return false
      }

      saveToHistory()

      // Convert to EditorFormDefinition
      const form: EditorFormDefinition = {
        mode: parsed.layout?.tabs ? "tabs" : "single",
        fields: parsed.fields,
        buttons: parsed.buttons || [],
      }

      if (parsed.layout?.tabs) {
        form.tabs = parsed.layout.tabs.map((tab: { label: string; rows: unknown[][] }) => ({
          id: generateId(),
          label: tab.label,
          rows: tab.rows.map((row: unknown[]) => ({
            id: generateId(),
            items: (row as TsRowItem[]).map((item) =>
              mapTsRowItemToEditorItem(item, parsed.fields)
            ),
          })),
        }))
      } else if (parsed.layout?.rows) {
        form.rows = parsed.layout.rows.map((row: unknown[]) => ({
          id: generateId(),
          items: (row as TsRowItem[]).map((item) => mapTsRowItemToEditorItem(item, parsed.fields)),
        }))
      } else {
        form.rows = [createEmptyRow()]
      }

      set({ form, selection: { type: null, id: null }, activeTabIndex: 0 })
      return true
    } catch {
      return false
    }
  },

  exportJson: (): string => {
    const { form } = get()

    // Clean field definitions
    const cleanedFields: Record<string, TsFieldDef> = {}
    Object.keys(form.fields).forEach((key) => {
      cleanedFields[key] = cleanFieldDefinition(form.fields[key])
    })

    // Convert to TsForm format
    const output: {
      fields: Record<string, TsFieldDef>
      layout: {
        tabs?: { label: string; rows: TsRowItem[][] }[]
        rows?: TsRowItem[][]
      }
      buttons: TsButton[]
    } = {
      fields: cleanedFields,
      layout: {},
      buttons: form.buttons.map(cleanButtonDefinition),
    }

    if (form.mode === "tabs" && form.tabs) {
      output.layout.tabs = form.tabs.map((tab: EditorTab) => ({
        label: tab.label,
        rows: tab.rows.map((row: EditorRow) =>
          row.items.map(mapEditorItemToTsRowItem).filter((item): item is TsRowItem => item !== null)
        ),
      }))
    } else if (form.rows) {
      output.layout.rows = form.rows.map((row: EditorRow) =>
        row.items.map(mapEditorItemToTsRowItem).filter((item): item is TsRowItem => item !== null)
      )
    }

    return JSON.stringify(output, null, 2)
  },

  resetForm: () => {
    const { saveToHistory } = get()
    saveToHistory()
    set({
      form: getInitialForm(),
      selection: { type: null, id: null },
      activeTabIndex: 0,
    })
  },

  // === Undo/Redo ===

  saveToHistory: () => {
    const { form, history, historyIndex } = get()

    // Trim future history if we are in the middle
    const newHistory = history.slice(0, historyIndex + 1)

    // Add current state (deep clone)
    newHistory.push(JSON.parse(JSON.stringify(form)))

    // Limit history size
    if (newHistory.length > 50) {
      newHistory.shift()
    }

    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < 0) return

    const previousForm = history[historyIndex]
    set({
      form: JSON.parse(JSON.stringify(previousForm)),
      historyIndex: historyIndex - 1,
    })
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return

    const nextForm = history[historyIndex + 1]
    set({
      form: JSON.parse(JSON.stringify(nextForm)),
      historyIndex: historyIndex + 1,
    })
  },
}))
