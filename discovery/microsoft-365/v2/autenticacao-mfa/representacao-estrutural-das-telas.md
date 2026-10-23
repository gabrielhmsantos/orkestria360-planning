# Representação estrutural das telas — Microsoft 365 / Autenticação (MFA)

## Referências

- **Visuais do sponsor**: `01` a `08` PNG em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Autenticação (MFA)/`.
- **Discovery e decisões**: [README.md](README.md), [expectativas-do-sponsor.md](expectativas-do-sponsor.md) e as oito superfícies deste diretório.
- **Requisitos/specs**: `docs/REQUIREMENTS.md`, `docs/MICROSOFT365-SYNC-AVALIACAO.md` e `specs/004-usuarios-contas/status-de-dados.md` como contexto de fonte.
- **Padrões implementados**: `docs/DESIGN-orkestria.md`.

Esta representação fixa ordem, agrupamento, proporção e anatomia observados; não fixa cor, tamanho ou dados demonstrativos. Todos os blocos com fonte não publicada preservam posição e finalidade com estado explícito.

## Elementos comuns

```text
Shell Microsoft 365: navegação lateral do módulo + barra superior (menu, busca, ajuda/notificações e contexto do tenant)
Área: título da aba e subtítulo > Exportar | Atualizar | Última sincronização: data e hora da coleta
Abas: Dashboard Executivo | Cobertura e Registro de MFA | Métodos de Autenticação | Eventos e Utilização | Falhas e Bloqueios | Políticas e Proteção | Usuários de Risco | Histórico e Auditoria
```

- A navegação lateral e barra superior são dependências reutilizadas do shell do Microsoft 365; não são redefinidas por esta superfície. Cabeçalho e abas são compartilhados. Em `grid-cols-1`, controles e abas quebram/rolam horizontalmente, sem ocultar destinos; rótulos curtos não substituem o nome acessível completo.
- O shell do Microsoft 365 exibe no cabeçalho a **data e hora da última sincronização/coleta** do módulo, seguindo o padrão já implementado em Licenciamento, Usuários e Contas e Grupos. Se ainda não houver ciclo concluído, exibe “Aguardando primeiro ciclo”. Esta informação pertence ao header; não cria faixa de origem, frescor ou rodapé adicional.
- `Exportar` é `coming_soon` até haver contrato de privacidade. Mantém botão/dropdown como referência, porém indisponível para download e anuncia “Em breve: exportação ainda não habilitada” em texto ou popover acionável por foco. `Atualizar` é ação visual do cabeçalho; durante seu acionamento, mostra estado ocupado, evita nova solicitação e anuncia o resultado.
- Gráficos usam tooltip e resumo textual equivalente; no móvel plot e legenda empilham. Donuts mantêm valor central e, quando a legenda é lateral, usam a variante tabelar (marcador, rótulo, valor e percentual) validada nas referências do sponsor.
- Tabelas densas: filtros empilham na ordem período, comparação, filtro de domínio, busca e limpeza; tabela conserva rolagem horizontal e primeira coluna identificadora visível. A abertura da linha mostra o detalhe sem duplicar PII. Estados de carregamento, vazio, `restricted` e erro preservam título/resumo, explicam a condição em texto anunciável (`aria-live`) e mostram apenas CTA permitido; vazio não é usado para falta de permissão ou falha.
- **Título canônico do card**: o título visível identifica o assunto de negócio observado pelo sponsor; o tipo de visualização é uma propriedade estrutural separada e nunca substitui o título. Assim, “Falhas ao longo do tempo” é o título de um gráfico de linha — não “Linha” — e “Falhas por categoria” é o título de um donut — não “Donut de categorias”. Quando uma referência antepõe numeração de tópico (`1.`, `2.` etc.), ela não integra o título canônico.
- Tabs, filtros, menus, CTAs de tabela e controles globais mantêm foco visível e ordem de foco da leitura. Tabs e botões respondem a Enter/Espaço; menus/tooltip podem receber foco e fecham em Escape; tooltip nunca é a única forma de transmitir conteúdo. O resultado da ação de atualizar e os estados de disponibilidade usam região `aria-live`.
- CTAs de conteúdo são navegação contextual `available` somente quando a superfície de destino e a fonte existirem: “Ver análise/histórico completo”, “Ver todos os métodos/aplicações/eventos” e “Ver todas as políticas/exceções”. CTAs de mudança de tenant permanecem `coming_soon`.

---

## 01. Dashboard Executivo

### Faixa 1 — score e indicadores

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12`; score `xl:col-span-2 xl:row-span-2`; cada KPI `xl:col-span-2`.

```text
| MFA Health Score (2, duas linhas) | elegíveis | registrados | capazes | sem MFA | admins sem MFA |
|                        | passwordless | resistentes | autenticações | sucesso | falhas |
```

**MFA Health Score**: gráfico gauge com título, arco/valor, rótulo de condição e comparação. Estado `unavailable` até fórmula aprovada.

**KPI**: métrica com ícone, título, valor, percentual/contexto e comparação. Registro atual `available` quando publicado; eventos `restricted` até sign-ins.

### Faixa 2 — cobertura, evolução e métodos

`grid grid-cols-1 gap-4 xl:grid-cols-12`; cobertura `xl:col-span-4`; evolução `xl:col-span-4`; métodos `xl:col-span-4`.

```text
| Cobertura de MFA: donut + legenda | Evolução da cobertura de MFA: linha + rótulos | Métodos mais utilizados (30 dias): barras horizontais |
```

**Cobertura de MFA**: gráfico donut com valor elegível central; legenda lateral em tabela ordenada por estado (capaz, registrado não capaz, não registrado, exclusão); CTA “Ver análise completa”. Série única, sem eixos; resumo lista percentuais; histórico `unavailable` sem snapshot.

**Evolução da cobertura de MFA**: gráfico de linha com cobertura por período no plot, eixo x temporal e y percentual, rótulos de pontos; legenda ausente pois título identifica série; tooltip; CTA “Ver histórico completo”. `unavailable` sem snapshots.

**Métodos mais utilizados (30 dias)**: gráfico de barras **Top 5** com método no eixo y, volume/percentual no fim de cada barra; os demais são agregados em `Outros`; série única identificada pelo título; CTA “Ver todos os métodos”. Uso `restricted` até sign-ins.

### Faixa 3 — riscos, tipo e aplicações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; cada painel `xl:col-span-4`.

```text
| Principais riscos e alertas: tabela | Distribuição por tipo de usuário: donut + legenda | Top 5 aplicações com maior uso de MFA (30 dias): ranking |
```

**Principais riscos e alertas**: tabela com risco, impacto, quantidade e recomendação; CTA “Ver todos os alertas”. Alertas derivados `unavailable` até catálogo aprovado.

**Distribuição por tipo de usuário**: gráfico donut com elegíveis ao centro, legenda em tabela por tipo à direita; CTA “Ver análise completa”; fonte diretório + registro, `available` quando ambos publicados.

**Top 5 aplicações com maior uso de MFA (30 dias)**: ranking **Top 5** por autenticações MFA, com aplicação, total e percentual em barras; os itens remanescentes são agregados em uma sexta linha `Outros`, fora do Top 5; CTA “Ver todas as aplicações”; `restricted` até sign-ins.

---

## 02. Cobertura e Registro de MFA

### Faixa 1 — seis KPIs de cobertura

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI `xl:col-span-1`.

```text
| Elegíveis | Registrados | Capazes | Sem MFA | Admins sem MFA | Passwordless |
```

**KPI**: métrica com ícone, título, valor, percentual e comparação. Registro `available` quando publicado; elegibilidade depende de regra e exclusões, `restricted`.

### Faixa 2 — distribuição, evolução e tipo de usuário

`grid grid-cols-1 gap-4 xl:grid-cols-12`; distribuição `xl:col-span-4`; evolução `xl:col-span-4`; tipo `xl:col-span-4`.

```text
| Distribuição por status de MFA: donut + legenda | Evolução da cobertura de MFA: linha | Cobertura por tipo de usuário: barras empilhadas |
```

**Distribuição por status de MFA**: gráfico donut com elegíveis centrais, estados na legenda lateral em tabela, CTA “Ver análise completa”; sem eixos; exceções `unavailable` até fonte interna.

**Evolução da cobertura de MFA**: gráfico de linha com percentual por mês, eixo x temporal/y percentual, pontos e tooltip; série identificada no título; `unavailable` até snapshots.

**Cobertura por tipo de usuário**: gráfico de barras empilhadas com tipos no eixo y, segmentos ordenados por status e legenda acima; valores/resumo por linha; diretório + registro `available` quando publicados.

O DOCX recomenda cobertura por departamento, enquanto a imagem confirma a composição por tipo de usuário. Nesta versão, tipo é `available` quando suas fontes existirem; departamento permanece capacidade `unavailable` a confirmar como painel adicional ou substituição na futura Spec.

### Faixa 3 — diretório de cobertura e painéis de apoio

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela `xl:col-span-9`; lateral `xl:col-span-3`.

```text
| Usuários por status de MFA: busca/filtros > identidades e paginação | Destaques |
|                                                                    | Oportunidades de melhoria |
```

**Usuários por status de MFA**: tabela com busca, filtros, colunas de identidade minimizada, departamento, tipo, admin, registro/capacidade, métodos, passwordless, último login e ação contextual; paginação. Campos sem fonte são `restricted`; não reproduzir PII demonstrativa.

**Exceção de filtros desta tela**: a imagem não mostra período ou comparação. Em ordem de leitura e no móvel: busca por identidade primeiro; Status MFA; Capacidade MFA; Tipo de usuário; Departamento; Localização; Limpar filtros. Cada controle ocupa a largura disponível e só então a tabela passa à rolagem horizontal.

**Destaques** e **Oportunidades de melhoria**: listas de item, severidade/contexto e CTA. Derivações `unavailable` até regra aprovada.

---

## 03. Métodos de Autenticação

### Faixa 1 — indicadores de adoção

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI `xl:col-span-1`.

```text
| Métodos habilitados | Authenticator | Fortes | SMS/voz | 2+ métodos | Passwordless |
```

**KPI**: métrica com valor, denominador/contexto e comparação. Cadastro `available`; política/uso `restricted` conforme fonte.

### Faixa 2 — distribuição, adoção e segurança

`grid grid-cols-1 gap-4 xl:grid-cols-12`; distribuição `xl:col-span-4`; adoção `xl:col-span-4`; segurança `xl:col-span-4`.

```text
| Distribuição de usuários por método registrado: donut | Adoção dos métodos ao longo do tempo (usuários): linhas | Distribuição por nível de segurança dos métodos: donut |
```

**Distribuição de usuários por método registrado**: gráfico donut com elegíveis no centro e legenda lateral em tabela **Top 5** por método; os demais são agregados em `Outros`; CTA “Ver análise completa”; `available` do relatório publicado.

**Adoção dos métodos ao longo do tempo (usuários)**: gráfico de linhas com séries por método, legenda horizontal acima na ordem observada, eixo x mensal/y usuários, tooltip e resumo textual por série; móvel empilha legenda; `unavailable` sem snapshots.

**Distribuição por nível de segurança dos métodos**: gráfico donut com total central, legenda lateral em tabela por nível ordenada do forte ao sem adicional; classificação `unavailable` até política normativa.

### Faixa 3 — catálogo e recomendações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela `xl:col-span-9`; lateral `xl:col-span-3`.

```text
| Métodos de autenticação disponíveis: método, status, nível, registros, uso e tendência | Recomendações |
|                                                                                    | Métodos mais utilizados (30 dias) |
```

**Métodos de autenticação disponíveis**: tabela com método, status, nível, usuários, cobertura, tentativas/sucesso/falha/taxa/tendência, política e menu; uso `restricted` até sign-ins, alteração `coming_soon`.

**Laterais**: listas/ranking de recomendação ou método + quantidade/barra + CTA; recomendações requerem regra aprovada.

---

## 04. Eventos e Utilização

### Faixa 1 — KPIs por período

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`; cada KPI `xl:col-span-1` (grade homogênea observada).

```text
| Total | Com MFA | Sucesso | Falhas auth | Falhas MFA | Únicos | Taxa sucesso |
```

**KPI**: métrica com título, valor, percentual/contexto e comparação. Todos `restricted` até sign-ins publicados.

### Faixa 2 — filtros e análises principais

`grid grid-cols-1 gap-4 xl:grid-cols-12`; filtros `xl:col-span-12`; linha `xl:col-span-4`; método `xl:col-span-4`; aplicação `xl:col-span-4`.

```text
| Filtros: período | comparação | granularidade |
| Autenticações ao longo do tempo: linhas total/MFA/falha | Autenticações por método (30 dias): donut | Autenticações por aplicação (30 dias): barras |
```

**Autenticações ao longo do tempo**: gráfico de séries com total, com MFA e falhas; legenda horizontal superior, x temporal/y volume, tooltip e resumo; `restricted`.

**Autenticações por método (30 dias)**: gráfico donut com total MFA central e legenda lateral em tabela **Top 5** ordenada por volume; os demais são agregados em `Outros`; CTA “Ver todos os métodos”; `restricted`.

**Autenticações por aplicação (30 dias)**: gráfico de barras **Top 5** com aplicação no y, volume e percentual no fim; os itens remanescentes são agregados em `Outros`, fora do Top 5; título identifica série única; CTA “Ver todas as aplicações”; `restricted`.

### Faixa 3 — detalhe operacional

`grid grid-cols-1 gap-4 xl:grid-cols-12`; taxa por método `xl:col-span-4`; localização `xl:col-span-4`; dispositivo `xl:col-span-4`; eventos `xl:col-span-9`; insights `xl:col-span-3`.

```text
| Taxa de sucesso por método: tabela | Autenticações por localização (30 dias): mapa + top países | Autenticações por dispositivo (30 dias): barras |
| Últimos eventos de autenticação                                                                    | Insights e recomendações |
```

**Taxa de sucesso por método**: tabela com método, tentativas, sucesso, falha, taxa e tendência. **Autenticações por localização (30 dias)**: mapa/lista contextual com **Top 5** países e `Outros`; resumo textual obrigatório. **Autenticações por dispositivo (30 dias)**: gráfico de barras **Top 5** com plataforma no y e volume/% no fim; os demais são agregados em `Outros`. Todos `restricted`.

**Últimos eventos de autenticação**: tabela com data/hora, identidade minimizada, aplicação, método, resultado, origem, localização, dispositivo e política. **Insights e recomendações**: lista com achado/contexto e CTA; derivação `unavailable` até regra aprovada.

**Análises preservadas fora da composição observada**: interativa versus não interativa; passwordless versus senha + MFA; e MFA solicitado versus atendido por claim. Todas ficam `restricted` até interpretação conjunta de detalhes, métodos e políticas; a futura Spec decide se entram como gráficos adicionais, filtro ou detalhe.

---

## 05. Falhas e Bloqueios

### Faixa 1 — indicadores de falha

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`; cada KPI `xl:col-span-1`.

```text
| Falhas | Falhas MFA | Recorrentes | Bloqueadas | IPs suspeitos | Taxa | Método crítico |
```

**KPI**: métrica de valor, contexto e tendência; `restricted` até sign-ins e `unavailable` quando depender de limiar não aprovado.

### Faixa 2 — filtros e diagnósticos

`grid grid-cols-1 gap-4 xl:grid-cols-12`; filtros `xl:col-span-12`; linha `xl:col-span-4`; categoria `xl:col-span-4`; método `xl:col-span-4`.

```text
| Filtros de período, comparação, tipo, resultado e filtro adicional (semântica a confirmar) |
| Falhas ao longo do tempo: linhas total/MFA | Falhas por categoria (30 dias): donut | Falhas por método (30 dias): barras |
```

**Falhas ao longo do tempo**: séries de total e MFA, legenda superior, x temporal/y falhas, tooltip e resumo. **Falhas por categoria**: donut com total central e legenda lateral em tabela **Top 6**; agrupa estritamente pelo valor numérico publicado em `status.errorCode`. Cada item mostra o rótulo humano normalizado e o identificador `AADSTS{código}`; a família analítica é contexto, nunca chave de agrupamento. `status.failureReason` é detalhe sanitizado da linha de evento, não categoria. Códigos remanescentes são agregados em `Outros`, fora do Top 6. **Falhas por método**: barras **Top 5** com método no y e falhas/percentual no fim; os demais são agregados em `Outros`. Todos `restricted`.

### Faixa 3 — rankings, eventos e ações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; recorrentes/IPs/aplicações `xl:col-span-4`; eventos `xl:col-span-9`; ações `xl:col-span-3`.

```text
| Usuários com falhas recorrentes | IPs com maior volume de falhas | Aplicações com mais falhas: barras horizontais |
| Últimos eventos de falha                                                                    | Ações recomendadas |
```

**Usuários com falhas recorrentes** e **IPs com maior volume de falhas**: tabelas compactas com no máximo as cinco entidades de maior volume, contexto e CTA para a tabela de eventos; não agregam pessoas ou IPs em `Outros`. **Aplicações com mais falhas**: gráfico de barras horizontal **Top 5** por falhas, com aplicação no eixo y, barra, quantidade e percentual no fim; o restante é agregado em `Outros`; CTA navega para a tabela completa de eventos de falha. **Últimos eventos de falha**: tabela com hora, identidade, aplicação, método, categoria, IP, local, dispositivo e detalhe. **Ações recomendadas**: lista de investigação/orientação; execução `coming_soon`.

---

## 06. Políticas e Proteção

### Faixa 1 — score e cinco controles

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12`; score `xl:col-span-2`; cada controle `xl:col-span-2`.

```text
| MFA Protection Score | MFA para administradores | MFA para todos os usuários | Autenticação legada | Security Defaults | Contas de emergência |
```

**MFA Protection Score**: gauge com arco, valor e condição; `unavailable` até pesos/norma. **Controles de proteção**: status com ícone, título, estado/contexto e alerta; políticas `restricted`, exceções `unavailable` até fonte interna.

### Faixa 2 — três políticas relacionadas

`grid grid-cols-1 gap-4 xl:grid-cols-12`; cada tabela `xl:col-span-4`.

```text
| Política de Métodos de Autenticação | Forças de Autenticação | Acesso Condicional relacionado a MFA |
```

**Política de Métodos de Autenticação**, **Forças de Autenticação** e **Acesso Condicional relacionado a MFA**: tabelas de política com, respectivamente, método/status/público/grupos/nível; nome/tipo/métodos/aplicações/status; política/aplicação/ação/status. Todas `restricted` até permissões de Policy.

### Faixa 3 — proteção, exceções e verificações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; resumo `xl:col-span-4`; exceções `xl:col-span-4`; status `xl:col-span-4`.

```text
| Resumo de Proteções | Exceções e Exclusões | Status das Políticas |
```

**Resumo de Proteções**: lista de controle, explicação e estado. **Exceções e Exclusões**: abas/tabela de contas/grupos, motivo, uso e status; dados internos `unavailable`. **Status das Políticas**: lista de controle, resultado e contexto; `restricted` até coleta.

---

## 07. Usuários de Risco

### Faixa 1 — seis KPIs de risco

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI `xl:col-span-1`.

```text
| Risco total | Alto | Médio | Baixo | Logins de risco | Admins em risco |
```

**KPI**: métrica de valor, percentual/contexto e comparação. `restricted` até Identity Protection, licenças e estado de fonte.

### Faixa 2 — filtros e análises

`grid grid-cols-1 gap-4 xl:grid-cols-12`; filtros `xl:col-span-12`; tendência `xl:col-span-4`; tipo `xl:col-span-4`; localização `xl:col-span-4`.

```text
| Filtros período/nível/estado/usuário |
| Evolução de usuários de risco: linhas alto/médio/baixo | Riscos por tipo (30 dias): donut | Risco por localização (30 dias): mapa + top países |
```

**Evolução de usuários de risco**: linhas de níveis alto/médio/baixo na legenda superior, x temporal/y usuários, tooltip/resumo. **Riscos por tipo (30 dias)**: donut com detecções centrais e legenda lateral em tabela **Top 5** por tipo; os demais são agregados em `Outros`. **Risco por localização (30 dias)**: mapa/lista de intensidade e ranking textual **Top 5** com `Outros`; móvel privilegia lista. Todos `restricted`.

### Faixa 3 — usuários e orientação

`grid grid-cols-1 gap-4 xl:grid-cols-12`; tabela `xl:col-span-9`; lateral `xl:col-span-3`.

```text
| Usuários de risco                                              | Ações rápidas |
|                                                                | Insights e recomendações |
```

**Usuários de risco**: tabela com identidade minimizada, nível, estado, última atividade/tipo, MFA, admin, último login e ação contextual.

**Ações rápidas**: lista ordenada para revisar usuários de risco alto (`available` quando a lista estiver publicada); revogar sessões (`coming_soon`); forçar redefinição de senha (`coming_soon`); gerar relatório de risco (`restricted` até contrato de exportação). **Insights e recomendações**: lista de achado/contexto e CTA “Ver todas as recomendações”; derivação `unavailable` até regra aprovada. A superfície inteira é `restricted` até fonte de risco.

---

## 08. Histórico e Auditoria

### Faixa 1 — seis KPIs de auditoria

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI `xl:col-span-1`.

```text
| Eventos | Políticas | Métodos | Ações usuário | Falhas administrativas | Retenção |
```

**KPI**: métrica de valor, período/contexto e comparação. Graph `restricted`; retenção interna `unavailable` até política aprovada.

**Período de retenção — KPI específico**: título, duração/política aplicável e CTA “Ver configurações”; `unavailable` até política interna publicada. O CTA é consulta contextual, não alteração.

### Faixa 2 — filtro, eventos e painel lateral

`grid grid-cols-1 gap-4 xl:grid-cols-12`; filtros `xl:col-span-12`; tabela `xl:col-span-9`; lateral `xl:col-span-3 xl:row-span-2`; detalhe agrupado `xl:col-span-9`.

```text
| Filtros: período | categoria | tipo | usuário | origem |
| Eventos de auditoria                                            | Filtros rápidos de atividade |
| Detalhes do evento selecionado e Informações adicionais (subgrid em duas colunas) | Origens dos eventos: donut |
|                                                                  | Retenção e armazenamento |
|                                                                  | Ações           |
```

**Eventos de auditoria**: tabela com data/hora, categoria, tipo, descrição, ator/execução minimizados, objeto, origem, resultado, IP e detalhe; paginação; `restricted` até auditoria Graph/retencão.

**Filtros rápidos de atividade**: lista de categorias e contagens. **Origens dos eventos**: donut com total/semântica da origem central e legenda lateral em tabela ordenada; `restricted`. **Retenção e armazenamento**: lista de classe e período, `unavailable` até aprovação.

**Ações disponíveis**: lista ordenada para ver detalhes do usuário (`available` quando houver evento); ver métodos de autenticação (`available` quando fonte publicada); revogar todas as sessões (`coming_soon`); gerar Temporary Access Pass (`coming_soon`); abrir relatório de auditoria completo (`restricted` até contrato de exportação).

### Faixa 3 — detalhe selecionado (filho da área principal da faixa 2)

Dentro de `detalhe agrupado` (`xl:col-span-9`), `grid grid-cols-1 gap-4 xl:grid-cols-2`; detalhe `xl:col-span-1`; conteúdo adicional `xl:col-span-1`. A lateral da faixa 2 permanece em `xl:col-span-3 xl:row-span-2`.

```text
| Detalhes legíveis do evento selecionado | Informações adicionais estruturadas |
```

**Detalhes do evento selecionado — pares atributo/valor**: categoria, evento, descrição, origem, resultado, objeto e correlação sanitizada; link externo só quando autorizado. **Informações adicionais — estrutura colapsável**: dados minimizados, sem segredo/PII excedente. Ambos `restricted` até fonte.

---

## Decisões explícitas

- A ordem e a composição macro das oito telas reproduzem as referências visuais; todas conservam shell, cabeçalho, abas e ações globais definidos neste contrato.
- Tabelas e detalhes devem minimizar dados pessoais; exemplos das imagens não são conteúdo inicial.
- Ações mutáveis ficam na posição visual observada, mas `coming_soon` até formalização operacional.

## Divergências e pendências

- Spans em 12 colunas e comportamento móvel são inferência estrutural para traduzir imagens desktop; validar em protótipo antes da Spec.
- Os valores, percentuais e datas visíveis nas imagens não foram transcritos por serem demonstrativos.
- Métricas que dependem de elegibilidade, exceções, score, alertas, retenção e classificação requerem decisão normativa e fonte publicada.
- Cobertura por departamento e as três análises adicionais de Eventos permanecem visíveis como pendências para não serem perdidas na futura Spec.

## Verificação de coerência

- As oito telas têm faixas, grids, spans, diagramas e anatomia de seus blocos não triviais.
- Donuts, linhas, barras, mapas e tabelas declaram série/categoria, legenda ou ausência, eixos quando aplicáveis, tooltip/resumo e móvel.
- Estados `available`, `restricted`, `unavailable` e `coming_soon` preservam finalidade sem inventar dados.
