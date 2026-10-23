# Otimização, exceções e histórico — modelo sugerido

## `license_optimization_opportunities`

Representa uma oportunidade gerada por regra, análise humana ou, futuramente, assistência de IA.

**Origem:** interna, derivada de regras sobre evidências Graph e dados comerciais; não é um recurso Graph.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade da oportunidade. |
| `tenant_id`, `license_product_id` | `uuid` | não/sim | INDEX composto | Escopo técnico. |
| `rule_key`, `rule_version` | `varchar(100)` | não | UNIQUE composto lógico | Regra que produziu a oportunidade. |
| `category`, `priority`, `status` | `varchar(50)` | não | INDEX em status/prioridade | Classificação e ciclo de vida. |
| `subject_type` | `varchar(30)` | não | INDEX | `user`, `sku`, `department`, `subscription`. |
| `subject_id` | `uuid` | sim | INDEX | Sujeito externo/interno. |
| `confidence` | `decimal(5,4)` | sim | CHECK 0–1 | Confiança da análise. |
| `estimated_monthly_savings`, `estimated_annual_savings` | `decimal(18,4)` | sim |  | Economia estimada. |
| `currency` | `char(3)` | sim |  | Moeda da estimativa. |
| `evidence` | `json` | não |  | Referências de métricas/evidências. |
| `analysis_period` | `varchar(30)` | sim |  | Janela analisada, ex.: D30. |
| `reassess_at`, `created_at`, `updated_at` | `timestamp` | sim/não/não | INDEX em reavaliação | Auditoria. |

## `license_exceptions`

Dispensa temporária e auditável para uma oportunidade ou sujeito.

**Origem:** interna; a persistência de exceções fica para fase futura, pois a V2 não possui workflow.

| Campo | Tipo | Nulo | Chave/restrição | Uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade da exceção. |
| `opportunity_id` | `uuid` | não | FK; INDEX | Oportunidade dispensada. |
| `reason_type` | `varchar(50)` | não | INDEX | Motivo padronizado. |
| `reason` | `text` | não |  | Justificativa livre. |
| `starts_at`, `ends_at`, `review_at` | `timestamp` | não/sim/sim | INDEX em revisão | Vigência e revisão. |
| `owner_id`, `approved_by` | `uuid` | sim |  | Responsáveis externos ao domínio. |
| `document_reference` | `varchar(500)` | sim |  | Evidência documental. |
| `created_at`, `updated_at` | `timestamp` | não |  | Auditoria. |

## `license_events`

Linha do tempo imutável de fatos técnicos. Eventos comerciais e de workflow são extensões futuras, após Assessment/CSV e workflow.

| Campo | Tipo | Nulo | Chave/restrição | Origem/uso |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | não | PK | Identidade interna. |
| `tenant_id`, `license_product_id`, `commercial_subscription_id`, `user_id` | `uuid` | não/sim/sim/sim | INDEX por tenant/data | Escopo e referências. |
| `event_type`, `event_source` | `varchar(100)` | não | INDEX composto | Tipo e `graph` ou `snapshot` na V2; `commercial` e `workflow` são futuros. |
| `external_event_id` | `varchar(255)` | sim | UNIQUE por source | `directoryAudit.id` ou ID externo. |
| `correlation_id` | `uuid` | sim | INDEX | `directoryAudit.correlationId`. |
| `event_category`, `operation_type`, `result`, `result_reason` | `varchar(255)` | sim | INDEX em resultado | Campos de auditoria Graph. |
| `occurred_at`, `detected_at` | `timestamp` | não | INDEX em ocorrido | Data técnica e de ingestão. |
| `actor_type` | `varchar(30)` | sim |  | `app`, `user`, `service`. |
| `actor_id` | `uuid` | sim | INDEX | Ator Graph/external. |
| `actor_principal_name` | `varchar(320)` | sim |  | PII; proteger acesso. |
| `target_resource_type` | `varchar(100)` | sim |  | Tipo do alvo. |
| `target_resource_id` | `varchar(255)` | sim | INDEX | ID do alvo. |
| `target_resource_name` | `varchar(255)` | sim |  | Nome redigível do alvo. |
| `quantity_before`, `quantity_after` | `integer` | sim |  | Variação técnica. |
| `financial_impact` | `decimal(18,4)` | sim |  | Impacto interno estimado/confirmado. |
| `currency` | `char(3)` | sim |  | Moeda do impacto. |
| `request_id`, `approval_id` | `uuid` | sim | INDEX | Referências futuras de workflow; sem uso na V2. |
| `evidence_reference` | `varchar(500)` | sim |  | Artefato bruto protegido. |
| `confirmation_state` | `varchar(30)` | não | INDEX | `pending`, `confirmed`, `divergent`. |

**Origem:** técnica na V2; comercial ou workflow futuramente. Para eventos Graph, os campos de correlação, categoria, operação, resultado, ator e alvo vêm de `auditLogs/directoryAudits`; propriedades modificadas e detalhes adicionais devem permanecer no artefato referenciado por `evidence_reference`, pois são coleções variáveis e podem conter PII.

## Regra de ciclo de vida

Na V2, uma oportunidade pode ser `open` ou indicar evidência insuficiente; exceção, simulação, aprovação, execução e economia realizada são recursos futuros. A economia só poderá ser realizada após confirmação técnica/comercial registrada como evento.
