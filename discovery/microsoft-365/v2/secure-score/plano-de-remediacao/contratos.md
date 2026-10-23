# Plano de Remediação — Contratos

- Dados: ação, meta, dependência, estimativas, evidência, validação e score/snapshot. Score projetado = `(currentScore + soma dos ganhos potenciais selecionados) / maxScore × 100`; a unidade é percentual e o resultado é estimado, não substitui a fotografia oficial. Sem score/máximo/seleção suficientes, a projeção fica indisponível.
- Fonte e limite: entidades Orkestria propostas no modelo; nenhum workflow é autorizado nesta versão.

## Integração com o sync coordenado

- Consumidor local de `secureScores` e do catálogo `secureScoreControlProfiles`; não realiza leitura Graph própria. O catálogo é nova coleta justificada e foi validado com `200`, 5 páginas e 449 perfis. A projeção funcional continua condicionada às entidades internas de plano, meta e seleção.
- A projeção usa apenas geração íntegra das fontes e dados internos; falha preserva publicação anterior e declara `availability`, `coverage`, `freshness`, `reason` e `result_state`.
