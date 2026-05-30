import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

/**
 * Snapshot of the user-controllable TsTable view state that can be persisted across navigation.
 */
export interface PersistedTableState {
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  columnVisibility?: VisibilityState
  columnSizing?: ColumnSizingState
  columnOrder?: ColumnOrderState
  globalFilter?: string
  pagination?: PaginationState
}

const STORAGE_PREFIX = "tswebui:ts-table:"

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null
    return window.localStorage
  } catch {
    // Accessing localStorage can throw (e.g. disabled cookies / privacy mode).
    return null
  }
}

/**
 * Read a previously persisted table state for the given key. Returns null when no key is
 * provided, storage is unavailable, or the stored value is missing/corrupt.
 */
export function loadPersistedTableState(key?: string): PersistedTableState | null {
  if (!key) return null
  const storage = getStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${key}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedTableState
    return parsed && typeof parsed === "object" ? parsed : null
  } catch {
    return null
  }
}

/**
 * Persist the table state for the given key. No-op when no key is provided or storage is
 * unavailable.
 */
export function savePersistedTableState(key: string | undefined, state: PersistedTableState): void {
  if (!key) return
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(state))
  } catch {
    // Quota / serialization errors are non-fatal for a view-state cache.
  }
}
