# Histórico e Auditoria — Contratos

## Recorte V2 — Histórico Observado de Score e Coletas

- Dados publicados: data/hora do snapshot ou da sincronização, origem exibida como `Alterações observadas no Microsoft Graph` ou `Coletas do Orkestria`, tipo (`score_observado`, `controle_observado`, `sync_publicado`, `sync_falhou`), entidade, antes/depois disponível, resultado, `availability`, `coverage`, `freshness`, `reason` e `result_state`.
- Fonte: snapshots publicados de `secureScores`, catálogo publicado de `secureScoreControlProfiles` e metadados do sync coordenado. A tela não chama Microsoft Graph diretamente.
- Semântica: uma diferença entre snapshots é uma alteração **observada**, não um evento causal. Na falta de evidência, `cause = not_identified`; não expor usuário executor, IP, justificativa ou `correlationId` como se viessem do Graph.
- Disponibilidade por bloco: com coleta autorizada, a superfície é `available` desde a primeira publicação. Estágios `sync_publicado` e `sync_falhou` ficam disponíveis imediatamente; `score_observado`, `controle_observado` e “Comparativo Antes x Depois” exigem duas gerações comparáveis e, antes disso, exibem “sem base comparável” como cobertura insuficiente, nunca como `restricted` ou zero. Falha atual mantém a publicação anterior visível, marcada com frescor e motivo.
- Comparativo: só exibe campos persistidos nas duas gerações — score, máximo, categorias e controles coletados. Campo ausente é `— Não coletado`; metadados de perfil (inclusive depreciação) só participam depois do versionamento do catálogo.
- Nota de interpretação persistente: “Diferenças entre snapshots não identificam causa ou autor.” Usuário/autoria aparece como `— Não disponível no Histórico Observado`.

## Auditoria Operacional futura

- Dados previstos: evento, origem, tipo, entidade, antes/depois, motivo, resultado e correlação; dados pessoais mínimos somente quando justificados.
- Eventos internos de metas, plano, responsáveis, evidências e exceções seguem `coming_soon`. Retenção, acesso, integridade append-only e privacidade precisam de decisão na Spec.

## Integração com o sync coordenado

- Não há endpoint Graph Secure Score adicional homologado para eventos de auditoria nesta versão. A superfície projeta metadados de estágios publicados de `secureScores` e `secureScoreControlProfiles`, sem chamada Graph de tela; eventos internos seguem `coming_soon`.
- Não inferir causalidade nem fabricar evento a partir de uma alteração de score. Falhas das fontes preservam a publicação anterior e expõem `availability`, `coverage`, `freshness`, `reason` e `result_state`.
