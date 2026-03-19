# Story 4.1: Prejmenovani technickeho klice pole (Rename Field ID)

Status: done

## Story

Jako uzivatel chci v editoru zmenit technicky nazev pole (klic) automaticky vsude,
abych nemusel rucne opravovat layout a konfiguraci po premenovani pole.

## Acceptance Criteria

1. [x] Zmena `fieldKey` se automaticky promitne do objektu `fields`.
2. [x] Zmena `fieldKey` se automaticky promitne do `layout` struktury.
3. [x] Operace je bezpecna i pri vice tabech/rdcich a neztrati konfiguraci widgetu.
4. [x] Pri pokusu o prepis na existujici klic editor vrati validacni chybu a zmenu neprovede.
5. [x] Existuji regresni testy pro rename flow vcetne edge cases.

## Tasks / Subtasks

- [x] Implementovat rename operaci ve store (`fields` + `layout`) (AC: #1, #2)
- [x] Pridat ochranu proti duplicitnimu klici (AC: #4)
- [x] Osetrit nested/tab layout scenare (AC: #3)
- [x] Dopsat regresni testy (AC: #5)
- [x] Aktualizovat changelog a file list v Dev Agent Record

## Dev Notes

- Vychazet z konvenci TsFormEditor store operaci (undo/redo kompatibilita).
- Rename musi byt atomicky, aby nikdy nevznikl mezistav s nekonzistentnim layoutem.

## Dev Agent Record

### Agent Model Used

- GPT-5.4

### Debug Log References

- Targeted validation: `pnpm test src/components/ts-web-ui/ts-form-editor/store.test.ts`
- Changed file lint: `pnpm lint src/components/ts-web-ui/ts-form-editor/form-editor.tsx src/components/ts-web-ui/ts-form-editor/store.ts src/components/ts-web-ui/ts-form-editor/store.test.ts`

### Completion Notes List

- Added atomic `renameField(oldName, newName)` action to the TsFormEditor store.
- Updated the editor properties panel so Field ID can be edited and validated in-place.
- Added regression tests for success, duplicate key rejection, multi-tab propagation, and history compatibility.
- Kept the change compatible with the existing editor history model; undo is covered, while broader redo semantics remain store-wide behavior.

### File List

- src/components/ts-web-ui/ts-form-editor/store.ts
- src/components/ts-web-ui/ts-form-editor/form-editor.tsx
- src/components/ts-web-ui/ts-form-editor/store.test.ts
