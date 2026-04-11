"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ClipboardCopy, MoreVertical } from "lucide-react"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
      className="inline-flex items-center justify-center h-5 w-5 rounded-sm hover:bg-accent shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <ClipboardCopy className="h-3 w-3 text-muted-foreground" />
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
  width?: number | string
  align?: "left" | "center" | "right"
  canBeCopied?: boolean
  isClickable?: boolean
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

  // 1. Selection column
  if (enableSelection) {
    cols.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    })
  }

  // 2. Row Actions Column (if enabled)
  if (rowActions && rowActions.length > 0) {
    cols.push({
      id: "actions",
      enableHiding: false,
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
    cols.push({
      accessorKey: def.key,
      header: ({ column }) => {
        return (
          <div
            className={cn(
              "flex items-center space-x-2",
              def.align === "center" && "justify-center",
              def.align === "right" && "justify-end"
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() =>
                enableSorting &&
                def.sortable !== false &&
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              disabled={!enableSorting || def.sortable === false}
            >
              <span>{def.title}</span>
              {enableSorting &&
                def.sortable !== false &&
                (column.getIsSorted() === "desc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                ))}
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const value = row.getValue(def.key)

        let formattedValue: React.ReactNode = String(value ?? "")

        if (def.type === "number" && typeof value === "number") {
          formattedValue = value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        } else if (def.type === "date" && value) {
          formattedValue = new Date(value as string).toLocaleDateString("en-US")
        } else if (def.type === "boolean") {
          formattedValue = (
            <div
              className={cn(
                "flex",
                def.align === "center" && "justify-center",
                def.align === "right" && "justify-end"
              )}
            >
              <Checkbox checked={!!value} disabled className="opacity-70 cursor-default" />
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
            onClick={() =>
              enableClickableColumns && def.isClickable && onRowClick?.(row.original, def.key)
            }
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
      },
    })
  })

  return cols
}
