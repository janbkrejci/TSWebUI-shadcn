"use client"

import * as React from "react"
import { TsTable } from "@/components/ts-web-ui/ts-table"
import { TsTableColumnDef } from "@/components/ts-web-ui/ts-table/columns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'

const tableData = [
    { id: 1, name: "Jana Nováková", username: "jana_n", email: "jana@example.com", city: "Praha", phone: "555-1234", website: "www.jananovakova.com", company: "Novák s.r.o.", turnover: 125000.50, contractDate: "2022-03-15", approved: true },
    { id: 2, name: "Petr Svoboda", username: "petr_s", email: "petr@example.com", city: "Brno", phone: "555-5678", website: "www.petrsvoboda.com", company: "Svoboda a.s.", turnover: 89000.75, contractDate: "2019-07-22", approved: false },
    { id: 3, name: "Marie Černá", username: "marie_c", email: "marie@example.com", city: "Ostrava", phone: "555-8765", website: "www.mariecerna.com", company: "Černá spol. s r.o.", turnover: 234000.25, contractDate: "2024-01-10", approved: true },
    { id: 4, name: "Tomáš Dvořák", username: "tomas_d", email: "tomas@example.com", city: "Plzeň", phone: "555-4321", website: "www.tomasdvorak.com", company: "Dvořák s.r.o.", turnover: 156000.00, contractDate: "2020-05-08", approved: true },
    { id: 5, name: "Eva Procházková", username: "eva_p", email: "eva@example.com", city: "České Budějovice", phone: "555-2468", website: "www.evaprocha.com", company: "Procházka a syn", turnover: 78000.90, contractDate: "2018-09-14", approved: false },
    { id: 6, name: "Jiří Krejčí", username: "jiri_k", email: "jiri@example.com", city: "Hradec Králové", phone: "555-1357", website: "www.jirikrejci.com", company: "Krejčí Group s.r.o.", turnover: 312000.45, contractDate: "2021-02-28", approved: true },
    { id: 7, name: "Alena Horáková", username: "alena_h", email: "alena@example.com", city: "Pardubice", phone: "555-9753", website: "www.alenahorak.com", company: "Horák s.r.o.", turnover: 187000.30, contractDate: "2025-11-03", approved: false },
    { id: 8, name: "Pavel Němeček", username: "pavel_n", email: "pavel@example.com", city: "Liberec", phone: "555-8642", website: "www.pavelnemecek.com", company: "Němeček a partneři", turnover: 95000.60, contractDate: "2019-06-19", approved: true },
    { id: 9, name: "Tereza Poláková", username: "tereza_p", email: "tereza@example.com", city: "Olomouc", phone: "555-7531", website: "www.terezapolak.com", company: "Polák Group s.r.o.", turnover: 268000.80, contractDate: "2023-04-12", approved: true },
    { id: 10, name: "Martin Veselý", username: "martin_v", email: "martin@example.com", city: "Zlín", phone: "555-1597", website: "www.martinvesely.com", company: "Veselý a.s.", turnover: 134000.15, contractDate: "2020-08-27", approved: false },
]

const columnDefinitions: TsTableColumnDef[] = [
    { key: 'id', title: 'ID', type: 'number', visible: false, align: 'right' },
    { key: 'name', title: 'Jméno', type: 'text', sortable: true, filterable: true, visible: true, align: 'left', isClickable: true },
    { key: 'username', title: 'Uživatel', type: 'text', visible: false },
    { key: 'email', title: 'E-mail', type: 'text', visible: true, canBeCopied: true },
    { key: 'city', title: 'Město', type: 'text', visible: true },
    { key: 'company', title: 'Firma', type: 'text', visible: true, isClickable: true },
    { key: 'turnover', title: 'Obrat', type: 'number', sortable: true, visible: true, align: 'right' },
    { key: 'contractDate', title: 'Smlouva', type: 'date', sortable: true, visible: true, align: 'right' },
    { key: 'approved', title: 'Schváleno', type: 'boolean', visible: true, align: 'center' }
]

export default function TsTablePage() {
  const [lastAction, setLastAction] = React.useState<string | null>(null)

  const handleRowClick = (row: any, columnKey?: string) => {
    setLastAction(`Kliknuto na řádek ID: ${row.id}${columnKey ? `, sloupec: ${columnKey}` : ""}`)
  }

  const handleCreate = () => {
    setLastAction("Kliknuto na 'Nový záznam'")
  }

  const handleAction = (action: string, row: any) => {
      setLastAction(`Akce: ${action} pro ${row.name}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TS Table</h1>
        <p className="text-muted-foreground mt-2">
          Feature-rich data grid with advanced filtering, sorting, and export capabilities.
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Try sorting, filtering (use &gt;10 or 10..20 for numbers), column selection, and exports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TsTable 
                data={tableData} 
                columnDefinitions={columnDefinitions} 
                title="Client Management"
                onRowClick={handleRowClick}
                onCreateClick={handleCreate}
                onAction={handleAction}
                singleItemActions="edit/Edit,delete/Delete,details/Details"
              />
              {lastAction && (
                <div className="mt-4 p-3 bg-muted border rounded-md text-sm font-mono text-primary animate-in fade-in">
                  <span className="font-bold mr-2">Last Action:</span> {lastAction}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
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
{`import { TsTable } from "@/components/ts-web-ui/ts-table"

const columns = [
  { key: 'name', title: 'Name', type: 'text', sortable: true },
  { key: 'email', title: 'E-mail', type: 'text', canBeCopied: true },
  { key: 'turnover', title: 'Turnover', type: 'number', align: 'right' },
  { key: 'approved', title: 'Approved', type: 'boolean', align: 'center' }
]

export default function MyPage() {
  return (
    <TsTable 
      data={data} 
      columnDefinitions={columns} 
      title="User List"
      singleItemActions="edit/Edit,delete/Delete"
      onAction={(action, row) => console.log(action, row)}
    />
  )
}`}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="pt-4">
          <div className="space-y-8 pb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Component Properties</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Prop</TableHead>
                                <TableHead className="w-[150px]">Type</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-mono text-xs">data</TableCell>
                                <TableCell className="text-xs italic">any[]</TableCell>
                                <TableCell>Array of objects to display in the table.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">columnDefinitions</TableCell>
                                <TableCell className="text-xs italic">TsTableColumnDef[]</TableCell>
                                <TableCell>Configuration for each column (see below).</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">title</TableCell>
                                <TableCell className="text-xs italic">string</TableCell>
                                <TableCell>Title displayed in the toolbar.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">singleItemActions</TableCell>
                                <TableCell className="text-xs italic">string</TableCell>
                                <TableCell>Comma-separated actions in "action/Label" format.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">predefinedFilters</TableCell>
                                <TableCell className="text-xs italic">Record&lt;string, any&gt;</TableCell>
                                <TableCell>Initial filters that cannot be cleared by the user.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">showCreateButton</TableCell>
                                <TableCell className="text-xs italic">boolean</TableCell>
                                <TableCell>Whether to show the "Create" button (default: true).</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Column Definition</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Property</TableHead>
                                <TableHead className="w-[150px]">Type</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">key</TableCell>
                                <TableCell className="text-xs italic">string</TableCell>
                                <TableCell>Data key for the column.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">title</TableCell>
                                <TableCell className="text-xs italic">string</TableCell>
                                <TableCell>Label shown in the header.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">type</TableCell>
                                <TableCell className="text-xs italic">"text" | "number" | "date" | "boolean"</TableCell>
                                <TableCell>Determines formatting and filter behavior.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">sortable</TableCell>
                                <TableCell className="text-xs italic">boolean</TableCell>
                                <TableCell>Enables sorting for this column.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">filterable</TableCell>
                                <TableCell className="text-xs italic">boolean</TableCell>
                                <TableCell>Enables the filter input in the header.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">isClickable</TableCell>
                                <TableCell className="text-xs italic">boolean</TableCell>
                                <TableCell>If true, cell click returns columnKey in onRowClick.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs font-semibold">canBeCopied</TableCell>
                                <TableCell className="text-xs italic">boolean</TableCell>
                                <TableCell>Adds a copy-to-clipboard button to cells.</TableCell>
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