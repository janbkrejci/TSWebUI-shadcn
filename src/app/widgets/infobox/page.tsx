import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Info Box widget
 * Informační box/alert pro zobrazení důležitých informací
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Titulek', type: 'string', defaultValue: 'Informace' },
  { name: 'content', label: 'Obsah', type: 'textarea', defaultValue: 'Toto je důležitá informace pro uživatele formuláře.', hint: 'Text zobrazený v infoboxu' },
  { 
    name: 'variant', 
    label: 'Varianta', 
    type: 'select', 
    defaultValue: 'default',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Destructive (červená)', value: 'destructive' },
    ],
    hint: 'Barevná varianta alertu'
  },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function InfoboxWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Info Box"
      description="Informační box (alert) pro zobrazení důležitých informací, varování nebo chyb v rámci formuláře."
      widgetType="infobox"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
