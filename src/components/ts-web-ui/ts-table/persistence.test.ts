import { beforeEach, describe, expect, it } from "vitest"

import { loadPersistedTableState, savePersistedTableState } from "./persistence"

describe("ts-table persistence", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("returns null when no key is provided", () => {
    expect(loadPersistedTableState(undefined)).toBeNull()
    expect(loadPersistedTableState("")).toBeNull()
  })

  it("returns null when nothing is stored for the key", () => {
    expect(loadPersistedTableState("unknown")).toBeNull()
  })

  it("round-trips persisted state for a key", () => {
    savePersistedTableState("clients", {
      sorting: [{ id: "name", desc: true }],
      globalFilter: "acme",
      pagination: { pageIndex: 2, pageSize: 20 },
      columnVisibility: { note: false },
    })

    const restored = loadPersistedTableState("clients")
    expect(restored).toEqual({
      sorting: [{ id: "name", desc: true }],
      globalFilter: "acme",
      pagination: { pageIndex: 2, pageSize: 20 },
      columnVisibility: { note: false },
    })
  })

  it("is a no-op when saving without a key", () => {
    savePersistedTableState(undefined, { globalFilter: "x" })
    expect(window.localStorage.length).toBe(0)
  })

  it("returns null for corrupt stored values", () => {
    window.localStorage.setItem("tswebui:ts-table:broken", "{not json")
    expect(loadPersistedTableState("broken")).toBeNull()
  })
})
