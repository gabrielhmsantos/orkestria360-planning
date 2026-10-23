---
name: ui-blueprint
description: Decida e documente uma UI implementável a partir do Discovery, definindo composição e responsabilidades e usando APIs do Storybook quando verificadas. Não implemente frontend, stories, fixtures ou contratos de produto.
---

# UI Blueprint

Produza `ui-blueprint.md` como um handoff que registra decisões de apresentação e composição para implementar uma superfície sem reinterpretar o produto. Discovery e contratos determinam significado e comportamento aprovado; fixtures dão exemplos factuais do contrato; sponsor aprovado informa hierarquia visual; Storybook comprova APIs existentes; o blueprint decide como apresentar e compor esses elementos dentro dos limites aprovados.

Esta skill decide hierarquia, composição, propriedade de estado e transformações visuais, escolha de componentes e limites entre componentes e superfície. Não redefine produto, inventa dados ou ações, implementa frontend, cria stories, altera contrato semântico, mapeia provider → Orkestria, cria fixtures ou implementa integrações.

## Cópia local e fontes

Esta skill é uma cópia versionada do Design System, com procedência em [SKILLS.md](../../../docs/SKILLS.md). Seus scripts e referências estão nesta pasta, sem symlinks ou submódulos. Componentes e stories continuam pertencendo ao rig Design System; obtenha seu caminho no [mapa de repositórios](../../../docs/REPOSITORIOS.md). A cópia da skill não comprova que o Storybook MCP esteja disponível. Impeccable e Vercel Composition Patterns são competências opcionais: use-as quando disponíveis e pertinentes; se ausentes, registre essa limitação sem simular sua execução. A verificação das APIs materiais do catálogo continua obrigatória.

## Entrada e status

O usuário informa o diretório e a intenção de criar ou atualizar. Inspecione-o e leia [o intake](references/discovery-intake.md); escreva no diretório informado e só atualize arquivo existente quando solicitado.

Declare `conceptual` ou `reconciled` globalmente e por superfície quando divergirem. `conceptual` permite decidir estrutura e composição quando sustentadas por evidência, mas mantém bindings, significado ou APIs materiais não resolvidos como pendências explícitas. Não preencha lacunas com exemplos factuais inventados. `reconciled` é handoff implementável: exige decisões materiais resolvidas, contrato, mapping aplicável, fixtures/cenários, shape/cardinalidade/nulabilidade/relações reconciliados, conteúdo, bindings, estados, interação, responsividade, acessibilidade e APIs de componentes existentes verificadas. Pendência material de produto ou de API do design system impede `reconciled` na superfície afetada.

Quando uma composição necessária ainda não existe no Storybook, decida e descreva a extensão pretendida, sua anatomia, responsabilidade e dependência. Marque `pending_design_system_api`; não invente props nem registre a extensão como componente existente. Pendência de API não apaga a decisão arquitetural, mas mantém a superfície fora de `reconciled`.

## Fluxo

1. **Leia as fontes e defina suas autoridades** conforme o [intake](references/discovery-intake.md). Descubra superfícies, dados, interações aprovadas e pendências. Quando houver referência existente aprovada, use-a como evidência visual contextual, não como autorização para copiar fatos ou regras de domínio.
2. **Tome as decisões de UI antes de preencher as instâncias.** Defina hierarquia, ordem e composição das regiões; identifique intenção e responsabilidades; determine quem possui estado, transformações e recortes; separe snapshots de regiões derivadas; escolha a estratégia de composição. Leia [regras de seleção](references/component-selection-rules.md) e [padrões de implementação](references/implementation-patterns.md). Consulte o [estudo de caso do OneDrive](references/onedrive-case-study.md) como exemplo de raciocínio final, nunca como catálogo obrigatório.
3. **Registre as decisões materiais** no `UI decision log` do template global: escopo/IDs afetados, decisão, evidência, razão, alternativas avaliadas quando houver, responsável, status e dependências. Use `pending_product_decision` para significado ou comportamento sem decisão de produto; use `pending_design_system_api` para API de extensão não publicada. Pendências materiais impedem `reconciled` no escopo afetado.
4. **Inventarie conteúdo, copy e IDs estáveis** e defina os dados de cada região. Em `reconciled` data-backed, cada dado declara fixture/cenário, path, tipo, formatter, unidade, null, ausência e transformação visual em [bindings](references/data-binding-and-fixtures.md). Não replique mapping externo. Se contrato e mapping estiverem válidos, mas faltar fixture rastreável, produza somente blueprint `conceptual` e encaminhe `$frontend-contract-fixtures`; não crie JSON nesta skill.
5. **Aplique as especificações de famílias, estados, interação, responsividade, acessibilidade e layout**: [famílias](references/component-family-specifications.md), [estados](references/state-composition.md), [interações](references/interaction-contract.md), [responsividade](references/responsive-contract.md), [acessibilidade](references/accessibility-contract.md) e [layout](references/layout-composition.md). O registro de composição define ownership e estratégia; essas referências detalham os contratos por família sem substituir a decisão.
6. **Use Impeccable quando o trabalho pedir suas competências.** `$impeccable shape` ajuda quando objetivo, público ou tarefa ainda estiverem materialmente abertos; `$impeccable critique` pode apoiar uma revisão UX/UI; `$impeccable extract` pode apoiar a avaliação de oportunidades de reuso. Incorpore os resultados sem repetir esses fluxos, reabrir uma direção já aprovada ou implementar extrações.
7. **Consulte Vercel Composition Patterns quando a decisão envolver arquitetura React**, como modos booleanos que crescem, composição complexa ou estado compartilhado. Use as regras como critérios quando aplicáveis; não exija compound components, providers ou render props por padrão.
8. **Mapeie decisões para componentes e verifique APIs no Storybook** pelo [fluxo](references/storybook-mcp-workflow.md). Para cada instância, classifique reuso/adaptador/composição/extensão; registre a composição e ownership em [instâncias](references/instance-specification.md). Props, variantes e stories existentes precisam de evidência MCP. Para uma extensão proposta, declare a API pendente sem simular evidência.
9. **Produza o handoff** a partir de [templates/ui-blueprint.md](templates/ui-blueprint.md), replicando [a seção de superfície](templates/surface-section.md). Use `not_applicable` com motivo quando uma seção ausente puder causar dúvida. Ação é `none` com motivo ou fluxo definido; não invente interação para preencher espaço.
10. **Aplique o [gate](references/validation-checklist.md)** e, a partir da raiz do Planning, execute `node .agents/skills/ui-blueprint/scripts/validate-blueprint.mjs <arquivo>`. O validador checa estrutura e rastreabilidade; revisão semântica e Storybook continuam sendo gates separados.

## Conclusão

Conclua `reconciled` somente quando a implementação não precisar decidir significado, conteúdo, binding/formato, estado/ownership, composição, foco/teclado, breakpoint ou API material de design system. Storybook valida APIs possíveis, nunca define produto; ausência de catálogo pode gerar uma extensão documentada, mas não uma API alegadamente verificada.
