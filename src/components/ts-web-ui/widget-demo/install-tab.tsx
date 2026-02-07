"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface InstallTabProps {
  componentName: string
  dependencies?: string[]
}

/**
 * Společná komponenta pro zobrazení instalačních instrukcí přes shadcn CLI
 */
export function InstallTab({ componentName, dependencies = [] }: InstallTabProps) {
  const registryUrl = `https://janbkrejci.github.io/TSWebUI-shadcn/registry/${componentName}.json`
  const installCommand = `npx shadcn@latest add ${registryUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand)
    toast.success("Příkaz zkopírován do schránky")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instalace komponenty</CardTitle>
        <CardDescription>
          Použijte shadcn CLI pro přidání této komponenty do vašeho projektu.
        </CardDescription>
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
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">
            Tento příkaz automaticky provede následující kroky:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 space-y-1">
            <li>Stáhne zdrojové soubory komponenty do vašeho projektu.</li>
            {dependencies.length > 0 && (
              <li>
                Nainstaluje potřebné knihovny:{" "}
                <span className="font-mono">{dependencies.join(", ")}</span>.
              </li>
            )}
            <li>Doinstaluje všechny vyžadované základní shadcn UI komponenty.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
