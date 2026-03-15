# Story 1.6: Sjednocené callbacky a filtrace excludeFromSubmit

Status: done

## Story

As a **integrátor**,
I want **komunikovat s formulářem přes jednotné API a neřešit pomocná pole v datech**,
so that **integrace do aplikace byla jednoduchá a data byla vždy čistá**.

## Acceptance Criteria

1. [x] Všechny akce tlačítek (submit, cancel, custom) volají jednotný callback `onAction(action: string, data: Record<string, unknown>)`.
2. [x] Callback `onFieldChange(field: string, value: unknown, formData: Record<string, unknown>)` je korektně volán při každé změně pole.
3. [x] Pole, která mají v definici `excludeFromSubmit: true`, jsou automaticky odfiltrována z dat předávaných v `onAction` i `onFieldChange`.
4. [x] Pokud tlačítko vyžaduje potvrzení (`confirmation` v JSONu), `onAction` se zavolá až po potvrzení uživatelem.
5. [x] Staré callbacky (např. `onSubmit`) jsou odstraněny nebo označeny jako deprecated (preferováno: odstraněny v rámci v1.0).

## Tasks / Subtasks

- [x] **Implementace filtrace dat** (AC: 3)
  - [x] Vytvořit utilitu pro čištění dat na základě `TsFieldDef` a property `excludeFromSubmit`.
  - [x] Aplikovat tuto utilitu v místě, kde se připravují data pro callbacky.
- [x] **Refaktoring onAction** (AC: 1, 4, 5)
  - [x] Upravit `index.tsx` tak, aby zpracovával všechny button akce přes `onAction`.
  - [x] Implementovat logiku pro `confirmation` dialogy před voláním `onAction`.
- [x] **Implementace onFieldChange** (AC: 2)
  - [x] Zajistit volání `onFieldChange` z `useForm` nebo z jednotlivých widgetů (přes dispatcher).
  - [x] Ověřit, že `formData` v tomto callbacku jsou rovněž vyčištěna od `excludeFromSubmit` polí.
- [x] **Verifikace a cleanup** (AC: 5)
  - [x] Aktualizovat demo stránky tak, aby používaly nové API.
  - [x] Odstranit nepoužívané props a logiku.

## Dev Notes

### Architektonické mantáty

- **Unified Communication:** Vše ven z formuláře jde přes `onAction` nebo `onFieldChange`.
- **Data Cleanliness:** Integrátor nikdy nesmí dostat "technická" pole (pomocné výpočty, oddělovače), která jsou označena k vyloučení.
- **Confirmation Logic:** Použijte Shadcn/UI `AlertDialog` pro potvrzovací dialogy tlačítek.

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/index.tsx`
- `src/components/ts-web-ui/ts-form/utils.ts` (Utility pro filtraci)
- `src/components/ts-web-ui/ts-form/types.ts` (Aktualizace interface)

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md#Functional Requirements: Interakce a eventy]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.6]

## Dev Agent Record

Status: done

## Story

...

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Data filtering and unified callback strategy aligned with API consistency mandates.
- Implemented `filterExcludeFromSubmit` utility in `utils.ts` with support for nested and array paths.
- FIXED CRITICAL BUG: `filterExcludeFromSubmit` now correctly handles nested properties within arrays without deleting the entire array element.
- Refactored `TsForm` to use `onAction` for all button actions (including reset).
- Integrated data filtering in `onAction` and `onFieldChange`.
- Verified all tests pass, including complex nested array exclusion scenarios.
- Updated demo page with an example of an excluded field.
