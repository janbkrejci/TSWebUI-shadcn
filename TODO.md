# TODO: TSWebUI-shadcn — TsForm & TsFormEditor

**Cíl:** Dokončit novou implementaci TsForm a TsFormEditor, doplnit chybějící funkčnost z referenční implementace, provést revizi typování a refactoring kódu.

**Referenční implementace:** `reference-tswebui/packages/ts-form/src/`

---

## Filosofie TsForm

TsForm je **prezentační komponenta** — renderuje UI podle JSON definice.
**Nemá vlastní validační logiku.** Chyby přicházejí výhradně jako props z nadřazené komponenty (typicky z backendu).

---

## Doporučené pořadí implementace

| Pořadí | Úkol | Priorita | Závislosti |
|:---:|---|---|---|
| 1 | ÚKOL 0 — Odstranění Zod validace | 🔴 KRITICKÁ | — |
| 2 | ÚKOL 2+3 — Refactoring: split widgetů + utility | 🔴 VYSOKÁ | ÚKOL 0 |
| 3 | ÚKOL 1 — Kompletní revize typování | 🔴 KRITICKÁ | ÚKOL 2+3 |
| 4 | ÚKOL 4 — `onFieldChange` callback | 🔴 VYSOKÁ | ÚKOL 0 |
| 5 | ÚKOL 5 — Button disabled/hidden props | 🔴 VYSOKÁ | ÚKOL 0 |
| 6 | ÚKOL 6 — `activeTab` + chybové indikátory na tabech | 🔴 VYSOKÁ | ÚKOL 0 |
| 7 | ÚKOL 10 — form-key-action scope fix | 🟡 STŘEDNÍ | ÚKOL 0 |
| 8 | ÚKOL 7 — `roundTo` sémantika + locale | 🔴 VYSOKÁ | ÚKOL 2+3 |
| 9 | ÚKOL 8 — Smart date parsing | 🔴 VYSOKÁ | ÚKOL 2+3 |
| 10 | ÚKOL 9 — Chybějící field atributy | 🟡 STŘEDNÍ | ÚKOL 2+3 |
| 11 | ÚKOL 14 — `readOnly` prop na TsForm | 🟡 STŘEDNÍ | ÚKOL 2+3 |
| 12 | ÚKOL 11 — Relationship multi-column display | 🟡 STŘEDNÍ | ÚKOL 2+3 |
| 13 | ÚKOL 12 — Editor: rename field | 🟡 STŘEDNÍ | — |
| 14 | ÚKOL 13 — Editor: insert column at position | 🟡 STŘEDNÍ | — |
| 15 | ÚKOL 15 — File upload: pre-existing files | 🟡 STŘEDNÍ | ÚKOL 2+3 |
| 16 | ÚKOL 16 — Drobné opravy a vylepšení | 🟢 NÍZKÁ | — |

---

## ÚKOL 0: Odstranění Zod validace a architektonická oprava TsForm

**Priorita:** 🔴 KRITICKÁ — musí být hotovo jako první, protože mění architektonické jádro.

**Soubory:** `src/components/ts-web-ui/ts-form/index.tsx`, `src/components/ts-web-ui/ts-form/ts-form-schema.ts`, `src/components/ts-web-ui/ts-form/ts-form-field.tsx`

### Co je špatně

- `ts-form-schema.ts` generuje Zod schema a `index.tsx` ji používá jako `zodResolver` v React Hook Form
- React Hook Form běží v `mode: "onChange"` s automatickou validací — to je fundamentálně špatně, protože TsForm je prezentační komponenta a validace patří na backend
- `<FormMessage />` (řádek 115 v `ts-form-field.tsx`) zobrazuje errory z React Hook Form validace namísto z props
- Zod schema je navíc nekompletní (chybí multiselect array, file, atd.) — ale to je irelevantní, protože celý schema generátor nemá existovat

### Kroky

- [ ] **Smazat** soubor `ts-form-schema.ts`
- [ ] **Odebrat** z `index.tsx`:
  - Import `zodResolver` a `z` (řádky 3, 5)
  - Import `generateZodSchema` (řádek 22)
  - `formSchema` useMemo a `FormValues` type (řádky 46-47)
  - `resolver: zodResolver(formSchema)` z `useForm` (řádek 51)
  - `mode: "onChange"` z `useForm`
- [ ] **Ponechat** React Hook Form pro state management, ale bez validace:
  - `useForm` zůstane, ale bez `resolver` a bez `mode: "onChange"`
- [ ] **Definovat explicitní typ** pro form values: `Record<string, unknown>`
- [ ] **Odebrat** `<FormMessage />` z `ts-form-field.tsx` (řádek 115)
  - Errory se zobrazují výhradně z `fieldDef.error`
- [ ] **Ověřit**, že `errors` prop v `TsFormProps` a `error` prop na `TsFieldBase` fungují jako primární a jediný zdroj chybových zpráv
- [ ] **Zjednodušit** `useEffect` pro external errors (řádky 64-70)
- [ ] **Odebrat** npm dependency `@hookform/resolvers` (pokud není použita jinde)

### Acceptance criteria

- Formulář se renderuje bez Zod závislosti
- Errory se zobrazují POUZE z `errors` prop / `fieldDef.error`
- Submit stále funguje a předává data přes `onSubmit` callback
- Žádná automatická validace neprobíhá
- `pnpm build` a `pnpm lint` bez chyb

---

## ÚKOL 1: Kompletní revize typování

**Priorita:** 🔴 KRITICKÁ — provádět souběžně s/po úkolu 2+3.

**Soubory:** `src/components/ts-web-ui/ts-form/types.ts`, `src/components/ts-web-ui/ts-form/ts-form-field.tsx`, `src/components/ts-web-ui/ts-form/index.tsx`, všechny widgety po splittu

### Problém

V kódu je několik type workaroundů, fallbacků a `as unknown as` castů, které zhoršují IDE nápovědu a podrývají typovou bezpečnost. Cíl je mít **explicitní, specifické typy** všude, aby IDE autocomplete fungoval perfektně.

### Konkrétní problémy a řešení

#### 1.1 `enterAction`/`escapeAction` cast

```typescript
// ŠPATNĚ (ts-form-field.tsx, řádky 130-133):
const enterAction = (def as unknown as Record<string, unknown>).enterAction as string | undefined
const escapeAction = (def as unknown as Record<string, unknown>).escapeAction as string | undefined
```

**Řešení:** Přidat `enterAction` a `escapeAction` do `TsFieldBase` jako optional properties. Jsou koncepčně společné pro všechny interaktivní typy a přidání do base je jednodušší než type guard.

#### 1.2 Relationship options cast

```typescript
// ŠPATNĚ (ts-form-field.tsx, řádek 834):
() => (def.options as unknown as Record<string, unknown>[]) || []
```

**Řešení:** Widget funkce musí přijímat `TsRelationshipField` přímo (narrowed typ), ne `TsFieldDef`. Po splittu widgetů (ÚKOL 2) tento problém automaticky zmizí.

#### 1.3 `field.value` casty (mnohonásobné)

```typescript
// ŠPATNĚ:
(field.value as string) ?? ""
(field.value as unknown[])
new Date(field.value as string | number | Date)
```

**Řešení:** Definovat utility typy pro hodnoty jednotlivých field types. Zvážit value coercion utility funkce v `widgets/utils.ts`.

#### 1.4 `Omit<TsFormProps, "readOnly">` hack

```typescript
// ŠPATNĚ (index.tsx, řádek 44):
}: Omit<TsFormProps, "readOnly">) {
```

**Řešení:** Buď `readOnly` implementovat (viz ÚKOL 14), nebo dočasně odebrat z interface. Nedělat `Omit`.

#### 1.5 `FormValues` typ po odstranění Zod

Po odstranění Zod (ÚKOL 0) se `FormValues` musí definovat explicitně jako `Record<string, unknown>`.

### Zásady pro typování (aplikovat napříč celou komponentou)

- [ ] **Žádné `as unknown as`** — vždy type guard nebo správná type hierarchy
- [ ] **Žádné `as any`** — ani v importech
- [ ] **Explicitní return types** na všech exportovaných funkcích
- [ ] **Explicitní parametrové typy** na všech callback props
- [ ] **Widget funkce** dostávají konkrétní narrowed typ (např. `NumberWidget` dostane `TsNumberField`, ne `TsFieldDef`)
- [ ] **No implicit any** — ověřit v `tsconfig.json` že `noImplicitAny: true`
- [ ] **JSDoc** na všech public interfaces a exportovaných typech

---

## ÚKOL 2: Refactoring — rozdělit ts-form-field.tsx na widget soubory

**Priorita:** 🔴 VYSOKÁ — prerequisita pro většinu dalších úkolů (1838 řádků je neúnosné).

**Soubory:** `src/components/ts-web-ui/ts-form/ts-form-field.tsx` → `src/components/ts-web-ui/ts-form/widgets/*`

### Kroky

- [ ] Vytvořit adresář `src/components/ts-web-ui/ts-form/widgets/`
- [ ] Extrahovat widgety do vlastních souborů:

| Soubor | Widget(y) | Aktuální řádky |
|---|---|---|
| `text-widget.tsx` | text, password | 171-228 |
| `textarea-widget.tsx` | textarea | 230-272 |
| `number-widget.tsx` | NumberWidget | ~1110-1228 |
| `slider-widget.tsx` | slider | 274-305 |
| `select-widget.tsx` | select | 307-370 |
| `radio-widget.tsx` | radio | 372-414 |
| `checkbox-widget.tsx` | checkbox | 416-456 |
| `switch-widget.tsx` | switch | 458-494 |
| `combobox-widget.tsx` | ComboboxWidget | 545-663 |
| `multiselect-widget.tsx` | MultiSelectWidget | 665-804 |
| `relationship-widget.tsx` | RelationshipWidget | 810-1060 |
| `date-widget.tsx` | DateTimeWidget + DatePickerWidget | 1232-1758 |
| `file-widget.tsx` | FileUploadWidget | 1385-1526 |
| `button-widget.tsx` | button | 496-543 |
| `button-group-widget.tsx` | ProcessButtonGroup | 1530-1634 |
| `infobox-widget.tsx` | infobox | ~1060-1108 |
| `markdown-widget.tsx` | markdown + MarkdownCopyButton | ~1760-1838 |
| `table-widget.tsx` | table (TsTable wrapper) | inline |
| `separator-widget.tsx` | separator | trivial |

- [ ] Vytvořit `widgets/index.ts` barrel export
- [ ] Každý widget: named function s **explicitním typem props** (narrowed field def):

```typescript
interface NumberWidgetProps {
  field: ControllerRenderProps<FieldValues, string>
  def: TsNumberField
  name: string
  hasError: boolean
}
export function NumberWidget({ field, def, name, hasError }: NumberWidgetProps): React.ReactElement { ... }
```

- [ ] Zredukovat `ts-form-field.tsx` na dispatcher (switch přes `def.type`) + label/error wrapper — cílově 100-150 řádků
- [ ] Extrahovat sdílené utility do `widgets/utils.ts` (viz ÚKOL 3)

### Acceptance criteria

- Všechny existující testy procházejí
- `pnpm build` bez chyb
- `pnpm lint` bez chyb
- Vizuální rendering identický (otestovat na demo stránkách)
- Žádný widget soubor nepřesahuje ~300 řádků

---

## ÚKOL 3: Refactoring — extrakce sdílených utilit (DRY)

**Priorita:** 🔴 VYSOKÁ — provádět jako součást ÚKOLU 2.

**Soubory:** Nový soubor `src/components/ts-web-ui/ts-form/widgets/utils.ts`

### 3.1 `normalizeOptions(options)`

**Problém:** Pattern se opakuje **9× v 6 widgetech** (select, multiselect, combobox, radio, button-group, relationship):
```typescript
(def.options || []).map(opt => typeof opt === "string" ? {label: opt, value: opt} : opt)
```

**Implementace:**
```typescript
export function normalizeOptions(
  options: (TsFieldOptions | string)[] | undefined
): TsFieldOptions[] {
  return (options ?? []).map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  )
}
```

### 3.2 `getFieldClasses(def, hasError)`

**Problém:** Tři class proměnné se počítají identicky v **30 výskytech** napříč widgety:
```typescript
const errorClass = hasError ? "border-destructive focus-visible:ring-destructive" : ""
const readonlyClass = def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : ""
const readonlyPointerClass = def.readonly ? "pointer-events-none" : ""
```

**Implementace:**
```typescript
export function getFieldClasses(def: { readonly?: boolean }, hasError: boolean) {
  return {
    errorClass: hasError ? "border-destructive focus-visible:ring-destructive" : "",
    readonlyClass: def.readonly ? "focus-visible:ring-0 focus-visible:border-input" : "",
    readonlyPointerClass: def.readonly ? "pointer-events-none" : "",
  } as const
}
```

### 3.3 `parseFieldDate(value)`

**Problém:** Pattern se opakuje **8× ve 2 widgetech**:
```typescript
const dateValue = field.value ? new Date(field.value as string | number | Date) : undefined
const validDate = dateValue && !isNaN(dateValue.getTime()) ? dateValue : undefined
```

**Implementace:**
```typescript
export function parseFieldDate(value: unknown): Date | undefined {
  if (!value) return undefined
  const date = new Date(value as string | number)
  return isNaN(date.getTime()) ? undefined : date
}
```

### 3.4 `createFocusHandlers(def)`

**Problém:** Identický focus/click handler se opakuje **6× v 5 widgetech** (text, textarea, number, date, datetime):
```typescript
onFocus={(e) => {
  if (def.readonly) { e.currentTarget.blur(); return }
  if (def.selectAllOnFocus) { setTimeout(() => e.currentTarget.select(), 0) }
}}
onClick={(e) => { if (def.selectAllOnFocus) e.currentTarget.select() }}
```

**Implementace:**
```typescript
export function createFocusHandlers(def: { readonly?: boolean; selectAllOnFocus?: boolean }) {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      if (def.readonly) { e.currentTarget.blur(); return }
      if (def.selectAllOnFocus) { setTimeout(() => e.currentTarget.select(), 0) }
    },
    onClick: (e: React.MouseEvent<HTMLInputElement>) => {
      if (def.selectAllOnFocus) e.currentTarget.select()
    },
  }
}
```

### 3.5 `createKeyDownHandler(def, field, name)`

**Problém:** `handleKeyDown` se definuje v `renderWidget` a zpracovává Enter/Escape — po splittu bude potřeba sdílet.

**Implementace:** Factory funkce která vrací `(e: React.KeyboardEvent) => void`.

---

## ÚKOL 4: Přidat `onFieldChange` callback

**Priorita:** 🔴 VYSOKÁ — klíčový pro integraci s nadřazenými komponentami.

**Soubory:** `src/components/ts-web-ui/ts-form/index.tsx`, `src/components/ts-web-ui/ts-form/types.ts`

### Kontext

Reference emituje `form-changed` CustomEvent s `{field, value, formData}` při každé změně pole. Nová implementace nemá žádný ekvivalent — nadřazená komponenta nemá jak zjistit, že se něco změnilo, než uživatel klikne Submit.

### Kroky

- [ ] Přidat do `TsFormProps`:
  ```typescript
  onFieldChange?: (field: string, value: unknown, formData: Record<string, unknown>) => void
  ```
- [ ] V `index.tsx` implementovat sledování změn přes React Hook Form `watch`:
  ```typescript
  React.useEffect(() => {
    if (!onFieldChange) return
    const subscription = form.watch((formData, { name }) => {
      if (name) {
        onFieldChange(name, formData[name], formData as Record<string, unknown>)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, onFieldChange])
  ```
- [ ] Ověřit, že callback se volá při KAŽDÉ změně pole (input typing, select change, checkbox toggle, date pick, file upload, relationship change, atd.)
- [ ] Callback se **nevolá** při prvním renderování — jen při user interakci
- [ ] Pole s `excludeFromSubmit` (ÚKOL 9d) se do callbacku nezahrnují

### Reference

`reference-tswebui/packages/ts-form/src/ts-form.js`, řádek ~471: `setupEventListeners()` → `form-changed` event.

---

## ÚKOL 5: Přidat ovládání tlačítek přes props

**Priorita:** 🔴 VYSOKÁ

**Soubory:** `src/components/ts-web-ui/ts-form/types.ts`, `src/components/ts-web-ui/ts-form/index.tsx`

### Kontext

Reference má imperative API (`disableButton()`, `enableButton()`, `hideButton()`, `showButton()`). V React světě to řešíme deklarativně přes props.

### Kroky

- [ ] Rozšířit `TsFormButton` v `types.ts`:
  ```typescript
  export interface TsFormButton {
    action: string
    label: string
    variant?: TsButtonVariant
    type?: "submit" | "button" | "reset"
    icon?: string
    position?: "left" | "center" | "right"
    confirmation?: TsFormConfirmation
    disabled?: boolean  // NOVÉ
    hidden?: boolean    // NOVÉ
  }
  ```
- [ ] V `renderButtons` v `index.tsx`:
  - Tlačítka s `hidden === true` se nerendrují
  - `disabled` na tlačítku = kombinace `btn.disabled` a `form.formState.isSubmitting`
- [ ] Aktualizovat form editor properties panel, aby umožňoval nastavit disabled/hidden na button

### Reference

`reference-tswebui/packages/ts-form/src/ts-form.js`, řádky 1044-1066: imperative button API.

---

## ÚKOL 6: Přidat `activeTab` prop a vizuální indikaci chyb na záložkách

**Priorita:** 🔴 VYSOKÁ

**Soubory:** `src/components/ts-web-ui/ts-form/types.ts`, `src/components/ts-web-ui/ts-form/index.tsx`, `src/components/ts-web-ui/ts-form/ts-form-layout.tsx`

### 6a: `activeTab` — programové přepínání záložek

- [ ] Přidat do `TsFormProps`:
  ```typescript
  activeTab?: string       // tab label — controlled mode
  onTabChange?: (tab: string) => void
  ```
- [ ] Propagovat do `TsFormLayout` a tam do `<Tabs>`:
  - Pokud `activeTab` je nastaveno → `<Tabs value={activeTab} onValueChange={onTabChange}>`
  - Pokud `activeTab` není nastaveno → `<Tabs defaultValue={tabs[0].label}>` (uncontrolled, jako nyní)

### 6b: Vizuální indikace chyb na záložkách

- [ ] V `TsFormLayout` přijmout `fields` prop (pro přístup k `field.error`)
- [ ] Pro každý tab spočítat, jestli obsahuje pole s errory:
  ```typescript
  const tabHasErrors = tab.rows.some(row =>
    row.some(item => item.field && fields[item.field]?.error)
  )
  ```
- [ ] Na `TabsTrigger` přidat vizuální indikaci:
  ```tsx
  <TabsTrigger className={cn(tabHasErrors && "text-destructive")}>
    {tab.label}
    {tabHasErrors && <span className="ml-1 h-2 w-2 rounded-full bg-destructive inline-block" />}
  </TabsTrigger>
  ```

### Reference

`reference-tswebui/packages/ts-form/src/ts-form.js`: `active-tab` v `observedAttributes`, červené záložky při chybě.

---

## ÚKOL 7: Opravit sémantiku `roundTo` a number locale

**Priorita:** 🔴 VYSOKÁ

**Soubory:** `src/components/ts-web-ui/ts-form/types.ts`, number widget

### Kontext

- **Reference:** `roundTo=0.01` znamená "zaokrouhli na nejbližší 0.01" (factor-based)
- **Nová impl:** `roundTo=2` znamená "2 desetinná místa" (exponent-based)
- Obojí dává stejný výsledek, ale **konfigurační hodnoty jsou nekompatibilní**

### Kroky

- [ ] **Zachovat novou sémantiku** (počet desetinných míst) — je intuitivnější
- [ ] **Zdokumentovat explicitně** v types.ts JSDoc:
  ```typescript
  /** Number of decimal places for rounding and display (e.g. 2 = round to 0.01). Default: no rounding. */
  roundTo?: number
  ```
- [ ] **Přidat `locale` prop** do `TsNumberField`:
  ```typescript
  /** BCP 47 locale tag for number formatting (default: "cs-CZ") */
  locale?: string
  ```
- [ ] V `NumberWidget` použít `Intl.NumberFormat(def.locale || "cs-CZ", ...)` — výchozí chování shodné s referencí (čárka = oddělovač desetin, mezera = oddělovač tisíců)

### Reference

`reference-tswebui/packages/ts-form/src/ts-form-field.js`, řádky 1214-1257: `formatNumber()` s hardcoded cs-CZ formátováním.

---

## ÚKOL 8: Přidat smart date parsing

**Priorita:** 🔴 VYSOKÁ

**Soubory:** `src/components/ts-web-ui/ts-form/widgets/utils.ts` (nový), date widget

### Kontext

Reference podporuje krátké formáty datumů — uživatel zadá `2503` a systém to interpretuje jako 25.03. aktuálního roku. Nová implementace podporuje pouze přesný formátový match.

### Kroky

- [ ] Implementovat utility `smartParseDate(input: string, dateFormat: string): Date | null`:
  - `"2503"` → 25.03. aktuální rok
  - `"25032024"` → 25.03.2024
  - `"25.3.2024"` → 25.03.2024
  - `"25.3."` → 25.03. aktuální rok
  - `"250320241430"` → 25.03.2024 14:30 (pro datetime)
  - Fallback na `parse(input, dateFormat, new Date())` z date-fns
- [ ] Integrovat do date widgetů v `onBlur` handleru
- [ ] Validovat výsledné datum (ne NaN, rozumný rozsah — ne rok 0001 ani 9999)
- [ ] Přidat unit testy pro `smartParseDate`

### Reference

`reference-tswebui/packages/ts-form/src/ts-form-field.js`, řádky 659-890: rozsáhlá logika pro parsování krátkých formátů.

---

## ÚKOL 9: Přidat chybějící field atributy

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** `src/components/ts-web-ui/ts-form/types.ts`, příslušné widgety

### 9a: `autofocus`

- [ ] Přidat `autofocus?: boolean` do `TsFieldBase` v `types.ts`
- [ ] V každém inputovém widgetu předat `autoFocus={def.autofocus}`
- [ ] Přidat do form editoru properties panelu

### 9b: `hideLabel`

- [ ] Přidat `hideLabel?: boolean` do `TsFieldBase` v `types.ts`
- [ ] V `TsFormField` dispatcher: pokud `fieldDef.hideLabel === true`, nerendrovat label element
- [ ] Relevantní zejména pro: checkbox, switch, slider, radio, file, image
- [ ] Přidat do form editoru properties panelu

### 9c: `allowEmpty` pro combobox

- [ ] Přidat `allowEmpty?: boolean` do `TsComboboxField` v `types.ts`
- [ ] V `ComboboxWidget`: pokud `allowEmpty`, přidat prázdnou option na začátek seznamu
- [ ] Neblokovat deselekci v popoveru
- [ ] Přidat do form editoru properties panelu

### 9d: `excludeFromSubmit`

- [ ] Přidat `excludeFromSubmit?: boolean` do `TsFieldBase` v `types.ts`
- [ ] V `index.tsx` při submit filtrovat data: vyloučit pole kde `fields[key].excludeFromSubmit === true`
- [ ] Automaticky vyloučit pro typy: `infobox`, `markdown`, `separator`, `empty`, `button`
- [ ] V `onFieldChange` callbacku (ÚKOL 4) taky vyloučit

---

## ÚKOL 10: Opravit form-key-action scope

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** `src/components/ts-web-ui/ts-form/index.tsx`

### Co je špatně

`window.addEventListener("form-key-action", ...)` (řádek 149) znamená, že pokud jsou na stránce dva formuláře, oba reagují na Enter/Escape z kteréhokoli formuláře.

### Kroky

- [ ] Přidat `ref` na `<form>` element: `const formRef = React.useRef<HTMLFormElement>(null)`
- [ ] Změnit `window.addEventListener` na `formRef.current?.addEventListener`
- [ ] Event bubbling z widgetů zůstává (`bubbles: true`) — event probublá k `<form>` elementu
- [ ] Cleanup v `useEffect` taky na `formRef.current`
- [ ] Ověřit funkčnost s dvěma formuláři na jedné stránce

---

## ÚKOL 11: Relationship picker — multi-column display

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** relationship widget

### Kontext

Reference zobrazuje v selection dialogu tabulku se sloupci podle `displayFields`. Nová implementace zobrazuje jednořádkový text.

### Kroky

- [ ] V `RelationshipWidget` search results: místo jednořádkového `getDisplayText()` renderovat grid/tabulku
- [ ] Hlavička = `displayFields` jako sloupce
- [ ] Zachovat Command komponent pro filtrování
- [ ] Výsledky zobrazovat jako řádky se sloupci
- [ ] Responsivní — na úzkém popoveru priorita prvních N sloupců

### Reference

`reference-tswebui/packages/ts-form/src/ts-relationship-picker.js`, řádky ~200-300.

---

## ÚKOL 12: Editor — rename field

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** `src/components/ts-web-ui/ts-form-editor/store.ts`, `src/components/ts-web-ui/ts-form-editor/form-editor.tsx`

### Kroky

- [ ] V `store.ts` přidat action `renameField(oldKey: string, newKey: string)`:
  - Přejmenovat klíč v `fields` objektu
  - Aktualizovat všechny `rows` → `items` → `field` reference z `oldKey` na `newKey`
  - Validovat: `newKey` neexistuje a je validní identifikátor (regex: `/^[a-zA-Z_][a-zA-Z0-9_]*$/`)
  - Uložit do undo history
- [ ] V `form-editor.tsx` přidat UI v properties panelu: editovatelné textové pole pro field key

---

## ÚKOL 13: Editor — insert column at position

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** `src/components/ts-web-ui/ts-form-editor/store.ts`, `src/components/ts-web-ui/ts-form-editor/form-editor.tsx`

### Kroky

- [ ] V `store.ts` upravit `addColumn` aby akceptoval `atIndex?: number` parametr
- [ ] V `form-editor.tsx` přidat UI: context menu nebo buttony "Insert column before" / "Insert column after" na existujících sloupcích

---

## ÚKOL 14: Implementovat `readOnly` prop na úrovni TsForm

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** `src/components/ts-web-ui/ts-form/index.tsx`, `src/components/ts-web-ui/ts-form/ts-form-layout.tsx`, `src/components/ts-web-ui/ts-form/ts-form-field.tsx`

### Kontext

`readOnly` je deklarovaný v `TsFormProps` ale ihned vyloučený přes `Omit<TsFormProps, "readOnly">`. Nikdy není implementovaný.

### Kroky

- [ ] Odstranit `Omit<TsFormProps, "readOnly">` — přijmout `readOnly` jako prop
- [ ] Propagovat `readOnly` přes `TsFormLayout` → `TsFormField`
- [ ] V `TsFormField`: pokud form-level `readOnly === true`, všechna pole se chovají jako `readonly` (override field-level)
- [ ] Při `readOnly` celý button bar schovat (nerendrovat `renderButtons`)

---

## ÚKOL 15: File upload — podpora pre-existing files

**Priorita:** 🟡 STŘEDNÍ

**Soubory:** file widget, `src/components/ts-web-ui/ts-form/types.ts`

### Kontext

Reference podporuje předvyplnění file uploaderu z base64/object. Nová implementace přijímá pouze `File[]`.

### Kroky

- [ ] Definovat typ pro pre-existing file:
  ```typescript
  export interface TsPreExistingFile {
    name: string
    size?: number
    url?: string
    base64?: string
    mimeType?: string
  }
  ```
- [ ] V `FileUploadWidget` podporovat `value` jako `(File | TsPreExistingFile)[]`
- [ ] Pre-existing soubory zobrazit v seznamu s možností stažení (url) a odebrání
- [ ] Při submit vrátit obojí — nové `File` objekty i reference na pre-existing

### Reference

`reference-tswebui/packages/ts-form/src/ts-file-upload.js`, řádky ~150-200.

---

## ÚKOL 16: Drobné opravy a vylepšení

**Priorita:** 🟢 NÍZKÁ — single PR s drobnými fixes

### 16a: Closable infobox

- [ ] Přidat `closable?: boolean` do `TsInfoboxField` v `types.ts`
- [ ] Přidat dismiss button (X) na `Alert` komponentu
- [ ] Po kliknutí skrýt infobox (local state)

### 16b: Konfigurovatelná ikona infoboxu

- [ ] Přidat `icon?: string` do `TsInfoboxField` v `types.ts`
- [ ] Podporovat Lucide icon names (whitelist nejpoužívanějších)
- [ ] Fallback na mapování variant → ikona (aktuální chování)

### 16c: Export/import formulářových dat

- [ ] Přidat callback props na TsForm:
  ```typescript
  onExportData?: () => void
  onImportData?: (data: Record<string, unknown>) => void
  ```
- [ ] Integrovat s built-in button actions `export-data` / `import-data`

---

## Ostatní TODO (nesouvisí s TsForm)

- [ ] **Integrace `reference-ruian`**: Vytvořit komponentu pro našeptávání adres využívající RUIAN logiku
- [ ] **Validace českých adres**: Implementovat validaci na základě RUIAN dat

---

*Poslední aktualizace: 28. února 2026*
