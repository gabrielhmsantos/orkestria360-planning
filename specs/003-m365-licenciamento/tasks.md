# Tasks: Licenciamento Microsoft 365 V2

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`.

## Phase 1: Setup

- [X] T001 Review active Microsoft 365 routes and provider seams in `orkestria360/routes/web.php` and `orkestria360/app/Support/Microsoft365/`
- [X] T002 [P] Create licensing TypeScript contracts in `orkestria360/resources/js/types/modules/licensing.ts`
- [X] T003 [P] Create shared licensing state/future-action components in `orkestria360/resources/js/components/modules/licensing-*.tsx`

## Phase 2: Foundational

- [X] T004 Generate Laravel models and migrations for scoped technical entities with `php artisan make:model` in `orkestria360/app/Models/` and `orkestria360/database/migrations/`
- [X] T005 Generate sync command/service seams with `php artisan make:command` in `orkestria360/app/Console/Commands/` and `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T006 Implement TenantContext, tenant-scoped cache keys and sanitized logging in `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T007 Implement paginated SKU/user collection, V2-compatible assignment collection and transactional sync runs in `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T008 Create feature contract tests for sync isolation and degraded Graph data in `orkestria360/tests/Feature/LicensingSyncTest.php`
- [X] T009 Configure daily tenant-scoped scheduling, lock/idempotency and nextExpectedAt test in `orkestria360/routes/console.php` and `orkestria360/tests/Feature/LicensingSyncTest.php`
- [X] T010 Preserve the V2 non-nominal boundary: do not expose user detail or export until a tenant membership/authorization model is introduced; verify the Inertia payload in `orkestria360/tests/Feature/LicensingAuthorizationTest.php`
- [X] T011 Run `composer ci:check` for the foundational batch in `orkestria360/`

## Phase 3: User Story 1 - Saúde técnica (P1)

- [X] T012 [US1] Create dashboard feature test in `orkestria360/tests/Feature/LicensingDashboardTest.php`
- [X] T013 [US1] Generate licensing controller with `php artisan make:controller` in `orkestria360/app/Http/Controllers/Modules/LicensingController.php`
- [X] T014 [US1] Implement dashboard payload, sync metadata and SKU eligibility totals in `orkestria360/app/Services/Microsoft365/Licensing/LicensingDashboardPageData.php`
- [X] T015 [US1] Add authenticated dashboard route in `orkestria360/routes/web.php`
- [X] T016 [US1] Build dashboard page and accessible tab navigation in `orkestria360/resources/js/pages/modules/licensing.tsx`

## Phase 4: User Story 2 - Inventário e consumo (P1)

- [X] T017 [US2] Create inventory/consumption feature tests in `orkestria360/tests/Feature/LicensingInventoryTest.php`
- [X] T018 [US2] Implement local inventory query and eligibility filters while enforcing the V2 boundary that excludes nominal pagination, export and assignment detail in `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T019 [US2] Implement report CSV collector, aggregate reporting-state mapper, protected evidence reference and persistence tests in `orkestria360/app/Services/Microsoft365/Licensing/` and `orkestria360/tests/Feature/LicensingInventoryTest.php`
- [X] T020 [US2] Implement consumption reporting-state and dual-freshness payload in `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T021 [US2] Add inventory and consumption routes in `orkestria360/routes/web.php`
- [X] T022 [US2] Build accessible inventory/consumption pages in `orkestria360/resources/js/pages/modules/licensing-*.tsx`
- [X] T023 [US2] Run `composer ci:check` for the inventory/consumption batch in `orkestria360/`

## Phase 5: User Story 3 - Otimização (P2)

- [X] T024 [US3] Create opportunity feature tests in `orkestria360/tests/Feature/LicensingOptimizationTest.php`
- [X] T025 [US3] Implement versioned opportunity rules and evidence/impediment payload in `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T026 [US3] Add optimization route and page in `orkestria360/routes/web.php` and `orkestria360/resources/js/pages/modules/licensing-optimization.tsx`
- [X] T027 [US3] Verify future-action controls have no mutation path in `orkestria360/tests/Feature/LicensingOptimizationTest.php`

## Phase 6: User Story 4 - Histórico e planejamento (P2)

- [X] T028 [US4] Create history/planning feature tests in `orkestria360/tests/Feature/LicensingHistoryTest.php`
- [X] T029 [US4] Implement append-only snapshots/events and read-only scenarios in `orkestria360/app/Services/Microsoft365/Licensing/`
- [X] T030 [US4] Add history/planning routes and pages in `orkestria360/routes/web.php` and `orkestria360/resources/js/pages/modules/licensing-*.tsx`

## Phase 7: User Story 5 - Limites comerciais (P3)

- [X] T031 [US5] Create costs/future-state test in `orkestria360/tests/Feature/LicensingCostsTest.php`
- [X] T032 [US5] Add costs route and unavailable-commercial page in `orkestria360/routes/web.php` and `orkestria360/resources/js/pages/modules/licensing-costs.tsx`

## Phase 8: Polish and validation

- [X] T033 Validate keyboard, focus, responsive tables and textual chart alternatives in `orkestria360/resources/js/pages/modules/`
- [X] T034 Run `composer ci:check` in `orkestria360/`
- [X] T035 Run `composer test` and quickstart scenarios in `orkestria360/`

## Phase 9: User Story 6 - Dashboard Executivo ilustrado (P1)

**Goal**: Completar a arquitetura de informação executiva esperada sem apresentar dados fora da evidência disponível.

**Independent Test**: O Dashboard mantém KPIs, utilização, evolução de custo, oportunidades, produtos, departamento, tendência e avisos, e cada superfície mostra dado técnico, restrição ou dependência corretamente.

- [X] T036 [US6] Add classification/aggregation regressions for free, trial, capacity, technical and suspended SKUs in `orkestria360/tests/Feature/LicensingDashboardTest.php`
- [X] T037 [US6] Extend dashboard page-data contracts with per-block availability, population/coverage and evidence-navigation metadata in `orkestria360/app/Services/Microsoft365/Licensing/` and `orkestria360/resources/js/types/modules/licensing.ts`
- [X] T038 [US6] Build the illustrated Dashboard Executive sections and truthful prepared states in `orkestria360/resources/js/pages/modules/licensing.tsx`
- [X] T039 [US6] Verify Dashboard Executive navigation, prepared financial/person blocks and evidence inspection in `orkestria360/tests/Feature/LicensingDashboardTest.php`

## Phase 10: User Story 7 - Inventário e Consumo ilustrados (P1)

**Goal**: Preservar o percurso ilustrado de produto, planos, pessoas, contratos, consumo, departamento e tendência, sem ampliar indevidamente a exposição nominal ou comercial.

**Independent Test**: Inventário e Consumo mostram sua estrutura completa; os detalhes disponíveis funcionam e os restritos/indisponíveis descrevem a condição de habilitação.

- [X] T040 [US7] Add inventory and consumption coverage tests for classification, restricted nominal detail and workload-population semantics in `orkestria360/tests/Feature/LicensingInventoryTest.php`
- [X] T041 [US7] Extend inventory/consumption page-data with section-level availability, coverage and source metadata in `orkestria360/app/Services/Microsoft365/Licensing/` and `orkestria360/resources/js/types/modules/licensing.ts`
- [X] T042 [US7] Implement the illustrated inventory detail and consumption sections with contextual restricted/unavailable states in `orkestria360/resources/js/pages/modules/licensing.tsx`
- [X] T043 [US7] Validate filters, section navigation and no nominal/commercial payload leakage in `orkestria360/tests/Feature/LicensingInventoryTest.php` and `orkestria360/tests/Feature/LicensingAuthorizationTest.php`

## Phase 11: User Story 8 - Superfícies analíticas ilustradas (P2)

**Goal**: Tornar visíveis a investigação, memória e planejamento esperados, preservando a fronteira de leitura técnica da V2.

**Independent Test**: Otimização, Histórico e Planejamento exibem seus blocos ilustrados; evidências técnicas abrem e dependências comerciais/operacionais permanecem orientadas e sem efeito.

- [X] T044 [US8] Add evidence and prepared-state regressions for optimization cards, simulator and outcomes in `orkestria360/tests/Feature/LicensingOptimizationTest.php`
- [X] T045 [US8] Extend opportunity, event and scenario page-data with section availability, coverage and evidence references in `orkestria360/app/Services/Microsoft365/Licensing/` and `orkestria360/resources/js/types/modules/licensing.ts`
- [X] T046 [US8] Implement the illustrated optimization, history and planning sections in `orkestria360/resources/js/pages/modules/licensing.tsx`
- [X] T047 [US8] Validate timeline/event detail, planning premises and no mutation path for prepared actions in `orkestria360/tests/Feature/LicensingHistoryTest.php` and `orkestria360/tests/Feature/LicensingOptimizationTest.php`

## Phase 12: User Story 9 - Estados preparados e acessibilidade (P2)

**Goal**: Garantir que a preparação de futuras fontes e fluxos seja informativa, navegável e consistente.

**Independent Test**: Nenhum bloco ausente vira zero/vazio; o usuário entende a dependência e navega por abas, detalhes, gráficos e ações futuras com teclado/leitor de tela.

- [X] T048 [US9] Create reusable accessible availability, coverage and future-action primitives in `orkestria360/resources/js/components/modules/licensing-*.tsx`
- [X] T049 [US9] Apply ARIA tab semantics, focus restoration, textual chart summaries and translated status vocabulary throughout `orkestria360/resources/js/pages/modules/licensing.tsx`
- [X] T050 [US9] Add accessibility and unavailable-state assertions in `orkestria360/tests/Feature/LicensingDashboardTest.php`, `orkestria360/tests/Feature/LicensingInventoryTest.php` and `orkestria360/tests/Feature/LicensingHistoryTest.php`

## Phase 13: User Story 5 - Custos ilustrados (P3)

**Goal**: Preservar toda a arquitetura de informação financeira ilustrada sem simular valores comerciais antes da fonte Assessment/CSV.

**Independent Test**: Sem dado comercial, o administrador encontra resumo, evolução, produto, departamento, usuário, eficiência, orçamento, alertas e renovação; cada bloco declara fonte, cobertura/frescor e condição de habilitação, sem valor ou prazo fictício.

- [X] T051 [US5] Add cost-surface regression tests for all illustrated unavailable blocks in `orkestria360/tests/Feature/LicensingCostsTest.php`
- [X] T052 [US5] Extend commercial-unavailable page-data with per-block source, coverage, freshness and Assessment/CSV condition in `orkestria360/app/Services/Microsoft365/Licensing/` and `orkestria360/resources/js/types/modules/licensing.ts`
- [X] T053 [US5] Build the illustrated Costs sections with truthful unavailable states in `orkestria360/resources/js/pages/modules/licensing.tsx`
- [X] T054 [US5] Verify that Costs never returns commercial, nominal or synthetic financial values before Assessment/CSV in `orkestria360/tests/Feature/LicensingCostsTest.php` and `orkestria360/tests/Feature/LicensingAuthorizationTest.php`

## Phase 14: Cross-cutting validation

- [X] T055 Run `composer ci:check` after the illustrated-surface batch in `orkestria360/`
- [X] T056 Run `composer test` and execute the scenarios in `specs/003-m365-licenciamento/quickstart.md` in `orkestria360/`

## Phase 15: Configuração de participação de SKU por tenant

- [X] T057 Generate the calculation-setting model, migration and seed; make the seed idempotently exclude the two validated million-seat SKUs in `orkestria360/app/Models/` and `orkestria360/database/`.
- [X] T058 Replace heuristic eligibility with tenant SKU settings in sync, page data and the typed Inertia inventory contract; resolve `displayName` from the storage catalog.
- [X] T059 Keep out-of-calculation SKUs visible in Inventory/History while excluding them from technical aggregates, opportunities and planning; add regression coverage for seed, sync and payload behavior.
- [X] T060 Run `composer test` for the tenant SKU calculation-setting extension.

## Dependencies

T001–T008 block all stories. US1 and US2 then form the MVP; US3–US5 depend on persisted technical data. T028–T030 run after all selected stories. US6 depends on the original dashboard data contract; US7 depends on the inventory/consumption seams; US8 depends on opportunities, snapshots and scenarios; US9 runs after the page sections it standardizes. The illustrated Costs extension (T051–T054) depends on the shared availability contract from US9. T055–T056 close the extension. Tasks sharing a listed file execute sequentially; otherwise `[P]` tasks may run in parallel.
