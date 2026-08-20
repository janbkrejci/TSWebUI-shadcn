"use client"

import { Column, flexRender, Table as TanStackTable } from "@tanstack/react-table"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
  MoreVertical,
  X as XIcon,
} from "lucide-react"

import * as React from "react"
import { TsLocale } from "@/components/ts-web-ui/locale"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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

// biome-ignore lint/suspicious/noExplicitAny: Column is generic; any is needed for reuse across TData
function ComboboxColumnFilter({ column }: { column: Column<any, unknown> }) {
  const [open, setOpen] = React.useState(false)
  const filterValue = (column.getFilterValue() ?? "") as string
  const facetedValues = column.getFacetedUniqueValues()
  const options = Array.from(facetedValues.keys())
    .filter((v) => v != null && String(v).trim() !== "")
    .map((v) => String(v))
    .sort()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          className={cn(
            "flex h-7 w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-2 text-xs shadow-xs cursor-pointer",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        >
          <span className={cn("flex-1 truncate", !filterValue && "text-muted-foreground")}>
            {filterValue || "…"}
          </span>
          {filterValue ? (
            <XIcon
              className="h-3 w-3 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                column.setFilterValue("")
              }}
            />
          ) : (
            <ChevronsUpDown className="h-3 w-3 text-muted-foreground opacity-50 shrink-0" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Hledat…" className="h-8" />
          <CommandList>
            <CommandEmpty className="py-2 text-xs text-center text-muted-foreground italic">
              Žádné hodnoty.
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  className="text-xs"
                  onSelect={(v) => {
                    column.setFilterValue(v === filterValue ? "" : v)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      filterValue === opt ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
  onRowClick?: (row: TData) => void
  bulkActions?: TsTableRowAction[]
  selectedRowCount?: number
  onBulkAction?: (action: string) => void
  onUnselectAll?: () => void
  stickyHeader?: boolean
  maxHeight?: number | string
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
  onRowClick,
  bulkActions = [],
  selectedRowCount = 0,
  onBulkAction,
  onUnselectAll,
  stickyHeader = false,
  maxHeight,
  locale,
}: TsTableViewProps<TData>) {
  const t = locale?.strings.table

  // A column opts into freezing with `pinned: "left"` in its definition (carried through the
  // column meta). The built-in select/actions columns always render leftmost, so they ride along
  // with the frozen block — leaving them scrollable would slide them under it.
  const isPinnedLeft = React.useCallback(
    (columnId: string): boolean => {
      if (columnId === "select" || columnId === "actions") {
        // Only ride along while a pinned column is actually on screen. Hiding the last pinned
        // column would otherwise leave these two 40px utility columns frozen on their own, which
        // is never useful and reads as if freezing broke.
        return table
          .getVisibleLeafColumns()
          .some((col) => (col.columnDef.meta as { pinned?: string } | undefined)?.pinned === "left")
      }
      const meta = table.getColumn(columnId)?.columnDef.meta as { pinned?: string } | undefined
      return meta?.pinned === "left"
    },
    [table]
  )

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

      // Split by membership, not by position. Pinned columns are frozen to the left edge, so they
      // are non-movable in the same way select/actions are — but a hidden column declared ahead of
      // a pinned one would end the "leading run" early, and everything after it (the pinned column
      // included) would drift into the movable range and could be swapped out of the frozen block.
      const immovableIds = allColumnIds.filter((id) => isPinnedLeft(id))
      const movableIds = allColumnIds.filter((id) => !isPinnedLeft(id))

      const idx = movableIds.indexOf(columnId)
      if (idx < 0) return

      const swapIdx = direction === "left" ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= movableIds.length) return

      // Swap in movable range
      const temp = movableIds[idx]
      movableIds[idx] = movableIds[swapIdx]
      movableIds[swapIdx] = temp

      table.setColumnOrder([...immovableIds, ...movableIds])
    },
    [table, isPinnedLeft]
  )

  // Get visible data columns for checking move boundaries (#5: react to column order). Frozen
  // columns are excluded — they cannot move, so the first MOVABLE column is the one whose
  // "move left" arrow has to be disabled.
  const visibleDataColumns = table
    .getVisibleLeafColumns()
    .filter((c) => c.id !== "select" && c.id !== "actions" && !isPinnedLeft(c.id))

  // Measure container width so we can distribute extra space only to data columns
  const containerRef = React.useRef<HTMLDivElement>(null)

  // With a sticky header the second (filter) row has to stop right below the first one, so its
  // rendered height is measured rather than assumed — it changes with locale, font and zoom.
  const labelRowRef = React.useRef<HTMLTableRowElement>(null)
  const [labelRowHeight, setLabelRowHeight] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = labelRowRef.current
    if (!stickyHeader || !el) return
    const update = () => setLabelRowHeight(el.getBoundingClientRect().height)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [stickyHeader])

  // Compute effective column widths: fixed always 40px, data columns use their natural size
  const FIXED_COL_PX = 40
  const columnWidthMap = (() => {
    const cols = table.getVisibleLeafColumns()
    const map = new Map<string, number>()

    for (const col of cols) {
      const isFixed = col.id === "select" || col.id === "actions"
      map.set(col.id, isFixed ? FIXED_COL_PX : col.getSize())
    }

    return map
  })()

  const effectiveTableWidth = React.useMemo(() => {
    let sum = 0
    for (const w of columnWidthMap.values()) sum += w
    return sum
  }, [columnWidthMap])

  // Left offset of each frozen column, accumulated over the LEADING run of pinned columns. The
  // offsets use the rendered widths (columnWidthMap) rather than TanStack's getStart(), because the
  // select/actions columns render at a fixed 40px regardless of their nominal size. A pinned column
  // that is not part of the leading run gets no offset and simply scrolls — the layout degrades
  // instead of freezing a column at the wrong position.
  const pinnedLeftOffsets = (() => {
    const offsets = new Map<string, number>()
    let offset = 0
    // Walk the CURRENT visible order, so reordering can never leave a frozen column stranded behind
    // a scrolling one. The order itself is normalised to keep pinned columns at the front, so this
    // run covers every pinned column; the break is the backstop that keeps the offsets honest.
    for (const col of table.getVisibleLeafColumns()) {
      if (!isPinnedLeft(col.id)) break
      offsets.set(col.id, offset)
      offset += columnWidthMap.get(col.id) ?? col.getSize()
    }
    return offsets
  })()
  const pinnedIds = [...pinnedLeftOffsets.keys()]
  const lastPinnedId = pinnedIds[pinnedIds.length - 1]

  /**
   * Sticky positioning for one frozen cell. The cell needs an opaque background so the scrolled
   * content cannot show through; the row/header tint is then painted back by an overlay behind the
   * cell content (the cell's z-index makes it a stacking context, so a negative-z child lands
   * between the cell background and its text). That keeps the tint identical to the scrolling
   * cells' without assuming anything about the theme's colour tokens.
   */
  const pinnedCell = (columnId: string, zIndex: number) => {
    const left = pinnedLeftOffsets.get(columnId)
    if (left === undefined) return null
    return {
      className: cn("bg-card", columnId === lastPinnedId && "border-r"),
      style: { position: "sticky", left, zIndex } as React.CSSProperties,
    }
  }

  // `<Table>` wraps the table in its own scroll container, and THAT is the element that scrolls —
  // so the height cap has to land on it, not on this wrapper. Capping the wrapper instead gives two
  // nested scrollports: the wrapper scrolls vertically while `position: sticky` still resolves
  // against the inner one, which never scrolls, and the header quietly fails to stick. The child
  // selector targets the wrapper's only direct child, which keeps this working regardless of how
  // the underlying shadcn Table primitive labels that element.
  const capped = maxHeight !== undefined
  return (
    <div
      ref={containerRef}
      className={cn(
        "rounded-md border bg-card",
        capped
          ? "overflow-hidden [&>div]:overflow-auto [&>div]:[max-height:var(--ts-table-max-height)]"
          : "overflow-x-auto"
      )}
      style={
        capped
          ? ({
              "--ts-table-max-height": typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
            } as React.CSSProperties)
          : undefined
      }
    >
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
              <TableRow ref={labelRowRef}>
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

                  const pinned = pinnedCell(header.column.id, stickyHeader ? 30 : 20)
                  // A frozen column is held at the front of the order, so it never moves.
                  const canReorder = enableColumnReordering && !pinned
                  // A cell that outlives its own row's paint — because it is frozen sideways or the
                  // header floats above the scrolling body — needs its own opaque background: the
                  // row/thead background stays behind at the original position and the content
                  // underneath would otherwise show straight through.
                  const needsBacking = Boolean(pinned) || stickyHeader

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "py-2 px-3 font-bold text-muted-foreground relative group/header",
                        !isDataColumn && "w-[40px] min-w-[40px] max-w-[40px] p-0",
                        stickyHeader && "z-20",
                        needsBacking && "bg-card",
                        pinned?.className
                      )}
                      style={{
                        width: columnWidthMap.get(header.column.id) ?? header.getSize(),
                        ...(isDataColumn && enableColumnResizing
                          ? { minWidth: header.column.columnDef.minSize ?? 60 }
                          : {}),
                        ...pinned?.style,
                        ...(stickyHeader ? ({ position: "sticky", top: 0 } as const) : {}),
                      }}
                    >
                      {/* Repaint the header tint that the opaque backing covered. */}
                      {needsBacking ? (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 -z-10 bg-muted/50"
                        />
                      ) : null}
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
                          {canReorder && colAlign === "right" && (
                            <div className="flex items-center shrink-0">
                              <button
                                type="button"
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
                                type="button"
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
                          {canReorder && colAlign === "center" && (
                            <button
                              type="button"
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
                          {canReorder && colAlign === "left" && (
                            <div className="flex items-center shrink-0">
                              <button
                                type="button"
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
                                type="button"
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
                          {canReorder && colAlign === "center" && (
                            <button
                              type="button"
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
                    const pinned = pinnedCell(header.column.id, stickyHeader ? 30 : 20)
                    const needsBacking = Boolean(pinned) || stickyHeader

                    return (
                      <TableHead
                        key={`filter-${header.id}`}
                        className={cn(
                          "py-1.5 px-3 relative",
                          (header.column.id === "select" || header.column.id === "actions") &&
                            "w-[40px] min-w-[40px] max-w-[40px] p-0",
                          stickyHeader && "z-20",
                          needsBacking && "bg-card",
                          pinned?.className
                        )}
                        style={{
                          width: columnWidthMap.get(header.column.id) ?? header.getSize(),
                          ...pinned?.style,
                          ...(stickyHeader
                            ? ({ position: "sticky", top: labelRowHeight } as const)
                            : {}),
                        }}
                      >
                        {/* Repaint the filter-row tint that the opaque backing covered. */}
                        {needsBacking ? (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -z-10 bg-muted/30"
                          />
                        ) : null}
                        {header.column.id === "select" ? (
                          // Empty in filter row (checkbox moved to row 1)
                          <div className="flex justify-center">
                            {hasSelectedRows && (
                              <button
                                type="button"
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
                            const colMeta = header.column.columnDef.meta as
                              | { type?: string; filterWidget?: string }
                              | undefined
                            if (colMeta?.filterWidget === "combobox") {
                              return <ComboboxColumnFilter column={header.column} />
                            }
                            if (colMeta?.type === "boolean") {
                              return (
                                <Select
                                  value={(header.column.getFilterValue() ?? "all") as string}
                                  onValueChange={(val: string) =>
                                    header.column.setFilterValue(val === "all" ? "" : val)
                                  }
                                >
                                  <SelectTrigger className="h-7 text-xs bg-background w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">{t?.all ?? "All"}</SelectItem>
                                    <SelectItem value="!*">{t?.empty ?? "Empty"}</SelectItem>
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
                                className="h-7 text-xs bg-background"
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
                    const pinned = pinnedCell(cell.column.id, 10)
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-3 py-2",
                          isFixed && "w-[40px] min-w-[40px] max-w-[40px] p-0",
                          pinned && "relative",
                          pinned?.className
                        )}
                        style={{
                          width: columnWidthMap.get(cell.column.id) ?? cell.column.getSize(),
                          ...pinned?.style,
                        }}
                      >
                        {/* Repaint the row hover tint that the opaque frozen background covered. */}
                        {pinned ? (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -z-10 transition-colors group-hover/row:bg-muted/50"
                          />
                        ) : null}
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
