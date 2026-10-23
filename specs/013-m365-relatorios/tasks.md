# Tasks: Relatórios Microsoft 365 V1

**Input:** `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `checklists/` e o [UI Blueprint](../../discovery/microsoft-365/v2/relatorios/ui-blueprint.md).

**Regra de execução:** execute estas tasks em ordem. Uma task só pode ser marcada quando sua implementação e a verificação descrita nela estiverem concluídas. Não há trabalho implícito. **Nenhuma task pode exigir artifact, service, endpoint ou test target implementado por uma task posterior.**

## Surface-to-Story Traceability

| US | Superfície | Cards exatos do blueprint | Tasks de superfície |
|---|---|---|---|
| US1 | Dashboard Executivo | `Síntese de postura`; `Evolução e adoção`; `Riscos e oportunidades`; `Relatórios recentes e agenda` | T079–T082 |
| US2 | Catálogo de Relatórios | `Filtros`; `Templates`; `Requisitos` | T083–T086 |
| US3 | Relatórios Executivos | `Lista de templates`; `Metodologia/fontes`; `Progresso futuro`; `Formato não aprovado` | T087–T090 |
| US4 | Relatórios Operacionais | `Filtros`; `Consulta`; `Detalhe restrito`; `Metodologia` | T091–T095 |
| US5 | Relatórios de Segurança e Compliance | `Postura por fonte`; `Controles/evidências`; `Distribuição`; `Limitações` | T096–T099 |
| US6 | Construtor de Relatórios | `Etapas`; `Filtros e seleção`; `Prévia e origem`; `Ação indisponível` | T100–T102 |
| US7 | Agendamentos e Distribuição | `Estado de recorrência`; `Lista`; `Canal não habilitado`; `Segurança/retenção` | T103–T106 |
| US8 | Histórico e Auditoria | `KPIs`; `Filtros/tabela`; `Detalhe`; `Evento sem evidência` | T107–T110 |

## Phase 1 — Schema, catálogo global e fundações

- [x] T001 Criar migration incremental de `report_templates`, `report_block_definitions` e `report_template_blocks`: UUIDs, `UNIQUE(key, version)`, lifecycle, índice parcial de versão ativa, formatos CSV/XLSX, política parcial, filtros/PII/source contract e relação template↔bloco com ordem e uniques em `orkestria360/database/migrations/`.
- [x] T002 Criar migration incremental do data plane `report_configurations`, `report_requests`, `report_source_manifests`, `report_manifest_sources`, `report_artifacts` e `report_audit_events`: UUIDs, tenant/conexão, FKs compostas, FKs `BIGINT` de usuários, checks, índices, `canonical_hash` não único, `UNIQUE(request_id)`, terminalidade de `completed_at` e referência tipada sem FK polimórfica.
- [x] T003 Criar migration incremental de `license_usage_publications`, `licensed_population_publications` e `license_inventory_publications`, mais `UNIQUE(tenant_id, id)` em `licensing_sync_runs`: geração UUID, `published_at`, FK `BIGINT` de run, FKs compostas, `RESTRICT`, checks e uniques por contrato.
- [x] T004 Criar migration incremental de RLS: índices tenant-first, ENABLE/FORCE RLS, grants do runtime role e políticas deny-by-default com `USING`/`WITH CHECK` para toda tabela tenant-scoped nova.
- [x] T005 Implementar models globais `ReportTemplate`, `ReportBlockDefinition` e `ReportTemplateBlock` com UUID, casts, relações, lifecycle e queries de versão ativa/histórica.
- [x] T006 Implementar models data-plane `ReportConfiguration`, `ReportRequest`, `ReportSourceManifest`, `ReportManifestSource`, `ReportArtifact` e `ReportAuditEvent` com UUID, casts, relações tenant+conexão, lifecycle e imutabilidade aplicável.
- [x] T007 Implementar models append-only `LicenseUsagePublication`, `LicensedPopulationPublication` e `LicenseInventoryPublication` com UUID, casts, relações `LicensingSyncRun` bigint, tenant+conexão, geração e `published_at` imutável.
- [x] T008 Implementar bootstrap/seeder idempotente do catálogo V1 persistido seguindo o padrão canônico existente, sem catálogo somente hardcoded em service.
- [x] T009 Materializar exatamente `operational-usage`, `operational-licensing` e `security-posture`, version=1, formatos, partial policy, períodos, público e display order de `contracts/catalogo-v1.md`.
- [x] T010 Materializar exatamente `taxa-de-adocao`, `uso-agregado-office365`, `inventario-skus-capacidade`, `secure-score-postura` e `limitacoes-de-evidencia`, com requirement mode, filtros allowlisted, PII, source contract e vínculos template↔bloco.
- [x] T011 Criar `ReportsCatalogBootstrapTest.php`: seeder idempotente e cada template/bloco/vínculo coincide exatamente com `contracts/catalogo-v1.md`.
- [x] T012 Criar `ReportsFoundationTest.php`: upgrade PostgreSQL 18, tipos de FK, checks, índices/uniques, terminalidade, `canonical_hash` não único, artifact único e rerun incremental.
- [x] T013 Criar `ReportsRlsTest.php` com Eloquent/query builder/SQL direto no runtime role para SELECT/INSERT/UPDATE/DELETE, sem tenant, cross-tenant e cross-connection.
- [x] T014 Registrar todas as rotas tenant-scoped de Relatórios, bindings e middleware em `orkestria360/routes/web.php`, sem lógica de domínio nas rotas.
- [x] T015 Ativar `Relatórios` sob `Microsoft 365` com destino canônico em `HandleInertiaRequests` e fallback `resources/js/lib/orkestria-navigation.ts`; testar label/destino em `AppShellTest.php`.
- [x] T016 Criar tipos TypeScript para catálogo, requisitos, token, configuração, manifesto, artifact, estados e payloads em `resources/js/types/modules/reports.ts`.

## Phase 2 — Publicações de Licenciamento

- [x] T017 Refatorar `GraphClient` e `GraphDataClient` para `downloadOffice365ServicesUserCounts(string $period)`, aceitando somente D7/D30/D90/D180 e montando o endpoint correto.
- [x] T018 Criar `LicensingGraphDataClientTest.php` para D7/D30/D90/D180, período inválido e erro sanitizado.
- [x] T019 Implementar resolvedor de período por `SyncOperation`: routine→D30, force→D30, recollect_days→solicitado, recollect_date→not_collected, recollect_today→not_collected.
- [x] T020 Criar testes dos cinco modos em `LicensingReportPublicationTest.php`, provando que date/today não chamam Graph Reports nem criam publicação parcial.
- [x] T021 Implementar publicador append-only de `LicenseUsagePublication`: workload/métrica/período/valor, estado, cobertura, `report_updated_at`, evidência sanitizada e telemetria factual.
- [x] T022 Criar testes de usage publication: available, zero factual, unavailable/restricted, cobertura/frescor, período, idempotência e ausência de linha nominal.
- [x] T023 Implementar publicador de `LicensedPopulationPublication`: pessoa distinta uma vez, direct+group, somente SKU participante e snapshot de `included_in_calculation`.
- [x] T024 Criar testes de population publication: deduplicação, direct+group, SKU elegível, snapshot histórico, cobertura e não-coleta.
- [x] T025 Implementar publicador append-only de `LicenseInventoryPublication` a partir de SKU/capacidade/consumo/planos, sem PII.
- [x] T026 Criar testes de inventory publication: available, zero factual, estado/restrição, filtros permitidos, cobertura/frescor e ausência de atribuições individuais.
- [x] T027 Implementar promotor atômico: `publication_generation_id`, único `published_at`, três famílias na mesma geração e rejeição de geração parcial.
- [x] T028 Criar testes do promotor: geração/timestamp compartilhados, FK de run, `published_at` imutável, rerun idempotente, falha sem parcial e sem HTTP na transação.
- [x] T029 Integrar resolvedor, coleta, publicadores e promotor ao `LicensingSynchronizer`/ciclo coordenado, preservando snapshots, lock e telemetria existentes.
- [x] T030 Criar testes de integração: routine/force somente D30, recollect-days D7/D30/D90/D180, falha preserva última factual, not_collected ≠ failed e contagens reais.

## Phase 3 — Retention e evidência de Licenciamento

- [x] T031 Estender `LicensingRetentionPruner`: remover por tenant+conexão+geração as três publicações por `published_at < cutoff`, antes de `LicensingSyncRun`, preservando âncoras de uso/população/inventário.
- [x] T032 Definir e implementar retenção do CSV/evidence file tenant-scoped: remover somente arquivo sem referência retida, preservar referência canônica, sanitizar paths e manter idempotência.
- [x] T033 Criar `LicensingReportRetentionTest.php`: cutoff, âncoras D7/D30/D90/D180, população compatível, inventário atual, evidence preservada/removida, all, isolamento e rerun.
- [x] T034 Implementar `ReportsRetentionPruner`: janela por request terminal/`completed_at`, ordem events→artifacts→manifest sources→requests→manifests, configurações na janela e all incluindo configurações sem catálogo global.
- [x] T035 Criar `ReportsRetentionTest.php`: request terminal anterior ao cutoff removido; não terminal/manifesto retidos; ordem child→parent; configurações preservadas na janela; all; isolamento tenant/conexão; idempotência; e fonte pode ser podada sem FK polimórfica bloquear.
- [x] T036 Integrar `ReportsRetentionPruner` ao `Microsoft365DataRetentionPruner` e `app:prune-microsoft365`, com contagens reais, separadas/sanitizadas e sem comando paralelo.
- [x] T037 Criar `ReportsRetentionIntegrationTest.php`: os dois pruners, RLS, contagens reais e nenhuma conexão de outro customer removida.

## Phase 4 — Core, blocos, autorização e HTTP

- [x] T038 Implementar `ReportCatalog` somente sobre catálogo persistido e publicações/source states atuais da mesma tenant+conexão, sem Graph/manifesta passado.
- [x] T039 Criar `ReportsCatalogTest.php`: três templates, formatos, períodos, PII, disponibilidade/requisitos e nenhum source state inventado.
- [x] T040 Implementar projetor `taxa-de-adocao` com usage+population da mesma geração, fórmula, proveniência e indisponibilidades contratuais.
- [x] T041 Criar testes dedicados de adoção: available, zero factual, ausência, geração/período/cobertura incompatíveis, denominador zero, frescor, PII e sem snapshot mutável.
- [x] T042 Implementar projetor `uso-agregado-office365` exclusivamente de `LicenseUsagePublication`: workload permitido, série comparável, zero factual, cobertura/frescor e aggregate-only.
- [x] T043 Criar testes de uso agregado: available/zero/unavailable/restricted/stale, período, provenance, sem linha nominal e filtros permitidos.
- [x] T044 Implementar projetor `inventario-skus-capacidade` exclusivamente de `LicenseInventoryPublication`, com filtros `sku_part_number`/`availability_state` allowlisted e sem atribuições individuais.
- [x] T045 Criar testes de inventário: available/zero/unavailable/restricted, filtros, PII, coverage/freshness e provenance.
- [x] T046 Implementar projetor `secure-score-postura` somente da publicação canônica Secure Score, sem Health Score ou taxa de conformidade inventados.
- [x] T047 Criar testes de Secure Score: available, zero factual quando publicado, unavailable/restricted/stale, cobertura/frescor, PII e proibição de métricas inventadas.
- [x] T048 Implementar projetor `limitacoes-de-evidencia` de source states/cobertura/frescor/motivos sanitizados, `degradable` e apenas com partial policy permitida.
- [x] T049 Criar testes de limitações: available/unavailable/restricted, partial, motivo sanitizado, cobertura/frescor e provenance.
- [x] T050 Implementar `ReportBlockProjectionRegistry` (ou equivalente simples) que despacha somente block definitions V1 aprovados/versionados aos cinco projectors; recusa bloco desconhecido, inativo, removido ou que não pertença ao template, sem classe/callable/string/SQL/Graph arbitrário e sem fallback.
- [x] T051 Criar `ReportsBlockProjectionRegistryTest.php` unitário/contratual: exatamente cinco mappings; cada definição V1 resolve o projector correto; key desconhecida, inativa, removida/desabilitada ou de outro template é recusada; nenhuma classe/callable/string/SQL/Graph arbitrária e nenhum fallback.
- [x] T052 Implementar policies/guardas com a matriz aprovada: member, customer admin, platform admin control-plane, tenant, conexão e ausência de `CurrentTenant`, sem RBAC genérico.
- [x] T053 Criar `ReportsAuthorizationTest.php` de policies/guards: member, customer admin, platform admin, outro tenant, outra conexão, sem `CurrentTenant` e contexto reutilizado; customer admin mantém `report_configurations`, member não persiste, platform não acessa data-plane e configuração não escapa de tenant/conexão.
- [x] T054 Implementar token opaco de preflight: emissão, integridade e binding a tenant, conexão, ator, template/versão, blocos, período, filtros, formato e validade contratual.
- [x] T055 Criar `ReportsPreflightTokenTest.php`: adulteração, expiração aplicável, cross-tenant, cross-connection, ator divergente e alteração material exigindo novo preflight.
- [x] T056 Implementar `ReportPreflightService`: normaliza/autoriza parâmetros, usa exclusivamente `ReportBlockProjectionRegistry` para avaliar cada bloco, retorna requisitos/can_accept/token e não cria request/manifesto/arquivo/I-O externo.
- [x] T057 Implementar `ReportPreflightRequest` e `POST /microsoft-365/reports/preflight` com validação, autorização e resposta HTTP/Inertia compatível.
- [x] T058 Criar `ReportsPreflightHttpTest.php`: validação, zero side effect, required bloqueado, degradable parcial, token e payload de requisitos.
- [x] T059 Implementar `ReportConfigurationService`: somente customer admin cria/atualiza configuração persistente no próprio tenant+conexão, seleciona template/blocos/filtros/período permitidos e a usa no Builder; member somente compõe parâmetros no fluxo de geração, sem persistir configuração; platform admin não acessa data plane; alteração não muda request/manifesto aceito.
- [x] T060 Implementar FormRequests, actions/controllers e rotas de create/update de `report_configurations`, restritas a customer admin, com auditoria sanitizada aplicável e integração ao Builder sem rota persistente para member/platform.
- [x] T061 Criar `ReportsConfigurationTest.php`: customer admin cria/atualiza; member é negado em create/update; platform é negado; outro tenant/outra conexão são negados; validações e Builder corretos; alteração não muda request/manifesto aceito.
- [x] T062 Implementar `ReportManifestService`: no aceite, reutiliza a projeção aprovada pelo registry/preflight, sem lógica duplicada de bloco, valida fonte uma vez e cria transacionalmente request, manifesto e sources com `frozen_projection`/políticas congeladas; serializers não conhecem projectors nem fonte original.
- [x] T063 Implementar FormRequest e `POST /microsoft-365/reports/requests`: validar token opaco, autorizar, chamar aceite e devolver resposta compatível.
- [x] T064 Criar `ReportsRequestHttpTest.php`: token obrigatório/válido, request+manifesto atômicos, bloqueio sem request e parâmetros do frontend sem autoridade.
- [x] T065 Implementar `ReportPreviewService` exclusivamente de manifesto e `ReportManifestSource.frozen_projection`, preservando máscara/PII, partialidade, fonte/cobertura/frescor sem lookup/fallback.
- [x] T066 Implementar rota/action HTTP de preview congelada, com autorização e payload Inertia compatível.
- [x] T067 Criar `ReportsPreviewHttpTest.php`: fonte podada, cross-tenant/conexão, máscara/PII e ausência de I/O externo.
- [x] T068 Criar `ReportsBlockProjectionWiringTest.php`: para cada um dos cinco blocos, catálogo persistido→preflight→registry→aceite→`ReportManifestSource.frozen_projection`; provar projector correto, sem lógica duplicada preflight/manifesto, bloco inválido não chega ao manifesto e projeção aceita é congelada.
- [x] T069 Criar `ReportsCoreNoProviderIoTest.php` que falha se catálogo, preflight, aceite ou preview acionarem Graph/factory/provider/Azure HTTP.

## Phase 5 — Exportação one-shot

- [x] T070 Adicionar/validar `phpoffice/phpspreadsheet:^5.0`, lock e extensões PHP requeridas, sem wrapper Laravel ou storage de exportação.
- [x] T071 Implementar `ReportExportProjection` somente de `ReportManifestSource.frozen_projection` e políticas congeladas: headers, linhas, partialidade, required/degradable, máscara e PII sem lookup.
- [x] T072 Implementar `ReportCsvSerializer` com `fputcsv` somente sobre a export projection.
- [x] T073 Implementar `ReportXlsxSerializer` com PhpSpreadsheet, uma worksheet, mesmos headers/linhas e liberação de workbook.
- [x] T074 Implementar `ReportExportService`: lifecycle one-shot, bloqueio da segunda tentativa, temporário local, hash/tamanho dos bytes transmitidos, artifact/evento sanitizado e `finally` de limpeza.
- [x] T075 Implementar `POST /microsoft-365/reports/requests/{request}/download` com autorização, `StreamedResponse` e transições delegadas ao export service.
- [x] T076 Criar testes CSV: projeção congelada, headers/linhas, PII/máscara, partialidade, hash/tamanho e igualdade após prune da fonte.
- [x] T077 Criar testes XLSX: workbook/worksheet, igualdade com prévia/CSV, required/degradable, PII, hash/tamanho e fonte podada sem lookup/fallback.
- [x] T078 Criar testes one-shot/cleanup: segunda tentativa recusada, sem path/blob/URL, temporário removido após sucesso/falha de serialização/stream e artifact apenas concluído.

## Phase 6 — US1: Dashboard Executivo (P1)

- [x] T079 [US1] Implementar `ReportDashboardData` com `Síntese de postura`, `Evolução e adoção`, `Riscos e oportunidades` e `Relatórios recentes e agenda` de fontes locais/publicadas.
- [x] T080 [US1] Implementar controller/action/rota Inertia do Dashboard Executivo com payload tenant+conexão e estados explícitos.
- [x] T081 [US1] Implementar `resources/js/pages/modules/reports.tsx` com os quatro cards, blueprint responsivo, metadados e estados.
- [x] T082 [US1] Criar `ReportsDashboardTest.php`: rota/payload/cards, zero factual, coverage/freshness, Health Score indisponível e sem provider I/O.

## Phase 7 — US2: Catálogo de Relatórios (P1)

- [x] T083 [US2] Implementar `GET /microsoft-365/reports/catalog` com `ReportCatalog`, autorização e payload Inertia/HTTP atual por tenant+conexão.
- [x] T084 [US2] Criar teste HTTP do Catálogo: três templates, disponibilidade, períodos, PII, sem manifesto passado e sem provider I/O.
- [x] T085 [US2] Implementar `reports-catalog.tsx`: `Filtros`, `Templates`, `Requisitos`, seleção, detalhe, required bloqueado, degradable, CTA preflight, loading/unavailable/restricted e responsividade.
- [x] T086 [US2] Criar teste de aceitação: Catálogo→template→Requisitos/preflight em até três interações (SC-001), foco e estado bloqueado/parcial.

## Phase 8 — US3: Relatórios Executivos (P2)

- [x] T087 [US3] Implementar `ExecutiveReportProjection` com catálogo/metodologia local, limitações e estados futuros sem operação.
- [x] T088 [US3] Implementar controller/action/rota Inertia de Relatórios Executivos e payload autorizado da projeção.
- [x] T089 [US3] Implementar `reports-executive.tsx` com `Lista de templates`, `Metodologia/fontes`, `Progresso futuro` e `Formato não aprovado`; PDF/PPTX/IA permanecem `coming_soon`, responsivos e sem side effect.
- [x] T090 [US3] Criar `ReportsExecutiveTest.php`: rota/payload, fontes/limitações, formatos futuros e sem provider I/O.

## Phase 9 — US4: Relatórios Operacionais (P1)

- [x] T091 [US4] Implementar query/projeção operacional para `Filtros`, `Consulta`, `Detalhe restrito` e `Metodologia`, preservando escopo preview/export.
- [x] T092 [US4] Implementar controller/action/rota Inertia operacional e payload autorizado da query/projeção.
- [x] T093 [US4] Implementar `reports-operational.tsx` com filtros, consulta, detalhe restrito e metodologia nos layouts do blueprint.
- [x] T094 [US4] Implementar no frontend o wiring de download CSV/XLSX, feedback generating/completed/failed e segunda tentativa indisponível, mantendo o mesmo escopo da prévia.
- [x] T095 [US4] Criar `ReportsOperationalPageTest.php`: rota/payload, filtros, detalhe, igualdade de escopo, estados e sem provider I/O.

## Phase 10 — US5: Segurança e Compliance (P2)

- [x] T096 [US5] Implementar `SecurityPostureProjection` somente de fontes publicadas, com métricas não aprovadas indisponíveis.
- [x] T097 [US5] Implementar controller/action/rota Inertia de Segurança e Compliance e payload autorizado da projeção.
- [x] T098 [US5] Implementar `reports-security.tsx` com `Postura por fonte`, `Controles/evidências`, `Distribuição` e `Limitações`, coverage/freshness, responsividade e sem conteúdo inventado.
- [x] T099 [US5] Criar `ReportsSecurityTest.php`: página/payload, evidência/PII, estados, Secure Score sem substituições e sem provider I/O.

## Phase 11 — US6: Construtor de Relatórios (P1)

- [x] T100 [US6] Implementar controller/action/rota Inertia do Builder integrando catálogo, configuração, preflight, aceite e preview congelada.
- [x] T101 [US6] Implementar `reports-builder.tsx` com `Etapas`, `Filtros e seleção`, `Prévia e origem` e `Ação indisponível`: template/blocos/período/filtros, erros, preflight, aceite e preview.
- [x] T102 [US6] Criar `ReportBuilderTest.php`: rota/payload, required/degradable, token/aceite, configuração, fonte removida e `source_record_id_text` nunca resolvido após aceite.

## Phase 12 — US7: Agendamentos e Distribuição (P3)

- [x] T103 [US7] Implementar `ReportsFutureCapabilities` com as capacidades futuras e garantias de nenhum side effect.
- [x] T104 [US7] Implementar controller/action/rota Inertia de Agendamentos e Distribuição e payload autorizado de capacidades futuras.
- [x] T105 [US7] Implementar `reports-schedule.tsx` com `Estado de recorrência`, `Lista`, `Canal não habilitado` e `Segurança/retenção`; CTAs futuros permanecem `coming_soon` e não criam job, destinatário, arquivo, canal, retenção ou distribuição.
- [x] T106 [US7] Criar `ReportsSchedulingTest.php`: página/payload, CTAs sem side effect e sem provider I/O.

## Phase 13 — US8: Histórico e Auditoria (P1)

- [x] T107 [US8] Implementar `ReportHistoryService` para request/manifesto/artifact/eventos sanitizados e provenance congelada, inclusive fonte podada.
- [x] T108 [US8] Implementar controller/action/rota de Histórico e Auditoria e payload Inertia autorizado do service.
- [x] T109 [US8] Implementar `reports-history.tsx` com `KPIs`, `Filtros/tabela`, `Detalhe` e `Evento sem evidência`, sem arquivo/URL/PII ampliada.
- [x] T110 [US8] Criar `ReportsHistoryTest.php`: RLS/autorização, hash/metadados, evento sem evidência, fonte podada, platform/outro tenant/conexão e sem provider I/O.
- [x] T111 Criar `ReportsSourcePrunedIntegrationTest.php` após preview/export/histórico: A é congelada, B torna-se âncora, prune remove A e preserva request/manifesto/preview/CSV/XLSX/histórico de A sem lookup/fallback para B, novo preflight ou `unavailable`.
- [x] T112 Criar `ReportsAuthorizationHttpIntegrationTest.php`: depois das superfícies, cobrir dashboard, catálogo, preflight, aceite, preview, download, configuração, operacional e histórico para member/admin/platform/outro tenant/outra conexão/sem contexto, separando control-plane de data-plane.
- [x] T113 Criar `ReportsFullNoProviderIoTest.php`: depois de export e oito superfícies, falhar se dashboard, catálogo, preflight, aceite, preview, operacional, download, histórico, executive, security, builder ou scheduling fizer provider I/O.

## Phase 14 — Acceptance e validação final

- [x] T114 Criar/rodar browser acceptance com Playwright: oito superfícies, viewport wide/compact, abas, keyboard/focus, tabelas/overflow, filtros, detalhe, Builder e blueprint; registrar evidência real no delivery checklist.
- [x] T115 Validar no browser `unavailable`, `restricted`, `partial` e `coming_soon`, ausência de conteúdo falso e CTAs sem side effect; registrar evidência real.
- [x] T116 Executar todos os cenários de `quickstart.md`, incluindo A/B+prune, CSV/XLSX, adoção, autorização, cinco sync modes e retention; preencher delivery checklist.
- [x] T117 Executar upgrade PostgreSQL 18, `composer validate`, instalação/lock PhpSpreadsheet, testes focados, `npm run build` e `composer ci:check`; registrar cada resultado real.
- [x] T118 Revisar a matriz FR/SC abaixo, concluir todos os gates e preencher com resultado real todas as evidências obrigatórias de `checklists/delivery.md`.
- [x] T119 Ignorando deliberadamente a própria T119, verificar mecanicamente que nenhuma task anterior (T001–T118) permanece `- [ ]`; conferir todas as evidências obrigatórias com resultado real e revisar `git status`/`git diff` dos dois repositórios; se todas as condições forem satisfeitas, marcar esta task como concluída.

## Phase 15 — Correções pós-review (33 achados validados)

- [x] T120 Atualizar provisionamento runtime reexecutável, grants de catálogo e documentação de responsabilidade de permissões; reaplicar no PostgreSQL local.
- [x] T121 Criar migrations incrementais para reparo do catálogo, nulidade de população, constraints e lease de exportação; aplicar no PostgreSQL 18 sem editar histórico.
- [x] T122 Corrigir snapshots/publicações, retenção, projeções de disponibilidade, catálogo ordenado e controles de segurança opacos.
- [x] T123 Corrigir lease/stream/privacidade da exportação e os parsers Graph/CSV.
- [x] T124 Corrigir aceite JSON, prévia congelada no Builder, busca paginada do Histórico e bloqueio de auto-revogação.
- [x] T125 Executar build e regressões focadas: 64 testes e 436 asserções aprovados com credencial DDL do banco de testes.
- [x] T126 Executar `composer ci:check`: aprovado após normalizar a formatação do componente do Dashboard e corrigir as regressões de schema/MFA encontradas pela suíte completa.

## Matriz FR/SC → tasks

| Requisito | Implementação | Teste/gate |
|---|---|---|
| FR-001 | T079–T109 | T082, T084, T086, T090, T095, T099, T102, T106, T110, T114–T115 |
| FR-002 | T038, T040, T042, T044, T046, T048, T050, T056, T065, T071, T079–T109 | T039, T041, T043, T045, T047, T049, T051, T067–T069, T076–T078, T114–T115 |
| FR-003–FR-006 | T038, T050, T056–T060 | T039, T051, T053, T055, T058, T061 |
| FR-007 | T050, T054, T056, T062–T066 | T051, T055, T058, T064, T067–T068 |
| FR-008–FR-010 | T071–T075, T091–T109 | T076–T078, T095, T110–T111 |
| FR-011–FR-012b | T017, T019, T021, T023, T025, T027, T029, T040, T042 | T018, T020, T022, T024, T026, T028, T030, T041, T043 |
| FR-012c–FR-012d | T031, T032, T034, T036 | T033, T035, T037, T111 |
| FR-013 | T001–T007 | T012–T013 |
| FR-014–FR-015 | T046, T048, T087–T106 | T047, T049, T090, T099, T106 |
| FR-016 | T052, T054, T056, T059–T060, T062–T066, T083–T109 | T053, T055, T058, T061, T064, T067, T082, T110, T112 |
| SC-001 | T083, T085 | T086 |
| SC-002 | T038, T040, T042, T044, T046, T048, T065, T071, T079–T109 | T039, T041, T043, T045, T047, T049, T051, T067–T069, T076–T078, T114–T115 |
| SC-003 | T054, T056 | T055, T058, T102 |
| SC-004 | T071–T075 | T076–T078 |
| SC-005 | T004, T050, T052, T054, T056, T059–T060, T062–T075, T107–T109 | T013, T035, T051, T053, T055, T058, T061, T064, T067–T069, T076–T078, T110–T113 |

## Dependencies and Completion

T001–T016 bloqueiam fundações; T017–T030 bloqueiam Licenciamento; T031–T037 bloqueiam retention base; T038–T069 bloqueiam core, preview, registry wiring e core I/O; T070–T078 bloqueiam export; T079–T110 são as superfícies; T111–T113 são integrações transversais; T114–T119 são a validação final.

**A feature não é concluída por número de task, Phase nominal ou sucesso parcial. Após T119 ser marcada, a condição de término é a inexistência de qualquer `- [ ]` em `tasks.md`, todos os gates obrigatórios aprovados e `checklists/delivery.md` preenchido com evidência real.**
