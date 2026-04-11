import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TsForm } from "./index"
import { TsErrors, TsFieldDef, TsLayout } from "./types"

describe("TsForm", () => {
  const layout: TsLayout = {
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
    // onFieldChange fires on blur for text fields
    await user.tab()

    await vi.waitFor(() => {
      expect(onFieldChange).toHaveBeenCalledWith("firstName", "Jane", expect.any(Object))
    })
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
    const nestedLayout: TsLayout = { rows: [[{ field: "items.0.name" }]] }

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
    const bgLayout: TsLayout = { rows: [[{ field: "status" }]] }

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
    const procLayout: TsLayout = { rows: [[{ field: "step" }]] }

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
    const mdLayout: TsLayout = { rows: [[{ field: "content" }]] }

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
    const nestedLayout: TsLayout = {
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
    const nestedLayout: TsLayout = { rows: [[{ field: "items.0.name" }]] }

    render(<TsForm layout={nestedLayout} fields={nestedFields} onFieldChange={onFieldChange} />)

    await user.type(screen.getByLabelText(/Item Name/i), "A")
    // onFieldChange fires on blur for text fields
    await user.tab()

    await vi.waitFor(() => {
      expect(onFieldChange).toHaveBeenCalledWith("items.0.name", "A", expect.any(Object))
    })
  })

  it("handles deep error objects in errors prop", async () => {
    const nestedFields: Record<string, TsFieldDef> = {
      "user.name": { type: "text", label: "User Name" },
    }
    const nestedLayout: TsLayout = { rows: [[{ field: "user.name" }]] }

    render(
      <TsForm
        layout={nestedLayout}
        fields={nestedFields}
        errors={{ user: { name: "Deep error" } } as TsErrors}
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
    const nestedLayout: TsLayout = { rows: [[{ field: "user.name" }]] }

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
    const siblingLayout: TsLayout = {
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
    const arrayLayout: TsLayout = {
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

describe("TsForm Tabs and Layout", () => {
  const fields: Record<string, TsFieldDef> = {
    firstName: { type: "text", label: "First Name", required: true },
    lastName: { type: "text", label: "Last Name", required: true },
  }

  const tabLayout: TsLayout = {
    tabs: [
      { label: "Tab 1", rows: [[{ field: "firstName" }]] },
      { label: "Tab 2", rows: [[{ field: "lastName" }]] },
    ],
  }

  it("shows error dot on Tab 2 when lastName has error", async () => {
    const errors: TsErrors = { lastName: "Required field" }
    render(<TsForm layout={tabLayout} fields={fields} buttons={[]} errors={errors} />)

    // Tab 1 should be active by default, Tab 2 should have error dot
    const tab2 = screen.getByRole("tab", { name: /Tab 2/i })
    expect(tab2).toBeInTheDocument()
    expect(tab2).toHaveAttribute("aria-invalid", "true")

    // The error dot is a span with bg-destructive class
    const errorDot = tab2.querySelector(".bg-destructive")
    expect(errorDot).toBeInTheDocument()
    expect(errorDot).toHaveAttribute("aria-hidden", "true")
    expect(errorDot).toHaveClass("animate-pulse")
  })

  it("applies destructive styling to active Tab when it has an error", async () => {
    const errors: TsErrors = { firstName: "Required field" }
    render(<TsForm layout={tabLayout} fields={fields} buttons={[]} errors={errors} />)

    // Tab 1 is active and has error
    const tab1 = screen.getByRole("tab", { name: /Tab 1/i })
    expect(tab1).toHaveAttribute("data-state", "active")
    expect(tab1).toHaveClass("data-[state=active]:bg-destructive/15")
    expect(tab1).toHaveClass("data-[state=active]:text-destructive")
  })

  it("updates tab error indicators in real-time as validation changes", async () => {
    const { rerender } = render(<TsForm layout={tabLayout} fields={fields} buttons={[]} />)

    // Initially no errors
    expect(
      screen.queryByRole("tab", { name: /Tab 1/i })?.querySelector(".bg-destructive")
    ).not.toBeInTheDocument()

    // Simulate validation error after interaction (by rerendering with errors)
    rerender(
      <TsForm layout={tabLayout} fields={fields} buttons={[]} errors={{ firstName: "Error" }} />
    )

    expect(
      screen.getByRole("tab", { name: /Tab 1/i }).querySelector(".bg-destructive")
    ).toBeInTheDocument()
  })

  it("handles large number of tabs and fields without crash", () => {
    const manyTabsLayout: TsLayout = {
      tabs: Array.from({ length: 50 }, (_, i) => ({
        label: `Tab ${i}`,
        rows: [[{ field: `field${i}` }]],
      })),
    }

    const manyFields: Record<string, TsFieldDef> = {}
    Array.from({ length: 50 }, (_, i) => {
      manyFields[`field${i}`] = { type: "text", label: `Field ${i}` }
    })

    const startTime = performance.now()
    render(<TsForm layout={manyTabsLayout} fields={manyFields} buttons={[]} />)
    const endTime = performance.now()

    expect(screen.getByText("Tab 0")).toBeInTheDocument()
    // Should render within a reasonable time (e.g., < 1000ms for initial render of 50 tabs)
    expect(endTime - startTime).toBeLessThan(1000)
  })
})
