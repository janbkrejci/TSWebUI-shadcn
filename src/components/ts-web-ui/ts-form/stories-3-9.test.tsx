import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it, vi } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

vi.mock("../ts-table", () => ({
  TsTable: ({
    data,
    onDataChange,
  }: {
    data: Record<string, unknown>[]
    onDataChange?: (rows: Record<string, unknown>[]) => void
  }) => (
    <div>
      <div>rows:{data.length}</div>
      <button type="button" onClick={() => onDataChange?.([{ id: "3", name: "Item 3" }])}>
        Emit data change
      </button>
    </div>
  ),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.9: Refaktoring a modularizace Table widgetu", () => {
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
  ]

  it("should render table widget with data", () => {
    const layout: TsLayout = { rows: [[{ field: "items" }]] }
    const fields: Record<string, TsFieldDef> = {
      items: { type: "table", label: "Items", columns },
    }
    const initialValues = {
      items: [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ],
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} values={initialValues} />
      </TestWrapper>
    )

    expect(screen.getByText("rows:2")).toBeDefined()
  })

  it("should propagate data changes from table", async () => {
    const layout: TsLayout = { rows: [[{ field: "items" }]] }
    const fields: Record<string, TsFieldDef> = {
      items: { type: "table", label: "Items", columns },
    }
    const onFieldChange = vi.fn()

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} onFieldChange={onFieldChange} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByText("Emit data change"))

    await waitFor(() => {
      expect(onFieldChange).toHaveBeenCalled()
    })

    const [fieldName, value, allData] =
      onFieldChange.mock.calls[onFieldChange.mock.calls.length - 1]
    expect(fieldName).toBe("items")
    expect(value).toEqual([{ id: "3", name: "Item 3" }])
    expect(allData).toEqual({ items: [{ id: "3", name: "Item 3" }] })
  })
})
