# Contratos internos — Histórico

```ts
type LicenseEvent = { id: string; occurredAt: string; type: string; skuId?: string; userId?: string; source: 'graph'|'snapshot'; confirmation: 'pending'|'confirmed'|'divergent' };
```

- `GET /auditLogs/directoryAudits` complementa atribuições, grupos e alterações administrativas.
- snapshots de `/subscribedSkus` e de atribuições detectam variações de estado.
- Propostos: `GET /licenciamento/historico`, `GET /licenciamento/eventos/{id}`; documentos/evidências são referenciados, não duplicados no payload.

## APIs candidatas e viabilização

| Necessidade | Superfície candidata | Permissão de aplicação candidata | Limite conhecido |
| --- | --- | --- | --- |
| Eventos administrativos Entra | `GET /auditLogs/directoryAudits` | `AuditLog.Read.All` + `Directory.Read.All` | Retenção/cobertura variam; filtrar e copiar eventos relevantes. |
| Variação de capacidade | `GET /subscribedSkus` + snapshots internos | `LicenseAssignment.Read.All` | Representa estado atual; não explica sozinho o motivo comercial. |
| Variação de atribuição | `/users` e `GET /users/delta` | `User.Read.All` | Delta não rastreia `licenseAssignmentStates`; reconciliação continua obrigatória. |
| Mudanças em grupos licenciados | `/groups` e `/groups/{id}/members` | `Group.Read.All` / `GroupMember.Read.All` | Complementa a origem da alteração. |

Eventos de pedido, aprovação, renovação, preço, fatura e execução por terceiros ficam fora da V2. O Graph e snapshots sustentam somente o histórico técnico; campos comerciais permanecem indisponíveis até Assessment/CSV.

## Homologação Graph — `GET /subscribedSkus`

Validado em tenant real em 2026-07-27: `200 OK`, `application/json`. Request sem corpo e sem query string.

```json
{
  "value": [{
    "id": "[tenant-guid]_[sku-guid]",
    "skuId": "[guid]",
    "skuPartNumber": "POWERAPPS_DEV",
    "capabilityStatus": "Enabled",
    "consumedUnits": 1,
    "prepaidUnits": { "enabled": 10000, "suspended": 0, "warning": 0, "lockedOut": 0 },
    "subscriptionIds": ["[guid]"]
  }]
}
```

## Homologação Graph — `GET /users` (estado de atribuição)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 36 itens retornados sem paginação nesta coleta. Request sem corpo:

```http
GET /v1.0/users?$top=100&$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,jobTitle,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity
```

```json
{
  "value": [{
    "id": "[guid]",
    "assignedLicenses": [{ "disabledPlans": [], "skuId": "[guid]" }],
    "licenseAssignmentStates": [{ "skuId": "[guid]", "assignedByGroup": null, "state": "Active", "error": "None", "lastUpdatedDateTime": "2026-01-26T23:01:02.9068661Z" }]
  }]
}
```

## Homologação Graph — `GET /users/delta`

Validado em tenant real em 2026-07-27: `200 OK`, JSON. A primeira página retornou 36 itens e `@odata.nextLink`; a sincronização só termina quando uma página devolver `@odata.deltaLink`.

```http
GET /v1.0/users/delta?$select=id,displayName,userPrincipalName,accountEnabled,department,assignedLicenses,assignedPlans,licenseAssignmentStates
```

```json
{
  "@odata.nextLink": "https://graph.microsoft.com/v1.0/users/delta?$skiptoken=[opaco]",
  "value": [{ "displayName": "[redigido]", "userPrincipalName": "[redigido]", "accountEnabled": true, "id": "[guid]" }]
}
```

As propriedades de licença não vieram no item observado, confirmando que delta não substitui a reconciliação de atribuições.

## Homologação Graph — `GET /groups` (grupos licenciados)

Validado em tenant real em 2026-07-27: `200 OK`, JSON, sem corpo de request.

```http
GET /v1.0/groups?$filter=assignedLicenses/any()&$select=id,displayName,assignedLicenses
```

```json
{ "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#groups(id,displayName,assignedLicenses)", "value": [] }
```

Não há grupo licenciado no tenant de homologação; por isso a validação abaixo usa um grupo existente não licenciado. O endpoint só deve integrar o fluxo de licenciamento quando a atribuição por grupo existir.

## Homologação Graph — `GET /groups` (sem filtro)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 57 grupos retornados e sem `@odata.nextLink` nesta coleta. Request sem corpo:

```http
GET /v1.0/groups?$top=100&$select=id,displayName,mail,mailEnabled,securityEnabled,groupTypes,assignedLicenses
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#groups(id,displayName,mail,mailEnabled,securityEnabled,groupTypes,assignedLicenses)",
  "value": [{ "id": "[guid]", "displayName": "[redigido]", "mail": "[redigido]", "mailEnabled": true, "securityEnabled": false, "groupTypes": ["Unified"], "assignedLicenses": [] }]
}
```

A consulta filtrada por `assignedLicenses/any()` retornou vazia no tenant; logo, o catálogo sem filtro não comprova atribuição de licença, mas permite localizar grupos e seus membros para correlação posterior.

## Homologação Graph — `GET /groups/{id}/members`

Validado em tenant real em 2026-07-27 contra um grupo existente não licenciado: `200 OK`, JSON; três membros retornados, sem paginação. Request sem corpo:

```http
GET /v1.0/groups/[group-guid]/members?$top=10
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects",
  "value": [{ "@odata.type": "#microsoft.graph.user", "id": "[guid]", "displayName": "[redigido]", "mail": "[redigido]", "userPrincipalName": "[redigido]" }]
}
```

O endpoint está operacional; a correlação com histórico de licenças permanece condicional a grupos com `assignedLicenses`.

## Homologação Graph — `GET /auditLogs/directoryAudits`

Validado em tenant real em 2026-07-27: `200 OK`, JSON. A primeira página trouxe 10 eventos e `@odata.nextLink`; o coletor deve paginar.

```http
GET /v1.0/auditLogs/directoryAudits?$top=10&$orderby=activityDateTime%20desc
```

```json
{
  "@odata.nextLink": "https://graph.microsoft.com/v1.0/auditLogs/directoryAudits?...$skiptoken=[opaco]",
  "value": [{
    "id": "Directory_[guid]_[id]", "category": "ApplicationManagement", "correlationId": "[guid]",
    "result": "success", "activityDisplayName": "Consent to application", "activityDateTime": "2026-07-27T23:11:39.7410532Z",
    "loggedByService": "Core Directory", "operationType": "Assign",
    "initiatedBy": { "app": null, "user": { "id": "[guid]", "userPrincipalName": "[redigido]", "ipAddress": "[redigido]", "agentType": "notAgentic" } },
    "targetResources": [{ "id": "[guid]", "displayName": "[redigido]", "type": "ServicePrincipal", "modifiedProperties": [{ "displayName": "ConsentContext.IsAdminConsent", "oldValue": null, "newValue": "\\\"True\\\"" }] }],
    "additionalDetails": [{ "key": "User-Agent", "value": "[redigido]" }]
  }]
}
```
