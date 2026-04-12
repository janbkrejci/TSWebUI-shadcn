"use client"

import { Table } from "@tanstack/react-table"
import { Download, Filter, Plus, Search, Settings2, Upload, XCircle } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ts-web-ui/ui/button"

import { cn } from "@/lib/utils"

import { TsTableColumnDef, TsTableRowAction } from "./columns"

interface TsTableToolbarProps<TData> {
  table: Table<TData>
  showCreateButton?: boolean
  showImportButton?: boolean
  showExportButton?: boolean
  showColumnSelector?: boolean
  unhideableColumns?: string[]
  unshowableColumns?: string[]
  bulkActions?: TsTableRowAction[]
  selectedRows?: TData[]
  onBulkAction?: (action: string, rows: TData[]) => void
  onUnselectAll?: () => void
  onCreateClick?: () => void
  onImportClick?: (data: TData[]) => void
  columnDefinitions?: TsTableColumnDef[]
  columnsRequiredForImport?: string[]
  predefinedFilterKeys?: string[]
  title?: string
}

export function TsTableToolbar<TData>({
  table,
  showCreateButton = true,
  showImportButton = true,
  showExportButton = true,
  showColumnSelector = true,
  unhideableColumns = [],
  unshowableColumns = [],
  bulkActions: _bulkActions = [],
  selectedRows = [],
  onBulkAction: _onBulkAction,
  onUnselectAll: _onUnselectAll,
  onCreateClick,
  onImportClick,
  columnDefinitions = [],
  columnsRequiredForImport,
  predefinedFilterKeys = [],
  title,
}: TsTableToolbarProps<TData>) {
  const [columnSearch, setColumnSearch] = React.useState("")

  const doExport = (rows: TData[]) => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data")
    XLSX.writeFile(wb, `export-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportFiltered = () => {
    doExport(table.getFilteredRowModel().rows.map((row) => row.original))
  }

  const handleExportSelected = () => {
    doExport(selectedRows)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const bstr = event.target?.result
      if (typeof bstr !== "string") return
      const wb = XLSX.read(bstr, { type: "binary" })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws) as TData[]

      // Validate column headers
      const requiredColumns = columnsRequiredForImport ?? columnDefinitions.map((c) => c.key)
      if (requiredColumns.length > 0 && data.length > 0) {
        const importedHeaders = Object.keys(data[0] as Record<string, unknown>)
        const missingColumns = requiredColumns.filter((col) => !importedHeaders.includes(col))
        if (missingColumns.length > 0) {
          toast.error("Import failed: missing columns", {
            description: missingColumns.join(", "),
          })
          return
        }
      }

      onImportClick?.(data)
      toast.success(`Import complete: ${data.length} row${data.length !== 1 ? "s" : ""} imported`)
    }
    reader.readAsBinaryString(file)

    // Reset input so the same file can be re-imported
    e.target.value = ""
  }

  // Get columns in the order they are displayed (#1: react to column order/visibility changes)
  const columnOrderState = table.getState().columnOrder
  const columnVisibilityState = table.getState().columnVisibility
  const orderedColumns = React.useMemo(() => {
    const allCols = table.getAllLeafColumns().filter((c) => c.id !== "select" && c.id !== "actions")

    // Sort all columns by their position in the current column order
    // Hidden columns stay in their original position among visible ones
    const orderMap = new Map<string, number>()
    const currentOrder = table.getState().columnOrder
    if (currentOrder.length > 0) {
      currentOrder.forEach((id, idx) => orderMap.set(id, idx))
    } else {
      table.getAllLeafColumns().forEach((col, idx) => orderMap.set(col.id, idx))
    }
    return [...allCols].sort((a, b) => {
      return (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columnOrderState, columnVisibilityState])

  // Check for active column filters (#9)
  const columnFiltersState = table.getState().columnFilters
  const activeFilterIds = React.useMemo(() => {
    return new Set(
      columnFiltersState.filter((f) => f.value !== "" && f.value != null).map((f) => f.id)
    )
  }, [columnFiltersState])
  const hasActiveUserFilters = React.useMemo(() => {
    return columnFiltersState.some(
      (f) => f.value !== "" && f.value != null && !predefinedFilterKeys.includes(f.id)
    )
  }, [columnFiltersState, predefinedFilterKeys])

  const handleClearAllFilters = React.useCallback(() => {
    const predefinedOnly = table
      .getState()
      .columnFilters.filter((f) => predefinedFilterKeys.includes(f.id))
    table.setColumnFilters(predefinedOnly)
  }, [table, predefinedFilterKeys])

  return (
    <div className="flex items-center justify-between py-4 gap-2">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault()
                table.setGlobalFilter("")
              }
            }}
            className="pl-8 h-9"
          />
        </div>
        {title && <h2 className="text-lg font-semibold ml-4">{title}</h2>}
      </div>

      <div className="flex items-center gap-2">
        {showColumnSelector && (
          <DropdownMenu
            onOpenChange={(open) => {
              if (!open) setColumnSearch("")
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 ml-auto flex gap-2">
                <Settings2 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <DropdownMenuLabel>View columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Clear all filters (#9) */}
              {hasActiveUserFilters && (
                <>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleClearAllFilters}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Clear all filters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <div
                className="px-2 pb-1.5"
                onPointerDown={(e) => {
                  // Prevent dropdown from stealing focus when clicking inside the search area
                  e.stopPropagation()
                }}
              >
                <Input
                  placeholder="Search columns..."
                  value={columnSearch}
                  onChange={(e) => setColumnSearch(e.target.value)}
                  onKeyDown={(e) => {
                    // Stop ALL key events from reaching the dropdown (prevents typeahead focus stealing)
                    e.stopPropagation()
                    if (e.key === "Escape") {
                      e.preventDefault()
                      // Only clear search text on first Escape; if empty, let event propagate to close dropdown
                      if (columnSearch) {
                        setColumnSearch("")
                      } else {
                        // Re-dispatch to parent to close the dropdown
                        const parent = (e.target as HTMLElement).closest(
                          "[data-radix-popper-content-wrapper]"
                        )
                        parent?.dispatchEvent(
                          new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
                        )
                      }
                    }
                    if (e.key === "Enter") e.preventDefault()
                  }}
                  onBlur={(e) => {
                    // If focus moved within the dropdown content, reclaim it
                    const container = (e.target as HTMLElement).closest('[role="menu"]')
                    if (container?.contains(e.relatedTarget as Node)) {
                      e.target.focus()
                    }
                  }}
                  className="h-7 text-xs"
                  autoFocus
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {orderedColumns
                  .filter((column) => {
                    if (!columnSearch) return true
                    const header = column.columnDef.header
                    const label = typeof header === "string" ? header : column.id
                    return label.toLowerCase().includes(columnSearch.toLowerCase())
                  })
                  .map((column) => {
                    const isUnhideable = unhideableColumns.includes(column.id)
                    const isUnshowable = unshowableColumns.includes(column.id)
                    const header = column.columnDef.header
                    const label = typeof header === "string" ? header : column.id
                    const hasFilter = activeFilterIds.has(column.id)
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className={cn("capitalize", isUnshowable && "opacity-50")}
                        checked={column.getIsVisible()}
                        disabled={isUnhideable || isUnshowable}
                        onCheckedChange={(value) => {
                          if (!isUnhideable && !isUnshowable) column.toggleVisibility(!!value)
                        }}
                        onSelect={(e) => e.preventDefault()}
                      >
                        <span className="flex items-center w-full">
                          <span className="flex-1 truncate">{label}</span>
                          {hasFilter && (
                            <Filter className="h-3 w-3 text-primary shrink-0 ml-auto" />
                          )}
                        </span>
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showExportButton && selectedRows.length === 0 && (
          <Button variant="outline" size="sm" className="h-9 gap-2" onClick={handleExportFiltered}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}

        {showExportButton && selectedRows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportFiltered}>
                {`Export filtered (${table.getFilteredRowModel().rows.length} rows)`}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportSelected}>
                {`Export selected (${selectedRows.length} rows)`}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showImportButton && (
          <div className="relative">
            <Button variant="outline" size="sm" className="h-9 gap-2" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.json"
                  onChange={handleImport}
                />
              </label>
            </Button>
          </div>
        )}

        {showCreateButton && (
          <Button size="sm" className="h-9 gap-2" onClick={onCreateClick}>
            <Plus className="h-4 w-4" />
            New record
          </Button>
        )}
      </div>
    </div>
  )
}
