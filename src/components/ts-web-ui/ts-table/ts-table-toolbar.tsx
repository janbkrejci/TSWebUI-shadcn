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
  onImportClick?: (data: Record<string, unknown>[]) => void
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
      const data = event.target?.result
      if (!data) return
      const wb = XLSX.read(data, { type: "array" })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" }) as Record<string, unknown>[]

      // Empty file — nothing to import
      if (json.length === 0) {
        toast.info("Import file contains no data rows")
        return
      }

      // Validate column headers
      const headersInFile = Object.keys(json[0] || {})
      const columnsToValidate =
        columnsRequiredForImport && columnsRequiredForImport.length > 0
          ? columnDefinitions.filter((col) => columnsRequiredForImport.includes(col.key))
          : columnDefinitions
      const missingColumns = columnsToValidate
        .map((col) => col.key)
        .filter((key) => !headersInFile.includes(key))

      if (missingColumns.length > 0) {
        const label =
          columnsRequiredForImport && columnsRequiredForImport.length > 0
            ? "Missing required columns"
            : "Missing columns"
        toast.error(`Import failed: ${label}`, {
          description: missingColumns.join(", "),
        })
        return
      }

      // Map rows: keep only known keys from column definitions
      const knownKeys = new Set(columnDefinitions.map((c) => c.key))
      const mapped = json.map((row) => {
        const obj: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(row)) {
          if (knownKeys.has(key)) obj[key] = val
        }
        return obj
      })

      // Call external handler — parent is responsible for processing and showing results
      onImportClick?.(mapped)
    }
    reader.readAsArrayBuffer(file)

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
                    onSelect={(e) => e.preventDefault()}
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
                      if (columnSearch) {
                        // First Escape: clear search text, block native event so Radix
                        // DismissableLayer (document-level listener) doesn't close the dropdown
                        e.preventDefault()
                        e.nativeEvent.stopImmediatePropagation()
                        setColumnSearch("")
                      }
                      // Second Escape (empty search): native event propagates normally,
                      // Radix sees non-default-prevented Escape → closes dropdown
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
