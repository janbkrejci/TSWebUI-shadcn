import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { FormProvider, useForm } from "react-hook-form"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.1: Implementace Smart Parsing pro Date a Datetime", () => {
  const currentYear = new Date().getFullYear()

  it("should parse compact date DDMM", () => {
    const layout: TsLayout = { rows: [[{ field: "date" }]] }
    const fields: Record<string, TsFieldDef> = {
      date: { type: "date", label: "Date" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Date")
    fireEvent.change(input, { target: { value: "2503" } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe(`25.3.${currentYear}`)
  })

  it("should parse date with dots DD.MM", () => {
    const layout: TsLayout = { rows: [[{ field: "date" }]] }
    const fields: Record<string, TsFieldDef> = {
      date: { type: "date", label: "Date" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Date")
    fireEvent.change(input, { target: { value: "25.3" } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe(`25.3.${currentYear}`)
  })

  it("should parse date with year DD.MM.YY", () => {
    const layout: TsLayout = { rows: [[{ field: "date" }]] }
    const fields: Record<string, TsFieldDef> = {
      date: { type: "date", label: "Date" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Date")
    fireEvent.change(input, { target: { value: "25.3.25" } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe(`25.3.2025`)
  })

  it("should parse date with spaces after dots DD. MM.", () => {
    const layout: TsLayout = { rows: [[{ field: "date" }]] }
    const fields: Record<string, TsFieldDef> = {
      date: { type: "date", label: "Date" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Date")
    fireEvent.change(input, { target: { value: "25. 3." } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe(`25.3.${currentYear}`)
  })

  it("should parse compact date DDMMYYYY", () => {
    const layout: TsLayout = { rows: [[{ field: "date" }]] }
    const fields: Record<string, TsFieldDef> = {
      date: { type: "date", label: "Date" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("Date")
    fireEvent.change(input, { target: { value: "25032025" } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe(`25.3.2025`)
  })

  it("should parse datetime HH:mm", () => {
    const layout: TsLayout = { rows: [[{ field: "datetime" }]] }
    const fields: Record<string, TsFieldDef> = {
      datetime: { type: "datetime", label: "DateTime" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("DateTime")
    fireEvent.change(input, { target: { value: "12:30" } })
    fireEvent.blur(input)

    // Should default date to today
    const today = new Date()
    const d = today.getDate()
    const m = today.getMonth() + 1
    const y = today.getFullYear()
    expect(input.getAttribute("value")).toBe(`${d}.${m}.${y} 12:30`)
  })

  it("should parse datetime DD.MM HH:mm", () => {
    const layout: TsLayout = { rows: [[{ field: "datetime" }]] }
    const fields: Record<string, TsFieldDef> = {
      datetime: { type: "datetime", label: "DateTime" },
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} />
      </TestWrapper>
    )

    const input = screen.getByLabelText("DateTime")
    fireEvent.change(input, { target: { value: "25.3 12:30" } })
    fireEvent.blur(input)

    expect(input.getAttribute("value")).toBe(`25.3.${currentYear} 12:30`)
  })
})
