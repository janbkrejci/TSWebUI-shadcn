# Story 2.5: Implementace mřížkového zarovnání (Top-aligned inputs)

Status: done

## Story

As a user,
I want all input fields in a single row to have their top edges aligned horizontally,
so that the form layout looks professional and is easy to scan visually.

## Acceptance Criteria

1. **Top Edge Alignment**: Regardless of label length (1 line vs 2 lines) or presence of error messages, the actual input elements (widgets) in the same row must have their top edges horizontally aligned.
2. **Fixed Slots**: The implementation uses fixed-height slots (or a synchronized sub-grid approach) for Labels and Error/Hint messages to maintain a consistent visual rhythm.
3. **Empty Slot Handling**: If a field has no label, it still reserves the "label slot" height to ensure alignment with neighboring fields that DO have labels.
4. **Error Message Stability**: Appearance of an error message below one field does not shift the vertical position of inputs in the same row.
5. **Responsive Integrity**: Alignment persists across different screen sizes as long as fields remain in the same row.

## Tasks / Subtasks

- [x] Audit `TsFormField.tsx` current `min-h` slots for labels and errors (AC: #1, #2)
- [x] Implement a more robust "fixed slot" system for labels (standardized on `min-h-14` / 56px to accommodate up to 3 lines) (AC: #2, #3, AI-Review)
- [x] Ensure `FormControl` wrapper in `TsFormField` is the alignment anchor for the row (AC: #1)
- [x] Verify that fields without labels (like buttons or checkboxes) correctly reserve space or align appropriately (AC: #3)
- [x] Update `CheckboxWidget` and `SwitchWidget` to use matching `min-h-9` internal containers for top-alignment with inputs (AC: #1, AI-Review)
- [x] Fix: Increase error slot to `min-h-7` to support 2-line messages without layout shift (AI-Review)
- [x] Test with a "torture test" row: one field with long label, one with no label, one with long error, one with multi-line hint (AC: #1, #4)

## Dev Notes

- **File to modify**: `src/components/ts-web-ui/ts-form/ts-form-field.tsx`
- **Updated implementation**:
  - Label slot increased to `min-h-14` to support 3 lines (~56px).
  - Error slot increased to `min-h-7` (~28px).
  - `CheckboxWidget` and `SwitchWidget` adjusted to `min-h-9` (36px) to match standard `Input` height, ensuring the actual controls align perfectly across the row.

### Project Structure Notes

- Keep changes within `TsFormField.tsx` to ensure all widgets benefit from the alignment system automatically.

### References

- [Source: src/components/ts-web-ui/ts-form/ts-form-field.tsx]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

- Implemented fixed-height slots for labels (`min-h-14`) and errors (`min-h-7`) in `TsFormField`.
- Standardized `CheckboxWidget` and `SwitchWidget` height to `min-h-9` to align with `TextWidget` inputs.
- Verified that top-edge alignment is maintained even with varying label lengths and error states.

### File List

- src/components/ts-web-ui/ts-form/ts-form-field.tsx
- src/components/ts-web-ui/ts-form/widgets/checkbox-widget.tsx
- src/components/ts-web-ui/ts-form/widgets/switch-widget.tsx
