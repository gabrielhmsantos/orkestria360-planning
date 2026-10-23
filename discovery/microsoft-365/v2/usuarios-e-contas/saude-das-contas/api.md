# APIs — Saúde das Contas

## Fontes de resposta

`GET /users` seleciona `displayName`, `userPrincipalName`, `mail`, `accountEnabled`, `department`, `jobTitle`, `companyName`, `employeeId`, `usageLocation`, `onPremisesSyncEnabled`, `createdDateTime`, `assignedLicenses`, `userType` e `signInActivity`, com `$expand=manager($select=id)`. O corpo de resposta é o envelope OData `{ "value": User[], "@odata.nextLink": string? }`; cada `User` traz os atributos solicitados e pode omitir atributos sem valor. A estrutura de `assignedLicenses[]` e `signInActivity` é a definida em [Diretório de Usuários](../diretorio-de-usuarios/api.md). Validação de domínio verificado, sincronização ou RH sem fonte correlata permanece `unavailable`.

`GET /users/{user-id}/manager` devolve `directoryObject` (`@odata.type`, `id`, e propriedades expostas da identidade) ou `404` quando não há gestor. `GET /identityProtection/riskyUsers` devolve `{ "value": RiskyUser[], "@odata.nextLink": string? }`; `RiskyUser` inclui `id`, `userDisplayName`, `userPrincipalName`, `riskLevel`, `riskState`, `riskDetail` e `riskLastUpdatedDateTime`. Esta fonte requer Entra P2 e `IdentityRiskyUser.Read.All`; se retornar `403`, não há corpo de negócio para normalizar.

Regras, pesos, exceções de RH e classificações técnicas são dados internos, não payload Graph.
