import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Number widget
 * Numerické vstupní pole s podporou min/max a kroků
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Množství' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: '0' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'min', label: 'Minimální hodnota', type: 'number', defaultValue: undefined },
  { name: 'max', label: 'Maximální hodnota', type: 'number', defaultValue: undefined },
  { name: 'step', label: 'Krok', type: 'number', defaultValue: 1, hint: 'O kolik se mění hodnota při použití šipek' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function NumberWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Number"
      description="Numerické vstupní pole pro zadávání čísel. Podporuje omezení rozsahu pomocí min/max a nastavení kroku."
      widgetType="number"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
