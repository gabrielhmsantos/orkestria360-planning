# Contract: Licenciamento Microsoft 365 Inertia

## Rotas internas

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/microsoft-365/licenciamento` | dashboard executivo e navegação das abas |
| GET | `/microsoft-365/licenciamento/inventario` | inventário técnico e detalhes |
| GET | `/microsoft-365/licenciamento/consumo` | adoção por período e granularidade permitida |
| GET | `/microsoft-365/licenciamento/otimizacao` | oportunidades explicáveis |
| GET | `/microsoft-365/licenciamento/historico` | eventos e snapshots técnicos |
| GET | `/microsoft-365/licenciamento/planejamento` | cenários/roadmap técnicos |
| GET | `/microsoft-365/licenciamento/custos` | estado comercial indisponível |

Cada bloco retorna `source`, `lastUpdatedAt` e `freshness`; cada página recebe `technicalSync` e, quando aplicável, `reportSync` com `source`, `lastSuccessfulAt`, `freshness`, `nextExpectedAt`, `status`, `reason` e `lastFailureAt`. Consumo adiciona `reportUpdatedAt`, `technicalSyncedAt` e `reportingState`. Valores monetários, quando futuramente existentes, usam `{ amount, currency }`; nesta V2 são `unavailable`, nunca `0`.

O payload é formado apenas de fotografia persistida: a navegação não dispara leitura Graph. O coletor de contagens por serviço entrega dados agregados, portanto `reportingState` é `anonymized`; `identified` só poderá ser introduzido por uma fonte futura explicitamente aprovada.

Histórico inclui o SKU, capacidade habilitada/consumida e a variação contra o snapshot anterior quando existente. `fresh`, `stale` e `unavailable` são calculados por fonte: fotografia técnica e relatório de consumo não compartilham timestamp inferido.

Inventário expõe busca e filtros permitidos, `displayName` resolvido de `storage/app/microsoft365/licenses_display_name.json`, `skuPartNumber` técnico e `includedInCalculation` por tenant. Este booleano substitui classificação heurística em todos os cálculos; SKUs fora do cálculo continuam visíveis no Inventário e Histórico. A V2 não expõe paginação nominal, detalhe de usuário/atribuição ou exportação: essas operações dependem de associação e autorização de tenant aprovadas. Otimização expõe regra/versão, período, fontes/timestamps, recursos afetados, prioridade, confiança, evidências, impedimentos e impacto monetário indisponível. Parâmetros compartilhados de período são validados e preservados em deep-links entre Dashboard, Consumo, Otimização, Histórico e Planejamento.

Controles de compra, alteração, workflow, aprovação, simulação e importação usam componente acessível único com o texto `Em breve — nenhuma solicitação ou alteração será realizada`; não existe rota de comando, POST, job ou escrita Graph nesta feature.
