# APIs — Histórico e Auditoria de Grupos

## `GET /auditLogs/directoryAudits`

**Request:** sem corpo; `$top`, `$orderby=activityDateTime desc` e `$filter` apenas com sintaxe/campos aceitos. `AuditLog.Read.All` é a menor permissão de aplicação considerada. **Resposta:** `200 application/json` no envelope `{ "@odata.context": string, "value": DirectoryAudit[], "@odata.nextLink": string? }`; seguir `@odata.nextLink` opaco.

`DirectoryAudit` contém `id`, `activityDisplayName`, `activityDateTime`, `category`, `correlationId`, `loggedByService`, `operationType`, `result`, `resultReason`, `initiatedBy` e `targetResources[]`. Alvos podem conter `id`, `displayName`, `type` e `modifiedProperties[]` com valores serializados. Ator, alvo, IP quando presente e valores antes/depois são PII/dados sensíveis e exigem minimização. `403` é `restricted`; `429` exige respeitar `Retry-After`; retenção/cobertura são condicionais ao tenant.

## Delta e excluídos

`GET /groups/delta` não possui corpo, retorna `200` com `value: Group[]`, `@odata.nextLink` durante a rodada e `@odata.deltaLink` ao final. Cursores são opacos; em `410 Gone` com `Location` ou `syncStateNotFound`, executar `sync_reset` com carga completa idempotente e só promover novo cursor ao término. Selecionar `members` permite mudanças de associação, retornando apenas IDs relacionados; proprietários e propriedades não acompanhadas exigem reconciliação completa. Grupos excluídos são evidência futura via `/directory/deletedItems/microsoft.graph.group`, ainda sem contrato de operação/restauração.

## Homologação de leitura

Auditoria e delta responderam `200 application/json` com envelope OData e `@odata.nextLink`; delta confirmou `members@delta`. A coleção de grupos excluídos respondeu `200` com `value: []` sem filtro, classificada como `empty_valid_response`. Eventos, alvos e propriedades permanecem redigidos.
