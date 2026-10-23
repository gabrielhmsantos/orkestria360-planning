# APIs — Usuários de Risco

## `GET /identityProtection/riskyUsers`

`GET` sem corpo, `v1.0`, `$top=500`, `Authorization: Bearer`. A revalidação confirmou que o token de aplicação contém `IdentityRiskyUser.Read.All`; mesmo assim a rota devolveu `403 Forbidden` com a razão sanitizada de que o tenant não possui licença para o recurso. Logo a fonte é `restricted` especificamente por licença Entra ID P2, não por permissão e não uma coleção vazia. A resposta viável é envelope OData paginável de `riskyUser` com `id`, UPN/nome, `riskLevel`, `riskState`, `riskDetail` e `riskLastUpdatedDateTime`. PII: identidade e dados de risco. Referência: [Learn](https://learn.microsoft.com/graph/api/riskyuser-list?view=graph-rest-1.0).

## `GET /identityProtection/riskDetections` e `/identityProtection/riskyUsers/{user-id}/history`

Fontes previstas pelo DOCX para detecção/histórico. A revalidação confirmou `IdentityRiskEvent.Read.All` no token, mas `riskDetections` devolveu `403 Forbidden` porque o tenant não possui licença para o recurso. O histórico também devolveu `403` por licença do tenant, embora compartilhe `IdentityRiskyUser.Read.All` presente no token. Nenhuma resposta é coleção vazia. Ambas dependem de Entra ID Protection. Snapshots periódicos, não delta/watermark inferido.

## Uso pela aplicação

`riskyUsers` é snapshot complementar correlacionado por `id` à identidade publicada. Detecções e histórico só justificam coleta pelos seus campos exclusivos, depois de validação técnica; a tela nunca consulta Graph diretamente.
