"use client"

import { Loader2 } from "lucide-react"

import * as React from "react"
import { type FieldPath, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { TsFormConfirmationDialog } from "./ts-form-confirmation-dialog"
import { TsFormLayout } from "./ts-form-layout"
import { TsButton, TsConfirmation, TsErrors, TsFormProps } from "./types"
import {
  deepClone,
  deleteNestedKey,
  getButtonVariantClasses,
  getNestedValue,
  setNestedValue,
} from "./utils"

export function TsForm({
  layout,
  fields,
  values,
  buttons = [],
  errors,
  onAction,
  onFieldChange,
  readOnly = false,
  className,
  locale,
}: TsFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null)

  // 1. Initialize Form
  const form = useForm<Record<string, unknown>>({
    defaultValues: values || {},
  })

  // Track field changes and emit onFieldChange without triggering parent re-render
  // Store previous values as deep object to match RHF structure
  const prevValuesRef = React.useRef<Record<string, unknown>>(values ? deepClone(values) : {})

  // Track paths that have manual errors from props to allow efficient cleanup
  const prevErrorPathsRef = React.useRef<Set<string>>(new Set())

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((data, { name }) => {
      // name is undefined if the whole form is reset or changed, we only care about field-level changes
      if (name) {
        // Prototype pollution protection for incoming field names
        if (name === "__proto__" || name === "constructor" || name === "prototype") {
          return
        }

        const val = getNestedValue(data as Record<string, unknown>, name)
        onFieldChange?.(name, val, data as Record<string, unknown>)

        // Update ref to keep in sync with internal changes using deep set
        setNestedValue(prevValuesRef.current, name, val)
      }
    })
    return () => subscription.unsubscribe()
  }, [onFieldChange, form])

  // Update form values when props change surgically to preserve focus and avoid race conditions
  React.useEffect(() => {
    if (!values) return

    let hasChanged = false
    const activeElement = document.activeElement as HTMLElement
    // Find the field name by looking at the closest container with data-field attribute
    // This is more robust than activeElement.name for complex widgets
    const activeFieldName = activeElement?.closest("[data-field]")?.getAttribute("data-field")

    // Iterate over defined fields to check for changes (deep-path aware)
    Object.keys(fields).forEach((key) => {
      const path = key as FieldPath<Record<string, unknown>>

      // Skip synchronization ONLY for the field that currently has focus
      // to avoid cursor jumping. We allow updates for 'isDirty' fields if they are not active,
      // as the parent component's state should be the ultimate source of truth.
      if (key === activeFieldName) return

      const propValue = getNestedValue(values as Record<string, unknown>, key)
      const internalValue = getNestedValue(prevValuesRef.current, key)

      // Use basic comparison for primitives, assume object reference change means update
      if (propValue !== internalValue) {
        hasChanged = true
        form.setValue(path, propValue ?? null, {
          shouldDirty: false, // Maintain dirty state if it was already dirty
          shouldTouch: false,
          shouldValidate: false,
        })
        setNestedValue(prevValuesRef.current, key, propValue)
      }
    })

    if (hasChanged) {
      // Sync the whole ref as a fallback for any missed keys or deep structures
      prevValuesRef.current = deepClone(values)
    }
  }, [values, fields, form])

  // Handle external errors with cleanup and efficiency
  React.useEffect(() => {
    if (!errors) {
      if (prevErrorPathsRef.current.size > 0) {
        form.clearErrors()
        prevErrorPathsRef.current.clear()
      }
      return
    }

    const currentErrorPaths = new Set<string>()

    // Recursively discover and set error messages
    const syncErrors = (errs: TsErrors | string | unknown, currentPath: string = "") => {
      if (!errs || typeof errs !== "object") return

      // Direct string error message at path
      if (typeof errs === "string") {
        const path = currentPath as FieldPath<Record<string, unknown>>
        const currentInternal = form.getFieldState(path, form.formState).error
        if (currentInternal?.message !== errs) {
          form.setError(path, { type: "manual", message: errs })
        }
        currentErrorPaths.add(currentPath)
        return
      }

      // Handle arrays of errors
      if (Array.isArray(errs)) {
        errs.forEach((item, index) => {
          syncErrors(item, currentPath ? `${currentPath}.${index}` : `${index}`)
        })
        return
      }

      // Handle nested error objects or RHF-style { message: "..." } objects
      const errorObj = errs as Record<string, unknown>
      Object.keys(errorObj).forEach((key) => {
        const val = errorObj[key]
        const newPath = currentPath ? `${currentPath}.${key}` : key

        if (typeof val === "string") {
          const path = newPath as FieldPath<Record<string, unknown>>
          const currentInternal = form.getFieldState(path, form.formState).error
          if (currentInternal?.message !== val) {
            form.setError(path, { type: "manual", message: val })
          }
          currentErrorPaths.add(newPath)
        } else if (val && typeof val === "object") {
          const nestedVal = val as Record<string, unknown>
          if (typeof nestedVal.message === "string") {
            const path = newPath as FieldPath<Record<string, unknown>>
            const currentInternal = form.getFieldState(path, form.formState).error
            if (currentInternal?.message !== nestedVal.message) {
              form.setError(path, { type: "manual", message: nestedVal.message as string })
            }
            currentErrorPaths.add(newPath)
          } else {
            syncErrors(val, newPath)
          }
        }
      })
    }

    syncErrors(errors)

    // Flat key support for errors object root (e.g. { "items.0.name": "error" })
    const errorsDict = errors as Record<string, unknown>
    Object.keys(errorsDict).forEach((path) => {
      if (path.includes(".") && !currentErrorPaths.has(path)) {
        const message = getNestedValue(errorsDict, path)
        if (typeof message === "string") {
          const fieldPath = path as FieldPath<Record<string, unknown>>
          const currentInternal = form.getFieldState(fieldPath, form.formState).error
          if (currentInternal?.message !== message) {
            form.setError(fieldPath, { type: "manual", message })
          }
          currentErrorPaths.add(path)
        }
      }
    })

    // Efficient cleanup: Clear only those paths that were previously manual errors
    // but are no longer present in current error set.
    prevErrorPathsRef.current.forEach((path) => {
      if (!currentErrorPaths.has(path)) {
        form.clearErrors(path as FieldPath<Record<string, unknown>>)
      }
    })

    // Store current paths for next sync
    prevErrorPathsRef.current = currentErrorPaths
  }, [errors, fields, form])

  // Merge global properties into field definitions
  const mergedFields = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(fields).map(([key, field]) => {
        const merged = { ...field }
        if (readOnly) merged.readonly = true
        // Propagate global locale if not field-specific
        if (merged.type === "number" && !merged.locale && locale) {
          merged.locale = locale
        }
        return [key, merged]
      })
    )
  }, [fields, readOnly, locale])

  // Confirmation State
  const [confirmation, setConfirmation] = React.useState<{
    isOpen: boolean
    config: TsConfirmation | null
    pendingAction: string | null
    pendingData: Record<string, unknown> | null
  }>({ isOpen: false, config: null, pendingAction: null, pendingData: null })

  // Central submission logic - pass action explicitly
  const executeAction = React.useCallback(
    (action: string, data: Record<string, unknown>) => {
      const filteredData = deepClone(data)

      const keysToDelete = Object.keys(fields).filter((k) => fields[k]?.excludeFromSubmit)

      const arrayPaths: Record<string, number[]> = {}
      const simplePaths: string[] = []

      keysToDelete.forEach((path) => {
        // Support any array index in path (not just at the end), e.g. "users.0.tags.1"
        // We match all groups of digits that follow a dot
        const parts = path.split(".")
        let hasArrayIdx = false
        for (let i = parts.length - 1; i >= 0; i--) {
          if (/^\d+$/.test(parts[i])) {
            const parent = parts.slice(0, i).join(".")
            const index = parseInt(parts[i], 10)
            if (!arrayPaths[parent]) arrayPaths[parent] = []
            if (!arrayPaths[parent].includes(index)) arrayPaths[parent].push(index)
            hasArrayIdx = true
            // We break because deleting parent array element removes the child path
            break
          }
        }
        if (!hasArrayIdx) {
          simplePaths.push(path)
        }
      })

      // 1. Delete simple flat paths first
      simplePaths.forEach((p) => deleteNestedKey(filteredData, p))

      // 2. Delete array indices FROM END TO START for each array level
      // to maintain correct indices for remaining elements
      Object.keys(arrayPaths)
        .sort((a, b) => b.length - a.length)
        .forEach((parent) => {
          arrayPaths[parent]
            .sort((a, b) => b - a)
            .forEach((index) => {
              deleteNestedKey(filteredData, `${parent}.${index}`)
            })
        })

      onAction?.(action, filteredData)
    },
    [onAction, fields]
  )

  // Handle Enter/Escape actions - Scoped to form element
  React.useEffect(() => {
    const el = formRef.current
    if (!el) return

    const handleKeyAction = (e: Event) => {
      if (!(e instanceof CustomEvent)) return

      const detail = e.detail as {
        key: string
        action: string
        field: string
        value?: unknown
      }
      const { key, action, field, value } = detail

      if (value !== undefined) {
        const currentValue = form.getValues(field as FieldPath<Record<string, unknown>>)
        if (currentValue !== value) {
          form.setValue(field as FieldPath<Record<string, unknown>>, value, { shouldDirty: true })
        }
      }

      const currentValues = form.getValues() as Record<string, unknown>
      if (value !== undefined) {
        setNestedValue(currentValues, field, value)
      }

      if (key === "Enter") {
        if (action === "submit") {
          const submitBtn = buttons.find((b) => b.type === "submit") || buttons[0]
          if (submitBtn) {
            if (submitBtn.confirmation) {
              setConfirmation({
                isOpen: true,
                config: submitBtn.confirmation!,
                pendingAction: submitBtn.action,
                pendingData: currentValues,
              })
            } else {
              executeAction(submitBtn.action, currentValues)
            }
          }
        } else if (action === "focus:next") {
          const inputs = Array.from(
            el.querySelectorAll('input:not([type="hidden"]), textarea, select, button')
          ).filter((el) => {
            const htmlEl = el as HTMLElement & { disabled?: boolean; tabIndex: number }
            return !htmlEl.disabled && htmlEl.tabIndex !== -1 && htmlEl.offsetParent !== null
          })
          const currentIndex = inputs.indexOf(e.target as Element)
          if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
            ;(inputs[currentIndex + 1] as HTMLElement).focus()
          }
        } else if (action) {
          executeAction(action, currentValues)
        }
      } else if (key === "Escape") {
        if (action === "cancel") {
          executeAction(action, currentValues)
        } else if (action) {
          executeAction(action, currentValues)
        }
      }
    }

    el.addEventListener("form-key-action", handleKeyAction)
    return () => el.removeEventListener("form-key-action", handleKeyAction)
  }, [form, buttons, executeAction])

  const handleButtonClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, btn: TsButton) => {
      e.preventDefault()

      if (btn.type === "reset") {
        form.reset(values || {})
        prevValuesRef.current = values ? deepClone(values) : {}
        onAction?.(btn.action, form.getValues())
        return
      }

      const proceed = (data: Record<string, unknown>) => {
        if (btn.confirmation) {
          setConfirmation({
            isOpen: true,
            config: btn.confirmation,
            pendingAction: btn.action,
            pendingData: data,
          })
        } else {
          executeAction(btn.action, data)
        }
      }

      if (!btn.type || btn.type === "submit") {
        form.handleSubmit(proceed)(e)
      } else {
        proceed(form.getValues() as Record<string, unknown>)
      }
    },
    [form, values, executeAction, onAction]
  )

  const handleConfirmationAction = React.useCallback(
    (btnConfig: { action: string; confirm?: boolean }) => {
      if (btnConfig.confirm && confirmation.pendingAction && confirmation.pendingData) {
        executeAction(confirmation.pendingAction, confirmation.pendingData)
      }
      setConfirmation((prev) => ({ ...prev, isOpen: false }))
    },
    [confirmation.pendingAction, confirmation.pendingData, executeAction]
  )

  const renderButtons = React.useCallback(
    (btns: (TsButton | TsConfirmation["buttons"][0])[]) => {
      return btns.map((btn, idx) => {
        const { variant, className: customClass } = getButtonVariantClasses(btn.variant)
        const isConfirmBtn = "confirm" in btn

        return (
          <Button
            key={idx}
            type="button"
            variant={variant}
            className={customClass}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (isConfirmBtn) {
                handleConfirmationAction(btn as TsConfirmation["buttons"][0])
              } else {
                handleButtonClick(e, btn as TsButton)
              }
            }}
            disabled={!isConfirmBtn && form.formState.isSubmitting}
          >
            {!isConfirmBtn && form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {btn.label}
          </Button>
        )
      })
    },
    [form.formState.isSubmitting, handleConfirmationAction, handleButtonClick]
  )

  return (
    <>
      <Form {...form}>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className={className}>
          <TsFormLayout layout={layout} fields={mergedFields} />

          {buttons.length > 0 && !readOnly && (
            <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t w-full">
              <div className="flex flex-1 flex-row items-center justify-start gap-2">
                {renderButtons(buttons.filter((b) => b.position === "left"))}
              </div>
              <div className="flex flex-1 flex-row items-center justify-center gap-2">
                {renderButtons(buttons.filter((b) => b.position === "center"))}
              </div>
              <div className="flex flex-1 flex-row items-center justify-end gap-2">
                {renderButtons(buttons.filter((b) => !b.position || b.position === "right"))}
              </div>
            </div>
          )}
        </form>
      </Form>

      <TsFormConfirmationDialog
        isOpen={confirmation.isOpen}
        onOpenChange={(open) => setConfirmation((prev) => ({ ...prev, isOpen: open }))}
        config={confirmation.config}
        renderButtons={renderButtons}
      />
    </>
  )
}
