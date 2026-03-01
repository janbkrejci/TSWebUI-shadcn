"use client"

import { Loader2 } from "lucide-react"

import * as React from "react"
import { type FieldPath, useForm } from "react-hook-form"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { TsFormLayout } from "./ts-form-layout"
import { TsFormButton, TsFormConfirmation, TsFormProps } from "./types"

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
}: TsFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null)

  // 1. Initialize Form
  const form = useForm<Record<string, unknown>>({
    defaultValues: values || {},
  })

  // Track field changes and emit onFieldChange
  const watchedValues = form.watch()
  const prevValuesRef = React.useRef<Record<string, unknown>>(values || {})

  React.useEffect(() => {
    const currentValues = form.getValues()
    Object.keys(currentValues).forEach((key) => {
      if (currentValues[key] !== prevValuesRef.current[key]) {
        // Clear manual error for the changed field
        form.clearErrors(key as FieldPath<Record<string, unknown>>)
        onFieldChange?.(key, currentValues[key], currentValues)
      }
    })
    prevValuesRef.current = { ...currentValues }
  }, [watchedValues, onFieldChange, form])

  // Update form values when props change
  React.useEffect(() => {
    if (values) {
      const isDifferent = Object.keys(values).some((k) => values[k] !== prevValuesRef.current[k])
      if (isDifferent) {
        form.reset(values, { keepDefaultValues: true, keepDirtyValues: true })
        prevValuesRef.current = { ...values }
      }
    }
  }, [values, form])

  // Handle external errors
  React.useEffect(() => {
    form.clearErrors()
    if (errors) {
      Object.entries(errors).forEach(([key, message]) => {
        form.setError(key as FieldPath<Record<string, unknown>>, { type: "manual", message })
      })
    }
  }, [errors, form])

  // Merge global readOnly into field definitions
  const mergedFields = React.useMemo(() => {
    const result = { ...fields }
    if (readOnly) {
      Object.keys(result).forEach((key) => {
        result[key] = { ...result[key], readonly: true }
      })
    }
    return result
  }, [fields, readOnly])

  // Confirmation State
  const [confirmation, setConfirmation] = React.useState<{
    isOpen: boolean
    config: TsFormConfirmation | null
    pendingAction: string | null
    pendingData: Record<string, unknown> | null
  }>({ isOpen: false, config: null, pendingAction: null, pendingData: null })

  // Central submission logic - pass action explicitly
  const executeAction = React.useCallback(
    (action: string, data: Record<string, unknown>) => {
      onAction?.(action, data)
    },
    [onAction]
  )

  // Handle Enter/Escape actions - Scoped to form element
  React.useEffect(() => {
    const el = formRef.current
    if (!el) return

    const handleKeyAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; action: string; field: string }>
      const { key, action } = customEvent.detail

      if (key === "Enter") {
        if (action === "submit") {
          // Default submit action - usually the first submit button
          const submitBtn = buttons.find((b) => b.type === "submit") || buttons[0]
          if (submitBtn) {
            if (submitBtn.confirmation) {
              form.handleSubmit((data) => {
                setConfirmation({
                  isOpen: true,
                  config: submitBtn.confirmation!,
                  pendingAction: submitBtn.action,
                  pendingData: data,
                })
              })()
            } else {
              form.handleSubmit((data) => executeAction(submitBtn.action, data))()
            }
          }
        } else if (action === "focus:next") {
          const inputs = Array.from(el.querySelectorAll("input, textarea, select, button")).filter(
            (el) => {
              const htmlEl = el as HTMLElement & { disabled?: boolean; tabIndex: number }
              return !htmlEl.disabled && htmlEl.tabIndex !== -1 && htmlEl.offsetParent !== null
            }
          )
          const currentIndex = inputs.indexOf(e.target as Element)
          if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
            ;(inputs[currentIndex + 1] as HTMLElement).focus()
          }
        }
      }
    }

    el.addEventListener("form-key-action", handleKeyAction)
    return () => el.removeEventListener("form-key-action", handleKeyAction)
  }, [form, buttons, executeAction])

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, btn: TsFormButton) => {
    e.preventDefault()

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
  }

  const handleConfirmationAction = (btnConfig: { action: string; confirm?: boolean }) => {
    if (btnConfig.confirm && confirmation.pendingAction && confirmation.pendingData) {
      executeAction(confirmation.pendingAction, confirmation.pendingData)
    }
    setConfirmation((prev) => ({ ...prev, isOpen: false }))
  }

  const renderButtons = (btns: (TsFormButton | TsFormConfirmation["buttons"][0])[]) => {
    return btns.map((btn, idx) => {
      type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
      let variant: ButtonVariant = "default"
      let customClass = ""

      if (btn.variant === "primary") {
        customClass = "bg-blue-600 text-white hover:bg-blue-700 border-none"
      } else if (btn.variant === "success") {
        customClass = "bg-green-600 text-white hover:bg-green-700 border-none"
      } else if (btn.variant === "warning") {
        customClass = "bg-amber-500 text-white hover:bg-amber-600 border-none"
      } else if (btn.variant === "danger" || btn.variant === "destructive") {
        variant = "destructive"
      } else if (["default", "outline", "secondary", "ghost", "link"].includes(btn.variant || "")) {
        variant = btn.variant as ButtonVariant
      }

      const isConfirmBtn = "confirm" in btn

      return (
        <Button
          key={idx}
          type="button" // Always use type="button" to handle submission programmatically
          variant={variant}
          className={customClass}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (isConfirmBtn) {
              handleConfirmationAction(btn as TsFormConfirmation["buttons"][0])
            } else {
              handleButtonClick(e, btn as TsFormButton)
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
  }

  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()} // Prevent native submit
          className={className}
        >
          <TsFormLayout layout={layout} fields={mergedFields} />

          {/* Buttons Bar */}
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

      {/* Confirmation Dialog */}
      {confirmation.config && (
        <AlertDialog
          open={confirmation.isOpen}
          onOpenChange={(open: boolean) => setConfirmation((prev) => ({ ...prev, isOpen: open }))}
        >
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmation.config.title}</AlertDialogTitle>
              <AlertDialogDescription>{confirmation.config.text}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center justify-between gap-2 w-full sm:justify-between flex-row">
              <div className="flex items-center gap-2">
                {renderButtons(confirmation.config.buttons.filter((b) => b.position === "left"))}
              </div>
              <div className="flex items-center gap-2">
                {renderButtons(confirmation.config.buttons.filter((b) => b.position === "center"))}
              </div>
              <div className="flex items-center gap-2 sm:space-x-0 sm:justify-end">
                {renderButtons(
                  confirmation.config.buttons.filter((b) => !b.position || b.position === "right")
                )}
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
