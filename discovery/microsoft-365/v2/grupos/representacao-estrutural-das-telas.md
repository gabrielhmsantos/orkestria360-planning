# Representação estrutural das telas de Microsoft 365 / Grupos

## Referências

- **Visuais do sponsor**: `01.Dashboard Executivo.png` a `08.Histórico e Auditoria.png`, em `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Grupos/`.
- **Discovery e decisões**: `README.md`, `expectativas-do-sponsor.md` e as superfícies deste diretório.
- **Requisitos/specs**: `specs/002-microsoft-365-module/contracts/microsoft-365-overview.md` (contexto de proveniência Graph; não é contrato deste submódulo).
- **Padrões implementados**: `docs/DESIGN-orkestria.md`.

Esta representação fixa itens, ordem, agrupamento e proporção estrutural; não especifica cor, pixel ou componente novo. Valores das imagens são ilustrativos. Todo bloco preserva seu lugar quando uma origem não estiver autorizada ou disponível.

## Convenções

- Cabeçalho compartilhado: título, descrição, ações contextuais e indicador de atualização. A navegação lateral é comum às oito superfícies; as abas horizontais são contextuais às telas `03`–`08`, como nas referências, e a decisão de padronizá-las permanece pendente.
- Em todas as telas: `grid-cols-1 gap-4` no móvel; `sm:grid-cols-2` para KPIs; `xl:grid-cols-12` para proporções distintas. Não ocultar blocos para acomodar largura.
- `available` descreve estrutura sustentada pelas fontes; dados Graph podem ser `restricted`; dados corporativos sem modelo são `unavailable`; ações mutáveis e simuladores são `coming_soon`.
- Toda tela termina em uma barra persistente de proveniência: origem combinada Graph/Orkestria quando aplicável, atualização/frescor e condição de disponibilidade. Não declarar atualização uniforme quando os blocos tiverem coletas distintas.
- CTA deve declarar efeito: aprofundar/navegar é `available`; exportar é `restricted` conforme autorização; criar, corrigir, atribuir, revisar, renovar, arquivar, excluir e simular são `coming_soon` até o workflow ser aprovado. Bloco não disponível preserva título/espaço, explica condição habilitadora e oferece recuperação/navegação quando houver.
- Tabelas largas preservam cabeçalho e rolagem horizontal no móvel; a futura Spec deve decidir priorização de colunas ou detalhe expandível sem perder navegação por teclado.
- Donut, linha, barra, score e fluxo devem oferecer título, legenda/valores e resumo textual equivalente; tooltip ou eixos isolados não bastam para leitura assistiva.
- **Contrato visual padronizado dos gráficos** (mantém o estilo estrutural das imagens, sem fixar cor ou pixel):
  - **D1 — donut**: visual à esquerda, total/denominador no centro; legenda vertical à direita, na mesma ordem das fatias, com marcador circular, categoria, quantidade e participação alinhada à direita; no móvel, visual acima e legenda abaixo, preservando a ordem. Tooltip repete categoria, quantidade e participação; resumo textual lista total e categorias.
  - **L1 — linha de uma série**: identificação da série no cabeçalho do plot (marcador + rótulo) quando exibida; eixo Y à esquerda, eixo X temporal abaixo e pontos na linha. Não há legenda separada quando o título/rótulo já identifica a única série. Tooltip traz período e valor; resumo textual informa período, tendência e pontos de maior/menor valor; no móvel, o eixo X reduz rótulos sem ocultar a série.
  - **B1 — barras verticais de uma série**: categorias/faixas no eixo X, quantidade no Y e valor direto acima da barra; sem legenda separada, pois a única série é nomeada no título. Tooltip traz categoria e quantidade; resumo textual enumera categorias e valores; no móvel, mantém-se a ordem das faixas com rolagem horizontal se necessária.
  - **B2 — barras horizontais de uma série**: categoria à esquerda, barra central e quantidade/participação à direita, em ordem decrescente quando a referência não determinar outra; sem legenda separada, pois a série é identificada no título. Tooltip traz categoria e quantidade; resumo textual enumera categorias e valores; no móvel, rótulo, barra e valor continuam na mesma linha ou empilham sem perder o valor.
  - **S1 — score semicircular**: arco e valor/classificação no centro; legenda vertical à direita com marcador, dimensão e percentual, na ordem apresentada pela referência; no móvel, score acima e legenda abaixo. Tooltip e resumo textual expõem dimensão e percentual.
  - **F1 — fluxo**: etapas na ordem de leitura, conectores entre elas, ícone/rótulo/contagem em cada etapa; não usa legenda separada porque os elementos são rotulados diretamente. No móvel, mantém a ordem com rolagem horizontal ou empilhamento sequencial; resumo textual descreve as etapas e contagens.

---

## 01. Dashboard Executivo

### Faixa 1 — indicadores de composição e risco (12 KPIs homogêneos)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-1`.

```text
[Totais] [M365] [Segurança] [Dinâmicos] [Sincronizados] [Teams]
[Sem dono] [Inativos] [Convidados] [Erro licença] [Role] [Expiração]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**

```text
ícone  título
valor principal
participação ou contexto
tendência versus período
```

- Regiões internas: ícone à esquerda; título/valor/percentual e tendência à direita/abaixo.
- Estado e fonte: `available` para composição; atividade, licença e expiração podem ser `restricted` conforme origem.

### Faixa 2 — leitura analítica (três terços)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Distribuição: `xl:col-span-4`; Tendência: `xl:col-span-4`; Saúde: `xl:col-span-4`.

```text
| 1/3 Distribuição por tipo | 1/3 Tendência criados | 1/3 Saúde da governança |
```

#### Anatomia dos blocos desta faixa

**Distribuição por tipo — donut (D1)**

```text
título
plot à esquerda: total central | legenda D1 à direita: tipo + quantidade/participação
rodapé: ver todos os grupos →
```

**Tendência de grupos criados — linha (L1)**

```text
título
marcador/rótulo da série “Criados” + eixo Y + linha temporal + pontos
eixo X por data
rodapé: ver análise completa →
```

**Saúde da governança — score semicircular (S1)**

```text
título
arco/score central + classificação somente se homologada
legenda S1 à direita: dimensões + percentual
rodapé: ver detalhes da governança →
```

- Estado e fonte: distribuição/tendência e score usam a geração publicada. Cada dimensão do score sem evidência publicada contribui com `0%`; o score permanece visível com sua composição.

### Faixa 3 — investigação e encaminhamento (metade + dois quartos)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Principais grupos: `xl:col-span-6`; Atenção: `xl:col-span-3`; Insights: `xl:col-span-3`.

```text
| 1/2 Principais grupos (tabela) | 1/4 Requerem atenção | 1/4 Insights e recomendações |
```

#### Anatomia dos blocos desta faixa

**Principais grupos — tabela**: título; colunas grupo/tipo/membros/proprietários/convidados/atividade/status; rodapé “ver todos”.

**Requerem atenção — lista**: título; linhas com ícone, motivo e quantidade; rodapé de investigação.

**Insights e recomendações — lista acionável**: ícone/severidade, título, explicação curta e CTA contextual por linha; rodapé “ver todas”.

- Estado e fonte: listas `available` como estrutura; recomendações dependentes de regra ficam `unavailable`; CTAs de alteração são `coming_soon`.

---

## 02. Diretório de Grupos

### Faixa 1 — composição (seis KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-2`.

```text
[Totais] [M365] [Segurança] [Dinâmicos] [Sincronizados] [Teams]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor, participação e tendência; `available` para estrutura, `restricted` quando a propriedade/contagem não estiver autorizada.

### Faixa 2 — filtros e investigação (três quartos + um quarto)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Área principal: `xl:col-span-9`; Painel lateral: `xl:col-span-3`.

```text
| 3/4 Busca + filtros + tabela de grupos                 | 1/4 Visibilidade |
|                                                         |     Origem       |
|                                                         |     Alertas      |
|                                                         |     Ações        |
```

#### Anatomia dos blocos desta faixa

**Área principal — filtros e tabela**

```text
título “Filtros e pesquisa”
busca | tipo | associação | origem | visibilidade | status
filtros avançados | limpar | aplicar
quantidade encontrada | ações em massa | paginação/visualização
checkbox | nome | tipo | associação | origem | visibilidade | membros | proprietários | Teams | convidados | licenças | atividade | status | menu
```

**Painel lateral — resumos e atalhos**

```text
Resumo por visibilidade: donut D1 (total central; legenda à direita com visibilidade, quantidade e participação)
Resumo por origem: linhas de quantidade
Principais alertas: ícone + quantidade + ver detalhes
Ações rápidas: criar/exportar/revisar/dinâmicos/configurações
```

- Estado e fonte: leitura/filtros `available`; membros, convidados, licenças e atividade podem ser `restricted`; ações em massa, criação e revisão são `coming_soon`.

---

## 03. Membros e Proprietários

### Faixa 1 — indicadores de responsabilidade (seis KPIs)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-2`.

```text
[Membros] [Proprietários] [Sem proprietário] [Donos múltiplos] [Convidados] [Excesso]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor e variação; `restricted` quando a relação ou atributo de identidade não puder ser lido.

### Faixa 2 — lista e detalhe (dois terços + um terço)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Lista: `xl:col-span-8`; Detalhe: `xl:col-span-4`.

```text
| 2/3 Lista de grupos / filtros / tabela | 1/3 Detalhes do grupo selecionado |
```

#### Anatomia dos blocos desta faixa

**Lista de grupos — tabela**: busca e filtros (tipo, associação, origem, status); colunas grupo/tipo/proprietários/membros/convidados/atividade/responsável/status/ação; paginação.

**Detalhes do selecionado — ficha**

```text
avatar/sigla + nome + status + menu
métricas: membros | convidados | proprietários | Teams
proprietários | última sincronização
origem | última alteração
visibilidade | responsável
CTA: ver detalhes completos
```

- Estado e fonte: relações Graph `restricted`; responsável interno `unavailable` sem governança persistida.

### Faixa 3 — distribuição e orientação (quatro quartos)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12`; cada bloco: `xl:col-span-3`.

```text
| Proprietários (donut) | Membros (barras) | Alertas (lista) | Ações recomendadas (lista) |
```

#### Anatomia dos blocos desta faixa

- **Distribuição de proprietários**: donut D1 com total central, legenda à direita por quantidade de donos e CTA.
- **Distribuição dos membros**: barras horizontais B2 por tipo, com rótulo à esquerda e quantidade/participação à direita; CTA.
- **Alertas**: severidade, motivo e quantidade; CTA “ver todos”.
- **Ações recomendadas**: ícone, ação e CTA de destino; executar revisão/alterações fica `coming_soon`.

---

## 04. Grupos Dinâmicos

### Faixa 1 — KPIs de regra e processamento (seis)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-2`.

```text
[Dinâmicos] [Usuários] [Dispositivos] [Ativas] [Pausadas] [Com erro]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor, participação e tendência. Estado `restricted`: grupos dinâmicos exigem licença Entra ID P1/P2 e acesso compatível.

### Faixa 2 — lista, estado e alterações (dois terços + um terço)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Lista: `xl:col-span-8`; Lateral: `xl:col-span-4`.

```text
| 2/3 Lista de grupos dinâmicos | 1/3 Donut do estado |
|                                |     Alterações recentes |
```

#### Anatomia dos blocos desta faixa

- **Lista**: busca e filtros; tabela grupo/tipo/regra/estado/membros/atualização/revisão/status/ação; paginação.
- **Estado das regras**: donut D1, total central, legenda à direita ativa/pausada/erro/em avaliação e CTA.
- **Alterações recentes**: linhas com ícone, grupo, ocorrência, ator/dado autorizado, data e CTA.
- Simulador no cabeçalho é `coming_soon` até haver contrato de processamento e controle de autorização.

### Faixa 3 — saúde e encaminhamento (cinco cartões)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5`; cada bloco: `xl:col-span-1`.

```text
| Tipo (donut) | Sem membros (lista) | Tamanho médio (linha) | Alertas | Ações |
```

#### Anatomia dos blocos desta faixa

- Donut D1: total e legenda à direita por tipo; lista: grupo, estado e data; linha L1: série “Tamanho médio”, média temporal e eixos; alertas/açōes: ícone, motivo, quantidade e CTA.
- Saúde de regra, crescimento abrupto e regra ampla são `unavailable` até critérios homologados.

---

## 05. Licenciamento por Grupo

### Faixa 1 — KPIs de atribuição (cinco)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5`; cada KPI: `xl:col-span-1`.

```text
[Grupos licenciados] [Atribuídas] [Ativas] [Não utilizadas] [Sem atribuição]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor, participação e variação. Estado `restricted` por permissão/licenciamento e processamento disponível.

### Faixa 2 — distribuição e ranking (dois terços + um terço)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Distribuição: `xl:col-span-3`; Uso: `xl:col-span-3`; Ranking: `xl:col-span-6`.

```text
| 1/4 Licenças por tipo (donut) | 1/4 Utilização (donut) | 1/2 Grupos com mais licenças (tabela) |
```

#### Anatomia dos blocos desta faixa

- Cada donut segue D1: título, total central, legenda à direita com categoria, quantidade/participação e CTA.
- Ranking tem título e colunas grupo/atribuídas/em uso/não utilizadas/%; CTA para diretório.

### Faixa 3 — tabela e análise financeira (três quartos + um quarto)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Tabela: `xl:col-span-9`; Lateral: `xl:col-span-3`.

```text
| 3/4 Busca + filtros + licenças atribuídas por grupo | 1/4 Custo estimado |
|                                                       |     Oportunidades |
|                                                       |     Simulador    |
```

#### Anatomia dos blocos desta faixa

- **Tabela**: filtros; grupo/tipo/departamento/atribuídas/em uso/não utilizadas/%/principais licenças/atualização/ação; paginação.
- **Custo**: valor mensal, explicação de origem e tendência; `unavailable` sem base comercial interna.
- **Oportunidades**: ícone, quantidade, impacto potencial e CTA; **Simulador**: explicação/CTA, `coming_soon`.

---

## 06. Governança e Ciclo de Vida

### Faixa 1 — KPIs de conformidade (seis)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-2`.

```text
[Com política] [Conformes] [Desvios] [Em revisão] [Sem dono] [Expirados]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor, participação e tendência. Dados de política e revisão interna são `unavailable` sem modelo Orkestria.

### Faixa 2 — status, ciclo e expiração (três terços)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Status: `xl:col-span-3`; Ciclo: `xl:col-span-5`; Expiração: `xl:col-span-4`.

```text
| 1/4 Status (donut) | 5/12 Ciclo de vida (fluxo) | 1/3 Expiração (barras) |
```

#### Anatomia dos blocos desta faixa

- **Status**: donut D1 com total central, legenda à direita e CTA.
- **Ciclo**: fluxo F1 com etapas criação → uso ativo → revisão → expirado → arquivado, cada uma com ícone e contagem; fluxo é leitura, não workflow executável.
- **Expiração**: barras verticais B1 por faixa temporal, eixos, valor direto e CTA.
- Estado: expiração Graph `restricted`; políticas, classificação e arquivamento `unavailable`/`coming_soon` conforme condição.

### Faixa 3 — tabela, políticas e ações (três quartos + um quarto)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Tabela: `xl:col-span-9`; Lateral: `xl:col-span-3`.

```text
| 3/4 Filtros + tabela de governança | 1/4 Políticas mais aplicadas |
|                                     |     Ações recomendadas       |
```

#### Anatomia dos blocos desta faixa

- Tabela: busca/filtros; grupo/tipo/proprietário/política/status/criação/expiração/ação; paginação.
- Políticas: barras horizontais B2 por política e quantidade; ações: ícone, motivo, quantidade, CTA.
- Atribuir dono, renovar, arquivar e revisar são `coming_soon`.

---

## 07. Atividade e Inatividade

### Faixa 1 — KPIs de faixa de atividade (seis)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-2`.

```text
[Total] [Ativos] [Pouco ativos] [Inativos] [>180 dias] [Sem atividade registrada]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor, participação e comparação. Atividade de grupos M365 é `restricted`; “sem atividade registrada” não significa inatividade.

### Faixa 2 — distribuição, períodos e resumo (três terços)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Donut: `xl:col-span-3`; Barras: `xl:col-span-5`; Resumo: `xl:col-span-4`.

```text
| 1/4 Nível (donut) | 5/12 Inativos por período (barras) | 1/3 Resumo da atividade |
```

#### Anatomia dos blocos desta faixa

- Donut D1: total e legenda à direita por faixa; barras verticais B1: períodos no eixo X, quantidades no Y e valor direto; resumo: métricas em linhas e CTA.
- Faixas temporais são hipótese de classificação; blocos sem fonte mensurável ficam `unavailable` como prova de uso.

### Faixa 3 — investigação e impacto (três quartos + um quarto)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Tabela: `xl:col-span-9`; Lateral: `xl:col-span-3`.

```text
| 3/4 Lista por nível de atividade | 1/4 Impacto da inatividade |
|                                   |     Ações rápidas           |
```

#### Anatomia dos blocos desta faixa

- Tabela: busca/filtros; grupo/tipo/proprietário/membros/última atividade/nível/dias/itens/ação; paginação.
- Impacto: riscos, licenças e armazenamento por linhas de valor; ações: revisar/notificar/arquivar/excluir, todas `coming_soon` quando mutáveis.

---

## 08. Histórico e Auditoria

### Faixa 1 — KPIs de eventos (seis)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; cada KPI: `xl:col-span-2`.

```text
[Eventos] [Alterações de grupos] [Membros] [Permissões] [Excluídos] [Exportações]
```

#### Anatomia dos blocos desta faixa

**KPI — métrica operacional**: ícone, título, valor, participação e tendência. Fonte `restricted` por auditoria, retenção e autorização.

### Faixa 2 — análise de eventos (três terços)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Tipo: `xl:col-span-3`; Tempo: `xl:col-span-5`; Administrador: `xl:col-span-4`.

```text
| 1/4 Tipo (donut) | 5/12 Ao longo do tempo (linha) | 1/3 Por administrador (barras) |
```

#### Anatomia dos blocos desta faixa

- Donut D1: total, legenda à direita de categorias e CTA; linha L1: série “Eventos”, eixos, pontos/tooltip e CTA; barras horizontais B2: atores autorizados, quantidade/participação e CTA.
- Identidades, IPs e detalhes sensíveis permanecem `restricted` conforme permissão e minimização.

### Faixa 3 — log, detalhe e retenção (três quartos + um quarto)

`grid grid-cols-1 gap-4 xl:grid-cols-12`; Log: `xl:col-span-9`; Lateral: `xl:col-span-3`.

```text
| 3/4 Filtros + log de auditoria                 | 1/4 Evento selecionado |
|                                                 |     Retenção           |
|                                                 |     Ações rápidas      |
```

#### Anatomia dos blocos desta faixa

- **Log**: busca/filtros (tipo, administrador, período, grupo); colunas data/tipo/descrição/grupo/administrador/origem autorizada/detalhes/ação; paginação.
- **Evento selecionado**: tipo, data, grupo, ator, campos permitidos e antes/depois minimizados.
- **Retenção**: explicação e medidor; **ações**: exportar/configurar alerta/política/relatório, `coming_soon` quando gerarem mudança ou divulgação não aprovada.

## Decisões explícitas

- As oito telas seguem a ordem e os blocos visuais das imagens do sponsor.
- Tabelas e painéis laterais preservam investigação contextual; CTAs de alteração não pressupõem execução.
- O shell e componentes existentes do Orkestria são referência de composição, sem substituir os visuais do sponsor.
- As proporções analíticas de Licenciamento, Governança, Atividade e Auditoria priorizam ranking, fluxo e séries temporais conforme a ênfase visual das referências.

## Divergências e pendências

- As imagens sugerem proporções; as grades de 12 colunas e os spans são inferência estrutural para implementação futura e devem ser validados na Spec.
- Critérios de alerta, classificação textual e preços são pendências. O score usa os pesos do sponsor e evidencia o percentual de cada dimensão, inclusive zero por falta de evidência.
- Endpoints, permissões, paginação, respostas vazias e condições de licença ainda precisam de validação técnica por superfície.
- A estratégia definitiva para abas horizontais nas telas `01`–`02` e a semântica de estados de carregamento, vazio e erro por faixa são pendências da futura Spec.

## Verificação de coerência

- Cada tela declara faixas, grids, gaps, breakpoints, spans, diagramas e anatomia dos blocos não triviais.
- Todo bloco mantém estado explícito e condição quando os dados não estiverem disponíveis.
- Os blocos respeitam a ordem de KPIs, análise, investigação e ações observada nas referências.
