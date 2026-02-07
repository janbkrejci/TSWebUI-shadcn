"use client"

import * as React from "react"
import { TsForm } from "@/components/ts-web-ui/ts-form"
import { TsFormLayout, TsFieldDef, TsFormButton } from "@/components/ts-web-ui/ts-form/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster, toast } from "sonner"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus'

const formFields: Record<string, TsFieldDef> = {
  name: { type: "text", label: "First Name", required: true, placeholder: "Jan" },
  surname: { type: "text", label: "Last Name", required: true, placeholder: "Novák" },
  email: { type: "text", label: "E-mail", required: true, placeholder: "jan@example.com" },
  age: { type: "number", label: "Age", min: 18, max: 99, required: true },
  bio: { type: "textarea", label: "Biography", rows: 4, hint: "A short description about yourself" },
  role: {
      type: "select", 
      label: "Role", 
      options: [
          { value: "admin", label: "Administrator" },
          { value: "user", label: "User" },
          { value: "guest", label: "Guest" }
      ],
      required: true 
  },
  country: {
      type: "combobox",
      label: "Country",
      options: [
          { value: "cz", label: "Czech Republic" },
          { value: "sk", label: "Slovakia" },
          { value: "de", label: "Germany" },
          { value: "at", label: "Austria" }
      ],
      placeholder: "Search country..."
  },
  gender: {
      type: "radio",
      label: "Gender",
      options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" }
      ]
  },
  rating: {
      type: "slider",
      label: "Satisfaction (0-10)",
      min: 0, 
      max: 10
  },
  active: { type: "switch", label: "Active Account" },
  birthDate: { type: "date", label: "Date of Birth", required: true },
  notes: {
      type: "markdown",
      value: "### Important Notes\n- Use **Markdown** for styling\n- Lists and links are supported"
  }
}

const formLayout: TsFormLayout = {
  tabs: [
    {
      label: "General Info",
      rows: [
        [{ field: "name", width: "1fr" }, { field: "surname", width: "1fr" }],
        [{ field: "email", width: "1fr" }, { field: "age", width: "100px" }],
        [{ field: "birthDate", width: "1fr" }, { field: "gender", width: "1fr" }],
        [{ field: "bio", width: "1fr" }]
      ]
    },
    {
        label: "Settings & Advanced",
        rows: [
            [{ field: "country", width: "1fr" }, { field: "role", width: "1fr" }],
            [{ field: "active" }],
            [{ field: "rating" }],
            [{ type: "separator", label: "Custom Content", field: "custom_content_sep" }],
            [{ field: "notes" }]
        ]
    }
  ]
}

const formButtons: TsFormButton[] = [
    {
        action: "delete", 
        label: "Delete Account", 
        variant: "destructive", 
        type: "button",
        confirmation: {
            title: "Are you absolutely sure?",
            text: "This action cannot be undone. This will permanently delete your account.",
            buttons: [
                { action: "cancel", label: "Cancel" },
                { action: "confirm", label: "Delete", variant: "destructive", confirm: true }
            ]
        }
    },
    { action: "save", label: "Save Changes", variant: "default", type: "submit" }
]

export default function TsFormPage() {
  const [formData, setFormData] = React.useState<any>(null)

  const handleSubmit = (data: any, action: string) => {
    setFormData({ action, data })
    toast(`Form action: ${action}`, { description: action === 'save' ? "Successfully saved." : "Action performed." })
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TS Form</h1>
        <p className="text-muted-foreground mt-2">
          Dynamic, JSON-driven form generation with built-in validation and layout management.
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Interactive Form</CardTitle>
                  <CardDescription>Generated from JSON. Includes tabs, validation, and confirmation.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TsForm 
                    layout={formLayout}
                    fields={formFields}
                    buttons={formButtons}
                    onSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                  <Card className="shadow-sm bg-muted/20">
                      <CardHeader>
                          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-bold">Result</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-xs min-h-[150px]">
                              {formData ? JSON.stringify(formData, null, 2) : "// Awaiting submission..."}
                          </pre>
                      </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                      <CardHeader>
                          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-bold">Raw JSON Layout</CardTitle>
                      </CardHeader>
                      <CardContent>
                           <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-[10px] overflow-auto max-h-[300px]">
{JSON.stringify(formLayout, null, 2)}
                           </pre>
                      </CardContent>
                  </Card>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="pt-4">
          <Card>
            <CardContent className="pt-6">
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
{`import { TsForm } from "@/components/ts-web-ui/ts-form"

const fields = {
  email: { type: "text", label: "Email", required: true },
  role: { type: "select", options: ["Admin", "User"] }
}

const layout = {
  rows: [[{ field: "email" }], [{ field: "role" }]]
}

export default function MyForm() {
  return (
    <TsForm 
      fields={fields} 
      layout={layout} 
      onSubmit={(data, action) => console.log(data)} 
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
                    <CardTitle>TsForm Properties</CardTitle>
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
                                <TableCell className="font-mono text-xs">fields</TableCell>
                                <TableCell className="text-xs italic">Record&lt;string, TsFieldDef&gt;</TableCell>
                                <TableCell>Definitions of all form fields.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">layout</TableCell>
                                <TableCell className="text-xs italic">TsFormLayout</TableCell>
                                <TableCell>Visual structure (rows or tabs).</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">buttons</TableCell>
                                <TableCell className="text-xs italic">TsFormButton[]</TableCell>
                                <TableCell>Buttons rendered at the bottom of the form.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">values</TableCell>
                                <TableCell className="text-xs italic">any</TableCell>
                                <TableCell>Initial form values.</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-mono text-xs">errors</TableCell>
                                <TableCell className="text-xs italic">Record&lt;string, string&gt;</TableCell>
                                <TableCell>External validation errors map.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Widget Types</CardTitle>
                    <CardDescription>Available field types for the "type" property in field definitions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {["text", "number", "date", "datetime", "password", "textarea", "select", "combobox", "multiselect", "radio", "checkbox", "switch", "slider", "file", "image", "markdown", "infobox", "table"].map(type => (
                            <div key={type} className="p-2 border rounded bg-muted/50 text-xs font-mono text-center capitalize">{type}</div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
