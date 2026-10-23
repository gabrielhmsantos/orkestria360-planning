# UI Blueprint — Microsoft 365 / Configurações

## Fontes consultadas

| Fonte | Uso e autoridade |
| --- | --- |
| `README.md`, `expectativas-do-sponsor.md`, `fontes-e-rastreabilidade.md` | Escopo, limites da versão, disponibilidade e rastreabilidade. |
| `representacao-estrutural-das-telas.md` | Nomes canônicos dos cards, ordem, faixas, spans e adaptação responsiva. |
| `*/produto.md`, `*/decisoes.md`, `*/design-sugerido.md` | Papel e restrições próprias de cada uma das oito superfícies. |
| `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Configurações/01…08*.png` | Intenção de hierarquia e densidade; não autoriza dados, ações ou componentes novos. |
| Storybook MCP em execução | Autoridade exclusiva para componentes, APIs, variantes e previews citados abaixo. |

## Estado do Storybook MCP

**Disponível.** Catálogo consultado em 2026-09-02. As APIs nomeadas neste documento foram verificadas nos respectivos documentos do MCP; os previews são URLs retornadas pelo catálogo local.

## Convenções globais de composição

- **Canvas e shell:** `PageScaffold` recebe `hero` e `children`; há uma única rolagem vertical no canvas. `ModuleHero` recebe `category`, `title`, `subtitle` e `update`; a prop `action` é deliberadamente omitida neste módulo. `ModuleTabBar` recebe `tabs` e `activeKey`. A aba ativa é a superfície corrente; em larguras estreitas, as abas seguem horizontalmente roláveis, sem remover itens.
- **Ações e escopo:** não há ações globais de Exportar, Relatórios ou Filtros avançados no hero. A consulta permanece somente de leitura para Microsoft 365. A classificação crítica local é exceção aprovada: altera exclusivamente a classificação operacional local do item, nunca a configuração Microsoft 365; fica contextual às superfícies que a publicam, não é uma ação global.
- **Rastreabilidade e datas:** o módulo não usa `SourceMetadata`. Cada região expõe somente a origem, cobertura, causa, frescor e datas que o seu contrato publicado trouxer, na anatomia própria da região; não se cria um rodapé padronizado. A data apresentada pelo hero é decidida pela tela; não se infere `sourceLastModifiedAt`, `lastObservedChangeAt` ou `lastCollectedAt`.
- **Estados de fonte:** sem leitura comparável, conector, licença, permissão, workload ou snapshot, substituir a visualização por `DataAvailabilityPanel` com `state="unavailable"`, `reason`, `source` quando publicado e `visual` correspondente (`bars`, `donut`, `line` ou `gauge`). Conteúdo que dependa de autorização usa `state="restricted"`. Não há KPI, série ou valor sintético nesses estados.
- **Padrões recorrentes de instância:**

| Região recorrente | Instância / API verificada | Decisões visuais, anatomia e estados | Alternativa rejeitada |
| --- | --- | --- | --- |
| KPI comum | `OperationalKpiCard` padrão; `label`, `value`, `context`, `qualifier`, `variation`, `supportingOrder` e `icon` somente quando previstos | Rótulo, valor/estado e contexto; `context-first` por padrão. `progress` só onde a métrica publicada exigir razão. Carregamento preserva o espaço; indisponibilidade usa a story `Unavailable` ou `DataAvailabilityPanel` conforme o bloco. | `Card` genérico: não preserva a anatomia operacional documentada. |
| Score | `OperationalKpiCard variant="score"` com `qualifier`; `progress` para cobertura quando publicado | Nota, classificação, cobertura e trava são conteúdo da tela. A trava rebaixa apenas a classificação Excelente; não cria segundo score. Sem fato comparável, painel de disponibilidade com `visual="gauge"`. | Gauge recriado com primitivos ou um score sem cobertura. |
| Seção informativa / lista local | `OperationalSectionCard(title, icon?, action?, focusTitle?)` com composição local em `children` | Cabeçalho e conteúdo somente de leitura; pares, mídia autorizada, status ou itens observados pertencem à superfície. Sem componente compartilhado porque anatomia varia por domínio. | Criar um card compartilhado para cada lista curta. |
| Tabela | `OperationalTable(head, children, caption?, footer?, pagination?, scrollHint?, scrollLabel?, variant)` | Colunas vêm do discovery; em desktop há leitura tabular. Em mobile, a apresentação é cartão empilhado com os mesmos campos, ou rolagem horizontal sinalizada por `scrollHint`/`scrollLabel`; não cria canvas vertical interno. Paginação é somente Anterior/Próxima, fornecida pela tela na API `pagination`. | Paginação numérica da referência ou uma tabela feita com `Card`. |
| Filtros | `OperationalFilterBar(children, columns?, ariaLabel?)` com `Select` da story `Filter` | Cada superfície decide os filtros publicados. Carregamento desabilita os controles; erro conserva a seleção e exibe feedback da tela. Filtro não converte indisponibilidade em ausência. | Barra de filtros inventada ou filtros que escondam cobertura. |
| Detalhe contextual | `InlineDetailPanel(title, subtitle?, action?, ariaLive="polite")` | Abre no fluxo da mesma superfície; título, fechamento e conteúdo conhecido. Em tablet/mobile move abaixo da tabela, sem painel rolável aninhado. Conteúdo restrito mostra causa e agregado seguro. | `Sheet` como fluxo padrão: cria contexto paralelo desnecessário. |
| Donut | `ChartPanel type="donut"`; `donutLegendLayout`, `donutLegendVariant`, `donutCenterValue`, `donutCenterLabel`, `donutLegendLimit`, `donutLegendNote` quando aplicáveis | Em `col-span-2` a legenda é `stacked`; em span 3+ começa `side` e muda a `stacked` abaixo da largura legível. Legenda e resumo expõem categoria/valor no DOM. Loading, vazio e indisponível seguem stories documentadas, sem dados ilustrativos. | Legenda baseada somente em cor ou um `Card` com SVG artesanal. |
| Barras | `ChartPanel type="bar"`; `barOrientation`, `barSeries`, `barValueLabel` | Vertical para composição por workload; horizontal para rankings. Série única é identificada pelo título e não ganha legenda inventada. Em mobile, a leitura vira lista por categoria/workload. | Gráfico sem resumo acessível ou com agregação implícita “Outros”. |
| Linha | `ChartPanel type="line"`; `lineSeries` somente para séries declaradas, com `height` documentada quando a tela a decidir | Eixos e período são da superfície; uma série não recebe legenda. Dados insuficientes usam disponibilidade, não linha zerada. | Linha com série ou eixo inventado. |
| Recomendações | `RecommendationsList(items)` | Lista somente de investigação, risco e contexto navegável de leitura. Indisponibilidade usa `DataAvailabilityPanel`. | `RecommendationCard` isolado para uma lista que já tem componente próprio. |

### Shell, controles e feedback

| Área | Decisão | Evidência / preview | Limites |
| --- | --- | --- | --- |
| Página e navegação | `PageScaffold` + `ModuleHero` + `ModuleTabBar`; abas: Dashboard Executivo, Configurações do Tenant, Identidade e Acesso, Colaboração e Compartilhamento, Segurança e Compliance, Configurações por Serviço, Baselines e Conformidade, Histórico e Auditoria. | `operational-pagescaffold--em-contexto`, `operational-modulehero--em-contexto`, `operational-moduletabbar--em-contexto` | A navegação identifica a superfície ativa; não define novas rotas, grupos ou permissões. |
| Ações globais | Omitidas deliberadamente. | Não aplicável | Exportar, Relatórios e Filtros avançados não são controles do hero deste módulo. A classificação crítica local, quando publicada, permanece contextual e não altera Microsoft 365. |
| Consulta e seleção | `OperationalFilterBar` e `Select` filtrável; seletor de detalhe na tabela. | `operational-operationalfilterbar--em-contexto`, `ui-select--filter`, `operational-inlinedetailpanel--em-contexto` | Filtros somente de leitura e sem esconder estados indisponíveis. |
| Disponibilidade | `DataAvailabilityPanel`. | `operational-dataavailabilitypanel--unavailable` | Sempre mostrar causa e condição habilitadora quando existentes; `restricted` não revela payload, identidade ou detalhe autorizado. A rastreabilidade disponível permanece na anatomia de cada região, sem rodapé padronizado. |

## 01. Dashboard Executivo

### Inventário visual

| Ordem | Região | Necessidade visual | Prioridade |
| --- | --- | --- | --- |
| 1 | Postura consolidada | score, cobertura e cinco KPIs de leitura | dominante |
| 2 | Alterações, risco, baseline e cobertura | estados, dois donuts, baseline e falta de coleta | média |
| 3 | Leitura por workload e criticidade | barras, evolução e Top 10 | dominante |
| 4 | Mudanças, cobertura e recomendações | tabela recente e investigação | dominante |

### Grade e proporções

- **Desktop:** faixas 1 `xl:grid-cols-6`; faixas 2–4, 12 colunas. Spans: `1×6`; `2/3/3/2/2`; `4/3/5`; `5/3/4`.
- **Tablet:** KPIs em duas colunas; demais faixas reduzem a duas colunas, preservando tabela/Top 10 antes das auxiliares.
- **Mobile:** uma coluna; donuts mudam legenda para `stacked`; tabelas preservam campos como cartões ou rolagem horizontal sinalizada.
- **Rolagem e prioridade:** somente o canvas. Score, Top 10, alterações recentes e recomendações mantêm precedência de leitura.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Microsoft 365 Configuration Score | Reuso direto | `OperationalKpiCard` `variant="score"`; `operational-operationalkpicard--score` — [preview](http://localhost:6006/?path=/story/operational-operationalkpicard--score) | Nota, qualificador, cobertura e trava; sem comparabilidade, `DataAvailabilityPanel visual="gauge"`. Rejeitado: gauge local. |
| Configurações Analisadas, Conformes, Divergentes, Críticas, Workloads com Drift | Reuso direto / composição local para lista de drift | KPI padrão, no `OperationalMetricGrid columns="xl:grid-cols-6"`; `operational-operationalkpicard--unavailable` — [preview](http://localhost:6006/?path=/story/operational-operationalkpicard--unavailable) | Cada card contém título, valor/estado e contexto. Drift pode listar workloads no conteúdo local; não infere estabilidade. Rejeitado: seis cards genéricos. |
| Alterações Pendentes, Baselines Ativos, Configurações sem Coleta | Composição local | `OperationalSectionCard`; `operational-operationalsectioncard--em-contexto` | Lista/tabela curta com estados, baseline ou razão/condição. Ausência usa painel de disponibilidade. Rejeitado: KPI para razões detalhadas. |
| Alterações Executadas (30 dias), Configurações por Risco | Reuso direto | Donut com total central, `donutLegendLayout="side"`, `donutLegendVariant="table"`; [side](http://localhost:6006/?path=/story/charts-donut--side-table), [stacked](http://localhost:6006/?path=/story/charts-donut--stacked-table) | Categorias e ordem canônicas do discovery; abaixo da largura mínima, `stacked`. Rejeitado: legenda só por cores. |
| Conformidade por Workload; Evolução do Configuration Score | Reuso direto | Barras verticais múltiplas; linha de série única. [barras](http://localhost:6006/?path=/story/charts-bar--horizontal), [linha](http://localhost:6006/?path=/story/charts-line--two-series) | Barras têm conforme/divergente/crítico; linha 0–100 e histórico insuficiente indisponível. Rejeitado: série fictícia/zero. |
| Top 10 Configurações Críticas; Alterações Observadas Recentes; Workloads sem Coleta | Reuso direto | `OperationalTable variant="embedded"`; [preview](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto) | Colunas exatamente da representação; Top 10 sem “Outros”; mobile sem perda material. Rejeitado: cards genéricos. |
| Ações Recomendadas | Reuso direto | `RecommendationsList`; [preview](http://localhost:6006/?path=/story/operational-recommendationslist--em-contexto) | Risco e contexto de investigação; sem comandos. Rejeitado: CTA de execução. |

## 02. Configurações do Tenant

### Grade e proporções

- **Desktop:** 12 colunas: `4/4/4`, `4/5/3`, depois 12. **Tablet:** duas colunas, mantendo Configurações Gerais em faixa própria. **Mobile:** uma coluna e Domínios/Configurações Gerais como cartões empilhados ou tabela horizontal sinalizada.
- **Rolagem e prioridade:** canvas único; Configurações Gerais é dominante e vem após a contextualização organizacional.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Informações da Organização; Identidade Visual do Tenant; Contatos da Organização; Sincronização e Diretórios | Composição local | `OperationalSectionCard`; [preview](http://localhost:6006/?path=/story/operational-operationalsectioncard--em-contexto) | Pares, mídia autorizada ou cartões de contato dentro do conteúdo. Dados não autorizados: `restricted`; sem fonte: `unavailable`. Rejeitado: componente compartilhado — anatomias não se repetem iguais. |
| Domínios Verificados; Configurações Gerais do Tenant | Reuso direto | `OperationalTable`; [preview](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto) | Colunas canônicas; DNS não oferece ação de gestão. Rejeitado: tabela recriada em `Card`. |
| Serviços Habilitados no Tenant | Composição local | `OperationalSectionCard` com grade local de serviço/status | Serviço, ícone quando publicado e estado; ausência de resposta não infere desabilitado. Rejeitado: KPI, pois a leitura é enumerativa. |

## 03. Identidade e Acesso

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-6`; faixas seguintes `5/4/3`, `3/3/3/3`, `7/5`. **Tablet:** duas colunas; Eventos Recentes precede recomendações. **Mobile:** uma coluna; visualizações ficam empilhadas e tabelas mantêm todos os campos.
- **Rolagem e prioridade:** canvas único; políticas e eventos são as regiões dominantes.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Seis indicadores de identidade | Reuso direto | `OperationalMetricGrid columns="xl:grid-cols-6"` + KPIs padrão | Contagem, cobertura/contexto; identidade individual `restricted`. Rejeitado: blocos customizados inconsistentes. |
| Políticas de Acesso Condicional; Eventos Recentes de Identidade | Reuso direto | `OperationalTable` | Política/evento e campos canônicos; detalhe sensível restrito. Rejeitado: lista sem estrutura de tabela. |
| Métodos de Autenticação; Funções Administrativas | Reuso direto | `ChartPanel type="donut"`, legenda `side` → `stacked`; [previews](http://localhost:6006/?path=/story/charts-donut--side-table) | Total central, categorias e ordem declarada. Sem fonte, painel `visual="donut"`. Rejeitado: porcentagem sem categoria acessível. |
| Proteção por Senha; Atribuições PIM; Aplicativos Empresariais | Composição local | `OperationalSectionCard` | Valores/contagens e contexto conhecido; PIM e identidades podem restringir detalhes. Rejeitado: novo componente de “resumo de identidade”. |
| Usuários e Acesso | Reuso direto | `ChartPanel type="bar" barOrientation="horizontal"` | Categorias MFA/risco/conta; mobile em lista. Rejeitado: donut, que prejudica comparação categórica. |
| Recomendações de Investigação | Reuso direto | `RecommendationsList` | Investigação somente leitura. Rejeitado: ação operacional. |

## 04. Colaboração e Compartilhamento

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-7`; demais faixas `4/3/3/2`, `4/3/2/3`, `7/5`. **Tablet:** duas colunas. **Mobile:** uma coluna; donuts `stacked`, linha preserva suas três séries e resumo acessível.
- **Rolagem e prioridade:** canvas único; configurações externas e alterações observadas são prioritárias.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Sete KPIs de postura | Reuso direto | `OperationalMetricGrid columns="xl:grid-cols-7"` + KPIs padrão | Nível/total/estado e contexto; propriedade sem fonte é indisponível. Rejeitado: valores presumidos. |
| Configurações de Compartilhamento Externo; Políticas de Grupos e Sites; Teams; OneDrive | Composição local | `OperationalSectionCard` | Lista de pares regra/valor. Lacuna de fonte vira painel de disponibilidade, não valor em branco. Rejeitado: tabela para listas de pares curtas. |
| Tipos de Link Padrão; Acesso de Convidados | Reuso direto | Donut `side` → `stacked`; [preview](http://localhost:6006/?path=/story/charts-donut--side-table) | Total, categorias na ordem declarada, resumo no DOM; identidades de convidados restritas. Rejeitado: card de percentual. |
| Atividade de Compartilhamento (30 dias) | Reuso direto | `ChartPanel type="line"` com `lineSeries` das três séries declaradas; [preview](http://localhost:6006/?path=/story/charts-line--two-series) | Eixos temporal/quantitativo, tooltip e resumo. Rejeitado: série consolidada, que perde o contrato. |
| Domínios Permitidos | Reuso direto | `OperationalTable` embedded + `ConfigurationPagination` | Colunas canônicas, origem e paginação local de 10 itens por página; navegação anterior/próxima preserva a publicação. Rejeitado: tabela sem indicação de origem. |
| Alterações Observadas de Compartilhamento | Reuso direto | `OperationalTable` embedded | Colunas canônicas e versão móvel. Rejeitado: tabela sem indicação de origem. |
| Recomendações de Investigação | Reuso direto | `RecommendationsList` | Risco e navegação de leitura. Rejeitado: CTA executável. |

## 05. Segurança e Compliance

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-6`; faixas `4/4/4`, `3/3/3/3`, `4/3/2/3`. **Tablet:** duas colunas, mantendo tabelas antes das auxiliares. **Mobile:** uma coluna e gráficos com resumo acessível.
- **Rolagem e prioridade:** canvas único; controles/incidentologia e configurações críticas recebem prioridade dominante.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Postura de Segurança e cinco KPIs | Reuso direto | Score em `OperationalKpiCard variant="score"`; demais KPI padrão na grade 6 | Score/classificação, cobertura e contexto; licença/fonte ausente é indisponível. Rejeitado: proteção presumida. |
| Proteções do Microsoft Defender; DLP – Principais Incidentes; Rótulos de Sensibilidade; Baselines de Segurança; Configurações Críticas Detectadas | Reuso direto | `OperationalTable` | Campos estabelecidos pelo discovery; incidentes e auditoria podem restringir conteúdo. Rejeitado: representação sem colunas. |
| Conformidade e Proteção de Dados; Políticas de Retenção | Reuso direto | Donut `side` → `stacked` | Total e categorias publicadas; ausência de política/fonte: painel `visual="donut"`. Rejeitado: KPI sem distribuição. |
| Auditoria e Monitoramento | Composição local | `OperationalSectionCard` com métricas locais | Quatro métricas com estado/contexto; sem fonte não declara controle ativo. Rejeitado: componente reutilizável, pois a anatomia não se repete confirmadamente. |
| Evolução da Postura de Segurança | Reuso direto | Linha de série única | Data/score e resumo; insuficiência histórica indisponível. Rejeitado: legenda para uma única série. |
| Workloads e Cobertura | Reuso direto | Barras horizontais | Ordem por cobertura; mobile como lista. Rejeitado: donut, que reduz comparação. |
| Recomendações de Investigação | Reuso direto | `RecommendationsList` | Sem ação de correção. Rejeitado: painel de execução. |

## 06. Configurações por Serviço

### Grade e proporções

- **Desktop:** seletores `xl:grid-cols-8`; catálogo/detalhe `2/7/3`; análises `3/3/3/3`. **Tablet:** seletores em duas colunas e catálogo antes do detalhe. **Mobile:** uma coluna: filtros, catálogo em cartões e detalhe abaixo da seleção.
- **Rolagem e prioridade:** canvas único; a tabela de Configurações do Serviço é dominante. O painel de detalhe não cria rolagem própria.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Oito cartões de workload | Composição local | `OperationalSectionCard` em grade de 8 | Nome do serviço, total e distribuição compacta somente se normalizados. Serviço sem conector mostra disponibilidade. Rejeitado: `OperationalKpiCard`, cuja anatomia não comporta o seletor de serviço. |
| Categorias | Reuso direto | `OperationalFilterBar columns="xl:grid-cols-3"` com `Select`; [previews](http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto), [select](http://localhost:6006/?path=/story/ui-select--filter) | Categoria/status/risco; `columns` só controla a casca e o span é do layout. Rejeitado: filtros dispersos. |
| Configurações do Serviço | Reuso direto | `OperationalTable` com `pagination` | Busca, colunas e seletor de detalhe; paginação Anterior/Próxima; mobile em cartões com todos os campos. Rejeitado: paginação numérica da referência. |
| Detalhes da Configuração | Reuso direto | `InlineDetailPanel ariaLive="polite"`; [preview](http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto) | Título, metadados e fechamento; depende da seleção. Sem item selecionado, a tela mantém estado contextual neutro; sem leitura, disponibilidade. Rejeitado: `Sheet` persistente. |
| Conformidade por Serviço | Reuso direto | Donut `side` → `stacked` | Conforme/divergente/crítica/sem coleta na ordem canônica. Rejeitado: remover “sem coleta”. |
| Rankings de divergências e criticidades | Reuso direto | Barras `barOrientation="horizontal"` | Top 5 explícito e link de leitura para lista completa; mobile em lista. Rejeitado: “Outros” implícito. |
| Recomendações de Investigação | Reuso direto | `RecommendationsList` | Risco e contexto. Rejeitado: comando de reparação. |

## 07. Baselines e Conformidade

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-3`; depois `7/5` e `5/7`. **Tablet:** duas colunas, preservando tabelas antes do gráfico. **Mobile:** uma coluna, donut `stacked` e tabela com todos os campos.
- **Rolagem e prioridade:** canvas único; Baselines Ativos e Configurações Divergentes dominam a investigação.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Baselines Ativos, Configurações Cobertas, Divergências Detectadas | Reuso direto | KPIs padrão em `OperationalMetricGrid columns="xl:grid-cols-3"` | Total/percentual/status; sem snapshot válido, indisponível com causa. Rejeitado: zero como cobertura. |
| Baselines Ativos; Configurações Divergentes | Reuso direto | `OperationalTable` | Colunas da representação, origem e instante de coleta quando publicados. Rejeitado: lista sem comparação rastreável. |
| Cobertura por Serviço (Baseline Ativo) | Reuso direto | Donut `side` → `stacked` | Total e workloads em ordem exibida; sem snapshot, `DataAvailabilityPanel visual="donut"`. Rejeitado: gráfico com serviços supostos. |
| Divergências por Nível de Risco | Reuso direto | Barras horizontais | Crítica/alta/média/baixa na ordem canônica; mobile em lista. Rejeitado: donut, que reduz ordenação de risco. |

## 08. Histórico e Auditoria

### Grade e proporções

- **Desktop:** KPIs `xl:grid-cols-3`; log/origem `8/4`; detalhe/análises `3/4/2/3` (a lateral de 3 empilha duas análises); evidências/drifts `6/6`. **Tablet:** log antes de origem; detalhe e valores antes das análises. **Mobile:** uma coluna, detalhe no fluxo e tabela em cartões/rolagem horizontal sinalizada.
- **Rolagem e prioridade:** canvas único; Histórico de Alterações é dominante; detalhe aparece após a seleção e nunca cria scroll aninhado.

### Mapa de composição e instâncias

| Região | Classificação | Instância / story / preview | Anatomia, estados e alternativa rejeitada |
| --- | --- | --- | --- |
| Alterações Observadas; Alterações Externas (Drift); Configurações Críticas Alteradas | Reuso direto | KPIs padrão em grade 3 | Totais do período; ausência histórica é `unavailable`, não estabilidade. Rejeitado: zero sintético. |
| Histórico de Alterações | Reuso direto | `OperationalFilterBar` + `OperationalTable pagination` | Workload é filtro; colunas canônicas e controles Anterior/Próxima. Diff pode ficar restrito. Rejeitado: log sem filtros/contexto. |
| Origem das Alterações; Alterações por Nível de Risco | Reuso direto | Donut `side` → `stacked` | Totais/categorias declaradas. Sem event store ou auditoria, disponibilidade. Rejeitado: percentuais sem evidência. |
| Detalhes da Alteração Selecionada; Valores da Configuração; Informações Técnicas | Reuso direto / composição local | `InlineDetailPanel` para o detalhe; `OperationalSectionCard` para diff/infos | Antes/depois e indicador só quando autorizados; JSON/payload/IP/autoria podem ser `restricted`. Rejeitado: painel lateral rolável ou exposição de payload. |
| Alterações por Serviço | Reuso direto | Barras horizontais | Serviços por total, título identifica série; mobile em lista. Rejeitado: legenda redundante. |
| Evidências e Logs; Drifts Relacionados | Composição local | `OperationalSectionCard` | Lista de referência, origem, risco e instante; retenção/autorização prevalecem. Rejeitado: tabela ampla para itens de evidência contextuais. |

## Divergências em relação à referência do sponsor

| Referência / intenção | Decisão do blueprint |
| --- | --- |
| Paginação numérica desenhada nas referências | `OperationalTable.pagination` é usado com Anterior/Próxima, padrão aprovado da representação estrutural. |
| Fluxos, pendências, planos e implantações na referência 07 | Excluídos: a versão é exclusivamente de leitura. Não se representam como disponibilidade, pois não pertencem ao escopo. |
| Valores, pessoas e organizações visíveis nas imagens | Não são transpostos: são exemplos visuais e nunca dados do tenant. |
| Cards/gráficos específicos da referência sem componente idêntico | São compostos localmente dentro de componentes operacionais documentados; nenhuma API ou componente é inferido. |

## Lacunas e decisões de componentes

Não há candidato confirmado. As regiões de pares, contatos, cartões seletor de workload, mídia autorizada, diff e evidências têm anatomias diferentes entre superfícies e são composições locais dentro de `OperationalSectionCard` ou `InlineDetailPanel`.

| Decisão pendente | Anatomia ausente | Consumidores candidatos | Catálogo avaliado | Opções avaliadas | Decisão do usuário |
| --- | --- | --- | --- | --- | --- |
| Nenhuma nesta fase | — | — | `OperationalSectionCard`, `InlineDetailPanel`, `OperationalTable`, `ChartPanel` e famílias de KPI/estado | Reuso direto e composição local são suficientes no discovery atual. | Não aplicável |

## Matriz consolidada de componentes

| Superfície | Região | Classificação | Componente | ID da story | Preview |
| --- | --- | --- | --- | --- | --- |
| Todas | Shell | Reuso direto | PageScaffold / ModuleHero / ModuleTabBar | `operational-*-em-contexto` | [shell](http://localhost:6006/?path=/story/operational-pagescaffold--em-contexto) |
| Todas | Dados indisponíveis/restritos | Reuso direto | DataAvailabilityPanel | `operational-dataavailabilitypanel--unavailable` | [estado](http://localhost:6006/?path=/story/operational-dataavailabilitypanel--unavailable) |
| Dashboards e resumos | KPI / score | Reuso direto | OperationalKpiCard / OperationalMetricGrid | `operational-operationalkpicard--score` | [KPI](http://localhost:6006/?path=/story/operational-operationalkpicard--score) |
| Todas | Tabela | Reuso direto | OperationalTable | `operational-operationaltable--em-contexto` | [tabela](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto) |
| Catálogo e histórico | Filtros / detalhe | Reuso direto | OperationalFilterBar / InlineDetailPanel | `operational-operationalfilterbar--em-contexto` / `operational-inlinedetailpanel--em-contexto` | [filtros](http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto), [detalhe](http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto) |
| Superfícies analíticas | Donut / barras / linha | Reuso direto | ChartPanel | `charts-donut--side-table`, `charts-bar--horizontal`, `charts-line--two-series` | [donut](http://localhost:6006/?path=/story/charts-donut--side-table), [barras](http://localhost:6006/?path=/story/charts-bar--horizontal), [linha](http://localhost:6006/?path=/story/charts-line--two-series) |
| Superfícies com investigação | Recomendações | Reuso direto | RecommendationsList | `operational-recommendationslist--em-contexto` | [lista](http://localhost:6006/?path=/story/operational-recommendationslist--em-contexto) |

## Checklist de handoff para implementação

- [x] Artefato criado no diretório-fonte fornecido.
- [x] Oito superfícies descobertas, com regiões, ordem de leitura, grade e responsividade explícitas.
- [x] Cada região material tem reuso direto ou composição local declarada, com anatomia, estados e alternativa rejeitada.
- [x] Componentes, variantes e props nomeadas foram verificados no Storybook MCP; decisões relevantes possuem previews.
- [x] Estados `unavailable` e `restricted` preservam causa, condição e metadados, sem dados inventados.
- [x] Divergências das referências e exclusões de escopo estão explícitas.
- [x] Uma única rolagem principal é mantida; tabelas e detalhe não criam canvas vertical aninhado.
- [x] Não cria código de aplicação, componentes ou stories.
