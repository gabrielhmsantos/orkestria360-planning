---
description: "Implementation-ready tasks for Microsoft 365 / Configurações"
---

# Tasks: Microsoft 365 / Configurações

**Input**: `spec.md`, `plan.md`, `data-model.md`, `configuration-matrix.md`, `research.md`, `contracts/local-projections.md`, `quickstart.md` and the [structural representation](../../discovery/microsoft-365/v2/configuracoes/representacao-estrutural-das-telas.md).

**Prerequisites**: Application changes are in `orkestria360/`. Create PostgreSQL 18 migrations incrementally with `php artisan make:migration`; never use `migrate:fresh` or edit a historical migration. Screens and exports read only published local projections.

**Atomic commits and verification**: Each task is one concern. An implementation task is complete only after the first explicit PHPUnit, Inertia, browser, or command gate following it in the same subsection; a test/command task is its own gate. Keep production and regression edits as separate atomic commits.

**Path convention**: An unqualified Configuration PHP class belongs in `orkestria360/app/Services/Microsoft365/Configurations/`; an unqualified configuration test belongs in `orkestria360/tests/Feature/Microsoft365/Configurations/` (or the explicitly stated `tests/Unit/...` path). UI files belong in `orkestria360/resources/js/components/modules/configuracoes/`. This convention makes every abbreviated target below an exact path without repeatedly obscuring the task text.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: independent only after stated dependencies and with no shared-file conflict.
- **[US#]**: independently testable `spec.md` surface.
- Timestamp wildcards denote migrations generated at implementation time.

## Phase 1: Setup and implementation evidence

- [x] T001 Record approved artifacts and current seams (`CoordinatedSyncCoordinator`, `GraphDataClient`, `Microsoft365DataRetentionPruner`, `GroupsPageData`, `SecureScorePublicationBuilder`) in `specs/012-m365-configuracoes/tasks.md` evidence before application edits.
  - Evidence (2026-08-26): reviewed the approved `spec.md`, `plan.md`, `research.md`, `data-model.md`, `configuration-matrix.md`, `contracts/local-projections.md`, `quickstart.md`, and the structural representation. `CoordinatedSyncCoordinator` already owns the tenant+connection lock, heartbeat, cycle/stage lifecycle, and partial-safe stage handling; configuration stages must extend it. `GraphDataClient` is fixed to v1.0 and validates pagination paths, so the version-bound narrow reader extends this transport while preserving `GraphClient`. `Microsoft365DataRetentionPruner` is the dispatcher seam for a feature pruner. `GroupsPageData` establishes the published-local source-state envelope. `SecureScorePublicationBuilder` establishes the staging-before-derived-writes and short promotion transaction seam. No application file was edited before recording this evidence.
- [x] T002 Create `orkestria360/tests/Feature/Microsoft365/Configurations/ConfigurationMigrationUpgradeTest.php` documenting the PostgreSQL 18 target and safe incremental `php artisan migrate` procedure; prove it does not use `migrate:fresh` or operational data. **Dispensada por orientação direta do usuário em 2026-08-26:** a garantia será exercida pelas migrations incrementais, pelo upgrade e pelo rerun de `php artisan migrate` previstos nas Tasks T012 e T105, sem um teste de autoinspeção que não valida o banco.

---

## Phase 2: Foundation — schema, contracts, collection, publication, and retention

### 2A. Incremental PostgreSQL schema and models

- [x] T003 Generate `orkestria360/database/migrations/*_create_configuration_catalog_tables.php` for global matrix versions/domains/lines, baseline profiles/items, source key/version/checksum, and explicit PG18 constraints/indexes.
- [x] T004 Generate `*_create_configuration_data_plane_tables.php` for tenant-first generations, source states, TCM readiness, facts, baseline versions/items, and publications exactly as `data-model.md` types them.
- [x] T005 Generate `*_create_configuration_history_and_classification_tables.php` for comparisons, scores, classifications/audits, evidence, snapshots, changes, and drift; keep historical MatrixLine/comparison/risk/severity nullable as required and enforce fact/source/subject and before/after checks.
- [x] T006 Generate `*_add_configuration_constraints_and_indexes.php` for tenant-composite FKs, staging/current/partial uniqueness, source/fact identity, state/numeric checks, evidence `ON DELETE SET NULL`, and query indexes.
- [x] T007 Generate idempotent `*_bootstrap_configuration_reference_data.php` for the matrix, nine weights, eligible lines, contract checksums, global profile/items; require `php artisan migrate` on existing schema without `db:seed`.
- [x] T008 Generate `*_enable_configuration_runtime_rls.php` with runtime grants, `ENABLE`/`FORCE RLS`, deny-by-default `USING`/`WITH CHECK` on tenant tables, and runtime `SELECT` only on global catalog.
- [x] T009 Implement global models in `orkestria360/app/Models/ConfigurationMatrixVersion.php`, `ConfigurationDomain.php`, `ConfigurationMatrixLine.php`, `ConfigurationBaselineProfile.php`, and `ConfigurationBaselineProfileItem.php` without tenant ownership.
- [x] T010 Implement tenant data models in `ConfigurationGeneration.php`, `ConfigurationSourceState.php`, `ConfigurationTcmReadiness.php`, `ConfigurationFact.php`, `ConfigurationBaselineVersion.php`, `ConfigurationBaselineItem.php`, and `ConfigurationPublication.php` using `BelongsToTenant` only for direct customer ownership.
- [x] T011 Implement history/evidence/score/local-authority models in `ConfigurationComparison.php`, `ConfigurationPublicationDomainScore.php`, `ConfigurationSnapshot.php`, `ConfigurationChangeEvent.php`, `ConfigurationDriftEvent.php`, `ConfigurationTechnicalEvidence.php`, `CriticalClassification.php`, and `CriticalClassificationAudit.php`.
- [x] T012 Add preserved-data migration-upgrade, bootstrap rerun, constraint/composite-FK, staging-invisibility tests in `ConfigurationMigrationUpgradeTest.php` and `ConfigurationSchemaConstraintTest.php`.
- [x] T013 Add Eloquent, `DB::table`, and direct runtime-role SQL RLS tests for select/insert/update/delete, absent context, and cross-tenant access in `ConfigurationRlsTest.php`.

### 2B. Versioned source contracts and Graph transport

- [x] T014 Implement `ConfigurationSourceContract.php` and `ConfigurationSourceContractRegistry.php` in `app/Services/Microsoft365/Configurations/` with provider/audience, Graph version, allowlisted operation, permissions, cadence/freshness, coverage/failure, pagination semantics, and checksum.
- [x] T015 Populate `ConfigurationSourceContractRegistry.php` with all score/observation contracts: organization, branding, domains, groups, named locations, CA, SharePoint, authorization policy, cross-tenant policy, Intune, collaboration, and TCM. Do not create source-registry rows or MatrixLines for UI-only facts.
- [x] T016 Add historical-reference compatibility in `ConfigurationSourceContractRegistry.php` for facts/source states/MatrixLines/profile items/publications: reject absent/changed `source_key@version`, require `@N+1`, retain historical versions.
- [x] T017 Add allowlist, missing contract, checksum, semantic-change, `@N+1`, historical-reference tests in `tests/Unit/Microsoft365/Configurations/ConfigurationSourceContractRegistryTest.php`.
- [x] T018 Add closed `GraphApiVersion` and narrow `ConfigurationGraphReader` in `app/Support/Microsoft365/GraphApiVersion.php` and `Contracts/ConfigurationGraphReader.php`, leaving `GraphClient` unchanged.
- [x] T019 Refactor `app/Support/Microsoft365/GraphDataClient.php` for instance-bound v1.0/beta root, token request and strict pagination/next-link validation, exposing only allowlisted configuration reads.
- [x] T020 Extend `GraphClientFactory.php` with `makeForVersion(MicrosoftConnection, GraphApiVersion): ConfigurationGraphReader`; preserve `make(): GraphClient` v1.0 behavior and active customer/connection validation.
- [x] T021 Add v1.0/beta/403/404/429/5xx/retry/no-TCM-write/host-path-collection-cross-version-next-link tests in `ConfigurationGraphDataClientTest.php`; retain legacy coverage in `tests/Feature/UsersAccounts/GraphDataClientTest.php`.

### 2C. Criticality, freshness, collectors, normalization, and coordinated stages

- [x] T022 Implement optimistic customer-admin-only local classification/audit/prospective effective time in `CriticalClassificationService.php`; it never calls Microsoft.
- [x] T023 Implement `CriticalClassificationReconciler.php`: initial non-critical; only conclusive canonical absence inactivates; same reference reactivates; a new reference is non-critical; failed/restricted/unavailable/partial never implies absence.
- [x] T024 Add classification authorization, lock-version HTTP 409, audit, prospective-history, disconnect, inactivation/reactivation tests in `CriticalClassificationTest.php`.
- [x] T025 Add `SourceFreshnessContract` and `SourceStateFreshness::forContract()` in `app/Services/Microsoft365/Sync/SourceStateFreshness.php` without changing 26-hour legacy `for()` callers.
- [x] T026 Add legacy-26h, per-contract, missing-contract-indeterminate, stale-non-comparable tests in `ConfigurationFreshnessTest.php` and `SyncStageRecorderTest.php`.
- [x] T027 [P] Implement `Collectors/OrganizationProfileCollector.php` with registry contract, fact normalization, source state, coverage, and empty-valid/restricted/unavailable behavior.
- [x] T028 [P] Implement `Collectors/TenantBrandingCollector.php` and `VerifiedDomainsCollector.php` with individual approved contracts, normalized facts/source states/coverage, and Graph-fake unavailable/restricted/empty-valid behavior.
- [x] T029 [P] Implement `Collectors/GroupSettingsCollector.php` with contract, normalized facts/source state/coverage, and Graph-fake state semantics.
- [x] T030 [P] Implement `Collectors/NamedLocationsCollector.php` with contract, normalized facts/source state/coverage, and Graph-fake state semantics.
- [x] T031 [P] Implement `Collectors/ConditionalAccessCollector.php` and `SharePointSettingsCollector.php` with approved contracts, normalized facts/source states/coverage, and canonical empty-valid/restricted/failed results.
- [x] T032 [P] Implement `Collectors/AuthorizationPolicyCollector.php` with its approved source contract, normalizer output, source state, applicable coverage, and empty-valid/restricted/unavailable semantics.
- [x] T033 [P] Implement `Collectors/CrossTenantAccessPolicyCollector.php` with its approved source contract, normalizer output, source state, applicable coverage, and empty-valid/restricted/unavailable semantics.
- [x] T034 [P] Implement read-only `Collectors/IntuneConfigurationInventoryCollector.php` from the approved v1.0 payload exemplar, with contract/facts/source state/coverage; do not create an unmanaged-device line/gate.
- [x] T035 [P] Implement `Tcm/TcmReadinessCollector.php` as a capability/readiness state independent from facts, including license/role/snapshot unavailable/restricted and no snapshot creation or PowerShell fallback.
- [x] T036 [P] Implement `Tcm/TcmConfigurationCollector.php` for `antiPhishPolicy`, `antiPhishRule`, `inboundConnector`, and `outboundConnector`, creating contract-bound facts/source state/coverage only when readiness permits.
- [x] T037 Implement `ConfigurationFactNormalizer.php`, `ConfigurationFactPersister.php`, and `ConfigurationSourceStateRecorder.php` for source version/checksum, `source_key + fact_key + subject_key + generation`, tenant sentinel, optional MatrixLine, availability/comparability, applicable coverage, and the canonical temporal mapping (`source_updated_at`, differential `observed_change_at`, `last_collected_at`); record only safe error categories/reasons/evidence metadata from the existing `SyncExceptionLogger` boundary.
- [x] T038 Add Graph/TCM fake tests in `ConfigurationCollectorsTest.php`, `ConfigurationCollaborationCollectorsTest.php`, `TcmConfigurationCollectorTest.php`, and `ConfigurationFactNormalizerTest.php` for every collector — explicitly including `AuthorizationPolicyCollector` and `CrossTenantAccessPolicyCollector` — plus paging, malformed payload, retry, empty-valid, restricted/unavailable, coverage, no fabricated fact, fact without MatrixLine, and sanitization of provider failures before source state/readiness/evidence.
- [x] T039 Extend `app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php` with declared `configurations_*` stages, heartbeat, tenant/connection revalidation, complete/restricted/failed/skipped mapping, partial-safe sources, and lock-loss cleanup; no public scheduler/command.
- [x] T040 Add stage dependency/partial/lock-loss/sanitized-failure/terminal-timestamp/same-cycle-rerun tests in `ConfigurationCoordinatedSyncTest.php`.

### 2D. Publication, score, history, and retention

- [x] T041 Implement `ConfigurationPublicationBuilder.php`: create invisible staging manifest before derived writes; promotion transaction is only advisory-lock revalidation/current swap/status.
- [x] T042 Implement immutable profile materialization/publication binding in `ConfigurationBaselineMaterializer.php`; no baseline edit, approval, exception, override, or manual activation.
- [x] T043 Implement `ConfigurationComparisonEngine.php`: compare only fresh MatrixLine facts; eligible unavailable creates factless unavailable comparison, zero score contribution, and no gate.
- [x] T044 Implement `ConfigurationScoreCalculator.php` with nine weights, complete applicable coverage aggregation, bands, and gate cap.
- [x] T045 Implement `ConfigurationGateEvaluator.php` for MFA admin, critical CA disabled, legacy SharePoint/OneDrive auth, two independent antiphish lines, and critical inbound/outbound TLS; omit anonymous-edit/unmanaged-device deferred gates.
- [x] T046 Implement facts-first snapshots/change/factual drift in `ConfigurationHistoryBuilder.php`; read canonical events only through `PublishedEventQuery`, correlate only with sufficient canonical identity/contract/fact/subject/reference evidence, and leave correlation null otherwise. MatrixLine/comparison/risk/severity/baseline/gate enrichment occurs only when present.
- [x] T047 Integrate staged derived persistence in `ConfigurationGenerationSynchronizer.php`; keep I/O/retry/normalization/comparison/score/history outside promotion.
- [x] T048 Add staging/atomic/unsafe-current-preservation/partial-safe/idempotent/stale/no-I/O-in-promotion tests in `ConfigurationPublicationTest.php`.
- [x] T049 Add all-domain/weight, criticality, unavailable-zero/no-gate, bands, deferred-gate tests in `ConfigurationScoreTest.php` and `ConfigurationGateTest.php`.
- [x] T050 Add factless-unavailable and all three `ConfigurationSettingView` fixtures in `ConfigurationSettingViewTest.php`.
- [x] T051 Add fact-without-MatrixLine snapshot/change/drift/history tests in `ConfigurationHistoryPersistenceTest.php`, proving null non-applicable risk/severity/baseline/comparison/gate; add `ConfigurationAuditReplayTest.php` proving same canonical window/page/event does not duplicate canonical events, facts, snapshots, changes or applicable drifts, failed unsafe persistence does not advance the existing canonical watermark, and replay after publication is idempotent.
- [x] T052 Implement `ConfigurationsRetentionPruner.php`: 365d derived history, `subMonthsNoOverflow(6)` evidence, current/source preservation, evidence `SET NULL`/`retention_expired`, ordered Microsoft-derived `all` delete.
- [x] T053 Register it in `Microsoft365DataRetentionPruner.php`, preserving `PruneMicrosoft365Data.php` parsing; `all` removes current/publications/materializations but never classifications/audits/local authority.
- [x] T054 Add normal/disconnect/end-of-month-six-month/`all` order/classification-preservation/recollect-by-reference tests in `ConfigurationsRetentionTest.php` and `Microsoft365RetentionDispatcherTest.php`.

**Checkpoint**: Tenant-safe local publications can be collected, staged, scored, retained, and read without external I/O.

---

## Phase 3: Shared application shell

- [x] T055 Implement `ConfigurationPageData.php` with current publication/source/filter resolution, surface dispatch, and no-publication unavailable envelope.
- [x] T056 Implement `ConfigurationsController.php` shell plus explicit local eight-surface route/allowlist in `routes/web.php`; tenant/connection is server-bound.
- [x] T057 Implement `resources/js/pages/modules/configuracoes.tsx` shell/tab navigation and base Inertia contracts in `resources/js/types/modules/configuracoes.ts`, with no Graph/TCM browser call.
- [x] T058 Implement `configuration-states.tsx`, `configuration-filter-bar.tsx`, `configuration-setting-detail.tsx`, pagination helpers, `ConfigurationSourceMetadata`, availability/freshness/coverage/reason/date states, and base criticality props under `resources/js/components/modules/configuracoes/` and `types/modules/configuracoes.ts`; expose the non-interchangeable `sourceLastModifiedAt`, `lastObservedChangeAt`, `lastCollectedAt`, and `publishedAt` fields only.
- [x] T059 Add route/allowlist/no-publication/filter/tenant-isolation/no-external-call Inertia tests in `ConfigurationsRoutesTest.php` and `ConfigurationsPageDataTest.php`.

---

## Phase 4: User Story 1 — Dashboard Executivo (P1)

**Independent Test**: Published/partial local data renders score, coverage, source reason, factual drift, and unavailable cards without Graph/TCM.

- [x] T060 [US1] Implement `ConfigurationDashboardProjection.php` for `Microsoft 365 Configuration Score — score`, `Configurações Analisadas — KPI`, `Configurações Conformes — KPI`, `Configurações Divergentes — KPI`, `Configurações Críticas — KPI`, and `Workloads com Drift — KPI/lista`.
- [x] T061 [US1] Complete it for `Alterações Pendentes — lista de estados`, `Alterações Executadas (30 dias) — donut` (structural unavailable), `Configurações por Risco — donut`, `Baselines Ativos — tabela curta`, and `Configurações sem Coleta — lista`.
- [x] T062 [US1] Complete it for `Conformidade por Workload — barras empilhadas`, `Evolução do Configuration Score — linha`, `Top 10 Configurações Críticas — tabela`, `Alterações Observadas Recentes — tabela`, `Workloads sem Coleta — tabela curta`, and unavailable `Ações Recomendadas — lista priorizada`.
- [x] T063 [US1] Integrate dashboard projection only into frozen `ConfigurationPageData.php`/`ConfigurationsController.php` dispatch, without changing routes/types.
- [x] T064 [US1] Implement `dashboard-tab.tsx` from canonical cards using shared helpers.
- [x] T065 [US1] Add local-only/partial/stale/score/coverage/unavailable-management-and-recommendation Inertia tests in `DashboardPageTest.php`; browser acceptance is T104.

## Phase 5: User Story 6 — Configurações por Serviço (P1)

**Independent Test**: Filters/pagination/detail/CSV share one local publication and support observed/no-comparison and factless-unavailable views.

- [x] T066 [US6] Implement `ServiceConfigurationsQuery.php` and `ServiceConfigurationsProjection.php` for publication filters, pagination, and three `ConfigurationSettingView` states.
- [x] T067 [US6] Implement `ConfigurationCsvExport.php` and `ConfigurationExportController.php` for filtered local UTF-8/BOM CSV with source/availability/coverage/date metadata and conditional comparison columns.
- [x] T068 [US6] Integrate service/export endpoints with frozen shell routes/controllers only; no browser tenant/connection input or external I/O.
- [x] T069 [US6] Implement `by-service-tab.tsx` for `Microsoft Entra ID — cartão seletor`, `Exchange Online — cartão seletor`, `SharePoint Online — cartão seletor`, `OneDrive for Business — cartão seletor`, `Microsoft Teams — cartão seletor`, `Intune — cartão seletor`, `Microsoft Defender — cartão seletor`, `Microsoft Purview — cartão seletor`, and `Categorias — filtros`.
- [x] T070 [US6] Complete it for `Configurações do Serviço — tabela`, `Detalhes da Configuração — painel`, `Conformidade por Serviço — donut`, `Serviços com Maior Número de Divergências — barras horizontais`, `Serviços com Mais Configurações Críticas — barras horizontais`, and unavailable `Recomendações de Investigação — lista de riscos`.
- [x] T071 [US6] Add service query/filter/pagination/detail/CSV/three-view-state/no-live-call tests in `ByServicePageTest.php` and `ConfigurationCsvExportTest.php`, including deliberately distinct temporal values preserved in projection/detail/CSV and negative export assertions for raw exception, payload, URL/header/credential, and unauthorized identifier leaks.

## Phase 6: User Story 2 — Configurações do Tenant (P2)

**Independent Test**: Local organization/domain facts render; unavailable branding/contact is explicit and general settings supports observed/factless-unavailable values.

- [x] T072 [US2] Implement `TenantConfigurationProjection.php` for `Informações da Organização — detalhe em duas colunas`, `Identidade Visual do Tenant — mídia e metadados`, `Domínios Verificados — tabela`, and `Contatos da Organização — cartões` with source/redaction metadata.
- [x] T073 [US2] Complete it for `Serviços Habilitados no Tenant — grade`, `Sincronização e Diretórios — detalhe`, and `Configurações Gerais do Tenant — tabela` as `LocalPagination<ConfigurationSettingView>`.
- [x] T074 [US2] Integrate tenant projection only into frozen page-data/controller dispatch.
- [x] T075 [US2] Implement `tenant-tab.tsx` using the seven-card contract and shared helpers.
- [x] T076 [US2] Add facts/restricted source/timestamp/no-MatrixLine/factless-unavailable/filter/local-only tests in `TenantPageTest.php`.

## Phase 7: User Story 3 — Identidade e Acesso (P2)

**Independent Test**: CA/MFA/admin coverage is local; only positive MFA evidence gates and criticality is local, audited, and optimistic.

- [x] T077 [US3] Implement `IdentityAccessConfigurationProjection.php` for `Políticas de Acesso Condicional — KPI`, `Localizações Nomeadas — KPI`, `Métodos de Autenticação — KPI`, `Usuários com MFA — KPI`, `Funções Administrativas — KPI`, `Usuários Externos (B2B) — KPI`, and `Políticas de Acesso Condicional — tabela`.
- [x] T078 [US3] Complete it for `Métodos de Autenticação — donut`, `Proteção por Senha — detalhe`, `Funções Administrativas — donut`, `Atribuições PIM — métricas`, `Usuários e Acesso — barras`, `Aplicativos Empresariais — métricas/lista`, `Eventos Recentes de Identidade — tabela`, and unavailable/restricted `Recomendações de Investigação — lista`.
- [x] T079 [US3] Implement `CriticalClassificationController.php` local CA mutation/route, customer-admin authorization, and 409 conflict payload; never call Microsoft.
- [x] T080 [US3] Implement `identity-access-tab.tsx` with criticality controls and reload-on-409/no-last-write-wins behavior.
- [x] T081 [US3] Add MFA/CA/criticality authorization/concurrency/audit/prospective/no-live-read tests in `IdentityAccessPageTest.php` and `CriticalClassificationControllerTest.php`.

## Phase 8: User Story 4 — Colaboração e Compartilhamento (P2)

**Independent Test**: Local SharePoint/authorization/cross-tenant facts render; legacy auth gates only on positive evidence; anonymous edit remains unavailable/deferred.

- [x] T082 [US4] Implement `CollaborationConfigurationProjection.php` for `Nível de Compartilhamento — KPI`, `Links Anônimos — KPI`, `Domínios Permitidos — KPI`, `Domínios Bloqueados — KPI`, `Expiração de Links — KPI`, `Expiração de Convidados — KPI`, `Sites Criados por Usuários — KPI`, `Configurações de Compartilhamento Externo — lista`, and `Tipos de Link Padrão — donut`.
- [x] T083 [US4] Complete it for `Atividade de Compartilhamento (30 dias) — linha`, `Acesso de Convidados — donut`, `Domínios Permitidos — tabela`, `Políticas de Grupos e Sites — lista de pares`, `Configurações do Microsoft Teams — lista de pares`, `Configurações do OneDrive — lista de pares`, `Alterações Observadas de Compartilhamento — tabela`, and unavailable `Recomendações de Investigação — lista priorizada`.
- [x] T084 [US4] Integrate collaboration projection only into frozen page-data/controller dispatch.
- [x] T085 [US4] Implement `collaboration-sharing-tab.tsx` with explicit available/unavailable/restricted/stale states and no invented recommendation.
- [x] T086 [US4] Add collaboration Inertia/source-state/authorization-policy/cross-tenant/legacy-auth/deferred-anonymous-edit tests in `CollaborationSharingPageTest.php`.

## Phase 9: User Story 5 — Segurança e Compliance (P2)

**Independent Test**: TCM readiness stays separate; absent capability is unavailable zero/no gate, never inferred insecure.

- [x] T087 [US5] Implement `SecurityComplianceConfigurationProjection.php` for `Postura de Segurança — KPI`, `Configurações Analisadas — KPI`, `Configurações Conformes — KPI`, `Configurações Divergentes — KPI`, `Configurações Críticas — KPI`, `DLP - Incidentes (30 dias) — KPI`, `Proteções do Microsoft Defender — tabela`, and `Conformidade e Proteção de Dados — donut`.
- [x] T088 [US5] Complete it for `DLP - Principais Incidentes (30 dias) — tabela`, `Auditoria e Monitoramento — métricas`, `Rótulos de Sensibilidade — tabela`, `Políticas de Retenção — donut`, `Baselines de Segurança — tabela`, `Configurações Críticas Detectadas — tabela`, `Evolução da Postura de Segurança — linha`, `Workloads e Cobertura — barras horizontais`, and unavailable `Recomendações de Investigação — lista`.
- [x] T089 [US5] Integrate security projection/connector classification dispatch only in frozen `ConfigurationPageData.php` and `ConfigurationsController.php`, consuming published/readiness rows.
- [x] T090 [US5] Implement `security-compliance-tab.tsx` connector classification controls reusing the local endpoint and preserving Microsoft read-only behavior.
- [x] T091 [US5] Add TCM readiness/two antiphish lines/inbound-outbound TLS/unavailable-zero-no-gate/critical connector/no-snapshot tests in `SecurityCompliancePageTest.php` and `TcmConfigurationCollectorTest.php`.

## Phase 10: User Story 7 — Baselines e Conformidade (P3)

**Independent Test**: Fresh comparison explains its bound baseline; unavailable remains zero/reasoned and no baseline-admin write exists.

- [x] T092 [US7] Implement `BaselinesComplianceProjection.php` for `Baselines Ativos — KPI`, `Configurações Cobertas — KPI`, `Divergências Detectadas — KPI`, and `Baselines Ativos — tabela`.
- [x] T093 [US7] Complete it for `Cobertura por Serviço (Baseline Ativo) — donut`, `Divergências por Nível de Risco — barras horizontais`, and `Configurações Divergentes — tabela`.
- [x] T094 [US7] Integrate baseline projection only into frozen page-data/controller dispatch.
- [x] T095 [US7] Implement `baselines-compliance-tab.tsx` using shared helpers, without mutation controls.
- [x] T096 [US7] Add materialization/history-reference/unavailable/no-customization tests in `BaselinesCompliancePageTest.php`.

## Phase 11: User Story 8 — Histórico e Auditoria (P3)

**Independent Test**: A fact without MatrixLine yields local snapshot/change/history/diff while enrichment stays null and no Graph call occurs.

- [x] T097 [US8] Implement `ConfigurationHistoryQuery.php` and `ConfigurationHistoryProjection.php` with source-contract/fact/snapshot anchors and nullable MatrixLine/comparison joins.
- [x] T098 [US8] Build `Alterações Observadas — KPI`, `Alterações Externas (Drift) — KPI`, `Configurações Críticas Alteradas — KPI`, `Histórico de Alterações — tabela`, `Origem das Alterações — donut`, `Detalhes da Alteração Selecionada — detalhe`, and `Valores da Configuração — diff` through `ConfigurationHistoryChange` discriminants.
- [x] T099 [US8] Complete it for `Informações Técnicas — detalhe`, `Alterações por Serviço — barras horizontais`, `Alterações por Nível de Risco — donut`, `Evidências e Logs — lista`, and `Drifts Relacionados — lista de estado`, showing `retention_expired` safely and never change-management state.
- [x] T100 [US8] Integrate history query/projection only into frozen page-data/controller dispatch.
- [x] T101 [US8] Implement `history-audit-tab.tsx` with filters, pagination, selected detail, redaction, and source metadata.
- [x] T102 [US8] Add no-MatrixLine/null-enrichment/diff/filter/pagination/evidence-retention/no-live-call tests in `HistoryAuditPageTest.php`, including distinct date semantics, safe `technicalInformation`/reason rendering, and absence of raw provider error/payload/URL/credential/unauthorized identifier leakage.

## Phase 12: Cross-surface hardening and final gates

- [x] T103 Add member/customer-admin/platform authorization and local-only export/mutation regressions in `ConfigurationsAuthorizationTest.php`, including no browser tenant/connection and no HTTP client invocation from screens/exports; add negative Inertia/mutation/log assertions that tokens, secrets, Authorization/OAuth state, stack traces, raw provider errors, sensitive URLs/query strings, raw payloads and unauthorized identifiers never leave the approved sanitization boundary.
- [x] T104 Run reproducible `playwright-cli` acceptance for all eight routes in compact/wide viewports with keyboard focus, filters, pagination, unavailable/restricted/partial/stale/no-publication; record actual commands/results in `quickstart.md` without new infrastructure.
- [x] T105 Run PostgreSQL 18 migration upgrade, rerun `php artisan migrate` without pending work, then focused configuration PHPUnit suites from `quickstart.md`.
- [x] T106 Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, and `composer ci:check` from `orkestria360/`; review both worktrees and record actual results in `quickstart.md`.

---

## Dependencies & execution order

### Critical path

`T001–T054 Foundation → T055–T059 Shared application shell → T060–T102 all eight User Stories → T103–T106 hardening and final gates`

- **Schema/RLS/bootstrap** (`T003–T013`) blocks all persistent configuration data.
- **Registry/Graph** (`T014–T021`) blocks contract-bound collectors.
- **Classification/freshness/collectors/stages** (`T022–T040`) blocks safe staged source facts.
- **Publication/score/history/retention** (`T041–T054`) blocks all local projections.
- **Shared shell** (`T055–T059`) freezes controller, routes, page, base types, shared UI, and read envelope before stories.
- Every story is mandatory. Deliver priority US1 → US6 → US2/US3/US4/US5 → US7/US8, but T103–T106 require every story T060–T102.

### User-story dependencies

| Story | Depends on | Independent completion evidence |
|---|---|---|
| US1 Dashboard Executivo | T054, T059 | T060–T065 |
| US6 Configurações por Serviço | T054, T059 | T066–T071 |
| US2 Configurações do Tenant | T054, T059, T027–T030, T037 | T072–T076 |
| US3 Identidade e Acesso | T054, T059, T022–T024, T031 | T077–T081 |
| US4 Colaboração e Compartilhamento | T054, T059, T031–T033 | T082–T086 |
| US5 Segurança e Compliance | T054, T059, T035–T036 | T087–T091 |
| US7 Baselines e Conformidade | T054, T059 | T092–T096 |
| US8 Histórico e Auditoria | T054, T059 | T097–T102 |

### Real parallelism

- After T026, T027–T036 may run in parallel only where distinct collector files avoid overlap; all converge at T037/T038.
- After T059, story projections/queries may run in parallel only after their listed source dependencies. They must not modify shared routes/page/base types; each uses its dedicated dispatch task.
- A tab may start after its projection payload is frozen. Its Feature/Inertia task remains the explicit gate. Do not parallelize migrations, shared shell, or final gates.

## Readiness checklist

- Every task has a sequential ID, target path, dependency location, and explicit subsequent test/gate mapping.
- Coverage includes incremental migration/rerun, three-path RLS, historical registry checksum, Graph versions/next links, `for()` 26h and `forContract()`, all collaboration/TCM collectors, unavailable factless comparisons, all `ConfigurationSettingView` states, MatrixLine-free history, staging/partial/stale/lock loss, score/gates, six-month/365d retention and safe `all`, CSV, eight local surfaces/routes, browser acceptance, and `composer ci:check`.
- No task authorizes Microsoft writes, TCM snapshot creation, PowerShell fallback, live screen/export calls, unhomologated MatrixLines, or inferred unsafe values.

---

## Phase 13: UI Blueprint realignment

**Guardrail:** These tasks may alter only local projections/read contracts, React composition, and tests. Do not modify collectors, Graph clients, source contracts, synchronizers, publications, schema, RLS or scheduling.

- [x] T107 Replace the Dashboard gauge with `OperationalKpiCard variant="score"`; preserve factual `partial`/`stale` rendering and fix no-source-state availability in `ConfigurationDashboardProjection.php`, `dashboard-tab.tsx`, and `DashboardPageTest.php`.
- [x] T108 Add accessible DOM summaries for all changed `ChartPanel` bar and line instances, then apply documented donut legend composition by span in `resources/js/components/modules/chart-panel.tsx` and Configuration tabs.
- [x] T109 Realign Configurações por Serviço to `2/7/3`, replace its dialog with `InlineDetailPanel`, and use existing local `settingId` selection in `by-service-tab.tsx` and `configuracoes.tsx`.
- [x] T110 Replace category buttons with `OperationalFilterBar` controls for category, status and risk; reset page, preserve selection validity, and extend `ByServicePageTest.php` without changing `ServiceConfigurationsQuery` semantics.
- [ ] T111 Apply contextual `InlineDetailPanel` behavior to Identity and Histórico, including focus, close, selection clearing, redaction, and `aria-live`; extend their page tests.
- [x] T112 Standardize availability-panel visuals and factual `partial`/`stale` presentation across all Configuration tabs without adding `SourceMetadata`.
- [x] T113 Add mobile-card or named horizontal-scroll handling to every Configuration table and pass loading/disabled state to filters, selectors and pagination.
- [x] T114 Keep recommendations and collaboration activity unavailable until a local published rule/source exists; adapt the component branch so `RecommendationsList` is used only for factual items.
- [ ] T115 Run Configuration page/CSV/synchronization non-regression tests, frontend checks, Playwright acceptance in compact/tablet/desktop viewports, and record evidence in `quickstart.md`.
- [ ] T116 Run `composer ci:check`, review both worktrees, and mark this phase complete only after all UI changes are proved to make no external HTTP request or collection mutation.
