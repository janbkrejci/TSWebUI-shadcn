"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { TsFormField } from "../ts-form/ts-form-field"
import { TsFieldDef } from "../ts-form/types"
import { Copy, Trash2, Play } from "lucide-react"

/**
 * Definice atributu widgetu pro interaktivní kontroly
 */
export interface WidgetAttribute {
  /** Jméno atributu (odpovídá TsFieldDef property) */
  name: string
  /** Lidsky čitelný popisek */
  label: string
  /** Typ kontroly */
  type: 'string' | 'number' | 'boolean' | 'select' | 'json' | 'textarea'
  /** Výchozí hodnota */
  defaultValue?: any
  /** Možnosti pro select typ */
  options?: { label: string; value: string }[]
  /** Nápověda */
  hint?: string
}

/**
 * Záznam eventu vyhozeného widgetem
 */
interface EventLogEntry {
  id: number
  timestamp: Date
  eventName: string
  detail: any
}

/**
 * Props pro WidgetDemoWrapper komponentu
 */
interface WidgetDemoWrapperProps {
  /** Název widgetu */
  title: string
  /** Popis widgetu */
  description: string
  /** Typ widgetu (fieldDef.type) */
  widgetType: TsFieldDef['type']
  /** Definice atributů pro interaktivní ovládání */
  attributes: WidgetAttribute[]
  /** Výchozí hodnota pole */
  defaultFieldValue?: any
  /** Doplňkové fixní atributy field definice */
  additionalFieldProps?: Partial<TsFieldDef>
  /** Jména eventů k naslouchání */
  watchEvents?: string[]
}

/**
 * WidgetDemoWrapper - univerzální wrapper pro demo stránky widgetů
 * 
 * Poskytuje:
 * - Interaktivní ovládání všech atributů widgetu
 * - Zobrazení změn v reálném čase
 * - Log všech vyvolených eventů
 * - Aktuální hodnotu widgetu
 * - Generovaný JSON konfigurace
 */
export function WidgetDemoWrapper({
  title,
  description,
  widgetType,
  attributes,
  defaultFieldValue,
  additionalFieldProps = {},
  watchEvents = ['change', 'input', 'blur', 'focus'],
}: WidgetDemoWrapperProps) {
  // Stav atributů widgetu
  const [attrValues, setAttrValues] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    attributes.forEach(attr => {
      initial[attr.name] = attr.defaultValue ?? (attr.type === 'boolean' ? false : '')
    })
    return initial
  })

  // Log eventů
  const [eventLog, setEventLog] = React.useState<EventLogEntry[]>([])
  const eventIdRef = React.useRef(0)

  // Reference na widget kontejner pro event listening
  const widgetContainerRef = React.useRef<HTMLDivElement>(null)

  // Aktuální hodnota widgetu
  const [currentValue, setCurrentValue] = React.useState<any>(defaultFieldValue)

  // Form pro widget
  const form = useForm({
    defaultValues: {
      demoField: defaultFieldValue,
    },
  })

  // Sledování změny hodnoty formuláře
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setCurrentValue(value.demoField)
      // Log change event
      logEvent('form-value-change', { value: value.demoField })
    })
    return () => subscription.unsubscribe()
  }, [form])

  /**
   * Zaloguje event do logu
   */
  const logEvent = React.useCallback((eventName: string, detail: any) => {
    eventIdRef.current += 1
    setEventLog(prev => [
      {
        id: eventIdRef.current,
        timestamp: new Date(),
        eventName,
        detail,
      },
      ...prev.slice(0, 99), // Uchovat max 100 záznamů
    ])
  }, [])

  /**
   * Vymaže log eventů
   */
  const clearEventLog = () => {
    setEventLog([])
  }

  /**
   * Aktualizuje hodnotu atributu
   */
  const updateAttribute = (name: string, value: any) => {
    setAttrValues(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Sestaví field definici z aktuálních atributů
   */
  const buildFieldDef = (): TsFieldDef => {
    const def: TsFieldDef = {
      type: widgetType,
      ...additionalFieldProps,
    }

    // Přidat všechny nenulové atributy
    Object.entries(attrValues).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        // Parsovat JSON hodnoty
        if (attributes.find(a => a.name === key)?.type === 'json' && typeof value === 'string') {
          try {
            (def as any)[key] = JSON.parse(value)
          } catch {
            // Nechat jako string pokud není validní JSON
            (def as any)[key] = value
          }
        } else {
          (def as any)[key] = value
        }
      }
    })

    return def
  }

  const fieldDef = buildFieldDef()

  /**
   * Zkopíruje JSON konfigurace do schránky
   */
  const copyJsonConfig = () => {
    const config: Record<string, unknown> = {
      type: widgetType,
      ...attrValues,
    }
    // Odstranit prázdné hodnoty
    Object.keys(config).forEach(key => {
      if (config[key] === '' || config[key] === undefined || config[key] === false) {
        delete config[key]
      }
    })
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    logEvent('config-copied', config)
  }

  /**
   * Reset hodnoty widgetu
   */
  const resetValue = () => {
    form.setValue('demoField', defaultFieldValue)
    setCurrentValue(defaultFieldValue)
    logEvent('value-reset', { value: defaultFieldValue })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Levý sloupec - Widget Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Interaktivní náhled widgetu</CardDescription>
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

            {/* Aktuální hodnota */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Aktuální hodnota:</Label>
                <Button variant="outline" size="sm" onClick={resetValue}>
                  <Trash2 className="h-3 w-3 mr-1" /> Reset
                </Button>
              </div>
              <pre className="p-3 bg-muted rounded-md text-sm overflow-auto max-h-32">
                {JSON.stringify(currentValue, null, 2) || 'undefined'}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Pravý sloupec - Kontroly a JSON */}
        <div className="space-y-6">
          {/* Atributy */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Atributy</CardTitle>
                <Button variant="ghost" size="sm" onClick={copyJsonConfig}>
                  <Copy className="h-3 w-3 mr-1" /> Kopírovat
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

          {/* JSON Konfigurace */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">JSON Konfigurace</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-3 bg-muted rounded-md text-xs overflow-auto max-h-48">
                {JSON.stringify(fieldDef, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Event Log</CardTitle>
            <Button variant="outline" size="sm" onClick={clearEventLog}>
              <Trash2 className="h-3 w-3 mr-1" /> Vymazat
            </Button>
          </div>
          <CardDescription>Zaznamenané eventy z widgetu</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {eventLog.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Zatím žádné eventy. Interagujte s widgetem.
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
 * Kontrolní prvek pro jednotlivý atribut
 */
function AttributeControl({
  attribute,
  value,
  onChange,
}: {
  attribute: WidgetAttribute
  value: any
  onChange: (value: any) => void
}) {
  switch (attribute.type) {
    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm">{attribute.label}</Label>
            {attribute.hint && (
              <p className="text-xs text-muted-foreground">{attribute.hint}</p>
            )}
          </div>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      )

    case 'number':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && (
            <p className="text-xs text-muted-foreground">{attribute.hint}</p>
          )}
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          />
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && (
            <p className="text-xs text-muted-foreground">{attribute.hint}</p>
          )}
          <select
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">-- Vyberte --</option>
            {attribute.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )

    case 'textarea':
    case 'json':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && (
            <p className="text-xs text-muted-foreground">{attribute.hint}</p>
          )}
          <Textarea
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="font-mono text-xs"
            placeholder={attribute.type === 'json' ? '[]' : ''}
          />
        </div>
      )

    case 'string':
    default:
      return (
        <div className="space-y-1.5">
          <Label className="text-sm">{attribute.label}</Label>
          {attribute.hint && (
            <p className="text-xs text-muted-foreground">{attribute.hint}</p>
          )}
          <Input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
  }
}
