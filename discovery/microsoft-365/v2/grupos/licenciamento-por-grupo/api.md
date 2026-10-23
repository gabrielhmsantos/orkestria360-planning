# APIs — Licenciamento por Grupo

## Grupos e erros

`GET /groups?$filter=assignedLicenses/any()&$select=id,displayName,assignedLicenses,licenseProcessingState` não possui corpo e retorna envelope OData de `Group[]`. `assignedLicenses[]` contém ao menos `skuId` e `disabledPlans[]`; `licenseProcessingState` é opcional/variável. `GET /groups/{group-id}/membersWithLicenseErrors` retorna `DirectoryObject[]` paginável. `Group.Read.All`/`GroupMember.Read.All` são as permissões de aplicação consideradas conforme a coleção.

A consulta filtrada sem resultados já foi observada em discovery de Licenciamento; ela é **resposta filtrada sem correspondências**, não confirmação de que atribuição por grupo é inviável. A variante sem filtro só confirma disponibilidade/schema; não substitui a query no contrato.

## Origem no usuário

`GET /users/{user-id}?$select=id,displayName,licenseAssignmentStates` não possui corpo; retorna `200` com entidade `User`. `licenseAssignmentStates[]` pode trazer `skuId`, `state`, `error`, `assignedByGroup` e `lastUpdatedDateTime`; campos podem ser omitidos/null. `User.Read.All` é a permissão considerada. Identidade, erro e grupo de origem são PII/dados de acesso.

`403` é `restricted`; `404` identifica usuário/grupo ausente. Preço, custo e economia não vêm da Graph e são `unavailable` sem base comercial interna. Simulador é `coming_soon`.

## Homologação de leitura

A consulta filtrada por `assignedLicenses/any()` respondeu `200` com `value: []`, enquanto a linha de base de `/groups` contém itens. Portanto, o resultado é **resposta filtrada sem correspondências** no tenant coletado, não indisponibilidade do endpoint nem zero universal. A coleção de membros com erro do grupo de referência também respondeu `200` vazia.
