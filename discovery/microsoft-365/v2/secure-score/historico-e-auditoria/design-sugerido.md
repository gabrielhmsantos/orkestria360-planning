# Histórico e Auditoria — Design sugerido

- Composição: KPIs, filtros, gráficos por tipo/tempo/origem, tabela paginada, detalhe lateral e avisos de retenção/conformidade.
- Estados: com coleta autorizada, a superfície é `available` desde a primeira publicação. Estágios de coleta ficam disponíveis imediatamente; alterações observadas e Antes x Depois exibem “sem base comparável” até haver dois snapshots, sem confundir cobertura insuficiente com `restricted`. Falha atual preserva o histórico anterior, marcado como defasado com motivo e frescor. Auditoria Operacional (ações, autoria, IP, justificativa e correlação) é bloco separado, desabilitado e `coming_soon` até event store append-only, minimização, retenção e controle de acesso definidos.
