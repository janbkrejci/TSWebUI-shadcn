# Story 4.5: Synchronizace importu s novým typovým systémem

Status: done

## Story

Jako vývojář chci, aby editor správně interpretoval a vizualizoval JSON definice formuláře v novém i starším formátu, přičemž žádný atribut ani konfigurační detail z importovaného JSONu nesmí být ztracen nebo ignorován.

## Acceptance Criteria

1. [x] Import JSON odpovídajícího `TsFormDef` (nový formát) proběhne bez ztráty dat — všechny field atributy, layout parametry i tlačítka jsou správně načteny.
2. [x] Import starších JSON definic (bez `Ts` prefix typů) proběhne bez pádu a bez ztráty dat, která starý formát obsahuje.
3. [x] `TsRowItem.align` je po importu zachováno a správně zobrazeno v canvas editoru.
4. [x] Separator sloupce (type="separator", label) jsou správně importovány jako `EditorRowItem` s `type: "separator"` a odpovídajícím `label`.
5. [x] `TsFieldDef` atributy zavedené v Epic 3 (`excludeFromSubmit`, `roundTo`, `hideLabel`, `readonly`, `autofocus`) jsou po importu přítomny v `form.fields` a zobrazeny v properties panelu.
6. [x] `TsButton` atributy `disabled`, `hidden`, `position`, `icon` a `confirmation` jsou po importu zachovány bez změny.
7. [x] Importovaný formulář lze exportovat zpět a výsledný JSON je sémanticky ekvivalentní vstupnímu JSON (round-trip kompatibilita).
8. [x] Pokud JSON neobsahuje `buttons` pole, editor inicializuje prázdný seznam (žádný pád, žádné výchozí tlačítka přidány).
9. [x] Properties panel zobrazuje všechny importované atributy polí (hideLabel, readonly, excludeFromSubmit, autofocus, roundTo) — editor je umí číst a zobrazovat.
10. [x] Testy pokrývají: import nového formátu, import starého formátu, separator round-trip, align round-trip, Epic 3 atributy, chybný JSON (return false), chybějící `buttons`.

## Tasks / Subtasks

- [x] Analyzovat `importJson()` v `store.ts` a identifikovat mezery oproti `TsRowItem` (AC: #3, #4)
  - [x] Ověřit, zda je čten `align` z importovaného item
  - [x] Ověřit, zda separator items jsou importovány jako `type: "separator"` a s `label`
- [x] Opravit mapování `TsRowItem → EditorRowItem` v `importJson()` (AC: #3, #4)
  - [x] Přidat `align: item.align` kde je přítomno
  - [x] Přidat `type: item.type || (item.field ? parsed.fields[item.field]?.type || "empty" : "empty")`
  - [x] Přidat `label: item.label` kde je přítomno (pro separator)
- [x] Ověřit zpracování `buttons` — zajistit robustnost vůči chybějícím atributům (AC: #6, #8)
- [x] Ověřit, zda properties panel zobrazuje Epic 3 atributy (AC: #5, #9)
  - [x] Zkontrolovat `FieldPropertiesPanel` v `form-editor.tsx` — zda existují UI kontrolky pro `hideLabel`, `readonly`, `excludeFromSubmit`, `autofocus`, `roundTo`
  - [x] Pokud kontrolky chybějí, doplnit je v rámci této story (nebo zapsat jako gap do story 4.4/technicka poznamka)
- [x] Napsat round-trip testy: import → export → porovnání (AC: #7)
- [x] Napsat unit testy pro importJson s novými scénáři (AC: #10)

## Dev Notes

### Klíčové technické detaily

**Aktuální `importJson()` problém — ztráta `align` a separator:**

```typescript
// AKTUÁLNĚ — nezachytí align ani separator type z TsRowItem
items: (row as { field?: string; width?: string }[]).map((item) => ({
  id: generateId(),
  field: item.field || "",
  type: item.field ? parsed.fields[item.field]?.type || "empty" : "empty",
  width: item.width || "1fr",
})),
```

**Opravená verze:**

```typescript
items: (row as TsRowItem[]).map((item) => {
  const isSeparator = item.type === "separator"
  const fieldType = isSeparator
    ? "separator"
    : item.field
      ? parsed.fields[item.field]?.type || "empty"
      : "empty"

  const editorItem: EditorRowItem = {
    id: generateId(),
    field: item.field || "",
    type: fieldType as EditorRowItem["type"],
    width: item.width || "1fr",
  }

  if (item.align) editorItem.align = item.align
  if (item.label) editorItem.label = item.label

  return editorItem
})
```

**Import `TsRowItem` z types.ts:**

```typescript
import { TsRowItem } from "../ts-form/types"
```

**EditorRowItem type rozšíření (pokud chybí `align` nebo `label`):**
Ověřit v `src/components/ts-web-ui/ts-form-editor/types.ts`, zda `EditorRowItem` obsahuje `align?: string` a `label?: string`. Pokud ne, přidat. Tato změna je předpokladem pro správnou funkčnost importu i exportu.

**Properties panel — Epic 3 atributy:**
Zkontrolovat sekci `FieldPropertiesPanel` v `form-editor.tsx` (~řádek 1125+). Pokud chybí UI pro:

- `hideLabel: boolean` → `<Switch>` s labelem "Hide label"
- `readonly: boolean` → `<Switch>` s labelem "Read-only"
- `excludeFromSubmit: boolean` → `<Switch>` s labelem "Exclude from submit"
- `autofocus: boolean` → `<Switch>` s labelem "Auto focus"
- `roundTo: number` (pro number/slider typy) → `<Input type="number">`

…přidat je v rámci tohoto tasku. Tyto kontrolky jsou nezbytné pro smysluplné editování importovaných formulářů.

**Backward compatibility:**
Starý formát může mít:

- `layout.rows` jako pole polí (ne pole polí) — zkontrolovat hloubku struktury
- Chybějící `buttons` pole — defaultovat na `[]` (ne na výchozí tlačítka editoru)
- Field typy bez `Ts` prefixu — `TsFieldDef.type` union stále obsahuje všechny typy beze změny prefixu (standardní stringové literály), takže zpětná kompatibilita by měla být zachována automaticky

### Vztah ke story 4.4

- Story 4.4 opravuje export, story 4.5 opravuje import.
- Round-trip test (import → export → porovnání) musí fungovat po implementaci **obou** stories.
- Doporučená pořadí implementace: 4.4 → 4.5.
- Pokud jsou implementovány paralelně, round-trip testy přidat až po merge obou.

### Architektura

- Změny v `importJson()` v `store.ts`
- Případné rozšíření `EditorRowItem` type v `types.ts`
- Případné doplnění controls do `FieldPropertiesPanel` v `form-editor.tsx`
- Nové/rozšířené testy v `store.test.ts`

### Testovací standard (z retrospektiv)

- (Epic 3) Každé AC má explicitní regresní test. Manuální ověření nestačí jako jediný důkaz.
- (Epic 3) `act()` async pattern — pokud import spouští state update, obalit do `act()`.
- (Epic 1) Nested data jsou citlivý bod — round-trip testy jsou kritické pro validaci správnosti importu.
- (Epic 3) File List musí být kompletní a přesný — sledovat, zda byl změněn i `types.ts` (EditorRowItem).

### Doporučení z předchozích retrospektiv

- (Epic 1) State integrity — po importu ověřit, že `activeTabIndex`, `selection` a `historyIndex` jsou správně resetovány.
- (Epic 2) Controlled/uncontrolled synchronizace — po importu musí editor správně zobrazit aktivní záložku bez vedlejších efektů.
- (Epic 3) Dokumentační přesnost — pokud je změněn `types.ts`, musí být v File List.

### Project Structure Notes

- Store: `src/components/ts-web-ui/ts-form-editor/store.ts` — funkce `importJson()` (~řádek 750)
- Editor types: `src/components/ts-web-ui/ts-form-editor/types.ts` — `EditorRowItem`
- Form types: `src/components/ts-web-ui/ts-form/types.ts` — `TsRowItem`, `TsFormDef`
- UI: `src/components/ts-web-ui/ts-form-editor/form-editor.tsx` — `FieldPropertiesPanel`
- Testy: `src/components/ts-web-ui/ts-form-editor/store.test.ts`

### References

- `importJson()` aktuální implementace: `store.ts` ~řádky 750–803
- `EditorRowItem` type: `src/components/ts-web-ui/ts-form-editor/types.ts`
- `TsRowItem` interface: `src/components/ts-web-ui/ts-form/types.ts` ~řádek 28
- `FieldPropertiesPanel`: `form-editor.tsx` ~řádek 1125
- Story 4.4 (export opravy — předpoklad pro round-trip): `_bmad-output/implementation-artifacts/4-4-synchronizace-exportu-s-novym-typovym-systemem.md`
- Epic 3 retro (poznatky o importu/exportu): `_bmad-output/implementation-artifacts/epic-3-retro-2026-03-18.md`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

Žádné problémy při implementaci.

### Completion Notes List

- mapTsRowItemToEditorItem správně importuje align, separator type+label
- EditorRowItem type rozšířen o align a label (types.ts)
- importJson() robustní vůči chybějícím buttons (defaultuje na [])
- FieldPropertiesPanel zobrazuje Epic 3 atributy: hideLabel, readonly, excludeFromSubmit, autofocus, roundTo
- Backward compatibility se starším formátem zachována
- Round-trip test (import → export → porovnání) ověřuje konzistenci
- Testy pro import nového formátu, separator, align, Epic 3 atributy, chybějící buttons, legacy formát
- Všechna AC splněna, všechny testy prochází

### File List

- src/components/ts-web-ui/ts-form-editor/store.ts (mapTsRowItemToEditorItem, importJson)
- src/components/ts-web-ui/ts-form-editor/form-editor.tsx (FieldPropertiesPanel — Epic 3 atributy)
- src/components/ts-web-ui/ts-form-editor/types.ts (EditorRowItem rozšíření o align, label)
- src/components/ts-web-ui/ts-form-editor/store.test.ts (import testy, round-trip, legacy formát, chybějící buttons)

### Change Log

- 2026-03-19: Implementace story 4.5 — synchronizace importu + properties panel + testy
