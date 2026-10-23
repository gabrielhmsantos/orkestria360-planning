# APIs — Dashboard Executivo / Secure Score

## `GET /security/secureScores`

**Resultado:** `endpoint viável`. Coleta técnica temporária em 14/08/2026 confirmou `200 application/json` no tenant de desenvolvimento, com `SecurityEvents.Read.All` de aplicação. É uma leitura sem corpo, em `v1.0`, com `$top=100`; o cliente segue `@odata.nextLink` como URL opaca. A resposta real retornou 90 itens de histórico e confirmou que `$top=1` também pode paginar. Não há delta seguro.

O envelope é OData (`value`, `@odata.nextLink` opcional). Cada item contém `id`, `azureTenantId`, `createdDateTime`, `currentScore`, `maxScore`, `activeUserCount`, `licensedUserCount`, `enabledServices`, `vendorInformation`, `averageComparativeScores` e `controlScores`. `currentScore` e `maxScore` são numéricos; as coleções e propriedades opcionais podem estar ausentes ou nulas. `azureTenantId`, contagens de usuários e descrições de controles são dados organizacionais; não persistir payload bruto nem dados pessoais sem necessidade.

`controlScores[]` retornou `controlCategory`, `controlName`, `description`, `score`, `lastSynced`, `implementationStatus`, `scoreInPercentage` e campos condicionais (`on`, `count`, `total`). `averageComparativeScores[]` retornou `basis`, `averageScore` e os pares atual/máximo de Apps, Data, Device, Identity e Infrastructure. O vínculo normalizado de todos os 71 `controlName` da fotografia atual foi encontrado no catálogo completo de 449 perfis.

**Exemplo `200 application/json` sanitizado:**

```json
{"@odata.context":"…#security/secureScores","@odata.nextLink":"opaque-url","value":[{"id":"score-id","azureTenantId":"tenant-id","createdDateTime":"2026-08-14T00:00:00Z","currentScore":42.5,"maxScore":100,"activeUserCount":100,"licensedUserCount":110,"enabledServices":["Exchange","SharePoint"],"averageComparativeScores":[{"basis":"AllTenants","averageScore":55,"identityScore":20,"identityScoreMax":30}],"controlScores":[{"controlCategory":"Identity","controlName":"control-id","description":"Redacted","score":2,"lastSynced":"2026-08-14T00:00:00Z","implementationStatus":"ThirdParty","scoreInPercentage":40}]}]}
```

`400`, `401`, `403`, `404`, `429` e erros Graph são estado de fonte/erro, não score zero. Em `429`, respeitar `Retry-After` e registrar tentativas; em falha, reter a última fotografia publicada. A documentação Microsoft declara retenção padrão aproximada de 90 dias, ordenada do mais recente ao mais antigo.

## Uso pela aplicação

O Dashboard Executivo, Pontuação por Categoria, Comparativos e Metas e Evolução e Tendências consomem a fotografia local publicada. A fonte canônica futura é um snapshot periódico coordenado de `secureScores`; não há chamada Graph em tela. A mesma fotografia fornece controles e comparativos, evitando leituras redundantes.

## Fontes correlatas para entidades afetadas

O DOCX exige detalhamento operacional das recomendações, não somente o score: administradores sem MFA, dispositivos sem proteção/não conformes, sites com compartilhamento amplo e regras de encaminhamento externo. A fonte de MFA já validada é a projeção local de `GET /reports/authenticationMethods/userRegistrationDetails` unida a identidades publicadas: `isAdmin` e `isMfaRegistered` sustentam o recorte de administradores sem MFA.

As rotas foram tecnicamente testadas, sem dados pessoais ou URLs sensíveis registrados. `GET /deviceManagement/managedDevices?$select=id,azureADDeviceId,complianceState,partnerReportedThreatState,lastSyncDateTime` permanece `401 UnknownError` (Intune). A enumeração correta de sites, `GET /sites/getAllSites`, retornou `200` paginável; em contraste, a variante com filtro retornou `501 notSupported`. Após a liberação de roles, `GET /sites/{site-id}/permissions` retornou `200 application/json` com envelope OData e `value: []` na amostra sem filtros: é `empty_valid_response`, pois o contrato Learn define sucesso como coleção `permission[]`. Portanto, significa que não há permissões diretas retornadas para aquele site; não é erro e não autoriza concluir ausência de permissões em subsites, bibliotecas, pastas ou itens. `GET /admin/sharepoint/settings` também retornou `200` e confirmou o objeto de configurações globais, incluindo `sharingCapability` e `sharingDomainRestrictionMode`. A coleta SharePoint usa exclusivamente `GET`; mesmo com `Sites.FullControl.All`, o futuro conector bloqueia `POST`, `PATCH`, `PUT` e `DELETE` e não expõe operação de escrita para sites.

`GET /users/{id}/mailFolders/inbox/messageRules` retornou `200` com `value: []` para a mailbox amostrada, resposta vazia válida; regras de Inbox podem revelar `forwardTo`, `forwardAsAttachmentTo` e `redirectTo`, mas não configuração de forwarding de mailbox ou regras de transporte. `GET https://api.security.microsoft.com/api/machines?$top=1` continua `403 Unauthorized` (Defender for Endpoint, API externa à Graph). Intune requer licença ativa e `DeviceManagementManagedDevices.Read.All`; Defender exige a permissão/role externa `Machine.Read.All`.

Referências: [listar permissões de site](https://learn.microsoft.com/graph/api/site-list-permissions?view=graph-rest-1.0) e [ler configurações SharePoint](https://learn.microsoft.com/graph/api/sharepointsettings-get?view=graph-rest-1.0).

### Formatos de resposta das fontes correlatas

Os formatos a seguir são contratos públicos documentados; onde o tenant respondeu `401`/`403`, eles não são apresentados como payload observado.

- **Intune — `GET /deviceManagement/managedDevices`:** `200 application/json` devolve `{ "@odata.context": string, "@odata.nextLink": string?, "value": managedDevice[] }`. Para o `$select` previsto, cada item pode trazer `id`, `azureADDeviceId`, `complianceState`, `partnerReportedThreatState` e `lastSyncDateTime`, todos exceto `id` potencialmente nulos. O recurso também documenta atributos como `deviceName`, `operatingSystem`, `osVersion`, `enrolledDateTime`, proprietário e usuário; não solicitá-los nesta coleta evita PII desnecessária. [Learn](https://learn.microsoft.com/graph/api/intune-devices-manageddevice-list?view=graph-rest-1.0)
- **Inventário SharePoint — `GET /sites/getAllSites`:** `200 application/json` devolve `{ "value": site[], "@odata.nextLink": string? }`; cada `site` inclui `id`, `name`, `displayName`, `webUrl`, `isPersonalSite`, `createdDateTime`, `root?` e `siteCollection?` (`hostName`, `dataLocationCode?`, `root?`). O `@odata.nextLink` contém `$skiptoken` opaco. [Learn](https://learn.microsoft.com/graph/api/site-getallsites?view=graph-rest-1.0)
- **Permissões de site — `GET /sites/{site-id}/permissions`:** `200 application/json` devolve `{ "@odata.nextLink": string?, "value": permission[] }`. Uma permissão pode ter `id`, `roles[]`, `grantedTo`, `grantedToIdentities[]` e `sharePointIds`; nomes/e-mails em identidades são PII. `value: []` é resposta vazia válida sem permissões diretas retornadas no site consultado. [Learn](https://learn.microsoft.com/graph/api/site-list-permissions?view=graph-rest-1.0)
- **Configuração SharePoint/OneDrive — `GET /admin/sharepoint/settings`:** `200 application/json` devolve um objeto, não coleção, com `@odata.context`, `id`, `sharingCapability`, `sharingDomainRestrictionMode`, listas de domínios permitidos/bloqueados e demais flags globais de site/sincronização. [Learn](https://learn.microsoft.com/graph/api/sharepointsettings-get?view=graph-rest-1.0)
- **Exchange — `GET /users/{user-id}/mailFolders/inbox/messageRules`:** `200 application/json` devolve `{ "@odata.context": string, "@odata.nextLink": string?, "value": messageRule[] }`; uma regra possui `id`, `displayName`, `sequence`, `isEnabled`, `hasError`, `isReadOnly`, `conditions`, `exceptions` e `actions`. Para este fato, `actions.forwardTo`, `forwardAsAttachmentTo` e `redirectTo` são listas de `recipient.emailAddress` (PII); persistir apenas domínio/indicador externo. [Learn](https://learn.microsoft.com/graph/api/mailfolder-list-messagerules?view=graph-rest-1.0)
- **Defender for Endpoint — `GET https://api.security.microsoft.com/api/machines`:** `200 application/json` devolve `{ "@odata.context": string, "value": machine[] }`, paginável por `$skip`; cada máquina pode trazer `id`, `computerDnsName`, `firstSeen`, `lastSeen`, `osPlatform`, `healthStatus`, `onboardingStatus`, `riskScore`, `exposureLevel`, `aadDeviceId`, `machineTags` e IPs. São campos documentados, pois o tenant retornou `403` em modo de conta suspensa. [Learn](https://learn.microsoft.com/defender-endpoint/api/get-machines)

#### Exemplos `200` sanitizados do Learn

**Intune — `managedDevices`**

```json
{"@odata.context":"…#deviceManagement/managedDevices","@odata.nextLink":"opaque-url","value":[{"id":"device-id","azureADDeviceId":"entra-device-id","complianceState":"noncompliant","partnerReportedThreatState":"activated","lastSyncDateTime":"2026-08-14T12:00:00Z"}]}
```

**SharePoint — `sites/getAllSites`**

```json
{"value":[{"id":"site-id","name":"Site A","displayName":"Site A","webUrl":"https://tenant.sharepoint.com/sites/site-a","isPersonalSite":false,"root":{},"siteCollection":{"hostName":"tenant.sharepoint.com","dataLocationCode":"NAM"}}],"@odata.nextLink":"opaque-url-with-skiptoken"}
```

**SharePoint — `sites/{site-id}/permissions`**

```json
{"@odata.nextLink":"opaque-url","value":[{"id":"permission-id","roles":["reader"],"grantedTo":{"user":{"displayName":"Redacted","email":"redacted@example.invalid","id":"user-id"}},"sharePointIds":{"siteId":"site-id","siteCollectionId":"collection-id"}}]}
```

No tenant, a mesma rota devolveu validamente `{"@odata.context":"…","value":[]}` para o site amostrado.

**SharePoint — `admin/sharepoint/settings`**

```json
{"@odata.context":"…#admin/sharepoint/settings/$entity","id":"settings-id","sharingCapability":"externalUserAndGuestSharing","sharingDomainRestrictionMode":"allowList","sharingAllowedDomainList":["partner.example"],"isResharingByExternalUsersEnabled":true}
```

**Exchange — `messageRules`**

```json
{"@odata.context":"…#users('user-id')/mailFolders('inbox')/messageRules","value":[{"id":"rule-id","displayName":"External forward","sequence":1,"isEnabled":true,"conditions":{"subjectContains":["invoice"]},"actions":{"forwardTo":[{"emailAddress":{"name":"Redacted","address":"external@example.invalid"}}]}}]}
```

**Defender for Endpoint — `machines`**

```json
{"@odata.context":"…#Machines","value":[{"id":"machine-id","computerDnsName":"device.example.invalid","firstSeen":"2026-08-01T00:00:00Z","lastSeen":"2026-08-14T00:00:00Z","osPlatform":"Windows11","onboardingStatus":"onboarded","healthStatus":"Active","riskScore":"Low","exposureLevel":"Low","aadDeviceId":"entra-device-id","machineTags":["tag"]}]}
```
