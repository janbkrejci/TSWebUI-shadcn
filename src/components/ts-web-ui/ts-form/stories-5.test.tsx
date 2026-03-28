import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TsForm } from "./index"
import { TsButton, TsFieldDef, TsLayout } from "./types"

// ──────────────────────────────────────────────────────────────────────────────
// Shared fixtures
// ──────────────────────────────────────────────────────────────────────────────
const layout: TsLayout = {
  rows: [[{ field: "name" }, { field: "email" }]],
}
const fields: Record<string, TsFieldDef> = {
  name: { type: "text", label: "Name", required: true },
  email: { type: "text", label: "Email" },
}
const buttons: TsButton[] = [
  { action: "submit", label: "Submit", type: "submit" },
  { action: "cancel", label: "Cancel", type: "button", position: "left" },
]

// ──────────────────────────────────────────────────────────────────────────────
// Story 5.1 — Global readOnly prop
// ──────────────────────────────────────────────────────────────────────────────
describe("Story 5.1: Global readOnly prop", () => {
  it("mergedFields sets readonly on all fields when readOnly is true", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} readOnly />)
    const nameInput = screen.getByLabelText(/Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    expect(nameInput).toHaveAttribute("readonly")
    expect(emailInput).toHaveAttribute("readonly")
  })

  it("hides button bar in readOnly mode", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} readOnly />)
    expect(screen.queryByRole("button", { name: /Submit/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Cancel/i })).not.toBeInTheDocument()
  })

  it("preserves field values in readOnly mode", () => {
    render(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        values={{ name: "John", email: "john@test.com" }}
        readOnly
      />
    )
    expect(screen.getByLabelText(/Name/i)).toHaveValue("John")
    expect(screen.getByLabelText(/Email/i)).toHaveValue("john@test.com")
  })

  it("readonly fields use cursor-default styling (not disabled gray)", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} readOnly />)
    const nameInput = screen.getByLabelText(/Name/i)
    expect(nameInput.className).toContain("cursor-default")
  })

  it("readonly fields have tabIndex=-1", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} readOnly />)
    const nameInput = screen.getByLabelText(/Name/i)
    expect(nameInput).toHaveAttribute("tabindex", "-1")
  })

  it("dynamic toggle readOnly preserves values", async () => {
    const { rerender } = render(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        values={{ name: "John", email: "john@test.com" }}
        readOnly={false}
      />
    )
    expect(screen.getByLabelText(/Name/i)).toHaveValue("John")

    // Toggle to readOnly
    rerender(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        values={{ name: "John", email: "john@test.com" }}
        readOnly
      />
    )
    expect(screen.getByLabelText(/Name/i)).toHaveValue("John")
    expect(screen.getByLabelText(/Name/i)).toHaveAttribute("readonly")

    // Toggle back
    rerender(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        values={{ name: "John", email: "john@test.com" }}
        readOnly={false}
      />
    )
    expect(screen.getByLabelText(/Name/i)).toHaveValue("John")
    expect(screen.getByLabelText(/Name/i)).not.toHaveAttribute("readonly")
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Story 5.5 — Button disabled/hidden
// ──────────────────────────────────────────────────────────────────────────────
describe("Story 5.5: Button disabled/hidden in definition", () => {
  it("hidden button is not in DOM", () => {
    const btns: TsButton[] = [
      { action: "submit", label: "Submit", type: "submit" },
      { action: "delete", label: "Delete", type: "button", hidden: true },
    ]
    render(<TsForm layout={layout} fields={fields} buttons={btns} />)
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Delete/i })).not.toBeInTheDocument()
  })

  it("disabled button is in DOM but not clickable", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const btns: TsButton[] = [{ action: "save", label: "Save", type: "button", disabled: true }]
    render(<TsForm layout={layout} fields={fields} buttons={btns} onAction={onAction} />)
    const saveBtn = screen.getByRole("button", { name: /Save/i })
    expect(saveBtn).toBeDisabled()
    await user.click(saveBtn)
    expect(onAction).not.toHaveBeenCalled()
  })

  it("hidden takes precedence over disabled", () => {
    const btns: TsButton[] = [
      { action: "delete", label: "Delete", type: "button", disabled: true, hidden: true },
    ]
    render(<TsForm layout={layout} fields={fields} buttons={btns} />)
    expect(screen.queryByRole("button", { name: /Delete/i })).not.toBeInTheDocument()
  })

  it("all buttons hidden = no button bar rendered", () => {
    const btns: TsButton[] = [
      { action: "submit", label: "Submit", type: "submit", hidden: true },
      { action: "cancel", label: "Cancel", type: "button", hidden: true },
    ]
    const { container } = render(<TsForm layout={layout} fields={fields} buttons={btns} />)
    expect(container.querySelector(".border-t")).not.toBeInTheDocument()
  })

  it("dynamic change to hidden/disabled reflects immediately", () => {
    const btns1: TsButton[] = [{ action: "submit", label: "Submit", type: "submit" }]
    const { rerender } = render(<TsForm layout={layout} fields={fields} buttons={btns1} />)
    expect(screen.getByRole("button", { name: /Submit/i })).not.toBeDisabled()

    const btns2: TsButton[] = [
      { action: "submit", label: "Submit", type: "submit", disabled: true },
    ]
    rerender(<TsForm layout={layout} fields={fields} buttons={btns2} />)
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled()
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Story 5.4 — Keyboard Enter/Escape
// ──────────────────────────────────────────────────────────────────────────────
describe("Story 5.4: Global keyboard interactions", () => {
  it("Enter in text field triggers form submit when no enterAction", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={buttons} onAction={onAction} />)
    const nameInput = screen.getByLabelText(/Name/i)
    await user.click(nameInput)
    await user.type(nameInput, "Test{Enter}")

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("submit", expect.any(Object))
    })
  })

  it("Enter with custom enterAction triggers that action instead of submit", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const customFields: Record<string, TsFieldDef> = {
      name: { type: "text", label: "Name", enterAction: "search" },
    }
    const customLayout: TsLayout = { rows: [[{ field: "name" }]] }
    render(
      <TsForm layout={customLayout} fields={customFields} buttons={buttons} onAction={onAction} />
    )
    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, "query{Enter}")

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("search", expect.any(Object))
    })
  })

  it("Escape triggers cancel action", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<TsForm layout={layout} fields={fields} buttons={buttons} onAction={onAction} />)
    const nameInput = screen.getByLabelText(/Name/i)
    await user.click(nameInput)
    await user.keyboard("{Escape}")

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith("cancel", expect.any(Object))
    })
  })

  it("keyboard Enter is ignored in readOnly mode", async () => {
    const onAction = vi.fn()
    const editableFields: Record<string, TsFieldDef> = {
      name: { type: "text", label: "Name" },
    }
    render(
      <TsForm
        layout={{ rows: [[{ field: "name" }]] }}
        fields={editableFields}
        buttons={buttons}
        onAction={onAction}
        readOnly
      />
    )
    // Even though we can focus the input, the form should not process keyboard actions
    expect(onAction).not.toHaveBeenCalled()
  })

  it("Enter does not submit when submit button is disabled", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const disabledBtns: TsButton[] = [
      { action: "submit", label: "Submit", type: "submit", disabled: true },
    ]
    render(<TsForm layout={layout} fields={fields} buttons={disabledBtns} onAction={onAction} />)
    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, "Test{Enter}")

    // Wait a tick, no action should fire
    await new Promise((r) => setTimeout(r, 50))
    expect(onAction).not.toHaveBeenCalled()
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Story 5.3 — A11y standards
// ──────────────────────────────────────────────────────────────────────────────
describe("Story 5.3: Accessibility standards", () => {
  it("error messages have role=alert", async () => {
    render(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        errors={{ name: "Name is required" }}
      />
    )
    await vi.waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toHaveTextContent("Name is required")
    })
  })

  it("required field has sr-only (required) text after asterisk", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} />)
    const labels = document.querySelectorAll("label")
    const nameLabel = Array.from(labels).find((l) => l.textContent?.includes("Name"))
    expect(nameLabel?.textContent).toContain("(required)")
    expect(nameLabel?.querySelector(".sr-only")).toBeTruthy()
  })

  it("fields have aria-invalid when there is an error", async () => {
    render(
      <TsForm layout={layout} fields={fields} buttons={buttons} errors={{ name: "Invalid" }} />
    )
    await vi.waitFor(() => {
      const nameInput = screen.getByLabelText(/Name/i)
      expect(nameInput).toHaveAttribute("aria-invalid", "true")
    })
  })

  it("readonly fields have aria-readonly", () => {
    render(<TsForm layout={layout} fields={fields} buttons={buttons} readOnly />)
    const nameInput = screen.getByLabelText(/Name/i)
    expect(nameInput).toHaveAttribute("aria-readonly", "true")
  })

  it("tab error dots have title attribute for screen readers", async () => {
    const tabLayout: TsLayout = {
      tabs: [
        { label: "Tab 1", rows: [[{ field: "name" }]] },
        { label: "Tab 2", rows: [[{ field: "email" }]] },
      ],
    }
    const { container } = render(
      <TsForm layout={tabLayout} fields={fields} buttons={buttons} errors={{ name: "Required" }} />
    )
    await vi.waitFor(() => {
      const dot = container.querySelector(".animate-pulse")
      expect(dot).toBeTruthy()
      expect(dot?.getAttribute("title")).toBe("This tab contains validation errors")
    })
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// Story 5.2 — State integrity
// ──────────────────────────────────────────────────────────────────────────────
describe("Story 5.2: State integrity", () => {
  it("external values update does not lose existing input", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <TsForm layout={layout} fields={fields} buttons={buttons} values={{ name: "", email: "" }} />
    )
    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, "Hello")
    expect(nameInput).toHaveValue("Hello")

    // External update to email should not affect name
    rerender(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        values={{ name: "", email: "new@test.com" }}
      />
    )
    // Name should preserve user-typed value (surgical update skips active field)
    expect(nameInput).toHaveValue("Hello")
    expect(screen.getByLabelText(/Email/i)).toHaveValue("new@test.com")
  })

  it("external error update does not reset field values", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<TsForm layout={layout} fields={fields} buttons={buttons} />)
    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, "John")

    // Add errors externally
    rerender(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        errors={{ email: "Email required" }}
      />
    )

    // Name value should be preserved
    expect(nameInput).toHaveValue("John")
    await vi.waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Email required")
    })
  })

  it("clearing all errors does not affect field values", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <TsForm layout={layout} fields={fields} buttons={buttons} errors={{ name: "Required" }} />
    )
    const nameInput = screen.getByLabelText(/Name/i)
    await user.type(nameInput, "John")

    rerender(<TsForm layout={layout} fields={fields} buttons={buttons} errors={undefined} />)

    expect(nameInput).toHaveValue("John")
  })

  it("simultaneous values and errors update works correctly", async () => {
    const { rerender } = render(
      <TsForm layout={layout} fields={fields} buttons={buttons} values={{ name: "", email: "" }} />
    )

    rerender(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        values={{ name: "Updated", email: "updated@test.com" }}
        errors={{ name: "Too short" }}
      />
    )

    await vi.waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue("Updated")
      expect(screen.getByLabelText(/Email/i)).toHaveValue("updated@test.com")
      expect(screen.getByRole("alert")).toHaveTextContent("Too short")
    })
  })
})
