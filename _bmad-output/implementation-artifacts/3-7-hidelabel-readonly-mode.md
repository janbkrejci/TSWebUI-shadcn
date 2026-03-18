# Story 3.7: Rozšířené zobrazení: Skrytí popisku (hideLabel) a readonly režim pole

Status: done

## Story

Jako vývojář chci mít plnou kontrolu nad vizibilitou popisků a editačním stavem jednotlivých polí,
abych mohl lépe strukturovat složité formuláře a zobrazení dat.

## Acceptance Criteria

1. [x] **HideLabel Support**: Parametr `hideLabel: true` skryje text popisku, ale zachová zarovnání a mřížkový prostor v gridu.
2. [x] **Readonly Mode**: Parametr `readonly: true` přepne pole do režimu pouze pro čtení (vizuálně odlišné od disabled, text lze kopírovat, ale ne měnit).
3. [x] **Cross-widget Consistency**: Readonly režim je implementován konzistentně napříč všemi widgety (text, select, date, atd.).
4. [x] **Layout Integrity**: Skrytí labelu nezpůsobuje layout shift ani rozpad gridu.
5. [x] **A11y**: Pole v readonly režimu má správné ARIA atributy (`aria-readonly="true"`). Skrytý label je stále dostupný pro čtečky přes `aria-label` nebo vizuálně skrytý element.
6. [x] **Regression Tests**: Testy ověřující renderování bez labelu a funkčnost readonly zámku.

## Tasks / Subtasks

- [x] Implementovat `hideLabel` logiku v `TsFormField` wrapperu (AC: #1)
- [x] Definovat a implementovat standardní vizuální styl pro `readonly` widgety v Tailwind v4 (AC: #2)
- [x] Upravit všechny widgety pro podporu `readonly` stavu (AC: #3)
- [x] Zajistit a11y přístupnost pro skryté labely a readonly pole (AC: #5)
- [x] Ověřit chování mřížkového systému při hideLabel (AC: #4)
- [x] Přidat regresní testy (AC: #6)

## Dev Notes

- **Lessons from Retro**: Readonly pole musí mít jasný vizuální kontrakt, aby se nepletly s disabled poli (která jsou často zašedlá a nepřístupná pro focus).
- **Tailwind v4**: Použít standardní utility pro readonly inputy.
- **Shared Standard**: `TsFormField` je klíčovým místem pro implementaci `hideLabel` i propisování `readonly` stavu.

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Full implementation of hideLabel and readonly modes.
- Ensured layout stability in CSS grid when labels are hidden.
- Applied consistent Tailwind v4 styling for readonly states.
- Post-review: aligned widget prop contract to `readOnly` and added missing readonly a11y coverage for text/number widgets.

### File List

- src/components/ts-web-ui/ts-form/ts-form-field.tsx
- src/components/ts-web-ui/ts-form/widgets/text-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/number-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/date-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/slider-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/radio-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/switch-widget.tsx
- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/stories-3-7.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
