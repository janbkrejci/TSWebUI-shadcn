"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { TsButton, TsConfirmation } from "./types"

interface TsFormConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  config: TsConfirmation | null
  renderButtons: (btns: (TsButton | TsConfirmation["buttons"][0])[]) => React.ReactNode
}

export function TsFormConfirmationDialog({
  isOpen,
  onOpenChange,
  config,
  renderButtons,
}: TsFormConfirmationDialogProps) {
  if (!config) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>{config.text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-between gap-2 w-full sm:justify-between flex-row">
          <div className="flex items-center gap-2">
            {renderButtons(config.buttons.filter((b) => b.position === "left"))}
          </div>
          <div className="flex items-center gap-2">
            {renderButtons(config.buttons.filter((b) => b.position === "center"))}
          </div>
          <div className="flex items-center gap-2 sm:space-x-0 sm:justify-end">
            {renderButtons(config.buttons.filter((b) => !b.position || b.position === "right"))}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
