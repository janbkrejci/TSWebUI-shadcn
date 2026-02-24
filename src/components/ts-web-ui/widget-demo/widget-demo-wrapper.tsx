"use client"

import { Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

import * as React from "react"
import { FormProvider, useForm } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { getComponentRegistryUrl } from "@/lib/registry"

import { TsFormField } from "../ts-form/ts-form-field"
import { TsFieldDef } from "../ts-form/types"

/**
 * Definition of a widget attribute for interactive controls
 */
export interface WidgetAttribute {
  /** Attribute name (corresponds to TsFieldDef property) */
  name: string
  /** Human readable label */
  label: string
  /** Control type */
  type: "string" | "number" | "boolean" | "select" | "json" | "textarea"
  /** Default value */
  defaultValue?: unknown
  /** Options for select type */
  options?: { label: string; value: string }[]
  /** Hint text */
  hint?: string
}

/**
 * Event log entry recorded from the widget
 */
interface EventLogEntry {
  id: number
  timestamp: Date
  eventName: string
  detail: unknown
}

/**
 * Props for the WidgetDemoWrapper component
 */
interface WidgetDemoWrapperProps {
  /** Widget title */
  title: string
  /** Widget description */
  description: string
  /** Widget type (fieldDef.type) */
  widgetType: TsFieldDef["type"]
  /** Attribute definitions for interactive control */
  attributes: WidgetAttribute[]
  /** Default field value */
  defaultFieldValue?: unknown
  /** Additional fixed field definition props */
  additionalFieldProps?: Partial<TsFieldDef>
  /** Event names to watch */
  watchEvents?: string[]
  /** Show installation instructions tab? */
  showInstallTab?: boolean
}

/**
 * WidgetDemoWrapper - universal wrapper for widget demo pages
 */
export function WidgetDemoWrapper({
  title,
  description,
  widgetType,
  attributes,
  defaultFieldValue,
  additionalFieldProps = {},
  showInstallTab = false,
}: WidgetDemoWrapperProps) {
  // Widget attributes state
  const [attrValues, setAttrValues] = React.useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    attributes.forEach((attr) => {
      initial[attr.name] = attr.defaultValue ?? (attr.type === "boolean" ? false : "")
    })
    return initial
  })

  // Event log
  const [eventLog, setEventLog] = React.useState<EventLogEntry[]>([])
  const eventIdRef = React.useRef(0)

  // Widget container reference for event listening
  const widgetContainerRef = React.useRef<HTMLDivElement>(null)

  /**
   * Logs an event to the log
   */
  const logEvent = React.useCallback((eventName: string, detail: unknown) => {
    eventIdRef.current += 1
    setEventLog((prev) => [
      {
        id: eventIdRef.current,
        timestamp: new Date(),
        eventName,
        detail,
      },
      ...prev.slice(0, 99), // Keep max 100 entries
    ])
  }, [])

  // Current widget value
  const [currentValue, setCurrentValue] = React.useState<unknown>(defaultFieldValue)

  // Form for the widget
  const form = useForm({
    defaultValues: {
      demoField: defaultFieldValue,
    },
  })

  // Watch form value changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setCurrentValue(value.demoField)
      // Log change event
      logEvent("form-value-change", { value: value.demoField })
    })
    return () => subscription.unsubscribe()
  }, [form, logEvent])

  /**
   * Clears the event log
   */
  const clearEventLog = () => {
    setEventLog([])
  }

  /**
   * Updates an attribute value
   */
  const updateAttribute = (name: string, value: unknown) => {
    setAttrValues((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Builds the field definition from current attributes
   */
  const buildFieldDef = (): TsFieldDef => {
    const def = {
      type: widgetType,
      ...additionalFieldProps,
    } as TsFieldDef

    // Add all non-null attributes
    Object.entries(attrValues).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        // Parse JSON values
        if (attributes.find((a) => a.name === key)?.type === "json" && typeof value === "string") {
          try {
            ;(def as unknown as Record<string, unknown>)[key] = JSON.parse(value)
          } catch {
            // Keep as string if not valid JSON
            ;(def as unknown as Record<string, unknown>)[key] = value
          }
        } else {
          ;(def as unknown as Record<string, unknown>)[key] = value
        }
      }
    })

    return def
  }

  const fieldDef = buildFieldDef()

  /**
   * Copies JSON config to clipboard
   */
  const copyJsonConfig = () => {
    const config: Record<string, unknown> = {
      type: widgetType,
      ...attrValues,
    }
    // Remove empty values
    Object.keys(config).forEach((key) => {
      if (config[key] === "" || config[key] === undefined || config[key] === false) {
        delete config[key]
      }
    })
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    logEvent("config-copied", config)
  }

  /**
   * Resets widget value
   */
  const resetValue = () => {
    form.setValue("demoField", defaultFieldValue)
    setCurrentValue(defaultFieldValue)
    logEvent("value-reset", { value: defaultFieldValue })
  }

  const registryUrl = getComponentRegistryUrl(widgetType)
  const installCommand = `npx shadcn@latest add ${registryUrl}`

  const previewContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Widget Preview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Interactive widget preview</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={widgetContainerRef} className="p-4 border rounded-lg bg-muted/20">
            <FormProvider {...form}>
              <form>
                <TsFormField name="demoField" fieldDef={fieldDef} />
              </form>
            </FormProvider>
          </div>

          <Separator className="my-4" />

          {/* Current value */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Current value:</Label>
              <Button variant="outline" size="sm" onClick={resetValue}>
                <Trash2 className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
            <pre className="p-3 bg-muted rounded-md text-sm overflow-auto max-h-32">
              {JSON.stringify(currentValue, null, 2) || "undefined"}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Right column - Controls and JSON */}
      <div className="space-y-6">
        {/* Attributes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Attributes</CardTitle>
              <Button variant="ghost" size="sm" onClick={copyJsonConfig}>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {attributes.map((attr) => (
                  <AttributeControl
                    key={attr.name}
                    attribute={attr}
                    value={attrValues[attr.name]}
                    onChange={(value) => updateAttribute(attr.name, value)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* JSON Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">JSON Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 bg-muted rounded-md text-xs overflow-auto max-h-48">
              {JSON.stringify(fieldDef, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {showInstallTab ? (
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="w-fit">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="install">Install</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="pt-4 space-y-6">
            {previewContent}
          </TabsContent>

          <TabsContent value="install" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Component Installation</CardTitle>
                <CardDescription>
                  Use the shadcn CLI to add this component to your project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg relative group">
                  <code className="text-sm font-mono break-all">{installCommand}</code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-8 w-8 text-slate-400 hover:text-slate-50"
                    onClick={() => {
                      navigator.clipboard.writeText(installCommand)
                      toast.success("Command copied to clipboard")
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Note: This command will automatically install all required NPM dependencies and
                  shadcn UI components.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="pt-4">{previewContent}</div>
      )}

      {/* Event Log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Event Log</CardTitle>
            <Button variant="outline" size="sm" onClick={clearEventLog}>
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>
          <CardDescription>Recorded events from the widget</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {eventLog.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No events yet. Interact with the widget.
              </p>
            ) : (
              <div className="space-y-2">
                {eventLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-2 border rounded-md text-sm"
                  >
                    <Badge variant="outline" className="shrink-0">
                      {entry.eventName}
                    </Badge>
                    <span className="text-muted-foreground text-xs shrink-0">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                    <pre className="text-xs overflow-auto flex-1">
                      {JSON.stringify(entry.detail, null, 1)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Control element for an individual attribute
 */
function AttributeControl({
  attribute,
  value,
  onChange,
}: {
  attribute: WidgetAttribute
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (attribute.type) {
    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm">{attribute.label}</Label>
            {attribute.hint && <p className="text-xs text-muted-foreground">{attribute.hint}</p>}
          </div>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      )

    case "number":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && <p className="text-xs text-muted-foreground">{attribute.hint}</p>}
          <Input
            type="number"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>
      )

    case "select":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && <p className="text-xs text-muted-foreground">{attribute.hint}</p>}
          <select
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">-- Select --</option>
            {attribute.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )

    case "textarea":
    case "json":
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && <p className="text-xs text-muted-foreground">{attribute.hint}</p>}
          <Textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="font-mono text-xs"
            placeholder={attribute.type === "json" ? "[]" : ""}
          />
        </div>
      )

    case "string":
    default:
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && <p className="text-xs text-muted-foreground">{attribute.hint}</p>}
          <Input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
  }
}
