"use client"

import { CloudUpload, Download, FileText as FileTextIcon, X as XIcon } from "lucide-react"

import * as React from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"

import { TsFileField } from "../types"

export interface TsFileWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsFileField
  name: string
  hasError?: boolean
}

export const FileWidget = React.forwardRef<HTMLDivElement, TsFileWidgetProps>(
  ({ field, def, hasError = false, ...props }, ref) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const accept = def.accept || (def.type === "image" ? "image/*" : undefined)
    const multiple = def.multiple

    const files: File[] = React.useMemo(() => {
      if (!field.value) return []
      if (Array.isArray(field.value))
        return (field.value as File[]).filter((f) => f instanceof File)
      if (field.value instanceof File) return [field.value]
      return []
    }, [field.value])

    const handleFiles = (fileList: FileList) => {
      const newFiles = Array.from(fileList)
      if (multiple) {
        field.onChange([...files, ...newFiles])
      } else {
        field.onChange(newFiles[0])
      }
    }

    const removeFile = (index: number) => {
      if (multiple) {
        const updated = [...files]
        updated.splice(index, 1)
        field.onChange(updated.length > 0 ? updated : undefined)
      } else {
        field.onChange(undefined)
      }
    }

    const downloadFile = (file: File) => {
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }

    const errorBorderClass = hasError
      ? "border-destructive"
      : "border-dashed border-muted-foreground/40"
    const isInteractive = !def.disabled && !def.readonly

    return (
      <div className="flex flex-col gap-2" {...props} ref={ref}>
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 text-center transition-colors",
            errorBorderClass,
            isInteractive && "cursor-pointer hover:border-primary hover:bg-muted/30",
            isDragOver && "border-primary bg-primary/5",
            !isInteractive && "opacity-50"
          )}
          onClick={() => isInteractive && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            if (isInteractive) setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            if (isInteractive && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
          }}
        >
          <CloudUpload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {def.innerLabel ||
              (multiple
                ? "Drop files here or click to upload"
                : "Drop file here or click to upload")}
          </div>
          {accept && <div className="text-xs text-muted-foreground/70">{accept}</div>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files)
            e.target.value = ""
          }}
        />

        {files.length > 0 && (
          <div className="space-y-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
              >
                <FileTextIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => downloadFile(file)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                {isInteractive && (
                  <button
                    type="button"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(index)}
                    title="Remove"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
FileWidget.displayName = "FileWidget"
