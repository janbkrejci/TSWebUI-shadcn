import { beforeEach, describe, expect, it } from "vitest"

import { useFormEditorStore } from "./store"

const state = () => useFormEditorStore.getState()

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
})
