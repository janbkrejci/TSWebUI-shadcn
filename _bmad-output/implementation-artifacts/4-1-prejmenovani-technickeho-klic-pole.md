# Story 4.1: Prejmenovani technickeho klice pole (Rename Field ID)

Status: ready-for-dev

## Story

Jako uzivatel chci v editoru zmenit technicky nazev pole (klic) automaticky vsude,
abych nemusel rucne opravovat layout a konfiguraci po premenovani pole.

## Acceptance Criteria

1. [ ] Zmena `fieldKey` se automaticky promitne do objektu `fields`.
2. [ ] Zmena `fieldKey` se automaticky promitne do `layout` struktury.
3. [ ] Operace je bezpecna i pri vice tabech/rdcich a neztrati konfiguraci widgetu.
4. [ ] Pri pokusu o prepis na existujici klic editor vrati validacni chybu a zmenu neprovede.
5. [ ] Existuji regresni testy pro rename flow vcetne edge cases.

## Tasks / Subtasks

- [ ] Implementovat rename operaci ve store (`fields` + `layout`) (AC: #1, #2)
- [ ] Pridat ochranu proti duplicitnimu klici (AC: #4)
- [ ] Osetrit nested/tab layout scenare (AC: #3)
- [ ] Dopsat regresni testy (AC: #5)
- [ ] Aktualizovat changelog a file list v Dev Agent Record

## Dev Notes

- Vychazet z konvenci TsFormEditor store operaci (undo/redo kompatibilita).
- Rename musi byt atomicky, aby nikdy nevznikl mezistav s nekonzistentnim layoutem.

## Dev Agent Record

### Agent Model Used

- TBD

### Debug Log References

- TBD

### Completion Notes List

- TBD

### File List

- TBD
