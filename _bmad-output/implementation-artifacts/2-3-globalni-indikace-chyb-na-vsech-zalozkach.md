# Story 2.3: Globální indikace chyb na všech záložkách (Tab Error Dots)

Status: done

## Story

As a user,
I want to see a clear error indicator on any tab that contains fields with errors,
so that I can quickly identify and fix issues across the entire form without checking each tab manually.

## Acceptance Criteria

1. **Error Detection**: The system correctly identifies tabs containing at least one field with an error (either from RHF `errors` or definitions). [x]
2. **Visual Indicator (Dot)**: A red dot (or equivalent visual indicator) is displayed on the tab trigger for any tab with errors. [x]
3. **Active Tab Feedback**: If the currently active tab has errors, the active indicator (the underline/background) should also reflect an error state (e.g., changing to red/destructive color) for maximum visibility, matching the reference implementation's behavior. [x]
4. **Real-time Updates**: The error indicators update immediately as fields are validated or as the `errors` prop changes. [x]
5. **No Performance Regression**: The error detection logic is efficient and does not slow down the form rendering even with many fields and tabs. [x]

## Tasks / Subtasks

- [x] Review current `hasError` detection logic in `TsFormLayout.tsx` (AC: #1)
- [x] Ensure the error dot is correctly positioned and styled with Tailwind v4 (AC: #2)
- [x] Implement dynamic active indicator styling based on the current tab's error state (AC: #3)
- [x] Verify that error dots appear correctly for both initial errors and runtime validation errors (AC: #4)
- [x] Test with complex multi-tab forms to ensure performance (AC: #5)
- [x] Added comprehensive tests in `ts-form.test.tsx` for tab error indicators and performance (AI-Review Follow-up)
- [x] Optimized error detection logic using `useMemo` to avoid O(T\*F) traversals in the render loop (AI-Review Follow-up)
- [x] Removed redundant `data-active-tab-error` attribute and consolidated active tab error styling (AI-Review Follow-up)

## Dev Notes

- **File modified**: `src/components/ts-web-ui/ts-form/ts-form-layout.tsx`
- **Performance Optimization**: Error detection results for tabs are now memoized based on `layout.tabs` and `errors` state, ensuring smooth performance even with 50+ tabs.
- **Dynamic Indicators**: Restored enhanced `TabsTrigger` active styles for better visibility when errors are present.
- **Reference Behavior**: Matched `reference-tswebui` behavior by emphasizing active tab error state.

### Project Structure Notes

- Error detection remains centralized in `TsFormLayout.tsx` using a memoized `hasFieldAnyError` helper and a per-tab `useMemo` map.

### References

- [Source: src/components/ts-web-ui/ts-form/ts-form-layout.tsx]
- [Reference: reference-tswebui/packages/ts-form/src/ts-form.js]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

- Implemented red pulsing dots for tabs with errors.
- Added high-visibility active tab styling (`bg-destructive/15`) when the active tab contains errors.
- Verified real-time updates and performance with 50+ tabs/fields in automated tests.
- **Post-Review Improvements**: Refactored logic to eliminate O(T\*F) complexity in the render loop, removed dead code, and added ARIA attributes for better accessibility (`aria-invalid`, `aria-hidden`).

### File List

- src/components/ts-web-ui/ts-form/ts-form-layout.tsx
- src/components/ts-web-ui/ts-form/ts-form.test.tsx
