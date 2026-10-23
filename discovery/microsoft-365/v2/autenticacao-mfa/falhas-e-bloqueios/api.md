# APIs — Falhas e Bloqueios

## `GET /auditLogs/signIns`

Contrato, evidência técnica e PII: ver [Eventos e Utilização](../eventos-e-utilizacao/api.md). A classificação usa `status.errorCode`, `failureReason`, `additionalDetails` e `authenticationDetails` quando presentes; as categorias, recorrência e alertas são regras internas configuráveis, não resposta Graph.

## Uso pela aplicação

Decisão: projeção local da fonte canônica de sign-ins, filtrada/agregada localmente. Falha, `403` ou `429` não apagam a geração/event store publicado e não inferem falhas zero.
