import { render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.7: Rozšířené zobrazení: Skrytí popisku a readonly režim", () => {
  it("should render field without label but preserve space", () => {
    const layout: TsLayout = { rows: [[{ field: "text" }]] }
    const fields: Record<string, TsFieldDef> = {
      text: { type: "text", label: "Hidden", hideLabel: true },
    }

    const { container } = render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    // Should not find the label text as a Label element
    const labels = screen.queryAllByText("Hidden").filter((el) => el.tagName === "LABEL")
    expect(labels.length).toBe(0)

    // Should find the placeholder div with min-h-14
    const placeholder = container.querySelector(".min-h-14")
    expect(placeholder).toBeDefined()
  })

  it("should have aria-readonly on widgets in readonly mode", () => {
    const layout: TsLayout = {
      rows: [[{ field: "select" }], [{ field: "text" }], [{ field: "num" }]],
    }
    const fields: Record<string, TsFieldDef> = {
      select: { type: "select", label: "Select", options: ["A"], readonly: true },
      text: { type: "text", label: "Text", readonly: true },
      num: { type: "number", label: "Number", readonly: true },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.getAttribute("aria-readonly")).toBe("true")

    const textInput = screen.getByLabelText("Text")
    expect(textInput.getAttribute("aria-readonly")).toBe("true")

    const numberInput = screen.getByLabelText("Number")
    expect(numberInput.getAttribute("aria-readonly")).toBe("true")
  })
})
