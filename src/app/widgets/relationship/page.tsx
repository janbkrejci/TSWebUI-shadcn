import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Relationship Picker widget
 * Výběr souvisejících entit z jiné tabulky
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Přiřazený uživatel' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Vyberte uživatele...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'targetEntity', label: 'Cílová entita', type: 'string', defaultValue: 'users', hint: 'Název tabulky/entity' },
  { 
    name: 'mode', 
    label: 'Režim', 
    type: 'select', 
    defaultValue: 'single',
    options: [
      { label: 'Jeden záznam', value: 'single' },
      { label: 'Více záznamů', value: 'multiple' },
    ],
    hint: 'single = 1 záznam, multiple = více záznamů'
  },
  { 
    name: 'displayFields', 
    label: 'Zobrazovaná pole (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify(['name', 'email']),
    hint: 'Pole, která se zobrazí v seznamu'
  },
  { 
    name: 'chipDisplayFields', 
    label: 'Pole pro chipy (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify(['name']),
    hint: 'Pole, která se zobrazí ve vybraných chipech'
  },
  { name: 'valueField', label: 'Pole hodnoty', type: 'string', defaultValue: 'id', hint: 'Pole použité jako hodnota (obvykle id)' },
  { 
    name: 'options', 
    label: 'Data (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { id: 1, name: 'Jan Novák', email: 'jan.novak@example.com' },
      { id: 2, name: 'Marie Svobodová', email: 'marie.svobodova@example.com' },
      { id: 3, name: 'Petr Černý', email: 'petr.cerny@example.com' },
      { id: 4, name: 'Eva Dvořáková', email: 'eva.dvorakova@example.com' },
      { id: 5, name: 'Tomáš Procházka', email: 'tomas.prochazka@example.com' },
    ], null, 2),
    hint: 'Pole objektů s dostupnými záznamy'
  },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function RelationshipWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Relationship Picker"
      description="Widget pro výběr souvisejících entit (vztah 1:N nebo M:N). Umožňuje vybrat záznamy z jiné tabulky s vyhledáváním."
      widgetType="relationship"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
