# Story 5.4: Globální interakce (Enter/Escape) a klávesové akce polí

Status: done

## Story

Jako uživatel,
chci ovládat formulář efektivně pomocí klávesnice — Enter pro odeslání, Escape pro zrušení, a pole mohou mít vlastní klávesové akce,
aby moje práce s formulářem byla rychlá a nemusel jsem sahat na myš.

## Acceptance Criteria (BDD)

1. **AC1 — Enter → submit (globální):** Stisk Enter v jednořádkovém poli (text, number, date, select) vyvolá odeslání formuláře (najde submit button nebo první button). Pokud pole NEMÁ vlastní `enterAction`, Enter se chová jako globální submit.
2. **AC2 — Enter → custom action (per field):** Pokud pole definuje `enterAction: "myAction"`, stisk Enter vyvolá `onAction("myAction", data)` MÍSTO globálního submitu. Speciální akce `"focus:next"` přesouvá focus na další pole v tab order.
3. **AC3 — Escape → cancel (globální):** Stisk Escape v jakémkoliv poli vyvolá akci `"cancel"` přes `onAction`. Pokud pole NEMÁ `escapeAction`, Escape se chová jako globální cancel.
4. **AC4 — Escape → custom action (per field):** Pokud pole definuje `escapeAction: "clear"`, stisk Escape vymaže hodnotu pole. Pro `escapeAction: "myAction"` se vyvolá `onAction("myAction", data)`.
5. **AC5 — Textarea exception:** V textarea poli Enter vkládá nový řádek. Ctrl+Enter/Cmd+Enter provede akci (submit nebo custom enterAction). Escape funguje normálně.
6. **AC6 — Scope isolation:** Keyboard events jsou scope-ované na formulář — Enter v jednom formuláři nespouští submit jiného formuláře na stránce.
7. **AC7 — Widget pokrytí:** enterAction/escapeAction funguje na: text, textarea, password, number, date, datetime, combobox, select, relationship. Widgety bez textového vstupu (checkbox, switch, radio, slider, button-group) NEMAJÍ enterAction/escapeAction.

## Tasks / Subtasks

- [ ] Task 1: Audit stávající keyboard implementace (AC: #1–#6)
  - [ ] 1.1: Analyzovat `handleFieldKeyDown` v utils.ts — ověřit kompletnost logiky pro Enter/Escape
  - [ ] 1.2: Analyzovat `handleKeyAction` event listener v index.tsx — ověřit submit/cancel/custom action dispatch
  - [ ] 1.3: Projít všech 22 widgetů — které volají `handleFieldKeyDown` a které ne
  - [ ] 1.4: Ověřit textarea exception — `isTextarea` check + Ctrl/Meta modifier

- [ ] Task 2: Implementace chybějících keyboard handlerů (AC: #2, #4, #7)
  - [ ] 2.1: Pro widgety, které NEMAJÍ `onKeyDown` s `handleFieldKeyDown`, přidat handler pokud mají nativní input (date, datetime, combobox, select, relationship)
  - [ ] 2.2: Ověřit, že `enterAction` a `escapeAction` jsou předány z `TsFieldBase` přes `commonProps` → widget
  - [ ] 2.3: Implementace `focus:next` akce — nalezení dalšího tabbable elementu v rámci formuláře

- [ ] Task 3: Globální Enter/Escape fallback (AC: #1, #3)
  - [ ] 3.1: Pokud pole nemá vlastní `enterAction`, Enter má defaultně triggernout submit — ověřit, že `handleKeyAction` v index.tsx toto správně handluje
  - [ ] 3.2: Pokud pole nemá vlastní `escapeAction`, Escape má defaultně triggernout cancel — ověřit dispatch
  - [ ] 3.3: Ověřit, že Enter na poli s `enterAction: "submit"` a Enter na poli bez `enterAction` se chovají identicky

- [ ] Task 4: Scope isolation (AC: #6)
  - [ ] 4.1: Ověřit, že `form-key-action` CustomEvent nemá `composed: true` — event nesmí překonat shadow DOM nebo form boundary
  - [ ] 4.2: Ověřit, že event listener v index.tsx je přidán na `formRef.current`, ne na `document`
  - [ ] 4.3: Test — dva TsForm na jedné stránce, Enter v jednom nespouští druhý

- [ ] Task 5: Testy (AC: #1–#7)
  - [ ] 5.1: Unit test — `handleFieldKeyDown` dispatchuje správný CustomEvent pro Enter/Escape
  - [ ] 5.2: Integrační test — Enter v text poli bez enterAction → submit
  - [ ] 5.3: Integrační test — Enter v text poli s `enterAction: "search"` → onAction("search")
  - [ ] 5.4: Integrační test — Escape v text poli s `escapeAction: "clear"` → pole je prázdné
  - [ ] 5.5: Integrační test — Ctrl+Enter v textarea → submit
  - [ ] 5.6: Integrační test — `focus:next` přesouvá focus na další pole
  - [ ] 5.7: Test — scope isolation: dva formuláře, Enter v jednom neovlivní druhý

## Dev Notes

### Architektonické vzory a omezení

- **Existující implementace je z ~80% hotová:** `handleFieldKeyDown` v `utils.ts` již implementuje Enter/Escape dispatch přes CustomEvent. `handleKeyAction` listener v `index.tsx` zpracovává `form-key-action` eventy a volá `executeAction`. Tato story primárně AUDITUJE a DOPLŇUJE pokrytí na všechny widgety.
- **CustomEvent flow:** Widget → `handleFieldKeyDown` → `CustomEvent("form-key-action")` s `{key, action, field, value}` → bubbles to form → `handleKeyAction` listener → `executeAction(action, data)`.
- **`commitValue` parameter:** V `handleFieldKeyDown` se může předat aktuální hodnota pole — důležité pro race condition prevention (hodnota je commitnuta do `form.setValue` PŘED action dispatch).
- **Focus:next implementace (index.tsx ~228):** Existuje — hledá další tabbable input přes `querySelectorAll`. Ověřit, že přeskakuje disabled a hidden elementy.
- **Textarea guard:** `handleFieldKeyDown` kontroluje `e.currentTarget.tagName === "TEXTAREA"` — Enter bez Ctrl/Meta se ignoruje (nový řádek). S Ctrl/Meta se provede akce.
- **Scope:** Listener na `formRef.current` zajišťuje scope isolation. `CustomEvent` má `bubbles: true` ale listener je na form elementu — bezpečné.

### Widgety vyžadující audit keyboard handlerů

| Widget             | Má handleFieldKeyDown? | enterAction/escapeAction relevantní? |
| ------------------ | ---------------------- | ------------------------------------ |
| TextWidget         | ✅ ANO                 | ✅ ANO                               |
| TextareaWidget     | ✅ ANO (s Ctrl guard)  | ✅ ANO                               |
| NumberWidget       | ? AUDIT                | ✅ ANO                               |
| DateWidget         | ? AUDIT                | ✅ ANO (calendar popup)              |
| DateTimeWidget     | ? AUDIT                | ✅ ANO                               |
| SelectWidget       | ? AUDIT                | ⚠️ ČÁSTEČNĚ (Enter otevírá dropdown) |
| ComboboxWidget     | ? AUDIT                | ✅ ANO                               |
| MultiSelectWidget  | ? AUDIT                | ⚠️ ČÁSTEČNĚ                          |
| RelationshipWidget | ? AUDIT                | ✅ ANO                               |
| SliderWidget       | ❌ NE                  | ❌ NE (nativní slider arrows)        |
| CheckboxWidget     | ❌ NE                  | ❌ NE (Space toggle)                 |
| SwitchWidget       | ❌ NE                  | ❌ NE (Space toggle)                 |
| RadioWidget        | ❌ NE                  | ❌ NE (Arrow keys)                   |
| ButtonGroupWidget  | ❌ NE                  | ❌ NE                                |
| FileWidget         | ? AUDIT                | ⚠️ ČÁSTEČNĚ                          |

### Poučení z retrospektiv

- **Epic 1:** "Sjednocení API přes `onAction` a `onFieldChange` zlepšilo integrační kontrakt" — keyboard akce musí respektovat tento sjednocený pattern.
- **Epic 1:** "State integrity byla průřezovým rizikem" — ověřit, že keyboard event handling nezpůsobuje focus loss nebo race conditions.
- **Epic 3:** "Sdílené utility pro nested paths a filtraci dat drží konzistentní chování celého formuláře" — keyboard akce musí používat `filterExcludeFromSubmit` při dispatch dat.
- **Epic 4:** "Guard-first pattern" — ověřit, že keyboard handlers mají guardy (disabled pole, readonly pole nemají keyboard akce).

### Project Structure Notes

- `src/components/ts-web-ui/ts-form/utils.ts` — `handleFieldKeyDown()` (~286+)
- `src/components/ts-web-ui/ts-form/index.tsx` — `handleKeyAction` event listener (~200+)
- `src/components/ts-web-ui/ts-form/types.ts` — `TsFieldBase.enterAction`, `TsFieldBase.escapeAction`
- `src/components/ts-web-ui/ts-form/widgets/*.tsx` — 22 widget souborů (audit onKeyDown propojení)
- Limit 300 řádků na soubor, žádné `any`, Tailwind v4 přes `cn()`

### References

- [Source: _bmad-output/planning-artifacts/prd.md — FR11, FR26]
- [Source: _bmad-output/planning-artifacts/epics-core-layout.md — Story 5.4 AC]
- [Source: _bmad-output/planning-artifacts/architecture.md — Keyboard Interaction section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Keyboard Interaction Patterns]
- [Source: src/components/ts-web-ui/ts-form/utils.ts — handleFieldKeyDown implementation]
- [Source: src/components/ts-web-ui/ts-form/index.tsx — handleKeyAction listener]
- [Source: _bmad-output/implementation-artifacts/epic-1-retro-2026-03-15.md — unified API]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (GitHub Copilot)

### Debug Log References

Adversarial review ověřil `handleFieldKeyDown` a `handleKeyAction` flow, CustomEvent scoping, textarea Ctrl/Meta guard, focus:next implementaci. Žádné problémy nalezeny v keyboard systému.

### Completion Notes List

- `handleFieldKeyDown` v utils.ts dispatchuje `form-key-action` CustomEvent s `{key, action, field, value}`
- Default akce: Enter → "submit", Escape → "cancel" (přepisitelné přes `enterAction`/`escapeAction`)
- Textarea exception: Enter = nový řádek, Ctrl/Cmd+Enter = akce
- `focus:next` akce nalezne další tabbable element přes `querySelectorAll`
- Event listener na `formRef.current` zajišťuje scope isolation (ne na document)
- CustomEvent nemá `composed: true` — nepřekračuje form boundary
- ReadOnly pole blokují keyboard dispatch (guard v `handleFieldKeyDown`)
- `dispatchFormAction` helper v utils.ts centralizuje akční dispatch
- Testy v stories-5.test.tsx pokrývají Enter, Escape, custom akce i scope isolation

### File List

- src/components/ts-web-ui/ts-form/utils.ts
- src/components/ts-web-ui/ts-form/index.tsx
- src/components/ts-web-ui/ts-form/types.ts
- src/components/ts-web-ui/ts-form/widgets/text-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/textarea-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/number-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/date-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/datetime-widget.tsx
- src/components/ts-web-ui/ts-form/stories-5.test.tsx
