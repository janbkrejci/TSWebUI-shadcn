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

    // The actual message is "This field is required" in our schema
    expect(await screen.findByText(/This field is required/i)).toBeInTheDocument()
  })

  it("renders and handles button-group", async () => {
    const onSubmit = vi.fn()
    const bgFields: Record<string, TsFieldDef> = {
      status: {
        type: "button-group",
        label: "Status",
        options: ["open/true/default/Open", "closed/true/secondary/Closed"],
      },
    }
    const bgLayout: TsFormLayout = { rows: [[{ field: "status" }]] }

    render(
      <TsForm
        layout={bgLayout}
        fields={bgFields}
        buttons={buttons}
        onSubmit={onSubmit}
        values={{ status: "open" }}
      />
    )

    expect(screen.getByText("Open")).toBeInTheDocument()
    expect(screen.getByText("Closed")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Closed"))
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ status: "closed" }), "submit")
    })
  })

  it("renders and handles ProcessButtonGroup", async () => {
    const onSubmit = vi.fn()
    const procFields: Record<string, TsFieldDef> = {
      step: {
        type: "button-group",
        variant: "process",
        label: "Step",
        options: ["1/true/primary/Step 1", "2/true/success/Step 2"],
      },
    }
    const procLayout: TsFormLayout = { rows: [[{ field: "step" }]] }

    render(
      <TsForm
        layout={procLayout}
        fields={procFields}
        buttons={buttons}
        onSubmit={onSubmit}
        values={{ step: "1" }}
      />
    )

    expect(screen.getByText("Step 1")).toBeInTheDocument()
    expect(screen.getByText("Step 2")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Step 2"))
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ step: "2" }), "submit")
    })
  })
})
