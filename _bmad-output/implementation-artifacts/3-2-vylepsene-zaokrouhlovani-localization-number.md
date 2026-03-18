# Story 3.2: Vylepšené zaokrouhlování (roundTo) a lokalizace v Number widgetu

Status: done

## Story

Jako uživatel chci podporu pro automatické zaokrouhlování a české formátování v Number widgetu,
aby zadávaná data byla přesná a odpovídala lokálním standardům.

## Acceptance Criteria

1. [x] **RoundTo Support**: Hodnota se automaticky zaokrouhlí na počet míst definovaný v parametru `roundTo`.
2. [x] **Localization**: Widget používá české formátování (čárka jako oddělovač desetinných míst).
3. [x] **Cursor Preservation**: Number widget zachovává pozici kurzoru při formátování hodnoty za běhu (onInput/onChange).
4. [x] **State Integrity**: Widget udržuje vnitřní stav i při komplexním parsování a formátování.
5. [x] **A11y & Wrapper**: Správné použití `aria-valuemin`, `aria-valuemax`, `TsFormField` wrapperu a indikace chyb.
6. [x] **Regression Tests**: Testy ověřující zaokrouhlování, formátování a chování při nevalidním vstupu.

## Tasks / Subtasks

- [x] Implementovat `roundTo` logiku v `TsNumber` widgetu (AC: #1)
- [x] Integrovat českou lokalizaci pro zobrazení a parsování (AC: #2)
- [x] Implementovat mechanismus pro zachování pozice kurzoru (AC: #3)
- [x] Přidat podporu pro vnořené cesty dat (AC: #4)
- [x] Upravit a11y atributy pro číselná pole (AC: #5)
- [x] Doplnit regresní testy pro různé scénáře zaokrouhlování a lokalizace (AC: #6)

## Dev Notes

- **Lessons from Retro**: "Nested data" je rizikové při změně typu (string vs number) v hlubokých strukturách.
- **Tailwind v4**: Zajistit, aby styling pro `readonly` byl konzistentní s ostatními widgety.
- **Implementation Detail**: Použít `Intl.NumberFormat` pro lokalizované formátování, ale vnitřně pracovat s čistým `number` typem.

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Enhanced Number widget with roundTo support and Czech localization.
- Implemented cursor position preservation logic.
- Added regression tests for rounding and localization.
- Review fix: added missing regression test file reference to File List.

### File List

- src/components/ts-web-ui/ts-form/widgets/number-widget.tsx
- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/stories-3-2.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
