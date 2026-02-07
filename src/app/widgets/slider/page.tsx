import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Slider widget
 * Posuvník pro výběr hodnoty z rozsahu
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Hlasitost' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'min', label: 'Minimální hodnota', type: 'number', defaultValue: 0 },
  { name: 'max', label: 'Maximální hodnota', type: 'number', defaultValue: 100 },
  { name: 'step', label: 'Krok', type: 'number', defaultValue: 1, hint: 'O kolik se mění hodnota při posunu' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function SliderWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Slider"
      description="Posuvník pro výběr číselné hodnoty z definovaného rozsahu. Vhodný pro nastavení hlasitosti, průhlednosti apod."
      widgetType="slider"
      attributes={attributes}
      defaultFieldValue={50}
    />
  )
}
