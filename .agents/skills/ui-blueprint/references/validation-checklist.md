# Gate de completude

## Todos

- [ ] Metadata, status, fontes, prontidão, Storybook, breakpoints, estados e acessibilidade globais existem.
- [ ] UI decision log lista cada decisão material com escopo/IDs válidos, evidência, razão, owner, status e dependências.
- [ ] Cada ID material tem uma estratégia de composição e boundary de responsabilidades; estado, transformação e dependência de filtro têm owner explícito.
- [ ] Cada superfície tem conteúdo/copy e IDs enumerados, seções aplicáveis ou `not_applicable`, composição desktop/tablet/mobile e status de evidência honesto para cada API.
- [ ] IDs únicos, sem placeholders; divergências do sponsor, lacunas e decisões abertas explícitas.
- [ ] Ações são `none` com motivo ou fluxo definido; blueprint não implementa frontend nem produz contrato/mapping/fixture.
- [ ] `design_system_extension` sem Storybook está marcado `pending_design_system_api`; não inventa props, story ou preview.
- [ ] `direct_reuse` usa API e story verificadas; adapters/composições locais distinguem seu contrato local das APIs compartilhadas verificadas.

## `reconciled` data-backed

- [ ] Cada dado tem fixture/cenário, path, tipo, formatter, unidade, null, ausência e transformação visual.
- [ ] KPIs têm label/ordem/binding/formatter; filtros label/tipo/default/reset; tabelas caption e todas as colunas.
- [ ] Gráficos têm título, séries/categorias, unidade, período, coverage/freshness e resumo acessível; detalhes têm campos, gatilho, ESC e foco.
- [ ] Estados definem visibilidade, substituição, copy, ação/retry, dados prévios, freshness, foco, aria-live, filtro/seleção/paginação.
- [ ] Superfície interativa possui uma linha por filtro, tabela interativa, detalhe, ação, link ou aba no contrato de interação.
- [ ] As composições desktop, tablet e mobile descrevem a superfície inteira; não ficam vazias em favor da tabela de transições.
- [ ] Paginação define modelo, posição, tamanho, totais, resets/preservações, foco, scroll, loading, vazio e labels acessíveis.
- [ ] Cada ID inventariado liga especificação, binding quando exibe dado, responsividade e evidência Storybook; hero, abas, ações e links também são enumerados quando existirem.
- [ ] Todo ID material está coberto pelo mapa de composição e referencia uma decisão existente; cada decisão afeta IDs existentes ou declara `global`.
- [ ] Nenhuma decisão material em `pending_product_decision` ou `pending_design_system_api` afeta superfície `reconciled`.
- [ ] Breakpoints reais, transições e landmarks/nome/foco/teclado/alternativa textual estão definidos; token e preview URL são verificáveis.

Na raiz do design system, execute `node skills/ui-blueprint/scripts/validate-blueprint.mjs <arquivo>`; o gate valida estrutura, IDs, referências e consistência dos status. Ele não julga a correção semântica das decisões e não substitui revisão de produto nem Storybook MCP.
