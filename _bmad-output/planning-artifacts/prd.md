---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation-skipped
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - TODO.md
  - CLAUDE.md
  - _bmad-output/brainstorming/brainstorming-session-2026-02-28.md
  - TODO-INTEGRATE.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 3
classification:
  projectType: developer_tool
  domain: general
  complexity: medium
  projectContext: brownfield
workflowType: "prd"
---

# Product Requirements Document - TSWebUI-shadcn

**Author:** jbk
**Date:** 2026-02-28

## Executive Summary

TsForm je JSON-driven formulářová komponenta knihovny TSWebUI pro React/Next.js. Deklarativně definuje formuláře včetně layoutu, widgetů a chování přes JSON definice. Cílový uživatel v1.0 je vývojář integrující TsForm do své aplikace — JSON definice typicky přicházejí z backendu a vykreslí se automaticky bez nutnosti psát UI kód.

Projekt je přepisem existující Web Components knihovny (Shoelace) do moderního React stacku (Next.js 16, Shadcn/UI, Tailwind CSS v4). Verze 1.0 čistí architekturu, rozděluje kód na udržitelné moduly, dokončuje funkce a stabilizuje typový systém.

**Scope tohoto PRD:** Výhradně komponenty TsForm (JSON-driven formuláře) a TsFormEditor (vizuální editor formulářů). Ostatní součásti TSWebUI (TsWindow, sidebar, topbar, theme-provider aj.) nejsou předmětem tohoto dokumentu.

### Co dělá TsForm zvláštním

Konzistence a jednoduchost: vývojáři řeší business logiku, ne UI. Jedna JSON definice = kompletní formulář s 20+ typy widgetů, taby a layoutem. TsForm je čistě prezentační komponenta — nemá vlastní validační logiku, chyby přicházejí jako props z nadřazené vrstvy. Tento přístup je přirozeně AI-native: agenti generují JSON definice programaticky bez znalosti UI frameworku.

## Klasifikace projektu

|                  |                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Typ projektu** | Developer tool — UI komponentová knihovna                                                     |
| **Doména**       | General software development                                                                  |
| **Složitost**    | Střední (20+ field typů, vizuální editor, undo/redo, komplexní layout engine)                 |
| **Kontext**      | Brownfield — přepis existující funkční knihovny do moderního stacku                           |
| **Scope v1.0**   | Architektonický refactoring TsForm + TsFormEditor, dokončení chybějících features z reference |

## Success Criteria

### User Success (vývojář integrující TsForm)

- Vývojář předá JSON definici z backendu jako prop do `<TsForm />`, doplní initial values z business entity endpointu, napojí event handlery a má hotovo.
- Vytvoření wrapperu unifikujícího tento pattern je triviální — aplikace s 10 formuláři vznikne do hodiny.
- API je přímočaré: jeden tag, props pro definici/hodnoty/errory/eventy, žádná magie uvnitř.
- IDE autocomplete funguje perfektně díky explicitním typům bez workaroundů.

### Technical Success

- Všech 16 úkolů z TODO.md je implementováno.
- `pnpm build` a `pnpm lint` procházejí bez chyb.
- Pre-commit hook (Prettier + ESLint) a CI/CD pipeline (GitHub Actions) procházejí.
- Žádný soubor widgetu nepřesahuje ~300 řádků.
- Žádné `as unknown as` casty, žádné `as any` — čisté typování.
- TsForm je čistě prezentační: žádná vlastní validace, errory a initial values výhradně z props.

### Measurable Outcomes

- Kódová základna TsForm: z 1 monolitického souboru na ~20 modulů (<300 řádků).
- Závislost `@hookform/resolvers` a Zod schema generátor kompletně odstraněny.
- 100% feature parita s referenční implementací v rozsahu TODO.md.
- Vizuální rendering identický s aktuální implementací (žádné regrese).

## Product Scope

### MVP — TsForm v1.0

Vše z TODO.md (ÚKOLY 0–16):

- **Architektonický refactoring:** Odstranění Zod validace, split widgetů, extrakce sdílených utilit.
- **Typový systém:** Kompletní revize — explicitní typy, narrowed widget props, JSDoc.
- **Chybějící API:** onFieldChange, button disabled/hidden, activeTab, readOnly prop.
- **Chybějící features:** roundTo + locale, smart date parsing, field atributy, relationship multi-column, file pre-existing.
- **Bugfixy:** form-key-action scope.
- **Editor vylepšení:** rename field, insert column at position.
- **Drobnosti:** closable/icon infobox, export/import dat.

### Growth Features (Post-MVP)

- Publikace jako npm balíček.
- Dokumentace pro external vývojáře.
- Rozšíření pro low-code/no-code uživatele.
- AI agent integrace — schema generování, programatické vytváření formulářů.

### Vision (Future)

- TSWebUI jako open-source ekosystém komponentů.
- Vizuální editor jako standalone low-code/no-code nástroj.
- AI-native form generation pipeline.

## User Journeys

### Journey 1: Vývojář-integrátor — „Deset formulářů do oběda"

**Persona:** Martin, full-stack vývojář v malé firmě. Dostal za úkol přepsat interní CRM z legacy systému do Next.js. CRM má 12 různých formulářů — od jednoduchého kontaktu po složitou objednávku s taby, podmíněnými poli a relationship pickery. Martin nechce strávit týden skládáním formulářů ručně.

**Opening Scene:** Martin dostane z backendu JSON definice formulářů. Každý endpoint vrací strukturu formuláře (layout, fields, buttons) a druhý endpoint vrací data entity. Martin si řekne: „Jak to do\*\*\*\* zobrazím, aniž bych psal 12 komponent?"

**Rising Action:** Martin najde TsForm. Nainstaluje balíček, vytvoří si jednoduchý wrapper — `<EntityForm entityType="contact" entityId={id} />` — který uvnitř fetchne definici i data, předá je do `<TsForm />` a napojí `onSubmit` a `onFieldChange`. Jeden wrapper, všechny formuláře.

**Climax:** Martin otevře formulář objednávky — 3 taby, 40 polí, relationship picker na zákazníka, number field s českou lokalizací. Všechno funguje. Backend pošle error na pole „IČO" — chyba se zobrazí přesně na tom poli. Martin přepne tab — červená tečka mu ukazuje, kde je problém. Nepsal ani řádek UI kódu.

**Resolution:** Do konce dne má Martin všech 12 formulářů funkčních. Wrapper má 60 řádků. Když backend tým přidá nové pole do JSON definice, formulář se aktualizuje automaticky. Martin si říká: „Proč to takhle nefunguje všude?"

**Odhalené požadavky:** values prop, errors prop, onSubmit, onFieldChange, activeTab s chybovými indikátory na tabech, relationship picker, number locale, kompletní sada widgetů.

---

### Journey 2: Vývojář-contributor — „Přidám nový widget za hodinu"

**Persona:** Amelia, React vývojářka, která chce přispět do TsForm. Potřebuje přidat color-picker widget pro svůj projekt. V původním monolitu by se bála sáhnout do 1800-řádkového souboru.

**Opening Scene:** Amelia otevře zdrojový kód TsForm. Vidí adresář `widgets/` — každý widget je samostatný soubor, 100–300 řádků. `ts-form-field.tsx` je jen dispatcher — switch přes `def.type`, 150 řádků. Jasná struktura.

**Rising Action:** Amelia otevře `text-widget.tsx` jako vzor. Vidí explicitní props interface s narrowed typem (`TsTextFieldProps`), utility funkce (`getFieldClasses`, `createFocusHandlers`) importované z `utils.ts`. Zkopíruje vzor, vytvoří `color-widget.tsx`, přidá typ do `types.ts`, zaregistruje v dispatcheru.

**Climax:** `pnpm build` projde napoprvé. TypeScript jí hlásí, že zapomněla přidat `hasError` prop — opraví to, IDE autocomplete ji přesně navede. Žádné hádání, žádné `as any`.

**Resolution:** Pull request má 4 soubory: nový widget, aktualizovaný typ, registrace v dispatcheru, barrel export. Review trvá 10 minut — reviewer přesně vidí, co se změnilo. Žádný strach, že se rozbije něco jiného.

**Odhalené požadavky:** Modulární architektura (split widgetů), explicitní typování, sdílené utility, čistý dispatcher, JSDoc dokumentace, barrel exports.

---

### Journey 3: Vývojář-editor — „Navrhnu formulář bez psaní JSON"

**Persona:** Petr, junior vývojář. Má navrhnout formulář pro nový modul, ale není si jistý, jaké field typy použít a jak nastavit layout. Nechce psát JSON ručně a doufat, že to bude vypadat dobře.

**Opening Scene:** Petr otevře TsFormEditor. Vidí prázdný canvas s toolbarem. Přidá tab „Základní údaje", přetáhne text field pro jméno, select pro kategorii. Drag&drop, žádný kód.

**Rising Action:** Petr přejmenuje pole z automaticky generovaného `field_1` na `firstName` — v properties panelu změní název. Vloží sloupec mezi dva existující — right-click, „Insert column before". Nastaví button s confirmation dialogem. Celou dobu vidí live preview formuláře vedle.

**Climax:** Petr klikne „Export JSON" — dostane čistou TsForm definici, kterou zkopíruje do backendu. Otevře ji v `<TsForm />` — vypadá přesně jako v editoru. Pak přijde požadavek na změnu — otevře editor, importuje JSON, upraví, exportuje znovu.

**Resolution:** Petr navrhl 5 formulářů za odpoledne bez napsání jediného řádku JSON. Kolega senior dev mu jen řekne „přidej tam ještě autofocus na první pole" — Petr to zaškrtne v properties panelu.

**Odhalené požadavky:** Editor rename field, insert column at position, autofocus property, export/import JSON, properties panel s kompletními field atributy, undo/redo.

---

### Journey Requirements Summary

| Capability                     | Journey 1 (Integrátor) | Journey 2 (Contributor) | Journey 3 (Editor) |
| ------------------------------ | :--------------------: | :---------------------: | :----------------: |
| Architektonický refactoring    |                        |            ✓            |                    |
| Čisté typování                 |                        |            ✓            |                    |
| onFieldChange                  |           ✓            |                         |                    |
| Button disabled/hidden         |           ✓            |                         |                    |
| activeTab + chybové indikátory |           ✓            |                         |                    |
| roundTo + locale               |           ✓            |                         |                    |
| Smart date parsing             |           ✓            |                         |                    |
| Field atributy                 |           ✓            |                         |         ✓          |
| form-key-action scope fix      |           ✓            |                         |                    |
| Relationship multi-column      |           ✓            |                         |                    |
| Editor rename field            |                        |                         |         ✓          |
| Editor insert column           |                        |                         |         ✓          |
| readOnly prop                  |           ✓            |                         |                    |
| File pre-existing              |           ✓            |                         |                    |
| Drobné opravy                  |           ✓            |                         |         ✓          |

## Požadavky specifické pro typ projektu (Developer Tool)

### Technická architektura

- **Runtime:** React 19 + Next.js 16, TypeScript strict mode
- **UI primitiva:** Shadcn/UI (Radix UI) + Tailwind CSS v4
- **State management:** React Hook Form (form state), Zustand (editor state)
- **Žádná podpora jiných frameworků** ve v1.0 (pouze React)

### API Surface — TsForm

| Prop            | Typ                                                                          | Popis                                              |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- |
| `layout`        | `LayoutType`                                                                 | JSON definice layoutu (rows/tabs)                  |
| `fields`        | `Record<string, TsFieldDef>`                                                 | Definice polí s typy a konfigurací                 |
| `values`        | `Record<string, unknown>`                                                    | Výchozí/aktuální hodnoty polí                      |
| `errors`        | `Record<string, string>`                                                     | Externí chybové zprávy (z backendu)                |
| `buttons`       | `TsFormButton[]`                                                             | Definice tlačítek s akcemi                         |
| `onAction`      | `(action: string, data: Record<string, unknown>) => void`                    | Callback pro všechny akce (submit, cancel, custom) |
| `onFieldChange` | `(field: string, value: unknown, formData: Record<string, unknown>) => void` | Callback při změně pole                            |
| `activeTab`     | `string`                                                                     | Programové přepínání záložek                       |
| `onTabChange`   | `(tab: string) => void`                                                      | Callback při přepnutí záložky                      |
| `readOnly`      | `boolean`                                                                    | Celý formulář pouze pro čtení                      |

**Rozhodnutí o API designu:**

- `onAction` místo `onSubmit` — univerzální callback pro všechny button akce.
- `className` odstraněno — customizace přes Tailwind CSS variables a Shadcn theming.
- `values` typ `Record<string, unknown>` — typová bezpečnost hodnot řeší widgety interně.

### API Surface — TsFormEditor

- Import/export JSON definic kompatibilních s TsForm.
- Zustand store s undo/redo (50 kroků).
- Drag&drop layout operace (@dnd-kit).
- Properties panel pro konfiguraci polí a tlačítek.

### Implementační omezení

- Dokumentace a příklady: mimo scope v1.0 (showcase aplikace je dostatečná).
- Package publishing (npm): mimo scope v1.0.
- Migrace z referenční implementace: žádný automatický migration path.

## Scoping a fázový plán

### MVP strategie

**Přístup:** Problem-solving MVP — vyčištění a dokončení produktu. Scope definuje TODO.md (16 úkolů).

**Realizace:** Solo vývojář + AI agenti. Implementace po úkolech dle pořadí závislostí.

### Fáze implementace

**Fáze 1 — Architektonický základ:** Odstranění Zod validace, split souborů, utility.
**Fáze 2 — Typový systém:** Revize typování napříč komponentou.
**Fáze 3 — API a features:** Doplnění props, callbacků a widgetových funkcí.
**Fáze 4 — Editor vylepšení:** Rename field a insert column.
**Fáze 5 — Dokončení:** Drobné opravy a export/import dat.

## Functional Requirements

### Renderování formuláře

- FR1: Integrátor vykreslí formulář předáním JSON definice jako prop.
- FR2: Integrátor předá výchozí hodnoty polí jako prop a formulář je zobrazí.
- FR3: Integrátor předá chybové zprávy jako prop a formulář je zobrazí u příslušných polí.
- FR4: Integrátor definuje stav tlačítek (disabled/hidden) v definici tlačítek.
- FR5: Formulář vykreslí single-page layout (rows) i multi-tab layout (tabs s rows).
- FR6: Každý řádek layoutu využívá konfigurovatelné šířky sloupců přes CSS Grid.

### Interakce a eventy

- FR7: Integrátor reaguje na button akce (submit, cancel, custom) přes jednotný `onAction` callback.
- FR8: Integrátor sleduje změny polí přes `onFieldChange` callback s názvem pole, hodnotou a form daty.
- FR9: Integrátor programově přepíná záložky přes `activeTab` prop.
- FR10: Integrátor reaguje na přepnutí záložky přes `onTabChange` callback.
- FR11: Formulář zpracovává Enter/Escape klávesové akce ve scope konkrétního formuláře.

### Widget sada

- FR12: Formulář obsahuje textové widgety: text, textarea, password.
- FR13: Formulář obsahuje numerické widgety: number s locale formátováním a roundTo, slider.
- FR14: Formulář obsahuje výběrové widgety: select, multiselect, combobox, radio, checkbox, switch.
- FR15: Formulář obsahuje datumové widgety: date a datetime se smart date parsingem.
- FR16: Formulář obsahuje souborové widgety: file upload s podporou pre-existing souborů.
- FR17: Formulář obsahuje relationship picker s multi-column zobrazením v dialogu.
- FR18: Formulář obsahuje prezentační widgety: infobox (closable, ikona), markdown, separator.
- FR19: Formulář obsahuje akční widgety: button, button-group.
- FR20: Formulář obsahuje table widget (TsTable wrapper).

### Field atributy

- FR21: Pole podporuje `autofocus` pro automatické zaměření při renderování.
- FR22: Pole podporuje `hideLabel` pro skrytí labelu.
- FR23: Pole podporuje `readonly` pro zamezení editace na úrovni pole.
- FR24: Pole podporuje `excludeFromSubmit` pro vyloučení z odesílaných dat.
- FR25: Pole podporuje `selectAllOnFocus` pro výběr obsahu při zaměření.
- FR26: Pole podporuje `enterAction`/`escapeAction` pro klávesové zkratky.

### Formulář-level chování

- FR27: Integrátor přepne celý formulář do read-only režimu jedním propem.
- FR28: V read-only režimu se nezobrazuje button bar.
- FR29: Záložky s chybovými poli zobrazují vizuální indikaci chyb (červená tečka).
- FR30: Formulář filtruje pole s `excludeFromSubmit` z dat a z `onFieldChange` callbacku.

### Number widget specifika

- FR31: Number widget podporuje `roundTo` jako počet desetinných míst.
- FR32: Number widget podporuje `locale` prop pro formátování čísla (výchozí: cs-CZ).

### Date widget specifika

- FR33: Date widget provádí smart parsing krátkých formátů (např. 2503 → 25.03. aktuálního roku).
- FR34: Date widget validuje výsledné datum (ne NaN, rozsah let 1900–2100).

### TsFormEditor

- FR35: Editor sestavuje formuláře vizuálně pomocí drag&drop.
- FR36: Editor přejmenuje field key s automatickou aktualizací referencí v layoutu.
- FR37: Editor vkládá sloupec na konkrétní pozici (před/za existující sloupec).
- FR38: Editor exportuje JSON definici kompatibilní s TsForm.
- FR39: Editor importuje existující JSON definici pro editaci.
- FR40: Editor konfiguruje všechny field atributy (autofocus, hideLabel, excludeFromSubmit) v panelu.
- FR41: Editor provádí undo/redo operace.

### Architektura kódu

- FR42: Každý widget typ je implementován jako samostatný soubor v adresáři `widgets/`.
- FR43: Sdílená logika (normalizace, field classes, focus handlery) je extrahována do utility modulu.
- FR44: Dispatcher (`ts-form-field.tsx`) obsahuje pouze switch logiku a label/error wrapper.
- FR45: Exportované funkce a public interfaces mají explicitní typy a JSDoc dokumentaci.

## Non-Functional Requirements

### Kvalita kódu

- NFR1: Žádný widget soubor nepřesahuje 300 řádků.
- NFR2: Žádné `as unknown as` nebo `as any` casty v produkčním kódu.
- NFR3: `pnpm build` dokončí bez chyb a warningů.
- NFR4: `pnpm lint` dokončí bez chyb.
- NFR5: Pre-commit hook projde při každém commitu.
- NFR6: CI/CD pipeline (GitHub Actions) projde na push/PR do main a develop.

### Zpětná kompatibilita

- NFR7: Vizuální rendering existujících demo formulářů zůstane identický po refactoringu.
- NFR8: Existující JSON definice formulářů fungují bez úprav (kromě dokumentovaných API změn).

### Udržitelnost

- NFR9: Přidání nového widget typu vyžaduje maximálně 4 soubory.
- NFR10: Každý widget používá explicitní narrowed props interface.
