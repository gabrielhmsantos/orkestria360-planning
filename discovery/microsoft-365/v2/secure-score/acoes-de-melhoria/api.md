# APIs — Ações de Melhoria / Secure Score

## `GET /security/secureScoreControlProfiles`

**Resultado:** `endpoint viável`. Após um `429` inicial tratado como throttling, a repetição retornou `200 application/json`. A coleta seguiu cinco páginas, leu 449 perfis e confirmou `@odata.nextLink`; todos os 71 `controlScores.controlName` da fotografia mais recente tiveram correspondência por ID de perfil normalizado. Repetição deve respeitar `Retry-After`, aplicar retry limitado e preservar a publicação anterior.

O contrato público `v1.0` é `GET` sem corpo, com OData `$count`, `$filter`, `$skip` e `$top`, envelope `value` e `@odata.nextLink` opcional. Permissão mínima delegada ou de aplicação: `SecurityEvents.Read.All`, com consentimento administrativo; `SecurityEvents.ReadWrite.All` não é necessário para leitura. A resposta confirmou `id`, `azureTenantId`, `actionType`, `actionUrl`, `controlCategory`, `title`, `deprecated`, `implementationCost`, `lastModifiedDateTime`, `maxScore`, `rank`, `remediation`, `remediationImpact`, `service`, `threats`, `tier`, `userImpact`, `vendorInformation`, `complianceInformation` e `controlStateUpdates`. Texto de remediação/URLs podem expor contexto operacional; nenhum valor real foi registrado nesta validação.

**Exemplo `200 application/json` sanitizado:**

```json
{"@odata.context":"…#security/secureScoreControlProfiles","@odata.nextLink":"opaque-url","value":[{"id":"control-id","azureTenantId":"tenant-id","actionType":"config","actionUrl":"https://security.microsoft.com","controlCategory":"Identity","title":"Example control","deprecated":false,"implementationCost":"low","lastModifiedDateTime":"2026-08-14T12:00:00Z","maxScore":5,"rank":10,"remediation":"Guidance","remediationImpact":"low","service":"Azure Active Directory","threats":["Credential theft"],"tier":"Core","userImpact":"low","vendorInformation":{"vendor":"Microsoft"},"complianceInformation":[],"controlStateUpdates":[]}]}
```

## Uso pela aplicação

É uma **nova coleta justificada**, distinta de `secureScores`: perfis são catálogo de metadados e recomendações, enquanto o score é fotografia diária. A coleta futura obtém somente o catálogo paginado e o publica localmente; consumidores relacionam-no a `controlScores.controlName` por chave normalizada, mantendo não associados/ambíguos como cobertura incompleta. Não há chamada Graph na tela.
