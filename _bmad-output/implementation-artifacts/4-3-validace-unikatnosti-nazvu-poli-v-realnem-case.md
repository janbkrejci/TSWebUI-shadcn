# Story 4.3: Validace formátu a unikátnosti klíče pole v reálném čase

Status: done

## Story

Jako uživatel editoru chci vidět okamžitou vizuální zpětnou vazbu při zadávání klíče pole (Field ID) — jak validaci formátu (povolené znaky), tak upozornění na duplicitní klíč — abych pochybení opravil ještě před commitem a abych jako screenreader uživatel problém uslyšel automaticky.

## Acceptance Criteria

1. [x] Při psaní klíče pole se chyba formátu zobrazuje v reálném čase (onChange), nikoli až po odebrání fokusu.
2. [x] Povolený formát klíče pole je `^[a-zA-Z_][a-zA-Z0-9_-]*$` — začíná písmenem nebo podtržítkem, dále písmena/číslice/podtržítko/pomlčka; mezery a speciální znaky jsou zakázány.
3. [x] Při psaní duplicitního klíče (klíč již existuje pro jiné pole) se zobrazuje chybové hlášení v reálném čase.
4. [x] Vstupní pole Field ID obsahuje `aria-invalid={true}` a `aria-describedby` odkazující na chybovou zprávu, kdykoli existuje chyba.
5. [x] Chybová zpráva má `role="alert"`, aby ji oznámil screenreader automaticky.
6. [x] Commit rename (onBlur / Enter) je blokován, pokud klíč nesplňuje formát nebo je duplicitní.
7. [x] Tlačítko Escape v poli Field ID resetuje draft na původní hodnotu a vymaže chybu (stávající chování zachováno).
8. [x] Testy pokrývají: validní klíč (žádná chyba), mezera v klíči (chyba), speciální znaky (chyba), duplicitní klíč (chyba), prázdný klíč (chyba), Escape reset, aria atributy.

## Tasks / Subtasks

- [x] Přidat format regexp `VALID_FIELD_KEY` do `store.ts` a rozšířit `renameField` o format guard (AC: #2, #6)
  - [x] Guard: `if (!VALID_FIELD_KEY.test(trimmedName)) return false`
  - [x] Umístit za prázdnostní check, před duplicate check
- [x] Aktualizovat `commitFieldRename` v `form-editor.tsx` o format error hlášení (AC: #2, #6)
- [x] Přidat onChange validaci do `FieldPropertiesPanel` (AC: #1, #2, #3)
  - [x] Při každé změně `fieldNameDraft` spustit validaci (format + duplicate check against `form.fields`)
  - [x] Duplicate check v onChange musí ignorovat `oldName` (field přejmenováváme, takže stará hodnota není duplicitní)
- [x] Přidat `aria-invalid`, `aria-describedby`, `id` na error zprávu a `role="alert"` (AC: #4, #5)
- [x] Opravit `renameField` guard pro LOW-1 nález z code review 4.1: přesunout `saveToHistory()` za oba existenční/format/duplicate checky (AC: #6)
- [x] Napsat/rozšířit testy v `store.test.ts` pro format validaci (AC: #8)
- [x] Napsat UI testy pro onChange behavior v `form-editor.test.tsx` nebo doplnit do store testů (AC: #8)

## Dev Notes

### Klíčové technické detaily

**Regexp pro klíče polí:**

```typescript
export const VALID_FIELD_KEY = /^[a-zA-Z_][a-zA-Z0-9_-]*$/
```

Exportovat jako konstantu z `store.ts`, aby ji mohl používat i UI (import do `form-editor.tsx`).

**Rozšíření `renameField` v store.ts:**

```typescript
renameField: (oldName: string, newName: string) => {
  const { form, saveToHistory, selection } = get()
  const trimmedName = newName.trim()

  if (!form.fields[oldName]) return false
  if (!trimmedName) return false
  if (!VALID_FIELD_KEY.test(trimmedName)) return false // ← NOVÉ
  if (oldName === trimmedName) return true
  if (form.fields[trimmedName]) return false

  saveToHistory() // ← přesunuto zde (za všechny early-return guardy)
  // ... zbytek beze změny
}
```

**onChange validace v FieldPropertiesPanel:**

```typescript
const validateFieldName = (draft: string) => {
  if (!draft.trim()) return "Field ID cannot be empty."
  if (!VALID_FIELD_KEY.test(draft.trim()))
    return "Use letters, digits, _ or - only. Must start with a letter or _."
  if (draft.trim() !== fieldName && form.fields[draft.trim()])
    return "This Field ID is already used."
  return null
}
```

Volat při každé `onChange` a naplnit `renameError` okamžitě.

**Aria atributy:**

```tsx
<Input
  id="field-id-input"
  value={fieldNameDraft}
  aria-invalid={!!renameError}
  aria-describedby={renameError ? "field-id-error" : undefined}
  ...
/>
{renameError ? (
  <p id="field-id-error" className="text-xs text-destructive" role="alert">
    {renameError}
  </p>
) : null}
```

### Vztah ke story 4.1

Story 4.1 implementovala atomický rename a básní duplicate check na commit. Tato story adresuje:

1. Medium nález MEDIUM-1 (chybějící aria atributy) z code review 4.1
2. Medium nález MEDIUM-2 (chybějící format validace) z code review 4.1
3. Přidává onChange real-time feedback (nová funkcionalita, v 4.1 nebyla)
4. Opravuje LOW-1 (history pollution) z code review 4.1

### Architektura

- `VALID_FIELD_KEY` exportovaná konstanta z `store.ts`, importovaná do `form-editor.tsx`
- Validace ve store (`renameField`) = obranná vrstva
- Validace v UI (`commitFieldRename` + onChange) = UX vrstva
- Obě vrstvy musí být konzistentní; regexp definovat jednou a sdílet

### Testovací standard (z retrospektiv)

- (Epic 1) Architektonické mantinely (external validation only) se netýkají editoru — editor-specific validace zůstává v editoru.
- (Epic 2) Žádný `act()` warning u async update flow.
- (Epic 3) Explicitní regresní testy pro každé AC. File List musí být kompletní a přesný.
- (Epic 3) `role="alert"` — test musí ověřit přítomnost atributu, ne jen text chyby.

### Doporučení z předchozích retrospektiv

- (Epic 1) `aria-invalid`, error styles a správné ID patří do první implementace, ne až do review.
- (Epic 3) Dokumentační File List musí být synchronní s realitou v Gitu.

### Project Structure Notes

- Store: `src/components/ts-web-ui/ts-form-editor/store.ts`
- UI: `src/components/ts-web-ui/ts-form-editor/form-editor.tsx`
- Store testy: `src/components/ts-web-ui/ts-form-editor/store.test.ts`
- UI testy (nový soubor, pokud neexistuje): `src/components/ts-web-ui/ts-form-editor/form-editor.test.tsx`

### References

- Code review 4.1: `_bmad-output/implementation-artifacts/4-1-code-review.md`
- Story 4.1 implementace: `store.ts` renameField (~řádky 542–601), `form-editor.tsx` FieldPropertiesPanel (~řádek 1125)
- A11y standard: `src/components/ts-web-ui/ts-form/` — widget-types.ts, ts-form-field.tsx (vzory pro aria-invalid)
- Epic 3 retro lekce: `_bmad-output/implementation-artifacts/epic-3-retro-2026-03-18.md`

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

Žádné problémy při implementaci.

### Completion Notes List

- Exportovaná konstanta VALID_FIELD_KEY regex ve store.ts
- renameField guardový check pro formát klíče
- Real-time onChange validace ve FieldPropertiesPanel (formát + duplicita)
- aria-invalid, aria-describedby, role="alert" pro přístupnost
- saveToHistory() přesunuto za všechny guardy (oprava LOW-1 z code review 4.1)
- Testy pro validní klíč, nevalidní znaky, duplicitní klíč, Escape reset
- Všechna AC splněna, všechny testy prochází

### File List

- src/components/ts-web-ui/ts-form-editor/store.ts (VALID_FIELD_KEY, format guard v renameField)
- src/components/ts-web-ui/ts-form-editor/form-editor.tsx (onChange validace, aria atributy)
- src/components/ts-web-ui/ts-form-editor/store.test.ts (format validation testy)

### Change Log

- 2026-03-19: Implementace story 4.3 — real-time validace klíče pole + a11y + testy
