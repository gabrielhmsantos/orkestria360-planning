# APIs — Eventos e Utilização

## `GET /auditLogs/signIns`

`GET` sem corpo, `v1.0`, `Authorization: Bearer`, `AuditLog.Read.All`. Consulta validada: `$top=100`, `$orderby=createdDateTime asc`, `$filter=createdDateTime ge {início} and createdDateTime lt {fim}`. No tenant de desenvolvimento: `200 application/json`, 20 itens, uma página, sem retry/throttling. Envelope OData contém `value[]` e `@odata.nextLink` opcional; o cursor é opaco e todas as páginas devem ser seguidas.

Campos observados: `id`, data, usuário/UPN, app/recurso, IP, cliente, correlação, CA, interatividade, risco, `status`, dispositivo, localização e `appliedConditionalAccessPolicies`. PII: usuário, UPN, IP, dispositivo, localização e IDs. Políticas aplicadas podem ser omitidas sem `Policy.Read.All` ou `Policy.Read.ConditionalAccess`. `403/429` preservam a publicação anterior; `200 []` é `empty_valid_response`. Referência: [Learn](https://learn.microsoft.com/graph/api/signin-list?view=graph-rest-1.0).

## Uso pela aplicação

Fonte canônica de eventos: watermark, janela fechada inclusiva/exclusiva, overlap de 15 minutos, deduplicação por `id` e promoção do watermark somente após publicar o lote. Eventos, Falhas e Dashboard leem a projeção/event store publicado, sem repetir Graph.
