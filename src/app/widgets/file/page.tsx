import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro File Upload widget
 * Nahrávání souborů
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Přílohy' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'accept', label: 'Povolené typy souborů', type: 'string', defaultValue: '', hint: 'Např. .pdf,.doc,.docx nebo application/pdf' },
  { name: 'multiple', label: 'Více souborů', type: 'boolean', defaultValue: false, hint: 'Umožní nahrát více souborů najednou' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function FileWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="File Upload"
      description="Widget pro nahrávání souborů. Podporuje omezení typů souborů a nahrávání více souborů najednou."
      widgetType="file"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
