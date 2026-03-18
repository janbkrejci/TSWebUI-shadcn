import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FormProvider, useForm } from "react-hook-form"

import { TsForm } from "./index"
import { TsFieldDef, TsLayout } from "./types"

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe("Story 3.4: Podpora pre-existing souborů ve File widgetu", () => {
  it("should render pre-existing files from value", () => {
    const layout: TsLayout = { rows: [[{ field: "files" }]] }
    const fields: Record<string, TsFieldDef> = {
      files: { type: "file", label: "Attachments", multiple: true },
    }
    const initialValues = {
      files: [
        { id: 1, name: "document.pdf", size: 1024, url: "/files/1" },
        { id: 2, name: "image.png", size: 2048 },
      ],
    }

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} values={initialValues} />
      </TestWrapper>
    )

    expect(screen.getByText("document.pdf")).toBeDefined()
    expect(screen.getByText("image.png")).toBeDefined()
    expect(screen.getByText("1.0 KB")).toBeDefined()
    expect(screen.getByText("2.0 KB")).toBeDefined()
  })

  it("should remove pre-existing file", () => {
    const layout: TsLayout = { rows: [[{ field: "files" }]] }
    const fields: Record<string, TsFieldDef> = {
      files: { type: "file", label: "Attachments", multiple: true },
    }
    const initialValues = {
      files: [{ id: 1, name: "document.pdf", size: 1024 }],
    }

    const onAction = vi.fn()

    render(
      <TestWrapper>
        <TsForm layout={layout} fields={fields} values={initialValues} onAction={onAction} />
      </TestWrapper>
    )

    expect(screen.getByText("document.pdf")).toBeDefined()

    const removeBtn = screen.getByTitle("Remove")
    fireEvent.click(removeBtn)

    expect(screen.queryByText("document.pdf")).toBeNull()

    return waitFor(() => {
      expect(onAction).toHaveBeenCalled()
      const [action, payload] = onAction.mock.calls[onAction.mock.calls.length - 1]
      expect(action).toBe("file:change:files")
      expect(payload).toEqual({ files: [] })
    })
  })
})
