"use client"

import * as React from "react"
import { Toaster, toast } from "sonner"
import { useTsLocale } from "@/components/ts-web-ui/locale"
import { TsForm } from "@/components/ts-web-ui/ts-form"
import { TsButton, TsFieldDef, TsLayout } from "@/components/ts-web-ui/ts-form/types"
import { CodeBlock, InstallTab } from "@/components/ts-web-ui/widget-demo"
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

export default function TsFormPage() {
  const [formData, setFormData] = React.useState<{
    action: string
    data: Record<string, unknown>
  } | null>(null)

  const locale = useTsLocale()
  const d = locale.strings.demo

  const formFields: Record<string, TsFieldDef> = {
    name: { type: "text", label: d.fieldName, required: true, placeholder: d.fieldNamePlaceholder },
    surname: {
      type: "text",
      label: d.fieldSurname,
      required: true,
      placeholder: d.fieldSurnamePlaceholder,
    },
    email: {
      type: "text",
      label: d.fieldEmail,
      required: true,
      placeholder: d.fieldEmailPlaceholder,
    },
    age: { type: "number", label: d.fieldAge, min: 18, max: 99, required: true },
    bio: {
      type: "textarea",
      label: d.fieldBio,
      rows: 4,
      hint: d.fieldBioHint,
    },
    role: {
      type: "select",
      label: d.fieldRole,
      options: [
        { value: "admin", label: d.roleAdmin },
        { value: "user", label: d.roleUser },
        { value: "guest", label: d.roleGuest },
      ],
      required: true,
    },
    country: {
      type: "combobox",
      label: d.fieldCountry,
      options: [
        { value: "us", label: d.countryUS },
        { value: "gb", label: d.countryGB },
        { value: "de", label: d.countryDE },
        { value: "fr", label: d.countryFR },
      ],
      placeholder: d.fieldCountryPlaceholder,
    },
    gender: {
      type: "radio",
      label: d.fieldGender,
      options: [
        { value: "male", label: d.genderMale },
        { value: "female", label: d.genderFemale },
        { value: "other", label: d.genderOther },
      ],
    },
    rating: {
      type: "slider",
      label: d.fieldRating,
      min: 0,
      max: 10,
    },
    active: { type: "switch", label: d.fieldActive },
    birthDate: { type: "date", label: d.fieldBirthDate, required: true },
    tempInternalNote: {
      type: "text",
      label: d.fieldTempNote,
      excludeFromSubmit: true,
      placeholder: d.fieldTempNotePlaceholder,
    },
    notes: {
      type: "markdown",
      value: "### Important Notes\n- Use **Markdown** for styling\n- Lists and links are supported",
    },
  }

  const formLayout: TsLayout = {
    tabs: [
      {
        label: d.formTabGeneral,
        rows: [
          [
            { field: "name", width: "1fr" },
            { field: "surname", width: "1fr" },
          ],
          [
            { field: "email", width: "1fr" },
            { field: "age", width: "100px" },
          ],
          [
            { field: "birthDate", width: "1fr" },
            { field: "gender", width: "1fr" },
          ],
          [{ field: "tempInternalNote", width: "1fr" }],
          [{ field: "bio", width: "1fr" }],
        ],
      },
      {
        label: d.formTabSettings,
        rows: [
          [
            { field: "country", width: "1fr" },
            { field: "role", width: "1fr" },
          ],
          [{ field: "active" }],
          [{ field: "rating" }],
          [{ type: "separator", label: d.formSepCustomContent, field: "custom_content_sep" }],
          [{ field: "notes" }],
        ],
      },
    ],
  }

  const formButtons: TsButton[] = [
    {
      action: "delete",
      label: d.btnDeleteAccount,
      variant: "destructive",
      type: "button",
      confirmation: {
        title: d.btnDeleteTitle,
        text: d.btnDeleteText,
        buttons: [
          { action: "cancel", label: d.btnCancel },
          { action: "confirm", label: d.btnDelete, variant: "destructive", confirm: true },
        ],
      },
    },
    { action: "save", label: d.btnSave, variant: "default", type: "submit" },
  ]

  const handleAction = (action: string, data: Record<string, unknown>) => {
    setFormData({ action, data })
    toast(`Form action: ${action}`, {
      description: action === "save" ? d.toastSaved : d.toastAction,
    })
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">TS Form</h1>
        <p className="text-muted-foreground mt-2">{d.formPageDesc}</p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList>
          <TabsTrigger value="preview">{d.tabPreview}</TabsTrigger>
          <TabsTrigger value="code">{d.tabCode}</TabsTrigger>
          <TabsTrigger value="install">{d.tabInstall}</TabsTrigger>
          <TabsTrigger value="documentation">{d.tabDocumentation}</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>{d.interactiveFormTitle}</CardTitle>
                <CardDescription>{d.interactiveFormDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <TsForm
                  layout={formLayout}
                  fields={formFields}
                  buttons={formButtons}
                  onAction={handleAction}
                  onFieldChange={(field, value) => {
                    console.log(`Field ${field} changed to:`, value)
                  }}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-bold">
                    {d.result}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-xs min-h-[150px]">
                    {formData ? JSON.stringify(formData, null, 2) : d.awaitingSubmission}
                  </pre>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-bold">
                    {d.rawJsonLayout}
                  </CardTitle>
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
              <CodeBlock
                code={`"use client"

import { TsForm } from "@/components/ts-web-ui/ts-form"

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
      onAction={(action, data) => console.log(action, data)} 
    />
  )
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="pt-4">
          <InstallTab
            componentName="ts-form"
            dependencies={["react-hook-form", "lucide-react", "date-fns", "react-markdown"]}
          />
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
                      <TableCell className="text-xs italic">
                        Record&lt;string, TsFieldDef&gt;
                      </TableCell>
                      <TableCell>Definitions of all form fields.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">layout</TableCell>
                      <TableCell className="text-xs italic">TsLayout</TableCell>
                      <TableCell>Visual structure (rows or tabs).</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">buttons</TableCell>
                      <TableCell className="text-xs italic">TsButton[]</TableCell>
                      <TableCell>Buttons rendered at the bottom of the form.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">values</TableCell>
                      <TableCell className="text-xs italic">
                        Record&lt;string, unknown&gt;
                      </TableCell>
                      <TableCell>Initial form values.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">errors</TableCell>
                      <TableCell className="text-xs italic">TsErrors</TableCell>
                      <TableCell>External validation errors map.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">onAction</TableCell>
                      <TableCell className="text-xs italic">
                        (action: string, data: Record&lt;string, unknown&gt;) =&gt; void
                      </TableCell>
                      <TableCell>
                        Callback for all form actions (submit, custom buttons, etc.).
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">onFieldChange</TableCell>
                      <TableCell className="text-xs italic">
                        (field: string, value: unknown, formData: Record&lt;string, unknown&gt;)
                        =&gt; void
                      </TableCell>
                      <TableCell>Callback emitted when any field value changes.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Widget Types</CardTitle>
                <CardDescription>
                  Available field types for the &quot;type&quot; property in field definitions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    "text",
                    "number",
                    "date",
                    "datetime",
                    "password",
                    "textarea",
                    "select",
                    "combobox",
                    "multiselect",
                    "radio",
                    "checkbox",
                    "switch",
                    "slider",
                    "file",
                    "markdown",
                    "infobox",
                    "table",
                  ].map((type) => (
                    <div
                      key={type}
                      className="p-2 border rounded bg-muted/50 text-xs font-mono text-center capitalize"
                    >
                      {type}
                    </div>
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
