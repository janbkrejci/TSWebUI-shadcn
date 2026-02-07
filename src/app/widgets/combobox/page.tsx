import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Combobox widget
 * Kombinace textového vstupu a seznamu s filtrováním
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Město' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Vyberte město...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { 
    name: 'options', 
    label: 'Možnosti (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { label: 'Praha', value: 'prague' },
      { label: 'Brno', value: 'brno' },
      { label: 'Ostrava', value: 'ostrava' },
      { label: 'Plzeň', value: 'pilsen' },
      { label: 'Liberec', value: 'liberec' },
      { label: 'Olomouc', value: 'olomouc' },
      { label: 'České Budějovice', value: 'ceske-budejovice' },
      { label: 'Hradec Králové', value: 'hradec-kralove' },
    ], null, 2),
    hint: 'Pole objektů {label, value}'
  },
  { name: 'allowCustom', label: 'Povolit vlastní hodnotu', type: 'boolean', defaultValue: false, hint: 'Umožní zadat hodnotu mimo seznam' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function ComboboxWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Combobox"
      description="Kombinace textového vstupu a rozbalovacího seznamu s filtrováním. Volitelně podporuje zadání vlastní hodnoty mimo seznam."
      widgetType="combobox"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
