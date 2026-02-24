"use client"

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Columns,
  Copy,
  Download,
  Eye,
  FileJson,
  GripVertical,
  Plus,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
  Upload,
  X,
} from "lucide-react"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

import { TsForm } from "../ts-form"
import { TsFieldDef, TsFieldUpdate, TsFormButton, TsInfoboxVariant } from "../ts-form/types"
import { useFormEditorStore } from "./store"
import { EditorRow, EditorRowItem, EditorTab, GROUPED_FIELD_TYPES } from "./types"

/**
 * TsFormEditor - Visual form builder
 *
 * Provides a complete interface for form creation:
 * - Drag & drop field addition
 * - Support for tabs and single-page mode
 * - Grid layout with multiple fields per row
 * - Real-time form preview
 * - JSON configuration export/import
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
    reorderRows,
    addColumnToRow,
    removeColumnFromRow,
    updateColumnWidth,
    addField,
    removeField,
    updateFieldConfig,
    addButton,
    removeButton,
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

  // UI States
  const [showPreview, setShowPreview] = React.useState(false)
  const [showImportDialog, setShowImportDialog] = React.useState(false)
  const [importJsonText, setImportJsonText] = React.useState("")
  const [importError, setImportError] = React.useState("")
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null)
  const [dragType, setActiveDragType] = React.useState<"palette" | "field" | "row" | null>(null)

  // DND setup
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDragId(active.id as string)
    setActiveDragType(active.data.current?.type || "field")
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragId(null)
    setActiveDragType(null)

    if (!over) return

    // SOURCE: Palette
    if (active.data.current?.source === "palette") {
      const fieldType = active.data.current.fieldType

      // TARGET: Cell
      if (over.data.current?.type === "cell") {
        const { rowIndex, itemIndex } = over.data.current
        addField(fieldType, activeTabIndex, rowIndex, itemIndex)
        return
      }

      // TARGET: Row (add to first empty or end)
      if (over.data.current?.type === "row") {
        const { rowIndex } = over.data.current
        addField(fieldType, activeTabIndex, rowIndex, 0)
        return
      }
    }

    // SOURCE: Row (Reordering)
    if (active.data.current?.type === "row" && over.data.current?.type === "row") {
      if (active.id !== over.id) {
        const rows = getCurrentRows()
        const oldIndex = rows.findIndex((r) => r.id === active.id)
        const newIndex = rows.findIndex((r) => r.id === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderRows(activeTabIndex, oldIndex, newIndex)
        }
      }
    }
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        return
      }

      // Delete - delete selected
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selection.type === "field" && selection.id) {
          removeField(selection.id)
        }
      }

      // Ctrl+Z - undo
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z or Ctrl+Y - redo
      if (
        (e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key === "y" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault()
        redo()
      }

      // Escape - cancel selection
      if (e.key === "Escape") {
        clearSelection()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selection, removeField, undo, redo, clearSelection])

  /**
   * Gets rows based on current mode
   */
  const getCurrentRows = (): EditorRow[] => {
    if (form.mode === "single") {
      return form.rows || []
    }
    return form.tabs?.[activeTabIndex]?.rows || []
  }

  /**
   * Processes JSON import
   */
  const handleImport = () => {
    setImportError("")
    const success = importJson(importJsonText)
    if (success) {
      setShowImportDialog(false)
      setImportJsonText("")
    } else {
      setImportError("Invalid JSON format. Check the structure.")
    }
  }

  /**
   * Copies JSON to clipboard
   */
  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportJson())
  }

  /**
   * Downloads JSON as a file
   */
  const handleDownloadJson = () => {
    const blob = new Blob([exportJson()], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "form-definition.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Uploads JSON from a file
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
            <Select
              value={form.mode}
              onValueChange={(v: string) => setMode(v as "tabs" | "single")}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">No tabs</SelectItem>
                <SelectItem value="tabs">With tabs</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6" />

            {/* Undo/Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex < 0}>
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
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
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Reset */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset form</TooltipContent>
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
                  <DialogTitle>Import JSON Configuration</DialogTitle>
                  <DialogDescription>Paste JSON form definition or upload a file</DialogDescription>
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
                  {importError && <p className="text-sm text-destructive">{importError}</p>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImport}>Import</Button>
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
                  Copy to clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadJson}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Download as file
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview */}
            <Button variant="default" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Component Palette */}
          <div className="w-64 border-r bg-muted/20 flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Components</h3>
            </div>
            <ScrollArea className="flex-1">
              <Accordion
                type="multiple"
                defaultValue={Object.keys(GROUPED_FIELD_TYPES)}
                className="px-2 py-1"
              >
                {Object.entries(GROUPED_FIELD_TYPES).map(([group, fields]) => (
                  <AccordionItem key={group} value={group} className="border-none">
                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                      {group}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-1 pb-2">
                        {fields.map((field) => (
                          <FieldPaletteItem
                            key={field.type}
                            type={field.type}
                            label={field.label}
                            icon={field.icon}
                            onAdd={() => {
                              const rows = getCurrentRows()
                              // Add to the first empty slot or new row
                              let added = false
                              for (let ri = 0; ri < rows.length && !added; ri++) {
                                for (let ii = 0; ii < rows[ri].items.length && !added; ii++) {
                                  if (
                                    rows[ri].items[ii].type === "empty" &&
                                    !rows[ri].items[ii].field
                                  ) {
                                    addField(
                                      field.type as TsFieldDef["type"],
                                      activeTabIndex,
                                      ri,
                                      ii
                                    )
                                    added = true
                                  }
                                }
                              }
                              if (!added) {
                                // Add new row
                                addRow(activeTabIndex)
                                const newRows = getCurrentRows()
                                addField(
                                  field.type as TsFieldDef["type"],
                                  activeTabIndex,
                                  newRows.length - 1,
                                  0
                                )
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Tabs (if mode === 'tabs') */}
                {form.mode === "tabs" && form.tabs && (
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

                {/* Canvas with rows */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Form Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SortableContext
                      items={getCurrentRows().map((r) => r.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 min-h-[200px]">
                        {getCurrentRows().map((row, rowIndex) => (
                          <CanvasRow
                            key={row.id}
                            row={row}
                            rowIndex={rowIndex}
                            tabIndex={activeTabIndex}
                            selection={selection}
                            onSelect={setSelection}
                            onRemoveRow={() => removeRow(activeTabIndex, rowIndex)}
                            onAddColumn={() => addColumnToRow(activeTabIndex, rowIndex)}
                            onRemoveColumn={(itemIndex) =>
                              removeColumnFromRow(activeTabIndex, rowIndex, itemIndex)
                            }
                            onUpdateColumnWidth={(itemIndex, width) =>
                              updateColumnWidth(activeTabIndex, rowIndex, itemIndex, width)
                            }
                            fields={form.fields}
                          />
                        ))}

                        {/* Button to add row */}
                        <Button
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={() => addRow(activeTabIndex)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add row
                        </Button>
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>

                {/* Form Buttons */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Buttons</CardTitle>
                      <Button variant="outline" size="sm" onClick={addButton}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {form.buttons.map((button: TsFormButton, index: number) => (
                        <div key={index} className="flex items-center gap-1 group relative">
                          <Badge
                            variant="outline"
                            className={cn(
                              "py-1.5 px-3 cursor-pointer hover:border-primary transition-colors",
                              selection.type === "button" && selection.itemIndex === index
                                ? "border-primary ring-1 ring-primary"
                                : ""
                            )}
                            onClick={() =>
                              setSelection({ type: "button", id: "button", itemIndex: index })
                            }
                          >
                            {button.label}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeButton(index)
                              }}
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

              <DragOverlay dropAnimation={null}>
                {activeDragId ? (
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-2xl opacity-90 cursor-grabbing flex items-center gap-2 border-2 border-primary-foreground/20">
                    <GripVertical className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">
                      {dragType === "palette"
                        ? `Adding ${String(activeDragId).replace("palette-", "")}...`
                        : "Moving row..."}
                    </span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Properties Panel */}
          <div className="w-80 border-l bg-background flex flex-col">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Properties</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3">
                {selection.type === "field" && selection.id && form.fields[selection.id] ? (
                  <FieldPropertiesPanel
                    fieldName={selection.id}
                    config={form.fields[selection.id]}
                    onUpdate={(config) => updateFieldConfig(selection.id!, config)}
                    onDelete={() => removeField(selection.id!)}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-10">
                    Select a field to edit properties
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
              <DialogTitle>Form Preview</DialogTitle>
              <DialogDescription>Interactive preview of your form</DialogDescription>
            </DialogHeader>
            <div className="border rounded-lg p-6">
              <TsForm
                fields={form.fields}
                layout={
                  form.mode === "tabs"
                    ? {
                        tabs: form.tabs?.map((t: EditorTab) => ({
                          label: t.label,
                          rows: t.rows.map((r: EditorRow) =>
                            r.items
                              .filter((item: EditorRowItem) => item.field)
                              .map((item: EditorRowItem) => ({
                                field: item.field,
                                width: item.width,
                              }))
                          ),
                        })),
                      }
                    : {
                        rows: form.rows?.map((r: EditorRow) =>
                          r.items
                            .filter((item: EditorRowItem) => item.field)
                            .map((item: EditorRowItem) => ({
                              field: item.field,
                              width: item.width,
                            }))
                        ),
                      }
                }
                buttons={form.buttons}
                onSubmit={(data) => console.log("Form submit:", data)}
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
 * Item in the component palette
 */
function FieldPaletteItem({
  type,
  label,
  icon: Icon,
  onAdd,
}: {
  type: string
  label: string
  icon: React.ElementType
  onAdd: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      source: "palette",
      fieldType: type,
      type: "palette",
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "group flex flex-col items-center justify-center p-2 rounded-md border bg-card hover:border-primary/50 hover:bg-accent transition-all cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 border-primary"
      )}
      onClick={onAdd}
    >
      <Icon className="h-5 w-5 mb-1 text-muted-foreground group-hover:text-primary" />
      <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
    </div>
  )
}

/**
 * Row on the canvas
 */
function CanvasRow({
  row,
  rowIndex,
  tabIndex,
  selection,
  onSelect,
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
  onSelect: (selection: {
    type: "field"
    id: string
    tabIndex: number
    rowIndex: number
    itemIndex: number
  }) => void
  onRemoveRow: () => void
  onAddColumn: () => void
  onRemoveColumn: (itemIndex: number) => void
  onUpdateColumnWidth: (itemIndex: number, width: string) => void
  fields: Record<string, TsFieldDef>
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    data: {
      type: "row",
      rowIndex,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-stretch gap-2 p-2 border rounded-md bg-card hover:border-primary/50 transition-colors",
        isDragging && "opacity-50 border-primary z-50"
      )}
    >
      {/* Row grip */}
      <div
        className="flex items-center text-muted-foreground cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Grid items */}
      <div
        className="flex-1 grid gap-2"
        style={{ gridTemplateColumns: row.items.map((i) => i.width || "1fr").join(" ") }}
      >
        {row.items.map((item, itemIndex) => (
          <CanvasCell
            key={item.id}
            item={item}
            tabIndex={tabIndex}
            rowIndex={rowIndex}
            itemIndex={itemIndex}
            isSelected={selection.type === "field" && selection.id === item.field}
            onSelect={() => {
              if (item.field) {
                onSelect({ type: "field", id: item.field, tabIndex, rowIndex, itemIndex })
              }
            }}
            onUpdateWidth={(width) => onUpdateColumnWidth(itemIndex, width)}
            fieldConfig={item.field ? fields[item.field] : undefined}
            showRemove={row.items.length > 1}
            onRemove={() => onRemoveColumn(itemIndex)}
          />
        ))}
      </div>

      {/* Row actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddColumn}>
              <Columns className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add column</TooltipContent>
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
          <TooltipContent>Delete row</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

/**
 * Cell in a row (contains a field or is empty)
 */
function CanvasCell({
  item,
  isSelected,
  onSelect,
  onUpdateWidth,
  fieldConfig,
  showRemove,
  onRemove,
  tabIndex,
  rowIndex,
  itemIndex,
}: {
  item: EditorRowItem
  isSelected: boolean
  onSelect: () => void
  onUpdateWidth: (width: string) => void
  fieldConfig?: TsFieldDef
  showRemove: boolean
  onRemove: () => void
  tabIndex: number
  rowIndex: number
  itemIndex: number
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: item.id,
    data: {
      type: "cell",
      tabIndex,
      rowIndex,
      itemIndex,
    },
  })

  const isEmpty = !item.field || item.type === "empty"

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative min-h-[60px] p-2 border rounded transition-all cursor-pointer",
        isEmpty ? "border-dashed bg-muted/30 hover:bg-muted/50" : "bg-card hover:border-primary/50",
        isSelected && "ring-2 ring-primary border-primary",
        isOver && "bg-primary/10 border-primary border-solid scale-[1.02] shadow-sm"
      )}
      onClick={onSelect}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          <Plus className="h-4 w-4 mr-1" />
          Drag a field here
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate">{fieldConfig?.label || item.field}</span>
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
            {fieldConfig?.type || "field"}
          </Badge>
        </div>
      )}

      {/* Width selector */}
      {!isEmpty && (
        <div className="absolute bottom-1 right-1">
          <Select value={item.width || "1fr"} onValueChange={onUpdateWidth}>
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
 * Field properties panel
 */
function FieldPropertiesPanel({
  fieldName,
  config,
  onUpdate,
  onDelete,
}: {
  fieldName: string
  config: TsFieldDef
  onUpdate: (config: TsFieldUpdate) => void
  onDelete: () => void
}) {
  const { form, selection, updateButton } = useFormEditorStore()

  // If a button is selected, show button properties
  if (selection.type === "button" && selection.itemIndex !== undefined) {
    const button = form.buttons[selection.itemIndex]
    if (!button) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge>Button</Badge>
        </div>

        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={button.label}
            onChange={(e) => updateButton(selection.itemIndex!, { label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Action</Label>
          <Input
            value={button.action}
            onChange={(e) => updateButton(selection.itemIndex!, { action: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Variant</Label>
          <Select
            value={button.variant || "default"}
            onValueChange={(v) =>
              updateButton(selection.itemIndex!, { variant: v as TsFormButton["variant"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={button.type || "button"}
            onValueChange={(v) =>
              updateButton(selection.itemIndex!, { type: v as TsFormButton["type"] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="button">Normal Button</SelectItem>
              <SelectItem value="submit">Submit Form</SelectItem>
              <SelectItem value="reset">Reset Form</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  // Cast to TsFieldUpdate for reading optional properties that not every field type carries
  // (e.g. placeholder on checkbox). Type-specific properties are accessed via narrowed config below.
  const configProps = config as TsFieldUpdate
  return (
    <div className="space-y-4">
      {/* Basic info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge>{config.type}</Badge>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Field ID</Label>
          <Input value={fieldName} disabled className="font-mono text-sm" />
        </div>

        <div className="space-y-2">
          <Label>Label</Label>
          <Input value={config.label || ""} onChange={(e) => onUpdate({ label: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label>Placeholder</Label>
          <Input
            value={configProps.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Hint</Label>
          <Input value={config.hint || ""} onChange={(e) => onUpdate({ hint: e.target.value })} />
        </div>
      </div>

      <Separator />

      {/* States */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">States</h4>

        <div className="flex items-center justify-between">
          <Label>Required</Label>
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked: boolean) => onUpdate({ required: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Disabled</Label>
          <Switch
            checked={config.disabled || false}
            onCheckedChange={(checked: boolean) => onUpdate({ disabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Read-only</Label>
          <Switch
            checked={config.readonly || false}
            onCheckedChange={(checked: boolean) => onUpdate({ readonly: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Hidden</Label>
          <Switch
            checked={config.hidden || false}
            onCheckedChange={(checked: boolean) => onUpdate({ hidden: checked })}
          />
        </div>
      </div>

      {/* Type-specific properties */}
      {(config.type === "number" || config.type === "slider") && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Number</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Min</Label>
                <Input
                  type="number"
                  value={config.min ?? ""}
                  onChange={(e) =>
                    onUpdate({ min: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max</Label>
                <Input
                  type="number"
                  value={config.max ?? ""}
                  onChange={(e) =>
                    onUpdate({ max: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Step</Label>
                <Input
                  type="number"
                  value={config.step ?? ""}
                  onChange={(e) =>
                    onUpdate({ step: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}

      {config.type === "textarea" && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Row count</Label>
            <Input
              type="number"
              min={1}
              value={config.rows || 3}
              onChange={(e) => onUpdate({ rows: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {(config.type === "select" ||
        config.type === "multiselect" ||
        config.type === "radio" ||
        config.type === "combobox" ||
        config.type === "button-group") && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Options (JSON)</Label>
            <Textarea
              value={JSON.stringify(config.options || [], null, 2)}
              onChange={(e) => {
                try {
                  const options = JSON.parse(e.target.value)
                  onUpdate({ options })
                } catch {
                  // Ignore invalid JSON while typing
                }
              }}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
        </>
      )}

      {(config.type === "infobox" || config.type === "markdown") && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={(config.value as string) || config.content || ""}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={5}
            />
          </div>
        </>
      )}

      {config.type === "infobox" && (
        <div className="space-y-2">
          <Label>Variant</Label>
          <Select
            value={config.variant || "default"}
            onValueChange={(v) => onUpdate({ variant: v as TsInfoboxVariant })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="information">Information</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {config.type === "button-group" && (
        <div className="space-y-2">
          <Label>Visual Style</Label>
          <Select
            value={config.variant || ""}
            onValueChange={(v) => onUpdate({ variant: v as "process" | undefined })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Standard</SelectItem>
              <SelectItem value="process">Process (Chevron)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {config.type === "relationship" && (
        <div className="space-y-3">
          <Separator />
          <h4 className="font-medium text-sm">Relationship</h4>
          <div className="space-y-2">
            <Label className="text-xs">Target Entity</Label>
            <Input
              value={config.targetEntity || ""}
              onChange={(e) => onUpdate({ targetEntity: e.target.value })}
              placeholder="e.g. users"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Selection Mode</Label>
            <Select
              value={config.mode || "single"}
              onValueChange={(v) => onUpdate({ mode: v as "single" | "multiple" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="multiple">Multiple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {config.type === "table" && (
        <div className="space-y-3">
          <Separator />
          <h4 className="font-medium text-sm">Table Configuration</h4>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Show Create Button</Label>
            <Switch
              checked={config.showCreateButton || false}
              onCheckedChange={(checked) => onUpdate({ showCreateButton: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Columns (JSON)</Label>
            <Textarea
              value={JSON.stringify(config.columns || [], null, 2)}
              onChange={(e) => {
                try {
                  const columns = JSON.parse(e.target.value)
                  onUpdate({ columns })
                } catch {
                  /* ignore */
                }
              }}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TsFormEditor
