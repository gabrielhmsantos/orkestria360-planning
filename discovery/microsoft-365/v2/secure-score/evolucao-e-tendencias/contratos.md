# Evolução e Tendências — Contratos

- Dados: snapshots diários, categorias, controles e alterações observadas. Sem snapshot comparável, a variação exibe `— vs. período anterior`; não representa zero nem estimativa.
- Fonte e limite: Graph retém aproximadamente 90 dias; persistência superior e causalidade dependem da Spec. Uma alteração observada não é atribuída a configuração, usuário ou ação sem evidência correlata. Não há alerta automático de regressão ou crítico nesta versão.

## Integração com o sync coordenado

- Consumidor de projeção local da fotografia `secureScores` publicada por snapshot paginado; o endpoint confirmou 90 itens no tenant e não oferece delta seguro. A retenção maior depende de snapshots Orkestria, sem nova leitura Graph histórica.
- Não há chamada Graph em tela. Falha de fonte preserva a série anterior e expõe `availability`, `coverage`, `freshness`, `reason` e `result_state`, com páginas, itens, tentativas e throttling registrados pelo estágio.
