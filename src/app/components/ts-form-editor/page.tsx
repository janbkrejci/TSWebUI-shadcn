"use client"
import { TsFormEditor } from "@/components/ts-web-ui/ts-form-editor"

export default function EditorPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
        <div>
            <h1 className="text-3xl font-bold">Form Editor</h1>
            <p className="text-muted-foreground mt-2">
                Drag-and-drop form builder producing JSON configuration for TsForm.
            </p>
        </div>
        <div className="flex-1 min-h-0">
             <TsFormEditor />
        </div>
    </div>
  )
}
