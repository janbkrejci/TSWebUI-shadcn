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

  it("supports leading ! negation for text, number, date and boolean filters", () => {
    expect(textFilter(rowWith("test value") as never, "value", "!test", {} as never)).toBe(false)
    expect(textFilter(rowWith("hello") as never, "value", "!test", {} as never)).toBe(true)

    expect(numberFilter(rowWith(75) as never, "value", "!50..", {} as never)).toBe(false)
    expect(numberFilter(rowWith(49) as never, "value", "!50..", {} as never)).toBe(true)

    expect(dateFilter(rowWith("2024-12-31") as never, "value", "!..2024", {} as never)).toBe(false)
    expect(dateFilter(rowWith("2025-01-01") as never, "value", "!..2024", {} as never)).toBe(true)

    expect(booleanFilter(rowWith(true) as never, "value", "!true", {} as never)).toBe(false)
    expect(booleanFilter(rowWith(false) as never, "value", "!true", {} as never)).toBe(true)
  })

  it("supports ^ and $ anchors in text search, including negation", () => {
    expect(textFilter(rowWith("alice") as never, "value", "^a", {} as never)).toBe(true)
    expect(textFilter(rowWith("alice") as never, "value", "^b", {} as never)).toBe(false)
    expect(textFilter(rowWith("oko") as never, "value", "ko$", {} as never)).toBe(true)
    expect(textFilter(rowWith("kolo") as never, "value", "ko$", {} as never)).toBe(false)
    expect(textFilter(rowWith("queen") as never, "value", "!^q", {} as never)).toBe(false)
    expect(textFilter(rowWith("alice") as never, "value", "!^q", {} as never)).toBe(true)
  })
})
