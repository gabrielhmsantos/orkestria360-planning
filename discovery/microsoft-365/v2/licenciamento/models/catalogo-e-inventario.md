# Catálogo e inventário técnico — modelo sugerido

## `license_products`

Catálogo canônico do produto/SKU, independente de tenant. Traduz o identificador técnico em informações comerciais e de classificação.

**Origem:** híbrida. `sku_id`, `sku_part_number` e planos podem ser alimentados pelo Microsoft Graph; classificação, nome comercial e elegibilidade são internos.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade interna. |
| `sku_id` | `uuid` | não | UNIQUE | `skuId` do Graph; chave técnica do produto. |
| `sku_part_number` | `varchar(255)` | não | INDEX | `skuPartNumber` do Graph. |
| `commercial_name` | `varchar(255)` | sim |  | Nome controlado pelo Orkestria. |
| `family`, `vendor`, `license_type` | `varchar(100)` | sim | INDEX em `family` | Classificação interna. |
| `is_user_based`, `is_paid` | `boolean` | não | default `false` | Elegibilidade para indicadores/custo. |
| `catalog_service_plans` | `json` | sim |  | Composição canônica conhecida do catálogo, quando aplicável. |
| `catalog_source` | `varchar(50)` | não |  | Ex.: `graph`, `manual`, `catalog`. |
| `catalog_updated_at` | `timestamp` | sim |  | Última revisão do catálogo. |
| `created_at`, `updated_at` | `timestamp` | não |  | Auditoria interna. |

## `tenant_license_skus`

Fotografia atual do SKU em um tenant. Não representa contrato, preço ou histórico.

**Origem: Microsoft Graph** (`subscribedSkus`).

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade da fotografia atual. |
| `tenant_id`, `license_product_id` | `uuid` | não | UNIQUE composto | Referências externas/internas ao tenant e produto. |
| `graph_subscribed_sku_id` | `varchar(255)` | não | UNIQUE por tenant | `subscribedSku.id` composto. |
| `external_sku_id` | `uuid` | não | INDEX | `subscribedSku.skuId`. |
| `external_sku_part_number` | `varchar(255)` | não |  | `subscribedSku.skuPartNumber`. |
| `graph_account_id` | `uuid` | sim |  | `accountId` do Graph. |
| `graph_account_name` | `varchar(255)` | sim |  | `accountName` do Graph. |
| `applies_to`, `capability_status` | `varchar(50)` | não | INDEX em status | Estado/escopo técnicos Graph. |
| `enabled_units`, `consumed_units`, `available_units` | `integer` | não | CHECK `>= 0` | Capacidade e consumo observados/derivados. |
| `warning_units`, `suspended_units`, `locked_out_units` | `integer` | não | default `0` | Estados de `prepaidUnits`. |
| `observed_at`, `collected_at` | `timestamp` | não | INDEX em `collected_at` | Instante observado e coletado. |
| `sync_state` | `varchar(30)` | não | default `fresh` | `fresh`, `stale`, `failed` ou `unavailable`. |
| `created_at`, `updated_at` | `timestamp` | não |  | Auditoria interna. |

## `tenant_license_sku_service_plans`

Estado técnico de cada plano que compõe um SKU no tenant. **Origem: Microsoft Graph** (`subscribedSku.servicePlans`).

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade interna. |
| `tenant_license_sku_id` | `uuid` | não | FK; UNIQUE composto | SKU do tenant. |
| `service_plan_id` | `uuid` | não | UNIQUE composto | `servicePlanId`. |
| `service_plan_name`, `service_plan_type` | `varchar(255)` | não | INDEX em nome | Nome/tipo do plano. |
| `applies_to`, `provisioning_status` | `varchar(50)` | não | INDEX em status | Estado técnico do plano. |
| `observed_at`, `collected_at` | `timestamp` | não |  | Rastreamento da leitura. |
| `is_current` | `boolean` | não | default `true` | Versão vigente da observação. |

Não deve ser substituído por `license_products.service_plans`: o catálogo descreve a composição conhecida do produto, enquanto o Graph informa o provisionamento real do plano no tenant.

## `tenant_license_sku_subscription_refs`

Referências técnicas de assinatura retornadas pelo Graph. **Origem: Microsoft Graph** (`subscribedSku.subscriptionIds`).

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade interna. |
| `tenant_license_sku_id` | `uuid` | não | FK; UNIQUE composto | SKU do tenant. |
| `graph_subscription_id` | `uuid` | não | UNIQUE composto | Item de `subscriptionIds`. |
| `observed_at`, `collected_at` | `timestamp` | não |  | Rastreamento da leitura. |

## `license_inventory_snapshots`

Série temporal imutável do inventário, coletada por tenant/SKU/data. Sustenta tendências e detecção de alterações; não deve ser sobrescrita pelo estado atual.

**Origem:** derivada de Microsoft Graph (`subscribedSkus`) no instante da coleta.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade do fato. |
| `tenant_id`, `license_product_id` | `uuid` | não | INDEX composto | Escopo do snapshot. |
| `graph_subscribed_sku_id` | `varchar(255)` | não | INDEX | Referência técnica exata. |
| `snapshot_at`, `collected_at` | `timestamp` | não | INDEX em `snapshot_at` | Tempo do fato e da coleta. |
| `enabled_units`, `consumed_units`, `available_units` | `integer` | não | CHECK `>= 0` | Medidas de capacidade. |
| `warning_units`, `suspended_units`, `locked_out_units` | `integer` | não | default `0` | Estados técnicos. |
| `capability_status` | `varchar(50)` | não |  | Estado Graph do SKU. |
| `connector_source` | `varchar(50)` | não | default `graph` | Proveniência. |
| `collection_run_id` | `uuid` | não | INDEX | Execução que produziu o fato. |

## Regras sugeridas

- `available_units` é calculado e armazenado como evidência da coleta a partir das unidades e do consumo; a regra de cálculo deve ser versionada e tratar estados suspenso, warning e locked out.
- SKUs gratuitos, de avaliação, por capacidade ou técnicos devem ser classificáveis, sem exclusão física.
- `tenant_license_skus` é atualizado por sincronização; `license_inventory_snapshots` é append-only.
