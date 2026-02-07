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
export type {
  EditorField,
  EditorRowItem,
  EditorRow,
  EditorTab,
  EditorFormDefinition,
  EditorSelection,
} from "./types"
export type { FormEditorState } from "./store"
export { useFormEditorStore } from "./store"
export { AVAILABLE_FIELD_TYPES, GROUPED_FIELD_TYPES } from "./types"
