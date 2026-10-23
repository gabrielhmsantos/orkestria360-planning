# Contratos internos — Dashboard Executivo

## Página

`LicensingExecutiveDashboardPageData` contém `summary`, `healthScore`, `utilization`, `premiumUnderuse`, `costTrend`, `expiringSubscriptions`, `opportunities`, `productRows`, `departmentDistribution`, `utilizationTrend`, `quickActions` e `alerts`.

```ts
type LicensingSummary = {
  totalSeats: number; assignedSeats: number; availableSeats: number;
  monthlyCost?: Money; potentialSavings?: Money;
  source: 'graph' | 'orkestria'; lastUpdatedAt: string | null;
  freshness: 'fresh' | 'stale' | 'unavailable';
};
```

## Fontes e seams

- `GET /subscribedSkus` alimenta assentos e estado técnico.
- snapshots internos diários alimentam tendências; custo e vencimento ficam `unavailable` até Assessment/CSV.
- `GET /licenciamento/dashboard` é o endpoint interno proposto; ações rápidas dependentes de alteração retornam estado `coming_soon`, sem workflow.

## APIs candidatas e viabilização

| Necessidade | Superfície candidata | Permissão de aplicação candidata | Observação |
| --- | --- | --- | --- |
| Capacidade, consumo e estado dos SKUs | `GET /subscribedSkus` | `LicenseAssignment.Read.All` | Fonte técnica para assentos; não entrega preço, contrato ou renovação. |
| Tendência de usuários/uso M365 | `GET /reports/getOffice365ActiveUserCounts(...)` e `getOffice365ServicesUserCounts(...)` | `Reports.Read.All` | Retorna relatório CSV por redirecionamento; o backend deve persistir snapshots. |
| Contexto do tenant | `GET /organization` | `Organization.Read.All` | Opcional; não é requisito para os KPIs de licença. |

`healthScore`, custo mensal, economia potencial, vencimentos e ações rápidas permanecem contratos internos propostos. As superfícies Graph foram homologadas no tenant de teste; custo, economia e vencimentos são indisponíveis na V2 até a entrada Assessment/CSV.

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
    "servicePlans": [{ "servicePlanId": "[guid]", "servicePlanName": "DYN365_CDS_DEV_VIRAL", "provisioningStatus": "Success" }]
  }]
}
```

O payload real também contém `accountName`, `accountId`, `id`, `appliesTo` e `subscriptionIds`; valores identificáveis foram redigidos neste contrato.

## Homologação Graph — `GET /reports/getOffice365ServicesUserCounts`

Validado em tenant real em 2026-07-27: `200 OK`; o HTTP client seguiu o redirecionamento do Graph e recebeu `application/octet-stream` com CSV. Request sem corpo:

```http
GET /v1.0/reports/getOffice365ServicesUserCounts(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,Exchange Active,Exchange Inactive,OneDrive Active,OneDrive Inactive,SharePoint Active,SharePoint Inactive,Skype For Business Active,Skype For Business Inactive,Yammer Active,Yammer Inactive,Teams Active,Teams Inactive,Office 365 Active,Office 365 Inactive,Report Period
2026-07-25,8,7,6,9,6,9,,,0,23,8,6,10,13,30
```

## Homologação Graph — `GET /reports/getOffice365ActiveUserCounts`

Validado em tenant real em 2026-07-27: `200 OK`; após redirecionamento, `application/octet-stream` com CSV. Request sem corpo:

```http
GET /v1.0/reports/getOffice365ActiveUserCounts(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,Office 365,Exchange,OneDrive,SharePoint,Skype For Business,Yammer,Teams,Report Date,Report Period
2026-07-26,3,0,1,,,,2,2026-06-27,30
2026-07-26,6,1,2,1,,,3,2026-06-28,30
```

## Homologação Graph — `GET /organization`

Validado em tenant real em 2026-07-27: `200 OK`, `application/json`; uma organização retornada. Request sem corpo e sem query string.

```http
GET /v1.0/organization
Accept: application/json
```

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#organization",
  "value": [{
    "id": "[tenant-guid]", "displayName": "[redigido]", "countryLetterCode": "BR", "preferredLanguage": "pt-BR", "tenantType": "AAD",
    "directorySizeQuota": { "used": 1073, "total": 500000 },
    "assignedPlans": [{ "assignedDateTime": "2026-07-08T20:39:04Z", "capabilityStatus": "Enabled", "service": "exchange", "servicePlanId": "[guid]" }],
    "verifiedDomains": [{ "capabilities": "Email, OfficeCommunicationsOnline", "isDefault": true, "isInitial": false, "name": "[redigido]", "type": "Managed" }]
  }]
}
```

Telefone, endereço, e-mails técnicos e domínios são PII/dados organizacionais e foram redigidos.
