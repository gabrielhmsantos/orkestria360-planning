# Atribuições e consumo — modelo sugerido

## `user_license_assignments`

Estado observado de uma atribuição entre usuário e SKU. O usuário é referenciado, não modelado neste domínio.

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade da observação. |
| `tenant_id`, `user_id`, `license_product_id` | `uuid` | não | INDEX composto | Tenant, usuário externo e SKU interno. |
| `graph_sku_id` | `uuid` | não | INDEX | `skuId` para reconciliação. |
| `assignment_source` | `varchar(30)` | não |  | `direct`, `group`, `multiple_groups`, `imported`, `unknown`. |
| `source_group_id` | `uuid` | sim | INDEX | `assignedByGroup`; referência externa. |
| `disabled_plans` | `json` | não | default `[]` | Lista de GUIDs desabilitados. |
| `assignment_state`, `assignment_error` | `varchar(100)` | sim | INDEX em estado | `state` e `error` do Graph. |
| `graph_assignment_updated_at` | `timestamp` | sim |  | `lastUpdatedDateTime`. |
| `observed_at`, `collected_at` | `timestamp` | não | INDEX em coleta | Tempo da observação e ingestão. |
| `is_current` | `boolean` | não | INDEX parcial lógico | Marca o estado vigente. |

**Origem:** Microsoft Graph. `assignedLicenses` fornece somente `skuId` e `disabledPlans`; `licenseAssignmentStates` é necessário para estado, erro, origem por grupo e data de atualização. O conector deve preservar a observação mesmo se campos opcionais vierem omitidos na sincronização delta.

Uma mesma pessoa pode receber o mesmo SKU de mais de uma origem. A chave física não deve ser definida antes de conhecer a semântica final do conector; conceitualmente, é necessário preservar a origem sem duplicar artificialmente o custo.

## `license_consumption_snapshots`

Métrica de adoção por tenant, SKU, período e, quando permitido, usuário ou departamento.

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade do snapshot. |
| `tenant_id`, `license_product_id` | `uuid` | não/sim | INDEX composto | Produto é nulo quando CSV não permite mapeamento seguro. |
| `subject_type` | `varchar(30)` | não | INDEX | `tenant`, `department` ou `user`. |
| `subject_id` | `uuid` | sim | INDEX | Referência externa do sujeito identificado. |
| `report_type`, `workload` | `varchar(100)` | não/sim | INDEX composto | CSV de origem e workload. |
| `period_start`, `period_end` | `date` | sim |  | Janela efetiva do dado. |
| `report_period_days` | `smallint` | não | CHECK `> 0` | D7, D30, D90 ou D180. |
| `report_updated_at`, `last_activity_at` | `timestamp` | sim | INDEX em atividade | Frescor do relatório e última atividade. |
| `is_deleted` | `boolean` | sim |  | Valor de detalhes por usuário. |
| `assigned_products` | `text` | sim |  | Produtos do CSV; PII/classificação controlada. |
| `assigned_users`, `active_users`, `inactive_users` | `integer` | sim |  | Contagens agregadas. |
| `adoption_rate` | `decimal(7,4)` | sim | CHECK `>= 0` | Taxa calculada internamente. |
| `idle_cost` | `decimal(18,4)` | sim |  | Custo interno estimado. |
| `reporting_state` | `varchar(30)` | não |  | `identified`, `anonymized`, `unavailable`, etc. |
| `raw_evidence_reference` | `varchar(500)` | sim |  | Arquivo CSV protegido. |
| `collected_at` | `timestamp` | não | INDEX | Ingestão do arquivo. |

`subject_type` é candidato a `tenant`, `department` ou `user`; a granularidade por usuário só é usada quando o relatório permitir identificação.

**Origem:** Microsoft Graph Reports. `report_type` identifica o CSV de origem (contagem ativa, contagem por serviço ou detalhe de workload); `workload` permite distinguir Exchange, OneDrive, SharePoint, Teams e apps M365. `raw_evidence_reference` aponta ao arquivo protegido, pois as colunas variam entre CSVs e podem conter PII.

## `license_consumption_snapshot_metrics`

Métricas variáveis extraídas de cada CSV, para não perder contagens que não cabem nas colunas resumidas. **Origem: Microsoft Graph Reports**.

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade da métrica. |
| `license_consumption_snapshot_id` | `uuid` | não | FK; UNIQUE composto | Snapshot pai. |
| `metric_key` | `varchar(150)` | não | UNIQUE composto | Chave normalizada, ex.: `meeting_count`. |
| `metric_value` | `varchar(255)` | sim |  | Valor literal do CSV, inclusive `Yes`/`No`. |
| `metric_numeric_value` | `decimal(20,4)` | sim |  | Valor normalizado quando numérico. |
| `metric_unit` | `varchar(30)` | sim |  | `count`, `seconds`, `boolean`, etc. |
| `metric_source_column` | `varchar(255)` | não |  | Cabeçalho CSV original. |
| `collected_at` | `timestamp` | não |  | Tempo da extração. |

## Regras sugeridas

- A atribuição é um fato técnico; “licença ociosa” é uma conclusão do motor de regras.
- Relatórios anonimizados preservam agregados e bloqueiam a criação de recomendação nominal.
- A janela de análise (7/30/90 dias) é parte da identidade da métrica, não filtro descartável.
