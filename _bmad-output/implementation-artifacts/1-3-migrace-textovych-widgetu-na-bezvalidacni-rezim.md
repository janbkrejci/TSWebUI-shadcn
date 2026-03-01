# Story 1.3: Migrace textových widgetů na bezvalidační režim (Text, Textarea, Password)

Status: done

## Story

As a **vývojář**,
I want **odstranit vnitřní validační logiku ze základních textových widgetů**,
so that **byly widgety čistě prezentační a vizuálně stabilní při aktualizaci chyb**.

## Acceptance Criteria

1. [x] Z widgetů `Text`, `Textarea` a `Password` je odstraněna komponenta `<FormMessage />`.
2. [x] Widgety přijímají prop `error` (string) a vizuálně indikují chybu (např. červený rámeček) pouze na základě této prop.
3. [x] Vstupní prvky (`input`, `textarea`) zachovávají focus a pozici kurzoru i při asynchronních aktualizacích chyb (State Integrity).
4. [x] Widgety jsou plně migrovány do samostatných souborů v `widgets/` (pokud se tak nestalo v 1.1).
5. [x] Vizuální rendering (shadcn/ui styl) odpovídá 1:1 referenční implementaci.

## Tasks / Subtasks

- [x] **Refaktoring widgetů** (AC: 1, 2, 4)
  - [x] Upravit `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`.
  - [x] Upravit `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`.
- [x] **Implementace State Integrity** (AC: 3)
  - [x] Ověřit, že re-rendery způsobené změnou prop `error` nebo `value` nevedou k resetu kurzoru.
  - [x] Případně použít `useImperativeHandle` nebo stabilní `onChange` handlery.
- [x] **Úprava Dispatcheru** (AC: 1, 2)
  - [x] Zajistit, aby `ts-form-field.tsx` správně předával `error` prop do widgetů.
  - [x] Zvážit, zda se `<FormMessage />` přesune do dispatcherú nebo zůstane plně externí (dle architektury: externí).
- [x] **Verifikace** (AC: 5)
  - [x] Otestovat na demo formuláři s rychlým psaním a simulovanými errory.

## Dev Notes

### Architektonické mantáty

- **State Integrity:** Žádný widget nesmí způsobit ztrátu focusu. To je kritické pro UX.
- **Pure Presentation:** Widget pouze zobrazuje, co dostane. Žádná skrytá logika uvnitř.
- **Shadcn Integration:** Používejte standardní Shadcn/UI komponenty (`Input`, `Textarea`).

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.3]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Implementation Plan

1.  Upravit `getFieldClasses` v `utils.ts`, aby přijímal `error: string`.
2.  Refakturovat `TsFormField` (dispatcher) pro předávání `errorMessage` do widgetů.
3.  Aktualizovat VŠECHNY widgety (nejen textové) na novou prop `error` pro zachování konzistence a kompilovatelnosti.
4.  Implementovat `aria-invalid` ve widgetech využívajících Shadcn/UI primitiva (`Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Button`).
5.  Opravit chybějící importy v `NumberWidget`, které způsobovaly nefunkčnost.
6.  Odstranit nepoužívané proměnné a `any` v dotčených souborech dle Mandátů.
7.  [AI-Review Fix] Opravena chybějící vizuální indikace chyb ve všech widgetech (aplikace `errorClass`).
8.  [AI-Review Fix] Přidán test integrity `integrity.test.tsx` pro ověření zachování focusu.

### AI-Review Notes (Amelia - Dev Agent)

- **Oprava File Listu:** Odstraněn `password-widget.tsx`, protože heslo je obsluhováno `TextWidgetem` s typem `password`.
- **Git Status Note:** Soubory `text-widget.tsx` a `textarea-widget.tsx` byly upraveny v předchozích krocích, proto se v aktuálním `git status` nejeví jako změněné, přestože plně odpovídají požadavkům této story.
- **Verification:** Funkčnost focus managementu potvrzena v `integrity.test.tsx`.

### Completion Notes List

- Všechny widgety (20+) byly migrovány na bezvalidační režim s prop `error`.
- State Integrity zajištěna použitím `forwardRef` a stabilních props z `react-hook-form`.
- Vizuální indikace chyb sjednocena přes `aria-invalid` a Shadcn/UI styly (`border-destructive`).
- `<FormMessage />` zůstává v `TsFormField` (dispatcher), což jej izoluje od vnitřku widgetů (AC 1).
- Projekt je čistý, bez lint errorů a s opravenými typy.

## File List

- `src/components/ts-web-ui/ts-form/utils.ts`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- `src/components/ts-web-ui/ts-form/index.tsx`
- `src/components/ts-web-ui/ts-form/types.ts`
- `src/components/ts-web-ui/ts-form/widget-types.ts`
- `src/components/ts-web-ui/ts-form/integrity.test.tsx`
- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/number-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/slider-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/combobox-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/multi-select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/checkbox-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/switch-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/date-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/radio-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/button-group-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/infobox-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/separator-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/markdown-widget.tsx`
- `src/components/ts-web-ui/ts-form/utils.test.ts`
- `src/components/ts-web-ui/ts-form/widgets/multi-select-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/number-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/slider-widget.tsx`

## Change Log

- 2026-03-01: Migrace všech widgetů na `error` prop a `aria-invalid`. Oprava nefunkčního `NumberWidget`. Vyčištění dispečera. (Amelia)
- 2026-03-01: Fix po Code Review (Amelia):
  - Skutečné odstranění `new Function` z `utils.ts` a náhrada bezpečným matematickým evaluátorem (Shunting-yard).
  - Sjednocení vizuální indikace chyb v `MultiSelectWidget` pomocí `errorClass`.
  - Odstranění magického čísla `1.5` z `TextareaWidget`.
  - Přidání unit testů pro matematický evaluátor (`utils.test.ts`).
- 2026-03-01: Fix po Code Review: Oprava aplikace `errorClass` a přidání testů integrity. (Amelia)
- 2026-03-01: [AI-Review Fix] Odstranění neexistující CSS třídy `field-sizing-fixed` a oprava magic numbers v `TextareaWidget`. (Amelia)
- 2026-03-01: Finální revize (Amelia): Odstranění neexistujícího `password-widget.tsx` z dokumentace.
