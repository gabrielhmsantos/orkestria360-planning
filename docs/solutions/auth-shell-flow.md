# Auth Shell Flow
> Laravel web auth into Inertia shell

Entry: `orkestria360/routes/web.php`
Flow: route/middleware in `orkestria360/bootstrap/app.php` -> shared props in `orkestria360/app/Http/Middleware/HandleInertiaRequests.php:share()` -> page bootstrap in `orkestria360/resources/js/app.tsx`

Layouts:

- `welcome` -> no app layout
- `auth/*` -> `orkestria360/resources/js/layouts/auth-layout.tsx`
- `settings/*` -> `orkestria360/resources/js/layouts/app-layout.tsx` + `orkestria360/resources/js/layouts/settings/layout.tsx`
- default authenticated pages -> `orkestria360/resources/js/layouts/app-layout.tsx`

Shell state:

- `auth.user` shared from `orkestria360/app/Http/Middleware/HandleInertiaRequests.php:share()`
- `sidebarOpen` shared from cookie in same middleware
- appearance persisted by `orkestria360/resources/js/hooks/use-appearance.tsx`

Navigation:

- sidebar shell in `orkestria360/resources/js/layouts/app/app-sidebar-layout.tsx`
- header shell in `orkestria360/resources/js/components/app-header.tsx`
- current starter nav still targets dashboard + Laravel links

Updated: 2026-06-18
