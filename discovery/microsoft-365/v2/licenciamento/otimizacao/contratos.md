# Contratos internos — Otimização

```ts
type OptimizationOpportunity = {
  id: string; ruleVersion: string; type: 'idle'|'blocked'|'downgrade'|'reallocate'|'overlap'|'assignment_error';
  priority: 'critical'|'high'|'medium'|'low'; confidence: 'high'|'medium'|'low'|'pending';
  affectedUsers: number; estimatedMonthlySavings?: Money; evidence: string[];
  status: 'open'|'excepted'|'coming_soon';
};
```

- Entradas V2: Graph de SKUs/usuários/licenças, relatórios de uso e exceções internas. Preços/contratos entram somente após Assessment/CSV.
- Proposto na V2: `GET /licenciamento/oportunidades`. Ações de simulação, exceção e alteração ficam “Em breve”.
- Oportunidades técnicas podem apontar usuários e evidências; impacto monetário, contratos e aprovações ficam indisponíveis na V2.

## APIs candidatas e viabilização

| Evidência para insight | Superfície candidata | Permissão de aplicação candidata | Uso proposto |
| --- | --- | --- | --- |
| Capacidade disponível/excedente | `GET /subscribedSkus` | `LicenseAssignment.Read.All` | Identificar reserva potencialmente excessiva. |
| Conta bloqueada e atribuições | `GET /users?$select=id,accountEnabled,assignedLicenses,assignedPlans,licenseAssignmentStates,department` | `User.Read.All` | Evidência para revisão, não comando de remoção. |
| Uso e inatividade | Relatórios Microsoft 365 gerais e por workload | `Reports.Read.All` | Sustenta regras de adoção, ociosidade e possível realocação. |
| Último acesso | `GET /users?$select=signInActivity` | `User.Read.All` + `AuditLog.Read.All` | Complementa relatórios quando o tenant possuir P1/P2. |
| Erro/origem de atribuição | `licenseAssignmentStates` no usuário e grupos licenciados | `User.Read.All` + `Group.Read.All` | Explica falhas e herança por grupo. |

Essas APIs servem somente à produção de evidência e insights. Não há endpoint Graph de escrita neste contrato; “realocar”, “remover” e “downgrade” exibem “Em breve — nenhuma solicitação ou alteração será realizada”.

## Homologação Graph — `GET /subscribedSkus`

Validado em tenant real em 2026-07-27: `200 OK`, `application/json`. Request sem corpo e sem query string.

```json
{
  "value": [{
    "skuId": "[guid]",
    "skuPartNumber": "POWERAPPS_DEV",
    "capabilityStatus": "Enabled",
    "consumedUnits": 1,
    "prepaidUnits": { "enabled": 10000, "suspended": 0, "warning": 0, "lockedOut": 0 },
    "servicePlans": [{ "servicePlanName": "DYN365_CDS_DEV_VIRAL", "provisioningStatus": "Success" }]
  }]
}
```

## Homologação Graph — `GET /users` (evidência de atribuição)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 36 itens retornados sem paginação nesta coleta. Request sem corpo:

```http
GET /v1.0/users?$top=100&$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,jobTitle,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity
```

```json
{
  "value": [{
    "id": "[guid]", "accountEnabled": true, "department": null,
    "assignedLicenses": [{ "disabledPlans": [], "skuId": "[guid]" }],
    "assignedPlans": [{ "capabilityStatus": "Enabled", "service": "SharePoint", "servicePlanId": "[guid]" }],
    "licenseAssignmentStates": [{ "assignedByGroup": null, "state": "Active", "error": "None", "lastUpdatedDateTime": "2026-01-26T23:01:02.9068661Z" }],
    "signInActivity": { "lastSignInDateTime": "2026-01-27T12:47:08Z", "lastSuccessfulSignInDateTime": "2026-07-26T00:53:23Z" }
  }]
}
```
