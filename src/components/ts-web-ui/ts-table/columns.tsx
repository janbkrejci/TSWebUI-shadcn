"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { numberFilter, dateFilter, booleanFilter } from "./filters"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export function generateColumns(
    columnDefinitions: TsTableColumnDef[], 
    enableSelection: boolean,
    onRowClick?: (row: any, columnKey?: string) => void,
    rowActions?: TsTableRowAction[],
    onAction?: (action: string, row: any) => void
): ColumnDef<any>[] {
    const cols: ColumnDef<any>[] = []

    // 1. Selection column
    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
                    <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Akce</DropdownMenuLabel>
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
            }
        })
    }

    // 3. Data columns
    columnDefinitions.forEach((def) => {
      cols.push({
        accessorKey: def.key,
        header: ({ column }) => {
            return (
                <div className={cn("flex items-center space-x-2", def.align === "center" && "justify-center", def.align === "right" && "justify-end")}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                        onClick={() => def.sortable !== false && column.toggleSorting(column.getIsSorted() === "asc")}
                        disabled={def.sortable === false}
                    >
                        <span>{def.title}</span>
                        {def.sortable !== false && (
                            column.getIsSorted() === "desc" ? (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            ) : column.getIsSorted() === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                            )
                        )}
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
          const value = row.getValue(def.key)
          
          let formattedValue: React.ReactNode = String(value ?? "")
          
          if (def.type === "number" && typeof value === "number") {
             formattedValue = value.toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          } else if (def.type === "date" && value) {
             formattedValue = new Date(value as string).toLocaleDateString("cs-CZ")
          } else if (def.type === "boolean") {
             formattedValue = (
                <div className={cn("flex", def.align === "center" && "justify-center", def.align === "right" && "justify-end")}>
                    <Checkbox checked={!!value} disabled className="opacity-70 cursor-default" />
                </div>
             )
          }

          return (
            <div 
              className={cn(
                "truncate",
                def.align === "center" && "text-center",
                def.align === "right" && "text-right",
                def.isClickable && "text-primary hover:underline cursor-pointer font-medium"
              )}
              onClick={() => def.isClickable && onRowClick?.(row.original, def.key)}
            >
              {formattedValue}
            </div>
          )
        },
        enableSorting: def.sortable ?? true,
        enableColumnFilter: def.filterable ?? true,
        size: typeof def.width === "number" ? def.width : 200,
        filterFn: (row, id, value, addMeta) => {
             if (def.type === 'number') return numberFilter(row, id, value, addMeta)
             if (def.type === 'date') return dateFilter(row, id, value, addMeta)
             if (def.type === 'boolean') return booleanFilter(row, id, value, addMeta)
             return true // default text filter handled by table
        },
        meta: {
            type: def.type
        }
      })
    })

    return cols
}