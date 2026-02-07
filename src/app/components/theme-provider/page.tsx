"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'
import { Sun, Moon } from "lucide-react"

const codeString = `"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}`

const usageString = `// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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

export default function ThemeProviderPage() {
  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0 pb-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Theme Provider</h1>
        <p className="text-muted-foreground mt-2">
          A wrapper around next-themes that provides dark/light mode support for your application.
        </p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">Overview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Provider</CardTitle>
              <CardDescription>
                This is a thin wrapper around the next-themes library that enables dark mode support.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  The ThemeProvider is already active on this page. Use the ModeToggle in the top bar to see it in action!
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-background">
                  <p className="text-sm font-medium mb-2">Light Theme Colors</p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-primary" title="primary" />
                    <div className="w-8 h-8 rounded bg-secondary" title="secondary" />
                    <div className="w-8 h-8 rounded bg-accent" title="accent" />
                    <div className="w-8 h-8 rounded bg-muted" title="muted" />
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-background">
                  <p className="text-sm font-medium mb-2">Current Theme</p>
                  <p className="text-2xl font-mono flex items-center gap-2">
                    <span className="dark:hidden flex items-center gap-2"><Sun className="h-6 w-6 text-yellow-500" /> Light</span>
                    <span className="hidden dark:flex items-center gap-2"><Moon className="h-6 w-6 text-blue-400" /> Dark</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden">
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Component Code</CardTitle>
                <CardDescription>
                  Simple wrapper around NextThemesProvider.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SyntaxHighlighter 
                  language="tsx" 
                  style={vscDarkPlus}
                  customStyle={{
                    fontSize: '13px',
                    lineHeight: '1.6',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Usage in Layout</CardTitle>
                <CardDescription>
                  Wrap your app in the ThemeProvider at the root layout level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SyntaxHighlighter 
                  language="tsx" 
                  style={vscDarkPlus}
                  customStyle={{
                    fontSize: '13px',
                    lineHeight: '1.6',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}
                >
                  {usageString}
                </SyntaxHighlighter>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentation" className="flex-1 min-h-0 overflow-auto pt-4 data-[state=inactive]:hidden">
          <div className="space-y-8 pb-8 w-full">
            <Card>
              <CardHeader>
                <CardTitle>ThemeProvider Props</CardTitle>
                <CardDescription>
                  All props from next-themes are supported.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-45">Prop</TableHead>
                      <TableHead className="w-37.5">Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">attribute</TableCell>
                      <TableCell className="text-xs italic">"class" | "data-theme"</TableCell>
                      <TableCell>HTML attribute to set theme. Use "class" for Tailwind.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">defaultTheme</TableCell>
                      <TableCell className="text-xs italic">string</TableCell>
                      <TableCell>Default theme (e.g., "light", "dark", "system").</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">enableSystem</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Enable system theme detection.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">disableTransitionOnChange</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Disable CSS transitions when changing theme.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">storageKey</TableCell>
                      <TableCell className="text-xs italic">string</TableCell>
                      <TableCell>localStorage key for persisting theme.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Add <code>suppressHydrationWarning</code> to the html tag to prevent hydration warnings</li>
                  <li>The provider must be a client component ("use client")</li>
                  <li>Use with ModeToggle component for a complete theme switching solution</li>
                  <li>Tailwind's dark mode should be set to "class" in tailwind.config.js</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
