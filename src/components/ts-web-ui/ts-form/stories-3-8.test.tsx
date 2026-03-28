import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FormProvider, useForm } from "react-hook-form"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.8: Řízení datového exportu pomocí excludeFromSubmit", () => {
  it("should filter out fields marked with excludeFromSubmit in onAction", async () => {
    const layout: TsLayout = {
      rows: [[{ field: "included" }], [{ field: "excluded" }]],
    }
    const fields: Record<string, TsFieldDef> = {
      included: { type: "text", label: "Included" },
      excluded: { type: "text", label: "Excluded", excludeFromSubmit: true },
    }
    const initialValues = { included: "keep", excluded: "remove" }
    const onAction = vi.fn()

    render(
      <TestWrapper>
        <TsForm
          layout={layout}
          fields={fields}
          values={initialValues}
          onAction={onAction}
          buttons={[{ action: "submit", label: "Submit", type: "submit" }]}
        />
      </TestWrapper>
    )

    fireEvent.click(screen.getByText("Submit"))

    await waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", { included: "keep" })
    })
    expect(onAction.mock.calls[0][1]).not.toHaveProperty("excluded")
  })

  it("should filter out nested fields marked with excludeFromSubmit", async () => {
    const layout: TsLayout = {
      rows: [[{ field: "user.name" }], [{ field: "user.password" }]],
    }
    const fields: Record<string, TsFieldDef> = {
      "user.name": { type: "text", label: "Name" },
      "user.password": { type: "password", label: "Password", excludeFromSubmit: true },
    }
    const initialValues = { user: { name: "John", password: "123" } }
    const onAction = vi.fn()

    render(
      <TestWrapper>
        <TsForm
          layout={layout}
          fields={fields}
          values={initialValues}
          onAction={onAction}
          buttons={[{ action: "submit", label: "Submit", type: "submit" }]}
        />
      </TestWrapper>
    )

    fireEvent.click(screen.getByText("Submit"))

    await waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", { user: { name: "John" } })
    })
  })

  it("should filter out fields from onFieldChange", async () => {
    const layout: TsLayout = { rows: [[{ field: "excluded" }]] }
    const fields: Record<string, TsFieldDef> = {
      excluded: { type: "text", label: "Excluded", excludeFromSubmit: true },
      other: { type: "text", label: "Other" },
    }
    const onFieldChange = vi.fn()

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} onFieldChange={onFieldChange} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Excluded")
    fireEvent.change(input, { target: { value: "secret" } })
    // onFieldChange fires on focusout for text fields
    fireEvent.focusOut(input)

    // onFieldChange(fieldName, value, allFilteredData)
    await waitFor(() => {
      expect(onFieldChange).toHaveBeenCalled()
    })
    const lastCall = onFieldChange.mock.calls[onFieldChange.mock.calls.length - 1]
    expect(lastCall[0]).toBe("excluded")
    expect(lastCall[1]).toBe("secret")
    expect(lastCall[2]).not.toHaveProperty("excluded")
  })
})
