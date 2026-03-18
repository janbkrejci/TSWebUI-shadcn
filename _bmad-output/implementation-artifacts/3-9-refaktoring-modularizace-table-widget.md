# Story 3.9: Refaktoring a modularizace Table widgetu (TsTable wrapper)

Status: done

## Story

Jako vývojář chci mít Table widget jako samostatný, modulární prvek postavený na `TsTable`,
abych mohl snadno přidávat tabulky do formulářů s plnou funkčností a konzistentním vzhledem.

## Acceptance Criteria

1. [x] **Modular Architecture**: Table widget je vyčleněn do samostatného souboru `src/components/ts-web-ui/ts-form/widgets/ts-table-widget.tsx`.
2. [x] **TsTable Integration**: Widget funguje jako tenký wrapper nad komplexní komponentou `TsTable`.
3. [x] **JSON Configuration**: Podporuje konfiguraci sloupců a dat přímo z JSON definice formuláře.
4. [x] **State Integrity**: Widget správně propisuje změny dat z tabulky do globálního stavu formuláře (včetně nested paths).
5. [x] **Layout & Wrapper Consistency**: Widget používá `TsFormField` pro label, hint a error a zachovává mřížkové zarovnání.
6. [x] **Regression Tests**: Testy pro správné renderování dat a synchronizaci stavu při změně v tabulce.

## Tasks / Subtasks

- [x] Vytvořit `ts-table-widget.tsx` v adresáři widgetů (AC: #1)
- [x] Implementovat předávání konfigurace a dat do `TsTable` (AC: #2, #3)
- [x] Integrovat synchronizaci dat s `onFieldChange` a stavem formuláře (AC: #4)
- [x] Ověřit správné zobrazení labelu a errorů přes `TsFormField` (AC: #5)
- [x] Upravit globální typy pro podporu table-specifických parametrů v JSONu (AC: #3)
- [x] Přidat regresní testy (AC: #6)

## Dev Notes

- **Lessons from Retro**: Tabulka ve formuláři je často zdrojem problémů s nested data. Každý řádek tabulky by měl mít jasnou cestu v datovém modelu.
- **Tailwind v4**: Zajistit, aby `TsTable` i v rámci formuláře vypadal dobře a respektoval v4 styly.
- **Reference**: Implementace v `reference-tswebui` (v `ts-form-table.js`).

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Refactored Table widget into a modular component.
- Integrated with core TsTable system and global form state.
- Verified data propagation and layout consistency.
- Post-review: strengthened regression tests to assert real data propagation from table to `onFieldChange`.

### File List

- src/components/ts-web-ui/ts-form/widgets/ts-table-widget.tsx
- src/components/ts-web-ui/ts-form/stories-3-9.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
