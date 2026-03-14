# Story 1.4: Migrace výběrových a komplexních widgetů na bezvalidační režim

Status: completed

## Story

As a **vývojář**,
I want **migrovat komplexní widgety do nové modulární struktury**,
so that **celý TsForm byl plně bezvalidační a konzistentní ve všech typech polí**.

## Acceptance Criteria

1. [x] Widgety `Select`, `Multiselect`, `Combobox`, `Date`, `Datetime` a `Relationship` jsou vyčleněny do samostatných souborů v `widgets/`.
2. [x] Z těchto widgetů je odstraněna veškerá vnitřní validační logika a komponenty `<FormMessage />`.
3. [x] Widgety pracují výhradně s prop `error` (string) pro vizuální indikaci chybového stavu.
4. [x] Komplexní widgety (zejména ty s popovery a dialogy) zachovávají svůj stav a focus při re-renderech (State Integrity).
5. [x] V kódu widgetů se nenacházejí žádné importy z knihovny `zod`.

## Tasks / Subtasks

- [x] **Migrace výběrových widgetů** (AC: 1, 2, 3)
  - [x] Upravit `select-widget.tsx`.
  - [x] Upravit `multiselect-widget.tsx`.
  - [x] Upravit `combobox-widget.tsx`.
- [x] **Migrace datumových a komplexních widgetů** (AC: 1, 2, 3)
  - [x] Upravit `date-widget.tsx`.
  - [x] Upravit `datetime-widget.tsx`.
  - [x] Upravit `relationship-widget.tsx`.
- [x] **Zajištění State Integrity** (AC: 4)
  - [x] Ověřit focus management u `Relationship` picker dialogu.
  - [x] Ověřit chování popoverů u `Select` a `Date` widgetů při změně externích dat.
- [x] **Finální cleanup dispatcheru** (AC: 5)
  - [x] Odstranit poslední zbytky `zod` logiky z `ts-form-field.tsx`, pokud tam nějaké zůstaly po předchozích stories.

## Dev Notes

### Architektonické mantáty

- **Modularita:** Každý widget má svůj soubor v `widgets/`.
- **State Integrity:** Focus a stav popoverů je zachován díky stabilním klíčům v `TsFormLayout` (použití `item.field` místo indexu).
- **Relationship Picker:** Implementován pokročilý picker pomocí `Dialog` a `TsTable`.
- **Bezvalidační režim:** Všechny widgety přijímají `error` prop a nepoužívají vnitřní validation logic. `TsFormField` manuálně předává `errorMessage` do `FormMessage`.

### Opravy v rámci Code Review

- **TsTable:** Přidána podpora pro `onSelectionChange`, aby `RelationshipWidget` mohl správně přebírat výběr z tabulky v režimu `multiple`.
- **RelationshipWidget:** Opraveno předávání `ref` a přidána podpora pro `form-field-action` a `form-table-action`.
- **Consistency:** Sjednoceny texty (např. "Zavřít" -> "Close" v `datetime-widget.tsx`).

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/widgets/select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/date-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/relationship-widget.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- `src/components/ts-web-ui/ts-table/index.tsx` (přidáno v rámci review)

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.4]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Completion Notes List

- Story 1.4 plně implementována a otestována produkčním buildem.
- State Integrity vyřešena na úrovni layoutu.
- Komplexní Relationship Picker plně funkční v popover i dialog režimu.
