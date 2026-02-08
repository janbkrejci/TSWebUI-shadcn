"use client"

import { Palette, Search, User } from "lucide-react"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Logo } from "@/components/ts-web-ui/ts-logo"
import { TopBar, TopBarGroup } from "@/components/ts-web-ui/ts-topbar"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"

/**
 * Interactive TopBar demo
 */
function TopBarDemo() {
  const [showCenter, setShowCenter] = React.useState(true)
  const [isBordered, setIsBordered] = React.useState(true)
  const [height, setHeight] = React.useState(56)

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Control Panel */}
      <div className="flex flex-wrap gap-6 p-4 border rounded-lg bg-card items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Switch id="bordered" checked={isBordered} onCheckedChange={setIsBordered} />
          <Label htmlFor="bordered">Border</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="center" checked={showCenter} onCheckedChange={setShowCenter} />
          <Label htmlFor="center">Center Content</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="height">Height:</Label>
          <input
            id="height"
            type="range"
            min="40"
            max="100"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs font-mono w-8">{height}px</span>
        </div>
      </div>

      {/* Workspace container */}
      <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-75">
        {/* Workspace background */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 pointer-events-none font-bold text-4xl select-none z-0">
          PAGE CONTENT
        </div>

        {/* TopBar inside container - showTrigger={false} to isolate from App Sidebar */}
        <TopBar
          height={height}
          bordered={isBordered}
          showTrigger={false}
          className="absolute!"
          leftContent={<Logo text="MyApplication" />}
          centerContent={
            showCenter ? (
              <div className="relative w-64 max-w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search everything..." className="pl-8 h-9" />
              </div>
            ) : null
          }
          rightContent={
            <TopBarGroup>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Palette className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </TopBarGroup>
          }
        />
      </div>
    </div>
  )
}

const codeString = `"use client"

import { TopBar, Logo, TopBarGroup } from "@/components/ts-web-ui/ts-topbar"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"

export default function Layout({ children }) {
  return (
    <>
      {/* TopBar is 'sticky' by default, so it stays in the document flow */}
      <TopBar
        leftContent={
          <Logo text="TSWebUI" href="/" />
        }
        rightContent={
          <TopBarGroup>
            <ModeToggle />
          </TopBarGroup>
        }
      />
      
      <main className="p-6">
        {children}
      </main>
    </>
  )
}`

export default function TopBarPage() {
  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0 pb-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">TopBar</h1>
        <p className="text-muted-foreground mt-2">
          Universal top bar for navigation, logos, and global application actions.
        </p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <TopBarDemo />
        </TabsContent>

        <TabsContent
          value="code"
          className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
              <CardDescription>
                TopBar uses sticky positioning and stays at the top of the window.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeString} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab componentName="ts-topbar" dependencies={["lucide-react"]} />
        </TabsContent>

        <TabsContent
          value="documentation"
          className="flex-1 min-h-0 overflow-auto pt-4 data-[state=inactive]:hidden"
        >
          <div className="space-y-8 pb-8 w-full">
            <Card>
              <CardHeader>
                <CardTitle>TopBar Props</CardTitle>
                <CardDescription>Properties of the main top bar component.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Prop</TableHead>
                      <TableHead className="w-32">Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        leftContent
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Left-aligned content (logo, app title)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        centerContent
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Center-aligned content (search, breadcrumbs)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        rightContent
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Right-aligned content (actions, user menu)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        height
                      </TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell>Height in pixels (default: 56)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        bordered
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Whether to show the bottom border (default: true)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        showTrigger
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>
                        Automatically show sidebar trigger if available (default: true)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Helper Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Component</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold">Logo</TableCell>
                      <TableCell>
                        Universal logo component with support for text, icon, and link.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold">TopBarGroup</TableCell>
                      <TableCell>
                        Wrapper for a group of elements with consistent spacing.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
