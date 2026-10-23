# Pontuação por Categoria — Contratos

- Dados: `controlScores`, perfis, snapshots e média comparativa quando retornada. Pontos atuais/máximos = soma dos controles da categoria; percentual = `pontos atuais / pontos máximos × 100`. Sem pontos máximos disponíveis ou diferentes de zero, o percentual fica indisponível.
- Distribuição por progresso: para controle associado, com `secureScores.controlScores.score` e `secureScoreControlProfiles.maxScore` numéricos e máximo > 0, `score >= maxScore` = concluído; `0 < score < maxScore` = parcial; `score = 0` = pendente. Campo ausente/nulo, máximo não positivo ou perfil ausente = sem classificação, reduzindo `coverage`. `implementationStatus` é apenas o status Microsoft exibido e não substitui esse cálculo.
- Fonte e limite: agrupamento por `controlCategory` usa campo observado no tenant; associação com perfil foi validada para os controles atuais.

## Integração com o sync coordenado

- Consumidor de projeção local da fotografia canônica `secureScores`; `controlScores.controlCategory` e `score` são agregados somente após a publicação. Não há nova chamada Graph nem consulta de tela.
- O enriquecimento por perfil é leitura complementar do catálogo `secureScoreControlProfiles`, não extensão de `secureScores`; a homologação `200` confirmou 5 páginas/449 perfis e associação 71/71. Ausência, colisão ou divergência futura reduzem cobertura correlata.
- Falhas preservam a projeção anterior e expõem `availability`, `coverage`, `freshness`, `reason` e `result_state` da fonte publicada.
- A disponibilidade é dinâmica por tenant e publicação: fonte autorizada com geração íntegra torna a agregação `available`; autorização, licença ou produto indisponível a mantém `restricted` naquela execução, sem hardcode por tenant.
