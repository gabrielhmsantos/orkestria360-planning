# Discovery

Discovery reúne exploração e decisões que sustentam o planejamento. Cada tarefa seleciona os contratos, as decisões e as evidências pertinentes ao escopo aprovado. Os materiais fornecidos pelo usuário estão em [inputs/](../inputs/README.md), na branch recebida; análises e decisões produzidas aqui referenciam o path e o commit das fontes sem alterar os originais.

| Área | Material |
| --- | --- |
| Microsoft 365 | `microsoft-365/v1/` e `microsoft-365/v2/`, com produto, contratos, APIs, blueprints e fixtures conforme cada módulo |
| Multi-tenancy | [Índice](multi-tenant/README.md), isolamento, arquitetura e contratos |
| Governança | [V2](estruturacao-governanca/v2/README.md), formulários e contrato de evidências |
| Azure | `azure/v1/`, incluindo investigação de subscriptions |

Para trabalhar em uma superfície, comece pelo README do módulo quando existir e pelos artefatos que declaram intenção e prontidão. Separe contrato semântico, fontes Microsoft, cobertura sintética e plano de implementação. Use a [skill make-discovery](../.agents/skills/make-discovery/SKILL.md) quando a tarefa pedir criar, atualizar ou analisar esse conjunto.

Referências externas e relatórios de validação antigos precisam ser confirmados quando sua versão ou semântica for relevante para uma nova decisão. Uma fonte citada que não esteja disponível não deve ser tratada como evidência verificada. Fixtures permanecem sintéticas; nenhuma credencial ou resposta real deve ser incorporada.
