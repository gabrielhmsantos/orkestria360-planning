# APIs — Histórico e Auditoria

## `GET /auditLogs/directoryAudits`

**Request:** `$top=100`, `$orderby=activityDateTime desc` e `$filter` somente para campos/sintaxes aceitos pelo Graph; sem corpo. O cliente segue `@odata.nextLink` opaco e não recompõe a query. **Resposta:** envelope `{ "@odata.context": string, "value": DirectoryAudit[], "@odata.nextLink": string? }`.

Cada `DirectoryAudit` contém `id`, `activityDisplayName`, `activityDateTime`, `category`, `correlationId`, `loggedByService`, `operationType`, `result`, `resultReason`, `initiatedBy` e `targetResources[]`. `initiatedBy` identifica usuário ou app iniciador; cada alvo expõe `id`, `displayName`, `type` e, quando aplicável, `modifiedProperties[]` (`displayName`, `oldValue`, `newValue`, valores serializados).

O endpoint requer `AuditLog.Read.All`. Ator, alvo e propriedades modificadas podem conter PII; retenção e cobertura são condicionais ao tenant, portanto o snapshot interno preserva fonte, ator, alvo, resultado e data de coleta.

## `GET /auditLogs/signIns`

O histórico de autenticação solicita a **primeira página de até 100 eventos recentes** com `$top=100` e `$orderby=createdDateTime desc`; não possui corpo. Embora o Graph possa fornecer `@odata.nextLink`, a coleta diária não o segue deliberadamente para limitar tempo de execução e volume local enquanto o escopo de retenção dos logs é avaliado com o sponsor. A resposta usa envelope OData `{ "value": SignIn[], "@odata.nextLink": string? }`. Cada `SignIn` observado contém `id`, `createdDateTime`, `userDisplayName`, `userPrincipalName`, `userId`, `appId`, `appDisplayName`, `ipAddress`, `clientAppUsed`, `conditionalAccessStatus`, sinais de risco, `status`, `deviceDetail`, `location` e políticas de acesso condicional aplicadas. É PII sensível e sujeito à retenção; a coleta validou `200`, mas ausência futura de permissão ou licença é `restricted`, não lista vazia.
