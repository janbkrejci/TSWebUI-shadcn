"use client"

import { Monitor, ServerOff } from "lucide-react"

import * as React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ClientOnly } from "@/components/ts-web-ui/client-only"
import { InstallTab } from "@/components/ts-web-ui/widget-demo"

export default function ClientOnlyPage() {
  const codeString = `import { ClientOnly } from "@/components/ts-web-ui/client-only"

export default function MyPage() {
  return (
    <ClientOnly fallback={<div>Načítání...</div>}>
      {/* Komponenty, které používají window, localStorage nebo jiné klientské API */}
      <MyComplexBrowserWidget />
    </ClientOnly>
  )
}`

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Only</h1>
        <p className="text-muted-foreground mt-2">
          Utility komponenta zajišťující renderování obsahu pouze na straně klienta.
        </p>
      </div>

      <Alert
        variant="default"
        className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
      >
        <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-800 dark:text-blue-300">Proč to používat?</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-400">
          V Next.js (App Router) se komponenty renderují nejdříve na serveru. Pokud vaše komponenta
          využívá prohlížečová API jako <code>window</code> nebo <code>localStorage</code>, způsobí
          to chybu při buildu nebo tzv. hydration mismatch. <code>ClientOnly</code> tomuto
          předchází.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Demo vizualizace</CardTitle>
              <CardDescription>
                Obsah níže se zobrazí pouze po úspěšném namontování na klientu.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 bg-muted/30 border-dashed border-2 rounded-lg m-6">
              <ClientOnly
                fallback={
                  <div className="flex flex-col items-center gap-2 animate-pulse text-muted-foreground">
                    <ServerOff className="h-10 w-10 opacity-50" />
                    <span className="text-sm font-medium">Renderuji na serveru...</span>
                  </div>
                }
              >
                <div className="flex flex-col items-center gap-2 text-primary animate-in zoom-in duration-500">
                  <Monitor className="h-10 w-10" />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Zobrazeno na klientu
                  </span>
                  <div className="mt-2 text-xs font-mono bg-background p-2 rounded border shadow-sm">
                    window.innerWidth: {typeof window !== "undefined" ? window.innerWidth : "N/A"}px
                  </div>
                </div>
              </ClientOnly>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Použití v kódu</CardTitle>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab componentName="client-only" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
