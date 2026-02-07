import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsFormLayout } from "./types"

describe("TsForm", () => {
  const layout: TsFormLayout = {
    rows: [[{ field: "firstName" }, { field: "lastName" }]],
  }

  const fields: Record<string, TsFieldDef> = {
    firstName: { type: "text", label: "First Name", required: true },
    lastName: { type: "text", label: "Last Name" },
  }

  const buttons = [{ action: "submit", label: "Submit", type: "submit" as const }]

  it("renders all fields", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} />)

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument()
  })

  it("calls onSubmit when form is valid", async () => {
    const onSubmit = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={buttons} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } })

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    // Form submission is async in react-hook-form
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "John", lastName: "Doe" }),
        "submit"
      )
    })
  })

  it("shows validation error for required field", async () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} values={{ firstName: "" }} />)

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    // The actual message is "Toto pole je povinné" in our schema
    expect(await screen.findByText(/povinné/i)).toBeInTheDocument()
  })
})
