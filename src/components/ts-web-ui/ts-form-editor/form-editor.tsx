"use client"

/**
 * TsFormEditor - Vizuální editor formulářů
 * 
 * Poskytuje kompletní rozhraní pro tvorbu formulářů:
 * - Drag & drop přidávání polí
 * - Podpora tabů a single-page režimu
 * - Grid layout s více poli na řádku
 * - Náhled formuláře v reálném čase
 * - Export/import JSON konfigurace
 */

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVertical,
  Plus,
  Trash2,
  Settings,
  Eye,
  Download,
  Upload,
  Undo2,
  Redo2,
  PanelLeftClose,
  PanelRightClose,
  Copy,
  MoreHorizontal,
  Columns,
  X,
  FileJson,
  RotateCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

import { useFormEditorStore } from "./store"
import { GROUPED_FIELD_TYPES, EditorRow, EditorRowItem, EditorTab } from "./types"
import { TsFieldDef, TsFormButton } from "../ts-form/types"
import { TsForm } from "../ts-form"

/**
 * Hlavní komponenta Form Editoru
 */
export function TsFormEditor() {
  const {
    form,
    selection,
    activeTabIndex,
    setMode,
    addTab,
    removeTab,
    updateTabLabel,
    setActiveTabIndex,
    addRow,
    removeRow,
    addColumnToRow,
    removeColumnFromRow,
    updateColumnWidth,
    addField,
    removeField,
    updateFieldConfig,
    addButton,
    removeButton,
    updateButton,
    setSelection,
    clearSelection,
    importJson,
    exportJson,
    resetForm,
    undo,
    redo,
    history,
    historyIndex,
  } = useFormEditorStore()

  // Stavy UI
  const [showPreview, setShowPreview] = React.useState(false)
  const [showImportDialog, setShowImportDialog] = React.useState(false)
  const [importJsonText, setImportJsonText] = React.useState("")
  const [importError, setImportError] = React.useState("")

  // Sensory pro drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Klávesové zkratky
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorovat pokud jsme v inputu
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      // Delete - smazat vybrané
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection.type === 'field' && selection.id) {
          removeField(selection.id)
        }
      }

      // Ctrl+Z - undo
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z nebo Ctrl+Y - redo
      if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || 
          (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault()
        redo()
      }

      // Escape - zrušit výběr
      if (e.key === 'Escape') {
        clearSelection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selection, removeField, undo, redo, clearSelection])

  /**
   * Získá řádky podle aktuálního režimu
   */
  const getCurrentRows = (): EditorRow[] => {
    if (form.mode === 'single') {
      return form.rows || []
    }
    return form.tabs?.[activeTabIndex]?.rows || []
  }

  /**
   * Zpracuje import JSON
   */
  const handleImport = () => {
    setImportError("")
    const success = importJson(importJsonText)
    if (success) {
      setShowImportDialog(false)
      setImportJsonText("")
    } else {
      setImportError("Neplatný formát JSON. Zkontrolujte strukturu.")
    }
  }

  /**
   * Zkopíruje JSON do schránky
   */
  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportJson())
  }

  /**
   * Stáhne JSON jako soubor
   */
  const handleDownloadJson = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'form-definition.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Nahraje JSON ze souboru
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setImportJsonText(content)
    }
    reader.readAsText(file)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b p-2 bg-muted/30">
          <div className="flex items-center gap-2">
            {/* Mode toggle */}
            <Select value={form.mode} onValueChange={(v: string) => setMode(v as 'tabs' | 'single')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Bez tabů</SelectItem>
                <SelectItem value="tabs">S taby</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* Undo/Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={undo}
                  disabled={historyIndex < 0}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zpět (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Znovu (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Reset */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resetovat formulář</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            {/* Import */}
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import JSON konfigurace</DialogTitle>
                  <DialogDescription>
                    Vložte JSON definici formuláře nebo nahrajte soubor
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                  </div>
                  <Textarea
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"fields": {}, "layout": {}, "buttons": []}'
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {importError && (
                    <p className="text-sm text-destructive">{importError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Zrušit
                  </Button>
                  <Button onClick={handleImport}>Importovat</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCopyJson}>
                  <Copy className="h-4 w-4 mr-2" />
                  Kopírovat do schránky
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadJson}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Stáhnout jako soubor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview */}
            <Button variant="default" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Náhled
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Paleta komponent */}
          <div className="w-64 border-r bg-muted/20 flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Komponenty</h3>
            </div>
            <ScrollArea className="flex-1">
              <Accordion type="multiple" defaultValue={Object.keys(GROUPED_FIELD_TYPES)} className="px-2 py-1">
                {Object.entries(GROUPED_FIELD_TYPES).map(([group, fields]) => (
                  <AccordionItem key={group} value={group} className="border-none">
                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                      {group}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-1 pb-2">
                        {fields.map((field) => (
                          <FieldPaletteItem
                            key={field.type}
                            type={field.type}
                            label={field.label}
                            onAdd={() => {
                              const rows = getCurrentRows()
                              // Přidat do prvního prázdného slotu nebo nového řádku
                              let added = false
                              for (let ri = 0; ri < rows.length && !added; ri++) {
                                for (let ii = 0; ii < rows[ri].items.length && !added; ii++) {
                                  if (rows[ri].items[ii].type === 'empty' && !rows[ri].items[ii].field) {
                                    addField(field.type as TsFieldDef['type'], activeTabIndex, ri, ii)
                                    added = true
                                  }
                                }
                              }
                              if (!added) {
                                // Přidat nový řádek
                                addRow(activeTabIndex)
                                const newRows = getCurrentRows()
                                addField(field.type as TsFieldDef['type'], activeTabIndex, newRows.length - 1, 0)
                              }
                            }}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Taby (pokud mode === 'tabs') */}
              {form.mode === 'tabs' && form.tabs && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {form.tabs.map((tab: EditorTab, index: number) => (
                        <div
                          key={tab.id}
                          className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer border transition-colors",
                            index === activeTabIndex
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted hover:bg-muted/80 border-transparent"
                          )}
                          onClick={() => setActiveTabIndex(index)}
                        >
                          <Input
                            value={tab.label}
                            onChange={(e) => updateTabLabel(index, e.target.value)}
                            className="h-6 w-24 bg-transparent border-none text-center p-0 focus-visible:ring-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {form.tabs && form.tabs.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTab(index)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addTab()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Canvas s řádky */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Layout formuláře</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getCurrentRows().map((row, rowIndex) => (
                      <CanvasRow
                        key={row.id}
                        row={row}
                        rowIndex={rowIndex}
                        tabIndex={activeTabIndex}
                        selection={selection}
                        onSelect={setSelection}
                        onAddField={addField}
                        onRemoveRow={() => removeRow(activeTabIndex, rowIndex)}
                        onAddColumn={() => addColumnToRow(activeTabIndex, rowIndex)}
                        onRemoveColumn={(itemIndex) => removeColumnFromRow(activeTabIndex, rowIndex, itemIndex)}
                        onUpdateColumnWidth={(itemIndex, width) => updateColumnWidth(activeTabIndex, rowIndex, itemIndex, width)}
                        fields={form.fields}
                      />
                    ))}

                    {/* Tlačítko pro přidání řádku */}
                    <Button
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() => addRow(activeTabIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Přidat řádek
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tlačítka formuláře */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Tlačítka</CardTitle>
                    <Button variant="outline" size="sm" onClick={addButton}>
                      <Plus className="h-4 w-4 mr-2" />
                      Přidat
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {form.buttons.map((button: TsFormButton, index: number) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge variant="outline" className="py-1.5 px-3">
                          {button.label}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => removeButton(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 border-l bg-background flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Vlastnosti</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3">
                {selection.type === 'field' && selection.id && form.fields[selection.id] ? (
                  <FieldPropertiesPanel
                    fieldName={selection.id}
                    config={form.fields[selection.id]}
                    onUpdate={(config) => updateFieldConfig(selection.id!, config)}
                    onDelete={() => removeField(selection.id!)}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-10">
                    Vyberte pole pro úpravu vlastností
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Náhled formuláře</DialogTitle>
              <DialogDescription>
                Interaktivní náhled vašeho formuláře
              </DialogDescription>
            </DialogHeader>
            <div className="border rounded-lg p-6">
              <TsForm
                fields={form.fields}
                layout={form.mode === 'tabs' 
                  ? { 
                      tabs: form.tabs?.map((t: EditorTab) => ({ 
                        label: t.label, 
                        rows: t.rows.map((r: EditorRow) => 
                          r.items
                            .filter((item: EditorRowItem) => item.field)
                            .map((item: EditorRowItem) => ({ 
                              field: item.field, 
                              width: item.width 
                            }))
                        ) 
                      })) 
                    }
                  : { 
                      rows: form.rows?.map((r: EditorRow) => 
                        r.items
                          .filter((item: EditorRowItem) => item.field)
                          .map((item: EditorRowItem) => ({ 
                            field: item.field, 
                            width: item.width 
                          }))
                      ) 
                    }
                }
                buttons={form.buttons}
                onSubmit={(data) => console.log('Form submit:', data)}
              />
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">JSON Output:</h4>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-auto max-h-48">
                {exportJson()}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

/**
 * Položka v paletě komponent
 */
function FieldPaletteItem({ 
  type, 
  label, 
  onAdd 
}: { 
  type: string
  label: string
  onAdd: () => void 
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-sm h-8"
      onClick={onAdd}
    >
      <Plus className="h-3 w-3 mr-2" />
      {label}
    </Button>
  )
}

/**
 * Řádek na canvasu
 */
function CanvasRow({
  row,
  rowIndex,
  tabIndex,
  selection,
  onSelect,
  onAddField,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
  onUpdateColumnWidth,
  fields,
}: {
  row: EditorRow
  rowIndex: number
  tabIndex: number
  selection: { type: string | null; id: string | null; rowIndex?: number; itemIndex?: number }
  onSelect: (selection: any) => void
  onAddField: (type: TsFieldDef['type'], tabIndex: number, rowIndex: number, itemIndex: number) => void
  onRemoveRow: () => void
  onAddColumn: () => void
  onRemoveColumn: (itemIndex: number) => void
  onUpdateColumnWidth: (itemIndex: number, width: string) => void
  fields: Record<string, TsFieldDef>
}) {
  return (
    <div className="group flex items-stretch gap-2 p-2 border rounded-md bg-card hover:border-primary/50 transition-colors">
      {/* Grip pro řádek */}
      <div className="flex items-center text-muted-foreground cursor-grab">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Grid items */}
      <div 
        className="flex-1 grid gap-2"
        style={{ gridTemplateColumns: row.items.map(i => i.width || '1fr').join(' ') }}
      >
        {row.items.map((item, itemIndex) => (
          <CanvasCell
            key={item.id}
            item={item}
            itemIndex={itemIndex}
            rowIndex={rowIndex}
            tabIndex={tabIndex}
            isSelected={selection.type === 'field' && selection.id === item.field}
            onSelect={() => {
              if (item.field) {
                onSelect({ type: 'field', id: item.field, tabIndex, rowIndex, itemIndex })
              }
            }}
            onUpdateWidth={(width) => onUpdateColumnWidth(itemIndex, width)}
            fieldConfig={item.field ? fields[item.field] : undefined}
            showRemove={row.items.length > 1}
            onRemove={() => onRemoveColumn(itemIndex)}
          />
        ))}
      </div>

      {/* Akce řádku */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddColumn}>
              <Columns className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Přidat sloupec</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive" 
              onClick={onRemoveRow}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Smazat řádek</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

/**
 * Buňka v řádku (obsahuje pole nebo je prázdná)
 */
function CanvasCell({
  item,
  itemIndex,
  rowIndex,
  tabIndex,
  isSelected,
  onSelect,
  onUpdateWidth,
  fieldConfig,
  showRemove,
  onRemove,
}: {
  item: EditorRowItem
  itemIndex: number
  rowIndex: number
  tabIndex: number
  isSelected: boolean
  onSelect: () => void
  onUpdateWidth: (width: string) => void
  fieldConfig?: TsFieldDef
  showRemove: boolean
  onRemove: () => void
}) {
  const isEmpty = !item.field || item.type === 'empty'

  return (
    <div
      className={cn(
        "relative min-h-[60px] p-2 border rounded transition-colors cursor-pointer",
        isEmpty 
          ? "border-dashed bg-muted/30 hover:bg-muted/50" 
          : "bg-card hover:border-primary/50",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={onSelect}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          <Plus className="h-4 w-4 mr-1" />
          Přetáhněte pole
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate">
              {fieldConfig?.label || item.field}
            </span>
            {showRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {fieldConfig?.type || 'field'}
          </Badge>
        </div>
      )}

      {/* Width selector */}
      {!isEmpty && (
        <div className="absolute bottom-1 right-1">
          <Select value={item.width || '1fr'} onValueChange={onUpdateWidth}>
            <SelectTrigger className="h-5 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1fr">1fr</SelectItem>
              <SelectItem value="2fr">2fr</SelectItem>
              <SelectItem value="3fr">3fr</SelectItem>
              <SelectItem value="100px">100px</SelectItem>
              <SelectItem value="150px">150px</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

/**
 * Panel vlastností pole
 */
function FieldPropertiesPanel({
  fieldName,
  config,
  onUpdate,
  onDelete,
}: {
  fieldName: string
  config: TsFieldDef
  onUpdate: (config: Partial<TsFieldDef>) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Základní info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge>{config.type}</Badge>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            Smazat
          </Button>
        </div>

        <div className="space-y-2">
          <Label>ID pole</Label>
          <Input value={fieldName} disabled className="font-mono text-sm" />
        </div>

        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={config.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Placeholder</Label>
          <Input
            value={config.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Nápověda</Label>
          <Input
            value={config.hint || ''}
            onChange={(e) => onUpdate({ hint: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      {/* Stavy */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Stavy</h4>
        
        <div className="flex items-center justify-between">
          <Label>Povinné</Label>
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked: boolean) => onUpdate({ required: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Zakázané</Label>
          <Switch
            checked={config.disabled || false}
            onCheckedChange={(checked: boolean) => onUpdate({ disabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Pouze pro čtení</Label>
          <Switch
            checked={config.readonly || false}
            onCheckedChange={(checked: boolean) => onUpdate({ readonly: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Skryté</Label>
          <Switch
            checked={config.hidden || false}
            onCheckedChange={(checked: boolean) => onUpdate({ hidden: checked })}
          />
        </div>
      </div>

      {/* Specifické vlastnosti podle typu */}
      {(config.type === 'number' || config.type === 'slider') && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Číslo</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Min</Label>
                <Input
                  type="number"
                  value={config.min ?? ''}
                  onChange={(e) => onUpdate({ min: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max</Label>
                <Input
                  type="number"
                  value={config.max ?? ''}
                  onChange={(e) => onUpdate({ max: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Krok</Label>
                <Input
                  type="number"
                  value={config.step ?? ''}
                  onChange={(e) => onUpdate({ step: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {config.type === 'textarea' && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Počet řádků</Label>
            <Input
              type="number"
              min={1}
              value={config.rows || 3}
              onChange={(e) => onUpdate({ rows: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {(config.type === 'select' || config.type === 'multiselect' || config.type === 'radio' || config.type === 'combobox' || config.type === 'button-group') && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Možnosti (JSON)</Label>
            <Textarea
              value={JSON.stringify(config.options || [], null, 2)}
              onChange={(e) => {
                try {
                  const options = JSON.parse(e.target.value)
                  onUpdate({ options })
                } catch {
                  // Ignorovat neplatný JSON během psaní
                }
              }}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
        </>
      )}

      {(config.type === 'infobox' || config.type === 'markdown') && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Obsah</Label>
            <Textarea
              value={config.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={5}
            />
          </div>
        </>
      )}

      {config.type === 'infobox' && (
        <div className="space-y-2">
          <Label>Varianta</Label>
          <Select
            value={config.variant || 'default'}
            onValueChange={(v: string) => onUpdate({ variant: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

export default TsFormEditor
