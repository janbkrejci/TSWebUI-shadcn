import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Switch widget
 * Přepínač pro boolean hodnoty ve stylu iOS
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Aktivní' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function SwitchWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Switch"
      description="Přepínač ve stylu iOS pro zapnutí/vypnutí funkce. Alternativa k checkboxu pro nastavení typu on/off."
      widgetType="switch"
      attributes={attributes}
      defaultFieldValue={false}
    />
  )
}
