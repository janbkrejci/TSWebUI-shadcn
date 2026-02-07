import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Button widget
 * Tlačítko pro akce v rámci formuláře
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Spustit akci' },
  { 
    name: 'variant', 
    label: 'Varianta', 
    type: 'select', 
    defaultValue: 'default',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Destructive', value: 'destructive' },
      { label: 'Outline', value: 'outline' },
      { label: 'Ghost', value: 'ghost' },
      { label: 'Link', value: 'link' },
    ],
    hint: 'Vizuální styl tlačítka'
  },
  { name: 'action', label: 'Akce', type: 'string', defaultValue: 'custom-action', hint: 'Identifikátor akce odeslaný v eventu' },
  { name: 'disabled', label: 'Zakázané', type: 'boolean', defaultValue: false },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function ButtonWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Button"
      description="Tlačítko pro spouštění akcí v rámci formuláře. Při kliknutí vyvolá event form-field-action s identifikátorem akce."
      widgetType="button"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
