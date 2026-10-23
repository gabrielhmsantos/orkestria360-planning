# Fluxo do Storybook MCP

Storybook é a autoridade de componente compartilhado existente, variante, prop, story, preview e comportamento documentado; não é autoridade de conteúdo de produto, copy, campo, coluna, filtro ou comportamento funcional.

1. Chame `docs-list` com stories antes de selecionar APIs compartilhadas.
2. Chame `docs-show` para cada componente selecionado e `docs-show-story` quando uma variante for decisiva.
3. Registre componente, variante, props exatas, story ID e URL de preview para cada API compartilhada utilizada.
4. Em uma composição local/adaptador, registre as APIs filhas verificadas e documente no mapa de composição o contrato de fatos, estado e responsabilidades do wrapper. Não invente uma assinatura React nem afirme que o wrapper tem story no catálogo.
5. Se uma composição compartilhada necessária não existe, registre a extensão proposta e `pending_design_system_api`, com intenção, anatomia, responsabilidade, estados e dependências. Não crie nome de componente como se já existisse, props, story ID ou URL de preview.

Se MCP, catálogo ou documentação necessária estiver indisponível, registre bloqueio à verificação de API; ainda é possível decidir composição com evidência aprovada, mas mantenha a superfície `conceptual` quando a implementação depender materialmente dessa API. Não adivinhe props nem ofereça substituto não verificado. `stories-preview` e testes de story são para a fase de implementação e não substituem a evidência de planejamento.
