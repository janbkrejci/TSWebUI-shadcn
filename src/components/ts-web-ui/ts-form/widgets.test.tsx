import { fireEvent, render, screen } from "@testing-library/react"
import { FormProvider, useForm } from "react-hook-form"
import { describe, expect, it } from "vitest"

import { TsFormField } from "./ts-form-field"
import { TsFieldDef } from "./types"
import { sanitizeId } from "./utils"

// Helper to wrap TsFormField in FormProvider
const TestForm = ({ name, fieldDef }: { name: string; fieldDef: TsFieldDef }) => {
  const methods = useForm({
    defaultValues: {
      [name]:
        fieldDef.type === "multiselect" ||
        (fieldDef.type === "relationship" && fieldDef.mode === "multiple")
          ? []
          : "",
    },
  })
  return (
    <FormProvider {...methods}>
      <form>
        <TsFormField name={name} fieldDef={fieldDef} />
      </form>
    </FormProvider>
  )
}

describe("Widget Architecture & Sanity", () => {
  it("sanitizes HTML IDs correctly", () => {
    expect(sanitizeId("user.profile[0].name")).toBe("user-profile-0-name")
    expect(sanitizeId("simpleName")).toBe("simpleName")
    expect(sanitizeId("---multiple--hyphens---")).toBe("multiple-hyphens")
  })

  it("renders TextWidget and handles input", () => {
    const fieldDef: TsFieldDef = { type: "text", label: "Username" }
    render(<TestForm name="username" fieldDef={fieldDef} />)

    const input = screen.getByLabelText(/Username/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: "testuser" } })
    expect(input.value).toBe("testuser")
  })

  it("renders CheckboxWidget", () => {
    const fieldDef: TsFieldDef = { type: "checkbox", label: "Accept Terms" }
    render(<TestForm name="terms" fieldDef={fieldDef} />)

    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("renders SelectWidget with options", async () => {
    const fieldDef: TsFieldDef = {
      type: "select",
      label: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    }
    render(<TestForm name="role" fieldDef={fieldDef} />)

    const trigger = screen.getByRole("combobox")
    fireEvent.click(trigger)

    // Wait for the select content to appear
    expect(await screen.findByRole("option", { name: "Admin" })).toBeInTheDocument()
    expect(await screen.findByRole("option", { name: "User" })).toBeInTheDocument()
  })

  it("renders InfoboxWidget without external label", () => {
    const fieldDef: TsFieldDef = {
      type: "infobox",
      label: "Information",
      value: "This is a hint",
      variant: "information",
    }
    render(<TestForm name="info" fieldDef={fieldDef} />)

    // Infobox renders label internally, so TsFormField should NOT render it
    const labels = screen.queryAllByText("Information")
    // One from Infobox internal, but none from FormLabel (because it's in WIDGETS_WITHOUT_EXTERNAL_LABEL)
    expect(labels.length).toBe(1)
    expect(screen.getByText("This is a hint")).toBeInTheDocument()
  })

  it("renders RelationshipWidget and sanitizes popover ID", () => {
    const fieldDef: TsFieldDef = {
      type: "relationship",
      label: "Organization",
      targetEntity: "Org",
      options: [{ id: "1", name: "Acme Corp" }],
    }
    const name = "user.org[0]"
    render(<TestForm name={name} fieldDef={fieldDef} />)

    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveAttribute("aria-controls", `popover-content-user-org-0`)
  })

  it("renders TableWidget and handles data", () => {
    const fieldDef: TsFieldDef = {
      type: "table",
      label: "Items",
      columns: [{ key: "name", title: "Name", type: "text" }],
    }
    render(<TestForm name="items" fieldDef={fieldDef} />)

    expect(screen.getByText("Items")).toBeInTheDocument()
    // Table content (empty state is handled by TsTable)
    expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
