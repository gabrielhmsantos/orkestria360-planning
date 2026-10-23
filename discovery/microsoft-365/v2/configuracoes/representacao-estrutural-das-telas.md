# Representação estrutural das telas — Microsoft 365 / Configurações

## Referências

- **Visuais do sponsor:** `docs/sharepoint/detalhamento-dos-modulos/Microsoft 365/Configurações/01…08*.png`.
- **Discovery e decisões:** `README.md`, `expectativas-do-sponsor.md` e diretórios das oito superfícies.
- **Padrões implementados:** `docs/DESIGN-orkestria.md`.

Esta representação registra composição, ordem e proporções das telas. Não define valores ilustrativos, cor ou pixel. A primeira implementação é exclusivamente de leitura e apresenta somente dados coletados e normalizados.

## Convenções

- Todas as telas têm cabeçalho com título/subtítulo, metadado de atualização, ações globais de leitura e abas. As ações globais são **Exportar** (botão com menu), **Relatórios** (botão com menu) e **Filtros avançados** (botão); exportação e relatórios usam apenas dados já coletados pelo Orkestria 360.
- A responsividade `grid-cols-1`, `sm:grid-cols-2` e grade de 12 colunas em `xl` é decisão explícita deste módulo, inferida das fontes desktop e sujeita a validação em viewport real antes da Spec. Em mobile, cabeçalho e abas ficam em sequência vertical/horizontal rolável; nenhum bloco é removido.
- KPIs simples usam `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6` (ou sete, quando indicado); exibem título, valor/estado e contexto. Dados são `available` somente na cobertura de conector publicada.
- Donuts têm total central e resumo textual navegável no DOM. Em cartões de `xl:col-span-2`, a legenda é `stacked`; em `col-span-3` ou maior, é `side` até a largura mínima do card e então `stacked`. A legenda declara série/categoria, valor e estado sem depender de cor. Linhas usam tooltip, eixo X temporal, eixo Y quantitativo, legenda superior/lateral e tabela ou resumo equivalente no DOM; em mobile preservam série e resumo com rolagem horizontal quando necessária. Barras usam eixo quantitativo, categorias visíveis e `Top N` explícito quando aplicável. Cada visual deve expor nomes e valores também por teclado/leitor de tela, sem depender de hover.
- Tabelas têm colunas observadas e versão de cartão empilhado em mobile. Embora as referências visuais usem paginação numérica, o padrão aprovado do produto usa somente controles **Anterior** e **Próxima**. Detalhes técnicos, payloads e identidades `restricted` mostram causa, agregado seguro disponível e condição de leitura. Blocos `unavailable` mostram rótulo, causa e condição habilitadora.

---

## 01. Dashboard Executivo

### Faixa 1 — postura consolidada (seis KPIs homogêneos)

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; **Microsoft 365 Configuration Score**, **Configurações Analisadas**, **Configurações Conformes**, **Configurações Divergentes**, **Configurações Críticas**, **Workloads com Drift**: `xl:col-span-1` cada.

```text
| Configuration Score | Configurações Analisadas | Configurações Conformes | Configurações Divergentes | Configurações Críticas | Workloads com Drift |
| score/cobertura     | total      | total/%   | total/%     | total/%  | workloads/razão     |
```

#### Anatomia dos blocos desta faixa

- **Microsoft 365 Configuration Score — score:** medidor, nota, classificação e variação; a nota segue as decisões C e A; cobertura ponderada e travas ficam visíveis. Linha homologada sem leitura comparável preserva `unavailable` e a razão, recebe zero pontos e reduz cobertura; domínio sem linha elegível também contribui zero.
- **Configurações Analisadas — KPI:** total de configurações incluídas na análise e período/snapshot de referência; sem fonte, `unavailable`.
- **Configurações Conformes — KPI:** total e percentual de configurações conformes no conjunto analisado; sem fonte, `unavailable`.
- **Configurações Divergentes — KPI:** total e percentual de configurações divergentes no conjunto analisado; sem fonte, `unavailable`.
- **Configurações Críticas — KPI:** total e percentual de configurações críticas no conjunto analisado; sem fonte, `unavailable`.
- **Workloads com Drift — KPI/lista:** número de workloads e indicação de alterações observadas sem registro correlato.

### Faixa 2 — alterações, risco, baseline e cobertura

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Alterações Pendentes** `xl:col-span-2`; **Alterações Executadas (30 dias)** `xl:col-span-3`; **Configurações por Risco** `xl:col-span-3`; **Baselines Ativos** `xl:col-span-2`; **Configurações sem Coleta** `xl:col-span-2`.

```text
| 2 Alterações Pendentes | 3 Alterações Executadas (30 dias) | 3 Configurações por Risco | 2 Baselines Ativos | 2 Configurações sem Coleta |
| estados                  | donut/legenda                       | donut/legenda             | lista/status       | razões                     |
```

#### Anatomia dos blocos desta faixa

- **Alterações Pendentes — lista de estados:** total e contagem por rascunho, aguardando validação, aguardando aprovação, agendada e em execução; os dados são somente de consulta e não expõem comandos de criação, aprovação ou execução.
- **Alterações Executadas (30 dias) — donut:** total central; categorias sucesso, falha, parcialmente concluída e revertida, nessa ordem na legenda vertical; tooltip e resumo textual; no mobile a legenda fica empilhada. Dados são somente de consulta.
- **Configurações por Risco — donut:** total central; categorias crítica, alta, média e baixa em ordem de risco na legenda vertical; tooltip e resumo textual; no mobile a legenda fica empilhada. Fonte catálogo/estado.
- **Baselines Ativos — tabela curta:** baseline, versão e status.
- **Configurações sem Coleta — lista:** razão e quantidade; `unavailable` com condição de habilitação (licença, permissão, API, workload, autenticação, throttling ou conector).

### Faixa 3 — leitura por workload e criticidade

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Conformidade por Workload** `xl:col-span-4`; **Evolução do Configuration Score** `xl:col-span-3`; **Top 10 Configurações Críticas** `xl:col-span-5`.

```text
| 4 Conformidade por Workload | 3 Evolução do Configuration Score | 5 Top 10 Configurações Críticas |
| barras empilhadas/legenda   | linha temporal                     | configuração/workload/risco     |
```

#### Anatomia dos blocos desta faixa

- **Conformidade por Workload — barras empilhadas:** workloads no eixo X; percentual no Y; segmentos conforme, divergente e crítico; legenda abaixo. Tooltip e resumo por workload; mobile empilha barras em lista.
- **Evolução do Configuration Score — linha:** uma série identificada no título, pontos temporais, eixo X por data e Y 0–100; sem legenda por série única. Histórico insuficiente é `unavailable`.
- **Top 10 Configurações Críticas — tabela:** configuração, workload e risco; limite Top 10 confirmado pela referência, com navegação para a lista completa e sem agregação implícita como “Outros”.

### Faixa 4 — mudanças, cobertura e recomendações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Alterações Observadas Recentes** `xl:col-span-5`; **Workloads sem Coleta** `xl:col-span-3`; **Ações Recomendadas** `xl:col-span-4`.

```text
| 5 Alterações Observadas Recentes | 3 Workloads sem Coleta | 4 Ações Recomendadas |
| tabela                            | lista/razão            | lista/risco            |
```

#### Anatomia dos blocos desta faixa

- **Alterações Observadas Recentes — tabela:** data/hora, configuração, workload, origem e risco.
- **Workloads sem Coleta — tabela curta:** workload, motivo e última tentativa; mantém razão em vez de zero.
- **Ações Recomendadas — lista priorizada:** recomendação e risco, com navegação somente de leitura ao contexto relevante; não expõe comandos de execução.

---

## 02. Configurações do Tenant

### Faixa 1 — identidade organizacional e domínios

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Informações da Organização** `xl:col-span-4`; **Identidade Visual do Tenant** `xl:col-span-4`; **Domínios Verificados** `xl:col-span-4`.

```text
| 4 Informações da Organização | 4 Identidade Visual do Tenant | 4 Domínios Verificados |
| campos                       | logotipos, fundo e textos      | tabela                  |
```

#### Anatomia dos blocos desta faixa

- **Informações da Organização — detalhe em duas colunas:** identidade, domínio, país/idioma/status e diretório, sincronização/licenças/contatos.
- **Identidade Visual do Tenant — mídia e metadados:** logo, logo quadrado, imagem, cor e textos; mídia/valores só são apresentados quando Graph autorizado.
- **Domínios Verificados — tabela:** domínio, tipo, status, principal e serviços; verificação e DNS externo não pertencem ao módulo.

### Faixa 2 — contatos, serviços e sincronização

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Contatos da Organização** `xl:col-span-4`; **Serviços Habilitados no Tenant** `xl:col-span-5`; **Sincronização e Diretórios** `xl:col-span-3`.

```text
| 4 Contatos da Organização | 5 Serviços Habilitados no Tenant | 3 Sincronização e Diretórios |
| cartões de contato         | grade de serviços/status          | detalhe                      |
```

#### Anatomia dos blocos desta faixa

- **Contatos da Organização — cartões:** técnico, privacidade e segurança; nomes/canais `restricted` quando necessário.
- **Serviços Habilitados no Tenant — grade:** serviço, ícone e status; não infere serviço por ausência de resposta.
- **Sincronização e Diretórios — detalhe:** diretório, método, ciclos, usuários/grupos/OUs.

### Faixa 3 — configuração geral

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Configurações Gerais do Tenant** `xl:col-span-12`.

```text
| 12 Configurações Gerais do Tenant |
| configuração, descrição, atual, baseline, status, origem, data... |
```

#### Anatomia dos blocos desta faixa

- **Configurações Gerais do Tenant — tabela:** configuração, descrição, valor atual, baseline, status, origem e última alteração. Valores estruturados preservam representação segura.

---

## 03. Identidade e Acesso

### Faixa 1 — indicadores de identidade

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; **Políticas de Acesso Condicional**, **Localizações Nomeadas**, **Métodos de Autenticação**, **Usuários com MFA**, **Funções Administrativas**, **Usuários Externos (B2B)**: `xl:col-span-1` cada.

```text
| Políticas de Acesso Condicional | Localizações Nomeadas | Métodos de Autenticação | Usuários com MFA | Funções Administrativas | Usuários Externos (B2B) |
```

#### Anatomia dos blocos desta faixa

- **Políticas de Acesso Condicional — KPI:** contagem e estado/contexto; a fonte é o conector Entra.
- **Localizações Nomeadas — KPI:** contagem e estado/contexto; a fonte é o conector Entra.
- **Métodos de Autenticação — KPI:** contagem e estado/contexto; a fonte é o conector Entra.
- **Usuários com MFA — KPI:** contagem, cobertura e estado/contexto; a identidade individual pode ser `restricted`.
- **Funções Administrativas — KPI:** contagem e estado/contexto; a identidade individual pode ser `restricted`.
- **Usuários Externos (B2B) — KPI:** contagem e estado/contexto; a identidade individual pode ser `restricted`.

### Faixa 2 — políticas e autenticação

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Políticas de Acesso Condicional** `xl:col-span-5`; **Métodos de Autenticação** `xl:col-span-4`; **Proteção por Senha** `xl:col-span-3`.

```text
| 5 Políticas de Acesso Condicional | 4 Métodos de Autenticação | 3 Proteção por Senha |
| tabela/estado/escopo               | donut/legenda             | valores e estados    |
```

#### Anatomia dos blocos desta faixa

- **Políticas de Acesso Condicional — tabela:** política, estado, modo, aplicações e usuários/grupos; detalhe preserva condições, controles, baseline e exceções.
- **Métodos de Autenticação — donut:** total central; legenda vertical dos métodos na ordem exibida, com estado e cobertura. Sem fonte é `unavailable`.
- **Proteção por Senha — detalhe:** senha inteligente, lista, bloqueio e expiração; valores dependem de fonte homologada.

### Faixa 3 — funções, PIM, usuários e aplicações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Funções Administrativas** `xl:col-span-3`; **Atribuições PIM** `xl:col-span-3`; **Usuários e Acesso** `xl:col-span-3`; **Aplicativos Empresariais** `xl:col-span-3`.

```text
| 3 Funções Administrativas | 3 Atribuições PIM | 3 Usuários e Acesso | 3 Aplicativos Empresariais |
| donut/legenda             | métricas           | barras               | métricas                   |
```

#### Anatomia dos blocos desta faixa

- **Funções Administrativas — donut:** total central e categorias permanente, elegível, PIM e personalizada, nessa ordem na legenda lateral; tooltip e resumo textual; no mobile a legenda fica empilhada.
- **Atribuições PIM — métricas:** contagens e estados por atribuição; identidades são `restricted`.
- **Usuários e Acesso — barras:** categorias de MFA, risco e conta no eixo categórico; total no eixo quantitativo; tooltip e resumo textual; no mobile vira lista de categorias. Identidades são `restricted`.
- **Aplicativos Empresariais — métricas/lista:** contagens e estados de aplicativos; identidades e detalhes sensíveis são `restricted`.

### Faixa 4 — eventos e recomendações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Eventos Recentes de Identidade** `xl:col-span-7`; **Recomendações de Investigação** `xl:col-span-5`.

```text
| 7 Eventos Recentes de Identidade | 5 Recomendações de Investigação |
| tabela                            | lista/risco                    |
```

#### Anatomia dos blocos desta faixa

- **Eventos Recentes de Identidade — tabela:** data/hora, evento, usuário, detalhes, risco e status; usuário é `restricted` quando aplicável.
- **Recomendações de Investigação — lista:** leitura de sinais, risco e contexto relacionado.

---

## 04. Colaboração e Compartilhamento

### Faixa 1 — postura de compartilhamento

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7`; **Nível de Compartilhamento**, **Links Anônimos**, **Domínios Permitidos**, **Domínios Bloqueados**, **Expiração de Links**, **Expiração de Convidados**, **Sites Criados por Usuários**: `xl:col-span-1` cada.

```text
| Nível de Compartilhamento | Links Anônimos | Domínios Permitidos | Domínios Bloqueados | Expiração de Links | Expiração de Convidados | Sites Criados por Usuários |
```

#### Anatomia dos blocos desta faixa

- **Nível de Compartilhamento — KPI:** nível configurado, estado e contexto; fonte é Graph, SharePoint ou PowerShell homologado.
- **Links Anônimos — KPI:** total ou estado configurado, com contexto de compartilhamento; ausência por propriedade não exposta é `unavailable`.
- **Domínios Permitidos — KPI:** total de domínios permitidos e estado; ausência por propriedade não exposta é `unavailable`.
- **Domínios Bloqueados — KPI:** total de domínios bloqueados e estado; ausência por propriedade não exposta é `unavailable`.
- **Expiração de Links — KPI:** política de expiração, valor e estado; ausência por propriedade não exposta é `unavailable`.
- **Expiração de Convidados — KPI:** política de expiração, valor e estado; ausência por propriedade não exposta é `unavailable`.
- **Sites Criados por Usuários — KPI:** total ou estado da criação por usuários e contexto; ausência por propriedade não exposta é `unavailable`.

### Faixa 2 — políticas, atividade e convidados

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Configurações de Compartilhamento Externo** `xl:col-span-4`; **Tipos de Link Padrão** `xl:col-span-3`; **Atividade de Compartilhamento (30 dias)** `xl:col-span-3`; **Acesso de Convidados** `xl:col-span-2`.

```text
| 4 Configurações de Compartilhamento Externo | 3 Tipos de Link Padrão | 3 Atividade de Compartilhamento (30 dias) | 2 Acesso de Convidados |
| lista de regras            | donut/legenda          | linha/legenda         | donut/legenda           |
```

#### Anatomia dos blocos desta faixa

- **Configurações de Compartilhamento Externo — lista:** regras e valor.
- **Tipos de Link Padrão — donut:** total central; tipos na legenda vertical, na ordem exibida; tooltip e resumo textual; no mobile a legenda fica empilhada.
- **Atividade de Compartilhamento (30 dias) — linha:** séries compartilhamentos, convidados adicionados e links criados; legenda superior na mesma ordem; eixo X por data e eixo Y por quantidade; tooltip e resumo textual; no mobile preserva as séries com rolagem horizontal quando necessária.
- **Acesso de Convidados — donut:** total central e estados ativo, pendente, expirando e expirado, nessa ordem na legenda vertical; tooltip e resumo textual; no mobile a legenda fica empilhada. Identidades são `restricted`.

### Faixa 3 — domínios e serviços

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Domínios Permitidos** `xl:col-span-4`; **Políticas de Grupos e Sites** `xl:col-span-3`; **Configurações do Microsoft Teams** `xl:col-span-2`; **Configurações do OneDrive** `xl:col-span-3`.

```text
| 4 Domínios Permitidos | 3 Políticas de Grupos e Sites | 2 Configurações do Microsoft Teams | 3 Configurações do OneDrive |
```

#### Anatomia dos blocos desta faixa

- **Domínios Permitidos — tabela:** domínio, tipo, status e origem; paginação local de 10 itens por página, com anterior/próxima.
- **Políticas de Grupos e Sites — lista de pares:** regra e valor.
- **Configurações do Microsoft Teams — lista de pares:** regra e valor.
- **Configurações do OneDrive — lista de pares:** regra e valor.

### Faixa 4 — histórico e recomendações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Alterações Observadas de Compartilhamento** `xl:col-span-7`; **Recomendações de Investigação** `xl:col-span-5`.

```text
| 7 Alterações Observadas de Compartilhamento | 5 Recomendações de Investigação |
```

#### Anatomia dos blocos desta faixa

- **Alterações Observadas de Compartilhamento — tabela:** data/hora, tipo, detalhes, origem e status.
- **Recomendações de Investigação — lista priorizada:** risco e navegação de leitura ao contexto.

---

## 05. Segurança e Compliance

### Faixa 1 — postura e incidências

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6`; **Postura de Segurança**, **Configurações Analisadas**, **Configurações Conformes**, **Configurações Divergentes**, **Configurações Críticas**, **DLP - Incidentes (30 dias)**: `xl:col-span-1` cada.

```text
| Postura de Segurança | Configurações Analisadas | Configurações Conformes | Configurações Divergentes | Configurações Críticas | DLP - Incidentes (30 dias) |
```

#### Anatomia dos blocos desta faixa

- **Postura de Segurança — KPI:** score, classificação e variação; os estados dependem de Defender, Purview, Graph, TCM e PowerShell.
- **Configurações Analisadas — KPI:** total de configurações incluídas na análise de segurança e período/snapshot de referência.
- **Configurações Conformes — KPI:** total e percentual de configurações conformes no conjunto analisado.
- **Configurações Divergentes — KPI:** total e percentual de configurações divergentes no conjunto analisado.
- **Configurações Críticas — KPI:** total e percentual de configurações críticas no conjunto analisado.
- **DLP - Incidentes (30 dias) — KPI:** total de incidentes no período e estado/contexto de coleta. Sem coleta ou licença, `unavailable`.

### Faixa 2 — controles e políticas

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Proteções do Microsoft Defender** `xl:col-span-4`; **Conformidade e Proteção de Dados** `xl:col-span-4`; **DLP - Principais Incidentes (30 dias)** `xl:col-span-4`.

```text
| 4 Proteções do Microsoft Defender | 4 Conformidade e Proteção de Dados | 4 DLP - Principais Incidentes (30 dias) |
| tabela                              | donut/legenda                       | tabela                         |
```

#### Anatomia dos blocos desta faixa

- **Proteções do Microsoft Defender — tabela:** proteção, status, cobertura e alteração.
- **Conformidade e Proteção de Dados — donut:** total de políticas central; categorias na legenda vertical, na ordem exibida; tooltip e resumo textual; no mobile a legenda fica empilhada.
- **DLP - Principais Incidentes (30 dias) — tabela:** tipo, severidade, ocorrências e última ocorrência. Itens individuais podem ser `restricted`.

### Faixa 3 — auditoria, rótulos, retenção e baseline

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Auditoria e Monitoramento** `xl:col-span-3`; **Rótulos de Sensibilidade** `xl:col-span-3`; **Políticas de Retenção** `xl:col-span-3`; **Baselines de Segurança** `xl:col-span-3`.

```text
| 3 Auditoria e Monitoramento | 3 Rótulos de Sensibilidade | 3 Políticas de Retenção | 3 Baselines de Segurança |
```

#### Anatomia dos blocos desta faixa

- **Auditoria e Monitoramento — métricas:** quatro métricas de cobertura, estado e contexto; política ou fonte ausente é `unavailable`.
- **Rótulos de Sensibilidade — tabela:** rótulo, escopo, status e origem; política ou fonte ausente é `unavailable`.
- **Políticas de Retenção — donut:** total central e categorias na legenda vertical, na ordem exibida; tooltip e resumo textual; no mobile a legenda fica empilhada. Política ou fonte ausente é `unavailable`.
- **Baselines de Segurança — tabela:** baseline, status e origem; política ou fonte ausente é `unavailable`.

### Faixa 4 — riscos, evolução, cobertura e recomendações

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Configurações Críticas Detectadas** `xl:col-span-4`; **Evolução da Postura de Segurança** `xl:col-span-3`; **Workloads e Cobertura** `xl:col-span-2`; **Recomendações de Investigação** `xl:col-span-3`.

```text
| 4 Configurações Críticas Detectadas | 3 Evolução da Postura de Segurança | 2 Workloads e Cobertura | 3 Recomendações de Investigação |
```

#### Anatomia dos blocos desta faixa

- **Configurações Críticas Detectadas — tabela:** configuração, serviço, severidade, status e recomendação.
- **Evolução da Postura de Segurança — linha:** série única identificada no título, eixo X por data e eixo Y por score; sem legenda por série única; tooltip e resumo textual; no mobile preserva o resumo com rolagem horizontal quando necessária.
- **Workloads e Cobertura — barras horizontais:** workloads ordenados por percentual de cobertura; eixo X percentual e eixo Y por workload; sem legenda por série única identificada no título; tooltip e resumo textual; no mobile vira lista por workload.
- **Recomendações de Investigação — lista:** risco e contexto de leitura.

---

## 06. Configurações por Serviço

### Faixa 1 — seleção de workload

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-8`; **Microsoft Entra ID**, **Exchange Online**, **SharePoint Online**, **OneDrive for Business**, **Microsoft Teams**, **Intune**, **Microsoft Defender**, **Microsoft Purview**: `xl:col-span-1` cada.

```text
| Microsoft Entra ID | Exchange Online | SharePoint Online | OneDrive for Business | Microsoft Teams | Intune | Microsoft Defender | Microsoft Purview |
| total + conforme/divergente/crítica por serviço                         |
```

#### Anatomia dos blocos desta faixa

- **Microsoft Entra ID — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.
- **Exchange Online — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.
- **SharePoint Online — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.
- **OneDrive for Business — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.
- **Microsoft Teams — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.
- **Intune — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector. API beta é sinalizada no catálogo.
- **Microsoft Defender — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.
- **Microsoft Purview — cartão seletor:** nome, total de configurações e distribuição compacta de conformidade; não há valor inventado para serviço sem conector.

### Faixa 2 — catálogo e detalhe

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Categorias** `xl:col-span-2`; **Configurações do Serviço** `xl:col-span-7`; **Detalhes da Configuração** `xl:col-span-3`.

```text
| 2 Categorias/filtros | 7 Configurações do Serviço (tabela/paginação) | 3 Detalhes da Configuração |
```

#### Anatomia dos blocos desta faixa

- **Categorias — filtros:** categoria, status e nível de risco; filtros não escondem indisponibilidade, apenas a filtram.
- **Configurações do Serviço — tabela:** configuração, categoria, valor atual, valor recomendado, status, risco, origem, última alteração e seletor de detalhe; busca, colunas e paginação. Mobile vira cartões com os mesmos campos.
- **Detalhes da Configuração — painel:** título, serviço/categoria, descrição, atual/recomendado, estado, risco, origem, última alteração, método de coleta, ID e permissão.

### Faixa 3 — conformidade e rankings

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Conformidade por Serviço** `xl:col-span-3`; **Serviços com Maior Número de Divergências** `xl:col-span-3`; **Serviços com Mais Configurações Críticas** `xl:col-span-3`; **Recomendações de Investigação** `xl:col-span-3`.

```text
| 3 Conformidade por Serviço | 3 Maior Número de Divergências | 3 Mais Configurações Críticas | 3 Recomendações de Investigação |
```

#### Anatomia dos blocos desta faixa

- **Conformidade por Serviço — donut:** total central de configurações; categorias conforme, divergente, crítica e sem coleta, nessa ordem na legenda vertical; tooltip e resumo textual; no mobile a legenda fica empilhada.
- **Serviços com Maior Número de Divergências — barras horizontais:** Top 5 de serviços ordenados do maior para o menor número de divergências; eixo X quantitativo e eixo Y por serviço; sem legenda por série única identificada no título; tooltip e resumo textual; no mobile vira lista por serviço. Há navegação de leitura para a lista completa, sem agregação implícita em “Outros”.
- **Serviços com Mais Configurações Críticas — barras horizontais:** Top 5 de serviços ordenados do maior para o menor número de configurações críticas; eixo X quantitativo e eixo Y por serviço; sem legenda por série única identificada no título; tooltip e resumo textual; no mobile vira lista por serviço. Há navegação de leitura para a lista completa, sem agregação implícita em “Outros”.
- **Recomendações de Investigação — lista de riscos:** risco e contexto de leitura.

---

## 07. Baselines e Conformidade

### Faixa 1 — situação da conformidade

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3`; **Baselines Ativos**, **Configurações Cobertas**, **Divergências Detectadas**: `xl:col-span-1` cada.

```text
| Baselines Ativos | Configurações Cobertas | Divergências Detectadas |
```

#### Anatomia dos blocos desta faixa

- **Baselines Ativos — KPI:** total e status; baseline e comparação são `available` com snapshot válido e, sem snapshot, ficam `unavailable` com causa.
- **Configurações Cobertas — KPI:** total e percentual de cobertura; baseline e comparação são `available` com snapshot válido e, sem snapshot, ficam `unavailable` com causa.
- **Divergências Detectadas — KPI:** total e status de divergências observadas; baseline e comparação são `available` com snapshot válido e, sem snapshot, ficam `unavailable` com causa.

### Faixa 2 — modelos e cobertura

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Baselines Ativos** `xl:col-span-7`; **Cobertura por Serviço (Baseline Ativo)** `xl:col-span-5`.

```text
| 7 Baselines Ativos | 5 Cobertura por Serviço (Baseline Ativo) |
| tabela             | donut/legenda           |
```

#### Anatomia dos blocos desta faixa

- **Baselines Ativos — tabela:** nome, tipo, versão, configurações, cobertura, atualização e status.
- **Cobertura por Serviço (Baseline Ativo) — donut:** total central e workloads na legenda vertical, na ordem exibida; tooltip e resumo textual; no mobile a legenda fica empilhada.

### Faixa 3 — divergências observadas

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Divergências por Nível de Risco** `xl:col-span-5`; **Configurações Divergentes** `xl:col-span-7`.

```text
| 5 Divergências por Nível de Risco | 7 Configurações Divergentes |
| barras horizontais                | tabela                         |
```

#### Anatomia dos blocos desta faixa

- **Divergências por Nível de Risco — barras horizontais:** categorias crítica, alta, média e baixa, nesta ordem; eixo X quantitativo e eixo Y por nível de risco; sem legenda por série única identificada no título; tooltip e resumo textual; no mobile vira lista por nível de risco.
- **Configurações Divergentes — tabela:** configuração, serviço, valor atual, valor esperado, risco, fonte e instante de coleta.

---

## 08. Histórico e Auditoria

### Faixa 1 — indicadores de trilha

`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3`; **Alterações Observadas**, **Alterações Externas (Drift)**, **Configurações Críticas Alteradas**: `xl:col-span-1` cada.

```text
| Alterações Observadas | Alterações Externas (Drift) | Configurações Críticas Alteradas |
```

#### Anatomia dos blocos desta faixa

- **Alterações Observadas — KPI:** total de alterações observadas no período; somente `available` após coleta histórica.
- **Alterações Externas (Drift) — KPI:** total de alterações externas observadas no período; somente `available` após coleta histórica.
- **Configurações Críticas Alteradas — KPI:** total de configurações críticas alteradas no período; somente `available` após coleta histórica. Ausência histórica é `unavailable`, não estabilidade.

### Faixa 2 — log e distribuições

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Histórico de Alterações** `xl:col-span-8`; **Origem das Alterações** `xl:col-span-4`.

```text
| 8 Histórico de Alterações (filtro, tabela e paginação) | 4 Origem das Alterações (donut/legenda) |
```

#### Anatomia dos blocos desta faixa

- **Histórico de Alterações — tabela:** data/hora, configuração, serviço, objeto, antes, depois, origem e ID; workload é filtro de leitura. Paginação segue o padrão Anterior/Próxima; diff pode ser `restricted`.
- **Origem das Alterações — donut:** total central; categorias fonte de auditoria, alteração externa e outros conectores, nessa ordem na legenda vertical; tooltip e resumo textual; no mobile a legenda fica empilhada. Sem fonte de auditoria, `unavailable`.

### Faixa 3 — detalhe selecionado e análises

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Detalhes da Alteração Selecionada** `xl:col-span-3`; **Valores da Configuração** `xl:col-span-4`; **Informações Técnicas** `xl:col-span-2`; coluna lateral `xl:col-span-3` com **Alterações por Serviço** e **Alterações por Nível de Risco** empilhados.

```text
| 3 Detalhes | 4 Valores da Configuração (antes -> depois) | 2 Informações Técnicas | 3 Alterações por Serviço |
|            |                                             |                         | 3 Alterações por Nível de Risco |
```

#### Anatomia dos blocos desta faixa

- **Detalhes da Alteração Selecionada — detalhe:** ID, data, serviço, configuração, objeto, tipo, origem e risco.
- **Valores da Configuração — diff:** dois painéis antes/depois e indicador direcional; JSON só é mostrado conforme política de dados, senão resumo `restricted`.
- **Informações Técnicas — detalhe:** método, endpoint/cmdlet, API, correlação, duração, IP/agente quando autorizados.
- **Alterações por Serviço — barras horizontais:** serviços ordenados pelo total de alterações; eixo X quantitativo e eixo Y por serviço; legenda ausente por série única identificada no título; tooltip, resumo textual e versão móvel em lista.
- **Alterações por Nível de Risco — donut:** total central; categorias crítica, alta, média e baixa, nessa ordem na legenda vertical; tooltip e resumo textual; composição `side` no desktop e `stacked` abaixo da largura mínima. Fonte é o event store; sem evento, `unavailable` com a condição de coleta.

### Faixa 4 — evidências e drift

`grid grid-cols-1 gap-4 xl:grid-cols-12`; **Evidências e Logs** `xl:col-span-6`; **Drifts Relacionados** `xl:col-span-6`.

```text
| 6 Evidências e Logs | 6 Drifts Relacionados |
| lista de evidências | lista/estado          |
```

#### Anatomia dos blocos desta faixa

- **Evidências e Logs — lista:** referência de coleta, log e metadado disponível; cada item respeita autorização e retenção e pode ser `restricted`.
- **Drifts Relacionados — lista de estado:** referência, origem, risco e instante detectado; inexistência de registro é ausência declarada, não valor sintético.

## Decisões explícitas

- Os títulos canônicos e a ordem dos cards reproduzem as referências visuais `01` a `08`.
- O dashboard preserva blocos de coleta, cobertura, drift e baseline mesmo quando indisponíveis.
- A primeira implementação contém apenas controles e blocos de leitura — decisão do usuário, 2026-08-24.
- A composição da última faixa de Segurança e Compliance usa `4/12`, `3/12`, `2/12` e `3/12`; esta é inferência estrutural ajustada para preservar os blocos de leitura.

## Divergências e pendências

- Os controles preservados na composição são filtros, navegação, exportação e relatórios de leitura.
- A referência `07.Baselines, Alterações e Implantação.png` também mostra fluxo, pendências, planos e implantações. Esses blocos não fazem parte desta versão exclusivamente de leitura e foram removidos da composição, sem estado de disponibilidade ou indicação de entrega futura.
- As imagens não comprovam todos os spans de forma semântica; as proporções de 12 colunas acima são inferência estrutural fiel à composição observável.
- Persistência, retenção e granularidade das evidências ainda exigem futura Spec.
- Workload aparece como filtro de leitura do Histórico — decisão do usuário, 2026-08-24.

## Verificação de coerência

- Cada tela declara faixas, grids, `gap`, spans, ordem e adaptação móvel.
- Tabelas, donuts, linhas, barras e detalhes descrevem anatomia, séries/legendas, eixos e estado.
- Nenhum valor visual de exemplo foi tratado como dado do tenant.
