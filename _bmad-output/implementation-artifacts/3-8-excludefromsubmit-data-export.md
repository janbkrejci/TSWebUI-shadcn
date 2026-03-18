# Story 3.8: Řízení datového exportu pomocí excludeFromSubmit

Status: done

## Story

Jako vývojář chci mít možnost vyloučit konkrétní pole z výsledných dat formuláře,
abych mohl ve formuláři mít pole sloužící jen jako pomocná, informativní nebo dočasná.

## Acceptance Criteria

1. [x] **ExcludeFromSubmit Support**: Pole označené v JSONu parametrem `excludeFromSubmit: true` není zahrnuto ve výsledných datech `onAction` ani `onFieldChange`.
2. [x] **State Integrity**: Hodnota pole je stále spravována v rámci vnitřního stavu formuláře (kvůli interakcím a logice), ale je odfiltrována při exportu.
3. [x] **Cross-widget Consistency**: Funkčnost funguje pro všechny typy polí (text, select, button, atd.).
4. [x] **Recursive Filtering**: Filtrace funguje i pro vnořená pole (nested paths), kde se pole s `excludeFromSubmit` odstraní ze správné úrovně objektu.
5. [x] **No Visual Impact**: Parametr `excludeFromSubmit` nemá vliv na vizuální zobrazení pole, pokud to není explicitně vyžadováno.
6. [x] **Regression Tests**: Testy ověřující filtraci hodnot při odesílání formuláře (submit) a při změnách polí.

## Tasks / Subtasks

- [x] Upravit logiku exportu dat v `index.tsx` a utilitách pro `TsForm` (AC: #1)
- [x] Implementovat hloubkovou filtraci pro vnořené struktury (AC: #4)
- [x] Integrovat filtraci do `onAction` a `onFieldChange` callbacků (AC: #1)
- [x] Ověřit, že vnitřní stav formuláře zůstává úplný (AC: #2)
- [x] Přidat regresní testy pro různé úrovně hloubky a typy polí (AC: #6)

## Dev Notes

- **Lessons from Retro**: Pozor na synchronizaci se stavem v `react-hook-form`. Filtrace by měla probíhat těsně před voláním externích callbacků.
- **Implementation Detail**: Použít pomocnou funkci pro rekurentní průchod a čištění datového objektu na základě definice polí.

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Developed recursive filtering logic to exclude specific fields from form submission.
- Maintained full internal form state for interactivity.
- Integrated filtering into onAction and onFieldChange callbacks.
- Review fix: added missing regression test file reference to File List.

### File List

- src/components/ts-web-ui/ts-form/index.tsx
- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/stories-3-8.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
