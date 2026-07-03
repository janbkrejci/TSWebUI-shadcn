import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import * as XLSX from "xlsx"

import { TsTableColumnDef } from "./columns"
import { TsTable } from "./index"

// writeFile would hit the filesystem during the export test — stub it, keep the rest of xlsx real
// so json_to_sheet still produces a worksheet we can inspect.
vi.mock("xlsx", async (importOriginal) => {
  const actual = await importOriginal<typeof import("xlsx")>()
  return { ...actual, writeFile: vi.fn() }
})

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

  it("supports negation and text anchors in fulltext search", () => {
    render(<TsTable data={data} columnDefinitions={columns} />)

    const searchInput = screen.getByPlaceholderText(/Search.../i)
    fireEvent.change(searchInput, { target: { value: "!^a" } })

    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
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

  it("shows import progress until the user stops waiting", () => {
    const onImportFile = vi.fn()
    const { container } = render(
      <TsTable data={data} columnDefinitions={columns} onImportFile={onImportFile} />
    )

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["ico\n01"], "clients.csv", { type: "text/csv" })
    fireEvent.change(fileInput, { target: { files: [file] } })

    const status = screen.getByRole("status")
    expect(status).toHaveTextContent("Import is running...")
    expect(status.parentElement).toHaveClass("fixed", "inset-0", "z-50", "bg-black/50")
    fireEvent.click(screen.getByRole("button", { name: /Stop waiting/i }))

    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })

  it("clears import progress when import results arrive", () => {
    const onImportFile = vi.fn()
    const { container, rerender } = render(
      <TsTable data={data} columnDefinitions={columns} onImportFile={onImportFile} />
    )

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["ico\n01"], "clients.csv", { type: "text/csv" })
    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(screen.getByRole("status")).toHaveTextContent("Import is running...")

    rerender(
      <TsTable
        data={data}
        columnDefinitions={columns}
        onImportFile={onImportFile}
        importResult={{ added: 1, updated: 0, rejected: 0, skipped: 0 }}
      />
    )

    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(screen.getByText("Import Results")).toBeInTheDocument()
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

  it("applies defaultSorting on mount", () => {
    render(
      <TsTable
        data={data}
        columnDefinitions={columns}
        defaultSorting={[{ id: "name", desc: true }]}
      />
    )

    // Descending by name → Bob renders before Alice.
    const cells = screen.getAllByText(/Alice|Bob/)
    expect(cells[0]).toHaveTextContent("Bob")
    expect(cells[1]).toHaveTextContent("Alice")
  })

  it("omits excludeFromExport columns from the exported rows", () => {
    const exportColumns: TsTableColumnDef[] = [
      { key: "id", title: "ID", type: "number" },
      { key: "name", title: "Name", type: "text" },
      { key: "secret", title: "Secret", type: "text", excludeFromExport: true },
    ]
    const exportData = [{ id: 1, name: "Alice", secret: "hidden-a" }]

    const sheetSpy = vi.spyOn(XLSX.utils, "json_to_sheet")

    render(<TsTable data={exportData} columnDefinitions={exportColumns} />)
    fireEvent.click(screen.getByRole("button", { name: /Export/i }))

    expect(sheetSpy).toHaveBeenCalledTimes(1)
    const exportedRows = sheetSpy.mock.calls[0][0] as Record<string, unknown>[]
    expect(exportedRows[0]).toMatchObject({ id: 1, name: "Alice" })
    expect(exportedRows[0]).not.toHaveProperty("secret")

    sheetSpy.mockRestore()
  })

  it("sorts text columns case-insensitively", () => {
    const mixedCaseData = [
      { id: 1, name: "BOTA" },
      { id: 2, name: "auto" },
      { id: 3, name: "Čechy" },
    ]
    const sortColumns: TsTableColumnDef[] = [
      { key: "id", title: "ID", type: "number" },
      { key: "name", title: "Name", type: "text", sortable: true, locale: "cs-CZ" },
    ]

    render(
      <TsTable
        data={mixedCaseData}
        columnDefinitions={sortColumns}
        defaultSorting={[{ id: "name", desc: false }]}
      />
    )

    // Ascending Czech locale sort: auto < BOTA < Čechy (case-insensitive: a < b < č)
    const cells = screen.getAllByText(/auto|BOTA|Čechy/)
    expect(cells[0]).toHaveTextContent("auto")
    expect(cells[1]).toHaveTextContent("BOTA")
    expect(cells[2]).toHaveTextContent("Čechy")
  })

  it("sorts uppercase and lowercase variants of the same letter as equal", () => {
    const caseData = [
      { id: 1, name: "B" },
      { id: 2, name: "a" },
      { id: 3, name: "A" },
    ]
    const sortColumns: TsTableColumnDef[] = [
      { key: "id", title: "ID", type: "number" },
      { key: "name", title: "Name", type: "text", sortable: true, locale: "cs-CZ" },
    ]

    render(
      <TsTable
        data={caseData}
        columnDefinitions={sortColumns}
        defaultSorting={[{ id: "name", desc: false }]}
      />
    )

    // Both "a" and "A" sort before "B" — case has no effect on ordering
    const cells = screen.getAllByText(/^[aAB]$/)
    expect(cells[0]).toHaveTextContent(/^[aA]$/)
    expect(cells[1]).toHaveTextContent(/^[aA]$/)
    expect(cells[2]).toHaveTextContent("B")
  })

  it("shows a download-error-log button when importResult.errorLog is set", () => {
    render(
      <TsTable
        data={data}
        columnDefinitions={columns}
        importResult={{
          added: 1,
          updated: 0,
          rejected: 1,
          skipped: 0,
          errorLog: "Row 1: rejected (reason)",
        }}
      />
    )

    expect(screen.getByRole("button", { name: /Download error log/i })).toBeInTheDocument()
  })

  it("renders only a copy button for copyOnly columns and never shows the value", () => {
    const secretColumns: TsTableColumnDef[] = [
      { key: "name", title: "Name", type: "text" },
      { key: "password", title: "Password", type: "text", copyOnly: true },
    ]
    const secretData = [{ name: "Alice", password: "s3cret!" }]

    render(<TsTable data={secretData} columnDefinitions={secretColumns} />)

    // The header still shows, and the visible cell value (name) renders.
    expect(screen.getByText("Password")).toBeInTheDocument()
    expect(screen.getByText("Alice")).toBeInTheDocument()
    // The secret is never written to the DOM…
    expect(screen.queryByText("s3cret!")).not.toBeInTheDocument()
    // …but a copy button is available to copy it.
    expect(screen.getByRole("button", { name: /Copy to clipboard/i })).toBeInTheDocument()
  })

  it("copies the raw value of a copyOnly cell to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    // copyTextToClipboard only uses navigator.clipboard on a secure origin; jsdom defaults to false.
    Object.defineProperty(window, "isSecureContext", { value: true, configurable: true })

    const secretColumns: TsTableColumnDef[] = [
      { key: "name", title: "Name", type: "text" },
      { key: "password", title: "Password", type: "text", copyOnly: true },
    ]
    render(
      <TsTable data={[{ name: "Alice", password: "s3cret!" }]} columnDefinitions={secretColumns} />
    )

    fireEvent.click(screen.getByRole("button", { name: /Copy to clipboard/i }))
    expect(writeText).toHaveBeenCalledWith("s3cret!")
  })

  it("uses renderCell to fully control a cell and passes it value/row/columnKey", () => {
    const renderCell = vi.fn(({ value, row, columnKey }) => (
      <button type="button">
        go:{String(value)}:{String((row as { name: string }).name)}:{columnKey}
      </button>
    ))
    const actionColumns: TsTableColumnDef[] = [
      { key: "name", title: "Name", type: "text" },
      { key: "action", title: "Action", type: "text", renderCell },
    ]

    render(<TsTable data={[{ name: "Alice", action: "run" }]} columnDefinitions={actionColumns} />)

    // The custom node renders instead of the raw value, and receives the full context.
    expect(screen.getByRole("button", { name: "go:run:Alice:action" })).toBeInTheDocument()
    expect(renderCell).toHaveBeenCalledWith({
      value: "run",
      row: { name: "Alice", action: "run" },
      columnKey: "action",
    })
  })

  it("still exports the raw value of a renderCell column unless excluded", () => {
    const sheetSpy = vi.spyOn(XLSX.utils, "json_to_sheet")
    const actionColumns: TsTableColumnDef[] = [
      { key: "name", title: "Name", type: "text" },
      { key: "action", title: "Action", type: "text", renderCell: () => <span>btn</span> },
    ]

    render(<TsTable data={[{ name: "Alice", action: "run" }]} columnDefinitions={actionColumns} />)
    fireEvent.click(screen.getByRole("button", { name: /Export/i }))

    const exportedRows = sheetSpy.mock.calls[0][0] as Record<string, unknown>[]
    // renderCell does not affect export — the raw field is still written.
    expect(exportedRows[0]).toMatchObject({ name: "Alice", action: "run" })
    sheetSpy.mockRestore()
  })
})
