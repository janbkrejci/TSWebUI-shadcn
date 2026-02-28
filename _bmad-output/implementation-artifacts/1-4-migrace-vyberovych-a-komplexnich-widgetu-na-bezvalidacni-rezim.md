# Story 1.4: Migrace výběrových a komplexních widgetů na bezvalidační režim

Status: ready-for-dev

## Story

As a **vývojář**,
I want **migrovat komplexní widgety do nové modulární struktury**,
so that **celý TsForm byl plně bezvalidační a konzistentní ve všech typech polí**.

## Acceptance Criteria

1. [ ] Widgety `Select`, `Multiselect`, `Combobox`, `Date`, `Datetime` a `Relationship` jsou vyčleněny do samostatných souborů v `widgets/`.
2. [ ] Z těchto widgetů je odstraněna veškerá vnitřní validační logika a komponenty `<FormMessage />`.
3. [ ] Widgety pracují výhradně s prop `error` (string) pro vizuální indikaci chybového stavu.
4. [ ] Komplexní widgety (zejména ty s popovery a dialogy) zachovávají svůj stav a focus při re-renderech (State Integrity).
5. [ ] V kódu widgetů se nenacházejí žádné importy z knihovny `zod`.

## Tasks / Subtasks

- [ ] **Migrace výběrových widgetů** (AC: 1, 2, 3)
  - [ ] Upravit `select-widget.tsx`.
  - [ ] Upravit `multiselect-widget.tsx`.
  - [ ] Upravit `combobox-widget.tsx`.
- [ ] **Migrace datumových a komplexních widgetů** (AC: 1, 2, 3)
  - [ ] Upravit `date-widget.tsx`.
  - [ ] Upravit `datetime-widget.tsx`.
  - [ ] Upravit `relationship-widget.tsx`.
- [ ] **Zajištění State Integrity** (AC: 4)
  - [ ] Ověřit focus management u `Relationship` picker dialogu.
  - [ ] Ověřit chování popoverů u `Select` a `Date` widgetů při změně externích dat.
- [ ] **Finální cleanup dispatcheru** (AC: 5)
  - [ ] Odstranit poslední zbytky `zod` logiky z `ts-form-field.tsx`, pokud tam nějaké zůstaly po předchozích stories.

## Dev Notes

### Architektonické mantáty

- **Modularita:** Každý widget má svůj soubor.
- **State Integrity:** Focus a stav popoverů musí zůstat zachován i při re-renderu formuláře.
- **Relationship Picker:** Speciální pozornost věnujte dialogu a tabulce uvnitř - musí korektně komunikovat přes `onAction`.

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/widgets/select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/date-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/relationship-widget.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.4]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Complex widget migration strategy aligned with pure presentation mandate.
