import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Multi Select widget
 * Výběr více hodnot z předdef. seznamu
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Tagy' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Vyberte tagy...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { 
    name: 'options', 
    label: 'Možnosti (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { label: 'Důležité', value: 'important' },
      { label: 'Urgentní', value: 'urgent' },
      { label: 'Nízká priorita', value: 'low' },
      { label: 'Bug', value: 'bug' },
      { label: 'Feature', value: 'feature' },
      { label: 'Dokumentace', value: 'docs' },
    ], null, 2),
    hint: 'Pole objektů {label, value}'
  },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function MultiSelectWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Multi Select"
      description="Výběr více hodnot z předdefinovaného seznamu. Vybrané hodnoty se zobrazují jako chipy."
      widgetType="multiselect"
      attributes={attributes}
      defaultFieldValue={[]}
    />
  )
}
