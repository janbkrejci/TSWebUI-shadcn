# Story 3.1: Implementace Smart Parsing pro Date a Datetime

Status: done

## Story

Jako uživatel chci v komponentách Date a Datetime zadávat datum zkráceně,
aby práce s formulářem byla rychlejší a pohodlnější.

## Acceptance Criteria

1. [x] **Smart Parsing (onBlur)**: Zadaný text (např. "2503", "25.3") je po ztrátě focusu (onBlur) automaticky doplněn na validní datum (např. 25.03.2026 pro aktuální rok).
2. [x] **State Integrity**: Widgety zachovávají focus a vnitřní stav i během parsování a následného re-renderu.
3. [x] **Nested Path Support**: Funkčnost je ověřena i pro vnořená data (např. `metadata.createdAt`).
4. [x] **Shared Wrapper Contract**: Widget používá `TsFormField` a správně propisuje `error`, `readonly` a `label` stavy.
5. [x] **Accessibility**: Parsovaný výsledek je srozumitelně oznámen (např. přes `aria-live` nebo jasnou vizuální změnu hodnoty v inputu).
6. [x] **Regression Tests**: Existují Vitest testy pokrývající různé formáty vstupu a stabilitu stavu.

## Tasks / Subtasks

- [x] Vytvořit/upravit parsovací utilitu pro chytré doplňování data (AC: #1)
- [x] Implementovat `onBlur` handler v `TsDate` a `TsDatetime` widgetech (AC: #1, #2)
- [x] Integrovat parsování s `onFieldChange` callbackem (AC: #1)
- [x] Ověřit zachování focusu a prevenci nežádoucích re-renderů (AC: #2)
- [x] Přidat regresní testy pro různé vstupy (AC: #6)
- [x] Prověřit a11y atributy a chování při chybě parsování (AC: #4, #5)

## Dev Notes

- **Lessons from Retro**: Pozor na "nested path" logiku - každá změna hodnoty musí používat správnou hloubkovou cestu.
- **Tailwind v4**: Použít standardní utility pro styling inputu v readonly režimu.
- **Reference**: Původní implementace parsování v `reference-tswebui` (v `ts-form-date.js`).

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Implemented smart date parsing logic in utils.
- Added onBlur handlers for Date and Datetime widgets.
- Verified state integrity and focus management.
- Added comprehensive regression tests in stories-3-1.test.tsx.

### File List

- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/widgets/date-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx
- src/components/ts-web-ui/ts-form/stories-3-1.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
