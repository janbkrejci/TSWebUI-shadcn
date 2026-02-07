"use client"

import { Palette } from "lucide-react"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"

export default function ThemeProviderPage() {
  const codeString = `import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theme Provider</h1>
        <p className="text-muted-foreground mt-2">
          Kontextový provider zajišťující podporu témat (světlý/tmavý režim).
        </p>
      </div>

      <Tabs defaultValue="code" className="w-full">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementace v Layoutu</CardTitle>
              <CardDescription>
                ThemeProvider by měl obalovat celou vaši aplikaci v kořenovém layoutu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeString} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab componentName="theme-provider" dependencies={["next-themes"]} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Vlastnosti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Tento provider je tenký wrapper nad knihovnou <code>next-themes</code>, upravený pro
            perfektní spolupráci se shadcn UI a Tailwind CSS v4.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Automatická synchronizace se systémovým nastavením OS</li>
            <li>
              Podpora pro přepínání CSS tříd (standardně <code>.dark</code>)
            </li>
            <li>Prevence hydration mismatch chyb</li>
            <li>Podpora pro zakázání animací při změně tématu</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
