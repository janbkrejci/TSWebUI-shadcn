# Story 3.0: Stabilizace Widget Contractu (TsFormField & Readonly)

Status: done

## Story

Jako vývojář chci mít jasně definovaný a stabilní kontrakt mezi `TsFormField` a jednotlivými widgety,
včetně podpory pro `readonly` a `hideLabel`, aby byla zajištěna vizuální a funkční konzistence celého systému.

## Acceptance Criteria

1. [x] **Readonly Support in Wrapper**: `TsFormField` propisuje parametr `readonly` do všech widgetů.
2. [x] **HideLabel Support**: Parametr `hideLabel` v `TsFormField` skryje label, ale zachová `min-h-14` slot pro zachování mřížkového zarovnání.
3. [x] **Standardized Props**: Všechny widgety přijímají sjednocenou sadu props (field, error, hint, readonly, disabled) přes `commonProps`.
4. [x] **A11y Labeling**: I při `hideLabel: true` je zajištěno, že input má přístupný název (např. přes `aria-label` odvozený z původního labelu).
5. [x] **Tailwind v4 Consistency**: Vizuální styl pro `readonly` (např. border-transparent, bg-muted/30, cursor-default) je definován na úrovni wrapperu nebo sdílených utilit.
6. [x] **Regression Tests**: Testy ověřující správné propisování stavů z wrapperu do náhodně vybraných widgetů.

## Tasks / Subtasks

- [x] Upravit `TsFormField` pro podporu `hideLabel` a `readonly` (AC: #1, #2)
- [x] Aktualizovat `renderWidget` a `commonProps` pro propisování `readonly` (AC: #3)
- [x] Definovat sdílený Tailwind v4 styl pro `readonly` režim (AC: #5)
- [x] Implementovat `aria-label` fallback v `TsFormField` pro skryté labely (AC: #4)
- [x] Ověřit, že `min-h-14` a `min-h-8` sloty zůstávají stabilní i při extrémních konfiguracích (AC: #2)
- [x] Přidat regresní testy pro nový kontrakt (AC: #6)

## Dev Notes

- **Kritická cesta**: Tato story musí být dokončena jako první, protože definuje standard, který budou využívat všechny ostatní stories v Epic 3.
- **Lessons from Retro**: "Wrapper contract" je klíčem k tomu, abychom nemuseli v každém widgetu znovu řešit alignment a error sloty.

## Dev Agent Record

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

### Completion Notes List

- Established a stable contract between TsFormField and widgets.
- Supported readonly and hideLabel modes with consistent Tailwind v4 styling.
- Verified accessibility with aria-labels for hidden labels.
- Post-review: unified `readOnly` prop contract across widgets that previously used `readonly`.

### File List

- src/components/ts-web-ui/ts-form/ts-form-field.tsx
- src/components/ts-web-ui/ts-form/types.ts
- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/widgets/text-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/date-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/slider-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/radio-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/switch-widget.tsx
- src/components/ts-web-ui/ts-form/stories-3-0.test.tsx

## Senior Developer Review (AI)

Datum: 2026-03-18
Reviewer: GitHub Copilot (GPT-5.3-Codex)
Verdikt: Approved

### Shrnuti

- Acceptance Criteria byla overena proti implementaci a testum.
- Nebyly nalezeny otevrene HIGH/MEDIUM defekty v kodu.
- Story zustava ve stavu done.
