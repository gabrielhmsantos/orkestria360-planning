---

description: "Tarefas de implementação frontend-only da UI Microsoft 365 OneDrive"
---

# Tasks: Microsoft 365 — OneDrive UI

**Input**: Artefatos de `specs/014-onedrive-ui/`

**Prerequisites**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contrato do seam](./contracts/onedrive-ui-contract.md), [quickstart.md](./quickstart.md) e o [UI Blueprint](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md).

**Escopo**: interface somente leitura, dados sintéticos aprovados e seam `OnedriveUiDataSource`. Não criar collector, Microsoft Graph, fonte real, persistência, migration, sincronização, endpoint de dados ou ação administrativa.

**Testes**: a feature exige testes de rota/Inertia, validação determinística de todos os cenários de fixture, gates frontend e aceitação no navegador conforme o quickstart. Não introduzir uma suíte de testes de componentes se a infraestrutura do projeto não a oferecer.

**Organização**: fases por jornada verificável da spec. As superfícies são subtarefas rastreáveis dessas jornadas; não são fases autônomas por aba.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode avançar em paralelo após as dependências indicadas, por atuar em arquivos distintos.
- **[Story]**: mapeia a tarefa a uma user story da [spec](./spec.md).
- Cada tarefa deve preservar o contrato de disponibilidade: `available`, `partial`, `unavailable`, `restricted`, `stale` e `failed` são estados de disponibilidade; `empty` é resultado factual de coleção disponível vazia.

## Phase 1: Setup — preparação de dados de desenvolvimento

**Purpose**: preparar somente os arquivos locais que tornam o frontend autocontido e rastreável ao discovery.

- [x] T001 Criar a estrutura do módulo em `orkestria360/resources/js/data/modules/onedrive/`, `orkestria360/resources/js/data/modules/onedrive/fixtures/`, `orkestria360/resources/js/types/modules/onedrive.ts`, `orkestria360/resources/js/components/modules/onedrive/`, `orkestria360/resources/js/pages/modules/onedrive.tsx` e `orkestria360/tests/Feature/Onedrive/` conforme [plan.md](./plan.md). **Dependências: nenhuma (independente).**
- [x] T002 [P] Portar fielmente os fixtures aprovados para `orkestria360/resources/js/data/modules/onedrive/fixtures/dashboard-executivo.ts`, `contas-e-armazenamento.ts`, `arquivos-e-conteudo.ts` e `compartilhamento-e-acessos.ts`, registrando provenance, `fixtureVersion`, `surface`, `defaultScenario` e cenários sem alterar campos sintéticos do discovery. **Dependências: T001.**
- [x] T003 [P] Portar fielmente os fixtures aprovados para `orkestria360/resources/js/data/modules/onedrive/fixtures/atividade-e-sincronizacao.ts`, `usuarios-desligados-e-retencao.ts`, `configuracoes-e-seguranca.ts` e `historico-e-auditoria.ts`, registrando provenance, `fixtureVersion`, `surface`, `defaultScenario` e cenários sem alterar campos sintéticos do discovery. **Dependências: T001.**

---

## Phase 2: Foundation — shell, contrato e apresentação compartilhada

**Purpose**: concluir os pré-requisitos reais que bloqueiam todas as jornadas, sem criar backend de domínio.

**⚠️ CRITICAL**: Nenhuma tarefa de superfície começa antes de a seleção determinística de fixture, a navegação e a composição de disponibilidade estarem prontas.

- [x] T004 Definir `OnedriveSurfaceKey`, ordem invariável das oito superfícies, projections discriminadas, nulabilidade e `AvailabilityState` com somente `available`, `partial`, `unavailable`, `restricted`, `stale` e `failed` em `orkestria360/resources/js/types/modules/onedrive.ts`, conforme [data-model.md](./data-model.md) e os oito `contratos.md` do discovery. **Dependências: T002, T003.**
- [x] T005 Implementar o seam semântico permanente `OnedriveUiDataSource` e seu envelope discriminado em `orkestria360/resources/js/data/modules/onedrive/onedrive-ui-data-source.ts`, expondo somente `getSurface(surface)` com superfície, disponibilidade e projection; não expor cenário, catálogo, `defaultScenario`, override ou provenance de fixture e preservar `empty` como dados/coleção vazios sob disponibilidade `available`. **Dependências: T004.**
- [x] T006 Implementar `OnedriveFixtureDataSource` e o fixture harness/registry das oito superfícies em `orkestria360/resources/js/data/modules/onedrive/onedrive-fixture-data-source.ts`, `onedrive-fixture-harness.ts` e `index.ts`: o harness mantém catálogo, `defaultScenario`, listagem, seleção explícita e provenance, cria/injeta o datasource configurado que implementa somente o seam permanente e falha para superfície ou cenário desconhecido, sem chamada remota. **Dependências: T002, T003, T004, T005.**
- [x] T007 Implementar o scenario override transitório em `orkestria360/resources/js/data/modules/onedrive/onedrive-scenario-override.ts`: somente desenvolvimento/teste/validação, sem rota/endereço de domínio, dropdown, filtro ou controle de produto; o override seleciona cenário existente pelo catálogo do fixture harness e falha para valor inválido. Documentar no módulo que `OnedriveFixtureDataSource`, harness, override e fixtures runtime serão removidos quando uma fonte real aprovada passar a atender o mesmo contrato semântico. **Dependências: T006.**
- [x] T008 Criar `orkestria360/app/Http/Controllers/Modules/OnedriveController.php` como montagem Inertia mínima — somente página e aba ativa publicada — sem PageData, query, integração, persistência ou prop de domínio. **Dependências: T001.**
- [x] T009 Registrar apenas GETs autenticados da raiz e das abas publicadas do OneDrive em `orkestria360/routes/web.php`, com slugs limitados e sem rotas de exportação, refresh, retry ou mutação. **Dependências: T008.**
- [x] T010 Criar o shell fino em `orkestria360/resources/js/pages/modules/onedrive.tsx` com `PageScaffold`, `ModuleHero`, `ModuleTabBar`, a sequência canônica de tabs, links Inertia estáveis e foco do `h1` após navegação; consumir somente `OnedriveUiDataSource` já configurado pela composição dev/teste, sem importar ou resolver catálogo, `defaultScenario`, scenario override ou provenance e sem renderizar o mecanismo como UI de produto. **Dependências: T004, T006, T007, T009.**
- [x] T011 Implementar as composições compartilhadas e formatters em `orkestria360/resources/js/components/modules/onedrive/onedrive-availability.tsx` e `orkestria360/resources/js/components/modules/onedrive/onedrive-formatters.ts`, usando `DataAvailabilityPanel`, `Alert`, `LastUpdatedIndicator`, `OperationalSectionCard` e `Skeleton` conforme o blueprint; preservar bytes, números, percentuais, períodos, datas UTC e ausência, sem colapsar availability em vazio nem renderizar refresh/retry. **Dependências: T004.**
- [x] T012 Criar os testes de montagem em `orkestria360/tests/Feature/Onedrive/OnedriveRoutesTest.php` e `orkestria360/tests/Feature/Onedrive/OnedriveFoundationTest.php` com `ModulePageTestCase`: visitante redirecionado, usuário autenticado recebe `modules/onedrive`, aba válida e ordem das oito tabs, slug inválido rejeitado e ausência de rotas OneDrive não-GET/mutáveis. **Dependências: T008, T009, T010.**

**Checkpoint**: a página abre autenticada com shell, tabs e fixture source determinística; todos os componentes de superfície podem receber projections e disponibilidade sem depender de backend.

---

## Phase 3: User Story 1 — Orientar a investigação do OneDrive (Priority: P1) 🎯 MVP

**Goal**: permitir a leitura executiva e a investigação operacional de uso, capacidade, conteúdo, compartilhamento e atividade usando somente regiões e interações publicadas.

**Independent Test**: com os fixtures aprovados, abrir Dashboard Executivo e navegar por Contas e Armazenamento, Arquivos e Conteúdo, Compartilhamento e Acessos e Atividade e Sincronização; aplicar filtros publicados, trocar página e abrir/fechar somente os detalhes formalizados.

### Implementação por superfície

- [x] T013 [P] [US1] Implementar Dashboard Executivo em `orkestria360/resources/js/components/modules/onedrive/dashboard-tab.tsx` usando a sequência KPI → análise → investigação → recomendações, `ChartPanel` e listas aprovadas do [blueprint](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md), com disponibilidade por bloco e nenhum drill-down sem destino publicado. **Dependências: T004, T006, T010, T011.**
- [x] T014 [P] [US1] Implementar Contas e Armazenamento em `orkestria360/resources/js/components/modules/onedrive/accounts-storage-tab.tsx`: filtros/ordenação aprovados propagados ao inventário e análises compatíveis, paginação com reset/clamp, `OperationalTable` com caption e `InlineDetailPanel` read-only que preserva consulta/ordenação/página e não calcula utilização sem capacidade publicada. **Dependências: T004, T006, T010, T011.**
- [x] T015 [P] [US1] Implementar Arquivos e Conteúdo em `orkestria360/resources/js/components/modules/onedrive/files-content-tab.tsx` com filtros aprovados, KPIs, análises/rankings e inventário do contrato, conservando `null` de sensibilidade, duplicidade e risco sem classificação substituta. **Dependências: T004, T006, T010, T011.**
- [x] T016 [P] [US1] Implementar Compartilhamento e Acessos em `orkestria360/resources/js/components/modules/onedrive/sharing-access-tab.tsx` com resumo, registros, filtros, análise e alertas/recomendações publicados, estritamente em leitura e sem remover, alterar, expirar, revogar ou notificar acesso. **Dependências: T004, T006, T010, T011.**
- [x] T017 [P] [US1] Implementar Atividade e Sincronização em `orkestria360/resources/js/components/modules/onedrive/activity-sync-tab.tsx` com resumo, tendências, dispositivos/KFM/inativos/alertas somente quando publicados e `DataAvailabilityPanel` nas regiões não publicadas em vez de saúde ou vazio inferidos. **Dependências: T004, T006, T010, T011.**
- [x] T018 [US1] Conectar as cinco superfícies da jornada ao dispatcher em `orkestria360/resources/js/pages/modules/onedrive.tsx`, mantendo apenas as props tipadas da projection e a ordem de tab do blueprint. **Dependências: T013, T014, T015, T016, T017.**

### Verificação da jornada

- [x] T019 [US1] Executar e registrar como evidência não versionada a aceitação de Dashboard, Contas, Arquivos, Compartilhamento e Atividade no cenário `populated`, incluindo filtros, propagação para análises compatíveis, paginação, detalhe de conta, foco, captions, resumo textual de gráficos e viewport wide/compact, conforme [quickstart.md](./quickstart.md) e FR-011–015, FR-019–025. **Dependências: T007, T012, T018.**

**Checkpoint**: a primeira jornada é demonstrável com dados sintéticos, sem prometer ação administrativa e sem tratar lacunas como resultado saudável.

---

## Phase 4: User Story 2 — Acompanhar governança sem ações não aprovadas (Priority: P1)

**Goal**: permitir investigar desligamentos, retenção, postura e recomendações como informação de governança somente leitura.

**Independent Test**: exercitar `populated`, `partial`, `unavailable` e `restricted` de Usuários Desligados e Retenção, além de `populated` (com blocos `partial`), `unavailable` e `restricted` de Configurações e Segurança, verificando que campos não publicados e ações pendentes continuam ausentes.

### Implementação por superfície

- [x] T020 [P] [US2] Implementar Usuários Desligados e Retenção em `orkestria360/resources/js/components/modules/onedrive/offboard-retention-tab.tsx` com KPIs, casos, `ProcessProgress`, retenção e evidências somente publicadas; manter assignee, prazo, retenção e progresso nulos como não publicados e omitir transferência, atribuição, retenção e exclusão. **Dependências: T004, T006, T010, T011.**
- [x] T021 [P] [US2] Implementar Configurações e Segurança em `orkestria360/resources/js/components/modules/onedrive/settings-security-tab.tsx` com score, políticas, proteção, riscos e recomendações de leitura; usar disponibilidade por bloco para score/categoria/conformidade não publicados e não criar correção, mudança de política ou CTA sem destino. **Dependências: T004, T006, T010, T011.**
- [x] T022 [US2] Conectar as duas superfícies de governança ao dispatcher em `orkestria360/resources/js/pages/modules/onedrive.tsx`, preservando o foco de navegação e a posição delas na sequência aprovada. **Dependências: T020, T021.**

### Verificação da jornada

- [x] T023 [US2] Executar e registrar como evidência não versionada `populated`, `partial`, `unavailable` e `restricted` de `usuarios-desligados-e-retencao.ts`, além de `populated` (com blocos `partial`), `unavailable` e `restricted` de `configuracoes-e-seguranca.ts`, contra `offboard-retention-tab.tsx` e `settings-security-tab.tsx`; verificar estados de processo, campos nulos, foco/teclado, responsividade e ausência de controles mutáveis, conforme FR-016, FR-017 e FR-021–026. **Dependências: T007, T012, T022.**

**Checkpoint**: a governança é navegável e interpretável sem workflow, automação ou ação administrativa fictícia.

---

## Phase 5: User Story 3 — Investigar eventos com cobertura explícita (Priority: P2)

**Goal**: permitir filtrar, paginar e inspecionar eventos publicados com cobertura associada ao recorte e retorno de foco correto.

**Independent Test**: exercitar `populated`, `empty`, `partial`, `restricted`, `stale` e `failed` do fixture de Histórico e Auditoria, incluindo seleção, fechamento e perda de seleção após mudança de recorte.

### Implementação da superfície

- [x] T024 [US3] Implementar Histórico e Auditoria em `orkestria360/resources/js/components/modules/onedrive/audit-history-tab.tsx` com resumo, cobertura de fonte, distribuição/tendência, filtros, `OperationalTable`, paginação e `InlineDetailPanel`; renderizar somente os campos de evento publicados e limpar seleção quando filtros/paginação removerem o item. **Dependências: T004, T006, T010, T011.**
- [x] T025 [US3] Conectar Histórico e Auditoria ao dispatcher em `orkestria360/resources/js/pages/modules/onedrive.tsx`, preservando tab estável, foco no título após navegação e nenhuma navegação/contexto para referência de investigação sem destino formalizado. **Dependências: T024.**

### Verificação da jornada

- [x] T026 [US3] Executar e registrar como evidência não versionada os cenários `populated`, `empty`, `partial`, `restricted`, `stale` e `failed` de `historico-e-auditoria.ts` contra `audit-history-tab.tsx`, incluindo filtros, paginação, cobertura, detalhe, ESC, devolução de foco ao gatilho, fechamento ao desaparecer do resultado e anúncio factual, conforme FR-018–025. **Dependências: T007, T012, T025.**

**Checkpoint**: a investigação de auditoria pode ser concluída sem interpretar ausência de campo/evento como ausência do fato ou oferecer operação mutável.

---

## Phase 6: User Story 4 — Interpretar disponibilidade e frescor de forma confiável (Priority: P1)

**Goal**: provar em todas as superfícies que disponibilidade e vazio factual mantêm semânticas distintas no nível de região indicado pelos contratos.

**Independent Test**: selecionar todos os cenários de cada fixture por `OnedriveFixtureDataSource`, confirmar a composição global e de bloco, e demonstrar que a UI não recorre a `populated` nem inventa dados. Esta fase vem depois da US3 porque a aceitação de disponibilidade precisa do tab de auditoria implementado; isso não cria dependência de produto entre as jornadas.

### Verificação observável por superfície

- [x] T027 [P] [US4] Validar Dashboard Executivo em `orkestria360/resources/js/components/modules/onedrive/dashboard-tab.tsx` contra `dashboard-executivo.ts`: `populated` global `partial`, `empty` global `available`, `unavailable`, `restricted`, `stale` e `failed`, preservando dados confirmados, data de snapshot e regiões indisponíveis do fixture. **Dependências: T007, T013, T019.**
- [x] T028 [P] [US4] Validar Contas e Armazenamento em `orkestria360/resources/js/components/modules/onedrive/accounts-storage-tab.tsx` contra `contas-e-armazenamento.ts`: `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`, inclusive vazio factual, capacidade nula e fechamento do detalhe selecionado. **Dependências: T007, T014, T019.**
- [x] T029 [P] [US4] Validar Arquivos e Conteúdo em `orkestria360/resources/js/components/modules/onedrive/files-content-tab.tsx` contra `arquivos-e-conteudo.ts`: `populated`, `empty`, `unavailable`, `restricted`, `stale` e `failed`, sem substituir classificação ou risco nulos. **Dependências: T007, T015, T019.**
- [x] T030 [P] [US4] Validar Compartilhamento e Acessos em `orkestria360/resources/js/components/modules/onedrive/sharing-access-tab.tsx` contra `compartilhamento-e-acessos.ts`: `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`, sem transformar risco/cobertura ausentes em estado seguro. **Dependências: T007, T016, T019.**
- [x] T031 [P] [US4] Validar Atividade e Sincronização em `orkestria360/resources/js/components/modules/onedrive/activity-sync-tab.tsx` contra `atividade-e-sincronizacao.ts`: `populated`, `empty`, `unavailable`, `restricted`, `stale` e `failed`, distinguindo telemetria/dispositivos/KFM indisponíveis de coleção vazia. **Dependências: T007, T017, T019.**
- [x] T032 [P] [US4] Validar Usuários Desligados e Retenção em `orkestria360/resources/js/components/modules/onedrive/offboard-retention-tab.tsx` contra `usuarios-desligados-e-retencao.ts`: `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`, sem criar etapas ou prazos no processo. **Dependências: T007, T020, T023.**
- [x] T033 [P] [US4] Validar Configurações e Segurança em `orkestria360/resources/js/components/modules/onedrive/settings-security-tab.tsx` contra `configuracoes-e-seguranca.ts`: `populated`, `unavailable`, `restricted`, `stale` e `failed`, mantendo score, categorias e recomendações não publicadas sem inferência. **Dependências: T007, T021, T023.**
- [x] T034 [P] [US4] Validar Histórico e Auditoria em `orkestria360/resources/js/components/modules/onedrive/audit-history-tab.tsx` contra `historico-e-auditoria.ts`: `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`, incluindo o cenário `unavailable` além da amostra independente da US3. **Dependências: T007, T024, T026.**
- [x] T035 [US4] Executar a matriz completa pelo catálogo do fixture harness conforme `specs/014-onedrive-ui/quickstart.md`, confirmando também que scenario override inválido falha explicitamente; manter logs, screenshots, outputs e demais evidências não versionados. Alterar `quickstart.md` somente se o próprio procedimento de validação precisar ser corrigido, e corrigir os componentes de superfície afetados se algum estado for semanticamente colapsado. **Dependências: T007, T027, T028, T029, T030, T031, T032, T033, T034.**

**Checkpoint**: SC-002 e SC-003 são verificáveis para as oito fixtures, sem collector, fonte real, persistência ou fallback silencioso.

---

## Phase 7: Polish & validação transversal

**Purpose**: executar gates de entrega e revisar a conformidade integrada sem ampliar escopo.

- [x] T036 Revisar `orkestria360/resources/js/pages/modules/onedrive.tsx` e todos os arquivos em `orkestria360/resources/js/components/modules/onedrive/` contra FR-001–010 e FR-022–026: uma rolagem vertical principal, tabelas com caption/instrução de overflow, gráficos com resumo textual, labels/ARIA estáveis, risco/status além da cor e ausência de cabeçalhos/ações sem contrato. **Dependências: T018, T022, T025, T035.**
- [x] T037 Executar `npm run types:check`, `npm run lint:check` e `npm run build` em `orkestria360/`, corrigindo somente arquivos OneDrive e componentes compartilhados estritamente necessários para satisfazer os gates. **Dependências: T036.**
- [x] T038 Executar `APP_ENV=testing DB_CONNECTION=pgsql DB_DATABASE=orkestria360_test DB_URL='' CACHE_STORE=database DB_USERNAME=orkestria360 DB_PASSWORD=orkestria360 php artisan test tests/Feature/Onedrive` e `composer ci:check` em `orkestria360/`, registrando resultado e corrigindo regressões da feature sem criar dependência de dados OneDrive no banco. **Dependências: T012, T036, T037.**
- [x] T039 Executar a aceitação de navegador definida em `specs/014-onedrive-ui/quickstart.md` em viewport wide e compact: navegar as oito tabs por teclado/ponteiro, selecionar cenários pelo override transitório, validar foco, filtros, paginação, detalhes, estados de fixture e responsividade; manter screenshots/logs apenas como evidência não versionada. **Dependências: T007, T035, T036, T037, T038.**
- [x] T040 Revisar `specs/014-onedrive-ui/quickstart.md`, `orkestria360/tests/Feature/Onedrive/` e o diff final do módulo para confirmar SC-001–005, que nenhum cenário usa fonte real e que não foram adicionados collector, Graph, migration, persistência, sincronização, endpoint de dados ou ações mutáveis. **Dependências: T039.**

- [x] T041 Atualizar o cenário `populated` das oito fixtures canônicas e runtime para homologação visual completa; registrar separadamente na revisão os blocos cujo cenário sintético não constitui payload tipado ou fonte de produção; reconstruir os assets e revisar as oito superfícies no túnel compilado. Evidência não versionada em `/tmp/onedrive-review-complete/`; relatório em `discovery/microsoft-365/v2/onedrive/frontend-coverage-review.md`. **Dependências: T040.**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: T001 é independente; T002 e T003 dependem de T001 e podem avançar em paralelo.
- **Phase 2 (Foundation)**: o caminho crítico é T001 → (T002, T003) → T004 → T005 (seam permanente) → T006 (fixture harness) → T007 (override) → T010 (shell consumidor). Em paralelo a esse caminho, T008 → T009 desbloqueia a rota, e T011 desbloqueia a composição compartilhada. T012 depende de rota e shell.
- **US1, US2 e US3**: cada tarefa de superfície depende explicitamente da foundation em sua própria linha. As implementações em arquivos distintos podem avançar em paralelo; os dispatchers T018, T022 e T025 são pontos de junção em `pages/modules/onedrive.tsx` e só começam após seus tabs.
- **US4**: T027–T034 dependem do scenario override T007, da implementação e da validação independente da respectiva superfície; T035 é a junção que prova a matriz completa de fixtures conforme o quickstart.
- **Polish**: T036 → T037 → T038 → T039 → T040 é o caminho crítico de entrega após a matriz T035.

### User Story Dependencies

- **US1 (P1)**: T013–T017 → T018 → T019; T019 é o gate de validação independente e o MVP de orientação operacional.
- **US2 (P1)**: T020 e T021 → T022 → T023; T023 é o gate de validação independente e não depende da US1.
- **US3 (P2)**: T024 → T025 → T026; T026 é o gate de validação independente e não depende da US1/US2.
- **US4 (P1)**: T027–T034 podem iniciar quando cada gate de jornada correspondente estiver concluído; T035 consolida a disponibilidade das oito superfícies. A fase está depois de US3 apenas porque precisa observar a superfície de auditoria implementada.

### Parallel Opportunities

- T002 e T003 podem avançar em paralelo após T001; T008 pode avançar em paralelo a T004, e T011 pode avançar após T004 enquanto T005 prepara o seam e T006–T007 preparam o fixture harness e override.
- Em US1, T013, T014, T015, T016 e T017 podem avançar em paralelo após T004, T006, T010 e T011; T018 é o ponto de junção.
- Em US2, T020 e T021 podem avançar em paralelo; T022 é o ponto de junção. US3 usa o caminho sequencial T024 → T025 → T026 porque o dispatcher e a aceitação dependem do tab.
- Em US4, T027–T034 podem ser distribuídas por superfície após seus gates de jornada; T035 é o ponto de junção.

## Parallel Example: User Story 1

```text
Task: "Implementar Dashboard Executivo em orkestria360/resources/js/components/modules/onedrive/dashboard-tab.tsx"
Task: "Implementar Contas e Armazenamento em orkestria360/resources/js/components/modules/onedrive/accounts-storage-tab.tsx"
Task: "Implementar Arquivos e Conteúdo em orkestria360/resources/js/components/modules/onedrive/files-content-tab.tsx"
Task: "Implementar Compartilhamento e Acessos em orkestria360/resources/js/components/modules/onedrive/sharing-access-tab.tsx"
Task: "Implementar Atividade e Sincronização em orkestria360/resources/js/components/modules/onedrive/activity-sync-tab.tsx"
```

## Implementation Strategy

### MVP First

1. Concluir Setup e Foundation, inclusive rotas/Inertia e fixture seam.
2. Concluir US1 e sua aceitação independente (T019).
3. Demonstrar orientação operacional com cenários aprovados, sem backend de domínio.

### Incremental Delivery

1. Adicionar US2 para a jornada de governança somente leitura.
2. Adicionar US2 e US3; cada uma tem seu próprio checkpoint de aceitação, T023 e T026.
3. Executar a matriz US4 por superfície e consolidar T035 antes dos gates finais.

## Notes

- `[P]` só indica arquivos independentes; não elimina a dependência semântica do contrato e do UI Blueprint.
- Toda alteração de componente compartilhado deve ser estritamente necessária, validada contra seus consumidores e não pode introduzir uma linguagem visual paralela.
- O fixture harness e o scenario override são scaffolding transitório de fixture/teste; não criar seletor de cenário como controle de produto, rota/endereço de domínio ou fallback. A fonte real futura substituirá `OnedriveFixtureDataSource`, harness, override e fixtures runtime, mantendo o seam/tipos semânticos consumidos pela UI.
- Evidência de navegador, screenshots e logs de validação não devem ser commitados sem solicitação explícita.
