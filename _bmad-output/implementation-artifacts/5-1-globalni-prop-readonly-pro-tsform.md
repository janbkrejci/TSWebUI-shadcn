# Story 5.1: Globální prop readOnly pro TsForm

Status: done

## Story

Jako integrátor,
chci přepnout celý formulář do režimu pouze pro čtení jedním propem `readOnly: true`,
aby se všechna pole stala needitovatelná a button bar se automaticky skryl.

## Acceptance Criteria (BDD)

1. **AC1 — Pole v readonly režimu:** Nastavení `readOnly: true` na `<TsForm>` způsobí, že `mergedFields` nastaví `readonly: true` na KAŽDÉ pole. Všechna pole jsou needitovatelná — neměnná hodnota, `tabIndex: -1`, vizuální styl `readonlyClass`.
2. **AC2 — Skrytí button baru:** V readonly režimu se button bar nevykresluje (podmínka `buttons.length > 0 && !readOnly` v `index.tsx` je již splněna).
3. **AC3 — Zachování dat:** Hodnoty polí zůstávají přístupné přes `form.getValues()` i v readonly režimu — žádné mazání nebo resetování.
4. **AC4 — Vizuální konzistence:** Readonly pole NEPOUŽÍVAJÍ disabled-gray styling. Používají alternativní vizuální indikátor (odlišné pozadí, cursor-default, bez interakčních affordances).
5. **AC5 — Dynamické přepínání:** Změna `readOnly` prop za běhu (false→true→false) správně přepíná stav všech polí bez ztráty dat nebo fokus artefaktů.
6. **AC6 — Widget pokrytí:** Vybrané widgety (text, select, checkbox, date, number, relationship) správně reagují na readonly — ověřit integračním testem.

## Tasks / Subtasks

- [x] Task 1: Audit aktuálního readonly chování (AC: #1, #4)
  - [x] 1.1: Projít všech 22 widget souborů a ověřit, že každý respektuje `readOnly` prop
  - [x] 1.2: Ověřit, že `mergedFields` v `index.tsx` (řádek ~183) správně propaguje `readOnly` do všech polí
  - [x] 1.3: Zkontrolovat `getFieldClasses()` v `utils.ts` — `readonlyClass` a `readonlyPointerClass` jsou vizuálně odlišné od disabled

- [x] Task 2: Opravit widgety, které nerespektují readonly správně (AC: #1, #6)
  - [x] 2.1: Pro každý widget ověřit: má `readOnly` prop, nastavuje `tabIndex={readOnly ? -1 : undefined}`, má `aria-readonly`
  - [x] 2.2: Widgety bez nativního readonly (select, checkbox, switch, radio, button-group, file, relationship, table) — zajistit, že jsou effectivně needitovatelné
  - [x] 2.3: Widgety s popper/dropdown (combobox, select, multiselect, date, datetime) — zajistit, že popper se neotevírá v readonly

- [x] Task 3: Vizuální styl readonly režimu (AC: #4)
  - [x] 3.1: Sjednotit `readonlyClass` v `utils.ts` — pozadí `bg-muted/50`, `cursor-default`, bez hover/focus efektů
  - [x] 3.2: Readonly pole nesmí mít disabled opacity — musí být jasně čitelná
  - [x] 3.3: Password widget v readonly režimu — skrýt toggle tlačítko (eye icon)

- [x] Task 4: Button bar suppression (AC: #2)
  - [x] 4.1: Ověřit, že podmínka v `index.tsx` `{buttons.length > 0 && !readOnly && (...)}` funguje správně
  - [x] 4.2: Ověřit, že keyboard handler (Enter→submit) je v readonly režimu neaktivní nebo ignorovaný

- [x] Task 5: Testy (AC: #1–#6)
  - [x] 5.1: Unit test — `mergedFields` nastaví readonly na všechna pole při `readOnly: true`
  - [x] 5.2: Unit test — button bar se nevykresluje při `readOnly: true`
  - [x] 5.3: Integrační test — dynamické přepínání readonly neztrácí hodnoty
  - [x] 5.4: Integrační test — vybrané widgety (text, select, checkbox, date) jsou needitovatelné

## Dev Notes

### Architektonické vzory a omezení

- **Existující infrastruktura:** `readOnly` prop je již definován v `TsFormProps`, `mergedFields` useMemo jej propaguje. Button bar podmínka `&& !readOnly` existuje. Toto je primárně auditní a konsolidační story.
- **`mergedFields` logika (index.tsx ~183):** `if (readOnly) merged.readonly = true` — ověřit, že se správně merguje i pro pole, která mají vlastní `readonly: false` v definici.
- **`getFieldClasses()` (utils.ts):** Vrací `readonlyClass` a `readonlyPointerClass` — audit sjednocení vizuálního stylu.
- **Widget-level readonly:** Každý widget musí respektovat `readOnly` prop z `commonProps`. Nativní HTML inputy mají `readOnly` atribut, ale Radix komponenty (Select, Checkbox, Switch) vyžadují jiný přístup (disabled + vizuální override, nebo event prevention).
- **Keyboard v readonly:** `handleFieldKeyDown` v widgets — v readonly režimu by neměl dispatchovat `form-key-action` eventy, protože formulář nemá button bar a akce nemají smysl.

### Poučení z retrospektiv

- **Epic 1:** State integrity byla průřezovým rizikem — ověřit, že přepínání readonly nezpůsobuje re-render storm nebo ztrátu focusu na needitovaných polích.
- **Epic 2:** Sdílené wrappery jsou hotspot — `TsFormField` i `TsFormLayout` musí být validovány, že readonly nezpůsobuje layout shift.
- **Epic 3:** Widget contract konzistence — readonly musí být sjednocený standard napříč všemi widgety, ne ad-hoc per widget.
- **Epic 4:** A11y u hover-only elementů — readonly widgety by neměly mít žádné interaktivní affordances, které matou uživatele.

### Project Structure Notes

- `src/components/ts-web-ui/ts-form/index.tsx` — hlavní komponenta, `mergedFields`, button bar
- `src/components/ts-web-ui/ts-form/utils.ts` — `getFieldClasses()`, `handleFieldKeyDown()`
- `src/components/ts-web-ui/ts-form/ts-form-field.tsx` — dispatcher, `commonProps`
- `src/components/ts-web-ui/ts-form/widgets/*.tsx` — 22 widget souborů (audit ALL)
- `src/components/ts-web-ui/ts-form/types.ts` — `TsFormProps.readOnly`, `TsFieldBase.readonly`
- Limit 300 řádků na soubor, žádné `any`, Tailwind v4 přes `cn()`

### References

- [Source: _bmad-output/planning-artifacts/prd.md — FR27, FR28]
- [Source: _bmad-output/planning-artifacts/architecture.md — ReadOnly rendering section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — ReadOnly Mode Design]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md — Story 5.1 AC]
- [Source: _bmad-output/implementation-artifacts/epic-3-retro-2026-03-18.md — widget contract]
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2026-03-15.md — state integrity]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

Code review provedeno adversarial review agentem — 0 CRITICAL, 1 HIGH (locale double-casts, opraveno), 3 MEDIUM (aria-readonly, opraveno), 2 LOW (opraveno). Všech 153 testů prošlo.

### Completion Notes List

- `readOnly` prop na `TsFormProps` propagován přes `mergedFields` do všech 22 widgetů
- `readonlyClass` v utils.ts sjednocen na `bg-muted/50 cursor-default`
- Button bar se nevykresluje při `readOnly: true` (podmínka `visibleButtons.length > 0 && !readOnly`)
- Keyboard handler blokuje akce v readonly režimu
- Přidány `aria-readonly` atributy na date, datetime, textarea widgety
- Testy v stories-5.test.tsx pokrývají readonly propagaci i dynamické přepínání

### File List

- src/components/ts-web-ui/ts-form/index.tsx
- src/components/ts-web-ui/ts-form/types.ts
- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/ts-form-field.tsx
- src/components/ts-web-ui/ts-form/widgets/date-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx
- src/components/ts-web-ui/ts-form/stories-5.test.tsx
