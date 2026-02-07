/**
 * Stránka Form Editoru
 * 
 * Vizuální editor pro tvorbu formulářů s podporou:
 * - Drag & drop přidávání polí
 * - Režim s taby nebo bez tabů
 * - Grid layout s více sloupci
 * - Live náhled formuláře
 * - Export/import JSON konfigurace
 */

import { TsFormEditor } from "@/components/ts-web-ui/ts-form-editor"

export default function FormEditorPage() {
  return (
    <div className="h-[calc(100vh-80px)]">
      <TsFormEditor />
    </div>
  )
}
