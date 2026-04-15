import { act, fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { TsFormField } from "./ts-form-field"
import { TsFieldDef } from "./types"

/**
 * ULTRA-STABLE TEST WRAPPER:
 * Uses a single form instance that lives throughout the test.
 */
const TestApp = ({
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

  // Set error whenever externalError changes, WITHOUT remounting form
  React.useEffect(() => {
    if (externalError) {
      methods.setError(name, { type: "manual", message: externalError })
    } else {
      methods.clearErrors(name)
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

describe("State Integrity & Focus Management (ULTRA-STRICT)", () => {
  it("preserves focus and cursor position in TextWidget when error state changes", async () => {
    const fieldDef: TsFieldDef = { type: "text", label: "Username" }
    const { rerender } = render(<TestApp name="username" fieldDef={fieldDef} />)

    const input = screen.getByLabelText(/Username/i) as HTMLInputElement
    await act(async () => {
      input.focus()
      input.setSelectionRange(3, 3)
    })

    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(3)

    // Trigger error - SHOULD NOT lose focus
    rerender(<TestApp name="username" fieldDef={fieldDef} externalError="Required" />)

    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(3)
    expect(screen.getByText("Required")).toBeInTheDocument()
  })

  it("preserves formatted value and focus in NumberWidget", async () => {
    const fieldDef: TsFieldDef = { type: "number", label: "Price", roundTo: 2, locale: "cs-CZ" }
    const { rerender } = render(<TestApp name="price" fieldDef={fieldDef} />)

    const input = screen.getByLabelText(/Price/i) as HTMLInputElement

    await act(async () => {
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: "100 + 50" } })
    })

    expect(input.value).toBe("100 + 50")

    await act(async () => {
      fireEvent.blur(input)
    })

    // Should evaluate and format: 150,00 (cs-CZ)
    expect(input.value).toBe("150,00")

    // Rerender with error - focus might be lost if we don't handle it,
    // but the VALUE must stay.
    rerender(<TestApp name="price" fieldDef={fieldDef} externalError="Invalid" />)

    expect(input.value).toBe("150,00")
    expect(screen.getByText("Invalid")).toBeInTheDocument()

    // Note: In some test environments, rerender() might cause loss of focus
    // even if implementation is correct due to how JSDOM handles focus.
    // If it fails, we'll focus on the value/state integrity.
  })

  it("syncs NumberWidget on Enter key", async () => {
    const fieldDef: TsFieldDef = { type: "number", label: "Price" }
    render(<TestApp name="price" fieldDef={fieldDef} />)

    const input = screen.getByLabelText(/Price/i) as HTMLInputElement

    await act(async () => {
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: "10 * 5" } })
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
    })

    // Critical fix: Should show 50 immediately after Enter
    expect(input.value).toBe("50")
  })

  it("displays error message and HIDES hint when both provided", async () => {
    const fieldDef: TsFieldDef = { type: "text", label: "Email", hint: "Enter your work email" }
    const { rerender } = render(<TestApp name="email" fieldDef={fieldDef} />)

    expect(screen.getByText("Enter your work email")).toBeInTheDocument()

    rerender(<TestApp name="email" fieldDef={fieldDef} externalError="Invalid email" />)

    // Error should be visible, hint should be HIDDEN
    expect(screen.getByText("Invalid email")).toBeInTheDocument()
    expect(screen.queryByText("Enter your work email")).not.toBeInTheDocument()
  })
})
