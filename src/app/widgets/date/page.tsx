import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Date Picker widget
 * Výběr data pomocí kalendáře
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Datum narození' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Vyberte datum...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function DateWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Date Picker"
      description="Výběr data pomocí interaktivního kalendáře. Podporuje české formátování a lokalizaci."
      widgetType="date"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
