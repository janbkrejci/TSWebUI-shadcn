---
stepsCompleted:
  - step-01-shard-widgets
inputDocuments:
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/prd.md
---

# Epics: Widgets Library

Tento shard obsahuje Epiky zaměřené na implementaci a refaktoring jednotlivých datových widgetů.

## Epic 3: Refaktoring a Rozšíření Datových Widgetů

Cíl: Doplnění pokročilé logiky a standardních atributů polí pro dosažení plné funkčnosti podle PRD.

### Story 3.1: Implementace Smart Parsing pro Date a Datetime

Jako uživatel chci v komponentách Date a Datetime zadávat datum zkráceně.
**Acceptance Criteria:**

- Zadaný text (např. "2503") je po onBlur automaticky doplněn na validní datum (25.03. aktuálního roku).
- Widgety zachovávají focus a stav při parsování a re-renderu (State Integrity).

### Story 3.2: Vylepšené zaokrouhlování (roundTo) a lokalizace v Number widgetu

Jako uživatel chci podporu pro zaokrouhlování na desetinná místa a českou lokalizaci.
**Acceptance Criteria:**

- Hodnota se zaokrouhlí podle parametru `roundTo` (počet míst).
- Používá se české formátování (čárka jako oddělovač).
- Number widget zachovává pozici kurzoru při formátování za běhu.

### Story 3.3: Tabulkový Dropdown v Relationship Pickeru

Jako uživatel chci vidět výsledky vyhledávání v tabulce se sloupci v dropdownu.
**Acceptance Criteria:**

- V dropdownu se vykreslí tabulka s konfigurovanými sloupci.
- Widget zachovává focus při interakci s tabulkou.

### Story 3.4: Podpora pre-existing souborů ve File widgetu

Jako vývojář chci naplnit File widget seznamem již existujících souborů přes value/defaultValue.
**Acceptance Criteria:**

- Widget zobrazí seznam nahraných souborů hned po načtení dat z `value`.

### Story 3.5: Parametrické ikony a zavírání v Infoboxu

Jako integrátor chci v Infoboxu ikonu a tlačítko pro zavření pomocí parametrů.
**Acceptance Criteria:**

- Infobox se vykreslí s ikonou a zavíracím křížkem podle JSON konfigurace.

### Story 3.6: Implementace autofocus a automatického výběru textu (selectAllOnFocus)

Jako vývojář chci, aby se pole automaticky zaměřila nebo vybrala svůj obsah.
**Acceptance Criteria:**

- Pole s `autofocus: true` se po vykreslení automaticky zaměří.
- Pole se `selectAllOnFocus: true` při získání focusu vybere celý svůj obsah.

### Story 3.7: Rozšířené zobrazení: Skrytí popisku (hideLabel) a readonly režim pole

Jako vývojář chci ovládat vizibilitu popisků a editační stav na úrovni jednotlivých polí.
**Acceptance Criteria:**

- `hideLabel: true` skryje label, ale zachová zarovnání v mřížce.
- `readonly: true` pole uzamkne pro editaci (vizuálně odlišné od disabled).

### Story 3.8: Řízení datového exportu pomocí excludeFromSubmit

Jako vývojář chci mít možnost vyloučit konkrétní pole z výsledných dat formuláře.
**Acceptance Criteria:**

- Hodnota pole s `excludeFromSubmit: true` není přítomna v `onAction` ani `onFieldChange` datech.

### Story 3.9: Refaktoring a modularizace Table widgetu (TsTable wrapper)

Jako vývojář chci, aby Table widget využíval novou modulární architekturu a TsTable komponentu.
**Acceptance Criteria:**

- Table widget je vyčleněn do samostatného souboru v `widgets/`.
- Widget funguje jako tenký wrapper nad `TsTable`.
- Podporuje konfiguraci sloupců a dat z JSON definice.
- Zachovává vizuální integritu a zarovnání v mřížce.
