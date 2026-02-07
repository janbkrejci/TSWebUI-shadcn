"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { Sun, Moon, Monitor } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'

function ModeToggleDemo() {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <Card>
        <CardHeader>
          <CardTitle>Theme Switcher</CardTitle>
          <CardDescription>
            Click the button to switch between light, dark, and system themes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Current theme toggle:</span>
            <ModeToggle />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-card text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-background border flex items-center justify-center">
                <Sun className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium">Light</p>
            </div>
            <div className="p-4 border rounded-lg bg-card text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-background border flex items-center justify-center">
                <Moon className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm font-medium">Dark</p>
            </div>
            <div className="p-4 border rounded-lg bg-card text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-background border flex items-center justify-center">
                <Monitor className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">System</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const codeString = `import { ModeToggle } from "@/components/mode-toggle"
import { TsTopBar, TopBarLogo } from "@/components/ts-web-ui/ts-topbar"
import { SidebarTrigger } from "@/components/ts-web-ui/ts-sidebar"

// Usage with TsTopBar - place in your layout
export function AppLayout({ children }) {
  return (
    <TsTopBar
      height={56}
      leftContent={
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <TopBarLogo text="MyApp" href="/" />
        </div>
      }
      rightContent={<ModeToggle />}
    />
  )
}

// The ModeToggle component implementation
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`

export default function ModeTogglePage() {
  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0 pb-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Mode Toggle</h1>
        <p className="text-muted-foreground mt-2">
          A dropdown button for switching between light, dark, and system color themes.
        </p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <ModeToggleDemo />
        </TabsContent>

        <TabsContent value="code" className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Implementation</CardTitle>
              <CardDescription>
                Uses next-themes for theme management and shadcn/ui DropdownMenu.
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
        </TabsContent>

        <TabsContent value="documentation" className="flex-1 min-h-0 overflow-auto pt-4 data-[state=inactive]:hidden">
          <div className="space-y-8 pb-8 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><code>next-themes</code> - Theme management for Next.js</li>
                  <li><code>lucide-react</code> - Sun and Moon icons</li>
                  <li><code>@/components/ui/button</code> - shadcn Button</li>
                  <li><code>@/components/ui/dropdown-menu</code> - shadcn DropdownMenu</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Smooth icon transition animation between sun and moon</li>
                  <li>Three theme options: Light, Dark, System</li>
                  <li>Accessible with keyboard navigation</li>
                  <li>Screen reader friendly with sr-only label</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The ModeToggle requires ThemeProvider to be set up in your layout:
                </p>
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
{`// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`}
                </SyntaxHighlighter>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
