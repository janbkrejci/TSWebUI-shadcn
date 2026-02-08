"use client"

import { BarChart, BookOpen, Calendar, FolderOpen, Home, Mail, Settings, Users } from "lucide-react"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

import {
  NavSection,
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ts-web-ui/ts-sidebar"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"

/**
 * Menu items for demo
 */
const menuItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BarChart, label: "Analytics" },
  { icon: Users, label: "Users" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Calendar, label: "Calendar" },
  { icon: Mail, label: "Messages" },
  { icon: BookOpen, label: "Documentation" },
  { icon: Settings, label: "Settings" },
]

/**
 * Component for controlling the demo sidebar
 */
function SidebarControls() {
  const { isOpen, toggle, isCollapsed, toggleCollapsed, isMobile } = useSidebar()

  return (
    <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-card items-center shrink-0 shadow-sm m-4">
      <div className="flex items-center gap-2">
        <Switch id="open" checked={isOpen} onCheckedChange={toggle} />
        <Label htmlFor="open">Open</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="collapsed"
          checked={isCollapsed}
          onCheckedChange={toggleCollapsed}
          disabled={!isOpen}
        />
        <Label htmlFor="collapsed" className={!isOpen ? "opacity-50" : ""}>
          Collapsed
        </Label>
      </div>
      <div className="text-sm text-muted-foreground">
        Mode:{" "}
        <span className="font-medium">{isMobile ? "Mobile (overlay)" : "Desktop (push)"}</span>
      </div>
    </div>
  )
}

/**
 * Interactive Sidebar demo inside a container
 */
function SidebarDemo() {
  const [showTopBar, setShowTopBar] = React.useState(true)
  const topBarHeight = showTopBar ? 56 : 0

  const NAVIGATION: NavSection[] = [
    {
      title: "Navigation",
      items: menuItems.map((m) => ({
        name: m.label.toLowerCase(),
        label: m.label,
        href: "#",
        icon: m.icon,
      })),
    },
  ]

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Control panel outside SidebarProvider */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-card items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Switch id="topbar" checked={showTopBar} onCheckedChange={setShowTopBar} />
          <Label htmlFor="topbar">Show TopBar</Label>
        </div>
      </div>

      {/* Workspace container */}
      <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-112.5">
        {/* Workspace background */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 pointer-events-none font-bold text-4xl select-none z-0">
          APP CONTENT
        </div>

        {/* SidebarProvider for isolated demo */}
        <SidebarProvider
          mobileBreakpoint={768}
          topBarHeight={topBarHeight}
          width="16rem"
          collapsedWidth="4rem"
        >
          {/* TopBar (optional) */}
          {showTopBar && (
            <header className="absolute top-0 left-0 right-0 h-14 z-50 flex items-center gap-4 px-4 bg-background border-b text-foreground">
              <SidebarTrigger />
              <span className="font-semibold text-lg tracking-tight">Application</span>
            </header>
          )}

          {/* Sidebar inside container - uses actual component */}
          <Sidebar
            className="absolute!"
            navigation={NAVIGATION}
            logo={
              <span className="font-semibold text-lg tracking-tight text-foreground">TSWebUI</span>
            }
          />

          {/* Main content with controls */}
          <SidebarInset className="absolute! inset-0! overflow-auto bg-transparent pt-14">
            <SidebarControls />
            <div className="max-w-2xl space-y-4 p-6 pt-0">
              <h2 className="text-xl font-semibold text-foreground">Page Content</h2>
              <p className="text-muted-foreground">
                Main content area that adjusts to sidebar state. The sidebar can be opened/closed
                and collapsed. Try resizing the window to see responsive behavior.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-lg bg-card border flex items-center justify-center text-muted-foreground"
                  >
                    Content Card {i}
                  </div>
                ))}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}

const codeString = `"use client"

import { 
  SidebarProvider, 
  Sidebar, 
  SidebarInset,
  NavSection
} from "@/components/ts-web-ui/ts-sidebar"
import { TopBar } from "@/components/ts-web-ui/ts-topbar"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import { Home, Users, Settings, Database, Shield } from "lucide-react"

const NAVIGATION: NavSection[] = [
  {
    title: "Application",
    items: [
      { name: "dashboard", label: "Dashboard", href: "/", icon: Home, exact: true },
      { name: "users", label: "Users", href: "/users", icon: Users },
    ],
  },
  {
    title: "System",
    items: [
      { name: "database", label: "Database", href: "/database", icon: Database },
      { name: "security", label: "Security", href: "/security", icon: Shield },
      { name: "settings", label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      {/* TopBar automatically adds hamburger menu trigger */}
      <TopBar 
        leftContent={<Logo text="My App" href="/" />} 
      />

      <Sidebar 
        navigation={NAVIGATION} 
        logo={<span className="font-semibold text-lg tracking-tight">My App</span>}
      />

      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
`

export default function SidebarPage() {
  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0 pb-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Sidebar</h1>
        <p className="text-muted-foreground mt-2">
          Animated sidebar with support for collapsing and automatic hiding on tablets.
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
          <SidebarDemo />
        </TabsContent>

        <TabsContent
          value="code"
          className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
              <CardDescription>
                Sidebar handles navigation structure automatically via the navigation prop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeString} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab componentName="ts-sidebar" dependencies={["lucide-react"]} />
        </TabsContent>

        <TabsContent
          value="documentation"
          className="flex-1 min-h-0 overflow-auto pt-4 data-[state=inactive]:hidden"
        >
          <div className="space-y-8 pb-8 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Props</CardTitle>
                <CardDescription>Main sidebar container configuration.</CardDescription>
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
                        navigation
                      </TableCell>
                      <TableCell className="text-xs italic">NavSection[] | NavItem[]</TableCell>
                      <TableCell>Data-driven navigation structure</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        logo
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Logo to display in standalone mode (no TopBar)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Floating Trigger</strong> - Hamburger icon stays visible on transparent
                    background when sidebar is closed (standalone mode).
                  </li>
                  <li>
                    <strong>Smart Transitions</strong> - Labels and titles hide only after sidebar
                    narrows completely.
                  </li>
                  <li>
                    <strong>Clean Collapsed State</strong> - No horizontal lines or headers when in
                    narrow mode.
                  </li>
                  <li>
                    <strong>Automatic Layout</strong> - Margin and height adjustments handled by
                    SidebarInset.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
