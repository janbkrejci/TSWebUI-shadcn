import { TsFormEditor } from "@/components/ts-web-ui/ts-form-editor"

/**
 * Form Editor Page
 * Visual editor for creating forms with support for:
 * - Drag & drop field addition
 * - Mode with or without tabs
 * - Grid layout with multiple columns
 * - Live form preview
 */
export default function FormEditorPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="shrink-0 px-1">
        <h1 className="text-3xl font-bold tracking-tight">Form Editor</h1>
        <p className="text-muted-foreground mt-2">
          Visually build your forms and export the JSON configuration for TsForm.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <TsFormEditor />
      </div>
    </div>
  )
}
