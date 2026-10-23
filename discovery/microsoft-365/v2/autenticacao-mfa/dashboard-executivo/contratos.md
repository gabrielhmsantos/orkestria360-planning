# Dashboard Executivo — Contratos

- Dados: registro MFA agregado, diretório, snapshots, sign-ins, métodos, aplicações e alertas; procedência por fonte.
- Integração: `userRegistrationDetails`, `/users`, sign-ins e armazenamento próprio. Score e alertas dependem de regras pendentes.

## Integração com o sync coordenado

Decisão: projeção local de identidades, registro MFA, sign-ins, auditoria e risco já publicados por suas etapas canônicas. O Dashboard é somente consumidor: não repete chamadas Graph, filtros ou agregações. Se uma fonte falhar/restringir, mantém a última publicação e expõe `availability`, `coverage`, `freshness`, `reason` e `result_state`, sem inferir zero. Score, alertas, elegibilidade e exceções continuam regras internas pendentes; telemetria pertence a cada etapa de coleta, separada de staging/promoção.
