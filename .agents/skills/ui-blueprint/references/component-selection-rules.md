# Regras de seleção e composição de componentes

Decida primeiro a intenção, conteúdo, comportamento, estados, dados e relações espaciais. Só então escolha o componente que materializa cada região. Storybook comprova componentes, variantes, props, stories e comportamento documentado; não decide conteúdo ou semântica de produto.

## Estratégias de composição

| Estratégia | Use quando | Responsabilidade da superfície | Responsabilidade do componente | Evite quando |
| --- | --- | --- | --- | --- |
| `direct_reuse` | Um componente documentado atende à mesma intenção, anatomia, comportamento e estados. | Fornecer conteúdo, dados e regras aprovados. | Apresentar o contrato documentado. | A semelhança for só visual, a semântica divergir ou uma variante exigir modo oculto não documentado. |
| `domain_adapter` | Uma regra recorrente do módulo precisa de apresentação consistente sobre componentes compartilhados. | Fornecer fatos e projeções aprovados; possuir regras e thresholds do domínio. | O adaptador concentra apenas a convenção de apresentação do módulo; os componentes filhos renderizam suas APIs verificadas. | O adaptador inferir dados ausentes, adquirir responsabilidade de fonte ou ser promovido ao design system apenas por existir em um módulo. |
| `local_composition` | Componentes existentes compõem uma necessidade específica, ou a semântica dos consumidores difere. | Manter localmente derivação, estado e significado da composição. | Cada filho mantém a responsabilidade visual documentada; o pai ordena a composição específica. | A composição local repetir uma intenção estável já compartilhada ou criar um componente genérico que esconda semânticas distintas. |
| `design_system_extension` | A necessidade tem anatomia, comportamento e responsabilidade estáveis que devem ser reutilizados e o catálogo não oferece uma composição adequada. | Descrever a lacuna, consumidores e comportamento visual pretendido. | A extensão futura recebe um contrato de apresentação, sem lógica de domínio indevida. | A evidência sustentar somente uma ocorrência específica, a diferença ser de conteúdo/produto, ou a extensão exigir muitos modos booleanos sem fronteira clara. |

Repetição entre consumidores é evidência para investigar um padrão, não limiar automático para abstração. Considere propósito, semântica, estados, dados de entrada e responsabilidades. O mesmo esqueleto visual pode exigir composições diferentes se os fatos ou o significado forem diferentes.

## Processo de escolha

1. Escreva a intenção da região e o contrato de conteúdo/interação antes do nome do componente.
2. Verifique no Storybook se existe componente com a mesma semântica e comportamento. Registre variante e props apenas após consulta MCP.
3. Se a regra for recorrente no módulo, avalie `domain_adapter`; se for específica, prefira `local_composition`.
4. Proponha `design_system_extension` quando a necessidade de apresentação for estável entre consumidores. Registre anatomia, responsabilidades, estados, acessibilidade e dependência de implementação/story.
5. Registre estratégia, entrada factual, ownership de estado/transformação, consumidores, evidência e alternativa considerada no UI decision log e no mapa de composição.

Uma lacuna no catálogo não termina a decisão de UI: descreva o contrato visual pretendido e a dependência. Não invente props, story IDs ou preview URLs. Separe `pending_design_system_api` de `pending_product_decision`; ambas bloqueiam `reconciled` quando materiais.

Use o componente mais semântico disponível. Não substitua um KPI, gráfico, tabela ou estado documentado por um `Card` genérico apenas para acomodar a composição. Não use preview visual como prova de uma prop não documentada. Não crie ações, dados, estados ou affordances sem contrato aprovado.
