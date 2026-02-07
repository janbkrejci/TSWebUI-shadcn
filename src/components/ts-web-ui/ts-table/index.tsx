"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { TsTableView } from "./ts-table-view"
import { TsTableToolbar } from "./ts-table-toolbar"
import { TsTablePagination } from "./ts-table-pagination"
import { generateColumns, TsTableColumnDef, TsTableRowAction } from "./columns"

export interface TsTableProps {
  data: any[]
  columnDefinitions: TsTableColumnDef[]
  title?: string
  showCreateButton?: boolean
  showImportButton?: boolean
  showExportButton?: boolean
  showColumnSelector?: boolean
  enableSelection?: boolean
  onRowClick?: (row: any, columnKey?: string) => void
  onCreateClick?: () => void
  onAction?: (action: string, row: any) => void
  pageSize?: number
  pageSizeOptions?: number[]
  singleItemActions?: string // "action/Label,..."
  predefinedFilters?: Record<string, any>
}

export function TsTable({
  data: initialData,
  columnDefinitions,
  title,
  showCreateButton = true,
  showImportButton = true,
  showExportButton = true,
  showColumnSelector = true,
  enableSelection = true,
  onRowClick,
  onCreateClick,
  onAction,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  singleItemActions,
  predefinedFilters
}: TsTableProps) {
  const [data, setData] = React.useState(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  
  // Initialize filters with predefined filters if available
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
      if (!predefinedFilters) return []
      return Object.entries(predefinedFilters).map(([id, value]) => ({ id, value: String(value) }))
  })

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    columnDefinitions.reduce((acc, col) => {
      if (col.visible === false) acc[col.key] = false
      return acc
    }, {} as VisibilityState)
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Update data if initialData changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Parse row actions
  const rowActions = React.useMemo<TsTableRowAction[]>(() => {
      if (!singleItemActions) return []
      return singleItemActions.split(',').map(s => {
          const parts = s.split('/')
          return { action: parts[0].trim(), label: parts[1]?.trim() || parts[0].trim() }
      })
  }, [singleItemActions])

  // Generate columns definition
  const columns = React.useMemo(
      () => generateColumns(columnDefinitions, enableSelection, onRowClick, rowActions, onAction), 
      [columnDefinitions, enableSelection, onRowClick, rowActions, onAction]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  const handleImport = (newData: any[]) => {
      setData(prev => [...prev, ...newData])
  }

  return (
    <div className="w-full space-y-4">
      <TsTableToolbar 
        table={table} 
        title={title}
        showCreateButton={showCreateButton}
        showImportButton={showImportButton}
        showExportButton={showExportButton}
        showColumnSelector={showColumnSelector}
        onCreateClick={onCreateClick}
        onImportClick={handleImport}
      />
      <TsTableView 
        table={table}
        onRowClick={onRowClick ? (row) => onRowClick(row) : undefined}
      />
      <TsTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  )
}
