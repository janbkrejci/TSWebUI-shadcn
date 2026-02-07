import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro DateTime widget
 * Výběr data a času
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Termín schůzky' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: '' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function DateTimeWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Date Time"
      description="Výběr data a času pomocí nativního datetime-local input. Vhodné pro plánování schůzek, termínů apod."
      widgetType="datetime"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
