import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Textarea widget
 * Víceřádkové textové pole pro delší texty
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Popis' },
  { name: 'placeholder', label: 'Placeholder', type: 'string', defaultValue: 'Zadejte delší text...' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { name: 'rows', label: 'Počet řádků', type: 'number', defaultValue: 3, hint: 'Výška textarea v řádcích' },
  { name: 'error', label: 'Chybová zpráva', type: 'string', defaultValue: '', hint: 'Pokud je vyplněna, widget se zobrazí v chybovém stavu' },
  { name: 'required', label: 'Povinné', type: 'boolean', defaultValue: false },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'readonly', label: 'Pouze pro čtení', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function TextareaWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Textarea"
      description="Víceřádkové textové pole pro delší texty jako jsou popisy, poznámky nebo komentáře."
      widgetType="textarea"
      attributes={attributes}
      defaultFieldValue=""
    />
  )
}
