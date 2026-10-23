# Relatório técnico — dados já implementados em Relatórios

> Data da inspeção: 08/09/2026
> Escopo: contratos e superfícies já existentes no worktree de `orkestria360/`.  
> Não é proposta de implementação, nem inventário de dados desejados. Quando uma região da referência do sponsor não tem contrato/projeção correspondente, ela é registrada como **lacuna factual**.  
> Referência visual complementar: [relatório visual das referências do sponsor](relatorio-visual-das-referencias-do-sponsor.md).

## Critério de leitura

Este relatório responde “qual dado a tela usa hoje?” e não “qual dado a tela deveria inventar”. As fontes são sempre persistidas/localmente publicadas antes da leitura da página; as projeções de Relatórios não constroem cliente Microsoft Graph durante a requisição. Essa garantia é coberta, entre outros, por `ReportsDashboardTest`, `ReportsSecurityTest`, `ReportsOperationalPageTest`, `ReportsHistoryTest`, `ReportsCoreNoProviderIoTest` e `ReportsFullNoProviderIoTest`.

Os campos técnicos de fonte, cobertura e frescor podem existir em payloads e manifestos para regra, auditoria e sanitização. A interface atual não deve exibi-los como metadado de fonte. Os estados visuais são feitos por `DataAvailabilityPanel` (`available` não o usa; `unavailable`, `restricted` e `coming_soon` o usam) e o vazio factual permanece dentro de `OperationalTable`/seção correspondente.

| Regra transversal já implementada | Evidência |
| --- | --- |
| Shell único de oito abas, Hero “Relatórios” e aba ativa por rota | `app/Services/Microsoft365/Reports/ReportsModuleShell.php`; `resources/js/components/modules/reports/reports-module-shell.tsx`; controllers de Relatórios. |
| Leitura tenant + conexão atual, com contexto ambíguo/restrito rejeitado | `ReportAccess`; `ReportsAuthorizationHttpIntegrationTest`; `ReportsHistoryTest`. |
| Catálogo é allowlist, não aceita definição executável ou bloco fora do template | `ReportCatalog`; `ReportBlockProjectionRegistry`; `ReportPreflightService`. |
| Prévia/entrega usam fotografia congelada no manifesto, sanitizada por política de acesso | `ReportManifestService`, `ReportPreviewService`, `ReportProjectionPolicy`, `OperationalReportsProjection`; `ReportsPreviewHttpTest`, `ReportsSourcePrunedIntegrationTest`. |
| Persistência segregada por tenant/conexão e retenção | migrations `2026_09_02_191736_create_reports_and_licensing_publications_tables.php` e `2026_09_02_194100_enforce_reports_connection_scoped_foreign_keys.php`; `ReportsRlsTest`, `ReportsRetentionTest`. |

## Modelo de disponibilidade aplicável

| Estado | Origem no contrato | Como a região permanece visível |
| --- | --- | --- |
| `available` | Publicação compatível e regra de cálculo satisfeita | Card, gráfico, tabela ou detalhe com o dado publicado. Valor zero é preservado como zero; não vira indisponibilidade. |
| `unavailable` | Não publicado, pré-condição sem publicação compatível ou métrica ainda não aprovada | `DataAvailabilityPanel` ocupa a região. Em tabelas, linha vazia factual é mantida. |
| `restricted` | Publicação/fonte publicada com acesso restrito | `DataAvailabilityPanel` ocupa a região; nenhum valor substituto é calculado. |
| `coming_soon` | Capacidade deliberadamente fora da V1 | Região e texto “Em breve” permanecem; não há ação simulada. |
| vazio factual | Consulta/local collection sem registros após contexto ou filtro válido | A tabela/lista segue renderizada, com mensagem factual. Não é um indicador numérico zero. |

## Atualização — telemetria operacional publicada

O sincronizador de Licenciamento publica, em famílias independentes, usuários ativos D30, e-mails enviados, participações em reuniões Teams, sites ativos, armazenamento SharePoint/OneDrive em MB e usuários ativos por serviço. CSVs Detail são agregados em memória e descartados; UPN, nomes, URLs temporárias e bytes não são persistidos. A aba operacional lê apenas essas publicações e snapshots Intune já publicados; falhas preservam a publicação anterior e exibem `DataAvailabilityPanel`. Estados de fonte sem publicação também são projetados: uma restrição confirmada ocupa a região como `restricted`; erro HTTP sem causa confirmada permanece `unavailable`.

## Dados persistidos e blocos allowlisted

O `ReportsCatalogSeeder` publica três templates V1 ativos, todos para `member` e `customer_admin`, com formatos `csv` e `xlsx`:

| Template | Blocos permitidos | Períodos | Política de saída parcial |
| --- | --- | --- | --- |
| `operational-usage` / Uso operacional | `taxa-de-adocao` (required), `uso-agregado-office365` (required) | D7, D30, D90, D180 | forbidden |
| `operational-licensing` / Licenciamento operacional | `inventario-skus-capacidade` (required) | não aplicável | forbidden |
| `security-posture` / Postura de segurança | `secure-score-postura` (required), `limitacoes-de-evidencia` (degradable) | não aplicável | labelled_allowed |

| Bloco | Publicação persistida que o `ReportBlockProjectionRegistry` lê | Projeção congelável | Regra de disponibilidade |
| --- | --- | --- | --- |
| `taxa-de-adocao` | `license_usage_publications` + `licensed_population_publications`, mesma `publication_generation_id` | `kind: adoption_rate`, `value`, `numerator`, `denominator`, `report_period` | Uso `Office 365`/`active_users` do período, ambas publicações available, denominador maior que zero e `coverage.kind` compatível. |
| `uso-agregado-office365` | `license_usage_publications` da geração âncora | `kind: aggregate_usage`, linhas `workload`, `metric_key`, `metric_value` | Todas as linhas da geração/período devem estar available. |
| `inventario-skus-capacidade` | `license_inventory_publications` da geração mais recente | `kind: license_inventory`, linhas de SKU, unidades enabled/consumed/available, capability e service plans | Registros filtrados por `sku_part_number`/`availability_state`, não vazios e todos available. |
| `secure-score-postura` | `secure_score_publications`, snapshot, controles publicados e estado Secure Score | `kind: secure_score`, `current_score`, `max_score`, controles por nome/categoria/estado/score | Publicação compatível resolvida por `PublishedSecureScore`; os filtros permitidos são `category` e `state`. |
| `limitacoes-de-evidencia` | `licensing_source_states` e `secure_score_source_states` vinculados à conexão/ciclos | `kind: evidence_limitations`, linhas sanitizadas de estado | É degradável; a projeção não carrega motivo interno bruto, só `source_reason_sanitized` quando aplicável. |

## 1. Dashboard Executivo (`/microsoft-365/reports`)

**Contrato:** `ReportsDashboardController` entrega `ReportDashboardData::for(User)`.  
**Componente:** `resources/js/pages/modules/reports.tsx`.

| Região atualmente renderizada | Dado/payload | Persistência e regra | Estado preservado / interação |
| --- | --- | --- | --- |
| Síntese de postura — Microsoft 365 Health Score | `data.posture.healthScore`: `availability`, `value`, `reason` e metadados internos | Não há fonte canônica aprovada; `ReportDashboardData` o devolve sempre `unavailable`. | `DataAvailabilityPanel` com visual `gauge`, portanto a posição do score continua visível e não exibe zero. |
| Síntese de postura — Licenças publicadas | `data.posture.licenses.value`, `label` | Soma `enabled_units` de `license_inventory_publications` na geração mais recente da conexão. | Se âncora inexistente ou publicação não available, `DataAvailabilityPanel`; se available, `OperationalKpiCard`. Zero seria mostrado como zero. |
| Síntese de postura — Licenças atribuídas | `data.posture.assignedLicenses.value`, `label` | Soma `consumed_units` do mesmo conjunto de inventário publicado. | Mesmo comportamento de indisponibilidade do card anterior. |
| Evolução e adoção | `data.adoption.series[]`, `reason` | Série cronológica de adoção: `active_users` Office 365 ÷ população licenciada elegível, em gerações comparáveis e com cobertura compatível. | Só com duas ou mais observações comparáveis renderiza `ChartPanel line`; sem série, `DataAvailabilityPanel visual="line"`. Não há linha sintética. |
| Riscos e oportunidades | `data.risks[]`: `title`, `value`; `data.riskState` | SKUs com `available_units > 0`, ordenados descendentemente e limitados a cinco. | Sem inventário, painel de indisponibilidade; com inventário, lista de capacidade e recomendação factual. |
| Relatórios recentes | `data.recentReports[]`: `id`, `format`, `state`, `period` | `report_requests` da mesma tenant/conexão, com manifesto, cinco mais recentes por `accepted_at`. | `OperationalTable`; sem registros, linha “Nenhuma solicitação local concluída ou em andamento.” |
| Agenda | `data.agenda.reason` | Não há agendamentos persistidos nesta V1. | `DataAvailabilityPanel coming_soon`, visível abaixo da tabela de recentes. |

**Lacunas factuais frente à referência visual:** não há contratos para Usuários Ativos, Secure Score nesta faixa, incidentes, economia, adoção por serviço, donuts de licenças/incidentes, comparativo mensal, armazenamento ou ações pendentes. A página recebe série de evolução somente quando já existem observações comparáveis; a ausência dessa série preserva o painel de disponibilidade, não uma taxa isolada no lugar do gráfico.

## 2. Catálogo de Relatórios (`/microsoft-365/reports/catalog`)

**Contrato:** `ReportsFoundationController::catalog` entrega `connection` e `templates` de `ReportCatalog::for`.  
**Componente:** `resources/js/pages/modules/reports-catalog.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| Filtro de texto | Título + finalidade dos templates já retornados | `report_templates` ativos, ordem `display_order`. Não realiza nova consulta no servidor. | Filtro local; zera preflight e mantém tabela. |
| Filtro de disponibilidade | Disponibilidade agregada calculada dos `blocks[]` | Precedência atual: `restricted`, depois `unavailable`, depois `coming_soon`, senão `available`. | Filtro local contém os quatro estados. Sem resultado, tabela continua com vazio factual. |
| Tabela Templates | `id`, `title`, `purpose`, `allowed_periods`, `audience`, `allowed_formats`, `blocks[].pii_policy`, `blocks[].requirement_mode`, disponibilidade agregada | Catálogo publicado + resultado de cada bloco no `ReportBlockProjectionRegistry`. | `OperationalTable` com hint de rolagem; não tem paginação pois a lista completa é entregue. |
| Requisito agregado | “Obrigatório” se algum bloco é `required`; senão “Degradável” | `report_template_blocks.requirement_override` ou `report_block_definitions.requirement_mode`. | Rótulo de tabela, sem expor status de fonte. |
| Painel Requisitos | Blocos do template selecionado e, após validar, `preflight.requirements[]` | Bloco recebe `id`, `key`, requirement mode, availability, reason e política PII. | `InlineDetailPanel`; bloco indisponível/restrito/em breve mantém seu `DataAvailabilityPanel`. |
| Seleção formato/período e validação | `format`, `report_period`, IDs dos blocos do template; resposta `can_accept`, `partial`, `requirements`, `token` | POST `reports.preflight`; `ReportPreflightService` valida allowlist, período, formato, filtros e regra required/degradable. | Botão não gera; apenas faz preflight. Erro de transporte vira mensagem factual e os estados publicados seguem preservados. |

**Lacunas factuais:** não há visualização em cards, favoritos, ordenação, paginação no servidor, alternância grade/lista ou métricas de uso/última geração por template. As ações de gerar/importar/gerenciar da referência não existem nesta superfície; a única ação funcional é selecionar e validar requisitos.

## 3. Relatórios Executivos (`/microsoft-365/reports/executive`)

**Contrato:** `ExecutiveReportProjection::for(User)`.  
**Componente:** `resources/js/pages/modules/reports-executive.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| Secure Score | `data.kpis[id=secure-score]`: `state`, `value`, `maximum`, `reason` | `PublishedSecureScore` seleciona a publicação compatível da mesma tenant e conexão. A razão só é aceita quando `0 <= current <= maximum` e `maximum > 0`. | Available: `OperationalKpiCard variant="fraction"` com valor factual `N/X`; unavailable/restricted ou valor inválido: `DataAvailabilityPanel`. Não há série sintética. |
| Usuários ativos M365 (30 dias) | `data.kpis[id=active-users]`: `state`, `value`, `reason` | O coletor/publicador grava o agregado sem PII de `getOffice365ActiveUserDetail(D30)` em `license_usage_publications`, com `workload=Office 365` e `metric_key=active_users_detail`; `ExecutiveReportProjection` o lê na tenant/conexão atual. `signInActivity` mede login e não preenche este KPI. | Publicação válida gera `OperationalKpiCard` com zero factual preservado; sem publicação ou com restrição, `DataAvailabilityPanel`. Série só após snapshots comparáveis do mesmo agregado. |
| Licenças atribuídas | `data.kpis[id=assigned-licenses]`: `state`, `value`, `reason` | Geração mais recente íntegra de `license_inventory_publications` da tenant+conexão, somando `consumed_units` pela mesma regra de SKUs elegíveis, ativos e incluídos do Inventário. | Available: `OperationalKpiCard`; geração incompleta/unavailable/restricted: `DataAvailabilityPanel`; não há série sintética. |
| Lista de templates | `data.templates[]`: `id`, `title`, `purpose`, `allowed_formats`, blocos resumidos | Mesmo `ReportCatalog`, eventualmente filtrado pelo período de uso mais recente de `license_usage_publications`. | `OperationalTable` com linha vazia factual quando não existir template. |
| Metodologia | `data.methodology.body` | Texto fixo da projeção: composição local do catálogo/publicações, sem I/O de provedor. | Sempre visível. |
| Limitações | `data.methodology.limitations[]`: chave, availability, reason | Percorre blocos e `source_states` retornados pelo catálogo; inclui blocos indisponíveis ou stale. | Cada indisponibilidade vira `DataAvailabilityPanel`; available não mostra linha adicional. |
| Progresso futuro | `data.future_progress.steps`, `message` | Capacidade estática V1. | `ProcessProgress`: Catálogo completo, composição atual, PDF/PPTX/IA pendente. |
| Formatos não aprovados | `data.unapproved_formats` | Estado fixo V1. | `DataAvailabilityPanel coming_soon` para PDF, PPTX e IA. |

**Atualização posterior à inspeção de 05/09/2026:** a projeção executiva agora consome o agregado publicado de Active User Detail D30 e a geração íntegra de inventário da conexão atual. `IdentityActivitySignal` e `TenantLicenseSku` corrente não são fallback para esses KPIs.

**Lacunas factuais:** Health Score, economia estimada, incidentes, mini-séries comparáveis, ranking, insights, ações rápidas, exportação geral e demais cards de valor ainda não possuem contrato factual. Nenhum KPI faz Graph ou usa dados de outra página durante a requisição.

## 4. Relatórios Operacionais (`/microsoft-365/reports/operational`)

**Contrato:** `OperationalReportsProjection::for(User, ?request_id)`.  
**Componente:** `resources/js/pages/modules/reports-operational.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| KPIs iniciais | Usuários ativos D30, e-mails enviados, participações Teams, armazenamento utilizado, sites ativos e dispositivos gerenciados | Publicações `license_usage_publications` do sync de Licenciamento; usuários ativos reutilizam exatamente o agregado D30 dos Executivos. Dispositivos usam snapshots Intune publicados do último ciclo da fonte. | Available: `OperationalKpiCard`, com zero factual preservado. Sem publicação/restrito: `DataAvailabilityPanel`; região nunca é ocultada. |
| Usuários ativos por serviço | `telemetry.serviceUsage[]` | Publicações D30 `active_users` por workload de Services User Counts. Workloads não são somados, pois representam populações sobrepostas. | `ChartPanel bar`; sem publicação, `DataAvailabilityPanel visual="bars"`. |
| Armazenamento por serviço | `telemetry.storageByService[]` em MB | Último agregado `All` de SharePoint e OneDrive, convertido bytes→MB pelo sincronizador antes de publicar. | `ChartPanel donut`; não persiste/exibe bytes. Sem ambas as publicações, `DataAvailabilityPanel visual="donut"`. |
| Tendência de usuários ativos | `telemetry.trend[]` | Série Office 365 de Active User Counts D180, append-only por `report_date` e `report_updated_at`. | Só materializa `ChartPanel line` após duas atualizações comparáveis; antes, `DataAvailabilityPanel visual="line"`. |
| Conformidade de dispositivos | `telemetry.compliance[]`, `complianceState`, `complianceReason` | Mesmo ciclo Intune publicado dos dispositivos: `compliant` versus não conforme/desconhecido. | `ChartPanel donut`; estado restrito é preservado. Falta de snapshot é indisponibilidade, não zero; zero só é válido para publicação `empty_valid` com zero itens lidos e persistidos. |
| Filtro da consulta | Texto livre sobre `template_key` e `format` | Filtra localmente a lista completa de solicitações recebida. | Não altera a fonte ou servidor; sem correspondência mantém a tabela com vazio factual. |
| Tabela Consulta | `data.requests[]`: `id`, `template_key`, `format`, `state`, `partial`, `accepted_at`, `report_period` | `report_requests` da tenant/conexão, manifesto carregado, ordenados por `accepted_at` desc. | `OperationalTable`; não é paginada. O clique navega com `request_id` e preserva scroll. |
| Detalhe de solicitação | `data.selected`: resumo humano de template, período, formato, estado e parcialidade | Solicitação selecionada deve pertencer à tenant/conexão; o manifesto permanece congelado e sanitizado no servidor. | Sem seleção, `DataAvailabilityPanel`; com seleção, `InlineDetailPanel`. A UI não lista `sources[]`, cobertura ou frescor técnico. |
| Download único | ID e formato da seleção; resposta de `reports.requests.download` | `ReportExportService` usa o manifesto aceito e gera arquivo CSV/XLSX; requisição deve estar `preflight_passed` para habilitar. | Fetch valida content-disposition/content-type; sucesso vira “Entrega concluída”; falha preserva painel “Entrega indisponível”. |
| Metodologia | `data.methodology.body` | Texto fixo que declara a fotografia local aceita. | Sempre visível. |

**Lacunas factuais:** atividade recente genérica, ranking de usuários por armazenamento, insights automáticos e exportação rápida continuam indisponíveis. Não há filtros decorativos de departamento/localidade/licença; a tabela de solicitações permanece não paginada porque o contrato local entrega a coleção completa.

## 5. Segurança e Compliance (`/microsoft-365/reports/security`)

**Contrato:** `SecurityPostureProjection::for(User, controlsPage)`; `controls_page` é validado pelo controller.  
**Componente:** `resources/js/pages/modules/reports-security.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| Postura por fonte / Secure Score | `data.posture`: `availability`, `current`, `maximum`, `reason` | `PublishedSecureScore` resolve `secure_score_publications` compatível, snapshot e `secure_score_source_states`. | Available: único `OperationalKpiCard variant="fraction"` com numerador/denominador factuais `N/X`. Unavailable/restricted: todo o KPI é substituído por `DataAvailabilityPanel`; não há lista técnica de fontes. |
| Controles/evidências | `data.controls.data[]`: `name`, `category`, `score`, `status`; metadados `currentPage`, `lastPage`, `total` | Relação `secure_score_publication_controls` + `secure_score_controls` da publicação selecionada. | `OperationalTable` paginada no servidor, 10 itens, query `controls_page`; navegação Inertia preserva estado/scroll. Sem controles: linha factual. Página menor que 1 ou além da última: 404. |
| Distribuição | `data.distribution.rows[]`: `label`, `value` | Agrupamento por `microsoft_status` sobre **todos** os controles da publicação, não só os dez da página. | Available: `ChartPanel donut`; sem publicação/controles: `DataAvailabilityPanel`. |
| Limitações | `data.limitations.items[]` | Estados Secure Score/configuração filtrados para indisponíveis, restritos ou stale. | Itens unavailable/restricted permanecem em painel; stale é texto factual de limitação, sem rótulo técnico de fonte. |
| Metodologia | `data.methodology.body` | Texto fixo de leitura de fatos publicados da mesma conexão. | Sempre visível. |

**Evidência de paginação:** `ReportsSecurityTest::test_security_controls_are_paginated_without_changing_the_full_distribution` cobre 11 controles: página 1 com 10, página 2 com 1, total 11, distribuição constante e página 3 em 404.

**Lacunas factuais:** não há contratos para cobertura MFA, usuários de risco, incidentes Defender, vulnerabilidades, DLP, auditoria, rótulos de sensibilidade, exposição ou recomendações. As regiões correspondentes permanecem materializadas por `DataAvailabilityPanel`, individualmente, sem números, séries ou listas sintéticas; só o Secure Score e os controles publicados substituem esses painéis.

## 6. Construtor de Relatórios (`/microsoft-365/reports/builder`)

**Contrato inicial:** `ReportsFoundationController::builder` retorna `templates`, `configurations` e capabilities; as ações chamam preflight, aceitar solicitação e prévia.  
**Componente:** `resources/js/pages/modules/reports-builder.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| Etapas | Lista fixa Configurar → Validar → Prévia → Gerar | Não é dado operacional persistido. | `ProcessProgress`, sempre visível. |
| Filtros e seleção | `data.templates[]`; `data.configurations[]` com `id`, `template_id`, `selected_block_ids`, `filters`, `report_period` | Templates do catálogo. Configurações em `report_configurations`, restritas à tenant/conexão/usuário criador no controller. | Selecionar configuração restaura template, blocos e período; trocar template limpa configuração e redefine defaults. |
| Blocos e saída | Seleção local `blockIds`, `reportPeriod`, `format`; blocos do template | Preflight aceita apenas IDs allowlisted, período/formato aprovados e filtros permitidos. `ReportConfigurationService` aplica o mesmo limite ao salvar. | Checkboxes, selects; sem template, `DataAvailabilityPanel`. Não há fórmulas livres. |
| Preflight | `can_accept`, `partial`, `token`, `requirements[]` | `ReportPreflightService` recalcula cada bloco com `ReportBlockProjectionRegistry`; required indisponível bloqueia; degradable só aceita parcial quando a política permite. Token é criptografado, vinculado a ator/tenant/conexão e expira em 10 min. | Mensagem explícita de aceito/parcial/bloqueado; falha não cria solicitação. |
| Prévia | Snapshot JSON sanitizado é carregado internamente, UI mostra template, período, blocos, formato e parcialidade | POST `reports.requests.store` cria request/manifest congelado; GET `reports.requests.preview` devolve prévia sanitizada. | Antes da validação, texto que indica a ação necessária; sem template, painel indisponível. Não exibe JSON bruto. |
| Compartilhar/agendar/fórmulas livres | Capability V1 fixa | Não há workflow ou persistência de distribuição. | Painel `coming_soon`, sempre visível. |

**Lacunas factuais:** a página não expõe controles para salvar/editar configuração, filtros específicos de cada bloco ou pré-visualização renderizada de gráfico/tabela; a prévia atual é um resumo humano do manifesto já aceito.

## 7. Agendamentos e Distribuição (`/microsoft-365/reports/schedule`)

**Contrato:** `ReportsFutureCapabilities::for(User)`.  
**Componente:** `resources/js/pages/modules/reports-schedule.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| Faixa de seis KPIs | `data.summary`: `availability: coming_soon`, `reason` | Não há agenda, execução, entrega ou download persistidos na V1. | Cada slot — agendamentos ativos, execuções no mês, relatórios enviados, falhas, próximas execuções e downloads — é um `DataAvailabilityPanel coming_soon`, sem valor ou data inventados. |
| Próximas execuções e recorrência | `data.upcoming_executions`, `data.recurrence` | Capability estática; não há job, agenda ou recorrência persistidos. | Próximas execuções permanece em painel; `ProcessProgress` mostra somente as etapas futuras pending e sua limitação humana. |
| Execuções, distribuição e modelos | `data.recent_executions`, `data.recent_distribution`, `data.templates` | Não há publicação de execução, entrega ou modelo de agenda. | Três regiões independentes `DataAvailabilityPanel coming_soon`, em `4/4/4` no desktop; nenhuma tabela, gráfico ou destinatário fictício. |
| Canal | `data.channel`: coming_soon + reason | E-mail, Teams e link compartilhável não habilitados. | Painel de indisponibilidade, visível na faixa de distribuição. |
| Segurança/retenção | `data.security_retention.body` | Texto fixo: nenhum destinatário, arquivo, canal ou retenção de distribuição persistido. | Sempre visível. |

**Lacunas factuais:** não há lista/detalhe de agenda, configuração de periodicidade, destinatários, canais reais, histórico de entrega ou métricas de distribuição. A página é uma declaração explícita de capacidade futura, não uma agenda vazia que possa ser interpretada como erro de dados.

## 8. Histórico e Auditoria (`/microsoft-365/reports/history`)

**Contrato:** `ReportHistoryService::for(User, ?request_id)`, disponível somente para administrador de customer (`mayManage`).  
**Componente:** `resources/js/pages/modules/reports-history.tsx`.

| Região | Dado/payload | Persistência e regra | Estado / interação |
| --- | --- | --- | --- |
| KPIs | `data.kpis.requests`, `completed`, `failed`, `events` | Contagens de `report_requests` por estado e `report_audit_events` da tenant/conexão. | Quatro `OperationalKpiCard` sempre renderizados; zero é factual e mostrado como zero. |
| Filtro | Texto em template, formato e estado das linhas da página | Filtra localmente somente `data.requests` da página atual. | Sem resultado, `OperationalTable` preserva linha factual. |
| Tabela Histórico | `data.requests[]`: id, template, versão, formato, estado, parcial, accepted/completed; `pagination` | `report_requests` com manifesto, ordenadas por accepted_at desc, `paginate(50)`. | `OperationalTable.pagination` com total/current/last; navegação Inertia `page` preserva request selecionada e scroll. |
| Detalhe | Solicitação + manifesto (`id`, hash, overall/coverage/frescor/sources no payload), artifact e events | Manifesto congelado, `report_artifacts` e `report_audit_events` associados à mesma tenant/conexão. Eventos são filtrados para a solicitação/artefato coerentes. | Sem seleção, `DataAvailabilityPanel`; com seleção, `InlineDetailPanel` exibe hash, artefato efêmero e eventos. UI não mostra as fontes/proveniência. |
| Linha do tempo/metodologia | `data.selected.events[]` | `event_type`, `occurred_at`; não inclui metadados brutos. | Se seleção sem eventos, texto “Nenhum evento”; se nenhuma seleção, solicita selecionar uma. |
| Evento sem evidência | `data.event_without_evidence` | Capability declarada: eventos locais não trazem evidência externa/payload bruto. | `DataAvailabilityPanel unavailable`, sempre renderizado. |

**Segurança verificável:** `ReportsHistoryTest` confirma não expor `source_record_id_text` nem `metadata` de evento ao browser, rejeitar member e manter histórico local mesmo após desconexão.  
**Lacunas factuais:** não há filtros de servidor, timeline especializada, exportação do histórico ou indicadores por período além das quatro contagens agregadas.

## Lacunas consolidadas entre referência e implementação já existente

Estas são constatações, não pedidos de mudança:

1. A referência do sponsor contém uma grade mais ampla de KPIs e gráficos. O `ui-blueprint.md` formaliza suas regiões em Executivos, Operacionais, Segurança e Agendamentos. Os contratos atuais cobrem o subconjunto com fatos publicados: licenciamento agregado, telemetria operacional de Graph Reports, snapshots Intune, Secure Score, controles, catálogo/manifestações e auditoria local.
2. Na aba Executivos, Secure Score, Usuários ativos M365 D30 e Licenças atribuídas possuem publicação factual da conexão atual. Health Score, economia estimada e incidentes continuam indisponíveis por não terem fato publicado aprovado.
3. Todas as regiões formalizadas permanecem visíveis por `DataAvailabilityPanel` até terem publicação compatível. Vazio factual é reservado às consultas que retornam zero registros válidos. Isso inclui as novas regiões de Operacionais, Segurança e Agendamentos, sem criar KPI, tabela, gráfico ou ação sintética.
4. Os gráficos factuais materializados incluem o donut de distribuição de controles em Segurança e, em Operacionais, barras de usuários ativos por serviço, donuts de armazenamento/conformidade e linha de usuários ativos quando há duas atualizações D180 comparáveis. Secure Score é uma fração textual, não gauge.
5. A falta de um valor publicado não autoriza substituir o dado por 0: isso somente ocorre quando a publicação realmente contém zero, como demonstrado por `ReportsDashboardTest` para licenças atribuídas e adoção.

## Referências de validação existentes

| Tema | Testes/símbolos relevantes |
| --- | --- |
| Dashboard, valores zero, geração atual e ausência de provider I/O | `tests/Feature/ReportsDashboardTest.php`; `ReportDashboardData`. |
| Catálogo, quatro disponibilidades, requisitos e preflight | `ReportsCatalogTest`, `ReportsPreflightWorkflowTest`, `ReportsBlockProjectionRegistryTest`, `ReportCatalog`, `ReportPreflightService`. |
| Allowlist, configurações e tokens | `ReportsConfigurationTest`, `ReportsPreflightTokenTest`, `ReportConfigurationService`. |
| Prévia/artefatos sanitizados e entrega | `ReportsPreviewHttpTest`, `ReportsExportTest`, `ReportsSourcePrunedIntegrationTest`, `ReportProjectionPolicy`. |
| Segurança, Secure Score e paginação | `ReportsSecurityTest`, `SecurityPostureProjection`. |
| Operacionais e erro de entrega | `ReportsOperationalPageTest`, `OperationalReportsProjection`. |
| Histórico, autorização e sanitização | `ReportsHistoryTest`, `ReportHistoryService`. |
| Sem acesso a provedor na leitura do módulo | `ReportsCoreNoProviderIoTest`, `ReportsFullNoProviderIoTest`. |
| Tenancy, RLS, retenção e rotas | `ReportsAuthorizationHttpIntegrationTest`, `ReportsRlsTest`, `ReportsRetentionTest`, `ReportsRoutesTest`. |
