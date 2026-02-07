/**
 * Typy pro Form Editor
 * Definuje strukturu formuláře, polí a layoutu
 */

import { TsFieldDef, TsFormLayout, TsFormRow, TsFormRowItem, TsFormTab, TsFormButton } from "../ts-form/types"

/**
 * Rozšířená definice pole pro editor s unikátním ID
 */
export interface EditorField {
  /** Unikátní ID pole v editoru */
  id: string
  /** Název pole (klíč v objektu fields) */
  name: string
  /** Definice pole */
  config: TsFieldDef
}

/**
 * Položka řádku v editoru s rozšířenými metadaty
 * Rozšiřuje TsFormRowItem o ID a typ pole
 */
export interface EditorRowItem {
  /** Unikátní ID položky */
  id: string
  /** Reference na pole (klíč v objektu fields) nebo prázdný string */
  field: string
  /** Šířka sloupce v CSS grid */
  width?: string
  /** Typ pole pro zobrazení v editoru */
  type?: TsFieldDef['type'] | 'empty' | 'separator'
  /** Label pro separátor */
  label?: string
  /** Zarovnání */
  align?: 'left' | 'center' | 'right'
}

/**
 * Řádek v editoru
 */
export interface EditorRow {
  /** Unikátní ID řádku */
  id: string
  /** Položky řádku */
  items: EditorRowItem[]
}

/**
 * Tab v editoru
 */
export interface EditorTab {
  /** Unikátní ID tabu */
  id: string
  /** Popisek tabu */
  label: string
  /** Řádky v tabu */
  rows: EditorRow[]
}

/**
 * Celková struktura formuláře v editoru
 */
export interface EditorFormDefinition {
  /** Režim layoutu - s taby nebo bez */
  mode: 'tabs' | 'single'
  /** Taby (pokud mode === 'tabs') */
  tabs?: EditorTab[]
  /** Řádky (pokud mode === 'single') */
  rows?: EditorRow[]
  /** Definice všech polí */
  fields: Record<string, TsFieldDef>
  /** Tlačítka formuláře */
  buttons: TsFormButton[]
}

/**
 * Aktuálně vybraný element v editoru
 */
export interface EditorSelection {
  type: 'field' | 'row' | 'tab' | 'button' | null
  id: string | null
  /** Index tabu (pro field a row) */
  tabIndex?: number
  /** Index řádku (pro field) */
  rowIndex?: number
  /** Index položky v řádku (pro field) */
  itemIndex?: number
}

/**
 * Dostupné typy polí pro přidání do formuláře
 */
export const AVAILABLE_FIELD_TYPES: { type: TsFieldDef['type']; label: string; group: string }[] = [
  // Textové vstupy
  { type: 'text', label: 'Text', group: 'Textové' },
  { type: 'textarea', label: 'Textarea', group: 'Textové' },
  { type: 'password', label: 'Heslo', group: 'Textové' },
  { type: 'number', label: 'Číslo', group: 'Textové' },
  
  // Výběr
  { type: 'select', label: 'Select', group: 'Výběr' },
  { type: 'multiselect', label: 'Multi Select', group: 'Výběr' },
  { type: 'combobox', label: 'Combobox', group: 'Výběr' },
  { type: 'radio', label: 'Radio', group: 'Výběr' },
  { type: 'checkbox', label: 'Checkbox', group: 'Výběr' },
  { type: 'switch', label: 'Switch', group: 'Výběr' },
  { type: 'button-group', label: 'Button Group', group: 'Výběr' },
  
  // Datum
  { type: 'date', label: 'Datum', group: 'Datum' },
  { type: 'datetime', label: 'Datum a čas', group: 'Datum' },
  
  // Ostatní vstupy
  { type: 'slider', label: 'Slider', group: 'Ostatní' },
  { type: 'file', label: 'Soubor', group: 'Ostatní' },
  { type: 'image', label: 'Obrázek', group: 'Ostatní' },
  { type: 'relationship', label: 'Relationship', group: 'Ostatní' },
  
  // Layout a zobrazení
  { type: 'separator', label: 'Oddělovač', group: 'Layout' },
  { type: 'infobox', label: 'Info Box', group: 'Layout' },
  { type: 'markdown', label: 'Markdown', group: 'Layout' },
  { type: 'button', label: 'Tlačítko', group: 'Layout' },
  
  // Komplexní
  { type: 'table', label: 'Tabulka', group: 'Komplexní' },
]

/**
 * Seskupené typy polí pro sidebar
 */
export const GROUPED_FIELD_TYPES = AVAILABLE_FIELD_TYPES.reduce((acc, field) => {
  if (!acc[field.group]) {
    acc[field.group] = []
  }
  acc[field.group].push(field)
  return acc
}, {} as Record<string, typeof AVAILABLE_FIELD_TYPES>)
