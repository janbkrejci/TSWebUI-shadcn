"use client"

import { Moon, Sun } from "lucide-react"

import * as React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { InstallTab } from "@/components/ts-web-ui/widget-demo"

export default function ModeTogglePage() {
  const codeString = `import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"

export default function Header() {
  return (
    <header>
      <div className="logo">Můj Web</div>
      <ModeToggle />
    </header>
  )
}`

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mode Toggle</h1>
        <p className="text-muted-foreground mt-2">
          Přepínač světlého a tmavého režimu využívající <code>next-themes</code>.
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interaktivní ukázka</CardTitle>
              <CardDescription>Klikněte na ikonu pro změnu režimu aplikace.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="p-8 border rounded-xl bg-card shadow-sm flex flex-col items-center gap-4">
                <ModeToggle />
                <span className="text-sm font-medium">Aktuálně zvolený motiv</span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 rounded-lg border bg-white text-black flex items-center gap-2 shadow-sm">
                  <Sun className="h-4 w-4" /> Svetlý režim
                </div>
                <div className="p-4 rounded-lg border bg-slate-950 text-white flex items-center gap-2 shadow-sm">
                  <Moon className="h-4 w-4" /> Tmavý režim
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardContent className="pt-6">
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
          <InstallTab componentName="mode-toggle" dependencies={["lucide-react", "next-themes"]} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
