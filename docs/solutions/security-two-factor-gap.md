# Security Two-Factor Gap
> 2FA tests and code are out of sync

Entry: `orkestria360/resources/js/pages/settings/security.tsx`
Observed:

- feature flags in `orkestria360/config/fortify.php` do not enable two-factor
- controller `orkestria360/app/Http/Controllers/Settings/SecurityController.php:edit()` returns only `passwordRules`
- tests in `orkestria360/tests/Feature/Settings/SecurityTest.php` expect `canManageTwoFactor`, `twoFactorEnabled`, `requiresConfirmation`
- auth test uses `orkestria360/tests/Feature/Auth/AuthenticationTest.php`
- factory hook `orkestria360/database/factories/UserFactory.php:withTwoFactor()` is empty

Meaning:

- starter scaffold left a partial 2FA path in tests/request types
- feature can not be treated as ready just because references exist

Use later:

- decide scope before touching security module
- either remove dormant expectations or implement full Fortify 2FA path

Updated: 2026-06-18
