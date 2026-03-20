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
  filterExcludeFromSubmit,
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
  activeTab,
  onTabChange,
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

  // Central submission logic - pass action explicitly
  const executeAction = React.useCallback(
    (action: string, data: Record<string, unknown>) => {
      const filteredData = filterExcludeFromSubmit(data, fields)
      onAction?.(action, filteredData)
    },
    [onAction, fields]
  )

  // Track field changes and emit onFieldChange without triggering parent re-render
  const prevValuesRef = React.useRef<Record<string, unknown>>(values ? deepClone(values) : {})
  // Track last seen prop values to only sync when props actually change
  const lastPropValuesRef = React.useRef<Record<string, unknown>>(values ? deepClone(values) : {})

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
        const filteredData = filterExcludeFromSubmit(data as Record<string, unknown>, fields)
        onFieldChange?.(name, val, filteredData)

        // Update internal ref to keep in sync with internal changes
        setNestedValue(prevValuesRef.current, name, val)
      }
    })
    return () => subscription.unsubscribe()
  }, [onFieldChange, form, fields])

  // Update form values when props change surgically to preserve focus and avoid race conditions
  React.useEffect(() => {
    if (!values) return

    const activeElement = document.activeElement as HTMLElement
    const activeFieldName = activeElement?.closest("[data-field]")?.getAttribute("data-field")

    Object.keys(fields).forEach((key) => {
      const path = key as FieldPath<Record<string, unknown>>

      const propValue = getNestedValue(values as Record<string, unknown>, key)
      const lastPropValue = getNestedValue(lastPropValuesRef.current, key)

      // Only sync if the prop itself changed compared to last time we saw it
      if (JSON.stringify(propValue) !== JSON.stringify(lastPropValue)) {
        // Update both refs
        setNestedValue(lastPropValuesRef.current, key, deepClone(propValue))
        setNestedValue(prevValuesRef.current, key, deepClone(propValue))

        // If this field is not currently being edited, sync it to RHF
        if (key !== activeFieldName) {
          form.setValue(path, propValue ?? null, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          })
        }
      }
    })
  }, [values, fields, form])

  // Handle external errors
  React.useEffect(() => {
    if (!errors) {
      if (prevErrorPathsRef.current.size > 0) {
        form.clearErrors()
        prevErrorPathsRef.current.clear()
      }
      return
    }

    const currentErrorPaths = new Set<string>()

    const syncErrors = (errs: TsErrors | string | unknown, currentPath: string = "") => {
      if (!errs || typeof errs !== "object") return

      if (typeof errs === "string") {
        const path = currentPath as FieldPath<Record<string, unknown>>
        const currentInternal = form.getFieldState(path, form.formState).error
        if (currentInternal?.message !== errs) {
          form.setError(path, { type: "manual", message: errs })
        }
        currentErrorPaths.add(currentPath)
        return
      }

      if (Array.isArray(errs)) {
        errs.forEach((item, index) => {
          syncErrors(item, currentPath ? `${currentPath}.${index}` : `${index}`)
        })
        return
      }

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

    prevErrorPathsRef.current.forEach((path) => {
      if (!currentErrorPaths.has(path)) {
        form.clearErrors(path as FieldPath<Record<string, unknown>>)
      }
    })

    prevErrorPathsRef.current = currentErrorPaths
  }, [errors, fields, form])

  // Merge global properties into field definitions
  const mergedFields = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(fields).map(([key, field]) => {
        const merged = { ...field }
        if (readOnly) merged.readonly = true
        if (["number", "date", "datetime"].includes(merged.type) && locale) {
          const lField = merged as { locale?: string }
          if (!lField.locale) lField.locale = locale
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

  // Handle Enter/Escape actions - Scoped to form element
  React.useEffect(() => {
    const el = formRef.current
    if (!el) return

    const handleKeyAction = (e: Event) => {
      if (!(e instanceof CustomEvent)) return
      // In readOnly mode, keyboard actions are disabled (no button bar, no submit)
      if (readOnly) return

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

      // Resolve visible (non-hidden), enabled buttons for keyboard actions
      const visibleButtons = buttons.filter((b) => !b.hidden)

      if (key === "Enter") {
        if (action === "submit") {
          const submitBtn =
            visibleButtons.find((b) => b.type === "submit" && !b.disabled) ||
            visibleButtons.find((b) => !b.disabled)
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

    const handleFieldAction = (e: Event) => {
      if (!(e instanceof CustomEvent)) return
      const { action, data } = e.detail as { action: string; data: Record<string, unknown> }
      if (action) {
        executeAction(action, data || form.getValues())
      }
    }

    el.addEventListener("form-field-action", handleFieldAction)
    el.addEventListener("form-table-action", handleFieldAction)

    return () => {
      el.removeEventListener("form-key-action", handleKeyAction)
      el.removeEventListener("form-field-action", handleFieldAction)
      el.removeEventListener("form-table-action", handleFieldAction)
    }
  }, [form, buttons, executeAction, readOnly])

  const handleButtonClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, btn: TsButton) => {
      e.preventDefault()

      if (btn.type === "reset") {
        form.reset(values || {})
        prevValuesRef.current = values ? deepClone(values) : {}
        executeAction(btn.action, form.getValues() as Record<string, unknown>)
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
    [form, values, executeAction]
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
            disabled={
              (!isConfirmBtn && form.formState.isSubmitting) ||
              (!isConfirmBtn && !!(btn as TsButton).disabled)
            }
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
          <TsFormLayout
            layout={layout}
            fields={mergedFields}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />

          {buttons.length > 0 &&
            !readOnly &&
            (() => {
              const visibleButtons = buttons.filter((b) => !b.hidden)
              if (visibleButtons.length === 0) return null
              return (
                <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t w-full">
                  <div className="flex flex-1 flex-row items-center justify-start gap-2">
                    {renderButtons(visibleButtons.filter((b) => b.position === "left"))}
                  </div>
                  <div className="flex flex-1 flex-row items-center justify-center gap-2">
                    {renderButtons(visibleButtons.filter((b) => b.position === "center"))}
                  </div>
                  <div className="flex flex-1 flex-row items-center justify-end gap-2">
                    {renderButtons(
                      visibleButtons.filter((b) => !b.position || b.position === "right")
                    )}
                  </div>
                </div>
              )
            })()}
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
