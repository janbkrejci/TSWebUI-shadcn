"use client"

import { CheckCircle2, Info, ShieldAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"

export default function ThemeProviderPage() {
  const codeString = `import { ReactNode } from "react"
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"
import "./globals.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          A context provider that handles theme support (light/dark mode) with built-in protection
          against hydration mismatches.
        </p>
      </div>

      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Hydration Protection</AlertTitle>
        <AlertDescription>
          This component automatically defers application rendering until the client has mounted,
          effectively acting as a <code>ClientOnly</code> wrapper for your entire application.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="code" className="w-full">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Root Layout Integration</CardTitle>
              <CardDescription>
                Place the ThemeProvider around your main content. It provides optimized defaults for
                shadcn/ui and Tailwind CSS v4.
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Key Advantages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Hydration Safety:</strong> 100% prevents <em>Hydration Mismatch</em> errors
                by deferring application rendering until the client has mounted.
              </li>
              <li>
                <strong>Flicker Prevention:</strong> Renders a themed background (
                <code>bg-background</code>) on the server to match the client&apos;s theme
                immediately, avoiding white flashes.
              </li>
              <li>
                <strong>Zero Configuration:</strong> Pre-configured with{" "}
                <code>attribute=&quot;class&quot;</code>,
                <code>defaultTheme=&quot;system&quot;</code> and <code>enableSystem</code>.
              </li>
              <li>
                <strong>Seamless Integration:</strong> Designed specifically for shadcn/ui
                components and Tailwind CSS v4 variables.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              When using ThemeProvider, keep the following in mind to ensure optimal performance and
              correct behavior:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>
                  <code>suppressHydrationWarning</code>:
                </strong>{" "}
                You <em>must</em> add this attribute to your <code>&lt;html&gt;</code> tag to avoid
                warnings from <code>next-themes</code>
                modifying the DOM during script injection.
              </li>
              <li>
                <strong>Server-Side Rendering:</strong> Because rendering is deferred, the initial
                HTML body will only contain a themed empty background. This is a trade-off for
                perfect hydration safety.
              </li>
              <li>
                <strong>Client Components:</strong> This provider is a <em>Client Component</em>,
                meaning it should be used at the root level to provide theme context to the entire
                tree.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
