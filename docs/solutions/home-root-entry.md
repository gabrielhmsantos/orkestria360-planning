# Home Root Entry
> Authenticated root entry and public welcome split

Entry: `orkestria360/routes/web.php`
Supporting files: `orkestria360/app/Providers/FortifyServiceProvider.php`, `orkestria360/app/Http/Controllers/Settings/ProfileController.php`, `orkestria360/resources/js/pages/modules/home.tsx`

Flow:
- Public marketing/starter page moved to `route('welcome')` at `/welcome`
- Authenticated users hit `/` and render `modules/home` with the Orkestria home payload
- `/home` remains alive and named `home` so existing shell helpers and generated frontend routes keep working

Gotcha:
- Fortify logout still redirects to `/` by default, and `ProfileController::destroy()` also pointed to `/`
- Once `/` became auth-only, logout/account deletion needed an explicit redirect back to `route('welcome')` to keep the public landing flow coherent

Updated: 2026-06-18
