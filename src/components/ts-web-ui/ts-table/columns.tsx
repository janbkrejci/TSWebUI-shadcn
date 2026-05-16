"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ClipboardCopy, MoreVertical } from "lucide-react"

import * as React from "react"
import { TsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ts-web-ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface TsColumnDef<TData = unknown> extends ColumnDef<TData> {
  /** Human-readable title for the column header */
  title: string
  /** Column type: 'text', 'number', 'date', 'boolean', 'json' */
  type?: string
  /** Whether sorting is allowed (default: true) */
  sortable?: boolean
  /** Whether filtering is allowed (default: true) */
  filterable?: boolean
  /** Width in pixels or string (e.g., '1fr', 'auto') */
  width?: number | string
  /** Mark column as required (for form columns) */
  required?: boolean
  /** Mark column as read-only (for form columns) */
  readOnly?: boolean
  /** Mark column as not visible by default */
  hidden?: boolean
  /** Can this column be copied to clipboard? (for display columns) */
  canBeCopied?: boolean
  /** Locale for text formatting (default: 'en-US') */
  locale?: TsLocale
}

export function generateColumns<TData extends Record<string, unknown>>(
  defs: TsColumnDef<TData>[],
  options?: {
    enableSorting?: boolean
    locale?: TsLocale
  },
) {
  const enableSorting = options?.enableSorting ?? true
  const locale = options?.locale ?? "en-US"

  return defs.map((def) => {
    const cell = def.cell

    if (!cell) {
      // No custom cell renderer → use default display
      return {
        ...def,
        header: def.title,
        cell: ({ getValue }: { getValue: () => unknown }) => {
          const value = getValue()

          if (def.type === "boolean") {
            return value ? (
              <div className="flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
            ) : null
          }

          if (def.type === "json") {
            const json = value ? JSON.stringify(value, null, 2) : ""
            return json ? (
              <pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-xs">{json}</pre>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }

          // Default: format as string
          const formatted =
            value === null || value === undefined
              ? "—"
              : def.type === "number"
                ? Number(value).toLocaleString(locale)
                : def.type === "date" && value instanceof Date
                  ? value.toLocaleDateString(locale)
                  : String(value)

          return (
            <span
              className={def.type === "json" ? "font-mono" : ""}
              title={formatted}
            >
              {formatted}
            </span>
          )
        },
      }
    }

    // Custom cell renderer already specified
    return {
      ...def,
      header: def.title,
    }
  })
}

export function buildCellContent(
  value: unknown,
  type?: string,
  locale?: TsLocale,
  canBeCopied?: boolean,
) {
  const finalLocale = locale ?? "en-US"

  if (type === "boolean") {
    return value ? (
      <div className="flex items-center justify-center">
        <Check className="h-4 w-4 text-green-600" />
      </div>
    ) : null
  }

  if (type === "json") {
    const json = value ? JSON.stringify(value, null, 2) : ""
    return json ? (
      <pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-xs font-mono">
        {json}
      </pre>
    ) : (
      <span className="text-muted-foreground">—</span>
    )
  }

  // Default: format as string
  const formatted =
    value === null || value === undefined
      ? "—"
      : type === "number"
        ? Number(value).toLocaleString(finalLocale)
        : type === "date" && value instanceof Date
          ? value.toLocaleDateString(finalLocale)
          : String(value)

  if (canBeCopied && formatted !== "—") {
    return (
      <CopyableCell value={formatted}>
        <span className="truncate">{formatted}</span>
      </CopyableCell>
    )
  }

  return <span className="truncate">{formatted}</span>
}

function CopyableCell({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      className="group flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCopy(e as any)
        }
      }}
    >
      {children}
      <Button
        size="icon"
        variant="ghost"
        className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy to clipboard"}
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <ClipboardCopy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}

export function buildColumnActions<TData extends Record<string, unknown>>(
  columnId: string,
  onColumnChange?: (columnId: string, changes: Partial<TsColumnDef<TData>>) => void,
) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Column Actions</DropdownMenuLabel>
        {onColumnChange && (
          <DropdownMenuItem
            onClick={() => {
              onColumnChange(columnId, { hidden: true })
            }}
          >
            Hide
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function buildTableColumns<TData extends Record<string, unknown>>(
  columnDefs: TsColumnDef<TData>[],
  options?: {
    enableSorting?: boolean
    onColumnChange?: (columnId: string, changes: Partial<TsColumnDef<TData>>) => void
    locale?: TsLocale
  },
): ColumnDef<TData>[] {
  const enableSorting = options?.enableSorting ?? true
  const locale = options?.locale ?? "en-US"

  return columnDefs
    .filter((def) => !def.hidden)
    .map((def) => {
      const title = def.title
      const canBeCopied = def.canBeCopied ?? false

      return {
        accessorKey: def.id,
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-2">
              <span>{title}</span>
              {column.getCanSort() && (
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-accent"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  title={`Sort: ${column.getIsSorted() === "asc" ? "ascending" : column.getIsSorted() === "desc" ? "descending" : "none"}`}
                >
                  {column.getIsSorted() === "asc" && <ArrowUp className="h-4 w-4" />}
                  {column.getIsSorted() === "desc" && <ArrowDown className="h-4 w-4" />}
                  {!column.getIsSorted() && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                </button>
              )}
              {options?.onColumnChange && (
                <buildColumnActions(def.id as string, options.onColumnChange) as any
              )}
            </div>
          )
        },
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <div className="flex items-center">
              {buildCellContent(value, def.type, locale, canBeCopied)}
            </div>
          )
        },
        enableSorting: enableSorting && (def.sortable ?? true),
        ...((!def.type || def.type === "text") && enableSorting && def.sortable !== false
          ? {
              sortingFn: (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number => {
                const a = String(rowA.getValue(columnId) ?? "")
                const b = String(rowB.getValue(columnId) ?? "")
                return a.localeCompare(b, locale)
              },
            }
          : {}),
        enableColumnFilter: def.filterable ?? true,
        size: typeof def.width === "number" ? def.width : 200,
        minSize: (() => {
          const isSortable = enableSorting && def.sortable !== false
          // ~8.5px per character at text-sm (slightly over-estimate to avoid truncation)
          const labelPx = Math.ceil(def.title.length * 8.5)
          // Sort icon: 16px icon + 6px gap = 22px
          const minForSort = isSortable ? 22 : 0
          return Math.max(60, labelPx + minForSort)
        })(),
      } as ColumnDef<TData>
    })
}
