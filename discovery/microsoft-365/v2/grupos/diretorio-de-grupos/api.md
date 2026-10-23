# APIs — Diretório de Grupos

## `GET /groups`

**Request:** sem corpo; `$select` com os campos do diretório, `$top` e filtros suportados. Para `$count`, `$search` ou filtros avançados, enviar `ConsistencyLevel: eventual` e o parâmetro `$count=true`. **Resposta:** `200 application/json`, `{ "@odata.context": string, "value": Group[], "@odata.nextLink": string? }`; seguir o cursor opaco até concluir.

`Group` selecionado pode conter: `id` (string), `displayName`/`description`/`mail` (string ou `null`), `mailEnabled`/`securityEnabled`/`onPremisesSyncEnabled`/`isAssignableToRole` (boolean ou `null`), `groupTypes`/`resourceProvisioningOptions`/`assignedLicenses` (array ou ausente), `visibility`/`membershipRule`/`membershipRuleProcessingState`/`classification`/`licenseProcessingState` (string ou `null`) e datas ISO 8601 (string ou `null`). Tipo, associação, Teams e origem são derivações declaradas no discovery, não campos substitutos.

`Group.Read.All` é a menor permissão de aplicação considerada. `403` é `restricted`, e uma consulta filtrada com `value: []` é **sem correspondências**, devendo ser revalidada sem filtro antes de ser classificada como `empty_valid_response`. Nome, e-mail, descrição e classificação exigem minimização/visibilidade autorizada.

## Detalhe

`GET /groups/{group-id}` sem corpo retorna a entidade `Group` selecionada; `404` significa identificador inexistente/removido, não lista vazia. Abas de membros, proprietários, licenças, atividade e histórico usam os contratos das superfícies correspondentes.

## Homologação de leitura

`/groups` e o detalhe de um grupo existente responderam `200 application/json`. O detalhe confirmou, além dos campos previstos, propriedades opcionais de sincronização/provisionamento; campos selecionados continuam potencialmente omitidos ou `null`.
