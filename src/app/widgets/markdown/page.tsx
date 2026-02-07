import { WidgetDemoWrapper, WidgetAttribute } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo stránka pro Markdown widget
 * Zobrazení formátovaného textu pomocí Markdown
 */

const attributes: WidgetAttribute[] = [
  { 
    name: 'content', 
    label: 'Markdown obsah', 
    type: 'textarea', 
    defaultValue: `# Nadpis první úrovně

Toto je odstavec s **tučným textem** a *kurzívou*.

## Seznam funkcí

- Položka 1
- Položka 2
- Položka 3

### Kód

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

> Toto je citace

[Odkaz na dokumentaci](https://example.com)`,
    hint: 'Markdown formátovaný text'
  },
  { name: 'hidden', label: 'Skryté', type: 'boolean', defaultValue: false },
]

export default function MarkdownWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Markdown"
      description="Widget pro zobrazení formátovaného textu pomocí Markdown syntaxe. Vhodný pro nápovědu, dokumentaci nebo dynamický obsah."
      widgetType="markdown"
      attributes={attributes}
      defaultFieldValue={undefined}
    />
  )
}
