# Controles Aceitos e Exceções — Contratos

- Dados: controle/perfil Graph e entidade Exceção com motivo, risco, compensação, validade, revisão, evidência e status.
- Fonte e limite: estados Microsoft podem exigir escrita futura; registro Orkestria e aprovação não estão habilitados.

## Integração com o sync coordenado

- Perfis e controles são projeções locais de `secureScoreControlProfiles` e `secureScores`; nenhuma tela chama Graph. O catálogo de perfis é nova coleta justificada e foi validado com `200`, paginação e associação aos controles atuais; exceções internas continuam `coming_soon`.
- Exceções são exclusivamente internas nesta versão. Em falha, manter publicação anterior e declarar `availability`, `coverage`, `freshness`, `reason` e `result_state`.
