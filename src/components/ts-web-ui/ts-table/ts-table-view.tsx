"use client"

import { Table as TanStackTable, flexRender } from "@tanstack/react-table"
import { Check, ChevronLeft, ChevronRight, Filter, MoreVertical, X as XIcon } from "lucide-react"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { TsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ts-web-ui/ui/button"

import { cn } from "@/lib/utils"

import { TsTableRowAction } from "./columns"

const FILTER_DEBOUNCE_DELAY = 500

function DebouncedFilterInput({
  value: externalValue,
  onChange,
  ...props
}: {
  value: string
  onChange: (value: string) => void
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
  const [localValue, setLocalValue] = React.useState(externalValue)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  // Sync from external if changed programmatically
  React.useEffect(() => {
    setLocalValue(externalValue)
  }, [externalValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => onChange(newValue), FILTER_DEBOUNCE_DELAY)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Input
      {...props}
      value={localValue}
      onChange={handleChange}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault()
          setLocalValue("")
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          onChange("")
        }
      }}
    />
  )
}

export type SelectionViewMode = "all" | "selected" | "unselected"

interface TsTableViewProps<TData> {
  table: TanStackTable<TData>
  enableFiltering?: boolean
  enableColumnResizing?: boolean
  enableColumnReordering?: boolean
  selectionViewMode?: SelectionViewMode
  onSelectionViewModeChange?: (mode: SelectionViewMode) => void
  hasSelectedRows?: boolean
  predefinedFilterKeys?: string[]
  onRowClick?: (row: TData) => void
  bulkActions?: TsTableRowAction[]
  selectedRowCount?: number
  onBulkAction?: (action: string) => void
  onUnselectAll?: () => void
  locale?: TsLocale
}

export function TsTableView<TData>({
  table,
  enableFiltering = true,
  enableColumnResizing = true,
  enableColumnReordering = true,
  selectionViewMode = "all",
  onSelectionViewModeChange,
  hasSelectedRows = false,
  predefinedFilterKeys = [],
  onRowClick,
  bulkActions = [],
  selectedRowCount = 0,
  onBulkAction,
  onUnselectAll,
  locale,
}: TsTableViewProps<TData>) {
  const t = locale?.strings.table
  const cycleSelectionView = React.useCallback(() => {
    const modes: SelectionViewMode[] = ["all", "selected", "unselected"]
    const currentIdx = modes.indexOf(selectionViewMode)
    const nextIdx = (currentIdx + 1) % modes.length
    onSelectionViewModeChange?.(modes[nextIdx])
  }, [selectionViewMode, onSelectionViewModeChange])

  const handleMoveColumn = React.useCallback(
    (columnId: string, direction: "left" | "right") => {
      const currentOrder = table.getState().columnOrder
      const allColumnIds =
        currentOrder.length > 0 ? [...currentOrder] : table.getAllLeafColumns().map((c) => c.id)

      // Find movable range: skip "select" and "actions" at the beginning
      const fixedPrefixCount = allColumnIds.filter(
        (id) => id === "select" || id === "actions"
      ).length
      const movableIds = allColumnIds.slice(fixedPrefixCount)

      const idx = movableIds.indexOf(columnId)
      if (idx < 0) return

      const swapIdx = direction === "left" ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= movableIds.length) return

      // Swap in movable range
      const temp = movableIds[idx]
      movableIds[idx] = movableIds[swapIdx]
      movableIds[swapIdx] = temp

      const newOrder = [...allColumnIds.slice(0, fixedPrefixCount), ...movableIds]
      table.setColumnOrder(newOrder)
    },
    [table]
  )

  // Get visible data columns for checking move boundaries (#5: react to column order)
  const columnOrderState = table.getState().columnOrder
  const columnVisibilityState = table.getState().columnVisibility
  const visibleDataColumns = React.useMemo(() => {
    return table.getVisibleLeafColumns().filter((c) => c.id !== "select" && c.id !== "actions")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columnOrderState, columnVisibilityState])

  // Measure container width so we can distribute extra space only to data columns
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Compute effective column widths: fixed always 40px, data columns use their natural size
  const columnSizingState = table.getState().columnSizing
  const FIXED_COL_PX = 40
  const columnWidthMap = React.useMemo(() => {
    const cols = table.getVisibleLeafColumns()
    const map = new Map<string, number>()

    for (const col of cols) {
      const isFixed = col.id === "select" || col.id === "actions"
      map.set(col.id, isFixed ? FIXED_COL_PX : col.getSize())
    }

    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columnSizingState, columnOrderState, columnVisibilityState])

  const effectiveTableWidth = React.useMemo(() => {
    let sum = 0
    for (const w of columnWidthMap.values()) sum += w
    return sum
  }, [columnWidthMap])

  return (
    <div ref={containerRef} className="rounded-md border bg-card overflow-x-auto">
      <Table
        style={{
          width: effectiveTableWidth || table.getCenterTotalSize(),
          tableLayout: "fixed",
        }}
      >
        {/* Colgroup for column widths */}
        <colgroup>
          {table.getVisibleLeafColumns().map((col) => (
            <col key={col.id} style={{ width: columnWidthMap.get(col.id) ?? col.getSize() }} />
          ))}
        </colgroup>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              {/* Row 1: Header labels + reorder buttons + select-all */}
              <TableRow>
                {headerGroup.headers.map((header) => {
                  const isDataColumn =
                    header.column.id !== "select" && header.column.id !== "actions"
                  const isFirstData = isDataColumn && visibleDataColumns[0]?.id === header.column.id
                  const isLastData =
                    isDataColumn &&
                    visibleDataColumns[visibleDataColumns.length - 1]?.id === header.column.id
                  const meta = header.column.columnDef.meta as
                    | { type?: string; align?: string }
                    | undefined
                  const colAlign = (isDataColumn && meta?.align) || "left"

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "py-2 px-3 font-bold text-muted-foreground relative group/header",
                        !isDataColumn && "w-[40px] min-w-[40px] max-w-[40px] p-0"
                      )}
                      style={{
                        width: columnWidthMap.get(header.column.id) ?? header.getSize(),
                        ...(isDataColumn && enableColumnResizing
                          ? { minWidth: header.column.columnDef.minSize ?? 60 }
                          : {}),
                      }}
                    >
                      {/* Select-all checkbox + selection filter in row 1 (#4) */}
                      {header.column.id === "select" ? (
                        <div className="h-8 flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={table.getIsAllPageRowsSelected()}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate =
                                  table.getIsSomePageRowsSelected() &&
                                  !table.getIsAllPageRowsSelected()
                              }
                            }}
                            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
                            aria-label={t?.selectAll ?? "Select all"}
                            className="h-4 w-4 accent-primary cursor-pointer"
                          />
                        </div>
                      ) : header.column.id === "actions" ? (
                        // Bulk actions menu (#11)
                        selectedRowCount > 0 && bulkActions.length > 0 ? (
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-7 w-7 p-0">
                                  <span className="sr-only">
                                    {t?.bulkActions ?? "Bulk actions"}
                                  </span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  {t?.selected?.(selectedRowCount) ??
                                    `Selected: ${selectedRowCount}`}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onUnselectAll?.()}>
                                  {t?.unselectAll ?? "Unselect all"}
                                </DropdownMenuItem>
                                {bulkActions.map((action, idx) => (
                                  <DropdownMenuItem
                                    key={idx}
                                    onClick={() => onBulkAction?.(action.action)}
                                  >
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <div />
                        )
                      ) : (
                        /* Data columns: alignment-aware layout (#6) */
                        <div className="h-8 flex items-center gap-0.5">
                          {/* Arrows on left for right-aligned columns */}
                          {enableColumnReordering && colAlign === "right" && (
                            <div className="flex items-center shrink-0">
                              <button
                                className={cn(
                                  "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm",
                                  isFirstData && "invisible"
                                )}
                                onClick={() => handleMoveColumn(header.column.id, "left")}
                                disabled={isFirstData}
                                aria-label={t?.moveLeft ?? "Move column left"}
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                className={cn(
                                  "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm",
                                  isLastData && "invisible"
                                )}
                                onClick={() => handleMoveColumn(header.column.id, "right")}
                                disabled={isLastData}
                                aria-label={t?.moveRight ?? "Move column right"}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          {/* Left arrow for center-aligned columns */}
                          {enableColumnReordering && colAlign === "center" && (
                            <button
                              className={cn(
                                "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm shrink-0",
                                isFirstData && "invisible"
                              )}
                              onClick={() => handleMoveColumn(header.column.id, "left")}
                              disabled={isFirstData}
                              aria-label={t?.moveLeft ?? "Move column left"}
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                          )}

                          {/* Content area */}
                          <div
                            className={cn(
                              "flex-1 min-w-0",
                              colAlign === "center" && "flex justify-center",
                              colAlign === "right" && "flex justify-end"
                            )}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </div>

                          {/* Both arrows on right for left-aligned columns */}
                          {enableColumnReordering && colAlign === "left" && (
                            <div className="flex items-center shrink-0">
                              <button
                                className={cn(
                                  "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm",
                                  isFirstData && "invisible"
                                )}
                                onClick={() => handleMoveColumn(header.column.id, "left")}
                                disabled={isFirstData}
                                aria-label={t?.moveLeft ?? "Move column left"}
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                className={cn(
                                  "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm",
                                  isLastData && "invisible"
                                )}
                                onClick={() => handleMoveColumn(header.column.id, "right")}
                                disabled={isLastData}
                                aria-label={t?.moveRight ?? "Move column right"}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          {/* Right arrow for center-aligned columns */}
                          {enableColumnReordering && colAlign === "center" && (
                            <button
                              className={cn(
                                "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm shrink-0",
                                isLastData && "invisible"
                              )}
                              onClick={() => handleMoveColumn(header.column.id, "right")}
                              disabled={isLastData}
                              aria-label={t?.moveRight ?? "Move column right"}
                            >
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Column Resize Handle (#3: wider hit area + z-index) */}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className={cn(
                            "absolute -right-1 top-0 h-full w-2 cursor-col-resize select-none touch-none z-10",
                            "after:absolute after:right-[3px] after:top-1 after:bottom-1 after:w-px after:bg-border",
                            "hover:after:bg-primary/50 hover:after:w-0.5",
                            header.column.getIsResizing() && "after:bg-primary after:w-0.5"
                          )}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>

              {/* Row 2: Filter inputs + bulk actions menu */}
              {enableFiltering && (
                <TableRow className="bg-muted/30">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as { type?: string } | undefined

                    return (
                      <TableHead
                        key={`filter-${header.id}`}
                        className={cn(
                          "py-1.5 px-3",
                          (header.column.id === "select" || header.column.id === "actions") &&
                            "w-[40px] min-w-[40px] max-w-[40px] p-0"
                        )}
                        style={{
                          width: columnWidthMap.get(header.column.id) ?? header.getSize(),
                        }}
                      >
                        {header.column.id === "select" ? (
                          // Empty in filter row (checkbox moved to row 1)
                          <div className="flex justify-center">
                            {hasSelectedRows && (
                              <button
                                className="hover:bg-accent rounded-sm shrink-0 relative"
                                onClick={cycleSelectionView}
                                aria-label={t?.toggleSelectionView ?? "Toggle selection view"}
                                title={
                                  selectionViewMode === "all"
                                    ? (t?.showAllRows ?? "Show all rows")
                                    : selectionViewMode === "selected"
                                      ? (t?.showSelectedOnly ?? "Showing selected only")
                                      : (t?.showUnselectedOnly ?? "Showing unselected only")
                                }
                              >
                                <Filter
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    selectionViewMode !== "all"
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  )}
                                />
                                {selectionViewMode === "selected" && (
                                  <Check className="h-2 w-2 absolute -bottom-0.5 -right-0.5 text-primary" />
                                )}
                                {selectionViewMode === "unselected" && (
                                  <XIcon className="h-2 w-2 absolute -bottom-0.5 -right-0.5 text-destructive" />
                                )}
                              </button>
                            )}
                          </div>
                        ) : header.column.id === "actions" ? (
                          <div />
                        ) : header.column.getCanFilter() ? (
                          (() => {
                            const isPredefined = predefinedFilterKeys.includes(header.column.id)
                            if (meta?.type === "boolean") {
                              return (
                                <Select
                                  value={(header.column.getFilterValue() ?? "all") as string}
                                  onValueChange={(val: string) =>
                                    header.column.setFilterValue(val === "all" ? "" : val)
                                  }
                                  disabled={isPredefined}
                                >
                                  <SelectTrigger className="h-7 text-xs bg-background w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">{t?.all ?? "All"}</SelectItem>
                                    <SelectItem value="true">{t?.yes ?? "Yes"}</SelectItem>
                                    <SelectItem value="false">{t?.no ?? "No"}</SelectItem>
                                  </SelectContent>
                                </Select>
                              )
                            }
                            return (
                              <DebouncedFilterInput
                                value={(header.column.getFilterValue() ?? "") as string}
                                onChange={(value) => header.column.setFilterValue(value)}
                                readOnly={isPredefined}
                                className={cn(
                                  "h-7 text-xs bg-background",
                                  isPredefined && "opacity-60 cursor-not-allowed"
                                )}
                              />
                            )
                          })()
                        ) : (
                          <div />
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableHeader>
        <TableBody>
          {(() => {
            // Filter rows based on selectionViewMode
            const allRows = table.getRowModel().rows
            const displayRows =
              selectionViewMode === "all"
                ? allRows
                : allRows.filter((row) => {
                    const isSelected = row.getIsSelected()
                    return selectionViewMode === "selected" ? isSelected : !isSelected
                  })

            return displayRows.length ? (
              displayRows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "group/row hover:bg-muted/50 transition-colors cursor-default",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isFixed = cell.column.id === "select" || cell.column.id === "actions"
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-3 py-2",
                          isFixed && "w-[40px] min-w-[40px] max-w-[40px] p-0"
                        )}
                        style={{
                          width: columnWidthMap.get(cell.column.id) ?? cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  {t?.noRecords ?? "No records found."}
                </TableCell>
              </TableRow>
            )
          })()}
        </TableBody>
      </Table>
    </div>
  )
}
