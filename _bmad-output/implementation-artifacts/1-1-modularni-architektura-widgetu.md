# Story 1.1: Modulární architektura widgetů (Widget-per-file)

Status: done

## Story

As a **přispěvatel**,
I want **aby každý widget byl ve vlastním souboru**,
so that **byl kód čitelný, udržitelný a snadno rozšiřitelný**.

## Acceptance Criteria

- [x] Každý typ pole (widget) má samostatný .tsx soubor v `src/components/ts-web-ui/ts-form/widgets/`.
- [x] Soubor `ts-form-field.tsx` slouží pouze jako čistý dispatcher/router (neobsahuje inline renderování widgetů).
- [x] Všechny exporty jsou správně prefixovány (např. `TextWidget`, `SelectWidget`).
- [x] Žádný `any` typ v nových ani upravených souborech (přísný TypeScript).
- [x] Sjednocené rozhraní props pro widgety (field, def, name, hasError).

## Technical Tasks

- [x] Vytvoření složky `widgets/` a přesun existujících widgetů.
- [x] Extrakce `TextWidget` a `TextareaWidget` z `ts-form-field.tsx`.
- [x] Extrakce `SelectWidget`, `CheckboxWidget`, `RadioWidget` atd.
- [x] Refaktoring `TsFormField` pro použití nových komponent.
- [x] Sjednocení props a odstranění `any` v celém modulu.

## File List

- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/number-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/slider-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/multi-select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/combobox-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/checkbox-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/switch-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/radio-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/date-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/button-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/button-group-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/infobox-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/markdown-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/separator-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/empty-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/table-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/file-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/relationship-widget.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- `src/components/ts-web-ui/ts-form/utils.ts`
- `src/components/ts-web-ui/ts-form/widgets.test.tsx`
- `src/components/ts-web-ui/ts-table/index.tsx`
- `vitest.setup.ts`

## Change Log

- 2026-03-04: Code Review Fix (Amelia - Adversarial Reviewer):
  - **CRITICAL**: Oprava `TableWidget` – implementován `onDataChange` v `TsTable` a propojení se stavem formuláře přes `field.onChange`.
  - **HIGH**: Oprava bugu v `MultiSelectWidget` – doplnění `readonlyPointerClass` do `utils.ts`.
  - **HIGH**: Oprava `ComboboxWidget` – implementována vizuální indikace chyby (`errorClass`).
  - **MEDIUM**: Oprava přístupnosti v `DateWidget` a `DateTimeWidget` – doplněny unikátní HTML ID přes `sanitizeId`.
  - **LOW**: Doplněna podpora `readonly` pro `CheckboxWidget` a `SwitchWidget`.
  - Verifikace: Přidán test pro `TableWidget`, všechny testy (7/7) procházejí.
- 2026-03-04: Code Review Fix (Dev Agent):
  - Doplněna inicializace `vitest.setup.ts` pro Shadcn/UI matchery (jest-dom).
  - Synchronizace dokumentace Change Logu.
- 2026-02-28: Druhá vlna oprav po code review (Amelia):
  - **CRITICAL**: Oprava chybějícího importu `cn` v `TableWidget`.
  - **HIGH**: Implementace `sanitizeId` a oprava destrukce props v `SwitchWidget`.
  - **MEDIUM**: Sjednocení pojmenování `multi-select-widget.tsx` a aktualizace importů.
  - Verifikace pomocí Vitest – všechny testy (6/6) procházejí.
- 2026-02-28: Kompletní extrakce widgetů a refaktoring dispatcheru do modulární architektury.
- 2026-02-28: Oprava nálezů z code review (Amelia - Dev Agent):
  - **CRITICAL**: Oprava `TableWidget` – implementována vizuální indikace chyby a sjednocené props.
  - **HIGH**: Oprava sanitizace ID v `CheckboxWidget`, `RadioWidget` a `SwitchWidget` pomocí `sanitizeId` pro podporu zanořených polí.
  - **MEDIUM**: Synchronizace Gitu – přidání `file-widget.tsx`, `relationship-widget.tsx` a `vitest.setup.ts` do File Listu.
  - Synchronizace Gitu: Přidání untracked souborů (widgets/, utils.ts, tests) do repozitáře.
  - Fix: Odstranění nepoužitých proměnných v table-widget.tsx a widgets.test.tsx pro čistý lint.
  - Implementace `forwardRef` ve všech widgetech pro podporu focusu při chybách.
  - Sjednocení props rozhraní napříč všemi widgety.
  - Přejmenování `DatePickerWidget` na `DateWidget` pro konzistenci.
  - Dokumentace a přidání `widgets.test.tsx` do File Listu.
  - Odstranění nepoužitých props a nekonzistentních názvů.
