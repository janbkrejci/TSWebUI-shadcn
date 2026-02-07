import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Nested Table widget
 * Vnořená tabulka v rámci formuláře
 */

const attributes: WidgetAttribute[] = [
  { name: 'label', label: 'Label', type: 'string', defaultValue: 'Položky objednávky' },
  { name: 'hint', label: 'Hint (popis)', type: 'string', defaultValue: '' },
  { 
    name: 'columns', 
    label: 'Definice sloupců (JSON)', 
    type: 'json', 
    defaultValue: JSON.stringify([
      { field: 'name', header: 'Název', width: '200px' },
      { field: 'quantity', header: 'Množství', width: '100px' },
      { field: 'price', header: 'Cena', width: '100px' },
    ], null, 2),
    hint: 'Pole definic sloupců tabulky'
  },
  { name: 'showCreateButton', label: 'Tlačítko Vytvořit', type: 'boolean', defaultValue: true, hint: 'Zobrazit tlačítko pro přidání řádku' },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function TableWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Nested Table"
      description="Vnořená tabulka pro správu seznamu položek v rámci formuláře (např. položky faktury, adresy)."
      widgetType="table"
      attributes={attributes}
      defaultFieldValue={[
        { name: 'Produkt A', quantity: 2, price: 199 },
        { name: 'Produkt B', quantity: 1, price: 499 },
      ]}
    />
  )
}
