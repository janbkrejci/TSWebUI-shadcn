"use client"

import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Download, X } from "lucide-react"
import * as React from "react"
import * as XLSX from "xlsx"

import { TsLocale, useTsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ui/button"

import { generateColumns, TsTableColumnDef, TsTableRowAction } from "./columns"
import { loadPersistedTableState, savePersistedTableState } from "./persistence"
import { TsTablePagination } from "./ts-table-pagination"
import { TsTableToolbar } from "./ts-table-toolbar"
import { TsTableView } from "./ts-table-view"

export type { TsTableColumnDef } from "./columns"

export interface ImportResult {
  added: number
  updated: number
  rejected: number
  skipped: number
  rejectedRowsData?: Record<string, unknown>[]
}

export interface TsTableProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  data: TData[]
  columnDefinitions: TsTableColumnDef[]
  title?: string
  showFulltext?: boolean
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
  onImport?: (data: Record<string, unknown>[]) => void
  /**
   * Open import pipeline: receive the raw selected File and parse it yourself (UTF-8, string
   * cells, all columns). When set, the built-in XLSX parsing/column-filtering is skipped and
   * this takes precedence over onImport.
   */
  onImportFile?: (file: File) => void | Promise<void>
  importResult?: ImportResult | null
  onImportResultClose?: () => void
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
  /**
   * When set, the table view state (sorting, filters, column visibility/order/sizing, global
   * filter and pagination) is persisted to localStorage under this key and restored on mount —
   * e.g. so settings survive navigating to a detail page and back.
   */
  persistStateKey?: string
  /**
   * Initial sort applied on mount. The user can freely re-sort afterwards; this only seeds the
   * starting sort state (e.g. newest records first). Persisted sorting (when persistStateKey is
   * set) takes precedence.
   */
  defaultSorting?: SortingState
  locale?: string | TsLocale
}

function ImportResultDialog({
  result,
  columnDefinitions,
  onClose,
  t,
}: {
  result: ImportResult
  columnDefinitions: TsTableColumnDef[]
  onClose: () => void
  t: TsLocale["strings"]["table"]
}) {
  const saveRejectedRows = () => {
    const data = result.rejectedRowsData
    if (!data || data.length === 0) return
    const headers = columnDefinitions.map((c) => c.key)
    const aoa = [headers, ...data.map((row) => headers.map((h) => row[h] ?? ""))]
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Rejected")
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    XLSX.writeFile(
      wb,
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} Rejected rows.xlsx`
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border rounded-lg shadow-lg p-6 w-[400px] max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t.importResults}</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-accent rounded-sm">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t.added}:</span>
            <span className="font-medium">{result.added}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.updated}:</span>
            <span className="font-medium">{result.updated}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.rejected}:</span>
            <span className="font-medium text-destructive">{result.rejected}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.skipped}:</span>
            <span className="font-medium">{result.skipped}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {result.rejected > 0 && result.rejectedRowsData && result.rejectedRowsData.length > 0 && (
            <Button variant="outline" size="sm" onClick={saveRejectedRows}>
              <Download className="h-4 w-4 mr-1.5" />
              {t.saveRejectedRows}
            </Button>
          )}
          <Button size="sm" onClick={onClose}>
            {t.close}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TsTable<TData extends Record<string, unknown> = Record<string, unknown>>({
  data: initialData,
  columnDefinitions,
  title,
  showFulltext = true,
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
  onImport,
  onImportFile,
  importResult = null,
  onImportResultClose,
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
  persistStateKey,
  defaultSorting,
  locale: localeProp,
}: TsTableProps<TData>) {
  const locale = useTsLocale(localeProp)
  const t = locale.strings.table
  const [data, setData] = React.useState(initialData)

  // Restore any persisted view state once on mount.
  const persisted = React.useMemo(() => loadPersistedTableState(persistStateKey), [persistStateKey])

  // Persisted sorting wins; otherwise seed from defaultSorting (if provided).
  const [sorting, setSorting] = React.useState<SortingState>(
    () => persisted?.sorting ?? defaultSorting ?? []
  )

  const initialPredefinedFilters = React.useMemo(() => {
    if (!predefinedFilters) return {} as Record<string, string>
    return Object.fromEntries(
      Object.entries(predefinedFilters).map(([id, value]) => [id, String(value)])
    )
  }, [predefinedFilters])

  // Initialize filters from persisted state, falling back to predefined filters.
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() => {
    if (persisted?.columnFilters) return persisted.columnFilters
    return Object.entries(initialPredefinedFilters).map(([id, value]) => ({ id, value }))
  })
  const touchedPredefinedFilterKeysRef = React.useRef<Set<string>>(new Set())

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    const vis: VisibilityState = {}
    columnDefinitions.forEach((col) => {
      if (col.visible === false || col.unshowable) vis[col.key] = false
    })
    if (persisted?.columnVisibility) Object.assign(vis, persisted.columnVisibility)
    // Unshowable columns can never be made visible, even via persisted state.
    columnDefinitions.forEach((col) => {
      if (col.unshowable) vis[col.key] = false
    })
    return vis
  })
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialRowSelection || {}
  )
  const [globalFilter, setGlobalFilter] = React.useState(() => persisted?.globalFilter ?? "")
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
    () => persisted?.columnSizing ?? {}
  )
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => persisted?.columnOrder ?? []
  )
  const [pagination, setPagination] = React.useState<PaginationState>(() => ({
    pageIndex: persisted?.pagination?.pageIndex ?? 0,
    pageSize: persisted?.pagination?.pageSize ?? (enablePagination ? pageSize : 999999),
  }))
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

  const handleColumnFiltersChange = React.useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater

        for (const key of Object.keys(initialPredefinedFilters)) {
          if (touchedPredefinedFilterKeysRef.current.has(key)) continue

          const prevValue = String(prev.find((filter) => filter.id === key)?.value ?? "")
          const nextValue = String(next.find((filter) => filter.id === key)?.value ?? "")

          if (prevValue !== nextValue) {
            touchedPredefinedFilterKeysRef.current.add(key)
          }
        }

        return next
      })
    },
    [initialPredefinedFilters]
  )

  const activePredefinedFilterKeys = Object.keys(initialPredefinedFilters).filter(
    (key) => !touchedPredefinedFilterKeysRef.current.has(key)
  )

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
        enableClickableColumns,
        enableColumnReordering,
        locale
      ),
    [
      columnDefinitions,
      enableSelection,
      effectiveRowClick,
      effectiveRowActions,
      onAction,
      enableSorting,
      enableClickableColumns,
      enableColumnReordering,
      locale,
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
      pagination,
    },
    columnResizeMode: enableColumnResizing ? "onChange" : undefined,
    enableSorting,
    enableColumnFilters: enableFiltering,
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getRowId,
  })

  // Persist view state whenever it changes (no-op when persistStateKey is unset).
  React.useEffect(() => {
    savePersistedTableState(persistStateKey, {
      sorting,
      columnFilters,
      columnVisibility,
      columnSizing,
      columnOrder,
      globalFilter,
      pagination,
    })
  }, [
    persistStateKey,
    sorting,
    columnFilters,
    columnVisibility,
    columnSizing,
    columnOrder,
    globalFilter,
    pagination,
  ])

  // Propagate selection changes back up
  React.useEffect(() => {
    if (!onSelectionChange) return
    onSelectionChange(table.getFilteredSelectedRowModel().rows.map((row) => row.original))
  }, [onSelectionChange, table])

  // Get selected rows for toolbar
  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)

  // Unshowable column keys for selector (#8: pass to toolbar for dimmed display)
  const unshowableColumnKeys = React.useMemo(
    () => columnDefinitions.filter((col) => col.unshowable).map((col) => col.key),
    [columnDefinitions]
  )

  return (
    <div className="w-full space-y-4">
      <TsTableToolbar
        table={table}
        title={title}
        showFulltext={showFulltext}
        showCreateButton={showCreateButton}
        showImportButton={showImportButton}
        showExportButton={showExportButton}
        showColumnSelector={showColumnSelector}
        unhideableColumns={unhideableColumns}
        unshowableColumns={unshowableColumnKeys}
        bulkActions={bulkActions}
        selectedRows={selectedRows}
        onBulkAction={onBulkAction}
        onUnselectAll={() => setRowSelection({})}
        onCreateClick={onCreateClick}
        onImportClick={onImport}
        onImportFile={onImportFile}
        columnDefinitions={columnDefinitions}
        columnsRequiredForImport={columnsRequiredForImport}
        predefinedFilterKeys={activePredefinedFilterKeys}
        locale={locale}
      />
      <TsTableView
        table={table}
        enableFiltering={enableFiltering}
        enableColumnResizing={enableColumnResizing}
        enableColumnReordering={enableColumnReordering}
        selectionViewMode={selectionViewMode}
        onSelectionViewModeChange={setSelectionViewMode}
        hasSelectedRows={Object.keys(rowSelection).length > 0}
        onRowClick={enableClickableRows && onRowClick ? (row) => onRowClick(row) : undefined}
        bulkActions={bulkActions}
        selectedRowCount={selectedRows.length}
        onBulkAction={onBulkAction ? (action) => onBulkAction(action, selectedRows) : undefined}
        onUnselectAll={() => setRowSelection({})}
        locale={locale}
      />
      {/* Import results dialog */}
      {importResult && (
        <ImportResultDialog
          result={importResult}
          columnDefinitions={columnDefinitions}
          onClose={onImportResultClose ?? (() => {})}
          t={t}
        />
      )}
      {enablePagination && (
        <TsTablePagination table={table} pageSizeOptions={pageSizeOptions} locale={locale} />
      )}
    </div>
  )
}
