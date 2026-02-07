import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Button Group widget
 * Skupina tlačítek pro rychlý výběr hodnoty
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Priorita' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { 
    name: 'options', 
    label: 'Možnosti (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { label: 'Nízká', value: 'low' },
      { label: 'Střední', value: 'medium' },
      { label: 'Vysoká', value: 'high' },
      { label: 'Kritická', value: 'critical' },
    ], null, 2),
    hint: 'Pole objektů {label, value}'
  },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function ButtonGroupWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Button Group"
      description="Skupina tlačítek (toggle group) pro rychlý výběr jedné hodnoty. Vhodné pro malý počet možností jako priorita nebo stav."
      widgetType="button-group"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
