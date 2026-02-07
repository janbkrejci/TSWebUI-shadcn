"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TsFieldDef, TsFormLayout as LayoutType, TsFormButton, TsFormConfirmation } from "./types"
import { generateZodSchema } from "./ts-form-schema"
import { TsFormLayout } from "./ts-form-layout"
import { Loader2 } from "lucide-react"

export interface TsFormProps {
  layout: LayoutType
  fields: Record<string, TsFieldDef>
  values?: any
  buttons?: TsFormButton[]
  errors?: Record<string, string>
  onSubmit?: (data: any, action: string) => void
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
  readOnly = false,
  className
}: TsFormProps) {
  // 1. Generate Schema based on fields
  const formSchema = React.useMemo(() => generateZodSchema(fields), [fields])
  type FormValues = z.infer<typeof formSchema>

  // 2. Initialize Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: values || {},
    mode: "onChange"
  })

  // Update form values when props change
  React.useEffect(() => {
    if (values) {
        form.reset(values)
    }
  }, [values, form])

  // Handle external errors
  React.useEffect(() => {
    if (errors) {
        Object.entries(errors).forEach(([key, message]) => {
            form.setError(key as any, { type: "manual", message })
        })
    }
  }, [errors, form])

  const [submittingAction, setSubmittingAction] = React.useState<string | null>(null)
  
  // Confirmation State
  const [confirmation, setConfirmation] = React.useState<{
      isOpen: boolean,
      config: TsFormConfirmation | null,
      pendingAction: string | null,
      pendingData: any | null
  }>({ isOpen: false, config: null, pendingAction: null, pendingData: null })

  // 3. Handle Submit (called by form onSubmit)
  const onFormSubmit = (data: FormValues) => {
    // This logic handles implicit enter key submit or direct button submit
    // If confirmation is needed, it should have been intercepted by handleButtonClick
    // But if Enter key is pressed, we might not know which button it maps to.
    // Default is usually the first submit button or the one with type="submit"
    
    if (submittingAction) {
        // If we know the action, we check if that button has confirmation
        // But logic is usually handled in click handler.
        // If we are here, validation passed.
        onSubmit?.(data, submittingAction)
        setSubmittingAction(null)
    } else {
        // Default submit (e.g. Enter key) - find primary submit button
        const submitBtn = buttons.find(b => b.type === 'submit') || buttons[0]
        if (submitBtn) {
             if (submitBtn.confirmation) {
                 setConfirmation({ 
                     isOpen: true, 
                     config: submitBtn.confirmation, 
                     pendingAction: submitBtn.action, 
                     pendingData: data 
                 })
             } else {
                 onSubmit?.(data, submitBtn.action)
             }
        }
    }
  }

  const handleButtonClick = (e: React.MouseEvent, btn: TsFormButton) => {
    if (btn.confirmation) {
        e.preventDefault()
        
        const proceedWithConfirmation = (data: any) => {
            setConfirmation({ 
                isOpen: true, 
                config: btn.confirmation!, 
                pendingAction: btn.action, 
                pendingData: data 
            })
        }

        if (!btn.type || btn.type === 'submit') {
            // Trigger validation first
            form.handleSubmit(proceedWithConfirmation)(e)
        } else {
            // No validation for non-submit buttons
            proceedWithConfirmation(form.getValues())
        }
        return
    }

    // Normal flow
    if (!btn.type || btn.type === 'submit') {
        setSubmittingAction(btn.action)
        // form onSubmit will be called
    } else {
        e.preventDefault()
        onSubmit?.(form.getValues(), btn.action)
    }
  }

  const handleConfirmationAction = (btnConfig: { action: string, confirm?: boolean }) => {
      setConfirmation(prev => ({ ...prev, isOpen: false }))
      
      if (btnConfig.confirm && confirmation.pendingAction) {
          setSubmittingAction(confirmation.pendingAction) // Set loading state if we want
          onSubmit?.(confirmation.pendingData, confirmation.pendingAction)
          setSubmittingAction(null)
      }
  }

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className={className}>
            <TsFormLayout layout={layout} fields={fields} />
            
            {/* Buttons Bar */}
            {buttons.length > 0 && (
                <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
                    {buttons.map((btn, idx) => {
                        // Map variants
                        let variant: any = "default"
                        if (btn.variant === 'primary') variant = "default"
                        else if (btn.variant === 'danger') variant = "destructive"
                        else if (btn.variant) variant = btn.variant

                        return (
                            <Button
                                key={idx}
                                type={btn.type || 'submit'}
                                variant={variant}
                                onClick={(e) => handleButtonClick(e, btn)}
                                disabled={form.formState.isSubmitting && submittingAction === btn.action}
                            >
                                {form.formState.isSubmitting && submittingAction === btn.action && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {btn.label}
                            </Button>
                        )
                    })}
                </div>
            )}
        </form>
        </Form>

        {/* Confirmation Dialog */}
        {confirmation.config && (
            <AlertDialog open={confirmation.isOpen} onOpenChange={(open: boolean) => setConfirmation(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{confirmation.config.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmation.config.text}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {confirmation.config.buttons.map((btn, idx) => (
                            btn.confirm ? (
                                <AlertDialogAction key={idx} onClick={() => handleConfirmationAction(btn)} className={btn.variant === 'danger' ? 'bg-destructive hover:bg-destructive/90' : ''}>
                                    {btn.label}
                                </AlertDialogAction>
                            ) : (
                                <AlertDialogCancel key={idx} onClick={() => handleConfirmationAction(btn)}>
                                    {btn.label}
                                </AlertDialogCancel>
                            )
                        ))}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
    </>
  )
}