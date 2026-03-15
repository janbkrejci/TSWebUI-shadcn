# Story 1.2: Odstranění Zod resolveru a schema generátoru z jádra

Status: done

## Story

As a **vývojář**,
I want **odstranit závislost na Zod a vnitřním generátoru schémat**,
so that **byl TsForm čistě prezentační a snadno integrovatelný bez vynucené validační knihovny**.

## Acceptance Criteria

1. [x] Soubor `src/components/ts-web-ui/ts-form/ts-form-schema.ts` je zcela odstraněn z projektu.
2. [x] V souboru `src/components/ts-web-ui/ts-form/index.tsx` je odstraněn import `zodResolver` a jakékoliv reference na `zod`.
3. [x] Hook `useForm` je inicializován bez `resolver` property a bez `mode: "onChange"`.
4. [x] Veškerá validace je plně externí — formulář zobrazuje chyby pouze z prop `errors`.
5. [x] Z `package.json` lze (po ověření, že jej nepoužívá nic jiného v projektu) odstranit `@hookform/resolvers` a `zod` (v rámci této story stačí odstranit usage v TsForm).

## Tasks / Subtasks

- [x] **Odstranění kódu** (AC: 1, 2)
  - [x] Smazat soubor `ts-form-schema.ts`.
  - [x] Odstranit importy `zod` a `zodResolver` z hlavního souboru formuláře.
- [x] **Refaktoring useForm** (AC: 3, 4)
  - [x] Upravit inicializaci `useForm` v `index.tsx`.
  - [x] Zajistit, aby interní stav `react-hook-form` korektně spolupracoval s externí prop `errors`.
- [x] **Cleanup typů** (AC: 2)
  - [x] Odstranit veškeré typy v `types.ts`, které se týkaly generování schémat (pokud existují a jsou již nepoužité).
- [x] **Verifikace demo stránek** (AC: 4)
  - [x] Ověřit, že demo formuláře stále fungují (vykreslují se) i bez vnitřní validace.

## Dev Notes

### Architektonické mantáty

- **Prezentační vrstva:** TsForm nesmí vědět o tom, jak jsou data validována.
- **Data Flow:** Chyby proudí výhradně shora dolů přes `errors: Record<string, string>`.
- **Zero Magic:** Žádné automatické generování schémat za běhu.

### Soubory k úpravě

- `src/components/ts-web-ui/ts-form/index.tsx` (Hlavní logika)
- `src/components/ts-web-ui/ts-form/ts-form-schema.ts` (KE SMAZÁNÍ)
- `src/components/ts-web-ui/ts-form/types.ts` (Úprava typů)
- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx` (Vizuální opravy readonly)
- `src/components/ts-web-ui/ts-form/utils.ts` (Deep path utility)

### Reference

- [Source: _bmad-output/planning-artifacts/architecture.md#Decision: Data Architecture & Validation]
- [Source: _bmad-output/planning-artifacts/prd.md#Success Criteria: Technical Success]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash (BMad SM)

### Completion Notes List

- [2026-02-28] Implementation started by Amelia (Dev Agent).
- [2026-02-28] COMPLETED: Zod and resolvers removed. External validation implemented via `errors` prop merging. `package.json` cleaned up.
- [2026-03-04] ADVERSARIAL CODE REVIEW (Amelia): Identified and FIXED regression where internal `rules` were added to `TsFormField`, violating the "External Validation Only" architecture (AC 4). Removed internal rules, updated tests to match external validation strategy. Confirmed zero internal validation in the form core.
- [2026-03-04] AUTOMATED QUALITY FIXES (BMad dev): Fixed ghost errors by implementing manual error cleanup in synchronization hook. Optimized performance by replacing top-level `watch()` with subscription-based watcher (preventing full form re-renders on keystrokes). Implemented `reset` button logic and fixed static `fieldDef.error` UI behavior. Rebuilt public registry.
- [2026-03-04] ADVERSARIAL CODE REVIEW (Amelia): Identified and fixed critical issues: 1) `deleteNestedKey` now supports array indices (e.g. `items.0.name`), 2) `index.tsx` error sync handles internal ghost errors, 3) Race condition in `NumberWidget` fixed by passing `commitValue` in `form-key-action`.
- [2026-03-04] ADVERSARIAL CODE REVIEW (Amelia): CRITICAL FIXES for nested data integrity: 1) Implemented `getNestedValue`/`setNestedValue` in `utils.ts`, 2) Fixed `onFieldChange` returning undefined for nested paths, 3) Fixed `handleKeyAction` data corruption (flat keys vs deep structure), 4) Added support for deep error objects in `errors` prop. Verified with 18 tests (including 3 new regression tests in `ts-form-robustness.test.tsx`). Status: done
- [2026-03-04] AUTOMATED QUALITY FIXES (Amelia): 1) Updated `TsFormProps.errors` type to `Record<string, unknown>` for deep error support, 2) Optimized `handleKeyAction` to prevent redundant state updates on Enter, 3) Verified precedence of external errors in `TsFormField.tsx`.
- [2026-03-04] ADVERSARIAL CODE REVIEW (Amelia): FIXED documentation discrepancies (added missing `text-widget.tsx` and `utils.ts`), added comments for "ghost error" cleanup logic. Status: done
- [2026-03-04] ADVERSARIAL CODE REVIEW (Amelia): Removed native HTML `required` attribute from `TsFormField.tsx` to ensure 100% external-only validation (AC 4), while preserving `aria-required` for accessibility. Verified all ACs are met. Status: done

### Changed Files

- `src/components/ts-web-ui/ts-form/index.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- `src/components/ts-web-ui/ts-form/ts-form.test.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-robustness.test.tsx`
- `src/components/ts-web-ui/ts-form/utils.ts`
- `src/components/ts-web-ui/ts-form/types.ts`
- `src/components/ts-web-ui/ts-form/widgets/number-widget.tsx`
- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-schema.ts` (Deleted)
- `public/registry/ts-form.json`
- `public/registry/ts-table.json`
- `package.json` (Previously committed)
- `GEMINI.md` (Documentation update)
