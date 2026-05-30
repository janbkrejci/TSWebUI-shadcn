import { fireEvent, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.3: Tabulkový Dropdown v Relationship Pickeru", () => {
  const options = [
    { id: "1", name: "Alpha", code: "A100" },
    { id: "2", name: "Beta", code: "B200" },
  ]

  it("should render relationship picker with custom columns", () => {
    const layout: TsLayout = { rows: [[{ field: "rel" }]] }
    const fields: Record<string, TsFieldDef> = {
      rel: {
        type: "relationship",
        label: "Entity",
        options,
        columns: [
          { key: "name", title: "Custom Name" },
          { key: "code", title: "Technical Code" },
        ],
      },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const trigger = screen.getByRole("combobox")
    fireEvent.click(trigger)

    // Check if custom titles are in the dialog/table
    expect(screen.getByText("Custom Name")).toBeDefined()
    expect(screen.getByText("Technical Code")).toBeDefined()
    expect(screen.queryByRole("button", { name: /new record/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /import/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /export/i })).toBeNull()
  })

  it("should pass table configuration and modal width to relationship picker dialog", () => {
    const layout: TsLayout = { rows: [[{ field: "rel" }]] }
    const fields: Record<string, TsFieldDef> = {
      rel: {
        type: "relationship",
        label: "Entity",
        options,
        modalMaxWidth: "720px",
        showCreateButton: false,
        showImportButton: false,
        showExportButton: false,
        columns: [
          { key: "name", title: "Visible Name" },
          { key: "code", title: "Hidden Code", visible: false },
        ],
      },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    fireEvent.click(screen.getByRole("combobox"))

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveStyle({ maxWidth: "720px" })
    expect(screen.getByText("Visible Name")).toBeDefined()
    expect(screen.queryByText("Hidden Code")).toBeNull()
    expect(screen.queryByRole("button", { name: /new record/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /import/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /export/i })).toBeNull()
  })

  it("should support dropdown variant", () => {
    const layout: TsLayout = { rows: [[{ field: "rel" }]] }
    const fields: Record<string, TsFieldDef> = {
      rel: {
        type: "relationship",
        label: "Entity",
        options,
        variant: "dropdown",
      },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.getAttribute("aria-haspopup")).toBe("listbox")
  })
})
