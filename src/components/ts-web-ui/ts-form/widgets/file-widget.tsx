"use client"

import { CloudUpload, Download, FileText as FileTextIcon, Plus, X as XIcon } from "lucide-react"

import * as React from "react"

import { cn } from "@/lib/utils"

import { TsFileDescriptor, TsFileField, TsWidgetProps } from "../types"
import { dispatchFormAction } from "../utils"

export type TsFileWidgetProps = TsWidgetProps<TsFileField>

export const FileWidget = React.forwardRef<HTMLDivElement, TsFileWidgetProps>(
  (
    {
      field,
      def,
      name,
      error,
      hint: _hint,
      readOnly,
      autoFocus,
      "aria-label": ariaLabel,
      "aria-required": _ariaRequired,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Support extensions like .pdf,.doc and map common ones
    const accept = React.useMemo(() => {
      if (!def.accept) return undefined
      return def.accept
        .split(",")
        .map((ext) => {
          const e = ext.trim().toLowerCase()
          if (e === "excel")
            return ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          if (e === "word")
            return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          if (e === "image") return "image/*"
          if (e === "pdf") return ".pdf,application/pdf"
          if (e === "text") return ".txt,text/plain"
          if (e === "json") return ".json,application/json"
          if (e === "markdown") return ".md,text/markdown"
          if (e === "zip") return ".zip,.7z,.rar,application/zip,application/x-7z-compressed"
          return e.startsWith(".") ? e : `.${e}`
        })
        .join(",")
    }, [def.accept])

    const multiple = def.multiple
    const hasError = !!error

    const files: (File | TsFileDescriptor)[] = React.useMemo(() => {
      if (!field.value) return []
      if (Array.isArray(field.value)) return field.value
      return [field.value]
    }, [field.value])

    const emitFilesChanged = React.useCallback(() => {
      // Defer dispatch so react-hook-form can commit the new value first.
      queueMicrotask(() => {
        dispatchFormAction({ current: inputRef.current }, name, `file:change:${name}`)
      })
    }, [name])

    const handleFiles = (fileList: FileList) => {
      if (readOnly) return
      const newFiles = Array.from(fileList)
      if (multiple) {
        field.onChange([...files, ...newFiles])
      } else {
        field.onChange(newFiles[0])
      }
      emitFilesChanged()
    }

    const removeFile = (index: number) => {
      if (readOnly) return
      if (multiple) {
        const updated = [...files]
        updated.splice(index, 1)
        field.onChange(updated)
      } else {
        field.onChange(undefined)
      }
      emitFilesChanged()
    }

    const downloadFile = (file: File | TsFileDescriptor) => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file)
        const a = document.createElement("a")
        a.href = url
        a.download = file.name
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } else if (file.url) {
        const a = document.createElement("a")
        a.href = file.url
        a.download = file.name
        a.target = "_blank"
        a.click()
      }
    }

    const formatSize = (bytes?: number) => {
      if (bytes === undefined) return ""
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }

    const errorBorderClass = hasError
      ? "border-destructive"
      : "border-dashed border-muted-foreground/40"
    const isInteractive = !def.disabled && !readOnly
    const shouldShowDropZone = def.showDropZone !== false && isInteractive

    return (
      <div className="flex flex-col gap-1.5" {...props} ref={ref}>
        {shouldShowDropZone && (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-6 text-center transition-colors cursor-pointer hover:border-primary hover:bg-muted/30 mb-0.5",
              errorBorderClass,
              isDragOver && "border-primary bg-primary/5"
            )}
            autoFocus={autoFocus}
            tabIndex={isInteractive ? 0 : -1}
            aria-invalid={hasError}
            aria-label={ariaLabel || def.label}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              if (readOnly) return
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              if (readOnly) return
              e.preventDefault()
              setIsDragOver(false)
              if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
            }}
          >
            <CloudUpload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {def.innerLabel ||
                (multiple
                  ? "Drop files here or click to upload"
                  : "Drop file here or click to upload")}
            </div>
          </div>
        )}

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
          <div className="flex flex-col gap-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
              >
                <FileTextIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate">{file.name}</span>
                {file.size && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatSize(file.size)}
                  </span>
                )}
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

        {!shouldShowDropZone && isInteractive && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-fit group/add py-0.5"
            onClick={() => inputRef.current?.click()}
          >
            <Plus className="h-4 w-4" />
            <span className="group-hover/add:underline underline-offset-4">
              {def.addFileLabel || (multiple ? "Add files" : "Add file")}
            </span>
          </button>
        )}
      </div>
    )
  }
)
FileWidget.displayName = "FileWidget"
