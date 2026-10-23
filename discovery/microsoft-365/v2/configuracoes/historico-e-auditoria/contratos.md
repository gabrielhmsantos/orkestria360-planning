# Histórico e Auditoria — Contratos

- Evento observado: momento, configuração, serviço, objeto, antes/depois, origem, risco, correlação e referências de evidência.
- Detalhe técnico: fonte, endpoint/cmdlet de coleta, versão, instante e razão de restrição. Payloads e logs sensíveis não são expostos sem política autorizada.
- Drift: configuração, valores anterior/detectado/baseline, momento, origem externa, ator quando autorizado, risco e investigação.
- A tabela permite filtrar por workload.
- Para estado de configuração, a fonte pode declarar `sourceLastModifiedAt`; o Orkestria registra `lastObservedChangeAt` ao detectar diferença entre snapshots e `lastCollectedAt` na coleta. O horário de um evento de auditoria não substitui esses campos sem correlação explícita.

## Integração com o sync coordenado

`directoryAudits` é projeção local da auditoria canônica, com watermark temporal, ordenação ascendente, paginação por link OData opaco e deduplicação pela referência externa. A coleta por conexão customer ocorre antes do staging; reset de cursor exige replay idempotente, sem chamada da tela. Falha ou restrição preserva a última publicação e expõe `availability`, `coverage`, `freshness`, `reason` e `result_state`; telemetria separa coleta, staging e promoção atômica.
