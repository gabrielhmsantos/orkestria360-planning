# APIs — Dashboard Executivo de Grupos

## Fontes e leitura

`GET /groups?$select=id,displayName,description,mail,mailEnabled,securityEnabled,groupTypes,visibility,createdDateTime,expirationDateTime,renewedDateTime,membershipRule,membershipRuleProcessingState,onPremisesSyncEnabled,onPremisesLastSyncDateTime,resourceProvisioningOptions,assignedLicenses,licenseProcessingState,isAssignableToRole,classification,assignedLabels` não possui corpo. Retorna `200 application/json` no envelope OData `{ "@odata.context": string, "value": Group[], "@odata.nextLink": string? }`. `Group.Read.All` é a menor permissão de aplicação considerada; `Directory.Read.All` é alternativa mais ampla.

`Group` contém identificadores e atributos de classificação; propriedades selecionadas podem ser omitidas ou `null`. `id`, `displayName`, `mail`, `description`, classificação e datas são PII/dados corporativos conforme o tenant. O cliente segue `@odata.nextLink` integralmente. `$count`, `$search` e filtros avançados exigem `ConsistencyLevel: eventual` e `$count=true` quando indicado pelo Graph.

Indicadores de membros/proprietários usam coleções específicas; atividade vem do report da superfície de Atividade; finalidade, responsável e recomendações pertencem ao Orkestria. O score aplica os pesos definidos pelo sponsor e uma evidência não publicada contribui com `0%` em sua dimensão. `200 {"value":[]}` é coleção válida; não significa zero de risco fora dessa regra explícita de score.

**Fontes reutilizadas:** contrato de `/groups` e paginação observados em `../../licenciamento/historico/contratos.md`; documentação Learn de listagem e delta revalidada nesta etapa.

## Homologação de leitura

Coleta técnica redigida confirmou `200 application/json`, envelope OData paginável e item com `id`/`displayName` em `/groups`. Não foram registrados valores, contagens ou identificadores do tenant.
