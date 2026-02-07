import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Password widget
 * Pole pro zadávání hesel s maskováním
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Heslo' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Zadejte heslo...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: 'Minimálně 8 znaků' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function PasswordWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Password"
      description="Pole pro zadávání hesel s maskováním znaků. Vhodné pro přihlašovací formuláře a změnu hesla."
      widgetType="password"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
