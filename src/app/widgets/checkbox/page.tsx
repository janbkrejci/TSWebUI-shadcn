import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Checkbox widget
 * Zaškrtávací políčko pro boolean hodnoty
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Souhlasím s podmínkami' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function CheckboxWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Checkbox"
      description="Zaškrtávací políčko pro binární volby (ano/ne). Vhodné pro souhlas s podmínkami, aktivaci funkcí apod."
      widgetType="checkbox"
      attributes={attributes}
      defaultFieldValue={false}
    />
  )
}
