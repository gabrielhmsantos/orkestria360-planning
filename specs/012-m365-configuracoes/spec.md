# Feature Specification: Microsoft 365 / Configurações

**Feature Branch**: `feat/012-m365-configuracoes`  
**Created**: 2026-08-25  
**Status**: Draft  
**Input**: Discovery `discovery/microsoft-365/v2/configuracoes/`.

**Matriz inicial**: [configuration-matrix.md](configuration-matrix.md).

## Scope and principles

Centro unificado, exclusivo de leitura, para administradores e membros autorizados consultarem a postura de configurações Microsoft 365 do seu customer. Abrange as oito superfícies da representação estrutural; telas, filtros, gráficos, paginação, exportações e relatórios leem somente projeções locais publicadas. Não cria, altera, aprova, executa, reverte ou agenda configurações Microsoft 365.

Exceção local: `customer admin` pode marcar/desmarcar, nas projeções locais, políticas Conditional Access e conectores Exchange como críticos. A classificação é tenant-scoped, persistente e auditada no Orkestria; não altera Microsoft 365 e habilita as comparações críticas da matriz.

Ausência de licença, permissão, conector, workload, fonte, snapshot ou resposta comparável é `unavailable`/`restricted`, com disponibilidade, cobertura, frescor, razão e resultado da tentativa; nunca vira zero, `false`, conforme, divergente ou risco inventado. Falha, restrição ou parcialidade preserva a última publicação válida como histórica/desatualizada. Fatos observados no tenant permanecem distintos de contratos apenas documentados no Microsoft Learn. Razões, telemetria, evidência e qualquer saída local usam a classificação segura da boundary de integração; nunca carregam exceção, payload, URL ou credencial brutos do provider.

## Clarifications

### Session 2026-08-25

- Q: Qual deve ser o estado inicial da classificação local de criticidade para políticas CA e conectores Exchange coletados? → A: Todos iniciam não críticos; somente marcação explícita do customer admin torna as linhas dependentes elegíveis.
- Q: A marcação ou desmarcação de criticidade local deve produzir qual efeito no score histórico? → A: Aplica-se a partir da alteração, sem recalcular publicações ou scores históricos; a mudança é auditada.
- Q: Qual formato de exportação deve ser entregue nesta primeira versão? → A: CSV UTF-8, respeitando filtros e incluindo fonte, disponibilidade, cobertura e datas aplicáveis.
- Q: Quem pode alterar a retenção de 365 dias para histórico e seis meses-calendário para evidência técnica? → A: Ninguém pela interface; são prazos fixos nesta versão.
- Q: Como o módulo deve tratar uma fonte que permaneça indisponível após a última publicação válida expirar em frescor? → A: Exibir o último fato como stale, com instante, razão e cobertura; ele não é fato atual comparável para score ou trava.
- Q: Quando uma classificação local de criticidade for alterada por dois customer admins quase ao mesmo tempo, qual alteração deve prevalecer? → A: Concorrência otimista; rejeitar a gravação desatualizada e exigir recarga, sem last write wins.
- Q: Quando uma política CA ou conector marcado como crítico deixar de aparecer em uma coleta publicada, como sua classificação local deve ser tratada? → A: Manter histórica, mas inativa/não elegível somente após coleta canônica válida e conclusiva; reativar se a mesma referência voltar.
- Q: Como a matriz deve definir que uma publicação ainda está fresca para o score e as telas? → A: Usar cadência/prazo por fonte do contrato coordenado; prazo ausente torna freshness indeterminada, sem mudar disponibilidade; somente fato fresco é comparável.

## User Scenarios & Testing *(mandatory)*

As histórias referenciam a [representação estrutural](../../discovery/microsoft-365/v2/configuracoes/representacao-estrutural-das-telas.md); os grupos de cards são exatamente os blocos canônicos nela listados para cada superfície.

### User Story 1 - Dashboard Executivo (Priority: P1)

**Why this priority**: consolida a evidência que orienta todas as investigações.

Como administrador, quero priorizar investigação por score, cobertura, risco, alterações e drift.

**Independent Test**: Com publicação local e fonte indisponível, o Dashboard Executivo exibe score/cobertura/razão sem chamada externa.

**Cards implementados**: `Microsoft 365 Configuration Score — score`; `Configurações Analisadas — KPI`; `Configurações Conformes — KPI`; `Configurações Divergentes — KPI`; `Configurações Críticas — KPI`; `Workloads com Drift — KPI/lista`; `Alterações Pendentes — lista de estados`; `Alterações Executadas (30 dias) — donut`; `Configurações por Risco — donut`; `Baselines Ativos — tabela curta`; `Configurações sem Coleta — lista`; `Conformidade por Workload — barras empilhadas`; `Evolução do Configuration Score — linha`; `Top 10 Configurações Críticas — tabela`; `Alterações Observadas Recentes — tabela`; `Workloads sem Coleta — tabela curta`; `Ações Recomendadas — lista priorizada`.

**Acceptance Scenarios**:

1. **Given** linha elegível sem leitura comparável, **When** o score é exibido, **Then** ela é `unavailable`, recebe zero pontos e não é conforme/divergente.
2. **Given** histórico ou regra ausente, **When** o bloco é aberto, **Then** mostra `unavailable`, sem exemplo ou recomendação inventada.
3. **Given** não existe fonte local canônica de change-management, **When** `Alterações Pendentes` ou `Alterações Executadas (30 dias)` é exibido, **Then** ambos ficam `unavailable` com razão/condição habilitadora; eventos/diffs/drifts observados não são reinterpretados como estados de execução.

### User Story 2 - Configurações do Tenant (Priority: P2)

**Why this priority**: fornece fatos transversais para as demais superfícies.

Como administrador, quero consultar organização, branding, domínios, serviços, sincronização e configuração transversal observada.

**Independent Test**: Projeções publicadas mostram fatos de organização/domínios e mantêm contatos ou campos sem fonte como restritos/indisponíveis.

**Cards implementados**: todos os cards da seção `02. Configurações do Tenant`: `Informações da Organização — detalhe em duas colunas`, `Identidade Visual do Tenant — mídia e metadados`, `Domínios Verificados — tabela`, `Contatos da Organização — cartões`, `Serviços Habilitados no Tenant — grade`, `Sincronização e Diretórios — detalhe`, `Configurações Gerais do Tenant — tabela`.

**Acceptance Scenario**: **Given** fonte sem campo homologado, **When** a tela é consultada, **Then** a condição e as datas de fonte/coleta/alteração observada são distintas.

### User Story 3 - Identidade e Acesso (Priority: P2)

**Why this priority**: sustenta MFA e políticas críticas.

Como administrador, quero investigar políticas, MFA, funções e sinais Entra sem confundir registro de MFA com imposição de MFA.

**Independent Test**: Fontes canônicas de identidade/MFA e localizações publicadas exibem cobertura e somente `administrador AND isMfaRegistered=false` ativa a trava.

**Cards implementados**: `Políticas de Acesso Condicional — KPI`; `Localizações Nomeadas — KPI`; `Métodos de Autenticação — KPI`; `Usuários com MFA — KPI`; `Funções Administrativas — KPI`; `Usuários Externos (B2B) — KPI`; `Políticas de Acesso Condicional — tabela`; `Métodos de Autenticação — donut`; `Proteção por Senha — detalhe`; `Funções Administrativas — donut`; `Atribuições PIM — métricas`; `Usuários e Acesso — barras`; `Aplicativos Empresariais — métricas/lista`; `Eventos Recentes de Identidade — tabela`; `Recomendações de Investigação — lista`.

**Acceptance Scenario**: **Given** CA vazia válida ou não comparável, **When** é exibida, **Then** preserva evidência/cobertura sem inferir ausência de política ou risco.

### User Story 4 - Colaboração e Compartilhamento (Priority: P2)

**Why this priority**: cobre controles de compartilhamento e autenticação legada.

Como administrador, quero analisar compartilhamento, convidados, grupos e políticas SharePoint/OneDrive/Teams sem inferência.

**Independent Test**: `sharepointSettings` publicado mostra fatos suportados; somente `isLegacyAuthProtocolsEnabled=true` aciona autenticação legada.

**Cards implementados**: `Nível de Compartilhamento — KPI`; `Links Anônimos — KPI`; `Domínios Permitidos — KPI`; `Domínios Bloqueados — KPI`; `Expiração de Links — KPI`; `Expiração de Convidados — KPI`; `Sites Criados por Usuários — KPI`; `Configurações de Compartilhamento Externo — lista`; `Tipos de Link Padrão — donut`; `Atividade de Compartilhamento (30 dias) — linha`; `Acesso de Convidados — donut`; `Domínios Permitidos — tabela`; `Políticas de Grupos e Sites — lista de pares`; `Configurações do Microsoft Teams — lista de pares`; `Configurações do OneDrive — lista de pares`; `Alterações Observadas de Compartilhamento — tabela`; `Recomendações de Investigação — lista priorizada`.

**Acceptance Scenario**: **Given** link anônimo permitido sem prova de padrão `Edit`, **When** a trava é avaliada, **Then** fica `unavailable` e não bloqueia Excelente.

### User Story 5 - Segurança e Compliance (Priority: P2)

**Why this priority**: torna explícitas as lacunas de controles sensíveis.

Como administrador, quero ver controles, dados, auditoria e prontidão de fontes, distinguindo evidência tenant de contrato Microsoft Learn.

**Independent Test**: Sem snapshot Exchange acessível, controles TCM ficam indisponíveis com pré-requisito/razão, sem afirmar estado inseguro.

**Cards implementados**: `Postura de Segurança — KPI`; `Configurações Analisadas — KPI`; `Configurações Conformes — KPI`; `Configurações Divergentes — KPI`; `Configurações Críticas — KPI`; `DLP - Incidentes (30 dias) — KPI`; `Proteções do Microsoft Defender — tabela`; `Conformidade e Proteção de Dados — donut`; `DLP - Principais Incidentes (30 dias) — tabela`; `Auditoria e Monitoramento — métricas`; `Rótulos de Sensibilidade — tabela`; `Políticas de Retenção — donut`; `Baselines de Segurança — tabela`; `Configurações Críticas Detectadas — tabela`; `Evolução da Postura de Segurança — linha`; `Workloads e Cobertura — barras horizontais`; `Recomendações de Investigação — lista`.

**Acceptance Scenario**: **Given** TCM sem licença, role ou snapshot, **When** antiphishing/TLS é exibido, **Then** é `unavailable`, não `Enabled=false`, `RequireTls=false` nem trava.

### User Story 6 - Configurações por Serviço (Priority: P1)

**Why this priority**: é o catálogo de investigação e origem de comparações.

Como administrador, quero filtrar, paginar e detalhar a configuração por workload com valor, baseline, risco, fonte, permissão e cobertura.

**Independent Test**: Busca/filtros/paginação/detalhe e exportação usam a mesma população publicada.

**Cards implementados**: `Microsoft Entra ID — cartão seletor`; `Exchange Online — cartão seletor`; `SharePoint Online — cartão seletor`; `OneDrive for Business — cartão seletor`; `Microsoft Teams — cartão seletor`; `Intune — cartão seletor`; `Microsoft Defender — cartão seletor`; `Microsoft Purview — cartão seletor`; `Categorias — filtros`; `Configurações do Serviço — tabela`; `Detalhes da Configuração — painel`; `Conformidade por Serviço — donut`; `Serviços com Maior Número de Divergências — barras horizontais`; `Serviços com Mais Configurações Críticas — barras horizontais`; `Recomendações de Investigação — lista de riscos`.

**Acceptance Scenarios**:

1. **Given** fonte Intune beta não homologada estável, **When** consultada, **Then** é sinalizada beta e não gera linha disponível nesta versão.
2. **Given** linha sem homologação integral, **When** o catálogo é usado, **Then** ela não participa de baseline, conformidade, cobertura ou score.

### User Story 7 - Baselines e Conformidade (Priority: P3)

**Why this priority**: converte fatos em conformidade rastreável.

Como administrador, quero localizar divergências comparando fatos observados e baselines publicados.

**Independent Test**: Com valor e baseline comparáveis há resultado rastreável; sem eles há indisponibilidade com causa.

**Cards implementados**: `Baselines Ativos — KPI`; `Configurações Cobertas — KPI`; `Divergências Detectadas — KPI`; `Baselines Ativos — tabela`; `Cobertura por Serviço (Baseline Ativo) — donut`; `Divergências por Nível de Risco — barras horizontais`; `Configurações Divergentes — tabela`.

### User Story 8 - Histórico e Auditoria (Priority: P3)

**Why this priority**: permite investigação temporal e preserva evidências.

Como administrador, quero investigar alterações, evidências e drifts por workload, com detalhes sensíveis restritos.

**Independent Test**: Eventos locais filtrados/paginados mantêm tabelas, gráficos, detalhe e exportação consistentes sem Graph.

**Cards implementados**: `Alterações Observadas — KPI`; `Alterações Externas (Drift) — KPI`; `Configurações Críticas Alteradas — KPI`; `Histórico de Alterações — tabela`; `Origem das Alterações — donut`; `Detalhes da Alteração Selecionada — detalhe`; `Valores da Configuração — diff`; `Informações Técnicas — detalhe`; `Alterações por Serviço — barras horizontais`; `Alterações por Nível de Risco — donut`; `Evidências e Logs — lista`; `Drifts Relacionados — lista de estado`.

**Acceptance Scenario**: **Given** snapshots diferem sem evento correlato, **When** apresentado, **Then** é drift observado, não aprovação, investigação concluída ou trava.

### Edge Cases

- Resposta OData vazia válida, falha, restrição e ausência de capacidade são estados distintos.
- Cursores, paginação, retries, throttling e reprocessamentos não podem duplicar fatos/eventos nem avançar posição antes de publicação segura.
- Dados de referência visual, DNS externo e identificadores não são dados de domínio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Fornecer as oito superfícies e todos os cards canônicos da representação, em navegação somente leitura.
- **FR-002**: Manter matriz canônica incremental/versionada; uma linha só é homologada com chave, fonte/versão, escopo, valor, baseline, risco, regra de comparação, permissões e semântica de indisponibilidade definidos.
- **FR-002a**: Publicar a matriz, seus nove domínios/pesos e o perfil global inicial por migration incremental e idempotente, de forma que `php artisan migrate` em banco existente deixe a feature utilizável sem depender de `db:seed`.
- **FR-003**: Priorizar Graph `v1.0`, TCM oficialmente suportado, API especializada e PowerShell somente para lacuna comprovada/homologada; TCM não é baseline ou risco automático.
- **FR-004**: Coletar/normalizar fontes homologadas no sync coordenado por `{tenant_id, microsoft_connection_id}`, sem fallback ou transferência entre customers. Todo collector resolve um `ConfigurationSourceContract` homologado/allowlisted, versionado e separado da matriz, que define provider/audience, API/operação, permissões, cadência/freshness, coverage, falha e paginação quando aplicável. `source_key@contract_version`/checksum é imutável após referência histórica: alteração semântica cria nova versão e a anterior permanece interpretável. Fatos observacionais de cards usam `source + fact_key + subject_key` determinísticos e podem não ter MatrixLine; somente o vínculo explícito de linha para `source contract + fact` homologado permite comparação, baseline e score.
- **FR-005**: Manter chamadas externas fora da transação de promoção. Criar manifesto de publicação `staging`, invisível às telas e sem `is_current`, antes dos derivados que o referenciam; usar operações curtas para staging e uma promoção atômica, idempotente e isolada por tenant para revalidar, superseder a current anterior e publicar o manifesto seguro.
- **FR-006**: Fontes independentes podem publicar resultado `partial` seguro; preservar integralmente a publicação anterior somente quando a nova geração não puder ser publicada com segurança, sempre expondo disponibilidade, cobertura, frescor, razão e resultado distintos.
- **FR-007**: Usar um vocabulário temporal único em estado, detalhe, histórico, CSV e stale: `sourceLastModifiedAt` é somente o instante de modificação informado pela fonte; `lastObservedChangeAt` é somente a última mudança factual observada entre snapshots/coletas; e `lastCollectedAt` é a coleta/tentativa atual. `publishedAt` é metadata de publication e não substitui nenhum dos três. Coleta sem mudança não atualiza `lastObservedChangeAt`; ausência de timestamp da fonte não iguala `sourceLastModifiedAt` a `lastCollectedAt`.
- **FR-007a**: Determinar freshness exclusivamente pela cadência e prazo publicados para cada fonte no sync coordenado. Sem contrato de freshness, publicar freshness `unavailable`/indeterminada sem alterar disponibilidade; fato sem freshness atual não é comparável para score ou trava.
- **FR-008**: Comparar somente linha homologada, fato observacional vinculado explicitamente a essa linha, valor atual comparável e baseline materializado; igualdade é conforme e desigualdade é divergência. Não criar MatrixLine artificial para persistir dado de card.
- **FR-009**: Usar snapshots para mudança e drift local, ancorados em `source contract + fact_key + subject_key` e fatos/snapshots antes/depois; MatrixLine é opcional para enriquecer com comparação, risco, baseline ou trava. Alteração factual sem MatrixLine permanece investigável sem esses atributos inventados; drift não é aprovação, investigação ou trava nesta versão.
- **FR-010**: Calcular Configuration Score por domínio como conformes/elegíveis, com nove pesos aprovados; linha elegível sem leitura atual comparável — inclusive com último valor `stale` visível — é `unavailable`, entra no denominador, soma zero, reduz cobertura, não é conforme/divergente e não ativa trava.
- **FR-011**: Aplicar faixas Crítico 0–59, Atenção 60–74, Bom 75–89 e Excelente 90–100; trava conserva nota e rebaixa só Excelente para Bom.
- **FR-012**: Ativar somente por fato homologado: administrador sem MFA; política crítica desabilitada; autenticação legada permitida; link anônimo global com edição; antiphishing desabilitado; acesso irrestrito por dispositivos não gerenciados; conector Exchange crítico sem TLS. `unavailable` pode receber zero quando elegível, mas nunca é insegurança ou trava.
- **FR-012a**: Permitir ao customer admin classificar localmente políticas CA e conectores Exchange como críticos, com persistência tenant-scoped, auditoria e sem escrita Microsoft 365; a classificação habilita linhas/baselines críticos da matriz.
- **FR-012b**: Proteger classificação crítica local por concorrência otimista; alteração baseada em versão desatualizada é rejeitada e requer recarga. Só inativar uma classificação após ausência em coleta canônica válida e conclusiva; falha, restrição, snapshot inacessível ou publicação parcial inconclusiva não equivalem à ausência. A mesma referência reativa a classificação histórica; nova referência começa não crítica.
- **FR-013**: Publicar prontidão TCM por customer e manter recursos Exchange indisponíveis até todos pré-requisitos específicos, licença e snapshot acessível; não criar snapshots. Políticas Intune v1.0 podem ser normalizadas pelo contrato exemplar oficial de `deviceCompliancePolicy`, mas não acionam a trava de acesso não gerenciado sem fatos homologados de atribuição e controle de acesso.
- **FR-014**: Reutilizar exclusivamente `CanonicalAuditEventsCollector`, suas posições/watermarks canônicos, batches e `PublishedEventQuery`; Configurações não cria collector, watermark ou segunda ingestão de directory audits. O histórico correlaciona evento canônico já publicado a fact/change event somente por evidência suficiente (`source contract`, `fact_key`, `subject_key`, `external_reference`, identidade canônica do evento e metadata de correlação), preserva ordenação determinística, paginação completa, identidade/deduplicação canônica e replay idempotente. Falha antes de persistência/publicação segura não avança posição/watermark; ausência de evidência conserva mudança factual sem correlação inventada.
- **FR-015**: Fazer filtros, busca, paginação, gráficos, totais, detalhe, exportação e relatório consumirem a mesma população local e os mesmos metadados declarados.
- **FR-015a**: Exportar na primeira versão somente CSV UTF-8, preservando filtros e incluindo fonte, disponibilidade, cobertura e datas aplicáveis.
- **FR-016**: `SyncExceptionLogger` e as exceções/classificações seguras já usadas na boundary Microsoft 365 são o owner para transformar falha externa em categoria/razão segura antes de source state, readiness, telemetry ou technical evidence. Nenhuma projeção, PageData, CSV, Inertia/UI, erro de mutation ou log da feature pode reexpor token, secret, header Authorization, credential/OAuth state, provider exception/stack trace, URL/query sensível, payload técnico bruto ou identificador tenant/provider/mailbox/site/device não autorizado pelo contrato. Identificadores funcionais explicitamente aprovados, como `externalReference` necessário à classificação, permanecem permitidos e redigidos conforme seu contrato.
- **FR-017**: Validar links de continuação, aplicar retry/throttling limitado e registrar telemetria factual de páginas, itens, persistência, cobertura, tentativas e falhas. O transporte Graph usa versões fechadas (`v1.0` e `beta`), conserva a versão da instância em URL/paginação e nunca aceita versão ou URL arbitrária.
- **FR-018**: Reter enquanto o customer existir o estado current e a classificação crítica local. Reter por 365 dias a cadeia histórica Microsoft — publication, generation, fatos observacionais, source states/readiness históricos, materializações de baseline, comparisons, domain scores, snapshots, alterações/drift e auditoria derivada — e por seis meses-calendário a telemetria/evidência técnica. Matriz/perfis globais permanecem enquanto interpretarem publicação preservada. Os prazos são fixos nesta versão e não são alteráveis pela interface. Disconnect não apaga histórico; evidência expirada aparece como `retention_expired`, sem inventar ausência. O modo explícito `app:prune-microsoft365 <tenant> all` remove integralmente o data-plane Microsoft coletado/derivado, inclusive current e materializações reconstruíveis, e preserva classificações críticas, seus audits e demais configurações cuja autoridade é Orkestria/customer.
- **FR-019**: Excluir escrita Microsoft 365, DNS, criação TCM, mocks de domínio, criação/aprovação/execução/rollback de mudanças, customização/ativação/aprovação de baseline e recomendações determinísticas sem `recommendation_rule` homologada. Cards de change-management e recomendação sem fonte/regra canônica são `unavailable`, com razão e condição habilitadora.

### Key Entities

- **Matriz canônica**: linhas homologadas que definem elegibilidade, baseline, comparação, risco e apresentação; cada uma referencia um source contract/fato, mas não é o catálogo de toda leitura.
- **Source contract homologado**: registry allowlisted/versionado de operação de coleta; atende fatos observacionais com ou sem matriz e fornece o contrato de freshness.
- **Fato observacional publicado**: fato normalizado por tenant/conexão/geração/fonte/chave factual/sujeito, valor, hash e metadados de fonte; pode não participar da matriz.
- **Perfil de baseline e comparação**: perfil global versionado com itens por linha; materialização tenant-scoped interna e resultado rastreável de conformidade, sem jornada de customização nesta versão.
- **Snapshot/publicação**: geração local coerente para leitura, preservação e drift.
- **Fonte/estado de fonte**: contrato e resultado por customer, incluindo cobertura, frescor e telemetria.
- **Prontidão TCM**: pré-requisitos por customer sem afirmar estado Exchange.
- **Evento/drift**: mudança observada, evidência, correlação e diferença sem evento correlato.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das oito superfícies e cards canônicos são acessíveis com dados publicados, indisponíveis ou restritos, sem chamada externa na navegação.
- **SC-002**: Em teste com dois customers, 100% das consultas, exports, snapshots, eventos e estados retornam somente a organização ativa.
- **SC-003**: 100% dos cenários de score reproduzem fórmula, cobertura, faixas e travas aprovadas.
- **SC-004**: 100% dos cenários de falha/restrição/parcialidade preservam publicação válida e mostram condição atual sem inventar fatos.
- **SC-005**: 100% dos testes de replay não criam fatos, snapshots ou eventos duplicados.
- **SC-006**: 100% dos filtros/paginações testados mantêm tabela, indicadores, gráfico, detalhe e exportação na mesma população.

## Assumptions

- O discovery e `AGENTS.md` atuais prevalecem sobre PRD/requisitos históricos de mocks.
- A primeira matriz é incremental e só publica linhas integralmente homologadas.
- Projeções canônicas e ciclo coordenado existentes são estendidos, não duplicados.
- TCM beta depende de estabilidade, consentimento, licença e snapshot; contrato documentado não prova fato tenant.
- A fronteira aprovada é somente platform admin/customer admin/member; não há RBAC adicional.
