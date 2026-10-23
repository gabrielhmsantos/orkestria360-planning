# Module Page Pattern
> Orkestria module pages follow a server-defined payload + typed frontend contract pattern

Entry:
- `orkestria360/routes/web.php`

Supporting files:
- `orkestria360/resources/js/pages/modules/*.tsx`
- `orkestria360/resources/js/data/modules/*.ts`
- `orkestria360/tests/TestCase/ModulePageTestCase.php`
- `orkestria360/tests/Feature/*PageTest.php`

Pattern:
- The authoritative mock payload for module pages is defined in PHP route closures inside `orkestria360/routes/web.php`
- Frontend files under `resources/js/data/modules/*.ts` describe the TypeScript contract consumed by the page and expose display helpers such as tone/label mappers
- Each page under `resources/js/pages/modules/*.tsx` receives a single `data` prop from Inertia and composes shared widgets like `PageScaffold`, `MetricCard`, `ScoreCard`, `ChartPanel`, `RecommendationsList`, and `NextStepCard`
- Feature coverage for modules should extend `Tests\TestCase\ModulePageTestCase` to reuse guest redirect, authenticated access, and shared prop assertions

Gotcha:
- Some modules may already have placeholder TS files or `Route::inertia(...)` entries without a real payload; before building the UI, confirm the PHP route actually provides `data`
- If you create route-local payload closures above the auth group, remember to add them to the `use (...)` list of the route group closure

Updated: 2026-06-18
