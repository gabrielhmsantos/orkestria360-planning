# Contratos internos — Planejamento

```ts
type LicensingScenario = { id: string; name: string; assumptions: string[]; changes: ScenarioChange[]; status: 'draft'|'shared'|'archived' };
type CommercialAction = { type: 'quote'|'purchase'|'upgrade'|'downgrade'|'renewal'|'consulting'; status: 'coming_soon' };
```

- Proposto na V2: `GET /licenciamento/planejamento`. Cenários persistidos, solicitações comerciais e workflow ficam para fase futura.
- Entidades futuras: `licensing_plans`, `licensing_scenarios`, `licensing_renewals`, `commercial_requests` e `consultant_meetings`.
- Controles comerciais retornam somente `coming_soon`; não há criação de solicitação, workflow ou provisionamento.

## APIs candidatas e viabilização

| Necessidade | Superfície candidata | Permissão de aplicação candidata | Papel |
| --- | --- | --- | --- |
| Confirmar produtos existentes e capacidade atual | `GET /subscribedSkus` | `LicenseAssignment.Read.All` | Insumo de cenário; não informa custo futuro nem renovação. |
| Estimar população atual por perfil/área | `GET /users?$select=id,department,jobTitle,accountEnabled,assignedLicenses` | `User.Read.All` | Insumo opcional para cenário; admissões e projetos futuros são internos. |
| Medir adoção antes de propor expansão | Relatórios Microsoft 365 por workload | `Reports.Read.All` | Evidência de cenário, quando disponível. |

Calendário de renovação, orçamento, preços e cotação dependem do Assessment/CSV e ficam indisponíveis na V2. Roadmap e cenários só exibem premissas e impacto técnico quando houver evidência. Não existe ação Graph nem workflow V2 para comprar, renovar ou provisionar licenças.

## Homologação Graph — `GET /subscribedSkus`

Validado em tenant real em 2026-07-27: `200 OK`, `application/json`. Request sem corpo e sem query string.

```json
{
  "value": [{
    "skuId": "[guid]",
    "skuPartNumber": "POWERAPPS_DEV",
    "capabilityStatus": "Enabled",
    "consumedUnits": 1,
    "prepaidUnits": { "enabled": 10000, "suspended": 0, "warning": 0, "lockedOut": 0 }
  }]
}
```

## Homologação Graph — `GET /users` (população atual)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 36 itens retornados sem paginação nesta coleta. Request sem corpo:

```http
GET /v1.0/users?$top=100&$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,jobTitle,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity
```

```json
{
  "value": [{ "id": "[guid]", "department": null, "jobTitle": null, "accountEnabled": true, "assignedLicenses": [{ "disabledPlans": [], "skuId": "[guid]" }] }]
}
```
