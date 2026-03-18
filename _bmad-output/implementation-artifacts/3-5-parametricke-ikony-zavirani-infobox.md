# Story 3.5: Parametrické ikony a zavírání v Infoboxu

Status: done

## Story

Jako integrátor chci v Infoboxu ovládat ikonu a možnost zavření pole pomocí parametrů,
abych mohl lépe reagovat na potřeby a preference uživatele.

## Acceptance Criteria

1. [x] **Icon Support**: Infobox zobrazuje ikonu (Lucide) podle parametru v JSON konfiguraci.
2. [x] **Closable Infobox**: Podpora parametru `closable: true`, který přidá zavírací křížek.
3. [x] **Visibility State**: Zavřený Infobox zůstává skrytý po dobu aktuální relace (nebo podle implementace stavu).
4. [x] **Layout Integration**: Infobox správně zabírá místo v gridu a jeho skrytí nezanechává prázdnou řadu (pokud je to jediný prvek).
5. [x] **A11y**: Zavírací tlačítko má `aria-label` a infobox má správnou ARIA roli (`alert` nebo `status`).
6. [x] **Regression Tests**: Testy ověřující zobrazení ikony a funkčnost zavírání.

## Tasks / Subtasks

- [x] Přidat podporu pro `icon` v `TsInfobox` widgetu (AC: #1)
- [x] Implementovat `closable` parametr a UI tlačítko (AC: #2)
- [x] Správa vnitřního stavu viditelnosti (AC: #3)
- [x] Ověřit chování layoutu při skrytí (AC: #4)
- [x] Doplnit ARIA atributy (AC: #5)
- [x] Přidat regresní testy (AC: #6)

## Dev Notes

- **Tailwind v4**: Použít standardní utility pro barvy pozadí podle typu infoboxu (info, warning, error).
- **Lessons from Retro**: Infobox by měl být "pure" - jeho zavření by nemělo mazat data z globálního modelu, jen vizuálně skrýt pole.

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Enabled parametric icons and closable functionality for Infobox widget.
- Managed visibility state internally within the widget.
- Added ARIA roles and labels for accessibility.
- Review fix: added missing regression test file reference to File List.

### File List

- src/components/ts-web-ui/ts-form/widgets/infobox-widget.tsx
- src/components/ts-web-ui/ts-form/stories-3-5.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
