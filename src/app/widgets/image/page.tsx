import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Image Upload widget
 * Specializované nahrávání obrázků
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Profilová fotka' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: 'Doporučená velikost: 400x400 px' },
  { name: 'accept', label: 'Povolené typy', type: 'string', defaultValue: 'image/*', hint: 'Výchozí: image/*' },
  { name: 'multiple', label: 'Více obrázků', type: 'boolean', defaultValue: false, hint: 'Umožní nahrát více obrázků' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function ImageWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Image Upload"
      description="Specializovaný widget pro nahrávání obrázků. Automaticky omezuje accept na image/*."
      widgetType="image"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
