# Representação estrutural das telas — Microsoft 365 / Secure Score

## Referências

- **Visuais do sponsor**: `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Secure Score/01.Dashboard Executivo.png` a `08.Histórico e Auditoria.png` (fonte primária, uma PNG por tela).
- **Discovery e decisões**: [README](README.md), [expectativas](expectativas-do-sponsor.md), [fontes](fontes-e-rastreabilidade.md) e subdiretórios das superfícies.
- **Requisitos/specs**: não há Spec aprovada.
- **Padrões implementados**: `docs/DESIGN-orkestria.md`.

Valores, pessoas e datas das PNGs são ilustrativos. A representação fixa composição, anatomias e estados, não tokens, pixel ou componentes novos. Todo bloco dependente de fonte expõe disponibilidade, cobertura e frescor; ausência nunca vira zero.

## Convenções

- Móvel: `grid-cols-1 gap-4`; blocos empilham, nunca somem. Em `xl`, aplicam-se os spans abaixo.
- `available`: fonte publicada; `restricted`: fonte/coleta não autorizada; `unavailable`: dado/regra ausente; `coming_soon`: workflow interno não aprovado.
- **C1 donut**: título; plot/total à esquerda; legenda lateral direita, vertical, com marcador + rótulo + valor/percentual; tooltip da categoria; resumo textual do total/distribuição; no móvel, plot antes da legenda empilhada.
- **C2 linha**: legenda horizontal acima, na ordem declarada; X=data/período, Y=métrica; tooltip por data/série; resumo início/fim/variação; no móvel, legenda empilhada sem ocultar série.
- **C3 ranking/lista**: título; linhas verticais, item à esquerda e métrica alinhada à direita; máximo observado, CTA textual no rodapé; tooltip repete item/métrica quando houver truncamento; resumo lista os itens e o total. No móvel conserva ordem e métrica, com texto em duas linhas. Só há `Outros` quando explicitamente declarado.
- **C4 tabela**: título, cabeçalho, linhas, paginação/contador e CTA textual quando observados; cada cabeçalho mantém associação com a célula; móvel usa rolagem horizontal acessível e resumo de colunas.
- **C5 barras**: título; categorias na ordem declarada; em barras horizontais, rótulo à esquerda, plot central e valor/percentual à direita; em barras verticais, X=categoria/período e Y=unidade; legenda acima quando há mais de uma série; tooltip identifica categoria, série e valor; resumo textual enumera as barras. No móvel, conserva categorias/séries e empilha legenda.
- **C6 gauge/score**: título; gauge ou donut compacto com percentual central; pontos atual/máximo e variação ao lado/abaixo; série única identificada pelo título, sem legenda; tooltip repete percentual/pontos/data; resumo textual declara os mesmos três valores; no móvel, gauge precede métricas empilhadas.

Ao citar C1–C5, a anatomia do bloco instancia o respectivo mini-diagrama abaixo: os títulos, categorias, eixos, CTA e estados declarados no bloco substituem os placeholders; não são detalhes deixados à implementação.

Para não omitir a rastreabilidade em grupos de cartões homogêneos, uma linha **Estado e fonte** no fim da anatomia enumera cada filho direto pelo título e vale como o registro individual de disponibilidade desse filho; ela nunca autoriza a implementação a herdar estado de outro cartão não listado.

```text
C1  Título
    [ plot / total ]  [• categoria          valor (%) ]
                     [• próxima categoria  valor (%) ]
    resumo textual                         CTA

C2  Título
    [• série  • série  • série]     (legenda)
    eixo Y |----------- plot -----------|
           +------------ eixo X --------+
    resumo textual                         CTA

C3  Título
    item/rótulo                          métrica
    próximo item                         métrica
    Top N; tratamento explícito da cauda   CTA

C4  Título
    cabeçalhos de colunas
    células da linha; ...
    linhas/paginação/contador              CTA

C5  Título + legenda quando multissérie
    categoria | barra/plot | valor (%)
    próxima categoria | ... | valor (%)
    resumo textual                         CTA

C6  Título
    [gauge/%] [pontos atual/máximo]
              [variação/período]
    resumo textual
```

## Elementos comuns

```text
Navegação Microsoft 365 > Secure Score
Título + subtítulo | Exportar | Atualizar | última atualização
Faixas da visão
Rodapé: origem Graph, atraso de atualização e link externo
```

Exportar é `unavailable` até contrato de privacidade; Atualizar é coleta coordenada somente leitura e só habilita com autorização.

---

## 01. Dashboard Executivo

### Faixa 1 — score e KPIs

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr_0.9fr_1.15fr_1fr_1.1fr]`; **Secure Score Atual**, **Pontos Conquistados**, **Pontos Disponíveis**, **Ações de Melhoria**, **Ganho Potencial**, **Meta de Secure Score** `xl:col-span-1` cada. As frações são inferência estrutural baseada nas larguras relativas observáveis da PNG 01.

```text
[Secure Score Atual][Pontos Conquistados][Pontos Disponíveis][Ações de Melhoria][Ganho Potencial][Meta]
```

#### Anatomia dos blocos desta faixa

**Secure Score Atual — gauge**: C6; percentual central, pontos “atual de máximo”, classificação, variação e atualização; `available` com `secureScores` publicado, `restricted` sem autorização.

**Pontos Conquistados — KPI**: ícone; título; valor “de máximo”; comparação versus período anterior. Estado: `available` com fotografia `secureScores` publicada; `restricted` sem coleta autorizada.

```text
ícone  Pontos Conquistados
       valor de máximo
       variação vs. período anterior
```

**Pontos Disponíveis — KPI**: ícone; título; valor “de máximo”; comparação versus período anterior. Estado: `available` com fotografia `secureScores` publicada; `restricted` sem coleta autorizada.

```text
ícone  Pontos Disponíveis
       valor de máximo
       variação vs. período anterior
```

**Ações de Melhoria — KPI distribuído**: título e total; linhas Concluídas, Parciais, Não implementadas com marcador, contagem e percentual. Estado: `available` com fotografia publicada; `restricted` sem autorização.

```text
Ações de Melhoria
148 no total
• Concluídas          quantidade (%)
• Parciais            quantidade (%)
• Não implementadas   quantidade (%)
```

**Ganho Potencial — KPI**: ícone; título; pontos; percentual do score atual. Estado: `available` com fotografia/catálogo publicados; `restricted` sem coleta autorizada; nunca estimar sem catálogo.

```text
ícone  Ganho Potencial
       pontos
       percentual do score atual
```

**Meta de Secure Score — KPI de progresso**: meta interna persistida por tenant (padrão de produto 80%), barra/gauge e distância factual para o score atual; `available` quando há score publicado e `unavailable` sem score. Não implica previsão nem escrita no tenant Microsoft.

### Faixa 2 — análise principal

`grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12`; **Evolução do Secure Score (últimos 90 dias)** 5; **Distribuição por Categoria** 4; **Ações por Prioridade** 3.

```text
[Evolução do Secure Score-----][Distribuição por Categoria----][Ações por Prioridade---]
```

#### Anatomia dos blocos desta faixa

**Evolução do Secure Score (últimos 90 dias) — linha**: C2; legenda Secure Score (%), Pontos Conquistados, Pontos Máximos; X=data, Y esquerdo=%/direito=pontos; CTA “Ver análise completa”. A meta interna não é projetada nesta série; previsão permanece `coming_soon`.

**Distribuição por Categoria — donut**: C1; centro percentual/“Secure Score”; legenda lateral Identidade, Dispositivos, Aplicativos, Dados, Infraestrutura, com percentual e atual/máximo; Infraestrutura só com controles; CTA “Ver detalhes por categoria”.

**Ações por Prioridade — barras horizontais**: C5; Críticas, Altas, Médias, Baixas (ordem vertical); rótulo, barra, total/percentual; CTA “Ver todas as ações”. A classificação aplica as faixas do score composto aprovadas pelo sponsor: Crítica `85–100`, Alta `70–<85`, Média `50–<70`, Baixa `0–<50`.

**Estado e fonte**: Evolução e Distribuição por Categoria = `available` com `secureScores` publicado, `restricted` sem coleta autorizada; Ações por Prioridade = `available` com score e perfis publicados, `restricted` sem coleta autorizada.

### Faixa 3 — oportunidades e plano

`grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12`; **Principais Oportunidades (por ganho potencial)** 5; **Principais Riscos** 3; **Status do Plano de Remediação** 4.

```text
[Principais Oportunidades-----][Principais Riscos---][Status do Plano de Remediação----]
```

#### Anatomia dos blocos desta faixa

**Principais Oportunidades (por ganho potencial) — tabela/ranking**: C3/C4, Top 5; Ação, Categoria, Ganho, Prioridade, Esforço; CTA “Ver todas as ações”; sem `Outros` na referência.

**Principais Riscos — lista**: até cinco linhas, ícone, descrição e impacto à direita; CTA “Ver todos os riscos”; fonte correlata ausente = `unavailable`.

**Status do Plano de Remediação — donut**: C1; total central; Não iniciadas, Em análise, Em execução, Aguardando validação, Concluídas; CTA “Acessar plano de remediação”; `coming_soon`.

**Estado e fonte**: Principais Oportunidades = `available` com fotografia e catálogo de controles publicados, `restricted` sem coleta autorizada; Principais Riscos = `unavailable` sem fontes correlatas publicadas; Status do Plano = `coming_soon` até workflow interno aprovado.

### Faixa 4 — contexto

`grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12`; **Informações do Ambiente** 5; **Comparativo com outros tenants** 4; **Insights Inteligentes** 3.

```text
[Informações do Ambiente-----][Comparativo com outros tenants----][Insights Inteligentes---]
```

#### Anatomia dos blocos desta faixa

**Informações do Ambiente — indicadores**: Usuários ativos, Usuários licenciados, Serviços habilitados, Data center principal; ícone, rótulo, valor; CTA “Ver informações completas do ambiente”.

**Comparativo com outros tenants — barras compactas**: C5; Você, Todos os tenants, Tenants mesmo porte; rótulo, barra e percentual; CTA “Ver comparativos completos”. Média ausente = `unavailable`.

**Insights Inteligentes — lista**: C3; até três alertas; CTA “Ver todos os insights”; só publica regra aprovada, senão `unavailable`.

**Estado e fonte**: Informações do Ambiente = `available` com projeções locais de tenant publicadas, `restricted` sem fontes autorizadas; Comparativo = `unavailable` sem média publicada; Insights = `unavailable` sem regra aprovada.

---

## 02. Pontuação por Categoria

### Faixa 1 — resumo

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12`; **Secure Score Geral** `xl:col-span-3`; **Pontos Conquistados** 2; **Pontos Disponíveis** 2; **Ações de Melhoria** 3; **Ganho Potencial** 2.

```text
[Secure Score Geral---][Pontos Conquistados][Pontos Disponíveis][Ações de Melhoria---][Ganho Potencial]
```

#### Anatomia dos blocos desta faixa

**Secure Score Geral — donut compacto**: C6; valor central à esquerda, pontos/variação ao lado; `available` com fotografia publicada, `restricted` sem autorização.

**Pontos Conquistados — KPI**: ícone, título, valor/de máximo e variação. **Pontos Disponíveis — KPI**: ícone, título, valor/de máximo e variação. **Ações de Melhoria — KPI distribuído**: título, total e linhas Concluídas/Parciais/Não implementadas. **Ganho Potencial — KPI**: ícone, título, pontos e comparação. Todos: `available` com fotografia/catálogo publicados; `restricted` sem autorização.

```text
Secure Score Geral: [donut/%] [pontos] [variação]
KPI: ícone | título | valor/unidade | comparação
Ações: título | total | • concluídas | • parciais | • não implementadas
```

### Faixa 2 — filtros

`grid grid-cols-1 gap-4 md:grid-cols-4 xl:grid-cols-12`; **Período** `xl:col-span-4`; **Categoria** 2; **Comparar com** 4; **Limpar filtros** 2.

```text
[Período---][Categoria--][Comparar com---][Limpar filtros------]
```

#### Anatomia dos blocos desta faixa

Cada filtro possui rótulo, valor selecionado e seletor; **Limpar filtros** é botão final. No móvel todos empilham, sem ocultar campos.

### Faixa 3 — Pontuação por Categoria

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Pontuação por Categoria** 12.

```text
[Categoria | Pontuação Atual (pontos,%) | Pontuação Máxima (pontos,%) | Pontos Disponíveis | Controles (total, concluídos, parciais, pendentes) | Ganho | Variação | Tendência]
```

#### Anatomia dos blocos desta faixa

**Pontuação por Categoria — tabela**: C4; cabeçalhos agrupados, barra/percentual, números e sparkline por linha; tooltip data/valor e alternativa textual de tendência; linha Total. Infraestrutura só com controles.

### Faixa 4 — análises

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Distribuição dos Controles por Status** 3; **Comparativo por Categoria (vs. média de todos os tenants)** 3; **Evolução por Categoria (últimos 90 dias)** 4; **Top 5 Categorias com Maior Ganho Potencial** 2.

```text
[Distribuição---][Comparativo---][Evolução por Categoria----][Top 5--]
```

#### Anatomia dos blocos desta faixa

**Distribuição dos Controles por Status — donut**: C1; total e Concluídos/Parciais/Não implementados.

**Comparativo por Categoria — barras duplas**: C5; categoria, Você e Média na mesma linha, rótulos diretos; CTA “Ver comparativos completos”; `available` quando a fotografia contém categoria e média Microsoft compatíveis, sem média=`unavailable`.

**Evolução por Categoria — linha**: C2; Identidade, Dispositivos, Aplicativos, Dados, Infraestrutura; X=data/Y=%; CTA “Ver evolução detalhada”.

**Top 5 Categorias com Maior Ganho Potencial — ranking**: C3; cinco categorias, ícone e pontos; CTA “Ver todas as oportunidades”; sem cauda.

```text
Distribuição: [donut/total] [• concluídos | • parciais | • não implementados]
Comparativo: categoria | Você (barra/%) | Média (barra/%) | Ver comparativos completos →
Evolução: [legenda categorias] [plot X=data/Y=%] | Ver evolução detalhada →
Top 5: ícone + categoria | pontos | Ver todas as oportunidades →
```

**Estado e fonte**: Distribuição, Evolução e Top 5 = `available` com fotografia/catálogo Graph publicados, `restricted` sem autorização; Comparativo = `available` quando a fotografia contém média Microsoft compatível por categoria e `unavailable` sem essa média.

---

## 03. Ações de Melhoria

### Faixa 1 — resumo

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Ações de Melhoria** 2; **Pontos Disponíveis** 2; **Ganho Potencial por Prioridade** 3; **Ações Rápidas** 2; **Top Ameaças Mitigadas** 3.

```text
[Ações de Melhoria][Pontos Disponíveis][Ganho Potencial por Prioridade---][Ações Rápidas][Top Ameaças Mitigadas---]
```

#### Anatomia dos blocos desta faixa

**Ações de Melhoria — KPI distribuído**: total e Concluídas/Parciais/Não implementadas com marcador, quantidade, percentual.

**Pontos Disponíveis — KPI**: ícone, valor/de máximo e percentual atual.

**Ganho Potencial por Prioridade — donut**: C1. **Plot e total à esquerda; legenda lateral direita, vertical**, em ordem **Críticas, Altas, Médias, Baixas**. Cada item: marcador, rótulo, pontos e percentual. Tooltip repete prioridade/pontos/percentual; resumo textual enumera as parcelas; no móvel a legenda fica abaixo do plot. Fonte é fotografia/catálogo publicado; prioridade interna exige regra aprovada.

**Ações Rápidas — KPI**: total, contexto de ganho e CTA “Ver ações rápidas”; `coming_soon`.

**Top Ameaças Mitigadas — ranking**: C3; cinco ameaças e número de ações; CTA “Ver todas as ameaças”; sem `Outros`.

### Faixa 2 — filtros

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8`; **Categoria**, **Serviço**, **Status Microsoft**, **Status Orkestria**, **Prioridade**, **Esforço**, **Impacto**, **Filtros avançados** `xl:col-span-1` cada.

```text
[Categoria][Serviço][Status Microsoft][Status Orkestria][Prioridade][Esforço][Impacto][Filtros avançados]
```

#### Anatomia dos blocos desta faixa

**Categoria**, **Serviço**, **Status Microsoft**, **Status Orkestria**, **Prioridade**, **Esforço**, **Impacto — filtro**: rótulo, valor selecionado e seletor. **Filtros avançados — ação**: botão ao fim da linha. Todos empilham no móvel; Status Orkestria `coming_soon`; Prioridade, Esforço e Impacto ficam `available` com score/perfis publicados e usam o catálogo publicado.

```text
rótulo
valor atual                         chevron
```

### Faixa 3 — tabela de ações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Ações de Melhoria** `xl:col-span-12`.

```text
[seleção | ação | categoria | serviço | pontos atual/máx./ganho | status Microsoft/Orkestria | prioridade | esforço | impacto | ameaças | última modificação]
```

#### Anatomia dos blocos desta faixa

**Ações de Melhoria — tabela**: C4; chips, ícones de ameaças, seleção, paginação, seletor de linhas à esquerda e contador à direita. Estado `available` com fotografia/catálogo publicados, `restricted` sem autorização; campos Orkestria não têm fallback fictício: `coming_soon`.

```text
Ações de Melhoria (N)
□ ação | categoria | serviço | pontos | status | prioridade | esforço | impacto | ameaças | data
linhas por página | paginação | mostrando N
```

### Faixa 4 — complementos

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Distribuição por Status Orkestria**, **Distribuição por Esforço**, **Ações com Maior Ganho Potencial**, **Ações Vencidas ou Próximas do Prazo** 3 cada.

```text
[Distribuição por Status---][Distribuição por Esforço---][Ações com Maior Ganho---][Ações Vencidas/Próximas---]
```

#### Anatomia dos blocos desta faixa

**Distribuição por Status Orkestria — donut**: C1; total central; legenda lateral direita, vertical, na ordem Não iniciada, Em análise, Planejada, Em execução, Aguard. validação, Concluída, cada item com marcador/quantidade/percentual; CTA “Ver todas as ações”; `coming_soon`.

**Distribuição por Esforço — donut**: C1; total central; legenda lateral direita, vertical, Baixo, Médio, Alto, cada item com marcador/quantidade/percentual; CTA “Ver todas as ações”; fonte Graph `available`/`restricted` conforme publicação.

**Ações com Maior Ganho Potencial — ranking**: C3 Top 5, ação/pontos, CTA “Ver todas as oportunidades”, sem `Outros`.

**Ações Vencidas ou Próximas do Prazo — alertas**: Vencidas, até 7 dias, até 30 dias; ícone, contagem e pontos; CTA “Ver ações por prazo”; `coming_soon`.

```text
Status: [donut/total] [legenda lateral por status] | Ver todas as ações →
Esforço: [donut/total] [• baixo | • médio | • alto] | Ver todas as ações →
Ganho: ação | pontos | Ver todas as oportunidades →
Prazo: ícone | faixa temporal | contagem | pontos | Ver ações por prazo →
```

**Estado e fonte**: Status Orkestria e Prazo = `coming_soon` até workflow interno; Esforço e Maior Ganho = `available` com perfis/fotografia Graph publicados, `restricted` sem autorização.

---

## 04. Plano de Remediação

### Faixa 1 — navegação interna

`grid grid-cols-1 gap-4`; **Abas do Plano** `col-span-full`.

```text
[Visão Geral][Plano Kanban][Roadmap][Por Responsável][Calendário][Dependências]
```

#### Anatomia dos blocos desta faixa

**Abas do Plano — navegação linear**: seis rótulos na ordem mostrada, aba ativa sublinhada; no móvel a barra rola horizontalmente sem ocultar abas. Somente Visão Geral tem a composição abaixo; as demais preservam rótulo e `coming_soon`.

### Faixa 2 — KPIs

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`: **Pontos Disponíveis**, **Ações Abertas**, **Em Execução**, **Concluídas**, **Ações Vencidas**, **Ganho Potencial** `xl:col-span-1` cada.

```text
[Pontos Disponíveis][Ações Abertas][Em Execução][Concluídas][Ações Vencidas][Ganho Potencial]
```

#### Anatomia dos blocos desta faixa

**Pontos Disponíveis, Ações Abertas, Em Execução, Concluídas, Ações Vencidas, Ganho Potencial — KPI**: cada cartão mantém a mesma anatomia, com ícone à esquerda, título, valor principal, contexto percentual/“de total” abaixo e variação/ganho no rodapé; Ganho acrescenta score projetado. Fonte interna não aprovada: `coming_soon`.

```text
ícone  Título
       valor principal
       contexto/percentual
       variação ou score projetado
```

### Faixa 3 — resumo, evolução e projeção

`grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12`; **Resumo do Plano** 3; **Evolução do Secure Score** 5; **Projeção para a Meta** 4.

```text
[Resumo do Plano---][Evolução do Secure Score-----][Projeção para a Meta----]
```

#### Anatomia dos blocos desta faixa

**Resumo do Plano — donut**: C1; Não iniciadas, Em análise, Planejadas, Em execução, Aguardando validação, Concluídas.

**Evolução do Secure Score — linha**: C2; Score Atual, Score Projetado, Meta; X=período/Y=%; projeção sem regra/seleção = `unavailable`.

**Projeção para a Meta — métricas**: meta, diferença, ganho selecionado, score projetado, ações restantes, data; CTA “Simular Ganho”; `coming_soon`.

```text
Resumo do Plano                 Evolução do Secure Score        Projeção para a Meta
[donut/total][legenda lateral] [legenda][plot X/período Y/%]    Meta / diferença
                                                               ganho / score / ações / data
```

### Faixa 4 — Plano Kanban

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6`; **Não Iniciadas**, **Em Análise**, **Planejadas**, **Em Execução**, **Aguard. Validação**, **Concluídas** 1 cada.

```text
[Não Iniciadas][Em Análise][Planejadas][Em Execução][Aguard. Validação][Concluídas]
```

#### Anatomia dos blocos desta faixa

**Não Iniciadas, Em Análise, Planejadas, Em Execução, Aguard. Validação, Concluídas — coluna Kanban**: título + total; cards em ordem vertical com ação, categoria, ganho e selo de prioridade/progresso/status; CTA “Ver todas (N)”. Móvel empilha colunas. Drag-and-drop/mudança de estado `coming_soon`.

```text
Nome da coluna (N)      ⋮
[ação]
categoria · ganho       [prioridade/progresso]
[próxima ação]
Ver todas (N)
```

### Faixa 5 — execução

`grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12`; **Top Ações por Ganho Potencial** 6; **Ganhos por Período (Projeção)** 3; **Insights do Plano** 3.

```text
[Top Ações por Ganho------][Ganhos por Período---][Insights do Plano---]
```

#### Anatomia dos blocos desta faixa

**Top Ações por Ganho Potencial — tabela**: C4/Top 5; ação, categoria, ganho, prioridade, esforço, impacto, status, responsável, prazo; CTA “Ver todas as ações”; internos `coming_soon`.

**Ganhos por Período (Projeção) — barras**: C5; 0–30,31–60,61–90,91–180,+180 dias; X=período/Y=pontos, rótulo direto, tooltip/resumo; CTA “Ver roadmap completo”; `unavailable` sem projeção.

**Insights do Plano — lista**: C3; até quatro itens; CTA “Ver todas as recomendações”; `unavailable` sem regra.

---

## 05. Comparativos e Metas

### Faixa 1 — navegação interna

`grid grid-cols-1 gap-4`; **Abas de Comparativos e Metas** `col-span-full`.

```text
[Visão Geral][Comparativos][Metas][Projeções][Desempenho por Categoria]
```

#### Anatomia dos blocos desta faixa

**Abas de Comparativos e Metas — navegação linear**: ordem e aba ativa conforme diagrama; no móvel rolagem horizontal acessível. Só Visão Geral está detalhada; demais `coming_soon`.

### Faixa 2 — KPIs

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5`: **Secure Score Atual**, **Sua Posição (Todos os tenants)**, **Média (Todos os tenants)**, **Sua Meta Geral**, **Projeção para atingir a meta** `xl:col-span-1` cada.

```text
[Secure Score Atual][Sua Posição][Média][Sua Meta Geral][Projeção para atingir a meta]
```

#### Anatomia dos blocos desta faixa

**Secure Score Atual — gauge**: C6; gauge à esquerda, percentual/pontos e variação à direita; série única sem legenda, tooltip/resumo/móvel conforme C6. **Sua Posição (Todos os tenants)**: ícone, percentil e texto comparativo. **Média (Todos os tenants)**: ícone, percentual e pontos. **Sua Meta Geral**: ícone, meta interna persistida por tenant (padrão 80%) e distância factual para o score atual; `available` com score e `unavailable` sem score. **Projeção para atingir a meta**: ícone, data, dias e selo de status. Média ausente=`unavailable`; projeção=`coming_soon`.

```text
[gauge | %/pontos/variação][ícone | percentil | comparação][ícone | média/pontos]
[ícone | meta | barra/diferença][ícone | data | dias | status]
```

### Faixa 3 — comparativo e radar

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Comparativo por Categoria** 9; **Radar de Comparação** 3.

```text
[Comparativo por Categoria-----------------------------------][Radar de Comparação---]
```

#### Anatomia dos blocos desta faixa

**Comparativo por Categoria — tabela**: C4; Categoria; Seu Score (% e pontos); Média todos (% e pontos); Média mesmo porte (% e pontos, `TotalSeats` publicado pelo Graph); Meta geral persistida; Diferença p/ meta geral (`meta geral − seu score`, em p.p.); Posição; Evolução/sparkline. A ausência é declarada por célula. Meta específica por categoria, posição e evolução permanecem não publicadas.

**Radar de Comparação — radar**: legenda superior Você, Média Todos os tenants, Meta; eixos Identidade/Dispositivos/Aplicativos/Dados/Infraestrutura; tooltip, resumo maior distância/meta; no móvel empilha com contexto.

### Faixa 4 — progresso

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Evolução vs. Meta (Geral)**, **Progresso das Metas por Categoria**, **Ganho Necessário por Categoria** 4 cada.

```text
[Evolução vs. Meta----][Progresso das Metas----][Ganho Necessário----]
```

#### Anatomia dos blocos desta faixa

**Evolução vs. Meta (Geral) — linha**: C2; legenda superior Seu Score, Meta, Projeção; X=mês, Y=percentual; tooltip/sumário de início-fim; `coming_soon`.

**Progresso das Metas por Categoria — tabela de barras**: C4/C5; categoria, meta, atual, barra de progresso e status; resumo textual por categoria; `coming_soon`.

**Ganho Necessário por Categoria — tabela**: C4; categoria, pontos necessários e ganho percentual necessário; `coming_soon`.

```text
Evolução: [legenda] [plot X=mês/Y=%]
Progresso: categoria | meta | atual | barra | status
Ganho:     categoria | pontos necessários | p.p. necessário
```

### Faixa 5 — apoio

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Insights de Comparação**, **Referências dos Comparativos**, **Metas Configuradas** 4 cada.

```text
[Insights de Comparação----][Referências dos Comparativos----][Metas Configuradas----]
```

#### Anatomia dos blocos desta faixa

**Insights de Comparação — lista**: C3, ícone + achado em cada linha. **Referências dos Comparativos — lista**: C3, ícone + tipo de referência + explicação. **Metas Configuradas — tabela**: C4; Tipo, Meta, Data-alvo, Responsável, Status e CTA “Gerenciar metas”. O gerenciamento de metas permanece `coming_soon`; isso não invalida a meta geral interna persistida exibida nos KPIs.

```text
[ícone insight + texto][ícone referência + explicação][Tipo | Meta | Data | Responsável | Status]
                                                          Gerenciar metas →
```

---

## 06. Evolução e Tendências

### Faixa 1 — KPIs

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`: **Secure Score Atual**, **Variação (7 dias)**, **Maior Score (período)**, **Menor Score (período)**, **Média (período)**, **Tendência Geral (30 dias)** `xl:col-span-1` cada.

```text
[Score Atual][Variação][Maior][Menor][Média][Tendência]
```

#### Anatomia dos blocos desta faixa

**Secure Score Atual — gauge**: C6; percentual, pontos e variação; série única sem legenda, tooltip/resumo/móvel conforme C6. Os demais são KPI de ícone/valor/período/direção; Tendência preserva rótulo textual. Fonte de snapshots `available`/`restricted` conforme publicação.

```text
Secure Score Atual: [gauge/%] [pontos] [variação]
Variação/Maior/Menor/Média: ícone | título | valor | período
Tendência: ícone | título | texto de tendência
```

### Faixa 2 — filtros

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Período** `xl:col-span-3`; **Comparar com** 4; **Categoria** 2; **Evento** 2; **Limpar filtros** 1.

```text
[Período---][Comparar com---][Categoria--][Evento--][Limpar--]
```

#### Anatomia dos blocos desta faixa

Filtros rotulados com valor/controle; o botão Limpar encerra a linha. Em móvel todos empilham sem remoção.

### Faixa 3 — evolução e eventos

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Evolução do Secure Score** 6; **Eventos que impactaram o Score** 6.

```text
[Evolução do Secure Score--------------------][Eventos que impactaram o Score----------------]
```

#### Anatomia dos blocos desta faixa

**Evolução — linha**: C2; Score %, Pontos Conquistados, Pontos Máximos, Meta; X=data, Y=%/pontos; início/fim/variação abaixo.

**Eventos — tabela**: C4; Data, Evento, Categoria, Impacto, Detalhes e CTA “Ver todos os eventos (28)”. Mostra alteração observada, não causa; causalidade `unavailable`.

### Faixa 4 — análises

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Evolução por Categoria**, **Variação Mensal do Score**, **Score Máximo e Controles**, **Distribuição do Score (último dia)** 3 cada.

```text
[Evolução por Categoria---][Variação Mensal---][Score Máximo/Controles---][Distribuição---]
```

#### Anatomia dos blocos desta faixa

**Evolução por Categoria — linha**: C2, Identidade, Dispositivos, Aplicativos, Dados e Infraestrutura; CTA “Ver evolução detalhada”.

**Variação Mensal do Score — barras duplas**: C5; por mês, séries Variação (pts) e Variação (%), legenda superior, Y esquerdo=pontos/direito=percentual, CTA “Ver análise mensal completa”.

**Score Máximo e Controles — lista de variações**: antes da lista, mostra “Variação do Score Máximo” e o delta; duas regiões lado a lado para início do período e fim do período (pontos); abaixo, Novos Controles Adicionados, Controles Removidos e Controles Depreciados, cada com delta. CTA “Ver detalhes dos controles”. Não atribui causa.

**Distribuição do Score (último dia) — donut**: C1 com Score Conquistado, Pontos Disponíveis, Perda por Exceções, Pontos de Controles Depreciados e Aguardando Validação.

```text
Evolução: [legenda categorias] [plot X=data/Y=%] | Ver evolução detalhada →
Variação: [legenda pts/%] [barras X=mês/Y=pts/%] | Ver análise mensal completa →
Máximo: início | fim | delta; novos/removidos/depreciados | Ver detalhes dos controles →
Distribuição: [donut/total] [legenda lateral por parcela] | Entenda a distribuição →
```

### Faixa 5 — insights

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Insights e Tendências**, **Previsão de Atingimento da Meta**, **Alertas de Regressão** 4 cada.

```text
[Insights----][Previsão de Atingimento----][Alertas de Regressão----]
```

#### Anatomia dos blocos desta faixa

**Insights e Tendências — lista**: C3; até quatro itens; sem CTA na referência. **Previsão de Atingimento da Meta — previsão**: data central, dias, necessário, ritmo e status. **Alertas de Regressão — lista**: C3; até três alertas; CTA “Ver todos os alertas”. Previsão, alertas e inferência causal=`unavailable` sem regra.

```text
Insights: ícone | achado
Previsão: texto | data central | dias | necessário/ritmo/status
Alertas: ícone | alerta | Ver todos os alertas →
```

---

## 07. Controles Aceitos e Exceções

### Faixa 1 — KPIs

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`: **Total de Controles com Exceção**, **Pontos Impactados**, **Risco Aceito**, **Mitigado por Terceiro**, **Não Aplicável**, **Em Revisão** `xl:col-span-1` cada.

```text
[Total][Pontos][Risco Aceito][Mitigado por Terceiro][Não Aplicável][Em Revisão]
```

#### Anatomia dos blocos desta faixa

Cada KPI: ícone, valor/pontos e percentual; workflow de exceção `coming_soon`.

```text
ícone | título | valor/pontos | percentual/contexto
```

### Faixa 2 — filtros

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Busca** `xl:col-span-2`; **Categoria**, **Serviço**, **Tipo de Exceção** `xl:col-span-2` cada; **Status** `xl:col-span-1`; **Situação da Revisão** `xl:col-span-2`; **Filtros avançados** `xl:col-span-1`.

```text
[Busca--][Categoria--][Serviço--][Tipo--][Status--][Situação--][Filtros avançados]
```

#### Anatomia dos blocos desta faixa

Busca tem rótulo/campo; demais filtros têm rótulo, valor e seletor; Filtros avançados é ação final. Em móvel, empilham.

**Estado e fonte**: Busca, Categoria, Serviço, Tipo de Exceção, Status, Situação da Revisão e Filtros avançados = `coming_soon` até existir o workflow interno de exceção; permanecem visíveis e desabilitados com a razão, não retornam lista vazia como sucesso.

### Faixa 3 — tabela e detalhe

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Controles Aceitos e Exceções** `xl:col-span-9`; **Detalhes da Exceção** `xl:col-span-3`.

```text
[Controles Aceitos e Exceções---------------------------][Detalhes da Exceção---]
```

#### Anatomia dos blocos desta faixa

**Controles Aceitos e Exceções — tabela**: C4: seleção, ação, categoria, serviço, pontos máx./impactados, tipo, status, aprovação, validade, responsável, próxima revisão, menu/paginação.

**Detalhes da Exceção — painel lateral**: fechar, ação, categoria/serviço, pontos, tipo/status, justificativa, risco, controle compensatório, aprovador, datas, evidências e CTAs Editar/Encerrar. Ao abrir, foco no título; `Esc` fecha e devolve foco à linha acionadora; o diálogo anuncia atualização aos leitores de tela. No móvel vira detalhe inline/drawer; operações=`coming_soon`.

```text
Tabela: seleção | ação | categoria/serviço | pontos | tipo/status | datas | responsável | menu
Detalhe: título + fechar; campos; justificativa/risco/compensação; evidências; Editar | Encerrar
```

**Estado e fonte**: Tabela e Detalhes = `coming_soon` até modelo de exceção, aprovação e evidência publicados; Editar/Encerrar ficam desabilitados, sem executar workflow implícito.

### Faixa 4 — análises

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`: **Distribuição por Tipo de Exceção**, **Pontos Impactados ao Longo do Tempo**, **Situação das Revisões**, **Pontos por Categoria** `xl:col-span-3` cada.

```text
[Distribuição---][Pontos no Tempo---][Situação das Revisões---][Pontos por Categoria---]
```

#### Anatomia dos blocos desta faixa

**Distribuição por Tipo de Exceção — donut**: C1; legenda lateral Risco Aceito, Mitigado por Terceiro, Não Aplicável, Em Revisão, nessa ordem, com quantidade/percentual; CTA “Ver todas as exceções”.

**Pontos Impactados ao Longo do Tempo — linha**: C2; série única identificada pelo título, X=mês/Y=pontos, CTA “Ver evolução detalhada”.

**Situação das Revisões — donut**: C1; legenda lateral Em dia, A vencer em até 30 dias, Vencidas, nessa ordem, com quantidade/percentual; CTA “Ver revisões”.

**Pontos por Categoria — barras horizontais**: C5; Identidade, Aplicativos, Dispositivos, Dados, Infraestrutura; pontos e percentual; CTA “Ver detalhes por categoria”. Workflow de exceção=`coming_soon`.

### Faixa 5 — avisos

`grid grid-cols-1 gap-4 md:grid-cols-3`; **Importante**, **Atenção**, **Recomendação** `md:col-span-1` cada.

```text
[Importante][Atenção][Recomendação]
```

#### Anatomia dos blocos desta faixa

Cada aviso contém ícone, título e texto; não é gráfico e não desencadeia workflow.

```text
ícone | Importante/Atenção/Recomendação
texto de orientação
```

---

## 08. Histórico e Auditoria

### Faixa 1 — KPIs

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`: **Total de Eventos**, **Eventos Microsoft**, **Eventos Orkestria**, **Pontuação Alterada**, **Controles Afetados**, **Usuários Envolvidos** `xl:col-span-1` cada.

```text
[Total][Microsoft][Orkestria][Pontuação][Controles][Usuários]
```

#### Anatomia dos blocos desta faixa

Cada KPI tem ícone, valor e período. V2 nomeia origem como “Alterações observadas no Microsoft Graph” e “Coletas do Orkestria”; Usuários=`— Não disponível no Histórico Observado`. Nota: snapshot não identifica causa/autor.

```text
ícone | título | valor | período/contexto
```

### Faixa 2 — filtros

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Buscar evento** `xl:col-span-2`; **Período** 2; **Tipo de Evento** 2; **Origem** 1; **Categoria** 1; **Entidade** 2; **Filtros avançados** 2.

```text
[Buscar evento--][Período--][Tipo--][Origem-][Categoria-][Entidade--][Filtros avançados--]
```

#### Anatomia dos blocos desta faixa

Busca tem campo com rótulo; os demais filtros têm rótulo, valor e seletor; Filtros avançados fecha a linha. Em móvel todos empilham.

**Estado e fonte**: Busca/Período/Tipo/Origem/Categoria/Entidade usam o evento local publicado; `available` na primeira geração, `restricted` somente sem autorização de coleta. Não mostram autor, causa ou entidade não coletada.

### Faixa 3 — gráficos e detalhe

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; **Eventos por Tipo** 3; **Eventos ao Longo do Tempo** 4; **Eventos por Origem** 2; **Detalhes do Evento** 3.

```text
[Eventos por Tipo---][Eventos ao Longo do Tempo----][Eventos por Origem--][Detalhes do Evento---]
```

#### Anatomia dos blocos desta faixa

**Eventos por Tipo — donut**: C1; Pontuação Alterada, Controle Alterado/Adicionado/Removido, Exceção/Aceite, Plano/Ação, **Outros** (cauda observada), com total/percentual.

**Eventos ao Longo do Tempo — linha**: C2, série única Eventos identificada pelo título; seletor Agrupar por Dia, X=data/Y=quantidade.

**Eventos por Origem — donut**: C1; Microsoft e Orkestria.

**Detalhes do Evento — painel lateral**: fechar; tipo/origem, data, entidade, categoria, impacto, score antes/depois, descrição, identificador coletado e **Comparativo Antes x Depois**; CTA “Ver no plano de remediação”. Foco no título ao abrir; Esc fecha/devolve foco; no móvel drawer/inline.

```text
Tipos: [donut/total] [legenda lateral por tipo]
Tempo: [seletor Dia] [plot X=data/Y=eventos]
Origem: [donut/total] [Microsoft | Orkestria]
Detalhe: título/fechar; atributos; Antes | Depois
```

**Estado e fonte**: Eventos por Tipo, Ao Longo do Tempo, por Origem e Detalhes = `available` com geração de eventos publicada; sem base comparável, o detalhe declara “sem base comparável”; falha de coleta preserva a geração anterior com frescor/motivo.

### Faixa 4 — Histórico de Eventos

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Histórico de Eventos** 12.

```text
[data/hora | tipo | origem | entidade | descrição | categoria | impacto | score anterior | score atual | usuário | detalhes]
```

#### Anatomia dos blocos desta faixa

**Histórico de Eventos — tabela**: C4; linha acionável por Enter/Space; paginação/contador. Só compara atributos persistidos nas duas publicações; outros=`— Não coletado`. Usuário indisponível; nunca inferir causa, autoria, IP ou justificativa. Primeira publicação=`available`; sem base comparável mostra esse estado, não `restricted`.

```text
Histórico de Eventos (N)
data/hora | tipo | origem | entidade | descrição | categoria | impacto | antes | atual | usuário | detalhes
linhas por página | paginação | contador
```

### Faixa 5 — garantias informativas

`grid grid-cols-1 gap-4 md:grid-cols-3`; **Exportação e Auditoria**, **Conformidade e LGPD**, **Dica** 1 cada.

```text
[Exportação e Auditoria][Conformidade e LGPD][Dica]
```

#### Anatomia dos blocos desta faixa

Ícone, título e texto. Retenção da PNG é ilustração; Exportação=`unavailable`; Auditoria Operacional=`coming_soon`.

---

## Decisões explícitas

- Títulos são os nomes canônicos das PNGs; o tipo visual é atributo separado.
- A legenda de **Ganho Potencial por Prioridade** é direita, vertical e Críticas → Altas → Médias → Baixas.
- Score e controles usam projeções locais publicadas de `secureScores`/`secureScoreControlProfiles`; dados internos não são fabricados.

## Divergências e pendências

- Plano, metas, exceções, responsáveis, prazo, evidência e auditoria operacional exigem workflow aprovado e permanecem `coming_soon`/`unavailable`.
- Médias comparativas, regras de regressão, retenção e privacidade seguem [fontes](fontes-e-rastreabilidade.md); ausência não autoriza inventar valores. As faixas de prioridade aprovadas pelo sponsor são aplicadas apenas ao score composto; elevação automática por sinais correlatos permanece pendente.

## Verificação de coerência

- As oito telas possuem fonte rastreável, faixa, grid, gap, breakpoint, spans e diagrama.
- Todo gráfico declara tipo, séries/categorias, legenda/ausência, eixos, tooltip, resumo e móvel diretamente ou por C1/C2.
- Todo card não trivial contém título, anatomia, CTA observado, estado e fonte; rankings indicam limite/cauda.

## Critério de fidelidade

A revisão compara presença, ordem, agrupamento, proporção, anatomia, legendas, eixos, totais, CTAs e estados com as PNGs 01–08. Componentes existentes podem compor a interface, sem alterar este contrato silenciosamente.
