# APIs — Diretório de Usuários

## `GET /users`

**Request:** `$top`, `$select=id,displayName,userPrincipalName,mail,accountEnabled,userType,department,jobTitle,companyName,employeeId,usageLocation,createdDateTime,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity` e `$expand=manager($select=id)`; sem corpo. **Resposta:** envelope `{ "@odata.context": string, "value": User[], "@odata.nextLink": string? }`.

Cada `User` selecionado pode conter `id`, `displayName`, `userPrincipalName`, `mail`, `accountEnabled`, `userType`, `department`, `jobTitle`, `companyName`, `employeeId`, `usageLocation`, `onPremisesSyncEnabled`, `createdDateTime` e `manager.id`; `assignedLicenses[]` (`skuId`, `disabledPlans[]`); `assignedPlans[]` (`service`, `capabilityStatus`, `assignedDateTime`); `licenseAssignmentStates[]` (`skuId`, `state`, `error`, `assignedByGroup`, `lastUpdatedDateTime`); e `signInActivity` (as seis datas/IDs de entrada documentadas no contrato de convidados). Campos opcionais podem ser omitidos ou `null`.

## Perfil contextual

`GET /users/{user-id}/manager` responde uma entidade `directoryObject`: `@odata.type`, `id` e, quando a identidade é um usuário e a permissão permite, campos como `displayName` e `userPrincipalName`; `404` significa que o usuário não possui gestor.

`GET /users/{user-id}/licenseDetails` foi revalidado com client credentials e respondeu `200 application/json` com `{ "@odata.context": string, "value": LicenseDetail[] }`; cada item contém `id`, `skuId`, `skuPartNumber` e `servicePlans[]` (`servicePlanId`, `servicePlanName`, `servicePlanType`, `provisioningStatus`, `appliesTo`). A integração V2 o trata como endpoint app-only viável. A matriz pública do Learn ainda informa “Application: not supported”; essa divergência deve ser monitorada, sem substituir a fonte de lote `/users` (`assignedLicenses`, `assignedPlans`, `licenseAssignmentStates`), que continua sendo a base para sincronização.

## Sincronização incremental

`GET /users/delta` usa os mesmos campos selecionáveis de `User` e retorna envelope OData com `value[]`, `@odata.nextLink` durante a paginação e `@odata.deltaLink` apenas ao concluir o ciclo. O coletor persiste o `deltaLink` opaco por tenant, segue cada `nextLink` integralmente e trata itens com `@removed` como exclusões. Como a Graph não rastreia `licenseAssignmentStates` no delta, há reconciliação completa diária no fuso do tenant para esse campo.

Em `410 Gone` com `Location`, ou em erro 4xx com `error.code: syncStateNotFound`, o estado é `sync_reset`: descartar o cursor expirado, iniciar uma sincronização completa idempotente a partir do `Location`/`/users/delta` e aceitar repetições por `User.id`. Cada tenant usa uma geração de sincronização protegida por lock/CAS: aplicar e confirmar o snapshot completo, inclusive remoções, e substituir o `deltaLink` na mesma transação; somente então marcar a execução bem-sucedida. Não há corpo de requisição.

MFA, risco, grupos/funções e histórico não pertencem ao item `User`: correlacionar por `User.id` com `GET /reports/authenticationMethods/userRegistrationDetails`, `GET /identityProtection/riskyUsers`, roles/role assignments e `GET /auditLogs/signIns`/`directoryAudits`. Cada fonte pode ficar `restricted` separadamente.

`signInActivity` requer P1/P2 e `AuditLog.Read.All`; com ele selecionado a página é limitada a 500 itens. `User.Read.All` é a permissão mínima para a coleção principal.
