"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as z from "zod"

import * as React from "react"
import { useForm } from "react-hook-form"

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
import { generateZodSchema } from "./ts-form-schema"
import { TsFormLayout as LayoutType, TsFieldDef, TsFormButton, TsFormConfirmation } from "./types"

export interface TsFormProps {
  layout: LayoutType
  fields: Record<string, TsFieldDef>
  values?: Record<string, unknown>
  buttons?: TsFormButton[]
  errors?: Record<string, string>
  onSubmit?: (data: Record<string, unknown>, action: string) => void
  readOnly?: boolean
  className?: string
}

export function TsForm({
  layout,
  fields,
  values,
  buttons = [],
  errors,
  onSubmit,
  className,
}: Omit<TsFormProps, "readOnly">) {
  // 1. Generate Schema based on fields
  const formSchema = React.useMemo(() => generateZodSchema(fields), [fields])
  type FormValues = z.infer<typeof formSchema>

  // 2. Initialize Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: (values as FormValues) || {},
    mode: "onChange",
  })

  // Update form values when props change
  React.useEffect(() => {
    if (values) {
      form.reset(values as FormValues)
    }
  }, [values, form])

  // Handle external errors
  React.useEffect(() => {
    if (errors) {
      Object.entries(errors).forEach(([key, message]) => {
        form.setError(key as keyof FormValues, { type: "manual", message })
      })
    }
  }, [errors, form])

  const [submittingAction, setSubmittingAction] = React.useState<string | null>(null)

  // Confirmation State
  const [confirmation, setConfirmation] = React.useState<{
    isOpen: boolean
    config: TsFormConfirmation | null
    pendingAction: string | null
    pendingData: FormValues | null
  }>({ isOpen: false, config: null, pendingAction: null, pendingData: null })

  // 3. Handle Submit (called by form onSubmit)
  const onFormSubmit = (data: FormValues) => {
    // This logic handles implicit submission via Enter key or direct button click

    if (submittingAction) {
      onSubmit?.(data as Record<string, unknown>, submittingAction)
      setSubmittingAction(null)
    } else {
      // Default submit (e.g. Enter key) - find primary submit button
      const submitBtn = buttons.find((b) => b.type === "submit") || buttons[0]
      if (submitBtn) {
        if (submitBtn.confirmation) {
          setConfirmation({
            isOpen: true,
            config: submitBtn.confirmation,
            pendingAction: submitBtn.action,
            pendingData: data,
          })
        } else {
          onSubmit?.(data as Record<string, unknown>, submitBtn.action)
        }
      }
    }
  }

  const handleButtonClick = (e: React.MouseEvent, btn: TsFormButton) => {
    if (btn.confirmation) {
      e.preventDefault()

      const proceedWithConfirmation = (data: FormValues) => {
        setConfirmation({
          isOpen: true,
          config: btn.confirmation!,
          pendingAction: btn.action,
          pendingData: data,
        })
      }

      if (!btn.type || btn.type === "submit") {
        // Trigger validation first
        form.handleSubmit(proceedWithConfirmation)(e)
      } else {
        // No validation for non-submit buttons
        proceedWithConfirmation(form.getValues() as FormValues)
      }
      return
    }

    // Normal flow
    if (!btn.type || btn.type === "submit") {
      setSubmittingAction(btn.action)
      // form onSubmit will be called
    } else {
      e.preventDefault()
      onSubmit?.(form.getValues() as Record<string, unknown>, btn.action)
    }
  }

  const handleConfirmationAction = (btnConfig: { action: string; confirm?: boolean }) => {
    if (btnConfig.confirm && confirmation.pendingAction && confirmation.pendingData) {
      onSubmit?.(confirmation.pendingData as Record<string, unknown>, confirmation.pendingAction)
    }
    setConfirmation((prev) => ({ ...prev, isOpen: false }))
  }

  const renderButtons = (btns: (TsFormButton | TsFormConfirmation["buttons"][0])[]) => {
    return btns.map((btn, idx) => {
      // Map variants
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
      } else if (
        btn.variant === "default" ||
        btn.variant === "outline" ||
        btn.variant === "secondary" ||
        btn.variant === "ghost" ||
        btn.variant === "link"
      ) {
        variant = btn.variant
      }

      // Check if it's a confirmation button
      const isConfirmBtn = "confirm" in btn

      return (
        <Button
          key={idx}
          type={!isConfirmBtn ? (btn as TsFormButton).type || "submit" : "button"}
          variant={variant}
          className={customClass}
          onClick={(e) => {
            if (isConfirmBtn) {
              handleConfirmationAction(btn as TsFormConfirmation["buttons"][0])
            } else {
              handleButtonClick(e, btn as TsFormButton)
            }
          }}
          disabled={
            !isConfirmBtn &&
            form.formState.isSubmitting &&
            submittingAction === (btn as TsFormButton).action
          }
        >
          {!isConfirmBtn &&
            form.formState.isSubmitting &&
            submittingAction === (btn as TsFormButton).action && (
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
        <form onSubmit={form.handleSubmit(onFormSubmit)} className={className}>
          <TsFormLayout layout={layout} fields={fields} />

          {/* Buttons Bar */}
          {buttons.length > 0 && (
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
