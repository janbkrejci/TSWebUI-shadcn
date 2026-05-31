"use client"

import * as React from "react"

import { TsMarkdownField, TsWidgetProps } from "../types"

// The actual markdown rendering (react-markdown + remark-gfm + react-syntax-highlighter) lives in
// ./markdown-render and is loaded lazily, so importing <TsForm> does not pull the ESM-only markdown
// toolchain into the module graph. This keeps forms without markdown fields loadable/testable under
// next/jest (which does not transform those packages) and code-splits the heavy deps out of the
// main form bundle.
const MarkdownRender = React.lazy(() => import("./markdown-render"))

export type TsMarkdownWidgetProps = TsWidgetProps<TsMarkdownField>

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
    const content = (def.value as string) || def.content || ""
    return (
      <div
        className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2"
        {...props}
        ref={ref}
      >
        <React.Suspense fallback={null}>
          <MarkdownRender content={content} />
        </React.Suspense>
      </div>
    )
  }
)
MarkdownWidget.displayName = "MarkdownWidget"
