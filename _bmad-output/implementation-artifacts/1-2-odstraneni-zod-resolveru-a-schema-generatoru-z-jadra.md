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
- [2026-02-28] REFACTOR (Story 1.1): Split widgets into separate files (21 files), implemented `onAction` and `onFieldChange` callbacks.
- [2026-02-28] REFACTOR (Story 1.5): Unified all types with `Ts` prefix in `widget-types.ts` and `types.ts`.
- [2026-03-01] REGISTRY: Fixed issue with missing widget files in registry. Updated build script to include all 21 widget files dynamically.
- [2026-03-01] CODE REVIEW FIXES: Fixed focus loss on typing, improved `form.reset` stability, and ensured nested field errors (e.g. "items.0.name") are correctly displayed using react-hook-form's native state.
- [2026-03-01] AI CODE REVIEW: Added missing `widget-types.ts` to git. Refactored `NumberWidget` to use shared `handleFieldKeyDown` utility. Updated documentation to reflect actual implementation scope (1.1, 1.2, 1.5).
- [2026-03-01] FINAL CODE REVIEW (Amelia): Verified 100% AC completion. Fixed missing `parseNumericValue` and `formatNumericValue` in `utils.ts`. Polished `TsFieldBase` documentation. Story confirmed as DONE.

### Changed Files

- `src/components/ts-web-ui/ts-form/index.tsx`
- `src/components/ts-web-ui/ts-form/ts-form-schema.ts` (Deleted)
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- `src/components/ts-web-ui/ts-form/ts-form.test.tsx`
- `src/components/ts-web-ui/ts-form/types.ts`
- `src/components/ts-web-ui/ts-form/widget-types.ts` (Added to git)
- `src/components/ts-web-ui/ts-form/utils.ts`
- `src/components/ts-web-ui/ts-form/widgets.test.tsx`
- `src/components/ts-web-ui/ts-form/widgets/*.tsx` (21 widget files)
- `src/app/components/ts-form/page.tsx`
- `package.json`
- `public/registry/ts-form.json`
- `scripts/build-registry.ts`
- `_bmad-output/implementation-artifacts/1-2-odstraneni-zod-resolveru-a-schema-generatoru-z-jadra.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `CLAUDE.md`
- `GEMINI.md`
- `README.md`
- `TODO.md`
