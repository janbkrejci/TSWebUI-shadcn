---
stepsCompleted:
  - step-01-shard-editor
inputDocuments:
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/prd.md
---

# Epics: Form Editor

Tento shard obsahuje Epiky zaměřené na vizuální editor formulářů TsFormEditor.

## Epic 4: Rozšíření a Vylepšení Form Editoru

Cíl: Funkční vylepšení pro správu mřížky a synchronizace s novým typovým systémem.

### Story 4.1: Přejmenování technického klíče pole (Rename Field ID)

Jako uživatel chci v editoru změnit technický název pole (klíč) automaticky všude.
**Acceptance Criteria:**

- Změna `fieldKey` se automaticky promítne do objektu `fields` i do `layout` struktury.

### Story 4.2: Vkládání sloupců na specifickou pozici (Insert Column at Position)

Jako uživatel chci vkládat nové sloupce do řádku na konkrétní místo.
**Acceptance Criteria:**

- Je možné vložit prázdný sloupec na konkrétní index v řádku.

### Story 4.3: Validace unikátnosti názvů polí v reálném čase

Jako uživatel chci upozornění, pokud zadám klíč pole, který už je ve formuláři použit.
**Acceptance Criteria:**

- Editor zobrazí chybu a zabrání uložení duplicitního klíče.

### Story 4.4: Synchronizace Exportu s novým typovým systémem

Jako vývojář chci, aby editor exportoval JSON definice přesně odpovídající novým TypeScript rozhraním (Ts prefix).
**Acceptance Criteria:**

- Exportovaný JSON neobsahuje legacy atributy.
- Struktura přesně odpovídá `TsFormDef`.
- Všechny nové parametry (excludeFromSubmit, roundTo, atd.) jsou správně exportovány.

### Story 4.5: Synchronizace Importu s novým typovým systémem

Jako vývojář chci, aby editor správně interpretoval a vizualizoval JSON definice v novém formátu.
**Acceptance Criteria:**

- Import starších i nových JSON definic proběhne bez ztráty dat.
- Property sheet v editoru se správně naplní hodnotami z importovaného JSONu.
