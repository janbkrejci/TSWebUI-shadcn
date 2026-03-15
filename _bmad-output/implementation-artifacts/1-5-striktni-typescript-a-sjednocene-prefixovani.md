# Story 1.5: Striktní TypeScript a sjednocené prefixování (Ts prefix)

Status: done

## Story

As a **vývojář**,
I want **100% typovou bezpečnost a sjednocené pojmenování typů**,
so that **mi IDE poskytovalo přesné napovídání a kód byl odolný proti chybám při refactoringu**.

## Acceptance Criteria

1. [x] Všechny globální TypeScript interfaces a typy v `src/components/ts-web-ui/ts-form/types.ts` začínají prefixem `Ts` (např. `TsFormDef`, `TsFieldDef`, `TsLayout`, `TsButton`).
2. [x] V celém adresáři `ts-form/` nejsou použity žádné `any` typy.
3. [x] Nejsou použity žádné casty typu `as unknown as` nebo `as any`. Pokud je cast nutný, musí být vysvětlen nebo nahrazen korektním narrowingem.
4. [x] Všechny exportované interfaces mají základní JSDoc dokumentaci vysvětlující jejich účel a klíčové vlastnosti.
5. [x] Widgety používají své specifické narrowed props (např. `TsTextWidgetProps`) namísto generických props.

## Tasks / Subtasks

- [x] **Audit a přejmenování v types.ts** (AC: 1, 4)
  - [x] Přejmenovat existující typy na varianty s `Ts` prefixem.
  - [x] Doplnit JSDoc k hlavním rozhraním.
- [x] **Refaktoring codebase** (AC: 1, 2, 3)
  - [x] Aktualizovat importy a usage v `index.tsx`, `ts-form-field.tsx` a `ts-form-layout.tsx`.
  - [x] Aktualizovat všechny soubory ve `widgets/` na nové názvy typů.
- [x] **Eliminace 'any' a castů** (AC: 2, 3)
  - [x] Vyhledat `any` v adresáři `ts-form/` a nahradit je korektními typy.
  - [x] Nahradit nebezpečné casty bezpečným narrowingem.
- [x] **Verifikace** (AC: 5)
  - [x] Ověřit, že `pnpm tsc` (nebo ekvivalentní type-check) nehlásí žádné chyby v adresáři komponenty.

## Dev Notes

### Architektonické mantáty

- **Naming Convention:** Striktní dodržování `Ts` prefixu pro vše, co je "veřejné" v rámci modulu.
- **Zero Any Policy:** Jakékoliv `any` je považováno za chybu v implementaci.
- **IDE DX:** Cílem je, aby vývojář při psaní JSONu viděl přesně, co která property dělá.

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/types.ts`
- `src/components/ts-web-ui/ts-form/index.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- `src/components/ts-web-ui/ts-form/widgets/*.tsx`

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Naming Patterns]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.5]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Type safety and prefixing standards aligned with "Zero Any Policy" mandate.
