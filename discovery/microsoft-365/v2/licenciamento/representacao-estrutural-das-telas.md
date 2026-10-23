# Representação estrutural das telas de Licenciamento

**Referência**: as imagens `01` a `07` em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Licenciamento/`.

Este documento representa **itens, ordem e proporção estrutural** das telas do sponsor. Não define cores, fonte, pixel, nem autoriza a criação de dados comerciais/nominais. Quando uma fonte não existir na V2, o bloco continua no lugar indicado com estado explícito.

## Convenções

- `1/4` indica uma coluna de 25% da largura útil; `3/4`, 75%.
- `1/2` indica metade da largura útil; `2/3` e `1/3` seguem a mesma regra.
- `[indisponível]` preserva título, finalidade e condição de habilitação; não exibe zero ou dado inventado.
- `[restrito]` preserva a superfície, sem expor dados nominais até relatório identificado e autorização de tenant.
- **Decisão explícita**: o rótulo da visão é **“Utilização das Licenças”**, não “Utilização técnica”. Conforme a referência do sponsor, o donut **exibe o percentual de utilização no centro** e detalha usadas/disponíveis na legenda lateral ou abaixo do gráfico. A ausência desse valor é um desvio da implementação atual, não uma decisão de produto.

### Convenção Tailwind para a implementação

As proporções abaixo usam CSS Grid do Tailwind, com uma única coluna no celular e 12 colunas a partir de `xl`. Assim, `xl:col-span-6` é o equivalente prático a um `col-6` do Bootstrap; `xl:col-span-3` ocupa um quarto e `xl:col-span-9` ocupa três quartos.

```tsx
<section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
  <article className="xl:col-span-6">...</article>
</section>
```

As classes a seguir descrevem o **contêiner e seus filhos diretos**. Em telas menores, a ausência de `col-span` fora de `xl:` faz os blocos empilharem; não se deve ocultar um bloco só para acomodar a largura.

## Elementos comuns

Todas as telas têm, nesta ordem:

```text
Cabeçalho do submódulo
  título da aba + subtítulo
  [Exportar] [Período] [Última atualização / sincronizar]

Navegação horizontal
  Dashboard Executivo | Inventário de Licenças | Consumo | Custos |
  Otimização | Histórico | Planejamento
```

As referências também mencionam Compliance e Central de Contratação e Renovação em alguns contextos. Elas não são uma oitava ou nona tela deste recorte; quando aparecem, são um painel/bloco contextual dentro das sete telas ou uma capacidade futura.

---

## 01. Dashboard Executivo

### Faixa de indicadores

```text
[Licenças Totais] [Utilizadas] [Disponíveis] [Custo Mensal] [Economia Potencial] [Health Score Licenciamento]
```

Os três primeiros usam somente o universo de SKUs elegíveis e ativos. Custo e economia ficam `[indisponível]` sem Assessment/CSV. Health Score não deve ser substituído por “taxa de atribuição”; se não houver fórmula composta aprovada, o card fica `[indisponível]` com sua condição de habilitação.

### Grade principal — linha 1 (quatro colunas iguais)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12`, com cada card em `xl:col-span-3`.

```text
| 1/4 Utilização das Licenças | 1/4 Licenças Premium Subutilizadas |
| donut com percentual central | lista de produtos + barra/indicador |

| 1/4 Evolução do Custo (12m) | 1/4 Licenças Vencendo |
| gráfico [indisponível]       | lista de renovações [indisponível] |
```

### Grade principal — faixa 2 (duas linhas internas à esquerda)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Oportunidades em `xl:col-span-9`, Ações Rápidas em `xl:col-span-3 xl:row-span-2`, Produto em `xl:col-span-6`, Departamento em `xl:col-span-3` e Tendência em `xl:col-span-3`.

```text
| 3/4 — linha interna 1: Principais Oportunidades de Otimização      | 1/4 Ações Rápidas |
| cards: ociosas | downgrade | sem utilização | expirando           | contratar / upgrade-downgrade |
| regra, evidência, prioridade, confiança e detalhe somente leitura  | simular / lembretes / exportar |
|---------------------------------------------------------------------| ocupa a altura das |
| 3/4 — linha interna 2: Licenças por Produto | Distribuição por Departamento | Tendência de Utilização |
|   1/2 tabela SKU/capacidade                  | 1/4 donut + legenda [restrito] | 1/4 linhas temporais |
|                                                                     | duas linhas internas |
```

As ações rápidas são `coming_soon` nesta V2; “analisar evidência” é uma leitura disponível, não uma ação desabilitada.

### Grade principal — linha 3

`grid grid-cols-1 gap-4 xl:grid-cols-12`, com Central em `xl:col-span-9` e Avisos em `xl:col-span-3`.

```text
| 3/4 Central de Contratação e Renovação [coming_soon] | 1/4 Avisos e Lembretes |
| contratar | upgrade/downgrade | simular | renovar      | alertas técnicos/comerciais |
```

## 02. Inventário de Licenças

Cada linha é um contêiner `grid grid-cols-1 gap-4 xl:grid-cols-12`; os seus blocos de largura total usam `xl:col-span-12`.

```text
Linha 1 — indicadores (7 colunas; `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`)
  Produtos ativos | Assentos contratados | Assentos atribuídos |
  Assentos disponíveis | Assinaturas comerciais | Custo mensal | Produtos em atenção

Linha 2 — filtros (largura total; `xl:col-span-12`)
  busca | família | status técnico | status comercial | origem | renovação | mais filtros

Linha 3 — tabela expansível (largura total; `xl:col-span-12`)
  Produto/licença | Família | Tipo | Compradas | Atribuídas | Disponíveis |
  Utilização | Estado técnico | Custo mensal | Vigência | Renovação |
  Compromisso | Cobrança | Origem | Ações

Linha 4 — detalhe do produto selecionado (largura total; `xl:col-span-12`)
  resumo de capacidade + [Solicitar alteração]
  abas: Resumo | Usuários atribuídos | Planos de serviço |
        Contratos e assinaturas | Histórico de alterações
  conteúdo: detalhes da licença | donut de status de usuários |
            utilização por planos | informações comerciais
```

Capacidade, estado e planos são técnicos. Usuários são `[restrito]`; informações de contrato, custo, vigência, origem comercial e renovação são `[indisponível]` até Assessment/CSV. A tabela conserva todas as classificações de SKU, mas só os elegíveis/ativos compõem assentos do resumo.

## 03. Consumo

Linhas de conteúdo usam `grid grid-cols-1 gap-4 xl:grid-cols-12`.

```text
Linha 1 — resumo de consumo (6 colunas; `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`)
  Licenças atribuídas | Usuários ativos (30 dias) |
  Licenças efetivamente utilizadas | Licenças ociosas (90 dias) |
  Taxa de adoção | Custo sem utilização

Linha 2 — duas colunas iguais (`xl:col-span-6` para cada bloco)
  1/2 Consumo por produto
  seletor 7 / 30 / 90 dias
  produto | atribuídas | usuários ativos | adoção | última atividade |
  ociosas | custo ocioso

  1/2 Consumo por usuário
  busca + seletor 30 / 90 dias
  usuário | departamento | licenças | serviços utilizados |
  última atividade | frequência | status

Linha 3 — três colunas iguais (`xl:col-span-4` para cada bloco)
  1/3 Distribuição por departamento | 1/3 Tendência de utilização |
  1/3 Ociosidade, alertas e oportunidades
```

“Usuários ativos” só pode representar pessoas únicas quando uma fonte identificada permitir reconciliação. Com os relatórios atuais por workload, o bloco deve declarar a métrica como **atividade por workload**, sem agregá-la como usuários únicos. Visões por usuário/departamento ficam `[restrito]`; custo ocioso fica `[indisponível]` sem preço.

## 04. Custos

Linhas de conteúdo usam `grid grid-cols-1 gap-4 xl:grid-cols-12`.

```text
Linha 1 — resumo financeiro (7 colunas; `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`)
  Custo mensal atual | Custo anual projetado | Custo por usuário ativo |
  Custo de licenças ociosas | Economia potencial | Variação mensal | Próxima renovação

Linha 2 — duas colunas (1/3 + 2/3; `xl:col-span-4` + `xl:col-span-8`)
  1/3 Evolução dos custos
  linhas: total, utilizado, ocioso, economia, usuários ativos
  2/3 Custos por produto
  tabela: quantidade faturada, custo unitário, mensal, anual,
          utilização, custo ocioso, variação

Linha 3 — duas colunas (1/3 + 2/3; `xl:col-span-4` + `xl:col-span-8`)
  1/3 Custos por departamento | 2/3 Custos por usuário

Linha 4 — duas colunas (2/3 + 1/3; `xl:col-span-8` + `xl:col-span-4`)
  2/3 Eficiência financeira | 1/3 Alertas, variações e oportunidades financeiras
```

Toda a tela é `[indisponível]` sem dados comerciais, mas todos os sete blocos permanecem visíveis. Cada um informa `Assessment/CSV` como fonte necessária e nunca usa valor, renovação, orçamento ou conciliação sintéticos.

## 05. Otimização

Linhas de conteúdo usam `grid grid-cols-1 gap-4 xl:grid-cols-12`.

```text
Linha 1 — resumo das oportunidades (7 colunas; `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`)
  oportunidades | economia mensal | economia anual | removíveis |
  downgrades | realocações | recursos premium subutilizados

Linha 2 — duas colunas iguais (`xl:col-span-6` para cada bloco)
  1/2 Oportunidades priorizadas
  prioridade | recomendação | categoria | impactados | economia |
  confiança | ação
  1/2 Otimização por categoria: donut + economia por categoria

Linha 3 — três colunas iguais (`xl:col-span-4` para cada bloco)
  1/3 Recomendações por produto | 1/3 Recomendações por usuário |
  1/3 Simulador de economia

Linha 4 — duas colunas (1/3 + 2/3; `xl:col-span-4` + `xl:col-span-8`)
  1/3 Exceções, validações e aprovações | 2/3 Resultados obtidos
```

A fila e a evidência técnica podem estar disponíveis. Economia, simulador, recomendação por usuário, aprovações e resultados realizados dependem de preço, evidência identificada ou workflow; permanecem `[indisponível]`, `[restrito]` ou `coming_soon` conforme o caso.

## 06. Histórico

Linhas de conteúdo usam `grid grid-cols-1 gap-4 xl:grid-cols-12`.

```text
Linha 1 — resumo do período (8 colunas; `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-8`)
  alterações registradas | licenças adicionadas | removidas | upgrades |
  downgrades | renovações | economia realizada | variação de custo

Linha 2 — linha do tempo em metade e dois gráficos em um quarto
  1/2 Linha do tempo das alterações (até 6 eventos; `xl:col-span-6`)
  tipo | busca | filtros | somente não conciliados
  evento: data/hora, produto, contexto, origem, autor, status e impacto
  1/4 Evolução quantitativa das licenças (`xl:col-span-3`) | 1/4 Evolução financeira (`xl:col-span-3`)

Linha 3 — duas colunas iguais (`xl:col-span-6` para cada bloco)
  1/2 Histórico por produto | 1/2 Histórico por usuário
```

Eventos, snapshots, produto, origem e confirmação são técnicos. Histórico financeiro é `[indisponível]`; pessoa e departamento são `[restrito]`. A ausência antes da implantação deve aparecer como falta de cobertura, não como período sem alterações.

## 07. Planejamento

Linhas de conteúdo usam `grid grid-cols-1 gap-4 xl:grid-cols-12`.

```text
Linha 1 — Planejamento Executivo (7 colunas; `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`)
  licenças previstas para aquisição | investimento | renovações |
  economia planejada | crescimento | projetos | solicitações abertas

Linha 2 — três colunas iguais (`xl:col-span-4` para cada bloco)
  1/3 Calendário de Renovações | 1/3 Simulador de Crescimento |
  1/3 Roadmap de Licenciamento

Linha 3 — três colunas iguais (`xl:col-span-4` para cada bloco)
  1/3 Simulações | 1/3 Central Comercial Microsoft | 1/3 Consultor Microsoft

Linha 4 — Recomendações Estratégicas (largura total; `xl:col-span-12`; cards internos em `xl:col-span-4`)
```

Cenários técnicos, roadmap e recomendações podem estar disponíveis com premissas e limites. Calendário, investimento, aquisição, central comercial, cotação, solicitação e execução permanecem `[indisponível]` ou `coming_soon` até fonte comercial e workflow.

## Critério de implementação

A fidelidade desta representação será verificada por **posição estrutural e presença do bloco**, e não por cor. Um bloco não pode ser removido porque sua fonte ainda não existe; ele precisa ocupar a célula indicada com sua condição de habilitação. Alterações futuras no código devem partir desta página, não de rótulos genéricos como “utilização técnica”.
