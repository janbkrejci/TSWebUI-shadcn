"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { LocaleToggle } from "@/components/ts-web-ui/locale-toggle"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LocaleTogglePage() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const codeString = `"use client"

import { LocaleToggle } from "@/components/ts-web-ui/locale-toggle"
import { TsLocaleProvider } from "@/components/ts-web-ui/locale"

// Wrap your app with TsLocaleProvider (default: Czech)
export default function Layout({ children }) {
  return (
    <TsLocaleProvider locale="cs">
      <header>
        <LocaleToggle />
      </header>
      {children}
    </TsLocaleProvider>
  )
}`

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{d.localeToggleTitle}</h1>
        <p className="text-muted-foreground mt-2">{d.localeToggleDesc}</p>
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
              <CardDescription>{d.localeToggleDesc}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="p-8 border rounded-xl bg-card shadow-sm flex flex-col items-center gap-4">
                <LocaleToggle />
                <span className="text-sm font-medium text-muted-foreground">
                  {locale.strings.nav.logoText}
                </span>
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
          <InstallTab componentName="locale-toggle" dependencies={["lucide-react"]} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
