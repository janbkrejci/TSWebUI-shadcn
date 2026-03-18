# Story 2.1: Refaktoring mřížkového systému (Rows/Columns) pro Tailwind v4

Status: done

## Story

As a developer,
I want to refactor the grid layout system to use Tailwind v4 utility classes,
so that the codebase is modern, maintainable, and visually consistent with the reference implementation.

## Acceptance Criteria

1. **Tailwind v4 Utility Migration**: Inline styles for `grid-template-columns` in `TsFormLayout` are replaced with Tailwind v4 utilities (using arbitrary values or CSS variables).
2. **Visual Parity**: The resulting grid layout matches the reference implementation (spacing, alignment, column widths) 100%.
3. **Dynamic Width Support**: The system correctly handles dynamic column widths defined in the JSON (e.g., "1fr", "200px", "2fr") using Tailwind's arbitrary value support or CSS variables.
4. **Clean Code**: No hardcoded inline `style={{ gridTemplateColumns: ... }}` remains in the JSX for grid layout.
5. **Responsive Design**: The grid maintains its integrity across different container widths.

## Tasks / Subtasks

- [x] Analyze current `TsFormLayout.tsx` grid implementation (AC: #1)
- [x] Implement CSS variable based grid columns in `TsFormLayout.tsx` (AC: #1, #3, #4)
  - [x] Use `grid-cols-[var(--grid-cols)]` pattern or similar Tailwind v4 native approach.
- [x] Verify spacing and gap alignment with Tailwind v4 `gap-4` (AC: #2)
- [x] Test with various layout configurations (mixed widths, auto-columns) (AC: #3)
- [x] Compare rendering with `reference-tswebui` to ensure regression parity (AC: #2)

## Dev Notes

- **Tailwind v4 Arbitrary Values**: V4 supports even more flexible arbitrary values. Using `grid-cols-(--grid-cols)` for native v4 syntax.
- **Alignment Support**: Implemented `TsRowItem.align` support (left, center, right) by wrapping fields in a flex container.
- **Tab Error Logic**: Fixed tab error indicators to correctly ignore hidden fields.
- **File to modify**: `src/components/ts-web-ui/ts-form/ts-form-layout.tsx`
- **Reference**: Check `reference-tswebui/packages/ts-form/src/ts-form.js` (search for `form-row` class) for original styling logic.
- **Current Pattern**:
  ```tsx
  <div className="grid gap-4 items-start grid-cols-(--grid-cols) px-1" style={{ "--grid-cols": gridTemplateColumns } as React.CSSProperties}>
  ```

### Project Structure Notes

- Keep the layout logic inside `ts-form-layout.tsx`.
- Ensure `visibleItems` filtering logic remains intact to avoid grid gaps for hidden fields.

### References

- [Source: src/components/ts-web-ui/ts-form/ts-form-layout.tsx]
- [Reference: reference-tswebui/packages/ts-form/src/ts-form.js#renderRows]

## Dev Agent Record

### Agent Model Used

gemini-2.0-flash

### Debug Log References

### Completion Notes List

### File List

- src/components/ts-web-ui/ts-form/ts-form-layout.tsx
- src/components/ts-web-ui/ts-form/index.tsx
- src/components/ts-web-ui/ts-form/ts-form-field.tsx
- src/components/ts-web-ui/ts-form/types.ts
- src/components/ts-web-ui/ts-form/widget-types.ts
