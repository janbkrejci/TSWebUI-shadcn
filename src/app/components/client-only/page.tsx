"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClientOnly } from "@/components/ts-web-ui/client-only"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'

function BrowserOnlyContent() {
  const [windowWidth, setWindowWidth] = React.useState(0)
  
  React.useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="p-4 border rounded-lg bg-card">
      <p className="text-sm text-muted-foreground mb-2">This content uses browser APIs:</p>
      <p className="font-mono text-lg">Window width: <strong>{windowWidth}px</strong></p>
    </div>
  )
}

function ClientOnlyDemo() {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      <Card>
        <CardHeader>
          <CardTitle>ClientOnly Demo</CardTitle>
          <CardDescription>
            The component below only renders on the client, with a loading fallback during SSR.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientOnly fallback={
            <div className="p-4 border rounded-lg bg-muted animate-pulse">
              <p className="text-muted-foreground">Loading client-side content...</p>
            </div>
          }>
            <BrowserOnlyContent />
          </ClientOnly>
          
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              The content above uses <code>window.innerWidth</code> which is not available during SSR.
              Without <code>ClientOnly</code>, this would cause hydration errors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const codeString = `import { ClientOnly } from "@/components/client-only"

// Component that uses browser APIs
function BrowserOnlyContent() {
  const [windowWidth, setWindowWidth] = React.useState(0)
  
  React.useEffect(() => {
    setWindowWidth(window.innerWidth)
  }, [])
  
  return <p>Window width: {windowWidth}px</p>
}

// Usage with ClientOnly wrapper
export default function MyPage() {
  return (
    <ClientOnly 
      fallback={<div>Loading...</div>}
    >
      <BrowserOnlyContent />
    </ClientOnly>
  )
}`

export default function ClientOnlyPage() {
  return (
    <div className="flex flex-col flex-1 gap-6 min-h-0 pb-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Client Only</h1>
        <p className="text-muted-foreground mt-2">
          A wrapper component that ensures children render only on the client side, preventing SSR hydration errors.
        </p>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 pt-4">
          <ClientOnlyDemo />
        </TabsContent>

        <TabsContent value="code" className="flex-1 min-h-0 overflow-auto py-6 data-[state=inactive]:hidden">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
              <CardDescription>
                Wrap components that use browser APIs in ClientOnly to prevent SSR errors.
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
                <CardTitle>ClientOnly Props</CardTitle>
                <CardDescription>
                  Simple component with just two props.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-37.5">Prop</TableHead>
                      <TableHead className="w-37.5">Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">children</TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Content to render only on the client.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">fallback</TableCell>
                      <TableCell className="text-xs italic">ReactNode</TableCell>
                      <TableCell>Optional content shown during SSR (default: null).</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>When to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Components that access <code>window</code>, <code>document</code>, or other browser APIs</li>
                  <li>Third-party libraries that don't support SSR</li>
                  <li>Components with browser-specific event listeners on mount</li>
                  <li>Preventing hydration mismatches between server and client</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
