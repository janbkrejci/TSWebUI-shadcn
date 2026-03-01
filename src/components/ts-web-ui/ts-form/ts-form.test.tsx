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

  it("calls onAction when form is submitted", async () => {
    const onAction = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={buttons} onAction={onAction} />)

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } })

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    // Form submission is async in react-hook-form
    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith(
        "submit",
        expect.objectContaining({ firstName: "John", lastName: "Doe" })
      )
    })
  })

  it("calls onFieldChange when a field value changes", async () => {
    const onFieldChange = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={[]} onFieldChange={onFieldChange} />)

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Jane" } })

    expect(onFieldChange).toHaveBeenCalledWith("firstName", "Jane", expect.any(Object))
  })

  it("shows external validation errors via props", async () => {
    render(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        errors={{ firstName: "External error message" }}
      />
    )

    expect(await screen.findByText(/External error message/i)).toBeInTheDocument()
  })

  it("blocks submission when required fields are empty", async () => {
    const onAction = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={buttons} onAction={onAction} />)

    // Attempt to submit without filling firstName (which is required)
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    // In a correct implementation, onAction should NOT be called
    // because react-hook-form should catch the validation error
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(onAction).not.toHaveBeenCalled()
  })

  it("shows nested validation errors (e.g., items.0.name)", async () => {
    const nestedFields: Record<string, TsFieldDef> = {
      "items.0.name": { type: "text", label: "Item Name" },
    }
    const nestedLayout: TsFormLayout = { rows: [[{ field: "items.0.name" }]] }

    render(
      <TsForm
        layout={nestedLayout}
        fields={nestedFields}
        buttons={[]}
        errors={{ "items.0.name": "Nested error message" }}
      />
    )

    expect(await screen.findByText(/Nested error message/i)).toBeInTheDocument()
  })

  it("renders and handles button-group", async () => {
    const onAction = vi.fn()
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
        onAction={onAction}
        values={{ status: "open" }}
      />
    )

    expect(screen.getByText("Open")).toBeInTheDocument()
    expect(screen.getByText("Closed")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Closed"))
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", expect.objectContaining({ status: "closed" }))
    })
  })

  it("renders and handles ProcessButtonGroup", async () => {
    const onAction = vi.fn()
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
        onAction={onAction}
        values={{ step: "1" }}
      />
    )

    expect(screen.getByText("Step 1")).toBeInTheDocument()
    expect(screen.getByText("Step 2")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Step 2"))
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", expect.objectContaining({ step: "2" }))
    })
  })

  it("renders markdown widget", () => {
    const mdFields: Record<string, TsFieldDef> = {
      content: {
        type: "markdown",
        value: "### Hello\\n[Link](https://google.com)\\n```js\\nconst a = 1;\\n```",
      },
    }
    const mdLayout: TsFormLayout = { rows: [[{ field: "content" }]] }

    render(<TsForm layout={mdLayout} fields={mdFields} buttons={[]} />)

    expect(screen.getByText(/Hello/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Link/i })).toHaveAttribute("target", "_blank")
  })
})
