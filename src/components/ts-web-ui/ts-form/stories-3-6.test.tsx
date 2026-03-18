import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FormProvider, useForm } from "react-hook-form"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.6: Implementace autofocus a automatického výběru textu", () => {
  it("should autofocus field with autofocus: true", async () => {
    const layout: TsLayout = {
      rows: [[{ field: "text1" }], [{ field: "text2" }]],
    }
    const fields: Record<string, TsFieldDef> = {
      text1: { type: "text", label: "Field 1" },
      text2: { type: "text", label: "Field 2", autofocus: true },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    // JSDOM might need some help with autofocus
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText("Field 2"))
    })
  })

  it("should select all text on focus when selectAllOnFocus is true", async () => {
    const layout: TsLayout = { rows: [[{ field: "text" }]] }
    const fields: Record<string, TsFieldDef> = {
      text: { type: "text", label: "Text", selectAllOnFocus: true },
    }
    const initialValues = { text: "Hello World" }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} values={initialValues} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Text") as HTMLInputElement

    // Mock select method because JSDOM doesn't implement it fully
    const selectSpy = vi.spyOn(input, "select")

    fireEvent.focus(input)

    await waitFor(() => {
      expect(selectSpy).toHaveBeenCalled()
    })
  })
})
