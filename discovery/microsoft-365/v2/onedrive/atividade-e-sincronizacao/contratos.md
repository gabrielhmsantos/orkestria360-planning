# Atividade e Sincronização — Contrato semântico inicial

## Shape e semântica

- `activityPeriod`: filtro selecionável `D7`, `D30`, `D90` ou `D180`, com padrão `D30`; aplica-se a KPIs, atividade de usuários e análise por departamento.
- `activitySummary`: contagens do `activityPeriod` para pessoas ativas, itens acessados/editados/compartilhados e sincronizações, todas opcionais e datadas.
- `activityTrend` e `departmentActivity`: séries ordenadas de atividade por data/categoria, com métricas identificadas e unidade, no `activityPeriod` selecionado.
- `accessedItems` e `editedItems` contam arquivos distintos com a respectiva atividade observada, em uma janela UTC publicada com fim exclusivo. O mesmo arquivo pode ter acesso e edição. Repetições por pessoa/dia não aumentam o total global; por departamento, cada arquivo conta uma vez no grupo dos atores, conforme a referência de identidade publicada. Um arquivo pode aparecer em vários departamentos, portanto a soma dos grupos não é o total global. Ator, arquivo ou departamento não resolvidos reduzem a cobertura; não são atribuídos ao proprietário do arquivo. Janela incompleta não comprova zero. Edição abrange conteúdo ou propriedades; atividade observada não afirma resultado bem-sucedido quando o resultado não foi publicado.
- `syncTrendPeriod`: janela fixa dos últimos12meses; `syncTrend` mantém12posições mensais, independente de `activityPeriod`. A série azul publica `syncedDevices` (inteiro não negativo ou nulo): clientes OneDrive distintos observados na última fotografia íntegra do mês que reportaram estado atualizado em `(T-30dias,T]`, com T como referência daquela fotografia. Legenda Dispositivos sincronizados, contexto de clientes observados/estado atualizado reportado. Não é contagem de arquivos, transferências, pessoas ou inventário físico completo. A série vermelha publica `reportedErrors` (inteiro não negativo ou nulo): soma da recorrência dos pares dispositivo/tipo deduplicados da última fotografia Errors íntegra do mês, com legenda “Erros reportados nos30dias até a data do snapshot”. Cada série publica referência, cobertura e disponibilidade próprias. Não equivale a ocorrências exclusivas do mês e não pode ser somada entre meses como total anual. Campos/valores da fixture histórica não são reinterpretados como essas novas medidas.
- `devices`: coleção de clientes OneDrive observados, com identificador, pessoa opcional, plataforma, versão, KFM, último instante de estado atualizado reportado e referência da fotografia diária. `clientHealthState` é `errorReported`, `upToDateReported`, `notRecentlyUpdatedReported` ou nulo: Erro reportado tem precedência; sem erros reportados, distinguir atualização reportada em `(T-30dias,T]` da anterior/igual a `T-30dias`, com T factual da fotografia. Datas/contadores necessários ausentes ou inválidos mantêm Não avaliado. Não representa Pausado, Sincronizando ou Não configurado. Tipo físico desconhecido não é inferido de plataforma/nome. *(C2 aceita A; usuário, 2026-10-14.)*
- `managedDevices`: inventário independente de dispositivos gerenciados, com identidade, pessoa opcional, plataforma, gerenciamento, conformidade, risco e última sincronização de gerenciamento. Não é enriquecimento de uma linha de cliente OneDrive; nomes ou pessoas iguais não juntam os registros. As duas coleções mantêm referências e cobertura próprias, sem somar suas quantidades como dispositivos físicos únicos.
- `syncErrors`: coleção por dispositivo com código, título, descrição localizada e recorrência do erro; cada registro se associa a `devices` pelo identificador do cliente OneDrive. A ausência de registro não substitui a publicação do snapshot de saúde.
- `syncDistribution`: distribuição exclusiva de clientes pela saúde diária reportada acima; denominador = clientes classificados, com elegíveis/avaliados/desconhecidos explícitos. Zero exige avaliação íntegra; população sem classificados não vira composição com zeros. Contagens inteiras, participação `100×quantidade/denominador` com duas casas, half-up, sem divisão por zero ou ajuste artificial de soma arredondada. A legenda identifica saúde reportada e data, sem status instantâneo. Os cinco códigos da fixture histórica não são reinterpretados.
- `kfmSummary`: contagem de clientes observados com ao menos uma pasta conhecida protegida, entre clientes com conjunto de pastas avaliado; por pasta, publicar clientes com aquela pasta protegida e seu universo elegível/avaliado. Não é contagem de pessoas nem prova de que as três pastas estejam protegidas. O score conserva o critério separado das três pastas nos clientes elegíveis. `inactiveUsers`, `benefits` e `alerts` mantêm regras e disponibilidade independentes.

### Arquivos com atividade de compartilhamento — C6 aceita A

- `activitySummary.sharedItems` é inteiro não negativo ou nulo, com unidade
  `file` e rótulo “Arquivos com atividade de compartilhamento”. Conta arquivos
  distintos com atividade qualificante registrada na janela UTC publicada
  `[T-Ndias,T)`, para N=7/30/90/180. T é o fim exclusivo da última data UTC
  integralmente publicada. O mesmo arquivo conta uma vez entre públicos,
  atores e dias; não somar contagens internas/externas, por pessoa ou por dia.
- Atividade qualificante abrange compartilhamento direto registrado, criação
  de link anônimo/organizacional/específico, inclusão de destinatário em link
  específico e convite comprovadamente dirigido ao arquivo. Link sem uso ou
  convite sem aceite podem contar. Uso, aceite isolado, revogação, atualização
  e alteração genérica de permissão não iniciam uma presença. Falha ou
  resultado parcial explícitos ficam fora; resultado ausente/não normalizado
  permanece desconhecido e pode contar como atividade, sem afirmar sucesso,
  concessão efetiva ou exposição vigente.
- O universo é o mesmo de atores humanos internos identificados das medidas
  de acesso/edição. Exigir identidade histórica inequívoca e tipo de arquivo
  comprovado. Pastas/sites não contam nem se expandem para seus arquivos.
  Aplicação, sistema, convidado, anônimo ou ator não resolvido não viram o
  proprietário do espaço. O arquivo pode ter sido excluído ou deixado de ser
  compartilhado depois do evento; sua atividade histórica continua válida.
- Por pessoa, um arquivo conta uma vez naquela pessoa e janela. Por
  departamento, conta uma vez no grupo dos atores pela referência de identidade
  publicada. Grupos podem se sobrepor; departamento desconhecido não reduz o
  total global já sustentado, mas reduz a cobertura daquele agrupamento.
- `activitySummary.sharedItemsMetadata` acompanha exclusivamente essa medida:

| Campo semântico | Tipo e regra |
| --- | --- |
| `unit`, `period`, `ruleVersion` | `file`, D7/D30/D90/D180 correspondente ao filtro e revisão `sharing-activity-v1`. |
| `window` | `{ startInclusive, endExclusive, timezone: UTC }`, limites UTC e duração N dias; nulo antes de existir referência factual. |
| `asOf` | Instante UTC de referência T, igual a `window.endExclusive`, ou nulo sem publicação. Não é o horário do browser/download. |
| `identityReference` | Referência opaca da identidade usada para admitir atores e agrupar departamentos; nula quando ainda não publicada. |
| `unknownResultFileCount` | Inteiro entre zero e `sharedItems`, ou nulo sem contagem publicada. Cardinalidade dos arquivos observados com ao menos uma atividade qualificante de resultado desconhecido; o arquivo conta uma vez mesmo se também houver atividade com sucesso explícito. Não é contagem de eventos, de tentativas ou de arquivos sem identidade. |
| `coverage` | `{ requiredDays, coveredDays, ingestionComplete, fileIdentityComplete, actorIdentityComplete, itemTypeComplete, complete, observedFileCount, totalFileCount, unknownFileCount, reason }`, conforme regras abaixo. |
| `availability` | Estado e motivo/frescor próprios da publicação; conserva os estados de disponibilidade já aprovados, independentemente dos demais KPIs. |

- `requiredDays=N`; `coveredDays` é inteiro entre zero e N ou nulo sem ledger.
  Os quatro indicadores de completude específicos e `complete` são booleanos
  ou nulos quando ainda não avaliados. `complete=true` exige ingestão íntegra
  de todos os dias e avaliação resolvida de tipo, arquivo e ator dos eventos
  potencialmente qualificantes no universo declarado; lacuna conhecida dá
  false, ausência de avaliação dá nulo. Isso descreve a publicação observada,
  sem garantir que o serviço já publicou toda ação física ocorrida.
- `observedFileCount` é igual a `sharedItems` quando publicado, inclusive
  subtotal positivo parcial. `totalFileCount` só recebe essa quantidade quando
  `complete=true`; fora disso permanece nulo. `unknownFileCount=0` somente com
  avaliação íntegra; identidade/tipo/ator não resolvidos ou dias ausentes deixam
  a quantidade global desconhecida, nula, sem converter eventos em arquivos
  faltantes ou subtrair subtotal de um denominador inventado. `reason` explica
  a lacuna quando existente. Resultado desconhecido admitido não torna a
  cobertura de atividade incompleta por si só; seu conjunto é contado acima.
- Zero exige janela íntegra e ausência comprovada de qualificantes. Se nenhum
  arquivo puder ser contado e a janela for parcial, `sharedItems` permanece
  nulo; antes da primeira publicação é `not_yet_published`. Falha conserva a
  última publicação válida, sua janela e frescor, sem avançar T. Não reconstruir
  passado anterior à coleta nem trocar uma janela parcial por D30 de outro dia.
- Somente D30 pode publicar `activitySummary.comparison.sharedItems`, com
  valor atual igual a `sharedItems`, `comparison.previousValue` factual de
  `[T-60dias,T-30dias)` e `comparison.periodDays:30`. Exigir ambas as janelas
  íntegras, mesma unidade/revisão, critérios de escopo e identidade compatíveis;
  sem baseline, omitir comparação. D7/D90/D180 não recebem comparação nova.
- A medida preserva C1/estoque atual, risco, outros KPIs e a retenção aprovada.
  A fixture histórica não comprova seus valores nem ganha novo significado
  automaticamente. *(Clarificação C6: opção A aceita pelo usuário em
  2026-10-15; [pacote aceito](../backend-defaults-e-clarificacoes.md#c6--significado-de-arquivos-compartilhados-aceita-a).)*

### Arquivos sincronizados reportados

- `activitySummary.syncOperations` conserva o binding histórico do KPI
  “Arquivos Sincronizados”, com inteiro não negativo ou nulo. Representa a soma
  das contagens reportadas por pessoa no período selecionado, uma contribuição
  por identidade factual e publicação. Seu contexto explicita “Contagens de
  arquivos sincronizados reportadas por usuário”; não é quantidade de arquivos
  globalmente distintos, tentativas, transferências ou clientes físicos.
- Usar somente o mesmo período D7/D30/D90/D180 e referência da publicação;
  replay/duplicata da mesma contribuição não aumenta o total. Identidade,
  contagem ou período não resolvidos reduzem a cobertura, sem contribuição
  fictícia zero. Subtotal observado em cobertura parcial é identificado como
  tal; total completo e zero exigem universo avaliado íntegro. Referência,
  cobertura e disponibilidade são próprios; comparação só com publicação
  factual anterior do mesmo recorte e semântica. A série mensal R3 continua
  independente e os valores sintéticos históricos não comprovam essa soma.

### Usuários sem atividade — atividade da pessoa GA4

- `inactiveUsers` contém pessoas licenciadas da população canônica com
  OneDrive comprovadamente relacionado e última atividade factual da própria
  pessoa anterior à referência publicada menos 90 dias. Uma identidade conta
  uma vez; `activityPeriod` não altera esse recorte independente.
- `lastActivityAt` expressa atividade da pessoa, inclusive em espaços de
  terceiros. A última atividade do espaço que ela possui pode ter sido gerada
  por outra pessoa e não substitui esse fato. `daysInactive` é a diferença
  entre as datas UTC factuais, em dias completos; exatamente 90 dias não
  qualifica. Preservar a precisão de data, sem inventar horário.
- Data ausente, futura/inválida, linha não publicada, licença desconhecida ou
  identidade ambígua mantém avaliação desconhecida. Ausência de observação
  não prova inatividade: `lastActivityAt: null` nunca sustenta `daysInactive: 91`.
- Publicar referência, população elegível, observados/avaliados/desconhecidos,
  cobertura e disponibilidade próprios. Vazio completo exige avaliação íntegra
  sem pessoas qualificantes; cobertura parcial não afirma ausência de outras
  pessoas inativas. Falha conserva a última publicação válida com frescor.

### Principais Benefícios — C3/C4 aceitas

- `benefitMetrics` organiza métricas independentes. Cada entrada publica
  `{ value, unit, asOf, coverage, availability }`; valor ou referência não
  publicados permanecem nulos e availability mantém a causa/frescor conhecidos.
- `benefitMetrics.storageUsedBytes` publica `value` inteiro não negativo ou nulo
  e `unit: byte`, com referência, cobertura e disponibilidade próprias. O rótulo
  é “Armazenamento utilizado no OneDrive”: ocupação do snapshot global já
  publicado em Contas e Armazenamento, com exatamente o mesmo universo e valor,
  inclusive versões/lixeira quando contabilizadas por essa medida. Não é soma
  dos tamanhos dos arquivos atuais nem volume comprovado de backup/proteção.
- O filtro de atividade, departamento, pessoa, dispositivo ou sua paginação não
  recalcula essa métrica global. A medida não recebe comparação histórica nova.
  Ausência/restrição/falha permanece sem valor ou com a última publicação válida
  e seu frescor; zero exige avaliação íntegra comprovando zero. A quantidade em
  bytes não é arredondada; a apresentação usa o formatador de armazenamento do
  módulo. Referência de data não recebe precisão temporal inexistente na origem.
- Esse binding substitui expressamente a semântica histórica de
  `benefitItems[id=protected-data]`, sem reutilizar seu número sintético ou
  afirmar proteção por KFM/sincronização. Esta decisão não altera KFM, C2/R3 ou pesos.
  *(Usuário, C3 aceita A, 2026-10-14.)*
- `benefitMetrics.protectedFolderClients` publica `value` inteiro não negativo
  ou nulo, `unit: client` e os metadados do mesmo agregado KFM que o sustenta.
  Reutiliza exatamente `kfmSummary.applied`: clientes observados com ao menos
  uma pasta conhecida protegida, sem somar pastas ou pessoas. O rótulo
  “Dispositivos com pastas protegidas” tem contexto explícito de clientes
  OneDrive observados; não é inventário físico completo nem o critério das três
  pastas do score. Ausência não produz contagem zero.
- `benefitMetrics.recentHealthyClientsPercent` publica `unit: percent` e
  `value = 100 × U / C`, em que U é a contagem de clientes no estado
  `upToDateReported` e C é a contagem de clientes classificados nos três estados
  C2, na última fotografia de saúde íntegra. Deduplicar por identidade factual
  de cliente, sem join ao inventário de gerenciamento. O rótulo é “Clientes com
  atualização recente e sem erro reportado”; não representa sucesso de
  transferências nem SLA. Zero erros e atualização reportada nos30dias seguem
  exatamente os predicados C2, com T como referência factual da fotografia.
- Calcular com precisão completa e publicar esse percentual com uma casa
  decimal, half-up, na faixa0a100. C=0 produz valor nulo/não avaliável.
  Desconhecidos ficam fora de C com eligible/observed/evaluated/unknown e
  cobertura explícitos; uma razão parcial é sobre os classificados, sem
  generalizar a todos os clientes/endpoints do tenant. Zero exige U=0 factual
  e C>0 com avaliação íntegra do universo declarado. Perfil/run inválido não é
  publicado; falha preserva última publicação válida e seu frescor. Não somar
  arquivos/erros como tentativas, nem alterar numerador/denominador pelos
  filtros D7/D30/D90/D180. *(Usuário, C4 aceita A, 2026-10-14.)*
- A ordem do card permanece volume de armazenamento, clientes com pastas
  protegidas e percentual de atualização recente sem erro. Cada medida tem
  fonte/referência/cobertura próprias, sem comparação histórica nova. Os
  `benefitItems`/`benefits` da fixture mantêm seu papel histórico; a integração
  usa as novas medidas com seus rótulos aprovados.

## Comportamento observável

- O filtro de período altera atividade e departamento; a evolução de sincronização permanece nos últimos 12 meses. Os demais filtros alteram o recorte compatível sem afirmar cobertura total quando ela não estiver publicada.
- Detalhe de dispositivo ou pessoa mantém-se no fluxo da tela; status ausente é apresentado como não publicado, não como conforme.
- `partial` preserva métricas disponíveis e identifica blocos cuja cobertura não é conhecida.
- Na série de erros, mês sem fotografia íntegra fica sem valor; zero exige fotografia completa comprovando zero. Um mês com parte das datas observadas declara cobertura parcial e a data da fotografia. Detalhes de erro continuam exigindo código, título, descrição e recorrência da fonte publicada; `TotalErrorCount` do Health não substitui silenciosamente o dataset Errors. *(Clarificação 3, usuário, 2026-10-14.)*
- Na série de dispositivos, ausência de fotografia/identidade/data obrigatória não vira zero. Deduplicar por identidade factual do cliente, sem unir por nome; data ou identidade desconhecida declara cobertura incompleta. Health e Errors são independentes: falha de um preserva publicação válida do outro. O KPI de arquivos sincronizados segue sua unidade/recorte próprio e não alimenta essa série de dispositivos. *(R3, usuário, 2026-10-14.)*
