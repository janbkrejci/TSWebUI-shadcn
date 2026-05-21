"use client"

import { Table } from "@tanstack/react-table"
import { Download, Filter, Plus, Search, Settings2, Upload, XCircle } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { TsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ts-web-ui/ui/button"
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

import { cn } from "@/lib/utils"

import { TsTableColumnDef, TsTableRowAction } from "./columns"

interface TsTableToolbarProps<TData> {
  table: Table<TData>
  showFulltext?: boolean
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
  locale?: TsLocale
}

export function TsTableToolbar<TData>({
  table,
  showFulltext = true,
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
  locale,
}: TsTableToolbarProps<TData>) {
  const t = locale?.strings.table
  const [columnSearch, setColumnSearch] = React.useState("")
  const [columnDropdownOpen, setColumnDropdownOpen] = React.useState(false)

  const getColumnLabel = React.useCallback(
    (column: ReturnType<Table<TData>["getAllLeafColumns"]>[number]) => {
      const meta = column.columnDef.meta as { title?: string } | undefined
      if (typeof meta?.title === "string" && meta.title.trim()) {
        return meta.title
      }

      const definitionTitle = columnDefinitions.find(
        (definition) => definition.key === column.id
      )?.title
      if (definitionTitle) {
        return definitionTitle
      }

      const header = column.columnDef.header
      return typeof header === "string" ? header : column.id
    },
    [columnDefinitions]
  )

  const doExport = (rows: TData[]) => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data")
    XLSX.writeFile(wb, `export-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportAll = () => {
    doExport(table.getCoreRowModel().rows.map((row) => row.original))
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
        toast.info(t?.importNoData ?? "Import file contains no data rows")
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
            ? (t?.missingRequiredColumns ?? "Missing required columns")
            : (t?.missingColumns ?? "Missing columns")
        toast.error(t?.importFailedMissing?.(label) ?? `Import failed: ${label}`, {
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
  const orderedColumns = (() => {
    const allColumns = table.getAllLeafColumns()
    const allCols = allColumns.filter((c) => c.id !== "select" && c.id !== "actions")

    // Sort all columns by their position in the current column order
    // Hidden columns stay in their original position among visible ones
    const orderMap = new Map<string, number>()
    if (columnOrderState.length > 0) {
      columnOrderState.forEach((id, idx) => orderMap.set(id, idx))
    } else {
      allColumns.forEach((col, idx) => orderMap.set(col.id, idx))
    }
    return [...allCols].sort((a, b) => {
      return (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999)
    })
  })()

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

  const globalFilterState = table.getState().globalFilter as string | undefined
  const hasAnyActiveFilter =
    columnFiltersState.some((f) => f.value !== "" && f.value != null) || !!globalFilterState

  const handleClearAllFilters = React.useCallback(() => {
    const predefinedOnly = table
      .getState()
      .columnFilters.filter((f) => predefinedFilterKeys.includes(f.id))
    table.setColumnFilters(predefinedOnly)
  }, [table, predefinedFilterKeys])

  return (
    <div className="space-y-4 pt-4 pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
        </div>

        <div className="flex items-center gap-2">
          {showColumnSelector && (
            <DropdownMenu
              open={columnDropdownOpen}
              onOpenChange={(open) => {
                setColumnDropdownOpen(open)
                if (!open) setColumnSearch("")
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 ml-auto flex gap-2">
                  <Settings2 className="h-4 w-4" />
                  {t?.columns ?? "Columns"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[220px]"
                onEscapeKeyDown={(e) => {
                  // If search is active, first Escape clears search; only then closes dropdown
                  if (columnSearch) {
                    e.preventDefault()
                    setColumnSearch("")
                  }
                }}
              >
                <DropdownMenuLabel>{t?.viewColumns ?? "View columns"}</DropdownMenuLabel>
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
                      {t?.clearAllFilters ?? "Clear all filters"}
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
                    placeholder={t?.searchColumns ?? "Search columns..."}
                    value={columnSearch}
                    onChange={(e) => setColumnSearch(e.target.value)}
                    onKeyDown={(e) => {
                      // Stop key events from reaching dropdown (prevents typeahead focus stealing)
                      // Escape is handled by DropdownMenuContent.onEscapeKeyDown
                      e.stopPropagation()
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
                      const label = getColumnLabel(column)
                      return label.toLowerCase().includes(columnSearch.toLowerCase())
                    })
                    .map((column) => {
                      const isUnhideable = unhideableColumns.includes(column.id)
                      const isUnshowable = unshowableColumns.includes(column.id)
                      const label = getColumnLabel(column)
                      const hasFilter = activeFilterIds.has(column.id)
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className={cn(isUnshowable && "opacity-50")}
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

          {showExportButton && !hasAnyActiveFilter && selectedRows.length === 0 && (
            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={handleExportAll}>
              <Download className="h-4 w-4" />
              {t?.export ?? "Export"}
            </Button>
          )}

          {showExportButton &&
            (hasAnyActiveFilter || selectedRows.length > 0) &&
            (() => {
              const allCount = table.getCoreRowModel().rows.length
              const filteredCount = table.getFilteredRowModel().rows.length
              const selectedCount = selectedRows.length
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                      <Download className="h-4 w-4" />
                      {t?.export ?? "Export"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportAll}>
                      {t?.exportAll?.(allCount) ?? `Export all (${allCount} rows)`}
                    </DropdownMenuItem>
                    {selectedCount > 0 && (
                      <DropdownMenuItem onClick={handleExportSelected}>
                        {t?.exportSelected?.(selectedCount) ??
                          `Export selected (${selectedCount} rows)`}
                      </DropdownMenuItem>
                    )}
                    {hasAnyActiveFilter && (
                      <DropdownMenuItem
                        onClick={handleExportFiltered}
                        disabled={filteredCount === 0}
                      >
                        {t?.exportFiltered?.(filteredCount) ??
                          `Export filtered (${filteredCount} rows)`}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })()}

          {showImportButton && (
            <div className="relative">
              <Button variant="outline" size="sm" className="h-9 gap-2" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  {t?.import ?? "Import"}
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
              {t?.newRecord ?? "New record"}
            </Button>
          )}
        </div>
      </div>

      {showFulltext && (
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t?.search ?? "Search..."}
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
      )}
    </div>
  )
}
