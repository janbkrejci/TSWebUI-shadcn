/**
 * TsFormEditor
 *
 * Visual editor for creating forms with support for:
 * - Drag & drop field addition
 * - Mode with or without tabs
 * - Grid layout with multiple columns
 * - Live form preview
 * - Export/import JSON configuration
 */

export { TsFormEditor } from "./form-editor"
export type { FormEditorState } from "./store"
export { useFormEditorStore } from "./store"
export type {
  EditorField,
  EditorFormDefinition,
  EditorRow,
  EditorRowItem,
  EditorSelection,
  EditorTab,
} from "./types"
export { AVAILABLE_FIELD_TYPES, GROUPED_FIELD_TYPES } from "./types"
