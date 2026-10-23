---

description: "Tarefas executáveis para o módulo Microsoft 365 Secure Score"
---

# Tasks: Módulo Secure Score

**Input**: Artefatos de `/specs/009-secure-score-module/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: A especificação e o plano exigem cobertura de sincronização, projeção e jornadas; portanto, as tarefas de teste abaixo são obrigatórias antes de declarar cada incremento concluído.

**Organization**: As tarefas estão organizadas por história para que cada superfície possa ser implementada e validada independentemente após a fundação compartilhada.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode ocorrer em paralelo por atuar em arquivos distintos, depois das dependências indicadas.
- **[Story]**: história rastreável da especificação.
- Todo código de aplicação fica em `orkestria360/`; este diretório mantém apenas os artefatos de planejamento.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fixar o contrato de entrega e os pontos de extensão antes de alterar a aplicação.

- [X] T001 Registrar o mapa de artefatos, invariantes e gates da feature em `specs/009-secure-score-module/plan.md`
- [X] T002 [P] Criar o diretório de componentes por superfície em `orkestria360/resources/js/components/modules/secure-score/.gitkeep`
- [X] T003 [P] Criar a base de testes da feature em `orkestria360/tests/Feature/Microsoft365/SecureScore/.gitkeep`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistir e publicar fontes canônicas e aplicar a proteção SharePoint somente-leitura no cliente HTTP, sem chamadas Graph em telas, antes de qualquer superfície.

**⚠️ CRITICAL**: Nenhuma história inicia antes desta fase estar concluída.

- [X] T004 Criar migrations separadas de snapshots com unicidade `tenant + graph_score_id`, checksum/revisão imutável, controles, versões de perfil por checksum, manifestos, estados de fonte e fotografias correlatas em `orkestria360/database/migrations/*_create_secure_score_snapshots_table.php`, `*_create_secure_score_controls_table.php`, `*_create_secure_score_profile_versions_table.php`, `*_create_secure_score_publications_table.php`, `*_create_secure_score_source_states_table.php` e `*_create_secure_score_related_source_snapshots_table.php`
- [X] T005 [P] Criar os modelos e relações de snapshots, revisões, versões de perfil, manifestos, estados de fonte e fotografias correlatas em `orkestria360/app/Models/SecureScoreSnapshot.php`, `SecureScoreControl.php`, `SecureScoreProfileVersion.php`, `SecureScorePublication.php`, `SecureScoreSourceState.php` e `SecureScoreRelatedSourceSnapshot.php`
- [X] T006 [P] Estender o contrato Graph com score/perfis e fontes correlatas Graph, incluindo a allow-list de host/path SharePoint, e criar o contrato separado Defender em `orkestria360/app/Support/Microsoft365/Contracts/GraphClient.php` e `orkestria360/app/Support/Microsoft365/Contracts/DefenderClient.php`
- [X] T012 Criar rotas, controller e shell de navegação das oito superfícies, com uma prop Inertia local por superfície, em `orkestria360/routes/web.php`, `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php` e `orkestria360/resources/js/pages/modules/secure-score.tsx`
- [X] T007 Implementar antes de qualquer coleta SharePoint a allow-list e o bloqueio de métodos diferentes de `GET` no limite HTTP, e depois os coletores paginados com `Retry-After`, heartbeat e métricas para score/perfis, SharePoint/OneDrive, Exchange e Intune em `orkestria360/app/Support/Microsoft365/GraphDataClient.php`, e máquinas Defender no cliente de audiência própria `orkestria360/app/Support/Microsoft365/DefenderDataClient.php`
- [X] T008 Implementar persistência staging e publicação independente com estado que separa `published_availability` de `latest_attempt_result`; deduplicar retry por `tenant + graph_score_id` + checksum como no-op e criar revisão imutável compatível para payload alterado já publicado, incluindo primeira falha e stale, em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreSynchronizer.php`
- [X] T009 Implementar versão de perfil imutável por checksum, match exato/fallback normalizado auditável e manifesto composto somente para score/perfil do mesmo `sync_cycle_id`/chave de compatibilidade em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScorePublicationBuilder.php`
- [X] T010 Integrar estágios score/perfis/manifesto e fontes correlatas independentes, reutilizando MFA publicado e tornando Exchange `skipped`/`restricted` quando a geração de identidades não fornecer mailboxes elegíveis, em `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php`
- [X] T011 Criar a matriz card→fato→fonte/projeção→chave→cobertura, o envelope local de estado e a base autoritativa de cálculos de score, prioridade e cobertura no backend em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScorePageData.php`
- [X] T013 [P] Cobrir migrations, idempotência/no-op por checksum, criação de revisão, imutabilidade, manifesto do mesmo ciclo e preservação do manifesto anterior em `orkestria360/tests/Feature/Microsoft365/SecureScore/SecureScoreSynchronizationTest.php`
- [X] T014 [P] Cobrir paginação, `Retry-After`, vazio válido, 401/403, primeira falha e stale por fonte; validar allow-list/bloqueio SharePoint antes da requisição, dependência Exchange/identidades, correlação Intune/Defender e fixtures Learn não publicadas como sucesso em `orkestria360/tests/Feature/Microsoft365/SecureScore/SecureScoreGraphCollectionTest.php`
- [X] T015 Migrar as leituras diretas `getLatestSecureScore()`/perfis e seus defaults 0/100 para o estado publicado local em `orkestria360/app/Support/Microsoft365/Microsoft365OverviewPageData.php` e cobrir a ausência de Graph em controller/página em `orkestria360/tests/Feature/Microsoft365/SecureScore/SecureScorePublishedDataTest.php`

**Checkpoint**: geração publicada, estado de fonte e manifesto temporalmente coerente disponíveis para todas as histórias; a proteção SharePoint está ativa antes de sua coleta e telas ainda não consultam Graph.

---

## Phase 3: User Story 1 - Consultar Dashboard Executivo (Priority: P1) 🎯 MVP

**Cards**: “Secure Score Atual”, “Pontos Conquistados”, “Pontos Disponíveis”, “Ações de Melhoria”, “Ganho Potencial”, “Meta de Secure Score”, “Evolução do Secure Score (últimos 90 dias)”, “Distribuição por Categoria”, “Ações por Prioridade”, “Principais Oportunidades (por ganho potencial)”, “Principais Riscos”, “Status do Plano de Remediação”, “Informações do Ambiente”, “Comparativo com outros tenants” e “Insights Inteligentes”.

**Goal**: Entregar a visão consolidada de score e oportunidades sem fabricar dados de fontes correlatas ou recursos futuros.

**Independent Test**: Com uma fotografia publicada, abrir o Dashboard Executivo e conferir score, frescor, categorias e estados explícitos por bloco; republicar fonte antes restrita e conferir disponibilidade dinâmica.

- [X] T016 [P] [US1] Criar o contrato de props que apresenta cálculos autoritativos de score, pontos, ganho, classificação e cobertura vindos do backend em `orkestria360/resources/js/types/modules/secure-score.ts`
- [X] T017 [P] [US1] Criar os cards “Secure Score Atual”, “Pontos Conquistados”, “Pontos Disponíveis”, “Ações de Melhoria”, “Ganho Potencial” e “Meta de Secure Score” em `orkestria360/resources/js/components/modules/secure-score/executive-kpis.tsx`
- [X] T018 [P] [US1] Criar a faixa analítica “Evolução do Secure Score (últimos 90 dias)”, “Distribuição por Categoria” e “Ações por Prioridade” em `orkestria360/resources/js/components/modules/secure-score/executive-analysis.tsx`
- [X] T019 [P] [US1] Criar “Principais Oportunidades (por ganho potencial)”, “Principais Riscos”, “Status do Plano de Remediação”, “Informações do Ambiente”, “Comparativo com outros tenants” e “Insights Inteligentes” em `orkestria360/resources/js/components/modules/secure-score/executive-context.tsx`
- [X] T020 [US1] Compor o Dashboard Executivo nas faixas 1–4, spans, ordem e empilhamento móvel da representação estrutural, com metadados e CTAs somente de navegação, em `orkestria360/resources/js/components/modules/secure-score/executive-dashboard-tab.tsx`
- [X] T021 [US1] Expor a projeção local do Dashboard Executivo no controller Inertia em `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php`
- [X] T022 [US1] Cobrir score publicado, vazio válido, fonte correlata restrita e promoção dinâmica no Dashboard Executivo em `orkestria360/tests/Feature/Microsoft365/SecureScore/ExecutiveDashboardPageTest.php`

**Checkpoint**: o Dashboard Executivo é uma entrega MVP funcional e independente, sem valores ilustrativos.

---

## Phase 4: User Story 2 - Comparar Pontuação por Categoria (Priority: P1)

**Cards**: “Secure Score Geral”, “Pontos Conquistados”, “Pontos Disponíveis”, “Ações de Melhoria”, “Ganho Potencial”, “Pontuação por Categoria”, “Distribuição dos Controles por Status”, “Comparativo por Categoria (vs. média de todos os tenants)”, “Evolução por Categoria (últimos 90 dias)” e “Top 5 Categorias com Maior Ganho Potencial”.

**Goal**: Detalhar categorias e progresso com classificação baseada em score atual versus máximo do perfil versionado.

**Independent Test**: Publicar score e perfis associados e verificar totais por categoria, classificação concluído/parcial/pendente e exclusões de cobertura.

- [X] T023 [P] [US2] Implementar a projeção por categoria, cobertura de join, classificação de progresso e prop Inertia local da superfície em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreCategoryProjection.php` e `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php`
- [X] T024 [P] [US2] Criar “Secure Score Geral”, “Pontos Conquistados”, “Pontos Disponíveis”, “Ações de Melhoria” e “Ganho Potencial” em `orkestria360/resources/js/components/modules/secure-score/category-kpis.tsx`
- [X] T025 [P] [US2] Criar a tabela “Pontuação por Categoria” com alternativa textual para tendência em `orkestria360/resources/js/components/modules/secure-score/category-score-table.tsx`
- [X] T026 [P] [US2] Criar “Distribuição dos Controles por Status”, “Comparativo por Categoria (vs. média de todos os tenants)”, “Evolução por Categoria (últimos 90 dias)” e “Top 5 Categorias com Maior Ganho Potencial” em `orkestria360/resources/js/components/modules/secure-score/category-analysis.tsx`
- [X] T027 [US2] Compor faixas 1–3, filtros empilhados e tabela móvel acessível da representação estrutural em `orkestria360/resources/js/components/modules/secure-score/category-score-tab.tsx`
- [X] T028 [US2] Cobrir cálculos, máximo inválido, associação ausente e média indisponível em `orkestria360/tests/Feature/Microsoft365/SecureScore/CategoryScorePageTest.php`

**Checkpoint**: categorias funcionam apenas com controles cobertos e comunicam exclusões de forma verificável.

---

## Phase 5: User Story 3 - Priorizar Ações de Melhoria (Priority: P1)

**Cards**: “Ações de Melhoria”, “Pontos Disponíveis”, “Ganho Potencial por Prioridade”, “Ações Rápidas”, “Top Ameaças Mitigadas”, “Distribuição por Status Orkestria”, “Distribuição por Esforço”, “Ações com Maior Ganho Potencial” e “Ações Vencidas ou Próximas do Prazo”.

**Goal**: Permitir filtragem e priorização de recomendações publicadas, distinguindo contexto Microsoft de dados operacionais futuros.

**Independent Test**: Publicar controles/perfis, aplicar cada filtro e confirmar igualdade entre lista e resumos, ganho não negativo e campos internos futuros.

- [X] T029 [P] [US3] Implementar consulta local filtrável, conjunto remediável, ganho não negativo, score de prioridade homologado (pesos, normalização, ausência e desempate) e prop Inertia da superfície em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreActionsProjection.php` e `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php`
- [X] T030 [P] [US3] Criar “Ações de Melhoria”, “Pontos Disponíveis”, “Ganho Potencial por Prioridade”, “Ações Rápidas” e “Top Ameaças Mitigadas” em `orkestria360/resources/js/components/modules/secure-score/actions-summary.tsx`
- [X] T031 [P] [US3] Criar filtros e tabela responsiva “Ações de Melhoria” com campos Orkestria futuros em `orkestria360/resources/js/components/modules/secure-score/actions-table.tsx`
- [X] T032 [P] [US3] Criar “Distribuição por Status Orkestria”, “Distribuição por Esforço”, “Ações com Maior Ganho Potencial” e “Ações Vencidas ou Próximas do Prazo” em `orkestria360/resources/js/components/modules/secure-score/actions-analysis.tsx`
- [X] T033 [US3] Compor faixas 1–3, paginação, contadores, tabela móvel acessível e estados `available`/`restricted`/`unavailable`/`coming_soon` em `orkestria360/resources/js/components/modules/secure-score/actions-improvement-tab.tsx`
- [X] T034 [US3] Cobrir filtros combinados, ganho, score de prioridade/desempate, vazios válidos e campos internos não inventados em `orkestria360/tests/Feature/Microsoft365/SecureScore/ActionsImprovementPageTest.php`

**Checkpoint**: recomendações são priorizáveis e cada dado sem publicação tem estado explícito.

---

## Phase 6: User Story 6 - Analisar Evolução e Tendências (Priority: P1)

**Cards**: “Secure Score Atual”, “Variação (7 dias)”, “Maior Score (período)”, “Menor Score (período)”, “Média (período)”, “Tendência Geral (30 dias)”, “Evolução do Secure Score”, “Eventos que impactaram o Score”, “Evolução por Categoria (últimos 90 dias)”, “Variação Mensal do Score”, “Score Máximo e Controles”, “Distribuição do Score (último dia)”, “Insights e Tendências”, “Previsão de Atingimento da Meta” e “Alertas de Regressão”.

**Goal**: Mostrar séries e alterações observadas somente entre publicações comparáveis, sem atribuir causa ou autoria.

**Independent Test**: Publicar duas gerações comparáveis e validar séries/diffs; com uma só, validar “sem base comparável”.

- [X] T035 [P] [US6] Implementar séries, variações, diffs limitados a atributos persistidos em ambas as publicações e prop Inertia da superfície em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreHistoryProjection.php` e `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php`
- [X] T036 [P] [US6] Criar os KPIs “Secure Score Atual”, “Variação (7 dias)”, “Maior Score (período)”, “Menor Score (período)”, “Média (período)” e “Tendência Geral (30 dias)” em `orkestria360/resources/js/components/modules/secure-score/trends-kpis.tsx`
- [X] T037 [P] [US6] Criar “Evolução do Secure Score”, “Eventos que impactaram o Score”, “Evolução por Categoria (últimos 90 dias)” e “Variação Mensal do Score” em `orkestria360/resources/js/components/modules/secure-score/trends-analysis.tsx`
- [X] T038 [P] [US6] Criar “Score Máximo e Controles”, “Distribuição do Score (último dia)”, “Insights e Tendências”, “Previsão de Atingimento da Meta” e “Alertas de Regressão” sem alerta automático/crítico em `orkestria360/resources/js/components/modules/secure-score/trends-context.tsx`
- [X] T039 [US6] Compor as quatro faixas, filtros empilhados e rótulos de alteração observada/causa indisponível da representação estrutural em `orkestria360/resources/js/components/modules/secure-score/evolution-trends-tab.tsx`
- [X] T040 [US6] Cobrir duas gerações comparáveis, primeira coleta, `— vs. período anterior`, ausência de alerta automático e proibição de inferir causa/autoria em `orkestria360/tests/Feature/Microsoft365/SecureScore/EvolutionTrendsPageTest.php`

**Checkpoint**: tendência e diffs usam apenas a base temporal disponível e nunca se passam por auditoria causal.

---

## Phase 7: User Story 8 - Consultar Histórico Observado e Auditoria Futura (Priority: P1)

**Cards**: “Total de Eventos”, “Eventos Microsoft”, “Eventos Orkestria”, “Pontuação Alterada”, “Controles Afetados”, “Usuários Envolvidos”, “Eventos por Tipo”, “Eventos ao Longo do Tempo”, “Eventos por Origem”, “Detalhes do Evento”, “Histórico de Eventos”, “Exportação e Auditoria”, “Conformidade e LGPD” e “Dica”.

**Goal**: Rastrear coletas desde a primeira publicação e diferenças observadas depois de duas gerações, deixando auditoria operacional como futura.

**Independent Test**: Abrir a superfície após a primeira coleta e depois de dois snapshots; validar transição, Antes x Depois e foco no detalhe por teclado.

- [X] T041 [P] [US8] Implementar eventos de coleta, alterações observadas com comparativo Antes x Depois e prop Inertia da superfície em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreObservedHistoryProjection.php` e `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php`
- [X] T042 [P] [US8] Criar “Total de Eventos”, “Eventos Microsoft”, “Eventos Orkestria”, “Pontuação Alterada”, “Controles Afetados” e “Usuários Envolvidos” em `orkestria360/resources/js/components/modules/secure-score/observed-history-kpis.tsx`
- [X] T043 [P] [US8] Criar “Eventos por Tipo”, “Eventos ao Longo do Tempo”, “Eventos por Origem” e “Detalhes do Evento” com estados de comparação e descrição acessível em `orkestria360/resources/js/components/modules/secure-score/observed-history-analysis.tsx`
- [X] T044 [P] [US8] Criar a tabela acionável “Histórico de Eventos”, foco Enter/Espaço/Esc e anúncio `aria-live` do detalhe em `orkestria360/resources/js/components/modules/secure-score/observed-history-table.tsx`
- [X] T045 [US8] Compor as quatro faixas e empilhamento móvel, “Exportação e Auditoria” como `unavailable`, “Conformidade e LGPD”, “Dica” e a nota persistente de não atribuição em `orkestria360/resources/js/components/modules/secure-score/observed-history-tab.tsx`
- [X] T046 [US8] Cobrir primeira coleta, comparativos parciais, campos não coletados, exportação indisponível, rótulos, anúncio e foco restaurado em `orkestria360/tests/Feature/Microsoft365/SecureScore/ObservedHistoryPageTest.php`

**Checkpoint**: a superfície é disponível desde a primeira coleta e mantém a fronteira explícita entre histórico técnico e auditoria operacional.

---

## Phase 8: User Story 4 - Consultar Plano de Remediação Futuro (Priority: P2)

**Cards**: “Pontos Disponíveis”, “Ações Abertas”, “Em Execução”, “Concluídas”, “Ações Vencidas”, “Ganho Potencial”, “Resumo do Plano”, “Evolução do Secure Score”, “Projeção para a Meta”, “Plano Kanban”, “Top Ações por Ganho Potencial”, “Ganhos por Período (Projeção)” e “Insights do Plano”.

**Goal**: Preservar a superfície e sua navegação sem criar workflow, simulação ou escrita no tenant.

**Independent Test**: Navegar por todas as abas e confirmar que controles de gestão são visíveis, desabilitados e não mutam estado.

- [X] T047 [P] [US4] Criar a prop Inertia local e os KPIs “Pontos Disponíveis”, “Ações Abertas”, “Em Execução”, “Concluídas”, “Ações Vencidas”, “Ganho Potencial”, “Resumo do Plano”, “Evolução do Secure Score” e “Projeção para a Meta” como capacidade futura em `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php` e `orkestria360/resources/js/components/modules/secure-score/remediation-plan-summary.tsx`
- [X] T048 [P] [US4] Criar “Plano Kanban”, “Top Ações por Ganho Potencial”, “Ganhos por Período (Projeção)” e “Insights do Plano” sem ações mutáveis em `orkestria360/resources/js/components/modules/secure-score/remediation-plan-views.tsx`
- [X] T049 [US4] Compor abas e faixas 1–4, ordem e comportamento móvel da representação estrutural em `orkestria360/resources/js/components/modules/secure-score/remediation-plan-tab.tsx`
- [X] T050 [US4] Cobrir CTAs/ações desabilitados e ausência de escrita no tenant em `orkestria360/tests/Feature/Microsoft365/SecureScore/RemediationPlanPageTest.php`

**Checkpoint**: o Plano de Remediação comunica o roadmap sem simular funcionalidade operacional.

---

## Phase 9: User Story 5 - Consultar Comparativos e Metas (Priority: P2)

**Cards**: “Secure Score Atual”, “Sua Posição (Todos os tenants)”, “Média (Todos os tenants)”, “Sua Meta Geral”, “Projeção para atingir a meta”, “Comparativo por Categoria”, “Radar de Comparação”, “Evolução vs. Meta (Geral)”, “Progresso das Metas por Categoria”, “Ganho Necessário por Categoria”, “Insights de Comparação”, “Referências dos Comparativos” e “Metas Configuradas”.

**Goal**: Mostrar somente comparativos publicados; na ausência de meta interna, exibir Você e Média e manter capacidades dependentes de meta como futuras.

**Independent Test**: Publicar média, repetir sem média e repetir sem meta; conferir séries e estados corretos em tabela, cards e radar.

- [X] T051 [P] [US5] Implementar projeção de comparativos, regra Você/Média sem Meta e prop Inertia local da superfície em `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreComparativesProjection.php` e `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php`
- [X] T052 [P] [US5] Criar os KPIs “Secure Score Atual”, “Sua Posição (Todos os tenants)”, “Média (Todos os tenants)”, “Sua Meta Geral” e “Projeção para atingir a meta” em `orkestria360/resources/js/components/modules/secure-score/comparatives-kpis.tsx`
- [X] T053 [P] [US5] Criar “Comparativo por Categoria”, “Radar de Comparação”, “Evolução vs. Meta (Geral)”, “Progresso das Metas por Categoria” e “Ganho Necessário por Categoria” em `orkestria360/resources/js/components/modules/secure-score/comparatives-analysis.tsx`
- [X] T054 [P] [US5] Criar “Insights de Comparação”, “Referências dos Comparativos” e “Metas Configuradas” em `orkestria360/resources/js/components/modules/secure-score/comparatives-context.tsx`
- [X] T055 [US5] Compor abas e faixas 1–4, incluindo tabela/radar e regra móvel da representação estrutural, em `orkestria360/resources/js/components/modules/secure-score/comparatives-goals-tab.tsx`
- [X] T056 [US5] Cobrir média ausente/zero, cobertura por categoria, omissão de Meta e projeções futuras em `orkestria360/tests/Feature/Microsoft365/SecureScore/ComparativesGoalsPageTest.php`

**Checkpoint**: comparativos não preenchem lacunas e não transformam referência Microsoft em meta interna.

---

## Phase 10: User Story 7 - Consultar Controles Aceitos e Exceções Futuras (Priority: P2)

**Cards**: “Total de Controles com Exceção”, “Pontos Impactados”, “Risco Aceito”, “Mitigado por Terceiro”, “Não Aplicável”, “Em Revisão”, “Controles Aceitos e Exceções”, “Detalhes da Exceção”, “Distribuição por Tipo de Exceção”, “Pontos Impactados ao Longo do Tempo”, “Situação das Revisões”, “Pontos por Categoria”, “Importante”, “Atenção” e “Recomendação”.

**Goal**: Expor dados de controle e o limite do futuro workflow de exceções, sem criar ou alterar exceções.

**Independent Test**: Acessar a superfície com controles publicados e confirmar estados de dados; tentar cada ação operacional e confirmar que permanece desabilitada.

- [X] T057 [P] [US7] Criar a prop Inertia local, os KPIs, filtros e tabela “Controles Aceitos e Exceções” com estado de dados de controle em `orkestria360/app/Http/Controllers/Modules/SecureScoreController.php` e `orkestria360/resources/js/components/modules/secure-score/exceptions-table.tsx`
- [X] T058 [P] [US7] Criar “Detalhes da Exceção”, “Distribuição por Tipo de Exceção”, “Pontos Impactados ao Longo do Tempo”, “Situação das Revisões” e “Pontos por Categoria” como capacidades futuras em `orkestria360/resources/js/components/modules/secure-score/exceptions-analysis.tsx`
- [X] T059 [US7] Compor as duas faixas, tabela/detalhe móveis acessíveis, “Importante”, “Atenção”, “Recomendação” e botões Editar/Encerrar desabilitados em `orkestria360/resources/js/components/modules/secure-score/accepted-controls-exceptions-tab.tsx`
- [X] T060 [US7] Cobrir disponibilidade de controles, responsividade do detalhe e impossibilidade de mutar exceções em `orkestria360/tests/Feature/Microsoft365/SecureScore/AcceptedControlsExceptionsPageTest.php`

**Checkpoint**: a superfície comunica o desenho futuro de exceções sem expor uma falsa operação.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Verificar integração, consistência visual, segurança de leitura e gates da entrega completa.

- [X] T061 [P] Consolidar estados de UI, loading anunciado e preservação de dado para `available`, `restricted`, `unavailable`, `coming_soon`, vazio válido, primeira falha e stale, com motivo/frescor textual, nomes acessíveis, contraste e estado desabilitado não dependente só de cor, em `orkestria360/resources/js/components/modules/secure-score/secure-score-states.tsx`
- [X] T062 [P] Cobrir no cliente HTTP o bloqueio SharePoint de `POST`/`PUT`/`PATCH`/`DELETE` e a allow-list de host/path aplicados na Fase 2, em `orkestria360/tests/Feature/Microsoft365/SecureScore/SharePointReadOnlyGuardTest.php`
- [X] T063 Atualizar a página/shell e as rotas das oito superfícies para navegação, títulos e Inertia props consistentes em `orkestria360/resources/js/pages/modules/secure-score.tsx`
- [X] T064 Validar os oito journeys, faixas/spans/ordem, tabelas móveis acessíveis, resumo textual de gráficos, motivo/frescor de estados, controles desabilitados, foco visível e detalhe anunciado/restaurado definidos em `specs/009-secure-score-module/quickstart.md`
- [X] T065 Executar os gates de build e testes completos a partir de `orkestria360/composer.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias; T007 só inicia após T004–T006 e aplica a proteção SharePoint antes da primeira requisição dessa fonte.
- **P1**: US1, US2, US3, US6 e US8 dependem da publicação/projeção da Fase 2; podem avançar por arquivos distintos após T015.
- **P2**: US4 e US7 usam o shell e dados publicados; US5 também depende da projeção de comparativos T051. Todas preservam leitura e estados `coming_soon`.
- **Polish (Phase 11)**: depende das histórias desejadas concluídas.

### User Story Dependencies

- **US1 Dashboard Executivo (P1)**: T016–T022, depende da Fase 2; é o MVP recomendado.
- **US2 Pontuação por Categoria (P1)**: T023–T028, depende da Fase 2 e reutiliza o manifesto publicado.
- **US3 Ações de Melhoria (P1)**: T029–T034, depende da Fase 2 e do join score/perfil publicado.
- **US6 Evolução e Tendências (P1)**: T035–T040, depende da Fase 2 e requer duas publicações para diffs.
- **US8 Histórico e Auditoria (P1)**: T041–T046, depende da Fase 2 e é disponível já com uma publicação.
- **US4 Plano de Remediação (P2)**: T047–T050, depende da Fase 2 e não introduz workflow.
- **US5 Comparativos e Metas (P2)**: T051–T056, depende da Fase 2 e não introduz meta interna.
- **US7 Controles Aceitos e Exceções (P2)**: T057–T060, depende da Fase 2 e não introduz workflow de exceções.

### Parallel Opportunities

- T005 e T006 podem iniciar em paralelo após T004; T013 e T014 podem ser preparados em paralelo aos serviços correspondentes, mas T014 só valida a coleta SharePoint depois que T007 aplicar sua guarda.
- Em cada história, os componentes com `[P]` atuam em arquivos separados e podem ser implementados em paralelo depois que sua projeção/contrato estiver definido.
- Depois da Fase 2, US1, US2, US3, US6 e US8 podem ser distribuídas entre pessoas diferentes; as histórias P2 podem iniciar quando o shell base T012 estiver disponível.

## Parallel Example: User Story 2

```text
Task: "Criar os KPIs de Pontuação por Categoria em orkestria360/resources/js/components/modules/secure-score/category-kpis.tsx"
Task: "Criar a tabela Pontuação por Categoria em orkestria360/resources/js/components/modules/secure-score/category-score-table.tsx"
Task: "Criar os painéis de análise por categoria em orkestria360/resources/js/components/modules/secure-score/category-analysis.tsx"
```

## Implementation Strategy

### MVP First

1. Concluir Setup e Foundational, incluindo proteção SharePoint pré-coleta, coletores, publicação, props Inertia locais e testes de contrato.
2. Concluir US1 (Dashboard Executivo) e seu teste independente.
3. Rodar `composer ci:check` e validar a primeira publicação, vazio válido e estado restrito dinâmico.
4. Demonstrar o MVP somente com dados locais publicados.

### Incremental Delivery

1. Adicionar US2 e US3 para explicar e priorizar o score publicado.
2. Adicionar US6 e US8 após validar duas publicações comparáveis.
3. Adicionar as superfícies P2 como capacidades futuras transparentes e comparativos disponíveis.
4. Executar a validação cruzada e `composer test` somente após todas as histórias selecionadas.

## Notes

- `[P]` não elimina dependências de dados: não iniciar uma tarefa de consumo antes da projeção/contrato que ela necessita.
- T062 é a prova de regressão, no Polish, da proteção SharePoint que T007 já deve aplicar na Fase 2; não posterga a implementação da guarda.
- Sem tela pode chamar Microsoft Graph; fontes e estados vêm exclusivamente de publicação local.
- Nenhuma tarefa autoriza escrita em Microsoft 365, plano, meta ou exceção.
