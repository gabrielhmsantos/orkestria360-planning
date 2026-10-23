# Contratos internos — Inventário

```ts
type LicenseProductRow = {
  skuId: string; skuPartNumber: string; displayName: string;
  purchasedSeats: number; assignedSeats: number; availableSeats: number;
  capabilityStatus: string; technicalStatus: 'active'|'warning'|'suspended'|'unknown';
  monthlyCost?: Money; commercialStatus?: string; renewalDate?: string;
  source: 'graph+catalog'; lastUpdatedAt: string | null;
};
```

## APIs e contratos

- `GET /subscribedSkus`: SKU, capacidade, consumo, `capabilityStatus` e `servicePlans`.
- `GET /users?$select=...assignedLicenses,assignedPlans,licenseAssignmentStates,department,accountEnabled`: visão por usuário e origem.
- Propostos: `GET /licenciamento/inventario`, `GET /licenciamento/produtos/{skuId}` e `GET /licenciamento/usuarios`.
- Contratos, preço e renovação pertencem a `commercial_subscriptions`, mas ficam indisponíveis na V2 e nunca são inferidos do Graph. Futuramente serão preenchidos pelo Assessment/importação CSV, vinculados por `tenant_id` + `sku_id`/`sku_part_number`.

## APIs candidatas e viabilização

| Necessidade | Superfície candidata | Permissão de aplicação candidata | Limite conhecido |
| --- | --- | --- | --- |
| SKUs, unidades, planos e estado | `GET /subscribedSkus` | `LicenseAssignment.Read.All` | Não suporta filtro; o conector filtra/classifica localmente. |
| Usuários, departamento e atribuições | `GET /users?$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,assignedLicenses,assignedPlans,licenseAssignmentStates` | `User.Read.All` | Paginação e campos efetivamente retornados devem ser homologados. |
| Alterações incrementais de usuários | `GET /users/delta` | `User.Read.All` | Não acompanha mudanças de `licenseAssignmentStates`; exige reconciliação periódica. |
| Grupos com licença | `GET /groups?$filter=assignedLicenses/any()&$select=id,displayName,assignedLicenses` | `Group.Read.All` | Necessário apenas onde houver atribuição por grupo. |
| Membros do grupo de origem | `GET /groups/{id}/members` | `GroupMember.Read.All` ou `Group.Read.All` | Usado para explicar origem; não é preço nem contrato. |

**Validação atualizada:** a documentação do Graph ainda declara `GET /users/{id}/licenseDetails` como não suportado para permissões de aplicação, mas a chamada com o client-credentials do tenant respondeu `200 OK` em 2026-07-27. O endpoint é tecnicamente viável neste tenant, porém deve ser tratado como comportamento a revalidar antes de depender dele em produção. As APIs acima exigem consentimento/administração e teste no tenant.

## Homologação Graph — `GET /subscribedSkus`

Validado em tenant real em 2026-07-27: `200 OK`, `application/json`. Não recebe corpo nem query string.

```http
GET https://graph.microsoft.com/v1.0/subscribedSkus
Authorization: Bearer {access-token}
Accept: application/json
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#subscribedSkus",
  "value": [{
    "accountName": "[redigido]",
    "accountId": "[guid]",
    "appliesTo": "User",
    "capabilityStatus": "Enabled",
    "consumedUnits": 1,
    "id": "[tenant-guid]_[sku-guid]",
    "skuId": "[guid]",
    "skuPartNumber": "POWERAPPS_DEV",
    "subscriptionIds": ["[guid]"],
    "prepaidUnits": { "enabled": 10000, "suspended": 0, "warning": 0, "lockedOut": 0 },
    "servicePlans": [{
      "servicePlanId": "[guid]",
      "servicePlanName": "DYN365_CDS_DEV_VIRAL",
      "servicePlanType": "CRM",
      "provisioningStatus": "Success",
      "appliesTo": "User"
    }]
  }]
}
```

## Homologação Graph — `GET /users` (atribuições)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 36 usuários retornados e sem `@odata.nextLink` nesta coleta. A consulta validada foi:

```http
GET /v1.0/users?$top=100&$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,jobTitle,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity
```

Sem corpo de request. Exemplo estrutural da resposta observada (PII e GUIDs redigidos):

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users(...) ",
  "value": [{
    "displayName": "[redigido]", "userPrincipalName": "[redigido]", "accountEnabled": true,
    "department": null, "companyName": null, "userType": "Member", "jobTitle": null, "id": "[guid]",
    "assignedLicenses": [{ "disabledPlans": [], "skuId": "[guid]" }],
    "assignedPlans": [{ "assignedDateTime": "2026-01-26T23:01:02Z", "capabilityStatus": "Enabled", "service": "SharePoint", "servicePlanId": "[guid]" }],
    "licenseAssignmentStates": [{ "skuId": "[guid]", "disabledPlans": [], "assignedByGroup": null, "state": "Active", "error": "None", "lastUpdatedDateTime": "2026-01-26T23:01:02.9068661Z" }],
    "signInActivity": { "lastSignInDateTime": "2026-01-27T12:47:08Z", "lastNonInteractiveSignInDateTime": "2026-07-26T00:53:23Z", "lastSuccessfulSignInDateTime": "2026-07-26T00:53:23Z" }
  }]
}
```

## Homologação Graph — `GET /users/delta`

Validado em tenant real em 2026-07-27: `200 OK`, JSON. A primeira página retornou 36 itens e `@odata.nextLink` (não `@odata.deltaLink`), portanto o conector deve seguir o `nextLink` até receber o `deltaLink` final.

```http
GET /v1.0/users/delta?$select=id,displayName,userPrincipalName,accountEnabled,department,assignedLicenses,assignedPlans,licenseAssignmentStates
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users(...) ",
  "@odata.nextLink": "https://graph.microsoft.com/v1.0/users/delta?$skiptoken=[opaco]",
  "value": [{
    "displayName": "[redigido]", "userPrincipalName": "[redigido]", "accountEnabled": true, "id": "[guid]"
  }]
}
```

O item observado não trouxe `department`, `assignedLicenses`, `assignedPlans` nem `licenseAssignmentStates`; propriedades sem valor podem ser omitidas, e a reconciliação de licenças permanece necessária.

## Homologação Graph — `GET /groups` (grupos licenciados)

Validado em tenant real em 2026-07-27: `200 OK`, JSON, sem corpo de request.

```http
GET /v1.0/groups?$filter=assignedLicenses/any()&$select=id,displayName,assignedLicenses
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#groups(id,displayName,assignedLicenses)",
  "value": []
}
```

Não havia grupos com licença no tenant na coleta. Por isso, a validação de `GET /groups/{id}/members` abaixo usa um grupo existente não licenciado; seu uso no fluxo de licenciamento continua condicional à primeira atribuição por grupo.

## Homologação Graph — `GET /groups` (sem filtro)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 57 grupos retornados e sem `@odata.nextLink` nesta coleta. Request sem corpo:

```http
GET /v1.0/groups?$top=100&$select=id,displayName,mail,mailEnabled,securityEnabled,groupTypes,assignedLicenses
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#groups(id,displayName,mail,mailEnabled,securityEnabled,groupTypes,assignedLicenses)",
  "value": [{
    "id": "[guid]", "displayName": "[redigido]", "mail": "[redigido]",
    "mailEnabled": true, "securityEnabled": false, "groupTypes": ["Unified"], "assignedLicenses": []
  }]
}
```

O filtro `assignedLicenses/any()` continua retornando vazio neste tenant; por isso a leitura sem filtro é útil para obter o catálogo de grupos e a existência de membros, mas não para inferir atribuição de licença.

## Homologação Graph — `GET /groups/{id}/members`

Validado em tenant real em 2026-07-27 contra um grupo existente não licenciado, pois não havia grupo licenciado disponível: `200 OK`, JSON; três membros retornados e sem paginação. Request sem corpo:

```http
GET /v1.0/groups/[group-guid]/members?$top=10
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects",
  "value": [{
    "@odata.type": "#microsoft.graph.user", "id": "[guid]", "businessPhones": [],
    "displayName": "[redigido]", "givenName": "[redigido]", "jobTitle": null,
    "mail": "[redigido]", "mobilePhone": null, "officeLocation": null,
    "preferredLanguage": "pt-BR", "surname": "[redigido]", "userPrincipalName": "[redigido]"
  }]
}
```

O endpoint está operacional, mas só deve ser usado na cadeia de licenciamento quando o grupo tiver `assignedLicenses`.

## Homologação Graph — `GET /users/{id}/licenseDetails`

Validado em tenant real em 2026-07-27 com o mesmo token app-only (client credentials) do coletor: `200 OK`, JSON. Request sem corpo:

```http
GET /v1.0/users/[user-guid]/licenseDetails
Accept: application/json
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('[user-guid]')/licenseDetails",
  "value": [{
    "id": "[opaque-id]", "skuId": "[guid]", "skuPartNumber": "O365_BUSINESS_ESSENTIALS",
    "servicePlans": [{
      "servicePlanId": "[guid]", "servicePlanName": "MDOLITE_ENTERPRISE", "servicePlanType": "Exchange",
      "provisioningStatus": "Success", "appliesTo": "Company"
    }]
  }]
}
```

Há divergência com a documentação de permissões do Graph, que ainda marca Application como não suportado. Antes de incluir esta leitura no conector produtivo, repetir a homologação após mudanças de permissões, SDK ou tenant.
