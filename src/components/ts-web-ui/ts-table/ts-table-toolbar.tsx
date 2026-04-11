"use client"

import { Table } from "@tanstack/react-table"
import { Download, Plus, Search, Settings2, Upload } from "lucide-react"
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

import { TsTableColumnDef, TsTableRowAction } from "./columns"

interface TsTableToolbarProps<TData> {
  table: Table<TData>
  showCreateButton?: boolean
  showImportButton?: boolean
  showExportButton?: boolean
  showColumnSelector?: boolean
  unhideableColumns?: string[]
  bulkActions?: TsTableRowAction[]
  selectedRows?: TData[]
  onBulkAction?: (action: string, rows: TData[]) => void
  onUnselectAll?: () => void
  onCreateClick?: () => void
  onImportClick?: (data: TData[]) => void
  columnDefinitions?: TsTableColumnDef[]
  columnsRequiredForImport?: string[]
  title?: string
}

export function TsTableToolbar<TData>({
  table,
  showCreateButton = true,
  showImportButton = true,
  showExportButton = true,
  showColumnSelector = true,
  unhideableColumns = [],
  bulkActions: _bulkActions = [],
  selectedRows = [],
  onBulkAction: _onBulkAction,
  onUnselectAll: _onUnselectAll,
  onCreateClick,
  onImportClick,
  columnDefinitions = [],
  columnsRequiredForImport,
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

  // Get columns in the order they are displayed
  const orderedColumns = React.useMemo(() => {
    // Use visible leaf columns order, but include hidden ones too
    const visibleOrder = table.getVisibleLeafColumns().map((c) => c.id)
    const allCols = table
      .getAllLeafColumns()
      .filter((c) => c.getCanHide() && c.id !== "select" && c.id !== "actions")

    // Sort: visible ones first in display order, then hidden ones
    return allCols.sort((a, b) => {
      const aIdx = visibleOrder.indexOf(a.id)
      const bIdx = visibleOrder.indexOf(b.id)
      if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx
      if (aIdx >= 0) return -1
      if (bIdx >= 0) return 1
      return 0
    })
  }, [table])

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
              <div className="px-2 pb-1.5">
                <Input
                  placeholder="Search columns..."
                  value={columnSearch}
                  onChange={(e) => setColumnSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault()
                      e.stopPropagation()
                      setColumnSearch("")
                    }
                    // Prevent dropdown from closing on Enter
                    if (e.key === "Enter") e.preventDefault()
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
                    const header = column.columnDef.header
                    const label = typeof header === "string" ? header : column.id
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        disabled={isUnhideable}
                        onCheckedChange={(value) => {
                          if (!isUnhideable) column.toggleVisibility(!!value)
                        }}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {label}
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
