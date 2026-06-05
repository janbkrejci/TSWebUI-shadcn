import { describe, expect, it } from "vitest"

import { booleanFilter, dateFilter, numberFilter, textFilter } from "./filters"

function rowWith(value: unknown) {
  return {
    getValue: () => value,
  }
}

describe("TsTable column filters", () => {
  it.each([
    ["text", textFilter],
    ["number", numberFilter],
    ["date", dateFilter],
    ["boolean", booleanFilter],
  ])("treats !* as an empty-value filter for %s columns", (_type, filter) => {
    expect(filter(rowWith(null) as never, "value", "!*", {} as never)).toBe(true)
    expect(filter(rowWith(undefined) as never, "value", "!*", {} as never)).toBe(true)
    expect(filter(rowWith("") as never, "value", "!*", {} as never)).toBe(true)
    expect(filter(rowWith("   ") as never, "value", "!*", {} as never)).toBe(true)
  })

  it.each([
    ["text", textFilter, "hello"],
    ["number", numberFilter, 0],
    ["date", dateFilter, "2026-05-31"],
    ["boolean", booleanFilter, false],
  ])("treats * as a not-empty filter for %s columns", (_type, filter, nonEmptyValue) => {
    expect(filter(rowWith(nonEmptyValue) as never, "value", "*", {} as never)).toBe(true)
    expect(filter(rowWith(null) as never, "value", "*", {} as never)).toBe(false)
    expect(filter(rowWith(undefined) as never, "value", "*", {} as never)).toBe(false)
    expect(filter(rowWith("") as never, "value", "*", {} as never)).toBe(false)
    expect(filter(rowWith("   ") as never, "value", "*", {} as never)).toBe(false)
  })

  it("does not treat falsy non-empty values as empty", () => {
    expect(numberFilter(rowWith(0) as never, "value", "!*", {} as never)).toBe(false)
    expect(booleanFilter(rowWith(false) as never, "value", "!*", {} as never)).toBe(false)
    expect(textFilter(rowWith("0") as never, "value", "!*", {} as never)).toBe(false)
    expect(dateFilter(rowWith("2026-05-31") as never, "value", "!*", {} as never)).toBe(false)
  })

  it("keeps wildcard matching for text patterns beyond standalone *", () => {
    expect(textFilter(rowWith("alice") as never, "value", "a*", {} as never)).toBe(true)
    expect(textFilter(rowWith("alice") as never, "value", "b*", {} as never)).toBe(false)
  })
})
