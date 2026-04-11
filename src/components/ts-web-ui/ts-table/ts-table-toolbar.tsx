"use client"

import { Table } from "@tanstack/react-table"
import { Download, Plus, Search, Settings2, Upload, X } from "lucide-react"
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
  bulkActions = [],
  selectedRows = [],
  onBulkAction,
  onUnselectAll,
  onCreateClick,
  onImportClick,
  columnDefinitions = [],
  columnsRequiredForImport,
  title,
}: TsTableToolbarProps<TData>) {
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-4 gap-2">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-8 h-9"
            />
          </div>
          {title && <h2 className="text-lg font-semibold ml-4">{title}</h2>}
        </div>

        <div className="flex items-center gap-2">
          {showColumnSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 ml-auto flex gap-2">
                  <Settings2 className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>View columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const isUnhideable = unhideableColumns.includes(column.id)
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        disabled={isUnhideable}
                        onCheckedChange={(value) => {
                          if (!isUnhideable) column.toggleVisibility(!!value)
                        }}
                      >
                        {typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showExportButton && selectedRows.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={handleExportFiltered}
            >
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

      {/* Selection Bar */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
          <span className="text-sm font-medium">
            {selectedRows.length} row{selectedRows.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-1 ml-2">
            {bulkActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onBulkAction?.(action.action, selectedRows)}
              >
                {action.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={onUnselectAll}>
              <X className="h-3 w-3" />
              Unselect all
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
