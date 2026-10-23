# Module Grid Layout Gotchas
> Summary cards and stacked panels need explicit grid constraints

Entry: `orkestria360/resources/js/pages/modules/*.tsx`

Metric grids beside taller siblings:
- Add `self-start` on the summary grid container
- Seen in `resources/js/pages/modules/certifications.tsx`, `governance.tsx`, `assessment.tsx`, `microsoft-365.tsx`, `productivity.tsx`, `security.tsx`, `azure.tsx`
- Without it, simple metric cards stretch vertically when the adjacent score/chart column is taller

Security stacked panels:
- `resources/js/components/modules/security-risk-panels.tsx`
- Avoid nesting chart + detail card in one grid cell for the 2-column desktop layout
- The nested stack can overflow the row and visually bleed under the next section
- Safer shape: each panel/card is its own grid item; let the info card span both columns if needed

Updated: 2026-06-19
