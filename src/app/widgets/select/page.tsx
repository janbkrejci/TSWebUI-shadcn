import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Select widget
 * Rozbalovací seznam pro výběr jedné možnosti
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Kategorie' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Vyberte kategorii...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { 
    name: 'options', 
    label: 'Možnosti (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { label: 'Elektronika', value: 'electronics' },
      { label: 'Oblečení', value: 'clothing' },
      { label: 'Knihy', value: 'books' },
      { label: 'Domácnost', value: 'home' },
      { label: 'Sport', value: 'sport' },
    ], null, 2),
    hint: 'Pole objektů {label, value}'
  },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function SelectWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Select"
      description="Rozbalovací seznam (dropdown) pro výběr jedné hodnoty z předdefinovaných možností."
      widgetType="select"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
