# Story 1.2: Odstranění Zod resolveru a schema generátoru z jádra

Status: ready-for-dev

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

- [ ] **Odstranění kódu** (AC: 1, 2)
  - [ ] Smazat soubor `ts-form-schema.ts`.
  - [ ] Odstranit importy `zod` a `zodResolver` z hlavního souboru formuláře.
- [ ] **Refaktoring useForm** (AC: 3, 4)
  - [ ] Upravit inicializaci `useForm` v `index.tsx`.
  - [ ] Zajistit, aby interní stav `react-hook-form` korektně spolupracoval s externí prop `errors`.
- [ ] **Cleanup typů** (AC: 2)
  - [ ] Odstranit veškeré typy v `types.ts`, které se týkaly generování schémat (pokud existují a jsou již nepoužité).
- [ ] **Verifikace demo stránek** (AC: 4)
  - [ ] Ověřit, že demo formuláře stále fungují (vykreslují se) i bez vnitřní validace.

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

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Dependency removal strategy verified against "Prezentační vrstva" mandate.
