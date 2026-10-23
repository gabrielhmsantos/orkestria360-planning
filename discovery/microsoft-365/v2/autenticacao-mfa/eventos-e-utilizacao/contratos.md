# Eventos e Utilização — Contratos

- Dados: `createdDateTime`, identidade, aplicação, contexto, métodos, CA, resultado, risco e correlação, minimizados na UI conforme necessidade.
- Integração: Graph `/auditLogs/signIns`; `AuditLog.Read.All`, e Policy Read para políticas aplicadas, segundo DOCX.

## Integração com o sync coordenado

Fato canônico: sign-ins. Decisão: projeção local do event store publicado; consumidores incluem Eventos, Falhas e Dashboard. Estratégia watermark: janela `[início,fim)`, overlap de 15 min, paginação integral, deduplicação por `id` e avanço somente depois da publicação. `403`, `429` ou falha preservam o evento publicado, com estados declarados; a tela não repete Graph. Telemetria da etapa registra duração, páginas, itens, deduplicação, tentativas, throttling/retry e motivo sanitizado; coleta, staging e promoção são separados.
