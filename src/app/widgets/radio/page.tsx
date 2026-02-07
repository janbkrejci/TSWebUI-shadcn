import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Radio Group widget
 * Výběr jedné hodnoty z několika možností formou radio buttonů
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Způsob platby' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { 
    name: 'options', 
    label: 'Možnosti (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { label: 'Platební karta', value: 'card' },
      { label: 'Bankovní převod', value: 'transfer' },
      { label: 'PayPal', value: 'paypal' },
      { label: 'Dobírka', value: 'cod' },
    ], null, 2),
    hint: 'Pole objektů {label, value}'
  },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function RadioWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Radio Group"
      description="Skupina přepínačů (radio buttons) pro výběr právě jedné hodnoty z několika vzájemně se vylučujících možností."
      widgetType="radio"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
