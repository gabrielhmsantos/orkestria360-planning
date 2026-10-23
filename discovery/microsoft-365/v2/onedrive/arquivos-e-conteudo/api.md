# API — Arquivos e Conteúdo

## Microsoft Graph v1.0

| Item | Contrato |
| --- | --- |
| Método / host | `GET https://graph.microsoft.com/v1.0` |
| Path | `/users/{user-id}/drive/root/delta` |
| Query | `$select=id,name,size,createdDateTime,lastModifiedDateTime,webUrl,file,folder,deleted,remoteItem,shared,malware,sharepointIds,parentReference` |
| Permissão app | `Files.Read.All` (ou escopo superior aceito pela Microsoft); consentimento administrativo. |
| Sucesso | `200 application/json`, envelope OData `value`, `@odata.nextLink` ou `@odata.deltaLink`; links são opacos. |
| Erros | `401`, `403`, `404`, `410`, `429` seguem erro Graph; `429` respeita `Retry-After`. |
| PII | nome, URL e identidade do criador/modificador, se selecionados/publicados. |

Observação técnica limitada: a query exata ampliada com `sharepointIds,parentReference` foi observada em `200 application/json`; o resumo sanitizado confirmou ambos os membros nos itens, sem expor seus valores aninhados. Outra tentativa retornou `404 ResourceNotFound` porque o usuário não possuía OneDrive provisionado. O validador também registrou `Files.Read.All` ausente na claim `roles`; o `200` comprova o shape/query observado, não o consentimento da permissão mínima requerida.

`sharepointIds` é solicitado para obter os identificadores SharePoint do OneDrive empresarial; o objeto e seus membros são opcionais. `siteId` é o GUID da **site collection (SPSite)** e `webId` é o GUID do **site (SPWeb)**. O ID usado em `/sites/{site-id}` é composto por `hostname,siteId,webId`; obter o hostname de `siteUrl` publicado, validar que pertence ao site correlacionado e codificar o ID composto como um único parâmetro do path. `siteId` isolado não equivale ao ID Graph completo. OneDrive pessoal não publica essa faceta. Sem a tupla completa, a lixeira daquele drive fica indisponível, não vazia. [Recurso `driveItem`](https://learn.microsoft.com/graph/api/resources/driveitem?view=graph-rest-1.0), [recurso `sharepointIds`](https://learn.microsoft.com/graph/api/resources/sharepointids?view=graph-rest-1.0) e [ID de site](https://learn.microsoft.com/graph/api/resources/site?view=graph-rest-1.0#id-property).

`parentReference` integra agora a query final: a variante ampliada já teve
observação sanitizada de `200` com esse membro, sem nova chamada real nesta
revisão. Seu `id` da pasta pai sustenta reconstrução local da hierarquia para
localização, busca e agrupamento por pasta. A Microsoft informa que
`parentReference.path` não tem valor em delta; não aguardar esse campo para
construir o caminho. Renomear uma pasta também não retorna seus descendentes,
que devem ter caminhos recalculados pela relação de IDs local. O objeto é
opcional; campos omitidos num delta preservam a última relação publicada. O `driveId` desse objeto pode
reforçar a correlação, mas a descoberta de drive sem itens continua usando a
coleção complementar. `parentReference.siteId`, quando presente, já é ID Graph
composto; não confundir com `sharepointIds.siteId` GUID. [Recurso itemReference](https://learn.microsoft.com/graph/api/resources/itemreference?view=graph-rest-1.0)
e [limitações do delta](https://learn.microsoft.com/graph/api/driveitem-delta?view=graph-rest-1.0#remarks).

O inventário canônico usa somente o delta de raiz. `GET /drives/{drive-id}/items/{driveItem-id}/delta()` é uma alternativa não selecionada; `GET /drives/{drive-id}/items/{driveItem-id}` e `/children` foram usados apenas como verificações auxiliares com recursos resolvidos e não são pré-requisitos nem fontes paralelas do inventário. Para identificar o drive mesmo sem itens, a leitura complementar selecionada é a coleção `GET /users/{user-id}/drives`; ver abaixo.

## Microsoft Graph v1.0 — identificação de drives (fonte selecionada)

| Item | Contrato |
| --- | --- |
| Método / host | `GET https://graph.microsoft.com/v1.0` |
| Path | `/users/{user-id}/drives` |
| Query | `$select=id,driveType,sharepointIds,owner,webUrl,system` |
| Permissão app mínima | `Files.Read.All`; superiores documentadas: `Files.ReadWrite.All`, `Sites.Read.All`, `Sites.ReadWrite.All`, com consentimento administrativo. |
| Sucesso | `200 application/json`, envelope OData `value[]` de `drive` e `@odata.nextLink` quando paginado. `owner`, `system` e identificadores SharePoint são opcionais. |
| Erros | `401`, `403`, `404`, `429` seguem erro Graph; `404` pode indicar OneDrive não provisionado. |

Em 2026-10-14, a coleta GET sanitizada da query selecionada observou `200`
OData com `value[]` e chaves `id`, `webUrl`, `driveType`, `owner`,
`sharePointIds`, `system`; outra tentativa recebeu `404 ResourceNotFound` por
mysite ausente. A resposta usou `sharePointIds`, embora o recurso documente
`sharepointIds`; o parser reconhece ambas as grafias sem inventar campo ausente.
O resumo de roles marcou `Files.Read.All` ausente, mas não aferiu as alternativas
superiores aceitas. Falta da role mínima isolada é condição de acesso local,
não invalidação da fonte. [List drives](https://learn.microsoft.com/graph/api/drive-list?view=graph-rest-1.0)
documenta aplicação e a coleção; [drive](https://learn.microsoft.com/graph/api/resources/drive?view=graph-rest-1.0)
documenta os campos. Fonte canônica: `microsoftgraph/msgraph-metadata`, revisão
`0d13ff1c5e4c8e5e3acc8200de615dfb36233395`, subset v1.0.

### Evidência auxiliar não selecionada — rota singular

`GET /users/{user-id}/drive?$select=id,driveType,sharePointIds` teve observações
limitadas `200` e `404 ResourceNotFound`. Entretanto, a referência atual
[Get drive](https://learn.microsoft.com/graph/api/drive-get?view=graph-rest-1.0)
declara autenticação de aplicação **não suportada**, e provisionamento
automático pode ocorrer em delegated para usuário licenciado. A indicação
anterior de `Files.Read.All` app-only foi corrigida. A rota singular permanece
como evidência auxiliar e contrato delegated não selecionado; não é dependência
da implementação app-only.

Para candidatos a duplicidade, a coleta lê somente `file.hashes.quickXorHash` quando o facet `file` o publicar. O valor não é exposto à UI: ele serve para o agrupamento por igualdade de hash definido no contrato semântico, sem afirmar verificação byte a byte.

Para infecção, a coleta seleciona a faceta `malware`; a documentação Graph a define como indicação de malware detectado no item. Essa faceta não é um resultado DLP e não deve ser convertida em classificação de sensibilidade.

## Microsoft Graph v1.0 — extração de rótulos de sensibilidade

| Item | Contrato |
| --- | --- |
| Método / host | `POST https://graph.microsoft.com/v1.0` |
| Path | `/drives/{drive-id}/items/{driveItem-id}/extractSensitivityLabels` |
| Body | Nenhum. |
| Permissão app mínima | `Files.Read.All`, com consentimento administrativo. |
| Sucesso | `200 application/json`, `value.labels[]` com `sensitivityLabelId` e `assignmentMethod`. |
| Erros | `401`, `403`, `404`, `423`, `429` seguem erro Graph; `423 Locked` não é ausência de rótulo e `429` respeita `Retry-After`. |
| PII | o próprio rótulo e o item associado podem expor classificação de conteúdo. |

O endpoint pode atualizar o metadado de sensibilidade quando o conteúdo do arquivo tiver mudado desde a última extração. Ele só é chamado pelo futuro coletor sobre o escopo explicitamente configurado; a UI não o aciona. A permissão mínima de aplicação documentada é `Files.Read.All`; `SensitivityLabel.Evaluate` não é a permissão deste endpoint. O Simulator representa a requisição POST e seus cenários sintéticos, sem executar nenhuma operação real. A coleta temporária é GET-only; o `200` permanece sem observação técnica local e `x-observed: false`. Contrato primário, schema canônico e o qualificador `mutation_approved` existente definem a integração para implementação; executar um POST real fora da coleta GET não é condição para validar o contrato de Discovery. `423` distingue `fileDoubleKeyEncrypted`, `fileDecryptionNotSupported` e `fileDecryptionDeferred`; conservar o erro original em vez de publicar “sem rótulo”. Aplicável apenas às extensões suportadas e não a containers SharePoint Embedded. [Documentação oficial](https://learn.microsoft.com/graph/api/driveitem-extractsensitivitylabels?view=graph-rest-1.0).

## Microsoft Graph v1.0 — atividade por intervalo do item

| Item | Contrato |
| --- | --- |
| Método / host | `GET https://graph.microsoft.com/v1.0` |
| Path | `/drives/{drive-id}/items/{driveItem-id}/getActivitiesByInterval(startDateTime='{startDateTime}',endDateTime='{endDateTime}',interval='day')` |
| Audience / token scope | `https://graph.microsoft.com`; client credentials com `https://graph.microsoft.com/.default`. |
| Query / body | Nenhum; os parâmetros pertencem à função no path. |
| Permissão app | `Files.Read.All` (ou escopo superior aceito pela Microsoft); consentimento administrativo. |
| Sucesso | `200 application/json`, envelope OData `value[]` de `itemActivityStat`; `access`, seus contadores, datas e `incompleteData` são opcionais/anuláveis no schema canônico. |
| Erros | `401`, `403`, `404`, `429` seguem erro Graph; `429` respeita `Retry-After`. |
| Limite | cada intervalo diário deve ter duração inferior a 90 dias. |

O contrato público avisa que agregados podem não existir para todos os tipos
de ação. `incompleteData` indica estatística incompleta: `wasThrottled` informa
perda de dados por atividade excessiva e `missingDataBeforeDateTime` informa
que a fonte não possui dados anteriores àquela data. Ausência de `access`,
contador nulo/omitido ou `value: []` não comprovam zero. A observação anterior
de `200 value: []` permanece uma resposta vazia válida de shape; sua antiga
interpretação como ausência de acesso foi corrigida.

Zero estatístico somente é admitido para `access.actionCount: 0` explícito em
todos os buckets que, juntos, cobrem integralmente o intervalo solicitado,
com datas válidas e sem `incompleteData` não nulo. Um objeto `incompleteData`,
inclusive vazio ou contendo apenas `wasThrottled: false`, continua sendo o
indicador de incompletude; não comprova integralidade. `access.actionCount > 0`
é evidência de acesso observado mesmo quando outros dados estão incompletos;
nessa condição não afirmar contagem exata. Consultas, páginas e campos
ausentes não geram buckets sintéticos de zero. A fonte é estatística de ações
suportadas, sem garantia universal sobre todo comportamento do arquivo.

Cada chamada diária cobre menos de 90 dias. As duas janelas contíguas de 89
dias e um dia permanecem a estratégia para a avaliação D90; o consumo e o
ledger de completude por ação estão em
[fontes e viabilidade](fontes-e-viabilidade.md#acesso-sem-uso). O detector
`>365 dias` não é sustentado por uma consulta D90 vazia nem por conservar
respostas incompletas durante 400 dias.

Fontes primárias: [função por intervalo](https://learn.microsoft.com/graph/api/itemactivitystat-getactivitybyinterval?view=graph-rest-1.0),
[itemActivityStat](https://learn.microsoft.com/graph/api/resources/itemactivitystat?view=graph-rest-1.0),
[incompleteData](https://learn.microsoft.com/graph/api/resources/incompletedata?view=graph-rest-1.0)
e [itemActionStat](https://learn.microsoft.com/graph/api/resources/itemactionstat?view=graph-rest-1.0).
O schema de nulabilidade deriva da metadata v1.0 pinada
`0d13ff1c5e4c8e5e3acc8200de615dfb36233395`. Nenhuma nova coleta real foi
executada nesta revisão por instrução do usuário. A cobertura sintética
`graph.v1.onedrive.item-activities-by-interval` foi reutilizada/ampliada para
zeros explícitos, ausências/nulos, vazio, `incompleteData`, lacunas, paginação e
erros. Os gates do Simulator passaram; isso não muda a observação externa nem
certifica completude estatística de customer.

<a id="versoes-disponiveis-por-arquivo"></a>

## Microsoft Graph v1.0 — versões disponíveis por arquivo

| Item | Contrato |
| --- | --- |
| Provider / método / host | `graph`; `GET https://graph.microsoft.com/v1.0` |
| Path | `/drives/{drive-id}/items/{driveItem-id}/versions` |
| Audience / token scope | `https://graph.microsoft.com`; client credentials com `https://graph.microsoft.com/.default`. |
| Query / body | Nenhum na chamada inicial; sem `$orderby`, que não é suportado. Não solicitar `$count` como substituto da enumeração. |
| Permissão app mínima | `Files.Read.All`; superiores documentadas: `Files.ReadWrite.All`, `Sites.Read.All`, `Sites.ReadWrite.All`, com consentimento administrativo. |
| Headers | `Authorization: Bearer` pelo cliente autenticado; `Accept: application/json` pode ser implícito. Nenhum header adicional integra a assinatura selecionada. |
| Sucesso | `200 application/json`, envelope `value[]` de `driveItemVersion`; seguir `@odata.nextLink` opaco quando publicado. |
| Recurso | `id` opaco, `lastModifiedDateTime`, `lastModifiedBy`, `publication` e `size` quando publicados; nulabilidade conforme schema canônico. |
| Erros | `400`, `401`, `403`, `404`, `429` e `5xx` mantêm erro Graph. `429` respeita `Retry-After`; ausência de acesso/recurso não é contagem zero. |
| PII/sensibilidade | identidade de modificador, data, tamanho e classificação de publicação; anotação `@microsoft.graph.downloadUrl` é pré-autenticada, sensível e efêmera: descartar, não registrar nem usar para este detector. |

Listagem oficial de versões é suportada em aplicação e tem paginação declarada
na metadata pinada por `x-ms-pageable` com `nextLinkName: @odata.nextLink`.
A página Learn informa ordem da mais nova para a mais antiga e ressalva que
metadados completos de versões anteriores não são preservados. A metadata
genérica anuncia parâmetros OData, inclusive `$orderby`, mas o endpoint Learn
o proíbe; esta request seleciona **nenhuma query** e usa somente o link de
continuação fornecido, sem prometer filtros/ordenação genéricos.

Contar IDs distintos efetivamente retornados pela coleção, sem interpretar
`51.0` como 51 versões, sem somar uma suposta versão atual e sem excluir
arbitrariamente versões menores/rascunhos. São versões **disponíveis à
consulta na referência temporal**, não todas as versões já criadas: configurações
e expiração podem remover histórico. A regra `>50 versões` é independente do
baseline manual de 500 versões da R4.

**Evidência:** contrato externo documentado por Learn e metadata v1.0
`microsoftgraph/msgraph-metadata` revisão
`0d13ff1c5e4c8e5e3acc8200de615dfb36233395`, com schema/paginação confirmados.
`x-observed: false`: nenhuma chamada real foi executada nesta revisão, por
instrução explícita do usuário; isso limita a observação, sem substituir o
contrato por uma fixture. A operação
`graph.v1.onedrive.drive-item-versions` foi incorporada como `SUPPORTED` no
Simulator, com cenários 0/50/51, IDs opacos, replay entre páginas, paginação e
erros. Geração, inventário, validação, import e smoke passaram; a evidência é
sintética, sem promover `x-observed` da API externa.

Fontes primárias: [list versions](https://learn.microsoft.com/graph/api/driveitem-list-versions?view=graph-rest-1.0),
[driveItemVersion](https://learn.microsoft.com/graph/api/resources/driveitemversion?view=graph-rest-1.0)
e [publicationFacet](https://learn.microsoft.com/graph/api/resources/publicationfacet?view=graph-rest-1.0).

## Microsoft Graph beta — lixeira do site pessoal

| Item | Contrato |
| --- | --- |
| Método / host | `GET https://graph.microsoft.com/beta` |
| Path | `/sites/{site-id}/recycleBin/items` |
| Query | `$top=25`; `$select=id,name,size,deletedDateTime,deletedFromLocation` |
| Permissão app | `Files.Read.All` (ou escopo superior aceito pela Microsoft); consentimento administrativo. |
| Sucesso | `200 application/json`, envelope OData `value` e, quando paginado, `@odata.nextLink`. |
| Erros | `401`, `403`, `404`, `429` seguem erro Graph; `429` respeita `Retry-After`. |
| PII | nome e caminho de origem podem revelar pessoa, projeto ou conteúdo. |

`site-id` é o ID Graph composto `hostname,sharepointIds.siteId,sharepointIds.webId`
do site pessoal correlacionado; a tupla vem da fotografia publicada de drive/item,
com hostname extraído de `siteUrl`. O `Site Id` do report auxilia correlação da
site collection, mas não fornece sozinho o `webId` nem autoriza inventar o ID
composto. A rota não é intercambiável com a de containers SharePoint Embedded.
**Clarificação do usuário (2026-10-13): Graph `/beta` é aceito pelo projeto.**
A ressalva Microsoft permanece risco conhecido. A tentativa local não resolveu
site e a role mínima não estava presente; não observou `200` nem lixeira vazia.
O OpenAPI conserva `x-observed: false`, mas a documentação primária, metadata
beta pinada e cobertura sintética definem o contrato externo. Essa limitação
local de coleta não exige outro `200` para tornar a estratégia implementável.
`permanentDeletionAt` não existe no recurso externo; não inferir data exata de
purga apenas de `deletedDateTime`. [Rota oficial](https://learn.microsoft.com/graph/api/recyclebin-list-items?view=graph-rest-beta),
[recurso recycleBinItem](https://learn.microsoft.com/graph/api/resources/recyclebinitem?view=graph-rest-beta)
e [política de versões](https://learn.microsoft.com/graph/versioning-and-support).
