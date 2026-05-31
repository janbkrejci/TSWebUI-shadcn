"use client"

import * as React from "react"
import { useTsLocale } from "@/components/ts-web-ui/locale"
import { ImportResult, TsTable, TsTableColumnDef } from "@/components/ts-web-ui/ts-table"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"
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

function ToggleControl({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onCheckedChange} id={`toggle-${label}`} />
      <Label htmlFor={`toggle-${label}`} className="text-sm cursor-pointer">
        {label}
      </Label>
    </div>
  )
}

export default function TsTablePage() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const columnDefinitions: TsTableColumnDef[] = [
    { key: "id", title: d.colId, type: "number", visible: false, align: "right", unshowable: true },
    {
      key: "name",
      title: d.colName,
      type: "text",
      sortable: true,
      filterable: true,
      visible: true,
      align: "left",
      isClickable: true,
    },
    // excludeFromExport: kept in the grid but stripped from the Excel export.
    {
      key: "username",
      title: d.colUsername,
      type: "text",
      visible: false,
      excludeFromExport: true,
    },
    { key: "email", title: d.colEmail, type: "text", visible: true, canBeCopied: true },
    { key: "city", title: d.colCity, type: "text", visible: true },
    { key: "company", title: d.colCompany, type: "text", visible: true, isClickable: true },
    {
      key: "turnover",
      title: d.colTurnover,
      type: "number",
      sortable: true,
      visible: true,
      align: "right",
      locale: "cs-CZ",
      decimalPlaces: 2,
    },
    {
      key: "contractDate",
      title: d.colContract,
      type: "date",
      sortable: true,
      visible: true,
      align: "right",
      locale: "cs-CZ",
    },
    { key: "approved", title: d.colApproved, type: "boolean", visible: true, align: "center" },
  ]

  const [lastAction, setLastAction] = React.useState<string | null>(null)

  // Feature toggles
  const [enableSelection, setEnableSelection] = React.useState(true)
  const [enableSorting, setEnableSorting] = React.useState(true)
  const [enableFiltering, setEnableFiltering] = React.useState(true)
  const [enablePagination, setEnablePagination] = React.useState(true)
  const [enableRowMenu, setEnableRowMenu] = React.useState(true)
  const [enableClickableRows, setEnableClickableRows] = React.useState(true)
  const [enableClickableColumns, setEnableClickableColumns] = React.useState(true)
  const [enableColumnResizing, setEnableColumnResizing] = React.useState(true)
  const [enableColumnReordering, setEnableColumnReordering] = React.useState(true)
  const [showCreateButton, setShowCreateButton] = React.useState(true)
  const [showImportButton, setShowImportButton] = React.useState(true)
  const [showExportButton, setShowExportButton] = React.useState(true)
  const [showFulltext, setShowFulltext] = React.useState(true)
  const [showColumnSelector, setShowColumnSelector] = React.useState(true)
  const [showBulkActions, setShowBulkActions] = React.useState(true)
  const [importResultState, setImportResultState] = React.useState<ImportResult | null>(null)

  const handleRowClick = React.useCallback((row: Record<string, unknown>, columnKey?: string) => {
    const item = row as TableItem
    setLastAction(`Clicked row ID: ${item.id}${columnKey ? `, column: ${columnKey}` : ""}`)
  }, [])

  const handleCreate = React.useCallback(() => {
    setLastAction("Clicked 'New record'")
  }, [])

  const handleAction = React.useCallback((action: string, row: Record<string, unknown>) => {
    const item = row as TableItem
    setLastAction(`Action: ${action} for ${item.name}`)
  }, [])

  const handleBulkAction = React.useCallback((action: string, rows: Record<string, unknown>[]) => {
    setLastAction(`Bulk action: ${action} on ${rows.length} rows`)
  }, [])

  const handleImport = React.useCallback((data: Record<string, unknown>[]) => {
    setLastAction(`Import: received ${data.length} rows for processing`)
    // Simulate partial import result (as if some rows were added, some rejected)
    const added = Math.max(0, data.length - 2)
    const rejected = Math.min(2, data.length)
    setImportResultState({
      added,
      updated: 0,
      rejected,
      skipped: 0,
      rejectedRowsData: data.slice(-rejected),
      // Optional plain-text protocol → adds a "Download error log" button to the results dialog.
      errorLog:
        rejected > 0
          ? data
              .slice(-rejected)
              .map((row, i) => `Row ${i + 1}: rejected (simulated reason)`)
              .join("\n")
          : undefined,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TsTable</h1>
        <p className="text-muted-foreground mt-2">{d.tablePageDesc}</p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">{d.tabPreview}</TabsTrigger>
          <TabsTrigger value="code">{d.tabCode}</TabsTrigger>
          <TabsTrigger value="install">{d.tabInstall}</TabsTrigger>
          <TabsTrigger value="documentation">{d.tabDocumentation}</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="space-y-4 pt-4">
          {/* Interactive Controls */}
          <Card>
            <CardHeader>
              <CardTitle>{d.featureToggles}</CardTitle>
              <CardDescription>{d.featureTogglesDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <ToggleControl
                  label={d.featureSelection}
                  checked={enableSelection}
                  onCheckedChange={setEnableSelection}
                />
                <ToggleControl
                  label={d.featureSorting}
                  checked={enableSorting}
                  onCheckedChange={setEnableSorting}
                />
                <ToggleControl
                  label={d.featureFiltering}
                  checked={enableFiltering}
                  onCheckedChange={setEnableFiltering}
                />
                <ToggleControl
                  label={d.featurePagination}
                  checked={enablePagination}
                  onCheckedChange={setEnablePagination}
                />
                <ToggleControl
                  label={d.featureRowMenu}
                  checked={enableRowMenu}
                  onCheckedChange={setEnableRowMenu}
                />
                <ToggleControl
                  label={d.featureClickableRows}
                  checked={enableClickableRows}
                  onCheckedChange={setEnableClickableRows}
                />
                <ToggleControl
                  label={d.featureClickableColumns}
                  checked={enableClickableColumns}
                  onCheckedChange={setEnableClickableColumns}
                />
                <ToggleControl
                  label={d.featureColumnResizing}
                  checked={enableColumnResizing}
                  onCheckedChange={setEnableColumnResizing}
                />
                <ToggleControl
                  label={d.featureColumnReordering}
                  checked={enableColumnReordering}
                  onCheckedChange={setEnableColumnReordering}
                />
                <ToggleControl
                  label={d.featureCreateButton}
                  checked={showCreateButton}
                  onCheckedChange={setShowCreateButton}
                />
                <ToggleControl
                  label={d.featureImportButton}
                  checked={showImportButton}
                  onCheckedChange={setShowImportButton}
                />
                <ToggleControl
                  label={d.featureExportButton}
                  checked={showExportButton}
                  onCheckedChange={setShowExportButton}
                />
                <ToggleControl
                  label="Fulltext Search"
                  checked={showFulltext}
                  onCheckedChange={setShowFulltext}
                />
                <ToggleControl
                  label={d.featureColumnSelector}
                  checked={showColumnSelector}
                  onCheckedChange={setShowColumnSelector}
                />
                <ToggleControl
                  label={d.featureBulkActions}
                  checked={showBulkActions}
                  onCheckedChange={setShowBulkActions}
                />
              </div>
            </CardContent>
          </Card>

          {/* Table Preview */}
          <Card>
            <CardHeader>
              <CardTitle>{d.interactiveDemo}</CardTitle>
              <CardDescription>{d.tableDemoDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <TsTable
                data={tableData}
                columnDefinitions={columnDefinitions}
                title={d.tableClientTitle}
                persistStateKey="demo-ts-table"
                enableSelection={enableSelection}
                enableSorting={enableSorting}
                enableFiltering={enableFiltering}
                enablePagination={enablePagination}
                enableRowMenu={enableRowMenu}
                enableClickableRows={enableClickableRows}
                enableClickableColumns={enableClickableColumns}
                enableColumnResizing={enableColumnResizing}
                enableColumnReordering={enableColumnReordering}
                showCreateButton={showCreateButton}
                showImportButton={showImportButton}
                showExportButton={showExportButton}
                showFulltext={showFulltext}
                showColumnSelector={showColumnSelector}
                onRowClick={handleRowClick}
                onCreateClick={handleCreate}
                onAction={handleAction}
                onImport={handleImport}
                importResult={importResultState}
                onImportResultClose={() => setImportResultState(null)}
                singleItemActions="edit/Edit,delete/Delete,details/Details"
                multipleItemsActions={
                  showBulkActions ? "delete/Delete Selected,export/Export Selected" : undefined
                }
                predefinedFilters={{ approved: true }}
                defaultSorting={[{ id: "contractDate", desc: true }]}
                onBulkAction={handleBulkAction}
                getRowId={(row) => String(row.id)}
                pageSize={5}
              />
              {lastAction && (
                <div className="mt-4 p-3 bg-muted border rounded-md text-sm font-mono text-primary animate-in fade-in">
                  <span className="font-bold mr-2">{d.lastAction}:</span> {lastAction}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="code" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Full Configuration Example</CardTitle>
              <CardDescription>
                Shows all available props and column definition options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`"use client"

import { TsTable, TsTableColumnDef } from "@/components/ts-web-ui/ts-table"

const columns: TsTableColumnDef[] = [
  { key: "id", title: "ID", type: "number", visible: false, unshowable: true },
  { key: "name", title: "Name", type: "text", sortable: true, isClickable: true },
  // Internal column kept in the grid but never written to the Excel export.
  { key: "internalRef", title: "Ref", type: "text", excludeFromExport: true },
  { key: "email", title: "E-mail", type: "text", canBeCopied: true },
  { key: "turnover", title: "Turnover", type: "number", align: "right",
    locale: "cs-CZ", decimalPlaces: 2 },
  { key: "contractDate", title: "Contract", type: "date", align: "right",
    locale: "cs-CZ" },
  { key: "approved", title: "Approved", type: "boolean", align: "center" },
]

export default function MyPage() {
  return (
    <TsTable
      data={data}
      columnDefinitions={columns}
      title="User Management"
      // Feature toggles (all default to true except noted)
      enableSelection={true}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      enableRowMenu={true}
      enableClickableRows={true}
      enableClickableColumns={false}  // default: false
      enableColumnResizing={true}
      enableColumnReordering={true}
      // Toolbar buttons
      showCreateButton={true}
      showImportButton={true}
      showExportButton={true}
      showFulltext={true}
      showColumnSelector={true}
      // Actions (comma-separated "action/Label" pairs)
      singleItemActions="edit/Edit,delete/Delete"
      multipleItemsActions="delete/Delete Selected"
      // Event handlers
      onRowClick={(row, colKey) => console.log("clicked", row, colKey)}
      onAction={(action, row) => console.log(action, row)}
      onBulkAction={(action, rows) => console.log(action, rows)}
      onCreateClick={() => console.log("create")}
      onDataChange={(data) => console.log("data changed", data)}
      onSelectionChange={(rows) => console.log("selection", rows)}
      // Pagination
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
      // Advanced
      unhideableColumns={["name"]}
      predefinedFilters={{ approved: true }}
      defaultSorting={[{ id: "contractDate", desc: true }]}  // newest first on mount
      getRowId={(row) => String(row.id)}
      initialRowSelection={{ "1": true }}
      columnsRequiredForImport={["name", "email"]}
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
            dependencies={["@tanstack/react-table", "lucide-react", "xlsx"]}
          />
        </TabsContent>
        <TabsContent value="documentation" className="pt-4">
          <div className="space-y-8 pb-8">
            {/* Component Props */}
            <Card>
              <CardHeader>
                <CardTitle>Component Properties</CardTitle>
                <CardDescription>All available props on the TsTable component.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Prop</TableHead>
                      <TableHead className="w-[200px]">Type</TableHead>
                      <TableHead className="w-[80px]">Default</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["data", "TData[]", "required", "Array of row objects to display."],
                      [
                        "columnDefinitions",
                        "TsTableColumnDef[]",
                        "required",
                        "Column configuration (see below).",
                      ],
                      ["title", "string", "—", "Title shown in the toolbar."],
                      ["enableSelection", "boolean", "true", "Show row selection checkboxes."],
                      [
                        "enableSorting",
                        "boolean",
                        "true",
                        "Allow column sorting (3-state: asc → desc → clear).",
                      ],
                      ["enableFiltering", "boolean", "true", "Show filter row below headers."],
                      ["enablePagination", "boolean", "true", "Show pagination controls."],
                      ["enableRowMenu", "boolean", "true", "Show the ⋮ row action menu."],
                      ["enableClickableRows", "boolean", "true", "Rows emit onRowClick on click."],
                      [
                        "enableClickableColumns",
                        "boolean",
                        "false",
                        "Columns marked isClickable emit columnKey in onRowClick.",
                      ],
                      [
                        "enableColumnResizing",
                        "boolean",
                        "true",
                        "Allow dragging column borders to resize.",
                      ],
                      [
                        "enableColumnReordering",
                        "boolean",
                        "true",
                        "Show ◂▸ reorder arrows on header hover.",
                      ],
                      ["showCreateButton", "boolean", "true", "Show the + New button in toolbar."],
                      ["showImportButton", "boolean", "true", "Show the Import button (CSV/XLSX)."],
                      [
                        "showExportButton",
                        "boolean",
                        "true",
                        "Show the Export button (CSV/XLSX/JSON).",
                      ],
                      ["showFulltext", "boolean", "true", "Show global fulltext search input."],
                      [
                        "showColumnSelector",
                        "boolean",
                        "true",
                        "Show column visibility toggle dropdown.",
                      ],
                      [
                        "singleItemActions",
                        "string",
                        "—",
                        'Comma-separated "action/Label" pairs for row menu.',
                      ],
                      [
                        "multipleItemsActions",
                        "string",
                        "—",
                        'Comma-separated "action/Label" for bulk actions.',
                      ],
                      [
                        "unhideableColumns",
                        "string[]",
                        "[]",
                        "Column keys that cannot be hidden via selector.",
                      ],
                      [
                        "predefinedFilters",
                        "Record<string, unknown>",
                        "—",
                        "Initial filters; once changed by user, they behave as regular filters.",
                      ],
                      [
                        "defaultSorting",
                        "SortingState",
                        "—",
                        "Initial sort applied on mount, e.g. [{ id: 'date', desc: true }]. Users can re-sort freely afterwards.",
                      ],
                      ["pageSize", "number", "10", "Initial number of rows per page."],
                      [
                        "pageSizeOptions",
                        "number[]",
                        "[5,10,20,50,100]",
                        "Available page size choices.",
                      ],
                      [
                        "getRowId",
                        "(row) => string",
                        "—",
                        "Custom row ID function for stable selection.",
                      ],
                      [
                        "onRowClick",
                        "(row, colKey?) => void",
                        "—",
                        "Callback when a row (or clickable column) is clicked.",
                      ],
                      ["onCreateClick", "() => void", "—", "Callback for the + New button."],
                      ["onAction", "(action, row) => void", "—", "Callback for row menu actions."],
                      [
                        "onBulkAction",
                        "(action, rows) => void",
                        "—",
                        "Callback for bulk actions on selected rows.",
                      ],
                      [
                        "onDataChange",
                        "(data) => void",
                        "—",
                        "Called when data changes (e.g. after import).",
                      ],
                      [
                        "onSelectionChange",
                        "(rows) => void",
                        "—",
                        "Called when row selection changes.",
                      ],
                      [
                        "columnsRequiredForImport",
                        "string[]",
                        "—",
                        "Column keys required in import file. Defaults to all column keys.",
                      ],
                      [
                        "importResult",
                        "ImportResult | null",
                        "null",
                        "Shows import results and clears the import progress overlay when set.",
                      ],
                      [
                        "initialRowSelection",
                        "Record<string, boolean>",
                        "—",
                        "Pre-selected rows (requires getRowId).",
                      ],
                    ].map(([prop, type, def, desc]) => (
                      <TableRow key={prop}>
                        <TableCell className="font-mono text-xs">{prop}</TableCell>
                        <TableCell className="text-xs italic">{type}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{def}</TableCell>
                        <TableCell className="text-sm">{desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predefined Filters</CardTitle>
                <CardDescription>
                  Apply default filter values that users can override during interaction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Use <span className="font-mono">predefinedFilters</span> to prefill filters on
                  initial render. Users can still edit these filters, and after first change they
                  are treated the same as any other filter.
                </p>
                <CodeBlock
                  code={`<TsTable
  data={data}
  columnDefinitions={columns}
  predefinedFilters={{
    approved: true,
  }}
/>
`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Sorting</CardTitle>
                <CardDescription>
                  Seed the initial sort order on mount without locking it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Pass <span className="font-mono">defaultSorting</span> to start the table sorted
                  by one or more columns (for example, newest records first). It only seeds the
                  initial sort state — users can re-sort or clear it like any other sort.
                </p>
                <CodeBlock
                  code={`<TsTable
  data={data}
  columnDefinitions={columns}
  defaultSorting={[{ id: "contractDate", desc: true }]}
/>
`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Excluding Columns From Export</CardTitle>
                <CardDescription>
                  Keep a column visible in the grid but out of the Excel export.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Mark a column with <span className="font-mono">excludeFromExport</span> to drop
                  its value from every export (all / filtered / selected). The column still renders
                  and filters normally — only the exported workbook omits it. Useful for action-link
                  columns, internal references, or computed display-only cells.
                </p>
                <CodeBlock
                  code={`const columns: TsTableColumnDef[] = [
  { key: "name", title: "Name", type: "text" },
  // Rendered in the grid, but never written to the .xlsx export.
  { key: "openLink", title: "Open", type: "text", isClickable: true, excludeFromExport: true },
]
`}
                />
              </CardContent>
            </Card>

            {/* Column Definition */}
            <Card>
              <CardHeader>
                <CardTitle>Column Definition (TsTableColumnDef)</CardTitle>
                <CardDescription>
                  Each column is configured via an object in the columnDefinitions array.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">Property</TableHead>
                      <TableHead className="w-[200px]">Type</TableHead>
                      <TableHead className="w-[80px]">Default</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["key", "string", "required", "Data property name for this column."],
                      ["title", "string", "required", "Header label displayed to the user."],
                      [
                        "type",
                        '"text" | "number" | "date" | "boolean"',
                        '"text"',
                        "Determines formatting, filter behavior, and cell renderer.",
                      ],
                      [
                        "sortable",
                        "boolean",
                        "true",
                        "Whether the column can be sorted (3-state toggle).",
                      ],
                      ["filterable", "boolean", "true", "Whether the column shows a filter input."],
                      [
                        "visible",
                        "boolean",
                        "true",
                        "Initial visibility (user can toggle via selector).",
                      ],
                      [
                        "unshowable",
                        "boolean",
                        "false",
                        "Column is always hidden and appears dimmed/uncheckable in column selector.",
                      ],
                      [
                        "excludeFromExport",
                        "boolean",
                        "false",
                        "Keep the column in the grid but omit its value from the Excel export.",
                      ],
                      ["align", '"left" | "center" | "right"', '"left"', "Cell content alignment."],
                      [
                        "canBeCopied",
                        "boolean",
                        "false",
                        "Shows a copy-to-clipboard icon on hover.",
                      ],
                      [
                        "isClickable",
                        "boolean",
                        "false",
                        "Cell acts as a link (requires enableClickableColumns).",
                      ],
                      ["locale", "string", '"cs-CZ"', "Locale for number/date formatting (Intl)."],
                      [
                        "decimalPlaces",
                        "number",
                        "2",
                        "Decimal places for number type formatting.",
                      ],
                      ["width", "number | string", "auto", "Initial column width."],
                    ].map(([prop, type, def, desc]) => (
                      <TableRow key={prop}>
                        <TableCell className="font-mono text-xs font-semibold">{prop}</TableCell>
                        <TableCell className="text-xs italic">{type}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{def}</TableCell>
                        <TableCell className="text-sm">{desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Filtering Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Filtering Syntax</CardTitle>
                <CardDescription>
                  Filter inputs support flexible syntax depending on column type.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead className="w-[200px]">Example</TableHead>
                      <TableHead>Behavior</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Text</TableCell>
                      <TableCell className="font-mono text-xs">prag</TableCell>
                      <TableCell>Case-insensitive substring match.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Number</TableCell>
                      <TableCell className="font-mono text-xs">125000</TableCell>
                      <TableCell>
                        Exact match or startsWith fallback (e.g. &quot;12&quot; matches 125000).
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Number range</TableCell>
                      <TableCell className="font-mono text-xs">100000..200000</TableCell>
                      <TableCell>Matches values between 100,000 and 200,000 inclusive.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Date</TableCell>
                      <TableCell className="font-mono text-xs">15.03.2022</TableCell>
                      <TableCell>
                        Flexible parsing: DD.MM.YYYY, DD.MM.YY, YYYY-MM-DD, YYYY, MM.YYYY.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Date range</TableCell>
                      <TableCell className="font-mono text-xs">2020..2023</TableCell>
                      <TableCell>Matches dates from Jan 1, 2020 through Dec 31, 2023.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Boolean</TableCell>
                      <TableCell className="text-xs italic">dropdown</TableCell>
                      <TableCell>Select from All / Yes / No dropdown.</TableCell>
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
