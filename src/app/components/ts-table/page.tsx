"use client"

import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { TsTable } from "@/components/ts-web-ui/ts-table"
import { TsTableColumnDef } from "@/components/ts-web-ui/ts-table/columns"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"

interface TableItem {
  [key: string]: unknown
  id: number
  name: string
  username: string
  email: string
  city: string
  phone: string
  website: string
  company: string
  turnover: number
  contractDate: string
  approved: boolean
}

const tableData: TableItem[] = [
  {
    id: 1,
    name: "Jane Doe",
    username: "jane_d",
    email: "jane@example.com",
    city: "Prague",
    phone: "555-1234",
    website: "www.janedoe.com",
    company: "Doe & Co.",
    turnover: 125000.5,
    contractDate: "2022-03-15",
    approved: true,
  },
  {
    id: 2,
    name: "John Smith",
    username: "john_s",
    email: "john@example.com",
    city: "New York",
    phone: "555-5678",
    website: "www.johnsmith.com",
    company: "Smith Global",
    turnover: 89000.75,
    contractDate: "2019-07-22",
    approved: false,
  },
  {
    id: 3,
    name: "Mary Black",
    username: "mary_b",
    email: "mary@example.com",
    city: "London",
    phone: "555-8765",
    website: "www.maryblack.com",
    company: "Black & Partners",
    turnover: 234000.25,
    contractDate: "2024-01-10",
    approved: true,
  },
  {
    id: 4,
    name: "Thomas Miller",
    username: "thomas_m",
    email: "thomas@example.com",
    city: "Berlin",
    phone: "555-4321",
    website: "www.thomasmiller.com",
    company: "Miller AG",
    turnover: 156000.0,
    contractDate: "2020-05-08",
    approved: true,
  },
  {
    id: 5,
    name: "Eva Green",
    username: "eva_g",
    email: "eva@example.com",
    city: "Paris",
    phone: "555-2468",
    website: "www.evagreen.com",
    company: "Green & Son",
    turnover: 78000.9,
    contractDate: "2018-09-14",
    approved: false,
  },
  {
    id: 6,
    name: "George Tailor",
    username: "george_t",
    email: "george@example.com",
    city: "Vienna",
    phone: "555-1357",
    website: "www.georgetailor.com",
    company: "Tailor Group",
    turnover: 312000.45,
    contractDate: "2021-02-28",
    approved: true,
  },
  {
    id: 7,
    name: "Alice Baker",
    username: "alice_b",
    email: "alice@example.com",
    city: "Sydney",
    phone: "555-9753",
    website: "www.alicebaker.com",
    company: "Baker Ltd.",
    turnover: 187000.3,
    contractDate: "2025-11-03",
    approved: false,
  },
  {
    id: 8,
    name: "Paul Newman",
    username: "paul_n",
    email: "paul@example.com",
    city: "Toronto",
    phone: "555-8642",
    website: "www.paulnewman.com",
    company: "Newman & Co.",
    turnover: 95000.6,
    contractDate: "2019-06-19",
    approved: true,
  },
  {
    id: 9,
    name: "Tracy Pollard",
    username: "tracy_p",
    email: "tracy@example.com",
    city: "Chicago",
    phone: "555-7531",
    website: "www.tracypollard.com",
    company: "Pollard Group",
    turnover: 268000.8,
    contractDate: "2023-04-12",
    approved: true,
  },
  {
    id: 10,
    name: "Martin West",
    username: "martin_w",
    email: "martin@example.com",
    city: "San Francisco",
    phone: "555-1597",
    website: "www.martinwest.com",
    company: "West Inc.",
    turnover: 134000.15,
    contractDate: "2020-08-27",
    approved: false,
  },
]

const columnDefinitions: TsTableColumnDef[] = [
  { key: "id", title: "ID", type: "number", visible: false, align: "right" },
  {
    key: "name",
    title: "Name",
    type: "text",
    sortable: true,
    filterable: true,
    visible: true,
    align: "left",
    isClickable: true,
  },
  { key: "username", title: "Username", type: "text", visible: false },
  { key: "email", title: "E-mail", type: "text", visible: true, canBeCopied: true },
  { key: "city", title: "City", type: "text", visible: true },
  { key: "company", title: "Company", type: "text", visible: true, isClickable: true },
  {
    key: "turnover",
    title: "Turnover",
    type: "number",
    sortable: true,
    visible: true,
    align: "right",
  },
  {
    key: "contractDate",
    title: "Contract",
    type: "date",
    sortable: true,
    visible: true,
    align: "right",
  },
  { key: "approved", title: "Approved", type: "boolean", visible: true, align: "center" },
]

export default function TsTablePage() {
  const [lastAction, setLastAction] = React.useState<string | null>(null)

  const handleRowClick = (row: unknown, columnKey?: string) => {
    const item = row as TableItem
    setLastAction(`Clicked on row ID: ${item.id}${columnKey ? `, column: ${columnKey}` : ""}`)
  }

  const handleCreate = () => {
    setLastAction("Clicked on 'New record'")
  }

  const handleAction = (action: string, row: unknown) => {
    const item = row as TableItem
    setLastAction(`Action: ${action} for ${item.name}`)
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
          <TabsTrigger value="install">Install</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Try sorting, filtering (use &gt;10 or 10..20 for numbers), column selection, and
                exports.
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
              <CodeBlock
                code={`import { TsTable } from "@/components/ts-web-ui/ts-table"

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
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab
            componentName="ts-table"
            dependencies={["@tanstack/react-table", "lucide-react", "xlsx", "date-fns"]}
          />
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
                      <TableCell className="text-xs italic">unknown[]</TableCell>
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
                      <TableCell>
                        Comma-separated actions in &quot;action/Label&quot; format.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">predefinedFilters</TableCell>
                      <TableCell className="text-xs italic">
                        Record&lt;string, unknown&gt;
                      </TableCell>
                      <TableCell>Initial filters that cannot be cleared by the user.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">showCreateButton</TableCell>
                      <TableCell className="text-xs italic">boolean</TableCell>
                      <TableCell>
                        Whether to show the &quot;Create&quot; button (default: true).
                      </TableCell>
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
                      <TableCell className="text-xs italic">
                        &quot;text&quot; | &quot;number&quot; | &quot;date&quot; |
                        &quot;boolean&quot;
                      </TableCell>
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
