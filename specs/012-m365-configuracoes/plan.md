# Implementation Plan: Microsoft 365 / Configurações

**Branch**: `feat/012-m365-configuracoes` | **Date**: 2026-08-25 | **Spec**: [spec.md](spec.md) | **Matrix**: [configuration-matrix.md](configuration-matrix.md)

## Summary

Implementar Configurações como um módulo de observação local, alimentado pelo sync Microsoft 365 já coordenado por `{tenant_id, microsoft_connection_id}`. O catálogo canônico (matriz, domínios, pesos e regras) é global e versionado; todos os fatos, publicações, classificações, resultados e evidências são customer-scoped e submetidos à RLS. As oito superfícies Inertia consomem exclusivamente projeções de uma publicação local vigente ou histórica, sem chamadas Microsoft no request da tela.

O módulo amplia — não substitui — `CoordinatedSyncCoordinator`, `SyncStageRecorder`, `TenantExecutionRunner`, os source states e o mecanismo de snapshots/publicações usado em Secure Score. A rede ocorre antes de transações curtas de staging/promoção. Fontes independentes podem formar uma publicação `partial` segura; somente falha que impeça uma publicação semanticamente segura conserva integralmente a publicação anterior. Uma linha elegível cuja fonte esteja `unavailable` permanece no denominador, recebe zero, reduz cobertura e nunca passa a significar valor falso, divergência ou trava.

## Technical Context

| Área | Decisão de implementação |
|---|---|
| Runtime | Laravel 13 / PHP, Inertia.js + React/TypeScript, PostgreSQL 18, Tailwind/shadcn e Recharts, conforme o repositório. |
| Sync e isolamento | Estender [CoordinatedSyncCoordinator.php](https://github.com/gabrielhmsantos/Orkestria360/blob/11271a6e88a656e8f2faf4b5522db798a433392d/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php), com lock `microsoft365:{tenant}:{connection}:sync`, `Microsoft365SyncCycle`, `Microsoft365SyncStage` e `TenantExecutionRunner::runForConnection`. |
| Padrão de publicação | Reutilizar a separação de coleta e publicação de [SecureScorePublicationBuilder.php](https://github.com/gabrielhmsantos/Orkestria360/blob/11271a6e88a656e8f2faf4b5522db798a433392d/app/Services/Microsoft365/SecureScore/SecureScorePublicationBuilder.php): checksum/idempotência, lock transacional pontual e manifesto `staging` invisível criado antes dos derivados. Não segurar transação durante I/O externo; promoção apenas fecha a current anterior e publica o manifesto já validado. |
| Transporte Graph | Um `GraphDataClient` versionável com enum fechado `GraphApiVersion` (`v1.0`, `beta`). `GraphClientFactory::make()` e `GraphClient` ficam v1.0/compatíveis; `makeForVersion()` devolve o mesmo transporte ligado à versão por meio da porta estreita `ConfigurationGraphReader`, sem um cliente TCM HTTP paralelo nem GET arbitrário. |
| Fonte/frescor | Criar `ConfigurationSourceContractRegistry` code-level, versionado e allowlisted: provider/audience, Graph/API version, operação/endpoint, permissions, cadência, freshness, coverage/falha e paginação/coleção. A dupla `source_key@version` é imutável após referência: alteração semântica cria nova versão e a antiga continua no registry enquanto histórico a referenciar. Todo collector resolve o contrato antes de I/O; `SourceStateFreshness::forContract()` recebe seu `SourceFreshnessContract`. Preservar `SourceStateFreshness::for()` e seu TTL de 26h para os callers atuais Groups e Licensing; ausência de contrato na API nova retorna freshness `unavailable`/indeterminada, sem mudar a disponibilidade. |
| Leitura/UI | Criar `ConfigurationPageData` e queries/projeções por superfície, no padrão de [GroupsPageData.php](https://github.com/gabrielhmsantos/Orkestria360/blob/11271a6e88a656e8f2faf4b5522db798a433392d/app/Services/Microsoft365/Groups/GroupsPageData.php), com controllers finos e rotas explícitas em `routes/web.php`. |
| Exportação | Reutilizar o desenho de `UsersAccountsExportController`/`IdentityCsvExport`: consulta local única, filtros idênticos à tela e resposta CSV UTF-8. |
| Retenção | Registrar um `ConfigurationsRetentionPruner` no [Microsoft365DataRetentionPruner.php](https://github.com/gabrielhmsantos/Orkestria360/blob/11271a6e88a656e8f2faf4b5522db798a433392d/app/Services/Microsoft365/Microsoft365DataRetentionPruner.php), com política própria por `runAt`: histórico em 365 dias e telemetria/evidência em `subMonthsNoOverflow(6)`, independente do cutoff genérico. O modo `all` remove somente o data-plane Microsoft coletado/derivado do tenant, em ordem de FKs, e preserva autoridade local Orkestria/customer. |
| Schema/RLS | Criar somente migrations incrementais novas com `php artisan make:migration ...`; não alterar `0001_01_01_000800_enable_tenant_row_security.php` nem outra migration histórica e não usar `migrate:fresh`. Migrations novas criam tabelas, FKs/checks/índices, grants e RLS `ENABLE` + `FORCE`, policies `USING`/`WITH CHECK` deny-by-default. |
| Segurança | Todas as tabelas tenant-scoped têm `tenant_id`, foreign keys tenant-first quando aplicável, políticas RLS em migration nova da feature e execução via contexto tenant/conexão. `SyncExceptionLogger` e a classificação segura de exceções existente são a boundary obrigatória: source state/readiness/evidence recebem somente razão, categoria e métricas sanitizadas; projections, CSV, Inertia, mutation errors e logs não reexpõem payload/provider exception/URL/credencial/identificador não autorizado. Só `customer admin` altera classificação local; não há novo papel nem escrita Microsoft. |
| Qualidade | PHPUnit Unit/Feature, `ModulePageTestCase`, testes de serviço/sync/RLS/migration incremental e Inertia props/routes; typecheck, ESLint, Prettier, Vite build e `composer ci:check`. Não introduzir Vitest/Playwright/browser-test stack nesta feature. |

## Constitution Check

**Pré-design: PASS.** Há uma história testável por superfície e a rastreabilidade literal dos cards permanece em `spec.md`. O módulo mantém o Microsoft 365 read-only; a única escrita aprovada é a classificação local, tenant-scoped e auditada. Este plano usa fontes locais publicadas, RLS, estados explícitos de indisponibilidade e os padrões existentes de sync/retenção.

## Data ownership and boundaries

### Catálogo/referência global — nunca duplicado por tenant

1. `ConfigurationMatrixVersion`, seus nove `ConfigurationDomain` e pesos do sponsor; uma versão publicada é imutável.
2. `ConfigurationMatrixLine`, `ConfigurationBaselineProfile` e seus itens versionados de comparação/eligibilidade, severidade, gate e referência `source_contract_key` + versão + `fact_key`. A MatrixLine não é registry de endpoint/permissão: ela só referencia o contrato allowlisted quando a leitura participa de comparação. Um perfil contém as regras de baseline de todas as linhas que uma publicação interpreta.
3. `ConfigurationSourceContractRegistry` é referência code-level/deploy, global e versionada, não tabela tenant nem MatrixLine. Inclui contratos para score e para fatos somente observacionais (organização, branding, domínios, group settings, named locations, Intune e colaboração auxiliar).
4. A migration incremental de bootstrap publica a matriz inicial de [configuration-matrix.md](configuration-matrix.md) por upsert idempotente; não há dependência de seed opcional. IDs externos de Conditional Access e conectores **não** entram neste catálogo.

### Data plane customer-scoped — sujeito a RLS

1. Gerações, staging, publicações, snapshots, fatos observacionais normalizados e source states pertencem a `tenant_id` e `microsoft_connection_id`. Um fato tem `source_key`/versão do registry, `fact_key` e `subject_key`; o vínculo a MatrixLine é opcional e somente existe para leitura homologada de comparação.
2. `ConfigurationBaselineProfile` e seus itens continuam globais; `ConfigurationBaselineVersion` e seus itens são materializações tenant-scoped internas, sem exceção, aprovação, override ou ativação pelo usuário. A versão fixa um perfil integral e a publicação a referencia, não só um JSON, para preservar a interpretação histórica.
3. Comparações, score, cobertura, mudanças, drift e evidência técnica são derivados de uma publicação e preservam a versão de matriz/baseline usada naquela interpretação.
4. Readiness TCM é diagnóstico da fonte, não fato de configuração e não cria snapshots TCM.
5. A classificação crítica local associa o tipo do objeto e sua referência externa a um tenant/conexão; só uma linha global aplicável a interpreta. IDs tenant-specific jamais viram linhas globais.
6. Auditoria de Configurações não ingere eventos: reutiliza `CanonicalAuditEventsCollector`, `Microsoft365CollectionPosition`, ingestion batches e `PublishedEventQuery`. `ConfigurationHistoryBuilder` pode correlacionar um evento já publicado por identidade canônica/referência externa/contrato+fact+subject, mas preserva mudança factual sem correlação quando a evidência é insuficiente.

## Delivery phases and dependencies

### Phase 0 — schema, catalog and local criticality

**Depends on:** matriz/spec aprovadas. **Can be tested without Graph.**

1. Criar migrations incrementais via `php artisan make:migration`: (a) catálogo global; (b) data plane, baseline tenant-scoped materializado e staging; (c) FKs/checks/índices complementares; (d) bootstrap de referência obrigatório; (e) runtime grants, `ENABLE/FORCE RLS` e policies. Não editar migrations históricas, especialmente `0001_01_01_000800_enable_tenant_row_security.php`, nem usar `migrate:fresh`.
2. Criar `ConfigurationSourceContractRegistry` code-level e seus testes: cada contrato tem source key/versão/checksum de definição, provider/audience, operação allowlisted, API version, permissions, cadência/freshness, coverage/falha e paginação/coleção. O registry valida que referências de MatrixLine/perfil existem e é a única origem para `forContract()`; valida também que todo par histórico `source_key@version`/checksum ainda existe e possui o mesmo significado. Mudança semântica exige `@N+1`; não criar tabela nem MatrixLine para fatos só de UI.
3. Criar modelos em `app/Models` para o modelo lógico de [data-model.md](data-model.md); aplicar tenant-first indexes, checks de estado, FKs compostas de mesmo tenant e chaves de idempotência.
4. Na migration incremental de bootstrap, inserir/upsertar de modo idempotente a versão inicial da matriz, nove domínios/pesos, linhas elegíveis e perfil global obrigatório com um item por linha. `php artisan migrate` em banco existente deve deixá-lo utilizável sem `db:seed`; versões futuras entram por nova migration/publicador de deploy explicitamente invocado. Criar `ConfigurationBaselineVersion` tenant-scoped somente como materialização interna do perfil integral e seus itens efetivos; as duas linhas antiphishing permanecem independentes para preservar `eligibleCount`.
5. Criar `CriticalClassificationService`, query de objetos classificáveis e controller de mutação. Política CA/conector começa não crítico; `customer admin` marca/desmarca mediante `lock_version`; conflito devolve 409 e exige recarga.
6. Persistir `CriticalClassificationAudit` com ator, antes/depois, versão, instante e `effective_from`; não recalcular publicações prévias. Ausência só inativa após coleção canônica válida/conclusiva; mesma referência externa reativa a classificação, referência nova inicia não crítica.

**Exit criteria:** `php artisan migrate` publica matriz/perfil global íntegros de modo idempotente, sem seeder opcional; RLS bloqueia leitura/escrita cross-tenant; classificação/auditoria/conflito/inativação/reativação cobertos por testes.

### Phase 1 — collectors, normalized facts and TCM readiness

**Depends on:** Phase 0. **Each collector independently testable.**

1. Criar `app/Services/Microsoft365/Configurations/Collectors/` para Graph e `.../Tcm/` para leitura TCM. Cada collector recebe somente `ConfigurationSourceContract` do registry; adaptá-lo para `GraphApiVersion` fechado e a factory para `makeForVersion()`; preservar `GraphClient`/`make()` em v1.0 e expor TCM somente por `ConfigurationGraphReader` allowlisted/read-only. Não criar cliente HTTP TCM nem cliente usado pela UI.
2. Reaproveitar fatos publicados onde a fonte já existe: `DirectoryIdentity` + privilégios e `MfaRegistrationCollector` para administrador/MFA; audit logs para histórico; source-state conventions de `IdentitySourceState`/`SecureScoreSourceState`.
3. Coletar e normalizar Conditional Access, SharePoint/OneDrive e os objetos necessários de colaboração conforme seus source contracts; aplicar a matriz somente aos fatos que ela referencia. O exemplar Intune/Learn pode orientar o coletor e modelo de dados, mas não homologa a trava: publicar seus fatos/estado como observados e manter a linha de acesso a não gerenciado fora do catálogo elegível até a composição homologada.
4. Implementar `TcmReadinessCollector` separado de `TcmConfigurationCollector`: licença, roles, endpoint/snapshot e permissões são reportados como readiness/availability. Ler `antiPhishPolicy`, `antiPhishRule`, `inboundConnector` e `outboundConnector` somente quando TCM disponível; nunca criar snapshot TCM.
5. Normalizar todos os objetos em fatos observacionais com `source_key`/versão do registry, `fact_key`, API versão, `external_reference`, `subject_key` canônico não nulo (sentinela para tenant), escopo, JSON normalizado, hash, `last_collected_at`, `source_updated_at`, disponibilidade, comparabilidade e correlação de ciclo. `observed_change_at` só nasce em change event diferencial. Garantir unicidade por tenant/geração/fonte/chave factual/sujeito; hash não identifica o fato. `matrix_line_id` é nulo para cards/inventário e preenchido apenas quando a leitura é homologada para comparação. Tratar 200 vazio válido, paginação, 401/403, 404, 429/Retry-After, timeout e falha transitória conforme a semântica do SourceContract, sem inventar valores.

**Exit criteria:** fixtures provam normalização e estados `available`, `restricted`, `unavailable`; paginação/retry/throttling preservam isolamento; TCM ausente/restrito produz readiness e zero apenas depois da comparação, não `false`.

### Phase 2 — coordinated generation, staging and atomic publication

**Depends on:** Phase 1.

1. Adicionar estágios `configurations_*` explicitamente ao `CoordinatedSyncCoordinator`, com dependências declaradas e heartbeat do lock. A chave de uma execução é tenant+connection+cycle; a reconciliação não consulta outra conexão do customer. Formalizar por fonte o resultado `complete`, `restricted`, `failed` ou `skipped`: só `complete` encerra integralmente o stage; restrição/falha preserva seu source state e pode permitir `partial` quando independente. Perda de lock/exception finaliza todos os stages e generation ativos com razão sanitizada e `finished_at`.
2. **Antes da promotion transaction**, criar manifesto `ConfigurationPublication` em `staging`, sempre invisível e `is_current=false`; somente nesse estado seus campos derivados/publishedAt podem estar nulos. Coletores concluem I/O; normalizadores persistem fatos observacionais/source states/readiness staged; cada fato é identificado por `source_key + fact_key + subject_key + cycle`, não payload hash. Todos os fatos publicados podem gerar snapshot/diff/change factual; somente fatos com MatrixLine homologada passam ao comparison engine. Score/domain aggregates, snapshots preparados e diffs/change/drift apontam para esse manifesto e são calculados em operações curtas/idempotentes. A geração é validada por completo.
3. A **promotion transaction** do `ConfigurationPublicationBuilder` é curta: readquire advisory lock, revalida generation/manifesto staging pronto, supersede a current anterior, troca o ponteiro current e marca generation/publication `published` ou `partial`. Ela não faz I/O, serialização, normalização, comparação, cálculo de score/diff ou processamento volumoso. Falha/lock perdido abandona generation/manifesto staging com motivo e instante.
4. Uma fonte independente pode ficar `unavailable` e ainda produzir `partial` seguro: sua linha elegível é mantida no score com zero. Falha de integridade da própria geração, perda do lock, ausência de matriz/baseline ou impossibilidade de montar uma interpretação coerente não promove nada e preserva integralmente a publicação anterior.
5. A fonte define sua cadência/freshness no contrato. Fato fora da janela é mostrado como último conhecido `stale`, com observado em/razão/cobertura, mas fica não comparável e não sustenta conformidade, divergência ou gate atual.

**Exit criteria:** testes de sync demonstram promoção atômica, retry seguro, partial seguro, preservação da current anterior quando necessário, todas as combinações unavailable/stale e ausência conclusiva.

### Phase 3 — comparison, score, gates, snapshots and history

**Depends on:** Phase 2.

1. Criar `ConfigurationComparisonEngine` a partir de `ConfigurationMatrixLine`/`ConfigurationBaselineProfileItem` e do item tenant-scoped efetivo. Ele só compara fato `available` e fresco; produz `conformant`, `divergent`, `unavailable` ou `ineligible`, com razão/fonte/evidência.
2. Criar `ConfigurationScoreCalculator` com pesos dos nove domínios. O denominador considera apenas linhas homologadas e elegíveis naquela publicação: fonte unavailable ainda integra o denominador e vale zero; não elegível (inclusive objeto não crítico) não integra. Cobertura é medida separadamente.
3. Materializar **as sete travas** do `spec.md` como resultados positivos de comparação, nunca por indisponibilidade: administrador sem MFA; política CA crítica desabilitada; autenticação legada SharePoint/OneDrive; link anônimo global com edição quando futuramente homologado; antiphishing conforme as duas linhas; conector Exchange crítico sem TLS; e acesso irrestrito a dispositivos não gerenciados quando futuramente homologado. As duas pendentes não geram linha/gate até a homologação definida na matriz; as linhas TCM elegíveis geram zero se unavailable e só ativam gate por evidência positiva.
4. Persistir por 365 dias a cadeia histórica Microsoft — geração, fatos observacionais, source states/readiness, publication, materialização de baseline, comparisons/domain scores, snapshots, diffs, `ConfigurationChangeEvent`, `ConfigurationDriftEvent` e auditoria derivada. Snapshots/events usam `source_key`/versão/checksum + `fact_key` + `subject_key` e fatos/snapshots antes/depois como identidade; MatrixLine, comparação, risco, severidade, baseline e gate são enriquecimento opcional. `ConfigurationHistoryBuilder` lê eventos somente pela coleção canônica já publicada, preserva identidade/deduplicação/ordem/paginação dela e não avança watermark; correlação é opcional e nunca inventada. Histórico conserva campos somente quando existentes; change/drift é sempre observação, nunca estado de change-management.
5. Acrescentar `ConfigurationsRetentionPruner` por `runAt`: current/source state persiste enquanto customer existir; a cadeia histórica Microsoft é 365 dias; telemetria/evidência técnica usa seis meses-calendário; matrix/perfil permanece enquanto interpretar publicação preservada; FKs de evidência expirada fazem `SET NULL` e a projeção informa `retention_expired`; disconnect não apaga. O cutoff genérico não altera esta política. O modo explícito `app:prune-microsoft365 <tenant> all` sobrepõe a retenção normal e remove integralmente os dados Microsoft coletados/derivados do módulo, inclusive current e materializações de baseline, mas preserva `CriticalClassification`, seu audit e demais preferências/decisões locais do Orkestria/customer.

**Exit criteria:** vetores de score para cada domínio, denominador/unavailable, freshness, sete gates e drift; pruner normal/`all`; publicação histórica conserva interpretação original após mudança de criticidade.

### Phase 4 — local projections, controllers and React surfaces

**Depends on:** Phase 3.

1. Criar `ConfigurationPageData`, queries de dashboard/tenant/identity/collaboration/security/service/baseline/history e `ConfigurationCsvExport`. Cada query escolhe a publicação local current ou a publicação histórica solicitada, sempre filtrada pelo `CurrentTenant`, e preserva coverage completo por card/fonte (`eligible`, `attempted`, `observed`, `matched`, `excluded`, `failed`, `unknown` quando aplicáveis), sem reduzir fato de fan-out a simples presença de row. O DTO mapeia unicamente `source_updated_at` → `sourceLastModifiedAt`, change diferencial → `lastObservedChangeAt`, e coleta/tentativa → `lastCollectedAt`; `publishedAt` é separado. Tabelas/detalhes usam `ConfigurationSettingView`; history só acrescenta risco/severidade/baseline/gate quando houver linha/comparison e só expõe correlação canônica existente. CSV/projections passam apenas dados já redigidos e razões seguras da boundary.
2. Criar `ConfigurationsController`, `ConfigurationExportController` e `CriticalClassificationController`; registrar rotas sob `/microsoft-365/configuracoes`, seguindo a convenção dos módulos existentes. As páginas React e componentes em `resources/js/pages/modules/configuracoes.tsx`, `components/modules/configuracoes/` e `types/modules/configuracoes.ts` recebem só page data Inertia.
3. Implementar filtros, paginação com `Anterior`/`Próxima`, detalhe, gráficos e relatórios previstos; CSV UTF-8 reutiliza a mesma query/filtros e inclui fonte, versão de API, disponibilidade, cobertura completa, freshness, reason e datas aplicáveis. `Alterações Pendentes` e `Alterações Executadas (30 dias)` ficam estruturalmente presentes como `unavailable` até existir fonte local canônica de change-management; `ConfigurationChangeEvent`/drift não preenchem esses estados. Cards de recomendação ficam `unavailable` sem `recommendation_rule` homologada e nunca são derivados de risco, divergência ou gate.
4. Expor classificáveis com estado `active`/`inactive`, lock version e histórico; o mutation local usa resposta de conflito explícita. Exibir `stale` somente como último valor conhecido/histórico e distinguir do estado corrente.

**Exit criteria:** cada rota carrega sem rede externa; todos os cards da tabela abaixo têm fonte ou estado explícito; filtros/paginação/CSV são coerentes; teste de authorization garante mutation só para customer admin.

### Phase 5 — hardening and delivery gates

**Depends on:** Phases 0–4.

1. Unit tests para catálogo/perfil global, baseline tenant, comparação, score, nova API freshness e retention; PHPUnit Feature/`ModulePageTestCase` para RLS/tenant/conexão, rotas, Inertia props, exports e autorização; integration tests com Graph/TCM fakes e ciclo coordenado. Não criar uma infraestrutura browser/component nova; registrar aceite manual reproduzível com `playwright-cli` para as superfícies alteradas.
2. Testar explicitamente: registry allowlisted rejeita endpoint/versão/permissão fora de contrato, preserva versões/checksums históricas e alimenta `forContract()`; upgrade incremental de schema e bootstrap obrigatório com dados prévios preservados, rerun sem migration pendente, os três estados de `ConfigurationSettingView` (fato+comparison, fato sem comparison, comparison unavailable sem fato), fatos/snapshots/events/history sem MatrixLine e sem risco/severidade/baseline/gate inventados, e comparação rejeitada sem vínculo homologado. Cobrir também RLS por Eloquent/`DB::table`/SQL direto sob runtime role, 429/retry, paginação hostil e cross-version, partial, manifesto staging invisível/current preservada, TCM unavailable/restricted, stale não comparável, ausência conclusiva, classificação concorrente, inativação/reativação, coverage de fan-out, CSV UTF-8, sete gates, os três timestamps propositalmente distintos, fim de mês em `subMonthsNoOverflow(6)` e `all` Microsoft preservando classificação/audit local. Reexecutar a mesma janela/página de auditoria canônica e provar que eventos canônicos, facts, snapshots, changes e drifts aplicáveis não duplicam; falha antes da persistência/publicação segura não avança watermark. Fazer gate negativo para ausência de credenciais, headers, URLs/payloads/erros brutos e identificadores não autorizados em reasons, evidence, telemetry/logs, Inertia, history, CSV e mutation errors.
3. Gerar migrations via `php artisan make:migration`, rodar `php artisan migrate` no PostgreSQL 18 existente e validar grants/RLS/constraints após upgrade; então rodar testes direcionados, typecheck/ESLint/Prettier/Vite build e `composer ci:check`. Atualizar o roadmap somente após gates verdes.

## Surface implementation mapping

Legend: **P** = publicação/fato/projeção Configuration novo; **R** = reutiliza projeção/fato local existente; **D** = fonte documentada, mas ainda não homologada para o cálculo; **U** = expõe unavailable/restricted/stale, sem simulação.

| Superfície e cards canônicos | Fonte/fato canônico e implementação | Consumidor local |
|---|---|---|
| **Dashboard Executivo** — `Microsoft 365 Configuration Score — score`; `Configurações Analisadas — KPI`; `Configurações Conformes — KPI`; `Configurações Divergentes — KPI`; `Configurações Críticas — KPI`; `Workloads com Drift — KPI/lista` | **P:** aggregate de `ConfigurationPublication`, comparações, score, gates, drift e coverage por domínio. | `ConfigurationDashboardProjection` em `ConfigurationPageData::dashboard`. |
| **Dashboard Executivo** — `Alterações Pendentes — lista de estados`; `Alterações Executadas (30 dias) — donut`; `Configurações por Risco — donut`; `Baselines Ativos — tabela curta`; `Configurações sem Coleta — lista` | Alterações pendentes/executadas: **U**, pois não há fonte local canônica de change-management nesta versão; change/drift observado não representa rascunho, aprovação, execução ou reversão. Risco/baseline/source states: **P**. | mesma projeção dashboard, com estado/razão/condição habilitadora por card. |
| **Dashboard Executivo** — `Conformidade por Workload — barras empilhadas`; `Evolução do Configuration Score — linha`; `Top 10 Configurações Críticas — tabela`; `Alterações Observadas Recentes — tabela`; `Workloads sem Coleta — tabela curta`; `Ações Recomendadas — lista priorizada` | Comparações/publicações históricas/source states: **P**; alterações observadas usam change/drift. Recomendações: **U** sem `recommendation_rule` homologada; matriz, risco e gate não inventam texto. | mesma projeção dashboard. |
| **Configurações do Tenant** — `Informações da Organização — detalhe em duas colunas`; `Identidade Visual do Tenant — mídia e metadados`; `Domínios Verificados — tabela`; `Contatos da Organização — cartões`; `Serviços Habilitados no Tenant — grade`; `Sincronização e Diretórios — detalhe`; `Configurações Gerais do Tenant — tabela` | **P+R+U:** organização/domínios/serviços e sincronização reutilizam fatos locais de conexão, identidade/grupos/licenciamento quando disponíveis; branding/contatos só aparecem mediante fonte publicada/autorizada e, sem ela, **U**/restricted. A tabela geral usa fatos Configuration publicados. | `TenantConfigurationProjection`. |
| **Identidade e Acesso** — `Políticas de Acesso Condicional — KPI`; `Localizações Nomeadas — KPI`; `Métodos de Autenticação — KPI`; `Usuários com MFA — KPI`; `Funções Administrativas — KPI`; `Usuários Externos (B2B) — KPI`; `Políticas de Acesso Condicional — tabela` | **P+R:** CA/localizações (novo Graph collector); MFA e admin usam `MfaRegistrationCollector`, `DirectoryIdentity`, privilégios/source states existentes. A classificação CA é **P** local e auditada. | `IdentityAccessConfigurationProjection`. |
| **Identidade e Acesso** — `Métodos de Autenticação — donut`; `Proteção por Senha — detalhe`; `Funções Administrativas — donut`; `Atribuições PIM — métricas`; `Usuários e Acesso — barras`; `Aplicativos Empresariais — métricas/lista`; `Eventos Recentes de Identidade — tabela`; `Recomendações de Investigação — lista` | **R/P/U:** identidades, MFA, privilégios e audit events são reutilizados; password/app/PIM sem fato homologado aparecem **U**/restrito conforme source state; recomendações são **U** sem regra homologada, não inventadas. | mesma projeção identity. |
| **Colaboração e Compartilhamento** — `Nível de Compartilhamento — KPI`; `Links Anônimos — KPI`; `Domínios Permitidos — KPI`; `Domínios Bloqueados — KPI`; `Expiração de Links — KPI`; `Expiração de Convidados — KPI`; `Sites Criados por Usuários — KPI`; `Configurações de Compartilhamento Externo — lista`; `Tipos de Link Padrão — donut` | **P/D/U:** fatos SharePoint/OneDrive homologados e source state; a linha “link anônimo global com edição” segue **D** até fato comparável homologado, mesmo se card expõe capacidade observada. | `CollaborationConfigurationProjection`. |
| **Colaboração e Compartilhamento** — `Atividade de Compartilhamento (30 dias) — linha`; `Acesso de Convidados — donut`; `Domínios Permitidos — tabela paginada localmente (10 itens)`; `Políticas de Grupos e Sites — lista de pares`; `Configurações do Microsoft Teams — lista de pares`; `Configurações do OneDrive — lista de pares`; `Alterações Observadas de Compartilhamento — tabela`; `Recomendações de Investigação — lista priorizada` | **P/R/U:** fatos de colaboração, grupos e eventos locais; Teams/OneDrive não coletados vêm **U**; recomendações são **U** sem regra homologada; nenhuma chamada da tela. | mesma projeção collaboration. |
| **Segurança e Compliance** — `Postura de Segurança — KPI`; `Configurações Analisadas — KPI`; `Configurações Conformes — KPI`; `Configurações Divergentes — KPI`; `Configurações Críticas — KPI`; `DLP - Incidentes (30 dias) — KPI`; `Proteções do Microsoft Defender — tabela`; `Conformidade e Proteção de Dados — donut` | **P/R/U:** score/comparisons; Defender reutiliza fontes locais quando aplicável; DLP/Defender sem fonte comparável fica **U**. | `SecurityComplianceConfigurationProjection`. |
| **Segurança e Compliance** — `DLP - Principais Incidentes (30 dias) — tabela`; `Auditoria e Monitoramento — métricas`; `Rótulos de Sensibilidade — tabela`; `Políticas de Retenção — donut`; `Baselines de Segurança — tabela`; `Configurações Críticas Detectadas — tabela`; `Evolução da Postura de Segurança — linha`; `Workloads e Cobertura — barras horizontais`; `Recomendações de Investigação — lista` | **P/R/U:** baseline/comparison/history/source states e audit events; Purview/DLP não disponível é explícito; recomendações são **U** sem regra homologada. | mesma projeção security. |
| **Configurações por Serviço** — `Microsoft Entra ID — cartão seletor`; `Exchange Online — cartão seletor`; `SharePoint Online — cartão seletor`; `OneDrive for Business — cartão seletor`; `Microsoft Teams — cartão seletor`; `Intune — cartão seletor`; `Microsoft Defender — cartão seletor`; `Microsoft Purview — cartão seletor`; `Categorias — filtros` | **P:** catálogo de serviços/domínios combinado a coverage/source states; Intune exemplar pode alimentar observação, mas não gate não homologado. | `ServiceConfigurationsProjection`. |
| **Configurações por Serviço** — `Configurações do Serviço — tabela`; `Detalhes da Configuração — painel`; `Conformidade por Serviço — donut`; `Serviços com Maior Número de Divergências — barras horizontais`; `Serviços com Mais Configurações Críticas — barras horizontais`; `Recomendações de Investigação — lista de riscos` | Comparações publicadas, fatos observacionais selecionados, baseline/matriz e gates: **P**. Recomendações: **U** sem `recommendation_rule` homologada. | mesma projeção service; paginação/filtros no query local. |
| **Baselines e Conformidade** — `Baselines Ativos — KPI`; `Configurações Cobertas — KPI`; `Divergências Detectadas — KPI`; `Baselines Ativos — tabela`; `Cobertura por Serviço (Baseline Ativo) — donut`; `Divergências por Nível de Risco — barras horizontais`; `Configurações Divergentes — tabela` | **P:** versões de baseline/matriz, comparações e coverage da publicação selecionada. | `BaselinesComplianceProjection`. |
| **Histórico e Auditoria** — `Alterações Observadas — KPI`; `Alterações Externas (Drift) — KPI`; `Configurações Críticas Alteradas — KPI`; `Histórico de Alterações — tabela`; `Origem das Alterações — donut`; `Detalhes da Alteração Selecionada — detalhe` | **P+R:** events/drifts de configurações e `CanonicalAuditEventsCollector` quando houver correlação local. | `ConfigurationHistoryProjection`. |
| **Histórico e Auditoria** — `Valores da Configuração — diff`; `Informações Técnicas — detalhe`; `Alterações por Serviço — barras horizontais`; `Alterações por Nível de Risco — donut`; `Evidências e Logs — lista`; `Drifts Relacionados — lista de estado` | **P:** snapshots/facts/technical evidence e correlação; valores stale permanecem históricos e não comparáveis. | mesma projeção history. |

### Source wiring and fallback by surface

Esta tabela torna explícitas as fontes e limites dos grupos acima. Um card que não possui fato homologado ainda recebe sua projeção local com `unavailable`/`restricted`, razão e condição habilitadora; não recebe placeholder ou chamada remota.

| Surface / groups of canonical cards | Canonical fact and source | Existing reuse / new work | Local fallback and consumer |
|---|---|---|---|
| Dashboard — todos os 17 cards | `ConfigurationPublication`, domain scores, comparisons, source states, baselines e change/drift para **alterações observadas**; não tem fonte Graph própria. | **New:** `ConfigurationDashboardProjection`; reutiliza o manifesto Configurações e `CanonicalAuditEventsCollector` já publicado. | Sem publication: todos os grupos retornam unavailable com razão de primeira coleta. Mesmo com publication, `Alterações Pendentes`, `Alterações Executadas (30 dias)` e cards de recomendação ficam unavailable até fonte/regra canônica; `ConfigurationPageData::dashboard`. |
| Tenant — os sete cards de organização, branding, domínios, contatos, serviços, sync e tabela geral | Source contracts Graph para `/organization`, `/domains`, branding da organização, `/groupSettings` e `/groupSettingTemplates`; conexão local, cycles, `DirectoryIdentity`, `DirectoryGroup` e licensing para dados já publicados. | **New:** `OrganizationProfileCollector`, `TenantBrandingCollector`, `VerifiedDomainsCollector`, `GroupSettingsCollector`, `TenantConfigurationProjection`; fatos usam `fact_key` e não exigem MatrixLine; a tabela geral usa `ConfigurationSettingView`. **Reuse:** `MicrosoftConnection`, cycles, identities/groups/licensing. | Contatos/branding sem autorização e qualquer propriedade ausente ficam restricted/unavailable, sem inferir serviço; `TenantConfigurationProjection`. |
| Identity — 15 cards de CA, localizações, MFA, funções, PIM, apps, eventos e recomendações | Graph v1 `conditionalAccess/policies` e `namedLocations`; `MfaRegistrationCollector`, `DirectoryIdentity`, `PrivilegesCollector`, `RiskSignalsCollector` e directory audits já locais. | **New:** `ConditionalAccessCollector`, `NamedLocationsCollector`, `IdentityAccessConfigurationProjection`; **reuse:** fatos MFA/identidade/privilégios/audits. Password protection, PIM detalhado e apps sem contrato comparável não ganham coletor especulativo. | CA vazia válida é `empty_valid`; PIM/app/password sem fato ou restricted preservam source state; mesmo projection local. |
| Collaboration — 17 cards de SharePoint/OneDrive, convidados, grupos, Teams, atividade e histórico | Graph v1 `/admin/sharepoint/settings`, `authorizationPolicy`, `crossTenantAccessPolicy`; grupos/identidades/audits já publicados. | **New:** `SharePointSettingsCollector`, `AuthorizationPolicyCollector`, `CrossTenantAccessPolicyCollector`, `CollaborationConfigurationProjection`; **reuse:** groups, identities, audit events. Teams PowerShell é documentado, mas não homologado. | `sharingCapability` não prova Edit; `isUnmanagedSyncAppForTenantRestricted` não prova managed-device access. Esses cards/linhas mostram D/U com razão; consumer collaboration. |
| Security — 17 cards de postura, DLP, Defender, Purview, baselines e cobertura | Publication/comparisons/source states/readiness; facts Exchange TCM beta quando snapshot existir; eventos locais e dados Defender/Secure Score já publicados quando forem compatíveis. | **New:** `TcmReadinessCollector`, `TcmConfigurationCollector`, `SecurityComplianceConfigurationProjection`; **reuse:** Secure Score sources, audits, comparison/baseline projections. Não criar coletor PowerShell/Defender/Purview sem fonte homologada. | TCM sem pré-requisitos/snapshot torna antiphish/conector unavailable; DLP/Purview/Defender sem fonte fica U, nunca falso; consumer security. |
| By service — oito seletores, filtros, tabela, detalhe, donut/rankings/recomendações | Source contract registry, catálogo/matriz, facts, comparisons e source states; Intune v1 `deviceCompliancePolicies`/`deviceConfigurations` só como inventário observado, e collections beta apenas documentadas. | **New:** `ServiceConfigurationsQuery` e `ServiceConfigurationsProjection`; `IntuneConfigurationInventoryCollector` para fatos observados delimitados; tabela/detalhe usam `ConfigurationSettingView`; **reuse:** matrix/publication comparison query. | Serviço sem conector conserva selector e U; Intune beta e linhas não homologadas não entram em score/baseline, mas fatos observados seguem exibíveis; consumer by-service. |
| Baselines — sete cards | Matrix, perfis globais de baseline com itens e `ConfigurationComparison` da publicação; não há endpoint próprio. | **New:** `BaselinesComplianceProjection`; **reuse:** `ConfigurationComparisonEngine`/publication scores. | Fato/baseline não comparável apresenta U com fonte/razão; consumer baselines-compliance. |
| History — 12 cards | Configuration snapshots/change/drift/technical evidence e Graph directory audits já coletados com watermark pelo `CanonicalAuditEventsCollector`. | **New:** `ConfigurationHistoryProjection` e `ConfigurationHistoryQuery`; consulta ancora source contract/fact/snapshot e usa left join de MatrixLine/comparison só para enriquecimento. **Reuse:** `PublishedEventQuery`, event retention, canonical audit events. | Sem coleta histórica: KPI e gráficos U, nunca “zero alterações”; alteração factual sem MatrixLine continua investigável, mas risco/severidade/baseline/gate são nulos; diff/evidence podem ser restricted; consumer history-audit. |

## Project structure

```text
orkestria360/
├── app/
│   ├── Http/Controllers/Modules/ConfigurationsController.php                 # new
│   ├── Http/Controllers/Modules/ConfigurationExportController.php            # new
│   ├── Http/Controllers/Modules/CriticalClassificationController.php         # new
│   ├── Models/Configuration*.php, ConfigurationBaseline*.php, CriticalClassification*.php # new
│   ├── Services/Microsoft365/
│   │   ├── Configurations/
│   │   │   ├── ConfigurationSourceContractRegistry.php                        # new; versioned allowlist, no DB table
│   │   │   ├── Collectors/{Graph,Tcm}/*Collector.php                          # new
│   │   │   ├── ConfigurationPublicationBuilder.php                            # new
│   │   │   ├── ConfigurationComparisonEngine.php / ConfigurationScoreCalculator.php
│   │   │   ├── *PageData.php, *Projection.php, *Query.php, ConfigurationCsvExport.php
│   │   │   ├── CriticalClassificationService.php / ConfigurationsRetentionPruner.php
│   │   │   └── TcmReadinessCollector.php
│   │   ├── Sync/CoordinatedSyncCoordinator.php                                # changed
│   │   ├── Sync/SourceStateFreshness.php                                      # changed: additive forContract(); for() unchanged
│   │   └── Microsoft365DataRetentionPruner.php                                # changed
│   └── Support/Microsoft365/                                                  # changed only for client contracts
├── database/migrations/2026_..._create_configuration_catalog_tables.php       # new; generated incrementally
├── database/migrations/2026_..._create_configuration_data_plane_tables.php    # new; generated incrementally
├── database/migrations/2026_..._add_configuration_constraints_indexes.php     # new; generated incrementally
├── database/migrations/2026_..._bootstrap_configuration_reference_data.php    # new; idempotent matrix/domains/profile/items
├── database/migrations/2026_..._enable_configuration_runtime_rls.php          # new; grants + ENABLE/FORCE/policies
├── resources/js/pages/modules/configuracoes.tsx                                # new
├── resources/js/components/modules/configuracoes/*                             # new
├── resources/js/types/modules/configuracoes.ts                                 # new
├── routes/web.php                                                              # changed
└── tests/{Unit,Feature}/Microsoft365/Configurations/*                          # new
```

## Complexity tracking

| Decision | Why it is necessary | Rejected alternative |
|---|---|---|
| Global matrix vs tenant facts | Evita catálogos divergentes e IDs de tenant no referencial; preserva interpretação histórica. | Copiar linhas/baselines por customer. |
| Publication builder dedicado | A composição de fontes e score tem integridade própria, mas reutiliza ciclo/lock/stage existentes. | Um comando de sync separado, sem coordenador. |
| Readiness TCM separado | Licença/role/snapshot qualificam acesso à fonte, não o estado de segurança do tenant. | Inferir controle inseguro ou criar snapshot. |
| Classificação local prospectiva | É escrita Orkestria aprovada e auditável, sem alterar Microsoft e sem reescrever histórico. | IDs críticos no catálogo global ou last-write-wins. |
| Manifesto staging persistido | Derivados possuem FK para publication e precisam de owner antes da promoção; a UI filtra staging/abandoned. | Inserir/mover comparações e snapshots dentro da transação de promoção. |
| Perfil de baseline integral | Uma versão tenant-scoped fixa o conjunto de itens de baseline aplicado à publication. | BaselineVersion apontando para definição por linha. |
| Bootstrap por migration | Matriz, domínios e perfil inicial são referência obrigatória de runtime; `migrate` deve produzir banco utilizável sem seed opcional. | Depender de `db:seed` após upgrade. |
| Um GraphDataClient por versão fechada | Reutiliza autenticação/retry/métricas sem estender o contrato legado ou duplicar HTTP TCM. | Cliente TCM paralelo ou parâmetro de versão livre. |
| Freshness por contrato de fonte | Cada fonte tem cadência distinta e a ausência de contrato precisa continuar visível. | TTL global de 24/26h ou TTL por linha. |

## Constitution Check — Post-design

**PASS.** O desenho usa só dados locais publicados nos oito requests de tela, mantém o limite Microsoft read-only, preserva RLS tenant-first e as regras de score/indisponibilidade fechadas na Spec. O mapeamento acima cobre literalmente todos os cards da representação estrutural; cada card possui fato/projeção local ou estado documentado `unavailable`/`restricted`/`D`, sem lacunas implicitamente tratadas como sucesso. O plano está pronto para `/tasks`.

## UI Blueprint realignment — 2026-09-02

This addendum supersedes the completed surface tasks only where they conflict with `discovery/microsoft-365/v2/configuracoes/ui-blueprint.md`.

### Fixed decisions and boundary

- There are no global hero actions. Existing local export may remain, but it is not a new requirement.
- The module does not use `SourceMetadata`; provenance, coverage, freshness and safe reasons remain inside each surface's own published contract and anatomy.
- Critical classification remains an approved tenant-scoped local action. It never mutates Microsoft 365 and remains contextual to the applicable configuration.
- No realignment task may change collectors, Graph clients, source-contract registry, synchronizers, publication builders, migrations, RLS, schedules, locks or persistence. Screen requests remain local-publication reads only.

### Delivery slices

1. Preserve factual content for `partial`/`stale`, use availability panels only for `unavailable`/`restricted`, replace the dashboard gauge with the documented score card, and expose accessible DOM summaries for bars and lines.
2. Restore the Configurações por Serviço desktop `2/7/3` composition; use `OperationalFilterBar` for category/status/risk; replace its dialog with `InlineDetailPanel` driven by the existing local `settingId`. Apply the same contextual-detail contract to Identity and History.
3. Give every dense table an accessible horizontal-scroll hint or complete mobile-card presentation; correct donut legends by span; pass existing page loading state to interactive controls.
4. Recommendations and collaboration activity remain explicit availability states until an already-published local rule/source exists. No collector, API or mock data is added.

### Validation

Add regression coverage for no source state, available/empty-valid, `partial`, `stale`, `unavailable`, `restricted`, filters/pagination/selection and local-only requests. Run the affected Configuration feature tests, frontend type/lint/format/build checks, Playwright acceptance at 360px, 768px and desktop, unchanged synchronization non-regression tests, and `composer ci:check`.
