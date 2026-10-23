# Tasks: Otimização dos Syncs Microsoft 365

**Input**: Artefatos de specs/006-otimizar-sync-m365/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ e quickstart.md

**Tests**: Obrigatórios. A feature muda integrações reais, persistência e fluxos de sincronização; escrever/regredir os testes antes de alterar cada comportamento e executar os gates definidos em cada checkpoint.

## Format: [ID] [P?] [Story] Description

- **[P]**: Pode ser realizado em paralelo, pois atua em arquivos distintos e não depende de tarefa pendente da mesma fase.
- **[US1]**, **[US2]**, **[US3]**: Liga a tarefa à jornada da especificação.

## Phase 1: Setup e rastreabilidade compartilhada

**Purpose**: Preparar o contexto e os pontos de teste sem alterar o comportamento publicado.

- [X] T001 Revisar specs/006-otimizar-sync-m365/{spec.md,plan.md,research.md,data-model.md,contracts/*.md,quickstart.md} e registrar os contratos de aceitação no início dos testes afetados em orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php e orkestria360/tests/Feature/Groups/GroupsSyncTest.php
- [X] T002 [P] Inventariar mocks e helpers de App\Support\Microsoft365\Contracts\GraphClient em orkestria360/tests/Feature/{UsersAccounts,Groups,Licensing} antes de expandir o contrato Graph
- [X] T003 [P] Confirmar os componentes de estado já reutilizáveis em orkestria360/resources/js/components/modules/ para cobertura, frescor e indisponibilidade, sem introduzir nova tela

---

## Phase 2: Foundation — estado de ciclo, coleta e telemetria

**Purpose**: Criar a infraestrutura que bloqueia as três jornadas e permite publicar dados de forma íntegra.

**⚠️ CRITICAL**: Nenhuma jornada deve iniciar antes da conclusão desta fase.

- [X] T004 Criar migrations por php artisan make:migration em orkestria360/database/migrations/ para microsoft365_sync_cycles, microsoft365_sync_stages, microsoft365_collection_positions, microsoft365_event_ingestion_batches, microsoft365_event_ingestion_batch_events e microsoft365_retention_policies, além de índices tenant/data nos eventos canônicos, com índices e unicidade definidos em specs/006-otimizar-sync-m365/data-model.md
- [X] T005 [P] Criar modelos por php artisan make:model em orkestria360/app/Models/Microsoft365{SyncCycle,SyncStage,CollectionPosition,EventIngestionBatch,EventIngestionBatchEvent,RetentionPolicy}.php e LicensingSourceState.php com fillable, casts e relações necessárias
- [X] T006 Criar a persistência de métricas de etapa em orkestria360/app/Services/Microsoft365/Sync/SyncStageRecorder.php, incluindo status, páginas, itens, tentativas, espera, duração e falha sanitizada
- [X] T007 [P] Criar testes de contrato de paginação, retry, 410 e métricas em orkestria360/tests/Feature/UsersAccounts/GraphDataClientTest.php e orkestria360/tests/Feature/Groups/GroupsGraphDataClientTest.php antes de evoluir o cliente Graph
- [X] T008 Evoluir orkestria360/app/Support/Microsoft365/Contracts/GraphClient.php e orkestria360/app/Support/Microsoft365/GraphDataClient.php para contratos de coleta paginada com metadados, links opacos e suporte a consultas temporais de eventos, conforme T007
- [X] T009 Implementar em orkestria360/app/Support/Microsoft365/GraphDataClient.php a política única de tentativas: Retry-After integral, backoff exponencial com jitter na ausência do cabeçalho e registro de métricas por requisição
- [X] T010 Estender orkestria360/app/Models/{IdentitySourceState,GroupSourceState,LicensingSourceState}.php e suas migrations para publicar cobertura, janela, páginas, tentativas, latência, estado skipped e regra de frescor de 26 horas de forma uniforme
- [X] T011 Executar composer ci:check em orkestria360/ e corrigir os problemas desta fundação antes das jornadas

**Checkpoint**: Modelo de ciclo, posição incremental, telemetria e cliente Graph são utilizáveis por qualquer sincronizador.

---

## Phase 3: User Story 1 — Dados consolidados confiáveis (Priority: P1) 🎯 MVP

**Goal**: Publicar snapshots incrementais de usuários e grupos, e derivar Licenciamento da mesma fotografia canônica sem reler usuários.

**Independent Test**: Simular inclusão, alteração e tombstone em usuários/grupos; confirmar promoção de geração sem leitura completa e atribuições de licença derivadas da fotografia de identidade publicada.

### Tests for User Story 1

- [X] T012 [P] [US1] Reescrever cenários de delta, tombstone, reset e ausência de listDirectoryUsers() em orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php
- [X] T013 [P] [US1] Reescrever cenários de delta, tombstone, grupos afetados e ausência de listDirectoryGroups() em orkestria360/tests/Feature/Groups/GroupsSyncTest.php
- [X] T014 [P] [US1] Adicionar cenários de reutilização da fotografia de identidade, ausência de listLicensingUsers(), preservação de fontes próprias e estado de SKU/CSV em orkestria360/tests/Feature/{LicensingSyncTest.php,LicensingDashboardTest.php}

### Implementation for User Story 1

- [X] T015 [US1] Definir e testar o superset estável de propriedades de delta em orkestria360/app/Support/Microsoft365/GraphDataClient.php, orkestria360/app/Services/Microsoft365/UsersAccounts/DirectoryQuery.php e orkestria360/tests/Feature/UsersAccounts/{GraphDataClientTest.php,DirectoryTest.php}, cobrindo campos usados por Licenciamento e Atividade e aplicando seleção, ordenação, limite e filtros no snapshot local quando houver superset; quando a fonte não os entregar, preservar a última projeção e publicar estado restricted/unavailable, sem introduzir fallback N+1. Se algum consumidor passar a exigir campos exclusivos de `licenseDetails`, registrar requisito/contrato e provar fonte ou projeção equivalente antes de retirar sua coleta
- [X] T016 [US1] Refatorar orkestria360/app/Services/Microsoft365/UsersAccounts/{UsersAccountsSynchronizer.php,GroupMembershipsCollector.php} e orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php para copiar a geração publicada ao staging, aplicar apenas itens delta e @removed, limitar `memberOf` a identidades afetadas, reconciliar semanalmente todas as associações usuário–grupo e promover em transação curta sem HTTP
- [X] T017 [US1] Refatorar orkestria360/app/Services/Microsoft365/Groups/GroupsSynchronizer.php e orkestria360/app/Services/Microsoft365/Groups/collectors/DirectoryGroupsCollector.php para materializar grupos pelo delta, expor IDs alterados aos coletores e promover sem HTTP em transação
- [X] T018 [US1] Refatorar orkestria360/app/Console/Commands/SyncMicrosoft365Licensing.php para derivar UserLicenseAssignment de IdentitySnapshot compatível, mantendo SKUs e relatório de uso como fontes próprias
- [X] T019 [US1] Registrar reset de cursor, geração publicada e motivo de falha nos source states em orkestria360/app/Services/Microsoft365/{UsersAccounts,Groups} sem avançar links delta incompletos
- [X] T020 [US1] Executar os testes de UsersAccountsSyncTest.php, GroupsSyncTest.php, LicensingSyncTest.php, LicensingDashboardTest.php, UsersAccountsFoundationTest.php e GroupsFoundationTest.php em orkestria360/ e corrigir regressões de US1

**Checkpoint**: Usuários, Grupos e Licenciamento usam coleções canônicas sem duplicar leituras completas em ciclo incremental válido.

---

## Phase 4: User Story 2 — Histórico de auditoria íntegro (Priority: P1)

**Goal**: Coletar directory audits e sign-ins uma única vez por janela, com paginação total, watermark de 15 minutos, deduplicação e retenção ajustável de 180 dias.

**Independent Test**: Simular duas páginas de cada evento e falha antes do fim; confirmar que o watermark não avança, a nova execução não duplica eventos e as projeções de Usuários/Grupos usam a mesma coleção canônica.

### Tests for User Story 2

- [X] T021 [P] [US2] Adicionar cenários de janela fechada, múltiplas páginas, overlap, deduplicação, lote staging/publicado, replay de evento já publicado com falha do lote novo e avanço atômico de sign-ins em orkestria360/tests/Feature/UsersAccounts/{GraphDataClientTest.php,AuditHistoryTest.php}
- [X] T022 [P] [US2] Adicionar cenários de directory audits canônicos e projeção local de grupos em orkestria360/tests/Feature/Groups/AuditHistoryTest.php
- [X] T023 [P] [US2] Criar cenários de retenção de 180 dias e mudança de política em orkestria360/tests/Feature/UsersAccounts/UsersAccountsSecurityRetentionTest.php

### Implementation for User Story 2

- [X] T024 [US2] Criar o coletor canônico de eventos em orkestria360/app/Services/Microsoft365/Sync/CanonicalAuditEventsCollector.php para abrir lote staging, ler directory audits e sign-ins por watermark com janela fechada, paginar, deduplicar por external_id, criar associação append-only evento/lote e publicar o lote antes de avançar a posição
- [X] T025 [US2] Refatorar orkestria360/app/Services/Microsoft365/UsersAccounts/AuditEventsCollector.php para projetar apenas associações de lotes publicados, publicar cobertura/frescor e preservar a projeção anterior sem nova chamada Graph
- [X] T026 [US2] Refatorar orkestria360/app/Services/Microsoft365/Groups/collectors/GroupAuditCollector.php para projetar DirectoryAuditEvent de associações de lotes publicados, removendo listDirectoryAudits() do fluxo de Grupos
- [X] T027 [US2] Criar manutenção de política de retenção em orkestria360/app/Services/Microsoft365/Sync/EventRetentionPruner.php e comando Artisan correspondente em orkestria360/app/Console/Commands/, aplicando o prazo configurável de 180 dias somente a eventos de lotes publicados
- [X] T028 [US2] Expor e testar a matriz de cobertura/frescor de contracts/source-state.md para recent_sample, failed, skipped, dado anterior e ausência sem zero em orkestria360/app/Services/Microsoft365/{UsersAccounts/UsersAccountsPageData.php,Groups/GroupsPageData.php,Licensing/LicensingPageData.php}, orkestria360/resources/js/components/modules/{users-accounts/audit-history-tab.tsx,groups/audit-history-tab.tsx,licensing/licensing-dashboard-tab.tsx} e orkestria360/tests/Feature/{UsersAccounts/AuditHistoryTest.php,Groups/AuditHistoryTest.php,LicensingDashboardTest.php}
- [X] T029 [US2] Executar os testes de auditoria, retenção e cliente Graph em orkestria360/tests/Feature/{UsersAccounts,Groups}/ e corrigir regressões de US2

**Checkpoint**: Eventos são completos por janela, idempotentes e reutilizados pelas duas projeções; a interface comunica a cobertura real.

---

## Phase 5: User Story 3 — Operação previsível da sincronização (Priority: P2)

**Goal**: Executar um único ciclo coordenado, com lock global, dependências explícitas, etapas puladas e diagnóstico operacional legível.

**Independent Test**: Fazer a fonte de identidades falhar e a de grupos concluir; confirmar publicação de Grupos, skip de Licenciamento, preservação da geração de Identidades e saída/estado por etapa.

### Tests for User Story 3

- [X] T030 [P] [US3] Criar testes de dependência, skip e publicação de etapas independentes, incluindo grupos alterados, grupos inalterados e fixture de 10.000 grupos sem leituras derivadas extras, em orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php
- [X] T031 [P] [US3] Criar testes de lock global, duração, telemetria e falha sanitizada em orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php
- [X] T032 [P] [US3] Adicionar teste de agendamento único diário às 03:00 no timezone de TenantActivitySetting, prune separado e limite de frescor de 26 horas em orkestria360/tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php

### Implementation for User Story 3

- [X] T033 [US3] Criar orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php com DAG de etapas do contrato specs/006-otimizar-sync-m365/contracts/sync-command.md, publicação independente e skip de dependentes
- [X] T034 [US3] Criar por php artisan make:command o comando orkestria360/app/Console/Commands/SyncMicrosoft365.php com parâmetros tenant, --force e --full-reconciliation, saída legível e lock global por tenant
- [X] T035 [US3] Atualizar orkestria360/routes/console.php para agendar app:sync-microsoft365 diariamente às 03:00 no timezone de TenantActivitySetting, o comando de retenção de eventos após esse ciclo, manter PruneMicrosoft365UsersAccounts separado e remover os agendamentos concorrentes dos três comandos legados
- [X] T036 [US3] Adaptar orkestria360/app/Console/Commands/{SyncMicrosoft365Licensing,SyncMicrosoft365UsersAccounts,SyncMicrosoft365Groups}.php, seus serviços e orkestria360/tests/Feature/UsersAccounts/UsersAccountsFoundationTest.php para serem etapas invocáveis pelo coordenador, preservando execução manual compatível; publicar roles, PIM, MFA e risco como snapshots periódicos independentes com `complete_snapshot`, data de referência, cobertura e frescor próprios
- [X] T037 [US3] Integrar SyncStageRecorder e source states em orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php para reportar métricas, cobertura e motivo de skip/falha por etapa
- [X] T038 [US3] Atualizar projeções e testes de relacionamentos em orkestria360/app/Services/Microsoft365/Groups/{GroupRelationshipsProjection.php,collectors/GroupRelationshipsCollector.php,collectors/GroupLicensingCollector.php} e orkestria360/tests/Feature/Groups/{GroupsSyncTest.php,MembersOwnersTest.php} para processar apenas grupos alterados, reconciliar semanalmente remoções e declarar transitiveMembers como coletado ou indisponível
- [X] T039 [US3] Reutilizar relatórios sem atualização em orkestria360/app/Services/Microsoft365/Groups/collectors/GroupActivityCollector.php e orkestria360/app/Console/Commands/SyncMicrosoft365Licensing.php conforme reportRefreshDate
- [X] T040 [US3] Executar php artisan test tests/Feature/Microsoft365/CoordinatedSyncTest.php e php artisan test tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php em orkestria360/ e corrigir regressões de US3

**Checkpoint**: Um único comando coordena o tenant, preserva etapas independentes e entrega diagnóstico operacional verificável.

---

## Phase 6: Polish e validação transversal

**Purpose**: Confirmar qualidade, contratos e desempenho depois de todas as jornadas.

- [X] T041 [P] Revisar orkestria360/app/Services/Microsoft365/ para garantir que nenhuma chamada HTTP ocorre em DB::transaction() de promoção e substituir loops persistentes seguros por upsert
- [X] T042 [P] Revisar os estados de disponibilidade/frescor nos componentes tocados em orkestria360/resources/js/components/modules/ e garantir que relações não coletadas não apareçam como zero
- [X] T043 Atualizar referências operacionais em docs/MICROSOFT365-SYNC-AVALIACAO.md e specs/006-otimizar-sync-m365/quickstart.md com os comandos e métricas efetivamente implementados
- [X] T044 Executar composer ci:check em orkestria360/ após o lote completo e corrigir lint, formatação, tipos ou testes
- [X] T045 Executar composer test em orkestria360/, repetir os cenários de specs/006-otimizar-sync-m365/quickstart.md e registrar o resultado antes de concluir a feature

---

## Dependencies & Execution Order

\`\`\`text
Phase 1 Setup
      ↓
Phase 2 Foundation
      ├── US1 Dados canônicos (MVP técnico)
      ├── US2 Eventos íntegros
      └── US3 Operação coordenada
              ├── depende de US1 para Licenciamento derivado
              └── depende de US2 para projeções de auditoria canônicas
      ↓
Phase 6 Polish e gates completos
\`\`\`

- **US1 (P1)** pode ser validada após a Foundation e é o MVP técnico.
- **US2 (P1)** pode iniciar após a Foundation em paralelo a US1; as projeções de auditoria continuam independentes até o coordenador conectá-las.
- **US3 (P2)** depende das interfaces estabilizadas por US1 e US2 para orquestrar todas as etapas, mas seus testes de lock/telemetria podem começar após a Foundation.
- A Phase 6 depende das três jornadas concluídas.

## Parallel Opportunities

- Na Foundation, T005, T007 e T010 podem avançar em paralelo após a migration T004; T008 depende de T007 e T009 depende de T008.
- Em US1, T012, T013 e T014 são testes independentes; depois, T016 e T017 atuam em domínios diferentes.
- Em US2, T021, T022 e T023 são independentes; T024 antecede T025 e T026.
- Em US3, T030, T031 e T032 podem ser criadas em paralelo; T034 e T035 podem avançar depois que T033 estabilizar o contrato.
- T041 e T042 atuam em camadas distintas e podem avançar em paralelo antes de T043–T045.

## Implementation Strategy

### MVP First

1. Completar Phases 1 e 2.
2. Entregar US1: delta efetivo e snapshot de identidade reutilizado por Licenciamento.
3. Validar T020 e composer ci:check antes de avançar.

### Incremental Delivery

1. Acrescentar US2 para tornar os históricos completos e idempotentes.
2. Acrescentar US3 para consolidar o agendamento e a operação.
3. Executar Phase 6 e só concluir depois de composer test verde.

## Task Validation

- Todas as 45 tarefas usam o formato obrigatório de checklist, ID sequencial e caminhos explícitos.
- As 9 tarefas de US1, 9 de US2 e 11 de US3 estão identificadas por jornada; setup, foundation e polish não recebem rótulo de jornada.
- Cada jornada possui teste independente, implementação e checkpoint antes das dependências de entrega seguintes.
