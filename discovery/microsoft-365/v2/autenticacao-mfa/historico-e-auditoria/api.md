# APIs — Histórico e Auditoria

## `GET /auditLogs/directoryAudits`

`GET` sem corpo, `v1.0`, `Authorization: Bearer`, `AuditLog.Read.All`; query validada com `$top=100`, `$orderby=activityDateTime asc` e janela `$filter` inclusiva/exclusiva. Resultado técnico: `200 application/json`, dois itens, uma página, sem retry/throttling. Envelope OData com `value[]` e `@odata.nextLink` opcional. Campos observados: `id`, categoria, correlação, resultado, atividade/data, serviço, iniciador, alvos e detalhes adicionais. PII: ator, alvo, IP, IDs e antes/depois em propriedades modificadas.

`403`, `429` e limite temporal são fonte restrita/falha; não viram período vazio. `200 []` é `empty_valid_response`. Referência: [Learn](https://learn.microsoft.com/graph/api/directoryaudit-list?view=graph-rest-1.0).

## Uso pela aplicação

Fonte canônica por watermark, janela fechada, overlap de 15 minutos e deduplicação por `id`; em limite de retenção o coletor reinicia uma vez na menor data aceita. Auditoria Orkestria é fonte interna separada. A tela lê o event store publicado.
