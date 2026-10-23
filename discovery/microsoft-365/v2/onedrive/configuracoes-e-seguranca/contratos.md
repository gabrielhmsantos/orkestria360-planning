# Configurações e Segurança — Contrato semântico inicial

## Shape e semântica

- `securityScore`: nota de postura de `0` a `100`, calculada com todos os pesos fixos como `Σ(peso × pontuaçãoDaCategoria / 100)`. Cada categoria publica `id`, `label`, `peso`, `pontuação` de `0` a `100`, `availability`, `asOf` e evidência. Categoria sem coleta recebe pontuação `0` no respectivo peso e continua explicitamente indisponível; não é removida do denominador nem recebe postura inferida. A comparação pode publicar `previousValue` e `periodDays`; a UI apresenta D30 em pontos quando o baseline existe.
- `riskSummary`: quatro entradas ordenadas `critical`, `high`, `medium`, `low`, cada qual com `value` inteiro não negativo ou nulo e comparação opcional `{ previousValue, periodDays: 30 }`. Unidade = arquivos atuais únicos; contexto visível “Arquivos atuais por nível de risco”. Um arquivo entra uma vez, no maior risco comprovado pelo default-v1/R2. O universo é o inventário global Q5 de arquivos locais existentes, excluindo pastas, excluídos/tombstones, versões, cópias de preservação e duplicações remotas. Não conta permissões ou eventos como arquivos adicionais. Informativo e não classificado ficam fora das quatro linhas e são explicitados na cobertura. Contagem não conhecida permanece nula; nenhuma linha ausente é completada com zero. *(C5 aceita A; usuário, 2026-10-14.)*
- `policies`: objeto com `groups[]`; cada grupo publica `id`, `title`, `availability` e `items[]`. São quatro grupos canônicos, cada um com cinco configurações. Cada item publica `id`, `label`, `currentValue`, `recommendedValue`, `evaluation` (`aligned`, `divergent` ou `not_evaluable`) e `availability`. Valores atuais e recomendados são texto ou `null`; a avaliação é alinhada/divergente somente quando ambos existem, correspondem ao resultado publicado e o item está disponível. Indisponibilidade, restrição, falha, dado parcial ou desatualizado sem evidência avaliável não pode virar sucesso nem divergência. O contrato não expõe detalhes técnicos internos nem destino de investigação.
- `dataProtection`, `sensitivity`, `threats`, `retention` e `complianceDomains`: agregados de postura e achados, cada qual com atualização e disponibilidade próprias. `dataProtection` publica somente achados cujo `serviceSource` seja `dataLossPrevention` e cuja evidência de URL seja explicitamente OneDrive/SharePoint do tenant; não declara cobertura, configuração ou conformidade de política DLP. A URL é validada na fronteira de projeção e nunca integra o contrato de UI; a tela recebe somente a evidência resumida e sanitizada. `sensitivity` e `retention` podem publicar o catálogo/configuração de política do tenant. Para retenção por arquivo, `itemRetentionLabel` publica nome, data, origem e configurações somente se forem retornados; resposta sem tais campos não é “sem retenção”. `complianceDomains` pode publicar somente a cobertura de dispositivos Intune observada, sem generalizar para o tenant. A faixa visual “Conformidade Global do OneDrive” é uma composição de apresentação separada, vinculada a `securityScore.categories`; ela não transforma essas dimensões em fatos publicados por `complianceDomains` nem em certificação de conformidade. `threats` inclui somente alertas com evidência explícita de URL em host SharePoint/OneDrive pertencente ao tenant; título, produto, severidade ou texto do alerta não bastam para inferir esse vínculo.
- `dlpPolicyDistribution`, `sensitivityDistribution`, `defenderIntegration` e `retentionGovernance` são blocos independentes e cada um tem disponibilidade própria. Os valores adicionados à fixture de desenvolvimento são sintéticos para composição visual, não fatos do tenant nem publicação de produção. Distribuição de status DLP não equivale a achados DLP: o DOCX descreve prevenção de exposição de dados sensíveis via Purview, mas não estabelece contagem/status de políticas. `sensitivityDistribution.evaluatedFileCount` inclui somente arquivos avaliados; excluídos ficam fora e “Sem rótulo” representa avaliação concluída sem rótulo, nunca indisponibilidade. `defenderIntegration` distingue estado de controles de ameaças detectadas e arquivos explicitamente em quarentena; ausência de alertas não prova zero em quarentena. `retentionGovernance` publica políticas, quantidade e volume dos arquivos atuais comprovadamente sob retenção, usuários alcançados e vencimentos com referência, cobertura e disponibilidade próprias. Não deriva expiração de exclusões programadas de usuários.
- A fixture global `populated` mantém a população canônica de 12 contas, cujos agregados publicados somam 636 arquivos (497 ativos) e 837.518.622.720 bytes usados. Esses valores prevalecem sobre a amostra de 12 registros da página de conteúdo e sobre grandezas de referência visual. A distribuição sintética de sensibilidade cobre os 497 arquivos ativos avaliados (`203 + 153 + 90 + 36 + 15`); esses números são exclusivos da fixture visual e não alteram os itens da página nem os resumos de outras superfícies.
- `recommendations`: itens de orientação com prioridade, evidência resumida e destino de investigação; não contém comando mutável.
- `OperationalClassificationCard` apresenta, em um único card, uma lista dinâmica originada de `securityScore.categories`. Cada item recebe rótulo, ícone, percentual e classificação já resolvidos pelo consumidor; o componente não agrega notas, não decide faixas e não substitui `complianceDomains`, que segue restrito à cobertura observada de dispositivos Intune.

## Alertas criados em30dias — C7 aceita A

- `defenderIntegration.reportedAlerts30d` publica uma medida independente
  `{ value, unit: alert, window: { startInclusive, endExclusive }, asOf,
  coverage, availability }`. `value` é inteiro não negativo ou nulo. Rótulo:
  “Alertas de segurança criados (30 dias)”, com contexto de alertas observados.
  A unidade é registro de alerta, sem equivalência a arquivos, incidentes,
  famílias de malware ou ameaças confirmadas.
- Contar uma vez cada identidade factual de alerta admitido com instante de
  criação em `[T-30dias,T)`, sendo T a referênciaUTC da publicação avaliada.
  Vários alertas sobre o mesmo arquivo/incidente contam separadamente;
  múltiplas evidências ou atualizações do mesmo alerta não aumentam a contagem.
  A janela usa criação do alerta, sem substituição pelo início/fim da atividade,
  atualização, coleta ou resolução.
- Preservar o escopo já aprovado: evidência explícita OneDrive/SharePoint do
  tenant. Todos os status/classificações entram, incluindo não classificados,
  falsos positivos, atividade esperada e resolvidos. A classificação não é
  inferida da severidade/título. Não afirmar que o alerta confirme malware,
  atividade recente no arquivo, acesso vigente ou ameaça ainda ativa.
- Publicar somente registros admitidos na geração corrente, com cobertura do
  universo observado. Identidade, relógio ou evidência obrigatórios ausentes ou
  inválidos reduzem cobertura; não preencher outro timestamp nem fabricar ID.
  Classificação/status ausentes não invalidam esta contagem que inclui todos.
  Valor positivo parcial é subtotal observado; zero exige avaliação íntegra
  desse universo e não comprova ausência de ameaças no tenant. Universo global
  ou quantidade desconhecidos permanecem nulos na cobertura.
- Falha/paginação incompleta preserva estado próprio ou última publicação
  válida com seu frescor. Essa medida não ganha comparação histórica nova,
  não depende dos três controles nem da quarentena e não muda os scores.
  O campo/valor histórico `detectedThreats30d` não é reinterpretado; a integração
  usa o novo binding e rótulo aprovados. *(Usuário, C7 aceita A, 2026-10-15.)*

## Arquivos com fim nominal de retenção — C8 aceita A

- `retentionGovernance.filesWithNominalRetentionEnd15d` publica uma medida
  independente `{ value, unit: file, window: { startDateInclusive,
  endDateInclusive }, referenceDate, asOf, coverage, availability,
  ruleRevision }`. `value` é inteiro não negativo ou nulo; `unit` é sempre
  `file`. Rótulo: “Arquivos com fim nominal de retenção (15 dias)”. O binding
  histórico `expiringWithin15Days` não recebe esse significado por renomeação
  ou reaproveitamento de seu valor sintético.
- `referenceDate` é a data UTC factual D da avaliação, no formato `YYYY-MM-DD`.
  As duas datas de `window` têm o mesmo formato e são D e D+15 dias de
  calendário UTC, inclusive. Sem referência publicada, essas três datas e o
  valor ficam nulos; não usar o relógio do browser. `asOf` conserva a referência
  factual e a precisão publicada da avaliação, em ISO8601 (`date` ou
  `date-time` UTC), ou nulo; uma data não ganha horário fictício.
- O universo é de arquivos locais atuais únicos Q5 do escopo publicado,
  excluindo pastas, excluídos/tombstones, versões, cópias de preservação e
  duplicações remotas. Cada arquivo entra uma vez pelo fim nominal combinado
  finito de todas as preservações aplicáveis e resolvidas. A identidade do
  arquivo e a aplicação vigente de cada regra precisam estar comprovadas;
  replay, aplicações substituídas e revisões históricas não multiplicam arquivos.
- Resolver as datas finais com a duração, unidade, trigger e âncora factuais
  de cada regra e sua precedência. Entre preservações simultâneas vigentes,
  prevalece a data final mais tardia, sem escolher apenas a maior duração
  numérica. Contar quando `0 <= dataUTC(fimNominalCombinado) - D <= 15`, em
  dias de calendário UTC. Data vencida fica fora; regras terminando em 10 e
  400 dias deixam o arquivo fora, mesmo que uma aplicação individual vença
  antes. Arquivo com fim combinado comprovado em 10 dias conta uma vez,
  mesmo com várias aplicações; tamanho ausente não impede essa contagem.
- Retenção indefinida, hold/revisão de disposição pendente, cadeia de
  substituição, conflito, escopo ou âncora não resolvidos não confirmam fim
  nominal finito. Preservar o arquivo como não determinável na cobertura;
  ausência de campo ou de registro não comprova ausência de hold. Data de
  desligamento, prazo local do caso ou recomendação de duração não substituem
  esse fim combinado Microsoft. A medida não afirma liberação, fim efetivo
  de toda obrigação, exclusão programada/realizada ou capacidade recuperável.
- `coverage` publica `{ eligible, observed, evaluated, unknown, reasons }`:
  as quatro contagens são inteiros não negativos ou nulos quando não apuradas,
  e `reasons` identifica as limitações. `eligible` corresponde ao universo
  atual do escopo; `observed` aos arquivos únicos observados; `evaluated` aos
  arquivos com contexto suficiente para decidir a qualificação, incluindo
  não abrangidos comprovados; `unknown` aos elegíveis ainda não resolvidos.
  Se eligible e evaluated forem conhecidos, unknown é sua diferença; sem
  população elegível conhecida, unknown permanece nulo. `ruleRevision` é a
  revisão semântica publicada da avaliação, ou nulo sem avaliação admitida.
  Com contagens apuradas, preservar `value <= evaluated <= observed <= eligible`;
  incoerência invalida a publicação, sem ajuste silencioso dos números.
- Subtotal positivo parcial é identificado como quantidade observada; ausência
  de referência/avaliação suficiente mantém valor nulo. Zero global exige
  universo, vínculos e avaliação íntegros sem qualificantes nem desconhecidos.
  Cobertura parcial sem qualificante comprovado mantém valor nulo, sem zero.
  Falha/restrição preserva estado próprio ou última publicação válida com seu
  frescor. Não há percentual, arredondamento ou comparação histórica nova.
  A medida conserva disponibilidade independente das outras quatro linhas de
  Retenção e Governança, mantendo cinco métricas no card. *(Usuário, C8 aceita
  A, 2026-10-15.)*

## Comportamento observável

- **Resumo de Riscos C5:** publicar `riskSummaryMetadata` com unidade `file`,
  referência, revisão de classificação, escopo e cobertura de arquivos
  elegíveis/observados/classificados/informativos/desconhecidos. Quantidade
  elegível/desconhecida não apurada permanece nula; o universo observado não é
  automaticamente o tenant inteiro. Fonte/cobertura indisponível mantém seu
  estado e última publicação válida com frescor, sem quatro zeros. Contagem
  positiva parcial é quantidade observada no escopo coberto; zero global exige
  avaliação íntegra. Filtros e paginação de outras abas não recalculam esse
  resumo global. Valores são contagens de estoque atual, sem janela de eventos.
- A comparação C5 usa o último snapshot íntegro cuja dataUTC de referência seja
  exatamente a data do atual menos30dias. Os dois snapshots exigem cobertura
  íntegra, mesma revisão de classificação e mesmos critérios de escopo. Mudança
  natural de arquivos integra a variação; não exigir as mesmas identidades nos
  dois snapshots. Sem baseline ou comparabilidade, omitir `comparison`; não
  interpolar, repetir o atual ou usar eventos como baseline. Quando publicável,
  o delta é `value - previousValue`, em arquivos, sem percentual ou média de
  severidades. Informativo/desconhecido não geram linhas adicionais.

- Esta superfície não publica seleção, navegação ou ação corretiva para categoria, política, risco ou recomendação. Tooltips de categoria e recomendação expõem apenas o nome ou texto completo; o tooltip de `CircleAlert` expõe o valor recomendado da configuração divergente.
- Categoria sem coleta contribui `0` no peso correspondente e declara disponibilidade; isso não autoriza inferir que o controle esteja conforme ou não conforme.
- Achado DLP ausente não torna a dimensão DLP/classificação conforme: enquanto não houver avaliação de política publicada, a categoria continua com pontuação `0` e disponibilidade própria.
- Os valores são leitura de postura no recorte de atualização e não confirmação de aplicação em tempo real.
- Para apresentação do Security Score nesta superfície, as faixas contínuas são `[0,50)` Crítico, `[50,70)` Atenção e `[70,100]` Bom. Esses intervalos incluem as notas decimais publicadas, preservando os limiares aprovados. A classificação é regra visual de produto e não vem do DOCX nem altera o cálculo do score.
- Para Conformidade Global, as faixas visuais contínuas e independentes são `[0,25)` Crítico, `[25,50)` Alto, `[50,75)` Atenção necessária e `[75,100]` Em conformidade. Elas incluem as notas decimais sem lacunas, preservam os limiares aprovados, não alteram o Security Score nem significam certificação de compliance.
- Políticas mostram o nome da configuração, o valor atual e um ícone de avaliação, sem cabeçalho de colunas. `recommendedValue` não é uma coluna; o tooltip de `CircleAlert` informa esse valor somente em divergência avaliável. `Check` significa alinhado, `CircleAlert` divergente e um ícone neutro, com nome acessível, significa não avaliável. Uma avaliação não pode contradizer os valores ou a disponibilidade publicados.
- O baseline de produção recomendado é `default-v1`, aprovado na clarificação 4, distinto do exemplo sintético da imagem/fixture. Não é fato do tenant nem recomendação universal Microsoft. A ausência de fonte para valor atual continua explícita; avaliação usa regra semântica, não igualdade de texto formatado.

## Baseline default-v1 aprovado — 20 itens

| ID | Recomendação/semântica da avaliação |
| --- | --- |
| `external-sharing` | Convidados novos/existentes autenticados, sujeitos às restrições explícitas do tenant |
| `anonymous-links` | Permitidos somente leitura, prazo <=30 dias |
| `anonymous-edit-links` | Bloqueados |
| `default-link-type` | Pessoas específicas, distinto de acesso existente |
| `default-link-expiration` | Recomendado/máximo 30 dias para anônimos; não é prazo universal de todo link |
| `unmanaged-device-sync` | Exigir cliente gerenciado/conforme com controle efetivo |
| `offline-access` | Somente clientes gerenciados/conformes no escopo observado; sem avaliação completa, desconhecido/parcial |
| `download-limit` | Detector Orkestria >500 arquivos distintos/30 min por ator, sem bloqueio |
| `block-download` | Recomendado em espaços de casos técnicos de desligamento ou com conteúdo confidencial confirmado; exceções aprovadas explícitas; avaliação por escopo |
| `known-folder-move` | Três pastas Desktop, Documents e Pictures protegidas nos clientes Windows elegíveis |
| `legacy-authentication` | Bloqueada para SharePoint/OneDrive |
| `conditional-access` | Enforcement efetivo para população interativa OneDrive; condições/exceções desconhecidas impedem avaliação global |
| `mfa-required` | MFA efetivamente obrigatório, sem alternativa que o dispense |
| `guest-access` | Convidados autenticados com restrições do tenant |
| `allowed-domains` | Allowlist explícita não vazia para destinatários autenticados externos; não restringe destinatário de link anônimo |
| `default-quota` | Referência 1 TB, avaliável somente com unidade/direitos de licença resolvidos |
| `max-file-size` | Limite público versionado: 250 GB; origem de serviço explícita |
| `version-retention` | Referência manual500versões principais, sem requisito de expiração em dias. Manual500 alinhado; manual diferente divergente da referência. Automático mostra o modo real e é não avaliável contra o número500; não declarar equivalência. Regra exata desse item prevalece sobre a comparação genérica de limite mais restritivo |
| `onedrive-recycle-bin` | Janela total do serviço 93 dias desde exclusão original, sujeita a encerramento anterior |
| `second-stage-recycle-bin` | Restante dos mesmos 93 dias, sem prazo adicional |

`currentValue` continua anulável; sem evidência suficiente, `not_evaluable`.
Controle mais restritivo satisfaz comparações de limite quando seu sentido
for conhecido. A recomendação não altera controle Microsoft automaticamente.

Em `version-retention`, prazo ilimitado/zero não produz divergência apenas por
esse atributo: R4 retirou a exigência365dias. A comparação de quantidade requer
modo manual/unidade/valor conhecidos; modo ou dado ausente mantém não
avaliável. Overrides/cobertura são explícitos. A configuração de limite não
substitui o detector de arquivo com mais de50versões do DOCX. *(Usuário, R4,
2026-10-14.)*

## Avaliação executável do Security Score — default-v1

`B(condição)` = 100 quando comprovada, 0 quando divergente; evidência ausente
contribui 0 com motivo de ausência, sem inferir divergência. `R(bons,elegíveis)`
= `100 × bons / elegíveis`; elegíveis não observados/classificados não entram
em bons. População elegível desconhecida invalida o fator e contribui 0.
Médias usam o número fixo de fatores, sem redistribuir contribuição ausente.

| Dimensão / peso | Pontuação de 0 a 100 |
| --- | --- |
| Externo / 20 | Média de `B(capacidade, convidados e modo de domínio satisfazem baseline)` e `R(arquivos externos classificados sem risco alto/crítico, arquivos externos elegíveis)` |
| Anônimos / 15 | Média de `B(capacidade/tipos satisfazem baseline)`, `R(links sem escrita e sem conteúdo confidencial, links anônimos elegíveis)` e `R(links com prazo factual <=30 dias desde criação, links anônimos elegíveis)` |
| Dispositivos / 15 | Média de `B(controle efetivo exige gerenciamento/conformidade nos clientes de sync)` e `R(dispositivos Intune únicos explicitamente gerenciados e conformes, dispositivos Intune únicos elegíveis publicados)`. Universo observado Intune, independente dos clientes OneDrive; nenhuma correlação presumida. C2 aceita A preserva peso15 e regras de ausência/denominador |
| DLP/classificação / 15 | Média de `B(ao menos uma política DLP efetiva em enforcement para OneDrive)` e `R(arquivos suportados avaliados com rótulo, arquivos suportados elegíveis)` |
| Retenção / 10 | Média de `B(política ativa OneDrive com duração/ação conhecidas)` e `R(casos técnicos com responsável/plano registrados e aprovados, casos elegíveis)` |
| KFM / 10 | `R(clientes Windows com as três pastas protegidas, clientes Windows elegíveis)` |
| Antimalware / 5 | Média de `B(proteção de anexos/arquivos OneDrive habilitada)` e `B(download de arquivo infectado bloqueado)`; achados não substituem controle |
| Autenticação / 5 | Média de `B(legado bloqueado)` e `B(MFA obrigatório na população interativa OneDrive)` |
| Auditoria / 5 | `B(feeds necessários habilitados, última coleta completa <=1h e ausência de lacuna de ingestão de conteúdos publicados nas últimas 24h)`; não garante publicação de todo evento pelo provider |

Denominador factual zero, com leitura íntegra, produz 100 somente em medidas
de ausência de exposição/incidente/casos pendentes. Zero população de clientes,
contas ou arquivos de classificação contribui 0 com motivo sem população
avaliável. Ausência de coleta nunca é zero factual. Contagens negativas,
incoerentes, fora do domínio ou sem timestamp válido invalidam o fator.
Publicar cobertura e exclusões; resultado parcial mantém contribuição ausente
zero e estado próprio. Sem normalização min/max de conjuntos sem variação.
Calcular com precisão completa; arredondar pontuações e soma ponderada final
a uma casa decimal, half-up. Todos os pesos continuam no denominador 100.
Comparação D30 requer mesma versão e populações comparáveis; caso contrário,
fica ausente. Recomendações ordenam severidade, contribuição perdida e ID
estável; falta de evidência gera orientação de coleta, não controle desabilitado.

## Universos dos fatos complementares — aprovados

- Quarentena: documentos únicos OneDrive presentes no catálogo atual. Registro
  expirado não prova arquivo desbloqueado; emails e outros workloads não entram.
- Retenção corrente — R5: `retentionGovernance.currentRetainedFileCount`
  (inteiro não negativo ou nulo), com rótulo “Arquivos atuais sob retenção”,
  conta arquivos atuais únicos com retenção efetiva comprovada. Não contar
  pastas, itens remotos duplicados, excluídos ou cópias de preservação; várias
  regras sobre o mesmo arquivo não multiplicam a contagem.
- `retentionGovernance.currentRetainedBytes` (inteiro não negativo de bytes ou
  nulo), com rótulo “Volume atual sob retenção”, soma o tamanho atual dos
  mesmos arquivos únicos. Exclui versões, lixeira e cópias preservadas;
  representa volume lógico atual, sem afirmar ocupação física adicional.
  Tamanho desconhecido de algum arquivo protegido deixa o total de bytes
  desconhecido, preservando contagem já comprovada.
- As duas métricas mantêm cinco linhas no card, junto de políticas ativas,
  usuários alcançados e vencimentos. Publicar elegíveis, avaliados,
  desconhecidos, referência e disponibilidade de cada medida. Avaliação
  parcial pode mostrar o subtotal comprovado identificado pelo seu recorte;
  não o declarar total do tenant. Total global requer inventário e avaliação
  íntegros; zero requer ausência comprovada nesse universo. Política apenas
  configurada, rótulo apenas disponível e aplicação/escopo/âncora desconhecidos
  não confirmam proteção. Prazo finito exige âncora conhecida ainda vigente;
  prazo indefinido exige regra explícita. Conflito não resolvido permanece
  desconhecido.
- Cópias/artefatos preservados e sua ocupação física são fatos distintos,
  substituídos no card pela R5. Os campos/valores históricos da fixture
  `filesInRetention`/`preservedBytes` não são silenciosamente reinterpretados
  como as novas medidas. Pessoas alcançadas por política e vencimentos
  continuam independentes da quantidade/volume de arquivos. *(R5, usuário,
  2026-10-14.)*
- Vencimentos C8: arquivos atuais únicos pelo fim nominal combinado, na medida
  `filesWithNominalRetentionEnd15d` definida acima. Hold, retenção indefinida,
  contexto/âncora ou cadeia de regras não resolvidos permanecem não
  determináveis; o antigo `expiringWithin15Days` é somente histórico.
- DLP: políticas distintas no escopo OneDrive, classificadas em enforcement,
  teste/simulação ou desabilitada com distribuição/escopo conhecidos; alertas
  não determinam essa distribuição. Registros não avaliáveis ficam fora da
  distribuição com cobertura explícita.
- Sensibilidade: somente arquivos avaliados; sem rótulo exige avaliação
  concluída. Controles atuais e publicação de cada fato mantêm disponibilidade
  independente. *(Clarificação 4, usuário, 2026-10-14.)*
