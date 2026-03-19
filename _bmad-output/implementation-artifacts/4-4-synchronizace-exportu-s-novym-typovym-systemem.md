# Story 4.4: Synchronizace exportu s novým typovým systémem

Status: done

## Story

Jako vývojář chci, aby editor exportoval JSON definice přesně odpovídající TypeScript rozhraní `TsFormDef` (Ts prefix), aby exportovaný JSON byl kompatibilní s aktuální verzí TsForm a správně přenášel všechny nové parametry zavedené v Epics 2 a 3.

## Acceptance Criteria

1. [x] Exportovaný JSON neobsahuje žádné legacy atributy, které nejsou součástí `TsFormDef` / `TsFieldDef`.
2. [x] Struktura layoutu v exportu přesně odpovídá `TsLayout` — klíče `tabs` nebo `rows` se správným formátem `TsRow[]` (pole `TsRowItem[]`).
3. [x] `TsRowItem` položky v exportu zahrnují `align` pokud je nastaveno, a správně exportují separator sloupce s `type: "separator"` a případně `label`.
4. [x] Export zachovává prázdné sloupce (`type: "empty"`) — neprobíhá tichá filtrace prázdných sloupců z layoutu (pokud nebyly explicitně nastaveny jako empty intentionally; viz Dev Notes).
5. [x] Všechny `TsFieldDef` atributy zavedené v Epic 3 jsou exportovány bez ztráty: `excludeFromSubmit`, `roundTo`, `hideLabel`, `readonly`, `autofocus`.
6. [x] `TsButton` atributy `disabled` a `hidden` jsou exportovány, pokud jsou nastaveny.
7. [x] Export tlačítek zachovává `position`, `icon` a `confirmation` objekty kompletně.
8. [x] Export lze importovat zpět bez ztráty dat (round-trip test).
9. [x] Testy pokrývají všechny nové export oblasti; test suita prochází zeleně.

## Tasks / Subtasks

- [x] Analyzovat aktuální `exportJson()` v `store.ts` a identifikovat všechny mezery oproti `TsFormDef` (AC: #1–#7)
  - [x] Ověřit, zda `TsRowItem.align` je exportováno
  - [x] Ověřit handling separator items (field="" ale type="separator")
  - [x] Ověřit, zda filtrace `item.field` netichá mazáže separátory
- [x] Opravit filtrovací logiku v `exportJson()`: místo `filter((item) => item.field)` použít `filter((item) => item.field || item.type === "separator")` (AC: #3)
- [x] Přidat export `align` do `TsRowItem` v exportu (AC: #3)
- [x] Ověřit a případně opravit export `TsFieldDef` – prochází `form.fields` beze změny, ale ověřit, že nový kód neobsahuje legacy klíče (AC: #1, #5)
- [x] Ověřit a opravit export `TsButton` – přidat `disabled`, `hidden` pokud chybí (AC: #6, #7)
- [x] Napsat round-trip test: sestavit form → export → import → export znovu → porovnat JSONy (AC: #8)
- [x] Napsat unit testy pro nové export scénáře (AC: #9)

## Dev Notes

### Klíčové technické detaily

**Aktuální `exportJson()` problém — tichá filtrace prázdných sloupců:**

```typescript
// AKTUÁLNĚ – odfiltruje VŠECHNY items bez field, včetně separátorů
.filter((item: EditorRowItem) => item.field)
.map((item: EditorRowItem) => ({
  field: item.field,
  width: item.width,
}))
```

**Opravená verze:**

```typescript
.filter((item: EditorRowItem) => item.field || item.type === "separator")
.map((item: EditorRowItem) => {
  const rowItem: TsRowItem = { field: item.field }
  if (item.width) rowItem.width = item.width
  if (item.align) rowItem.align = item.align
  if (item.type === "separator") {
    rowItem.type = "separator"
    if (item.label) rowItem.label = item.label
  }
  return rowItem
})
```

> **Poznámka k `empty` typům:** Intentionally prázdné sloupce (type="empty", field="") jsou v editor interním stavu — v exportu pro TsForm se obvykle vynechávají, protože TsForm je nevykoná. Separator sloupce (type="separator") jsou ale smysluplné a musí se exportovat. Toto je klíčové rozhodnutí — zachovat stávající chování pro empty, opravit pro separator.

**TsRowItem interface (z `types.ts`):**

```typescript
export interface TsRowItem {
  field: string
  width?: string
  type?: "empty" | "separator"
  label?: string // pro separator
  align?: "left" | "center" | "right"
}
```

**Export tlačítek — ověřit completeness:**
Aktuálně: `form.buttons` je předán přímo do output. Ověřit, že TsButton interface atributy `disabled`, `hidden` nejsou stripovány. Pokud jsou v `form.buttons` přítomny, měly by projít zachované.

**TsFieldDef atributy (Epic 3 přidané):**

- `excludeFromSubmit`, `roundTo`, `hideLabel`, `readonly`, `autofocus` — jsou součástí `TsFieldDef` union v `widget-types.ts`.
- `form.fields` je předán beze změny do output — pokud jsou atributy v in-memory reprezentaci, projdou automaticky. Ověřit, že `updateFieldConfig` v editoru je schopen je nastavit (ověření pro story 4.5).

**Round-trip test pattern:**

```typescript
it("export-import round-trip preserves all data", () => {
  // 1. sestavit form se separator, align, excludeFromSubmit, tlačítky
  // 2. exportJson → JSON string
  // 3. importJson(json) → reload
  // 4. exportJson znovu → compare
  expect(secondExport).toBe(firstExport)
})
```

### Architektura

- Veškerá logika v `exportJson()` v `store.ts` — žádná nová závislost, žádný nový soubor.
- Import `TsRowItem` type do store.ts pro typovaný intermediate objekt.

### Testovací standard (z retrospektiv)

- (Epic 3) Explicitní regresní test pro každé AC, ne jen manuální ověření.
- (Epic 3) File List musí přesně odpovídat reálně změněným souborům.
- (Epic 1) Nové funkce nesmí porušit stávající export/import scénáře — round-trip test je klíčový.

### Doporučení z předchozích retrospektiv

- (Epic 1) Nested data / deep structures jsou podceňované — opatrnost při map/filter přes layoutové struktury.
- (Epic 2) Po změně sdílených metod exportu ověřit kompatibilitu s existujícím preview formuláře v editoru.
- (Epic 3) Modulárnost: nezasahovat do TsForm jádra, jen do editor store.

### Project Structure Notes

- Store: `src/components/ts-web-ui/ts-form-editor/store.ts` — funkce `exportJson()` (~řádek 805)
- Types export: `src/components/ts-web-ui/ts-form/types.ts` — `TsRowItem`, `TsFormDef`, `TsButton`
- Widget types: `src/components/ts-web-ui/ts-form/widget-types.ts` — `TsFieldDef` union
- Tests: `src/components/ts-web-ui/ts-form-editor/store.test.ts`

### References

- `exportJson()` aktuální implementace: `store.ts` ~řádky 805–860
- `TsRowItem` interface: `types.ts` ~řádek 28
- `TsButton` interface: `types.ts` ~řádek 90
- `TsFieldDef` union: `widget-types.ts` (excludeFromSubmit ~řádek 91, roundTo ~řádek 160)
- Epic 3 retro (poznatky o exportu): `_bmad-output/implementation-artifacts/epic-3-retro-2026-03-18.md`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

Oprava selhávajícího testu „exports buttons with disabled and hidden attributes" — test nepočítal s defaultními tlačítky po resetForm(). Opraveno přidáním čištění defaultních tlačítek před assertem.

### Completion Notes List

- mapEditorItemToTsRowItem správně exportuje separator type+label a align
- Filtrace prázdných sloupců zachována, separátory nejsou tiše mazány
- TsButton atributy disabled/hidden/position/icon/confirmation procházejí exportem
- Epic 3 atributy (excludeFromSubmit, roundTo, hideLabel, readonly, autofocus) exportovány
- Round-trip test (export → import → export) ověřuje konzistenci
- Oprava testu pro buttons (default buttons cleanup)
- Všechna AC splněna, všechny testy prochází

### File List

- src/components/ts-web-ui/ts-form-editor/store.ts (mapEditorItemToTsRowItem, exportJson)
- src/components/ts-web-ui/ts-form-editor/store.test.ts (export testy, round-trip test, oprava button testu)

### Change Log

- 2026-03-19: Implementace story 4.4 — synchronizace exportu s novým typovým systémem + testy
