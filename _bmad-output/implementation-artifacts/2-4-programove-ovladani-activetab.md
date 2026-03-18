# Story 2.4: Programové ovládání activeTab

Status: done

## Story

As an integrator,
I want to control the active tab of the TsForm programmatically via an `activeTab` property,
so that I can synchronize the form's state with other parts of my application (e.g., external navigation or validation jumps).

## Acceptance Criteria

1. **New Property**: `TsForm` and `TsFormLayout` accept an `activeTab` prop (supporting both index as `number` or label as `string`).
2. **Controlled Component**: The `Tabs` component in `TsFormLayout` becomes a controlled component when `activeTab` is provided.
3. **Synchronized State**: Changing the `activeTab` prop externally immediately switches the visible tab in the form.
4. **Internal Navigation**: User interaction with tabs still works correctly and updates the internal state if needed (or emits an event).
5. **Zero Regression**: Default behavior (first tab active) remains if no `activeTab` is provided.

## Tasks / Subtasks

- [x] Update `TsFormProps` in `src/components/ts-web-ui/ts-form/types.ts` to include `activeTab` (AC: #1)
- [x] Implement controlled `value` logic in `TsFormLayout.tsx` (AC: #2, #3)
- [x] Add `onTabChange` or similar internal tracking to handle both programmatic and user-driven changes (AC: #4)
- [x] Verify that switching tabs programmatically correctly triggers the visual transition (AC: #3)
- [x] Test with both index-based and label-based tab identification if possible (AC: #1)
- [x] Fix regression: Ensure uncontrolled mode works when `activeTab` prop is missing (AI-Review)
- [x] Fix: Synchronize `internalActiveTab` when `layout.tabs` changes dynamically (AI-Review)

## Dev Notes

- **File to modify**:
  - `src/components/ts-web-ui/ts-form/types.ts` (prop definition)
  - `src/components/ts-web-ui/ts-form/index.tsx` (passing prop)
  - `src/components/ts-web-ui/ts-form/ts-form-layout.tsx` (implementation)
- **Controlled Tabs**: Radix `Tabs` uses `value` and `onValueChange` for controlled mode.

### Project Structure Notes

- Ensure `activeTab` support is consistent across the layout engine.

### References

- [Source: src/components/ts-web-ui/ts-form/types.ts]
- [Reference: reference-tswebui/packages/ts-form/src/ts-form.js#switchTab]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

- Added `activeTab` and `onTabChange` to `TsFormProps`.
- `TsFormLayout` now handles both controlled (via `activeTab` prop) and uncontrolled (via `internalActiveTab` state) modes.
- Added `useEffect` in `TsFormLayout` to sync `internalActiveTab` if current selection becomes invalid after layout change.
- `onTabChange` returns index if `activeTab` was numeric, or label string otherwise.

### File List

- src/components/ts-web-ui/ts-form/types.ts
- src/components/ts-web-ui/ts-form/index.tsx
- src/components/ts-web-ui/ts-form/ts-form-layout.tsx
