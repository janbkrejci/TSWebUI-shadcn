# Story 5.2: State Integrity (Verifikace zachování focusu a kurzoru)

Status: ready-for-dev

## Story

Jako uživatel,
chci mít jistotu, že žádný widget nezpůsobuje ztrátu focusu při aktualizaci dat nebo chyb,
aby moje psaní a navigace v formuláři byly vždy plynulé a bez přerušení.

## Acceptance Criteria (BDD)

1. **AC1 — Rychlé psaní (text/textarea/number):** Při rychlém psaní (keystroke interval < 50ms) do textového pole se kurzor NIKDY nepřesune na jinou pozici a focus zůstane na aktivním poli. Platí i při souběžném příchodu nových `values` prop.
2. **AC2 — Async error update:** Asynchronní aktualizace `errors` prop (příchod chyb z API s latencí 100–500ms) NEZPŮSOBÍ ztrátu focusu na žádném widgetu. Pokud je uživatel v poli `email` a přijde error na poli `name`, focus zůstane na `email`.
3. **AC3 — Prop-driven value sync:** Když rodičovská komponenta změní `values` prop na poli, které uživatel PRÁVĚ NEEDITUJE, hodnota se aktualizuje bez ztráty focusu na aktivním poli. Pole, které uživatel aktivně edituje, se NESYNCHRONIZUJE (surgical update pattern).
4. **AC4 — Tab přepínání:** Přepnutí záložky (tab) a návrat zpět zachovává stav polí a focus může být obnoven na poslední aktivní pole v záložce.
5. **AC5 — Widget pokrytí:** Ověření platí pro VŠECHNY widgety: text, textarea, password, number, select, combobox, multiselect, date, datetime, checkbox, switch, radio, slider, relationship, file.
6. **AC6 — Concurrency:** Simultánní příchod nových `values` + `errors` prop nezpůsobuje race condition nebo nekonzistentní stav formuláře.

## Tasks / Subtasks

- [ ] Task 1: Audit stávajících state integrity mechanismů (AC: #1, #3)
  - [ ] 1.1: Analyzovat `prevValuesRef`, `lastPropValuesRef` pattern v `index.tsx` — ověřit, že `activeFieldName` detekce přes `data-field` atribut je spolehlivá
  - [ ] 1.2: Projít `React.useEffect` pro value sync — identifikovat edge cases kde `JSON.stringify` comparison může selhat (NaN, undefined vs null, circular refs)
  - [ ] 1.3: Zkontrolovat `internalValue`/`field.value` sync pattern v textových widgetech (TextWidget, TextareaWidget, NumberWidget) — `useState` + `useEffect` synchronizace

- [ ] Task 2: Audit error sync integrity (AC: #2, #6)
  - [ ] 2.1: Analyzovat `prevErrorPathsRef` a `syncErrors` rekurzivní funkci v `index.tsx` — ověřit, že `form.setError`/`form.clearErrors` nespouští re-render storm
  - [ ] 2.2: Ověřit, že chybový effect (`React.useEffect` pro errors) neprovádí zbytečné volání `setError` pokud message je stejná (deduplikační logika)
  - [ ] 2.3: Test scenario — příchod errors na 10+ polí simultánně nezpůsobí visual stutter

- [ ] Task 3: Widget-level state integrity testy (AC: #1, #5)
  - [ ] 3.1: Pro textová pole (text, textarea, password): test rychlého psaní s concurrent prop update
  - [ ] 3.2: Pro výběrová pole (select, combobox, multiselect): test, že otevřený dropdown se nezavře při prop update
  - [ ] 3.3: Pro datová pole (date, datetime): test, že aktivní kalendář se nezavře při prop update
  - [ ] 3.4: Pro number widget: test, že locale formatting nezpůsobuje cursor jump
  - [ ] 3.5: Pro relationship widget: test, že popup tabulka zůstává otevřená při prop update

- [ ] Task 4: Integrace a regression testy (AC: #1–#6)
  - [ ] 4.1: Integrační test — TsForm s 5+ poli, rychlé psaní v jednom poli + async error na jiném poli
  - [ ] 4.2: Integrační test — simultánní values + errors prop update
  - [ ] 4.3: Integrační test — tab switch + return: hodnoty a focus zachovány
  - [ ] 4.4: Test — controlled mode: rodič mění values na neaktivním poli, focus zůstává na aktivním

- [ ] Task 5: Opravy identifikovaných problémů (AC: #1–#6)
  - [ ] 5.1: Opravit jakékoliv zjištěné race conditions
  - [ ] 5.2: Optimalizovat re-render path pokud benchmark ukazuje > 16ms frame drop při concurrent updates

## Dev Notes

### Architektonické vzory a omezení

- **Surgical update pattern (index.tsx ~97–115):** `document.activeElement` → `closest("[data-field]")` → `getAttribute("data-field")` detekuje aktivní pole. Pole se nesynchronizuje pokud je aktivně editováno. Toto je KRITICKÝ mechanismus — nesmí být narušen.
- **Ref-based tracking:** `prevValuesRef` a `lastPropValuesRef` jsou `useRef` — nepříjemný pattern pro React 19 concurrent mode. Ověřit, že funguje i s `startTransition`.
- **Error path tracking:** `prevErrorPathsRef` je `Set<string>` — efektivní čistění stale errors, ale potenciální problém s deep nested paths.
- **Widget-level `internalValue`:** TextWidget, TextareaWidget a NumberWidget mají vlastní `useState` pro `internalValue` s `useEffect` pro sync z `field.value`. Potenciální zdroj race condition: `useEffect` sync je asynchronní, ale `onChange` handler je synchronní.
- **`form.watch()` subscription (index.tsx ~69):** Emituje `onFieldChange` — musí být dostatečně lehký, aby neblokoval keystroke processing.
- **CustomEvent dispatch:** `handleFieldKeyDown` v widgets dispatchuje `form-key-action` — bubbling event nesmí interferovat se state updates.

### Poučení z retrospektiv

- **Epic 1 (KRITICKÉ):** "State integrity byla průřezovým rizikem. Objevovala se u textových widgetů, date/datetime prvků, Relationship pickeru i callback logiky." — Tato story je přímo zaměřena na systematické ověření a zpevnění.
- **Epic 1:** "Nested data a deep path operace byly podceněné" — ověřit state integrity i pro nested field paths (e.g., `user.address.city`).
- **Epic 2:** "Controlled vs uncontrolled chování se ukázalo jako samostatná disciplína" — ověřit, že `activeTab` programmatic control neruší focus na polích.
- **Epic 3:** "Focus/state integrity zůstává citlivým bodem u async update scénářů" — přesně tato oblast.
- **Epic 3:** "Robustnostní test měl act warning u asynchronního update flow" — zajistit správný `act()` wrapping v testech.

### Testing Standards

- Použít `@testing-library/react` s `userEvent` pro simulaci rychlého psaní.
- Pro async scenarios použít `waitFor` a `act()` s timer-based updates.
- `vitest` je test framework projektu (`vitest.config.ts` v root).
- Testovat s různými latencemi prop updates (0ms, 50ms, 200ms, 500ms).

### Project Structure Notes

- `src/components/ts-web-ui/ts-form/index.tsx` — surgical update effects, error sync, `form.watch()`
- `src/components/ts-web-ui/ts-form/utils.ts` — `getNestedValue`, `setNestedValue`, `deepClone`
- `src/components/ts-web-ui/ts-form/widgets/text-widget.tsx` — `internalValue` pattern reference
- `src/components/ts-web-ui/ts-form/widgets/number-widget.tsx` — locale formatting + cursor
- `src/components/ts-web-ui/ts-form/widgets/date-widget.tsx` — calendar popup + state
- Limit 300 řádků na soubor, žádné `any`, Tailwind v4 přes `cn()`

### References

- [Source: _bmad-output/planning-artifacts/epics-core-layout.md — Story 5.2 AC]
- [Source: _bmad-output/planning-artifacts/architecture.md — State Integrity section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Focus Management]
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2026-03-15.md — state integrity risk]
- [Source: _bmad-output/implementation-artifacts/epic-3-retro-2026-03-18.md — async update warning]
- [Source: src/components/ts-web-ui/ts-form/index.tsx — surgical update pattern lines 97-115]

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List
