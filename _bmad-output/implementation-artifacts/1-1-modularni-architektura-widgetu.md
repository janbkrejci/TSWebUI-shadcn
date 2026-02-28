# Story 1.1: Modulární architektura widgetů (Widget-per-file)

Status: ready-for-dev

## Story

As a **přispěvatel**,
I want **aby každý widget byl ve vlastním souboru**,
so that **byl kód čitelný, udržitelný a snadno rozšiřitelný**.

## Acceptance Criteria

1. [x] V adresáři `src/components/ts-web-ui/ts-form/widgets/` existuje samostatný `.tsx` soubor pro každý typ pole (např. `text-widget.tsx`, `select-widget.tsx`).
2. [x] Hlavní dispatcher `ts-form-field.tsx` obsahuje pouze `switch` logiku pro importované widgety a obalovací prvky (Label, Error).
3. [x] Žádný soubor widgetu nepřesahuje limit 300 řádků kódu.
4. [x] Všechny widgety používají explicitní TypeScript rozhraní (např. `TsTextWidgetProps`) namísto `any`.
5. [x] Společná logika (třídy, focus handlery) je extrahována do `utils.ts`.

## Tasks / Subtasks

- [ ] **Příprava struktury** (AC: 1, 5)
  - [ ] Vytvořit adresář `src/components/ts-web-ui/ts-form/widgets/`.
  - [ ] Připravit `src/components/ts-web-ui/ts-form/utils.ts` pro sdílené funkce (např. `getFieldClasses`).
- [ ] **Extrakce widgetů** (AC: 1, 3, 4)
  - [ ] Extrahovat `Text`, `Textarea`, `Password` do samostatných souborů.
  - [ ] Extrahovat `Select`, `Multiselect`, `Combobox`.
  - [ ] Extrahovat `Number`, `Slider`.
  - [ ] Extrahovat `Checkbox`, `Switch`, `Radio`.
  - [ ] Extrahovat `Date`, `Datetime`.
  - [ ] Extrahovat `File`, `Relationship`.
  - [ ] Extrahovat prezentační widgety (`Infobox`, `Markdown`, `Separator`).
- [ ] **Refaktoring Dispatcheru** (AC: 2)
  - [ ] Upravit `ts-form-field.tsx` tak, aby pouze importoval a renderoval widgety.
  - [ ] Zajistit správné předávání props a chybových stavů.
- [ ] **Typová kontrola a cleanup** (AC: 4)
  - [ ] Ověřit, že nikde nezůstalo `any`.
  - [ ] Odstranit mrtvý kód z původního souboru.

## Dev Notes

### Architektonické mantáty

- **Widget-per-file:** Každý widget má svůj izolovaný soubor.
- **Strict Typing:** Žádné `any`, vždy explicitní interface s prefixem `Ts`.
- **Naming:** Soubory `kebab-case`, komponenty `PascalCase`.
- **Dispatcher:** `ts-form-field.tsx` je "smart wrapper" (Label, Error, Focus management).

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/ts-form-field.tsx` (Dispatcher)
- `src/components/ts-web-ui/ts-form/types.ts` (Definice typů)
- `src/components/ts-web-ui/ts-form/widgets/*` (Nové soubory)

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Modularity]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Modular architecture requirements verified against PRD and Architecture documents.
