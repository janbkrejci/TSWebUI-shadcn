import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Text Input widget
 * Zobrazuje všechny možnosti konfigurace textového vstupního pole
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Textové pole' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Zadejte text...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function TextWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Text Input"
      description="Základní textové vstupní pole pro jednořádkový text. Podporuje validaci, placeholdery a různé stavy."
      widgetType="text"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
