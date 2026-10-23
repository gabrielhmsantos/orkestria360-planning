# Padrões de implementação de UI

Use estes padrões como heurísticas para tomar decisões. Eles não substituem o contrato do produto nem a verificação de APIs no Storybook. Aplique-os quando intenção, semântica e responsabilidades coincidirem; adapte ou mantenha local quando não coincidirem.

## Layout e apresentação de métricas

Separe o componente que distribui regiões do componente que apresenta uma métrica. A grade controla colunas e breakpoints; o renderer controla label, valor, unidade e comparação conforme seu contrato. Se várias regiões do mesmo módulo precisam da mesma regra de formatação/comparação, um adaptador de domínio pode concentrá-la. A superfície continua responsável pelos valores e baselines publicados.

Não derive um KPI de uma tabela apenas porque ambos exibem contagens. Não conecte o filtro de uma tabela a um KPI que foi definido como snapshot independente.

## Filtros, projeções e snapshots

Quando tabela, detalhe, alertas ou recomendações representam o mesmo recorte, determine uma única coleção derivada na superfície e declare todos os consumidores. Isso evita que regiões dependentes apresentem resultados incompatíveis. Declare separadamente KPIs, análises ou configurações estáveis que permanecem snapshots e não reagem a esses filtros.

O componente de filtro expõe controles e callbacks documentados; a superfície possui estado, interseção de dimensões, reset, paginação e propagação para regiões. Opções e defaults dependentes dos dados devem ter proveniência publicada.

## Gráficos por intenção

Escolha a forma visual pela pergunta, unidade, cardinalidade, período e comparação que o conteúdo aprovado permite responder. Use donut para composição proporcional, barras para comparar magnitudes/categorias, séries temporais para evolução e composição combo apenas quando séries e eixos separados tiverem significado explícito. Agregação, ordenação, Top N, agrupamento em “Outros”, classificação e formatação de domínio pertencem à projeção da superfície. O componente de gráfico renderiza somente a composição e a API que documenta.

Cada decisão de gráfico registra o dado e a transformação, não só seu tipo. Se os dados publicados não sustentarem a granularidade da visualização, marque a lacuna; não fabrique pontos, categorias ou denominadores.

## Tabelas, listas e resumos

Use uma tabela operacional para comparar registros, navegar por colunas, ordenar, filtrar ou paginar. Use uma tabela/lista de insight compacta para fatos ou rankings curtos quando sua legenda, caption acessível e prioridade de leitura continuarem claras. Um painel de resumo pode agrupar fatos relacionados, mas não deve inferir ação ou estado a partir de texto sem contrato.

Em telas compactas, preserve leitura e teclado com o padrão documentado (por exemplo, overflow tabular acessível); não esconda uma região material apenas para reduzir densidade. Declare separadamente comportamento de seleção, paginação e foco.

## Estados e fontes independentes

Componha disponibilidade no limite da região/fonte a que se refere. Disponibilidade de um bloco não autoriza inferir a de outro; vazio factual não é indisponibilidade, e falta de publicação não é zero nem sucesso. Componentes de apresentação recebem status e fatos já projetados; a superfície ou adapter aprovado preserva semântica, thresholds e origem.

## Como registrar o padrão

Para cada região, ligue IDs e estratégia de composição ao UI decision log. No mapa de composição, indique componentes/papel, quem calcula e mantém estado, quais regiões dependem do mesmo recorte e o que cada componente faz ou não faz. Para uma extensão compartilhada, explique consumidores e responsabilidades antes de descrever API; veja [regras de seleção](component-selection-rules.md). Os casos concretos e seus limites estão em [OneDrive: decisões finais](onedrive-case-study.md).
