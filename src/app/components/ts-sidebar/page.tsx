"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Home, Settings, Users, FolderOpen, 
  BarChart, Calendar, Mail, BookOpen
} from "lucide-react"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarTrigger,
  SidebarInset,
  SidebarCollapseTrigger,
  useSidebar
} from "@/components/ts-web-ui/ts-sidebar"

/**
 * Menu položky pro demo
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
 * Komponenta pro ovládání demo sidebaru
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
        <Switch id="collapsed" checked={isCollapsed} onCheckedChange={toggleCollapsed} disabled={!isOpen} />
        <Label htmlFor="collapsed" className={!isOpen ? 'opacity-50' : ''}>Collapsed</Label>
      </div>
      <div className="text-sm text-muted-foreground">
        Mode: <span className="font-medium">{isMobile ? 'Mobile (overlay)' : 'Desktop (push)'}</span>
      </div>
    </div>
  )
}

/**
 * Obsah sidebaru pro demo
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
 * Hlavní obsah demo aplikace
 */
function DemoMainContent() {
  return (
    <div className="max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold text-foreground">Page Content</h2>
      <p className="text-muted-foreground">
        Main content area that adjusts to sidebar state. 
        The sidebar can be opened/closed and collapsed.
        Try resizing the window to see responsive behavior.
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
 * Interaktivní demo Sidebaru uvnitř kontejneru
 */
function SidebarDemo() {
  const [showTopBar, setShowTopBar] = React.useState(true)
  const topBarHeight = showTopBar ? 56 : 0

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Ovládací panel mimo SidebarProvider */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-card items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Switch id="topbar" checked={showTopBar} onCheckedChange={setShowTopBar} />
          <Label htmlFor="topbar">Show TopBar</Label>
        </div>
      </div>

      {/* Workspace kontejner */}
      <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-[450px]">
        {/* Pozadí workspace */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 pointer-events-none font-bold text-4xl select-none z-0">
          APP CONTENT
        </div>

        {/* SidebarProvider pro izolovanou demo */}
        <SidebarProvider 
          defaultOpen={true} 
          mobileBreakpoint={768}
          topBarHeight={topBarHeight}
          width="16rem"
          collapsedWidth="4rem"
        >
          {/* TopBar (volitelný) */}
          {showTopBar && (
            <header className="absolute top-0 left-0 right-0 h-14 z-50 flex items-center gap-4 px-4 bg-background border-b">
              <SidebarTrigger />
              <span className="font-semibold">Application</span>
            </header>
          )}
          
          {/* Sidebar uvnitř kontejneru - používá skutečnou komponentu */}
          <Sidebar className="!absolute">
            <DemoSidebarContent />
          </Sidebar>

          {/* Hlavní obsah s kontrolami */}
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
          Animovaný postranní panel s podporou kolapsování a automatického skrývání na tabletech.
        </p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <SidebarDemo />
        </TabsContent>

        <TabsContent value="code" className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Základní použití</CardTitle>
              <CardDescription>
                Sidebar se používá v kombinaci se SidebarProvider a volitelně s TsTopBar.
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
                <CardTitle>SidebarProvider Props</CardTitle>
                <CardDescription>
                  Context provider pro správu stavu sidebaru.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Prop</TableHead>
                      <TableHead className="w-32">Typ</TableHead>
                      <TableHead className="w-24">Default</TableHead>
                      <TableHead>Popis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">defaultOpen</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell className="text-xs">true</TableCell>
                      <TableCell>Výchozí stav otevření sidebaru</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">mobileBreakpoint</TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell className="text-xs">768</TableCell>
                      <TableCell>Breakpoint pro mobilní režim (px)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">topBarHeight</TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell className="text-xs">56</TableCell>
                      <TableCell>Výška TopBaru pro správné odsazení</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">width</TableCell>
                      <TableCell className="text-xs italic">string</TableCell>
                      <TableCell className="text-xs">"16rem"</TableCell>
                      <TableCell>Šířka rozšířeného sidebaru</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">collapsedWidth</TableCell>
                      <TableCell className="text-xs italic">string</TableCell>
                      <TableCell className="text-xs">"4rem"</TableCell>
                      <TableCell>Šířka kolapsovaného sidebaru</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>useSidebar Hook</CardTitle>
                <CardDescription>
                  Hook pro přístup ke stavu sidebaru z libovolné komponenty.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Property</TableHead>
                      <TableHead className="w-48">Typ</TableHead>
                      <TableHead>Popis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">isOpen</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Je sidebar viditelný</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">toggle</TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Přepnout viditelnost sidebaru</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">open</TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Otevřít sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">close</TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Zavřít sidebar</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">isCollapsed</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Je sidebar kolapsován</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">toggleCollapsed</TableCell>
                      <TableCell className="text-xs italic">() =&gt; void</TableCell>
                      <TableCell>Přepnout kolapsovaný stav</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">isMobile</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Je aktivní mobilní breakpoint</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Komponenty</CardTitle>
                <CardDescription>
                  Stavební bloky pro sestavení sidebaru.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Komponenta</TableHead>
                      <TableHead>Popis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarProvider</TableCell>
                      <TableCell>Context provider pro správu stavu</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">Sidebar</TableCell>
                      <TableCell>Hlavní kontejner sidebaru</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarContent</TableCell>
                      <TableCell>Scrollovatelný hlavní obsah</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarSection</TableCell>
                      <TableCell>Sekce s volitelným titulkem</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarItem</TableCell>
                      <TableCell>Navigační položka s ikonou</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarFooter</TableCell>
                      <TableCell>Spodní část sidebaru</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarTrigger</TableCell>
                      <TableCell>Tlačítko pro otevření/zavření</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">SidebarInset</TableCell>
                      <TableCell>Hlavní obsah s automatickým odsazením</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vlastnosti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li><strong>Animované přechody</strong> - plynulé otevírání, zavírání a kolapsování</li>
                  <li><strong>Kolapsovaný režim</strong> - zobrazí pouze ikony pro úsporu místa</li>
                  <li><strong>Responzivní design</strong> - automatické skrytí/zobrazení při změně velikosti okna</li>
                  <li><strong>Push vs Overlay</strong> - na desktopu obsah uhýbá, na mobile je overlay</li>
                  <li><strong>Integrace s TopBarem</strong> - správné odsazení pomocí topBarHeight</li>
                  <li><strong>SidebarInset</strong> - automaticky reaguje na stav sidebaru</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
