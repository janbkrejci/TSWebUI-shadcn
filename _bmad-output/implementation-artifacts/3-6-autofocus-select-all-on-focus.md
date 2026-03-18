# Story 3.6: Implementace autofocus a automatického výběru textu (selectAllOnFocus)

Status: done

## Story

Jako vývojář chci mít možnost automaticky zaměřit pole nebo vybrat celý text při získání focusu,
abych zlepšil uživatelskou přívětivost a efektivitu zadávání dat.

## Acceptance Criteria

1. [x] **Autofocus Support**: Pole s parametrem `autofocus: true` se po vykreslení formuláře (nebo jeho části/záložky) automaticky zaměří.
2. [x] **SelectAllOnFocus Support**: Pole s parametrem `selectAllOnFocus: true` při získání focusu automaticky vybere celý svůj obsah.
3. [x] **Cross-widget Compatibility**: Funkčnost je dostupná pro textové, číselné i date/datetime inputy.
4. [x] **State Integrity**: Automatický focus/výběr nenarušuje vnitřní stav pole ani jeho validaci.
5. [x] **A11y**: Automatický focus je použit s rozmyslem, aby neblokoval navigaci čteček obrazovky (zachování `aria-describedby` atd.).
6. [x] **Regression Tests**: Testy ověřující zaměření pole při mountu a výběr textu při eventu `focus`.

## Tasks / Subtasks

- [x] Přidat podporu pro `autofocus` do `TsFormField` nebo jednotlivých widgetů (AC: #1)
- [x] Implementovat `selectAllOnFocus` logiku v textových a číselných polích (AC: #2)
- [x] Otestovat interakci s různými prohlížeči (behaviorální odlišnosti focusu) (AC: #3)
- [x] Ověřit kompatibilitu s `onFocus` a `onBlur` callbacky (AC: #4)
- [x] Doplnit a11y kontrolu (AC: #5)
- [x] Přidat regresní testy (AC: #6)

## Dev Notes

- **Lessons from Retro**: Pozor na "nested data" a `activeTab` - `autofocus` by měl fungovat i při přepnutí záložky, pokud je na ní pole označeno.
- **Implementation Detail**: Použít `useRef` a `useEffect` pro správné načasování focusu po vykreslení.

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Implemented autofocus and selectAllOnFocus across text, number, and date widgets.
- Used useRef and useEffect for reliable focus management.
- Verified interaction with onFocus/onBlur callbacks.
- Review fix: added missing regression test file reference to File List.

### File List

- src/components/ts-web-ui/ts-form/widgets/text-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/number-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/date-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx
- src/components/ts-web-ui/ts-form/types.ts
- src/components/ts-web-ui/ts-form/stories-3-6.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
