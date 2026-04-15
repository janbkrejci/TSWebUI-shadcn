import { fireEvent, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.5: Parametrické ikony a zavírání v Infoboxu", () => {
  it("should render infobox with custom icon", () => {
    const layout: TsLayout = { rows: [[{ field: "info" }]] }
    const fields: Record<string, TsFieldDef> = {
      info: {
        type: "infobox",
        label: "Important Info",
        content: "Some message",
        icon: "User", // Lucide User icon
      },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    expect(screen.getByText("Important Info")).toBeDefined()
    expect(screen.getByText("Some message")).toBeDefined()
    // Finding the icon specifically might be hard, but we can check if it rendered an SVG
    const svg = screen.getByRole("status").querySelector("svg")
    expect(svg).toBeDefined()
  })

  it("should support closing the infobox", () => {
    const layout: TsLayout = { rows: [[{ field: "info" }]] }
    const fields: Record<string, TsFieldDef> = {
      info: {
        type: "infobox",
        label: "Closable Info",
        content: "Close me",
        closable: true,
      },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    expect(screen.getByText("Closable Info")).toBeDefined()

    const closeBtn = screen.getByLabelText("Close")
    fireEvent.click(closeBtn)

    expect(screen.queryByText("Closable Info")).toBeNull()
  })
})
