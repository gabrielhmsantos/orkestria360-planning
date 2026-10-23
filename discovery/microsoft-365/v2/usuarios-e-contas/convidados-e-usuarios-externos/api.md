# APIs — Convidados e Usuários Externos

## `GET /users` — variante Guest

**Leitura base — request:** `?$top=100&$filter=userType eq 'Guest'&$select=id,displayName,userPrincipalName,mail,accountEnabled,userType,createdDateTime,creationType,companyName,externalUserState,externalUserStateChangeDateTime,assignedLicenses`. É `GET`; não há corpo de requisição. `User.Read.All` é a permissão mínima. A sincronização delta usa o mesmo `$select`, preservando esses dois campos no snapshot. O filtro é fixo nesta superfície: não é uma rota genérica de `/users`.

**Enriquecimento de atividade — request separado:** mesma consulta, com `signInActivity` em `$select`. Exige adicionalmente `AuditLog.Read.All` e Entra P1/P2. Caso não esteja disponível, apenas este enriquecimento fica `restricted`; a lista base de convidados permanece disponível.

**Corpo de resposta (`200 application/json`):** envelope OData paginável. `value` pode ser `[]` quando não existirem convidados que atendam ao filtro; isso é uma resposta válida do endpoint.

`externalUserState` aceita `PendingAcceptance`, `Accepted` ou `null`. A ausência da propriedade em snapshots anteriores à coleta é tratada como indisponibilidade analítica; o produto não converte `null` em `Accepted`.

```json
{
  "@odata.context": "string",
  "@odata.nextLink": "string (opcional)",
  "value": [{
    "id": "string",
    "displayName": "string|null",
    "userPrincipalName": "string",
    "accountEnabled": true,
    "userType": "Guest",
    "createdDateTime": "date-time|null",
    "creationType": "string|null",
    "externalUserState": "string|null",
    "externalUserStateChangeDateTime": "date-time|null",
    "assignedLicenses": [{ "disabledPlans": ["guid"], "skuId": "guid" }]
  }]
}
```

O enriquecimento opcional adiciona `signInActivity` com `lastSignInDateTime`, `lastSignInRequestId`, `lastNonInteractiveSignInDateTime`, `lastNonInteractiveSignInRequestId`, `lastSuccessfulSignInDateTime` e `lastSuccessfulSignInRequestId` (opcionais/nulos). `id`, `displayName`, `userPrincipalName`, `mail` e `companyName` são PII. Patrocinador não é inferido de UPN: sem relação interna ou fonte aprovada, deve ser exposto como `unavailable`. Justificativa, classificação compartilhada/técnica e revisão também são internas ou dependem de workflow futuro.
