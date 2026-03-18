# Story 2.2: Refaktoring systému záložek (Tabs) pro Tailwind v4

Status: done

## Story

As a developer,
I want to refactor the tabs system in TsForm to fully utilize Shadcn/UI and Tailwind v4,
so that the navigation is consistent with the design system and performs smoothly.

## Acceptance Criteria

1. **Shadcn/UI Integration**: Ensure `TsFormLayout` uses the `Tabs` components from `@/components/ui/tabs` correctly, following the project's standard patterns. [x]
2. **Tailwind v4 Styling**: All custom classes and overrides for tabs (list, triggers, content) are migrated to idiomatic Tailwind v4 utilities. [x]
3. **Scrollable Tabs**: The tab list remains scrollable on mobile/narrow containers without breaking the layout (verify `overflow-x-auto` and scrollbar handling). [x]
4. **Consistency**: The look and feel of tabs matches the rest of the application's UI components. [x]
5. **Smooth Transitions**: Switching between tabs is instantaneous and does not cause layout shifts. [x]

## Tasks / Subtasks

- [x] Audit `TsFormLayout.tsx` for any non-standard tab styling (AC: #1, #2)
- [x] Refactor `TabsList` and `TabsTrigger` classes to use Tailwind v4 standards (AC: #2)
- [x] Ensure `scrollbar-hidden` or equivalent is correctly implemented in Tailwind v4 (AC: #3)
- [x] Test tab switching with different content heights to verify stability (AC: #5)
- [x] Verify responsive behavior of the tab list (AC: #3)
- [x] [AI-Review] Fix `onTabChange` to emit index when `activeTab` is a number
- [x] [AI-Review] Remove hardcoded `min-w-[100px]` from `TabsTrigger`
- [x] [AI-Review] Remove redundant `px-1` from grid rows
- [x] [AI-Review] Clean up unused `data-active-tab-error` attribute
- [x] [AI-Review] Add missing `scrollbar-hidden` to `TabsList`
- [x] [AI-Review] Fix grid column syntax from `grid-cols-(--grid-cols)` to `[grid-template-columns:var(--grid-cols)]`
- [x] [AI-Review] Add fallback for `activeTab` string value validation

## Dev Notes

- **File to modify**: `src/components/ts-web-ui/ts-form/ts-form-layout.tsx`
- **UI Component**: `src/components/ui/tabs.tsx`
- **Current Observation**: The layout already uses Shadcn/UI Tabs, but needs verification for Tailwind v4 best practices and potential "legacy" classes from the porting phase.
- **Scrollbar handling**: Tailwind v4 might need specific setup for `scrollbar-hidden` if it's not a standard utility. Check `globals.css`.

### Project Structure Notes

- Keep tab logic within `TsFormLayout`.
- Do not modify the base `ui/tabs.tsx` unless absolutely necessary for global consistency.

### References

- [Source: src/components/ts-web-ui/ts-form/ts-form-layout.tsx]
- [Component: src/components/ui/tabs.tsx]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

### File List

- src/components/ts-web-ui/ts-form/ts-form-layout.tsx

## Senior Developer Review (AI)

- [x] **AC Validation**: All acceptance criteria are fully implemented.
- [x] **Task Audit**: All tasks marked [x] are confirmed to be done.
- [x] **Code Quality**: Implementation follows Shadcn/UI patterns and utilizes Tailwind v4 idiomatic syntax.
- [x] **Test Quality**: Manual verification confirmed smooth transitions and scrollable behavior.

**Outcome: APPROVED**
The implementation is clean, robust, and correctly addresses all previous code review findings. The tabs system is now fully modernized and scroll-friendly.

_Reviewer: Gemini CLI on 2026-03-15 (Follow-up Review)_
