"use client"

import {
  BarChart,
  BookOpen,
  Calendar,
  Home,
  Mail,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"

import * as React from "react"
import { useTsLocale } from "@/components/ts-web-ui/locale"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { TsLayout } from "@/components/ts-web-ui/ts-layout"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import { NavSection } from "@/components/ts-web-ui/ts-sidebar"
import { TopBarGroup } from "@/components/ts-web-ui/ts-topbar"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const NAVIGATION: NavSection[] = [
  {
    title: "Application",
    items: [
      { name: "dashboard", label: "Dashboard", href: "#", icon: Home },
      { name: "analytics", label: "Analytics", href: "#", icon: BarChart },
      { name: "users", label: "Users", href: "#", icon: Users },
    ],
  },
  {
    title: "Personal",
    items: [
      { name: "messages", label: "Messages", href: "#", icon: Mail },
      { name: "calendar", label: "Calendar", href: "#", icon: Calendar },
      { name: "settings", label: "Settings", href: "#", icon: Settings },
    ],
  },
]

/**
 * Interactive Integrated Demo
 */
function IntegratedDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  return (
    <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-125">
      <TsLayout
        contained
        navigation={NAVIGATION}
        topBarLeft={<Logo text="IntegratedApp" />}
        topBarCenter={
          <div className="relative w-64 max-w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Global search..." className="pl-8 h-9" />
          </div>
        }
        topBarRight={
          <TopBarGroup>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
            <ModeToggle />
          </TopBarGroup>
        }
      >
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{d.integratedDashboardTitle}</h2>
            <p className="text-muted-foreground">{d.integratedDashboardDesc}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{d.integratedTotalUsers}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{d.integratedActiveSessions}</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">432</div>
                <p className="text-xs text-muted-foreground">+5% from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">-2 since yesterday</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Features</CardTitle>
              <CardDescription>What makes this combination powerful</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Auto-Hamburger</strong>: TopBar automatically adds the menu trigger when
                  placed inside SidebarProvider.
                </li>
                <li>
                  <strong>Shared Height</strong>: Both components respect the same topBarHeight for
                  perfect alignment.
                </li>
                <li>
                  <strong>Coordinated States</strong>: The sidebar can be toggled from the top bar
                  or its own internal controls.
                </li>
                <li>
                  <strong>Responsive Design</strong>: Automatically switches to overlay mode on
                  smaller screens.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TsLayout>
    </div>
  )
}

const codeString = `"use client"

import { TopBarGroup } from "@/components/ts-web-ui/ts-topbar"
import { Logo } from "@/components/ts-web-ui/ts-logo"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { Home, Users } from "lucide-react"
import { TsLayout } from "@/components/ts-web-ui/ts-layout"
import { ThemeProvider } from "@/components/ts-web-ui/theme-provider"  

const NAVIGATION = [
  {
    title: "Application",
    items: [
      { name: "dashboard", label: "Dashboard", href: "/", icon: Home, exact: true },
      { name: "test", label: "Test", href: "/test", icon: Users },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <ThemeProvider> 
          <TsLayout
            navigation={NAVIGATION}
            logo={<Logo text="My Application" href="/" />}
            topBarRight={
              <TopBarGroup>
                <ModeToggle />
              </TopBarGroup>
            }
          >
            {children}
          </TsLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}`

export default function IntegratedLayoutPage() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0 pb-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Integrated Layout</h1>
        <p className="text-muted-foreground mt-2">{d.integratedLayoutPageDesc}</p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">{d.tabPreview}</TabsTrigger>
          <TabsTrigger value="code">{d.tabCode}</TabsTrigger>
          <TabsTrigger value="install">{d.tabInstall}</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <IntegratedDemo />
        </TabsContent>

        <TabsContent
          value="code"
          className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Integrated Usage</CardTitle>
              <CardDescription>
                The most common pattern for building complex administrative applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={codeString} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab
            componentName="ts-layout"
            dependencies={[]}
            instructions="Installs the integrated application layout shell and all its dependencies (TopBar, Sidebar)."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
