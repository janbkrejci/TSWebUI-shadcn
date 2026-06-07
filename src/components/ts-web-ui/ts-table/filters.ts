import { FilterFn } from "@tanstack/react-table"

const EMPTY_FILTER_VALUE = "!*"
const NOT_EMPTY_FILTER_VALUE = "*"

function isEmptyFilterValue(filterValue: unknown): boolean {
  return String(filterValue).trim() === EMPTY_FILTER_VALUE
}

function isNotEmptyFilterValue(filterValue: unknown): boolean {
  return String(filterValue).trim() === NOT_EMPTY_FILTER_VALUE
}

function isEmptyCellValue(value: unknown): boolean {
  return value == null || (typeof value === "string" && value.trim() === "")
}

function withNegatedFilterValue(
  filterValue: unknown,
  matcher: (normalizedValue: string) => boolean
): boolean {
  const normalizedFilterValue = String(filterValue).trim()
  if (normalizedFilterValue.startsWith("!") && !isEmptyFilterValue(normalizedFilterValue)) {
    return !matcher(normalizedFilterValue.slice(1).trim())
  }
  return matcher(normalizedFilterValue)
}

/**
 * Match text with wildcard support: * (any chars), ? (single char).
 * Falls back to case-insensitive substring match if no wildcards present.
 */
export function matchTextPattern(text: string, pattern: string): boolean {
  const lowText = text.toLowerCase()
  const lowPattern = pattern.toLowerCase()
  const hasStartAnchor = lowPattern.startsWith("^")
  const hasEndAnchor = lowPattern.endsWith("$")
  const anchorStrippedPattern = lowPattern.slice(
    hasStartAnchor ? 1 : 0,
    hasEndAnchor ? -1 : undefined
  )
  const hasWildcards = anchorStrippedPattern.includes("*") || anchorStrippedPattern.includes("?")

  // If no wildcards, use simple substring match
  if (!hasWildcards) {
    if (hasStartAnchor && hasEndAnchor) return lowText === anchorStrippedPattern
    if (hasStartAnchor) return lowText.startsWith(anchorStrippedPattern)
    if (hasEndAnchor) return lowText.endsWith(anchorStrippedPattern)
    return lowText.includes(anchorStrippedPattern)
  }

  // Convert wildcard pattern to regex: * → .*, ? → .
  const escaped = anchorStrippedPattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  const wildcardRegex = escaped.replace(/\*/g, ".*").replace(/\?/g, ".")
  const regexStr =
    hasStartAnchor || hasEndAnchor
      ? `${hasStartAnchor ? "^" : ""}${wildcardRegex}${hasEndAnchor ? "$" : ""}`
      : `^${wildcardRegex}$`
  try {
    return new RegExp(regexStr).test(lowText)
  } catch {
    return lowText.includes(lowPattern)
  }
}

// ---- Number Filter (matches reference implementation) ----

function parseNumberRange(filterValue: string): { min: number | null; max: number | null } | null {
  const trimmed = filterValue.trim()
  if (!trimmed) return null

  // Range with ".." separator: "10..20", "..20", "10.."
  if (trimmed.includes("..")) {
    const parts = trimmed.split("..")
    const minStr = parts[0]?.trim()
    const maxStr = parts[1]?.trim()
    return {
      min: minStr ? (isNaN(parseFloat(minStr)) ? null : parseFloat(minStr)) : null,
      max: maxStr ? (isNaN(parseFloat(maxStr)) ? null : parseFloat(maxStr)) : null,
    }
  }

  // Single number — exact match (text startsWith)
  const parsed = parseFloat(trimmed)
  if (!isNaN(parsed)) {
    return { min: parsed, max: parsed }
  }

  return null
}

export const numberFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId) as number
  if (isEmptyFilterValue(filterValue)) return isEmptyCellValue(cellValue)
  if (isNotEmptyFilterValue(filterValue)) return !isEmptyCellValue(cellValue)
  return withNegatedFilterValue(filterValue, (normalizedFilterValue) => {
    if (typeof cellValue !== "number") return false

    const range = parseNumberRange(normalizedFilterValue)
    if (!range) {
      // Fallback to text matching
      return matchTextPattern(String(cellValue), normalizedFilterValue)
    }

    if (range.min !== null && range.max !== null && range.min === range.max) {
      // Exact number — match if cell equals or cell string starts with filter
      return cellValue === range.min || String(cellValue).startsWith(normalizedFilterValue)
    }

    if (range.min !== null && cellValue < range.min) return false
    if (range.max !== null && cellValue > range.max) return false
    return true
  })
}

// ---- Date Filter (matches reference implementation: flexible date parsing) ----

function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const s = dateStr.trim()

  // DD.MM.YYYY (Czech format)
  const m1 = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (m1) {
    const d = new Date(Number(m1[3]), Number(m1[2]) - 1, Number(m1[1]))
    if (!isNaN(d.getTime())) return d
  }

  // DD.MM.YY
  const m2 = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2})$/)
  if (m2) {
    const yr = Number(m2[3])
    const fullYear = yr < 50 ? 2000 + yr : 1900 + yr
    const d = new Date(fullYear, Number(m2[2]) - 1, Number(m2[1]))
    if (!isNaN(d.getTime())) return d
  }

  // ISO YYYY-MM-DD (parse as local, not UTC)
  const m3 = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m3) {
    const d = new Date(Number(m3[1]), Number(m3[2]) - 1, Number(m3[3]))
    if (!isNaN(d.getTime())) return d
  }

  // Year only YYYY
  const m4 = s.match(/^(\d{4})$/)
  if (m4) {
    return new Date(Number(m4[1]), 0, 1)
  }

  // Month.Year DD.MM or MM.YYYY
  const m5 = s.match(/^(\d{1,2})\.(\d{4})$/)
  if (m5) {
    return new Date(Number(m5[2]), Number(m5[1]) - 1, 1)
  }

  return null
}

function setEndOfPeriod(date: Date, input: string): Date {
  const s = input.trim()
  const d = new Date(date)

  // If only year was entered, end of year
  if (/^\d{4}$/.test(s)) {
    d.setMonth(11, 31)
    d.setHours(23, 59, 59, 999)
    return d
  }

  // If month.year, end of month
  if (/^\d{1,2}\.\d{4}$/.test(s)) {
    d.setMonth(d.getMonth() + 1, 0) // last day of month
    d.setHours(23, 59, 59, 999)
    return d
  }

  // Otherwise end of day
  d.setHours(23, 59, 59, 999)
  return d
}

export const dateFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId)
  if (isEmptyFilterValue(filterValue)) return isEmptyCellValue(cellValue)
  if (isNotEmptyFilterValue(filterValue)) return !isEmptyCellValue(cellValue)
  if (!cellValue) return false

  const cellDate = new Date(cellValue as string)
  if (isNaN(cellDate.getTime())) return false
  const normalizedCellDate = new Date(
    cellDate.getFullYear(),
    cellDate.getMonth(),
    cellDate.getDate()
  )

  return withNegatedFilterValue(filterValue, (normalizedFilterValue) => {
    if (!normalizedFilterValue) return true

    // Range with ".."
    if (normalizedFilterValue.includes("..")) {
      const [startStr, endStr] = normalizedFilterValue.split("..")
      const min = startStr?.trim() ? parseFlexibleDate(startStr.trim()) : null
      const max = endStr?.trim() ? parseFlexibleDate(endStr.trim()) : null
      const maxEnd = max && endStr?.trim() ? setEndOfPeriod(max, endStr.trim()) : null

      if (min && normalizedCellDate < min) return false
      if (maxEnd && normalizedCellDate > maxEnd) return false
      return true
    }

    // Single date/period
    const parsed = parseFlexibleDate(normalizedFilterValue)
    if (parsed) {
      const end = setEndOfPeriod(new Date(parsed), normalizedFilterValue)
      return normalizedCellDate >= parsed && normalizedCellDate <= end
    }

    // Fallback: text match on formatted date (cs-CZ)
    const formatted = new Intl.DateTimeFormat("cs-CZ").format(normalizedCellDate)
    return matchTextPattern(formatted, normalizedFilterValue)
  })
}

// ---- Boolean Filter ----

export const booleanFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId)
  if (isEmptyFilterValue(filterValue)) return isEmptyCellValue(cellValue)
  if (isNotEmptyFilterValue(filterValue)) return !isEmptyCellValue(cellValue)
  return withNegatedFilterValue(filterValue, (normalizedFilterValue) => {
    // Accept both boolean values (from predefinedFilters) and string values (from UI)
    if (filterValue === true || normalizedFilterValue === "true") return cellValue === true
    if (filterValue === false || normalizedFilterValue === "false") return cellValue === false
    return true // 'all' or empty
  })
}

// ---- Text Filter ----

export const textFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId)
  if (isEmptyFilterValue(filterValue)) return isEmptyCellValue(cellValue)
  if (isNotEmptyFilterValue(filterValue)) return !isEmptyCellValue(cellValue)
  return withNegatedFilterValue(filterValue, (normalizedFilterValue) => {
    if (cellValue == null) return false
    return matchTextPattern(String(cellValue), normalizedFilterValue)
  })
}

export function globalTextFilter(values: unknown[], filterValue: unknown): boolean {
  if (isEmptyFilterValue(filterValue)) return values.some((value) => isEmptyCellValue(value))
  if (isNotEmptyFilterValue(filterValue)) return values.some((value) => !isEmptyCellValue(value))

  return withNegatedFilterValue(filterValue, (normalizedFilterValue) => {
    if (!normalizedFilterValue) return true
    return values.some((value) => {
      if (value == null) return false
      return matchTextPattern(String(value), normalizedFilterValue)
    })
  })
}
