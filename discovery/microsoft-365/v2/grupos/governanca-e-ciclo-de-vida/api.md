# APIs — Governança e Ciclo de Vida

## Evidências Graph somente leitura

`GET /groups?$select=id,displayName,createdDateTime,expirationDateTime,renewedDateTime` retorna coleção OData de `Group[]`; `GET /groups/{group-id}/groupLifecyclePolicies` retorna coleção OData de políticas associadas; `GET /groupLifecyclePolicies` retorna catálogo de políticas. Todos são `GET` sem corpo, `200 application/json` com `value[]` e `@odata.nextLink` quando paginado. `Group.Read.All` é a permissão de aplicação considerada para grupos; disponibilidade de expiração depende de políticas e tipo de grupo compatíveis.

Os itens de grupo expõem datas ISO 8601 opcionais; políticas expõem identificador e propriedades próprias do recurso, que podem variar. Dados de grupo e política podem revelar estrutura organizacional. `403`/restrição de licença são `restricted`, `404` é recurso ausente, e `value: []` somente é `empty_valid_response` depois da confirmação sem filtro restritivo.

Finalidade, criticidade, responsáveis, revisão, exceções e documentos são entidades internas `unavailable` até contrato próprio. Renovar (`POST /groups/{id}/renew`), arquivar, excluir e revisões são operações fora deste contrato de leitura e permanecem `coming_soon`.

## Access Reviews

`GET /identityGovernance/accessReviews/definitions` não possui corpo e usa `AccessReview.Read.All` em app-only. Retorna `200 application/json` no envelope OData com `@odata.context`, `value: AccessReviewScheduleDefinition[]` e paginação quando houver. Definições, instâncias e decisões podem conter escopo, revisores, recursos e decisões; esses dados exigem minimização. Consultas de instâncias e decisões exigem IDs da definição/instância e permanecem pendentes de coleta representativa.

## Homologação de leitura

`/groupLifecyclePolicies` respondeu `200` com `value: []`; como não há filtro, é `empty_valid_response` para o tenant coletado. A associação de política do grupo de referência respondeu `404 ResourceNotFound`, tratada como recurso/associação não disponível, não lista vazia. Após renovar o token com o consentimento `AccessReview.Read.All` já concedido, Access Reviews respondeu `200` com `@odata.context`, `@odata.count` e `value: []`; portanto é `empty_valid_response`, não `restricted`, para a coleção de definições neste tenant.
