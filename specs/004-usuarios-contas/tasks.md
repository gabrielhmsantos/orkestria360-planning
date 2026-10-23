# Tasks: Usuários e Contas Microsoft 365 V2

**Input**: Artefatos de design em `specs/004-usuarios-contas/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/` e `quickstart.md`

**Tests**: Obrigatórios por haver autorização, persistência, contrato Inertia, sincronização Graph, exportação e rotas novas. Cada fase de história inclui seu teste Feature independente; `composer ci:check` é o gate de lote e `composer test` é o gate completo.

**Organization**: uma fase por subtela/história da especificação. Tarefas de fundação não entregam uma superfície isolada, mas bloqueiam todas as histórias seguintes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode ser executada em paralelo depois das dependências explícitas, sem disputar o mesmo arquivo.
- **[Story]**: identifica a história/subtela que recebe a entrega.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: estabelecer a estrutura isolada do módulo e os contratos de teste antes de alterar o produto.

- [X] T001 Criar a estrutura inicial do módulo e README técnico em `orkestria360/app/Services/Microsoft365/UsersAccounts/README.md`, `orkestria360/resources/js/components/modules/users-accounts/.gitkeep` e `orkestria360/tests/Feature/UsersAccounts/.gitkeep`.
- [X] T002 [P] Criar fixture redigida de respostas Graph, incluindo paginação, delta, PIM restrito e coleções vazias, em `orkestria360/tests/Fixtures/Microsoft365/users-accounts.php`.
- [X] T003 [P] Criar dicionário, painel reutilizável de estados/fontes e componente de recomendação investigativa com evidência, condição, impedimento e próximo passo não operacional em `orkestria360/resources/js/components/modules/users-accounts/users-accounts-states.ts`, `source-status-panel.tsx` e `investigation-recommendation.tsx`.
- [X] T004 Registrar os comandos de validação de desenvolvimento da feature em `specs/004-usuarios-contas/quickstart.md` após confirmar caminhos reais de testes e comandos Artisan.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: construir a base de autorização, fotografia geracional, integração somente leitura e shell comum que todas as oito superfícies usam.

**⚠️ CRITICAL**: nenhuma história pode ser considerada pronta antes desta fase.

- [X] T005 Criar migrations da execução e geração publicável do tenant configurado, com `tenant_id` como escopo de dado, ciclo, cursor protegido, ponteiro exclusivo de publicação, estados e índices em `orkestria360/database/migrations/*_create_identity_sync_runs_table.php` e `orkestria360/database/migrations/*_create_identity_snapshot_generations_table.php`.
- [X] T006 [P] Criar migrations da fotografia normalizada, tombstones de `@removed` e snapshots materializados por geração em `orkestria360/database/migrations/*_create_directory_identities_table.php` e `orkestria360/database/migrations/*_create_identity_snapshots_table.php`.
- [X] T007 [P] Criar migrations de estado por fonte (incluindo disponibilidade, frescor, cobertura, motivo, último conhecido, `result_state`, páginas, tentativas e latência), configuração de janelas/timezone IANA (valor inicial `America/Sao_Paulo`) e trilha de acesso em `orkestria360/database/migrations/*_create_identity_source_states_table.php`, `orkestria360/database/migrations/*_create_tenant_activity_settings_table.php` e `orkestria360/database/migrations/*_create_identity_access_audits_table.php`.
- [X] T008 Implementar os models, casts criptografados para PII e cursor/delta link, evidência no disco privado, escopos obrigatórios por `tenant_id` e relações de geração em `orkestria360/app/Models/IdentitySyncRun.php`, `IdentitySnapshotGeneration.php`, `DirectoryIdentity.php`, `IdentitySnapshot.php`, `IdentitySourceState.php`, `TenantActivitySetting.php` e `IdentityAccessAudit.php`.
- [X] T009 Validar que as rotas de Usuários e Contas reutilizam exclusivamente os middlewares `auth` e `verified`, sem migration de papel, Gate ou matriz de acesso, em `orkestria360/routes/web.php` e `orkestria360/tests/Feature/UsersAccounts/UsersAccountsFoundationTest.php`.
- [X] T010 [P] Estender o contrato read-only com operações de usuários, delta, memberships de grupo, convidados, privilégios, MFA, risco, atividade e auditoria em `orkestria360/app/Support/Microsoft365/Contracts/GraphClient.php`.
- [X] T011 Implementar paginação, delta links opacos, métodos Graph com `$select`/permissões próprios, `signInActivity` com `$top` técnico máximo 500, retry limitado para `429`/`503` com `Retry-After` e backoff/jitter, diagnósticos sanitizados e download em requisição separada sem redirect automático ou bearer em `orkestria360/app/Support/Microsoft365/GraphDataClient.php`.
- [X] T012 Criar o coletor/orquestrador single-tenant com lock, staging materializado da geração publicada, merge idempotente por `graph_id`, tombstone de `@removed`, promoção transacional por ponteiro exclusivo, reconciliação diária de licenças por `/users` completo e reset de delta em `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsSynchronizer.php`.
- [X] T013 Criar command sem argumento de tenant e agendamento diário que usa somente `TenantContext` e o timezone IANA do tenant configurado em `orkestria360/app/Console/Commands/SyncMicrosoft365UsersAccounts.php` e `orkestria360/routes/console.php`.
- [X] T014 Criar contrato PHP e TypeScript do envelope comum (incluindo `availabilityStatus`, `freshness`, cobertura, motivo, geração e `resultState`) e recorder de acesso PII em `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsPageData.php`, `IdentityAccessAuditRecorder.php` e `orkestria360/resources/js/types/modules/users-accounts.ts`.
- [X] T015 Criar controller, rotas protegidas com registro de acesso PII e shell Inertia de abas para as oito superfícies em `orkestria360/app/Http/Controllers/Modules/UsersAccountsController.php`, `orkestria360/routes/web.php` e `orkestria360/resources/js/pages/modules/users-accounts.tsx`.
- [X] T016 Cobrir acesso por sessão autenticada/verificada sem diferenciação por papel, uso exclusivo do tenant configurado, promoção atômica concorrente, delta vazio, merge de item inalterado, tombstone de `@removed`, cursor/delta link protegido, cursor inválido, licenças reconciliadas por `/users`, diagnósticos de fonte, retry `429`/`503`, recorder de acesso PII e download sem redirect/bearer em `orkestria360/tests/Feature/UsersAccounts/UsersAccountsFoundationTest.php` e `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php`.
- [X] T017 Executar `composer ci:check` em `orkestria360/` e corrigir as falhas desta fundação antes de iniciar qualquer história.

**Checkpoint**: autorização, fotografia e shell estão prontos; cada superfície pode ser implementada sem chamada Graph no request web.

---

## Phase 3: User Story 1 — Ler o Dashboard Executivo (Priority: P1) 🎯 MVP

**Goal**: expor um resumo investigativo da geração publicada, com indicadores e cobertura explícita por bloco.

**Independent Test**: com fotografia disponível, uma pessoa usuária autenticada identifica totais, distribuição, qualidade, eventos e alertas; fontes limitadas aparecem como `restricted`/`unavailable`, nunca como zero.

- [X] T018 [P] [US1] Criar o view model de totais, distribuição por tipo e departamento, cobertura de segurança, qualidade, eventos, alertas, recomendações investigativas e blocos de cobertura do Dashboard em `orkestria360/app/Services/Microsoft365/UsersAccounts/ExecutiveDashboardPageData.php`.
- [X] T019 [P] [US1] Criar o teste Feature do dashboard cobrindo geração publicada, totais, tipos, departamentos, qualidade, eventos, alertas e fonte restrita sem total inventado em `orkestria360/tests/Feature/UsersAccounts/ExecutiveDashboardTest.php`.
- [X] T020 [US1] Implementar a projeção de indicadores, distribuição por tipo/departamento, cobertura de segurança, qualidade, eventos e alertas da geração publicada em `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsPageData.php`.
- [X] T021 [P] [US1] Implementar cards de totais, distribuição, qualidade, eventos, cobertura e alertas investigativos em `orkestria360/resources/js/components/modules/users-accounts/executive-dashboard-tab.tsx`.
- [X] T022 [US1] Integrar a aba Dashboard Executivo ao shell e aos links de aprofundamento disponíveis em `orkestria360/resources/js/pages/modules/users-accounts.tsx`.
- [X] T023 [US1] Executar o teste do dashboard e `composer ci:check` em `orkestria360/` antes de considerar o MVP pronto.

**Checkpoint**: US1 é demonstrável isoladamente pela rota base, usando apenas uma geração publicada.

---

## Phase 4: User Story 2 — Consultar o Diretório de Usuários (Priority: P1)

**Goal**: permitir localizar, filtrar, abrir e exportar uma identidade sem perder o recorte e sem expor PII indevidamente.

**Independent Test**: a pessoa autorizada busca e filtra identidades, abre o perfil, volta ao mesmo recorte e obtém CSV permitido; `no_matches`, vazio válido e fonte restrita são diferentes.

- [X] T024 [P] [US2] Criar migrations/models de exportação auditável e memberships de grupo com filtros canônicos, allowlist, cobertura, expiração e geração em `orkestria360/database/migrations/*_create_identity_exports_table.php`, `*_create_identity_group_memberships_table.php`, `orkestria360/app/Models/IdentityExport.php` e `IdentityGroupMembership.php`.
- [X] T025 [P] [US2] Criar testes Feature para lista local de 25 itens por página, perfil, retorno com query string, vazio filtrado, sessão não autenticada e neutralização de fórmula no CSV de Diretório em `orkestria360/tests/Feature/UsersAccounts/DirectoryTest.php`.
- [X] T026 [US2] Implementar coleta/projeção de memberships e consulta local de Diretório, filtros, ordenação, paginação e detalhe com licenças da geração publicada em `IdentitySnapshot` reconciliada por `/users`; `UserLicenseAssignment` só complementa um `SourceBlock` próprio com frescor declarado, sem substituir a geração, em `orkestria360/app/Services/Microsoft365/UsersAccounts/GroupMembershipsCollector.php`, `DirectoryQuery.php` e `UsersAccountsPageData.php`.
- [X] T027 [US2] Implementar controller e serviço de CSV protegido com revalidação de sessão, allowlist exata do Diretório (`displayName`, `userPrincipalName`, `userType`, `accountEnabled`, `department`, `jobTitle`, `licenseSummary`, `source`, `coverage`) e auditoria sem URL temporária em `orkestria360/app/Http/Controllers/Modules/UsersAccountsExportController.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/IdentityCsvExport.php`.
- [X] T028 [P] [US2] Implementar tipos, tabela, filtros e estado “resposta filtrada sem correspondências” em `orkestria360/resources/js/types/modules/users-accounts.ts` e `orkestria360/resources/js/components/modules/users-accounts/directory-tab.tsx`.
- [X] T029 [P] [US2] Implementar perfil de identidade com resumo, dados cadastrais, acessos, licenças, grupos, autenticação e histórico por fonte em `orkestria360/resources/js/components/modules/users-accounts/identity-profile.tsx`.
- [X] T030 [US2] Adicionar rotas de detalhe e exportação, preservando query de origem e bloqueando superfícies não exportáveis, em `orkestria360/routes/web.php` e `orkestria360/app/Http/Controllers/Modules/UsersAccountsController.php`.
- [X] T031 [US2] Executar testes do Diretório e exportação e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US2 funciona sem depender de dashboards ou telas posteriores e não realiza leitura Graph durante a navegação.

---

## Phase 5: User Story 3 — Priorizar Saúde das Contas (Priority: P1)

**Goal**: exibir a condição de habilitação de Saúde sem criar achado, categoria, severidade ou recomendação enquanto o catálogo estiver ausente.

**Independent Test**: uma pessoa usuária autenticada identifica score, achados, categorias, distribuição, evolução e recomendações como `unavailable`, com a condição de habilitação explícita e sem CTA investigativo.

- [X] T032 [P] [US3] Criar teste Feature que confirma score, achados, categorias, distribuição, evolução e recomendações de Saúde como `unavailable` sem catálogo aprovado em `orkestria360/tests/Feature/UsersAccounts/AccountHealthTest.php`.
- [X] T033 [US3] Implementar projeção explícita da condição de habilitação de Saúde, sem migration/model de achados ou cálculo de score nesta V2, em `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsPageData.php`.
- [X] T034 [P] [US3] Implementar a aba de saúde com categorias, distribuição, evolução, recomendações e score visíveis como `unavailable`, sem filtros ou severidade de achados inexistentes, em `orkestria360/resources/js/components/modules/users-accounts/account-health-tab.tsx`.
- [X] T035 [US3] Remover qualquer CTA de achado para perfil enquanto não existir catálogo aprovado e manter somente condição de habilitação em `orkestria360/resources/js/pages/modules/users-accounts.tsx`.
- [X] T036 [US3] Executar o teste de Saúde das Contas e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US3 não inventa score, achado, categoria, tendência, severidade ou recomendação sem catálogo aprovado.

---

## Phase 6: User Story 4 — Analisar Atividade e Inatividade (Priority: P1)

**Goal**: classificar sinais de atividade com as janelas configuráveis do tenant e apresentar sua cobertura real.

**Independent Test**: uma pessoa usuária autenticada identifica 30/60/90 dias, nunca usada após 15 dias e licenciada sem uso; fonte ausente é `restricted` com último dado conhecido quando houver.

- [X] T037 [P] [US4] Criar migration e model de sinais de atividade com origem, período, cobertura e evidência protegida em `orkestria360/database/migrations/*_create_identity_activity_signals_table.php` e `orkestria360/app/Models/IdentityActivitySignal.php`.
- [X] T038 [P] [US4] Criar teste Feature para janelas 15/30/60/90, configuração do tenant, lista visual de 25 itens, estado restrito e link ao perfil com recorte preservado em `orkestria360/tests/Feature/UsersAccounts/ActivityInactivityTest.php`.
- [X] T039 [US4] Implementar coleta/projeção que separa `signInActivity` (`$top` técnico máximo 500), logs e relatório CSV, segue todas as páginas Graph e alimenta a lista local visual de 25 itens, incluindo download sem bearer e cabeçalhos permitidos, em `orkestria360/app/Services/Microsoft365/UsersAccounts/ActivitySignalsCollector.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsSynchronizer.php`.
- [X] T040 [US4] Implementar classificação por configuração do tenant e cruzamento read-only com licenças em `orkestria360/app/Services/Microsoft365/UsersAccounts/ActivityClassification.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsPageData.php`.
- [X] T041 [P] [US4] Implementar gráficos, faixas, lista paginada de 25 contas, links ao perfil com recorte preservado e estados de cobertura em `orkestria360/resources/js/components/modules/users-accounts/activity-inactivity-tab.tsx`.
- [X] T042 [US4] Executar o teste de Atividade/Inatividade e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US4 comunica a fonte de cada classificação e não deduz inatividade da ausência de dados.

---

## Phase 7: User Story 5 — Investigar Contas Privilegiadas (Priority: P1)

**Goal**: distinguir privilégios permanentes de PIM e conservar a restrição P2 como informação útil.

**Independent Test**: uma pessoa usuária autenticada vê funções permanentes, escopo e sinais associados; resposta PIM `AadPremiumLicenseRequired` aparece como `restricted`, não como lista vazia.

- [X] T043 [P] [US5] Criar migrations/models de privilégios, registro MFA e sinais de risco com origem, cobertura e diagnóstico em `orkestria360/database/migrations/*_create_administrative_privileges_table.php`, `*_create_identity_mfa_registrations_table.php`, `*_create_identity_risk_signals_table.php`, `orkestria360/app/Models/AdministrativePrivilege.php`, `IdentityMfaRegistration.php` e `IdentityRiskSignal.php`.
- [X] T044 [P] [US5] Criar teste Feature para funções permanentes, bloco PIM restrito sem P2 e link ao perfil com recorte preservado em `orkestria360/tests/Feature/UsersAccounts/PrivilegedAccountsTest.php`.
- [X] T045 [US5] Implementar coletores isolados de funções permanentes/PIM, MFA e risco, mapeando `403`/`AadPremiumLicenseRequired` para diagnóstico sanitizado, em `orkestria360/app/Services/Microsoft365/UsersAccounts/PrivilegesCollector.php`, `MfaRiskCollector.php` e `UsersAccountsSynchronizer.php`.
- [X] T046 [US5] Implementar projeção de privilégio, MFA, risco e atividade sem colapsar fontes em `orkestria360/app/Services/Microsoft365/UsersAccounts/PrivilegedAccountsPageData.php`.
- [X] T047 [P] [US5] Implementar a aba de Contas Privilegiadas com seções permanentes, PIM, links ao perfil e cobertura por fonte em `orkestria360/resources/js/components/modules/users-accounts/privileged-accounts-tab.tsx`.
- [X] T048 [US5] Executar o teste de Contas Privilegiadas e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US5 permanece útil no tenant sem P2 e não afirma que não existem elegibilidades.

---

## Phase 8: User Story 6 — Governar Convidados e Usuários Externos (Priority: P2)

**Goal**: disponibilizar a leitura B2B base e tornar dependências internas ausentes transparentes.

**Independent Test**: uma pessoa usuária autenticada filtra convidados, vê domínio, estado B2B e licença; atividade pode estar restrita sem ocultar dados básicos e campos internos são `unavailable`.

- [X] T049 [P] [US6] Criar teste Feature de convidados, atividade restrita, campos internos indisponíveis e link ao perfil com recorte preservado em `orkestria360/tests/Feature/UsersAccounts/GuestUsersTest.php`.
- [X] T050 [US6] Implementar projeção de convidados a partir de `DirectoryIdentity`, licenças da geração publicada em `IdentitySnapshot` reconciliada por `/users` e fontes complementares separadas; `UserLicenseAssignment` só complementa um `SourceBlock` próprio com frescor declarado, sem substituir a geração, em `orkestria360/app/Services/Microsoft365/UsersAccounts/GuestUsersPageData.php`.
- [X] T051 [P] [US6] Implementar lista, filtros B2B, domínio, licença, atividade, componente de recomendação investigativa, link ao perfil e estados indisponíveis no componente `orkestria360/resources/js/components/modules/users-accounts/guest-users-tab.tsx`.
- [X] T052 [US6] Atualizar o detalhe da identidade para declarar patrocinador, classificação e revisão como fontes não aprovadas em `orkestria360/resources/js/components/modules/users-accounts/identity-profile.tsx`.
- [X] T053 [US6] Executar o teste de Convidados e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US6 não exige atividade, RH ou patrocinador para tornar B2B investigável.

---

## Phase 9: User Story 7 — Acompanhar o Ciclo de Vida (Priority: P2)

**Goal**: apresentar etapas e capacidades futuras sem criar operação, solicitação ou integração mutável.

**Independent Test**: uma pessoa usuária autenticada enxerga etapas, solicitações, tarefas, SLAs, indicadores e atalhos; cada ação informa “Em breve” e não cria efeito no tenant nem no banco.

- [X] T054 [P] [US7] Criar teste Feature que garante superfície completa e ausência de rotas mutáveis para ciclo de vida em `orkestria360/tests/Feature/UsersAccounts/LifecycleTest.php`.
- [X] T055 [US7] Implementar payload estático versionado de capacidades e condições de habilitação em `orkestria360/app/Services/Microsoft365/UsersAccounts/LifecyclePageData.php`.
- [X] T056 [P] [US7] Implementar a aba Ciclo de Vida, estados `coming_soon` e feedback não operacional de ações em `orkestria360/resources/js/components/modules/users-accounts/lifecycle-tab.tsx`.
- [X] T057 [US7] Executar o teste de Ciclo de Vida e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US7 mantém a visão do sponsor sem adicionar workflows fora do escopo.

---

## Phase 10: User Story 8 — Investigar Histórico e Auditoria (Priority: P2)

**Goal**: investigar eventos por recorte e exportar somente o conteúdo autorizado, respeitando cobertura e retenção.

**Independent Test**: uma pessoa usuária autenticada filtra eventos por período, categoria, atividade ou identidade, abre detalhe e exporta CSV permitido; fonte sem permissão/retenção é explícita e não vira coleção vazia.

- [X] T058 [P] [US8] Criar migrations e models de eventos de diretório/autenticação, incluindo origem, ator, alvo, resultado, cobertura e referência privada, em `orkestria360/database/migrations/*_create_directory_audit_events_table.php`, `*_create_sign_in_events_table.php`, `orkestria360/app/Models/DirectoryAuditEvent.php` e `orkestria360/app/Models/SignInEvent.php`.
- [X] T059 [P] [US8] Criar teste Feature para métricas por categoria, tendência, criticidade, filtros, detalhe, link ao perfil com recorte preservado, restrição de fonte, retenção exibida e neutralização de fórmula no CSV em `orkestria360/tests/Feature/UsersAccounts/AuditHistoryTest.php`.
- [X] T060 [US8] Implementar coletor isolado de auditoria/autenticação e persistência de diagnóstico de cobertura em `orkestria360/app/Services/Microsoft365/UsersAccounts/AuditEventsCollector.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsSynchronizer.php`.
- [X] T061 [US8] Implementar consulta local paginada de 25 itens, detalhe, métricas por categoria, tendência e criticidade de eventos com recorte preservado em `orkestria360/app/Services/Microsoft365/UsersAccounts/AuditHistoryQuery.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsPageData.php`.
- [X] T062 [P] [US8] Implementar métricas, tendência, criticidade, tabela paginada de 25 itens, filtros, detalhe, link ao perfil com recorte preservado e CTA de CSV da auditoria em `orkestria360/resources/js/components/modules/users-accounts/audit-history-tab.tsx`.
- [X] T063 [US8] Estender o exportador para a allowlist exata de Histórico/Auditoria (`occurredAt`, `source`, `category`, `activity`, `actor`, `target`, `result`, `detectedAt`, `collectedAt`, `coverage`), neutralização de fórmula e rota somente leitura em `orkestria360/app/Services/Microsoft365/UsersAccounts/IdentityCsvExport.php` e `orkestria360/app/Http/Controllers/Modules/UsersAccountsExportController.php`.
- [X] T064 [US8] Executar o teste de Histórico/Auditoria e `composer ci:check` em `orkestria360/`.

**Checkpoint**: US8 entrega rastreabilidade local com cobertura explícita e não expõe evidência bruta.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: completar retenção, segurança, responsividade, documentação e a validação de ponta a ponta.

- [X] T065 [P] Implementar command agendado de retenção de 12 meses para o tenant configurado, preservando `tenant_id` como escopo de dados, para snapshots, sinais, eventos, evidências e metadados de exportação em `orkestria360/app/Console/Commands/PruneMicrosoft365UsersAccounts.php` e `orkestria360/routes/console.php`.
- [X] T066 [P] Criar testes de retenção, casts criptografados/armazenamento privado de evidência, ausência de PII em logs, auditoria de acesso/exportação e métricas por fonte em `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSecurityRetentionTest.php`.
- [X] T067 Revisar responsividade, teclado, leitores de tela, estados vazios, painel comum de fonte e recomendações nas oito abas em `orkestria360/resources/js/components/modules/users-accounts/`.
- [X] T068 Atualizar `specs/004-usuarios-contas/quickstart.md` com a validação manual de SC-001 (investigação inicial em até 3 minutos) e SC-002 (Diretório/perfil em até 3 interações).
- [X] T069 Executar a validação completa do quickstart, `composer test` e `git diff --check` em `orkestria360/` e no repositório raiz antes de declarar a feature concluída.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: pode começar imediatamente.
- **Foundational (Phase 2)**: depende de T001–T004 e bloqueia todas as histórias.
- **US1–US8**: dependem da fundação. A ordem recomendada é US1 → US2 → US3 → US4 → US5 → US6 → US7 → US8; depois de T017, equipes diferentes podem implementar histórias sem editar os mesmos arquivos.
- **Polish (Phase 11)**: depende das histórias que forem incluídas na entrega; T065 e T066 devem ocorrer antes do gate completo.

### User Story Dependencies

| Story | Depends on | Pode ser demonstrada isoladamente após |
|---|---|---|
| US1 Dashboard | Fundação | T023 |
| US2 Diretório | Fundação; utiliza dados de identidade e licenças da fundação | T031 |
| US3 Saúde | Fundação; não depende do perfil enquanto o catálogo estiver ausente | T036 |
| US4 Atividade | Fundação; leitura cruzada de licenças | T042 |
| US5 Privilegiadas | Fundação; coleta isolada de PIM/MFA/risco | T048 |
| US6 Convidados | Fundação; detalhe US2 para enriquecimento opcional | T053 |
| US7 Ciclo de Vida | Fundação | T057 |
| US8 Histórico | Fundação; reusa exportador da US2 | T064 |

### Parallel Opportunities

- Na fundação, T005–T007, T009–T010 e T014 podem ocorrer em paralelo quando seus arquivos forem distintos; T011–T013 permanecem sequenciais.
- Depois de T017, as tarefas marcadas `[P]` dentro de cada história podem ocorrer em paralelo com os testes e componentes que não disputam arquivos.
- US3, US4, US5, US6 e US7 podem ser distribuídas entre pessoas diferentes após a fundação; US8 depende somente do exportador pronto na US2.

## Parallel Examples

### Foundation

```text
Task: "T005 Criar migrations da execução e geração em database/migrations/*_identity_*"
Task: "T007 Criar migrations de fonte, janelas e auditoria em database/migrations/*_identity_*"
Task: "T009 Validar middlewares auth/verified e ausência de papéis em routes/web.php"
Task: "T010 Estender GraphClient em app/Support/Microsoft365/Contracts/GraphClient.php"
```

### User Story 2

```text
Task: "T024 Criar IdentityExport migration/model"
Task: "T025 Criar DirectoryTest.php"
Task: "T028 Implementar directory-tab.tsx e tipos"
Task: "T029 Implementar identity-profile.tsx"
```

### User Story 4

```text
Task: "T037 Criar IdentityActivitySignal migration/model"
Task: "T038 Criar ActivityInactivityTest.php"
Task: "T041 Implementar activity-inactivity-tab.tsx"
```

### User Story 5

```text
Task: "T043 Criar AdministrativePrivilege migration/model"
Task: "T044 Criar PrivilegedAccountsTest.php"
Task: "T047 Implementar privileged-accounts-tab.tsx"
```

## Implementation Strategy

### MVP First (US1)

1. Completar Setup e Fundação, principalmente autenticação existente, geração publicada, sincronização e shell.
2. Implementar US1 e executar T023.
3. Demonstrar o Dashboard somente com a fotografia local e os blocos de cobertura; não avançar para outras abas para mascarar lacunas.

### Incremental Delivery

1. Fundação → US1 Dashboard → validar e demonstrar.
2. US2 Diretório/exportação → validar e demonstrar investigação nominal protegida.
3. US3 Saúde, US4 Atividade e US5 Privilégios → validar cada superfície e diagnósticos de fonte.
4. US6 Convidados, US7 Ciclo de Vida e US8 Histórico → validar os recortes P2.
5. Completar retenção, segurança e o gate final antes de concluir a feature.

## Notes

- Cada tarefa segue o formato obrigatório de checklist, identificador sequencial, marcador paralelo apenas quando aplicável, rótulo da história e caminho exato.
- Restrições Graph, vazio válido e resultado filtrado sem correspondências são estados de produto; nunca preencher indicadores/listas com zero para escondê-los.
- A implementação não cria comandos de escrita no tenant, não entrega XLSX e não cria workflow de ciclo de vida.
