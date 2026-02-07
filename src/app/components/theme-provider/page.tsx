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
        <ThemeProvider>
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
          Kontextový provider zajišťující podporu témat (světlý/tmavý režim) s integrovanou ochranou
          proti hydration mismatch.
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
                ThemeProvider nyní nevyžaduje žádné atributy, protože má v sobě pevně nastavené
                optimalizované hodnoty pro shadcn UI.
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
            Vlastnosti a vylepšení
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Tato komponenta byla zjednodušena a sloučena s logikou <code>ClientOnly</code>, aby
            poskytovala nejlepší možnou stabilitu v Next.js 16.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Bez parametrů:</strong> Automaticky nastavuje{" "}
              <code>attribute=&quot;class&quot;</code>, <code>defaultTheme=&quot;system&quot;</code>{" "}
              a <code>enableSystem</code>.
            </li>
            <li>
              <strong>Plynulé přepínání:</strong> Vynucuje <code>disableTransitionOnChange</code>{" "}
              pro eliminaci problikávání barev.
            </li>
            <li>
              <strong>Integrovaný ClientOnly:</strong> Automaticky odkládá renderování obsahu až po
              namontování na klienta, čímž 100% předchází chybám typu <em>Hydration Mismatch</em>.
            </li>
            <li>
              <strong>Automatický Loading:</strong> Pokud aplikace ještě není na klientu připravena,
              zobrazí decentní pulsní animaci.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
