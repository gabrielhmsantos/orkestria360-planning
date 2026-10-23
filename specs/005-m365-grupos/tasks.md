# Tasks: Grupos Microsoft 365 V2

**Input**: Design documents from `specs/005-m365-grupos/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/groups-inertia.md`, `contracts/groups-sync.md` and `quickstart.md`

**Tests**: obrigatórios para sincronização, contrato Inertia, navegação, estados
de dados e regressões, conforme a constituição e a spec.

**Organization**: tarefas agrupadas pela história que entrega cada superfície.
Toda tarefa de história tem marcador `[US#]`; tarefas compartilhadas ficam nas
fases de Setup e Fundação.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar a extensão do módulo Microsoft 365 sem criar um cliente,
aplicação ou política de acesso paralela.

- [X] T001 Criar os diretórios iniciais do domínio e os stubs mínimos em `orkestria360/app/Services/Microsoft365/Groups/.gitkeep`, `orkestria360/resources/js/components/modules/groups/.gitkeep`, `orkestria360/resources/js/routes/groups/.gitkeep` e `orkestria360/tests/Feature/Groups/.gitkeep`
- [X] T002 [P] Declarar os tipos compartilhados de disponibilidade, fonte, frescor, paginação e abas em `orkestria360/resources/js/types/modules/groups.ts`
- [X] T003 [P] Criar os helpers de rota tipada para Dashboard, abas e detalhe de grupo em `orkestria360/resources/js/routes/groups/index.ts`
- [X] T004 [P] Registrar a convenção de uso do domínio, geração publicada e estados de fonte em `orkestria360/app/Services/Microsoft365/Groups/README.md`
- [X] T005 [P] Criar a base de testes autenticada e o contrato de oito abas em `orkestria360/tests/Feature/Groups/GroupsFoundationTest.php`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: tornar possível coletar, publicar e apresentar dados de Grupos de
forma consistente antes de implementar qualquer superfície.

**⚠️ CRITICAL**: nenhuma história começa antes da geração publicada, estados de
fonte, contrato Graph, rota e shell da página estarem prontos.

- [X] T006 Criar as migrations tenant-scoped para execução, geração, catálogo, relações, snapshots, eventos e estados de fonte em `orkestria360/database/migrations/*_create_group_sync_runs_table.php`, `*_create_group_snapshot_generations_table.php`, `*_create_directory_groups_table.php`, `*_create_group_relationships_table.php`, `*_create_group_snapshots_table.php`, `*_create_group_audit_events_table.php` e `*_create_group_source_states_table.php`; `group_relationships` deve tipar `member`/`owner`/`parent`, permitir escopo `direct`/`transitive` somente para membros e aplicar índice/uniquidade idempotente por tenant, geração, grupo, identidade e tipo
- [X] T007 [P] Criar os models e relações de geração, catálogo, membros, proprietários, snapshots, eventos e estado de fonte em `orkestria360/app/Models/GroupSyncRun.php`, `GroupSnapshotGeneration.php`, `DirectoryGroup.php`, `GroupMembership.php`, `GroupOwner.php`, `GroupActivitySnapshot.php`, `GroupLicenseSnapshot.php`, `GroupLifecycleSnapshot.php`, `GroupAuditEvent.php` e `GroupSourceState.php`; `GroupMembership` e `GroupOwner` são projeções com escopo fixo da tabela tipada `group_relationships`
- [X] T008 Estender o contrato read-only com operações de catálogo, delta, relações, dinâmicos, licença, ciclo, atividade e auditoria em `orkestria360/app/Support/Microsoft365/Contracts/GraphClient.php`
- [X] T009 Implementar paginação, normalização de falhas, redirect de relatório e cursor delta no cliente existente em `orkestria360/app/Support/Microsoft365/GraphDataClient.php`
- [X] T010 Implementar o sincronizador com lock, staging, promoção atômica, preservação da geração publicada e reset de cursor em `orkestria360/app/Services/Microsoft365/Groups/GroupsSynchronizer.php`
- [X] T011 Implementar coletores comuns de diretório e relações em `orkestria360/app/Services/Microsoft365/Groups/collectors/DirectoryGroupsCollector.php` e `GroupRelationshipsCollector.php`, e estados de fonte em `orkestria360/app/Services/Microsoft365/Groups/GroupSourceStateRecorder.php`
- [X] T012 Implementar command de sincronização e seu agendamento sem sobreposição em `orkestria360/app/Console/Commands/SyncMicrosoft365Groups.php` e `orkestria360/routes/console.php`
- [X] T013 Implementar a projeção exclusiva da geração publicada e o envelope Inertia comum em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php`
- [X] T014 Implementar controller, rotas GET autenticadas e bloqueio de métodos mutáveis em `orkestria360/app/Http/Controllers/Modules/GroupsController.php` e `orkestria360/routes/web.php`
- [X] T015 Implementar a página shell com `PageScaffold`, `ModuleHero`, `ModuleTabBar`, `DataAvailabilityPanel`, `SourceMetadata` e `DataFreshness` em `orkestria360/resources/js/pages/modules/groups.tsx` e `orkestria360/resources/js/components/modules/groups/groups-states.tsx`
- [X] T016 Cobrir sincronização, geração publicada, tenant único, estados de fonte, audiência única e rotas somente GET em `orkestria360/tests/Feature/Groups/GroupsFoundationTest.php`, `orkestria360/tests/Feature/Groups/GroupsSyncTest.php` e `orkestria360/tests/Feature/Groups/GroupsGraphDataClientTest.php`
- [X] T017 Executar a fundação e o gate de build em `orkestria360/tests/Feature/Groups/GroupsFoundationTest.php` e `orkestria360/composer.json` com `php artisan test tests/Feature/Groups/GroupsFoundationTest.php` e `composer ci:check`

**Checkpoint**: o módulo abre suas oito abas a partir de uma geração publicada;
fontes indisponíveis não derrubam a página e não existe rota de escrita.

---

## Phase 3: User Story 1 - Priorizar a saúde dos grupos (Priority: P1) 🎯 MVP

**Goal**: entregar o Dashboard Executivo com leitura consolidada, proveniência e
encaminhamentos de investigação.

**Independent Test**: abrir `/microsoft-365/grupos` com fontes completas e
parciais e verificar KPIs, análises, atenção, estados e resumos textuais.

- [X] T018 [P] [US1] Criar a projeção de composição, distribuição, tendência, atenção e encaminhamentos do dashboard em `orkestria360/app/Services/Microsoft365/Groups/ExecutiveDashboardPageData.php`
- [X] T019 [P] [US1] Criar os componentes de KPIs, painéis analíticos, atenção e resumo textual acessível em `orkestria360/resources/js/components/modules/groups/executive-dashboard-tab.tsx` e `orkestria360/resources/js/components/modules/groups/group-chart-panels.tsx`
- [X] T020 [US1] Integrar o payload do dashboard e os links de aprofundamento no shell em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php` e `orkestria360/resources/js/pages/modules/groups.tsx`
- [X] T021 [US1] Cobrir Dashboard, score ponderado, evidência ausente como zero, fontes parciais e equivalente textual dos gráficos em `orkestria360/tests/Feature/Groups/ExecutiveDashboardTest.php`
- [X] T022 [US1] Executar os testes do Dashboard e `composer ci:check` a partir de `orkestria360/tests/Feature/Groups/ExecutiveDashboardTest.php` e `orkestria360/composer.json`

---

## Phase 4: User Story 2 - Consultar o diretório de grupos (Priority: P1)

**Goal**: localizar grupos por pesquisa/filtros, paginar resultados e abrir
contexto preservando o recorte de investigação.

**Independent Test**: aplicar filtros e paginação, abrir um grupo e retornar ao
Diretório sem perder a query; diferenciar sem correspondências de indisponibilidade.

- [X] T023 [P] [US2] Implementar consulta local de diretório, filtros, ordenação, paginação e detalhe de grupo em `orkestria360/app/Services/Microsoft365/Groups/DirectoryGroupsQuery.php` e `orkestria360/app/Services/Microsoft365/Groups/GroupProfilePageData.php`
- [X] T024 [P] [US2] Implementar filtro, tabela acessível, paginação e painel de detalhe em `orkestria360/resources/js/components/modules/groups/directory-tab.tsx` e `orkestria360/resources/js/components/modules/groups/group-profile.tsx`
- [X] T025 [US2] Integrar parâmetros de query e rota de detalhe sem exportação em `orkestria360/app/Http/Controllers/Modules/GroupsController.php`, `orkestria360/routes/web.php` e `orkestria360/resources/js/routes/groups/index.ts`
- [X] T026 [US2] Cobrir filtros, `no_matches`, `empty_valid_response`, paginação, detalhe e preservação de query em `orkestria360/tests/Feature/Groups/DirectoryTest.php`
- [X] T027 [US2] Executar os testes do Diretório e `composer ci:check` a partir de `orkestria360/tests/Feature/Groups/DirectoryTest.php` e `orkestria360/composer.json`

---

## Phase 5: User Story 3 - Investigar membros e proprietários (Priority: P1)

**Goal**: apresentar relações de membros, proprietários e vínculos superiores
sem confundir cobertura restrita com ausência de responsabilidade.

**Independent Test**: selecionar grupo com relações completas e outro com fonte
restrita e confirmar a separação de conceitos e seus estados.

- [X] T028 [P] [US3] Implementar projeção de membros, proprietários, relações superiores, distribuições e alertas em `orkestria360/app/Services/Microsoft365/Groups/MembersOwnersPageData.php`
- [X] T029 [P] [US3] Implementar lista, detalhe lateral, distribuições, alertas e recomendações em `orkestria360/resources/js/components/modules/groups/members-owners-tab.tsx`
- [X] T030 [US3] Conectar a aba de relações à geração publicada e ao detalhe do grupo em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php` e `orkestria360/resources/js/pages/modules/groups.tsx`
- [X] T031 [US3] Cobrir relações diretas/transitivas, proprietários, ausência não inferida, visibilidade restrita e resumo textual/valores equivalentes das distribuições em `orkestria360/tests/Feature/Groups/MembersOwnersTest.php`
- [X] T032 [US3] Executar os testes de Membros e Proprietários e `composer ci:check` a partir de `orkestria360/tests/Feature/Groups/MembersOwnersTest.php` e `orkestria360/composer.json`

---

## Phase 6: User Story 4 - Monitorar grupos dinâmicos (Priority: P2)

**Goal**: investigar regras, processamento e mudanças recentes de grupos
dinâmicos, mantendo o simulador como capacidade futura.

**Independent Test**: abrir a aba com dados disponíveis e com requisito de
licença ausente e confirmar lista, estado e simulador `coming_soon`.

- [X] T033 [P] [US4] Implementar coleta e projeção de regras, processamento, mudanças e disponibilidade de licença em `orkestria360/app/Services/Microsoft365/Groups/collectors/DynamicGroupsCollector.php` e `orkestria360/app/Services/Microsoft365/Groups/DynamicGroupsPageData.php`
- [X] T034 [P] [US4] Implementar KPIs, tabela de regras, estado, alterações e intenção de simulador em `orkestria360/resources/js/components/modules/groups/dynamic-groups-tab.tsx`
- [X] T035 [US4] Integrar a aba dinâmica e seus estados de fonte em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php` e `orkestria360/resources/js/pages/modules/groups.tsx`
- [X] T036 [US4] Cobrir filtro de dinâmicos, processamento, restrição P1/P2, resposta vazia, simulador sem escrita e resumo textual/valores equivalentes dos painéis analíticos em `orkestria360/tests/Feature/Groups/DynamicGroupsTest.php`; executar `php artisan test tests/Feature/Groups/DynamicGroupsTest.php` e `composer ci:check`

---

## Phase 7: User Story 5 - Investigar licenciamento por grupo (Priority: P2)

**Goal**: mostrar atribuições, processamento, erros e oportunidades sem exibir
custo sem fonte corporativa.

**Independent Test**: abrir a aba com atribuições e erros, confirmar que custo
fica indisponível sem fonte e que nenhuma ação altera licenças.

- [X] T037 [P] [US5] Implementar coleta e snapshots de atribuição, processamento e erros de membros em `orkestria360/app/Services/Microsoft365/Groups/collectors/GroupLicensingCollector.php` e `orkestria360/app/Services/Microsoft365/Groups/GroupLicensingPageData.php`
- [X] T038 [P] [US5] Implementar distribuição, ranking, tabela, erros e estado de custo indisponível em `orkestria360/resources/js/components/modules/groups/group-licensing-tab.tsx`
- [X] T039 [US5] Integrar a aba de licenciamento à geração publicada e aos metadados de fonte em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php` e `orkestria360/resources/js/pages/modules/groups.tsx`
- [X] T040 [US5] Cobrir atribuições, `membersWithLicenseErrors`, custo indisponível, ações sem mutação e resumo textual/valores equivalentes dos painéis analíticos em `orkestria360/tests/Feature/Groups/GroupLicensingTest.php`; executar `php artisan test tests/Feature/Groups/GroupLicensingTest.php` e `composer ci:check`

---

## Phase 8: User Story 6 - Avaliar governança e ciclo de vida (Priority: P2)

**Goal**: exibir evidências de expiração e política, deixando governança interna
e revisões executáveis explicitamente indisponíveis ou futuras.

**Independent Test**: visualizar expiração/política disponíveis e, sem fonte
interna, confirmar finalidade, responsáveis e revisão como indisponíveis.

- [X] T041 [P] [US6] Implementar coleta de ciclo de vida, snapshots e projeção de capacidades internas/futuras em `orkestria360/app/Services/Microsoft365/Groups/collectors/LifecycleCollector.php` e `orkestria360/app/Services/Microsoft365/Groups/GroupLifecyclePageData.php`
- [X] T042 [P] [US6] Implementar status, fluxo, expiração, políticas e estados `unavailable`/`coming_soon` em `orkestria360/resources/js/components/modules/groups/governance-lifecycle-tab.tsx`
- [X] T043 [US6] Integrar a aba de ciclo de vida, sem endpoints de renovação ou revisão, em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php`, `orkestria360/resources/js/pages/modules/groups.tsx` e `orkestria360/routes/web.php`
- [X] T044 [US6] Cobrir expiração, política vazia válida, governança indisponível, ações futuras sem escrita e resumo textual/valores equivalentes dos painéis analíticos em `orkestria360/tests/Feature/Groups/LifecycleTest.php`; executar `php artisan test tests/Feature/Groups/LifecycleTest.php` e `composer ci:check`

---

## Phase 9: User Story 7 - Investigar atividade e inatividade (Priority: P2)

**Goal**: exibir sinais temporais de uso e candidatos a investigação, sem
classificar grupos de segurança sem telemetria como inativos.

**Independent Test**: comparar grupo Microsoft 365 com telemetria e grupo de
segurança sem sinal, verificando faixa, cobertura e ausência de falso positivo.

- [X] T045 [P] [US7] Implementar leitura de relatório redirecionado, normalização de CSV e snapshots de atividade em `orkestria360/app/Services/Microsoft365/Groups/collectors/GroupActivityCollector.php` e `orkestria360/app/Services/Microsoft365/Groups/GroupActivityPageData.php`
- [X] T046 [P] [US7] Implementar faixas, tendência, impacto, tabela e estado de evidência ausente em `orkestria360/resources/js/components/modules/groups/activity-inactivity-tab.tsx`
- [X] T047 [US7] Integrar a aba de atividade e seus metadados de cobertura/frescor em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php` e `orkestria360/resources/js/pages/modules/groups.tsx`
- [X] T048 [US7] Cobrir redirect de relatório, faixas, segurança sem telemetria, falha transitória, ausência de inatividade inferida e resumo textual/valores equivalentes dos painéis analíticos em `orkestria360/tests/Feature/Groups/ActivityInactivityTest.php`; executar `php artisan test tests/Feature/Groups/ActivityInactivityTest.php` e `composer ci:check`

---

## Phase 10: User Story 8 - Rastrear histórico e auditoria (Priority: P2)

**Goal**: pesquisar eventos, exclusões e cobertura temporal de auditoria sem
prometer retenção, restauração ou exportação.

**Independent Test**: filtrar eventos e abrir detalhe; simular retenção limitada
e falha de fonte, confirmando a declaração de cobertura preservada.

- [X] T049 [P] [US8] Implementar coleta incremental, normalização de eventos, exclusões e projeção de retenção em `orkestria360/app/Services/Microsoft365/Groups/collectors/GroupAuditCollector.php` e `orkestria360/app/Services/Microsoft365/Groups/GroupAuditPageData.php`
- [X] T050 [P] [US8] Implementar filtros, tendência, log, detalhe e estados de cobertura em `orkestria360/resources/js/components/modules/groups/audit-history-tab.tsx`
- [X] T051 [US8] Integrar a aba de auditoria à geração publicada e preservar query de filtros em `orkestria360/app/Services/Microsoft365/Groups/GroupsPageData.php`, `orkestria360/resources/js/pages/modules/groups.tsx` e `orkestria360/resources/js/routes/groups/index.ts`
- [X] T052 [US8] Cobrir filtros, eventos vazios válidos, retenção limitada, exclusões, nenhuma rota de exportação/escrita e resumo textual/valores equivalentes dos painéis analíticos em `orkestria360/tests/Feature/Groups/AuditHistoryTest.php`; executar `php artisan test tests/Feature/Groups/AuditHistoryTest.php` e `composer ci:check`

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: confirmar consistência, desempenho e prontidão antes de concluir a
feature.

- [X] T053 [P] Revisar responsividade, navegação por teclado, captions de tabela e resumos textuais de gráficos em `orkestria360/resources/js/components/modules/groups/`
- [X] T054 [P] Cobrir o contrato de audiência única e a ausência de endpoints mutáveis/exportação em `orkestria360/tests/Feature/Groups/GroupsFoundationTest.php` e `orkestria360/tests/Feature/Groups/GroupsRoutesTest.php`
- [X] T055 Validar o limite de 5 segundos para dashboard, filtro e detalhe com massa de até 10.000 grupos em `orkestria360/tests/Feature/Groups/GroupsPerformanceTest.php`
- [X] T056 Atualizar o roadmap da feature após cada marco concluído em `specs/005-m365-grupos/plan.md`
- [X] T057 Executar a suíte da feature e o gate completo em `orkestria360/tests/Feature/Groups/` e `orkestria360/composer.json` com `php artisan test tests/Feature/Groups`, `composer ci:check` e `composer test`
- [ ] T058 Conduzir teste de aceitação com 10 participantes do público previsto e registrar participante, cenário, tempo, êxito, ajuda recebida e impedimentos: localizar grupo/recorte via busca ou filtros sem ajuda em até 2 minutos (SC-002) e identificar origem, frescor e condição de um dado em até 30 segundos (SC-005); aprovar somente com ao menos 9 de 10 êxitos em cada critério

## Dependencies & Execution Order

```text
Setup (T001–T005)
  -> Foundation (T006–T017)
     -> US1 Dashboard (T018–T022)
     -> US2 Diretório (T023–T027)
     -> US3 Membros/Proprietários (T028–T032)
     -> US4 Dinâmicos (T033–T036)
     -> US5 Licenciamento (T037–T040)
     -> US6 Ciclo de Vida (T041–T044)
     -> US7 Atividade (T045–T048)
     -> US8 Auditoria (T049–T052)
        -> Polish (T053–T058)
```

- As histórias podem iniciar após a Fundação; a ordem recomendada preserva as
  prioridades P1 antes de P2 e permite entregar cada aba independentemente.
- US7 e US8 dependem dos coletores/snapshots da Fundação, mas não de uma aba P1.
- US5 pode reutilizar dados de licença do módulo existente somente como fonte
  suplementar, sem substituir a geração de Grupos.

## Parallel Opportunities

- Setup: T002–T005 podem ocorrer em paralelo após T001.
- Fundação: T007, T008 e T015 podem avançar em arquivos distintos; T010–T014
  dependem do contrato Graph e dos modelos necessários.
- Após T017, as tarefas marcadas `[P]` de cada história podem ser distribuídas
  entre pessoas diferentes; a integração e o teste de cada história seguem sua
  própria projeção e componente.

## Implementation Strategy

### MVP First

1. Concluir T001–T017.
2. Entregar e validar somente US1 (T018–T022).
3. Demonstrar o Dashboard com estados de fonte e links de investigação antes de
   iniciar as demais abas.

### Incremental Delivery

1. Fundação → US1, US2 e US3 para o núcleo investigativo.
2. US4, US5 e US6 para regras, licenças e ciclo de vida.
3. US7 e US8 para evidência temporal e auditoria.
4. Concluir T053–T058 apenas após todas as superfícies estarem integradas.

## Notes

- Todas as 58 tarefas seguem o formato de checklist, possuem identificador
  sequencial e apontam para caminhos concretos.
- Não implementar RBAC, hierarquia, perfis, filtros por campo, exportação ou
  mutações no tenant sem uma mudança explícita de escopo.
- Uma tarefa só pode ser marcada concluída após o gate indicado passar.
