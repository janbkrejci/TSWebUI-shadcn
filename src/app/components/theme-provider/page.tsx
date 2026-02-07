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

      <Tabs defaultValue="code" className="w-full">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Implementation</CardTitle>
              <CardDescription>
                ThemeProvider no longer requires any attributes as it comes with pre-configured
                optimized values for shadcn/ui.
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
            Features and Improvements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            This component has been simplified and merged with <code>ClientOnly</code> logic to
            provide the best possible stability in Next.js 16.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Zero Configuration:</strong> Automatically sets{" "}
              <code>attribute=&quot;class&quot;</code>, <code>defaultTheme=&quot;system&quot;</code>{" "}
              and <code>enableSystem</code>.
            </li>
            <li>
              <strong>Smooth Transitions:</strong> Enforces <code>disableTransitionOnChange</code>{" "}
              to eliminate color flickering during theme changes.
            </li>
            <li>
              <strong>Integrated ClientOnly:</strong> Automatically defers content rendering until
              the client has mounted, 100% preventing <em>Hydration Mismatch</em> errors.
            </li>
            <li>
              <strong>Automatic Loading:</strong> Displays a subtle bouncing dots animation if the
              application is not yet ready on the client.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
