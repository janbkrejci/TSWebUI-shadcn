"use client"

import { Table as TanStackTable, flexRender } from "@tanstack/react-table"
import { Check, ChevronLeft, ChevronRight, Filter, X as XIcon } from "lucide-react"

import * as React from "react"

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

import { cn } from "@/lib/utils"

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
}: TsTableViewProps<TData>) {
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

  // Get column order for checking move boundaries
  const visibleDataColumns = React.useMemo(() => {
    return table.getVisibleLeafColumns().filter((c) => c.id !== "select" && c.id !== "actions")
  }, [table])

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table style={{ minWidth: "100%" }}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              {/* Row 1: Header labels + reorder buttons */}
              <TableRow>
                {headerGroup.headers.map((header) => {
                  const isDataColumn =
                    header.column.id !== "select" && header.column.id !== "actions"
                  const isFirstData = isDataColumn && visibleDataColumns[0]?.id === header.column.id
                  const isLastData =
                    isDataColumn &&
                    visibleDataColumns[visibleDataColumns.length - 1]?.id === header.column.id

                  return (
                    <TableHead
                      key={header.id}
                      className="py-2 px-3 font-bold text-muted-foreground relative group/header"
                      style={{
                        width: header.getSize(),
                        minWidth: enableColumnResizing ? 50 : undefined,
                      }}
                    >
                      <div className="h-8 flex items-center gap-0.5">
                        {isDataColumn && enableColumnReordering && (
                          <button
                            className={cn(
                              "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm shrink-0",
                              isFirstData && "invisible"
                            )}
                            onClick={() => handleMoveColumn(header.column.id, "left")}
                            disabled={isFirstData}
                            aria-label="Move column left"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                        )}
                        <div className="flex-1 min-w-0">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        {isDataColumn && enableColumnReordering && (
                          <button
                            className={cn(
                              "opacity-0 group-hover/header:opacity-100 transition-opacity p-0.5 hover:bg-accent rounded-sm shrink-0",
                              isLastData && "invisible"
                            )}
                            onClick={() => handleMoveColumn(header.column.id, "right")}
                            disabled={isLastData}
                            aria-label="Move column right"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Column Resize Handle */}
                      {enableColumnResizing && header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className={cn(
                            "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                            "opacity-0 group-hover/header:opacity-100 transition-opacity",
                            "hover:bg-primary/50",
                            header.column.getIsResizing() && "opacity-100 bg-primary"
                          )}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>

              {/* Row 2: Filter inputs + select-all checkbox */}
              {enableFiltering && (
                <TableRow className="bg-muted/30">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as { type?: string } | undefined

                    return (
                      <TableHead key={`filter-${header.id}`} className="py-1.5 px-3">
                        {/* Select-all checkbox in filter row */}
                        {header.column.id === "select" ? (
                          <div className="flex items-center justify-center gap-1">
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
                              aria-label="Select all"
                              className="h-4 w-4 accent-primary cursor-pointer"
                            />
                            {hasSelectedRows && (
                              <button
                                className="p-0.5 hover:bg-accent rounded-sm shrink-0 relative"
                                onClick={cycleSelectionView}
                                aria-label="Toggle selection view"
                                title={
                                  selectionViewMode === "all"
                                    ? "Show all rows"
                                    : selectionViewMode === "selected"
                                      ? "Showing selected only"
                                      : "Showing unselected only"
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
                          // Empty cell for actions column in filter row
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
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
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
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "group/row hover:bg-muted/50 transition-colors cursor-default",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            )
          })()}
        </TableBody>
      </Table>
    </div>
  )
}
