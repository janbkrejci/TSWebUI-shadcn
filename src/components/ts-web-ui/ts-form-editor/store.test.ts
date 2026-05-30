import { beforeEach, describe, expect, it } from "vitest"

import { useFormEditorStore } from "./store"
import { AVAILABLE_FIELD_TYPES, GROUPED_FIELD_TYPES } from "./types"

const state = () => useFormEditorStore.getState()

describe("TsFormEditor field palette", () => {
  it("exposes the relationship picker in the Others group", () => {
    expect(AVAILABLE_FIELD_TYPES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "relationship",
          label: "Relationship",
          group: "Others",
        }),
      ])
    )
    expect(GROUPED_FIELD_TYPES.Others.map((field) => field.type)).toContain("relationship")
  })
})

describe("TsFormEditor Store - renameField", () => {
  beforeEach(() => {
    state().resetForm()
  })

  it("rejects rename to an existing field key", () => {
    state().addField("text", 0, 0, 0)
    state().addColumnToRow(0, 0)
    state().addField("number", 0, 0, 1)

    const fieldKeys = Object.keys(state().form.fields)
    const [firstKey, secondKey] = fieldKeys

    expect(state().renameField(firstKey, secondKey)).toBe(false)
    expect(Object.keys(state().form.fields)).toEqual(fieldKeys)
  })

  it("renames the field key in the fields object", () => {
    state().addField("text", 0, 0, 0)
    const originalKey = Object.keys(state().form.fields)[0]

    expect(state().renameField(originalKey, "newFieldName")).toBe(true)
    expect(state().form.fields.newFieldName).toBeDefined()
    expect(state().form.fields[originalKey]).toBeUndefined()
  })

  it("renames field references in single mode layout", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    expect(state().renameField(fieldKey, "renamedField")).toBe(true)
    expect(state().form.rows?.[0].items[0].field).toBe("renamedField")
  })

  it("renames field references across tabs and rows", () => {
    state().setMode("tabs")
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    state().addTab("Tab 2")
    state().addRow(1)

    useFormEditorStore.setState((current) => {
      if (!current.form.tabs) {
        return current
      }

      const tabs = current.form.tabs.map((tab, tabIndex) => {
        if (tabIndex !== 1) {
          return tab
        }

        return {
          ...tab,
          rows: tab.rows.map((row, rowIndex) => {
            if (rowIndex !== 1) {
              return row
            }

            return {
              ...row,
              items: row.items.map((item, itemIndex) =>
                itemIndex === 0 ? { ...item, field: fieldKey, type: "text" as const } : item
              ),
            }
          }),
        }
      })

      return {
        ...current,
        form: {
          ...current.form,
          tabs,
        },
      }
    })

    expect(state().renameField(fieldKey, "renamedField")).toBe(true)
    expect(state().form.tabs?.[0].rows[0].items[0].field).toBe("renamedField")
    expect(state().form.tabs?.[1].rows[1].items[0].field).toBe("renamedField")
  })

  it("renames all references atomically in single mode", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]
    state().addColumnToRow(0, 0)

    useFormEditorStore.setState((current) => ({
      ...current,
      form: {
        ...current.form,
        rows: current.form.rows?.map((row, rowIndex) =>
          rowIndex === 0
            ? {
                ...row,
                items: row.items.map((item, itemIndex) =>
                  itemIndex === 1 ? { ...item, field: fieldKey, type: "text" as const } : item
                ),
              }
            : row
        ),
      },
    }))

    expect(state().renameField(fieldKey, "newName")).toBe(true)
    expect(state().form.fields.newName).toBeDefined()
    expect(state().form.rows?.[0].items[0].field).toBe("newName")
    expect(state().form.rows?.[0].items[1].field).toBe("newName")
    expect(state().form.fields[fieldKey]).toBeUndefined()
  })

  it("rejects rename of a non-existent field", () => {
    expect(state().renameField("nonExistent", "newName")).toBe(false)
  })

  it("rejects rename to an empty string", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    expect(state().renameField(fieldKey, "")).toBe(false)
    expect(state().form.fields[fieldKey]).toBeDefined()
  })

  it("rejects rename with invalid field key format", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    expect(state().renameField(fieldKey, "invalid key")).toBe(false)
    expect(state().form.fields[fieldKey]).toBeDefined()
  })

  it("treats rename to the same name as a no-op success", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    expect(state().renameField(fieldKey, fieldKey)).toBe(true)
    expect(state().form.fields[fieldKey]).toBeDefined()
  })

  it("supports undo history for rename operations", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    expect(state().renameField(fieldKey, "renamedField")).toBe(true)
    expect(state().form.fields.renamedField).toBeDefined()

    state().undo()
    expect(state().form.fields[fieldKey]).toBeDefined()
    expect(state().form.fields.renamedField).toBeUndefined()
  })

  it("does not add history entry when form layout is in an invalid state", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]
    const previousHistoryIndex = state().historyIndex

    useFormEditorStore.setState((current) => ({
      ...current,
      form: {
        ...current.form,
        rows: undefined,
        tabs: undefined,
      },
    }))

    expect(state().renameField(fieldKey, "validRenamedKey")).toBe(false)
    expect(state().historyIndex).toBe(previousHistoryIndex)
  })

  it("renames field after moveField flow across tabs without direct state mutation", () => {
    state().setMode("tabs")
    state().addField("text", 0, 0, 0)
    const originalKey = Object.keys(state().form.fields)[0]

    state().addTab("Tab 2")
    state().addRow(1)
    state().moveField(0, 0, 0, 1, 1, 0)

    expect(state().form.tabs?.[1].rows[1].items[0].field).toBe(originalKey)
    expect(state().renameField(originalKey, "renamedAfterMove")).toBe(true)
    expect(state().form.tabs?.[1].rows[1].items[0].field).toBe("renamedAfterMove")
    expect(state().form.fields.renamedAfterMove).toBeDefined()
    expect(state().form.fields[originalKey]).toBeUndefined()
  })
})

describe("TsFormEditor Store - insertColumnAtPosition", () => {
  beforeEach(() => {
    state().resetForm()
  })

  it("inserts a new empty column at the first position", () => {
    state().addColumnToRow(0, 0)

    state().insertColumnAtPosition(0, 0, 0)

    const items = state().form.rows?.[0].items ?? []
    expect(items).toHaveLength(3)
    expect(items[0].type).toBe("empty")
  })

  it("inserts a new empty column in the middle", () => {
    state().addColumnToRow(0, 0)

    state().insertColumnAtPosition(0, 0, 1)

    const items = state().form.rows?.[0].items ?? []
    expect(items).toHaveLength(3)
    expect(items[1].type).toBe("empty")
  })

  it("inserts at the end when index equals row length", () => {
    state().addColumnToRow(0, 0)

    state().insertColumnAtPosition(0, 0, 2)

    const items = state().form.rows?.[0].items ?? []
    expect(items).toHaveLength(3)
    expect(items[2].type).toBe("empty")
  })

  it("works in tabs mode", () => {
    state().setMode("tabs")

    state().insertColumnAtPosition(0, 0, 0)

    const items = state().form.tabs?.[0].rows[0].items ?? []
    expect(items).toHaveLength(2)
    expect(items[0].type).toBe("empty")
  })

  it("supports undo after insertion", () => {
    const beforeLength = state().form.rows?.[0].items.length ?? 0

    state().insertColumnAtPosition(0, 0, 0)
    expect(state().form.rows?.[0].items.length).toBe(beforeLength + 1)

    state().undo()
    expect(state().form.rows?.[0].items.length).toBe(beforeLength)
  })
})

describe("TsFormEditor Store - import/export sync", () => {
  beforeEach(() => {
    state().resetForm()
  })

  it("exports separator and align row item metadata", () => {
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    useFormEditorStore.setState((current) => ({
      ...current,
      form: {
        ...current.form,
        rows: [
          {
            ...current.form.rows![0],
            items: [
              {
                ...current.form.rows![0].items[0],
                field: fieldKey,
                type: "text",
                align: "right",
              },
              {
                id: "separator-item",
                field: "",
                type: "separator",
                label: "Section A",
                align: "center",
                width: "1fr",
              },
            ],
          },
        ],
      },
    }))

    const exported = JSON.parse(state().exportJson())
    const rowItems = exported.layout.rows[0]

    expect(rowItems).toHaveLength(2)
    expect(rowItems[0]).toMatchObject({ field: fieldKey, align: "right" })
    expect(rowItems[1]).toMatchObject({
      field: "",
      type: "separator",
      label: "Section A",
      align: "center",
    })
  })

  it("imports align and separator row item metadata", () => {
    const imported = {
      fields: {
        customerName: { type: "text", label: "Customer" },
      },
      layout: {
        rows: [
          [
            { field: "customerName", width: "2fr", align: "left" },
            { field: "", type: "separator", label: "Details", align: "center" },
          ],
        ],
      },
      buttons: [],
    }

    expect(state().importJson(JSON.stringify(imported))).toBe(true)

    const items = state().form.rows?.[0].items ?? []
    expect(items[0].field).toBe("customerName")
    expect(items[0].align).toBe("left")
    expect(items[1].type).toBe("separator")
    expect(items[1].label).toBe("Details")
    expect(items[1].align).toBe("center")
  })

  it("exports buttons with disabled and hidden attributes", () => {
    // Clear default buttons first
    while (state().form.buttons.length > 0) {
      state().removeButton(0)
    }
    state().addButton()
    state().updateButton(0, { label: "Save", action: "save", disabled: true, hidden: false })

    const exported = JSON.parse(state().exportJson())
    expect(exported.buttons).toHaveLength(1)
    expect(exported.buttons[0]).toMatchObject({
      label: "Save",
      action: "save",
      disabled: true,
    })
  })

  it("exports field config with Epic 3 attributes", () => {
    state().addField("number", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    state().updateFieldConfig(fieldKey, {
      roundTo: 2,
      hideLabel: true,
      readonly: true,
      autofocus: true,
    })

    const exported = JSON.parse(state().exportJson())
    const field = exported.fields[fieldKey]

    expect(field).toMatchObject({
      roundTo: 2,
      hideLabel: true,
      readonly: true,
      autofocus: true,
    })
  })

  it("round-trip preserves all metadata through export and import", () => {
    // Setup complex form with all features
    state().addField("text", 0, 0, 0)
    const fieldKey = Object.keys(state().form.fields)[0]

    state().updateFieldConfig(fieldKey, {
      hideLabel: true,
      readonly: true,
    })

    // Add separator with align metadata
    useFormEditorStore.setState((current) => ({
      ...current,
      form: {
        ...current.form,
        rows: [
          {
            ...current.form.rows![0],
            items: [
              { ...current.form.rows![0].items[0], align: "right" as const },
              {
                id: "sep-rt",
                field: "",
                type: "separator" as const,
                label: "Divider",
                align: "center" as const,
                width: "1fr",
              },
            ],
          },
        ],
      },
    }))

    state().addButton()
    state().updateButton(0, {
      label: "Submit",
      action: "submit",
      position: "right",
      disabled: false,
    })

    // Export
    const exported1 = state().exportJson()
    const parsed1 = JSON.parse(exported1)

    // Import and re-export
    state().resetForm()
    state().importJson(exported1)
    const exported2 = state().exportJson()
    const parsed2 = JSON.parse(exported2)

    // Verify fields match
    expect(parsed2.fields).toEqual(parsed1.fields)
    expect(parsed2.buttons).toEqual(parsed1.buttons)
    expect(parsed2.layout).toEqual(parsed1.layout)
  })

  it("handles legacy format without Ts prefix (backward compatibility)", () => {
    const legacyJson = {
      fields: {
        name: { type: "text", label: "Name" },
        age: { type: "number", label: "Age", roundTo: 0 },
      },
      layout: {
        rows: [[{ field: "name" }, { field: "age" }]],
      },
      buttons: [{ action: "submit", label: "Submit" }],
    }

    expect(state().importJson(JSON.stringify(legacyJson))).toBe(true)

    const fields = state().form.fields
    expect(fields.name).toBeDefined()
    expect(fields.age).toBeDefined()
  })

  it("imports form without buttons field (defaults to empty array)", () => {
    const formWithoutButtons = {
      fields: {
        email: { type: "text", label: "Email" },
      },
      layout: {
        rows: [[{ field: "email" }]],
      },
    }

    expect(state().importJson(JSON.stringify(formWithoutButtons))).toBe(true)
    expect(state().form.buttons).toEqual([])
  })

  it("round-trip preserves separator and align in tabs mode", () => {
    const tabsForm = {
      fields: {
        city: { type: "text", label: "City" },
      },
      layout: {
        tabs: [
          {
            label: "Location",
            rows: [
              [
                { field: "city", align: "right" },
                { field: "", type: "separator", label: "Divider", align: "center" },
              ],
            ],
          },
        ],
      },
      buttons: [],
    }

    expect(state().importJson(JSON.stringify(tabsForm))).toBe(true)
    expect(state().form.mode).toBe("tabs")

    const exported = JSON.parse(state().exportJson())
    const row = exported.layout.tabs[0].rows[0]

    expect(row).toHaveLength(2)
    expect(row[0]).toMatchObject({ field: "city", align: "right" })
    expect(row[1]).toMatchObject({
      field: "",
      type: "separator",
      label: "Divider",
      align: "center",
    })
  })

  it("clears orphaned field references on import", () => {
    const orphanedForm = {
      fields: {
        name: { type: "text", label: "Name" },
      },
      layout: {
        rows: [[{ field: "name" }, { field: "nonExistent" }]],
      },
      buttons: [],
    }

    expect(state().importJson(JSON.stringify(orphanedForm))).toBe(true)

    const items = state().form.rows?.[0].items ?? []
    expect(items[0].field).toBe("name")
    expect(items[0].type).toBe("text")
    expect(items[1].field).toBe("")
    expect(items[1].type).toBe("empty")
  })
})
