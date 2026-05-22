"use client"

import { Check, Copy } from "lucide-react"
import * as React from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"

import { TsMarkdownField, TsWidgetProps } from "../types"

// Proper types for Markdown components to satisfy AC 4 (Zero Any)
interface TsMarkdownComponentProps {
  children?: React.ReactNode
  className?: string
  href?: string
}

export type TsMarkdownWidgetProps = TsWidgetProps<TsMarkdownField>

function MarkdownCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={copy}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

export const MarkdownWidget = React.forwardRef<HTMLDivElement, TsMarkdownWidgetProps>(
  (
    {
      field: _field,
      name: _name,
      error: _error,
      hint: _hint,
      readOnly: _readOnly,
      autoFocus: _autoFocus,
      "aria-label": _ariaLabel,
      "aria-required": _ariaRequired,
      def,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2"
        {...props}
        ref={ref}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }: TsMarkdownComponentProps) => (
              <a href={href} {...props} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            code: ({ className, children, ...props }: TsMarkdownComponentProps) => {
              const match = /language-(\w+)/.exec(className || "")
              const isInline = !match
              if (isInline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
              return (
                <div className="relative group my-4">
                  <MarkdownCopyButton text={String(children)} />
                  <SyntaxHighlighter
                    language={match[1]}
                    style={oneDark}
                    PreTag="div"
                    className="rounded-md !m-0"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              )
            },
          }}
        >
          {(def.value as string) || def.content || ""}
        </Markdown>
      </div>
    )
  }
)
MarkdownWidget.displayName = "MarkdownWidget"
