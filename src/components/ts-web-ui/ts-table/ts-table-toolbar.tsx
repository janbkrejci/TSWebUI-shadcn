"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { 
  Download, 
  Upload, 
  Plus, 
  Settings2, 
  Search,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
    Command, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandItem,
    CommandList
} from "@/components/ui/command"
import * as XLSX from "xlsx"

interface TsTableToolbarProps {
  table: Table<any>
  showCreateButton?: boolean
  showImportButton?: boolean
  showExportButton?: boolean
  showColumnSelector?: boolean
  onCreateClick?: () => void
  onImportClick?: (data: any[]) => void
  title?: string
}

export function TsTableToolbar({
  table,
  showCreateButton = true,
  showImportButton = true,
  showExportButton = true,
  showColumnSelector = true,
  onCreateClick,
  onImportClick,
  title
}: TsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleExport = () => {
    const data = table.getFilteredRowModel().rows.map(row => row.original)
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Data")
    XLSX.writeFile(wb, `export-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const bstr = event.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)
      onImportClick?.(data)
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="flex items-center justify-between py-4 gap-2">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Hledat..."
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
                Sloupce
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Zobrazit sloupce</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showExportButton && (
          <Button variant="outline" size="sm" className="h-9 gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}

        {showImportButton && (
          <div className="relative">
            <Button variant="outline" size="sm" className="h-9 gap-2" asChild>
                <label className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Import
                    <input type="file" className="hidden" accept=".xlsx,.xls,.csv,.json" onChange={handleImport} />
                </label>
            </Button>
          </div>
        )}

        {showCreateButton && (
          <Button size="sm" className="h-9 gap-2" onClick={onCreateClick}>
            <Plus className="h-4 w-4" />
            Nový záznam
          </Button>
        )}
      </div>
    </div>
  )
}
