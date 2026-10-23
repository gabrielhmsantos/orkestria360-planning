# UI Blueprint — OneDrive

## Metadata

- **Blueprint status:** `conceptual`

O handoff visual com fixtures foi reconciliado em 14/09/2026 e suas oito abas
continuam homologadas como `frontend_done`. Os adendos de 14 e 15/10/2026
documentam os bindings de apresentação necessários às decisões do backend. Esses bindings
novos ainda não têm cenários reconciliados no frontend; o status deste handoff
para a fonte real é `conceptual`.
- **Discovery path:** `discovery/microsoft-365/v2/onedrive`
- **Generated/updated:** `2026-10-15` — normalizações técnicas e C6–C9 aceitas,
  com adendo de 14/10 e homologação visual de setembro preservados como histórico.

## Blueprint status

Todas as oito superfícies são `data-backed`: seus fatos esperados dependem de
fontes e projeções publicadas. Essa classificação não afirma que o backend já
exista. A fixture sintética vigente sustenta a homologação visual anterior e
serve de referência semântica para o Discovery; não define payloads externos,
respostas de controllers nem um endpoint único para o módulo.

As decisões de apresentação do [adendo para a fonte real](#adendo-de-apresentação-para-a-fonte-real--14102026)
prevalecem sobre bindings/copy de setembro nos pontos explicitamente listados.
A fixture e o frontend ainda não foram alterados para demonstrar esses novos
bindings. Por isso as oito superfícies permanecem `conceptual` neste handoff de
integração, sem reabrir a homologação `frontend_done` anterior. A prontidão do
Discovery backend é avaliada separadamente em [backend-coverage-review.md](backend-coverage-review.md).

O [fechamento técnico desta rodada](#fechamento-técnico-de-bindings--a2a5a7a8)
consome as semânticas sustentadas sem promover lacunas de fonte a fatos de UI.
C1 e C2 foram aceitas; A3 foi resolvida no recorte de saúde diária reportada e
inventários separados. Isso não afirma viabilização de estados instantâneos
ou de uma ponte Health–Intune. Os novos bindings permanecem conceituais para
a próxima entrega, sem bloquear o Discovery backend por ausência de fixture nova.
Na rodada complementar B1–B3, C3/C4/C5 foram aceitas e B3 teve seus quatro
períodos oficiais cobertos no mesmo contrato Graph. Não resta decisão pendente
desta rodada; os novos cenários/bindings ainda pertencem à próxima entrega.
As normalizações da [convergência de 15/10](#convergência-técnica--15102026)
complementam esse handoff. C6–C9 foram aceitas pelo usuário em 15/10: atividade
de compartilhamento, alertas criados, fim nominal combinado de retenção e
seleção de eventos Alto/Crítico estão documentados para a integração futura,
sem reinterpretar a fixture histórica. Não resta decisão de produto pendente
dessas quatro clarificações; materializar os bindings/cenários segue como
trabalho da próxima entrega.

## Sources

- `README.md`, `expectativas-do-sponsor.md` e os arquivos de produto, design, decisões e contrato de cada superfície neste diretório.
- `Microsoft365_Onedrive.docx` e as imagens `01` a `08` do diretório do sponsor, inventariados em `fontes-e-rastreabilidade.md`.
- Storybook MCP consultado em 2026-09-11 para componentes, props, stories e previews.
- [Defaults e clarificações do backend](backend-defaults-e-clarificacoes.md),
  decisões aceitas Q1–Q4 em 2026-10-14 e Q5 inferida pelo agente por autorização
  do usuário a partir da imagem 03; não foi escolha explícita de opção pelo usuário.
- Revisão das imagens em 2026-10-14: [R1 aceita](backend-defaults-e-clarificacoes.md#r1--pacote-de-retenção-da-imagem06-aceita-a)
  substitui a parte de retenção de conteúdo da Q2; [R2 aceita](backend-defaults-e-clarificacoes.md#r2--baixoinformativo-por-objeto-aceita-a)
  define seus residuais de risco por objeto; [R3 aceita](backend-defaults-e-clarificacoes.md#r3--unidade-da-evolução-de-sincronização-aceita-a)
  corrige a série azul para clientes OneDrive observados; [R4 aceita](backend-defaults-e-clarificacoes.md#r4--versões-e-expiração-acrescentada-aceita-a)
  fixa a referência manual de 500 versões sem prazo em dias; [R5 aceita](backend-defaults-e-clarificacoes.md#r5--arquivos-sob-retenção-e-cópias-preservadas-aceita-a)
  define arquivos atuais comprovadamente sob retenção e seu volume lógico.
  As cinco decisões da revisão estão resolvidas; os novos bindings ainda
  precisam ser materializados na próxima entrega frontend.
- Contratos e mappings refinados em [Atividade — A2](atividade-e-sincronizacao/fontes-e-viabilidade.md#a2--itens-acessados-e-editados-separados),
  [Auditoria — A5](historico-e-auditoria/fontes-e-viabilidade.md#a5--normalização-canônica-audit-operations-v1),
  [Conteúdo — acesso](arquivos-e-conteudo/fontes-e-viabilidade.md#admissão-por-ação-e-intervalo)
  e [Conteúdo — versões](arquivos-e-conteudo/fontes-e-viabilidade.md#contagem-detector-e-ranges).
  O blueprint consome suas consequências de apresentação; não replica o mapping externo.
- [C1 aceita](backend-defaults-e-clarificacoes.md#c1--partição-do-compartilhamento-aceita-a):
  partição exclusiva de arquivos atuais compartilhados, conforme contrato da aba.
- [C2 aceita](backend-defaults-e-clarificacoes.md#c2--estados-instantâneos-e-correlação-de-dispositivos-aceita-a):
  saúde diária reportada, clientes Health e dispositivos Intune independentes,
  KFM com universo explícito e fator de dispositivos limitado ao inventário Intune.
- [Auditoria — A4](historico-e-auditoria/fontes-e-viabilidade.md#a4--configuração-das-quatro-fontes):
  as quatro fontes mostram configuração local de ingestão, separada de produto,
  política, subscription e cobertura operacional.
- [C3 aceita](backend-defaults-e-clarificacoes.md#c3--volume-do-card-principais-benefícios-aceita-a):
  o volume em Principais Benefícios passa a representar armazenamento utilizado
  canônico de Reports. [C4 aceita](backend-defaults-e-clarificacoes.md#c4--percentual-do-card-principais-benefícios-aceita-a)
  publica clientes com atualização recente e sem erro reportado.
- [C5 aceita](backend-defaults-e-clarificacoes.md#c5--população-do-resumo-de-riscos-aceita-a):
  o Resumo de Riscos conta arquivos atuais únicos classificados, com metadados
  de cobertura e comparação de snapshots compatíveis.
- Normalizações de 15/10 nos contratos de [Contas](contas-e-armazenamento/contratos.md#fronteiras-da-distribuição-de-utilização),
  [previsão](contas-e-armazenamento/contratos.md#horizonte-da-previsão-de-esgotamento)
  e [Conteúdo](arquivos-e-conteudo/contratos.md#fronteiras-das-distribuições-de-tamanho-e-antiguidade):
  fronteiras executáveis e âncoras factuais preservam as composições homologadas.
- Contratos normalizados de [Auditoria](historico-e-auditoria/contratos.md),
  [exposição dos casos](usuarios-desligados-e-retencao/fontes-e-viabilidade.md#exposição-externa-atual-dos-casos--ga3),
  [sincronização reportada](atividade-e-sincronizacao/fontes-e-viabilidade.md#indicador-reports-de-arquivos-sincronizados--agregação-explícita)
  e [inatividade canônica](atividade-e-sincronizacao/fontes-e-viabilidade.md#usuários-sem-atividade--atividade-da-pessoa-ga4),
  liberados na convergência técnica de 15/10. São publicações semânticas locais,
  não payloads Microsoft ligados diretamente à UI.
- [C6 aceita](backend-defaults-e-clarificacoes.md#c6--significado-de-arquivos-compartilhados-aceita-a)
  e [contrato de atividade de compartilhamento](atividade-e-sincronizacao/contratos.md#arquivos-com-atividade-de-compartilhamento--c6-aceita-a):
  arquivos distintos com atividade registrada, metadados próprios e comparação somente D30.
- [C7 aceita](backend-defaults-e-clarificacoes.md#c7--medida-de-alertas-no-card-defender-aceita-a)
  e [contrato de alertas criados](configuracoes-e-seguranca/contratos.md#alertas-criados-em30dias--c7-aceita-a):
  alertas de segurança criados em30dias, sem equivalência a ameaças confirmadas.
- [C8 aceita](backend-defaults-e-clarificacoes.md#c8--unidade-dos-vencimentos-de-retenção-aceita-a)
  e [contrato de fim nominal de retenção](configuracoes-e-seguranca/contratos.md#arquivos-com-fim-nominal-de-retenção--c8-aceita-a):
  arquivos atuais únicos pelo fim combinado finito, de D a D+15 datas UTC
  inclusivas, sem afirmar liberação ou exclusão Microsoft.
- [C9 aceita](backend-defaults-e-clarificacoes.md#c9--inclusão-em-atividades-críticas-aceita-a)
  e [contrato de seleção de atividades críticas](historico-e-auditoria/contratos.md#seleção-de-atividades-críticas--c9-aceita-a):
  até cinco eventos Alto/Crítico na janela factual de24h, priorizados antes
  dos filtros; a interseção posterior não repõe itens removidos.

## Discovery readiness

| Surface | Data classification | Contract | Fixture/mapping | Blueprint para fonte real | Homologação anterior |
| --- | --- | --- | --- | --- | --- |
| Dashboard Executivo | data-backed | contratos atualizados pelo backend | fixture vigente; origens, riscos e cobertura novos ainda sem cenário | conceptual | frontend_done |
| Contas e Armazenamento | data-backed | contratos atualizados pelo backend | fixture vigente; histórico inicial e escopo novos ainda sem cenário | conceptual | frontend_done |
| Arquivos e Conteúdo | data-backed | Q5: detalhe completo, inferência autorizada | fixture vigente; universo/estimativas/candidatos novos ainda sem cenário | conceptual | frontend_done |
| Compartilhamento e Acessos | data-backed | contratos atualizados pelo backend | fixture vigente; exposição atual, risco e cobertura novos ainda sem cenário | conceptual | frontend_done |
| Atividade e Sincronização | data-backed | Q3/R3/C2/C3/C4/C6 e normalizações técnicas definidas | fixture vigente; sharedItemsMetadata, somas reportadas, inatividade e demais bindings novos ainda sem cenário | conceptual | frontend_done |
| Usuários Desligados e Retenção | data-backed | Q1/Q2 e revisão R1 aceitas, sem HR | fixture vigente; origem presumida e regras locais 90/180/730/30 ainda sem cenário | conceptual | frontend_done |
| Configurações e Segurança | data-backed | Q4/R4/R5/C2/C5/C7/C8 e faixas contínuas definidas | fixture vigente; reportedAlerts30d, filesWithNominalRetentionEnd15d, riskSummaryMetadata e demais bindings novos ainda sem cenário | conceptual | frontend_done |
| Histórico e Auditoria | data-backed | Q2 e A4/A5/C9, classificação e ingestão configurada | fixture vigente; criticalActivitiesMetadata, seleção Alto/Crítico, registry local e demais bindings novos ainda sem cenário | conceptual | frontend_done |

## Fixture reconciliation gate

Cada fixture de UI é sintético, determinístico e separado do Simulator. Os CSV/JSON do Simulator são insumo do futuro adapter de projeção, mas não são fixture de UI nem autorizam valores de domínio.

| Surface | Evidência técnica disponível | Fixture/mapping de UI | Cenários representados |
| --- | --- | --- | --- |
| Dashboard Executivo | Reports de contas, atividade e arquivos; dimensões sintéticas aprovadas | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: score de nove dimensões e blocos compostos | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Contas e Armazenamento | Report de contas/arquivos e identidade complementar documentados | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: previsão, distribuições e detalhe | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Arquivos e Conteúdo | Delta, metadados e filhos de drive documentados | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: lixeira, duplicidade, sensibilidade e inatividade | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Compartilhamento e Acessos | Permissões por item documentadas | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: períodos e atenção estruturada | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Atividade e Sincronização | Reports e Data Connect documentados | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: projections D7/D30/D90/D180, `syncTrend`, KFM, Sync Health, Intune e correlação | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Usuários Desligados e Retenção | Usuários excluídos e fontes complementares documentados | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: retenção e exclusão | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Configurações e Segurança | Settings SharePoint e sinais independentes documentados | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: score e postura | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |
| Histórico e Auditoria | Management Activity API documentada | `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`: filtro, detalhe e cobertura | `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale`, `failed` |

`tenant-scenarios.json` é a única fixture canônica: cada linha da matriz acima é
uma projeção da mesma população e do mesmo cenário global, não um tenant por
aba. A base implementa o contrato Orkestria — não o payload Graph. A seção
`Data bindings` de cada superfície nomeia path, tipo, formatter/unidade,
nulabilidade, ausência e transformação visual; a implementação deve criar um
adapter de apresentação tipado para a publicação local delimitada por
responsabilidade. A matriz é evidência da homologação anterior; não comprova
que os cenários novos do adendo já estejam presentes.

## Storybook status

Catálogo disponível. Foram verificados `PageScaffold`, `ModuleHero`, `ModuleTabBar`, `OperationalMetricGrid`, `OperationalKpiCard`, `OperationalClassificationCard`, `OperationalFilterBar`, `ChartPanel`, `OperationalTable`, `InlineDetailPanel`, `OperationalSectionCard`, `ProcessProgress`, `ScoreCard`, `RecommendationsList`, `ActivityFeed`, `DataAvailabilityPanel`, `LastUpdatedIndicator`, `Skeleton`, `Alert`, `Input`, `Select` e `StatusBadge`.

## Global conventions

- `PageScaffold` mantém uma única rolagem principal. `ModuleHero` mostra categoria, título, subtítulo e atualização apenas quando publicados; ações de cabeçalho são omitidas enquanto não houver contrato de resultado.
- `ModuleTabBar` preserva a ordem das oito abas. KPIs usam `OperationalMetricGrid` + `OperationalKpiCard` padrão: label visível sempre, valor/contexto/variação somente quando publicados.
- Gráficos usam `ChartPanel` somente com dados publicados. Donut tem legenda lateral em tabela no desktop e empilhada no mobile. Risco e status nunca dependem apenas de cor.
- Tabelas usam `OperationalTable` com caption e rolagem horizontal em viewports estreitos. `InlineDetailPanel` abre no fluxo, sem canvas vertical aninhado.

## Breakpoints

| Token | Value | Verified source | Surface effect |
| --- | --- | --- | --- |
| `sm` | `40rem` | `responsive-contract.md`; sem override em `src/app.css` | tabs podem rolar horizontalmente |
| `md` | `48rem` | `responsive-contract.md`; sem override em `src/app.css` | filtros passam a duas colunas |
| `lg` | `64rem` | `responsive-contract.md`; sem override em `src/app.css` | análises em duas colunas |
| `xl` | `80rem` | `responsive-contract.md`; sem override em `src/app.css` | grade de 12 colunas e seis KPIs |
| `2xl` | `96rem` | `responsive-contract.md`; sem override em `src/app.css` | densidade total da tabela |

## Global state conventions

| State | Visible/removed/substituted | Component and exact copy | Action/retry/data preserved | Freshness/focus/aria-live | Filter/selection/pagination |
| --- | --- | --- | --- | --- | --- |
| loading | mantém título/filtros e substitui resultado | `Skeleton`; “Carregando dados do OneDrive.” | nenhuma ação; sem valor fictício | foco preservado; `aria-live=polite` | filtros visíveis; seleção limpa |
| empty | mantém consulta e caption | `OperationalSectionCard`; “Nenhum resultado para os filtros aplicados.” | reset só se filtro ativo | foco no controle; anúncio polido | filtros preservados; total zero |
| partial | mantém dados confirmados e adiciona aviso | `Alert`; “Cobertura parcial: alguns dados deste recorte não foram publicados.” | sem retry inventado; preserva dados | `LastUpdatedIndicator` se houver data | filtros preservados; seleção só se item existir |
| stale | mantém última publicação | `LastUpdatedIndicator`; “Dados desatualizados. Exibindo a última publicação disponível.” | sem ação de atualizar | data textual; anúncio polido | consulta preservada |
| failed | remove resultado falho, mantém recorte | `Alert` destructive; “Não foi possível carregar este resultado.” | retry `none` sem contrato | foco no alerta após ação do usuário; assertive | filtros preservados; seleção limpa |
| unavailable | substitui somente região factual | `DataAvailabilityPanel`; “Dados indisponíveis” | nenhuma ação | razão legível | bloco sem seleção/paginação |
| restricted | substitui somente região factual | `DataAvailabilityPanel`; “Acesso restrito” | nenhuma ação | razão legível | bloco sem seleção/paginação |
| coming_soon | substitui automação explicitamente futura | `DataAvailabilityPanel`; “Em breve” | nenhuma ação | razão legível | não altera dados factuais |

## Global accessibility conventions

- `main` tem `h1` no hero; faixas têm `h2`; cards e tabelas têm títulos associados. KPIs anunciam label, valor, unidade, período e disponibilidade.
- Cada gráfico ganha resumo textual com unidade, período, leitura principal, cobertura e frescor. Risco tem texto/ícone, além da cor.
- Filtros têm label visível e teclado; após aplicação anunciam resultado. Paginação foca o caption e volta a tabela ao topo. Detalhe recebe foco no título, fecha por ESC e devolve foco ao gatilho.

## UI decision log

Este log rege o adendo da fonte real. `decided` registra apresentação já
decidida; não significa binding/fixture implementado. O status `conceptual`
decorre dessa reconciliação de entrega ainda pendente. Layout e APIs de
setembro abaixo são evidência histórica; nenhuma API nova é afirmada aqui.

| Decision ID | Scope | Affected IDs | Decision | Evidence | Rationale | Alternatives considered | Owner | Status | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UI-BACKEND-01 | global | global | Preservar as oito abas, regiões e leitura administrativa; apresentar somente publicação local, sua origem e disponibilidade | Homologação de setembro; contratos por aba; Q1–Q4 | Consumir fatos sem reabrir a estrutura aprovada | not_applicable: estrutura já homologada | Superfície OneDrive e adapter de apresentação | decided | Próxima entrega de bindings; nenhuma API de componente nova |
| UI-BACKEND-02 | global | global | A superfície mantém filtro, paginação, seleção e foco; a fonte define universo e catálogos factuais | Contratos de comportamento por aba; Q5 inferida por autorização | Um filtro não transforma uma página em inventário completo | Inferir opções/total de uma amostra rejeitado por ausência factual | Superfície OneDrive | decided | Publicação de catálogo/escopo e cobertura íntegra do universo B |
| UI-BACKEND-03 | global | global | Séries e distribuições preservam unidade, data, universo e ausência; sem interpolar meses ou converter desconhecido em zero/baixo. População existente sem classificados produz distribuição não avaliável | Q2/Q3, R2 aceita; contratos de disponibilidade | O gráfico não cria fatos ou denominadores | Preencher ausência por zero rejeitado | Adapter de apresentação; gráfico renderiza a projeção | decided | Cenários de gaps, não classificado e coverage na próxima entrega |
| UI-BACKEND-04 | global | global | Tabela/detalhe preservam nulos, origem e datas factuais; rótulos distinguem estimativa e estado observado | Q1/Q2/Q4; Q5 inferida por autorização; contratos por aba | Data observada ou recomendação não prova evento real | Criar workflow ou data por inferência rejeitado | Superfície OneDrive | decided | Cenários de dados opcionais e prazo nominal |
| UI-OFFBOARD-01 | Usuários Desligados e Retenção | od-offboarding-table, od-offboarding-analysis, od-offboard-retention-policy, od-offboard-upcoming-deletion, od-offboard-department-transfer | Identificar “Presumido por bloqueio” e primeira observação; manter campos humanos desconhecidos sem progresso presumido. Retenção recomendada local: 90 dias geral, 180 por cargo explicitamente crítico, 730 por exceção legal aprovada e 30 de carência após fim factual/aprovado para excluído | Q1/Q2, revisadas pela R1 aceita; imagem06; contrato da aba | Leitura sem HR; regras locais não afirmam prazo Microsoft ou workflow criado | Pacote anterior de 7 anos/risco do caso substituído pela R1 | Superfície de desligamento | decided | Binding de origem/evidência, classificação registrada do cargo e cenário sem âncora/aprovação |
| UI-SYNC-01 | Atividade e Sincronização | od-activity-kpis, od-sync-evolution, od-sync-errors, od-activity-devices | Azul: Dispositivos sincronizados, clientes OneDrive observados com reporte atualizado nos 30 dias até fotografia Health. Vermelha: erros reportados nos 30 dias até fotografia Errors. Referência/coverage independentes; KPI arquivos Reports separado | Q3/R3 aceitas; imagem05; contrato de Atividade | Preservar a unidade da imagem sem confundir cliente, arquivo e ocorrência | Reports na série azul substituído por R3; somar snapshots sobrepostos rejeitado | Adapter de apresentação de Atividade | decided | Perfil/run admitido e próximos cenários syncedDevices/reportedErrors; sem reinterpretar fixture antiga |
| UI-SECURITY-01 | Configurações e Segurança | od-security-policies, od-security-score, od-security-categories, od-security-compliance | Apresentar os 20 itens com origem e baseline A revisado por R4; manter contribuição ausente distinta de divergência, sem redistribuir pesos | Q4/R4 aceitas; contrato de Segurança | Resultado parcial não afirma controle desabilitado | Usar recomendação como valor atual rejeitado | Adapter de apresentação de Segurança | decided | Cenários de origem e avaliação versionada |
| UI-SECURITY-02 | Configurações e Segurança | od-security-dlp-distribution, od-security-sensitivity-distribution, od-security-defender-integration, od-security-retention-governance | Nomear catálogo de quarentena; retenção usa arquivos atuais únicos com proteção efetiva comprovada e volume lógico do mesmo conjunto, mantendo cinco métricas no card. DLP/sensibilidade/usuários/vencimentos têm universos independentes | Q4 revisada pela R5 aceita; imagem07; contrato de Segurança | Não confundir arquivo retido, cópia física preservada e catálogo de políticas | Artefatos/ocupaçãoPHL nas duas linhas substituídos por R5; não acrescentar métricas | Superfície de Segurança | decided | Cenários com novos bindings, avaliação parcial, tamanho ausente e vencimento desconhecido |
| UI-AUDIT-01 | Histórico e Auditoria | od-audit-kpis, od-audit-analysis, od-audit-table, od-audit-detail, od-audit-attention, od-audit-sources, od-audit-source-coverage | Mostrar risco não classificado e distinguir feed habilitado, cobertura e atualidade; sinais derivados não ampliam total bruto de eventos | Q2 aceita; contrato de Auditoria | Estado da assinatura não prova completude de eventos | Tratar feed habilitado como histórico completo rejeitado | Superfície de Auditoria | decided | Cenários de início/partial, não classificado e sinal derivado |
| UI-CONTENT-01 | Arquivos e Conteúdo | od-content-kpis, od-content-filters, od-content-analysis, od-content-rankings, od-files-disposal, od-files-duplicates, od-files-sensitive, od-files-risk | Preservar o universo completo da imagem 03, condicionado à cobertura; distinguir ativo D180 de existente, candidatos por hash e prazo nominal estimado | Q5: inferência do agente autorizada pelo usuário; imagem 03; 2026-10-14 | A imagem cruza total, distribuições e filtros de todos os proprietários/departamentos sem restringir a críticos | A restringiria detalhe a críticos/monitorados; C manteria rótulos seletivos; B é a inferência adotada | Superfície de Conteúdo | decided | Próximos cenários de bootstrap parcial, candidatos QuickXor e prazo nominal sem âncora |
| UI-RISK-02 | global | global | Apresentar os residuais publicados por objeto: arquivo avaliado sem achado Informativo; compartilhamento controlado Baixo; rotina auditada bem-sucedida Baixo ou resultado não publicado Informativo, com contexto. Ausência obrigatória continua Não classificado | R2 aceita; imagens03/04/08; contratos das abas | Baixo e Informativo não são fallback comum para qualquer objeto | Residual global Q2 substituído pela R2; regras superiores preservadas | Adapter de apresentação de cada superfície | decided | Cenários de resultado ausente, herança confirmada, distribuição não avaliável e revisão de regras |
| UI-VERSIONS-04 | Configurações e Segurança | od-security-policies | version-retention compara exatamente 500 versões principais no modo manual; modo automático mostra seu estado real e comparação numérica não avaliável; não há requisito de expiração em dias | R4 aceita; imagem07; contrato de Segurança | Apresentar divergência da referência sem afirmar falha de segurança | Regra anterior manual<=500/prazo<=365/automático alinhado substituída por R4 | Adapter de apresentação de Segurança | decided | Próximos cenários manual500, manual diferente, automático e origem/overrides desconhecidos |
| UI-ACTIVITY-A2 | Atividade e Sincronização | od-activity-kpis, od-activity-analysis, od-activity-period | Acesso e edição são conjuntos distintos de arquivos observados, sobrepostos entre si; grupos de departamento não são parcelas aditivas do total global | Contrato de Atividade; mapping A2 | Não decompor um contador combinado nem somar arquivos repetidos | Duplicar Viewed Or Edited File Count em dois KPIs rejeitado | Adapter de apresentação de Atividade | decided | Publicação de conjuntos/referência/coverage e cenários de sobreposição |
| UI-AUDIT-A5 | Histórico e Auditoria | od-audit-kpis, od-audit-analysis, od-audit-table, od-audit-detail | Apresentar catálogos publicados pela normalização audit-operations-v1; evento único pode sustentar predicados sem virar várias linhas; operação/resultado desconhecidos mantêm limites explícitos | Mapping A5; contrato de Auditoria | Distinguir evento, arquivo, sinal agrupado e resultado | Interpretar códigos da fixture como operações do provider rejeitado | Superfície de Auditoria | decided | Cenários de operação Outros, resultado parcial/ausente e mapping versionado |
| UI-CONTENT-A7A8 | Arquivos e Conteúdo | od-content-analysis, od-files-risk | Afirmação sem acesso exige cobertura admitida da ação; detector >50 conta versões disponíveis únicas, distinto da referência manual500, com quantidade exata ou limite inferior identificado | Mapping de Conteúdo A7/A8; R4 preservada | Não apresentar resposta vazia como zero nem limiar comprovado como contagem exata | Inferir acesso de ausência e versões pelo ID/setting rejeitado | Adapter de apresentação de Conteúdo | decided | Cenários de access incompleto, paginação de versões e 50/51 sem nova região |
| UI-SHARING-C1 | Compartilhamento e Acessos | od-sharing-link-type | Distribuição exclusiva de arquivos atuais classificados por precedência Anônimo > Convidado externo > Aplicativo concedido > Organização > Pessoa específica; denominador de classificados e cobertura explícita | C1 aceita; contrato de Compartilhamento | Cada arquivo pertence a uma fatia, sem somar grants ou confundir app criador com concessão | Partição por exposição em vez de arquivo não adotada; fixture não fixa cardinalidade | Adapter de apresentação de Compartilhamento | decided | Novos cenários com exposições sobrepostas, desconhecidos e origem da concessão; fixture vigente intacta |
| UI-CLIENTS-C2 | Atividade e Sincronização | od-activity-devices, od-sync-distribution, od-kfm-detail, od-activity-kpis | Substituir estados instantâneos por saúde diária reportada; apresentar clientes Health e dispositivos Intune em coleções separadas; KFM aplicado significa ao menos uma pasta conhecida protegida | C2 aceita; contrato de Atividade | Descrever fatos reportados sem inventar pausa, estado ao vivo ou join | Cinco estados instantâneos e enriquecimento por nome/pessoa não integram o recorte aprovado | Superfície de Atividade | decided | Próximos cenários clientHealthState, managedDevices, ausência de contexto e KFM por cliente |
| UI-SCORE-C2 | Configurações e Segurança | od-security-score, od-security-categories, od-security-compliance | Preservar peso15 da dimensão Dispositivos; média do controle CA e proporção de IDs Intune únicos elegíveis explicitamente gerenciados/conformes, com limite observado | C2 aceita; contrato de Segurança | Não representar todo endpoint OneDrive nem depender de join não comprovado | Fator por clientes Health enriquecidos com Intune substituído pelo universo explícito Intune | Adapter de apresentação de Segurança | decided | Cenários com população Intune desconhecida/parcial e ausência de fator sem redistribuição de peso |
| UI-AUDIT-A4 | Histórico e Auditoria | od-audit-sources, od-audit-source-coverage | Ativo/Desativado representa enabled explícito do perfil local de ingestão; registry ausente permanece não publicado, sem false de fallback | Mapping A4; decisões de Auditoria | Não confundir intenção de ingestão com serviço, política, assinatura ou coleta | Inferir quatro linhas das duas subscriptions ou ausência de eventos rejeitado | Superfície de Auditoria | decided | Cenários de perfil ausente, desabilitado registrado e enabled com falha operacional independente |
| UI-BENEFITS-C3 | Atividade e Sincronização | od-activity-benefits | Principais Benefícios preserva ordem volume/KFM/percentual; volume é benefitMetrics.storageUsedBytes.value de Reports, com unit byte e metadados próprios. Entradas seguem value/unit/asOf/coverage/availability | C3/C4 aceitas; contrato de Atividade | Não apresentar armazenamento Reports como backup ou proteção por KFM/sync | Tamanho atual dos arquivos e volume retido não adotados para o volume | Adapter de apresentação de Atividade | decided | Novos cenários benefitMetrics, independência entre medidas e ausência sem comparação |
| UI-BENEFITS-C4 | Atividade e Sincronização | od-activity-benefits | Percentual é recentHealthyClientsPercent.value: 100×upToDateReported/classificados nos três estados C2, com referência própria; protectedFolderClients.value reutiliza kfmSummary.applied. Globais independentes de filtros | C4 aceita; contrato de Atividade | Razão de saúde reportada não é taxa de sucesso de transferências nem SLA | Ausência de erro sem recência e percentual de adoção KFM não adotados para o percentual | Adapter de apresentação de Atividade | decided | Novos cenários de denominador zero, unknown fora da razão e valor a uma casa decimal |
| UI-RISK-C5 | Configurações e Segurança | od-security-risks | Resumo conta arquivos atuais únicos no maior risco default-v1/R2; mantém quatro linhas e contexto Arquivos atuais por nível de risco. Info/desconhecido ficam na cobertura; comparação só entre snapshots íntegros compatíveis com referência UTC separada em30dias | C5 aceita; contrato de Segurança | Uma unidade factual, sem misturar arquivos, permissões e eventos | Concessões atuais e eventos D30 não adotados para esse card | Adapter de apresentação de Segurança | decided | Novos cenários riskSummaryMetadata, contagens parciais, baseline ausente e revisão incompatível |
| UI-CAPACITY-20261015 | global | od-dashboard-analysis, od-accounts-analysis, od-accounts-forecast | Donut usa fronteiras publicadas sem arredondar utilização; forecast preserva restante assinado e horizonte futuro não negativo, sem datar cruzamento passado da cota | Contratos de Contas/Dashboard, convergência técnica 15/10 | Exibir categorias/projeção factual sem confundir faixa do donut com nível de capacidade | Reclassificar95 como faixa acima95 ou exibir dias negativos rejeitado | Adapter de apresentação de Contas/Dashboard | decided | Próximos cenários de fronteiras50/80/90/95 e restante zero/negativo com gates de histórico |
| UI-CONTENT-RANGES-20261015 | Arquivos e Conteúdo | od-content-analysis | Tamanho usa bytes base1024 e antiguidade usa última modificação contra âncora factual, com fronteiras contratuais; preservar os nomes históricos das categorias | Contrato de Conteúdo, convergência técnica 15/10 | Classificar antes de arredondar e não transformar idade de modificação em último acesso | Meses de calendário e relógio do browser não adotados para as faixas | Adapter de apresentação de Conteúdo | decided | Próximos cenários de fronteiras e ausências independentes por distribuição |
| UI-GOVERNANCE-20261015 | global | od-audit-kpis, od-audit-filters, od-audit-analysis, od-audit-source-coverage, od-activity-kpis, od-activity-attention, od-offboarding-table | KPI de links conta criação anônima; filtros de Auditoria propagam a todas as análises abaixo salvo auditSources; exposição dos casos reutiliza Sharing corrente, e inatividade usa atividade da pessoa em Reports D180; sincronização Reports é soma por pessoa, não arquivos globais únicos | Contratos/mappings de Auditoria/Desligamento/Atividade e reparo técnico GA4 em15/10 | Preservar unidade, âncora e cobertura sem inventar atividade, exposição ou duplicar estoques | Atividade dos próprios espaços como atividade da pessoa, null como91dias e filtros limitados à página rejeitados | Adapters de apresentação das abas afetadas | decided | Novos cenários por fato; fontes canônicas sem coleta ou mapping externo no frontend |
| UI-SCORE-RANGES-20261015 | Configurações e Segurança | od-security-score, od-security-categories, od-security-compliance | Faixas contínuas incluem notas decimais sem lacunas, com limiares50/70 para score e25/50/75 para conformidade; pesos e tons preservados | Contrato de Segurança, normalização técnica15/10 | Não deixar notas como49,5 sem classificação | Truncar nota para inteiro ou alterar limiares não adotado | Adapter de apresentação de Segurança | decided | Cenários de valores decimais próximos aos limiares; API compartilhada preservada |
| UI-SHARED-C6 | Atividade e Sincronização | od-activity-kpis, od-activity-analysis | sharedItems conta arquivos distintos com atividade registrada e usa label Arquivos com atividade de compartilhamento; sharedItemsMetadata explicita janela/revisão/identidade/cobertura/resultado desconhecido. Comparação somente D30 | C6 aceita; contrato/mapping liberados em15/10 | Atividade histórica não prova acesso vigente, aceite ou sucesso | Contagem Reports interna/externa sem interseção e estoque atual não adotados para esse KPI | Adapter de apresentação de Atividade | decided | Novos cenários de subtotal, resultado desconhecido, metadados e ausência de comparação fora de D30 |
| UI-DEFENDER-C7 | Configurações e Segurança | od-security-defender-integration | reportedAlerts30d é medida independente de alertas criados em30dias, todos os status/classificações, com contexto de registros observados e sem comparação nova | C7 aceita; contrato de Segurança;15/10 | Não confundir alerta, ameaça confirmada, arquivo ou incidente | Contar por início da atividade ou somente ameaça confirmada não adotado | Adapter de apresentação de Segurança | decided | Novo binding value/unit/window/asOf/coverage/availability; detectedThreats30d permanece histórico |
| UI-RETENTION-C8 | Configurações e Segurança | od-security-retention-governance | Quinta linha usa filesWithNominalRetentionEnd15d.value: arquivos atuais únicos com fim nominal combinado finito entre D e D+15 datas UTC inclusivas; referência/cobertura próprias, sem comparação nova | C8 aceita pelo usuário em15/10; contrato de Segurança | Prazo nominal não comprova liberação, exclusão ou espaço recuperável | Contar aplicações de regras ou casos locais não adotado; expiringWithin15Days histórico não é renomeado | Adapter de apresentação de Segurança | decided | Cenários da nova medida, regras simultâneas, hold desconhecido, ausência de referência e subtotal parcial; cinco linhas preservadas |
| UI-CRITICAL-C9 | Histórico e Auditoria | od-audit-attention | Lista base de até cinco IDs Alto/Crítico na janela factual24h, Crítico antes de Alto, instante decrescente e ID ascendente; filtros apenas intersectam os IDs sem reposição | C9 aceita pelo usuário em15/10; contrato de Auditoria | Priorizar eventos de origem sem criar alertas ou afirmar ausência de incidentes a partir de lista limitada | Somente recência, inclusão de rotinas e completar cinco após filtro não adotados | Backend seleciona lista base; superfície aplica interseção e apresenta | decided | criticalActivitiesMetadata e cenários de ordenação, recorte sem correspondência e cobertura incompleta; KPIs D30/auditSources independentes |

## Adendo de apresentação para a fonte real — 14/10/2026

### Alcance e próxima entrega

Este adendo consome as decisões aceitas no [registro de clarificações](backend-defaults-e-clarificacoes.md)
e os contratos de cada aba. Não modifica a fixture sintética vigente, o
frontend ou a aprovação visual anterior. A próxima entrega frontend deverá
concretizar os bindings e cenários abaixo antes de declarar este handoff
`reconciled`. Isso é uma dependência de apresentação da integração; não é
pré-requisito para o gate `backend_implementation_ready` do Discovery nem exige
nova homologação da composição já aprovada.

Não há nova ação administrativa, rota, prop ou componente compartilhado
proposto. A apresentação permanece dentro das regiões e componentes
homologados. As evidências Storybook de setembro são mantidas como histórico;
qualquer futura alteração material de API deverá seguir o gate do design
system nessa entrega. A fixture agregada não prescreve um controller agregado:
o adapter da superfície recebe publicações locais delimitadas por fato e
responsabilidade, conforme os contratos atualizados.

### Convenções de disponibilidade, origem e risco

- Um valor ausente mantém “Não publicado”/estado de disponibilidade no limite
  do bloco. Risco sem contexto suficiente é “Não classificado”, neutro, e não
  entra na fatia Baixo ou Informativo. Donut/percentual usa somente a população
  classificada e declara a cobertura não classificada no resumo textual
  associado. Com população maior que zero e nenhum classificado, mostrar
  distribuição não avaliável, não cinco níveis com zero nem gráfico vazio que
  sugira ausência de risco. O residual segue o objeto e a revisão R2 abaixo.
- Valor conhecido zero aparece como zero somente com leitura íntegra do
  universo correspondente. Falha, restrição e início de coleta não geram zero.
  Preservar a última publicação válida com seu frescor quando aplicável.
- Origem faz parte do nome/contexto legível do fato: configuração Microsoft,
  limite publicado do serviço, detector local Orkestria ou recomendação
  Orkestria. Tooltip não é o único lugar para uma distinção que muda o
  significado de um valor. Nenhum componente infere origem a partir do texto.
- A série mensal mantém as 12 posições e lacunas sem ligação que pareça
  observação contínua. Data/unidade/coverage aparecem no resumo acessível e no
  contexto de leitura da região. Comparação D30 só existe quando a publicação
  declara operandos/versionamento/populações comparáveis.
- Os estados de setembro continuam aplicáveis; os motivos novos precisam de
  cenário correspondente na próxima entrega. Não criar retry, fluxo de
  consentimento, aviso de licença específico nem controle mutável a partir
  desta documentação de integração.

### Bindings que exigem reconciliação na próxima entrega

Os paths abaixo nomeiam blocos semânticos existentes, não novos payloads de
controller. Novos metadados devem vir do contrato/publicação local; o
frontend não calcula datas de desligamento, risco, scores ou estado de fonte.

| Superfície / regiões | Apresentação decidida | Null/ausência e transformação visual | Evidência e dependência de entrega |
| --- | --- | --- | --- |
| Dashboard — `od-dashboard-offboarding-summary`, `od-dashboard-external-sharing`, `od-dashboard-risks`, `od-dashboard-storage-trend` | Resumos usam a mesma origem factual das abas; desligamento presumido é identificado; exposição atual traz a data da fotografia, sem ser total de eventos de criação; meses novos não são reconstruídos | Risco desconhecido fica não classificado; mês não observado fica sem ponto; não recalcular totais Reports por um inventário parcial | Q1/Q2; contratos de Dashboard e abas de origem; próximo cenário de coverage/cold start |
| Contas — `od-accounts-table`, `od-accounts-forecast`, `od-accounts-storage-trend` | Preservar independência entre contas/uso global e detalhe coletado; previsão só com os snapshots e confiança contratados | Sem operandos não há prazo nem comparação; a identidade ambígua não vira conta resolvida; histórico não observado permanece ausente | Contrato de Contas; Q5 B inferida por autorização; próximo cenário de bootstrap parcial |
| Arquivos — `od-content-type`, `od-content-size`, `od-content-age`, `od-content-extensions`, `od-content-folders`, `od-content-largest`, `od-files-disposal`, `od-files-duplicates`, `od-files-sensitive`, `od-files-risk` | Todos os drives empresariais elegíveis no universo detalhado; rótulos de todos os arquivos ativos suportados. Totais/análises só são tenant-wide após cobertura íntegra; cada fonte conserva coverage própria | “Arquivos ativos (D180)” do KPI é atividade Reports; status active é existente/não excluído. Não igualar tamanho dos itens correntes a armazenamento Reports. “Candidatos a duplicatas” usa hash igual; lixeira traz “Estimativa da janela padrão”, não data confirmada | Q5 B e semânticas comuns inferidas por autorização; contrato de Conteúdo; próximos cenários de universo completo/parcial, hash e prazo nominal |
| Compartilhamento — `od-sharing-kpis`, `od-sharing-table`, `od-sharing-external-trend`, `od-sharing-risk`, `od-sharing-attention` | Exposição é fotografia de permissões atuais na referência publicada; evento antigo de compartilhamento não prova acesso ainda vigente | Risco nulo fica não classificado; ausência de expiração não prova que toda permissão expirou; tendência mensal só tem fotografias observadas | Q2; contrato de Compartilhamento; próximo cenário de classificação incompleta e permissão independente |
| Atividade — `od-activity-kpis`, `od-sync-evolution`, `od-sync-errors`, `od-activity-devices` | Azul `syncedDevices`: “Dispositivos sincronizados”, clientes observados com estado atualizado reportado nos 30 dias até fotografia Health. Vermelha `reportedErrors`: “Erros reportados nos 30 dias até a data do snapshot” Errors. Tooltip/resumo preserva referência/coverage de cada série; KPI Arquivos Sincronizados permanece Reports | Última fotografia íntegra do mês por origem; 12 posições; mês sem fotografia é lacuna; zero exige run completo. Os novos inteiros não negativos/anuláveis não reutilizam valores syncOperations/failures da fixture histórica | Q3/R3; contrato de Atividade; próximos cenários de séries independentes, mês incompleto e ausência de perfil |
| Atividade — `od-activity-devices`, `od-sync-distribution`, `od-kfm-detail`, `od-activity-kpis` | Saúde diária reportada dos clientes Health, com clientHealthState; managedDevices Intune em população independente. KFM aplicado conta clientes com ao menos uma pasta conhecida protegida; detalhar por pasta/elegíveis | Dados necessários ausentes ficam Não avaliado; zero erros não prova sincronização instantânea. Não juntar por pessoa/nome nem somar populações como dispositivos físicos únicos; score KFM exige separadamente as três pastas Windows | C2 aceita; próximos cenários de erros, atualização antiga, pastas avaliadas e inventários independentes |
| Desligamento — `od-offboarding-table`, `od-offboarding-analysis`, `od-offboard-department-transfer`, `od-offboard-upcoming-deletion`, `od-offboard-retention-policy` | Identificar caso como “Presumido por bloqueio”, com primeira observação/evidência. Sete dias qualificam o caso, não data real de saída. Reativação encerra o episódio. Recomendações Orkestria da R1: geral 90 dias, cargo crítico registrado 180, exceção legal aprovada 730 e carência local 30 dias após fim factual/aprovado para excluído | Responsável, solicitação, aprovação, transferência, ticket, data de saída e progresso desconhecidos continuam sem valor. Não inferir cargo crítico de risco/departamento/título. Regra local não garante armazenamento Microsoft; sem âncora/aprovação e evidência do ciclo aplicável não há data automática | Q1/Q2 revisadas pela R1 aceita; imagem06; contrato de Desligamento; próximo cenário de caso técnico sem workflow humano e sem fim aprovado |
| Segurança — `od-security-policies` | Os 20 IDs permanecem identificáveis no modelo; baseline A é recomendado. “Limite de download” é detector Orkestria >500 arquivos/30 min. Lixeira segundo estágio é restante dos mesmos 93 dias. version-retention: referência manual exatamente500, sem prazo em dias | Atual desconhecido mostra neutro/não avaliável. Limite de arquivo250GB é fato versionado do serviço; quota1TB é recomendação condicionada a direitos. Automático mostra modo real/não comparável ao número500; manual diferente diverge da referência, sem rótulo automático de falha | Q4/R4; contrato de Segurança; próximos cenários de origem, manual diferente e automático não avaliável |
| Segurança — `od-security-score`, `od-security-categories`, `od-security-compliance` | Renderizar nota/fatores/coverage da revisão publicada; pesos fixos somam100. Dispositivos/peso15 usa média CA + proporção Intune gerenciado/conforme no universo observado, sem join Health. Conservar as faixas aprovadas | Categoria sem evidência permanece indisponível/contribuição zero, sem rótulo de divergência ou redistribuição de peso. Zero população Intune não certifica conformidade; sem versão/população comparável não há delta. Health Score não ganha card novo | Q4/C2; contratos de Segurança/Dashboard; próximos cenários de universo Intune e dimensão incompleta |
| Segurança — `od-security-dlp-distribution`, `od-security-sensitivity-distribution`, `od-security-defender-integration`, `od-security-retention-governance` | DLP: políticas com inclusão efetiva no OneDrive; sensibilidade: arquivos efetivamente avaliados. Quarentena: “Documentos no catálogo de quarentena”. Retenção: arquivos atuais retidos, seu volume lógico e quinta linha C8 de arquivos com fim nominal combinado, com medidas independentes | Retenção exclui pastas, remotos duplicados, excluídos, versões, lixeira e cópiasPHL. Bytes ausentes não impedem count; fim nominal desconhecido não vira vencimento comprovado ou promessa de exclusão. Catálogo de quarentena não cobre todos os bloqueados | Q4/R5/C8; contrato de Segurança; próximos cenários com novos bindings e cobertura própria |
| Auditoria — `od-audit-kpis`, `od-audit-analysis`, `od-audit-table`, `od-audit-detail`, `od-audit-attention`, `od-audit-sources`, `od-audit-source-coverage` | Fontes usam enabled explícito dos perfis locais, distinto de feed/política/cobertura. Lista C9: até cinco IDs Alto/Crítico em24h factuais, prioridade por risco antes da recência; filtros intersectam sem reposição. Sinais não inflam eventos | Registry ausente não vira Desativado. Eventos/JSON duram90dias; feed habilitado não preenche história. Contexto desconhecido não vira baixo risco/sucesso, nem lista limitada vazia prova ausência de incidentes | Q2/A4/A5/C9; contrato de Auditoria; próximos cenários de metadados, prioridade, filtros e cobertura incompleta |

### Revisão das imagens — R1–R5 aceitas: 5/5 resolvidas

As cinco revisões foram aceitas na opção A pelo usuário em 2026-10-14. Não
resta decisão de produto pendente desta rodada. `conceptual` descreve os novos
bindings/cenários ainda não materializados, sem alterar `frontend_done`
histórico nem o gate de Discovery backend.

A revisão [R1 do registro de clarificações](backend-defaults-e-clarificacoes.md#r1--pacote-de-retenção-da-imagem06-aceita-a)
foi aceita pelo usuário em 2026-10-14. No card `od-offboard-retention-policy`,
as quatro linhas permanecem estáveis, com contexto explícito **“Recomendação
Orkestria”** e os valores da imagem06:

| Linha | Valor recomendado | Contexto obrigatório |
| --- | --- | --- |
| Período padrão de retenção | 90 dias | Baseline local geral, não configuração Microsoft observada |
| Retenção para cargos críticos | 180 dias | Classificação de cargo explicitamente registrada; risco do caso, departamento e título não a substituem |
| Retenção legal / compliance | 730 dias | Somente mediante exceção aprovada; não é obrigação universal |
| Usuários excluídos | 30 dias após retenção | Carência local recomendada após encerramento factual/aprovado da retenção; sem âncora/aprovação não há data de caso |

A duração/ciclo Microsoft é fato separado, apresentado somente quando
publicado, sem substituir a quarta linha local. Carência não significa
armazenamento Microsoft adicional garantido. O frontend não soma prazos por
conta própria, não cria data de exclusão e não executa retenção/exclusão. A
origem continua local/recomendada mesmo quando houver aprovação registrada;
essa aprovação não prova aplicação técnica no provider. Não haverá HR nem
classificação de cargo inferida.

Este bloco substitui as menções anteriores a 7 anos, 180 dias por risco do
caso e duração Microsoft na quarta linha da Q2. A fixture vigente permanece
histórica; cenário com 730 dias/cargo registrado/carência sem âncora deve ser
reconciliado na próxima entrega de bindings.

#### R2 — risco residual por objeto

A [R2 aceita pelo usuário](backend-defaults-e-clarificacoes.md#r2--baixoinformativo-por-objeto-aceita-a)
em 2026-10-14 substitui os residuais globais da Q2. O frontend apresenta a
classificação e sua revisão publicadas; não calcula o risco a partir de campos
parciais ou de percentuais da imagem. Regras superiores Crítico/Alto/Médio
continuam prevalecendo.

| Objeto | Residual publicado e apresentação | Ausência e limites |
| --- | --- | --- |
| Arquivo | **Informativo** quando efetivamente avaliado sem achado adverso; pode herdar **Baixo** quando há ao menos uma exposição atual confirmada e todas são avaliadas como Baixo, sem regra superior própria | Arquivo sem contexto obrigatório é **Não classificado**. Conjunto de exposições vazio não satisfaz herança de Baixo. Informativo não é atestado de arquivo limpo |
| Compartilhamento/exposição | **Baixo** quando restrito/revisado, destinatário autorizado e leitura; prazo factual <=30 dias é exigido somente para externo. Encerramento comprovado sem exposição remanescente pode ser **Informativo** | Não presumir revisão, autorização ou encerramento; ausência obrigatória conserva risco nulo. Exposição atual tem a data da fotografia publicada |
| Evento de rotina | Acesso/visualização, criação/edição comum e sincronização canônicos com sucesso explícito e contexto suficiente podem ser **Baixo**. Rotina conhecida com resultado não publicado pode ser **Informativo**, sem afirmar sucesso | Administração, exclusão, compartilhamento novo, operação desconhecida ou resultado falho não recebem Baixo pelo residual. Resultado não contemplado e contexto insuficiente ficam **Não classificado**, salvo outra regra comprovada |

Tabela, badge, legenda, filtro e resumo acessível preservam os mesmos rótulos
publicados; não inferem Baixo pela ausência de achado exibido. A herança usa
relações confirmadas e a maior severidade. O snapshot de permissões atual não
prova exposição no instante de um evento antigo. Distribuições de risco usam
os classificados, com cobertura explícita, sem completar 100% por uma classe
inventada. Comparações históricas exigem revisão compatível de regras e
reavaliação explícita quando os critérios mudarem.

Os novos cenários devem incluir arquivo Informativo, herança Baixo com
exposições confirmadas, evento comum bem-sucedido Baixo, rotina com resultado
ausente Informativo e população existente sem classificáveis. A fixture não
foi alterada nesta rodada.

#### R3 — evolução mensal por clientes e erros reportados

A [R3 aceita pelo usuário](backend-defaults-e-clarificacoes.md#r3--unidade-da-evolução-de-sincronização-aceita-a)
em 2026-10-14 preserva a unidade da série azul da imagem05. O bloco
`od-sync-evolution` mantém 12 posições mensais independentes de
`activityPeriod`, com duas medidas diferentes:

| Série e binding semântico futuro | Legenda e unidade | Referência e cobertura |
| --- | --- | --- |
| Azul — `syncTrend[].syncedDevices` | **Dispositivos sincronizados**; inteiro não negativo ou nulo, contagem de clientes OneDrive observados distintos | Última fotografia Health íntegra do mês; clientes com `LastSyncedTimestampUTC` em `(T-30dias,T]`, com T como referência da fotografia. Contexto: “Clientes OneDrive observados; estado atualizado reportado nos 30 dias até a fotografia” |
| Vermelha — `syncTrend[].reportedErrors` | **Erros reportados nos 30 dias até a data do snapshot**; inteiro não negativo ou nulo, soma da recorrência por cliente/tipo de erro | Última fotografia Errors íntegra do mês, conforme Q3; data de referência, cobertura e disponibilidade próprias |

Usar legendas, unidades e eixos distintos, com resumo acessível e tooltip que
nomeiam a data de cada fotografia; não apresentar as duas medidas como
ocorrências da mesma unidade. `LastSyncedTimestampUTC` é último reporte de
estado atualizado do cliente, não transferência de arquivo. “Dispositivos”
nesta série significa clientes OneDrive observados, sem afirmar inventário
físico completo ou quantidade de pessoas. A identidade interna deduplica a
contagem; a UI não une clientes pelo nome.

Ausência de identidade/data obrigatória declara cobertura parcial, sem criar
zero. Um mês sem fotografia da origem é nulo. Falha de Health não zera Errors
nem o contrário; a série válida é preservada com seu contexto. Zero exige
fotografia íntegra do universo daquela medida. Não somar pontos mensais como
total anual nem usar `lastSync` Intune como prova de sincronização OneDrive.

O KPI **Arquivos Sincronizados** continua com fonte Reports, unidade e período
próprios. Os campos/valores `syncOperations`/`failures` da fixture histórica
não são renomeados ou reinterpretados como `syncedDevices`/`reportedErrors`.
O novo binding exige cenários próprios na próxima entrega; a fixture vigente
permanece intacta e o handoff permanece `conceptual`.

#### R4 — referência manual de versões

A [R4 aceita pelo usuário](backend-defaults-e-clarificacoes.md#r4--versões-e-expiração-acrescentada-aceita-a)
em 2026-10-14 fixa, para o item `version-retention` de `od-security-policies`,
a referência **500 versões principais no modo manual**, conforme a imagem07.
Não há exigência de expiração em 365 dias nem outro prazo em dias para avaliar
esse item. Prazo ilimitado/zero, por si só, não cria divergência.

| Valor/modo atual comprovado | Apresentação do valor atual | Estado da comparação |
| --- | --- | --- |
| Manual, exatamente 500 versões | 500 versões — modo manual | Alinhado à referência recomendada |
| Manual, quantidade diferente de 500 | Quantidade real — modo manual | Divergente da referência; sem afirmar automaticamente falha de segurança |
| Automático | Modo automático, com seu estado real publicado | Não avaliável contra a referência numérica manual; não mostrar 500 como valor efetivo nem equivalência automática |
| Modo/valor/escopo efetivo desconhecidos | Não publicado, com disponibilidade/motivo próprios | Não avaliável; nenhum fallback pelo baseline |

Preservar origem, escopo e overrides factuais. A regra específica de igualdade
do manual prevalece sobre uma comparação genérica de “limite mais restritivo”.
O tooltip de divergência revela a referência recomendada; o texto/ícone não
afirma incidente ou falha só porque o manual é diferente. Modo automático usa
estado neutro para a comparação numérica, sem ícone de alinhamento presumido.
Nenhuma configuração Microsoft é alterada.

O detector de **arquivo com mais de 50 versões**, explícito no DOCX, permanece
independente do setting de retenção; não é substituído pelo baseline de 500.
Os cenários dessa comparação pertencem à próxima entrega de bindings,
mantendo a fixture histórica intacta.

#### R5 — arquivos atuais sob retenção e seu volume

A [R5 aceita pelo usuário](backend-defaults-e-clarificacoes.md#r5--arquivos-sob-retenção-e-cópias-preservadas-aceita-a)
em 2026-10-14 mantém **cinco métricas** em `od-security-retention-governance`.
As duas linhas abaixo substituem contagem de artefatos e ocupação física PHL
da Q4; não acrescentam duas métricas ao card.

| Binding semântico futuro | Rótulo | Tipo / formatter | Universo e ausência |
| --- | --- | --- | --- |
| `retentionGovernance.currentRetainedFileCount` | **Arquivos atuais sob retenção** | Inteiro não negativo ou nulo; contagem legível | Cardinalidade de arquivos atuais únicos com retenção efetiva comprovada. Sem avaliação suficiente, disponibilidade parcial/sem valor; zero exige ausência comprovada no universo declarado |
| `retentionGovernance.currentRetainedBytes` | **Volume atual sob retenção** | Bytes inteiros não negativos ou nulos; formatter de capacidade | Soma dos tamanhos atuais dos mesmos arquivos únicos. Tamanho ausente de algum protegido impede o total de bytes e preserva a contagem comprovada |

Políticas ativas e usuários alcançados conservam seus bindings e
disponibilidade independentes. A quinta linha passa a usar o novo binding C8,
[Arquivos com fim nominal de retenção (15 dias)](#c8-aceita--arquivos-com-fim-nominal-de-retenção),
com unidade, referência e cobertura próprias; não reaproveita o vencimento
sintético anterior.
A lista continua com cinco posições, mesma hierarquia, leitura e composição
responsiva; não inclui métricas adicionais de contagem/ocupação PHL.

A contagem deduplica pela identidade factual do arquivo, mesmo que várias
políticas/rótulos o alcancem. O conjunto exclui pastas, itens remotos
duplicados, excluídos, versões, lixeira e cópiasPHL. Os bytes são volume lógico
atual, sem afirmar espaço físico adicional, cópia na biblioteca ou ocupação
que inclua versões/metadados. Política apenas configurada, catálogo de rótulos
disponíveis e aplicação/escopo/âncora desconhecidos não comprovam proteção.
O frontend recebe essa projeção dos leitores já selecionados; não infere
proteção pelo catálogo nem por desligamento.

Cada medida preserva referência, elegíveis, avaliados, desconhecidos e
availability publicados. Total do tenant exige inventário/avaliação íntegros.
Quando parcial, um subtotal comprovado é apresentado com **“Subtotal do
recorte avaliado”**, sua cobertura e data, sem título/contexto que o declare
total global. Falta de tamanho em protegido deixa bytes “Não publicado”;
contagem sustentada e demais métricas continuam visíveis. Zero não substitui
ausência de coleta, escopo não resolvido ou avaliação incompleta.

`filesInRetention`/`preservedBytes` e seus números na fixture histórica não
são renomeados nem reinterpretados como os novos campos. A próxima entrega
deve reconciliar cenários com arquivos únicos cobertos, múltiplas regras sem
duplicação, cobertura parcial, tamanho ausente e política apenas configurada.
Nenhuma nova API externa ou API de componente é proposta nesta revisão.

### Fechamento técnico de bindings — A2/A5/A7/A8

Este fechamento sucede as revisões R1–R5 e conserva suas decisões. A validação
documental dos oito OpenAPI informada na rodada A1 verifica contratos externos;
não demonstra que os novos bindings da UI já tenham cenários nem fecha fontes
ou decisões ainda pendentes. Não há execução nova de tenant ou implementação
de collector nesta atualização do blueprint.

#### Atividade — arquivos acessados e editados distintos

`accessedItems` e `editedItems`, conforme [contrato de Atividade](atividade-e-sincronizacao/contratos.md),
são contagens de **arquivos distintos com atividade observada**, na janela UTC
publicada com fim exclusivo. O mesmo arquivo pode pertencer aos dois conjuntos.
As regiões `od-activity-kpis`/`od-activity-analysis` recebem essas contagens,
referência e cobertura da publicação local; não repartem o contador combinado
de Reports nem somam as contagens por pessoa ou por dia para obter o total.

`departmentActivity` usa departamento dos atores na referência publicada. Um
arquivo pode aparecer uma vez em cada um de vários departamentos; os grupos
**não são aditivos** ao total global. O resumo acessível e o contexto da análise
por departamento devem indicar “Arquivos distintos por departamento dos atores;
grupos podem se sobrepor”. Não atribuir ator/departamento desconhecido ao
proprietário do arquivo; a publicação conserva a cobertura não resolvida.
Edição pode abranger conteúdo ou propriedades; atividade observada não afirma
sucesso quando o resultado não foi publicado.

A2 mantém snapshots diários de presença por 400 dias para unir conjuntos nas
janelas D7/D30/D90/D180. Esse estado mínimo não contém JSON/IP/detalhe e não
reconstitui os eventos expirados aos 90 dias. Disponibilidade de D180, zero e
comparações dependem da cobertura factual da janela; o primeiro onboarding
não retroprojeta história. A UI não oferece detalhe expirado só porque a
contagem agregada da janela continua publicada.

#### Auditoria — códigos, resultados e denominadores

O [mapping audit-operations-v1](historico-e-auditoria/fontes-e-viabilidade.md#a5--normalização-canônica-audit-operations-v1)
publica códigos/categorias e preserva operação original sanitizada no detalhe.
`filterCatalog` fornece os rótulos de apresentação; o frontend não traduz a
operação original por heurística nem trata os códigos ilustrativos da fixture
como operações Microsoft. Operação sem equivalência permanece em Outros,
com código original disponível quando publicado e sem risco de rotina inferido.

Total de eventos e categorias usam eventos canônicos únicos. Arquivos/pessoas
afetados usam identidades distintas; seus denominadores não são o número de
eventos e uma linha sem identidade pode conservar o evento sem provar essas
outras métricas. Um mesmo evento pode satisfazer predicados analíticos sem
ganhar linhas adicionais na tabela. `BulkDownload`/`BulkDeletion` são sinais
derivados com referências aos eventos originais, não linhas extras para inflar
total, categorias, ranking ou tendência.

Resultado parcial/ausente permanece distinto de sucesso integral. O renderer
consome resultado admitido pela publicação local; um texto bruto parecido com
“Success” não habilita sozinho o badge de sucesso nem o residual Baixo da R2.
Eventos desconhecidos não completam regras que exigem sucesso/contexto. Séries,
comparações e catálogos devem corresponder à revisão publicada do mapping;
versões incompatíveis não produzem delta aparente.

#### Conteúdo — acesso estatístico e versões disponíveis

A afirmação de ausência de acesso exige contador **`access.actionCount: 0`
explícito** em todos os buckets admitidos e cobertura integral da ação/janela.
`access`/contador ausentes ou nulos, coleção vazia, falha de página ou faceta
`incompleteData` presente não são zero; inclusive uma faceta com
`wasThrottled: false` continua sinal de incompletude. A apresentação conserva
indisponível/parcial e o motivo, sem gerar recomendação de abandono a partir
dessa ausência. Um positivo pode demonstrar acesso observado mesmo incompleto,
mas não uma contagem exata. Bucket positivo localiza acesso em um intervalo,
não fornece por si só a data exata de “Último acesso”.

O detector >365 dias permanece condicionado à existência e cobertura contínua
suficientes do arquivo/ação; uma leitura estatística D90 não prova esse período.
O ledger de 400 dias preserva lacunas e referências sem criar data retroativa.
Estas condições refinam os estados já aprovados; não alteram controles ou
semântica do filtro por iniciativa do blueprint.

O detector de **mais de 50 versões** consome a contagem publicada de versões
disponíveis por arquivo, deduplicadas pela identidade, sem interpretar o ID como
contador. É distinto do setting de **500 versões principais manuais** da R4.
50 não dispara; 51 IDs distintos já observados comprovam o limiar, mesmo que
a quantidade exata ainda não esteja concluída. Nesse caso, qualquer referência
já contratada ao detector deve dizer **“Pelo menos 51 versões disponíveis”**,
com cobertura parcial, nunca apresentar 51 como total exato. Com 50 ou menos e
página pendente, não afirmar ausência de versões excessivas. Falha/acesso
insuficiente não produzem zero nem quantidade atual.

Contagem exata exige enumeração íntegra e sua data/escopo. Não é total histórico
de edições, de versões já eliminadas ou de versões principais; não fabricar
versão atual ausente da coleção. O blueprint não cria severidade, card, ação
ou coluna nova para esse detector. Os gates A7/A8 do Simulator foram concluídos
na rodada técnica: geração, inventário, validação, importação dos cinco serviços,
smoke e diffcheck, com 87 operações no inventário. Essa é evidência de contrato
sintético, registrada no handoff técnico; não equivale a collector implantado,
leitura de todos os tenants ou reconciliação da fixture de UI.

#### Compartilhamento — C1 aceita: arquivos em categorias exclusivas

A [C1 aceita pelo usuário](backend-defaults-e-clarificacoes.md#c1--partição-do-compartilhamento-aceita-a)
define `sharingTypeDistribution` como distribuição exclusiva de **arquivos
atuais compartilhados classificados**. `od-sharing-link-type` recebe uma
contagem por arquivo, na primeira categoria confirmada desta precedência:
**Links anônimos → Convidados externos → Aplicativos/Integrações → Organização
(interno) → Pessoas específicas**. A ordem não muda a classificação de risco R2.

O denominador é a quantidade de arquivos compartilhados classificados; soma
das contagens = denominador. Não contar pastas, cópias de preservação ou
duplicações remotas. Cobertura declara elegíveis, avaliados, classificados e
desconhecidos; dados suficientes ausentes não produzem cinco zeros. População
factual zero produz composição vazia. Os percentuais publicados usam duas casas
decimais, half-up, sem ajustar artificialmente a soma arredondada para 100%.

Um link para pessoas com acesso existente não cria uma concessão. Aplicativo
criador de link não comprova concessão ao aplicativo. A UI não classifica por
esses textos/atributos isolados nem soma permissões para obter arquivos.
Os demais KPIs têm cobertura e propriedades próprias, podem se sobrepor e
não viram parcelas aditivas por causa desta partição exclusiva. A fixture
histórica não é alterada nem usada para fixar uma cardinalidade de produto.

#### C2 aceita — saúde diária reportada e inventários separados

O usuário aprovou [C2 A](backend-defaults-e-clarificacoes.md#c2--estados-instantâneos-e-correlação-de-dispositivos-aceita-a)
em 2026-10-14, resolvendo A3 **no recorte aprovado**. A investigação não
viabilizou os cinco estados instantâneos ou uma ponte Health–Intune; a decisão
substitui explicitamente esse pedido por saúde diária reportada e populações
independentes. Não é inferência retrospectiva sobre o DOCX nem erro de licença.

`devices` contém clientes OneDrive observados na fotografia Health admitida.
A distribuição `syncDistribution` e a listagem consomem
`devices[].clientHealthState`, com esta precedência e apresentação:

| Valor publicado | Rótulo visível | Condição da fotografia |
| --- | --- | --- |
| `errorReported` | Erro reportado | Contador válido de erros maior que zero; precede os demais estados |
| `upToDateReported` | Atualizado reportado nos últimos 30 dias | Zero erros explícito e último reporte de estado atualizado em `(T-30dias,T]` |
| `notRecentlyUpdatedReported` | Sem atualização reportada nos últimos 30 dias | Zero erros explícito e timestamp válido anterior ou igual a `T-30dias` |
| nulo | Não avaliado | Campo necessário ausente/inválido ou timestamp futuro quando necessário à avaliação; fora da composição, com cobertura explícita |

T é a referência factual da fotografia diária, não o relógio do browser.
Cada cliente classificado conta uma vez. A distribuição usa classificados
como denominador e publica elegíveis/avaliados/desconhecidos; percentuais com
duas casas, half-up, sem divisão por zero nem ajuste artificial de soma.
Ausência de linha não prova não configuração; tempo sem reporte não prova
pausa. Não publicar `paused`, `syncing` ou `notConfigured` neste recorte, nem
reinterpretar os cinco códigos históricos da fixture como os novos três.

`managedDevices` mantém o inventário Intune independente. Na região
`od-activity-devices`, apresentar dois conjuntos locais identificados:
**“Clientes OneDrive — saúde reportada”** e **“Dispositivos gerenciados —
Intune”**, cada qual com sua referência, cobertura e dados. Nenhuma linha
combina os dois inventários. Nome, pessoa, plataforma ou proximidade de datas
não criam associação. Gerenciamento/conformidade/risco Intune e sua última
sincronização são fatos próprios, sem preencher os campos do cliente Health.
Não somar as quantidades como dispositivos físicos únicos; tipo físico
desconhecido continua sem valor.

KFM da aba conta **clientes com ao menos uma pasta conhecida protegida** entre
os que têm o conjunto avaliado. O KPI deve comunicar essa unidade; por pasta,
mostrar clientes protegidos e universo elegível/avaliado, sem soma de pastas
como pessoas/clientes únicos. O score KFM permanece separado e exige Desktop,
Documents e Pictures nos clientes Windows elegíveis que suportam as três.

Na dimensão Dispositivos do Security Score, manter peso **15** e a média dos
dois fatores: controle CA efetivo e proporção de **IDs Intune únicos elegíveis
publicados** explicitamente gerenciados/conformes. O contexto da categoria
identifica **“Postura do inventário Intune observado”**; não declara cobertura
de todos os endpoints OneDrive. Desconhecidos não entram no numerador, fator
ausente contribui zero com motivo e não redistribui peso; população elegível
zero não certifica conformidade universal. O frontend apresenta a avaliação
publicada, sem recalcular ou juntar identidades. Faixas visuais e R3 mensal
permanecem aprovadas; a distribuição diária C2 não redefine `syncedDevices`.

#### A4 — configuração local das quatro fontes de auditoria

`auditSources` usa [enabled explícito do perfil local](historico-e-auditoria/fontes-e-viabilidade.md#a4--configuração-das-quatro-fontes).
O card conserva suas quatro linhas: Unified Audit Log (SharePoint/OneDrive),
Microsoft Graph Audit Logs, Microsoft Purview DLP e Microsoft Defender for
Cloud Apps. Seu contexto é **“Ingestão configurada no Orkestria”**:
**Ativo** significa perfil local habilitado e **Desativado**, perfil
explicitamente desabilitado, com vínculo válido ao consumidor canônico.

Registry ausente não vira `false` ou Desativado. Sem registro suficiente,
preservar não publicado/parcial e a última publicação válida quando existente;
enabled sem consumidor compatível não é promovido. Ausência de eventos não
troca a intenção configurada. Duas subscriptions não preenchem as quatro
linhas; esses estados não afirmam produto Microsoft ativo, política aplicada,
serviço saudável ou coleta bem-sucedida. Cobertura/frescor/falhas continuam
em `sourceCoverage`/availability, independentes dos filtros. Essa distinção
não cria novas linhas, diagnóstico de serviço ou controle mutável no card.

As próximas fixtures/bindings devem demonstrar conjuntos sobrepostos,
departamentos não aditivos, operação/resultado desconhecidos, access incompleto,
limite inferior de versões, partição C1, saúde C2/KFM, configurações A4 e
preservação dos dados independentes. Não renomear valores da fixture histórica
para satisfazer os novos bindings.
Não serão geradas nesta atualização documental.

### Principais Benefícios — C3/C4 aceitas

O usuário aprovou [C3 A](backend-defaults-e-clarificacoes.md#c3--volume-do-card-principais-benefícios-aceita-a)
em 2026-10-14. A região já existente de Principais Benefícios recebe o ID
explícito `od-activity-benefits`; conserva sua posição na faixa KFM →
benefícios → alertas, sem ação nem API nova de componente. O usuário também
aprovou [C4 A](backend-defaults-e-clarificacoes.md#c4--percentual-do-card-principais-benefícios-aceita-a):
as três medidas usam `benefitMetrics`, com entradas
`{ value, unit, asOf, coverage, availability }` e disponibilidade independente.
Preservar a ordem volume → KFM → percentual.

| Binding conceitual | Copy | Tipo / apresentação | Referência, ausência e recorte |
| --- | --- | --- | --- |
| `benefitMetrics.storageUsedBytes.value` | **Armazenamento utilizado no OneDrive** | Inteiro não negativo ou nulo; `unit: byte`; formatter de armazenamento sem arredondar a quantidade semântica | Exatamente `summary.storageUsedBytes.value` e universo do snapshot canônico Reports de Contas, com asOf/coverage/availability próprios |
| `benefitMetrics.protectedFolderClients.value` | **Dispositivos com pastas protegidas** — clientes OneDrive observados | Inteiro não negativo ou nulo; `unit: client`; contagem de clientes | Exatamente `kfmSummary.applied`, com os metadados do mesmo agregado: ao menos uma pasta conhecida protegida, sem somar pastas/pessoas |
| `benefitMetrics.recentHealthyClientsPercent.value` | **Clientes com atualização recente e sem erro reportado** | Número entre 0 e 100 ou nulo; `unit: percent`; uma casa decimal, half-up | `100 × U / C`, U=clientes upToDateReported e C=clientes classificados nos três estados C2, na última fotografia Health íntegra, com referência/cobertura próprias |

O total pode incluir versões/lixeira quando contabilizadas pela fonte. Não
representa soma dos arquivos atuais, bytes sob retenção R5, backup ou proteção
comprovada de KFM/sincronização. Período, departamento, pessoa, dispositivo e
paginação da atividade não recalculam o volume global. Não acrescentar
comparação histórica a esse benefício nem dar precisão horária inexistente à
data do Report.

Ausência/restrição/falha não produzem zero; manter estado próprio ou última
publicação válida com frescor. Zero exige avaliação íntegra comprovando zero.
A região anuncia rótulo, quantidade/unidade, referência e disponibilidade da
medida, separada das outras linhas. C4 conserva o mesmo critério C2 de
`upToDateReported`: zero erros explícito e último estado atualizado reportado
em `(T-30dias,T]`. A razão usa clientes únicos classificados, não tentativas de
transferência, arquivos ou soma de erros. Não é SLA nem taxa de sucesso de
sincronização. Com C=0, mostrar valor nulo/não avaliável; desconhecidos ficam
fora da razão, com elegíveis/observados/avaliados/desconhecidos explícitos.
Não generalizar a razão para todos os endpoints do tenant.

O cálculo mantém precisão completa e a publicação arredonda a uma casa
decimal, half-up. Zero percentual exige U=0 factual e C>0 com avaliação íntegra
do universo declarado. Perfil/run inválido não é publicado; falha preserva a
última publicação válida e seu frescor. As três medidas são globais e não
mudam com D7/D30/D90/D180, departamento, pessoa, dispositivo ou paginação;
suas datas/fontes não precisam coincidir. Nenhuma recebe comparação nova.

`benefitItems[id=protected-data]`, `benefitItems[id=sync-success-rate]` e seus
números permanecem históricos. Não renomear o valor sintético de proteção ou
o percentual histórico de sucesso para preencher os novos bindings. C2/R3, R5,
critérios KFM e pesos permanecem preservados.

### Resumo de Riscos — C5 aceita

O usuário aprovou [C5 A](backend-defaults-e-clarificacoes.md#c5--população-do-resumo-de-riscos-aceita-a)
em 2026-10-14. `od-security-risks` mantém as quatro linhas na ordem Crítico,
Alto, Médio e Baixo, com contexto visível **“Arquivos atuais por nível de
risco”**. O binding `riskSummary[].value` é inteiro não negativo ou nulo e
conta arquivos atuais únicos Q5, uma vez no maior risco comprovado default-v1/R2.
A apresentação consome a projeção; não deduplica permissões/eventos como se
fossem arquivos nem recalcula severidade a partir da tabela paginada.

`riskSummaryMetadata` publica `unit: file`, referência, revisão de
classificação, escopo e cobertura de elegíveis/observados/classificados/
informativos/desconhecidos. Quando elegíveis/desconhecidos não foram apurados,
mostrar essa ausência em vez de zero. A população exclui pastas,
excluídos/tombstones, versões, cópiasPHL e duplicações remotas. Informativo e
Não classificado permanecem na cobertura, sem adicionar quinta/sexta linha
ou usar essas contagens como níveis da composição de quatro riscos.

Contagens positivas parciais são identificadas como **“Quantidade observada no
escopo coberto”**, com referência e disponibilidade próprias; não afirmam total
global. Zero global requer avaliação íntegra. Fonte ausente não produz quatro
zeros nem completa níveis ausentes; preserva a última publicação válida e seu
frescor quando aplicável. Não filtrar esse resumo pelos controles/paginação
de outras abas nem confundir estoque atual com janela de eventos D30.

A comparação opcional usa o último snapshot íntegro cuja data UTC é exatamente
a data do atual menos30dias. Ambos exigem cobertura íntegra, mesma revisão de
classificação e mesmos critérios de escopo; mudanças naturais de arquivos
integram a variação. Não exigir identidades iguais nos dois snapshots. Sem
baseline/comparabilidade, omitir comparação, sem interpolar, repetir o atual
ou reconstruir baseline de eventos. Quando publicada, mostrar delta de
contagem `value - previousValue`, em arquivos, com `periodDays:30`; sem
percentual, média de severidades ou alteração de score.

Os números históricos de `riskSummary` não recebem a nova unidade por simples
renomeação. A próxima entrega deve demonstrar classificação Informativa/
desconhecida fora das linhas, contagem parcial, metadados não apurados e
comparação ausente/incompatível. C3/C4/C5 estão resolvidas; B3 confirma os quatro
períodos oficiais de Reports sem nova UI, operação externa ou comparação.

### Cobertura inicial — Q5 B por inferência autorizada

**Origem: inferência do agente autorizada pelo usuário, imagem 03, 2026-10-14.**
O usuário pediu ler a imagem e inferir a opção ideal; não escolheu explicitamente
B. A imagem `03.Arquivos e Conteúdo.png` cruza “Arquivos Totais” com o total da
distribuição por tipo e oferece todos os proprietários/departamentos, rankings,
sensibilidade e lixeira sem restringir o universo a contas críticas. Por isso o
handoff adota **detalhe completo (B)**. Números da imagem continuam ilustrativos.

- Bootstrap e delta diário incluem todos os drives empresariais elegíveis
  descobertos. Prioridade técnica de contas críticas/revisão semanal não
  reduz o universo de produto. Filtros, total antes da paginação, distribuições
  e rankings operam sobre o inventário publicado, nunca sobre a página como
  se fosse a coleção completa.
- Permissões de todos os itens compartilhados são fotografadas a cada 6h;
  rótulos incluem todos os arquivos ativos suportados dentro dos controles de
  lote/extract já aprovados; lixeira cobre todos os sites elegíveis diariamente.
  Metadados, permissões, rótulos e lixeira conservam cobertura independente.
- “Tenant-wide” só aparece após bootstrap/paginação/correlação completos para
  o universo correspondente. Início de coleta ou falha de um drive preserva os
  demais resultados com cobertura parcial e os totais Reports independentes.
  `contentItems.total` é a cardinalidade do escopo detalhado publicado após
  filtros, antes de paginar; não é a quantidade de linhas visíveis.
- No KPI de atividade, “Arquivos ativos (D180)” informa a janela factual do
  Report. No filtro/status do inventário, ativo significa existente/não
  excluído. Um arquivo existente sem atividade recente pode entrar no
  inventário e ficar fora da contagem de ativos D180. Armazenamento Reports
  pode incluir versões/lixeira; não é soma exigida de tamanhos correntes.
- `od-files-duplicates` usa o título **“Candidatos a duplicatas”**. Hash QuickXor
  não vazio igual fundamenta agrupamento candidato, sem prova byte a byte.
  “Última avaliação de hashes” apresenta `verifiedAt`; economia continua
  **potencial**, sem redução já realizada, e fica desconhecida quando faltam
  tamanhos necessários. O card não habilita exclusão.
- `od-files-disposal` apresenta `permanentDeletionAt` com **“Estimativa da
  janela padrão”**: exclusão original comprovada +93 dias. Segundo estágio não
  reinicia o prazo; sem âncora original, a estimativa fica não publicada.
  Exclusão manual/quota podem antecipar e preservação pode manter cópias.
  A contagem de vencimentos em 30 dias é explicitamente de prazos nominais
  estimados, não exclusões agendadas/realizadas.
- Localização exige hierarquia factual; tombstone exige lixeira/auditoria para
  afirmar data de exclusão. Data de observação não substitui esse evento. A
  recomendação sem acesso por >365 dias só aparece com ledger suficiente, não
  por ausência de eventos fora da cobertura.
- As 12 posições mensais continuam com lacunas nos meses não observados.
  Comparação D30 e previsão exigem operandos factuais. TTL 90/400/13 elimina
  eventos/histórico/rollups conforme política, sem remover do inventário um
  arquivo ainda existente só porque sua modificação tem mais de 400 dias.

Esses bindings/copy estão decididos no handoff; os cenários da fixture vigente
continuam os da entrega visual anterior. Não foram produzidos novos dados,
APIs ou implementação nesta reconciliação documental.

## Convergência técnica — 15/10/2026

Esta ata complementa o adendo de 14/10 para as regiões abaixo. Consome contratos
normalizados, sem mudar a fixture, o `frontend_done` histórico ou APIs de
componentes. A integração permanece `conceptual`; C6–C9 foram aceitas pelo
usuário e são incorporadas abaixo como substituições expressas de significado,
sem atribuí-las retroativamente ao sponsor.

### Contas e Dashboard — distribuição e previsão

`od-dashboard-analysis` e `od-accounts-analysis` preservam os rótulos do donut,
com estes intervalos de utilização efetiva, antes de arredondar a exibição:

| Rótulo | Intervalo publicado |
| --- | --- |
| 0% a 50% | `[0,50]` |
| 50% a 80% | `(50,80)` |
| 80% a 95% | `[80,95]` |
| &gt; 95% | `u > 95`, inclusive acima de 100 |

Cada conta avaliável entra em uma faixa. Uso ausente/inválido ou alocação
ausente/zero não recebe faixa. O denominador é o conjunto com utilização
avaliável no recorte, com referência/coverage próprios; Dashboard é global,
Contas segue o recorte contratado. Sem avaliáveis, não dividir nem apresentar
a composição vazia como prova de que não existem contas. Preservar cobertura
desconhecida/parcial. Os níveis Normal/Atenção/Alto/Crítico são outra regra:
80 começa Atenção, 90 começa Alto e 95 já é Crítico, embora 95 permaneça na
terceira faixa do donut. Não classificar pela porcentagem arredondada.

Em `od-accounts-forecast`, o restante factual continua assinado, inclusive
negativo. O horizonte futuro publicado é `max(0,ceil(R/g))`, com histórico
real de 2 a 6 snapshots, datas extremas válidas, crescimento diário positivo,
uso/alocação válidos e âncora factual, conforme [contrato](contas-e-armazenamento/contratos.md#horizonte-da-previsão-de-esgotamento).
Com restante zero/negativo e todos os gates satisfeitos, exibir zero dias e
a data da âncora: esgotamento observado naquela fotografia, sem afirmar quando
a conta realmente cruzou a cota. Sem os gates, manter projeção não publicada
mesmo se já estiver acima da cota; não melhorar confiança por esse motivo.
Não trocar a âncora pelo relógio atual nem mostrar horizonte negativo.

### Conteúdo — tamanho e idade de modificação

`od-content-analysis` usa o inventário filtrado antes da paginação. Tamanho e
idade têm cobertura independente; ausência em uma dimensão não exclui um
valor conhecido da outra. Classificar tamanho em bytes inteiros base 1024
(`MB=1024²`, `GB=1024³`) antes de formatar ou arredondar:

| Categoria histórica | Intervalo efetivo |
| --- | --- |
| &lt; 1 MB | De 0 até 1 MB, inclusive |
| 1 MB a 10 MB | Acima de 1 MB até 10 MB, inclusive |
| 10 MB a 100 MB | Acima de 10 MB até 100 MB, inclusive |
| 100 MB a 500 MB | Acima de 100 MB até 500 MB, inclusive |
| 500 MB a 1 GB | Acima de 500 MB até 1 GB, inclusive |
| &gt; 1 GB | Acima de 1 GB |

Antiguidade significa **última modificação**, não último acesso. Usar dias
inteiros por `floor((asOf-modifiedAt)/24horas)`, com âncora da publicação:
primeira faixa até 182 dias, segunda acima de 182 até 365, terceira acima
de 365 até 730, quarta acima de 730 até 1095 e última acima de 1095. Os rótulos
históricos de seis meses/anos são nomes das categorias; não usar meses/anos
de calendário. Fronteiras ficam na faixa anterior. Data futura produz idade
negativa e permanece na primeira faixa conforme a convenção contratual; o
filtro temporal ativo ainda exclui datas posteriores à âncora. Sem data ou
âncora válida, não atribuir faixa. O formatter não cria data de último acesso.

### Auditoria — criação anônima e propagação dos filtros

`od-audit-kpis` preserva “Links Anônimos Criados”. O binding
`auditSummary.linkCount` é a quantidade de eventos canônicos de **criação de
link anônimo** na janela UTC D30, deduplicados por identidade de evento.
Não representa todos os tipos de links, links únicos atualmente ativos,
aceite de convite ou sucesso ausente. Criação de link organizacional/para
pessoas específicas, uso, atualização e remoção não entram nesse KPI. Não
alterar o rótulo para encobrir outra medida. A comparação anterior usa o mesmo
predicado/revisão/cobertura; zero exige janela e operação integralmente
avaliadas. O snapshot de KPI continua independente dos filtros abaixo dele.

Na barra de Auditoria, cada alteração afeta distribuições de categoria/risco,
tendência de eventos, ranking, tabela, atividades críticas por interseção e
cobertura publicada do recorte. A coleção completa publicada sustenta essas
análises, nunca somente a página visível. `auditSources` conserva a
configuração local e os KPIs superiores conservam D30, sem recálculo por
filtro. Reset de página/detalhe, foco e anúncios permanecem os já definidos.
A cobertura do recorte não se transforma em estado configurado da fonte.

### Desligamento — estoque vigente e exposição atual

`od-offboarding-table` e seus agregados correntes contam somente o episódio
elegível vigente de cada pessoa. Histórico de episódio encerrado por reativação
não duplica conteúdo/capacidade de um novo episódio; exclusão técnica da mesma
pessoa atualiza a evidência do caso vigente. Isso não afirma conclusão de
transferência, exclusão do conteúdo ou fim de retenção.

`offboardingCases.items[].externalExposure` recebe a projeção corrente de
Compartilhamento para o espaço comprovadamente relacionado ao caso. É
contagem de arquivos atuais únicos com exposição externa, não de concessões
nem de eventos antigos. Várias permissões do mesmo arquivo contam uma vez;
outro espaço, pastas, excluídos e duplicações remotas não incrementam a medida.
Preservar referência/cobertura próprias; positivo parcial é **subtotal observado
no escopo coberto**, zero exige avaliação íntegra, vínculo/avaliação insuficiente
permanece nulo. O frontend não faz join por nome/pessoa nem toma evento antigo
como prova de acesso vigente.

### Atividade — unidades reportadas e inatividade independente

O KPI “Arquivos Sincronizados” conserva `activitySummary.syncOperations` na
janela selecionada, com o contexto **“Contagens de arquivos sincronizados
reportadas por usuário”**. Ele soma uma contribuição factual por pessoa,
período e referência publicados; não deduplica arquivos globalmente entre
pessoas nem representa tentativas/transferências ou clientes físicos. Replay
não aumenta a soma. Identidade, contagem ou período desconhecidos reduzem
cobertura e não recebem zero fictício. Subtotal parcial fica identificado;
total completo/zero e comparação requerem seus operandos factuais e semântica
compatível. A série mensal de clientes/erros R3 continua independente.

Em `od-activity-attention`, `inactiveUsers` usa a publicação canônica da
**atividade da pessoa**, uma vez por identidade, com corte de **mais de 90 dias**.
São elegíveis pessoas licenciadas da população canônica de identidade/licenças
de Contas com vínculo OneDrive factual, sem limite da página visível.
A fonte já selecionada é ActivityUserDetail em D180: identidade canônica
inequívoca a partir do usuário publicado, sua última atividade e a referência
factual do relatório. O backend resolve UserPrincipalName, LastActivityDate e
ReportRefreshDate para a projeção local; a UI continua recebendo
`lastActivityAt`, `daysInactive`, disponibilidade e cobertura próprios, sem
binding direto aos campos Microsoft.

O recorte D180 da admissão é independente do seletor `activityPeriod`.
Dias completos usam datas UTC contra a referência publicada, sem ganhar
precisão horária que a origem não forneça. Data nula, futura, inválida ou ambígua,
licença/vínculo não resolvidos, identidade ambígua ou pessoa sem linha
preservam desconhecido/cobertura, sem presumir elegibilidade;
não transformar null em 91 dias nem inferir pela criação da conta. A última
atividade nos espaços de propriedade da pessoa não substitui sua atividade:
esses espaços podem ter sido acessados por terceiros. Este reparo técnico GA4
não adiciona API, decisão de produto, controle ou comparação à superfície.

### Segurança — faixas contínuas para notas decimais

A nota publicada entra em faixas contínuas, sem truncar para inteiro:

| Apresentação | Intervalos e labels |
| --- | --- |
| Security Score e categorias | `[0,50)` Crítico; `[50,70)` Atenção; `[70,100]` Bom |
| Conformidade Global | `[0,25)` Crítico; `[25,50)` Alto; `[50,75)` Atenção necessária; `[75,100]` Em conformidade |

Isso inclui valores decimais como 49,5/69,5 e 24,5/49,5/74,5 sem lacunas, mantendo
os limiares, tons, pesos e fórmulas já aprovados. O renderer recebe classificação
coerente com a nota publicada; formatação não cria uma categoria. Categoria
indisponível continua neutra/sem percentual, com contribuição de ausência já
definida, sem virar conformidade ou divergência inferida.

### C6 aceita — arquivos com atividade de compartilhamento

O usuário aprovou C6 A em 15/10/2026. Em `od-activity-kpis` e nas projeções de
atividade, `activitySummary.sharedItems` é inteiro não negativo ou nulo, unidade
`file`, com o novo rótulo **“Arquivos com atividade de compartilhamento”**.
Conta arquivos distintos com atividade qualificante registrada em `[T-Ndias,T)`,
para N=7/30/90/180 conforme a janela selecionada. Um arquivo conta uma vez
entre públicos, atores e dias; a UI não soma grupos internos/externos ou
contagens por pessoa/dia como se fossem arquivos globais distintos.

Link criado sem uso e convite sem aceite podem sustentar atividade histórica
admitida. Resultado desconhecido pode entrar como atividade observada, sem
afirmar sucesso, concessão efetiva ou acesso vigente. Falha/resultado parcial
explícitos não são qualificantes. O universo mantém os atores humanos internos
e o tipo arquivo comprovados; pastas/sites não são expandidos. Um arquivo
excluído ou sem compartilhamento atual ainda pode ter atividade histórica.
O donut C1 continua tratando estoque corrente, sem receber esta contagem.

`activitySummary.sharedItemsMetadata` acompanha somente esse KPI/projeção:

| Metadados locais | Apresentação e limites |
| --- | --- |
| `unit`, `period`, `ruleVersion`, `identityReference` | Unidade file, janela D7/D30/D90/D180, revisão sharing-activity-v1 e referência de identidade publicada. Metadados de comparabilidade, sem inferir grupo pelo proprietário ou expor referência opaca como copy |
| `window`, `asOf` | startInclusive/endExclusive/timezone UTC; asOf=T, igual ao fim exclusivo da janela. Sem referência factual, ficam não publicados; não usar relógio do browser |
| `unknownResultFileCount` | Arquivos observados distintos com ao menos uma atividade qualificante de resultado desconhecido, de 0 até sharedItems ou nulo sem contagem. Um arquivo com resultado conhecido e desconhecido conta uma vez nesse subconjunto; não é número de eventos nem de arquivos sem ID |
| `coverage` | requiredDays, coveredDays, ingestionComplete, fileIdentityComplete, actorIdentityComplete, itemTypeComplete, complete, observedFileCount, totalFileCount, unknownFileCount e reason. Ausência de avaliação conserva null; lacuna conhecida conserva o motivo |
| `availability` | Estado e frescor próprios, preservando última publicação válida e sua janela quando a nova falhar |

`observedFileCount` corresponde à quantidade publicada, inclusive subtotal
positivo parcial identificado como observado. `totalFileCount` só existe com
avaliação completa. `unknownFileCount` permanece nulo quando lacunas ou
identidade/tipo/ator não resolvidos impedem quantificar arquivos faltantes;
não estimar pelo número de eventos nem inventar denominador. Completude da
atividade publicada não prova que o provider já publicou toda ação física.
Resultado desconhecido admitido não torna a cobertura incompleta por si só,
mas seu subconjunto precisa ser preservado, sem convertê-lo em sucesso.

Zero exige janela íntegra sem qualificantes. Sem arquivo contável em janela
parcial, o valor é nulo; antes da publicação, estado not_yet_published. Falha
não avança T nem troca a janela por uma publicação de outro dia. A comparação
`activitySummary.comparison.sharedItems` só é publicada em D30, com atual
`[T-30dias,T)` versus anterior `[T-60dias,T-30dias)`, ambas íntegras e compatíveis
em unidade/revisão/identidade/escopo. Sem baseline, omitir comparação;
D7/D90/D180 não ganham comparação nova. Os snapshots mínimos de presença
continuam por 400 dias e eventos/JSON por 90 dias, sem reconstituir detalhe expirado.
Valores anteriores da fixture não comprovam esses predicados/metadados.

### C7 aceita — alertas de segurança criados em 30 dias

O usuário aprovou C7 A em 15/10/2026. Em `od-security-defender-integration`,
substituir o significado histórico de ameaças detectadas pela medida
`defenderIntegration.reportedAlerts30d`, com o rótulo
**“Alertas de segurança criados (30 dias)”** e contexto de **alertas observados**.
O objeto publica `{ value, unit: alert, window: { startInclusive, endExclusive },
asOf, coverage, availability }`; value é inteiro não negativo ou nulo.

A contagem usa identidades únicas de alertas admitidos criados em `[T-30dias,T)`,
com T como referência UTC da publicação. Vários alertas para o mesmo arquivo/
incidente contam separadamente; evidências/atualizações do mesmo alerta não
o multiplicam. O relógio é criação do alerta, não início/fim da atividade,
atualização, coleta ou resolução. Não afirmar que a atividade no arquivo
ocorreu recentemente só porque o alerta foi criado na janela.

Todos os status/classificações entram, inclusive não classificados, falsos
positivos, atividade esperada e resolvidos. Isso não comprova ameaça confirmada,
malware ativo, incidente único, arquivo único ou acesso vigente. O escopo
mantém evidência explícita OneDrive/SharePoint do tenant; identidade, relógio
ou evidência obrigatórios desconhecidos reduzem cobertura. Status/classificação
ausentes não invalidam esta medida que inclui todos.

Positivo parcial é subtotal observado com cobertura explícita. Zero exige
avaliação íntegra do universo observado e não comprova ausência de ameaças no
tenant. Universo/quantidade globais não apurados permanecem nulos na cobertura;
falha ou paginação incompleta preserva estado próprio ou última publicação
válida com frescor. A medida não ganha comparação nova e é independente dos
três controles e da quarentena. Não altera scores ou a classificação de risco.
`detectedThreats30d` e seus valores na fixture permanecem históricos, sem
renomeação para preencher o novo binding.

### C8 aceita — arquivos com fim nominal de retenção

O usuário aprovou C8 A em 15/10/2026. A quinta linha de
`od-security-retention-governance` usa **“Arquivos com fim nominal de retenção
(15 dias)”**, vinculada a
`retentionGovernance.filesWithNominalRetentionEnd15d.value`. A lista conserva
cinco métricas; as outras quatro linhas R5 permanecem independentes. O
significado foi aprovado nesta clarificação, sem atribuição retroativa ao
sponsor ou ao campo sintético histórico `expiringWithin15Days`.

| Publicação local consumida | Tipo / apresentação | Ausência e responsabilidade |
| --- | --- | --- |
| `retentionGovernance.filesWithNominalRetentionEnd15d.value` e `.unit` | Inteiro não negativo ou nulo; unidade `file`; contagem legível de arquivos atuais únicos | Backend resolve qualificação/deduplicação; superfície formata, sem contar aplicações de regras ou casos locais |
| `.referenceDate`, `.window.startDateInclusive`, `.window.endDateInclusive` | Datas ISO `YYYY-MM-DD`, factual D e D+15 dias de calendário UTC, inclusive | Sem D, referência, as duas datas e valor ficam nulos. Não usar relógio da tela nem converter em janela móvel de horas |
| `.asOf` | Data ou data-hora ISO factual, ou nulo; exibição preserva a precisão publicada | Uma data não ganha horário fictício; última publicação válida conserva seu frescor |
| `.coverage` e `.availability` | Elegíveis, observados, avaliados e desconhecidos, com motivos e estado próprios | Contagem não apurada é nula; positivo parcial é subtotal observado, e não total do tenant |
| `.ruleRevision` | Revisão semântica publicada ou nula sem avaliação admitida | Consumida pela apresentação e rastreabilidade da medida; UI não resolve regras ou cria revisão |

O universo é de arquivos locais atuais únicos Q5, sem pastas, excluídos,
versões, lixeira, cópiasPHL ou duplicações remotas. Cada arquivo conta uma vez
quando seu **fim nominal combinado finito** pertence à janela inclusiva.
O backend deve ter resolvido aplicações vigentes, precedência, triggers e
âncoras factuais; entre preservações simultâneas, prevalece a data final mais
tardia. Regras terminando em 10 e 400 dias deixam o arquivo fora. Várias
aplicações com fim combinado em 10 dias contam um arquivo. Data já vencida
fica fora, e tamanho desconhecido não impede essa contagem.

Hold, retenção indefinida, revisão de disposição pendente, cadeia de
substituição, conflito ou escopo/âncora não resolvidos preservam contexto não
determinável na cobertura. Ausência de registro não comprova ausência de hold;
desligamento, prazo local e recomendação não substituem âncora Microsoft.
A superfície não apresenta essa medida como liberação, fim de toda obrigação,
exclusão programada/realizada ou capacidade recuperável.

`coverage` publica `{ eligible, observed, evaluated, unknown, reasons }`,
com contagens inteiras não negativas ou nulas. A UI preserva as contagens
admitidas sem ajustar incoerências: valor, avaliados, observados e elegíveis
mantêm sua ordem de inclusão. **“Subtotal do recorte avaliado”** identifica
positivo parcial com janela e referência próprias. Parcial sem qualificante
comprovado mantém valor nulo; zero global exige universo e avaliação íntegros,
sem desconhecidos. Falha/restrição não se tornam zero e preservam estado
próprio ou última publicação válida com frescor. Não há percentual, delta ou
comparação nova, e a ausência dessa linha não oculta as outras quatro.

A próxima entrega deve materializar esse wrapper e os cenários de fronteira,
múltiplas regras e contexto desconhecido. Não renomear nem reaproveitar o valor
histórico de `expiringWithin15Days`; não há API externa ou componente novo
necessário para esta anotação conceitual.

### C9 aceita — seleção de atividades críticas

O usuário aprovou C9 A em 15/10/2026. `od-audit-attention` mantém o título
**“Atividades Críticas (Últimas 24h)”** e explicita **“Eventos de risco Alto ou
Crítico”**. A lista usa `criticalActivities` com os mesmos IDs e fatos dos
eventos canônicos; não cria grupos, alertas nem linhas de provider. Médio,
Baixo, Informativo e não classificado não entram.

A referência factual é `T = events.window.endExclusive`, em UTC; a janela é
`[T-24h,T)`, preservada mesmo quando o período dos filtros é mais amplo. O
backend seleciona sobre o inventário completo admitido dessa janela, antes
da paginação: Crítico antes de Alto, instante canônico decrescente e ID
estável ascendente no empate. Depois limita a **até cinco eventos únicos**.
Não completar faltantes com rotina, risco desconhecido ou detector inventado.
Sinais locais em massa podem qualificar eventos comprovados sem criar IDs,
duplicar linhas ou aumentar a contagem bruta.

`criticalActivitiesMetadata` acompanha a lista com janela UTC, referência T,
revisões de normalização/risco, critério de níveis, limite, disponibilidade e
cobertura próprias. As quantidades observada, avaliada e desconhecida são
preservadas quando apuradas; ausências não se tornam zero. A UI consome esses
metadados para contexto, frescor e estados, sem inferir risco pelo snapshot
atual do arquivo, pelo nome da pessoa ou pelo relógio do browser.

Os filtros aprovados apenas **intersectam os IDs da lista base com o
inventário completo filtrado**, mantendo a ordem publicada. Não usam somente
a página da tabela nem buscam substitutos para repor cinco itens. Uma lista
filtrada vazia apresenta **“Nenhuma das atividades selecionadas corresponde
aos filtros.”**; não afirma ausência de outros eventos/achados fora dos cinco.
Lista base vazia só é factual com avaliação íntegra do universo declarado e
descreve a janela avaliada, sem afirmar ausência global de incidentes. Com
ingestão, identidade, instante ou classificação incompletos, preservar o
estado parcial/indisponível ou a última publicação válida com frescor.

O horário relativo de cada linha permanece ancorado em T. Filtros, paginação
e atualização da lista não alteram os KPIs D30 nem `auditSources`. Não há
comparação nova ou novo feed. Os cinco eventos da fixture histórica não
comprovam a nova seleção; lista, metadados e cenários de prioridade/interseção
devem ser materializados na próxima entrega, sem alterar `frontend_done`.

## Reconciliação final de blocos — 14/09/2026

Esta é a matriz histórica de rastreabilidade da homologação visual. Ela enumera todos os
blocos `frontend_implementation_ready` de `reconciliacao-de-lacunas.md`; suas
especificações visuais, bindings, estados, interações e composições foram
incrementados nas seções existentes de cada superfície abaixo. Atividade e
Sincronização tem quatro blocos `frontend_implementation_ready` nesta matriz;
não há limitação material `fixture_ready`.
`mutation_approved` continua um qualificador de fonte e **não** autoriza um
controle mutável nesta UI. A fixture é determinística nesta feature; em
produção, opções e resultados serão publicação dinâmica de um adapter, sem
mudar sua semântica visual.

| Superfície | Bloco reconciliado | Regiões visuais que o materializam | Fixture runtime / disponibilidade |
| --- | --- | --- | --- |
| Dashboard Executivo | resumo, armazenamento, utilização, ranking, risco e recomendações | `od-dashboard-kpis`, `od-dashboard-storage-trend`, `od-dashboard-utilization`, `od-dashboard-top-accounts`, `od-dashboard-risks`, `od-dashboard-recommendations` | `dashboard-executivo.ts`; blocos homônimos em `availability` |
| Dashboard Executivo | atividade, compartilhamento, desligamento e departamento | `od-dashboard-activity-distribution`, `od-dashboard-external-sharing`, `od-dashboard-offboarding-summary`, `od-dashboard-department-storage` | idem; disponibilidade independente por bloco |
| Contas e Armazenamento | tabela e tendência | `od-accounts-table`, `od-accounts-storage-trend` | `contas-e-armazenamento.ts`; `accounts`, `storageTrend` |
| Contas e Armazenamento | previsão, distribuições e detalhe por área | `od-accounts-forecast`, `od-accounts-utilization`, `od-accounts-department`, `od-accounts-detail` | idem; `capacityForecast`, `utilizationDistribution`, `departmentDistribution` |
| Arquivos e Conteúdo | tipos, tamanhos, idades, extensões, pastas e maiores itens | `od-content-type`, `od-content-size`, `od-content-age`, `od-content-extensions`, `od-content-folders`, `od-content-largest` | `arquivos-e-conteudo.ts`; blocos homônimos |
| Arquivos e Conteúdo | lixeira, duplicatas, sensibilidade, risco e ações rápidas | `od-files-disposal`, `od-files-duplicates`, `od-files-sensitive`, `od-files-risk`, `od-files-quick-actions` | idem; `disposal`, `duplicates`, `sensitiveContent`, `riskDistribution`, `quickActions` |
| Compartilhamento e Acessos | snapshot, D30, tendência, link, domínios e atenção | `od-sharing-kpis`, `od-sharing-table`, `od-sharing-link-type`, `od-sharing-external-trend`, `od-sharing-domains`, `od-sharing-attention` | `compartilhamento-e-acessos.ts`; todos os blocos nomeados em `availability` |
| Atividade e Sincronização | KPIs da janela selecionada, distribuição e evolução fixa de sincronização | `od-activity-kpis`, `od-sync-distribution`, `od-sync-evolution` | `atividade-e-sincronizacao.ts`; `activityByPeriod[D30]` é o padrão, `syncDistribution`, `syncTrend` |
| Atividade e Sincronização | projections D7/D90/D180 e período de atividade | `od-activity-period`, `od-activity-kpis`, `od-activity-trend`, `od-activity-department` | idem; `activityByPeriod[D7|D30|D90|D180]`, metadata e availability por janela |
| Atividade e Sincronização | dispositivo factual, Intune, Sync Health e correlação — histórico anterior à C2 | `od-activity-devices` | histórico: `deviceSources`, `devices[].intune`, `devices[].syncHealth`, `devices[].correlation`; C2 usa coleções independentes |
| Atividade e Sincronização | falhas detalhadas e KFM publicados | `od-sync-errors`, `od-kfm-detail` | idem; `syncErrors`, `kfmSummary` |
| Usuários Desligados e Retenção | casos, processo, retenção, transferências e exclusões | `od-offboarding-table`, `od-offboarding-analysis`, `od-offboard-retention-policy`, `od-offboard-department-transfer`, `od-offboard-upcoming-deletion` | `usuarios-desligados-e-retencao.ts`; disponibilidade por bloco |
| Configurações e Segurança | score, categorias, riscos, recomendações e políticas | `od-security-score`, `od-security-categories`, `od-security-risks`, `od-security-recommendations`, `od-security-policies` | `configuracoes-e-seguranca.ts`; blocos homônimos |
| Configurações e Segurança | distribuições DLP/sensibilidade, Defender, retenção e conformidade global | `od-security-dlp-distribution`, `od-security-sensitivity-distribution`, `od-security-defender-integration`, `od-security-retention-governance`, `od-security-compliance` | idem; disponibilidade independente |
| Histórico e Auditoria | KPIs, filtros, gráficos, top actors, tabela e atividades críticas | `od-audit-kpis`, `od-audit-filters`, `od-audit-analysis`, `od-audit-top-actors`, `od-audit-table`, `od-audit-attention` | `historico-e-auditoria.ts`; `auditSummary`, `filterCatalog`, etc. |
| Histórico e Auditoria | allowlist tipada e cobertura de fonte | `od-audit-detail`, `od-audit-source-coverage` | idem; `eventDetail`, `sourceCoverage` |

## Surface — Dashboard Executivo

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: controles de cabeçalho e drill-down não têm contrato de resultado`

### Product intent

Leitura consolidada de saúde, uso, risco e prioridade, na sequência KPI → análise → investigação → recomendações.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-dashboard-hero | hero | “OneDrive - Dashboard Executivo” | imagem 01 | confirmada |
| od-dashboard-tabs | tab | oito abas do OneDrive | DOCX e imagem 01 | confirmada |
| od-dashboard-kpis | kpi | “Contas Provisionadas”; “Usuários Ativos”; “Contas Inativas (> 90 dias)”; “Armazenamento Utilizado”; “Armazenamento Alocado”; “Taxa de Utilização”; “Contas Acima da Cota (≥ 80%)”; “Contas com Comp. Externo” | imagem 01; DOCX seção 1 | confirmada |
| od-dashboard-analysis | chart | “Utilização de Armazenamento”; “Evolução do Armazenamento (Últimos 12 meses)”; “Contas por Nível de Utilização” | imagem 01 | confirmada |
| od-dashboard-attention | investigation row | “Atividade das Contas (Últimos 30 dias)”; “Compartilhamentos Externos”; “Usuários Desligados com Conteúdo”; “Riscos e Alertas” | imagem 01 | confirmada |
| od-dashboard-activity-distribution | chart | “Atividade das Contas (Últimos 30 dias)” | imagem 01; fixture | reconciliada |
| od-dashboard-external-sharing | summary | “Compartilhamentos Externos” | imagem 01; fixture | reconciliada |
| od-dashboard-offboarding-summary | summary | “Usuários Desligados com Conteúdo” | imagem 01; fixture | reconciliada |
| od-dashboard-risks | list | “Riscos e Alertas” | imagem 01; fixture | reconciliada |
| od-dashboard-top-accounts | table | “Top 5 Contas por Armazenamento Utilizado” | imagem 01; fixture | reconciliada |
| od-dashboard-department-storage | chart | “Distribuição por Departamento (Armazenamento)” | imagem 01; fixture | reconciliada |
| od-dashboard-recommendations | list | “Ações Recomendadas” | imagem 01; fixture | reconciliada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-dashboard-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-dashboard-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-dashboard-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-dashboard-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-dashboard-attention | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-dashboard-activity-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-dashboard-external-sharing | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-dashboard-offboarding-summary | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-dashboard-risks | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-dashboard-top-accounts | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-dashboard-department-storage | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-dashboard-recommendations | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |

### Navigation and hero specification

Hero: categoria Microsoft 365; título e subtítulo “Visão geral da utilização, atividade, armazenamento e segurança dos OneDrives corporativos.” Atualização somente publicada. Tab bar tem Dashboard Executivo ativo e os outros sete destinos na ordem do módulo.

### KPI specification

`od-dashboard-kpis` usa os oito labels do inventário, nessa ordem, com `OperationalKpiCard` padrão. Valores seguem `summary`; capacidade tem unidade legível e utilização é percentual somente quando publicada. Cada métrica pode publicar uma comparação D30: a UI mostra variação antes de “vs. 30 dias atrás: valor anterior”, calcula percentual relativo para contagens/capacidade e pontos percentuais para utilização. Sem base anterior publicada ou nula, mostra “— comparação não publicada”. Base factual zero continua publicada: a UI mostra `vs. 30 dias atrás: 0` e normaliza a transição como `valor atual × 100%` (`0→1 = 100%`, `0→2 = 200%`, `0→0 = 0%`), sem inventar ausência de comparação. A cor é direcional nesta superfície: aumento verde, redução vermelha e estabilidade neutra. Em `2xl` são oito colunas; em `xl` e `lg`, quatro; em `sm`, duas; abaixo de `sm`, uma.

### Filter specification

not_applicable: período é um recorte do contrato, mas a fonte não aprova controle, opções ou default nesta tela.

### Chart specification

No desktop, `od-dashboard-analysis` segue a ordem Utilização de Armazenamento (3 colunas) → Evolução do Armazenamento (5) → Contas por Nível de Utilização (4); no tablet, os dois primeiros ocupam 6 colunas e o último 12, e no mobile todos empilham. Os três cards da linha usam a mesma altura. Donuts e linha só exibem categorias/séries/unidade/período publicados; a legenda lateral é tabela no desktop e empilhada no mobile. Cada um recebe resumo acessível.

`od-dashboard-storage-trend` transforma bytes publicados em TB e exibe uma casa decimal no eixo e tooltip. Publica usado e, somente quando todos os 12 pontos possuem `allocatedBytes` finito, alocado; caso contrário, declara a série alocada ausente sem preenchê-la. A linha seleciona `lineAxisVariant="nice-four-ticks"`: cada eixo recebe quatro ticks `0`, `passo`, `2×passo`, `3×passo`, onde o passo é a progressão legível aprovada a partir do maior valor finito daquele eixo. Esta variante é opt-in e não altera a escala automática padrão de outros gráficos de linha.

`od-dashboard-storage-usage` preserva as cores semânticas atuais e ordena Disponível antes de Utilizado. Seu centro apresenta usado em TB, o rodapé apresenta o total alocado e a legenda é `Categoria | Valor em TB | % do total`. `od-dashboard-utilization` publica somente as faixas `0% a 50%`, `50% a 80%`, `80% a 95%` e `> 95%`.

### Table/list specification

No desktop, `od-dashboard-attention` tem quatro cards de três colunas, nesta ordem: atividade → compartilhamentos → desligamentos → riscos. No tablet, cada card ocupa seis colunas; no mobile, uma coluna. A atividade publica as quatro faixas aprovadas e participação publicada. Compartilhamentos e desligamentos mostram quatro linhas cada, e riscos mostra cinco linhas; toda linha tem ícone, rótulo e valor factual. O ícone é a composição tipada de `family` e `tone`, resolvida por mapper central sem inferência do rótulo ou prioridade. A prioridade publicada dos riscos não é texto visível.

No desktop, a linha seguinte é `od-dashboard-top-accounts` (5 colunas) → `od-dashboard-department-storage` (3) → `od-dashboard-recommendations` (4). No tablet, ranking ocupa 12 colunas, departamento e recomendações 6 cada; no mobile, empilham. O ranking usa tabela embutida com `Usuário | Departamento | Armazenamento | % da Cota`, cinco linhas publicadas e sem tendência. Recomendações publicam cinco itens com ícone tipado e badge localizado de prioridade; vazio factual não é indisponibilidade.

### Detail specification

Ranking, risco e recomendação são leitura nesta versão: o tipo runtime não
publica destino de investigação serializável. Não há link, drill-down ou filtro
inferido; uma extensão futura exigirá contrato tipado antes de habilitar navegação.

### Action specification

not_applicable: nenhuma ação mutável autorizada.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `summary.provisionedAccounts`, `activeUsers`, `inactiveAccountsOver90Days`, capacidade em `storage*Bytes` e `utilizationPercent` alimentam `od-dashboard-kpis` como inteiro, bytes e percentual; `null` substitui somente o card/bloco por disponibilidade. `storageTrend[]`, `utilizationDistribution[]` e `departmentDistribution[]` alimentam análises; `activityDistribution[]` alimenta a primeira posição de investigação. `storageTrend` é convertido para TB na superfície e só inclui a série alocada quando integralmente publicada. `sharingSummary.items[]`, `offboardingSummary.items[]` e `risks[]` mantêm período/evidência/availability próprios; os itens de resumo e risco publicam `icon.family`, `icon.tone` e valor factual, sem inferência visual pelo texto. `topAccounts[]` publica cinco contas com departamento, armazenamento e percentual da cota; `recommendations[]` publica cinco ações com ícone e prioridade localizada. `healthScore` permanece tipado e presente nas fixtures para futura integração backend, mas não possui região materializada no Dashboard Executivo. `availability` é lido por bloco e o overlay de cenário preserva os dados confirmados.

`od-dashboard-storage-trend`, `od-dashboard-utilization` e `od-dashboard-activity-distribution` são regiões independentes: line de 12 meses e donuts com legenda tabela. A linha de armazenamento usa TB e `nice-four-ticks`; a utilização usa Disponível → Utilizado, total alocado no rodapé e valores de legenda em TB. Dados de unidade, estado, atualização e cobertura permanecem no contrato e nos resumos acessíveis, mas não são renderizados como texto abaixo dos cards do Dashboard Executivo. `od-dashboard-external-sharing` usa `sharingSummary.period` (D30) e quatro itens tipados; `od-dashboard-offboarding-summary` usa quatro itens tipados; `od-dashboard-risks` usa cinco riscos tipados, sem expor a prioridade técnica como texto. `od-dashboard-department-storage` usa bytes/participação por departamento. Ranking e listas não recebem link/CTA sem `investigation` publicado.

### State composition

Aplica a convenção global por bloco; `partial` preserva blocos publicados e `stale` mantém o último snapshot datado.

### Interaction contract

Tabs navegam por teclado/ponteiro, carregam rota e movem foco ao `h1` de destino. Ranking, risco e recomendação não são links nesta versão; não há destino ou filtro inferido.

### Desktop composition

Grade de 12: hero/tabs/KPIs em 12; análises em 3/5/4; investigação em atividade/compartilhamentos/desligamentos/riscos, cada qual em três colunas; ranking/departamento/recomendações em 5/3/4. Uma rolagem principal.

### Tablet composition

KPIs passam a quatro colunas; análises ficam 6/6/12; investigação fica em pares de seis; ranking ocupa 12 e departamento/recomendações ficam 6/6; donut empilha legenda.

### Mobile composition

Hero, tabs, KPIs, análises e listas empilham. Tabs permanecem acessíveis com overflow horizontal.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-dashboard-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-dashboard-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-dashboard-kpis` | `2xl` | 12 | 3 | always | 8→4→2→1 colunas |
| `od-dashboard-analysis` | `lg` | 12 | 4 | always | 3/5/4→6/6/12 |
| `od-dashboard-attention` | `lg` | 12 | 5 | always | 3/3/3/3→6/6→1 |
| `od-dashboard-storage-trend` | `lg` | 4→6→12 | 4 | own availability | line before utilization/activity |
| `od-dashboard-utilization` | `lg` | 4→6→12 | 5 | own availability | donut legend side→stacked |
| `od-dashboard-activity-distribution` | `lg` | 4→12 | 6 | own availability | after utilization |
| `od-dashboard-external-sharing` | `lg` | 4→6→12 | 7 | own availability | independent summary |
| `od-dashboard-offboarding-summary` | `lg` | 4→6→12 | 8 | own availability | independent summary |
| `od-dashboard-department-storage` | `lg` | 4→12 | 9 | own availability | bar labels preserved |
| `od-dashboard-health-score` | `lg` | 3→6→12 | 10 | own availability | dimensions table scrolls |
| `od-dashboard-top-accounts` | `lg` | 3→6→12 | 11 | own availability | list below score |
| `od-dashboard-risks` | `lg` | 3→6→12 | 12 | own availability | textual priority |
| `od-dashboard-recommendations` | `lg` | 3→12 | 13 | own availability | final read-only list |

### Accessibility contract

Hero é `h1`; charts têm resumo textual; risco/alerta têm severidade textual; tabs chamam-se “Navegação do módulo OneDrive”.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-dashboard-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-dashboard-attention | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-activity-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-dashboard-external-sharing | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-offboarding-summary | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-risks | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-dashboard-top-accounts | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-dashboard-department-storage | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-dashboard-recommendations | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-dashboard-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | hero manual |
| `od-dashboard-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | links sem semântica de aba |
| `od-dashboard-kpis` | OperationalMetricGrid + OperationalKpiCard | columns, midColumns, ariaLabel; label, value, context, variation | operational-operationalkpicard--with-icon | http://localhost:6006/?path=/story/operational-operationalkpicard--with-icon | Card genérico |
| `od-dashboard-analysis` | ChartPanel donut/line | type, data, donutLegendLayout, donutLegendVariant, lineSeries | charts-donut--side-table | http://localhost:6006/?path=/story/charts-donut--side-table | gráfico sem legenda textual |
| `od-dashboard-attention` | OperationalSectionCard + RecommendationsList | title, children; title, items | operational-recommendationslist--em-contexto | http://localhost:6006/?path=/story/operational-recommendationslist--em-contexto | botão corretivo |

### Sponsor divergences

Valores, pessoas e ações da referência são ilustrações e não entram como conteúdo factual.

### Catalog gaps

Não há componente próprio para `partial`, `stale` ou `failed`; usam Alert/LastUpdatedIndicator conforme convenção global.

### Open decisions

Período depende de contrato/fixtures.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] Copy e títulos dos KPIs explicitados.
- [x] Estados, layout e acessibilidade definidos.
- [x] Mapping do contrato para `summary`, séries e listas por bloco.
- [x] Fixture de UI com cenário `populated` parcial e availability independente por dimensão.
- [x] Bindings de KPI/gráfico/lista reconciliados com cenário, path, tipo, unidade, nulo e ausência.

## Surface — Contas e Armazenamento

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: ações administrativas do detalhe não têm contrato operacional`

### Product intent

Inventário de contas, capacidade, atividade, risco e situação de desligamento com investigação contextual.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-accounts-hero | hero | “OneDrive - Contas e Armazenamento” | imagem 02 | confirmada |
| od-accounts-tabs | tab | oito abas do OneDrive | DOCX e imagem 02 | confirmada |
| od-accounts-kpis | kpi | “Total de Contas Provisionadas”; “Contas Ativas”; “Contas Não Provisionadas”; “Armazenamento Utilizado”; “Armazenamento Alocado”; “Taxa de Utilização”; “Contas Acima da Cota (≥ 80%)” | imagem 02; DOCX seção 2 | confirmada |
| od-accounts-filters | filter | busca sem label visível; “Status da Conta”; “Nível de Utilização”; “Departamento”; “Tipo de Licença”; “Atividade (Última vez)”; “Limpar filtros” | imagem 02 | confirmada |
| od-accounts-analysis | chart | utilização, evolução, departamento e previsão de esgotamento | imagem 02 | confirmada |
| od-accounts-table | table | “Contas do OneDrive” | imagem 02; contrato accounts | confirmada |
| od-accounts-detail | detail | Visão geral, Armazenamento, Arquivos, Compartilhamentos, Sincronização, Dispositivos, Retenção, Auditoria | design | confirmada |
| od-accounts-forecast | table | “Previsão de Esgotamento (Contas Críticas)” | contrato/fixture | reconciliada |
| od-accounts-utilization | chart | “Contas por Nível de Utilização” | imagem 02; fixture | reconciliada |
| od-accounts-department | list | “Distribuição por Departamento (Armazenamento Utilizado)” | imagem 02; fixture | reconciliada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-accounts-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-accounts-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-accounts-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-accounts-filters | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-accounts-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-accounts-table | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-accounts-detail | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-accounts-forecast | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-accounts-utilization | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-accounts-department | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Contas e Armazenamento”; “Inventário e utilização de armazenamento das contas do OneDrive.” Tab Contas e Armazenamento ativa; demais tabs seguem a ordem global.

### KPI specification

Usa os sete labels do inventário, provenientes de `summary` independente da lista paginada. Cada KPI publica valor atual e comparação D30 (`previousValue`, `periodDays: 30`): contagens/capacidade mostram variação relativa; Taxa de Utilização mostra pontos percentuais. Ausência de valor atual ou baseline nulo mostra “— comparação não publicada”. Baseline factual zero preserva `vs. 30 dias atrás: 0` e normaliza a variação como `valor atual × 100%`, antes da regra de pontos percentuais. Capacidade é formatada em unidade legível; utilização nula continua indisponível de cálculo.

### Filter specification

A barra segue busca → Status da Conta → Nível de Utilização → Departamento → Tipo de Licença → Atividade (Última vez) → Limpar filtros, sem “Ordenar por”. A busca não tem label visível, preserva nome acessível e placeholder “Pesquisar usuário ou departamento”; busca pessoa, login e departamento. O rótulo invisível reserva a mesma altura dos selects. Status, nível, departamento, licença e atividade usam somente catálogos publicados em `filters`; nível publica Normal (`< 80%`), Atenção (`80–<90%`), Alto (`90–<95%`) e Crítico (`≥95%`), e licença E3/E5. Sem catálogo, o select fica desabilitado com “Opções não publicadas”, sem texto auxiliar de associação ausente. Aplicação de filtro reseta primeira página e fecha detalhe.

### Chart specification

Na linha de análises, a ordem é `Contas por Nível de Utilização` → `Evolução do Armazenamento (Últimos 12 meses)` → `Distribuição por Departamento (Armazenamento Utilizado)` → `Previsão de Esgotamento (Contas Críticas)`. Os três primeiros repetem a composição do Dashboard Executivo: donut com faixas `0% a 50%`, `50% a 80%`, `80% a 95%` e `> 95%`; linha usado/alocado em TB com legenda, tooltip e `nice-four-ticks`; e lista com barras, capacidade e participação. Nesta superfície, a origem é o recorte ativo dos filtros.

### Table/list specification

Card `OperationalSectionCard` com título visível e caption “Contas do OneDrive”; a `OperationalTable` é embutida. Colunas: Usuário, UPN, Departamento, Status da Conta, Provisionado, Última Atividade, Armazenamento Utilizado, Armazenamento Alocado, % Utilização, Nível, Arquivos Totais, Arquivos Ativos, Compart. Externo, Risco e Ações. Não há avatar nem coluna de Retenção; retenção continua no detalhe inline. `% Utilização` combina percentual e `CapacityMeter` acessível: verde para Normal, amarelo para Atenção/Alto e vermelho para Crítico. Status da Conta usa `activityBand` localizado, e Provisionado, Nível e Risco usam `StatusBadge`; valor nulo/desconhecido é “Não publicado” neutro. Datas usam pt-BR e compartilhamento externo usa `Sim`/`Não`/`Não publicado`. Ações é um ícone de reticências: habilitado apenas com `accountDetail` publicado; caso contrário, desabilitado com tooltip “Detalhe não publicado”. Paginação preserva somente `Anterior`/`Próxima`, sem páginas numéricas, e usa `accounts.pageSize: 10`; scroll horizontal.

### Detail specification

Linha selecionada abre `InlineDetailPanel`; título é pessoa publicada e subtítulo é UPN publicado. Fecha por botão/ESC, foco no título e retorno ao gatilho; preserva filtros/ordenação/página.

### Action specification

O ícone de reticências é somente um gatilho local de leitura para `accountDetail` publicado; não abre menu e não autoriza ação administrativa. Sem detalhe publicado, permanece desabilitado com tooltip factual.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `summary` alimenta `od-accounts-kpis` com os sete valores e seus baselines D30, sem depender de filtros ou paginação. `filters` configura os controles; `accounts.items[]` alimenta tabela, donut e departamento, e `accountDetail` abre `od-accounts-detail`; com inventário parcial, tabela/contagem usam somente a página publicada filtrada, com aviso explícito e paginação desabilitada. `page`, `pageSize: 10` e `total: 12` são paginação factual. `activityBand` é a fonte do badge Status da Conta. Os filtros `activeLast30Days` e `inactiveOver90Days` usam `lastActivityAt` contra a âncora publicada de `accounts`; sem data ou âncora não inferem correspondência. `provisioned`, `utilizationLevel` e `risk` usam mappers locais tipados, sem expor enum técnico. `usedBytes`/`allocatedBytes` formatam capacidade, `utilizationPercent: null` mostra cálculo indisponível e sinais `null` não recebem tom de risco. `storageTrend[]` é publicado por conta/mês e é agregado somente para o recorte ativo; `capacityForecast[]` é filtrado pelos mesmos `accountId`. Filtros atualizam todas as análises e a tabela abaixo da barra; os KPIs acima permanecem D30. `availability` mantém forecast parcial sem esconder a tabela.

`od-accounts-storage-trend`, `od-accounts-utilization` e `od-accounts-department` têm a mesma configuração visual do Dashboard Executivo. `storageTrend[]` publica `usedBytes` e `allocatedBytes` por conta/mês: se a capacidade faltar em um ponto do recorte, a linha usada permanece e a série alocada é declarada ausente. `od-accounts-forecast` usa `OperationalTable variant="insight"` embutida com Usuário, % Utilização, Armazenamento Restante e Dias Estimados; só inclui contas críticas com projeção completa. O CTA “Ver todas as contas críticas” aplica `Crítico`, fecha detalhe, volta à página 1 e foca a tabela principal. Previsão só é publicada com 2–6 snapshots, capacidade e crescimento positivo; os estados partial/unavailable permanecem no card, sem linhas narrativas. `od-accounts-detail` agrupa Visão geral, Armazenamento, Arquivos, Compartilhamentos, Sincronização, Dispositivos, Retenção e Auditoria; cada subbloco respeita seu próprio `state`, não a availability da tabela.

### State composition

Aplica convenção global. `empty` mantém filtros; `partial` permite contas sem previsão; indisponibilidade de forecast não esconde inventário publicado.

### Interaction contract

Filtro reseta página/detalhe; paginação foca caption e preserva filtro; detalhe fechado devolve foco à mesma linha.

### Desktop composition

12 colunas: KPIs/filtros em 12; quatro análises em 3/3/3/3; tabela dominante 12; detalhe 12 abaixo.

### Tablet composition

KPIs 4→2; filtros 2 colunas; análises em duas linhas de 6/6; tabela horizontal; detalhe abaixo.

### Mobile composition

KPIs, filtros e análises empilham; tabela conserva scroll horizontal e detalhe ocupa fluxo abaixo.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-accounts-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-accounts-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-accounts-kpis` | `2xl` | 12 | 3 | always | 7→4→2→1 colunas |
| `od-accounts-filters` | `2xl` | 12 | 4 | always | 7→4→2→1 colunas; busca e botão alinhados aos selects |
| `od-accounts-analysis` | `lg` | 12 | 5 | always | 3/3/3/3→6/6→1 |
| `od-accounts-table` | `lg` | 12 | 6 | always | scroll horizontal |
| `od-accounts-detail` | `md` | 12 | 7 | selected | abaixo da tabela |

### Accessibility contract

Busca tem nome acessível sem label visível; selects possuem label; tabela tem caption e label de scroll; seleção não depende de cor; detalhe segue a convenção global.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-accounts-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-accounts-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-accounts-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-accounts-filters | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-accounts-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-accounts-table | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-accounts-detail | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-accounts-forecast | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-accounts-utilization | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-accounts-department | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-accounts-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | cabeçalho sem frescor |
| `od-accounts-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | menu genérico |
| `od-accounts-kpis` | OperationalMetricGrid + OperationalKpiCard | columns, midColumns; label, value, variation, context, supportingOrder | operational-operationalkpicard--alinhamento-padrao | http://localhost:6006/?path=/story/operational-operationalkpicard--alinhamento-padrao | cards manuais |
| `od-accounts-filters` | OperationalFilterBar + Input + Select | children, columns, ariaLabel; placeholder; defaultValue | operational-operationalfilterbar--em-contexto | http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto | filtros avulsos |
| `od-accounts-analysis` | ChartPanel donut/line + OperationalSectionCard + OperationalTable embedded | type, data, `lineAxisVariant`, `lineSeries`, `donutLegend*`; tabela embutida | charts-line--nice-four-ticks | http://localhost:6006/?path=/story/charts-line--nice-four-ticks | abstração adicional ou previsão fictícia |
| `od-accounts-table` | OperationalSectionCard + OperationalTable embedded + CapacityMeter | title; caption, head, children, pagination, scrollHint, scrollLabel; value, max, tone | operational-operationaltable--em-contexto | http://localhost:6006/?path=/story/operational-operationaltable--em-contexto | cards por conta ou tabela standalone |
| `od-accounts-detail` | InlineDetailPanel | id, title, subtitle, children, ariaLive | operational-inlinedetailpanel--em-contexto | http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto | sheet/modal |

### Sponsor divergences

Ações, pessoas e previsões exemplificadas não são conteúdo factual.

### Catalog gaps

Não há componente específico de previsão ou estado parcial de coluna; compõe-se dentro de seção existente.

### Open decisions

As ações administrativas aguardam contrato operacional; os valores do fixture são apenas determinísticos para desenvolvimento.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] KPIs, filtros, colunas e detalhe nomeados.
- [x] Interação/responsividade definidos.
- [x] Mapping para `accounts` e `accountDetail`, sem copiar CSV/identidade externa ao componente.
- [x] Fixture de UI para `populated`, `empty` e `partial` sem previsão, com filtros/paginação rastreáveis.
- [x] Bindings de KPI, análise, tabela e detalhe reconciliados com cenário, path, tipo, unidade, nulo e ausência.

## Surface — Arquivos e Conteúdo

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: varredura e ações rápidas não têm contrato operacional`

### Product intent

Identificar perfil, capacidade e risco do conteúdo, sem classificar extensão isolada como maliciosa.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-content-hero | hero | “OneDrive - Arquivos e Conteúdo” | imagem 03 | confirmada |
| od-content-tabs | tab | oito abas do OneDrive | DOCX e imagem 03 | confirmada |
| od-content-kpis | kpi | “Arquivos Totais”; “Arquivos Ativos”; “Arquivos Criados (30 dias)”; “Arquivos Modificados (30 dias)”; “Arquivos Excluídos (30 dias)”; “Itens na Lixeira”; “Tamanho Total do Conteúdo” | imagem 03; DOCX seção 3 | confirmada |
| od-content-filters | filter | busca; “Proprietário”; “Departamento”; “Tipo de Arquivo”; “Status”; “Risco do Conteúdo”; “Período de Modificação”; “Limpar filtros” | imagem 03 | confirmada |
| od-content-analysis | chart | distribuição por tipo, tamanho, idade e risco | imagem 03 | confirmada |
| od-content-rankings | table | “Top Extensões de Arquivo”; “Pastas com Maior Volume (Top 10)”; “Arquivos com Maior Tamanho (Top 10)” | imagem 03 | confirmada |
| od-files-disposal | summary | “Itens na Lixeira” | imagem 03; contrato/fixture | confirmada |
| od-files-duplicates | summary | “Candidatos a duplicatas” | imagem 03; Q5 por inferência autorizada; contrato | decidida no adendo; fixture anterior preservada |
| od-files-sensitive | summary | “Arquivos Sensíveis Identificados” | imagem 03; contrato/fixture | confirmada |
| od-files-quick-actions | list | “Ações Rápidas” | imagem 03; contrato/fixture | confirmada |
| od-files-risk | list | “Conteúdo por Nível de Risco” | imagem 03; contrato/fixture | confirmada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-content-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-content-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-content-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-content-filters | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-content-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-content-rankings | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-files-disposal | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-files-duplicates | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-files-sensitive | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-files-quick-actions | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-files-risk | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Arquivos e Conteúdo”; “Visão detalhada do conteúdo armazenado nos OneDrives corporativos.” Tab Arquivos e Conteúdo ativa; demais na ordem global.

### KPI specification

Sete KPIs comparáveis: cada métrica publica valor atual e snapshot D30 (`previousValue`, `periodDays: 30`). Contagens são inteiros; tamanho tem unidade legível. A apresentação mostra variação antes de `vs. 30 dias atrás: {valor anterior}`; baseline ausente ou nulo mostra `— comparação não publicada`. O baseline factual zero continua visível no contexto; sua variação é normalizada como `valor atual × 100%` (`0→1 = 100%`, `0→2 = 200%`, `0→0 = 0%`). Em desktop amplo (`2xl`, 1536px ou mais), são sete cards em uma linha; em `xl/lg`, 4→3; em `sm`, duas colunas; em mobile, uma.

### Filter specification

Busca sem label visual usa o nome acessível e placeholder `Pesquisar arquivos, pastas ou usuários....`; o espaço de label invisível mantém o input alinhado aos selects. A ordem é Proprietário, Departamento, Tipo de Arquivo, Status, Risco do Conteúdo, Período de Modificação e Limpar filtros. `filters` publica as seis opções tipadas; período inicia em `Últimos 30 dias` e inclui `Todo o período`, que remove somente o recorte temporal. Toda alteração anuncia o resultado do recorte.

### Chart specification

`Distribuição por Tipo de Arquivo` é donut com total central e legenda lateral para Documentos, Planilhas, Apresentações, PDFs, Imagens, Vídeos e Outros. `Arquivos por Tamanho` é lista com barras, quantidade e participação nas seis faixas de “Menos de 1 MB” a “Mais de 1 GB”. `Arquivos Antigos (Última modificação)` é donut com cinco faixas de idade. `Conteúdo por Nível de Risco` segue a lista factual de Riscos e Alertas: ícone de arquivo, rótulo, contagem e percentual sobre os itens classificados do inventário filtrado para Crítico, Alto, Médio, Baixo e Informativo. A cobertura não classificada é explícita; risco ausente não é “baixo”, e denominador ausente/zero mostra `—`. O universo completo só é apresentado como tenant-wide após a condição de cobertura do adendo.

### Table/list specification

Os rankings usam `OperationalTable variant="insight"` embutida em `OperationalSectionCard`, sem grades internas: extensões têm Extensão, Quantidade e % do Total; pastas têm Pasta, Proprietário, Arquivos e Tamanho; maiores arquivos têm Arquivo, Proprietário, Tamanho e Modificado. No ranking de arquivos, Arquivo e Proprietário são truncados com tooltip do valor publicado, e Modificado mostra uma única unidade relativa a `asOf`, com a data pt-BR completa no tooltip. Pastas e arquivos são limitados aos dez maiores resultados; todas preservam caption e rolagem horizontal acessível.

### Detail specification

not_applicable: esta superfície não possui detalhe interativo de arquivo aprovado;
a leitura permanece nas análises, tabela e blocos auxiliares homologados.

### Action specification

Os cartões `Itens na Lixeira`, `Duplicatas Identificadas` e `Arquivos Sensíveis Identificados` usam `OperationalInsightSummary`: ícone, métrica/unidade, fatos secundários em `dl` e texto de CTA com seta. O CTA não é link, botão, tooltip ou handler. `Ações Rápidas` usa a mesma linguagem de lista factual de risco com quatro itens tipados por família/tom; também não possui interação.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `contentSummary` alimenta os KPIs tenant-wide; `itemCount`, `activeItemCount` e `totalBytes` reconciliam, respectivamente, as somas de `tenant.accounts[].fileCount`, `tenant.accounts[].activeFileCount` e `tenant.accounts[].usedBytes`. No cenário atual, os valores são 636, 497 e `837518622720` bytes. Os sete itens publicados em `contentSummary` têm `comparison.previousValue` para D30, incluindo as contagens; `discardedItemCount.value` reconcilia o total publicado com `disposal.itemCount`. `filters` publica os seis catálogos tipados. `contentItems` mantém `items` paginado: a página 1 traz 12 registros e `total = 636`; a fixture publica `inventory` sintético completo com 636 itens para filtros e análises locais. `items/page/pageSize/total` continuam descrevendo a página visível; `contentSummary` é snapshot independente. `sizeBytes` usa formatter de bytes. `disposal`, `duplicates`, `sensitiveContent`, `quickActions` e `riskDistribution` são blocos independentes; `null` não vira classificação segura.

As regiões de análise são `od-content-type` ← `typeDistribution[]`, `od-content-size` ← `sizeDistribution[]`, `od-content-age` ← `ageDistribution[]`, `od-content-extensions` ← `topExtensions[]`, `od-content-folders` ← `topFolders[]` e `od-content-largest` ← `largestItems[]`; todas têm availability própria. `od-files-disposal` mostra quantidade, tamanho total, item mais antigo e expiração em 30 dias a partir dos itens no recorte. `od-files-duplicates` mostra arquivos duplicados, economia potencial, grupos e última verificação; só considera grupo com ao menos dois itens no recorte. `od-files-sensitive` mostra arquivos identificados, rótulo, detecção DLP e última análise somente quando os campos foram publicados. `od-files-quick-actions` é a lista tipada, estática. `od-files-risk` deriva níveis e participação do recorte filtrado. A participação de cada extensão usa todos os itens filtrados como denominador, incluindo os sem extensão.

### State composition

Aplica convenção global; lixeira, duplicatas, sensibilidade e ações rápidas podem ter disponibilidade própria.

### Interaction contract

Os filtros locais aplicam o mesmo recorte às análises, rankings e três cartões factuais abaixo da barra; os KPIs D30 não mudam. `Status` distingue Ativo e Excluído, e propriedades ausentes continuam não publicadas, sem virar risco baixo ou categoria inventada.

### Desktop composition

KPIs/filtros em 12; quatro análises 3/3/3/3; rankings 3/5/4; quatro resumos finais 3/3/3/3.

### Tablet composition

Análises e rankings ficam 6/6/12; resumos finais ficam 6/6.

### Mobile composition

Regiões empilham com busca antes das análises, rankings e resumos finais.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-content-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-content-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-content-kpis` | `2xl` | 12 | 3 | always | 7→4→2→1 colunas |
| `od-content-filters` | `2xl` | 12 | 4 | always | 8→4→2→1 controles; botão na base |
| `od-content-analysis` | `lg` | 12 | 5 | always | 3/3/3/3→6/6/12 |
| `od-content-rankings` | `lg` | 12 | 6 | always | 3/5/4→6/6/12 |
| `od-content-final-insights` | `lg` | 12 | 7 | always | 3/3/3/3→6/6→1 |

### Accessibility contract

Tamanho, idade e risco são textuais; tooltips acessíveis cobrem nomes/caminhos truncados.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-content-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-content-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-content-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-content-filters | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-content-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-content-rankings | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-files-disposal | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-files-duplicates | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-files-sensitive | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-files-quick-actions | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-files-risk | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-content-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | hero genérico |
| `od-content-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | navegação sem abas |
| `od-content-kpis` | OperationalMetricGrid + OperationalKpiCard | columns, midColumns; label, value, context | operational-operationalkpicard--with-icon | http://localhost:6006/?path=/story/operational-operationalkpicard--with-icon | KPIs sem label |
| `od-content-filters` | OperationalFilterBar + Input + Select | children, columns; placeholder; defaultValue | operational-operationalfilterbar--em-contexto | http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto | filtros soltos |
| `od-content-analysis` | ChartPanel donut/bar | type, data, barOrientation, donutLegendLayout | charts-bar--horizontal | http://localhost:6006/?path=/story/charts-bar--horizontal | gráfico sem resumo |
| `od-content-final-insights` | OperationalInsightSummary | title, icon, value, facts, footer | operational-operationalinsightsummary--factual-summary | http://localhost:6006/?path=/story/operational-operationalinsightsummary--factual-summary | cards locais repetidos |

### Sponsor divergences

Nomes/tamanhos concretos de arquivos são ilustrações, não conteúdo do produto.

### Catalog gaps

Não há componente compartilhado dedicado para duplicidade e conteúdo sensível; as composições locais já especificadas usam os campos reconciliados da fixture runtime.

### Open decisions

Só o recorte publicado e a paginação estão prontos para binding. Detalhes mutáveis/ações rápidas permanecem futuros; filtros sem catálogo tipado continuam apenas visuais e desabilitados até a publicação do contrato, sem efeito de filtragem ou reprojeção local.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] KPIs, filtros, gráficos e colunas nomeados.
- [x] Estados de ausência diferenciados.
- [x] Mapping para `contentSummary`, `contentItems` e rankings, sem inferir sensibilidade ou risco.
- [x] Fixture de UI para `populated`/`empty` e disponibilidade independente de duplicidade, sensibilidade e risco.
- [x] Bindings de KPI, gráficos, rankings e tabela reconciliados com cenário, path, tipo, unidade, nulo e ausência.

## Surface — Compartilhamento e Acessos

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `confirmed: MVP somente leitura; mudanças de acesso são futuras`

### Product intent

Mostrar permissões, links e exposição externa para investigação, sem alterar acesso.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-sharing-hero | hero | “OneDrive - Compartilhamento e Acessos” | imagem 04 | confirmada |
| od-sharing-tabs | tab | oito abas do OneDrive | DOCX e imagem 04 | confirmada |
| od-sharing-kpis | kpi | “Itens Compartilhados”; “Compartilhamentos Externos”; “Links Anônimos”; “Links com Edição”; “Convidados Externos”; “Compart. de Alto Risco”; “Links Sem Expiração” | imagem 04; DOCX seção 4 | confirmada |
| od-sharing-analysis | chart | “Compartilhamentos por Tipo”; “Compartilhamentos Externos (Últimos 12 meses)”; “Compartilhamentos por Nível de Risco”; “Top Domínios Externos” | imagem 04 | confirmada |
| od-sharing-filters | filter | busca; “Tipo de Compartilhamento”; “Nível de Risco”; “Tipo de Acesso”; “Domínio”; “Proprietário”; “Limpar filtros” | imagem 04 | confirmada |
| od-sharing-table | table | “Compartilhamentos Recentes” | imagem 04; sharingRecords | confirmada |
| od-sharing-attention | list | “Alertas de Compartilhamento”; “Ações Recomendadas” | imagem 04 | confirmada |
| od-sharing-link-type | chart | “Compartilhamentos por Tipo” | imagem 04; contrato/fixture | reconciliada |
| od-sharing-external-trend | chart | “Compartilhamentos Externos (Últimos 12 meses)” | imagem 04; contrato/fixture | reconciliada |
| od-sharing-risk | chart | “Compartilhamentos por Nível de Risco” | imagem 04; contrato/fixture | reconciliada |
| od-sharing-domains | table | “Top Domínios Externos” | imagem 04; contrato/fixture | reconciliada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-sharing-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-sharing-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-sharing-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-sharing-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-sharing-filters | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-sharing-table | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-sharing-attention | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-sharing-link-type | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-sharing-external-trend | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-sharing-risk | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-sharing-domains | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Compartilhamento e Acessos”; subtítulo de permissões/acessos corporativos. Tab Compartilhamento e Acessos ativa; demais na ordem global.

### KPI specification

Sete labels inventariados, na ordem: Itens Compartilhados, Compartilhamentos Externos, Links Anônimos, Links com Edição, Convidados Externos, Compart. de Alto Risco e Links Sem Expiração. Cada KPI publica valor atual e baseline D30; a composição mostra variação antes de `vs. 30 dias atrás`. Comparação ausente ou nula não recebe percentual; baseline zero é factual e sua variação é normalizada como `valor atual × 100%`. A grade é `7→4→2→1` (sete colunas a partir de 1536px), sem metadado de fonte abaixo. Alto risco sempre tem texto e não presume risco baixo na ausência de classificação.

### Filter specification

Busca sem label visual tem nome acessível e reserva a altura do label para se alinhar aos cinco selects: Tipo de Compartilhamento, Nível de Risco, Tipo de Acesso, Domínio e Proprietário. O placeholder é “Pesquisar arquivo, pasta ou usuário...”. `filters` publica os catálogos tipados; `Todos` é o default de cada select. A barra usa `7→4→2→1`, com botão alinhado à base. Catálogo ausente mostra `Opções não publicadas`; catálogo publicado vazio mostra `Nenhuma opção publicada` sem simular indisponibilidade.

### Chart specification

`Compartilhamentos por Tipo` usa donut lateral, total central e as cinco categorias publicadas: Pessoas específicas, Organização (interno), Links anônimos, Convidados externos e Aplicativos/Integrações. `Compartilhamentos Externos (Últimos 12 meses)` usa gráfico combinado: barras `sharedItems` no eixo esquerdo e linha `guestRecipients` no direito, com legenda e tooltip compartilhados. `Compartilhamentos por Nível de Risco` usa donut lateral na ordem Crítico, Alto, Médio, Baixo e Informativo. `Top Domínios Externos` é uma tabela insight `Domínio | Itens`, limitada a cinco linhas e seguida de CTA estático “Ver todos os domínios →”.

### Table/list specification

`Compartilhamentos Recentes` usa `OperationalSectionCard` com `OperationalTable` embutida, caption, rolagem horizontal e paginação Anterior/Próxima. Suas 11 colunas são Data/Hora, Arquivo/Pasta, Proprietário, Tipo, Destinatário, Domínio, Acesso, Tipo do Link, Expiração, Último Acesso e Nível de Risco; `itemType` e `linkScope` permanecem no contrato, mas não são materializados. Tipo, acesso, link e risco usam mappers locais localizados; campos nulos ou desconhecidos aparecem como `Não publicado`. Expiração distingue data agendada, `Sem expiração` e `Não publicado` pelo estado tipado. O vazio continua distinto de ausência de cobertura.

`Alertas de Compartilhamento` mostra cinco itens factuais com ícone, rótulo e valor à direita. `Ações Recomendadas` mostra cinco itens com ícone e badge de prioridade localizada. Seus CTAs são texto visual estático e não materializam navegação ou ação administrativa.

### Detail specification

not_applicable: detalhe de compartilhamento ainda não tem campos/gatilho aprovados.

### Action specification

not_applicable: remover link, editar permissão, expirar e revogar não fazem parte do MVP.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. Cada métrica de `sharingSummary` contém seu baseline D30; `trendPeriod` e `recordsPeriod` identificam as duas janelas fixas restantes. A população possui 12 registros sintéticos, coerentes com as distribuições de tipo, risco, domínios e com a tendência mensal; a paginação publica 10 linhas e a segunda página contém 2. `filters` publica valores compatíveis com esses registros. `sharingRecords.items[]` expõe `linkType` separado de `linkScope`, expiração discriminada e evidências factuais para domínio bloqueado e conteúdo sensível, sem URL/link do provider. Alertas e recomendações possuem `relatedRecordIds` para o mesmo recorte factual. `availability` mantém tendências e risco indisponíveis separados dos registros publicados.

`od-sharing-link-type` usa `sharingTypeDistribution[]`; `od-sharing-external-trend` usa exclusivamente `externalTrend[].sharedItems` e `externalTrend[].guestRecipients` em `trendPeriod` de 12 meses; `od-sharing-domains` usa `externalDomains[]`; e risco usa `riskDistribution[]`. A tabela mostra, em ordem, data/hora, item, proprietário, tipo de compartilhamento, destinatário, domínio, acesso, **Tipo de link**, expiração, último acesso e risco. Filtros locais não têm filtro temporal: busca consulta item/pasta e proprietário, os cinco selects combinam por interseção, resetam página e atualizam tabela, Alertas e Recomendações. KPIs e análises acima da barra não mudam. Nenhum filtro habilita revogar, editar, expirar, remover ou notificar.

### State composition

Aplica convenção global; `partial` declara cobertura de permissões e `unavailable` não se apresenta como zero compartilhamentos.

### Interaction contract

Busca, Tipo, Risco, Acesso, Domínio e Proprietário são controles funcionais. Toda alteração retorna à primeira página, Limpar filtros restaura busca vazia e `Todos`, e o anúncio acessível informa a quantidade do recorte. Paginação preserva filtros e foca a região da tabela. Recomendações permanecem leitura sem destino.

### Desktop composition

Hero/tabs/KPIs em 12; análise 3/4/3/2; filtros 12; tabela 9; aside de atenção 3 com alertas e recomendações em duas linhas de altura compartilhada.

### Tablet composition

Análises em duas colunas (`6/6`); tabela 12 e os dois cards de atenção em `6/6` abaixo; a legenda lateral do donut preserva dados publicados.

### Mobile composition

Regiões empilham; tabela tem scroll horizontal e os controles de filtro permanecem mutáveis e acessíveis.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-sharing-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-sharing-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-sharing-kpis` | `xl` | 12 | 3 | always | 7→4→2→1 colunas |
| `od-sharing-analysis` | `lg` | 12 | 4 | always | 3/4/3/2→6/6/12 |
| `od-sharing-filters` | `md` | 12 | 5 | always | 7→4→2→1 controles |
| `od-sharing-table` | `lg` | 9→12 | 6 | always | scroll horizontal |
| `od-sharing-attention` | `lg` | 3→12 | 7 | always | duas linhas no aside → dois cards abaixo → uma coluna |

### Accessibility contract

Tipo/acesso/expiração/risco são textuais; aviso de cobertura é associado ao caption; links de investigação são distintos de ações indisponíveis.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-sharing-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-sharing-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-sharing-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-sharing-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-sharing-filters | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-sharing-table | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-sharing-attention | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-sharing-link-type | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-sharing-external-trend | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-sharing-risk | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-sharing-domains | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-sharing-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | ação ambígua |
| `od-sharing-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | navegação livre |
| `od-sharing-kpis` | OperationalMetricGrid + OperationalKpiCard | columns, midColumns; label, value, context | operational-operationalkpicard--with-icon | http://localhost:6006/?path=/story/operational-operationalkpicard--with-icon | valor zero para ausência |
| `od-sharing-analysis` | ChartPanel donut/combo + OperationalTable insight | type, data, donutLegendLayout, donutCenterValue, barSeries, lineSeries; variant, caption, head | charts-donut--side-table; charts-combo--bar-and-line-with-dual-axis; operational-operationaltable--insight | http://localhost:6006/?path=/story/charts-combo--bar-and-line-with-dual-axis | cartões como legenda lateral ou listas narrativas |
| `od-sharing-filters` | OperationalFilterBar + Input + Select | children, columns; placeholder; defaultValue | operational-operationalfilterbar--em-contexto | http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto | filtros sem labels |
| `od-sharing-table` | OperationalSectionCard + OperationalTable embedded | title; caption, head, children, pagination, scrollHint, scrollLabel | operational-operationalsectioncard--default; operational-operationaltable--embedded | http://localhost:6006/?path=/story/operational-operationaltable--embedded | tabela sem card ou cards que ocultam colunas |
| `od-sharing-attention` | OperationalSectionCard + RecommendationsList | title, children; title, items | operational-recommendationslist--em-contexto | http://localhost:6006/?path=/story/operational-recommendationslist--em-contexto | comandos de revogação |

### Sponsor divergences

Ações rápidas do sponsor foram omitidas, pois o documento declara MVP somente leitura.

### Catalog gaps

Cobertura de permissões é `Alert` em composição local; não há componente específico.

### Open decisions

O detalhe permanece sem campos/gatilho formalizados; opções dinâmicas serão responsabilidade do adapter de projeção.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] Copy dos KPIs/filtros/tabela registrado.
- [x] Escopo somente leitura preservado.
- [x] Mapping para `sharingRecords` e agregados, expondo destinatário somente quando publicado e anulável; URL/link bruto do provider continua ausente.
- [x] Fixture de UI para `populated`, `empty`, `partial`, `unavailable` e `restricted`.
- [x] Bindings de KPI, análise, tabela e alertas reconciliados com cenário, path, tipo, nulo e ausência.

## Surface — Atividade e Sincronização

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: não há contrato para corrigir sincronização ou dispositivo`

### Product intent

Identificar adoção, queda de uso, dispositivos problemáticos e risco contextual sem presumir cobertura total.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-activity-hero | hero | “OneDrive - Atividade e Sincronização” | imagem 05 | confirmada |
| od-activity-tabs | tab | oito abas do OneDrive | DOCX e imagem 05 | confirmada |
| od-activity-kpis | kpi | “Usuários Ativos ({período selecionado})”; “Arquivos Acessados ({período selecionado})”; “Arquivos Editados ({período selecionado})”; “Arquivos com atividade de compartilhamento ({período selecionado})”; “Arquivos Sincronizados ({período selecionado})”; “Erros reportados (30 dias até o snapshot)”; “Clientes com ao menos uma pasta protegida (KFM)” | imagem05; DOCX §5; Q3/C2/C6 | novos labels decididos pelo usuário; fixture anterior preservada |
| od-activity-filters | filter | “Período”; “Departamento”; “Usuário”; “Situação da Sincronização”; “Tipo de Dispositivo”; “Limpar filtros” | imagem 05 | confirmada |
| od-activity-analysis | chart | atividade de usuários, por departamento e evolução da sincronização | imagem 05 | confirmada |
| od-sync-distribution | chart | “Saúde diária reportada dos clientes OneDrive” | C2; contrato | novo significado decidido; fixture anterior preservada |
| od-activity-devices | table | “Clientes OneDrive — saúde reportada” e “Dispositivos gerenciados — Intune” | C2; devices/managedDevices | coleções independentes decididas; fixture anterior preservada |
| od-activity-period | filter | “Período de atividade” D7/D30/D90/D180 | contrato/fixture | reconciliada |
| od-sync-evolution | chart | “Evolução da Sincronização” — Dispositivos sincronizados / Erros reportados nos 30 dias até a data do snapshot | imagem05; contrato; Q3/R3 | novas medidas decididas; fixture anterior preservada |
| od-sync-errors | list | “Sync Errors” | contrato/fixture | reconciliada |
| od-kfm-detail | list | “Known Folder Move” por pasta | contrato/fixture | reconciliada |
| od-activity-attention | list | “Usuários sem Atividade”; “Alertas de Sincronização” | imagem 05 | confirmada |
| od-activity-benefits | summary | “Principais Benefícios”: Armazenamento utilizado no OneDrive; Dispositivos com pastas protegidas (clientes observados); Clientes com atualização recente e sem erro reportado | imagem05; C3/C4; contrato de Atividade | três medidas decididas; fixture histórica |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-activity-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-activity-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-activity-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-activity-filters | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-activity-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-sync-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-activity-devices | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-activity-period | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-sync-evolution | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-sync-errors | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-kfm-detail | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-activity-attention | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-activity-benefits | local_composition | Lista local de benefícios já presente na faixa KFM/benefícios/alertas, ordem volume/KFM/percentual | Backend publica cada value/unit e metadados; superfície formata bytes/clientes/percentual | Três medidas globais independentes de filtros e entre si | Apresenta armazenamento, adoção KFM e saúde reportada; não afirma backup/sucesso de transferências nem cria comparação | UI-BENEFITS-C3 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Atividade e Sincronização”; subtítulo de monitoramento de uso/atividade/sincronização. Tab Atividade e Sincronização ativa.

### KPI specification

Sete labels inventariados. Os cinco KPIs de atividade interpolam o período
selecionado: D7, D30 (padrão), D90 ou D180; valor e contexto vêm da mesma
`activityByPeriod[period]`. Falhas de sincronização e KFM não mudam com essa
seleção. KFM não recebe percentual sem denominador publicado.

Na fonte real, o KPI KFM da C2 conta clientes com ao menos uma pasta conhecida
protegida entre os que têm o conjunto avaliado; não conta pessoas nem garante
as três pastas do critério separado do score.

O KPI C6 usa `activitySummary.sharedItems` e seus `sharedItemsMetadata`
exclusivos para “Arquivos com atividade de compartilhamento”. Exibir contexto
de atividade registrada/quantidade observada, com resultado desconhecido e
cobertura preservados; não afirmar exposição vigente ou sucesso. D7/D90/D180
não mostram comparação nova desse KPI; D30 só mostra a comparação admitida
pelo contrato. A seleção não muda C1 ou inventa interseção interna/externa.

### Filter specification

`activityPeriod` lista D7/D30/D90/D180 e `activityByPeriod[period]` publica, para cada janela, resumo, tendência, departamento, metadados e availability próprios. A seleção é habilitada, mantém label/helper associado, anuncia a troca sem mover foco e altera somente esses três blocos; não reprojeta dados localmente. Departamento, Situação e Tipo preservam a composição do sponsor sem opções/publicação factual; Usuário é input visual desabilitado.

### Chart specification

Linhas/barras só usam séries publicadas; resumo inclui período, unidade, cobertura de dispositivo e frescor.

`od-sync-distribution` usa exclusivamente `clientHealthState` da fotografia
diária C2: Erro reportado, Atualizado reportado nos últimos30dias e Sem
atualização reportada nos últimos30dias. O resumo nomeia a data da fotografia,
clientes classificados e desconhecidos. Os cinco estados instantâneos da
fixture histórica não são convertidos nesta composição.

Na fonte real, `od-sync-evolution` segue a R3 do adendo: série azul
`syncedDevices` e vermelha `reportedErrors`, ambas inteiros não negativos ou
nulos, com referência/coverage independentes. Manter legendas/unidades/eixos
distintos e lacunas em meses não publicados. Esses bindings conceituais não
afirmam que os antigos dados da fixture tenham sido atualizados.

### Table/list specification

Na fonte real, `od-activity-devices` compõe duas listagens locais separadas,
com captions “Clientes OneDrive — saúde reportada” e “Dispositivos gerenciados
— Intune”. Clientes aparecem primeiro; o inventário Intune vem abaixo, com
referência/cobertura próprios. A primeira usa `devices`: cliente, pessoa
opcional, plataforma, versão, KFM, último reporte de estado atualizado e
`clientHealthState`. A segunda usa `managedDevices`: identidade, pessoa
opcional, plataforma, gerenciamento, conformidade, risco e última sincronização
de gerenciamento. Campos não publicados preservam seu estado, sem join ou
enriquecimento entre linhas. Não há total somado dos dois inventários.

Cada coleção preserva sua paginação e estado sem alterar a outra; ambas
mantêm caption e rolagem horizontal acessíveis em telas estreitas. Listas de
inatividade/alerta não inventam causa. Essa composição local não cria API de
componente nova; os bindings/cenários ainda devem ser materializados na
entrega futura.

`od-activity-benefits` mantém a lista Principais Benefícios na posição central
da faixa inferior. A linha de volume C3 apresenta “Armazenamento utilizado no
OneDrive”; depois vêm “Dispositivos com pastas protegidas”, identificados como
clientes observados, e “Clientes com atualização recente e sem erro reportado”.
Cada medida mantém valor/unidade e metadados próprios, sem comparação nova.
A razão C4 substitui o significado anterior mediante aprovação expressa; o
dado histórico não é convertido para a nova medida.

### Detail specification

not_applicable: contrato ainda não enumera detalhe de dispositivo/pessoa.

### Action specification

not_applicable: pausar, corrigir ou gerenciar dispositivo não é autorizado.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `activityPeriod` lista D7/D30/D90/D180 e `activityByPeriod[period]` fornece `activitySummary`, `activityTrend[]`, `departmentActivity[]`, metadados, `asOf` e availability da janela selecionada. `syncTrendPeriod` fixa os 12 meses e `syncTrend[]` permanece independente. `kfmSummary.folders[]`, `inactiveUsers[]` e `alerts[]` alimentam regiões próprias. As contagens são inteiros datados por `period`; `syncOperations: null` e disponibilidade parcial têm painel próprio, sem tom saudável nem zero sintético.

`od-activity-period` seleciona uma projection publicada, sem reprojeção; `od-sync-evolution` é a série fixa de 12 meses em `syncTrend[]`. Toda série usa metadata de granularidade, timezone, unidade, coverage e `asOf`. `od-sync-distribution` e `od-sync-evolution` não apresentam Sync Health ausente ou falhas não publicadas como saudável/zero. `od-sync-errors` referencia a chave opaca exclusiva `syncHealthDeviceKey`; `od-kfm-detail` usa versão e KFM publicados e anuncia cada pasta como aplicado de total. `od-activity-devices` nomeia as datas e fontes explicitamente. Ausência é availability, não “não aplicado”.

Os bindings acima descrevem a fixture histórica. Na fonte real, C2 usa
`devices[].clientHealthState`/`syncDistribution` e `managedDevices` independente;
não migra valores de `devices[].intune`/`correlation` ou dos cinco códigos
antigos por simples renomeação. `kfmSummary` conta clientes avaliados com ao
menos uma pasta protegida e publica universo próprio por pasta. R3 mensal,
Reports e as janelas A2 conservam seus bindings e disponibilidade independentes.

Para Principais Benefícios, o novo binding conceitual de volume é
`benefitMetrics.storageUsedBytes.value`, vindo do snapshot canônico Reports de
Contas, com `unit: byte`. KFM usa `benefitMetrics.protectedFolderClients.value`,
`unit: client`, igual a `kfmSummary.applied`. Percentual usa
`benefitMetrics.recentHealthyClientsPercent.value`, `unit: percent`, razão C4
publicada a uma casa decimal. Cada entrada tem asOf/coverage/availability
próprios. Não são os campos sintéticos protected-data/sync-success-rate.
Os valores globais não reagem ao recorte da atividade nem recebem comparação;
ausência e denominador zero preservam o estado explícito da medida afetada.

Na projeção do período selecionado, C6 mantém `activitySummary.sharedItems`
como arquivo distinto observado; `sharedItemsMetadata` fornece unit/period/
window/asOf/ruleVersion/identityReference/unknownResultFileCount/coverage/
availability próprios. `observedFileCount` não substitui `totalFileCount`
desconhecido. A fixture histórica não comprova esse conjunto nem os metadados;
não somar pessoa/dia/público para preencher o KPI real.

### State composition

Aplica convenção global. `partial` declara cobertura de telemetria; `empty` não significa dispositivo saudável.

### Interaction contract

D30 é o padrão; D7/D30/D90/D180 são selecionáveis e trocam somente KPI, tendência e departamento da projection correspondente. Departamento, Situação, Tipo e Usuário permanecem desabilitados com seus helpers e não alteram resultado, página ou detalhe. A tabela `od-activity-devices` pagina, foca caption e preserva o período/ordenação; a seleção não recalcula `syncTrend`, distribuição, dispositivo, erro ou KFM.

### Desktop composition

KPIs/filtros em 12; análises 4/4/4; dispositivos/situação/inatividade 7/3/2; KFM/benefícios/alertas 4/4/4.

### Tablet composition

Análises 6/6/12; tabela 12; auxiliares 6/6; filtros em duas colunas.

### Mobile composition

Empilha todas regiões; dispositivos mantêm scroll horizontal.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-activity-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-activity-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-activity-kpis` | `xl` | 12 | 3 | always | 6→4→1 colunas |
| `od-activity-filters` | `md` | 12 | 4 | always | 4→2→1 colunas |
| `od-activity-analysis` | `lg` | 12 | 5 | always | 4/4/4→6/6/12 |
| `od-activity-devices` | `lg` | 7→12 | 6 | always | scroll horizontal com colunas de origem explícita |
| `od-activity-attention` | `lg` | 5→12 | 7 | always | abaixo da tabela |
| od-activity-benefits | `lg` | 4→6→12 | 8 | own availability | centro da faixa KFM/benefícios/alertas; empilha em mobile |

### Accessibility contract

Status/conformidade/KFM usam texto e `StatusBadge` quando publicados; gráficos anunciam cobertura além de período/unidade.

Principais Benefícios anuncia cada medida com seu rótulo, valor/unidade,
referência e disponibilidade; o volume não é anunciado como protegido ou como
resultado do filtro de atividade.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-activity-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-activity-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-activity-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-activity-filters | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-activity-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-sync-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-activity-devices | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-activity-period | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-sync-evolution | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-sync-errors | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-kfm-detail | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-activity-attention | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-activity-benefits | local_composition | Composição local da lista Principais Benefícios | module_local_contract | module_local_contract: três entradas value/unit/asOf/coverage/availability, ordem volume/KFM/percentual, globais e independentes, sem ação ou comparação nova | not_applicable: composição local documentada, sem API de componente nova | not_applicable: não há preview novo nesta rodada | UI-BENEFITS-C3 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-activity-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | hero sem contexto |
| `od-activity-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | links soltos |
| `od-activity-kpis` | OperationalMetricGrid + OperationalKpiCard | columns, midColumns; label, value, context | operational-operationalkpicard--with-icon | http://localhost:6006/?path=/story/operational-operationalkpicard--with-icon | KPI sem período |
| `od-activity-filters` | OperationalFilterBar + Input + Select | children, columns; placeholder; defaultValue | operational-operationalfilterbar--em-contexto | http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto | filtro sem label |
| `od-activity-analysis` | ChartPanel line/bar | type, data, lineSeries, barOrientation | charts-line--two-series | http://localhost:6006/?path=/story/charts-line--two-series | linha vazia como ausência |
| `od-activity-devices` | OperationalTable standalone | caption, head, children, pagination, scrollHint, scrollLabel | operational-operationaltable--em-contexto | http://localhost:6006/?path=/story/operational-operationaltable--em-contexto | cards de dispositivo |
| `od-activity-attention` | OperationalSectionCard + StatusBadge | title, children; status, tone | operational-operationalsectioncard--em-contexto | http://localhost:6006/?path=/story/operational-operationalsectioncard--em-contexto | severidade só por cor |

### Sponsor divergences

Nomes de dispositivos, versões e contagens são exemplos visuais.

### Catalog gaps

Não há componente específico de saúde de sincronização; usa-se composição local de seção/tabela/status.

### Open decisions

O detalhe de dispositivo permanece sem campos/gatilho formalizados. C2 resolveu
o recorte de saúde reportada/inventários independentes; novos bindings,
catálogos e cenários dependem da próxima entrega. Não resta decisão de estado
instantâneo ou join a implementar neste recorte aprovado.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] KPIs por período, distribuição, evolução fixa, erros, KFM e atenção registrados.
- [x] Estado/cobertura acessíveis.
- [x] Mapping para `activityByPeriod[period]`, distribuição, erros e KFM, sem transformar ausência de telemetria em saudável.
- [x] Fixture de UI para `populated` parcial, `empty`, `unavailable`, `restricted`, `stale` e `failed`.
- [x] Mapping e tabela `od-activity-devices`: timestamps, availability e correlação de Sync Health e Intune publicados.
- [x] Projections D7/D90/D180: resumo, tendência e departamento próprios publicados na fixture runtime.

## Surface — Usuários Desligados e Retenção

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: comandos de transferência, retenção e exclusão não foram aprovados`

### Product intent

Priorizar conteúdo de pessoas desligadas, transferências, retenções e exclusões próximas sem automatizar workflow.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-offboarding-hero | hero | “OneDrive - Usuários Desligados e Retenção” | imagem 06 | confirmada |
| od-offboarding-tabs | tab | oito abas do OneDrive | DOCX e imagem 06 | confirmada |
| od-offboarding-kpis | kpi | “Usuários Desligados com OneDrive”; “Transferências Pendentes”; “Em Retenção”; “Aguardando Exclusão”; “Conteúdo Transferido (30 dias)”; “Armazenamento em Retenção”; “Próximos de Excluir (15 dias)” | imagem 06; DOCX seção 6 | confirmada |
| od-offboarding-analysis | chart | status, armazenamento por status e linha do tempo dos processos | imagem 06 | confirmada |
| od-offboard-retention-policy | summary | “Retenção configurada” | contrato/fixture | reconciliada |
| od-offboard-upcoming-deletion | list | “Próximos de exclusão” | contrato/fixture | reconciliada |
| od-offboard-department-transfer | chart/list | “Transferências por departamento” | contrato/fixture | reconciliada |
| od-offboarding-filters | filter | busca; Status; Departamento; Data de desligamento; Responsável pela transferência; Dias para exclusão; Limpar filtros | imagem 06 | confirmada |
| od-offboarding-table | table | “Usuários Desligados e Retenção” | imagem 06; contrato/fixture `offboardingCases` | reconciliada |
| od-offboarding-context | list/chart | “Próximos de Exclusão”; “Transferências por Departamento”; “Retenção Configurada”; “Ações Rápidas” | imagem 06 | confirmada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-offboarding-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-offboarding-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-offboarding-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-offboarding-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-offboard-retention-policy | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-offboard-upcoming-deletion | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-offboard-department-transfer | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-offboarding-filters | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-offboarding-table | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-offboarding-context | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Usuários Desligados e Retenção”; subtítulo de ciclo de vida/retenção. Tab correspondente ativa.

### KPI specification

Sete labels inventariados; conteúdo transferido declara período e armazenamento em retenção declara unidade. Cada KPI usa o padrão `OnedriveSummaryKpi`, com snapshot atual e comparação D30 somente quando publicada. Baseline nulo ou ausente mostra “— comparação não publicada”; baseline factual zero preserva `vs. 30 dias atrás: 0` e normaliza a variação como `valor atual × 100%` (`0→1 = 100%`, `0→2 = 200%`), independentemente da unidade. Nenhum progresso é inferido.

### Filter specification

Busca/selects preservam a composição do sponsor, mas esta fixture não publica catálogo/default de Status, Departamento, Data, Responsável ou Dias. Não devem inventar opções ou resultado factual; casos/analíticas usam o recorte publicado. Quando catálogo for publicado, aplicação reseta página/detalhe e anuncia resultado.

### Chart specification

Donut de status, barra de armazenamento e `ProcessProgress` só com etapas/progresso publicados. Etapas ausentes não são preenchidas.

### Table/list specification

Card `OperationalSectionCard` com título visível e caption “Usuários Desligados e Retenção”; a `OperationalTable` é embutida. Colunas: Usuário, UPN, Departamento, Data de Desligamento, Status, Armazenamento, Arquivos, Transferência para, Retenção até, Exclusão prevista, Progresso e Ações. Data de Desligamento, Retenção até e Exclusão prevista usam `dd/MM/yyyy`; Status usa `StatusBadge`; Progresso combina barra acessível e valor percentual. Transferência para e Retenção até sem fato aplicável exibem `—`; armazenamento `0 B` e arquivos `0` são valores publicados. Ações expõe “Ver detalhes” e reticências somente como controles visuais desabilitados, pois o workflow segue sem autorização.

### Detail specification

not_applicable: campos/gatilho de detalhe de caso não estão formalizados.

### Action specification

not_applicable: iniciar transferência, assumir propriedade, gerenciar retenção e agendar exclusão são pending.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `offboardingSummary` alimenta KPIs e distribuição de capacidade; `offboardingCases.items[]` alimenta tabela, com `upn`, `assignee`, `retentionUntil`, datas de exclusão e progresso. Se a coleção for parcial, filtros e contagem representam somente a página publicada, com paginação desabilitada e aviso de escopo. A janela de exclusão inclui datas entre zero e o limite selecionado. `process[]` alimenta `ProcessTimeline` somente com etapas factuais; `upcomingDeletion[]` publica pessoa, data, prazo e `caseId`; `departmentTransfers.items[]` publica departamento, `count` e `caseIds`; `retentionPolicySummary.rules[]` publica ícone, configuração e valor do tenant. No cenário populated, as quatro regras de retenção publicadas são Período padrão de retenção, Retenção para cargos críticos, Retenção legal / compliance e Usuários excluídos. Esses três agregados têm disponibilidade própria, sem criar responsável nem workflow.

`od-offboard-upcoming-deletion`, `od-offboard-department-transfer` e `od-offboard-retention-policy` materializam, respectivamente, `upcomingDeletion[]`, `departmentTransfers` e `retentionPolicySummary`; `storageByStatus`/`statusDistribution` completam a faixa contextual. Próximas Exclusões usa tabela `insight` sem cabeçalho visual para usuário/data/dias; Retenção é uma lista neutra de ícone/configuração/valor; Ações Rápidas é lista estática sem destino. Cada card factual tem availability independente: uma data de exclusão ou pessoa nula é “Não publicado”, não uma decisão implícita. O processo continua uma simulação visual read-only, não workflow Microsoft nem comando de transferência/retenção/exclusão.

### State composition

Aplica convenção global. `partial` pode manter caso sem progresso/destinatário; `coming_soon` só é automação futura, não leitura factual.

### Interaction contract

No cenário `populated`, Busca, Status, Departamento, Data, Responsável e Dias usam `filters` publicado e atualizam a coleção factual, Próximas Exclusões e Transferências por Departamento por relações explícitas de caso. Retenção Configurada representa o tenant e não depende do recorte; Ações Rápidas também não depende do recorte. Sem catálogo publicado, os controles permanecem desabilitados com helper “Filtro disponível quando o catálogo for publicado.”, não mostram loading nem alteram casos/analíticas/página. Tabela foca caption; processo não interativo anuncia progresso ou indisponibilidade.

### Desktop composition

KPIs 12; status/capacidade/processo 3/4/5; filtros/tabela 12; contexto com Próximos de Exclusão, Transferências por Departamento, Retenção Configurada e Ações Rápidas em 3/3/3/3.

### Tablet composition

Status/capacidade 6/6; processo abaixo; tabela 12; contexto em pares de seis.

### Mobile composition

Empilha regiões; processo mantém ordem; tabela tem scroll horizontal.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-offboarding-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-offboarding-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-offboarding-kpis` | `2xl` | 12 | 3 | always | 7→4→2→1 colunas |
| `od-offboarding-analysis` | `lg` | 12 | 4 | always | 3/4/5→6/6/12 |
| `od-offboarding-filters` | `md` | 12 | 5 | always | 4→2→1 colunas |
| `od-offboarding-table` | `lg` | 12 | 6 | always | scroll horizontal |
| `od-offboarding-context` | `lg` | 12 | 7 | always | 4/4/4→6/6→12 |

### Accessibility contract

Status/progresso são textuais; processo usa aria label; prazos de exclusão incluem rótulo de prazo.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-offboarding-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-offboarding-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-offboarding-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-offboarding-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-offboard-retention-policy | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-offboard-upcoming-deletion | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-offboard-department-transfer | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-offboarding-filters | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-offboarding-table | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-offboarding-context | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-offboarding-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | ação de workflow |
| `od-offboarding-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | navegação genérica |
| `od-offboarding-kpis` | OperationalMetricGrid + OnedriveSummaryKpi | columns `7→4→2→1`; label, metric, unit | operacional já validado nas abas OneDrive alinhadas | N/A — composição de módulo | métricas sem unidade ou comparação inventada |
| `od-offboarding-analysis` | ChartPanel + ProcessProgress | type, data, barOrientation; steps, progress, unavailableMessage, ariaLabel | operational-processprogress--em-contexto | http://localhost:6006/?path=/story/operational-processprogress--em-contexto | etapas inventadas |
| `od-offboarding-filters` | OperationalFilterBar + Input + Select | children, columns; placeholder; defaultValue | operational-operationalfilterbar--em-contexto | http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto | filtros dispersos |
| `od-offboarding-table` | OperationalTable standalone | caption, head, children, pagination, scrollHint, scrollLabel | operational-operationaltable--em-contexto | http://localhost:6006/?path=/story/operational-operationaltable--em-contexto | cards de caso |
| `od-offboarding-context` | OperationalSectionCard | title, children | operational-operationalsectioncard--em-contexto | http://localhost:6006/?path=/story/operational-operationalsectioncard--em-contexto | ação operacional |

### Sponsor divergences

Ações rápidas aparecem apenas como capacidade pending, sem CTA funcional.

### Catalog gaps

ProcessProgress representa etapas factuais da simulação visual, não o workflow Microsoft real; não é lacuna de catálogo nem bloqueia a UI atual.

### Open decisions

Comandos reais de workflow, transferência, retenção e exclusão continuam futuros. A paginação e a composição visual estão reconciliadas; filtros sem catálogo tipado permanecem apenas visuais e desabilitados até sua publicação, sem efeito de filtragem local.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] KPIs/processo/filtros/colunas especificados.
- [x] Ações mutáveis ausentes explicitamente.
- [x] Mapping para `offboardingSummary`, `cases` e processo, preservando campos sem destinatário como pendência.
- [x] Fixture de UI para `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`.
- [x] Bindings de KPI, distribuição, tabela e processo reconciliados com cenário, path, tipo, nulo e ausência.

## Surface — Configurações e Segurança

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: recomendações não autorizam correção de configuração`

### Product intent

Consolidar postura, riscos, políticas e recomendações sem ser editor de configuração.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-security-hero | hero | “OneDrive - Configurações e Segurança” | imagem 07 | confirmada |
| od-security-tabs | tab | oito abas do OneDrive | DOCX e imagem 07 | confirmada |
| od-security-score | kpi | “OneDrive Security Score” | imagem 07; DOCX seção 7 | confirmada |
| od-security-categories | chart | “Pontuação por Categoria” | imagem 07 | confirmada |
| od-security-risks | list | “Resumo de Riscos”; contexto “Arquivos atuais por nível de risco” | imagem07; C5; contrato de Segurança | unidade decidida; fixture histórica |
| od-security-recommendations | list | “Principais Recomendações” | imagem 07 | confirmada |
| od-security-policies | list | políticas de Compartilhamento e Links, Sincronização e Acesso, Autenticação e Acesso, Armazenamento e Limites | imagem 07 | confirmada |
| od-security-dlp-distribution | chart | “Proteção de Dados (DLP)” | imagem 07; contrato/fixture | reconciliada |
| od-security-sensitivity-distribution | chart | “Rótulos de Sensibilidade” | imagem 07; contrato/fixture | reconciliada |
| od-security-defender-integration | list | “Integração com Microsoft Defender”; linha “Alertas de segurança criados (30 dias)” | imagem07; C7; contrato | nova medida decidida pelo usuário; fixture histórica |
| od-security-retention-governance | list | “Retenção e Governança” | imagem 07; contrato/fixture | reconciliada |
| od-security-compliance | classification list | “Conformidade Global do OneDrive” — nove dimensões classificadas | imagem 07; `securityScore.categories` | reconciliada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-security-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-security-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-security-score | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-security-categories | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-security-risks | local_composition | Lista local de quatro riscos com contexto de arquivos atuais e cobertura | Backend publica counts/metadados/comparação; superfície formata contagens | Snapshot global independente de filtros/paginação; disponibilidade própria | Não mistura arquivos/eventos/grants nem completa ausência com zero | UI-RISK-C5 |
| od-security-recommendations | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-security-policies | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-security-dlp-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-security-sensitivity-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-security-defender-integration | local_composition | Lista local dos três controles, alertas criados C7 e quarentena, independentes | Backend publica medida e metadados; superfície formata alertas/contexto | Availability própria por medida, sem filtro/comparação nova C7 | Não converte alertas em ameaças confirmadas/arquivos únicos nem depende de controles ou quarentena | UI-DEFENDER-C7 |
| od-security-retention-governance | local_composition | Lista local de cinco métricas R5, com quinta linha de fim nominal C8 | Backend resolve conjunto/regras/metadados; superfície formata cada medida | Disponibilidade independente nas cinco linhas; janela UTC inclusiva própria C8, sem comparação nova | Não conta regras/casos como arquivos, não resolve holds nem promete exclusão/recuperação de espaço | UI-RETENTION-C8 |
| od-security-compliance | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Configurações e Segurança”; subtítulo de postura e políticas. Tab correspondente ativa.

### KPI specification

Security Score usa `OnedriveSummaryKpi` com a variante `classified-score` de `OperationalKpiCard`, passando nota e máximo publicados, classificação/tom resolvidos pela camada OneDrive e comparação em pontos. As faixas contínuas são `[0,50)` Crítico, `[50,70)` Atenção e `[70,100]` Bom, incluindo notas decimais sem lacunas; o componente compartilhado só apresenta os dados recebidos e não define essas regras de domínio.

### Filter specification

not_applicable: a referência não confirma filtros.

### Chart specification

Pontuação por Categoria usa uma lista de barras horizontais dentro de `OperationalSectionCard`: rótulo (com tooltip apenas no nome da categoria), barra `progressbar` e pontuação `N/100`. Barras e notas usam as faixas visuais do Security Score. Categoria sem pontuação publicada exibe “Indisponível”, sem valor acessível de progresso; no cálculo agregado do score, a dimensão indisponível contribui `0` no próprio peso e permanece no denominador, sem ser apresentada como postura coletada.

### Table/list specification

Riscos, recomendações, políticas e postura são seções de leitura. A Linha 2 é a seção “Políticas e Configurações do OneDrive”, seguida por quatro `OperationalSectionCard`: “Compartilhamento e Links”, “Sincronização e Acesso”, “Autenticação e Acesso” e “Armazenamento e Limites”. Cada card lista cinco linhas sem cabeçalho de coluna; cada linha contém nome, valor atual e ícone de status. `recommendedValue` não é uma coluna nem texto da linha; em uma divergência avaliável, o tooltip de `CircleAlert` informa o valor recomendado. `Check` acessivelmente nomeado significa alinhado, `CircleAlert` divergente e ícone neutro significa não avaliável. Grupo e item preservam disponibilidade e motivo; não há Toggle, contexto de investigação nem CTA “Ver todas as configurações”.

Em `od-security-risks`, C5 mantém quatro linhas com o contexto visível
“Arquivos atuais por nível de risco”. Informativos/desconhecidos aparecem na
cobertura, sem níveis adicionais; uma quantidade parcial fica identificada
como observada no escopo coberto. Delta D30 só aparece com os snapshots
compatíveis do adendo, sem reclassificar os valores da fixture histórica.

A Linha 3 tem quatro cards independentes na mesma faixa: “Proteção de Dados (DLP)”, “Rótulos de Sensibilidade”, “Integração com Microsoft Defender” e “Retenção e Governança”. DLP e sensibilidade são donuts com legenda lateral adaptável e total central; Defender e retenção são listas com rótulo, valor e ícone informativo/status. A faixa seguinte contém um único `OperationalSectionCard`, “Conformidade Global do OneDrive”, com projeção visual das nove categorias já publicadas em `securityScore.categories` pelo componente reutilizável `OperationalClassificationCard`; não duplica nem altera a fixture.

Na fonte real, Retenção e Governança conserva cinco métricas conforme R5:
políticas ativas, **Arquivos atuais sob retenção**, **Volume atual sob
retenção**, usuários alcançados e **Arquivos com fim nominal de retenção
(15 dias)**, conforme C8. `currentRetainedFileCount`/`currentRetainedBytes`
usam o mesmo conjunto atual comprovado; não exibem cópias/ocupaçãoPHL. Coverage
parcial identifica o subtotal do recorte, e bytes desconhecidos não ocultam
a contagem sustentada ou as outras linhas. A quinta métrica conta arquivos
atuais únicos pelo fim combinado finito entre D e D+15 datas UTC inclusivas,
não aplicações de regras ou casos. Seu wrapper e ausência são independentes;
não promete liberação, exclusão Microsoft ou espaço recuperável.
O rótulo da quinta linha pode quebrar linhas para manter “15 dias” legível
em larguras estreitas, sem ocultar unidade, referência ou disponibilidade.

Na Integração com Microsoft Defender, C7 apresenta “Alertas de segurança
criados (30 dias)” com contexto de registros observados e referência/janela
próprias. Três controles e quarentena conservam suas medidas independentes;
não multiplicar alertas por evidência nem interpretar todos os status incluídos
como ameaça confirmada. Não há comparação nova ou ação corretiva nessa linha.

### Detail specification

not_applicable: destinos/campos de investigação de política não foram formalizados.

### Action specification

not_applicable: recomendação é orientação, não comando corretivo.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `securityScore.categories[]` contém os nove pesos, notas, evidências e availability individuais; `riskSummary` alimenta o resumo D30; `policies.groups[].items[]` contém os cinco itens por grupo, valor atual, baseline recomendado, resultado da avaliação e disponibilidade. O baseline recomendado usa os valores sintéticos definidos na imagem do sponsor. `populated` apresenta quatro divergências sintéticas (edição por links anônimos permitida, sincronização em dispositivos não gerenciados permitida, KFM não aplicado e autenticação legada habilitada); os outros 16 itens estão alinhados. `partial` mantém os mesmos grupos/itens e as quatro divergências, com 19 valores avaliáveis e um item sem valor atual nem avaliação (`download-limit`); `empty` publica grupos vazios, e indisponibilidade/restrição/falha não publica valores de política. `dataProtection`, `sensitivity`, `threats`, `retention`, `complianceDomains` e `recommendations[]` ocupam postura/atenção sem habilitar ações corretivas.

`dlpPolicyDistribution`, `sensitivityDistribution`, `defenderIntegration` e `retentionGovernance` são quatro projeções independentes de composição local. Os números são sintéticos de desenvolvimento, não declarados pelo DOCX nem fatos do tenant. DLP é uma distribuição de estado da fixture, não cobertura avaliada de Purview nem a contagem de achados de `dataProtection`. Sensibilidade soma os arquivos ativos avaliados e exclui itens excluídos; “Sem rótulo” só representa avaliação concluída. Defender separa estados dos três controles, ameaças detectadas em D30 e arquivos explicitamente em quarentena. Retenção publica políticas, arquivos, bytes, usuários e vencimentos sem inferir vencimentos a partir de exclusões de usuários. A disponibilidade é independente por bloco e ausência nunca vira zero. A faixa “Conformidade Global do OneDrive” apenas reapresenta as nove dimensões de `securityScore.categories` dentro de um card; `complianceDomains` continua independente e restrito à cobertura observada de dispositivos Intune.

A população canônica de `populated` tem 12 contas, 636 arquivos (497 ativos) e `837518622720` bytes usados; os 12 itens de `contentItems` são amostra/página, não o total tenant-wide. Sensibilidade usa distribuição sintética que soma 497: Confidencial 203, Interno 153, Público 90, Restrito 36 e Sem rótulo 15. DLP usa Ativa 4, Somente Monitoramento 1, Desativada 1 e Em Teste 0 (percentuais sobre seis políticas sintéticas); Defender usa três controles ativados, uma ameaça detectada e zero itens em quarentena publicado explicitamente; Retenção usa quatro políticas, 12 arquivos, `4294967296` bytes (exibidos como 4 GB), um usuário e um vencimento nos próximos 15 dias. Esses números não alteram as outras superfícies; a Conformidade Global consome apenas as categorias de `securityScore` já publicadas.

Os números de retenção e seus campos históricos `filesInRetention` e
`preservedBytes` acima permanecem evidência sintética da homologação anterior.
Não comprovam os novos bindings `retentionGovernance.currentRetainedFileCount`
e `retentionGovernance.currentRetainedBytes` da R5; esses exigem cenário próprio,
sem renomear ou reinterpretar os dados anteriores.

Para a quinta linha, o novo binding C8 é
`retentionGovernance.filesWithNominalRetentionEnd15d.value`, unidade file,
com `referenceDate`, `window.startDateInclusive/endDateInclusive`, `asOf`,
`coverage`, `availability` e `ruleRevision` no objeto da medida. O adendo C8
define a apresentação das datas e do subtotal; sem referência ou avaliação
suficiente o valor permanece nulo. O valor sintético de
`expiringWithin15Days` acima não prova nem preenche essa nova medida.

O novo binding C7 é `defenderIntegration.reportedAlerts30d.value`, com unidade
alert, window/asOf/coverage/availability no objeto da medida. Os valores
históricos de `detectedThreats30d` não são fonte desses alertas criados; a
integração precisa publicar o novo conjunto admitido, sem renomear o número
sintético de ameaças como se comprovasse uma contagem de alertas.

Para a fonte real, `riskSummary[].value` conta arquivos atuais únicos e
`riskSummaryMetadata` fornece unidade file, referência, revisão, escopo e
cobertura. O snapshot global não muda com filtros/paginação de outras abas.
A comparação C5 é entre fotografias íntegras compatíveis exatamente30dias
apartadas pela data UTC, não entre janelas de eventos ou contagens da página.
Quantidades informativas/desconhecidas não conhecidas permanecem sem valor.

`od-security-dlp-distribution` e `od-security-sensitivity-distribution` apresentam somente as distribuições sintéticas explicitamente publicadas; não substituem achados DLP, catálogo de políticas, rótulos aplicados ou cobertura de avaliação. `od-security-defender-integration` e `od-security-retention-governance` apresentam as métricas independentes do contrato, sem inferir fatos de ausência. `od-security-compliance` reapresenta as categorias de score e não é uma fração de cobertura Intune. Políticas são somente leitura; recomendações não navegam nem executam correção nesta entrega.

### State composition

Aplica convenção global. Categoria ausente é indisponível individualmente e contribui `0` no próprio peso; o denominador permanece `100`. Sem catálogo de categorias/pesos, o bloco real permanece indisponível. Políticas indisponíveis/restritas/falhas substituem o conteúdo por seu estado próprio; disponibilidade parcial/desatualizada preserva os valores publicados e seu aviso. Status por item só mostra alinhado/divergente quando a comparação entre atual e recomendado é válida; os demais estados usam apresentação neutra e acessível.

Na quinta linha de retenção C8, parcial positivo é subtotal identificado;
parcial sem qualificante e referência ausente mantêm valor não publicado.
Zero exige avaliação íntegra, sem desconhecidos. Estado próprio da medida
preserva as outras quatro linhas, sem converter prazo nominal em data de ação.

### Interaction contract

Não há navegação ou ação corretiva em política, risco ou recomendação nesta entrega. Tooltips de categoria, recomendação e divergência de política são acessíveis por foco; apenas o nome da categoria, o texto completo da recomendação e o valor recomendado da política divergente são revelados, respectivamente.

### Desktop composition

Score/categorias/riscos/recomendações usam a largura disponível do conteúdo: abaixo de `40rem`, cada card ocupa 12 colunas; a partir de `40rem`, cada card ocupa 6; a partir de `72rem`, os spans passam a 2/3/3/4 colunas, respectivamente. A altura mínima uniforme da faixa é `18rem`. Políticas usam 1/2/4 cards em grade conforme o espaço do container; cada card tem cinco linhas sem cabeçalho e valor atual separado visualmente do nome e do status. Na Linha 3, quatro cards ocupam 12 colunas cada no mobile, 6 no tablet e 3 no desktop; a Conformidade Global ocupa 12 colunas em todos os tamanhos e seu conteúdo usa uma grade fluida que envolve todos os itens sem limite fixo.

Security Score usa `ShieldCheck`, barra e classificação de apresentação: `[0,50)` Crítico/vermelho, `[50,70)` Atenção/amarelo e `[70,100]` Bom/verde. Nota e classificação são centralizadas sobre a barra, com 24 px entre elas. Quando publicado, mostra baseline D30 e diferença em pontos. Pontuação por Categoria lista as nove dimensões canônicas em barras horizontais coloridas pelas mesmas faixas, com nota `N/100`; indisponibilidade individual continua explícita.

Resumo de Riscos apresenta Crítico, Alto, Médio e Baixo nessa ordem, com ícone e tom respectivamente vermelho, laranja, amarelo e azul; cada linha contém nível, valor atual e delta de contagem D30 quando houver baseline. Cabeçalho e valores usam as mesmas quatro colunas para manter as colunas numéricas alinhadas. Principais Recomendações mostra cinco linhas com `TriangleAlert` azul e badge de prioridade (um Crítico, dois Altos, dois Médios). O texto de cada recomendação permanece em uma linha, truncado com reticências quando necessário, e revela o texto completo em tooltip acessível por hover/foco. Ações corretivas não são habilitadas.

“Conformidade Global do OneDrive” apresenta um conjunto dinâmico de métricas em um único `OperationalSectionCard`, por meio do componente reutilizável `OperationalClassificationCard`, também documentado no Design System. Cada item recebe da tela consumidora categoria, ícone, percentual e classificação; o componente é apenas apresentacional e não soma valores nem decide faixas. A composição usa todas as nove dimensões de `securityScore.categories`, sem duplicar fixture. As faixas contínuas são `[0,25)` “Crítico”, `[25,50)` “Alto”, `[50,75)` “Atenção necessária” e `[75,100]` “Em conformidade”; não alteram as faixas do Security Score. Categoria indisponível, restrita ou com falha não recebe percentual nem classificação de score; o item preserva um rótulo neutro do estado de disponibilidade. `complianceDomains` continua separado e significa somente cobertura observada de dispositivos Intune.

### Tablet composition

Na faixa 1, os quatro cards ocupam 6 colunas cada; na Linha 2, políticas ocupam duas colunas cada; os quatro cards da Linha 3 ocupam 6 colunas cada; Conformidade Global ocupa 12 colunas. Nenhuma política é removida.

### Mobile composition

Score, categorias, riscos e recomendações empilham em uma coluna; os quatro cards de políticas também empilham e preservam cinco itens sem cabeçalho; os status permanecem nomeados para leitores de tela. Os quatro cards da Linha 3 empilham. A faixa de conformidade ocupa toda a largura e sua grade interna se adapta ao container, envolvendo todos os itens sem overflow.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-security-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-security-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-security-score` | container `40rem`/`72rem` | 12→6→2 | 3 | always | primeira região, card fluido |
| `od-security-categories` | container `40rem`/`72rem` | 12→6→3 | 4 | always | barras preservam labels |
| `od-security-risks` | container `40rem`/`72rem` | 12→6→3 | 5 | always | listas abaixo |
| `od-security-recommendations` | container `40rem`/`72rem` | 12→6→4 | 6 | own availability | lista somente leitura com texto truncado/tooltip |
| `od-security-policies` | container `40rem`/`72rem` | 1 card → 2 → 4 | 7 | always | quatro grupos de cinco itens sem cabeçalho |
| `od-security-dlp-distribution` | container `40rem`/`72rem` | 12→6→3 | 8 | own availability | distribuição DLP |
| `od-security-sensitivity-distribution` | container `40rem`/`72rem` | 12→6→3 | 9 | own availability | distribuição de rótulos |
| `od-security-defender-integration` | container `40rem`/`72rem` | 12→6→3 | 10 | own availability | controles e métricas Defender |
| `od-security-retention-governance` | container `40rem`/`72rem` | 12→6→3 | 11 | own availability | métricas rotuladas |
| `od-security-compliance` | `lg` | 12 | 12 | security-score category availability | classificação fluida de todas as dimensões publicadas |

### Accessibility contract

Score/risco têm label, status e contexto além da cor. Em políticas, os ícones têm nomes acessíveis independentes da cor (“configuração alinhada à recomendação”, “configuração divergente” ou “status não avaliável”); as linhas não são controles interativos e o valor recomendado só aparece no tooltip de divergência. Na faixa de conformidade, nome da categoria, percentual e classificação são texto visível; indisponibilidade mostra traço e estado neutro (“Indisponível”, “Acesso restrito” ou “Falha na publicação”), sem depender de cor ou inferir faixa. O texto truncado das recomendações tem alternativa completa via tooltip focável.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-security-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-security-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-security-score | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-security-categories | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-security-risks | local_composition | Composição local do Resumo de Riscos | module_local_contract | module_local_contract: quatro counts de arquivos atuais, contexto/coverage por riskSummaryMetadata e comparação C5 opcional; sem filtro/ação | not_applicable: composição local documentada, sem API nova | not_applicable: não há preview novo nesta rodada | UI-RISK-C5 |
| od-security-recommendations | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-security-policies | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-security-dlp-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-security-sensitivity-distribution | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-security-defender-integration | local_composition | Composição local de controles, alertas e quarentena | module_local_contract | module_local_contract: reportedAlerts30d com value/unit/window/asOf/coverage/availability e contexto observado, sem comparação nova; demais medidas independentes | not_applicable: composição local documentada, sem API nova | not_applicable: não há preview novo nesta rodada | UI-DEFENDER-C7 |
| od-security-retention-governance | local_composition | Composição local das cinco métricas de retenção | module_local_contract | module_local_contract: R5 e filesWithNominalRetentionEnd15d C8, referência/datas inclusivas/revisão/cobertura próprias; desconhecido sem zero, sem comparação ou promessa de exclusão | not_applicable: composição local documentada, sem API nova | not_applicable: não há preview novo nesta rodada | UI-RETENTION-C8 |
| od-security-compliance | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-security-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | ação de editar |
| `od-security-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | navegação sem aba ativa |
| `od-security-score` | OnedriveSummaryKpi + OperationalKpiCard `classified-score` | label, metric, maxValue, variant | operational-operationalkpicard--classified-score | http://localhost:6006/?path=/story/operational-operationalkpicard--classified-score | composição local do score |
| `od-security-categories` | OperationalSectionCard + lista local de `progressbar` e Tooltip | title; rótulo, score e disponibilidade da categoria | N/A — composição local da superfície | N/A | ChartPanel com série não correspondente ao contrato |
| `od-security-risks` | OperationalSectionCard + `RiskList` local | title; níveis, atual e comparação | N/A — composição local da superfície | N/A | RecommendationsList/CTA |
| `od-security-recommendations` | OperationalSectionCard + lista local, Tooltip e `StatusBadge` | title; texto e prioridade | N/A — composição local da superfície | N/A | texto multilinha ou ação corretiva |
| `od-security-policies` | OperationalSectionCard + `PolicySettingRow` local | title; atual, recomendação, avaliação e disponibilidade | N/A — composição local da superfície | N/A | Toggle ou cabeçalho de tabela |
| `od-security-compliance` | `OperationalClassificationCard` | title; itens dinâmicos com label, ícone, valor e classificação | operational-operationalclassificationcard--default | http://localhost:6006/?path=/story/operational-operationalclassificationcard--default | KPI independente por item |

### Sponsor divergences

Valores da referência são exemplos; os números das distribuições são explicitamente sintéticos para desenvolvimento. A composição é de leitura, sem habilitar edição ou remediação.

### Catalog gaps

Não há componente compartilhado de lista de políticas: a composição com `OperationalSectionCard` e `PolicySettingRow` permanece local porque essas linhas carregam semântica específica de recomendação e disponibilidade. `OperationalClassificationCard` foi implementado e catalogado no Design System para métricas classificadas dentro de um único card.

### Open decisions

As faixas do Security Score e da Conformidade Global são regras de apresentação distintas, registradas no contrato e nas decisões. Os bindings da fixture de setembro permanecem históricos; os novos bindings dos adendos seguem conceituais para a integração. Não há destino de investigação nem workflow corretivo aprovado ou implementado nesta superfície.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] Score, categorias e políticas nomeados.
- [x] Semântica somente leitura definida.
- [x] Regra e mapping de score preservam a indisponibilidade; dimensão ausente contribui `0` apenas na própria parcela e permanece no denominador `100`.
- [x] Fixture de UI para postura parcial e availability independente por categoria/política/risco.
- [x] Bindings de score, categoria, política e recomendação reconciliados com cenário, path, tipo, nulo e ausência.

## Surface — Histórico e Auditoria

### Surface metadata

- **Surface status:** `conceptual`
- **Data classification:** `data-backed`
- **Homologação anterior:** `frontend_done`; bindings de setembro preservados como histórico.
- **Handoff fonte real:** aplicar o adendo de 14/10; os cenários novos ainda não estão reconciliados.
- **Action:** `none`
- **Action reason/status:** `pending: investigação é leitura; não há remediação aprovada`

### Product intent

Pesquisar eventos de conteúdo, compartilhamento, sincronização e administração sem inferir ausência de atividade por cobertura parcial.

### Visible content inventory

| ID | Type | Text/copy | Source | Status |
| --- | --- | --- | --- | --- |
| od-audit-hero | hero | “OneDrive - Histórico e Auditoria” | imagem 08 | confirmada |
| od-audit-tabs | tab | oito abas do OneDrive | DOCX e imagem 08 | confirmada |
| od-audit-kpis | kpi | “Eventos (30 dias)”; “Usuários Únicos”; “Arquivos Afetados”; “Compartilhamentos”; “Links Anônimos Criados”; “Downloads”; “Exclusões”; “Acessos Externos” | imagem 08; DOCX seção 8 | confirmada |
| od-audit-filters | filter | “Período”; “Tipo de Evento”; “Usuário”; “Ação”; “Localização (IP)”; “Dispositivo”; “Resultado”; “Limpar filtros” | imagem 08 | confirmada |
| od-audit-analysis | chart | “Eventos por Categoria”; “Evolução de Eventos”; “Eventos por Nível de Risco”; “Top Usuários por Eventos” | imagem 08 | confirmada |
| od-audit-table | table | “Eventos Recentes”; Data/Hora, Evento, Ação, Arquivo / pasta, Proprietário, Usuário, IP / Localização, Dispositivo, Resultado e Nível de Risco | imagem 08; events | confirmada |
| od-audit-detail | detail | detalhe contextual de evento | DOCX seção 8 | confirmada |
| od-audit-attention | list | “Atividades Críticas (Últimas 24h)”; contexto “Eventos de risco Alto ou Crítico”; “Fontes de Auditoria” | imagem 08; C9 aceita para seleção/contexto | confirmada; integração conceitual |
| od-audit-top-actors | chart/list | “Top Usuários por Eventos” | contrato/fixture | reconciliada |
| od-audit-source-coverage | data block | cobertura e disponibilidade da publicação de auditoria | contrato/fixture | reconciliada |
| od-audit-sources | list | quatro fontes com ícone, nome e badge Ativo/Desativado | imagem 08; fixture | reconciliada |

### UI composition and ownership

A composição de setembro permanece referência visual. Esta tabela registra o
contrato local de apresentação para a fonte real; não declara novas props ou
nova validação Storybook. A superfície consome a publicação semântica local e
mantém os recortes independentes descritos nas especificações abaixo.

| Region/IDs | Component strategy | Composition | Data/derivation owner | State/filter relationship | Responsibility boundary (does/does not) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| od-audit-hero | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-audit-tabs | local_composition | Composição local de cabeçalho/navegação homologada | Backend publica fatos e origem; superfície ordena/formata | Ordem/aba ativa estáveis; frescor somente quando publicado | Identifica superfície e navegação; não infere sucesso da coleta | UI-BACKEND-01 |
| od-audit-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | Backend publica fatos e origem; superfície ordena/formata | Snapshot independente; período e comparação somente publicados | Formata valor/unidade; não deriva KPI da página nem cria comparação | UI-BACKEND-01 |
| od-audit-filters | local_composition | Composição local dos controles homologados | Superfície mantém seleção/reset; backend publica catálogo e universo | Filtro só altera consumidores enumerados; reset/paginação/foco conforme contrato | Aplica recorte autorizado; não fabrica opções nem filtra inventário ausente | UI-BACKEND-02 |
| od-audit-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | Backend publica fatos e origem; superfície ordena/formata | Somente recorte publicado; lacunas/cobertura preservadas | Formata série/legenda; não cria ponto, denominador nem classificação | UI-BACKEND-03 |
| od-audit-table | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-audit-detail | local_composition | Composição local da tabela/detalhe homologado | Backend publica fatos e origem; superfície ordena/formata | Seleção/página e foco pertencem à superfície; ausência no limite factual | Mostra linha/detalhe e origem; não resolve identidade nem inventa data/workflow | UI-BACKEND-04 |
| od-audit-attention | local_composition | Lista local de até cinco eventos Alto/Crítico, com fontes em bloco independente | Backend seleciona base ordenada e publica metadados; superfície formata/intersecta IDs | Janela fixa24h ancorada em T; filtros intersectam base sem reposição, sem vínculo com página visível | Não cria alertas/eventos nem confunde lista limitada/parcial com ausência de incidentes; auditSources preservado | UI-CRITICAL-C9 |
| od-audit-top-actors | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-audit-source-coverage | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |
| od-audit-sources | local_composition | Composição local da região homologada | Backend publica fatos e origem; superfície ordena/formata | Availability própria; dependências conforme contrato da região | Apresenta publicação e contexto; não coleta fonte nem preenche ausência | UI-BACKEND-01 |

### Navigation and hero specification

Hero: Microsoft 365; “OneDrive - Histórico e Auditoria”; subtítulo de rastreamento de eventos. Tab Histórico e Auditoria ativa.

### KPI specification

Oito labels inventariados; “Eventos (30 dias)” declara período. A faixa usa a comparação D30 por métrica no padrão `OnedriveSummaryKpi`; os KPIs permanecem no snapshot D30 e não mudam com os filtros. Métrica sem cobertura não se torna zero, e comparação ausente permanece não publicada.

### Filter specification

A barra segue a ordem Período, Tipo de Evento, Usuário, Ação, Localização (IP), Dispositivo, Resultado e Limpar filtros. Período e os demais valores discretos usam selects; Usuário é uma busca textual livre com correspondência parcial sem distinção entre maiúsculas/minúsculas ou acentos; Localização (IP) seleciona um par completo de endereço IP e localidade publicado no catálogo. Pares incompletos não viram opções, e eventos sem um dos dois valores não correspondem a um par selecionado. Em `2xl`, o campo IP/localidade reserva 14rem para manter visível o valor mais longo sem invadir controles vizinhos. Cada opção de período publica `value`, `availability` e razão: uma opção sem cobertura, como D90 quando só existe inventário D30, fica visível e indisponível. O período elegível oferece Últimas 24h, Últimos 7 dias e Últimos 30 dias (padrão), calculado exclusivamente na janela UTC publicada em `events.window.startInclusive` e `events.window.endExclusive`, como intervalo `[startInclusive, endExclusive)`. A barra vem após os KPIs e antes das análises: cada alteração atualiza gráficos, ranking e tabela, reseta página/detalhe, preserva demais filtros e anuncia somente quantidade e período; os KPIs acima permanecem no snapshot D30. Limpar filtros restaura D30, limpa a busca e os demais seletores, volta à primeira página e fecha o detalhe. A lista de atividades críticas intersecta os eventos publicados com o conjunto filtrado completo; fontes configuradas e seus estados não mudam com filtros de evento.

Os campos ocupam toda a largura das respectivas colunas, alinhados ao padrão da aba “Contas e Armazenamento”. A indisponibilidade de um período aparece no próprio item do menu; não há mensagem auxiliar abaixo do seletor. A faixa de KPIs também não repete explicações sobre o snapshot D30 ou o recorte aplicado. Tipo de evento, ação e resultado publicam opções `{ value, label }` na fixture: o filtro compara `value` com o evento e apresenta `label` em português, sem tradução hardcoded no componente.

### Chart specification

Quatro cartões na composição 3/4/3/2: donut de categorias com os sete rótulos da fixture, linha com um ponto por dia do recorte (30 pontos no D30, com contagens variadas), donut com os cinco níveis de risco e ranking em `OperationalSectionCard`. Categorias e riscos são exibidos pelos rótulos de `filterCatalog`, também nas descrições acessíveis. Com cobertura completa, a série filtrada conserva os dias sem eventos correspondentes com zero; não preenche lacunas quando a cobertura é parcial. O ranking ordena pelo total, mostra até cinco usuários, alinha contagens à direita sem ícone à esquerda e não oferece expansão ou navegação. O resumo acessível contém evento/unidade, período, cobertura e frescor.

### Table/list specification

Caption “Eventos Recentes”. Colunas: Data/Hora, Evento, Ação, Arquivo / pasta, Proprietário, Usuário, IP / Localização, Dispositivo, Resultado e Nível de Risco, nesta ordem. Evento, ação, resultado e risco usam os rótulos publicados nos catálogos; risco usa badge. Arquivo / pasta vem de `events.items[].item`. Proprietário usa o nome de exibição da conta resolvida por `accountContext`; Usuário é o executor em `actor`. IP e localidade aparecem juntos nessa coluna. Paginação por páginas usa `events.page/pageSize/total`, com 10 itens por página, e scroll horizontal.

Na mesma faixa, a tabela ocupa 9/12 e a coluna lateral 3/12 a partir de `lg`. A lateral tem dois cartões empilhados que acompanham a altura da tabela; em telas menores, aparecem abaixo dela. “Atividades Críticas (Últimas 24h)” mostra até cinco referências a eventos, com contexto “Eventos de risco Alto ou Crítico”, marcador de risco, ação e horário relativo ancorado em `events.window.endExclusive`. C9 seleciona a base na janela factual24h: Crítico antes de Alto, instante decrescente, ID ascendente. Os filtros intersectam os IDs dessa base com o inventário completo filtrado, mantêm sua ordem e não repõem itens removidos. “Fontes de Auditoria” lista quatro entradas com ícone, nome e badge Ativo/Desativado, usando o bloco independente `auditSources`; o status de configuração não é inferido de `sourceCoverage` e não muda com os filtros. Não exibir o resumo padrão de quantidade/cobertura acima da tabela nem detalhes de cobertura dentro do cartão de fontes.

Na fonte real, o contexto A4 “Ingestão configurada no Orkestria” acompanha
essas quatro entradas. Os badges mostram a configuração local registrada,
sem diagnosticar produto Microsoft, política, assinatura ou saúde operacional.
Registro ausente permanece não publicado/parcial; não recebe Desativado por
fallback. A disponibilidade operacional continua no limite próprio, sem ser
recalculada pelos filtros dos eventos.

### Detail specification

Seleção abre detalhe no fluxo. Campos opcionais em ordem: operação, proprietário, usuário executor, arquivo, caminho, IP, localização, dispositivo, user agent, destinatário externo, permissão, antes/depois, correlation ID, origem, JSON e ação recomendada. Fecha por botão/ESC e retorna foco à linha.

### Action specification

not_applicable: investigação não aciona bloqueio/remediação automática.

### Data bindings

Bindings sintéticos da homologação anterior. Aplicar as ressalvas e dependências
do adendo de 14/10 antes de usar estes exemplos com uma publicação real.

Fixture: `discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json`, cenário padrão `populated`. `filterCatalog` fixa D1/D7/D30/D90, os catálogos `{value,label}` de categoria/operação/resultado/risco, dispositivo e os pares completos `{ ipAddress, ipLocation }` publicados pelos eventos; `riskLevels` é lookup de exibição, não filtro. A busca de usuário consulta texto livre contra `events.inventory[].actor`, usando `events.items[]` quando não há inventário completo. `auditSummary` e todas as séries/rankings refletem a mesma coleção sintética de 150 eventos, com `pageSize: 10` (15 páginas); o trend D30 publica 30 datas variadas. `events.items[]` alimenta a página da tabela e `events.inventory[]` contém a coleção completa local usada por filtros e análises; `eventDetail` alimenta o painel no fluxo. Cada evento distingue `owner` (nome de exibição resolvido por `accountContext`), `actor` (usuário executor), `location` (caminho/local do item), `ipAddress` e `ipLocation`; o detalhe selecionado mantém IP e localidade iguais aos da linha correspondente. `criticalActivities` referencia cinco eventos das últimas 24 horas por ID. `auditSources` publica as quatro fontes e seus estados de configuração independentes de `sourceCoverage`; a disponibilidade das fontes não é inferida da cobertura de eventos. Datas são data-hora, totais são inteiros e os 16 campos de detalhe anuláveis são omitidos/mostrados como não publicados. `sourceCoverage[]` mantém a semântica de cobertura e disponibilidade sem ser apresentada como estado de ativação das fontes; nenhum campo sensível é inventado.

Para a fonte real, `criticalActivities` recebe a seleção base C9 e
`criticalActivitiesMetadata` informa janelaUTC, referência T, revisão de
normalização/risco, critério Alto/Crítico, limite cinco, contagens de avaliação,
cobertura e availability. A superfície consome o contrato local para exibir
contexto/frescor e manter os estados próprios; não cria shape de provider ou
assume zero nas contagens desconhecidas. Os cinco IDs sintéticos acima não
comprovam a nova ordenação/qualificação e não são reinterpretados. Os cenários
novos devem demonstrar prioridade, empate e lista filtrada sem reposição.

`od-audit-kpis` permanece no snapshot D30 e não muda com filtros. `od-audit-filters` aplica recorte local comum a `od-audit-analysis` (categoria/tendência/risco), `od-audit-top-actors` e tabela somente com inventário completo, âncora UTC válida e catálogo íntegro; mudança volta à página 1, fecha detalhe e anuncia somente quantidade e período. A lista de atividades críticas intersecta os IDs da base C9 com a coleção completa filtrada, preserva a ordem e não repõe itens; `auditSources` conserva o estado de configuração sem recálculo por filtro. `sourceCoverage` preserva sua semântica de cobertura e disponibilidade, sem aparecer como resumo acima da tabela ou no cartão de fontes. `od-audit-detail` tem allowlist e ordem exata: Operação, Proprietário, Usuário executor, Arquivo, Caminho, IP, Localização, Dispositivo, User agent, Destinatário externo, Permissão, Antes/depois, Correlation ID, Origem, JSON e Ação recomendada. Item que sai do recorte fecha o painel e anuncia indisponibilidade; nenhum desses campos vira link de remediação.

### State composition

Aplica convenção global. `partial` preserva disponibilidade e motivo de cobertura sem apresentá-los como status de ativação; `empty` mantém as fontes configuradas independentes da coleção vazia; `restricted` não é vazio.

Em Atividades Críticas, ausência de correspondência após filtro usa “Nenhuma
das atividades selecionadas corresponde aos filtros.” Não repõe linhas nem
afirma ausência global de incidentes. Lista base vazia só é factual com janela
e classificação íntegras; cobertura incompleta/falha preserva estado próprio
ou última publicação válida, sua referência e frescor, sem afirmar vazio factual.

### Interaction contract

Filtros resetam paginação/detalhe. Paginação preserva recorte/ordenação, foca caption; se evento desaparecer fecha detalhe, anuncia indisponibilidade e mantém consulta. Na lista C9, filtros apenas intersectam os IDs da base publicada, sem reposição; paginação da tabela não recalcula a seleção. O reset restaura a interseção da base com o recorte padrão, sem modificar a referência factual24h, os KPIs D30 ou as fontes configuradas.

### Desktop composition

Hero/tabs/KPIs em 12; filtros em 12 imediatamente após os KPIs, com oito colunas em linha em `2xl`; análise 3/4/3/2; tabela 9 e atenção 3; detalhe 12 abaixo.

### Tablet composition

Análises 6/6/12; tabela 12 e atenção abaixo; filtros quatro colunas em `xl` e duas em `md`.

### Mobile composition

KPIs/filtros/análises empilham; filtros usam uma coluna abaixo de `md`; tabela rola horizontalmente; detalhe abaixo da tabela.

### Responsive transitions

| Region/ID | Breakpoint token | Span | Order | Visibility | Transition |
| --- | --- | --- | --- | --- | --- |
| `od-audit-hero` | `md` | 12 | 1 | always | metadados empilham |
| `od-audit-tabs` | `sm` | 12 | 2 | always | overflow horizontal |
| `od-audit-kpis` | `2xl` | 12 | 3 | always | 8→4→2→1 colunas |
| `od-audit-filters` | `2xl` | 12 | 4 | always | 8→4 (`xl`)→2 (`md`)→1 colunas |
| `od-audit-analysis` | `lg` | 12 | 5 | always | 3/4/3/2→6/6/12 |
| `od-audit-table` | `lg` | 9→12 | 6 | always | scroll horizontal |
| `od-audit-detail` | `md` | 12 | 7 | selected | abaixo da tabela |
| `od-audit-attention` | `lg` | 3→12 | 8 | always | abaixo da tabela |
| `od-audit-top-actors` | `lg` | 2→6→12 | 6 | own availability | after three charts; compact ranked list |
| `od-audit-source-coverage` | `lg` | 3→12 | 9 | own availability | below critical activities; source/state/reason |

### Accessibility contract

Tabela tem caption/scroll label; o badge de risco inclui rótulo textual; detalhe omite campos nulos e preserva o estado de disponibilidade publicado.

### Component instances and Storybook evidence

#### Contrato local para o handoff da fonte real

API de componente compartilhado: nenhuma alteração proposta nesta rodada.
Esta tabela cobre a composição local, sem alegar props atuais verificadas.

| ID | Selection type | Component / variant | API status | Verified props / UI contract | Story ID(s) | Preview URL(s) | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| od-audit-hero | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-audit-tabs | local_composition | Composição local de cabeçalho/navegação homologada | module_local_contract | module_local_contract: conteúdo e destinos já homologados, disponibilidade/frescor somente publicados | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-audit-kpis | domain_adapter | Adapter de apresentação OneDrive sobre a região de KPI homologada | module_local_contract | module_local_contract: label, valor, unidade, período e comparação publicados; ausência preservada | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-audit-filters | local_composition | Composição local dos controles homologados | module_local_contract | module_local_contract: catálogo/default factuais ou controle desabilitado; estado e foco pertencem à superfície | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-02 |
| od-audit-analysis | domain_adapter | Adapter de apresentação sobre a análise homologada | module_local_contract | module_local_contract: séries, unidade, data de referência e cobertura publicadas; null sem interpolação | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-03 |
| od-audit-table | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-audit-detail | local_composition | Composição local da tabela/detalhe homologado | module_local_contract | module_local_contract: linhas/campos publicados, nulos e proveniência preservados; seleção/paginação conforme contrato | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-04 |
| od-audit-attention | local_composition | Composição local de atividades críticas e fontes independentes | module_local_contract | module_local_contract: criticalActivities/criticalActivitiesMetadata C9, até cinco IDs Alto/Crítico antes dos filtros; interseção sem reposição, janela/revisão/cobertura próprias | not_applicable: composição local documentada, sem API nova | not_applicable: não há preview novo nesta rodada | UI-CRITICAL-C9 |
| od-audit-top-actors | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-audit-source-coverage | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |
| od-audit-sources | local_composition | Composição local da região homologada | module_local_contract | module_local_contract: região existente recebe publicação local com disponibilidade, origem e contexto do adendo | not_applicable: documentação da composição local, sem API nova | not_applicable: não há preview novo nesta rodada | UI-BACKEND-01 |

#### Evidência histórica de componentes — setembro de 2026

As props e stories abaixo foram registradas na homologação anterior; não foram
reconsultadas nem alteradas neste adendo de semântica. A próxima entrega que
alterar API material deve verificar a API correspondente pelo Storybook MCP.

| ID | Component / variant | Exact verified props | Story ID | Preview URL | Rejected alternative |
| --- | --- | --- | --- | --- | --- |
| `od-audit-hero` | ModuleHero | category, title, subtitle, update | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto | hero sem frescor |
| `od-audit-tabs` | ModuleTabBar | tabs, activeKey, ariaLabel | operational-moduletabbar--em-contexto | http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto | navegação sem estado |
| `od-audit-kpis` | OperationalMetricGrid + OnedriveSummaryKpi | columns, midColumns; label, metric, comparison | operational-operationalkpicard--with-icon | http://localhost:6006/?path=/story/operational-operationalkpicard--with-icon | métricas sem período |
| `od-audit-filters` | OperationalFilterBar + Input + Select | children, columns; placeholder; defaultValue | operational-operationalfilterbar--em-contexto | http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto | filtro sem reset |
| `od-audit-analysis` | ChartPanel donut/line | type, data, donutLegendLayout, lineSeries | charts-line--two-series | http://localhost:6006/?path=/story/charts-line--two-series | gráfico sem cobertura |
| `od-audit-top-actors` | OperationalSectionCard + lista ordenada | title, children, action; aria-expanded, aria-controls | operational-operationalsectioncard--default | http://localhost:6006/?path=/story/operational-operationalsectioncard--default | ranking em cartão sem hierarquia |
| `od-audit-table` | OperationalTable standalone | caption, head, children, pagination, scrollHint, scrollLabel | operational-operationaltable--em-contexto | http://localhost:6006/?path=/story/operational-operationaltable--em-contexto | feed de eventos |
| `od-audit-detail` | InlineDetailPanel | id, title, subtitle, children, ariaLive | operational-inlinedetailpanel--em-contexto | http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto | rota obrigatória |
| `od-audit-attention` | ActivityFeed + OperationalSectionCard | title, items; title, children | operational-activityfeed--em-contexto | http://localhost:6006/?path=/story/operational-activityfeed--em-contexto | alerta estático |

### Sponsor divergences

IPs, pessoas, caminhos e eventos concretos são organização visual, não conteúdo factual.

### Catalog gaps

Aviso de cobertura de auditoria usa Alert em composição local; não há componente dedicado.

### Open decisions

A retenção de eventos foi aprovada em 90 dias na Q2. Completude por categoria continua sendo fato da publicação, não consequência de feed habilitado. A política visual está decidida: campos aprovados pelo DOCX aparecem somente quando publicados; os nulos são omitidos. O catálogo e o default dos filtros são determinísticos nesta etapa de fixture.

### Surface implementation checklist

Checklist abaixo: entrega visual anterior. A integração do adendo permanece
pendente de bindings e cenários, sem alterar o status `frontend_done` histórico.

- [x] KPIs, filtros, análise, tabela e detalhe enumerados.
- [x] Vazio/cobertura/restrição diferenciados.
- [x] Mapping e política para `auditSummary`, `events` e `eventDetail`, com minimização de campos sensíveis.
- [x] Fixture de UI para `populated`, `empty`, `partial`, `unavailable`, `restricted`, `stale` e `failed`.
- [x] Bindings de KPI, análise, tabela e detalhe reconciliados com cenário, path, tipo, nulo e ausência.

## Consolidated component matrix

| Surface | ID | Classification | Component / variant | Story ID | Preview URL |
| --- | --- | --- | --- | --- | --- |
| Todas | heroes/tabs | reuso direto | ModuleHero / ModuleTabBar | operational-modulehero--em-contexto | http://localhost:6006/?path=/story/operational-modulehero--em-contexto |
| Todas | KPI grid | reuso direto | OperationalMetricGrid + OperationalKpiCard | operational-operationalkpicard--with-icon | http://localhost:6006/?path=/story/operational-operationalkpicard--with-icon |
| Todas | estados de disponibilidade | reuso direto | DataAvailabilityPanel | operational-dataavailabilitypanel--unavailable | http://localhost:6006/?path=/story/operational-dataavailabilitypanel--unavailable |
| Analíticas | gráficos | reuso direto | ChartPanel | charts-donut--side-table | http://localhost:6006/?path=/story/charts-donut--side-table |
| Inventários | tabelas | reuso direto | OperationalTable | operational-operationaltable--em-contexto | http://localhost:6006/?path=/story/operational-operationaltable--em-contexto |
| Contas e Auditoria | detalhe | reuso direto | InlineDetailPanel | operational-inlinedetailpanel--em-contexto | http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto |

## Open UI decisions

- Exportação, relatórios, personalização e atualização não são incluídos até terem contrato de resultado; não são `coming_soon` sem aprovação explícita.
- Somente catálogos/defaults publicados tipadamente (auditoria, campos presentes em contas e, em Atividade, uma projection factual do período escolhido) podem produzir filtro factual. Controles do sponsor sem catálogo/default ou sem projection permanecem visuais e não filtram o recorte até publicação futura; ações operacionais continuam dependentes de decisão futura.
- `partial`, `stale` e `failed` usam composição documentada de Alert/LastUpdatedIndicator; um componente compartilhado só será avaliado se a implementação comprovar repetição.

## Implementation handoff checklist

### Handoff para a fonte real — outubro de 2026

- [x] Q1–Q4 e Q5 por inferência autorizada registradas, com ownership e sem API nova.
- [x] Homologação `frontend_done` anterior preservada como histórico.
- [x] Q5: universo completo B e semânticas comuns fechados, com origem da inferência explícita.
- [x] Revisão R1 aceita: retenção local 90/180/730/30 da imagem06, com origens e limites explícitos.
- [x] Revisão R2 aceita: residuais de risco por objeto, sem fallback seguro nem percentual inventado.
- [x] Revisão R3 aceita: série azul de clientes observados, vermelha de erros reportados e KPI de arquivos independente.
- [x] Revisão R4 aceita: referência manual exatamente500 sem prazo em dias; automático publicado e comparação numérica não avaliável.
- [x] Revisão R5 aceita: cinco métricas; arquivos atuais comprovadamente retidos e volume lógico do mesmo conjunto, sem reinterpretar a fixture histórica.
- [x] Revisão por imagens encerrada: 5/5 decisões aceitas e reconciliadas documentalmente.
- [x] A2/A5/A7/A8 incorporados como semânticas conceituais de apresentação sustentadas pelos contratos/mappings.
- [x] C1 aceita: partição exclusiva de arquivos compartilhados, denominador de classificados e cobertura explícita.
- [x] C2 aceita: A3 resolvida no recorte de saúde reportada/inventários independentes, com KFM e fator Intune explícitos.
- [x] A4 resolvida: configuração local de ingestão das quatro fontes, sem inferir produto/política/feed/coverage.
- [x] C3 aceita: volume global Reports em benefitMetrics.storageUsedBytes.value e região Principais Benefícios explicitamente inventariada.
- [x] C4 aceita: KFM/percentual com bindings próprios, unidades client/percent e disponibilidade independente.
- [x] C5 aceita: quatro contagens de arquivos atuais únicos, riskSummaryMetadata e comparação somente com snapshots íntegros compatíveis.
- [x] Rodada B1–B3 encerrada documentalmente: C3/C4/C5 aceitas; quatro períodos oficiais cobertos sem UI extra.
- [x] Convergência técnica15/10: criação anônima, propagação de filtros, estoque/exposição corrente, inatividade canônica e somas reportadas documentados sem nova fonte/fixture.
- [x] Reparo GA4: pessoas licenciadas com vínculo OneDrive factual, atividade da pessoa em Reports D180 e referência factual; licença/vínculo, datas ou identidade não resolvidos e pessoa sem linha preservam desconhecido, sem atividade dos próprios espaços como substituto.
- [x] Fronteiras de utilização/tamanho/idade, horizonte não negativo e faixas contínuas de score reconciliados com os contratos liberados.
- [x] C6 aceita: arquivos com atividade registrada e sharedItemsMetadata completos, comparação somente D30, sem afirmar exposição vigente/sucesso.
- [x] C7 aceita: reportedAlerts30d por criação de alertas, todos os status/classificações, sem comparação nova ou reinterpretação de detectedThreats30d.
- [x] C8 aceita: quinta linha de arquivos atuais por fim nominal combinado, wrapper próprio, datasUTC inclusivas e ausência/cobertura explícitas, sem reutilizar expiringWithin15Days.
- [x] C9 aceita: até cinco eventos Alto/Crítico priorizados antes dos filtros, metadata própria e interseção sem reposição, sem afirmar ausência de incidentes por lista limitada.
- [x] C6–C9 encerradas documentalmente: decisões expressas do usuário em15/10, bindings conceituais para a próxima entrega e fixture histórica preservada.
- [ ] Materializar os bindings/cenários novos na próxima entrega frontend.
- [ ] Rever o gate `reconciled` após essa entrega; o status conceitual não bloqueia o Discovery backend.

### Homologação visual anterior — setembro de 2026

- [x] Status, fontes, prontidão, Storybook, breakpoints, estados e acessibilidade registrados.
- [x] As oito superfícies têm IDs, copy e títulos reais dos KPIs.
- [x] Ações têm `none` e motivo; divergências são explícitas.
- [x] Matriz de fixture por superfície registra evidência disponível, paths e cenários implementados.
- [x] Fixtures de contrato Orkestria e mappings rastreáveis foram criados; `fixtures.md` e o Simulator seguem como artefatos distintos.
- [x] Bindings por ID foram reconciliados no blueprint; a implementação deve criar adapter tipado preservando o mesmo contrato.
