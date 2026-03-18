# Story 3.4: Podpora pre-existing souborů ve File widgetu

Status: done

## Story

Jako vývojář chci mít možnost inicializovat File widget seznamem již existujících souborů,
aby uživatel mohl vidět a spravovat soubory nahrané v minulosti.

## Acceptance Criteria

1. [x] **Pre-existing File Support**: Widget při načtení správně zobrazí seznam souborů předaných přes `value` nebo `defaultValue`.
2. [x] **File List Rendering**: Soubory jsou zobrazeny s názvem, velikostí a ikonou typu souboru.
3. [x] **Action Consistency**: Akce (např. odebrání existujícího souboru) se propisují do `onFieldChange` a `onAction` jako změna v poli souborů.
4. [x] **State Integrity**: Widget udržuje konzistentní seznam souborů (stávající + nově přidané) po celou dobu životního cyklu formuláře.
5. [x] **Shared Wrapper**: Widget používá `TsFormField` pro label, hint a error rendering.
6. [x] **Regression Tests**: Testy pro inicializaci s daty, přidávání nových souborů a mazání stávajících.

## Tasks / Subtasks

- [x] Upravit `TsFile` widget pro zpracování vstupních dat (AC: #1)
- [x] Vytvořit komponentu pro výpis seznamu souborů (AC: #2)
- [x] Implementovat logiku odebrání souboru (včetně těch z `value`) (AC: #3)
- [x] Integrovat `onFieldChange` pro odesílání kompletního seznamu (AC: #3)
- [x] Ověřit behaviorální stabilitu pro vnořené cesty v datech (AC: #4)
- [x] Přidat testy pro různé stavy (prázdné, s daty, mix) (AC: #6)

## Dev Notes

- **Lessons from Retro**: File widget je náchylný k problémům při re-renderu. Je nutné zajistit, aby `onBlur` a `onFieldChange` správně synchronizovaly s vnější validací bez ztráty souborů z vnitřního stavu.
- **Implementation Detail**: Rozlišovat mezi soubory v lokálním stavu (FileList/File object) a soubory z DB (URL/ID/Metadata).

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Added support for pre-existing files in File widget.
- Implemented file list rendering and consistent removal logic.
- Verified integration with TsFormField and global state.
- Post-review: file add/remove now dispatches form action events so changes propagate to `onAction`.

### File List

- src/components/ts-web-ui/ts-form/widgets/file-widget.tsx
- src/components/ts-web-ui/ts-form/stories-3-4.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
