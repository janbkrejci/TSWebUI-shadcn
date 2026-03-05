import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={buttons} onAction={onAction} />)

    await user.type(screen.getByLabelText(/First Name/i), "John")
    await user.type(screen.getByLabelText(/Last Name/i), "Doe")

    await user.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith(
        "submit",
        expect.objectContaining({ firstName: "John", lastName: "Doe" })
      )
    })
  })

  it("calls onFieldChange when a field value changes", async () => {
    const user = userEvent.setup()
    const onFieldChange = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={[]} onFieldChange={onFieldChange} />)

    await user.type(screen.getByLabelText(/First Name/i), "Jane")

    // The event happens for each character typed
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
    const user = userEvent.setup()
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

    await user.click(screen.getByText("Closed"))
    await user.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", expect.objectContaining({ status: "closed" }))
    })
  })

  it("renders and handles ProcessButtonGroup", async () => {
    const user = userEvent.setup()
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

    await user.click(screen.getByText("Step 2"))
    await user.click(screen.getByRole("button", { name: /Submit/i }))

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

  it("filters out nested fields with excludeFromSubmit: true", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const nestedFields: Record<string, TsFieldDef> = {
      "user.name": { type: "text", label: "Name" },
      "user.password": { type: "password", label: "Password", excludeFromSubmit: true },
    }
    const nestedLayout: TsFormLayout = {
      rows: [[{ field: "user.name" }, { field: "user.password" }]],
    }

    render(
      <TsForm layout={nestedLayout} fields={nestedFields} buttons={buttons} onAction={onAction} />
    )

    await user.type(screen.getByLabelText(/Name/i), "Alice")
    await user.type(screen.getByLabelText(/Password/i), "secret123")
    await user.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      const data = onAction.mock.calls[0][1]
      expect(data.user.name).toBe("Alice")
      expect(data.user.password).toBeUndefined()
    })
  })

  it("preserves internal state when unrelated external values change (surgical update)", async () => {
    const user = userEvent.setup()

    // Simulate a parent component managing state
    let currentValues = { firstName: "Initial", lastName: "Initial" }

    const { rerender } = render(
      <TsForm
        layout={layout}
        fields={fields}
        values={currentValues}
        onFieldChange={(field, value) => {
          currentValues = { ...currentValues, [field]: value }
        }}
      />
    )

    const firstNameInput = screen.getByLabelText(/First Name/i) as HTMLInputElement
    const lastNameInput = screen.getByLabelText(/Last Name/i) as HTMLInputElement

    // 1. User starts typing in lastName
    await user.click(lastNameInput)
    await user.type(lastNameInput, "Modified")
    // Note: in a real app, this would trigger onFieldChange and the parent would update currentValues

    // 2. External change to firstName ONLY - BUT parent must provide current state of ALL values
    currentValues.firstName = "External Update"

    rerender(<TsForm layout={layout} fields={fields} values={{ ...currentValues }} />)

    // 3. Both fields should have correct values
    expect(firstNameInput.value).toBe("External Update")
    expect(lastNameInput.value).toBe("InitialModified")
  })

  it("emits correct value for nested fields in onFieldChange", async () => {
    const user = userEvent.setup()
    const onFieldChange = vi.fn()
    const nestedFields: Record<string, TsFieldDef> = {
      "items.0.name": { type: "text", label: "Item Name" },
    }
    const nestedLayout: TsFormLayout = { rows: [[{ field: "items.0.name" }]] }

    render(<TsForm layout={nestedLayout} fields={nestedFields} onFieldChange={onFieldChange} />)

    await user.type(screen.getByLabelText(/Item Name/i), "A")
    expect(onFieldChange).toHaveBeenCalledWith("items.0.name", "A", expect.any(Object))
  })

  it("handles deep error objects in errors prop", async () => {
    const nestedFields: Record<string, TsFieldDef> = {
      "user.name": { type: "text", label: "User Name" },
    }
    const nestedLayout: TsFormLayout = { rows: [[{ field: "user.name" }]] }

    render(
      <TsForm
        layout={nestedLayout}
        fields={nestedFields}
        errors={{ user: { name: "Deep error" } } as unknown as Record<string, string>}
      />
    )

    expect(await screen.findByText(/Deep error/i)).toBeInTheDocument()
  })

  it("maintains deep data structure in onAction when Enter is pressed on a nested field", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const nestedFields: Record<string, TsFieldDef> = {
      "user.name": { type: "text", label: "User Name", enterAction: "submit" },
    }
    const nestedLayout: TsFormLayout = { rows: [[{ field: "user.name" }]] }

    render(
      <TsForm
        layout={nestedLayout}
        fields={nestedFields}
        onAction={onAction}
        buttons={[{ action: "submit", label: "Submit", type: "submit" }]}
      />
    )

    const input = screen.getByLabelText(/User Name/i)
    await user.type(input, "Alice{Enter}")

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", {
        user: { name: "Alice" },
      })
      // Ensure NO flat key "user.name" was created
      const data = onAction.mock.calls[0][1]
      expect(data["user.name"]).toBeUndefined()
    })
  })

  it("synchronizes nested errors without clearing unrelated sibling errors", async () => {
    const siblingFields: Record<string, TsFieldDef> = {
      "user.name": { type: "text", label: "Name" },
      "user.email": { type: "text", label: "Email" },
    }
    const siblingLayout: TsFormLayout = {
      rows: [[{ field: "user.name" }, { field: "user.email" }]],
    }

    const { rerender } = render(
      <TsForm
        layout={siblingLayout}
        fields={siblingFields}
        errors={{ "user.name": "Error 1", "user.email": "Error 2" }}
      />
    )

    expect(await screen.findByText(/Error 1/i)).toBeInTheDocument()
    expect(await screen.findByText(/Error 2/i)).toBeInTheDocument()

    // Clear ONLY Error 1
    rerender(
      <TsForm layout={siblingLayout} fields={siblingFields} errors={{ "user.email": "Error 2" }} />
    )

    await vi.waitFor(() => {
      expect(screen.queryByText(/Error 1/i)).not.toBeInTheDocument()
      expect(screen.getByText(/Error 2/i)).toBeInTheDocument()
    })
  })

  it("correctly handles multiple nested excludeFromSubmit in the same array", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const arrayFields: Record<string, TsFieldDef> = {
      "items.0": { type: "text", label: "Item 0", excludeFromSubmit: true },
      "items.1": { type: "text", label: "Item 1", excludeFromSubmit: true },
      "items.2": { type: "text", label: "Item 2" },
    }
    const arrayLayout: TsFormLayout = {
      rows: [[{ field: "items.0" }, { field: "items.1" }, { field: "items.2" }]],
    }

    render(
      <TsForm
        layout={arrayLayout}
        fields={arrayFields}
        buttons={buttons}
        onAction={onAction}
        values={{ items: ["A", "B", "C"] }}
      />
    )

    await user.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      const data = onAction.mock.calls[0][1]
      // Items 0 and 1 should be gone, Item 2 (originally "C") should remain.
      // Because we delete from end to start (index 1 then 0), the result should be just ["C"]
      expect(data.items).toHaveLength(1)
      expect(data.items[0]).toBe("C")
    })
  })
})
