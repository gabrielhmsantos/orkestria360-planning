# Baselines e Conformidade — Contratos

- Baseline: tenant, tipo, versão, status, origem e itens com valor esperado, severidade, obrigatoriedade e exceção.
- Comparação: `settingKey`, valor atual, valor esperado, `complianceStatus`, risco, cobertura, fonte, instante do snapshot e causa de indisponibilidade quando não comparável.

## Integração com o sync coordenado

Baselines e comparações são projeções locais: correlacionam `settingKey` da matriz homologada com fatos de configuração já publicados, sem nova coleta Graph/Azure. A comparação só publica conformidade quando houver valor atual e baseline comparáveis; em falha de fonte preserva a publicação anterior e seus estados `availability`, `coverage`, `freshness`, `reason` e `result_state`. A tela não chama fonte externa.
