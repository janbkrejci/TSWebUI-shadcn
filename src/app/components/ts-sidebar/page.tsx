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
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarSection,
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
 * Sidebar content for demo
 */
function DemoSidebarContent() {
  return (
    <>
      <SidebarContent>
        <SidebarSection title="Navigation">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={<item.icon className="h-5 w-5" />}
              isActive={item.active}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarSection>
      </SidebarContent>
    </>
  )
}

/**
 * Main content of the demo application
 */
function DemoMainContent() {
  return (
    <div className="max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold text-foreground">Page Content</h2>
      <p className="text-muted-foreground">
        Main content area that adjusts to sidebar state. The sidebar can be opened/closed and
        collapsed. Try resizing the window to see responsive behavior.
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
  )
}

/**
 * Interactive Sidebar demo inside a container
 */
function SidebarDemo() {
  const [showTopBar, setShowTopBar] = React.useState(true)
  const topBarHeight = showTopBar ? 56 : 0

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
      <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-[450px]">
        {/* Workspace background */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 pointer-events-none font-bold text-4xl select-none z-0">
          APP CONTENT
        </div>

        {/* SidebarProvider for isolated demo */}
        <SidebarProvider
          defaultOpen={true}
          mobileBreakpoint={768}
          topBarHeight={topBarHeight}
          width="16rem"
          collapsedWidth="4rem"
        >
          {/* TopBar (optional) */}
          {showTopBar && (
            <header className="absolute top-0 left-0 right-0 h-14 z-50 flex items-center gap-4 px-4 bg-background border-b">
              <SidebarTrigger />
              <span className="font-semibold">Application</span>
            </header>
          )}

          {/* Sidebar inside container - uses actual component */}
          <Sidebar className="!absolute">
            <DemoSidebarContent />
          </Sidebar>

          {/* Main content with controls */}
          <SidebarInset className="!absolute !inset-0 overflow-auto">
            <SidebarControls />
            <DemoMainContent />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}

const codeString = `import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from "@/components/ts-web-ui/ts-sidebar"

// In your layout:
export default function Layout({ children }) {
  return (
    <SidebarProvider 
      defaultOpen={true} 
      mobileBreakpoint={1024}
      topBarHeight={56}
    >
      <TsTopBar 
        leftContent={<SidebarTrigger />}
        // ... other props
      />
      
      <Sidebar>
        <SidebarContent>
          <SidebarSection title="Navigation">
            <SidebarItem icon={<Home />} isActive>
              Dashboard
            </SidebarItem>
            <SidebarItem icon={<Users />}>
              Users
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
        
        <SidebarFooter>
          <UserMenu />
        </SidebarFooter>
      </Sidebar>
      
      {/* SidebarInset automatically adjusts margin based on sidebar state */}
      <SidebarInset className="px-6 py-6">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

// Accessing sidebar state in child components:
function MyComponent() {
  const { 
    isOpen,         // boolean - is sidebar visible
    toggle,         // () => void - toggle sidebar
    isCollapsed,    // boolean - is sidebar collapsed to icons only
    toggleCollapsed,// () => void - toggle collapsed state
    isMobile        // boolean - is mobile breakpoint active
  } = useSidebar()
  
  return (
    <Button onClick={toggleCollapsed}>
      Toggle Collapsed
    </Button>
  )
}`

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
                Sidebar is used in combination with SidebarProvider and optionally with TsTopBar.
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
                <CardTitle>SidebarProvider Props</CardTitle>
                <CardDescription>Context provider for sidebar state management.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Prop</TableHead>
                      <TableHead className="w-32">Type</TableHead>
                      <TableHead className="w-24">Default</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        defaultOpen
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell className="text-xs">true</TableCell>
                      <TableCell>Default open state of the sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        mobileBreakpoint
                      </TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell className="text-xs">768</TableCell>
                      <TableCell>Breakpoint for mobile mode (px)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        topBarHeight
                      </TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell className="text-xs">56</TableCell>
                      <TableCell>TopBar height for correct offset</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        width
                      </TableCell>
                      <TableCell className="text-xs italic">string</TableCell>
                      <TableCell className="text-xs">&quot;16rem&quot;</TableCell>
                      <TableCell>Width of the expanded sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        collapsedWidth
                      </TableCell>
                      <TableCell className="text-xs italic">string</TableCell>
                      <TableCell className="text-xs">&quot;4rem&quot;</TableCell>
                      <TableCell>Width of the collapsed sidebar</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>useSidebar Hook</CardTitle>
                <CardDescription>
                  Hook to access the sidebar state from any component.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Property</TableHead>
                      <TableHead className="w-48">Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        isOpen
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Whether the sidebar is visible</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        toggle
                      </TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Toggle sidebar visibility</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        open
                      </TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Open the sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        close
                      </TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Close the sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        isCollapsed
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Whether the sidebar is collapsed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        toggleCollapsed
                      </TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Toggle collapsed state</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        isMobile
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Whether the mobile breakpoint is active</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>Building blocks for assembling the sidebar.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Component</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarProvider
                      </TableCell>
                      <TableCell>Context provider for state management</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        Sidebar
                      </TableCell>
                      <TableCell>Main sidebar container</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarContent
                      </TableCell>
                      <TableCell>Scrollable main content</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarSection
                      </TableCell>
                      <TableCell>Section with an optional title</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarItem
                      </TableCell>
                      <TableCell>Navigation item with icon</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarFooter
                      </TableCell>
                      <TableCell>Bottom part of the sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarTrigger
                      </TableCell>
                      <TableCell>Button to open/close the sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        SidebarInset
                      </TableCell>
                      <TableCell>Main content with automatic offset</TableCell>
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
                    <strong>Animated transitions</strong> - smooth opening, closing, and collapsing
                  </li>
                  <li>
                    <strong>Collapsed mode</strong> - shows only icons to save space
                  </li>
                  <li>
                    <strong>Responsive design</strong> - automatic hiding/showing on window resize
                  </li>
                  <li>
                    <strong>Push vs Overlay</strong> - content shifts on desktop, overlay on mobile
                  </li>
                  <li>
                    <strong>TopBar integration</strong> - correct offset using topBarHeight
                  </li>
                  <li>
                    <strong>SidebarInset</strong> - automatically responds to sidebar state
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
