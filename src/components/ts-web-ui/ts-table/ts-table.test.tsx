import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TsTableColumnDef } from "./columns"
import { TsTable } from "./index"

describe("TsTable", () => {
  const columns: TsTableColumnDef[] = [
    { key: "id", title: "ID", type: "number" },
    { key: "name", title: "Name", type: "text", sortable: true, filterable: true },
  ]

  const data = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]

  it("renders table headers and data", () => {
    render(<TsTable data={data} columnDefinitions={columns} />)

    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("filters data when search input is used", async () => {
    render(<TsTable data={data} columnDefinitions={columns} />)

    const searchInput = screen.getByPlaceholderText(/Search.../i)
    fireEvent.change(searchInput, { target: { value: "Alice" } })

    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
  })

  it("calls onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn()
    render(<TsTable data={data} columnDefinitions={columns} onRowClick={onRowClick} />)

    fireEvent.click(screen.getByText("Alice"))
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })
})
