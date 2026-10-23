# Composição de estados

Para cada estado aplicável — `loading`, `empty`, `partial`, `stale`, `failed`, `unavailable`, `restricted`, `coming_soon` — defina o que fica/remove/substitui, componente, copy, ação/retry, dados prévios, freshness, foco, aria-live, filtros, seleção e paginação. O mapa de composição declara quem possui o estado e quais regiões derivadas atualizam juntas; regiões snapshot ou tenant-stable permanecem independentes. Registre `not_applicable` com motivo para os demais.

Componha disponibilidade no limite da região/fonte que a publica; não propague estado entre fontes independentes sem contrato. `empty ≠ unavailable`, `partial ≠ failed`, `stale ≠ loading`. Falta de fixture não autoriza zero ou placeholder.
