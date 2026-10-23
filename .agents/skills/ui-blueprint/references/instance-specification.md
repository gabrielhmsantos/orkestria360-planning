# Especificação de instâncias

Cada instância material conecta `ID → decisão → conteúdo → binding → estratégia de composição → componente/API → estado → interação → responsividade → acessibilidade`. Use o mapa de composição para declarar owner dos dados/transformações, estado/recorte, pai/filhos e responsabilidade de cada parte. Use o UI decision log para evidência, razão, status e dependências.

Classifique a estratégia como `direct_reuse`, `domain_adapter`, `local_composition` ou `design_system_extension`; registre API status como `storybook_verified`, `verified_children`, `module_local_contract` ou `pending_design_system_api`. Para uma API existente, registre props, story ID e preview comprovados no Storybook MCP. Para wrapper/adaptador local, documente o contrato de dados/responsabilidade no mapa e cite APIs filhas verificadas quando houver; não invente uma assinatura React. Para extensão do design system ainda não publicada, documente intenção, anatomia e limites, marque pendência e não fabrique props/story/preview.

Conteúdo conhecido não pode permanecer “KPIs”, “colunas relevantes” ou “quando aplicável”. IDs de composição, instância, binding e decisão devem referenciar o inventário e o log sem duplicar o conteúdo completo.
