# Licensing UI surface

`orkestria360/resources/js/pages/modules/licensing.tsx` is the route shell for the seven licensing tabs from the `LicensingPageData` Inertia payload. It owns page metadata, navigation, synchronization status and the eligible-capacity aggregate shared by tabs. Each tab lives under `resources/js/components/modules/licensing/licensing-*-tab.tsx`; filters and selections remain local to the tab that owns them. Shared formatting and metric-card primitives live in `licensing-shared.tsx`.

Licensing must keep technical facts separate from commercial and nominal-data gaps: Assessment-dependent fields use an explicit unavailable state, and user-level data is not rendered in V2. The expected information hierarchy is documented in `discovery/microsoft-365/v2/licenciamento/representacao-estrutural-das-telas.md`.

Since the 2026-08-03 visual refactor, the page shell uses `ModuleHero` and `ModuleTabBar`; KPI grids use `OperationalMetricGrid`/`OperationalKpiCard`; cards use `OperationalSectionCard`; unavailable surfaces use `DataAvailabilityPanel`; and the inventory/dashboard tables use `OperationalTable`. Domain-only components (`LicensingMetricCard`, `LicensingAvailability`, `LicensingFutureAction`) are thin adapters over those contracts or shadcn/ui primitives.
