# Data Model: Licenciamento Microsoft 365 V2

| Entidade | Propósito e campos principais | Relações/regras |
|---|---|---|
| LicenseProduct | catálogo canônico: `sku_id`, `sku_part_number`, nome, família, classificação, elegibilidade | único por SKU; classificação versionada não altera observações históricas |
| LicensingSyncRun | execução por tenant: ciclo, fontes, status, contagens, erro sanitizado, início/fim, próxima coleta e versão | único por tenant/ciclo; lock e idempotência; só publica fotografia após paginação integral |
| TenantLicenseSku | fotografia por tenant: capacidade habilitada, consumida, disponível, planos e estado técnico | único por tenant/SKU; todos os acessos filtram `tenant_id`; permanece visível mesmo fora do cálculo |
| TenantLicenseSkuCalculationSetting | decisão de participação por tenant/SKU: `tenant_id`, `sku_id`, `included_in_calculation`, timestamps | único por tenant/SKU; única fonte de verdade para totais, oportunidades e planejamento; sem tela de edição nesta entrega |
| UserLicenseAssignment | observação de pessoa/SKU: origem, grupo, planos desabilitados, estado, erro, datas e coleta | chave preserva múltiplas origens; `assigned_by_group`, estado e erro não são inferidos |
| LicenseConsumptionSnapshot | uso por período/sujeito: workload, estado de identificação, métricas, `report_updated_at`, `technical_synced_at` | sujeito nominal só quando a fonte é identificada; evidência bruta por referência protegida |
| LicenseOptimizationOpportunity | regra, versão, tipo, prioridade, confiança, evidências, recursos e impedimentos | `open` ou `insufficient_evidence`; sem valor monetário sem dado comercial; nunca executa ação |
| LicenseInventorySnapshot / LicenseEvent | snapshots append-only por SKU/ciclo e eventos detectados: origem, data, confirmação e evidência | retenção local inicia na implantação; mudanças sem explicação ficam pendentes |
| LicensePlanningScenario | cenário técnico somente leitura com premissas, dependências, benefício e limite de evidência | sem preço, compra, prazo ou provisionamento |
| LicensingScenario | cenário técnico: nome, premissas, mudanças, status e fonte de evidência | consultivo; não modifica contrato ou tenant |

Evidência bruta é armazenada em disco privado e ligada por referência, nunca no payload. Estados comuns: `fresh`, `stale`, `unavailable`; oportunidade `open`, `insufficient_evidence`; identificação de relatório `identified`, `anonymized`, `unavailable`.
