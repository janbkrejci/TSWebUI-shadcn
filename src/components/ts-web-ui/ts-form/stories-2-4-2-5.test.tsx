import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

describe("Story 2-4: Programové ovládání activeTab", () => {
  const fields: Record<string, TsFieldDef> = {
    field1: { type: "text", label: "Field 1" },
    field2: { type: "text", label: "Field 2" },
  }

  const layout: TsLayout = {
    tabs: [
      { label: "Tab 1", rows: [[{ field: "field1" }]] },
      { label: "Tab 2", rows: [[{ field: "field2" }]] },
    ],
  }

  it("switches tabs in uncontrolled mode (regression fix)", async () => {
    const user = userEvent.setup()
    render(<TsForm layout={layout} fields={fields} />)

    // Initially Tab 1 is active
    expect(screen.getByRole("tab", { name: /Tab 1/i })).toHaveAttribute("data-state", "active")
    expect(screen.getByLabelText(/Field 1/i)).toBeVisible()

    // Click Tab 2
    await user.click(screen.getByRole("tab", { name: /Tab 2/i }))

    // Now Tab 2 should be active
    expect(screen.getByRole("tab", { name: /Tab 2/i })).toHaveAttribute("data-state", "active")
    expect(screen.getByLabelText(/Field 2/i)).toBeVisible()
  })

  it("switches tabs programmatically via activeTab prop (index)", () => {
    const { rerender } = render(<TsForm layout={layout} fields={fields} activeTab={0} />)

    expect(screen.getByRole("tab", { name: /Tab 1/i })).toHaveAttribute("data-state", "active")

    // Change to index 1
    rerender(<TsForm layout={layout} fields={fields} activeTab={1} />)
    expect(screen.getByRole("tab", { name: /Tab 2/i })).toHaveAttribute("data-state", "active")
  })

  it("switches tabs programmatically via activeTab prop (label)", () => {
    const { rerender } = render(<TsForm layout={layout} fields={fields} activeTab="Tab 1" />)

    expect(screen.getByRole("tab", { name: /Tab 1/i })).toHaveAttribute("data-state", "active")

    // Change to "Tab 2"
    rerender(<TsForm layout={layout} fields={fields} activeTab="Tab 2" />)
    expect(screen.getByRole("tab", { name: /Tab 2/i })).toHaveAttribute("data-state", "active")
  })

  it("calls onTabChange when tab is clicked", async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    render(<TsForm layout={layout} fields={fields} onTabChange={onTabChange} />)

    await user.click(screen.getByRole("tab", { name: /Tab 2/i }))
    expect(onTabChange).toHaveBeenCalledWith("Tab 2")
  })

  it("calls onTabChange with index when activeTab prop was originally an index", async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    render(<TsForm layout={layout} fields={fields} activeTab={0} onTabChange={onTabChange} />)

    await user.click(screen.getByRole("tab", { name: /Tab 2/i }))
    expect(onTabChange).toHaveBeenCalledWith(1)
  })

  it("handles duplicate tab labels correctly using internal indices", async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    const duplicateLayout: TsLayout = {
      tabs: [
        { label: "Settings", rows: [[{ field: "field1" }]] },
        { label: "Settings", rows: [[{ field: "field2" }]] },
      ],
    }
    // Use uncontrolled mode (no activeTab prop) to test internal switching
    render(<TsForm layout={duplicateLayout} fields={fields} onTabChange={onTabChange} />)

    // Click the SECOND "Settings" tab
    const tabs = screen.getAllByRole("tab", { name: /Settings/i })
    await user.click(tabs[1])

    expect(onTabChange).toHaveBeenCalledWith("Settings") // In uncontrolled mode it returns label
    expect(tabs[1]).toHaveAttribute("data-state", "active")
    expect(tabs[0]).toHaveAttribute("data-state", "inactive")
  })

  it("handles duplicate tab labels in controlled mode with indices", async () => {
    const user = userEvent.setup()
    const onTabChange = vi.fn()
    const duplicateLayout: TsLayout = {
      tabs: [
        { label: "Settings", rows: [[{ field: "field1" }]] },
        { label: "Settings", rows: [[{ field: "field2" }]] },
      ],
    }

    const TestWrapper = () => {
      const [active, setActive] = React.useState<number>(0)
      return (
        <TsForm
          layout={duplicateLayout}
          fields={fields}
          activeTab={active}
          onTabChange={(t) => {
            onTabChange(t)
            setActive(t as number)
          }}
        />
      )
    }

    render(<TestWrapper />)

    // Click the SECOND "Settings" tab
    const tabs = screen.getAllByRole("tab", { name: /Settings/i })
    await user.click(tabs[1])

    expect(onTabChange).toHaveBeenCalledWith(1)
    expect(tabs[1]).toHaveAttribute("data-state", "active")
    expect(tabs[0]).toHaveAttribute("data-state", "inactive")
  })
})

describe("Story 2-5: Implementace mřížkového zarovnání", () => {
  const fields: Record<string, TsFieldDef> = {
    field1: { type: "text", label: "Label 1" },
    field2: { type: "text", label: "A much longer label that might wrap" },
    field3: { type: "checkbox", label: "Checkbox Label" },
  }

  const layout: TsLayout = {
    rows: [[{ field: "field1" }, { field: "field2" }, { field: "field3" }]],
  }

  it("renders labels and placeholders with min-h-14", () => {
    const { container } = render(<TsForm layout={layout} fields={fields} />)

    // Find label containers and placeholders
    const labelContainers = container.querySelectorAll(".min-h-14")
    // 2 text labels + 1 checkbox placeholder = 3
    expect(labelContainers.length).toBe(3)
  })

  it("aligns checkbox widget with min-h-9 height", () => {
    const { container } = render(<TsForm layout={layout} fields={fields} />)

    // Checkbox widget itself should have min-h-9 to align its control with neighbors
    const checkboxWidget = container.querySelector(".flex.items-center.min-h-9")
    expect(checkboxWidget).toBeInTheDocument()
  })

  it("keeps aligned row items pinned to the top instead of stretching vertically", () => {
    const alignedFields: Record<string, TsFieldDef> = {
      short: { type: "text", label: "Short" },
      tall: { type: "textarea", label: "Tall" },
    }
    const alignedLayout: TsLayout = {
      rows: [[{ field: "short", align: "center" }, { field: "tall" }]],
    }

    const { container } = render(<TsForm layout={alignedLayout} fields={alignedFields} />)

    const shortFieldWrapper = container.querySelector('[data-field="short"]')?.closest(".min-w-0")

    expect(shortFieldWrapper).toHaveClass("flex", "w-full", "items-start")
  })

  it("torture test: layout stability with long labels and errors", () => {
    const tortureFields: Record<string, TsFieldDef> = {
      f1: { type: "text", label: "Short" },
      f2: {
        type: "text",
        label:
          "Very very long label that definitely wraps to multiple lines and should stay in the same slot",
      },
      f3: { type: "text", label: "" }, // No label
      f4: {
        type: "text",
        label: "With Error",
        error: "This is a very long error message that also wraps to two lines",
      },
    }
    const tortureLayout: TsLayout = {
      rows: [[{ field: "f1" }, { field: "f2" }, { field: "f3" }, { field: "f4" }]],
    }

    const { container } = render(<TsForm layout={tortureLayout} fields={tortureFields} />)

    // All fields should have min-h-14 label slot
    const labels = container.querySelectorAll(".min-h-14")
    expect(labels.length).toBe(4)

    // All fields should have min-h-8 error slot
    const errorSlots = container.querySelectorAll(".min-h-8")
    expect(errorSlots.length).toBe(4)

    // Error message should be visible in one of them
    expect(screen.getByText(/This is a very long error message/i)).toBeInTheDocument()
  })
})
