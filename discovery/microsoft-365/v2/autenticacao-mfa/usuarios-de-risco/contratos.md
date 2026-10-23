# Usuários de Risco — Contratos

- Dados: usuário, nível/estado/tipo, detecção, data, contexto, MFA e privilégio quando publicados.
- Integração: `riskyUsers`, `riskDetections` e histórico de risco; `IdentityRiskEvent.Read.All` conforme DOCX.

## Integração com o sync coordenado

Fatos: snapshots de `GET /identityProtection/riskyUsers`, `GET /identityProtection/riskDetections` e `GET /identityProtection/riskyUsers/{user-id}/history`, correlacionados por `id` à identidade publicada. As permissões `IdentityRiskyUser.Read.All` e `IdentityRiskEvent.Read.All` estão presentes no token, mas as três fontes retornaram `403` por licença Entra ID P2 ausente; ficam `restricted`. `riskDetections` continua nova coleta justificada por campos exclusivos. Não há delta/watermark inferido para risco. Consumidores: Risco e Dashboard; as telas leem projeções locais, preservam última publicação quando houver e expõem estados de fonte. Telemetria por etapa e separação coleta/staging/promoção seguem o sync coordenado.
