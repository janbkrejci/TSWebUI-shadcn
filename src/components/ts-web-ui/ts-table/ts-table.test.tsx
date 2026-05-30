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

  it("hands the raw file to onImportFile without parsing it", () => {
    const onImportFile = vi.fn()
    const onImport = vi.fn()
    const { container } = render(
      <TsTable
        data={data}
        columnDefinitions={columns}
        onImportFile={onImportFile}
        onImport={onImport}
      />
    )

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["ico\n01"], "clients.csv", { type: "text/csv" })
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(onImportFile).toHaveBeenCalledTimes(1)
    expect(onImportFile.mock.calls[0][0]).toBe(file)
    // Built-in parsing path is skipped when onImportFile is set.
    expect(onImport).not.toHaveBeenCalled()
  })

  it("restores persisted view state for the same persistStateKey", () => {
    window.localStorage.clear()
    const view = render(
      <TsTable data={data} columnDefinitions={columns} persistStateKey="test-table" />
    )

    fireEvent.change(view.getByPlaceholderText(/Search.../i), { target: { value: "Alice" } })
    view.unmount()

    render(<TsTable data={data} columnDefinitions={columns} persistStateKey="test-table" />)
    expect(screen.getByPlaceholderText(/Search.../i)).toHaveValue("Alice")
    window.localStorage.clear()
  })

  it("uses column titles in the column selector instead of internal column ids", () => {
    const localizedColumns: TsTableColumnDef[] = [
      { key: "ico", title: "IČO", type: "text" },
      { key: "name", title: "Název", type: "text" },
    ]

    render(<TsTable data={[{ ico: "123", name: "ACME" }]} columnDefinitions={localizedColumns} />)

    fireEvent.click(screen.getByRole("button", { name: /Columns/i }))

    expect(screen.getByText("IČO")).toBeInTheDocument()
    expect(screen.getByText("Název")).toBeInTheDocument()
    expect(screen.queryByText("ico")).not.toBeInTheDocument()
    expect(screen.queryByText("name")).not.toBeInTheDocument()
  })
})
