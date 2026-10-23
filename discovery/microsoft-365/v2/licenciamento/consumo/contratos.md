# Contratos internos — Consumo

```ts
type ConsumptionProductRow = {
  skuId: string; assigned: number; active30d?: number; active90d?: number;
  adoptionRate?: number; idleUsers?: number; idleCost?: Money;
  reportingState: 'identified'|'anonymized'|'insufficient_permission'|'unavailable';
};
```

- `GET /reports/getOffice365ActiveUserDetail(period='D30'|'D90')` fornece sinal agregado/por usuário quando identificado.
- `/users` fornece elegibilidade, departamento, estado de conta e atribuições; conectores específicos complementam Power BI, Copilot e workloads.
- Proposto: `GET /licenciamento/consumo?period=D30`; a resposta informa `reportUpdatedAt` separadamente de `technicalSyncedAt`.

## APIs candidatas e viabilização

| Necessidade | Superfície candidata | Permissão de aplicação candidata | Limite conhecido |
| --- | --- | --- | --- |
| Uso ativo geral por usuário | `GET /reports/getOffice365ActiveUserDetail(period='D7'|'D30'|'D90'|'D180')` | `Reports.Read.All` | Graph responde `302`; o CSV só vem no `GET` da URL pré-autenticada, sem encaminhar `Authorization`; nomes podem estar ocultos pela configuração de privacidade. |
| Tendência geral e por serviço | `getOffice365ActiveUserCounts(...)`, `getOffice365ServicesUserCounts(...)` | `Reports.Read.All` | Requer armazenamento de snapshots para horizonte próprio. |
| Atividade específica | `getTeamsUserActivityUserDetail(...)`, `getEmailActivityUserDetail(...)`, `getOneDriveActivityUserDetail(...)`, `getSharePointActivityUserDetail(...)`, `getM365AppUserDetail(...)` | `Reports.Read.All` | Selecionar somente conectores que sustentem uma regra aprovada. |
| Sinal complementar de último acesso | `GET /users?$select=...signInActivity` | `User.Read.All` + `AuditLog.Read.All` | Depende de Entra ID P1/P2; página máxima de 500 ao selecionar `signInActivity`. |

Power BI e parte das métricas de Copilot não devem ser presumidos como relatórios Graph genéricos. Só geram conclusão específica após conector e regra próprios homologados; até lá exibem evidência indisponível ou confiança baixa. O resultado do cálculo de ociosidade continua interno e sujeito a exceções.

A sincronização dos dados técnicos é diária. A resposta separa o momento do relatório, a última coleta e o estado de defasagem/falha; mudanças intradia podem aparecer apenas no ciclo seguinte.

## Homologação Graph — `GET /users` (`signInActivity`)

Validado em tenant real em 2026-07-27: `200 OK`, JSON; 36 itens retornados sem paginação nesta coleta. Request sem corpo:

```http
GET /v1.0/users?$top=100&$select=id,displayName,userPrincipalName,accountEnabled,department,companyName,userType,jobTitle,assignedLicenses,assignedPlans,licenseAssignmentStates,signInActivity
```

```json
{
  "value": [{
    "id": "[guid]", "accountEnabled": true,
    "assignedLicenses": [{ "disabledPlans": [], "skuId": "[guid]" }],
    "signInActivity": {
      "lastSignInDateTime": "2026-01-27T12:47:08Z",
      "lastSignInRequestId": "[guid]",
      "lastNonInteractiveSignInDateTime": "2026-07-26T00:53:23Z",
      "lastSuccessfulSignInDateTime": "2026-07-26T00:53:23Z"
    }
  }]
}
```

## Homologação Graph — `GET /reports/getOffice365ServicesUserCounts`

Validado em tenant real em 2026-07-27: `200 OK`; após o redirecionamento do Graph, a resposta foi `application/octet-stream` contendo CSV. Request sem corpo:

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

## Homologação Graph — `GET /reports/getOffice365ActiveUserDetail`

Validado em tenant real em 2026-07-27: `200 OK`; após redirecionamento, `application/octet-stream` com CSV. Request sem corpo:

```http
GET /v1.0/reports/getOffice365ActiveUserDetail(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,User Principal Name,Display Name,Is Deleted,Deleted Date,Has Exchange License,Has OneDrive License,Has SharePoint License,Has Skype For Business License,Has Yammer License,Has Teams License,Exchange Last Activity Date,OneDrive Last Activity Date,SharePoint Last Activity Date,Skype For Business Last Activity Date,Yammer Last Activity Date,Teams Last Activity Date,Exchange License Assign Date,OneDrive License Assign Date,SharePoint License Assign Date,Skype For Business License Assign Date,Yammer License Assign Date,Teams License Assign Date,Assigned Products
2026-07-25,[redigido],[redigido],False,,False,False,False,False,False,False,2026-02-24,2026-06-16,,,,,,,,,,,
```

O formato contém UPN e nome de exibição; ambos devem ser tratados como PII na persistência e nas respostas internas.

## Homologação Graph — `GET /reports/getTeamsUserActivityUserDetail`

Validado em tenant real em 2026-07-27: `200 OK`; arquivo `application/octet-stream` após redirecionamento. Request sem corpo:

```http
GET /v1.0/reports/getTeamsUserActivityUserDetail(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,User Id,User Principal Name,Last Activity Date,Is Deleted,...,Team Chat Message Count,Private Chat Message Count,Call Count,Meeting Count,...,Audio Duration,Video Duration,Screen Share Duration,...,Is Licensed,Report Period
2026-07-25,[guid],[redigido],2026-07-19,False,,[redigido],0,0,0,0,...,PT0S,PT0S,PT0S,...,Yes,30
```

O CSV contém identificador, UPN, produtos e nome do tenant; esses valores devem ser redigidos fora do armazenamento técnico protegido.

## Homologação Graph — `GET /reports/getEmailActivityUserDetail`

Validado em tenant real em 2026-07-27: `200 OK`; arquivo `application/octet-stream` após redirecionamento. Request sem corpo:

```http
GET /v1.0/reports/getEmailActivityUserDetail(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,User Principal Name,Display Name,Is Deleted,Deleted Date,Last Activity Date,Send Count,Receive Count,Read Count,Meeting Created Count,Meeting Interacted Count,Assigned Products,Report Period
2026-07-25,[redigido],[redigido],False,,2026-06-23,0,318,0,0,0,[redigido],30
```

## Homologação Graph — `GET /reports/getOneDriveActivityUserDetail`

Validado em tenant real em 2026-07-27: `200 OK`; arquivo `application/octet-stream` após redirecionamento. Request sem corpo:

```http
GET /v1.0/reports/getOneDriveActivityUserDetail(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,User Principal Name,Is Deleted,Deleted Date,Last Activity Date,Viewed Or Edited File Count,Synced File Count,Shared Internally File Count,Shared Externally File Count,Assigned Products,Report Period
2026-07-25,[redigido],False,,2026-07-07,17,186,0,0,[redigido],30
```

## Homologação Graph — `GET /reports/getSharePointActivityUserDetail`

Validado em tenant real em 2026-07-27: `200 OK`; arquivo `application/octet-stream` após redirecionamento. Request sem corpo:

```http
GET /v1.0/reports/getSharePointActivityUserDetail(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,User Principal Name,Is Deleted,Deleted Date,Last Activity Date,Viewed Or Edited File Count,Synced File Count,Shared Internally File Count,Shared Externally File Count,Visited Page Count,Assigned Products,Report Period
2026-07-25,[redigido],False,,2025-12-04,0,0,0,0,0,[redigido],30
```

## Homologação Graph — `GET /reports/getM365AppUserDetail`

Validado em tenant real em 2026-07-27: `200 OK`; arquivo `application/octet-stream` após redirecionamento. Request sem corpo:

```http
GET /v1.0/reports/getM365AppUserDetail(period='D30')
Accept: text/csv
```

```csv
Report Refresh Date,User Principal Name,Last Activation Date,Last Activity Date,Report Period,Windows,Mac,Mobile,Web,Outlook,Word,Excel,PowerPoint,OneNote,Teams,...
2026-07-24,[redigido],,2026-03-03,30,No,No,No,No,No,No,No,No,No,No,...
```
