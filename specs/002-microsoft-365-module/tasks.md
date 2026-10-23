# Tasks: Módulo Microsoft 365

**Input**: Design documents from `/specs/002-microsoft-365-module/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include the tests required by the specification and constitution. When logic, navigation seams, shared UI contracts, or regressions are at risk, test tasks are NOT optional.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Planning artifacts stay in `specs/002-microsoft-365-module/`
- Application implementation lives in `orkestria360/`
- Laravel backend changes live under `orkestria360/app/`, `orkestria360/routes/`, `orkestria360/config/`
- React/Inertia changes live under `orkestria360/resources/js/`
- Feature tests live under `orkestria360/tests/Feature/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the Microsoft 365 implementation scaffolding that will replace the inline route payload and wire the Microsoft Graph SDK.

- [X] T001 Generate the invokable controller with `php artisan make:controller Modules/Microsoft365Controller --invokable` in `orkestria360/app/Http/Controllers/Modules/Microsoft365Controller.php`
- [X] T002 Create the backend payload builder skeleton in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T003 [P] Create the dedicated overview contract types in `orkestria360/resources/js/types/modules/microsoft-365.ts`
- [X] T004 [P] Register Microsoft Graph seam environment variables (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`) in `orkestria360/.env.example`
- [X] T005 [P] Register Microsoft Graph seam configuration keys in `orkestria360/config/services.php`
- [X] T006 Add the explicit Microsoft Graph PHP package set to `orkestria360/composer.json` and install dependencies: `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` and `microsoft/kiota-http-guzzle`
- [X] T007 [P] Create the Graph client provider in `orkestria360/app/Support/Microsoft365/GraphClientFactory.php` instantiating `GraphServiceClient` with `ClientCredentialContext`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Move `/microsoft-365` off the inline route, establish the shared backend/frontend contract, and wire the Graph-backed overview builder with cache/snapshot resilience.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Replace the inline `/microsoft-365` closure with `Microsoft365Controller` in `orkestria360/routes/web.php`
- [X] T009 Wire the controller to render the overview through the backend builder in `orkestria360/app/Http/Controllers/Modules/Microsoft365Controller.php`
- [X] T010 [P] Extract the current inline payload shape from `orkestria360/routes/web.php` into `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php` as the initial typed contract skeleton (no mock data served)
- [X] T011 [P] Move Microsoft 365 page typing away from the data helper and into `orkestria360/resources/js/types/modules/microsoft-365.ts`
- [X] T012 [P] Update the page and helper imports to consume the new shared contract in `orkestria360/resources/js/pages/modules/microsoft-365.tsx` and `orkestria360/resources/js/data/modules/microsoft-365.ts`
- [X] T013 Establish baseline feature coverage for controller-backed rendering and authenticated access rules in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T014 Implement Graph-backed `summaryCards` (`/users`, `/groups`, `/subscribedSkus` and the fixed monitored-services count derived from the 8-service catalog reconciled with `serviceStatus`) in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T015 Implement Graph-backed `secureScore` (`/security/secureScores?$top=1`) in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T016 Implement Graph-backed `serviceStatus` (`/admin/serviceAnnouncement/healthOverviews`) with the fixed 8-service catalog mapping in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T017 Implement Graph-backed `licenseDistribution` (`/subscribedSkus`) in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T018 Implement Graph-backed `serviceUsage30d` with CSV download+parser for `/reports/getOffice365ServicesUserCounts(period='D30')` in `orkestria360/app/Support/Microsoft365/ServiceUsageCsvParser.php`
- [X] T019 Implement Graph-backed `recommendations` derived from `/security/secureScoreControlProfiles` (top 5 by severity/impact) in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T020 Implement per-block cache/snapshot store via Cache Laravel (`Cache::put("m365.block.{key}", { value, lastUpdatedAt }, TTL)`) in `orkestria360/app/Support/Microsoft365/BlockSnapshotStore.php`
- [X] T021 [P] Add feature coverage for Graph-backed block sources (`graph-*`) and `BlockFreshness` (`lastUpdatedAt`, `fresh`) in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T022 [P] Add feature coverage for transient Graph failure → cache/snapshot served with `fresh: false` and `lastUpdatedAt` populated in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T023 [P] Add feature coverage for transient Graph failure without cached snapshot → block normalized to `empty`/`informational` (no mock) in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T024 Implement automatic recovery: when a Graph call succeeds again for a previously stale block, restore `fresh: true`, update `lastUpdatedAt` and refresh the cached snapshot in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php` and `orkestria360/app/Support/Microsoft365/BlockSnapshotStore.php`
- [X] T025 [P] Ensure editorial blocks (`tenantHighlights`, `recentActivity`, `nextStep`) do NOT carry `BlockFreshness` (`lastUpdatedAt`/`fresh`) in the payload builder in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T026 [P] Add the "Última att. em {tempo relativo}" indicator component for `fresh: false` blocks in `orkestria360/resources/js/components/modules/last-updated-indicator.tsx`
- [X] T027 [P] Add feature coverage for recovery behavior: Graph succeeds again after stale → block returns to `fresh: true` and snapshot is updated in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T028 [P] Add feature coverage for "Última att." indicator visibility requirements (position within/adjacent to block, contrast, legibility) for `fresh: false` blocks in `orkestria360/tests/Feature/Microsoft365PageTest.php`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Ler a visão executiva do tenant (Priority: P1) 🎯 MVP

**Goal**: Entregar a overview completa e coerente em `/microsoft-365` com todos os blocos obrigatórios em uma única resposta Inertia.

**Independent Test**: Acessar `/microsoft-365` autenticado e confirmar que a página renderiza 4 summary cards fixos, secure score, 8 serviços monitorados, gráficos, highlights, atividades recentes e next step sem roundtrips adicionais do cliente.

### Tests for User Story 1

- [X] T029 [P] [US1] Expand the overview contract assertions for fixed cardinalities in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T030 [P] [US1] Add assertions that the page still renders when structured blocks are present in a single Inertia response in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T031 [P] [US1] Add feature coverage for `partial`, `empty` and `informational` block states in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T032 [P] [US1] Add feature coverage for workloads not enabled and `serviceUsage30d` CSV parser behavior in `orkestria360/tests/Feature/Microsoft365PageTest.php`

### Implementation for User Story 1

- [X] T033 [US1] Wire the page to render the fixed `summaryCards` set (`users`, `groups`, `licenses`, `services`) from the Graph-backed payload builder in `orkestria360/resources/js/pages/modules/microsoft-365.tsx`
- [X] T034 [US1] Wire the page to render `secureScore`, `licenseDistribution` and `serviceUsage30d` (including CSV-parsed data) from the Graph-backed payload builder in `orkestria360/resources/js/pages/modules/microsoft-365.tsx`
- [X] T035 [US1] Wire the page to render the fixed catalog of 8 `serviceStatus` items from Graph-backed health overviews with coherent detail normalization in `orkestria360/resources/js/pages/modules/microsoft-365.tsx`
- [X] T036 [P] [US1] Extend the dedicated contract to include source metadata and normative block shapes in `orkestria360/resources/js/types/modules/microsoft-365.ts`
- [X] T037 [US1] Update the page composition to consume the normative overview contract in `orkestria360/resources/js/pages/modules/microsoft-365.tsx`
- [X] T038 [US1] Trim `orkestria360/resources/js/data/modules/microsoft-365.ts` down to presentational helpers only after the contract moves to `orkestria360/resources/js/types/modules/microsoft-365.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Entender onde agir primeiro (Priority: P2)

**Goal**: Destacar claramente os serviços em atenção, as recomendações prioritárias e a próxima ação executiva sem depender de interpretação manual de dados brutos.

**Independent Test**: Validar que a overview evidencia pelo menos um serviço em atenção, mostra exatamente 5 recomendações ordenadas por severidade/impacto e mantém `tenantHighlights`, `recentActivity` e `nextStep` coerentes com os blocos estruturados.

### Tests for User Story 2

- [X] T039 [P] [US2] Add assertions for top-5 recommendation ordering and service attention cues in `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T040 [P] [US2] Add assertions for mandatory editorial blocks, a single `nextStep` and explicit Graph-versus-editorial provenance messaging in `orkestria360/tests/Feature/Microsoft365PageTest.php`

### Implementation for User Story 2

- [X] T041 [US2] Wire the executive top-5 `recommendations` to Graph-backed `secureScoreControlProfiles` with severity and impact ordering in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T042 [US2] Implement `tenantHighlights`, `recentActivity` and the single `nextStep` as editorial blocks anchored in the real Graph-backed signals in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T043 [US2] Update recommendation rendering for the mandatory top-5 contract in `orkestria360/resources/js/components/modules/recommendations-activity-panel.tsx`
- [X] T044 [P] [US2] Preserve severity/status tone and label consistency in `orkestria360/resources/js/data/modules/microsoft-365.ts`
- [X] T045 [US2] Ensure `NextStepCard` and surrounding layout continue to support the single executive action in `orkestria360/resources/js/components/modules/next-step-card.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Navegar a evolução do módulo com clareza (Priority: P3)

**Goal**: Tornar explícito que a feature entrega apenas a overview agora, mantendo as subáreas como evolução futura sem prometer comportamento já implementado.

**Independent Test**: Abrir `/microsoft-365` e verificar que a experiência comunica claramente a scope atual da overview e a natureza futura das subáreas, sem contradizer o contrato nem criar falsas affordances.

### Tests for User Story 3

- [X] T046 [P] [US3] Add feature coverage for overview-only scope messaging in `orkestria360/tests/Feature/Microsoft365PageTest.php`

### Implementation for User Story 3

- [X] T047 [US3] Add explicit overview-only, Graph-versus-editorial provenance, and future-evolution messaging to the page shell in `orkestria360/resources/js/pages/modules/microsoft-365.tsx`
- [X] T048 [US3] Align the Microsoft 365 entry copy with the overview-only scope in `orkestria360/routes/web.php`
- [X] T049 [US3] Keep the executive activity narrative semantically clear for future-area framing in `orkestria360/resources/js/components/modules/recommendations-activity-panel.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish consistency, observability, accessibility and verification work that spans multiple stories.

- [X] T050 [P] Normalize backend block-state diagnostics (`graph-backed`, `stale`, `partial`, `editorial`, `empty`, `informational`) in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T051 [P] Review semantic heading hierarchy and descriptive labels in `orkestria360/resources/js/pages/modules/microsoft-365.tsx` and `orkestria360/resources/js/components/modules/recommendations-activity-panel.tsx`
- [X] T052 [P] Review keyboard navigation and visible focus treatment for interactive controls in `orkestria360/resources/js/pages/modules/microsoft-365.tsx` and `orkestria360/resources/js/components/modules/next-step-card.tsx`
- [X] T053 [P] Review contrast and state consistency for attention, risk, empty and informational blocks in `orkestria360/resources/js/pages/modules/microsoft-365.tsx` and `orkestria360/resources/js/components/modules/recommendations-activity-panel.tsx`
- [X] T054 [P] Verify that no secrets, tokens or sensitive Graph details leak through props in `orkestria360/app/Http/Controllers/Modules/Microsoft365Controller.php` and `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php`
- [X] T055 [P] Add a manual validation script for FR-024a, SC-002 and SC-003 in `specs/002-microsoft-365-module/quickstart.md`
- [X] T056 Run the intermediate gate `composer ci:check` for the Microsoft 365 implementation touching `orkestria360/app/`, `orkestria360/resources/js/`, `orkestria360/routes/web.php` and `orkestria360/tests/Feature/Microsoft365PageTest.php`
- [X] T057 Run the required final gate `composer test` for the Microsoft 365 implementation
- [X] T058 Validate the implementation against the scenarios in `specs/002-microsoft-365-module/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - delivers the MVP overview
- **User Story 2 (P2)**: Depends on US1 data contract and extends prioritization without changing route ownership
- **User Story 3 (P3)**: Depends on US1 page structure and clarifies scope without introducing new backend domains

### Within Each User Story

- Tests should be updated before or alongside implementation and must fail before the final fix is complete
- Backend contract shaping in `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php` should land before UI fine-tuning
- Page-level and component-level copy should not contradict the normative contract in `specs/002-microsoft-365-module/contracts/microsoft-365-overview.md`
- The required final gate (`composer test`) must pass before the feature is marked complete

### Parallel Opportunities

- `T003`, `T004`, `T005`, `T007` and `T026` can run in parallel during Setup
- `T010`, `T011`, `T012` and `T013` can run in parallel once the controller file exists
- `T014` to `T019` can be sequenced/parallelized by block once `T007` (Graph client provider) and `T020` (snapshot store) are ready
- `T021`, `T022`, `T023`, `T025`, `T027` and `T028` can run in parallel once the Graph-backed blocks and snapshot store are wired
- `T024` depends on `T020` (snapshot store) and `T014`-`T019` (Graph-backed blocks) being ready
- `T029`, `T030`, `T031` and `T032` can run in parallel for US1
- `T036` can run in parallel with `T033` to `T035` for US1
- `T039` and `T040` can run in parallel for US2
- `T044` can run in parallel with `T043` and `T045` for US2
- `T050` to `T055` can run in parallel during Polish; `T056` must precede `T057`, and `T058` runs after the final gate

---

## Parallel Example: User Story 1

```bash
# Launch both US1 contract-focused tests together:
Task: "Expand the overview contract assertions for fixed cardinalities in orkestria360/tests/Feature/Microsoft365PageTest.php"
Task: "Add assertions that the page still renders when structured blocks are present in a single Inertia response in orkestria360/tests/Feature/Microsoft365PageTest.php"
Task: "Add feature coverage for partial, empty and informational block states in orkestria360/tests/Feature/Microsoft365PageTest.php"
Task: "Add feature coverage for workloads not enabled and serviceUsage30d CSV parser behavior in orkestria360/tests/Feature/Microsoft365PageTest.php"

# Launch backend/frontend contract work in parallel:
Task: "Wire the page to render the fixed summaryCards set in orkestria360/resources/js/pages/modules/microsoft-365.tsx"
Task: "Extend the dedicated contract to include source metadata and normative block shapes in orkestria360/resources/js/types/modules/microsoft-365.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch both US2 test updates together:
Task: "Add assertions for top-5 recommendation ordering and service attention cues in orkestria360/tests/Feature/Microsoft365PageTest.php"
Task: "Add assertions for mandatory editorial blocks and a single nextStep in orkestria360/tests/Feature/Microsoft365PageTest.php"

# Launch UI refinement work in parallel after the backend payload rules exist:
Task: "Update recommendation rendering for the mandatory top-5 contract in orkestria360/resources/js/components/modules/recommendations-activity-panel.tsx"
Task: "Ensure NextStepCard and surrounding layout continue to support the single executive action in orkestria360/resources/js/components/modules/next-step-card.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Run `composer ci:check`, then `composer test`, and validate `/microsoft-365` as the controller-backed overview MVP

### Incremental Delivery

1. Finish Setup + Foundational to remove the inline route payload
2. Deliver US1 to establish the stable overview contract
3. Deliver US2 to sharpen prioritization and editorial coherence
4. Deliver US3 to clarify scope and future evolution messaging
5. Finish Polish, intermediate + final gate execution and quickstart validation

### Parallel Team Strategy

1. One developer handles backend scaffolding in `orkestria360/app/` and `orkestria360/routes/`
2. One developer handles frontend contract migration in `orkestria360/resources/js/types/` and `orkestria360/resources/js/pages/`
3. One developer updates `orkestria360/tests/Feature/Microsoft365PageTest.php` as the contract hardens

---

## Notes

- `specs/002-microsoft-365-module/contracts/microsoft-365-overview.md` remains the normative contract reference during implementation.
- The Microsoft Graph seam is backend-only and env-driven; no configuration UI should be introduced. Credenciais (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`) já estão disponíveis no ambiente do tenant Contoso.
- `serviceUsage30d` must remain a structured page block; its official source (`/reports/getOffice365ServicesUserCounts(period='D30')`) returns `302` to CSV and requires backend download+parser (`ServiceUsageCsvParser`).
- Blocos estruturados são Graph-backed por padrão; não existe `mock`. Falhas transitórias do Graph são tratadas via cache/snapshot (`fresh: false`) com indicador "Última att. em {tempo relativo}", ou normalização para `empty`/`informational` quando não há snapshot.
- Todo bloco estruturado carrega `lastUpdatedAt` e `fresh`; a UI exibe "Última att. em {tempo relativo}" quando `fresh: false`.
- Blocos editoriais (`tenantHighlights`, `recentActivity`, `nextStep`) permanecem editoriais por design, ancorados nos sinais estruturados reais agora disponíveis.
