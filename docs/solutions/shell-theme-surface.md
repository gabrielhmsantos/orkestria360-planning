# Shell Theme Surface
> The authenticated shell uses AppSidebarHeader, not the older AppHeader, as the primary header surface

Entry:
- `orkestria360/resources/js/layouts/app/app-sidebar-layout.tsx`

Supporting files:
- `orkestria360/resources/js/components/app-sidebar-header.tsx`
- `orkestria360/resources/js/hooks/use-appearance.tsx`
- `orkestria360/resources/js/components/appearance-tabs.tsx`
- `orkestria360/resources/js/app.tsx`

Flow:
- The authenticated app layout renders `AppSidebarHeader` above module pages inside `AppSidebarLayout`
- Theme initialization happens globally in `resources/js/app.tsx` via `initializeTheme()`
- Theme persistence and `.dark` application live in `use-appearance.tsx`
- Any milestone work that adds a theme toggle to the live product shell should target `AppSidebarHeader`, not the legacy `AppHeader`

Gotcha:
- `AppHeader` still exists in the repo, but it is not the header mounted by the default authenticated layout used by module pages

Updated: 2026-06-18
