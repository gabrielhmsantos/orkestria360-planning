# Tasks: Microsoft 365 — Autenticação (MFA)

**Input**: Artefatos em `specs/007-m365-mfa/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/` e `quickstart.md`

**Tests**: Obrigatórios para sincronização, persistência, projeções, rotas, contratos Inertia e cada aba, conforme a especificação e a constituição.

**Organization**: As tarefas estão agrupadas por história para que cada aba seja verificável de modo independente, depois de concluída a base de dados publicada.

## Phase 1: Setup

**Purpose**: Confirmar o ponto de extensão e preparar os contratos tipados sem criar um novo comando ou scheduler.

- [X] T001 Mapear os estágios e métricas atuais do sync coordenado em `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php` e registrar o desenho MFA em `specs/007-m365-mfa/research.md`
- [X] T002 [P] Criar tipos de props, estados de fonte, filtros e linhas minimizadas em `orkestria360/resources/js/types/modules/mfa.ts`
- [X] T003 [P] Criar a base de testes MFA autenticada em `orkestria360/tests/Feature/Mfa/MfaFoundationTest.php`
- [X] T004 [P] Registrar o roteiro de validação de fonte, licença e telefone em `specs/007-m365-mfa/quickstart.md`

---

## Phase 2: Foundational — sync, snapshots e contrato de página

**Purpose**: Disponibilizar fatos canônicos publicados e o limite HTTP/Inertia que bloqueiam todas as abas.

**⚠️ CRITICAL**: Nenhuma aba pode calcular fatos diretamente do Graph ou misturar staging com uma geração publicada.

- [X] T005 Criar migration e modelo de snapshots de política por endpoint em `orkestria360/database/migrations/2026_08_12_013001_create_mfa_method_policy_snapshots_table.php` e `orkestria360/app/Models/MfaMethodPolicySnapshot.php`
- [X] T006 [P] Criar migration e modelo do catálogo configurável sem UI com os defaults do sponsor em `orkestria360/database/migrations/2026_08_12_013002_create_mfa_method_classifications_table.php`, `orkestria360/app/Models/MfaMethodClassification.php` e `orkestria360/database/seeders/MfaMethodClassificationSeeder.php`
- [X] T007 [P] Criar migration e modelo da série publicada de cobertura em `orkestria360/database/migrations/2026_08_12_013003_create_mfa_coverage_snapshots_table.php` e `orkestria360/app/Models/MfaCoverageSnapshot.php`
- [X] T008 [P] Criar migration e modelo de `riskDetections` com id externo e retenção de evento em `orkestria360/database/migrations/2026_08_12_013004_create_risk_detection_events_table.php` e `orkestria360/app/Models/RiskDetectionEvent.php`
- [X] T009 Estender o contrato e cliente Graph canônicos com `collectMfaRegistrations()` e `collectRiskyUsers()` paginados, itens/páginas/tentativas e endpoints MFA/políticas/risco em `orkestria360/app/Support/Microsoft365/Contracts/GraphClient.php` e `orkestria360/app/Support/Microsoft365/GraphDataClient.php`
- [X] T010 [P] Cobrir paginação, retry/throttling, métricas MFA/risky users e contratos de novos endpoints Graph em `orkestria360/tests/Feature/UsersAccounts/GraphDataClientTest.php`
- [X] T011 Evoluir o coletor de registro para consumir `collectMfaRegistrations()`, persistir todos os campos exclusivos de `userRegistrationDetails` e publicar métricas reais em `orkestria360/app/Services/Microsoft365/UsersAccounts/MfaRegistrationCollector.php`
- [X] T012 Criar coletor de snapshots independentes para política de métodos, strengths, Conditional Access e security defaults em `orkestria360/app/Services/Microsoft365/Mfa/AuthenticationPolicySnapshotCollector.php`
- [X] T013 Criar coletor canônico de `riskDetections` com posição temporal, overlap, lote staging/publicado e vínculo de evento; separar seu estado de `riskyUsers` em `orkestria360/app/Services/Microsoft365/Mfa/RiskDetectionsCollector.php`, `orkestria360/app/Models/Microsoft365CollectionPosition.php`, `orkestria360/app/Models/Microsoft365EventIngestionBatchEvent.php` e `orkestria360/app/Services/Microsoft365/Sync/PublishedEventQuery.php`
- [X] T014 Estender a projeção minimizada de sign-ins e directory audits, sem uma segunda leitura Graph, em `orkestria360/app/Services/Microsoft365/Sync/CanonicalAuditEventsCollector.php`
- [X] T015 Substituir o estágio agregado `identity_secondary_snapshots` por estágios únicos `privileges`, `mfa_registration`, `risk_users` e `risk_detections`, preservando a coleta existente de roles/PIM e sem leitura Graph duplicada; executar `mfa_policy` somente após `groups` e `group_relationships` publicados no ciclo, com telemetria e preservação de publicação anterior, em `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsSynchronizer.php`
- [X] T016 Estender a retenção de `riskDetections` pelo pipeline canônico de lotes publicados (180 dias) e de snapshots MFA/política (12 meses) em `orkestria360/app/Services/Microsoft365/Sync/EventRetentionPruner.php`, `orkestria360/app/Console/Commands/PruneMicrosoft365Events.php` e `orkestria360/app/Console/Commands/PruneMicrosoft365UsersAccounts.php`
- [X] T017 Cobrir sync coordenado, telemetria MFA/risky users, 200 vazio válido, 403/restrito, falha com publicação anterior, paginação, privilégios preservados e ausência de leituras duplicadas em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php`, `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php` e `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php`
- [X] T018 Criar resolvedor local de elegibilidade, classificação e canais de `mobilePhone` por escopo SMS/Voice/grupos em `orkestria360/app/Services/Microsoft365/Mfa/MfaPolicyApplicabilityResolver.php` e `orkestria360/app/Services/Microsoft365/Mfa/MfaEligibilityService.php`
- [X] T019 Cobrir defaults do catálogo, inclusive `sms`/`voice` fracos, include/exclude, ambas políticas desabilitadas, um canal, dois canais e escopo não resolvido em `orkestria360/tests/Feature/Mfa/MfaPolicyApplicabilityTest.php`
- [X] T020 Criar `MfaPageData::for(string $tab, array $query)` com whitelist normalizada e projeções exclusivamente publicadas em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T021 Criar controller fino que passa `$request->query()` ao page data e rotas GET/HEAD sem mutação/exportação em `orkestria360/app/Http/Controllers/Modules/MfaController.php` e `orkestria360/routes/web.php`
- [X] T022 Regenerar e consumir rotas Wayfinder MFA em `orkestria360/resources/js/routes/mfa/index.ts` e `orkestria360/resources/js/actions/App/Http/Controllers/Modules/MfaController.ts`
- [X] T023 Cobrir autenticação uniforme, rotas GET/HEAD, ausência de rotas de alteração e envelope Inertia publicado em `orkestria360/tests/Feature/Mfa/MfaFoundationTest.php` e `orkestria360/tests/Feature/Mfa/MfaRoutesTest.php`
- [X] T024 Criar adaptador compartilhado de disponibilidade/frescor, painel de detalhe minimizado e suporte a gauge em `orkestria360/resources/js/components/modules/mfa/mfa-availability.tsx`, `orkestria360/resources/js/components/modules/mfa/mfa-detail-panel.tsx` e `orkestria360/resources/js/components/modules/chart-panel.tsx`

**Checkpoint**: Um ciclo coordenado publica as fontes disponíveis, preserva as anteriores em erro/restrição e a rota MFA entrega somente projeções locais tipadas.

---

## Phase 3: User Story 1 — Consultar postura executiva de MFA (Priority: P1) 🎯 MVP

**Goal**: Entregar o Dashboard Executivo que contextualiza postura e indisponibilidades sem concluir que uma fonte ausente equivale a zero.

**Independent Test**: Abrir a raiz MFA com combinações de fontes publicada, restrita e indisponível e confirmar títulos, contexto, última coleta e todos os blocos da história.

- [X] T025 [P] [US1] Criar os dados e testes da projeção Dashboard para score indisponível, KPIs, cobertura, evolução, métodos, riscos, tipo e aplicações em `orkestria360/tests/Feature/Mfa/ExecutiveDashboardTest.php`
- [X] T026 [US1] Implementar a projeção Dashboard com fontes, última publicação e PII minimizada em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T027 [US1] Criar o shell fino, `Head`, `PageScaffold`, hero sem Atualizar e navegação de abas em `orkestria360/resources/js/pages/modules/mfa.tsx`
- [X] T028 [US1] Implementar **MFA Health Score** (gauge), **KPI** (métrica), **Cobertura de MFA** (donut), **Evolução da cobertura de MFA** (linha), **Métodos mais utilizados** (barras), **Principais riscos e alertas** (tabela), **Distribuição por tipo de usuário** (donut) e **Top 5 aplicações com maior uso de MFA** (ranking) em `orkestria360/resources/js/components/modules/mfa/executive-dashboard-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [X] T029 [US1] Validar o contrato Inertia, resumo textual dos gráficos, teclado e ausência do controle Atualizar em `orkestria360/tests/Feature/Mfa/ExecutiveDashboardTest.php`

**Checkpoint**: O dashboard é uma entrega MVP completa e independente sobre snapshots publicados.

---

## Phase 4: User Story 2 — Investigar cobertura e registro (Priority: P1)

**Goal**: Permitir localizar identidades por cobertura e capacidade, mantendo elegibilidade/exceções sem base como indisponíveis.

**Independent Test**: Buscar uma identidade, filtrar status/capacidade/tipo e paginar o diretório sem dados de fonte vazarem como resultados favoráveis.

- [X] T030 [P] [US2] Criar testes de filtros, paginação, no-match, fonte indisponível e geração publicada em `orkestria360/tests/Feature/Mfa/CoverageRegistrationTest.php`
- [X] T031 [US2] Implementar filtros e projeção minimizada de cobertura/diretório em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T032 [US2] Implementar **KPI** (métrica), **Distribuição por status de MFA** (donut), **Evolução da cobertura de MFA** (linha), **Cobertura por tipo de usuário** (barras empilhadas), **Usuários por status de MFA** (tabela) com o painel de detalhe compartilhado, **Destaques** e **Oportunidades de melhoria** (listas) em `orkestria360/resources/js/components/modules/mfa/coverage-registration-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [X] T033 [US2] Validar filtros por query string, paginação, PII minimizada e percentuais bloqueados sem elegibilidade íntegra em `orkestria360/tests/Feature/Mfa/CoverageRegistrationTest.php`

---

## Phase 5: User Story 3 — Avaliar métodos de autenticação (Priority: P2)

**Goal**: Exibir catálogo e adoção normalizados com classificação configurável e telefone resolvido por política publicada.

**Independent Test**: Abrir a aba com registro MFA publicado e confirmar distribuição; ao restringir política/uso, confirmar o estado explícito de cada bloco.

- [X] T034 [P] [US3] Criar testes de catálogo, classificação e estados por fonte de métodos em `orkestria360/tests/Feature/Mfa/AuthenticationMethodsTest.php`
- [X] T035 [US3] Implementar a projeção de métodos, classificação e `phoneChannels` no contrato Inertia em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T036 [US3] Implementar **KPI** (métrica), **Distribuição de usuários por método registrado** (donut), **Adoção dos métodos ao longo do tempo** (linhas), **Distribuição por nível de segurança dos métodos** (donut), **Métodos de autenticação disponíveis** (tabela) e laterais **Recomendações**/**Métodos mais utilizados** em `orkestria360/resources/js/components/modules/mfa/authentication-methods-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [X] T037 [US3] Cobrir `mobilePhone` para política desligada, canais por grupos, indisponibilidade de escopo e ausência de ação de tenant em `orkestria360/tests/Feature/Mfa/AuthenticationMethodsTest.php`

---

## Phase 6: User Story 4 — Investigar eventos e utilização (Priority: P2)

**Goal**: Consultar sign-ins publicados por janela, método, aplicação, localização e dispositivo.

**Independent Test**: Trocar período, comparação e granularidade e confirmar que análises/tabela usam a mesma janela; restringir sign-ins e confirmar a mensagem de licença/fonte.

- [X] T038 [P] [US4] Criar testes de janela, filtros, paginação, cobertura e fonte restrita em `orkestria360/tests/Feature/Mfa/EventsUsageTest.php`
- [X] T039 [US4] Implementar consulta local publicada de sign-ins e agregações da aba em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T040 [US4] Implementar **KPI** (métrica), **Autenticações ao longo do tempo** (séries), **Autenticações por método** (donut), **Autenticações por aplicação** (barras), **Taxa de sucesso por método** (tabela), **Autenticações por localização** (mapa/lista), **Autenticações por dispositivo** (barras), **Últimos eventos de autenticação** (tabela) e **Insights e recomendações** (lista) em `orkestria360/resources/js/components/modules/mfa/events-usage-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [X] T041 [US4] Validar sincronismo de filtros, resumo textual e ausência de Graph no controller/page-data em `orkestria360/tests/Feature/Mfa/EventsUsageTest.php`

---

## Phase 7: User Story 5 — Investigar falhas e bloqueios (Priority: P2)

**Goal**: Contextualizar falhas e bloqueios sem limiares implícitos, automação ou remediação.

**Independent Test**: Filtrar falhas publicadas e confirmar categorias, rankings e eventos minimizados; verificar que recorrência/alertas sem regra permanecem contextuais ou indisponíveis.

- [X] T042 [P] [US5] Criar testes de categorias, filtros, rankings, estados normativos indisponíveis e tabela em `orkestria360/tests/Feature/Mfa/FailuresLockoutsTest.php`
- [X] T043 [US5] Implementar projeção local de falhas/bloqueios por janela publicada em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T044 [US5] Implementar **KPI** (métrica), **Falhas ao longo do tempo** (séries), **Falhas por categoria** (donut), **Falhas por método** (barras), rankings **Usuários com falhas recorrentes**/**IPs com maior volume de falhas**/**Aplicações com mais falhas**, **Últimos eventos de falha** (tabela) e **Ações recomendadas** (lista) em `orkestria360/resources/js/components/modules/mfa/failures-lockouts-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [X] T045 [US5] Validar ações somente orientativas, PII minimizada e ausência de bloqueio/revogação na rota MFA em `orkestria360/tests/Feature/Mfa/FailuresLockoutsTest.php`

---

## Phase 8: User Story 6 — Avaliar políticas e proteção (Priority: P2)

**Goal**: Distinguir métodos, forças, Conditional Access e security defaults sem inferir conformidade a partir de registro MFA.

**Independent Test**: Abrir com uma ou mais fontes de política restritas e confirmar que cada controle preserva procedência e disponibilidade própria.

- [X] T046 [P] [US6] Criar testes de fontes de política independentes, exceções indisponíveis e nenhuma alteração de tenant em `orkestria360/tests/Feature/Mfa/PoliciesProtectionTest.php`
- [X] T047 [US6] Implementar projeções por endpoint de política, procedência e restrições de score/exceção em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [X] T048 [US6] Implementar **MFA Protection Score** (gauge), controles de proteção, tabelas **Política de Métodos de Autenticação**/**Forças de Autenticação**/**Acesso Condicional relacionado a MFA**, **Resumo de Proteções**, **Exceções e Exclusões** e **Status das Políticas** em `orkestria360/resources/js/components/modules/mfa/policies-protection-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [X] T049 [US6] Validar que registro, exigência, política e uso efetivo permanecem semanticamente distintos em `orkestria360/tests/Feature/Mfa/PoliciesProtectionTest.php`

---

## Phase 9: User Story 7 — Priorizar usuários de risco (Priority: P3)

**Goal**: Mostrar risco licenciado/consentido com contexto minimizado e sem remediação.

**Independent Test**: Com licença ausente, verificar estado restrito; com snapshots publicados, filtrar e abrir detalhe minimizado.

- [x] T050 [P] [US7] Criar testes de licença P2, filtros, detalhe e ausência de remediação em `orkestria360/tests/Feature/Mfa/RiskyUsersTest.php`
- [x] T051 [US7] Implementar projeção local de risky users e risk detections publicados em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [x] T052 [US7] Integrar o painel de detalhe minimizado da fundação à tabela de risco em `orkestria360/resources/js/components/modules/mfa/risky-users-tab.tsx`
- [x] T053 [US7] Implementar **KPI** (métrica), **Evolução de usuários de risco** (linhas), **Riscos por tipo** (donut), **Risco por localização** (mapa/lista), **Usuários de risco** (tabela), **Ações rápidas** (lista ordenada) e **Insights e recomendações** (lista) em `orkestria360/resources/js/components/modules/mfa/risky-users-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [x] T054 [US7] Validar estado restrito distinto de vazio, detalhe minimizado e nenhum endpoint de redefinição/revogação em `orkestria360/tests/Feature/Mfa/RiskyUsersTest.php`

---

## Phase 10: User Story 8 — Consultar histórico e auditoria (Priority: P3)

**Goal**: Pesquisar mudanças MFA com retenção efetiva, origem e detalhe minimizado.

**Independent Test**: Filtrar período/categoria, abrir detalhe e verificar origem Microsoft/Orkestria; restringir auditoria e confirmar a limitação sem oferecer exportação.

- [x] T055 [P] [US8] Criar testes de período, categoria, origem, retenção e detalhe minimizado em `orkestria360/tests/Feature/Mfa/AuditHistoryTest.php`
- [x] T056 [US8] Implementar projeção local de directory audits, ações internas futuras e retenção efetiva em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [x] T057 [US8] Implementar **KPI** (métrica), **Período de retenção** (KPI específico), **Eventos de auditoria** (tabela) com o painel de detalhe compartilhado, **Filtros rápidos de atividade** (lista), **Origens dos eventos** (donut), **Retenção e armazenamento** (lista), **Ações disponíveis** (lista ordenada), **Detalhes do evento selecionado** (pares atributo/valor) e **Informações adicionais** (estrutura colapsável) em `orkestria360/resources/js/components/modules/mfa/audit-history-tab.tsx`, conforme a [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md)
- [x] T058 [US8] Validar retenção por tenant, indisponibilidade de auditoria, fonte da evidência e exportação/ações sensíveis restritas em `orkestria360/tests/Feature/Mfa/AuditHistoryTest.php`

---

## Phase 11: Polish & cross-cutting concerns

**Purpose**: Garantir consistência do módulo e concluir as verificações de entrega.

- [x] T059 [P] Executar e documentar validação por teclado e viewport estreito das oito abas — destino, filtros, detalhe, foco, rolagem horizontal, tema e resumo textual — em `specs/007-m365-mfa/quickstart.md` e `orkestria360/tests/Feature/Mfa/`
- [x] T060 [P] Revisar consistência de disponibilidade, frescor, cobertura e motivo sanitizado entre abas em `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php`
- [x] T061 Executar a suíte MFA e sync focada, corrigindo regressões em `orkestria360/tests/Feature/Mfa/` e `orkestria360/tests/Feature/Microsoft365/`
- [x] T062 Executar o gate de lote `composer ci:check` em `orkestria360/composer.json`
- [x] T063 Executar o gate final `composer test` em `orkestria360/composer.json`
- [x] T064 Atualizar estado do roadmap e marcar tarefas concluídas somente após os gates em `specs/007-m365-mfa/tasks.md`

---

## Dependencies & Execution Order

### Phase dependencies

- Phase 1 não depende de outras fases.
- Phase 2 depende da Phase 1 e bloqueia todas as histórias: entrega fatos publicados, políticas, resolvedor de telefone e rota/contrato.
- US1 e US2 (P1) começam após a Phase 2. US3–US8 usam a mesma fundação e podem avançar após a respectiva projeção/fonte estar publicada.
- A Phase 11 começa somente depois das histórias desejadas.

### User story dependencies

- **US1 (P1)**: depende apenas da fundação; é o MVP recomendado.
- **US2 (P1)**: depende apenas da fundação e é testável de modo independente do dashboard.
- **US3 (P2)**: depende do resolvedor de política de telefone da fundação; não depende visualmente de US1/US2.
- **US4 (P2)** e **US5 (P2)**: dependem da projeção canônica de sign-ins da fundação e são independentes entre si.
- **US6 (P2)**: depende dos snapshots de política da fundação.
- **US7 (P3)**: depende dos snapshots de risco da fundação.
- **US8 (P3)**: depende dos directory audits e retenção da fundação.

### Parallel opportunities

- T002–T004 e T005–T010 têm trabalho em arquivos distintos, respeitando as dependências de schema antes dos coletores.
- Depois de T023, US1 e US2 podem ser implementadas em paralelo.
- Depois de T023, US3, US6, US7 e US8 podem avançar em paralelo se suas respectivas fontes forem concluídas; US4 e US5 podem avançar juntas após T014.
- Em cada aba, o teste inicial marcado `[P]` pode ser produzido em paralelo com componentes que não alteram o mesmo arquivo; a implementação do `MfaPageData.php` deve ser serializada para evitar conflito.

## Parallel Example: User Story 4

```text
T038 — teste de filtros e cobertura em tests/Feature/Mfa/EventsUsageTest.php
T040 — componente da aba em resources/js/components/modules/mfa/events-usage-tab.tsx
```

## Implementation Strategy

1. Concluir Phase 1 e Phase 2 para obter sync publicado, rotas e contrato seguro.
2. Entregar US1 como MVP e validar Dashboard com fontes reais ou explicitamente indisponíveis.
3. Entregar US2, depois US3–US6 por fonte e valor operacional; finalizar US7 e US8 quando licença/auditoria forem consumíveis.
4. Executar Phase 11 e só então considerar a feature concluída.

## Format Validation

Todos os 64 itens seguem `- [ ] T### [P?] [US#?] descrição com caminho de arquivo`; rótulos de história aparecem somente nas fases de história.
