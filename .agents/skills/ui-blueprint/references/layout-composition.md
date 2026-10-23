# Regras de composição espacial

Esta referência transforma a intenção visual em instruções de layout implementáveis. Ela define a relação espacial entre regiões; não cria requisitos funcionais nem inventa APIs de componentes.

## O que registrar por superfície

Registre uma **grade e proporções** antes de escolher componentes:

- grade-base do desktop, normalmente 12 colunas quando a referência exigir composição densa;
- faixas de conteúdo em ordem de leitura;
- span de cada região no desktop;
- transformação em tablet e mobile;
- prioridade de leitura e densidade de cada região;
- responsabilidade da rolagem.

Use valores de span como `xl:col-span-4` apenas como especificação de composição da tela. Eles não são props do componente, a menos que a documentação do Storybook declare uma prop correspondente.

## Três tipos de dimensão

| Tipo | O que descreve | Como fundamentar |
| --- | --- | --- |
| Proporção de layout | Colunas, spans, posição e ordem da região | Referência visual e conteúdo do discovery |
| Densidade | Peso visual: compacta, média ou dominante | Hierarquia da superfície e volume de conteúdo |
| Dimensão controlada | Altura, largura ou limite exposto por componente | Somente API verificada no Storybook ou requisito inequívoco da referência |

Não converta altura aproximada observada em uma imagem em valor de código. Quando um componente documenta uma dimensão — por exemplo, `ChartPanel.height` — registre a prop e a story que a valida. Quando não documenta, prefira densidade e span.

## Faixas e spans

Uma faixa agrupa regiões que devem ser lidas juntas no mesmo estágio da página. Para cada faixa, descreva a distribuição em desktop e sua degradação responsiva.

```text
Desktop: 12 colunas, gap-4

Faixa 1: KPI A 3 | KPI B 3 | KPI C 3 | KPI D 3
Tablet: dois KPIs por linha
Mobile: um KPI por linha
```

Use um wireframe textual quando a faixa tiver três ou mais regiões. Ele deve comunicar proporção, não conteúdo fictício.

## Transformação responsiva

- Desktop preserva a hierarquia e densidade que a referência torna relevante.
- Tablet reduz colunas, mas mantém a região dominante antes das auxiliares.
- Mobile empilha regiões; não remove uma leitura material para simplificar o exemplo.
- Tabelas preservam prioridade de leitura: podem ter rolagem **horizontal** ou uma apresentação alternativa definida pelo produto, mas nunca criam um segundo canvas vertical de página.
- Donut com legenda lateral só a mantém quando a largura comportar gráfico e legenda legíveis; em spans estreitos, tablet ou mobile, a legenda passa a empilhada. A legenda lateral usa sempre o formato de tabela (categoria, valor e percentual); cartões são exclusivos da legenda empilhada. Registre a escolha de `donutLegendLayout` quando ela for uma API disponível.
- O detalhe contextual abre no fluxo da mesma superfície e não cria rolagem vertical aninhada. Declare se ele fica adjacente à tabela no desktop ou abaixo dela em larguras menores.

## Densidade e prioridade

Use um destes níveis, com uma frase de justificativa quando não for evidente:

| Nível | Uso típico |
| --- | --- |
| Compacta | KPI, status, resumo curto ou filtro |
| Média | gráfico, lista curta, bloco de metadados ou card de política |
| Dominante | tabela principal, detalhe selecionado, gráfico analítico ou comparação extensa |

Uma região dominante normalmente ocupa maior span, aparece antes das auxiliares ou recebe uma faixa própria. Não use spans iguais apenas para reproduzir a quantidade de cards da referência.
