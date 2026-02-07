import { FilterFn } from "@tanstack/react-table"

// Helper for parsing number range/operátoru
function parseNumberRange(filterValue: string) {
  const value = filterValue.trim()

  // Rozsah 10..20
  if (value.includes("..")) {
    const parts = value.split("..")
    return {
      min: parts[0] ? parseFloat(parts[0]) : null,
      max: parts[1] ? parseFloat(parts[1]) : null,
    }
  }
  // Greater/less than
  if (value.startsWith(">=")) return { min: parseFloat(value.substring(2)), max: null }
  if (value.startsWith("<=")) return { min: null, max: parseFloat(value.substring(2)) }
  if (value.startsWith(">")) return { min: parseFloat(value.substring(1)) + 0.000001, max: null } // hack pro strict
  if (value.startsWith("<")) return { min: null, max: parseFloat(value.substring(1)) - 0.000001 }

  // Equality (nebo částečná shoda pro text, ale tady jsme v číslech)
  // Pokud je to validní číslo, bereme to jako exact match nebo startsWith?
  // Original code dělá fallback na text match, pokud to není range.
  const floatVal = parseFloat(value)
  if (!isNaN(floatVal)) return { exact: floatVal }

  return null
}

export const numberFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId) as number
  if (typeof cellValue !== "number") return false

  const range = parseNumberRange(String(filterValue))
  if (!range) {
    // Fallback na string match (původní chování)
    return String(cellValue).includes(String(filterValue))
  }

  if (range.exact !== undefined) {
    // Original code u exact match dělá taky text match fallback,
    // ale pokud chceme precizní čísla:
    return cellValue === range.exact || String(cellValue).startsWith(String(filterValue))
  }

  if (range.min !== null && cellValue < range.min) return false
  if (range.max !== null && cellValue > range.max) return false

  return true
}

// Helper for parsing data
// Original code normalizuje na "local midnight"
function parseDate(input: string): Date | null {
  const d = new Date(input)
  if (isNaN(d.getTime())) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export const dateFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId)
  if (!cellValue) return false

  const cellDate = new Date(cellValue as string)
  if (isNaN(cellDate.getTime())) return false
  const normalizedCellDate = new Date(
    cellDate.getFullYear(),
    cellDate.getMonth(),
    cellDate.getDate()
  )

  // Try parsing filterValue jako range
  const val = String(filterValue).trim()

  if (val.includes("..")) {
    const [start, end] = val.split("..")
    const min = start ? parseDate(start) : null
    const max = end ? parseDate(end) : null

    if (min && normalizedCellDate < min) return false
    if (max && normalizedCellDate > max) return false
    return true
  }

  if (val.startsWith(">=")) {
    const min = parseDate(val.substring(2))
    return min ? normalizedCellDate >= min : true
  }
  if (val.startsWith("<=")) {
    const max = parseDate(val.substring(2))
    return max ? normalizedCellDate <= max : true
  }
  if (val.startsWith(">")) {
    const min = parseDate(val.substring(1))
    return min ? normalizedCellDate > min : true
  }
  if (val.startsWith("<")) {
    const max = parseDate(val.substring(1))
    return max ? normalizedCellDate < max : true
  }

  // Equality data
  const exactDate = parseDate(val)
  if (exactDate) {
    return normalizedCellDate.getTime() === exactDate.getTime()
  }

  // Fallback: Text search v formatted date (en-US)
  const formatted = new Intl.DateTimeFormat("en-US").format(normalizedCellDate)
  return formatted.includes(val)
}

export const booleanFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const cellValue = row.getValue(columnId)
  const val = String(filterValue)

  if (val === "true") return cellValue === true
  if (val === "false") return cellValue === false
  return true // 'all' or empty
}
