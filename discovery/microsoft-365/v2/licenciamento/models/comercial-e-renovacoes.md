# Comercial, preço e renovação — modelo sugerido

## `commercial_subscriptions`

Representa uma assinatura/contrato comercial associado a um tenant e a um SKU. É o registro interno futuro para os dados recebidos pelo Assessment/importação CSV; permanece vazio na V2.

**Origem:** interna/comercial. O Graph homologado fornece capacidade técnica e `subscriptionIds`, mas não fornece preço, imposto, desconto, vigência, renovação ou a assinatura comercial; esses dados não devem ser preenchidos a partir dos payloads Graph.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade interna. |
| `tenant_id`, `license_product_id` | `uuid` | não | INDEX composto | Escopo do contrato. |
| `provider` | `varchar(100)` | não | INDEX | Revenda, Assessment/CSV, Partner Center ou distribuidor. |
| `provider_subscription_id` | `varchar(255)` | sim | UNIQUE por provider | ID comercial externo; não é `subscriptionIds` Graph. |
| `contract_reference` | `varchar(255)` | sim | INDEX | Referência contratual/fatura. |
| `quantity` | `integer` | não | CHECK `> 0` | Quantidade faturada/contratada. |
| `billing_cycle`, `commitment_term` | `varchar(50)` | sim |  | Ciclo e termo comercial. |
| `start_date`, `end_date`, `renewal_date` | `date` | sim | INDEX em renovação | Vigência comercial. |
| `auto_renew` | `boolean` | não | default `false` | Renovação automática. |
| `commercial_status` | `varchar(50)` | não | INDEX | Estado comercial. |
| `data_origin` | `varchar(30)` | não |  | `assessment_csv`, `partner_center`, `distributor`. |
| `updated_by` | `uuid` | sim |  | Usuário interno responsável. |
| `external_synced_at`, `created_at`, `updated_at` | `timestamp` | sim/não/não |  | Auditoria e sincronização. |

## `subscription_price_periods`

Histórico de preço efetivo aplicado a uma assinatura durante uma vigência. Evita que uma atualização de preço reescreva o passado.

**Origem:** interna/comercial.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade do período. |
| `commercial_subscription_id` | `uuid` | não | FK; INDEX | Assinatura comercial. |
| `effective_from`, `effective_to` | `date` | não/sim | UNIQUE composto | Vigência do preço. |
| `unit_price`, `discount`, `taxes`, `adjustments` | `decimal(18,4)` | não/sim/sim/sim |  | Componentes monetários. |
| `currency` | `char(3)` | não |  | ISO 4217. |
| `price_type` | `varchar(50)` | não |  | Lista, negociado, estimado etc. |
| `source_reference` | `varchar(500)` | sim |  | Documento/origem comercial. |
| `recorded_by` | `uuid` | sim |  | Responsável interno. |
| `recorded_at`, `created_at`, `updated_at` | `timestamp` | não |  | Auditoria. |

## `license_renewal_plans`

Planejamento futuro de renovação, separado do contrato observado. Não integra workflow na V2.

**Origem:** interna/comercial futura.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade do plano. |
| `commercial_subscription_id` | `uuid` | não | FK; INDEX | Contrato alvo. |
| `target_date` | `date` | não | INDEX | Data da ação planejada. |
| `planned_quantity` | `integer` | não | CHECK `>= 0` | Quantidade projetada. |
| `estimated_value` | `decimal(18,4)` | sim |  | Estimativa interna. |
| `currency` | `char(3)` | sim |  | Moeda da estimativa. |
| `status` | `varchar(30)` | não | INDEX | `draft`, `shared`, `archived` etc.; sem aprovação na V2. |
| `owner_id`, `commercial_request_id` | `uuid` | sim | INDEX | Referências futuras; não utilizadas na V2. |
| `notes` | `text` | sim |  | Observações. |
| `created_at`, `updated_at` | `timestamp` | não |  | Auditoria. |

## Regras sugeridas

- Pode haver várias assinaturas comerciais ativas para o mesmo tenant/SKU; não presumir unicidade por SKU.
- Preço, vigência e renovação não são inferidos de quantidade técnica.
- O CSV futuro deve ser preenchido pelo responsável do tenant, validado antes da importação e registrar lote, linhas rejeitadas, idempotência e responsável. Integrações futuras apenas criam, atualizam ou reconciliam os mesmos registros.
