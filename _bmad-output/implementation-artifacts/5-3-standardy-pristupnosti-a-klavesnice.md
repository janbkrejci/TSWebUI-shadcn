# Story 5.3: Standardy přístupnosti a klávesnice (A11y)

Status: ready-for-dev

## Story

Jako uživatel,
chci, aby formulář plně respektoval standardy přístupnosti Shadcn/UI a WCAG 2.1 AA,
aby byl formulář ovladatelný klávesnicí, čitelný screen readery a vizuálně konzistentní v indikaci stavů.

## Acceptance Criteria (BDD)

1. **AC1 — Tab order:** Pole formuláře mají logické pořadí při tabování (Tab/Shift+Tab), odpovídající pořadí v layout definici (řádky shora dolů, sloupce zleva doprava). Skrytá pole (`hidden: true`) a readonly pole jsou přeskočena (`tabIndex: -1`).
2. **AC2 — Focus visibility:** Každý interaktivní element má jasně viditelný focus ring (outline) splňující WCAG 2.1 kontrast požadavky (minimálně 3:1 poměr oproti okolí). Focus ring musí být viditelný v light i dark mode.
3. **AC3 — ARIA atributy:** Všechny widgety mají správné ARIA atributy: `aria-invalid` při chybě, `aria-required` u povinných polí, `aria-readonly` v readonly režimu, `aria-describedby` pro hint/error asociace.
4. **AC4 — Screen reader:** Error hlášky jsou oznámeny screen readeru — `role="alert"` nebo `aria-live="polite"` na error kontejneru. Labely jsou asociovány s inputy přes `htmlFor`/`id`.
5. **AC5 — Color-not-sole-indicator:** Chybový stav pole NEPOUŽÍVÁ pouze barvu jako indikátor — musí obsahovat text hlášky a/nebo ikonu. Platí i pro tab error dots.
6. **AC6 — Keyboard trap prevention:** Žádný widget nevytváří keyboard trap — z každého elementu je možné odejít pomocí Tab/Shift+Tab/Escape.

## Tasks / Subtasks

- [ ] Task 1: Audit tab order (AC: #1)
  - [ ] 1.1: Ověřit, že hidden pole (`hidden: true`) nejsou v tab chain — `TsFormField` vrací prázdný fragment
  - [ ] 1.2: Ověřit, že readonly pole mají `tabIndex: -1` — audit všech 22 widgetů
  - [ ] 1.3: Ověřit, že tab order v multi-tab layoutu respektuje viditelnou záložku — pole na skrytých tabs nejsou tabbable
  - [ ] 1.4: Test — formulář s 3 záložkami, Tab prochází pouze pole na aktivní záložce

- [ ] Task 2: Audit focus visibility (AC: #2)
  - [ ] 2.1: Zkontrolovat Shadcn/UI default focus ring na Input, Select, Textarea, Checkbox, Switch, Radio
  - [ ] 2.2: Ověřit focus ring v dark mode — kontrast 3:1
  - [ ] 2.3: Ověřit, že custom widgety (relationship picker, combobox popper, date calendar) mají viditelný focus ring
  - [ ] 2.4: Opravit chybějící focus styly pokud nalezeny

- [ ] Task 3: Audit a oprava ARIA atributů (AC: #3, #4)
  - [ ] 3.1: Audit všech 22 widgetů — tabulka: widget → aria-invalid → aria-required → aria-readonly → aria-describedby
  - [ ] 3.2: Ověřit, že `FormMessage` v `ts-form-field.tsx` má `role="alert"` nebo `aria-live`
  - [ ] 3.3: Ověřit label asociace: `FormLabel` → `htmlFor` → `Input.id` chain přes `sanitizeId(name)`
  - [ ] 3.4: Pro widgety bez externího labelu (checkbox, switch, infobox) — ověřit `aria-label` propagaci
  - [ ] 3.5: Opravit chybějící `aria-describedby` propojení hint/error zprávy s inputem

- [ ] Task 4: Color-not-sole-indicator audit (AC: #5)
  - [ ] 4.1: Ověřit, že error state na poli obsahuje text message (ne jen červený border)
  - [ ] 4.2: Ověřit tab error dots — kromě červené barvy přidat vizuální indikátor (tooltip nebo sr-only text)
  - [ ] 4.3: Ověřit, že required field indicator (`*`) má sr-only alternativu

- [ ] Task 5: Keyboard trap prevention (AC: #6)
  - [ ] 5.1: Test — z combobox/select dropdown lze odejít Escape → focus se vrátí na trigger
  - [ ] 5.2: Test — z date calendar popup lze odejít Escape → focus se vrátí na date input
  - [ ] 5.3: Test — z relationship picker popup lze odejít Escape → focus se vrátí na trigger
  - [ ] 5.4: Test — Tab z posledního pole formuláře opustí formulář (ne loop zpět na první pole)

- [ ] Task 6: Testy (AC: #1–#6)
  - [ ] 6.1: Test — tab order odpovídá layout definici
  - [ ] 6.2: Test — hidden a readonly pole přeskočena při tabování
  - [ ] 6.3: Test — ARIA atributy přítomny na widgetech s chybou/required/readonly
  - [ ] 6.4: Test — error message má role="alert" nebo aria-live

## Dev Notes

### Architektonické vzory a omezení

- **Shadcn/UI Radix primitives:** Většina a11y je handled by Radix under the hood — Select, Checkbox, Switch, RadioGroup, Dialog, Popover. Audit se zaměřuje na to, že jsme Radix API použili správně.
- **FormLabel/FormControl/FormMessage:** Shadcn `<Form>` wrapper automaticky asociuje label→input přes context. Ověřit, že `FormField` → `FormItem` → `FormLabel` + `FormControl` chain funguje pro všechny typy widgetů.
- **`sanitizeId(name)`:** Utility v `utils.ts` generuje HTML-safe ID z field name (včetně tečkové notace pro nested). Ověřit, že výsledné ID je unikátní a validní.
- **Tab error dots:** V `ts-form-layout.tsx` — červená tečka u záložky s chybou. Přidat `title` nebo `aria-label` na dot element.
- **WIDGETS_WITHOUT_EXTERNAL_LABEL set:** V `ts-form-field.tsx` — checkbox, switch, infobox, button, separator, empty, markdown. Tyto widgety musí mít `aria-label` z `commonProps`.

### Poučení z retrospektiv

- **Epic 1:** "Vizuální a a11y konzistence widgetů nebyla dostatečně chráněna při první implementaci. Review opakovaně vracelo `aria-invalid`, error styles a správné ID."
- **Epic 1:** "Widget konzistence potřebuje sdílený standard pro error UI, readonly chování, ID sanitizaci a a11y atributy."
- **Epic 2:** "Story 2.3 přinesla nejlepší ukázku cíleného zpevnění: optimalizace složitosti, doplnění testů a dotažení accessibility detailů."
- **Epic 4:** "Insert column button byl zpočátku přístupný pouze myší — keyboard-only uživatelé tlačítko neviděli. Opraveno přidáním `group-focus-within:opacity-100`."
- **Epic 4:** "Explicitně kontrolovat keyboard accessibility u všech nových interaktivních elementů."

### Project Structure Notes

- `src/components/ts-web-ui/ts-form/ts-form-field.tsx` — `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, label/error slots
- `src/components/ts-web-ui/ts-form/ts-form-layout.tsx` — tab rendering, tab error dots
- `src/components/ts-web-ui/ts-form/widgets/*.tsx` — 22 widget souborů (audit ALL for ARIA)
- `src/components/ts-web-ui/ts-form/utils.ts` — `sanitizeId()`, `getFieldClasses()`
- `src/components/ui/form.tsx` — Shadcn Form wrapper (Radix-based label→input association)
- Limit 300 řádků na soubor, žádné `any`, Tailwind v4 přes `cn()`

### References

- [Source: _bmad-output/planning-artifacts/epics-core-layout.md — Story 5.3 AC]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Accessibility Standards, WCAG 2.1 AA]
- [Source: _bmad-output/planning-artifacts/architecture.md — Semantic HTML, ARIA attributes]
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2026-03-15.md — a11y konzistence widgetů]
- [Source: _bmad-output/implementation-artifacts/epic-4-retro-2026-03-19.md — keyboard accessibility akční položky]
- [Source: src/components/ts-web-ui/ts-form/ts-form-field.tsx — WIDGETS_WITHOUT_EXTERNAL_LABEL]

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List
