# Relatório visual das referências do sponsor — Microsoft 365 / Relatórios

> Data da análise: 05/09/2026  
> Escopo: as oito imagens em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Relatórios/`.  
> Método: inspeção visual em resolução original (1536 × 1024), leitura do discovery do módulo e consulta ao Storybook local pelo MCP. Este documento descreve a intenção visual das referências e a traduz para componentes existentes; não é um diagnóstico da implementação atual nem autoriza a criar componentes novos.

## Leitura transversal

As imagens representam uma área de Relatórios densa, orientada a operação, composta por: uma navegação lateral do produto, uma faixa de contexto, cabeçalho da superfície, navegação horizontal das oito superfícies e um canvas de dados. O padrão recorrente é **resumo acima, consulta no centro e detalhe/ação contextual na lateral**. O desktop da referência usa uma grade fluida de 12 colunas, cards com borda leve e separação de 8–16 px; não sugere painéis flutuantes ou páginas com scrolls concorrentes.

### O que é global a todas as superfícies

| Região | Intenção observada | Componente do design system confirmado no Storybook | Como deve se comportar |
| --- | --- | --- | --- |
| Casca e canvas | Navegação do produto fora do módulo e única rolagem vertical do conteúdo | `PageScaffold` (`operational-pagescaffold`) | Recebe o hero e o conteúdo. A tabela pode rolar horizontalmente quando necessário, mas não deve criar uma segunda página com scroll vertical. |
| Hero do módulo | Ícone, título grande, subtítulo explicativo, atualização e ações da tela | `ModuleHero` (`operational-modulehero`) | A decisão vigente do módulo é Hero único com título **Relatórios**. O nome da subaba não é repetido no conteúdo; headings internas nomeiam somente regiões. `update` e `action` só aparecem quando o dado/ação for real. |
| Navegação entre telas | A mesma lista de oito superfícies, com uma aba ativa | `ModuleTabBar` (`operational-moduletabbar`) | Deve seguir imediatamente o Hero, ter `activeKey` e nome acessível. No mobile, preservar acesso a todas as abas por rolagem horizontal ou equivalente acessível; não escondê-las. |
| Métrica resumida | Valor, variação textual e ícone semântico | `OperationalMetricGrid` + `OperationalKpiCard` (`operational-operationalmetricgrid`, `operational-operationalkpicard`) | Além do KPI estático, a API suporta `variant="fraction"` + `fraction`, `variant="radial-score"` + `radialScore` e `sparkline`. A tela fornece somente valores e séries publicadas; indisponibilidade permanece responsabilidade de `DataAvailabilityPanel`. |
| Estado sem dado | A referência pressupõe números, mas o produto não pode simulá-los | `DataAvailabilityPanel` (`operational-dataavailabilitypanel`) | Ocupa a região que seria do card/gráfico/tabela e usa `unavailable`, `restricted` ou `coming_soon`, com razão clara e visual compatível (`gauge`, `line`, `bars`, `donut` ou `none`). Nunca trocar ausência por zero, porcentagem, tendência ou cartão removido. |
| Seção de leitura | Título, ação de “ver mais” e conteúdo tabular/gráfico | `OperationalSectionCard` (`operational-operationalsectioncard`) | Estrutura as composições que não são um componente especializado. A ação é opcional e somente pode ser interativa quando houver fluxo implementado. |
| Consulta e tabela | Cabeçalho de colunas, linhas, paginação, estado vazio e ação por linha | `OperationalTable` (`operational-operationaltable`) | Usa `caption`, `head` e `pagination` quando houver mais de uma página. Em tabelas largas, informar `scrollHint` e `scrollLabel`; o consumidor fornece a linha vazia factual. |
| Filtros | Campos agrupados, botão de aplicar/limpar e filtros avançados | `OperationalFilterBar` (`operational-operationalfilterbar`) + `Select`/`Checkbox` (`operational-operationalfilterbar`, `ui-select`, `ui-checkbox`) | Os filtros devem anunciar seu agrupamento com `ariaLabel`, manter o contexto da consulta e não aparentar filtrar dados que não existem. |
| Detalhe no contexto | Painel à direita ou logo após a tabela no fluxo | `InlineDetailPanel` (`operational-inlinedetailpanel`) | Ao selecionar linha, atualiza em `ariaLive="polite"`, tem fechamento e foco compreensível. Em tablet/mobile desce após a lista, sem sumir. |
| Processo e eventos | Etapas de criação/distribuição e registros cronológicos | `ProcessProgress` e `OperationalTimeline` (`operational-processprogress`, `operational-operationaltimeline`) | Expõem progresso publicado ou mensagem de indisponibilidade; eventos são factuais, não uma animação ou log técnico bruto. |

### Regra de estados e fidelidade ao sponsor

As referências usam muitos números, rótulos de origem, frescor e situações verdes. Elas expressam densidade e prioridade de informação, mas não autorizam valores demonstrativos. Em especial, a diretriz aprovada posteriormente para o módulo prevalece sobre os textos da imagem: **origem, cobertura, frescor e status técnico de fonte não devem ser apresentados**, nem como texto manual nem por `SourceMetadata`/`DataFreshness`. Os payloads podem continuar existindo para regra, auditoria e disponibilidade.

Portanto, em todas as regiões abaixo:

- `available`: mostrar o componente descrito com dados publicados.
- `unavailable`: manter a região e substituí-la por `DataAvailabilityPanel`, explicando que não há dado publicado suficiente.
- `restricted`: manter a região com o mesmo painel, informando que o acesso não está autorizado.
- `coming_soon`: manter a região, identificar claramente “Em breve” e não oferecer ação que pareça executável.
- vazio factual: manter a tabela/gráfico, com mensagem ligada ao filtro ou ao conjunto publicado; não ocultar a área inteira.

As imagens são desktop. A ordem para tablet/mobile é inferida por prioridade: hero e abas; KPIs/estado; consulta ou visualização principal; detalhe; seções auxiliares. Grids 12 colunas empilham progressivamente, tabelas preservam colunas materiais por rolagem horizontal sinalizada e toda ação conserva nome/ícone acessível.

## Correções da revisão de componentes

Esta revisão reaplicou o fluxo do Storybook MCP a **cada família de componente indicada no documento**. As recomendações que continuam adequadas estão consolidadas em [Evidência completa do Storybook](#evidência-completa-do-storybook). A tabela abaixo contém todas as indicações que estavam incorretas, incompletas ou que confundiam uma exigência posterior do produto com o que a referência visual de fato mostra.

| Região | Recomendação anterior | Evidência visual da referência | Correção: componente adequado ou lacuna | Evidência Storybook | Props/anatomia necessária | Decisão |
| --- | --- | --- | --- | --- | --- | --- |
| 01 Dashboard — Health Score | `OperationalKpiCard variant="score"` com `progress` como se reproduzisse o score circular | O primeiro card traz anel circular fechado, **84 /100** central e comparação abaixo. | Reuso direto com `OperationalKpiCard variant="radial-score"` e `radialScore={{ value, max, ariaLabel? }}`. `ChartPanel type="gauge"` continua sendo outro visual e não é equivalente. | [`OperationalKpiCard/Radial Score`](http://localhost:6006/?path=/story/operational-operationalkpicard--radial-score) | Rótulo, `radialScore.value`, `radialScore.max`, variação/contexto/qualificador. Sem publicação, a camada consumidora ocupa a mesma região com `DataAvailabilityPanel visual="gauge"`. | **Componente compartilhado entregue.** A tela ainda precisa consumi-lo quando houver Health Score publicado. |
| 01/03/05/06 — Secure Score | `OperationalKpiCard variant="score"` ou `ChartPanel type="gauge"` | Nas imagens, Secure Score é um KPI textual **68 /100**: ícone, rótulo, numerador grande, `/100` menor, variação e, em várias telas, mini-linha. Não há arco, anel ou medidor. | Reuso direto com `OperationalKpiCard variant="fraction"` e `fraction={{ value, max, ariaLabel? }}`; não usar gauge. | [`OperationalKpiCard/Fraction`](http://localhost:6006/?path=/story/operational-operationalkpicard--fraction) | Ícone, rótulo, `fraction.value`, `fraction.max`, variação/contexto e, se houver série cronológica publicada, `sparkline`. Sem dado, `DataAvailabilityPanel`, nunca “0/100”. | **Componente compartilhado entregue e consumido em Segurança.** As demais telas só usam a fração quando houver publicação compatível. |
| 03, 04, 05, 07 e 08 — faixa de KPIs | `OperationalKpiCard` como se pudesse renderizar os pequenos gráficos de linha da referência | A maior parte dos cards desses cinco screenshots contém sparkline de 7–12 pontos no rodapé. | Reuso direto com `sparkline={{ data, label, ariaLabel? }}`. O componente recebe série cronológica ordenada e não calcula tendência, nem fabrica série ausente. | [`OperationalKpiCard/With Sparkline`](http://localhost:6006/?path=/story/operational-operationalkpicard--with-sparkline), [`Sparkline Without Comparable Series`](http://localhost:6006/?path=/story/operational-operationalkpicard--sparkline-without-comparable-series) | O rodapé mostra a mini-série e uma alternativa textual visível/acessível. Sem pelo menos dois pontos comparáveis, mostra somente o texto factual; indisponibilidade integral continua no `DataAvailabilityPanel`. | **Componente compartilhado entregue.** As superfícies somente o usam quando o contrato publicar série comparável. |
| 02 Catálogo — resultado principal | `OperationalTable` como representação principal, com cards apenas alternativos | A referência apresenta uma **grade de quatro cards** como resultado primário; há paginação da grade, não cabeçalho/linhas tabulares. | Composição local de grade de cards usando `OperationalSectionCard`, `Badge`, `Button` e ícone. Não há no catálogo um componente “catalog/report card” ou paginação de grade documentados. | [`OperationalSectionCard`](http://localhost:6006/?path=/story/operational-operationalsectioncard--em-contexto), [`Badge`](http://localhost:6006/?path=/story/ui-badge--variants), [`Button`](http://localhost:6006/?path=/story/ui-button--with-icon). `OperationalTable` foi conferido em [`story`](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto), mas não corresponde à referência. | Card: ícone, título, favorito com nome acessível, resumo, público, periodicidade, formatos, disponibilidade e ação. Paginador da grade é composição local de controles já documentados; requisito/detalhe abre no fluxo com `InlineDetailPanel`. | **Composição local.** Uma tabela pode existir como alternativa de produto somente por decisão explícita; não é a leitura visual primária do sponsor. |
| 05 Segurança — controles/evidências | `OperationalTable` como se fosse a visualização da imagem | A região “Conformidade com Controles” é uma lista compacta de seis controles com barras horizontais e percentuais, não uma tabela paginada. | Para a composição da imagem, `ChartPanel type="bar"` horizontal é o reuso direto mais próximo. A exigência posterior de tabela paginada é uma **divergência de produto** e deve ficar explicitamente separada. | [`ChartPanel/Horizontal`](http://localhost:6006/?path=/story/charts-bar--horizontal) documenta `type="bar"`, `data`, `height` e `barOrientation="horizontal"`; [`OperationalTable`](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto) documenta paginação mas não é a anatomia da referência. | Sponsor: título, cada controle, barra, percentual e ação “Ver todos”. Produto atual: tabela de controles/evidências com `caption`, `head`, `children`, `pagination`, `scrollHint` e `scrollLabel`, 10 itens/página. Ambas precisam de vazio/indisponibilidade explícitos. | **Decisão pendente de produto:** preservar visual de barras do sponsor na visão geral e tabela paginada na consulta detalhada, ou aprovar a substituição visual por tabela. Não chamar a tabela de fidelidade à imagem. |
| 01 Oportunidades / 03 Insights e ranking | `RecommendationCard` ou `OperationalTable` como se cada um reproduzisse a lista compacta | As imagens mostram linhas densas com ícone, frase e valor/posição; não apresentam cards individuais nem cabeçalho de tabela. | Composição local de lista dentro de `OperationalSectionCard`. `RecommendationCard` pode ser usado apenas quando a recomendação tiver título, evidência e ação próprios; `OperationalTable` não deve substituir a lista visual. | [`RecommendationCard`](http://localhost:6006/?path=/story/operational-recommendationcard--em-contexto) confirma título, badges, metadata, conteúdo e ação; [`RecommendationsList`](http://localhost:6006/?path=/story/operational-recommendationslist--em-contexto) confirma `title` e `items`, sem provar a anatomia de valor/ranking da imagem. | Lista: ícone semântico, título/condição, valor ou posição, e link opcional. Ação individual somente se existir. Vazio factual fica dentro da seção. | **Composição local.** Não há necessidade de novo componente enquanto a lista não se repetir com anatomia idêntica em outros módulos. |
| 06 Construtor — geometria desktop | `4/4/4` descrito como se derivasse da imagem | A prévia ocupa claramente a coluna central dominante, com biblioteca estreita à esquerda e configuração estreita à direita; a proporção é próxima de `2/7/3`, não três colunas equivalentes. | A imagem sustenta biblioteca / prévia / configuração em `2/7/3`. A regra de produto para o construtor guiado em `4/4/4` é uma divergência deliberada de escopo, não inferência visual. | [`OperationalSectionCard`](http://localhost:6006/?path=/story/operational-operationalsectioncard--em-contexto), [`OperationalFilterBar`](http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto), [`ProcessProgress`](http://localhost:6006/?path=/story/operational-processprogress--em-contexto). Nenhum deles expõe props de grid; os spans pertencem à página. | Referência: biblioteca de blocos, prévia dominante e configuração. Produto guiado: template/configuração, blocos/período/formato e prévia humana, sem canvas livre. | **Composição local; divergência de produto confirmada.** Não interpretar `4/4/4` como fidelidade literal ao sponsor. |

### Evidência completa do Storybook

| Seleção ainda válida | O que a documentação confirma | Preview consultado |
| --- | --- | --- |
| `PageScaffold` | `hero`, `children`, `nextStep`; casca sem canvas vertical adicional | [Em Contexto](http://localhost:6006/?path=/story/operational-pagescaffold--em-contexto) |
| `ModuleHero` | `category`, `title`, `subtitle`, `update`, `action`; as ações pertencem ao domínio | [Em Contexto](http://localhost:6006/?path=/story/operational-modulehero--em-contexto) |
| `ModuleTabBar` | `tabs`, `activeKey`, `ariaLabel` | [Em Contexto](http://localhost:6006/?path=/story/operational-moduletabbar--em-contexto) |
| `OperationalMetricGrid` | `children`, `columns`, `midColumns`, `ariaLabel`; contém as posições de métricas | [Em Contexto](http://localhost:6006/?path=/story/operational-operationalmetricgrid--em-contexto) |
| `OperationalKpiCard` | KPI estático e legado `score`; `variant="fraction"` + `fraction`, `variant="radial-score"` + `radialScore`, e `sparkline` com alternativa textual | [Fraction](http://localhost:6006/?path=/story/operational-operationalkpicard--fraction), [Radial Score](http://localhost:6006/?path=/story/operational-operationalkpicard--radial-score), [Sparkline](http://localhost:6006/?path=/story/operational-operationalkpicard--with-sparkline) |
| `DataAvailabilityPanel` | `title`, `reason`, `state` (`unavailable`, `restricted`, `coming_soon`) e `visual`; não apresenta métrica real | [Unavailable](http://localhost:6006/?path=/story/operational-dataavailabilitypanel--unavailable) |
| `OperationalSectionCard` | título, ícone, ação, conteúdo e foco de título; base para composição local de leitura | [Em Contexto](http://localhost:6006/?path=/story/operational-operationalsectioncard--em-contexto) |
| `OperationalTable` | `caption`, `head`, `children`, `footer`, `pagination`, `scrollHint`, `scrollLabel`, `variant` | [Em Contexto](http://localhost:6006/?path=/story/operational-operationaltable--em-contexto) |
| `OperationalFilterBar` e controles | agrupamento com `ariaLabel` e `columns`; `Select` de filtro e `Checkbox` com label | [Filter bar](http://localhost:6006/?path=/story/operational-operationalfilterbar--em-contexto), [Select](http://localhost:6006/?path=/story/ui-select--filter), [Checkbox](http://localhost:6006/?path=/story/ui-checkbox--checked) |
| `InlineDetailPanel` | título, subtítulo, ação, conteúdo e `ariaLive` | [Em Contexto](http://localhost:6006/?path=/story/operational-inlinedetailpanel--em-contexto) |
| `ChartPanel` de linha/barra/donut | `type`, `data`, `height`; linha suporta `lineSeries`, barra suporta `barOrientation`/`barSeries`, donut suporta legenda e variante embedded | [Line](http://localhost:6006/?path=/story/charts-line--two-series), [Bar](http://localhost:6006/?path=/story/charts-bar--horizontal), [Donut](http://localhost:6006/?path=/story/charts-donut--side-cards) |
| Recomendações | `RecommendationCard` aceita título, badges, metadata, conteúdo e ação; `RecommendationsList` recebe título e itens | [Card](http://localhost:6006/?path=/story/operational-recommendationcard--em-contexto), [List](http://localhost:6006/?path=/story/operational-recommendationslist--em-contexto) |
| Processo e eventos | `ProcessProgress` aceita `steps`, `progress`, `unavailableMessage`, `ariaLabel`; `OperationalTimeline` aceita `items`, `ariaLabel` | [Processo](http://localhost:6006/?path=/story/operational-processprogress--em-contexto), [Timeline](http://localhost:6006/?path=/story/operational-operationaltimeline--em-contexto) |

## 01. Dashboard Executivo

### Composição observada

1. Cabeçalho “Dashboard Executivo”, ícone de painel, descrição, intervalo de datas, Exportar, Agendar e Filtros.
2. Faixa de seis KPIs: Health Score circular, Usuários Ativos, Licenças Atribuídas, Secure Score, Incidentes (Defender) e Economia Estimada. O card de score é visualmente mais ilustrativo, mas tem a mesma altura.
3. Segunda faixa: evolução mensal do Health Score (`5` colunas), adoção por serviço em barras horizontais (`3`), licenças ociosas em donut (`2`) e incidentes por severidade em donut (`2`).
4. Terceira faixa: tabela “Principais Riscos” (`5`), lista “Oportunidades” (`3`) e tabela “Relatórios Recentes” (`4`).
5. Quarta faixa: comparativo mensal tabular (`4`), tendência de armazenamento em linha/área (`4`) e lista “Ações Pendentes” (`4`). Rodapé informativo transversal.

### Tradução para componentes e comportamento

| Região | Implementação recomendada com componente existente | Conteúdo e interação |
| --- | --- | --- |
| Postura resumida | `OperationalMetricGrid` + `OperationalKpiCard`: Health Score em `variant="radial-score"`/`radialScore`; Secure Score em `variant="fraction"`/`fraction` | Não substituir nenhum dos dois por gauge. Quando houver série publicada, acrescente `sparkline`; quando indisponíveis, a posição vira `DataAvailabilityPanel visual="gauge"` ou `none`. |
| Evolução | `ChartPanel type="line"` (`charts-line`) dentro de `OperationalSectionCard` | Série mensal comparável, eixos e legenda curta. Sem snapshots comparáveis: `DataAvailabilityPanel visual="line"`, não linha em zero. |
| Adoção | `ChartPanel type="bar"` em orientação horizontal (`charts-bar--horizontal`) | Uma barra por serviço, população/denominador coerente. Não misturar serviços sem cobertura equivalente. |
| Licenças/Incidentes | dois `ChartPanel type="donut"` (`charts-donut`) | Usar legenda lateral `donutLegendLayout="side"`; preservar categorias e total somente publicados. Região indisponível usa painel visual `donut`. |
| Principais riscos | `OperationalSectionCard` + `OperationalTable variant="embedded"` | Colunas: condição, domínio/serviço, severidade, população afetada, impacto e ação recomendada. Status deve ter texto além da cor. Uma ação só navega se existir destino real. |
| Oportunidades e pendências | `RecommendationsList`/`RecommendationCard` para recomendações; lista semântica em `OperationalSectionCard` para pendências | Cada item precisa de condição/recomendação factual. “Ver todos” não deve ser um link inoperante. |
| Relatórios recentes e comparativo | `OperationalTable variant="embedded"` | Recentes: nome, tipo, instante, formato e resultado. Comparativo: indicador, períodos e direção textual/ícone. Se não houver artefatos ou séries, usar vazio factual. |
| Armazenamento | `ChartPanel type="line"` | Tendência temporal de TB apenas com snapshots. Não deduzir previsão de esgotamento sem modelo publicado. |

### Responsividade, acessibilidade e estados

No desktop, respeitar as proporções `5/3/2/2`, depois `5/3/4` e `4/4/4`. Em largura média, os donuts vão abaixo da série principal e, no mobile, cada região fica em uma coluna: o resumo e os riscos precedem a agenda. Datas são um único controle com rótulo explícito; Exportar e Agendar devem comunicar indisponibilidade/“Em breve” conforme o fluxo. KPIs, gráficos e tabelas não são removidos quando não há publicação.

## 02. Catálogo de Relatórios

### Composição observada

1. Cabeçalho “Catálogo de Relatórios”, com ações de relatório personalizado, importar template e gerenciar templates.
2. Navegação de categorias (Todos, Executivo, Licenciamento, Usuários e Identidade, Grupos, Segurança, Conformidade, Produtividade, Operacional e Outros), busca, ordenação e alternância grade/lista.
3. Catálogo dominante em quatro colunas de cards, duas linhas no recorte. Cada card possui ícone, título, favorito, resumo, público-alvo, periodicidade, última geração, origem, formatos e botão “Gerar relatório” com menu complementar.
4. Painel lateral de filtros: categoria, público, serviço, formatos, periodicidade, origem, nível de detalhamento, status e favoritos.
5. Rodapé com quantidade, paginação, itens por página e aviso de geração assíncrona.

### Tradução para componentes e comportamento

| Região | Implementação recomendada com componente existente | Conteúdo e interação |
| --- | --- | --- |
| Categorias, busca e ordenação | `OperationalFilterBar` com controles `Select`/campo de busca e botões padrão | A categoria ativa precisa ser identificável por texto/estado, não só fundo azul. Busca e ordenação atualizam o mesmo conjunto. |
| Resultado em catálogo | grade dominante de composição local com `OperationalSectionCard`, `Badge`, `Button` e ícone | A referência pede quatro cards por faixa, não tabela. Cada card contém nome, resumo, público, periodicidade, formatos, disponibilidade e requisito agregado (`required`/`degradable`). A semântica de card, ações e paginação de grade devem funcionar por teclado. |
| Card do template | composição local em `OperationalSectionCard`, `Badge`, `Button` e ícone | Ícone e título; favorito com nome acessível; descrição; público/periodicidade; formatos; disponibilidade e ação. Não reproduzir o metadado técnico de origem/frescor da imagem. |
| Requisitos/detalhe | `InlineDetailPanel` ou `DataAvailabilityPanel` | Um template restrito/indisponível abre os requisitos no fluxo. `required` bloqueia gerar; `degradable` informa saída parcial antes de iniciar. |
| Paginação da grade | composição local com controles `Button`/`Select` já documentados | O texto de contagem, página atual e itens por página devem refletir resultado real. Não há componente de paginação de grade documentado; “Nenhum resultado para estes filtros” difere de “Catálogo ainda não publicado”. |

### Estados e responsividade

O Catálogo é uma superfície de descoberta, não um painel de KPIs. Preservar `available`, `unavailable`, `restricted` e `coming_soon` no filtro e no rótulo visível. Ação “Gerar relatório” só é habilitada para template cuja pré-condição esteja satisfeita. Em tablet, o painel de filtros fica acima ou após a consulta; no mobile, filtros empilhados e resultado de uma coluna. O menu de cada card/linha deve funcionar por teclado e expor rótulo da ação.

## 03. Relatórios Executivos

### Composição observada

1. Cabeçalho específico e intervalo/Filtros/Exportar Tudo.
2. Navegação de abas do módulo.
3. Seis KPIs de tendência com mini-linhas: Health Score, Secure Score, Usuários Ativos, Licenças Atribuídas, Economia Estimada e Incidentes.
4. Grande tabela “Relatórios Executivos Disponíveis” (`8` colunas) com ícone, título, descrição, público, período, geração, formatos e ações; lateral (`4`) com Ações Rápidas, Insights do Período e ranking “Relatórios Mais Gerados”.
5. Faixa de quatro argumentos de valor: visão estratégica, dados confiáveis, economia de tempo e apresentações profissionais.

### Tradução para componentes e comportamento

| Região | Componente | Detalhamento |
| --- | --- | --- |
| Faixa de KPIs | `OperationalMetricGrid` + `OperationalKpiCard`; acrescentar `sparkline` apenas quando houver série comparável publicada | Seis regiões permanecem. A referência mostra sparkline em todos os cards; sem série, não inventar tendência e manter o card/painel de disponibilidade conforme o estado. |
| Tabela central | `OperationalTable` + `OperationalSectionCard` | Captação de templates executivos: nome, propósito, público, periodicidade recomendada, data de geração e formatos. Ação de gerar/download deve descrever o resultado e confirmar erro de entrega quando aplicável. |
| Lateral de ações | `OperationalSectionCard` com `Button`/links | Gerar personalizado, agendar, importar e identidade visual só aparecem como ações funcionais ou `coming_soon`; não são atalho decorativo. |
| Insights e ranking | lista local em `OperationalSectionCard`; `RecommendationCard` só para insight que tenha contexto e ação próprios | Cada insight declara condição e recomendação em linguagem executiva. Ranking é lista ordenada, não tabela; depende de histórico publicado e mostra vazio factual quando ausente. |
| Argumentos de valor | quatro `OperationalSectionCard` compactos | São conteúdo explicativo, não KPI; ícone, título e uma frase. Devem ficar após a função principal e ser removidos/compactados em telas estreitas somente se não apagarem ação necessária. |

### Grade inferida

Desktop: KPIs em seis colunas; tabela/detalhe em `8/4`; valor em quatro colunas. Tablet: tabela antes da lateral, depois cards de valor em duas colunas. Mobile: KPI/estado em uma coluna, tabela com rolagem horizontal instruída e ações rápidas no fluxo após ela.

## 04. Relatórios Operacionais

### Composição observada

1. Cabeçalho, período, filtros e exportação; navegação de abas.
2. Seis cards de volume/tendência: usuários ativos, e-mails enviados, reuniões Teams, arquivos armazenados, sites ativos e dispositivos gerenciados.
3. Faixa de análise: atividade por serviço em barras horizontais (`4`), armazenamento em donut (`3`), top usuários por armazenamento em tabela (`3`) e filtros avançados fixos à direita (`2`).
4. Faixa seguinte: atividade recente em tabela (`4`), tendência multi-série (`3`) e conformidade de dispositivos em donut (`3`), mantendo o painel de filtros (`2`).
5. Quatro cards de apoio: relatórios relacionados, exportações rápidas, agendamentos ativos e insights operacionais.

### Tradução para componentes e comportamento

| Região | Componente | Detalhamento |
| --- | --- | --- |
| Filtros | `OperationalFilterBar` | Período, serviço, departamento, localidade, licença, tipo, grupo e status. Em desktop pode ocupar coluna lateral; em breakpoint menor desloca-se antes da tabela, nunca desaparece. “Adicionar filtro” precisa informar campo adicionado e manter foco. |
| KPIs | `OperationalMetricGrid` + `OperationalKpiCard`; usar `sparkline` para cada série comparável publicada | Mostram somente valores do escopo filtrado. Dados de Teams, Exchange, Intune etc. não são somados nem mostrados como zero quando a fonte estiver restrita; sem série comparável, usar texto factual ou painel de disponibilidade. |
| Barras e tendência | `ChartPanel type="bar"` e `ChartPanel type="line"` | Barras por serviço com unidade no eixo; linha com legenda por serviço e período selecionável. Sem comparabilidade, usar painel de indisponibilidade com visual de linha/barras. |
| Armazenamento e conformidade | `ChartPanel type="donut"` | Legenda lateral no desktop, empilhada no mobile. Não mostrar “conforme” ou “não conforme” se o conjunto for parcial sem deixar isso claro no estado da região. |
| Atividade e top usuários | `OperationalTable` | Requer `scrollHint` e `scrollLabel` por conter várias colunas/PII. Dados pessoais devem vir mascarados ou com estado `restricted`; não renderizar JSON ou IP bruto. |
| Relacionados/exportação/agendamento/insights | `OperationalSectionCard`, `RecommendationCard`, `DataAvailabilityPanel` | Exportação disponível respeita o filtro e arquivo efêmero; agendamento só existe se publicado, caso contrário painel `coming_soon`. |

### Responsividade e feedback

A densidade da imagem pede prioridade: filtros → KPI/estado → atividade por serviço → tabelas e gráficos → cards auxiliares. A tabela é a região dominante e deve ter estado vazio após consulta válida. O botão “Aplicar filtros” precisa declarar que a consulta foi atualizada (e apresentar erro, se houver); filtro ativo não pode ser apenas decoração. Em mobile, os gráficos ficam antes das tabelas de detalhe e o painel lateral não compete por largura.

## 05. Relatórios de Segurança e Compliance

### Composição observada

1. Cabeçalho, período, filtros/exportação e abas.
2. Seis KPIs: postura/Secure Score, cobertura MFA, usuários de risco, incidentes Defender, vulnerabilidades críticas e violações DLP.
3. Área de incidentes: donut por severidade (`3`), tabela de principais incidentes (`4`) e barras de exposições/vulnerabilidades (`3`), com painel de filtros à direita (`2`).
4. Área de conformidade: barras de controles (`3`), donut de status (`3`) e auditoria recente em tabela (`4`), preservando os filtros.
5. Faixa final: recomendações (`4`), resumo de compliance (`2`) e donut de rótulos de sensibilidade (`4`).

### Tradução para componentes e comportamento

| Região | Componente | Detalhamento |
| --- | --- | --- |
| Postura de Segurança / Secure Score | `OperationalKpiCard variant="fraction"` + `fraction`; `DataAvailabilityPanel visual="gauge"` somente para indisponibilidade | Quando publicado, mostrar **somente** ícone, rótulo, valor N/X, variação/contexto e `sparkline` se a série for publicada — **não gauge**. A longa lista técnica de fontes/controles não pertence à composição. Quando indisponível/restrito, toda a posição vira painel de disponibilidade. |
| Métricas de risco | `OperationalMetricGrid` + `OperationalKpiCard`, com `sparkline` quando houver série comparável | Cobertura MFA, risco, incidentes, vulnerabilidades e DLP são independentes: uma fonte restrita não torna outra métrica zero. Sem série publicada, a mini-série não é inventada. |
| Incidentes e auditoria | `OperationalTable` | Incidente: título, severidade textual, domínio, status compreensível e instante. Auditoria: evento, usuário mascarado quando aplicável, domínio, data/hora e resultado. Ação “ver todos” precisa de rota real. |
| Conformidade com controles / controles-evidências | `ChartPanel type="bar"` horizontal para a visão geral da imagem; `OperationalTable` paginada para a exigência posterior do produto | A imagem é ranking de barras, não tabela. A tabela de controles/evidências, paginada no servidor em 10 itens e com distribuição no conjunto completo, é uma decisão de produto que precisa permanecer explicitamente distinta. Ambas mantêm estado vazio factual. |
| Distribuições e exposições | `ChartPanel type="donut"` e `ChartPanel type="bar"` | Donut de conformidade/rótulos; barras para ranking de exposições. Usar legenda textual e alternativa indisponível equivalente. |
| Recomendações/Compliance | `RecommendationCard` e `OperationalSectionCard` | Recomendação aponta condição e próximo passo. O resumo não deve afirmar certificação automática (LGPD, ISO, CIS ou Zero Trust); mostrar apenas evidência/limitação publicada em linguagem não técnica. |

### Estados, acessibilidade e responsividade

Segurança exige que cor nunca seja a única codificação: crítico/alto/médio/baixo precisam de texto. Em desktop a grade prática é `7/5` ou `3/4/3` dentro de uma área de 10 colunas com filtros na lateral; em tablet e mobile, filtros ficam no fluxo e evidências precedem recomendações. Um donut lateral vira legenda empilhada. Falta de Defender, Intune ou Purview mantém a área informativa em `restricted`/`unavailable`; não se deve inferir conformidade ou ausência de incidente.

## 06. Construtor de Relatórios

### Composição observada

1. Cabeçalho com Salvar Rascunho, Pré-visualizar e Gerar Relatório; sequência de seis etapas do fluxo.
2. Coluna esquerda de biblioteca de componentes: KPIs, score, gráficos de linha/barras/pizza, tabela, ranking, matriz de risco, timeline e texto; categorias expansíveis posteriores.
3. Centro dominante de prévia de documento: título, período, logotipo, quatro KPIs, linha, donut, tabela e matriz de risco. Há zoom, undo/redo, desktop/mobile e layout.
4. Coluna direita de configuração: layout de página, colunas, toggles, filtros globais, comparações, ordenação/agrupamentos e limpar configurações.
5. Rodapé de progresso “Componentes na página” e formatos de saída.

### Interpretação correta para a primeira release

A imagem sugere um editor livre de arrastar-e-soltar. O produto aprovado não é esse editor: é um **construtor guiado e allowlisted**. A estrutura visual deve preservar a compreensão de seleção → configuração → prévia → geração, mas não simular canvas livre, fontes ao vivo, fórmulas arbitrárias ou salvar/agendar como já implementados.

| Região | Componente | Detalhamento |
| --- | --- | --- |
| Etapas | `ProcessProgress` | Etapas permitidas: configurar, validar, prévia e gerar. Compartilhar/agendar permanecem `coming_soon`, com mensagem explícita. |
| Seleções | composição local de três regiões com `OperationalSectionCard`/`OperationalFilterBar` | A imagem usa biblioteca / prévia dominante / configurações, em cerca de `2/7/3`. O produto guiado adotou template/configuração, blocos/período/formato e prévia em `4/4/4`: é divergência consciente, não leitura da imagem. `Checkbox` para blocos e `Select` para período/formato apenas quando aprovados. |
| Preflight | `OperationalSectionCard` + `DataAvailabilityPanel` quando necessário | Confirma se o template pode ser gerado, com parcialidade e razão humana. Falha deve ser uma mensagem concreta, não JSON. |
| Prévia | `OperationalSectionCard` | Prévia humana com template, período, blocos escolhidos, eventual parcialidade e estado da solicitação. Não renderizar JSON cru, log técnico ou uma maquete de KPI sem fonte publicada. |
| Ações | `Button` e `ProcessProgress` | Gerar só é habilitado após preflight válido; sua ação tem feedback de envio, sucesso e erro. Salvar rascunho/compartilhar/agendar só aparecem se funcionais; caso contrário `DataAvailabilityPanel state="coming_soon"`. |

### Responsividade e teclado

Em desktop, seleção/configuração/prévia deve ser `4/4/4`; abaixo disso, configurações seguem a seleção e a prévia vem por último. Cada checkbox recebe label clicável, grupos expansíveis têm estado anunciado e a alteração de template atualiza opções permitidas e foco sem apagar silenciosamente escolhas. A prévia é leitura, não canvas com gestos obrigatórios.

## 07. Agendamentos e Distribuição

### Composição observada

1. Cabeçalho, Novo Agendamento, Modelos de Agendamento e Filtros; abas.
2. Seis KPIs: agendamentos ativos, execuções no mês, relatórios enviados, falhas, próximas execuções e downloads.
3. Tabela grande “Agendamentos Programados” com relatório, descrição, frequência, próxima/última execução, destinatários, formato, status e menu. À direita: filtros, canais de distribuição e próximas execuções.
4. Faixa inferior em três colunas: execuções recentes, distribuição recente e modelos de agendamento.

### Tradução para componentes e comportamento

| Região | Componente | Detalhamento |
| --- | --- | --- |
| Estado de recorrência e KPIs | `ProcessProgress`, `OperationalMetricGrid` + `OperationalKpiCard`, `DataAvailabilityPanel` | A referência também mostra sparklines, agora suportadas por `sparkline` quando uma série cronológica for publicada. Para o escopo atual de produto, recorrência/canais são `coming_soon`; as áreas continuam visíveis e não exibem “Ativo”, contagens ou datas ficcionais. |
| Lista e detalhe | `OperationalTable` (`8` colunas) + `InlineDetailPanel` (`4`) | Quando publicada, a lista inclui periodicidade, próxima execução, destinatários permitidos, formato e resultado. A seleção mostra processo/detalhe no painel; mobile o leva abaixo. |
| Canais e próximas execuções | `OperationalSectionCard` e `DataAvailabilityPanel state="coming_soon"` | E-mail, SharePoint, OneDrive e Teams não parecem habilitados antes da integração. Não comunicar entrega, aprovação, retenção ou destinatário externo sem dado de processo. |
| Execuções/distribuições/modelos | `OperationalTimeline` ou `OperationalTable embedded` + `OperationalSectionCard` | Uma linha cronológica é adequada a execuções factuais; modelos podem ser lista. Sem dados, vazio factual ou “Em breve”, conforme o motivo. |

### Grade e ação

O padrão é `8/4`: lista dominante, detalhe/processo lateral. Em tablet/mobile, a região lateral segue a tabela; não é escondida. “Novo agendamento” e “Modelos” não devem abrir diálogos sem conclusão; enquanto futuros, mostram claramente o estado `coming_soon` e não sugerem que o relatório será entregue.

## 08. Histórico e Auditoria

### Composição observada

1. Cabeçalho “Histórico e Auditoria”, abas e seis KPIs: relatórios gerados, downloads, envios, falhas, usuários ativos e armazenamento usado.
2. Filtros horizontais de período, tipo de evento, relatório, usuário, status, mais filtros, exportar e limpar.
3. Tabela de eventos (`8`) e painel lateral “Detalhes do Evento” (`4`). A imagem inclui metadados do artefato, lista de arquivos, log de execução e botão de JSON.
4. Faixa inferior: resumo de auditoria, métricas de ações por tipo e integridade dos dados.

### Tradução para componentes e comportamento

| Região | Componente | Detalhamento |
| --- | --- | --- |
| KPIs | `OperationalMetricGrid` + `OperationalKpiCard`; `sparkline` quando houver série temporal de `ReportRequest`/`ReportArtifact` | Cada métrica depende de `ReportRequest`/`ReportArtifact` local. Sem histórico ou série comparável, a posição mostra indisponibilidade/vazio factual, não `0` ou tendência inventada. |
| Filtros e resultado | `OperationalFilterBar` + `OperationalTable` | A tabela é a fonte principal: data/hora, evento, relatório, tipo, solicitante, destino sanitizado, status e detalhe. Paginação vem do `OperationalTable`, não de botões soltos fora dele. |
| Detalhe do evento | `InlineDetailPanel` | Apresenta fatos sanitizados: resultado, instante, formato, tamanho, hash/manifesto somente se existir. Não apresentar origem técnica, JSON externo bruto ou URL de download persistente. |
| Linha do tempo e metodologia | `OperationalTimeline` + `OperationalSectionCard` | Mostra eventos factuais da solicitação selecionada, seguida da explicação de metodologia/limitação. |
| Auditoria e integridade | `OperationalSectionCard` com KPIs apenas quando mensuráveis | “Integridade 100%” não pode ser exibido sem hash/manifesta imutável publicado. A cópia deve dizer que arquivo é efêmero, quando aplicável. |

### Estados e responsividade

Desktop usa `8/4` para tabela/detalhe, com faixa inferior em colunas. Em largura menor, filtros empilham, tabela indica rolagem horizontal e o detalhe segue a tabela; a linha do tempo vem abaixo. Seleção por teclado precisa abrir detalhe e o fechamento deve devolver foco à linha/acionador. Falha de geração é um evento factual, visualmente distinto e com explicação segura, nunca log técnico exposto.

## Matriz consolidada de visualizações

## Reconciliação com a decisão de produto e o blueprint

- O [ui-blueprint.md](ui-blueprint.md) é a fonte estrutural consolidada das oito superfícies. Este relatório preserva intenção visual, hierarquia e densidade do sponsor; não autoriza capacidades, coleta, dados ou ações que não existam no contrato.
- O Hero único é `Relatórios` e `ModuleTabBar` vem logo abaixo. O nome da subaba não é repetido no conteúdo; títulos internos são somente de regiões materiais.
- As regiões ampliadas de Executivos, Operacionais, Segurança e Agendamentos continuam no layout desde o início. Sem fato publicado, usam `DataAvailabilityPanel`; não recebem zero, série, tabela vazia ou ação fictícia.
- `unavailable` e `restricted` descrevem a indisponibilidade ou limitação de uma região de dado. `coming_soon` é reservado a capacidade futura, como agendamento e canais de distribuição. Vazio factual só ocorre após consulta válida sem registros.

| Visualização nas referências | Superfícies | Componente confirmado | Alternativa sem dado |
| --- | --- | --- | --- |
| KPI estático | 01, 03, 04, 05, 07, 08 | `OperationalMetricGrid` + `OperationalKpiCard` | `DataAvailabilityPanel` ocupando a mesma posição |
| KPI com mini tendência | 03, 04, 05, 07, 08 | `OperationalKpiCard` + `sparkline={{ data, label, ariaLabel? }}` | `DataAvailabilityPanel` ocupando a mesma posição |
| Score radial e fração N/X | 01, 03, 05, 06 | `OperationalKpiCard variant="radial-score"` + `radialScore`; `variant="fraction"` + `fraction` | `DataAvailabilityPanel visual="gauge"` |
| Linha / área | 01, 03, 04, 06 | `ChartPanel type="line"` | `DataAvailabilityPanel visual="line"` |
| Barras | 01, 04, 05 | `ChartPanel type="bar"` | `DataAvailabilityPanel visual="bars"` |
| Donut | 01, 04, 05, 06 | `ChartPanel type="donut"` | `DataAvailabilityPanel visual="donut"` |
| Tabela com paginação | 01, 03, 04, 07, 08; e consulta detalhada de controles em 05 | `OperationalTable` | Linha vazia factual no próprio componente |
| Filtros | 02, 04, 05, 07, 08 | `OperationalFilterBar` + `Select`/`Checkbox` | Controles desabilitados somente se a razão for informada |
| Detalhe lateral | 02, 03, 04, 07, 08 | `InlineDetailPanel` | Painel com estado restrito/indisponível |
| Ação/recomendação | 01, 03, 04, 05 | `RecommendationCard` / `RecommendationsList` / `Button` | Sem ação inoperante; explicar indisponibilidade |
| Etapas/timeline | 06, 07, 08 | `ProcessProgress` / `OperationalTimeline` | `unavailableMessage` ou painel `coming_soon` |

## Checklist de entrega visual derivado das imagens

- As oito abas têm Hero único de Relatórios e `ModuleTabBar`; o nome da subaba não é repetido no conteúdo.
- Toda área visual da referência permanece no layout quando seu dado não está disponível; muda para estado explícito, não é ocultada.
- KPIs, gráficos e tabelas usam somente dados publicados e mantêm unidade, período e estado compreensíveis.
- O Catálogo preserva a grade de cards como leitura primária da referência; a paginação de grade é composição local acessível.
- A visão geral de controles em Segurança preserva barras horizontais da referência. A tabela paginada de controles/evidências é consulta detalhada de produto, com distribuição independente da página.
- Construtor é guiado e humano-legível; não exibe JSON, canvas livre simulado ou controles não allowlisted.
- Agendamentos futuros e canais não habilitados aparecem como `coming_soon`, sem status “Ativo” fictício.
- Histórico usa tabela paginada, detalhe sanitizado, linha do tempo e metodologia; não promete download permanente ou integridade sem evidência.
- Nenhuma tela reintroduz origem, cobertura, frescor ou status técnico da fonte como texto de apresentação.
