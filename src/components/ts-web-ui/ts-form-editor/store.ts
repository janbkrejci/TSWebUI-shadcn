"use client"

/**
 * Form Editor Store - Zustand store pro správu stavu editoru formulářů
 * Obsahuje veškerou logiku pro manipulaci s formulářem
 */

import { create } from 'zustand'
import { TsFieldDef, TsFormButton } from "../ts-form/types"
import { 
  EditorFormDefinition, 
  EditorRow, 
  EditorRowItem, 
  EditorTab, 
  EditorSelection 
} from './types'

// ============================================================================
// Helper funkce
// ============================================================================

/** Generuje unikátní ID */
const generateId = (): string => Math.random().toString(36).substring(2, 11)

/** Získá výchozí label pro typ pole */
const getDefaultLabel = (type: TsFieldDef['type']): string => {
  const labels: Record<string, string> = {
    text: 'Textové pole',
    textarea: 'Popis',
    password: 'Heslo',
    number: 'Číslo',
    select: 'Výběr',
    multiselect: 'Vícenásobný výběr',
    combobox: 'Combobox',
    radio: 'Volba',
    checkbox: 'Zaškrtávací pole',
    switch: 'Přepínač',
    'button-group': 'Skupina tlačítek',
    date: 'Datum',
    datetime: 'Datum a čas',
    slider: 'Posuvník',
    file: 'Soubor',
    image: 'Obrázek',
    relationship: 'Vztah',
    separator: 'Sekce',
    infobox: 'Informace',
    markdown: 'Text',
    button: 'Tlačítko',
    table: 'Tabulka',
    empty: '',
  }
  return labels[type] || 'Pole'
}

/** Vytvoří výchozí definici pole podle typu */
const createDefaultFieldDef = (type: TsFieldDef['type']): TsFieldDef => {
  const base: TsFieldDef = {
    type,
    label: getDefaultLabel(type),
  }

  switch (type) {
    case 'number':
      return { ...base, step: 1 }
    case 'slider':
      return { ...base, min: 0, max: 100, step: 1 }
    case 'textarea':
      return { ...base, rows: 3 }
    case 'select':
    case 'multiselect':
    case 'radio':
    case 'combobox':
    case 'button-group':
      return {
        ...base,
        options: [
          { label: 'Možnost 1', value: 'option1' },
          { label: 'Možnost 2', value: 'option2' },
        ]
      }
    case 'infobox':
      return { ...base, content: 'Informační text', variant: 'default' }
    case 'markdown':
      return { ...base, content: '**Markdown** obsah' }
    case 'separator':
      return { ...base, label: 'Sekce' }
    case 'button':
      return { ...base, variant: 'default', label: 'Tlačítko' }
    default:
      return base
  }
}

/** Vytvoří prázdný řádek */
const createEmptyRow = (): EditorRow => ({
  id: generateId(),
  items: [{
    id: generateId(),
    field: '',
    type: 'empty',
    width: '1fr',
  }]
})

/** Vytvoří výchozí tab */
const createDefaultTab = (label: string): EditorTab => ({
  id: generateId(),
  label,
  rows: [createEmptyRow()]
})

/** Výchozí stav formuláře */
const getInitialForm = (): EditorFormDefinition => ({
  mode: 'single',
  rows: [createEmptyRow()],
  fields: {},
  buttons: [
    { action: 'cancel', label: 'Zrušit', variant: 'outline' },
    { action: 'submit', label: 'Uložit', variant: 'default', type: 'submit' },
  ]
})

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
  
  // Layout akce
  setMode: (mode: 'tabs' | 'single') => void
  addTab: (label?: string) => void
  removeTab: (tabIndex: number) => void
  updateTabLabel: (tabIndex: number, label: string) => void
  moveTab: (fromIndex: number, toIndex: number) => void
  setActiveTabIndex: (index: number) => void
  
  // Řádky
  addRow: (tabIndex: number, afterRowIndex?: number) => void
  removeRow: (tabIndex: number, rowIndex: number) => void
  moveRow: (tabIndex: number, fromIndex: number, toIndex: number) => void
  
  // Sloupce (grid)
  addColumnToRow: (tabIndex: number, rowIndex: number) => void
  removeColumnFromRow: (tabIndex: number, rowIndex: number, itemIndex: number) => void
  updateColumnWidth: (tabIndex: number, rowIndex: number, itemIndex: number, width: string) => void
  
  // Pole
  addField: (type: TsFieldDef['type'], tabIndex: number, rowIndex: number, itemIndex: number) => void
  removeField: (fieldName: string) => void
  updateFieldConfig: (fieldName: string, config: Partial<TsFieldDef>) => void
  moveField: (fromTab: number, fromRow: number, fromItem: number, toTab: number, toRow: number, toItem: number) => void
  
  // Tlačítka
  addButton: () => void
  removeButton: (index: number) => void
  updateButton: (index: number, button: Partial<TsFormButton>) => void
  moveButton: (fromIndex: number, toIndex: number) => void
  
  // Výběr
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

// ============================================================================
// Store
// ============================================================================

export const useFormEditorStore = create<FormEditorState>()((set, get) => ({
  // === Výchozí stav ===
  form: getInitialForm(),
  selection: { type: null, id: null },
  activeTabIndex: 0,
  history: [],
  historyIndex: -1,

  // === Layout akce ===
  
  setMode: (mode: 'tabs' | 'single') => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    if (mode === 'tabs' && form.mode === 'single') {
      set({
        form: {
          ...form,
          mode: 'tabs',
          tabs: [{
            id: generateId(),
            label: 'Hlavní',
            rows: form.rows || [createEmptyRow()]
          }],
          rows: undefined,
        }
      })
    } else if (mode === 'single' && form.mode === 'tabs') {
      const allRows = form.tabs?.flatMap((t: EditorTab) => t.rows) || [createEmptyRow()]
      set({
        form: {
          ...form,
          mode: 'single',
          rows: allRows,
          tabs: undefined,
        }
      })
    }
  },

  addTab: (label?: string) => {
    const { form, saveToHistory } = get()
    if (form.mode !== 'tabs') return
    
    saveToHistory()
    const newTab = createDefaultTab(label || `Tab ${(form.tabs?.length || 0) + 1}`)
    set({
      form: {
        ...form,
        tabs: [...(form.tabs || []), newTab]
      }
    })
  },

  removeTab: (tabIndex: number) => {
    const { form, saveToHistory, activeTabIndex } = get()
    if (form.mode !== 'tabs' || !form.tabs || form.tabs.length <= 1) return
    
    saveToHistory()
    const newTabs = form.tabs.filter((_: EditorTab, i: number) => i !== tabIndex)
    set({
      form: { ...form, tabs: newTabs },
      activeTabIndex: Math.min(activeTabIndex, newTabs.length - 1)
    })
  },

  updateTabLabel: (tabIndex: number, label: string) => {
    const { form, saveToHistory } = get()
    if (form.mode !== 'tabs' || !form.tabs) return
    
    saveToHistory()
    const newTabs = [...form.tabs]
    newTabs[tabIndex] = { ...newTabs[tabIndex], label }
    set({ form: { ...form, tabs: newTabs } })
  },

  moveTab: (fromIndex: number, toIndex: number) => {
    const { form, saveToHistory } = get()
    if (form.mode !== 'tabs' || !form.tabs) return
    
    saveToHistory()
    const newTabs = [...form.tabs]
    const [movedTab] = newTabs.splice(fromIndex, 1)
    newTabs.splice(toIndex, 0, movedTab)
    set({ form: { ...form, tabs: newTabs } })
  },

  setActiveTabIndex: (index: number) => set({ activeTabIndex: index }),

  // === Řádky ===
  
  addRow: (tabIndex: number, afterRowIndex?: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    const newRow = createEmptyRow()
    
    if (form.mode === 'single') {
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
    
    // Získat pole k odstranění z řádku
    const rowToRemove = form.mode === 'single' 
      ? form.rows?.[rowIndex] 
      : form.tabs?.[tabIndex]?.rows[rowIndex]
    
    const fieldsToRemove = rowToRemove?.items
      .filter((item: EditorRowItem) => item.field && item.type !== 'empty' && item.type !== 'separator')
      .map((item: EditorRowItem) => item.field) || []
    
    // Odstranit pole z fields
    const newFields = { ...form.fields }
    fieldsToRemove.forEach((f: string | undefined) => {
      if (f) delete newFields[f]
    })
    
    if (form.mode === 'single') {
      const newRows = form.rows?.filter((_: EditorRow, i: number) => i !== rowIndex)
      set({ form: { ...form, rows: newRows, fields: newFields } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      newTabs[tabIndex] = {
        ...newTabs[tabIndex],
        rows: newTabs[tabIndex].rows.filter((_: EditorRow, i: number) => i !== rowIndex)
      }
      set({ form: { ...form, tabs: newTabs, fields: newFields } })
    }
  },

  moveRow: (tabIndex: number, fromIndex: number, toIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    if (form.mode === 'single' && form.rows) {
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

  // === Sloupce (grid) ===
  
  addColumnToRow: (tabIndex: number, rowIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    const newItem: EditorRowItem = {
      id: generateId(),
      field: '',
      type: 'empty',
      width: '1fr',
    }
    
    if (form.mode === 'single' && form.rows) {
      const newRows = [...form.rows]
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        items: [...newRows[rowIndex].items, newItem]
      }
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      rows[rowIndex] = {
        ...rows[rowIndex],
        items: [...rows[rowIndex].items, newItem]
      }
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  removeColumnFromRow: (tabIndex: number, rowIndex: number, itemIndex: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    if (form.mode === 'single' && form.rows) {
      const newRows = [...form.rows]
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        items: newRows[rowIndex].items.filter((_: EditorRowItem, i: number) => i !== itemIndex)
      }
      set({ form: { ...form, rows: newRows } })
    } else if (form.tabs) {
      const newTabs = [...form.tabs]
      const rows = [...newTabs[tabIndex].rows]
      rows[rowIndex] = {
        ...rows[rowIndex],
        items: rows[rowIndex].items.filter((_: EditorRowItem, i: number) => i !== itemIndex)
      }
      newTabs[tabIndex] = { ...newTabs[tabIndex], rows }
      set({ form: { ...form, tabs: newTabs } })
    }
  },

  updateColumnWidth: (tabIndex: number, rowIndex: number, itemIndex: number, width: string) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    if (form.mode === 'single' && form.rows) {
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

  // === Pole ===
  
  addField: (type: TsFieldDef['type'], tabIndex: number, rowIndex: number, itemIndex: number) => {
    const { form, saveToHistory, setSelection } = get()
    saveToHistory()
    
    // Generovat unikátní název pole
    const baseName = type.replace('-', '_')
    let fieldName = baseName
    let counter = 1
    while (form.fields[fieldName]) {
      fieldName = `${baseName}_${counter++}`
    }
    
    // Vytvořit definici pole
    const fieldDef = createDefaultFieldDef(type)
    
    // Aktualizovat layout
    if (form.mode === 'single' && form.rows) {
      const newRows = [...form.rows]
      const items = [...newRows[rowIndex].items]
      items[itemIndex] = { ...items[itemIndex], field: fieldName, type }
      newRows[rowIndex] = { ...newRows[rowIndex], items }
      set({
        form: {
          ...form,
          rows: newRows,
          fields: { ...form.fields, [fieldName]: fieldDef }
        }
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
          fields: { ...form.fields, [fieldName]: fieldDef }
        }
      })
    }
    
    // Vybrat nové pole
    setSelection({ type: 'field', id: fieldName, tabIndex, rowIndex, itemIndex })
  },

  removeField: (fieldName: string) => {
    const { form, saveToHistory, clearSelection, selection } = get()
    saveToHistory()
    
    // Odstranit z fields
    const newFields = { ...form.fields }
    delete newFields[fieldName]
    
    // Odstranit z layoutu nebo nahradit prázdným
    const clearFieldFromItem = (item: EditorRowItem): EditorRowItem => {
      if (item.field === fieldName) {
        return { ...item, field: '', type: 'empty' }
      }
      return item
    }
    
    if (form.mode === 'single' && form.rows) {
      const newRows = form.rows.map((row: EditorRow) => ({
        ...row,
        items: row.items.map(clearFieldFromItem)
      }))
      set({ form: { ...form, rows: newRows, fields: newFields } })
    } else if (form.tabs) {
      const newTabs = form.tabs.map((tab: EditorTab) => ({
        ...tab,
        rows: tab.rows.map((row: EditorRow) => ({
          ...row,
          items: row.items.map(clearFieldFromItem)
        }))
      }))
      set({ form: { ...form, tabs: newTabs, fields: newFields } })
    }
    
    // Zrušit výběr pokud bylo pole vybrané
    if (selection.id === fieldName) {
      clearSelection()
    }
  },

  updateFieldConfig: (fieldName: string, config: Partial<TsFieldDef>) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    set({
      form: {
        ...form,
        fields: {
          ...form.fields,
          [fieldName]: { ...form.fields[fieldName], ...config }
        }
      }
    })
  },

  moveField: (fromTab: number, fromRow: number, fromItem: number, toTab: number, toRow: number, toItem: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    // Získat zdrojové a cílové položky
    const getRow = (tabIdx: number, rowIdx: number): EditorRow | undefined => {
      if (form.mode === 'single') return form.rows?.[rowIdx]
      return form.tabs?.[tabIdx]?.rows[rowIdx]
    }
    
    const sourceRow = getRow(fromTab, fromRow)
    const targetRow = getRow(toTab, toRow)
    
    if (!sourceRow || !targetRow) return
    
    const sourceItem = sourceRow.items[fromItem]
    const targetItem = targetRow.items[toItem]
    
    // Prohodit pole
    const updateItems = (tabIdx: number, rowIdx: number, itemIdx: number, newField: string, newType: EditorRowItem['type']) => {
      if (form.mode === 'single' && form.rows) {
        const newRows = [...form.rows]
        const items = [...newRows[rowIdx].items]
        items[itemIdx] = { ...items[itemIdx], field: newField, type: newType }
        newRows[rowIdx] = { ...newRows[rowIdx], items }
        return newRows
      }
      return null
    }
    
    // Implementace přesunu - zjednodušená verze
    // TODO: Plná implementace pro tabs
  },

  // === Tlačítka ===
  
  addButton: () => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    const newButton: TsFormButton = {
      action: `action_${form.buttons.length + 1}`,
      label: `Tlačítko ${form.buttons.length + 1}`,
      variant: 'outline'
    }
    set({ form: { ...form, buttons: [...form.buttons, newButton] } })
  },

  removeButton: (index: number) => {
    const { form, saveToHistory } = get()
    saveToHistory()
    
    set({
      form: {
        ...form,
        buttons: form.buttons.filter((_: TsFormButton, i: number) => i !== index)
      }
    })
  },

  updateButton: (index: number, button: Partial<TsFormButton>) => {
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

  // === Výběr ===
  
  setSelection: (selection: EditorSelection) => set({ selection }),
  clearSelection: () => set({ selection: { type: null, id: null } }),

  // === Import/Export ===
  
  importJson: (json: string): boolean => {
    const { saveToHistory } = get()
    
    try {
      const parsed = JSON.parse(json)
      
      // Validace základní struktury
      if (!parsed.fields || typeof parsed.fields !== 'object') {
        return false
      }
      
      saveToHistory()
      
      // Převést na EditorFormDefinition
      const form: EditorFormDefinition = {
        mode: parsed.layout?.tabs ? 'tabs' : 'single',
        fields: parsed.fields,
        buttons: parsed.buttons || []
      }
      
      if (parsed.layout?.tabs) {
        form.tabs = parsed.layout.tabs.map((tab: { label: string; rows: unknown[][] }) => ({
          id: generateId(),
          label: tab.label,
          rows: tab.rows.map((row: unknown[]) => ({
            id: generateId(),
            items: (row as { field?: string; width?: string }[]).map((item) => ({
              id: generateId(),
              field: item.field || '',
              type: item.field ? (parsed.fields[item.field]?.type || 'empty') : 'empty',
              width: item.width || '1fr',
            }))
          }))
        }))
      } else if (parsed.layout?.rows) {
        form.rows = parsed.layout.rows.map((row: unknown[]) => ({
          id: generateId(),
          items: (row as { field?: string; width?: string }[]).map((item) => ({
            id: generateId(),
            field: item.field || '',
            type: item.field ? (parsed.fields[item.field]?.type || 'empty') : 'empty',
            width: item.width || '1fr',
          }))
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
    
    // Převést na formát TsForm
    const output: {
      fields: Record<string, TsFieldDef>
      layout: { tabs?: { label: string; rows: { field?: string; width?: string }[][] }[]; rows?: { field?: string; width?: string }[][] }
      buttons: TsFormButton[]
    } = {
      fields: form.fields,
      layout: {},
      buttons: form.buttons
    }
    
    if (form.mode === 'tabs' && form.tabs) {
      output.layout.tabs = form.tabs.map((tab: EditorTab) => ({
        label: tab.label,
        rows: tab.rows.map((row: EditorRow) => 
          row.items
            .filter((item: EditorRowItem) => item.field)
            .map((item: EditorRowItem) => ({
              field: item.field,
              width: item.width
            }))
        )
      }))
    } else if (form.rows) {
      output.layout.rows = form.rows.map((row: EditorRow) =>
        row.items
          .filter((item: EditorRowItem) => item.field)
          .map((item: EditorRowItem) => ({
            field: item.field,
            width: item.width
          }))
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
      activeTabIndex: 0
    })
  },

  // === Undo/Redo ===
  
  saveToHistory: () => {
    const { form, history, historyIndex } = get()
    
    // Oříznout budoucí historii pokud jsme uprostřed
    const newHistory = history.slice(0, historyIndex + 1)
    
    // Přidat aktuální stav (deep clone)
    newHistory.push(JSON.parse(JSON.stringify(form)))
    
    // Omezit velikost historie
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
      historyIndex: historyIndex - 1
    })
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return
    
    const nextForm = history[historyIndex + 1]
    set({
      form: JSON.parse(JSON.stringify(nextForm)),
      historyIndex: historyIndex + 1
    })
  }
}))
