# Story 1.3: Migrace textových widgetů na bezvalidační režim (Text, Textarea, Password)

Status: ready-for-dev

## Story

As a **vývojář**,
I want **odstranit vnitřní validační logiku ze základních textových widgetů**,
so that **byly widgety čistě prezentační a vizuálně stabilní při aktualizaci chyb**.

## Acceptance Criteria

1. [ ] Z widgetů `Text`, `Textarea` a `Password` je odstraněna komponenta `<FormMessage />`.
2. [ ] Widgety přijímají prop `error` (string) a vizuálně indikují chybu (např. červený rámeček) pouze na základě této prop.
3. [ ] Vstupní prvky (`input`, `textarea`) zachovávají focus a pozici kurzoru i při asynchronních aktualizacích chyb (State Integrity).
4. [ ] Widgety jsou plně migrovány do samostatných souborů v `widgets/` (pokud se tak nestalo v 1.1).
5. [ ] Vizuální rendering (shadcn/ui styl) odpovídá 1:1 referenční implementaci.

## Tasks / Subtasks

- [ ] **Refaktoring widgetů** (AC: 1, 2, 4)
  - [ ] Upravit `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`.
  - [ ] Upravit `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`.
  - [ ] Upravit `src/components/ts-web-ui/ts-form/widgets/password-widget.tsx`.
- [ ] **Implementace State Integrity** (AC: 3)
  - [ ] Ověřit, že re-rendery způsobené změnou prop `error` nebo `value` nevedou k resetu kurzoru.
  - [ ] Případně použít `useImperativeHandle` nebo stabilní `onChange` handlery.
- [ ] **Úprava Dispatcheru** (AC: 1, 2)
  - [ ] Zajistit, aby `ts-form-field.tsx` správně předával `error` prop do widgetů.
  - [ ] Zvážit, zda se `<FormMessage />` přesune do dispatcherú nebo zůstane plně externí (dle architektury: externí).
- [ ] **Verifikace** (AC: 5)
  - [ ] Otestovat na demo formuláři s rychlým psaním a simulovanými errory.

## Dev Notes

### Architektonické mantáty

- **State Integrity:** Žádný widget nesmí způsobit ztrátu focusu. To je kritické pro UX.
- **Pure Presentation:** Widget pouze zobrazuje, co dostane. Žádná skrytá logika uvnitř.
- **Shadcn Integration:** Používejte standardní Shadcn/UI komponenty (`Input`, `Textarea`).

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/password-widget.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.3]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- State Integrity focus established as a priority for text input widgets.
