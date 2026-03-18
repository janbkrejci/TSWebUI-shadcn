# Story 3.3: Tabulkový Dropdown v Relationship Pickeru

Status: done

## Story

Jako uživatel chci vidět výsledky vyhledávání v Relationship Pickeru v tabulkovém zobrazení,
abych si mohl vybrat správný záznam podle více atributů najednou.

## Acceptance Criteria

1. [x] **Table View in Dropdown**: Výsledky vyhledávání jsou zobrazeny v tabulce s konfigurovatelnými sloupci (definovanými v JSONu).
2. [x] **Column Support**: Každý sloupec tabulky v dropdownu odpovídá vybranému poli z datového modelu.
3. [x] **State Integrity**: Widget zachovává focus při interakci se seznamem (tabulkou) a při výběru.
4. [x] **Nested Path Support**: Widget správně pracuje s daty uloženými v hlubokých strukturách.
5. [x] **A11y**: Tabulka v dropdownu je přístupná (správná navigace klávesnicí, `role="grid"` nebo `role="listbox"` se sloupci).
6. [x] **Regression Tests**: Testy pro vyhledávání, výběr a stabilitu UI při zobrazení tabulky.

## Tasks / Subtasks

- [x] Připravit komponentu pro vykreslení tabulky v rámci dropdownu (AC: #1)
- [x] Mapovat JSON konfiguraci sloupců na `TsTable` nebo lehčí tabulkovou implementaci (AC: #2)
- [x] Implementovat synchronizaci výběru řádku s hodnotou widgetu (AC: #3)
- [x] Zajistit správnou navigaci klávesnicí v tabulce (AC: #5)
- [x] Ověřit vnořené cesty v hlášení výsledků (AC: #4)
- [x] Doplnit regresní testy pro vyhledávání a tabulkové zobrazení (AC: #6)

## Dev Notes

- **Lessons from Retro**: Relationship picker je komplexní widget. Pozor na synchronizaci s globálním stavem formuláře, aby nedocházelo k nechtěnému resetu výběru.
- **Shared Standard**: Použít `TsFormField` pro konzistentní zobrazení chyb a popisků.
- **Reference**: Původní implementace v `reference-tswebui` (v `ts-form-relationship.js`).

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Implemented table-based dropdown for Relationship Picker.
- Supported configurable columns and keyboard navigation.
- Verified data synchronization and focus management.
- Review fix: added missing regression test file reference to File List.

### File List

- src/components/ts-web-ui/ts-form/widgets/relationship-widget.tsx
- src/components/ts-web-ui/ts-form/stories-3-3.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
