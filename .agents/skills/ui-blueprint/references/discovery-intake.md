# Intake do Discovery

Use o diretório fornecido, sem presumir nomes ou hierarquia. Leia nesta ordem: `README.md`, matriz de prontidão, classificação `data-backed`, `produto.md`, `design-sugerido.md`, `decisoes.md`, `contratos.md`; em superfície data-backed, `fontes-e-viabilidade.md`, `fixtures/README.md`, `fixtures/*.json`; `api.md`/`openapi.yaml` somente se seus limites alterarem UI; referências do sponsor; Storybook MCP.

| Fonte | Autoridade |
| --- | --- |
| produto/decisões e contratos | significado Orkestria, intenção e comportamento aprovados |
| fixtures | exemplos concretos do contrato; não são autorização para inventar semântica |
| fontes-e-viabilidade.md | rastreabilidade e disponibilidade dos dados |
| sponsor ou superfície aprovada | hierarquia e intenção visual no escopo validado |
| design system e Storybook | APIs, variantes, estados e stories implementáveis |
| blueprint | decisão final de apresentação, composição e responsabilidades dentro das fontes anteriores |

Descubra superfícies pelo conteúdo. Resolva conflitos nesta ordem: produto/contrato prevalece para significado e comportamento; sponsor/superfície aprovada informa organização visual sem provar capacidade ou dado; Storybook prova somente APIs existentes; blueprint escolhe composição e ownership sem contrariar os anteriores. Se houver conflito de semântica ou requisito, registre `pending_product_decision`; não o resolva por inferência visual.

Use uma superfície aprovada como referência somente para padrões cuja intenção, semântica e responsabilidade sejam compatíveis. O estudo de caso em `onedrive-case-study.md` contém decisões finais do OneDrive e explicita seu alcance; não copie automaticamente nomes, thresholds, contagens, colunas ou breakpoints para outra superfície.

O blueprint consome contrato e fixture, não payload externo. Falta de evidência para uma API compartilhada pode gerar `pending_design_system_api`; descreva a composição pretendida e a dependência sem fabricar props, story ou preview.
