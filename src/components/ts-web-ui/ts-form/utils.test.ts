import { describe, expect, it } from "vitest"

import { TsFieldDef } from "./types"
import { evaluateMath, filterExcludeFromSubmit, parseNumericValue } from "./utils"

describe("TsForm Utils - Data Filtering", () => {
  describe("filterExcludeFromSubmit", () => {
    it("filters simple top-level fields", () => {
      const fields: Record<string, TsFieldDef> = {
        name: { type: "text", label: "Name" },
        temp: { type: "text", label: "Temp", excludeFromSubmit: true },
      }
      const data = { name: "Alice", temp: "secret" }
      const filtered = filterExcludeFromSubmit(data, fields)
      expect(filtered).toEqual({ name: "Alice" })
    })

    it("filters nested properties without affecting siblings in the same object", () => {
      const fields: Record<string, TsFieldDef> = {
        "user.name": { type: "text", label: "Name" },
        "user.token": { type: "text", label: "Token", excludeFromSubmit: true },
      }
      const data = { user: { name: "Bob", token: "xyz" } }
      const filtered = filterExcludeFromSubmit(data, fields)
      expect(filtered).toEqual({ user: { name: "Bob" } })
    })

    it("filters properties within array elements without deleting the whole element", () => {
      const fields: Record<string, TsFieldDef> = {
        "items.0.name": { type: "text", label: "Name", excludeFromSubmit: true },
        "items.0.age": { type: "number", label: "Age" },
      }
      const data = {
        items: [{ name: "Alice", age: 30 }],
      }
      const filtered = filterExcludeFromSubmit(data, fields)
      // items[0].name should be gone, but items[0].age must remain
      expect(filtered.items).toHaveLength(1)
      expect((filtered.items as Record<string, unknown>[])[0]).toEqual({ age: 30 })
    })

    it("correctly handles entire array element removal from end to start", () => {
      const fields: Record<string, TsFieldDef> = {
        "items.0": { type: "text", label: "Item 0", excludeFromSubmit: true },
        "items.1": { type: "text", label: "Item 1", excludeFromSubmit: true },
        "items.2": { type: "text", label: "Item 2" },
      }
      const data = { items: ["A", "B", "C"] }
      const filtered = filterExcludeFromSubmit(data, fields)
      // Items 0 and 1 removed, Item 2 remains (becomes index 0)
      expect(filtered.items).toEqual(["C"])
    })
  })
})

describe("TsForm Utils - Math Evaluation", () => {
  describe("evaluateMath", () => {
    it("evaluates simple addition", () => {
      expect(evaluateMath("1 + 2")).toBe(3)
    })

    it("evaluates subtraction with decimals", () => {
      expect(evaluateMath("10 - 2.5")).toBe(7.5)
    })

    it("respects operator precedence", () => {
      expect(evaluateMath("2 + 3 * 4")).toBe(14)
    })

    it("handles parentheses correctly", () => {
      expect(evaluateMath("(2 + 3) * 4")).toBe(20)
    })

    it("handles division and multiple levels of parentheses", () => {
      expect(evaluateMath("((10 + 2) / 3) * 2")).toBe(8)
    })

    it("returns undefined for invalid characters", () => {
      expect(evaluateMath("1 + 2; alert(1)")).toBeUndefined()
      expect(evaluateMath("1 + 2a")).toBeUndefined()
    })

    it("returns undefined for malformed expressions", () => {
      expect(evaluateMath("1 + * 2")).toBeUndefined()
      expect(evaluateMath("(1 + 2")).toBeUndefined()
    })

    it("handles leading and trailing spaces", () => {
      expect(evaluateMath("  1 + 2  ")).toBe(3)
    })

    it("handles comma as decimal separator", () => {
      expect(evaluateMath("1,5 + 2,5")).toBe(4)
    })

    it("handles unary plus", () => {
      expect(evaluateMath("+10 + 5")).toBe(15)
    })

    it("handles leading negative numbers", () => {
      expect(evaluateMath("-10 + 5")).toBe(-5)
    })

    it("handles negative numbers in parentheses", () => {
      expect(evaluateMath("5 + (-2 * 3)")).toBe(-1)
    })

    it("evaluates power operator", () => {
      expect(evaluateMath("2 ^ 3")).toBe(8)
      expect(evaluateMath("2 + 3 ^ 2")).toBe(11) // Precedence check: 2 + (3^2)
    })

    it("handles floating point precision", () => {
      expect(evaluateMath("0.1 + 0.2")).toBe(0.3)
    })
  })

  describe("parseNumericValue", () => {
    it("parses simple numbers", () => {
      expect(parseNumericValue("123.45")).toBe(123.45)
    })

    it("parses numbers with spaces and commas", () => {
      expect(parseNumericValue("1 234,56")).toBe(1234.56)
    })

    it("parses math expressions", () => {
      expect(parseNumericValue("100 / 4")).toBe(25)
    })

    it("returns undefined for empty or whitespace strings", () => {
      expect(parseNumericValue("")).toBeUndefined()
      expect(parseNumericValue("   ")).toBeUndefined()
    })
  })
})
