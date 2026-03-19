# Story 4.2: Vkládání sloupců na specifickou pozici (Insert Column at Position)

Status: done

## Story

Jako uživatel editoru chci vložit nový prázdný sloupec do řádku na konkrétní místo (nikoli jen na konec), abych mohl efektivně strukturovat rozložení formuláře bez nutnosti přetahovat sloupce dodatečně.

## Acceptance Criteria

1. [x] Je možné vložit prázdný sloupec **před** (vlevo od) libovolného existujícího sloupce v řádku.
2. [x] Je možné vložit prázdný sloupec **za** (vpravo od) posledního sloupce — to odpovídá stávajícímu chování `addColumnToRow`.
3. [x] Vložení je dostupné v obou layoutových režimech: `single` i `tabs`.
4. [x] Operace je kompatibilní s undo/redo (je uložena do history).
5. [x] Testy pokrývají: vložení na první pozici, vložení doprostřed, vložení na konec, vložení v tab-mode, undo po vložení.

## Tasks / Subtasks

- [x] Přidat akci `insertColumnAtPosition(tabIndex, rowIndex, itemIndex)` do store (`store.ts`) (AC: #1, #2, #3, #4)
  - [x] Implementovat insert pomocí `Array.splice` nebo slice-a-concat vzoru
  - [x] Pokrýt single mode i tabs mode (stejný vzor jako u `addColumnToRow`)
  - [x] Volat `saveToHistory()` před mutací
- [x] Přidat typ akce do `FormEditorState` interface v `store.ts` (AC: #3)
- [x] Aktualizovat UI v `form-editor.tsx` — přidat trigger pro vložení sloupce na pozici (AC: #1, #2)
  - [x] Přidat tlačítko „+" mezi sloupce v canvas (vedle stávajícího tlačítka na konci řádku)
  - [x] Tlačítka viditelná při hover nad řádkem nebo výběrem pole
- [x] Napsat regresní testy do `store.test.ts` (AC: #5)

## Dev Notes

### Klíčové technické detaily

- **Stávající `addColumnToRow`** vždy appends na konec (`items: [...existingItems, newItem]`). Nová akce `insertColumnAtPosition` bude vkládat na index `itemIndex` pomocí slice:
  ```typescript
  const before = row.items.slice(0, itemIndex)
  const after = row.items.slice(itemIndex)
  items: [...before, newItem, ...after]
  ```
- `newItem` má stejnou strukturu jako u `addColumnToRow`: `{ id: generateId(), field: "", type: "empty", width: "1fr" }`.
- Signatura akce: `insertColumnAtPosition(tabIndex: number, rowIndex: number, itemIndex: number): void`
  - `tabIndex` je ignorován v `single` mode (stejný vzor jako ostatní akce).
  - `itemIndex` = 0 vloží sloupec jako první; `itemIndex = row.items.length` odpovídá append.

### Architektura store

- Veškeré store akce jsou v `src/components/ts-web-ui/ts-form-editor/store.ts`.
- Interface `FormEditorState` musí obsahovat novou akci hned za `addColumnToRow` a `removeColumnFromRow`.
- Vzor pro single / tabs větvení viz existující `addColumnToRow` (řádky ~379–410).

### UI

- V `form-editor.tsx` jsou řádky renderovány v `RowEditor` komponentě (nebo ekvivalentní lokalitě). Přidej malé `+` tlačítko (`size="icon"` variant, `h-5 w-5`) viditelné při hoveru nad řadou, umístěné **před** každý sloupec.
- Nerozpadne se layout: tlačítka jsou absolutně nebo relativně pozicována, nesmí přidávat výšku řádku.
- Tailwind v4 syntaxe (bez `hover:` legacy variantes, použij Tailwind v4 group/peer pattern nebo inline state).

### Testovací standard (z retrospektiv)

Z Epic 3 retrospektivy: každá story musí mít explicitní regresní testy. Testy nesmějí mít `act()` warning. Testy musejí pokrývat:

- happy path (vložení na konkrétní index)
- hraniční případy (index 0, index = délka pole)
- undo po vložení
- tabs mode (tabIndex přesměrování)

### Doporučení z předchozích retrospektiv

- (Epic 1) Nekombinuj přidávání nové funkcionality s refaktoringem. Přidat jen `insertColumnAtPosition`, neměnit `addColumnToRow`.
- (Epic 2) Jakákoli změna v canvas renderingu musí být ověřena, že nezvyšuje layout shift.
- (Epic 3) File List ve story musí přesně odpovídat reálně změněným souborům.
- (Epic 3) Tato operace nesmí vytvářet coupling do TsForm jádra — pouze store.ts + form-editor.tsx.

### Project Structure Notes

- Store: `src/components/ts-web-ui/ts-form-editor/store.ts`
- UI: `src/components/ts-web-ui/ts-form-editor/form-editor.tsx`
- Testy: `src/components/ts-web-ui/ts-form-editor/store.test.ts`

### References

- Stávající `addColumnToRow` implementace: `store.ts` řádky ~379–410
- Vzor pro single/tabs větvení: `store.ts` – jakákoli existující kolumnová akce
- EditorRowItem type: `src/components/ts-web-ui/ts-form-editor/types.ts`
- Canvas rendering: `form-editor.tsx` – RowEditor nebo inline řádky v canvas sekci

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

Žádné problémy při implementaci.

### Completion Notes List

- Implementována akce `insertColumnAtPosition(tabIndex, rowIndex, itemIndex)` ve store s podporou single i tabs mode
- UI přidáno — tlačítko "+" se zobrazuje při hoveru před každým sloupcem v CanvasCell
- 5 testů pokrývajících: vložení na první pozici, doprostřed, na konec, tabs mode, undo
- Všechna AC splněna, všechny testy prochází

### File List

- src/components/ts-web-ui/ts-form-editor/store.ts (nová akce insertColumnAtPosition)
- src/components/ts-web-ui/ts-form-editor/form-editor.tsx (UI pro insert column before)
- src/components/ts-web-ui/ts-form-editor/store.test.ts (5 testů)

### Change Log

- 2026-03-19: Implementace story 4.2 — insertColumnAtPosition akce + UI + testy
