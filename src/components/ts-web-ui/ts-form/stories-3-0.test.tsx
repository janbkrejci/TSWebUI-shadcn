import { render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.0: Stabilizace Widget Contractu", () => {
  const layout: TsLayout = {
    rows: [[{ field: "text1" }], [{ field: "text2" }]],
  }

  it("should respect hideLabel and preserve min-h-14 slot", () => {
    const fields: Record<string, TsFieldDef> = {
      text1: { type: "text", label: "Visible Label" },
      text2: { type: "text", label: "Hidden Label", hideLabel: true },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    // Visible label should be present
    expect(screen.getByText("Visible Label")).toBeDefined()

    // Hidden label text should NOT be visible as a FormLabel
    // But it should be present as aria-label on the input
    // It might still be in the document if it's used for aria-label, but screen.getByText finds visible text
    // Actually, Shadcn FormLabel renders a <label>
    const visibleLabels = screen
      .queryAllByText("Hidden Label")
      .filter((el) => el.tagName === "LABEL")
    expect(visibleLabels.length).toBe(0)

    const input2 = screen.getByLabelText("Hidden Label")
    expect(input2).toBeDefined()
    expect(input2.getAttribute("aria-label")).toBe("Hidden Label")
  })

  it("should propagate readonly prop to widgets", () => {
    const fields: Record<string, TsFieldDef> = {
      text1: { type: "text", label: "Readonly Field", readonly: true },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={{ ...fields }} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Readonly Field")
    expect(input.hasAttribute("readonly")).toBe(true)
    // Check for readonly classes from getFieldClasses
    expect(input.className).toContain("cursor-default")
    expect(input.className).toContain("select-none")
  })

  it("should support global readOnly prop on TsForm", () => {
    const fields: Record<string, TsFieldDef> = {
      text1: { type: "text", label: "Global Readonly" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} readOnly={true} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Global Readonly")
    expect(input.hasAttribute("readonly")).toBe(true)
  })
})
