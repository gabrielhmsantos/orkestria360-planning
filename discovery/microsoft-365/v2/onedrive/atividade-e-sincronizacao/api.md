# API — Atividade e Sincronização

Graph v1.0, `GET /reports/getOneDriveActivityUserDetail(period='{period}')`, com `period` em `D7`, `D30`, `D90` ou `D180`; as séries selecionadas continuam `getOneDriveActivityUserCounts(period='D180')` e `getOneDriveActivityFileCounts(period='D180')`. As três rotas usam `Accept: text/csv`, `Reports.Read.All` e `302 Location` para CSV pré-autenticado. O detalhe contém UPN e métricas de visualização/edição, sincronização e compartilhamento; contagens são agregadas.

Para `getOneDriveActivityUserDetail(period='D30')`, a coleta sanitizada observou `302 → 200 application/octet-stream`, UTF-8 com BOM, 11 colunas e zero linhas malformadas: `Report Refresh Date` (`date`), `User Principal Name` (`string`), `Is Deleted` (`boolean`), `Deleted Date` (`empty` na amostra e anulável), `Last Activity Date` (`date`, anulável), `Viewed Or Edited File Count`, `Synced File Count`, `Shared Internally File Count`, `Shared Externally File Count`, `Report Period` (`integer`) e `Assigned Products` (`string`, anulável). UPN, produtos e métricas por pessoa são PII; arquivo e URL pré-autenticada são descartados.

`getOneDriveActivityUserCounts(period='D180')` e
`getOneDriveActivityFileCounts(period='D180')` também foram validados nas duas
conexões pelo mesmo fluxo `302 → 200 application/octet-stream`. Ambos possuem
CSV UTF-8 com BOM, sete colunas e 180 linhas de série: `Report Refresh Date`,
`Viewed Or Edited`, `Synced`, `Shared Internally`, `Shared Externally`, `Report
Date` e `Report Period`; as quatro métricas são anuláveis. Isso sustenta série
agregada, não estado de dispositivo, falha detalhada ou KFM.

<a id="b3-periodos-do-relatorio-de-atividade"></a>

## B3 — períodos do relatório de atividade por usuário

| Item | Contrato externo |
| --- | --- |
| Provider / método / host | `graph`; `GET https://graph.microsoft.com/v1.0` |
| Path | `/reports/getOneDriveActivityUserDetail(period='{period}')` |
| Parâmetro de função | `period` obrigatório no path: `D7`, `D30`, `D90`, `D180`. Não é query HTTP adicionada ao path nem quatro endpoints diferentes. |
| Query / body | Nenhum. A variante oficial por `date` não foi selecionada para B3. |
| Audience / scope | `https://graph.microsoft.com`; client credentials com `https://graph.microsoft.com/.default`. |
| Permissão de aplicação | `Reports.Read.All`, com consentimento administrativo; o parâmetro de período não muda a permissão ou o schema. |
| Headers selecionados | `Accept: text/csv`; autenticação Bearer somente na chamada Graph. `If-None-Match` é opcional no serviço, não integra a assinatura selecionada. |
| Sucesso externo | `302` com `Location` HTTPS pré-autenticado e efêmero; segundo GET sem `Authorization`, retornando CSV `200 application/octet-stream` conforme a observação existente. Não persistir URL nem conteúdo bruto. |
| Erros | `401`, `403`, `429` e falhas transitórias não são CSV vazio nem métricas zero. Respeitar `Retry-After` quando publicado. |
| PII | UPN, produtos atribuídos e métricas por usuário; dados reais não entram nas fixtures sintéticas. |

A [referência Microsoft](https://learn.microsoft.com/graph/api/reportroot-getonedriveactivityuserdetail?view=graph-rest-1.0)
documenta expressamente os quatro períodos com o mesmo fluxo de relatório e
as mesmas 11 colunas. A fonte canônica é o subset Graph v1.0 pinado em
`microsoftgraph/msgraph-metadata` revisão
`0d13ff1c5e4c8e5e3acc8200de615dfb36233395`.

| Período | Contrato oficial | Observação externa já existente |
| --- | --- | --- |
| D7 | Suportado; `Report Period = 7` no CSV desse recorte | Sem nova chamada nesta revisão; não declarar `200` observado. |
| D30 | Suportado; `Report Period = 30` | `302 → 200` e schema sanitizado observados anteriormente. |
| D90 | Suportado; `Report Period = 90` | Sem nova chamada nesta revisão; não declarar `200` observado. |
| D180 | Suportado; `Report Period = 180` | Sem nova chamada do **detalhe por usuário** nesta revisão. O sucesso D180 das séries de contagem não é observação deste endpoint. |

O CSV é interpretado pelo nome das colunas, sem depender da ordem entre
`Assigned Products` e `Report Period`; ambas estão no contrato oficial. O
período representa dias de agregação, não quantidade de linhas nem uma série
diária por usuário. Ausência/nulabilidade preservam seu significado. Valores
D7/D90/D180 não podem ser produzidos proporcionalmente a partir do CSV D30;
cada recorte é um relatório próprio, com sua `Report Refresh Date` e período.
Nenhuma diferença material de autenticação, schema ou transporte exige nova
coleta para esta lacuna estritamente sintética; B3 encaminha os quatro recortes
à mesma operação do Simulator, com exemplos coerentes e sem chamadas de tenant.

**Fechamento sintético B3:** a mesma operação
`graph.v1.report.onedrive-activity-user-detail` foi ampliada para os quatro
períodos. Cada fixture contém as 11 colunas e `Report Period` 7/30/90/180,
datas de última atividade dentro da janela ou ausentes e métricas inteiras
determinísticas, sem escalar D30. O smoke confirmou status/media type, headers
CSV, período, datas e métricas em cada recorte e rejeição sintética de D365
com `400 InvalidPeriod`. Geração, inventário (87 operações/53 caminhos Graph),
validação, importação dos cinco serviços, smoke e diff-check passaram. O
Simulator serve CSV sintético sem inventar `Location`; esse resultado não é
observação real de D7/D90/D180 nem altera o fluxo HTTP Microsoft documentado.

## Microsoft Graph v1.0 — inventário Intune

`GET /deviceManagement/managedDevices?$top=25&$select=id,userId,deviceName,azureADDeviceId,operatingSystem,lastSyncDateTime,complianceState,managementState,partnerReportedThreatState` retorna envelope OData de dispositivos Intune com `DeviceManagementManagedDevices.Read.All`. Pessoa, nome de dispositivo e identificadores são dados pessoais/identificadores técnicos e não são expostos sem projeção local. O `401` observado em uma conexão é condição de provider local, não coleção vazia nem estado do dispositivo. A rota e resposta `200` foram observadas; o Simulator agora diferencia essa projeção OneDrive da query `$top=100` emitida pelo app e contém cenário validado para cada seleção.

## Microsoft Graph Data Connect for SharePoint — OneDrive Sync Health

O contrato externo para telemetria detalhada de sincronização é o dataset
Microsoft Graph Data Connect, não Microsoft Graph REST nem uma API do Apps
Admin Center. A [orientação oficial de Sync Health](https://learn.microsoft.com/en-us/sharepoint/sync-health?tabs=windows),
revalidada em 14/10/2026, identifica os datasets de exportação atuais como
`BasicDataSet_v0.OneDriveSyncHealth_v1` e
`BasicDataSet_v0.OneDriveSyncErrors_v1`. O repositório Microsoft
`microsoftgraph/dataconnect-solutions` ainda publica o schema detalhado de
erros com nome `BasicDataSet_v0.OneDriveSyncErrors_v0`. Sua revisão `main`,
consultada de novo nessa data, continua
`6f75a7ce78d53a8a81588289d688230d2fc336b2`.

O primeiro é snapshot diário, sem delta, e tem um registro por cliente OneDrive
com report habilitado. Campos relevantes: `OneDriveDeviceId`,
`SyncAppVersion`, `SyncAppUpdateRing`, `OSName`, `OSVersion`,
`KFMOptInWithWizardGPOEnabled`, `KFMSilentOptInGPOEnabled`,
`KFMEnabledFolders`, `KFMEnabledFolderCount`, `LastSyncedTimestampUTC`,
`LastStatusReportedTimestampUTC` e `TotalErrorCount`. O segundo contém um
registro por tipo de erro/dispositivo e cobre 30 dias, sem delta:
`OneDriveDeviceId`, `SyncErrorId`, `TaskDialogId1`, `TaskDialogId2`,
`ErrorTitle`, `ErrorDescription` e `ErrorCount`. Ambos incluem identificadores
e dados pessoais no schema completo; a coleta futura normaliza-os dentro do
limite tenant-scoped antes de publicar a projeção.

R3 aceita usa `OneDriveDeviceId` para a cardinalidade de clientes do snapshot
e `LastSyncedTimestampUTC` como último instante em que o cliente reportou estado
atualizado, conforme o schema primário. Não interpretar esse timestamp como
transferência de arquivo nem substituir por `lastSyncDateTime` do Intune. A
projeção mensal/dispositivos e suas unidades estão no contrato/mapping da aba;
o contrato de export externo não foi alterado.

A entrega é assíncrona em armazenamento Azure, mediante configuração de Graph
Data Connect; logo não há método, host, query, paginação HTTP ou resposta ao
vivo para registrar em `openapi.yaml`. A validação por GET não se aplica. O
catálogo atual e a orientação de Sync Health concordam em `OneDriveSyncErrors_v1`;
o schema detalhado público pinado permanece `v0`. Isso é uma divergência
documental verificável, não prova que as duas versões tenham schemas idênticos.
O [catálogo oficial](https://learn.microsoft.com/graph/data-connect-datasets)
instrui consultar a aba Schema do dataset no Azure Data Factory/Synapse para
obter seu schema. O nome anunciado pela origem e esse schema devem acompanhar
a exportação. Não renomear export `v0` para `v1` nem aprovar `v1` apenas pelo
schema `v0`.

Evidência pinada, revalidada em 14/10/2026:

| Documento Microsoft | SHA-256 do documento bruto na revisão acima |
| --- | --- |
| [OneDriveSyncHealth_v1](https://github.com/microsoftgraph/dataconnect-solutions/blob/6f75a7ce78d53a8a81588289d688230d2fc336b2/Datasets/data-connect-dataset-onedrivesynchealth.md) | `ef4a9cb1a9da2b0890a8e9bb95db42a21cae26fa3f24cc01a8414d492668a3c8` |
| [OneDriveSyncErrors_v0](https://github.com/microsoftgraph/dataconnect-solutions/blob/6f75a7ce78d53a8a81588289d688230d2fc336b2/Datasets/data-connect-dataset-onedrivesyncerrors.md) | `134ac35f422af34c7019b2436d96637abd8a0afeac1a6e41042bc4c255943fbb` |

A orientação oficial descreve extração de saúde diária e erros dos 30 dias
anteriores, ambas sem delta. Copy Activity produz JSON. O export precisa de
run próprio e dados de extração para conservar história sem somar janelas
sobrepostas. A recorrência de `ErrorCount` não publica timestamp de cada erro;
`LastSyncedTimestampUTC` e `LastStatusReportedTimestampUTC` pertencem ao estado
de saúde, não ao instante de ocorrência dos erros. A implementação de uma
validação de entrada pode ser planejada agora; a compatibilidade exata do
schema `v1` continua sem amostra/schema primário exportado nesta investigação.

### Investigação adicional do schema de erros — 14/10/2026

O [catálogo primário pinado](https://github.com/microsoftgraph/microsoft-graph-docs-contrib/blob/70f4b4eecebce12fcb20dae6b2a542c5ea57b6e2/concepts/data-connect-datasets.md)
associa expressamente `OneDriveSyncErrors_v1`, na coluna `Sample and Schema`,
ao arquivo `Datasets/data-connect-dataset-onedrivesyncerrors.md` do repositório
Microsoft. Portanto, existe referência primária de schema associada pelo
publicador ao `v1`; o título interno `v0` dessa referência é a inconsistência
documental. Ela não deve ser apresentada como prova independente de que
`v0` e `v1` sejam idênticos. SHA-256 do catálogo nessa revisão:
`52b105eded4c9c7d1acbb390318bb6349182dea0df4d2c79fe5abcaee1752907`.

Foram verificados os seguintes caminhos primários:

| Caminho | Evidência encontrada |
| --- | --- |
| Sync Health atual no Learn, seção Export | Nome `v1`, vínculo por `OneDriveDeviceId`, JSON via Copy Activity, janela de erros de 30 dias, ausência de delta e conservação por extração |
| Catálogo Graph no Learn e markdown pinado acima | Linha `v1` aponta para o documento cujo título interno continua `v0`; orienta consultar Schema no Data Factory/Synapse |
| Árvore completa do repo `dataconnect-solutions` no commit pinado | Somente dois documentos com nome OneDrive; nenhum arquivo independente de schema/sample `Errors_v1` |
| Conteúdo dos samples/templates e documentos desse repo | Busca em 1.100 arquivos textuais elegíveis de até 2 MB encontrou referência a Errors somente no documento `v0`; essa busca não abrange conteúdo binário nem arquivo textual maior que 2 MB |
| Tutorial oficial Microsoft Community Hub de Sync Health | Nome `v1` remete ao mesmo caminho de schema; não oferece sample de erro `v1` independente |
| Contrato público `Office365Dataset` e samples ADF/Synapse | `tableName` identifica o dataset; `schema`/`structure` são propriedades de authoring e podem estar vazias; não constituem descoberta automática garantida do schema atual do serviço |

O [connector Microsoft 365](https://learn.microsoft.com/en-us/azure/data-factory/connector-office-365)
documenta `outputColumns` e mostra `schema: []` no exemplo de dataset.
[Office365Dataset no REST ADF](https://learn.microsoft.com/en-us/rest/api/datafactory/datasets/get?view=rest-datafactory-2018-06-01)
documenta `schema` e `structure`, mas não promete que o recurso contenha todas
as colunas anunciadas pela origem. Os
[samples oficiais](https://github.com/microsoftgraph/dataconnect-solutions/blob/6f75a7ce78d53a8a81588289d688230d2fc336b2/solutions/conversation-lineage/arm/End2EndMgdc101WithConvLineage/dataset/M365_Emails.json)
também usam `schema: []`. Não foi encontrado contrato público que garanta um
manifesto Microsoft de cada export com o schema completo de `Errors_v1`.

A documentação de [mapping do Copy Activity](https://learn.microsoft.com/en-us/azure/data-factory/copy-activity-schema-and-type-mapping)
permite importação e mapping explícito de colunas; schemas hierárquicos podem
ser inferidos por amostra e omitir campos que não apareçam nela. Essa inferência
isolada não é prova de nulabilidade, completude ou semântica do dataset.

O endpoint interno `https://clients.config.office.net/odbhealth/...`, descrito em
post de terceiros de 2022, foi avaliado e rejeitado: o próprio autor registra
mudança incompatível de resposta e dependência de token manual da sessão do
portal.

### Investigação A3 — capacidade dos schemas de cliente — 14/10/2026

Releitura integral do schema Health na revisão e hash já registrados acima,
com consulta ao [guia Microsoft Sync Health atual](https://learn.microsoft.com/en-us/sharepoint/sync-health?tabs=windows):

- `OneDriveDeviceId` é definido como identificador interno do OneDrive Sync.
  O join documentado com Errors usa esse campo. O documento não publica
  `azureADDeviceId`, `managedDevice.id`, chassi ou uma equivalência com IDs
  Intune/Entra.
- Nenhum campo publicado declara `syncing`, `paused` ou `notConfigured`.
  `LastSyncedTimestampUTC` registra quando o cliente reportou estar atualizado;
  não informa continuamente seu estado atual. `TotalErrorCount` é sinal no
  snapshot, não enumeração de execução.
- A tabela declara `KFMEnabledFolderCount`, mas samples usam `KFMFolderCount` e
  alguns acrescentam `KFMState` sem enumeração documentada; há sample com espaço
  no nome do timestamp. O schema efetivamente anunciado pela origem deve
  resolver essas diferenças no perfil Health aprovado. Não instituir aliases
  com base nos samples, nem tratar um campo sem definição como estado do
  cliente. As regras independentes de admissão de Errors permanecem vigentes.

Uma fonte adicional foi identificada **como candidata, sem seleção nem coleta
autenticada nesta investigação**: a
[entidade `managedDevice` beta](https://learn.microsoft.com/en-us/graph/api/resources/intune-devices-manageddevice?view=graph-rest-beta)
documenta `chassisType`, que distingue `laptop` de `desktop`, com demais valores
explícitos. A leitura complementar candidata seria `GET
https://graph.microsoft.com/beta/deviceManagement/managedDevices?$top=25&$select=id,azureADDeviceId,chassisType`,
`Accept: application/json`, permissão de aplicação
`DeviceManagementManagedDevices.Read.All`, consentimento administrativo e
Intune ativo. O recurso usa envelope OData; links de continuação são opacos.
O campo `deviceType` descreve plataforma e não substitui chassi. Esse candidato
não fornece o vínculo com `OneDriveDeviceId`; não há nova operação aprovada
para registrar no OpenAPI ou entregar ao Simulator neste momento.

Também foram avaliadas as APIs locais Windows:

| Referência Microsoft | Contrato confirmado | Limite da candidatura |
| --- | --- | --- |
| [`StorageProviderStatusUI.ProviderState`](https://learn.microsoft.com/en-us/uwp/api/windows.storage.provider.storageproviderstatusui.providerstate?view=winrt-28000) e [`StorageProviderStatusUI`](https://learn.microsoft.com/en-us/uwp/api/windows.storage.provider.storageproviderstatusui?view=winrt-26100) | Estado do container de UI de um provider local, com enumeração incluindo InSync, Syncing e Paused | Não documentam endpoint de OneDrive tenant, export app-only ou descoberta dos estados de uma instância OneDrive por coletor externo |
| [`CF_SYNC_ROOT_STANDARD_INFO`](https://learn.microsoft.com/en-us/windows/win32/api/cfapi/ns-cfapi-cf_sync_root_standard_info) e [`CF_SYNC_PROVIDER_STATUS`](https://learn.microsoft.com/en-us/windows/win32/api/cfapi/ne-cfapi-cf_sync_provider_status) | Estrutura local de sync root contém `ProviderStatus`; enumeração do Cloud Filter não contém Paused | Não presumir equivalência com a enumeração da fixture, identidade OneDrive/Entra ou cobertura Mac |

Esses SDKs locais não foram selecionados como fonte; não representam rota
HTTP externa nem criam cobertura sintética de provider suportado. A avaliação
não afirma inexistência universal de soluções, apenas delimita o que os
contratos públicos consultados comprovam. A disposição semântica A3 foi
fechada pelo usuário na C2 A: saúde diária reportada, populações Health/Intune
separadas e fator de dispositivos limitado ao universo Intune publicado. O
candidato de chassi não foi selecionado neste recorte e não cria API nova.
O mapping e a decisão expressa estão em
[fontes e viabilidade](fontes-e-viabilidade.md#investigação-a3--estados-identidade-e-universo-dos-clientes--14102026).
