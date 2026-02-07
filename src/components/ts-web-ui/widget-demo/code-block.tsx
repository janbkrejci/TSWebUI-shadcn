"use client"

import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import * as React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus"

import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  language?: string
}

/**
 * Component for displaying code with a copy button
 */
export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Code copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-4 h-8 w-8 text-slate-400 hover:text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          fontSize: "13px",
          lineHeight: "1.6",
          borderRadius: "0.5rem",
          padding: "1.25rem",
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
