# Story 5.5: Podpora pro stav tlačítek (disabled/hidden) v definici

Status: ready-for-dev

## Story

Jako integrátor,
chci ovládat viditelnost a aktivní stav tlačítek přímo v JSON definici přes `disabled` a `hidden` vlastnosti,
aby tlačítka v button baru dynamicky reagovala na stav aplikace bez úprav JSX.

## Acceptance Criteria (BDD)

1. **AC1 — disabled tlačítko:** Tlačítko s `disabled: true` v JSON definici je vizuálně neaktivní (šedé, `pointer-events-none`) a nelze na něj kliknout. Zachovává svou pozici v layoutu.
2. **AC2 — hidden tlačítko:** Tlačítko s `hidden: true` v JSON definici je ZCELA odstraněno z DOM (ne `display: none`). Ostatní tlačítka se posunou a zabírají uvolněný prostor.
3. **AC3 — Dynamická změna:** Změna `disabled`/`hidden` hodnoty v `buttons` prop za běhu se okamžitě projeví na vykreslení tlačítek. Přechod hidden→visible a disabled→enabled jsou plynulé.
4. **AC4 — Kombinace stavů:** `disabled: true` + `hidden: true` → tlačítko je hidden (hidden má přednost). `disabled: false` + `hidden: false` → normální tlačítko.
5. **AC5 — Keyboard:** Disabled tlačítko NENÍ dostupné přes Tab (tabIndex: -1 nebo nativní disabled). Hidden tlačítko samozřejmě není v DOM.
6. **AC6 — isSubmitting override:** Pokud `form.formState.isSubmitting` je true, VŠECHNA tlačítka jsou disabled bez ohledu na JSON definici. Po dokončení submitu se vrátí na definované stavy.
7. **AC7 — Typ definitions:** `TsButton.disabled?: boolean` a `TsButton.hidden?: boolean` jsou definovány v `types.ts`. Defaultní hodnota pro obě je `false`.

## Tasks / Subtasks

- [ ] Task 1: Audit typového systému (AC: #7)
  - [ ] 1.1: Ověřit, že `TsButton` v `types.ts` má `disabled?: boolean` a `hidden?: boolean`
  - [ ] 1.2: Pokud chybí — doplnit do `TsButton` interface
  - [ ] 1.3: Ověřit zpětnou kompatibilitu — formuláře bez disabled/hidden na tlačítkách musí fungovat beze změny

- [ ] Task 2: Implementace hidden tlačítek (AC: #2, #4)
  - [ ] 2.1: V `index.tsx` button rendering — filtrovat `buttons.filter(b => !b.hidden)` PŘED dělením do left/center/right skupin
  - [ ] 2.2: Ověřit, že `renderButtons` funkce nedostane hidden tlačítka vůbec
  - [ ] 2.3: Test — hidden tlačítko není v DOM (ne display:none, ale skutečně chybí v markup)

- [ ] Task 3: Implementace disabled tlačítek (AC: #1, #5, #6)
  - [ ] 3.1: V `renderButtons` v `index.tsx` — přidat `disabled` prop: `disabled={(!isConfirmBtn && form.formState.isSubmitting) || (btn as TsButton).disabled}`
  - [ ] 3.2: Ověřit, že `isSubmitting` override má VŽDY přednost — pokud submitting, vše je disabled
  - [ ] 3.3: Ověřit vizuální styl disabled tlačítka — Shadcn Button s `disabled` má opacity-50 a cursor-not-allowed
  - [ ] 3.4: Test — disabled tlačítko není v tab chain

- [ ] Task 4: Keyboard scoping (AC: #5)
  - [ ] 4.1: Ověřit, že Enter keyboard action (`handleKeyAction` v index.tsx) respektuje disabled stav submit buttonu
  - [ ] 4.2: Pokud submit button je disabled, Enter NESMÍ vyvolat submit akci
  - [ ] 4.3: Pokud všechny buttons jsou disabled (isSubmitting), keyboard submit je blokován

- [ ] Task 5: Editor synchronizace (AC: #7)
  - [ ] 5.1: Ověřit, že TsFormEditor export (`exportJson`) zachovává `disabled`/`hidden` na buttons
  - [ ] 5.2: Ověřit, že TsFormEditor import správně čte `disabled`/`hidden` z importovaného JSON
  - [ ] 5.3: Pokud editor má button properties UI — přidat disabled/hidden toggle

- [ ] Task 6: Testy (AC: #1–#7)
  - [ ] 6.1: Unit test — hidden button není v DOM
  - [ ] 6.2: Unit test — disabled button je v DOM ale neklikatelný
  - [ ] 6.3: Unit test — isSubmitting disabluje všechna tlačítka
  - [ ] 6.4: Integrační test — dynamická změna disabled/hidden se projeví okamžitě
  - [ ] 6.5: Test — Enter keyboard nevolá akci pokud submit button je disabled
  - [ ] 6.6: Test — kombinace disabled+hidden → hidden má přednost

## Dev Notes

### Architektonické vzory a omezení

- **Existující `TsButton` typ:** V `types.ts` — `TsButton` interface pravděpodobně JIŽ obsahuje `disabled?: boolean` a `hidden?: boolean` (ověřit). Reference implementace tyto vlastnosti definuje.
- **Button rendering v `index.tsx` (~396–418):**
  ```
  buttons.filter((b) => b.position === "left")
  buttons.filter((b) => b.position === "center")
  buttons.filter((b) => !b.position || b.position === "right")
  ```
  → Přidat `.filter(b => !b.hidden)` PŘED pozicní filtraci. Nejčistší řešení: definovat `visibleButtons` konst nahoře.
- **`renderButtons` callback (~354–389):** `disabled={!isConfirmBtn && form.formState.isSubmitting}` → rozšířit o `|| (btn as TsButton).disabled`.
- **Keyboard enter handler (~214–250):** `const submitBtn = buttons.find((b) => b.type === "submit") || buttons[0]` → musí respektovat disabled stav: `buttons.find((b) => b.type === "submit" && !b.disabled) || buttons.find(b => !b.disabled)`.
- **Confirmation dialog buttons:** Confirmation dialog buttons v `TsConfirmation["buttons"]` NEMAJÍ disabled/hidden — jsou to dialog-level buttons, ne form-level.

### Poučení z retrospektiv

- **Epic 4:** "Guard-first pattern v `renameField`: Všechny validace proběhnou PŘED `saveToHistory()`" — stejný pattern pro disabled check: ověřit disabled PŘED action dispatch.
- **Epic 4:** "Sdílená regex konstanta (VALID_FIELD_KEY) mezi store a UI zajišťuje konzistentní validaci" — disabled/hidden stav by měl být single source of truth z buttons prop, ne duplikovaný.
- **Epic 4:** "A11y u hover-only UI elementů vyžaduje explicitní pozornost" — disabled buttons musí být keyboard-safe.
- **Epic 3:** "Export filtr přes excludeFromSubmit je integrovaný do onAction i onFieldChange" — button disabled nesmí obejít data filtration.
- **Epic 2:** "Fixní sloty pro label/error" — button bar layout nesmí jumpovat při hidden tlačítkách (ale je OK, protože hidden = removed from DOM, ne prázdný slot).

### Project Structure Notes

- `src/components/ts-web-ui/ts-form/index.tsx` — button rendering, `renderButtons`, keyboard handlers
- `src/components/ts-web-ui/ts-form/types.ts` — `TsButton` interface
- `src/components/ts-web-ui/ts-form-editor/store.ts` — editor Zustand store, `exportJson()`, button management
- `src/components/ts-web-ui/ts-form-editor/` — editor UI pro button properties (pokud existuje)
- Limit 300 řádků na soubor, žádné `any`, Tailwind v4 přes `cn()`

### References

- [Source: _bmad-output/planning-artifacts/prd.md — FR4]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md — Story 5.5 AC]
- [Source: _bmad-output/planning-artifacts/architecture.md — Button States section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Button Bar Behavior]
- [Source: src/components/ts-web-ui/ts-form/index.tsx — button rendering lines 354-420]
- [Source: _bmad-output/implementation-artifacts/epic-4-retro-2026-03-19.md — guard-first pattern]
- [Source: reference-tswebui/ts-form-readme.md — button disabled/hidden properties]

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List
