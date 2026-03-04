import { describe, expect, it } from "vitest"

import { evaluateMath, parseNumericValue } from "./utils"

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
