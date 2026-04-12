"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ClipboardCopy, MoreVertical } from "lucide-react"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

import { Button } from "@/components/ts-web-ui/ui/button"

import { cn } from "@/lib/utils"

import { booleanFilter, dateFilter, numberFilter, textFilter } from "./filters"

function CopyButton({ value }: { value: string }) {
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
      aria-label="Copy to clipboard"
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
  enableClickableColumns: boolean = false
): ColumnDef<TData>[] {
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
            aria-label="Select row"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 40,
    })
  }

  // 2. Row Actions Column (if enabled)
  if (rowActions && rowActions.length > 0) {
    cols.push({
      id: "actions",
      enableHiding: false,
      enableResizing: false,
      size: 40,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
        const sortIcon =
          enableSorting &&
          def.sortable !== false &&
          (isSorted === "desc" ? (
            <ArrowDown className={cn("h-4 w-4", isRight ? "mr-1" : "ml-1")} />
          ) : isSorted === "asc" ? (
            <ArrowUp className={cn("h-4 w-4", isRight ? "mr-1" : "ml-1")} />
          ) : (
            <ArrowUpDown className={cn("h-4 w-4 opacity-50", isRight ? "mr-1" : "ml-1")} />
          ))
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent px-1"
            onClick={() => {
              if (!enableSorting || def.sortable === false) return
              if (isSorted === "asc") {
                column.toggleSorting(true) // desc
              } else if (isSorted === "desc") {
                column.clearSorting() // no sort
              } else {
                column.toggleSorting(false) // asc
              }
            }}
            disabled={!enableSorting || def.sortable === false}
          >
            {isRight && sortIcon}
            <span>{def.title}</span>
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
            {def.canBeCopied && value != null && <CopyButton value={String(value)} />}
          </div>
        )
      },
      enableSorting: enableSorting && (def.sortable ?? true),
      enableColumnFilter: def.filterable ?? true,
      size: typeof def.width === "number" ? def.width : 200,
      filterFn: (row, id, value, addMeta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (def.type === "number") return numberFilter(row as any, id, value, addMeta)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (def.type === "date") return dateFilter(row as any, id, value, addMeta)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (def.type === "boolean") return booleanFilter(row as any, id, value, addMeta)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return textFilter(row as any, id, value, addMeta)
      },
      meta: {
        type: def.type,
        align: def.align,
      },
    })
  })

  return cols
}
