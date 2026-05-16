"use client"

import { ColumnDef } from "@tanstack/react-table"
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
import { Switch } from "@/components/ui/switch"

import { cn } from "@/lib/utils"

import { booleanFilter, dateFilter, numberFilter, textFilter } from "./filters"

function CopyButton({ value, copyLabel }: { value: string; copyLabel?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      className="inline-flex items-center justify-center h-6 w-6 rounded-sm hover:bg-accent shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity"
      onClick={handleCopy}
      aria-label={copyLabel ?? "Copy to clipboard"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <ClipboardCopy className="h-4 w-4 text-foreground" />
      )}
    </button>
  )
}

export interface TsTableColumnDef {
  key: string
  title: string
  type?: "text" | "number" | "date" | "boolean"
  sortable?: boolean
  filterable?: boolean
  visible?: boolean
  unshowable?: boolean
  width?: number | string
  align?: "left" | "center" | "right"
  canBeCopied?: boolean
  isClickable?: boolean
  locale?: string
  decimalPlaces?: number
}

export interface TsTableRowAction {
  action: string
  label: string
}

export function generateColumns<TData>(
  columnDefinitions: TsTableColumnDef[],
  enableSelection: boolean,
  onRowClick?: (row: TData, columnKey?: string) => void,
  rowActions?: TsTableRowAction[],
  onAction?: (action: string, row: TData) => void,
  enableSorting: boolean = true,
  enableClickableColumns: boolean = false,
  enableColumnReordering: boolean = true,
  tsLocale?: TsLocale
): ColumnDef<TData>[] {
  const t = tsLocale?.strings.table
  const cols: ColumnDef<TData>[] = []

  // 1. Selection column — header checkbox rendered in filter row by TsTableView
  if (enableSelection) {
    cols.push({
      id: "select",
      header: () => null,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label={t?.selectRow ?? "Select row"}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 40,
      minSize: 40,
      maxSize: 40,
    })
  }

  // 2. Row Actions Column (if enabled)
  if (rowActions && rowActions.length > 0) {
    cols.push({
      id: "actions",
      enableHiding: false,
      enableResizing: false,
      size: 40,
      minSize: 40,
      maxSize: 40,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t?.openMenu ?? "Open menu"}</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t?.actions ?? "Actions"}</DropdownMenuLabel>
                {rowActions.map((action, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => onAction?.(action.action, row.original)}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    })
  }

  // 3. Data columns
  columnDefinitions.forEach((def) => {
    const locale = def.locale || "cs-CZ"
    const decimalPlaces = def.decimalPlaces ?? 2

    cols.push({
      accessorKey: def.key,
      header: ({ column }) => {
        const isSorted = column.getIsSorted()
        const isRight = def.align === "right"
        const isSortable = enableSorting && def.sortable !== false
        const sortIcon = isSortable ? (
          isSorted === "desc" ? (
            <ArrowDown className={cn("h-4 w-4 shrink-0", isRight ? "mr-1" : "ml-1")} />
          ) : isSorted === "asc" ? (
            <ArrowUp className={cn("h-4 w-4 shrink-0", isRight ? "mr-1" : "ml-1")} />
          ) : (
            <ArrowUpDown
              className={cn(
                "h-4 w-4 shrink-0 opacity-0 group-hover/header:opacity-50 transition-opacity",
                isRight ? "mr-1" : "ml-1"
              )}
            />
          )
        ) : null
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent px-0 has-[>svg]:px-0 hover:bg-transparent hover:text-current dark:hover:bg-transparent"
            onClick={() => {
              if (!isSortable) return
              if (isSorted === "asc") {
                column.toggleSorting(true) // desc
              } else if (isSorted === "desc") {
                column.clearSorting() // no sort
              } else {
                column.toggleSorting(false) // asc
              }
            }}
            disabled={!isSortable}
          >
            {isRight && sortIcon}
            <span className="truncate">{def.title}</span>
            {!isRight && sortIcon}
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = row.getValue(def.key)

        let formattedValue: React.ReactNode = String(value ?? "")

        if (def.type === "number" && typeof value === "number") {
          formattedValue = value.toLocaleString(locale, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          })
        } else if (def.type === "date" && value) {
          const d = new Date(value as string)
          if (!isNaN(d.getTime())) {
            formattedValue = new Intl.DateTimeFormat(locale).format(d)
          }
        } else if (def.type === "boolean") {
          formattedValue = (
            <div
              className={cn(
                "flex",
                def.align === "center" && "justify-center",
                def.align === "right" && "justify-end"
              )}
            >
              <Switch
                checked={!!value}
                aria-readonly="true"
                tabIndex={-1}
                className="pointer-events-none"
              />
            </div>
          )
        }

        return (
          <div
            className={cn(
              "flex items-center gap-1",
              def.align === "center" && "justify-center",
              def.align === "right" && "justify-end",
              enableClickableColumns &&
                def.isClickable &&
                "text-primary hover:underline cursor-pointer font-medium"
            )}
            onClick={(e) => {
              if (enableClickableColumns && def.isClickable) {
                e.stopPropagation()
                onRowClick?.(row.original, def.key)
              }
            }}
          >
            <span className="truncate">{formattedValue}</span>
            {def.canBeCopied && value != null && (
              <CopyButton value={String(value)} copyLabel={t?.copyToClipboard} />
            )}
          </div>
        )
      },
      enableSorting: enableSorting && (def.sortable ?? true),
      ...((!def.type || def.type === "text") && enableSorting && def.sortable !== false
        ? {
            sortingFn: (
              rowA: Parameters<NonNullable<ColumnDef<TData>["sortingFn"]>>[0],
              rowB: Parameters<NonNullable<ColumnDef<TData>["sortingFn"]>>[1],
              columnId: string,
            ): number => {
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
        const sortPx = isSortable ? 22 : 0
        // Reorder arrows: 2 x (12px icon + 5px padding) + 2px gap = 36px
        const reorderPx = enableColumnReordering ? 36 : 0
        // Cell padding: px-3 both sides = 24px
        const paddingPx = 24
        return Math.max(labelPx + sortPx + reorderPx + paddingPx, 60)
      })(),
      filterFn: (row, id, value, addMeta) => {
        // biome-ignore lint/suspicious/noExplicitAny: TanStack Table filterFn requires row type cast
        if (def.type === "number") return numberFilter(row as any, id, value, addMeta)
        // biome-ignore lint/suspicious/noExplicitAny: TanStack Table filterFn requires row type cast
        if (def.type === "date") return dateFilter(row as any, id, value, addMeta)
        // biome-ignore lint/suspicious/noExplicitAny: TanStack Table filterFn requires row type cast
        if (def.type === "boolean") return booleanFilter(row as any, id, value, addMeta)
        // biome-ignore lint/suspicious/noExplicitAny: TanStack Table filterFn requires row type cast
        return textFilter(row as any, id, value, addMeta)
      },
      meta: {
        title: def.title,
        type: def.type,
        align: def.align,
      },
    })
  })

  return cols
}
