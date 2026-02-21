"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getComponentRegistryUrl } from "@/lib/registry"

interface InstallTabProps {
  componentName: string
  dependencies?: string[]
  instructions?: string
}

/**
 * Shared component for displaying installation instructions via shadcn CLI
 */
export function InstallTab({ componentName, dependencies = [], instructions }: InstallTabProps) {
  const registryUrl = getComponentRegistryUrl(componentName)
  const installCommand = `npx shadcn@latest add ${registryUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand)
    toast.success("Command copied to clipboard")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Installation</CardTitle>
        <CardDescription>Use the shadcn CLI to add this component to your project.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg relative group">
          <code className="text-sm font-mono break-all">{installCommand}</code>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 text-slate-400 hover:text-slate-50"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {instructions && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border">
            <span className="font-medium text-foreground">Note: </span>
            {instructions}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">
            This command will automatically perform the following steps:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
            <li>Download the component source files into your project.</li>
            {dependencies.length > 0 && (
              <li>
                Install required dependencies:{" "}
                <span className="font-mono">{dependencies.join(", ")}</span>.
              </li>
            )}
            <li>Install all required base shadcn UI components.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
