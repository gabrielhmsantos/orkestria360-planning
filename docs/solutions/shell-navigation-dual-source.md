# Shell navigation dual source

The visible sidebar uses `orkestria360/resources/js/lib/orkestria-navigation.ts`; `HandleInertiaRequests.php` mirrors the tree as `shellNavigation` for the page contract. When releasing a submodule, add its `href` in both places and cover the shared contract in `tests/Feature/AppShellTest.php`.
