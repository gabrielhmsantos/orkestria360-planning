# <Nome da superfície>

Use cada seção no arquivo correspondente da superfície. Mantenha uma afirmação
somente quando houver evidência, hipótese ou pendência identificada. Não crie
produto ou contrato paralelos por track.

## Classificação de dados

- **Tipo:** `data-backed` | `not_data_backed`.
- **Dependência material:** <fonte estruturada e fatos que podem alterar layout, conteúdo, estado, interação ou cálculo; ou `não aplicável`>.
- **Fixture de Discovery:** <referência a `fixtures/README.md` quando a superfície data-backed tiver mapping validado; pendência técnica quando ainda não tiver>.

## Produto

- Papel: <decisão ou necessidade atendida>
- Resultado esperado: <resultado verificável>
- Capacidades e limites: <o que a superfície deve e não deve permitir>

## Design sugerido

- Composição e interação: <estrutura e comportamento, sem especificar pixel ou estilo novo>
- Estados aplicáveis: <runtime states e seu efeito observável, sem confundir com readiness>

## Decisões

- <classificação de evidência; decisão, motivo, origem e pendência quando houver>

## Contratos

- Dados necessários: <shape, propriedades, tipos, nulabilidade, cardinalidade, unidades e relações>
- Semântica: <significado, cálculos, ranges, ausência, coverage, freshness e estados aplicáveis>
- Comportamento observável: <filtros, ordenação, paginação, ações e resultados>
- State Matrix, quando ela tornar a superfície verificável: <cenário, runtime state, dados permitidos e resultado esperado>

`contratos.md` é provider- e implementation-agnostic. Não registre nele
endpoint, permission, API version, tabela, classe, collector, job, sync ou
persistência física. O track backend registra esse mapeamento em
`fontes-e-viabilidade.md`.

Uma fixture de Discovery instancia este contrato semântico. Use valores
sintéticos plausíveis, mas não invente campos, regras, relações, ranges ou
semântica para preencher a UI.
