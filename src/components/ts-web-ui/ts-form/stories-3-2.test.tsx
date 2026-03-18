import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FormProvider, useForm } from "react-hook-form"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.2: Vylepšené zaokrouhlování a lokalizace v Number widgetu", () => {
  it("should round value to specified decimal places (roundTo)", () => {
    const layout: TsLayout = { rows: [[{ field: "num" }]] }
    const fields: Record<string, TsFieldDef> = {
      num: { type: "number", label: "Number", roundTo: 2, locale: "cs-CZ" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Number")
    fireEvent.change(input, { target: { value: "123.4567" } })
    fireEvent.blur(input)

    // Czech locale uses comma as decimal separator
    // Note: Vitest environment might use different default locale, so we explicitly set it
    expect(input.getAttribute("value")).toMatch(/123,46/)
  })

  it("should support math expressions and localized input", () => {
    const layout: TsLayout = { rows: [[{ field: "num" }]] }
    const fields: Record<string, TsFieldDef> = {
      num: { type: "number", label: "Number", locale: "cs-CZ" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Number")
    // Support comma as decimal separator in input
    fireEvent.change(input, { target: { value: "10,5+2,5" } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe("13")
  })
})
