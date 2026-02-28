---
stepsCompleted:
  - step-01-shard-core-layout
inputDocuments:
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# Epics: Core Engine & Layout

Tento shard obsahuje Epiky zaměřené na jádro TsForm, modularitu a layoutový systém.

## Epic 1: Modulární základ pro růst a udržitelnost

Cíl: Vybudování modulární a škálovatelné architektury, sjednocení typového systému a přechod na čistě prezentační vrstvu.

### Story 1.1: Modulární architektura widgetů (Widget-per-file)

Jako přispěvatel chci, aby každý widget byl ve vlastním souboru, aby byl kód čitelný a udržitelný.
**Acceptance Criteria:**

- V adresáři `widgets/` existuje samostatný `.tsx` soubor pro každý typ pole.
- Hlavní dispatcher `ts-form-field.tsx` obsahuje pouze switch logiku pro importované widgety.
- Žádný widget nepřesahuje limit 300 řádků.

### Story 1.2: Odstranění Zod resolveru a schema generátoru z jádra

Jako vývojář chci odstranit závislost na Zod a vnitřním generátoru schémat, aby byl TsForm čistě prezentační.
**Acceptance Criteria:**

- Soubor `ts-form-schema.ts` je odstraněn.
- `useForm` je inicializován bez resolveru a bez `mode: "onChange"`.
- Validace je plně externí přes prop `errors`.

### Story 1.3: Migrace textových widgetů na bezvalidační režim (Text, Textarea, Password)

Jako vývojář chci odstranit vnitřní validační logiku ze základních textových widgetů při zachování stability vstupu.
**Acceptance Criteria:**

- `<FormMessage />` je odstraněn z widgetů, chyby se berou z prop `error`.
- Vstupní prvky zachovávají focus a pozici kurzoru při re-renderech (State Integrity).
- Vizuální rendering odpovídá referenční implementaci.

### Story 1.4: Migrace výběrových a komplexních widgetů na bezvalidační režim

Jako vývojář chci migrovat Select, Multiselect, Date a Relationship widgety do nové struktury.
**Acceptance Criteria:**

- Všechny zbývající typy jsou vyčleněny do samostatných souborů.
- Widgety zachovávají stav a focus při re-renderech (State Integrity).
- Žádné importy 'zod' v kódu TsForm.

### Story 1.5: Striktní TypeScript a sjednocené prefixování (Ts prefix)

Jako vývojář chci 100% typovou bezpečnost bez 'any', aby mi IDE poskytovalo přesné napovídání.
**Acceptance Criteria:**

- Všechny globální typy začínají prefixem 'Ts' (např. `TsFieldDef`, `TsFormDef`).
- V kódu nejsou žádné casty `as any` nebo `as unknown as`.

### Story 1.6: Sjednocené callbacky a filtrace excludeFromSubmit

Jako integrátor chci komunikovat s formulářem přes jednotné API a neřešit pomocná pole v datech.
**Acceptance Criteria:**

- Callbacky `onAction` a `onFieldChange` vrací korektní a vyčištěná data.
- Pole s `excludeFromSubmit: true` jsou z odesílaných dat automaticky odstraněna.

## Epic 2: Stabilizace Layoutu a Chytrá Navigace

Cíl: Refaktoring layoutu pro Tailwind v4, zajištění vizuální integrity (zarovnání) a implementace globální signalizace chyb napříč všemi záložkami.

### Story 2.1: Refaktoring mřížkového systému (Rows/Columns) pro Tailwind v4

Jako vývojář chci, aby stávající mřížkový (Grid) layout využíval čisté utility Tailwind v4.
**Acceptance Criteria:**

- Inline styly pro řádky a sloupce jsou nahrazeny utility třídami Tailwind v4.
- Vizuální rendering gridu odpovídá 100% referenční implementaci (Regression Parity).

### Story 2.2: Refaktoring systému záložek (Tabs) pro Tailwind v4

Jako vývojář chci, aby komponenta pro záložky využívala Shadcn/UI a Tailwind v4.
**Acceptance Criteria:**

- Komponenta Tabs je migrována na Shadcn/UI variantu.
- Stylování záložek a jejich obsahu využívá Tailwind v4 utility.
- Přepínání záložek je plynulé a vizuálně konzistentní s design systémem.

### Story 2.3: Globální indikace chyb na všech záložkách (Tab Error Dots)

Jako uživatel chci vidět indikátor chyby na KAŽDÉ záložce, která obsahuje alespoň jedno pole s chybou.
**Acceptance Criteria:**

- Pokud pole obsahuje chybu v `errors` prop, u názvu příslušné záložky se zobrazí červená tečka.

### Story 2.4: Programové ovládání activeTab

Jako integrátor chci měnit aktivní záložku přes vlastnost activeTab.
**Acceptance Criteria:**

- Změna prop `activeTab` okamžitě přepne zobrazenou záložku v TsForm.

### Story 2.5: Implementace mřížkového zarovnání (Top-aligned inputs)

Jako uživatel chci, aby všechny vstupní prvky v jednom řádku mřížky byly horizontálně zarovnané na svou horní hranu.
**Acceptance Criteria:**

- Všechny inputy v jednom řádku mají horní hranu ve stejné horizontální linii.
- Implementace využívá fixní sloty pro Labely a Error hlášky pro zachování vizuálního rytmu.

## Epic 5: Finální Produkční Úpravy (DX a UX)

Cíl: Implementace globálního režimu pro čtení a zajištění naprosté stability uživatelského vstupu (State Integrity).

### Story 5.1: Globální prop readOnly pro TsForm

Jako integrátor chci přepnout celý formulář do režimu pouze pro čtení.
**Acceptance Criteria:**

- Nastavení `readOnly: true` přepne všechna pole do stavu readonly a skryje button bar.

### Story 5.2: State Integrity (Verifikace zachování focusu a kurzoru)

Jako uživatel chci mít jistotu, že žádný widget nezpůsobuje ztrátu focusu při aktualizaci dat nebo chyb.
**Acceptance Criteria:**

- (Integrační test) Rychlé psaní a asynchronní aktualizace chyb nevedou k přeskakování kurzoru nebo ztrátě focusu u žádného typu widgetu.

### Story 5.3: Standardy přístupnosti a klávesnice (A11y)

Jako uživatel chci, aby formulář plně respektoval standardy přístupnosti Shadcn/UI.
**Acceptance Criteria:**

- Logické pořadí polí při tabování, jasně viditelné focus stavy.

### Story 5.4: Globální interakce (Enter/Escape) a klávesové akce polí

Jako uživatel chci ovládat formulář efektivně pomocí klávesnice.
**Acceptance Criteria:**

- Podpora pro Enter (odeslání) a Escape (zrušení) ve scope konkrétního formuláře.
- Pole podporují specifické `enterAction` / `escapeAction`.

### Story 5.5: Podpora pro stav tlačítek (disabled/hidden) v definici

Jako integrátor chci ovládat viditelnost a aktivní stav tlačítek přímo v JSON definici.
**Acceptance Criteria:**

- Tlačítka v button baru podporují vlastnosti `disabled` a `hidden`.
- `hidden: true` zcela odstraní tlačítko z layoutu (ostatní se posunou).
