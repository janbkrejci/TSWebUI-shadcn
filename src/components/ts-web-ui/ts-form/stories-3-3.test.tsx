import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FormProvider, useForm } from "react-hook-form"

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
