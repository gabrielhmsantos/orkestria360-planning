# Chart Theme Variables
> Recharts wrappers should read from the app theme variables instead of assuming a light chart surface

Entry:
- `orkestria360/resources/js/components/modules/chart-panel.tsx`
- `orkestria360/resources/js/components/modules/radar-panel.tsx`
- `orkestria360/resources/js/components/modules/benchmark-radar-panel.tsx`
- `orkestria360/resources/css/app.css`

Flow:
- The app theme is driven by root CSS variables in `resources/css/app.css`, switched by the `.dark` class.
- Recharts wrappers can consume those values directly with strings like `var(--border)`, `var(--muted-foreground)`, `var(--popover)`, and `var(--foreground)`.
- This keeps grids, axis labels, legends, and tooltips aligned with light/dark mode without wiring chart components to `useAppearance()`.

Gotcha:
- `Tooltip` and axis props need explicit inline color values; relying on Recharts defaults leaves dark mode with low-contrast labels and popovers.

Updated: 2026-06-18
