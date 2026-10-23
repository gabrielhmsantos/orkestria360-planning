# Histórico e Auditoria — Contrato semântico inicial

## Shape e semântica

- **Política default aprovada:** eventos normalizados e JSON sanitizado são consultáveis por 90 dias pelo instante do evento. O snapshot D30 e os recortes D1/D7/D30/D90 preservam sua semântica; história anterior à coleta ou com lacunas fica parcial/sem publicação. O JSON expira junto com o evento; rollups mensais duram 13 meses e não reconstituem detalhes expirados.
- **Risco default-v1:** aplicar a [matriz e os limiares aprovados](../backend-defaults-e-clarificacoes.md#pacote-comum-de-classificação-default-v1). A maior severidade satisfeita prevalece; sem contexto obrigatório, risco é nulo/não classificado e a distribuição declara população avaliada. Informativo descreve evento de rotina avaliado, sem afirmar segurança global. Detectores em massa referenciam eventos de origem e não aumentam artificialmente o total de eventos. Desempate por instante decrescente e ID estável; comparações exigem versão de regra compatível.
- **Residual R2:** acesso/visualização, criação/edição comum e sincronização canônicos, com sucesso explícito e contexto avaliado, podem ser Baixo quando nenhuma regra superior se aplica. Rotina conhecida com resultado não publicado pode ser Informativo, sem afirmar sucesso. Administração, exclusão, compartilhamento novo, operação desconhecida ou resultado falho não recebem Baixo por esse residual; sem outra regra ou contexto obrigatório, manter nulo. Não usar snapshot corrente como prova do contexto de evento antigo. Distribuição usa classificados e coverage do universo; população>0 sem classificados é não avaliável. A revisão de regras integra a comparabilidade histórica. *(Usuário, R2, 2026-10-14.)*

- `auditSummary`: métricas opcionais de eventos, pessoas, itens afetados, compartilhamentos, links, downloads, exclusões e acessos externos no snapshot padrão fixo de 30 dias. Cada métrica publicada usa `{ value, comparison? }`; a comparação informa `previousValue` e `periodDays` para a janela anterior de mesma duração. Ela aparece acima dos filtros e não muda com eles. Valor zero permanece factual; métrica ou comparação não publicada não vira zero.
- `auditSummary.linkCount` é o KPI “Links Anônimos Criados”: quantidade de eventos admitidos de criação de link anônimo na janela UTC D30 publicada, com cada identidade de evento contada uma vez. Criação de link organizacional ou para pessoas específicas, uso, atualização e remoção não incrementam esse KPI. A unidade é eventos registrados de criação anônima, sem afirmar links únicos atualmente ativos, aceitação de convite ou sucesso não publicado. Comparação usa o mesmo predicado na janela anterior; zero exige cobertura íntegra da janela e da operação.
- `events`: coleção paginada e ordenada por momento de `auditEvent`, com categoria, operação, usuário executor (`actor`), referência da conta (`accountContext`), proprietário (`owner`) resolvido para o nome de exibição da conta relacionada, item/caminho, IP, localidade geográfica, dispositivo, resultado, risco e referências de investigação. `items/page/pageSize/total` descrevem a página visível; uma fixture local pode publicar `inventory` completo para filtros e análises locais sem mudar a paginação nem o contrato de fonte real. Proprietário e usuário executor são campos distintos. IP e localidade são atributos distintos do caminho do arquivo. A coleção publica `window.startInclusive` e `window.endExclusive` em UTC para o recorte local: o intervalo é `[startInclusive, endExclusive)`.
- `filterCatalog`: opções de período, categorias, operações, resultados, níveis de risco, dispositivos e pares completos `{ ipAddress, ipLocation }`. Categorias, operações, resultados e níveis de risco usam `{ value, label }`: `value` corresponde ao campo do evento e `label` fornece o texto em português para a interface, definido no catálogo da fixture. `riskLevels` fornece rótulos ao gráfico e à tabela; não adiciona um filtro de risco. Pares incompletos não são opções selecionáveis. O campo Usuário é uma busca textual livre sobre os atores publicados, com correspondência parcial sem distinção entre maiúsculas/minúsculas ou acentos; não depende de uma lista fechada de pessoas.
- `eventDetail`: extensão opcional de evento com atributos ordenados de operação, proprietário, usuário executor, arquivo, caminho, IP, localização, dispositivo, user agent, destinatário externo, permissão, antes/depois, correlation ID, origem, JSON e ação recomendada. Cada atributo é anulável quando não publicado; os atributos enumerados são conteúdo aprovado para o detalhe da superfície.
- `categoryDistribution`, `eventTrend`, `riskDistribution`, `topActors`, `criticalActivities` e `sourceCoverage`: análises por intervalo e disponibilidade independente. Elas ficam abaixo dos filtros e usam o recorte selecionado entre Últimas 24h, Últimos 7 dias, Últimos 30 dias (padrão) e Últimos 90 dias, preservando a janela fixa24h de `criticalActivities` definida abaixo. As distribuições mantêm os códigos dos eventos e resolvem seus rótulos pelo `filterCatalog`; o gráfico D30 tem um ponto para cada dia publicado. Com inventário e cobertura completos, os recortes filtrados preservam os pontos diários sem correspondência com contagem zero; cobertura parcial não autoriza inferir esses zeros. `topActors` é uma lista compacta ordenada de ator e total de eventos dentro de `OperationalSectionCard`, com cinco linhas visíveis e sem expansão ou navegação.
- `auditSources`: estado de configuração publicado separadamente da cobertura de coleta. Cada fonte tem `id`, `label`, `icon` e `status: { value, label }`; o catálogo da fixture fornece os nomes e os rótulos “Ativo”/“Desativado”. Filtros de eventos não alteram esse bloco nem sua disponibilidade. `sourceCoverage` continua descrevendo cobertura/estado da publicação e não é usado para inferir status de ativação.
- A classificação Orkestria agrupa as atividades do catálogo aprovado em Acesso a arquivo, Compartilhamento, Modificação, Sincronização, Exclusão, Administração e Outros. Os sete rótulos vêm de `filterCatalog.categories`; os cinco níveis Crítico, Alto, Médio, Baixo e Informativo vêm de `filterCatalog.riskLevels`.
- Mapeamento das operações: `FileAccessed`, `FileViewed`, `FileDownloaded`, `GuestAccessed` e `BulkDownload` → Acesso a arquivo; `SharingSet`, `AnonymousLinkCreated`, `AnonymousLinkRemoved` e `PermissionChanged` → Compartilhamento; `FileCreated`, `FileModified`, `FileMoved`, `FileRenamed`, `FileRestored` e `FolderCreated` → Modificação; `Synchronization` → Sincronização; `FileDeleted` e `BulkDeletion` → Exclusão; `AdminOneDriveAccessed`, `OwnershipTransferred` e `RetentionChanged` → Administração; `MalwareDetected` e `OtherAuditActivity` → Outros.
- A fixture global `populated` publica 150 eventos no D30, em 30 datas com volume diário variável, `pageSize: 10` e 15 páginas locais; `auditSummary`, distribuições, evolução, ranking e atividades críticas são projeções da mesma coleção completa.

## Seleção de Atividades Críticas — C9 aceita A

- `criticalActivities` publica uma lista base de zero a cinco eventos canônicos
  únicos por `id`, com risco comprovado `critical` ou `high` e instante em
  `[T-24h,T)`. T é o fim exclusivoUTC factual publicado em `events.window`,
  não o relógio da tela. Médio, Baixo, Informativo e não classificado não
  entram. Título “Atividades Críticas (Últimas24h)”, contexto “Eventos de risco
  Alto ou Crítico”. A seleção é decisão expressa, não inferência da fixture.
- Selecionar sobre o inventário completo da janela publicada, antes da
  paginação da tabela. Ordenar Crítico antes de Alto; dentro de cada nível,
  instante decrescente, depois ID estável ascendente no empate. Aplicar limite
  cinco depois dessa ordenação; não completar linhas ausentes.
- A lista referencia os mesmos IDs e fatos de `events`. Detector local em
  massa pode qualificar o risco dos seus eventos comprovados; não vira nova
  linha de provider nem multiplica eventos por quantidade de regras satisfeitas.
  O maior risco comprovado de cada evento continua definido pelo classificador.
- Preservar os filtros aprovados: intersectar os IDs dessa lista base com o
  inventário completo filtrado, mantendo a ordem e sem substituir os removidos
  por outros IDs não publicados. A lista pode ficar menor ou vazia mesmo
  existindo outros eventos fora dos cinco selecionados. Vazio após filtro não
  afirma inexistência de incidente no tenant; descreve somente esse recorte.
- `criticalActivitiesMetadata` publica janelaUTC, referência, revisão de risco,
  critério de níveis, limite5, quantidade observada/avaliada/desconhecida quando
  conhecidas e disponibilidade/cobertura próprias. Fonte, instante, identidade
  ou risco obrigatório não avaliados preservam parcial/desconhecido. Lista
  vazia factual exige avaliação íntegra do universo declarado; não preencher
  com rotina nem inferir ausência global com gaps de ingestão/classificação.
- A mudança não altera `auditSummary`, gráficos, contagem de eventos ou
  configuração de `auditSources`. Os itens históricos da fixture não são
  reinterpretados; a integração deve materializar a seleção/metadata aceitas.
  *(Usuário, C9 aceita A, 2026-10-15.)*

## Comportamento observável

- A barra segue a ordem Período, Tipo de Evento, Usuário, Ação, Localização (IP), Dispositivo, Resultado e Limpar filtros. Em `2xl` os oito controles ficam na mesma linha; em `xl`, quatro colunas; em `md`, duas; abaixo de `md`, uma.
- Filtros por período, tipo, busca de usuário, ação, par IP/localidade, dispositivo e resultado atualizam as distribuições por categoria/risco, a série de eventos, o ranking, a tabela e a lista de atividades críticas posicionados após a barra. A cobertura publicada acompanha o recorte; as atividades críticas intersectam seus IDs com a coleção completa filtrada. Filtros e análises usam `inventory` quando a fixture o publica, e nunca se limitam a `items` da página visível. A tabela exibe 10 itens por página; paginação e ordenação preservam o recorte. KPIs anteriores permanecem no snapshot padrão D30 e `auditSources` não é alterado pelos filtros. Limpar filtros restaura o período padrão, limpa a busca e os demais seletores, volta à primeira página e fecha o detalhe.
- Rótulos visíveis de categoria, operação, resultado e risco em gráficos, tabela e atividades críticas são resolvidos pelos catálogos publicados; os códigos permanecem nos eventos e são usados pelos filtros. A série de eventos e o ranking usam todo o inventário filtrado, nunca apenas a página atual da tabela.
- O ranking mostra até cinco usuários em linhas sem ícone à esquerda, com ator à esquerda e contagem à direita. Não oferece expansão nem navegação para uma página de usuários.
- A tabela usa exatamente as colunas Data/Hora, Evento, Ação, Arquivo / pasta, Proprietário, Usuário, IP / Localização, Dispositivo, Resultado e Nível de Risco. Evento, ação, resultado e risco exibem rótulos dos catálogos; risco e status usam badges. Proprietário vem do nome da conta relacionada a `accountContext`; Usuário vem de `actor`. IP e localidade aparecem juntos nessa coluna. O detalhe mantém IP e localização como atributos separados e não substitui valores ausentes.
- A faixa de conteúdo coloca a tabela em 9/12 e a coluna lateral em 3/12 a partir de `lg`; Atividades Críticas e Fontes de Auditoria empilham-se na lateral e acompanham a altura da tabela. Em larguras menores, a coluna lateral fica abaixo da tabela e a tabela conserva rolagem horizontal. Atividades Críticas mostra cinco linhas com marcador de risco, atividade e horário relativo (“Hoje HH:mm”/“Ontem HH:mm”), ancorado na janela UTC publicada. Fontes de Auditoria mostra ícone, nome e badge de estado configurado; não exibe motivo nem cobertura de coleta.
- A região de eventos não exibe resumo padrão de quantidade/cobertura. Com filtros ativos, anuncia somente quantidade e período; avisos reais de disponibilidade continuam apresentados pelo estado correspondente.
- Selecionar evento abre detalhe contextual com retorno à mesma lista. Tabelas largas usam rolagem horizontal, nunca segundo canvas vertical.
- `partial` descreve cobertura publicada; ausência de evento, IP, dispositivo ou localização não é inferida como resultado seguro.

## State Matrix

| Cenário | Runtime state | Dados permitidos | Resultado observável |
| --- | --- | --- | --- |
| Consulta disponível | available | eventos paginados e análises | filtros e investigação habilitados |
| Cobertura parcial | partial | eventos e fonte/categoria coberta | estado parcial e motivo apresentados no painel de disponibilidade |
| Sem resultados | available | coleção vazia no recorte | estado vazio factual |
| Consulta restrita | restricted | nenhum evento substituto | painel de restrição |
