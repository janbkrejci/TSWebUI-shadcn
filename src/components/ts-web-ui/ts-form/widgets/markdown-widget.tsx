"use client"

import { Check, Copy } from "lucide-react"
import remarkGfm from "remark-gfm"

import * as React from "react"
import Markdown from "react-markdown"

import { Button } from "@/components/ui/button"

import { TsMarkdownField } from "../types"

// Proper types for Markdown components to satisfy AC 4 (Zero Any)
interface MarkdownComponentProps {
  children?: React.ReactNode
  className?: string
  href?: string
}

export interface TsMarkdownWidgetProps {
  def: TsMarkdownField
  error?: string
}

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
      size="icon-xs"
      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={copy}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

export const MarkdownWidget = React.forwardRef<HTMLDivElement, TsMarkdownWidgetProps>(
  ({ def, error, ...props }, ref) => {
    return (
      <div
        className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2"
        {...props}
        ref={ref}
        aria-invalid={!!error}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }: MarkdownComponentProps) => (
              <a href={href} {...props} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            code: ({ className, children, ...props }: MarkdownComponentProps) => {
              const isInline = !className?.includes("language-")
              if (isInline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
              return (
                <div className="relative group">
                  <MarkdownCopyButton text={String(children)} />
                  <code className={className} {...props}>
                    {children}
                  </code>
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
