"use client"

import { Check, Copy } from "lucide-react"
import * as React from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"

// The ESM-only markdown toolchain (react-markdown, remark-gfm, react-syntax-highlighter) is
// isolated in this module so it can be code-split via React.lazy from markdown-widget.tsx. Keeping
// these imports out of the eagerly-loaded <TsForm> module graph means consumers can render and
// unit-test forms that contain no markdown fields without transforming/stubbing these packages
// (next/jest leaves them untransformed, which otherwise breaks `import { TsForm }`).

interface TsMarkdownComponentProps {
  children?: React.ReactNode
  className?: string
  href?: string
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
      size="icon"
      className="absolute right-2 top-2 size-6 opacity-0 transition-opacity group-hover:opacity-100"
      onClick={copy}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

export default function MarkdownRender({ content }: { content: string }) {
  return (
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
      {content}
    </Markdown>
  )
}
