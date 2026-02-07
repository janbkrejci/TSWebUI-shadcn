"use client"

import { Palette, PanelTop, Search, User } from "lucide-react"

import * as React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus"

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

import { TopBarLogo, TsTopBar } from "@/components/ts-web-ui/ts-topbar"
import { InstallTab } from "@/components/ts-web-ui/widget-demo"

/**
 * Interaktivní demo TopBaru
 */
function TopBarDemo() {
  const [showCenter, setShowCenter] = React.useState(true)
  const [isBordered, setIsBordered] = React.useState(true)
  const [height, setHeight] = React.useState(56)

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Ovládací panel */}
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

      {/* Workspace kontejner */}
      <div className="flex-1 relative border rounded-lg bg-slate-100 dark:bg-slate-950 overflow-hidden shadow-inner min-h-[300px]">
        {/* Pozadí workspace */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 pointer-events-none font-bold text-4xl select-none z-0">
          PAGE CONTENT
        </div>

        {/* TopBar uvnitř kontejneru - používá !absolute pro demo účely */}
        <TsTopBar
          height={height}
          bordered={isBordered}
          className="!absolute"
          leftContent={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                <PanelTop className="h-5 w-5" />
              </div>
              <TopBarLogo text="MyApplication" />
            </div>
          }
          centerContent={
            showCenter ? (
              <div className="relative w-64 max-w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search everything..." className="pl-8 h-9" />
              </div>
            ) : null
          }
          rightContent={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Palette className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          }
        />
      </div>
    </div>
  )
}

const codeString = `import { TsTopBar, TopBarLogo, TopBarActions } from "@/components/ts-web-ui/ts-topbar"
import { ModeToggle } from "@/components/ts-web-ui/mode-toggle"
import { SidebarTrigger } from "@/components/ts-web-ui/ts-sidebar"

export default function Layout({ children }) {
  return (
    <>
      <TsTopBar
        height={56}
        leftContent={
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <TopBarLogo text="TSWebUI" href="/" />
          </div>
        }
        rightContent={
          <TopBarActions>
            <Button variant="ghost">Docs</Button>
            <ModeToggle />
          </TopBarActions>
        }
      />
      
      <main className="mt-[56px]">
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
          Univerzální horní lišta pro navigaci, loga a globální akce aplikace.
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
              <CardTitle>Základní použití</CardTitle>
              <CardDescription>
                TopBar je fixně umístěn na horní hraně okna a poskytuje sloty pro obsah.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SyntaxHighlighter
                language="tsx"
                style={vscDarkPlus}
                customStyle={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                }}
              >
                {codeString}
              </SyntaxHighlighter>
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
                <CardTitle>TsTopBar Props</CardTitle>
                <CardDescription>Vlastnosti hlavní komponenty horní lišty.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Prop</TableHead>
                      <TableHead className="w-32">Typ</TableHead>
                      <TableHead>Popis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        leftContent
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Obsah vlevo (hamburger, logo)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        centerContent
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Obsah uprostřed (vyhledávání, breadcrumbs)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        rightContent
                      </TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Obsah vpravo (akce, uživatelské menu)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        height
                      </TableCell>
                      <TableCell className="text-xs italic">number</TableCell>
                      <TableCell>Výška v pixelech (default: 56)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        bordered
                      </TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>Zobrazit spodní linku (default: true)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pomocné komponenty</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Komponenta</TableHead>
                      <TableHead>Účel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold">TopBarLogo</TableCell>
                      <TableCell>
                        Formátované logo s podporou textu, ikony a odkazu (Next.js Link).
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold">
                        TopBarActions
                      </TableCell>
                      <TableCell>Wrapper pro skupinu tlačítek s jednotným odsazením.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-semibold">
                        TopBarSpacer
                      </TableCell>
                      <TableCell>Prvek pro odsazení obsahu pod fixovanou lištou.</TableCell>
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
