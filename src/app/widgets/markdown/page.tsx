import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

/**
 * Demo page for Markdown widget
 * Displaying formatted text using Markdown
 */

const attributes: WidgetAttribute[] = [
  {
    name: "content",
    label: "Content",
    type: "string",
    defaultValue: `# Level 1 Heading

This is a paragraph with **bold text** and *italics*.

## Feature List

- Item 1
- Item 2
- Item 3

### Code

\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`
`,
    hint: "Markdown formatted text",
  },
  { name: "hidden", label: "Hidden", type: "boolean", defaultValue: false },
]

export default function MarkdownWidgetDemo() {
  return (
    <WidgetDemoWrapper
      title="Markdown"
      description="A widget for displaying formatted text using Markdown syntax. Suitable for help, documentation, or dynamic content."
      widgetType="markdown"
      attributes={attributes}
    />
  )
}
