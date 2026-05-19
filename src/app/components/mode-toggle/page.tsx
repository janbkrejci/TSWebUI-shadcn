"use client"

import { Moon, Sun } from "lucide-react"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ModeTogglePage() {
  const locale = useTsLocale()
  const d = locale.strings.demo
  const codeString = `"use client"

import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"

export default function Header() {
  return (
    <header>
      <div className="logo">My Web</div>
      <ModeToggle />
    </header>
  )
}`

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mode Toggle</h1>
        <p className="text-muted-foreground mt-2">{d.modeTogglePageDesc}</p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">{d.tabPreview}</TabsTrigger>
          <TabsTrigger value="code">{d.tabCode}</TabsTrigger>
          <TabsTrigger value="install">{d.tabInstall}</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{d.interactiveDemo}</CardTitle>
              <CardDescription>{d.modeToggleCurrentTheme}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="p-8 border rounded-xl bg-card shadow-sm flex flex-col items-center gap-4">
                <ModeToggle />
                <span className="text-sm font-medium">{d.modeToggleCurrentTheme}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 rounded-lg border bg-white text-black flex items-center gap-2 shadow-sm">
                  <Sun className="h-4 w-4" /> {d.modeToggleLightMode}
                </div>
                <div className="p-4 rounded-lg border bg-slate-950 text-white flex items-center gap-2 shadow-sm">
                  <Moon className="h-4 w-4" /> {d.modeToggleDarkMode}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <CodeBlock code={codeString} />
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
