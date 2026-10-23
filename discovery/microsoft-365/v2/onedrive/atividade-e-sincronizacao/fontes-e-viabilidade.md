# Fontes e viabilidade — Atividade e Sincronização

## Revalidação técnica — 14/09/2026

`GET /reports/getOneDriveActivityUserDetail(period='D30')`, com
`Accept: text/csv` e `Reports.Read.All`, foi revalidado em duas conexões
customer pelo procedimento sanitizado do `validate-graph`: ambas retornaram o
fluxo esperado `302 → 200 application/octet-stream`. O CSV possui as 11
colunas documentadas, incluindo data de atualização, data de última atividade,
contagens de visualização/edição, sincronização e compartilhamento interno e
externo. Nenhum valor, UPN, URL pré-autenticada, token ou identificador de
conexão foi retido.

O relatório confirma agregados e séries deriváveis por pessoa/período. Ele não
confirma falhas de sincronização, tipo/estado de dispositivo, conformidade ou
KFM; esses fatos usam fontes independentes, abaixo.

`getOneDriveActivityUserDetail(period='D30')` fornece atividade por usuário e
foi revalidado como `302 → 200 application/octet-stream`, com BOM UTF-8, 11
colunas e zero linhas malformadas. `getOneDriveActivityUserCounts(period='D180')`
e `getOneDriveActivityFileCounts(period='D180')` agora possuem coleta técnica
equivalente: CSV com BOM, sete colunas e 180 pontos, com nulabilidade somente
nas quatro métricas de atividade. Todos requerem `Reports.Read.All`; o download
CSV usa URL pré-autenticada sem `Authorization`. A cobertura sintética do
Simulator representa cada série sem alegar coletor ou dados publicados.

<a id="b3-periodos-do-relatorio-de-atividade"></a>
<a id="b3-periodos-do-relatorio-de-atividade-por-usuario"></a>

## B3 — períodos do relatório de atividade por usuário

**Resultado: contrato externo documentado; extensão de cobertura sintética da
mesma leitura canônica.** A Microsoft documenta `D7`, `D30`, `D90` e `D180`
como valores de `period` de `getOneDriveActivityUserDetail`, com a mesma
permissão `Reports.Read.All`, esquema CSV e fluxo de redirect. A observação
sanitizada D30 é mantida como evidência limitada de transporte/colunas;
D7/D90/D180 não recebem declaração de nova observação real. A revisão B3
completa os recortes no Simulator e não amplia consentimento, população nem
modalidade de coleta de produção.

O consumidor de `activityPeriod` usa a publicação própria do período pedido:

| Filtro | Relatório / unidade temporal |
| --- | --- |
| D7 | `getOneDriveActivityUserDetail(period='D7')`, agregado de 7 dias |
| D30 | `getOneDriveActivityUserDetail(period='D30')`, agregado de 30 dias |
| D90 | `getOneDriveActivityUserDetail(period='D90')`, agregado de 90 dias |
| D180 | `getOneDriveActivityUserDetail(period='D180')`, agregado de 180 dias |

Reutilizar uma fonte canônica de relatórios por ciclo/recorte; consumidores
locais compartilham a publicação do mesmo período e `Report Refresh Date`.
Não chamar Graph a partir da UI nem transformar alteração de filtro em coleta
síncrona. As quatro janelas são agregadas e sobrepostas: não somá-las, não
subtrair ou escalar o resultado D30 para fabricar outra janela e não tratá-las
como quatro fotografias mensais independentes. Cada recorte tem sua própria
referência/frescor/cobertura. A ausência/falha de D7 não autoriza apresentar D30
com rótulo D7 nem publicar contadores zero.

Admitir cada CSV pelo schema de 11 colunas, por nome e tipos, e exigir
`Report Period` compatível com os dias solicitados. Se o transporte/schema ou
período for incompatível, conservar a última publicação desse recorte com
motivo sanitizado; não misturar linhas de períodos diferentes na mesma geração.
`Report Refresh Date` é referência do provider, não hora de download. O detalhe
traz contagens por usuário, não uma linha por dia nem estado de sincronização
instantâneo. Os fatos separados de visualização e edição continuam no mapping
A2 por auditoria, e C2/R3 e as fontes dos benefícios não mudam por B3.

O handoff obrigatório reutiliza
`graph.v1.report.onedrive-activity-user-detail`; sua assinatura externa continua
`GET /v1.0/reports/getOneDriveActivityUserDetail(period='{period}')` com
`Accept: text/csv`, sem query/body extra. Antes de B3, o inventário só selecionava
D30; a ampliação selecionou os quatro valores na **mesma operação**, com
fixtures sintéticas determinísticas por período e `Report Period` 7/30/90/180.
Não replicar uma operação por período nem declarar a fixture como resposta real.
O fluxo HTTP externo permanece `302 → download CSV`; o runtime do Simulator
serve CSV sintético, sem URL pré-autenticada real.

Fontes/evidências: [API e matriz de observação](api.md#b3-periodos-do-relatorio-de-atividade),
[OpenAPI](openapi.yaml) e
[Microsoft Learn](https://learn.microsoft.com/graph/api/reportroot-getonedriveactivityuserdetail?view=graph-rest-1.0).
Fonte canônica Graph v1.0 pinada em
`0d13ff1c5e4c8e5e3acc8200de615dfb36233395`.
Nenhuma nova chamada de tenant, implementação ou fixture de frontend integra
este fechamento.

**Cobertura sintética concluída:**
`graph.v1.report.onedrive-activity-user-detail` continua `SUPPORTED`, agora com
D7/D30/D90/D180 na mesma entrada. Os quatro CSV sintéticos possuem 11 colunas;
validação lê `Report Period` pelo nome do header em **todas** as linhas, sem
depender da posição entre produtos e período. O smoke conferiu os quatro
recortes, status/media type, headers, Report Period 7/30/90/180, datas da janela
ou ausentes e métricas inteiras. D365 continuou rejeitado no Simulator com
`400 InvalidPeriod`; não foi ampliado o domínio oficial do período. Nenhuma
URL pré-autenticada real ou `Location` fictício foi criado.

`contracts:generate`, `inventory` (87 operações/53 caminhos Graph), `validate`,
`up`/importação dos cinco serviços, `smoke` e `git diff --check` passaram.
Contagem de operações não aumentou: a cobertura foi ampliada por parâmetro,
sem quatro entradas duplicadas. Os números são do Simulator inteiro, sem
alegar disponibilidade operacional ou dados de customer. O OpenAPI desta aba
passou `SwaggerParser.validate` 12.1.0 com quatro operações e parâmetros de
path obrigatórios declarados. B3 está fechado como contrato e cobertura
sintética; observação real adicional continua limitada à evidência D30 prévia.

## Inventário de dispositivos gerenciados

`GET /deviceManagement/managedDevices?$top=25&$select=id,userId,deviceName,azureADDeviceId,operatingSystem,lastSyncDateTime,complianceState,managementState,partnerReportedThreatState`, com `DeviceManagementManagedDevices.Read.All`, foi consultado de modo sanitizado. Uma conexão publicou envelope OData `200` com os campos selecionados; outra retornou `401` por condição local de provider. Assim, a rota e o mapping de inventário/conformidade estão aprovados, mas a disponibilidade continua própria por conexão e depende de Intune habilitado.

`lastSyncDateTime` é a última sincronização bem-sucedida com Intune. `complianceState`, `managementState` e `partnerReportedThreatState` sustentam, respectivamente, conformidade, gerenciamento e sinal de risco do dispositivo. Eles não demonstram falha do cliente OneDrive, versão de cliente ou Known Folder Move.

A query da superfície seleciona `$top=25` e inclui `userId`, `deviceName` e
`partnerReportedThreatState`. O Simulator mantém essa projeção pré-collector
separada da chamada `$top=100` já emitida pelo app, com respostas que refletem
os respectivos `$select`. O contrato sintético foi gerado e passou pelo smoke.

## Telemetria de saúde do cliente OneDrive

**Resultado: nova coleta justificada — fonte aprovada por exportação.** O
Microsoft Graph Data Connect for SharePoint documenta atualmente os datasets
`BasicDataSet_v0.OneDriveSyncHealth_v1` e
`BasicDataSet_v0.OneDriveSyncErrors_v1` para exportação ao armazenamento Azure
do customer. O schema detalhado público de erros ainda se identifica como
`BasicDataSet_v0.OneDriveSyncErrors_v0`. É a fonte canônica suportada para os sinais de saúde exportados por cliente;
não é um endpoint REST do Microsoft Graph.

`OneDriveSyncHealth_v1` fornece um objeto por cliente OneDrive com reports
habilitados, incluindo `OneDriveDeviceId`, versão e anel do aplicativo,
plataforma/SO, políticas e pastas KFM, `LastSyncedTimestampUTC`,
`LastStatusReportedTimestampUTC` e `TotalErrorCount`. `OneDriveSyncErrors_v0`
fornece erro detalhado por tipo/dispositivo — IDs de erro, título, descrição e
contagem — e é unido exclusivamente por `OneDriveDeviceId`. Pessoa, e-mail,
nome de dispositivo, textos de erro e identificadores técnicos são PII e só
podem sair da projeção tenant-scoped na forma autorizada pelo contrato.

Há divergência documental de versão: Microsoft Learn e a orientação de Sync
Health listam `OneDriveSyncErrors_v1`, enquanto a revisão oficial pinada ainda
identifica `BasicDataSet_v0.OneDriveSyncErrors_v0`. A consulta de 14/10/2026
confirmou que `main` continua na mesma revisão; atualizar o pin não resolve a
divergência. O schema pinado comprova somente `v0`; para `v1`, exigir schema
anunciado pela origem, conforme a aba Schema do Data Factory/Synapse. Não
renomear versões ou presumir compatibilidade. `OneDriveSyncHealth_v1` não
apresenta essa divergência de versão, mas há inconsistências entre tabela e
samples de campos KFM, detalhadas na investigação A3 abaixo.
[Catálogo Learn](https://learn.microsoft.com/graph/data-connect-datasets) e
[schema pinado de erros](https://github.com/microsoftgraph/dataconnect-solutions/blob/6f75a7ce78d53a8a81588289d688230d2fc336b2/Datasets/data-connect-dataset-onedrivesyncerrors.md).

O mapeamento preserva as semânticas: `devices.clientVersion`, `devices.kfm`,
`devices.lastOneDriveSync` e `devices.lastStatusReported` vêm de
`OneDriveSyncHealth_v1`; `syncErrors` vem do dataset de erros cuja versão e
schema o export anunciar; o estado
de Intune continua fonte independente. `TotalErrorCount` é contagem observada
no snapshot de saúde, não número de eventos no período. Ele não substitui
`ErrorCount` do dataset de erros nem deve ser somado entre fotografias. A
tendência de falhas usa a semântica de snapshot mensal aprovada abaixo;
não afirma cronologia de cada erro.

Pré-requisitos abstratos: Sync Health habilitado nos clientes e no Apps Admin
Center, Microsoft Graph Data Connect habilitado para datasets SharePoint/OneDrive,
identidade de aplicação e recursos Azure do mesmo tenant para o pipeline de
exportação. O dataset de saúde é diário e sem delta; o dataset de erros cobre
os últimos 30 dias e também não tem delta. Ausência de exportação, atraso ou
falha de pipeline preserva a última fotografia e publica freshness/coverage
próprias; não converte dispositivo ou erro em zero.

O endpoint interno `clients.config.office.net/odbhealth/...` não é fonte
canônica: foi observado no portal, mas não há contrato Microsoft público nem
fluxo app-only estável. Não é chamado na coleta, não entra em OpenAPI e não é
simulado. A homologação técnica aplica-se ao dataset e schema versionados pela
Microsoft; não há GET temporário seguro a executar, pois a exportação é
assíncrona e configurada fora do runtime de leitura.

## Cobertura sintética

O Simulator foi pré-validado para a assinatura do candidato: seu inventário
aceita somente providers HTTP (`graph`, `defender`, `azure` e Management
Activity API), enquanto Graph Data Connect entrega arquivos de um pipeline ao
armazenamento Azure e não publica uma `externalRequest` REST para esse dataset.
Assim, não foi criada uma rota fictícia nem uma operação `SUPPORTED` enganosa.
Fixtures de frontend podem representar o contrato Orkestria a partir dos dois
schemas aprovados; a futura implementação lerá a projeção local do export, não
o Simulator ou o endpoint interno do portal.

## Fatos derivados localmente e lacuna temporal

- Os Reports sustentam atividade combinada de visualização/edição, sincronização
  de arquivos e contagens separadas de compartilhamento interno/externo. A2 e
  B4/C6 usam o feed de auditoria já selecionado para arquivos distintos com
  atividade; o KPI único `sharedItems` não soma as colunas de compartilhamento.
  A2 também não divide aritmeticamente a coluna combinada. Versão, KFM, timestamps
  e sinais de erro do cliente vêm do export Data Connect; conformidade,
  gerenciamento e risco do dispositivo vêm separadamente de Intune.
  `OneDriveDeviceId` correlaciona Health com Errors, sem provar correlação
  Health–Intune ou os cinco estados de execução esperados pela fixture. Os dois
  estados de sincronização não se substituem; ver investigação A3 abaixo.
- Distribuição, KFM summary, benefícios, alertas, prioridade e recomendações
  são regras locais versionadas. Ausência de dispositivo, export ou atividade
  não representa zero nem sucesso; preservar a availability de cada coleção.
- A série contratual mensal de 12 meses de falhas não é entregue como eventos
  mensais: o dataset de erros cobre somente os últimos 30 dias, não tem delta e
  fornece contagem por tipo/dispositivo sem data de cada falha. Somar snapshots
  diários repetiria janelas sobrepostas e não produziria contagem mensal
  factual. A estratégia aprovada é selecionar uma fotografia íntegra por
  mês, com a contagem dos 30 dias precedentes, conforme abaixo. Não substituir por `TotalErrorCount` do snapshot de
  saúde.
- No onboarding do dataset de erros, fixar o nome/schema no perfil imutável
  aprovado: o catálogo atual do Microsoft Learn lista `OneDriveSyncErrors_v1`,
  mas o documento de schema associado ainda se intitula
  `BasicDataSet_v0.OneDriveSyncErrors_v0`. A estratégia não pressupõe igualdade
  das versões; export e perfil validam o formato realmente anunciado pela
  origem, sem transformar a fixture em prova de compatibilidade.

## A2 — itens acessados e editados separados

**Estratégia selecionada:** reutilizar a projeção canônica de
[Histórico e Auditoria](../historico-e-auditoria/fontes-e-viabilidade.md), com
`Audit.SharePoint`/`Audit.General`, sem feed duplicado ou nova API. O CSV
`Viewed Or Edited File Count` continua combinado e não alimenta dois números.
O [catálogo Microsoft](https://learn.microsoft.com/en-us/purview/audit-log-activities)
documenta acessos, prévias, downloads e modificações como operações distintas;
também documenta supressão de repetições e eventos de aplicação. Estas métricas
representam arquivos distintos com atividade observada, não todas as ações
físicas dos usuários nem uma decomposição exata do Report.

1. Usar eventos admitidos no mesmo tenant e comprovadamente associados a
   OneDrive empresarial. Deduplicar evento por `Id` antes de agregar. A chave
   de arquivo é `(Site,ListId,ListItemUniqueId)`, correlacionada ao inventário
   `(driveId,itemId)` por identificadores SharePoint compatíveis. Os campos
   são opcionais no schema: sem chave inequívoca, o evento continua na
   auditoria, mas não entra na contagem distinta e reduz sua cobertura.
   URL/nome, sozinhos, não comprovam identidade estável após mover/renomear.
2. `accessedItems`: cardinalidade das chaves de arquivo com
   `FileAccessed`, `FileAccessedExtended`, `FilePreviewed` ou `FileDownloaded`
   na janela. `editedItems`: cardinalidade com `FileModified` ou
   `FileModifiedExtended`, que podem representar conteúdo ou propriedades.
   Um arquivo pode pertencer aos dois conjuntos. Excluir pastas/páginas,
   prefetch, sinais derivados e eventos explicitamente falhos/parciais.
   Resultado omitido não vira sucesso: a operação factual observada pode
   alimentar presença de atividade, com resultado desconhecido preservado,
   sem habilitar regras que exijam sucesso. Upload isolado não prova edição
   de arquivo anterior; sincronização de download não prova leitura humana.
3. Para métricas de pessoas e departamento, exigir ator humano interno
   correlacionado à identidade canônica: `UserType` compatível, ID ou UPN
   factual unívoco. Aplicação, sistema, ator anônimo ou não resolvido não se
   transformam no proprietário do drive. Publicar a cobertura dessas exclusões.
   O total de arquivos usa o mesmo recorte de atores das métricas de pessoas.
4. Definir T como fim exclusivo da última data UTC integralmente publicada.
   D7/D30/D90/D180 usam `[T-Ndias,T)`; cada ponto diário usa o mesmo critério
   em seu dia. Por pessoa, deduplicar `(actorId,fileKey)` em toda a janela;
   no resumo, deduplicar somente `fileKey`, sem somar contagens por pessoa/dia.
   `departmentActivity` agrupa o ator pela fotografia de identidade na
   referência publicada e deduplica `fileKey` dentro de cada departamento.
   O mesmo arquivo pode aparecer em dois departamentos: suas contagens não
   são parcelas aditivas do total global. Departamento ausente fica sem
   classificação, com cobertura, sem inferir pelo proprietário do arquivo.
5. Materializar snapshots diários de presença por `(dia,actorId,fileKey,tipo)`
   e referência da identidade, sem JSON, IP ou detalhe de evento. Reter por
   400 dias, conforme Q2; unir os conjuntos dos dias ao consultar a janela.
   Só somar contagens diárias não permite deduplicar D180. Eventos/JSON
   continuam expirando em 90 dias e rollups mensais em 13 meses; snapshots
   não reconstituem detalhe expirado. Vínculos de tenant e autorização seguem
   os mesmos limites das projeções canônicas.
6. Registrar intervalos coletados, páginas/blobs admitidos, eventos sem chave
   ou ator e a versão de normalização. Primeiro onboarding não retroprojeta
   180 dias. Gap do feed irrecuperável ou dia não publicado mantém a janela
   parcial; zero exige janela íntegra e nenhum qualificante desconhecido.
   Uma falha preserva a última publicação válida com freshness própria. A
   expiração do detalhe não apaga antecipadamente o snapshot diário aprovado.

`activitySummary`, `activityTrend` e `departmentActivity` recebem as mesmas
medidas de conjuntos, referências e cobertura. Reports de pessoas/arquivos
sincronizados permanecem medidas independentes, sem exigir igualdade entre
universos diferentes. A estratégia satisfaz as janelas existentes e reutiliza
as quatro operações de feed já validadas; não exige nova operação no Simulator
nem execução de tenant nesta revisão.

## B4 — arquivos com atividade de compartilhamento: C6 aceita A

**Decisão de contrato:** em2026-10-15 o usuário aceitou C6 A, com rótulo
“Arquivos com atividade de compartilhamento”, unidade de arquivo único e
atividade registrada, sem afirmar sucesso, aceite ou concessão vigente. A
definição é uma proposta aceita expressamente, não regra retroativa do sponsor.
O [contrato](contratos.md#arquivos-com-atividade-de-compartilhamento--c6-aceita-a)
define o comportamento e os metadados; esta seção fecha sua normalização.

**Estratégia:** reutilizar o consumidor canônico de
[Histórico e Auditoria](../historico-e-auditoria/fontes-e-viabilidade.md#a5--normalização-canônica-audit-operations-v1)
e os conjuntos de A2. O CSV de Reports publica interno/externo sem IDs de
arquivos/interseção; somá-los não prova união distinta. Não há nova API,
operação do Simulator, feed por aba ou chamada de tenant neste fechamento.

### Operações originais e resultado

Aplicar o predicado versionado `sharing-activity-v1` depois da admissão canônica
de organização, workload, vínculo OneDrive e deduplicação de evento por `Id`.
Usar a operação original preservada, não a categoria Compartilhamento inteira
nem somente seu código normalizado `SharingSet`.

| Operação original qualificante | Fato registrado e limite |
| --- | --- |
| `SharingSet` | Compartilhamento direto registrado com usuário do diretório. |
| `AnonymousLinkCreated` | Criação de link anônimo; não exigir uso/distribuição posterior nem afirmar destinatário identificado. |
| `CompanyLinkCreated` | Criação de link organizacional; não concluir que todos os membros o usaram. |
| `SecureLinkCreated` | Criação de link específico; a ausência de destinatário não prova ausência de criação nem concessão efetiva. |
| `AddedToSecureLink` | Inclusão de destinatário em link específico, novo ou já existente. Não multiplicar o arquivo pela criação do link ou por destinatários. |
| `SharingInvitationCreated` | Convite, somente com alvo de arquivo factual. A orientação específica atual descreve convite de site: não pressupor emissão dessa operação para arquivo nem expandir site/pasta para seus descendentes. |

Uso de links, `SharingInvitationAccepted`, `AccessRequestAccepted`,
`SharingRevoked`, remoções, atualizações, mudanças de herança, `AddedToGroup`
e alterações genéricas de permissões não iniciam uma presença neste KPI.
Esses eventos conservam sua disposição de auditoria; a whitelist é fechada e
não transforma toda concessão de acesso em criação de compartilhamento.

Aplicar o perfil Common/SharePoint já selecionado: `Succeeded` é sucesso
explícito; `Failed` e `PartiallySucceeded` ficam fora do predicado. Ausência
ou valor não normalizado, inclusive `Success` sem perfil próprio comprovado,
permanece resultado desconhecido. A atividade qualifica quando seus demais
fatos estão resolvidos, sem completar regra de sucesso/risco por inferência.
Resultado desconhecido isolado não invalida a cobertura da atividade; alimenta
o conjunto independente de arquivos com resultado desconhecido.

Evidência primária: [auditoria de compartilhamento](https://learn.microsoft.com/en-us/purview/audit-log-sharing),
[catálogo de operações](https://learn.microsoft.com/en-us/purview/audit-log-activities#sharing-and-access-request-activities)
e [schema Common/SharePoint](https://learn.microsoft.com/en-us/office/office-365-management-api/office-365-management-activity-api-schema).
O schema publica resultado, tipo e identificadores específicos como opcionais;
nome de operação não resolve sozinho alvo, ator ou identidade de arquivo.

### Arquivo, ator e conjuntos históricos

1. Exigir o mesmo recorte de ator humano interno factual de A2. Aplicação,
   sistema, convidado, anônimo e ator não resolvido não viram proprietário do
   drive. Ausência de destinatário não impede a presença global de uma criação
   de link comprovada; classificação interno/externo não é operando deste KPI.
2. Admitir somente alvo de arquivo comprovado por `ItemType` no perfil oficial
   ou por metadado factual do mesmo objeto inequivocamente correlacionado.
   Excluir pastas, páginas, sites, bibliotecas e outros tipos; evento de pasta
   não gera uma presença para cada descendente, mesmo com inventário atual.
   Extensão/nome/URL isolados não provam tipo ou identidade histórica.
3. Reutilizar `fileKey=(Site,ListId,ListItemUniqueId)` tenant-scoped de A2,
   correlacionado ao inventário `(driveId,itemId)` por `sharepointIds` quando
   comprovado. O GUID SPSite não é o ID Graph composto do site. Não usar
   `UniqueSharingId` como identidade de arquivo. Se os IDs do evento faltarem,
   só aceitar vínculo histórico factual inequívoco já resolvido; não fazer
   fallback por nome/URL corrente ou primeiro resultado. Sem esse vínculo,
   o evento continua na auditoria e reduz a cobertura da métrica.
4. Preservar a identidade/tipo já comprovados nos conjuntos pelo prazo
   aprovado. Renomeação, exclusão ou revogação posterior não remove presença
   histórica. Não exigir que o arquivo continue ativo/compartilhado hoje;
   inventário/permissões atuais não comprovam contexto ou direitos antigos.
   Movimento com identidades diferentes só se reconcilia por vínculo factual
   canônico, sem fundir arquivos por semelhança.
5. Para cada diaUTC, materializar os conjuntos `sharing` e
   `sharingUnknownResult` por `(dia,actorId,fileKey,tipo)` e referência de
   identidade, com a revisão de admissão/predicado. O segundo é subconjunto
   do primeiro e registra presença quando houver ao menos uma atividade de
   resultado desconhecido. Não guardar JSON, IP, destinatários ou detalhes
   expirados nesses snapshots; não é necessário reter IDs de eventos400dias
   para contar esses arquivos. Replays já são deduplicados pelo consumidor
   canônico antes da materialização; presença repetida é idempotente.
6. Reter conjuntos e metadados mínimos de cobertura400dias, conforme A2/Q2;
   eventos/JSON continuam90dias e rollups13meses. A expiração do detalhe não
   elimina conjuntos antes do seu prazo nem permite reconstruir o JSON.
   A referência factual de ator/tipo/identidade necessária à presença permanece
   vinculada ao snapshot; a consulta não depende de reencontrar o arquivo ativo.

Os campos de interoperabilidade estão documentados em
[SharePointIds](https://learn.microsoft.com/en-us/graph/api/resources/sharepointids?view=graph-rest-1.0)
e já integram o inventário selecionado de Arquivos e Conteúdo. Esta correlação
não acrescenta leitura externa ou extensão de consentimento.

### Janela, agregação e metadados

T é o fim exclusivo da última dataUTC integralmente publicada pela fonte
canônica. Para N=7/30/90/180, unir as presenças em `[T-Ndias,T)`:

```text
S(N,T) = união dos fileKey das presenças sharing na janela
U(N,T) = união dos fileKey das presenças sharingUnknownResult na janela
sharedItems = |S(N,T)|
unknownResultFileCount = |U(N,T)|, com U subconjunto de S
```

Não somar cardinalidades diárias/por pessoa, nem interno+externo. Um arquivo
com resultado desconhecido e outra operação com sucesso continua uma vez em S
e uma vez em U; U não é quantidade de eventos nem afirma que todas as ações
daquele arquivo tenham resultado desconhecido. Por pessoa deduplicar
`(actorId,fileKey)`; por departamento deduplicar fileKey no grupo da referência
de identidade publicada, como A2. Grupos podem se sobrepor; departamento
desconhecido afeta seu agrupamento, sem invalidar um total global já sustentado.

Publicar `activitySummary.sharedItems` e seu irmão
`activitySummary.sharedItemsMetadata`, com `unit:file`, `period`, janelaUTC,
`asOf:T`, `ruleVersion:sharing-activity-v1`, `identityReference`,
`unknownResultFileCount`, `coverage` e `availability` exatamente conforme
[contrato](contratos.md#arquivos-com-atividade-de-compartilhamento--c6-aceita-a).
Não atribuir referência de Reports ou horário de download a essa publicação.
Mudança de regra/identidade que altere admissão ou agrupamento exige geração
compatível; não reinterpretar presenças de outra revisão como se fossem atuais.

O ledger mantém dias cobertos e flags de ingestão/tipo/arquivo/ator resolvidos,
incluindo existência de registros potencialmente qualificantes não resolvidos.
Flags persistidas por dia são combinadas conservadoramente para a janela;
replay não cria pendência adicional. Não converter a quantidade de eventos
sem chave em quantidade de arquivos desconhecidos: podem representar um mesmo
arquivo ou arquivos já contados. Não é necessário acrescentar contador de
eventos retido400dias para publicar esta cobertura.

`coverage.observedFileCount` coincide com o subtotal observado publicado;
`totalFileCount` só é numérico com cobertura íntegra do universo declarado.
`unknownFileCount` permanece nulo com lacunas, tipo/chave/ator não resolvidos,
e somente é zero com avaliação íntegra. `unknownResultFileCount` descreve o
subconjunto observado resolvido, inclusive numa publicação parcial; não estima
quantos arquivos sem identidade tiveram resultado desconhecido. Todos os
contadores publicados são inteiros não negativos; U não pode exceder S,
coveredDays não pode exceder N e entradas incoerentes não são ajustadas para
caber na faixa: impedem a promoção da nova publicação.

### Cobertura, comparação D30 e falhas

Seguir páginas/blobs e ledger do consumidor existente, com `CreationTime` para
o dia da atividade e `contentCreated` somente para descoberta/watermark.
Conteúdo tardio atualiza o dia factual ainda retido, não o dia do download;
publicar conjuntos, metadados e comparação da mesma geração coerente. A
[referência do feed](https://learn.microsoft.com/en-us/office/office-365-management-api/office-365-management-activity-api-reference#list-available-content)
limita a recuperação de conteúdo e não garante ordem dos eventos; coleta
íntegra significa conteúdo observado/admitido até a referência da publicação,
não garantia de todas as ações físicas já terem sido publicadas pela Microsoft.

Primeiro onboarding não retroprojeta180dias. Dia sem coleta, página/blob
falho, schema inválido, lacuna irrecuperável ou evento potencialmente
qualificante sem tipo/chave/ator necessários mantêm cobertura parcial ou não
avaliada. Operação conhecida fora da whitelist e tipo comprovadamente excluído
são exclusões factuais, sem criar pendência artificial. Registro OneDrive cuja
pertinência ao predicado não puder ser determinada permanece desconhecido,
com motivo; não é interpretado como ausência de atividade.

Uma contagem positiva parcial pode ser publicada como observada. Janela
parcial sem arquivo resolvido mantém valor nulo, não zero. Zero requer todos
os dias íntegros e nenhum qualificante desconhecido no universo declarado.
Sem primeira publicação, valor/janela/asOf ficam sem referência inventada e o
estado é `not_yet_published`. Falha/restrição preserva a última publicação
válida com sua janela, causa e frescor; não avança T nem zera os demais KPIs.

Somente a comparação D30 já prevista usa `[T-30dias,T)` versus
`[T-60dias,T-30dias)`, recalculando conjuntos distintos de cada janela. Exigir
cobertura íntegra, mesma revisão/unidade, critérios de escopo e referências de
identidade compatíveis; variação natural de pessoas/arquivos é permitida,
sem exigir as mesmas identidades nas duas janelas. Publicar em
`activitySummary.comparison.sharedItems` o valor atual e
`comparison:{ previousValue, periodDays:30 }` somente quando admitida. Sem
baseline factual, omitir; não repetir o atual, interpolar nem subtrair
publicações Reports. D7/D90/D180 não recebem comparação nova.

B4 fica fechado no recorte C6 A aceito, com handoff semântico ao blueprint.
C1/estoque de compartilhamento, risco, outros KPIs, GA4/inatividade, sérieR3,
benefícios e fixture histórica preservam suas regras próprias. O fechamento
não declara collector implantado, histórico acumulado ou dados reais novos.

## Indicador Reports de arquivos sincronizados — agregação explícita

R3 preservou o KPI de arquivos dos Reports e alterou somente a série mensal
azul para clientes Health. A fonte já selecionada
`getOneDriveActivityUserDetail(period='{period}')` publica `Synced File Count`
por pessoa/período, conforme o
[contrato Microsoft do relatório](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/onedrive-for-business-activity-ww?view=o365-worldwide).
Explicitar sua agregação é derivação da fonte existente, sem afirmar arquivos
globalmente únicos nem adotar a opção mensal R3-B não selecionada.

1. Reutilizar o CSV canônico admitido para o período selecionado e sua
   `Report Refresh Date`. Resolver o usuário por identidade canônica factual
   e UPN normalizado unívoco; nome exibível, UPN oculto/anonimizado ou vínculo
   ambíguo não são uma pessoa resolvida. O universo é o de pessoas reportadas,
   com exclusões e cobertura declaradas; não filtrar retrospectivamente por
   licença ou situação corrente diferente da fotografia reportada.
2. Após validar inteiro não negativo, a contribuição de cada pessoa é o seu
   `Synced File Count` desse período/referência. Somar uma contribuição por
   pessoa; repetição idêntica é replay, enquanto contribuições conflitantes
   para a mesma identidade/período/referência impedem uma soma íntegra e
   exigem reconciliação. Não somar downloads repetidos do mesmo relatório,
   pontos diários, janelas sobrepostas ou dois períodos. O CSV não contém
   identidades de arquivos que permitam deduplicação global entre pessoas.
3. Publicar a soma no binding `activitySummary.syncOperations`, com contexto
   de “Contagens de arquivos sincronizados reportadas por usuário” e período,
   referência, cobertura e disponibilidade da geração admitida. A denominação
   do binding não transforma essa medida em operações ou tentativas. A soma
   pode contar um mesmo arquivo nas contribuições de pessoas diferentes; não
   apresentar o valor como cardinalidade global de arquivos únicos.
4. Linha/identidade/contagem não resolvida fica fora do subtotal comprovado e
   reduz cobertura. Um subtotal parcial é identificado como observado; total
   completo e zero exigem todas as contribuições aplicáveis admitidas.
   Publicação inválida/falha preserva a última válida do mesmo recorte com
   frescor. Comparação exige snapshot factual anterior, mesmo período,
   semântica e população comparáveis; não fabricar baseline de uma série
   diária ou da fotografia corrente.

Exemplo de unidade, sem dado de tenant: duas pessoas com contribuição 1 cada
produzem 2 contagens reportadas, inclusive se o arquivo subjacente for o mesmo.
Não representam duas identidades globais de arquivo. A leitura já é
`SUPPORTED` nos quatro períodos pelo B3; não há nova API, coleta por tela ou
alteração da fórmula R3. Fechamento técnico em 2026-10-15.

## Usuários sem atividade — atividade da pessoa GA4

**Fonte selecionada:** reutilizar `getOneDriveActivityUserDetail(period='D180')`,
com `User Principal Name`, `Last Activity Date` e `Report Refresh Date`.
O DOCX §5 define adoção e usuários licenciados sem atividade, enquanto §1
classifica espaços/contas por uso. A regra de mais de90dias permanece; os
universos são diferentes. Esta correção técnica substitui o mapping provisório
que usava o máximo de `Last Activity Date` dos espaços de propriedade.

1. Usar população canônica de identidade/licenças de Contas, com pessoa
   licenciada e vínculo factual OneDrive, sem limitar à página visível.
   Correlacionar a UPN factual do relatório D180 à identidade estável já
   resolvida nessa geração; anonimização, renomeação não correlacionada,
   duplicata conflitante ou identidade ambígua reduz cobertura. Não unir por
   nome de exibição. Uma pessoa contribui uma vez.
2. A data é a atividade publicada **por usuário**, inclusive ações em espaços
   alheios, na referência `Report Refresh Date` do D180 admitido. Não usar
   `Last Activity Date` de UsageAccountDetail, máximo dos drives próprios,
   signInActivity, Health/Intune ou ausência de evento/linha como substituto.
   O D180 é fixo para esta coleção; D7/D30/D90 do filtro não o substituem.
3. Qualificar somente data válida estritamente anterior à referência menos
   90dias. `lastActivityAt` recebe essa data e `daysInactive` a diferença entre
   as datas UTC completas. Exatamente90dias não atende; data futura/inválida,
   nula ou pessoa sem linha mantém avaliação desconhecida. Não inferir
   inatividade>180 ou criar91dias a partir de um campo vazio.
4. Publicar `asOf`, geração, população elegível, observados/avaliados/
   desconhecidos e availability próprios, com causas/frescor das dependências.
   Somente pessoas resolvidas e qualificantes entram. Vazio completo exige
   população íntegra e nenhuma qualificante; falha/restrição preserva a última
   publicação válida. Trocar período, filtrar ou paginar clientes não muda a
   coleção. Licença não resolvida não presume elegibilidade.

Contraexemplos de unidade: a pessoa que age hoje no drive de outra não é
inativa porque seu próprio espaço tem uso antigo. Uso recente do seu espaço
por terceiro tampouco comprova atividade da pessoa. A definição oficial do
[relatório por usuário](https://learn.microsoft.com/en-us/graph/api/reportroot-getonedriveactivityuserdetail?view=graph-rest-1.0)
e das [métricas de atividade](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/onedrive-for-business-activity-ww)
sustenta essa distinção; aplicá-la aos contraexemplos é inferência técnica.
A operação D180 já é `SUPPORTED` por B3: reusar o consumer/publicação,
sem novo GET por tela. A regra de inatividade dos espaços em Contas permanece
independente. Correção da segunda análise independente em2026-10-15, sem
alteração de fixture histórica ou nova decisão de produto.

## Clarify — estratégia aprovada de export e história mensal

O DOCX do sponsor exige sincronização de dispositivos e o frontend aprovado
exige evolução de 12 meses. O sponsor não fornece contagem mensal de falhas
com timestamps. A [orientação oficial de Sync Health](https://learn.microsoft.com/en-us/sharepoint/sync-health?tabs=windows)
explica onboarding, export recorrente, identificação de run e tratamento de
sobreposição. Na clarificação Q3 de 14/10/2026, o usuário aprovou a última
fotografia íntegra de cada mês, com janela rolling30d, e o importer com perfil
imutável validado no onboarding. As regras abaixo são a estratégia aprovada;
não afirmam que um adapter estático `v1` já teve compatibilidade demonstrada.

1. Manter importações diárias completas dos datasets de saúde e de erros em
   runs imutáveis, com versão anunciada, schema/hash, data de referência e
   vínculo de tenant. Usar somente arquivo de dados, descartando metadados de
   pipeline. Publicar depois de conclusão bem-sucedida e validação de todos os
   arquivos do run, sem promover run parcial.
2. Validar entrada por versão explícita e tipos/campos do schema dessa versão.
   Para o schema público `v0`, a chave lógica de erro dentro do run é
   `(OneDriveDeviceId, SyncErrorId, TaskDialogId1, TaskDialogId2)`; `ErrorCount`
   é inteiro não negativo. Repetição idêntica é replay, enquanto duas linhas
   com a mesma chave e contagens conflitantes invalidam o run para investigação.
   O schema `v1` precisa ser obtido e comparado antes de habilitar seu adapter.
   Campos adicionais podem ser preservados internamente; campos obrigatórios
   ausentes ou com tipos incompatíveis bloqueiam a nova publicação.
3. Correlacionar saúde e erros pelo mesmo run/período e `OneDriveDeviceId`.
   Pessoa vem do snapshot de saúde. Intune permanece um domínio independente;
   nome de dispositivo ou pessoa sozinhos não comprovam identidade de
   dispositivo entre as fontes.
4. Para cada mês, selecionar a última fotografia íntegra cuja data de
   referência esteja no mês e publicar a soma de `ErrorCount` dos registros
   únicos daquela fotografia. Exibir a data de referência e o rótulo “Erros
   reportados nos 30 dias anteriores ao snapshot”. Os pontos são comparáveis
   como fotografias; não se somam para obter total anual ou mensal de eventos.
5. Manter 12 posições mensais; mês sem fotografia fica sem valor. No primeiro
   mês há somente um ponto factual. Não retroprojetar 12 pontos usando o run
   corrente, repetir contagem em meses vazios ou completar história com zero.
6. Manter separado o indicador de atividade `Synced File Count` dos relatórios
   Graph: ele conta arquivos sincronizados no recorte publicado, não tentativas
   do cliente. R3 aceita define a série azul em dispositivos/clientes Health,
   sem reutilizar essa contagem de arquivos. Evitar razão de “falhas/tentativas”
   com numeradores e denominadores de fontes/semânticas diferentes.

### Série azul — R3 aceita

Selecionar a última fotografia Health íntegra cuja referência esteja no mês.
T vem da referência factual/admitida daquele run, não do horário do browser.
Deduplicar por `OneDriveDeviceId` e contar os clientes com
`LastSyncedTimestampUTC` em `(T-30dias,T]`. A definição primária desse timestamp
é quando o cliente reportou estar atualizado, não momento de transferência de
arquivo. A unidade é clientes OneDrive observados; não deduplicar por nome nem
generalizar a inventário físico. Datas/identidades omitidas deixam coverage
parcial; incompatibilidade estrutural do perfil/run impede publicação, mantendo
a última válida. Zero exige fotografia íntegra sem qualificantes desconhecidos.

O mapping local publica `syncTrend.syncedDevices`; Errors publica
`syncTrend.reportedErrors`, com referências/availability independentes. São
contagens de fotografias rolling30dias, não taxas de tentativas nem somas de
eventos exclusivos do mês. Os antigos `syncOperations`/`failures` da fixture
histórica não são fonte dessas novas medidas. O KPI de arquivos sincronizados
continua vindo de Reports. Usar os exports/perfis já selecionados, sem nova
rota Graph, operação no Simulator ou execução de tenant nesta revisão.

Pré-requisitos de implementação, sem alegação de estado de tenant: habilitar
reports nos clientes; registrar/aprovar aplicação Data Connect; configurar
compute/storage na região compatível e no mesmo Entra tenant; conceder a role
de armazenamento necessária; executar export inicial e validar seu schema.
Uma validação de entrada implementável não comprova a compatibilidade do
`v1` antes desse export. A ausência de run inicial e a validação oficial do
perfil/schema são pré-requisitos operacionais por conexão para habilitar a
publicação do importer aprovado. Não representam afirmação de compatibilidade
estática `v1`; não é necessário inventar rota REST no OpenAPI ou Simulator.

## Estratégia aprovada: importer tipado com perfil oficial de onboarding

A investigação adicional em [API](api.md#investigação-adicional-do-schema-de-erros--14102026)
confirma que o catálogo associa `v1` ao schema publicado, apesar do título
`v0`. Não há schema `v1` independente encontrado nem garantia de manifesto
Microsoft completo em cada run. Um recurso ADF/Synapse com `schema: []` não
pode cumprir sozinho a validação do formato.

É possível implementar um importer tipado sem fixar nomes hipotéticos de
campos `v1`: separar o perfil de entrada de export do contrato normalizado
Orkestria. Essa estratégia preserva erro por dispositivo, código, título,
descrição, recorrência e tendência rolling30d. Essa estratégia foi aprovada
pelo usuário na Q3 de 14/10/2026, incluindo a validação do perfil e do primeiro
run completo no onboarding da fonte.

1. Obter do dataset realmente anunciado pela plataforma o nome/versão,
   Schema e colunas selecionáveis no fluxo oficial de onboarding. Registrar
   essa evidência sem valores de usuários/dispositivos e vinculá-la à aplicação,
   compute e armazenamento aprovados para aquele tenant.
2. Aprovar um perfil imutável de mapeamento, com hash/revisão e procedência:
   cada fato semântico requerido (`deviceKey`, código/chave do tipo de erro,
   título, descrição e contagem) aponta explicitamente para uma ou mais
   colunas da origem, seus tipos e conversões permitidas. `OneDriveDeviceId`
   é o vínculo documentado expressamente pelo Learn para `v1`; os demais nomes
   devem vir do schema dessa origem/referência primária, sem adivinhação por
   posição, regex ou nomes parecidos. Não inventar `ErrorTypeId`, renomear
   `SyncErrorId` ou assumir conversão de versões.
3. Validar uma primeira extração completa contra o perfil e o contrato
   normalizado. Um tipo não compatível, coluna sem evidência semântica,
   campo requerido não mapeado, divergência de tenant, nome/versão ou schema
   impede a promoção. Resultado vazio não dispensa a validação do schema e do
   perfil; não é usado para inferir campos ausentes ou nulabilidade.
4. O exporter pode acompanhar os runs com um manifesto **local de integração**
   contendo versão, perfil/schema hash, colunas, referência temporal, lista e
   hashes dos arquivos e status de conclusão. Esse manifesto é produzido e
   autenticado pela integração aprovada; não deve ser rotulado como contrato
   de manifesto fornecido pela Microsoft. A evidência de origem continua o
   dataset/schema oficial e a configuração aprovada do pipeline.
5. O importer recebe o perfil aprovado e publica o contrato tipado Orkestria
   somente quando o run inteiro o satisfizer. Schema novo/alterado exige
   onboarding de perfil, preserva a publicação anterior e declara causa de
   incompatibilidade; não converte erro de entrada em zero ou sucesso.

Essa separação permite codificar e revisar a infraestrutura de importação,
normalização e publicação agora. A validação oficial do perfil e da primeira
extração é critério operacional por conexão, assim como consentimento e
setup do pipeline, conforme a estratégia de integração aprovada na Q3. Ela não
transforma a hipótese `v0=v1` em fato nem comprova, nesta investigação, um
adapter estático `v1` com todos os campos já observados. A escolha preserva o
outcome completo: nenhum campo de erro é descartado por falta de mapping e
nenhum perfil incompleto é aceito como fonte saudável.

## Investigação A3 — estados, identidade e universo dos clientes — 14/10/2026

**Resultado: evidência técnica consolidada; disposição C2 aceita A abaixo.**
A investigação não comprovou os estados instantâneos; o usuário aprovou a
revisão expressa de escopo para saúde diária, preservando os fatos sustentados.
A fixture registra o que a UI espera; não define a identidade de dispositivos
Microsoft nem uma máquina de estados da origem.

### Capacidade comprovada e limite de correlação

| Fato esperado | Evidência primária e normalização sustentada | Limite restante |
| --- | --- | --- |
| Cliente, versão, Windows/Mac, última informação de atualização | Export Health, por `OneDriveDeviceId`; a R3 continua contando clientes observados, com referência e cobertura próprias | `OSName` não diferencia notebook e desktop nem constitui inventário físico completo |
| Erros por cliente e detalhe/recorrência | Health fornece `TotalErrorCount`; Errors associa detalhes pela mesma `OneDriveDeviceId`, com run/perfil compatível | Quantidade no snapshot e recorrência rolling30dias não demonstram um estado de execução ao vivo nem substituem uma à outra |
| `synced` | `LastSyncedTimestampUTC` demonstra que o cliente **reportou estar atualizado naquele instante** | Não demonstra que continua atualizado agora; a regra R3 de 30 dias é uma medida histórica aprovada, não um estado instantâneo |
| `syncing`, `paused`, `notConfigured` | Nenhum campo com essas semânticas foi localizado no schema Health pinado nem no fluxo público de export selecionado | Tempo sem reporte, zero erros e ausência no export não comprovam esses estados; a enumeração da fixture não é evidência de provider |
| Conformidade, gerenciamento, risco Intune por cliente OneDrive | `/deviceManagement/managedDevices` publica fatos de dispositivos Intune, `id` e `azureADDeviceId` | Health não publica esses identificadores nem documenta equivalência com `OneDriveDeviceId`. Não unir por nome, pessoa, SO ou proximidade temporal; cliente sem vínculo factual fica sem enriquecimento |
| Notebook/Desktop | A propriedade `chassisType` de `managedDevice` **beta** distingue `laptop` e `desktop` | É candidato documentado, ainda não selecionado/validado para esta extensão. Depende de uma correlação factual com o cliente; `deviceType=desktop`, SO e nome/modelo não são substitutos |
| KFM por pasta | Health publica `KFMEnabledFolders`: `0` não configurado, `1` Documents, `2` Pictures, `3` Desktop | Preservar enumeração conhecida, separar outras/ausentes; não inferir aplicação pelos booleanos de GPO. Um conjunto desconhecido não prova nenhuma pasta nem todas |

O guia [Sync Health](https://learn.microsoft.com/en-us/sharepoint/sync-health?tabs=windows)
documenta reporte condicionado à habilitação nos clientes e expiração de
registros do inventário após 30 dias. Clientes sem sessão ou sem tempo ligado
suficiente podem não reportar. A consequência para a projeção é estrita:
ausência da linha não comprova cliente não configurado nem dispositivo não
gerenciado. Os timestamps publicados continuam referências de um reporte,
sem equipará-los a observação contínua.

### KFM: perfil, cardinalidade e denominadores

O [schema Health pinado](https://github.com/microsoftgraph/dataconnect-solutions/blob/6f75a7ce78d53a8a81588289d688230d2fc336b2/Datasets/data-connect-dataset-onedrivesynchealth.md)
declara `KFMEnabledFolderCount` na tabela, mas seus samples usam
`KFMFolderCount`; alguns incluem `KFMState` sem definição de enumeração, e o
sample apresenta diferença de grafia/espaço no timestamp. Esses exemplos não
autorizam alias automático, decodificação do inteiro `KFMState` ou remoção
silenciosa de espaço no nome de uma coluna do export real. Estender a admissão
por perfil imutável ao Health: verificar nomes, tipos, semântica, pasta por
pasta, timestamps e consistência de contagem no schema oficial anunciado e no
primeiro run completo. Divergência sem mapping aprovado impede a promoção do
run, preservando a última publicação válida. Não presumir `v0=v1` para Errors.

O fato primário é o conjunto de pastas de cada cliente. Se um booleano de
aplicação significar **ao menos uma pasta**, seu critério deve ser explicitado
como tal no contrato; ele não pode substituir o critério já aprovado do score
de segurança: **Desktop, Documents e Pictures** nos clientes Windows elegíveis
que suportem as três. Contagens de pessoas, clientes e pastas são universos
diferentes: pessoas exigem identidade de usuário resolvida, são deduplicadas e
não podem ser obtidas pela soma de pastas/clientes. O universo de observação é
o export admitido, não todos os dispositivos ou usuários do tenant. A regra de
agregação de `kfmSummary`/booleano genérico é distinta do score: `applied`
conta clientes observados com ao menos uma pasta conhecida protegida. `total`
conta clientes cujo conjunto KFM é avaliável no perfil; cada pasta publica seu
universo suportado/avaliado e os clientes que a incluem. Conjunto/capacidade
desconhecidos reduzem cobertura, sem afirmar não aplicação. Pessoas, quando
exigidas em outra métrica, deduplicam a identidade factual do usuário; não
somar clientes/pastas como pessoas. O score mantém as três pastas nos clientes
Windows elegíveis. Nenhum booleano de GPO substitui aplicação observada.

### Fontes complementares avaliadas

1. **Intune beta — candidato específico a chassi.** A
   [entidade `managedDevice`](https://learn.microsoft.com/en-us/graph/api/resources/intune-devices-manageddevice?view=graph-rest-beta)
   documenta `chassisType`; `laptop → notebook`, `desktop → desktop`, demais
   valores/ausência permanecem explicitamente outros/desconhecidos conforme
   contrato a aprovar. Uma extensão candidata usaria `GET` em
   `graph.microsoft.com`, versão `beta`, `/deviceManagement/managedDevices`,
   `$top=25`, `$select=id,azureADDeviceId,chassisType`, `Accept:
   application/json`, permissão de aplicação
   `DeviceManagementManagedDevices.Read.All`, consentimento administrativo e
   Intune ativo. Seguir `@odata.nextLink` opaco; erros de acesso/licença não são
   zero. A origem é complementar ao inventário canônico, não coleta por tela.
   Esta investigação comprova o campo documentado, **não** uma resposta
   autenticada, uma correlação Health–Intune ou a seleção da operação. Portanto
   a extensão permanece candidata, fora do OpenAPI/Simulator até seleção e
   validação coordenada.
2. **Cloud Files/WinRT local Windows — não é API de tenant.** O SDK Windows
   documenta `StorageProviderState` e o container de UI de provider; Cloud Files
   publica `ProviderStatus`. São interfaces locais de provider, não export
   app-only de OneDrive/Graph. Não foi demonstrado contrato público que permita
   a um coletor externo obter os cinco estados exigidos do cliente OneDrive,
   resolver os dois IDs e cobrir também Mac. Seu nome/enumeração não torna essa
   alternativa viabilizada. Adoção de telemetria de estação exigiria decisão de
   escopo, fonte sustentada, validação e contrato próprios; não foi adotada.
3. **Endpoint interno do portal.** Continua rejeitado pelos motivos já
   documentados; não usar token de sessão manual nem scraping como fonte.

### Disposição C2 aceita A — saúde diária

O usuário aprovou a [revisão expressa](../backend-defaults-e-clarificacoes.md#c2--estados-instantâneos-e-correlação-de-dispositivos-aceita-a)
em2026-10-14. Não há estados instantâneos neste recorte nem join Health–Intune.
Aplicar ao último run Health íntegro/perfil admitido, com T factual e chave
única `OneDriveDeviceId`:

1. `TotalErrorCount>0` inteiro válido → `errorReported` — Erro reportado.
2. `TotalErrorCount=0` e `LastSyncedTimestampUTC` válido em `(T-30dias,T]`
   → `upToDateReported` — Atualizado reportado nos últimos30dias.
3. `TotalErrorCount=0` e timestamp válido `<=T-30dias`
   → `notRecentlyUpdatedReported` — Sem atualização reportada nesse prazo.
4. Campo necessário ausente, contador inválido, timestamp futuro ou identidade
   ambígua → não avaliado com coverage, não Pausado/Não configurado.

Erro precede os outros critérios; mesmo cliente conta uma vez. Denominador da
distribuição = classificados, contagens inteiras e percentuais do contrato;
zero exige população íntegra. Preservar referência, eligible/observed/classified
e desconhecidos, sem transformar 30dias em SLA de funcionamento do cliente.
`TotalErrorCount` classifica esta fotografia; os detalhes e a série vermelha
continuam Errors com semântica própria, sem substituição de um pelo outro.

`devices` publica clientes Health; `managedDevices` publica Intune, por `id`
canônico, em coleção própria. `userId` pode relacionar dispositivo Intune à
pessoa, sem afirmar que é o mesmo aparelho da linha Health. `lastSyncDateTime`
permanece Intune; não substitui `LastSyncedTimestampUTC`. Tipo físico sem fonte
selecionada permanece nulo. Chassi beta foi avaliado como candidato e fica
**não selecionado neste recorte**, sem request ou operação nova. APIs Windows
locais e endpoint privado continuam rejeitados para esta estratégia.

O fator de dispositivos de Segurança usa CA e a população Intune publicada,
sem ponte ao Health. Recomendações/riscos que exigem vínculo de evento a
dispositivo continuam condicionais a evidência própria de identidade; C2 não
transforma associação por pessoa em correlação de aparelho. Sem evidência,
não disparar a regra. Isso preserva os fatores obrigatórios do detector de
possível ransomware, sem fabricar o terceiro fator.

A3 fica resolvida para o recorte aprovado. Health/Errors, R3 e Intune são
fontes existentes; não houve chamada de tenant, nova API ou alteração de
Simulator por C2. A implementação futura reconciliará os bindings novos,
sem reinterpretar os cinco estados da fixture histórica.

## B1 — benefícios: C3/C4 aceitas

### C3 — armazenamento utilizado no OneDrive

**Decisão aceita pelo usuário em2026-10-14:** substituir o volume “Dados
protegidos na nuvem” por “Armazenamento utilizado no OneDrive”. Reutilizar a
publicação canônica de [Contas e Armazenamento](../contas-e-armazenamento/fontes-e-viabilidade.md),
sem nova coleta de Graph, export, leitura de estação ou soma pelo frontend.

| Fato semântico | Origem e transformação | Referência, ausência e limite |
| --- | --- | --- |
| `benefitMetrics.storageUsedBytes.value` | Cópia exata de `summary.storageUsedBytes.value` da projeção canônica de Contas; fonte externa `Storage Used (Byte)` do report de uso já selecionado/validado. Sem somar páginas ou aplicar filtros de atividade. | Mesma população e geração factual do agregado de origem. Não é soma de `driveItem.size`, volume de backup ou aplicação de KFM. |
| `unit` | Constante semântica `byte`; inteiro não negativo sem arredondamento de bytes. | Formatação de armazenamento pertence à apresentação; não alterar a grandeza para reproduzir o exemplo sintético. |
| `asOf`, `coverage`, `availability` | Reutilizar metadados factuais da publicação canônica, incluindo referência derivada de `Report Refresh Date` com a precisão de data realmente publicada. | Atraso/restrição/falha não viram zero. Preservar a última publicação válida e seu frescor; não usar horário de download como referência do conteúdo. |

O universo de ocupação de Reports pode incluir versões/lixeira; não removê-las
ou substituí-las pela soma dos arquivos atuais. D7/D30/D90/D180 e filtros de
departamento/pessoa/dispositivo da atividade não recalculam o total global.
Zero exige publicação íntegra comprovando zero no universo canônico. Não há
comparação histórica nova nesse benefício nem leitura externa redundante para
a aba. A coleta canônica retém sua cadência e estratégia de falha já aprovadas.

O binding `benefitItems[id=protected-data]` e o valor da fixture permanecem
históricos. O novo `benefitMetrics.storageUsedBytes` só é materializado na
integração conforme contrato/adendo do blueprint. A contagem de clientes com
pastas protegidas continua usando `kfmSummary.applied`, pelo critério C2 de ao
menos uma pasta conhecida protegida por cliente avaliado. O percentual tem
decisão própria C4 aceita abaixo; não inferir tentativas/sucesso de
`ErrorCount`, `TotalErrorCount` ou arquivos sincronizados.

### C4 — clientes com atualização recente e sem erro reportado

**Decisão aceita pelo usuário em2026-10-14:** usar a proporção do estado
`upToDateReported` dentro dos três estados de saúde diária C2, substituindo a
taxa de sucesso de tentativas da imagem05. Reutilizar a mesma projeção local
Health/Errors já selecionada; o cálculo deste percentual usa Health, sem exigir
Errors para simular um denominador de tentativas.

| Fato semântico | Origem e transformação | Limite |
| --- | --- | --- |
| `benefitMetrics.recentHealthyClientsPercent.value` | Último run Health íntegro/perfil admitido. U = cardinalidade de `OneDriveDeviceId` únicos em `upToDateReported`; C = cardinalidade dos clientes únicos em `errorReported`, `upToDateReported` e `notRecentlyUpdatedReported`. Publicar `100 × U / C`, com uma casa decimal, half-up. | Predicados e T factuais são exatamente C2; erro precede os demais estados. Sem identidade/campos necessários, preservar não avaliado e cobertura. C=0 resulta nulo. |
| `unit`, `asOf`, `coverage`, `availability` do percentual | Unidade `percent`; referência T do run admitido, quantidade de elegíveis/observados/classificados/desconhecidos e estado da publicação Health. | É percentual dos classificados na fotografia, não de transferências nem de todos os endpoints. D7/D30/D90/D180 não alteram a razão. |
| `benefitMetrics.protectedFolderClients` | `value = kfmSummary.applied`; `unit: client`, com referência/cobertura/disponibilidade KFM próprias. | Pelo critério C2, conta clientes observados com ao menos uma pasta conhecida protegida, sem somar pastas ou inferir dispositivos físicos. Não exige as três pastas do score. |

Os três benefícios têm publicações independentes. Falha no agregado Reports
não apaga KFM/Health válidos; ausência de Health não torna o volume de Reports
zero. Snapshot inválido mantém a última publicação válida e seu frescor.
Percentual parcial explicita que usa classificados; zero requer U=0 factual e
C>0 avaliado no universo declarado. Não reproduzir o93% ou demais números da
fixture. Não há nova API, export, coleta redundante, comparação histórica ou
alteração dos pesos/R3 nesta disposição. B1 fica resolvido no recorte C3/C4
aceito; a integração materializa os novos bindings/rótulos do contrato e
blueprint, mantendo os exemplos históricos isolados.
