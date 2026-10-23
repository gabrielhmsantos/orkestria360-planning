# Representação estrutural das telas de Microsoft 365 / Usuários e Contas

## Referências

- **Visuais do sponsor**: imagens `01`–`08` em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Usuários e Contas/`.
- **Discovery e decisões**: [fontes-e-rastreabilidade.md](fontes-e-rastreabilidade.md), [expectativas-do-sponsor.md](expectativas-do-sponsor.md) e documentos das oito superfícies.
- **Requisitos/specs**: `docs/REQUIREMENTS.md` e `specs/002-microsoft-365-module/` como contexto; não definem esta subárea.
- **Padrões implementados**: `docs/DESIGN-orkestria.md`.

As referências são desktop amplo. Esta representação fixa agrupamento, ordem e proporções; não fixa cor, pixel ou componente novo. `available` depende de fonte Graph autorizada; `restricted` requer licença/permissão/perfil; `unavailable` aguarda fonte; `coming_soon` aguarda workflow operacional.

## Convenções

- Faixas usam `grid grid-cols-1 gap-4`; no mínimo `sm:grid-cols-2`; em `xl`, proporções heterogêneas usam `xl:grid-cols-12`.
- Filhos diretos sempre declaram span. Em telas estreitas todos preservam conteúdo em uma coluna; tabelas usam rolagem horizontal controlada, sem ocultar blocos.
- O shell, cabeçalho, tabs e rodapé são `col-span-full`; abas rolam horizontalmente em telas estreitas.
- Todo bloco preserva origem, período/cobertura e última atualização/frescor junto ao título ou rodapé. Carregamento preserva a anatomia com skeleton; vazio explica o recorte; falha/defasagem preserva causa; acesso negado declara a condição habilitadora. CTAs de leitura investigam/navegam; CTAs mutáveis permanecem `coming_soon`, condicionados a autorização, confirmação, auditoria e feedback.

```text
[shell lateral Microsoft 365]
[título + subtítulo] [ação contextual] [atualização]
[Dashboard | Diretório | Saúde | Atividade | Privilegiadas | Convidados | Ciclo | Histórico]
[faixas próprias da tela]
[origem, cobertura e frescor]
```

## 01. Dashboard Executivo

### Faixa 1 — métricas de identidade (8 KPIs homogêneos)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8`; cada KPI: `col-span-1`.

```text
| totais | ativos | bloqueados | inativos | convidados | admins | risco | sem MFA |
```

`available` para totais/status; risco e MFA são `restricted` sem licença/permissão. Fonte: imagem `01`, Word §1.

**Anatomia dos filhos:** cada card é um **KPI** com `[ícone] rótulo`, valor, percentual/qualificador e variação; não possui CTA individual. Risco/MFA preservam a posição com causa de restrição.

```text
[ícone] rótulo | valor | contexto/variação
```

### Faixa 2 — saúde e distribuição (3 colunas iguais)

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; Distribuição: `xl:col-span-4`; Cobertura: `xl:col-span-4`; Qualidade cadastral: `xl:col-span-4`.

```text
| 1/3 distribuição de usuários | 1/3 cobertura de segurança | 1/3 qualidade cadastral |
```

Cobertura é `restricted`; qualidade que dependa de RH/exceção é `unavailable` por atributo. Cada gráfico conserva legenda/resumo textual.

**Anatomia dos filhos:** Distribuição é **donut** (total central, segmentos e legenda rótulo/valor/%); Cobertura é **anel + barras** (percentual central, controles, valores); Qualidade é **score + barras por atributo**. Cada painel possui título e CTA de detalhe no rodapé.

```text
[ anel/score: valor ] | legenda ou atributos ███── valor | [ver detalhes →]
```

### Faixa 3 — investigação resumida (3 colunas iguais)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Eventos: `xl:col-span-4`; Departamentos: `xl:col-span-4`; Tipos: `xl:col-span-4`.

```text
| 1/3 últimos eventos | 1/3 usuários por departamento | 1/3 usuários por tipo |
```

Eventos são `restricted` por auditoria; tipos técnicos classificados internamente são `unavailable` sem catálogo.

**Anatomia dos filhos:** Eventos é **tabela compacta** com data/hora, ícone/evento, usuário, tipo, origem, responsável e `Ver todos os eventos`; Departamentos é **tabela de barras** com departamento, usuários, ativos, inativos e `% ativos`; Tipos é **donut** com total e legenda. Cada um mantém seu CTA contextual.

```text
| data | evento | usuário | origem | responsável | [ver todos →] |
```

### Faixa 4 — alertas

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada alerta: `col-span-1`.

```text
| bloqueadas | sem MFA | inativas | risco | cadastro | convidados |
```

Alertas somente encaminham à investigação (`available` quando regra e fonte existem); ação mutável é `coming_soon`.

**Anatomia dos filhos:** cada alerta é **card/lista** com ícone, título/contagem, explicação e CTA (`Ver usuários`, `Ver detalhes` ou `Ver convidados`); o bloco possui `Ver todos os alertas` no rodapé.

```text
[ícone] diagnóstico + contexto                              [ver →]
```

## 02. Diretório de Usuários

### Faixa 1 — métricas (7 KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7`; cada KPI: `col-span-1`.

```text
| totais | ativos | bloqueados | convidados | admins | sem MFA | risco |
```

MFA/risco são `restricted`; os demais dependem de leitura autorizada de diretório.

**Anatomia dos filhos:** os sete cards são **KPIs** de ícone, rótulo, valor e contexto percentual; risco/MFA exibem condição quando restritos.

```text
[ícone] rótulo | valor | percentual/contexto
```

### Faixa 2 — busca e filtros

`grid grid-cols-1 gap-4 md:grid-cols-12`; Busca: `md:col-span-3`; botão filtros: `md:col-span-1`; filtros rápidos: `md:col-span-7`; controles de exibição: `md:col-span-1`.

```text
| busca (3/12) | filtros (1/12) | tipo/status/departamento/MFA/licença (7/12) | visão (1/12) |
```

`available`; filtros de campos restritos mostram a causa, em vez de resultado vazio.

**Anatomia dos filhos:** Busca é campo rotulado; Filtros é acionador; filtros rápidos são seletores de tipo/status/departamento/MFA/licença; há `Limpar filtros`, `Exibir colunas` e alternador de visão. Cada controle preserva nome acessível e efeito de filtro.

```text
[buscar] [filtros] [seletores…] [limpar] [colunas] [visão]
```

### Faixa 3 — mestre-detalhe

`grid grid-cols-1 gap-4 xl:grid-cols-12`; área de consulta: `xl:col-span-9`; perfil: `xl:col-span-3 xl:row-span-3` (em relação às faixas de consulta: métricas, filtros e tabela).

```text
| 3/4 consulta: métricas, filtros e tabela paginada     | 1/4 perfil selecionado |
| usuário, tipo, departamento, status, atividade, MFA… | resumo + abas          |
```

PII, atividade e abas de acesso/auditoria são `restricted` por perfil. Em mobile, perfil abre em drawer/modal, com retorno de foco; tabela mantém identificação/estado prioritários.

**Anatomia dos filhos:** Consulta é **tabela de triagem** com contagem, busca/filtros, Usuário, Tipo, Departamento, Cargo, Status, Último acesso, MFA, Licenças, Risco, Origem, menu e paginação. Perfil é **ficha** com avatar, identidade/status, fechar, ações e abas.

```text
| usuário | tipo | status | último acesso | MFA | risco | [ … ] |
[avatar] identidade + status [fechar] | [ações] [abas]
```

### Faixa 4 — perfil selecionado (interna ao painel)

`grid grid-cols-1 gap-4 sm:grid-cols-2`; dados cadastrais: `sm:col-span-1`; cartões de sinal: `sm:col-span-1`; atividade/recomendações: `sm:col-span-2`.

```text
| atributos e gestor | MFA/licenças/risco/dispositivos |
| atividade recente e recomendações (largura integral)  |
```

Links para Licenciamento, Grupos e Autenticação são `available` como navegação; bloqueio, senha e revogação são `coming_soon`.

**Anatomia dos filhos:** Dados cadastrais é lista chave–valor; Sinais são cards de último acesso, MFA, licença, risco e dispositivos; Atividade é linha do tempo (data, evento, aplicativo/origem, local e `Ver toda a atividade`); Recomendações são cards com problema/contexto/CTA.

```text
atributo: valor | sinal: estado
data • evento • origem • local                              [ver atividade →]
```

## 03. Saúde das Contas

### Faixa 1 — score e KPIs (7 itens)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7`; Score e cada KPI: `col-span-1`.

```text
| score | bloqueadas | inativas | sem MFA | sem licença | risco | cadastro |
```

Score é `unavailable` até fórmula/pesos aprovados; demais cards expõem disponibilidade por fonte.

**Anatomia dos filhos:** Score é **anel** com nota `/100`, qualificador e variação; os seis demais são **KPIs** com ícone, rótulo, valor e comparação.

```text
[ anel: nota/100 ] qualificador | variação
```

### Faixa 2 — análise de problemas

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; Distribuição: `xl:col-span-4`; Severidade: `xl:col-span-4`; Categorias: `xl:col-span-4`.

```text
| 1/3 distribuição | 1/3 problemas por severidade | 1/3 categorias de não conformidade |
```

Os três painéis usam o catálogo inicial aprovado: conta desabilitada licenciada e risco são críticos; inatividade crítica, MFA e licença são altos; cadastro e gestor são médios; UPN e Usage Location são baixos. Fontes restritas ficam fora dos totais, sem conversão para zero.

**Anatomia dos filhos:** Distribuição é **donut** compacto à esquerda, com total central de problemas e legenda à direita (categoria, usuários e `%`); Severidade são quatro **barras horizontais** com marcador, usuários e `%`; Categorias é **ranking/tabela** de categoria, usuários e tendência de 30 dias. Sem destino funcional, não há CTA decorativo.

```text
categoria | usuários | ↑/↓ tendência       [ver todos →]
```

### Faixa 3 — triagem e evolução

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela com filtros: `xl:col-span-8`; coluna lateral: `xl:col-span-4`.

```text
| 2/3 contas que precisam de atenção                     | 1/3 evolução (linha) |
| filtros + tabela                                         | recomendações        |
```

Evolução é `restricted` sem snapshots; recomendações só são `available` com regra e evidência, sem executar correção.

**Anatomia dos filhos:** Tabela contém título, filtros, busca, severidade, usuário, categoria, descrição, departamento, acesso, MFA, licença, status, ação, menu e paginação. Lateral: Evolução é **linha** com séries/legenda/eixos/período; Recomendações são **lista** de diagnóstico, evidência/confiança/exceção e CTA investigativo.

```text
| severidade | usuário | achado | estado | [revisar →] |
séries • legenda | eixo Y | período no eixo X
```

## 04. Atividade e Inatividade

### Faixa 1 — métricas por faixa (6 KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`; cada KPI: `col-span-1`.

```text
| ativos | baixa atividade | 61–90 | >90 | nunca acessaram | bloqueados |
```

`restricted` sem `signInActivity`/logs; janelas são configuração pendente, não valor fixo universal.

**Anatomia dos filhos:** os seis cards são **KPIs** com faixa temporal no rótulo, valor, percentual e variação por período.

```text
faixa temporal | valor | % do total | variação
```

### Faixa 2 — análise de uso

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; Distribuição: `xl:col-span-4`; Tendência: `xl:col-span-4`; Tempo sem acesso: `xl:col-span-4`.

```text
| 1/3 distribuição | 1/3 tendência de atividade | 1/3 tempo desde último acesso |
```

Tendência é `restricted` sem histórico; faixas e séries requerem equivalente textual.

**Anatomia dos filhos:** Distribuição é **donut** com total e legenda; Tendência é **linha multissérie** com legenda, eixo de usuários e período; Tempo sem acesso são **barras** com faixa, usuários e percentual. Cada painel tem CTA contextual.

```text
séries • ativo/baixa/inativo | eixo Y usuários | eixo X períodos
```

### Faixa 3 — investigação

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela: `xl:col-span-8`; insights: `xl:col-span-4`.

```text
| 2/3 inativos que ainda possuem licença (busca + filtros + tabela) | 1/3 insights |
```

Contas de serviço/sazonais são `unavailable` até classificação; remoção ou licença é `coming_soon`.

**Anatomia dos filhos:** Tabela é **triagem** com usuário, departamento, último acesso, dias sem acesso, licenças, status, risco, ação e paginação; Insights são **lista** de ícone, diagnóstico/contexto e CTA de investigação.

```text
| usuário | dias | licença | risco | [revisar necessidade →] |
```

## 05. Contas Privilegiadas

### Faixa 1 — métricas administrativas (6 KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`; cada KPI: `col-span-1`.

```text
| privilegiadas | funções | sem MFA | sem uso | risco | elegíveis PIM |
```

PIM, risco e MFA são `restricted` conforme licença e consentimento.

**Anatomia dos filhos:** os seis cards são **KPIs** com ícone, rótulo, valor, proporção e CTA de aprofundamento (`Ver detalhes`, `Ver funções`, `Ver contas`, `Ver risco` ou `Ver PIM`).

```text
[ícone] rótulo | valor | %/contexto | [ver →]
```

### Faixa 2 — análise de postura (3 colunas iguais)

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; Funções: `xl:col-span-4`; Tipo/PIM: `xl:col-span-4`; MFA: `xl:col-span-4`.

```text
| 1/3 funções privilegiadas | 1/3 permanente x PIM | 1/3 cobertura MFA |
```

Cada análise preserva legenda e valores; dados PIM não disponíveis permanecem na posição como `restricted`.

**Anatomia dos filhos:** Funções é **donut** com total central e Top 10 na legenda; Tipo é **donut** permanente versus elegível PIM; MFA é **medidor semicircular** com percentual/descrição e legenda com/sem MFA. Todos têm CTA de detalhe.

```text
[ anel: total/% ] | função/tipo • valor • % | [ver →]
```

### Faixa 3 — lista e alertas empilhados

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela: `xl:col-span-8 xl:row-span-2`; sem acesso recente: `xl:col-span-4`; alertas: `xl:col-span-4`.

```text
| 2/3 contas privilegiadas (tabela)        | 1/3 sem acesso recente |
|                                            | 1/3 principais alertas |
```

Revisar/remover é `coming_soon`; contas e atividade administrativa são `restricted` por autorização.

**Anatomia dos filhos:** Tabela possui busca/filtros, usuário, função, tipo, MFA, último acesso, uso, risco, origem, ações, paginação e `Ver todas…`; Sem acesso recente é **lista** de usuário/função/acesso/MFA/ação; Alertas são **lista** de situação, contexto e CTA.

```text
| usuário | função | MFA | acesso | risco | [ … ] |
[ícone] condição administrativa + contexto                [ver contas →]
```

## 06. Convidados e Usuários Externos

### Faixa 1 — métricas B2B (7 KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7`; cada KPI: `col-span-1`.

```text
| total | ativos | inativos | nunca | com licença | domínios | risco |
```

Risco é `restricted` quando a fonte `riskyUsers` não publicar; todos os KPIs com valor usam comparação percentual com a geração elegível do mês anterior, ou `— vs. mês anterior` sem base.

**Anatomia dos filhos:** os sete cards são **KPIs** com ícone, rótulo, valor e percentual; o card de domínios inclui o qualificador de empresas diferentes.

```text
[ícone] rótulo | valor | percentual/qualificador
```

### Faixa 2 — análise B2B

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; Distribuição: `xl:col-span-4`; Tendência: `xl:col-span-4`; Domínios: `xl:col-span-4`.

```text
| 1/3 status | 1/3 convidados ativos/inativos | 1/3 domínios externos |
```

Distribuição é `restricted` até a geração conter `externalUserState` e atividade disponível. Tendência é `restricted` sem atividade; as 13 semanas sem geração recebem zero. Domínio não autoriza inferir empresa ou finalidade.

**Anatomia dos filhos:** Distribuição é **donut** com total `Convidados no recorte` e legenda de status, incluindo removidos nos últimos 30 dias; Tendência é **linha multissérie** com ativos/inativos/nunca acesso, eixos e legenda; Domínios é **ranking de barras** de domínio, convidados e `%`. Não há CTA decorativo.

```text
domínio externo          █████── convidados • %   [ver domínios →]
```

### Faixa 3 — triagem e contexto lateral

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela: `xl:col-span-8 xl:row-span-2`; uso por aplicativo: `xl:col-span-4`; insights: `xl:col-span-4`.

```text
| 2/3 convidados que precisam atenção       | 1/3 acessos por aplicativo |
| filtros + tabela                           | 1/3 insights               |
```

Patrocinador/revisão/finalidade são `unavailable` sem dados internos; remoção/reenvio é `coming_soon`.

**Anatomia dos filhos:** Triagem contém filtros de status/risco/acesso/domínio/licença, busca, convidado, empresa/domínio, status, acesso, licença, patrocinador, risco, ação, menu e paginação; Uso é **ranking de barras** por aplicativo e período; Insights são **lista** de situação/motivo/CTA `Ver detalhes` e `Ver todas as recomendações`.

```text
| convidado | domínio | status | patrocinador | risco | [ver/revisar →] |
```

## 07. Ciclo de Vida

### Faixa 1 — métricas de processo (6 KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`; cada KPI: `col-span-1`.

```text
| solicitações | onboarding | offboarding | aprovação | concluídos | atrasadas |
```

Todos os indicadores são `coming_soon` até workflow, aprovações e fonte operacional existirem.

**Anatomia dos filhos:** os seis cards são **KPIs** com ícone, rótulo, valor e variação, sem CTA individual; exibem a condição de workflow ainda não habilitado.

```text
[ícone] rótulo | valor | variação | em breve
```

### Faixa 2 — visão dos dois fluxos

`grid grid-cols-1 gap-4 xl:grid-cols-12`; visão do ciclo: `xl:col-span-9`; ações rápidas: `xl:col-span-3`. Dentro da visão do ciclo: `grid grid-cols-1 gap-4 md:grid-cols-2`; Onboarding: `md:col-span-1`; Offboarding: `md:col-span-1`.

```text
| 3/4 visão: 1/2 etapas onboarding + 1/2 etapas offboarding | 1/4 ações rápidas |
```

Em mobile cada fluxo mostra etapas em sequência vertical; atalhos não iniciam workflow sem autorização.

**Anatomia dos filhos:** Visão contém dois **fluxos** internos: Onboarding (Solicitação → Aprovação → Provisionamento → Configuração → Concluído) e Offboarding (Solicitação → Aprovação → Execução → Revisão e retenção → Concluído), cada um com ícone, rótulo, contagem/status, progresso/meta e `Ver detalhes`. Ações rápidas são lista de ícone/título/descrição/chevron, `coming_soon`.

```text
etapa → etapa → etapa → concluído | contagem/status | [progresso] [detalhes →]
```

### Faixa 3 — acompanhamento operacional

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Solicitações: `xl:col-span-6`; Tarefas atrasadas: `xl:col-span-6`.

```text
| 1/2 solicitações em andamento | 1/2 tarefas atrasadas |
```

`coming_soon`; responsáveis e dados pessoais são `restricted` ao habilitar. Indicadores e insights pertencem exclusivamente à faixa seguinte.

**Anatomia dos filhos:** Solicitações é **tabela** com abas de recorte, ID, tipo, usuário, departamento, solicitante, status, etapa, data-alvo, paginação e `Ver todas`; Tarefas atrasadas é **tabela compacta** de tarefa, processo, responsável, vencimento, atraso e menu.

```text
| ID | tipo | status | etapa | data-alvo | [ … ] |
```

### Faixa 4 — desempenho e recomendações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; indicadores: `xl:col-span-6`; insights: `xl:col-span-6`.

```text
| 1/2 tempo, conformidade e conclusão | 1/2 insights e próximos passos |
```

Indicadores históricos requerem dados internos (`unavailable` até então); ação de configurar integração é `coming_soon`.

**Anatomia dos filhos:** Indicadores são quatro **KPIs compactos** de tempo médio, conformidade e conclusão, com valor/variação; Insights são **lista** de problema/contexto e CTAs de encaminhamento (`Ver tasks`, `Ver onboardings`, `Ver relatório`, `Configurar`), sem iniciar workflow.

```text
[ícone] indicador | valor | variação
[ícone] recomendação + contexto                         [encaminhar →]
```

## 08. Histórico e Auditoria

### Faixa 1 — métricas de eventos (6 KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`; cada KPI: `col-span-1`.

```text
| eventos | usuários criados | usuários atualizados | usuários excluídos | logons admin | falhas |
```

Dados de auditoria/autenticação são `restricted` por permissão, retenção e perfil.

**Anatomia dos filhos:** os seis cards são **KPIs** com ícone, rótulo, valor e variação temporal; cada um declara a cobertura de auditoria quando restrito.

```text
[ícone] evento | valor | variação | cobertura
```

### Faixa 2 — leitura do período

`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12`; Categorias: `xl:col-span-4`; Tendência: `xl:col-span-4`; Críticas: `xl:col-span-4`.

```text
| 1/3 eventos por categoria | 1/3 tendência | 1/3 atividades críticas |
```

Tendência exige histórico; cards críticos mantêm severidade e texto, não só cor.

**Anatomia dos filhos:** Categorias é **donut** com total central/legenda; Tendência é **linha** de total e categorias, com legenda e eixos; Críticas é **lista** de ícone, título/quantidade, instrução, momento, selo textual de severidade e `Ver todas…`.

```text
total/categorias • legenda | eixo Y volume | eixo X período
[ícone] evento + instrução | data/hora | [severidade] [ver →]
```

### Faixa 3 — auditoria e ações recentes

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela: `xl:col-span-8`; lateral: `xl:col-span-4`.

```text
| 2/3 filtros + histórico de auditoria (tabela) | 1/3 ações recentes |
|                                                | exportações        |
```

Ator, alvo, IP e exportação são `restricted`; ausência de cobertura exibe motivo e período, não zero.

**Anatomia dos filhos:** Histórico é **tabela** com filtros período/categoria/atividade/usuário, busca/filtro avançado, Data/hora, Atividade, Categoria, Ator, Alvo, Detalhes, IP, Resultado, menu e paginação. Ações recentes é lista de ícone/nome/momento/quantidade; Exportações é lista de relatório, período/geração e CTA `PDF`/`XLSX`/`CSV`.

```text
| data/hora | atividade | ator | alvo | IP | resultado | [ … ] |
relatório + período/geração                              [formato →]
```

## Decisões explícitas

- A ordem de abas e os blocos de todas as oito telas vêm diretamente das imagens e do Word.
- O Diretório mantém a relação mestre-detalhe; telas analíticas preservam KPIs, análise e triagem em seguida.
- A grade de 12 colunas em `xl` e o `gap-4` são convenções de composição para tornar implementáveis as proporções observadas, alinhadas ao padrão existente; não são valores prescritos pelo sponsor.
- Pareceres sponsor e QA/UX confirmaram as oito superfícies, o shell, as faixas de KPI/análise/investigação e o mestre-detalhe do Diretório. Também confirmaram a necessidade de preservar todos os blocos mesmo quando o dado estiver restrito.
- A revisão adicional de sponsor confirmou a anatomia, as colunas e os CTAs observáveis por bloco; a revisão UX confirmou a necessidade de legenda/resumo textual, semântica de CTA, retorno de foco no perfil e estados de dados por bloco.

## Divergências e pendências

- As fontes não evidenciam breakpoints nem spans. Todos os spans e regras intermediárias são inferências estruturais baseadas na composição desktop; precisam de validação na Spec.
- Há uma leitura divergente entre revisores para a largura da visão de Ciclo de Vida versus ações rápidas (`9/3` no parecer sponsor e `8/4` no parecer UX). Este documento adota `9/3` por proximidade visual; a Spec deve validar a largura no protótipo responsivo.
- Há divergência nos números/rótulos de MFA e faixas de inatividade entre telas; nenhum número ilustrativo vira contrato.
- Fórmulas de score/severidade, permissões por campo, frequência/fuso de atualização, retenção e destinos das ações permanecem pendentes.
- Devem existir estados de carregamento, vazio, erro recuperável, dado defasado e acesso negado por bloco; as imagens não os demonstram.

## Critério de fidelidade

A implementação futura será verificada pela presença, ordem, agrupamento, grid, `gap`, spans, comportamento de reflow e estado explícito dos blocos descritos aqui. Nenhuma ausência de dado autoriza suprimir bloco previsto pelo sponsor.
