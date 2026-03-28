import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import * as React from "react"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

describe("TsForm - Regression & Robustness", () => {
  it("should successfully submit even with File objects (deepClone support)", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const file = new File(["hello"], "hello.png", { type: "image/png" })

    const fields: Record<string, TsFieldDef> = {
      avatar: { type: "file", label: "Avatar" },
    }
    const layout: TsLayout = { rows: [[{ field: "avatar" }]] }
    const buttons = [{ action: "submit", label: "Submit", type: "submit" as const }]

    render(
      <TsForm
        layout={layout}
        fields={fields}
        buttons={buttons}
        onAction={onAction}
        values={{ avatar: file }}
      />
    )

    await user.click(screen.getByRole("button", { name: /Submit/i }))

    await vi.waitFor(() => {
      expect(onAction).toHaveBeenCalledWith(
        "submit",
        expect.objectContaining({
          avatar: expect.any(File),
        })
      )
    })

    expect(onAction.mock.calls[0][1].avatar.name).toBe("hello.png")
  })

  it("should maintain focus during external values update using data-field attribute", async () => {
    const user = userEvent.setup()
    const fields: Record<string, TsFieldDef> = {
      name: { type: "text", label: "Name" },
      other: { type: "text", label: "Other" },
    }
    const layout: TsLayout = { rows: [[{ field: "name" }, { field: "other" }]] }

    const TestWrapper = () => {
      const [values, setValues] = React.useState({ name: "", other: "" })

      // Simulate a background update to "other" after a short delay, independent of user input
      React.useEffect(() => {
        const timer = setTimeout(() => {
          setValues((prev) => ({ ...prev, other: "Updated" }))
        }, 30)
        return () => clearTimeout(timer)
      }, [])

      return (
        <div>
          <TsForm layout={layout} fields={fields} values={values} />
        </div>
      )
    }

    render(<TestWrapper />)

    const nameInput = screen.getByLabelText(/Name/i)
    await user.click(nameInput)
    await user.type(nameInput, "Ali")

    // Flush background update scheduled by setTimeout in an act() scope.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    // Wait for the background update to occur
    await vi.waitFor(() => {
      expect((screen.getByLabelText(/Other/i) as HTMLInputElement).value).toBe("Updated")
    })

    // Focus should remain on name input and typing should continue
    expect(document.activeElement).toBe(nameInput)
    await user.type(nameInput, "ce")

    expect((nameInput as HTMLInputElement).value).toBe("Alice")
  })
})
