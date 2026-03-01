import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { TsFormField } from "./ts-form-field"
import { TsFieldDef } from "./types"

const TestWrapper = ({
  name,
  fieldDef,
  externalError,
}: {
  name: string
  fieldDef: TsFieldDef
  externalError?: string
}) => {
  const methods = useForm({
    defaultValues: { [name]: "initial value" },
  })

  React.useEffect(() => {
    if (externalError) {
      methods.setError(name, { type: "manual", message: externalError })
    }
  }, [externalError, name, methods])

  return (
    <FormProvider {...methods}>
      <form>
        <TsFormField name={name} fieldDef={fieldDef} />
      </form>
    </FormProvider>
  )
}

describe("State Integrity & Focus Management", () => {
  it("preserves focus and cursor position when error state changes", async () => {
    const fieldDef: TsFieldDef = { type: "text", label: "Username" }

    const { rerender } = render(<TestWrapper name="username" fieldDef={fieldDef} />)

    const input = screen.getByLabelText(/Username/i) as HTMLInputElement
    input.focus()
    // Set cursor position manually
    input.setSelectionRange(3, 3)

    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(3)

    // Simulate async error arrival
    rerender(<TestWrapper name="username" fieldDef={fieldDef} externalError="Field is required" />)

    // Verify focus is still there and cursor hasn't jumped
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(3)
    expect(screen.getByText("Field is required")).toBeInTheDocument()

    // Check if red border is applied
    expect(input.className).toContain("border-destructive")
  })

  it("preserves formatted value in NumberWidget when error state changes", async () => {
    const fieldDef: TsFieldDef = { type: "number", label: "Price", roundTo: 2, locale: "cs-CZ" }

    const { rerender } = render(<TestWrapper name="price" fieldDef={fieldDef} />)

    const input = screen.getByLabelText(/Price/i) as HTMLInputElement

    // Simulate user typing a math expression
    await act(async () => {
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: "100 + 50" } })
    })

    expect(input.value).toBe("100 + 50")

    // On blur it should format
    await act(async () => {
      fireEvent.blur(input)
    })

    // We expect formatted value "150,00"
    expect(input.value).toBe("150,00")

    // Simulate async error arrival
    rerender(<TestWrapper name="price" fieldDef={fieldDef} externalError="Invalid price" />)

    // Verify value is preserved
    expect(input.value).toBe("150,00")
    expect(screen.getByText("Invalid price")).toBeInTheDocument()
    expect(input.className).toContain("border-destructive")
  })
})
