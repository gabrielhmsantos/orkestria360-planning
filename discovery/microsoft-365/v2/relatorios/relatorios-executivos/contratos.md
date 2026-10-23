# Relatórios Executivos — Contratos

- Consumidor local do `ReportSourceManifest` de uma solicitação aceita; ele fixa versão do template/configuração, fontes, períodos, filtros, disponibilidade, cobertura e frescor. A tela de seleção não usa manifesto antigo para calcular disponibilidade.
- Requisito `required` indisponível bloqueia a geração. Requisito `degradable` só explicita bloco `unavailable`/`restricted` quando o template autorizar saída parcial, que é identificada como parcial e nunca como relatório completo.

## Integração com o sync coordenado

- **Resultado: projeção local.** Um manifesto imutável referencia publicações de origem e source states da conexão explícita; não há leitura Graph na renderização.
- Quando uma publicação futura usar reports CSV, ela deve respeitar `reportRefreshDate`, staging/promoção atômica e preservar a última geração segura em falha.
- **Extensão canônica necessária:** `getOffice365ActiveUserDetail(D30)` é viável, mas não possui coletor/publicação de produção. O domínio de Licenciamento deve persistir apenas o agregado de usuários ativos M365 e seu estado por tenant+conexão; o CSV detalhado não é reexposto nesta tela. `getOffice365ActiveUserCounts` só adiciona série após retenção de snapshots comparáveis.
- **Reuso canônico:** licenças atribuídas vêm da geração íntegra de `LicenseInventoryPublication` da conexão, pela mesma regra de SKUs elegíveis/ativos/incluídos do Inventário. `TenantLicenseSku` corrente e `signInActivity` não são fallback para os fatos de Relatórios.
- A renderização, o arquivo efêmero e os metadados preservam o escopo de PII/autorização de cada publicação do manifesto; não há reidentificação por combinação de fontes.
