# Falhas e Bloqueios — Contratos

- Dados: estado/razão/detalhe de falha, método, IP, localização, aplicação, dispositivo e política aplicável.
- Integração: sign-ins Graph; classificação, alertas e incidentes exigem regras e persistência Orkestria.

## Integração com o sync coordenado

Decisão: projeção local de `GET /auditLogs/signIns`; recorrência, classificação e alertas são agregações internas. Chave de deduplicação é `signIn.id`, com a mesma janela/overlap/publicação da fonte de eventos. Falha da fonte não infere zero e mantém geração/eventos anteriores com metadata de disponibilidade. A tela não chama Graph; a telemetria e a separação coleta/staging/promoção são as da etapa `sign_ins`.
