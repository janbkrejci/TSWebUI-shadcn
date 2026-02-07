import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Separator widget
 * Vizuální oddělovač sekcí formuláře
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label (volitelný)', type: 'string', defaultValue: 'Osobní údaje', hint: 'Text zobrazený uprostřed oddělovače. Bez textu se zobrazí jen čára.' },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function SeparatorWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Separator"
      description="Vizuální oddělovač pro rozdělení formuláře do logických sekcí. Může mít volitelný textový popisek."
      widgetType="separator"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
