"use client"

import { Table as TanStackTable, flexRender } from "@tanstack/react-table"

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

interface TsTableViewProps<TData> {
  table: TanStackTable<TData>
  onRowClick?: (row: TData) => void
}

export function TsTableView<TData>({ table, onRowClick }: TsTableViewProps<TData>) {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as { type?: string } | undefined
                return (
                  <TableHead
                    key={header.id}
                    className="align-top py-2 px-4 font-bold text-muted-foreground"
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex flex-col gap-2">
                      {/* Header Title & Sort Button */}
                      <div className="h-8 flex items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </div>

                      {/* Filter Input */}
                      {header.column.getCanFilter() ? (
                        <div className="pb-2">
                          {meta?.type === "boolean" ? (
                            <Select
                              value={(header.column.getFilterValue() ?? "all") as string}
                              onValueChange={(val: string) =>
                                header.column.setFilterValue(val === "all" ? "" : val)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs bg-background w-full">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              placeholder={
                                meta?.type === "number"
                                  ? ">10, 10..20"
                                  : meta?.type === "date"
                                    ? ">2023-01-01"
                                    : "Filter..."
                              }
                              value={(header.column.getFilterValue() ?? "") as string}
                              onChange={(event) => header.column.setFilterValue(event.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  e.preventDefault()
                                  header.column.setFilterValue("")
                                }
                              }}
                              className="h-8 text-xs bg-background"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="h-0 pb-2" />
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "hover:bg-muted/50 transition-colors cursor-default",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-3">
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
          )}
        </TableBody>
      </Table>
    </div>
  )
}
