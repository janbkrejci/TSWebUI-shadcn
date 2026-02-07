"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, User, Settings, Search, Menu


 } from "lucide-react"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'

/**
 * Interaktivní demo TopBaru uvnitř kontejneru
 */
function TopBarDemo() {
  const [showBorder, setShowBorder] = React.useState(true)
  const [showCenter, setShowCenter] = React.useState(true)
  const [height, setHeight] = React.useState(56)

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Ovládací panel */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-card items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Switch id="border" checked={showBorder} onCheckedChange={setShowBorder} />
          <Label htmlFor="border">Border</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="center" checked={showCenter} onCheckedChange={setShowCenter} />
          <Label htmlFor="center">Center content</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="height">Height:</Label>
          <Input 
            id="height" 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-20 h-8"
            min={40}
            max={80}
          />
        </div>
      </div>

      {/* Workspace kontejner */}
      <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-[400px]">
        {/* Pozadí workspace */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 pointer-events-none font-bold text-4xl select-none">
          APP CONTENT
        </div>
        
        {/* TopBar uvnitř kontejneru - relativní pozice */}
        <header
          className={`
            absolute top-0 left-0 right-0 z-10
            flex items-center justify-between gap-4 px-4
            bg-background
            ${showBorder ? 'border-b' : ''}
          `}
          style={{ height }}
        >
          {/* Levá část */}
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-semibold">MyApp</span>
          </div>
          
          {/* Střední část */}
          {showCenter && (
            <div className="flex-1 flex items-center justify-center min-w-0">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 h-9 w-full"
                />
              </div>
            </div>
          )}
          
          {/* Pravá část */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Simulovaný obsah pod TopBarem */}
        <div 
          className="absolute left-0 right-0 bottom-0 p-6 overflow-auto"
          style={{ top: height }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Page Content</h2>
            <p className="text-muted-foreground">
              This area represents the main content of the application, 
              positioned below the TopBar with proper spacing.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="h-24 rounded-lg bg-background border flex items-center justify-center text-muted-foreground"
                >
                  Card {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const codeString = `import { TsTopBar, TopBarLogo, TopBarActions } from "@/components/ts-web-ui/ts-topbar"
import { SidebarTrigger } from "@/components/ts-web-ui/ts-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Bell, User, Settings } from "lucide-react"

const TOP_BAR_HEIGHT = 56

export default function Layout({ children }) {
  return (
    <>
      {/* Fixed TopBar */}
      <TsTopBar
        height={TOP_BAR_HEIGHT}
        bordered={true}
        leftContent={
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <TopBarLogo text="My Application" />
          </div>
        }
        centerContent={
          <SearchInput />
        }
        rightContent={
          <TopBarActions>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <UserMenu />
            <ModeToggle />
          </TopBarActions>
        }
      />
      
      {/* Main content with top margin */}
      <main style={{ marginTop: TOP_BAR_HEIGHT }}>
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
          Aplikační horní lišta fixovaná k hornímu okraji okna s podporou tří slotů pro obsah.
        </p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <TopBarDemo />
        </TabsContent>

        <TabsContent value="code" className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Použití v layoutu</CardTitle>
              <CardDescription>
                TsTopBar se typicky používá v root layoutu aplikace společně se SidebarProvider.
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
                <CardTitle>TsTopBar Props</CardTitle>
                <CardDescription>
                  Konfigurovatelné vlastnosti hlavní komponenty.
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
                      <TableCell className="font-mono text-xs font-semibold text-primary">leftContent</TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell className="text-xs">-</TableCell>
                      <TableCell>Obsah na levé straně (hamburger menu, logo)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">centerContent</TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell className="text-xs">-</TableCell>
                      <TableCell>Obsah uprostřed (vyhledávání, breadcrumbs)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">rightContent</TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell className="text-xs">-</TableCell>
                      <TableCell>Obsah na pravé straně (akce, uživatelské menu)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">height</TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell className="text-xs">56</TableCell>
                      <TableCell>Výška TopBaru v pixelech</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">bordered</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell className="text-xs">true</TableCell>
                      <TableCell>Zobrazit spodní border</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pomocné komponenty</CardTitle>
                <CardDescription>
                  Doplňkové komponenty pro stavbu TopBaru.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Komponenta</TableHead>
                      <TableHead>Popis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">TopBarLogo</TableCell>
                      <TableCell>Logo aplikace s volitelným textem a ikonou</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">TopBarActions</TableCell>
                      <TableCell>Kontejner pro akční tlačítka s mezerami</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">TopBarProvider</TableCell>
                      <TableCell>Context provider pro sdílení výšky TopBaru</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">TopBarSpacer</TableCell>
                      <TableCell>Spacer element pro obsah pod fixovaným TopBarem</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">useTopBar()</TableCell>
                      <TableCell>Hook pro přístup k výšce TopBaru z kontextu</TableCell>
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
                  <li><strong>Fixovaná pozice</strong> - TopBar zůstává viditelný při scrollování</li>
                  <li><strong>Plná šířka</strong> - rozpíná se přes celou šířku viewportu</li>
                  <li><strong>Tři sloty</strong> - levý, střední a pravý pro flexibilní rozložení</li>
                  <li><strong>Responsive</strong> - střední obsah se automaticky zmenšuje</li>
                  <li><strong>Integrace se Sidebarem</strong> - SidebarTrigger se typicky umisťuje vlevo</li>
                  <li><strong>Z-index management</strong> - TopBar je vždy nad obsahem (z-50)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
