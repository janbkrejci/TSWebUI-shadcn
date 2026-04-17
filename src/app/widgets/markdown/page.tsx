"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function MarkdownWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    {
      name: "content",
      label: d.attrContent,
      type: "textarea",
      defaultValue: `# Level 1 Heading

This is a paragraph with **bold text** and *italics*.

## Feature List

- Item 1
- Item 2
- Item 3

### Table

| Column A | Column B | Column C |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |

### Links

Visit [GitHub](https://github.com) for more information.

### Code

\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
`,
      hint: "Markdown formatted text (supports GFM tables, links, code blocks)",
    },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetMarkdownTitle}
      description={d.widgetMarkdownDescription}
      widgetType="markdown"
      attributes={attributes}
    />
  )
}
