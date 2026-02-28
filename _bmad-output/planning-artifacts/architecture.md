---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-structure
  - step-07-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
workflowType: "architecture"
project_name: "TSWebUI-shadcn"
user_name: "jbk"
date: "2026-02-28"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Projekt se zaměřuje na vytvoření robustního, JSON-driven formulářového systému (`TsForm`) a jeho vizuálního editoru (`TsFormEditor`). Klíčové je oddělení UI od business logiky, kde formulář pouze vykresluje data a definice dodané z backendu. Podporuje 20+ typů widgetů, komplexní layouty (rows/tabs) a interaktivní prvky jako relationship pickery.

**Non-Functional Requirements:**
Extrémní důraz na čistotu kódu (max 300 řádků/soubor), absolutní typovou bezpečnost bez `any`, kompatibilitu s React 19 a Next.js 16, a vizuální konzistenci s Shadcn/UI. Výkon a snadná rozšiřitelnost (přidání widgetu do 4 souborů) jsou kritické.

**Scale & Complexity:**
Projekt je středně složitý brownfield refactoring. Vyžaduje precizní synchronizaci mezi JSON definicí a UI komponentami.

- Primary domain: Web UI Component Library / Developer Tool
- Complexity level: Medium-High
- Estimated architectural components: ~25-30 (Widgets, Layout Engine, Editor Store, Dispatchers)

### Technical Constraints & Dependencies

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4, Shadcn/UI
- **State:** React Hook Form (form), Zustand (editor)
- **Drag & Drop:** @dnd-kit, react-rnd
- **Package Manager:** pnpm

### Cross-Cutting Concerns Identified

- **Typová integrita:** Sjednocení typů napříč TsForm, TsFormEditor a backendovými definicemi.
- **Konzistence Layoutu:** Zajištění, aby CSS Grid layout v1.0 přesně odpovídal očekáváním z JSON definice.
- **Error Handling:** Propagace externích chyb z props až ke konkrétním widgetům.
- **Undo/Redo Logika:** Stabilita stavu v editoru při komplexních operacích.

## Starter Template Evaluation

### Primary Technology Domain

Web UI Component Library / Developer Tool založený na Reactu a Next.js.

### Starter Options Considered

Vzhledem k povaze projektu (brownfield) byl jako základ potvrzen stávající stack repozitáře, který byl identifikován jako vysoce aktuální (Next.js 16, React 19).

### Selected Starter: Custom Next.js 16 + Shadcn/UI (Current Repository)

**Rationale for Selection:**
Projekt již běží na nejnovějších verzích klíčových technologií. Přechod na jiný starter by v této fázi nedával smysl, protože stávající konfigurace plně podporuje všechny funkční i nefunkční požadavky (včetně Tailwind v4 a React 19).

**Initialization Command:**
_(Projekt je již inicializován)_

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript (Strict), Node.js runtime, React 19 (Server & Client Components), Next.js 16.

**Styling Solution:**
Tailwind CSS v4 s využitím CSS proměnných pro theming (shadcn/ui standard).

**Build Tooling:**
Next.js Build Pipeline, pnpm jako balíčkovací manažer.

**Testing Framework:**
Vitest + React Testing Library (připraveno v konfiguraci).

**Code Organization:**
App Router struktura (`src/app`), komponenty rozdělené na UI primitiva (`src/components/ui`) a doménově specifické komponenty (`src/components/ts-web-ui`).

**Development Experience:**
ESLint, Prettier, Husky pre-commit hooks, GitHub Actions pro CI/CD.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Přechod na modulární architekturu widgetů (Widget-per-file).
- Sjednocení komunikace přes jednotný `onAction` callback.
- Úplné odstranění runtime Zod validace z vnitřku `TsForm`.

**Important Decisions (Shape Architecture):**

- Využití Next.js 16 Server Components pro layout a Client Components pro interaktivní části (formuláře, editor).
- Implementace CSS Grid layoutu řízeného JSON definicí pomocí Tailwind v4.
- Centralizovaný dispatcher `ts-form-field.tsx` pro všechny typy polí.

**Deferred Decisions (Post-MVP):**

- Publikace na npm (řešeno až po stabilizaci v1.0).
- Automatizovaná migrační cesta z legacy Shoelace implementace.

### Data Architecture & Validation

**Data Modeling:**
JSON definice formuláře (`TsFormDef`) je čistě deklarativní. Typy jsou definovány jako TypeScript interfaces bez nutnosti runtime validace (Zod).

**Validation Strategy:**
`TsForm` je čistě prezentační. Validační chyby jsou do komponenty předávány jako `errors` prop (`Record<string, string>`) z nadřazené vrstvy (backend/business logika).

### API & Communication Patterns

**Unified Action Callback:**
Všechny interakce tlačítek (submit, cancel, custom) jsou sjednoceny do callbacku `onAction(action: string, data: Record<string, unknown>)`. Toto zjednodušuje integraci pro AI agenty a snižuje počet props.

**Field Change Tracking:**
Změny hodnot jsou sledovány přes `onFieldChange(field: string, value: unknown, formData: Record<string, unknown>)`, což umožňuje reaktivní chování v nadřazené komponentě.

### Frontend Architecture (Widgets & Layout)

**Modularity (Widget-per-file):**
Každý z 20+ typů polí (text, number, date, etc.) má vlastní izolovaný soubor v `src/components/ts-web-ui/ts-form/widgets/`. Každý widget má explicitně definované a zúžené (narrowed) props.

**State Management:**

- **TsForm:** Interní stav polí je spravován pomocí React Hook Form (bez Zod resolveru).
- **TsFormEditor:** Globální stav editoru (layout, undo/redo) spravuje Zustand s historií 50 kroků.

**Styling & Theming:**
Využití Tailwind CSS v4 s CSS proměnných definovanými v `globals.css`. Respektování Shadcn/UI standardů pro barvy a spacing.

### Testing & Quality Assurance

**Integration Testing:**
Prioritou pro v1.0 jsou integrační testy v Vitest, které ověřují rendering komplexních JSON definic (více tabů, různé šířky sloupců) a zajišťují vizuální i funkční paritu s referenční implementací.

**Code Standards:**
Limit 300 řádků na soubor, zákaz `any` castů, povinné JSDoc pro veřejná API.

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Code Naming Conventions:**

- **React Komponenty:** PascalCase (např. `TsForm`, `TsTable`).
- **Soubory Widgetů:** kebab-case (např. `select-widget.tsx`).
- **Interfaces:** PascalCase (např. `TsFormProps`). Globální typy začínají prefixem `Ts`.
- **Funkce a Proměnné:** camelCase (např. `renderField`).

### Structure Patterns

**Project Organization:**

- **Widgets:** `src/components/ts-web-ui/ts-form/widgets/` - jeden soubor na typ.
- **UI Primitives:** `src/components/ui/` - standardní Shadcn/UI komponenty.
- **Tests:** Co-located `*.test.ts` soubory.
- **Styles:** Tailwind v4 utility třídy, žádné separátní CSS soubory mimo `globals.css`.

### Format & Data Patterns

**JSON Field Naming:**
camelCase pro všechny vlastnosti v definici formuláře (např. `defaultValue`, `readOnly`).

**API/Prop Communication:**

- **Actions:** `onAction(action, data)`
- **Changes:** `onFieldChange(field, value, formData)`
- **Errors:** `errors: Record<string, string>`

### Process Patterns (AI Agent Mandates)

**All AI Agents MUST:**

- Limitovat velikost souboru na **300 řádků**. Pokud je widget složitější, rozdělit na sub-komponenty ve stejném adresáři.
- Používat výhradně **Tailwind v4** třídy přes `cn()` utilitu.
- Nepoužívat `any`. Vždy definovat explicitní interface nebo využít `unknown` s následným narrowingem.
- Při přidávání widgetu vždy aktualizovat `ts-form-field.tsx` (dispatcher) a `types.ts`.

### Pattern Examples

**Good Example (Widget Definition):**

```typescript
export interface TsTextWidgetProps extends TsBaseWidgetProps {
  def: TsTextFieldDef; // Narrowed type
}

export const TsTextWidget = ({ def, value, onChange }: TsTextWidgetProps) => {
  return <Input ... />;
};
```

**Anti-Pattern:**

```typescript
const MyWidget = (props: any) => { ... } // NO ANY!
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
src/
├── app/                         # Next.js Routes & Demo Pages
│   └── (form-editor, components/ts-form, widgets/*)
├── components/
│   ├── ui/                     # Shadcn UI primitives (Atomic)
│   └── ts-web-ui/              # Library Components (Molecular/Organism)
│       ├── ts-form/            # JSON-driven Form System
│       │   ├── index.tsx       # Main component & logic
│       │   ├── types.ts        # Strict TypeScript definitions
│       │   ├── ts-form-field.tsx # Widget Dispatcher (Single point of entry)
│       │   ├── ts-form-layout.tsx # Grid/Tabs Layout Engine
│       │   ├── utils.ts        # Shared normalization & class logic
│       │   └── widgets/        # 20+ isolated widget components
│       └── ts-form-editor/     # Visual Form Builder
│           ├── index.tsx       # Editor entry point
│           ├── store.ts        # Zustand state with undo/redo
│           ├── canvas.tsx      # dnd-kit implementation
│           └── panels/         # Configuration & Properties UI
├── hooks/                      # Shared hooks (e.g., use-is-mounted)
└── lib/                        # Global utilities (cn, registry)
```

### Architectural Boundaries

**Component Communication:**

- **Inbound:** JSON definition, values, and errors via props.
- **Outbound:** `onAction` and `onFieldChange` callbacks.
- **No side effects:** Components are pure and do not perform data fetching.

**Data Flow:**
Data proudí z JSON definice přes `TsFormLayout` do `TsFormField` a nakonec do konkrétního `Widgetu`. Změny proudí zpět přes `onChange` widgetu do `React Hook Form` a následně ven přes `onFieldChange`.

### Requirements to Structure Mapping

- **Modularity (FR42):** Každý widget má svůj soubor v `ts-form/widgets/`.
- **Typing (NFR2):** Všechny typy jsou centrálně v `ts-form/types.ts`.
- **Editor Logic (FR41):** Undo/redo a stav editoru jsou izolované v `ts-form-editor/store.ts`.
- **Consistency (NFR7):** Využití Shadcn UI v `components/ui/` zaručuje vizuální integritu.

### Integration Points

**Internal Communication:**
`TsFormField` funguje jako "smart wrapper", který obaluje widgety do labelů, error zpráv a zajišťuje konzistentní focus management.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Všechny zvolené technologie (Next.js 16, React 19, Tailwind v4) tvoří špičkový stack pro rok 2026. Neexistují žádné známé konflikty mezi těmito verzemi.

**Pattern Consistency:**
Implementační vzory (prefixování globálních typů `Ts`, jednotný `onAction` callback) vytvářejí predikovatelné prostředí pro vývoj.

**Structure Alignment:**
Struktura `src/components/ts-web-ui/ts-form/widgets/` je ideální pro paralelní vývoj jednotlivých polí AI agenty.

### Requirements Coverage Validation ✅

**Feature/Epic Coverage:**
Každý požadavek z PRD (včetně specifických funkcí pro Number/Date widgety) má definované místo v architektuře a jasná implementační pravidla.

**Non-Functional Requirements Coverage:**
NFR (čistota kódu, typová bezpečnost) jsou přímo zakomponovány do "Mandates" pro AI agenty v sekci implementačních vzorů.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Architektura pokrývá všechny fáze životního cyklu komponenty: definici, renderování, interakci i editaci.

**Overall Status:** **READY FOR IMPLEMENTATION**

**Confidence Level:** **Vysoká**

**Key Strengths:**

- Extrémní modulárnost (snadná rozšiřitelnost o nové widgety).
- Čisté oddělení stavu a UI (prezentační povaha TsForm).
- AI-native design (JSON-driven, jasná pravidla pro agenty).

### Implementation Handoff

**AI Agent Guidelines:**

- Striktně dodržujte limit 300 řádků na soubor.
- Nikdy nepoužívejte `any`, vždy definovat explicitní interface nebo využít `unknown` s následným narrowingem.
- Komunikujte výhradně přes `onAction` a `onFieldChange`.
- Každá změna musí být ověřena v Vitest (co-located testy).

**First Implementation Priority:**
Refactoring stávajícího `TsForm` na modulární strukturu (Split widgets) a odstranění Zod validace.
