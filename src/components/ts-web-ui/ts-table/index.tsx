"use client"

import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import * as React from "react"

import { TsTableColumnDef, TsTableRowAction, generateColumns } from "./columns"
import { TsTablePagination } from "./ts-table-pagination"
import { TsTableToolbar } from "./ts-table-toolbar"
import { TsTableView } from "./ts-table-view"

export type { TsTableColumnDef } from "./columns"

export interface TsTableProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  data: TData[]
  columnDefinitions: TsTableColumnDef[]
  title?: string
  showCreateButton?: boolean
  showImportButton?: boolean
  showExportButton?: boolean
  showColumnSelector?: boolean
  enableSelection?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableRowMenu?: boolean
  enableClickableRows?: boolean
  enableClickableColumns?: boolean
  enableColumnResizing?: boolean
  enableColumnReordering?: boolean
  unhideableColumns?: string[]
  onRowClick?: (row: TData, columnKey?: string) => void
  onCreateClick?: () => void
  onAction?: (action: string, row: TData) => void
  onDataChange?: (data: TData[]) => void
  onSelectionChange?: (selectedRows: TData[]) => void
  pageSize?: number
  pageSizeOptions?: number[]
  singleItemActions?: string // "action/Label,..."
  multipleItemsActions?: string // "action/Label,..."
  onBulkAction?: (action: string, rows: TData[]) => void
  columnsRequiredForImport?: string[]
  predefinedFilters?: Record<string, unknown>
  getRowId?: (row: TData) => string
  initialRowSelection?: Record<string, boolean>
}

export function TsTable<TData extends Record<string, unknown> = Record<string, unknown>>({
  data: initialData,
  columnDefinitions,
  title,
  showCreateButton = true,
  showImportButton = true,
  showExportButton = true,
  showColumnSelector = true,
  enableSelection = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowMenu = true,
  enableClickableRows = true,
  enableClickableColumns = false,
  enableColumnResizing = true,
  enableColumnReordering = true,
  unhideableColumns = [],
  onRowClick,
  onCreateClick,
  onAction,
  onDataChange,
  onSelectionChange,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  singleItemActions,
  multipleItemsActions,
  onBulkAction,
  columnsRequiredForImport,
  predefinedFilters,
  getRowId,
  initialRowSelection,
}: TsTableProps<TData>) {
  const [data, setData] = React.useState(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])

  // Initialize filters with predefined filters if available
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
    if (!predefinedFilters) return []
    return Object.entries(predefinedFilters).map(([id, value]) => ({ id, value: String(value) }))
  })

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    const vis: VisibilityState = {}
    columnDefinitions.forEach((col) => {
      if (col.visible === false || col.unshowable) vis[col.key] = false
    })
    return vis
  })
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialRowSelection || {}
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
  const [selectionViewMode, setSelectionViewMode] = React.useState<
    "all" | "selected" | "unselected"
  >("all")

  // Update data if initialData changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Sync row selection if initialRowSelection changes externally
  React.useEffect(() => {
    if (initialRowSelection) {
      setRowSelection(initialRowSelection)
    }
  }, [initialRowSelection])

  // Parse row actions
  const rowActions = React.useMemo<TsTableRowAction[]>(() => {
    if (!singleItemActions) return []
    return singleItemActions.split(",").map((s) => {
      const parts = s.split("/")
      return { action: parts[0].trim(), label: parts[1]?.trim() || parts[0].trim() }
    })
  }, [singleItemActions])

  // Parse bulk actions
  const bulkActions = React.useMemo<TsTableRowAction[]>(() => {
    if (!multipleItemsActions) return []
    return multipleItemsActions.split(",").map((s) => {
      const parts = s.split("/")
      return { action: parts[0].trim(), label: parts[1]?.trim() || parts[0].trim() }
    })
  }, [multipleItemsActions])

  // Determine effective row actions based on enableRowMenu
  const effectiveRowActions = React.useMemo(
    () => (enableRowMenu ? rowActions : []),
    [enableRowMenu, rowActions]
  )

  // Determine click handlers based on enable flags
  const effectiveRowClick = enableClickableRows || enableClickableColumns ? onRowClick : undefined

  // Generate columns definition
  const columns = React.useMemo(
    () =>
      generateColumns<TData>(
        columnDefinitions,
        enableSelection,
        effectiveRowClick,
        effectiveRowActions,
        onAction,
        enableSorting,
        enableClickableColumns
      ),
    [
      columnDefinitions,
      enableSelection,
      effectiveRowClick,
      effectiveRowActions,
      onAction,
      enableSorting,
      enableClickableColumns,
    ]
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
      columnSizing,
      columnOrder,
    },
    columnResizeMode: enableColumnResizing ? "onChange" : undefined,
    enableSorting,
    enableColumnFilters: enableFiltering,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getRowId,
    initialState: {
      pagination: {
        pageSize: enablePagination ? pageSize : 999999,
      },
    },
  })

  // Propagate selection changes back up
  React.useEffect(() => {
    if (!onSelectionChange) return
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
    onSelectionChange(selectedRows)
  }, [rowSelection, table, onSelectionChange])

  // Get selected rows for toolbar
  const selectedRows = React.useMemo(
    () => table.getFilteredSelectedRowModel().rows.map((row) => row.original),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rowSelection, table]
  )

  // Track predefined filter keys for persistence
  const predefinedFilterKeys = React.useMemo(
    () => (predefinedFilters ? Object.keys(predefinedFilters) : []),
    [predefinedFilters]
  )

  const handleImport = React.useCallback(
    (newData: TData[]) => {
      setData((prev) => {
        const updated = [...prev, ...newData]
        // Use setTimeout to avoid state update during render
        if (onDataChange) {
          setTimeout(() => onDataChange(updated), 0)
        }
        return updated
      })
    },
    [onDataChange]
  )

  // Unshowable columns — filter from column definitions for selector
  const showableColumnDefinitions = React.useMemo(
    () => columnDefinitions.filter((col) => !col.unshowable),
    [columnDefinitions]
  )

  return (
    <div className="w-full space-y-4">
      <TsTableToolbar
        table={table}
        title={title}
        showCreateButton={showCreateButton}
        showImportButton={showImportButton}
        showExportButton={showExportButton}
        showColumnSelector={showColumnSelector}
        unhideableColumns={unhideableColumns}
        bulkActions={bulkActions}
        selectedRows={selectedRows}
        onBulkAction={onBulkAction}
        onUnselectAll={() => setRowSelection({})}
        onCreateClick={onCreateClick}
        onImportClick={handleImport}
        columnDefinitions={showableColumnDefinitions}
        columnsRequiredForImport={columnsRequiredForImport}
      />
      <TsTableView
        table={table}
        enableFiltering={enableFiltering}
        enableColumnResizing={enableColumnResizing}
        enableColumnReordering={enableColumnReordering}
        selectionViewMode={selectionViewMode}
        onSelectionViewModeChange={setSelectionViewMode}
        hasSelectedRows={Object.keys(rowSelection).length > 0}
        predefinedFilterKeys={predefinedFilterKeys}
        onRowClick={enableClickableRows && onRowClick ? (row) => onRowClick(row) : undefined}
      />
      {enablePagination && <TsTablePagination table={table} pageSizeOptions={pageSizeOptions} />}
    </div>
  )
}
