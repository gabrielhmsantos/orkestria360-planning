# Data Model — Microsoft 365 / Configurações

Modelo físico-lógico para migrations Laravel/PostgreSQL 18. Os tipos abaixo são deliberados; nomes de migration/model podem seguir a convenção do código existente, mas não podem reduzir os vínculos, tipos, chaves, estados ou políticas descritos.

## Convenções físicas

- PKs novas: `uuid` (`id`); FKs para as tabelas atuais mantêm o tipo real delas (`tenant_id uuid`, `microsoft_connection_id uuid`, `sync_cycle_id uuid` referenciando `microsoft365_sync_cycles.cycle_id` junto de `tenant_id`). FKs globais usam UUID.
- Datas: `timestamptz`; hashes/checksums: `char(64)` SHA-256; textos livres: `text`; chaves/estados: `varchar` com `CHECK`; documentos estruturados: `jsonb`; contagens: `integer`; score/percentual/weight: `numeric(7,4)` ou `numeric(5,2)` conforme indicado.
- Todo dado tenant-scoped tem `tenant_id uuid NOT NULL`, RLS e índices que iniciam por `tenant_id`; toda gravação usa `TenantExecutionRunner::runForConnection` quando houver conexão. O catálogo global não contém `tenant_id` e nunca é copiado por customer.
- `created_at`/`updated_at` são `timestamptz` nas entidades mutáveis. Dados históricos/publicados adicionam `recorded_at`/`published_at` imutáveis.
- Vocabulário temporal canônico: `source_updated_at` mapeia exclusivamente para `sourceLastModifiedAt` quando a fonte o informa; `observed_change_at` mapeia exclusivamente para `lastObservedChangeAt` quando a diferença factual é detectada entre snapshots; `last_collected_at` mapeia exclusivamente para `lastCollectedAt` da coleta/tentativa. `published_at` é metadata do manifesto. Nenhum é preenchido por equivalência implícita com outro; nomes legados `observed_at` não são usados para esses três conceitos nas tabelas novas.

## Catálogo global e versionado

### `ConfigurationSourceContractRegistry` — registry allowlisted, code-level

O registry é uma definição versionada em código/deploy, não uma tabela
tenant-scoped nem uma `ConfigurationMatrixLine`. Todo collector resolve uma
chave do registry antes de qualquer chamada externa; nenhuma UI/request fornece
endpoint, versão ou permissão livre. Cada `ConfigurationSourceContract` contém:

| Campo do contrato | Responsabilidade |
|---|---|
| `source_key`, `contract_version`, `provider`, `audience` | Identidade estável e destino autorizado (por exemplo Graph/TCM), inclusive audience de token. |
| `api_version`, `operation`/`endpoint` allowlisted, `permissions` | Única combinação de versão/operação/permissões que o collector pode usar. |
| `cadence`, `freshness_contract`, `coverage_semantics`, `failure_semantics` | Cadência, regra entregue a `SourceStateFreshness::forContract()`, populações de coverage e leitura de `complete`/`restricted`/`failed`/`skipped`. |
| `pagination_semantics`, `collection_semantics` | Quando aplicável, coleção/fan-out, limite, deduplicação e validação de nextLink na mesma versão/coleção. |

O registry inicial cobre tanto leituras que alimentam score (MFA, CA,
SharePoint/OneDrive e TCM) quanto fatos apenas observacionais: organização,
branding, domínios, group settings, named locations, inventário Intune e dados
auxiliares de colaboração. A execução persiste `source_key` e
`contract_version` em source states/fatos para rastreabilidade; uma MatrixLine
apenas referencia o contrato e o `fact_key` quando aquele fato também é
comparável.

Um contrato é imutável na dupla `source_key` + `contract_version`. O registry
calcula `definition_checksum` sobre endpoint/operação, API version, audience,
permissions, freshness, coverage, failure, paginação/coleção e fact mappings.
Depois que a dupla for referenciada por facts, source states, MatrixLines ou
publicações preservadas, ela continua disponível com o mesmo checksum; alterar
qualquer semântica cria a próxima versão (por exemplo `@2`), nunca modifica
`@1`. O validador de compatibilidade do registry compara as versões/checksums
referenciados no banco com o registry carregado e bloqueia deploy/sync quando
uma referência histórica necessária estiver ausente ou tiver outro significado.

### `configuration_matrix_versions`

| Coluna (PostgreSQL) | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid` | não | PK | Identidade da versão. |
| `version_key varchar(64)` | não | UNIQUE | SemVer/chave legível. |
| `checksum char(64)` | não | UNIQUE | Seed/publicação idempotente. |
| `status varchar(16)` | não | CHECK `draft,published,superseded`; unique parcial para published | Uma versão publicada é imutável. |
| `sponsor_reference text`, `homologation_reference text`, `metadata jsonb` | não | — | Seção/tabela literal do sponsor, discovery e decisão de homologação. |
| `published_at timestamptz`, `superseded_at timestamptz` | sim | — | Temporalidade do catálogo. |

### `configuration_domains`

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid` | não | PK | Domínio da matriz. |
| `configuration_matrix_version_id uuid` | não | FK → matrix_versions | N:1 matriz. |
| `stable_key varchar(80)`, `label varchar(160)` | não | UNIQUE `(matrix_version_id, stable_key)` | Identidade estável/label. |
| `weight_basis_points integer`, `display_order smallint` | não | CHECK peso `> 0`; índice version/order | Nove pesos do sponsor; soma validada pelo publicador. |

### `configuration_baseline_profiles` e `configuration_baseline_profile_items`

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `baseline_profiles.id uuid`, `configuration_matrix_version_id uuid`, `profile_key varchar(160)`, `version_key varchar(64)` | não | PK; FK; UNIQUE `(matrix_version_id, profile_key, version_key)` | Perfil canônico completo e versionado, aplicável a uma publicação. |
| `baseline_profiles.baseline_type varchar(40)`, `origin varchar(40)`, `metadata jsonb`, `status varchar(16)` | não | CHECK status `draft,published,superseded` | Tipo/origem e publicação imutável do perfil. |
| `baseline_profile_items.id uuid`, `configuration_baseline_profile_id uuid`, `configuration_matrix_line_id uuid` | não | PK; FKs; UNIQUE `(profile_id, matrix_line_id)` | Um item por linha da matriz no perfil. |
| `baseline_profile_items.expected_value jsonb`, `expected_schema jsonb`, `comparison_rule jsonb`, `eligibility_rule jsonb` | não | GIN opcional somente para diagnóstico | Valor e regra canônicos; runtime não os inventa. |
| `baseline_profile_items.source_contract_key varchar(120)`, `source_contract_version varchar(64)`, `source_contract_checksum char(64)`, `fact_key varchar(180)`, `availability_contract jsonb`, `gate_key varchar(80)` | não/não/não/não/sim/sim | — | Referência imutável ao registry e fato comparável, com semântica de unavailable e trava nula quando inexistente. |

### `configuration_matrix_lines`

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid` | não | PK | Linha homologada. |
| `configuration_matrix_version_id uuid`, `configuration_domain_id uuid` | não | FKs; validação de mesma versão | N:1 matriz/domínio. O baseline é definido pelo item do perfil, nunca por uma regra de linha arbitrária. |
| `setting_key varchar(180)`, `title varchar(255)` | não | UNIQUE `(matrix_version_id, setting_key)` | Chave e apresentação. |
| `severity varchar(16)`, `risk varchar(16)`, `scope_kind varchar(40)` | não | CHECK severidade/risco/scope | `tenant`, `object`, `administrator`, `connector`, etc. |
| `source_contract_key varchar(120)`, `source_contract_version varchar(64)`, `source_contract_checksum char(64)`, `source_fact_key varchar(180)` | não | índice contrato/fato | Referência explícita/imóvel ao registry allowlisted e ao fato que a linha pode comparar; não registra endpoint/permissão próprios. |
| `homologation_status varchar(24)`, `eligible_by_default boolean`, `display_order smallint` | não | CHECK; índice versão/order | Só `homologated` pontua; crítico local pode começar não elegível. |

### Bootstrap obrigatório do catálogo inicial

Uma migration incremental própria faz `upsert` idempotente da versão inicial da
matriz, seus nove domínios/pesos, linhas homologadas, perfil global e itens do
perfil. Portanto, em banco já existente, `php artisan migrate` deixa a feature
utilizável sem `db:seed`. O conteúdo da migration é referência estática
versionada, protegido para escrita do runtime; uma revisão futura de
matriz/perfil entra por nova migration incremental ou por publicador de deploy
explicitamente homologado, nunca por edição da migration histórica.

## Data plane tenant-scoped

### `configuration_baseline_versions`

Materialização interna, tenant-scoped e imutável do perfil global usada por uma
publicação. Não é configuração de usuário, não possui fluxo de criação,
aprovação, ativação manual ou override nesta versão.

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `configuration_baseline_profile_id uuid` | não/não/sim/não | PK; UNIQUE `(tenant_id,id)`; FK composta tenant/conexão e FK global; índice `(tenant_id, status, materialized_at DESC)` | Perfil global integral materializado para a geração/publicação. |
| `baseline_key varchar(160)`, `version_key varchar(64)`, `baseline_type varchar(40)`, `origin varchar(40)` | não | UNIQUE `(tenant_id, baseline_key, version_key)` | Identidade/versionamento do perfil materializado, sem customização local. |
| `status varchar(16)`, `materialized_at timestamptz`, `retired_at timestamptz` | não/não/sim | CHECK `materialized,retired`; índice tenant/status | Estado técnico e vigência derivada da publicação que o referencia. |
| `metadata jsonb`, `created_at timestamptz`, `updated_at timestamptz` | não/não/não | índice tenant/origin | Contexto técnico, sem ator de aprovação/ativação. |

### `configuration_baseline_items`

| Tabela/coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `baseline_items.id uuid`, `tenant_id uuid`, `configuration_baseline_version_id uuid`, `configuration_baseline_profile_item_id uuid`, `configuration_matrix_line_id uuid` | não | PK; FK composta `(tenant_id, baseline_version_id)`; FK profile-item; UNIQUE `(tenant_id, baseline_version_id, matrix_line_id)` and `(tenant_id,id)` | Item efetivamente aplicado, sempre derivado de um item do perfil global. |
| `baseline_items.expected_value jsonb`, `comparison_rule jsonb`, `eligibility_rule jsonb`, `status varchar(16)` | não | CHECK `materialized,retired` | Cópia imutável do item global realmente usado; não há `comparison_override`, exceção, aprovação ou edição local nesta versão. |

Uma materialização não é atualizada para reinterpretar publicação passada: novo
perfil/matriz gera nova versão/itens internos. A publicação aponta para a versão
tenant-scoped efetivamente usada e suas comparações registram o item aplicado.

### `configuration_generations`

Uma tentativa de Configurações dentro de um `Microsoft365SyncCycle` coordenado.

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `sync_cycle_id uuid` | não | PK; FK composta para ciclo; UNIQUE `(tenant_id, microsoft_connection_id, sync_cycle_id)` | Ownership/correlação com ciclo existente. |
| `configuration_matrix_version_id uuid` | não | FK global | Versão fixada no início. |
| `status varchar(16)` | não | CHECK `collecting,staged,publishing,published,partial,failed,abandoned`; índice tenant/connection/status/created | Máquina de estados. |
| `correlation_id uuid`, `attempt smallint`, `payload_checksum char(64)`, `metrics jsonb` | não | UNIQUE `(tenant, connection, correlation_id, attempt)` | Reprocessamento e manifesto de staging. |
| `started_at timestamptz`, `staged_at timestamptz`, `finished_at timestamptz`, `failure_reason text` | misto | — | Diagnóstico temporal. |

### `configuration_source_states`

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `configuration_generation_id uuid` | não | PK/FKs; UNIQUE `(tenant_id, generation_id, source_key)` | Estado de uma fonte na geração. |
| `source_key varchar(120)`, `source_contract_version varchar(64)`, `source_contract_checksum char(64)`, `api_version varchar(32)` | não/não/não/sim | índice `(tenant, connection, source_key, last_collected_at DESC)` | Identifica contrato allowlisted, versão e significado efetivamente observado. |
| `availability_status varchar(16)`, `result_state varchar(20)` | não | CHECK `available,restricted,unavailable`; CHECK `complete,partial,empty_valid,failed,not_collected` | Disponibilidade é distinta do resultado. |
| `coverage jsonb`, `freshness_status varchar(16)`, `freshness_contract jsonb` | não/não/sim | CHECK `fresh,stale,unavailable` | Sem contrato → freshness indeterminada/unavailable, sem alterar availability. |
| `last_successful_at timestamptz`, `last_collected_at timestamptz`, `reason text` | sim/não/sim | — | Última coleta/tentativa e razão segura; não afirma mudança do objeto. |
| `attempt_count smallint`, `retry_after_at timestamptz`, `http_status smallint`, `technical_evidence_id uuid` | não/sim/sim/sim | FK evidence | Diagnóstico sem fabricar valor. |

### `configuration_tcm_readiness`

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `configuration_generation_id uuid` | não | PK/FKs; UNIQUE `(tenant_id, generation_id, capability_key)` | Readiness por capacidade/endpoint. |
| `capability_key varchar(120)`, `availability_status varchar(16)` | não | CHECK availability | Ex.: `anti_phish`, `connectors`. |
| `license_status varchar(16)`, `role_status varchar(16)`, `snapshot_status varchar(16)`, `endpoint_status varchar(16)` | não | CHECK `available,restricted,unavailable,unknown` | Pré-requisitos, não fatos de segurança. |
| `reason text`, `last_collected_at timestamptz`, `technical_evidence_id uuid` | sim/não/sim | FK evidence | Readiness é tentativa/capacidade; não há coluna/fluxo que crie snapshot TCM. |

### `configuration_facts` — fatos observacionais

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `configuration_generation_id uuid`, `configuration_matrix_line_id uuid` | `configuration_matrix_line_id` sim; demais não | PK/FKs; índice tenant/connection/line | Fato observacional em uma geração; vínculo com linha existe somente quando a leitura é homologada para comparação. |
| `source_key varchar(120)`, `source_contract_version varchar(64)`, `source_contract_checksum char(64)`, `fact_key varchar(180)`, `external_reference varchar(512)`, `subject_type varchar(48)`, `scope_key varchar(256)` | não/não/não/não/sim/não/sim | índice `(tenant, connection, source_key, fact_key)` | Fonte allowlisted, versão/significado e semântica factual para cards, inclusive organização, branding, domínios, group settings, named locations e inventário Intune. |
| `subject_key varchar(512)`, `normalized_value jsonb`, `normalized_schema varchar(80)`, `payload_hash char(64)` | não/não/não/não | UNIQUE `(tenant_id, generation_id, source_key, fact_key, subject_key)` | Identidade canônica não nula do fato; usa sentinela documentada para escopo tenant. O hash é integridade/replay, não identidade. |
| `last_collected_at timestamptz`, `source_updated_at timestamptz`, `availability_status varchar(16)`, `comparability_status varchar(20)`, `redaction_class varchar(32)` | não/sim/não/não/não | CHECK availability `available,restricted,unavailable`; CHECK comparabilidade `comparable,unavailable,stale,restricted,not_applicable` | Coleta e modificação da fonte são distintas; `lastObservedChangeAt` é derivado somente de change event/snapshot diferencial. Indisponível nunca é `false`; dado sensível é redigido. |

### `configuration_publications`

| Coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `configuration_generation_id uuid` | não | PK/FKs; UNIQUE generation | Owner persistido dos derivados; só manifesto promovido é legível pela tela. |
| `configuration_matrix_version_id uuid`, `configuration_baseline_version_id uuid`, `baseline_snapshot jsonb` | não | FK global + FK composta `(tenant_id, baseline_version_id)`; JSON é cópia de leitura, não ownership | Preserva matriz e versão de baseline efetivamente aplicada. |
| `status varchar(16)`, `is_current boolean` | não | CHECK `staging,published,partial,superseded,abandoned`; UNIQUE parcial `(tenant_id, microsoft_connection_id) WHERE is_current` | Manifesto `staging` é invisível e nunca current; só uma current por conexão. |
| `score numeric(5,2)`, `coverage numeric(5,2)`, `eligible_count integer`, `comparable_count integer`, `manifest_checksum char(64)` | sim | CHECK 0–100/contagens >=0; `CHECK` exige todos não nulos para `published,partial,superseded`; índice tenant/connection/published DESC | Nulos somente em `staging,abandoned`; resultado imutável depois da promoção. |
| `published_at timestamptz`, `superseded_at timestamptz` | sim/sim | `CHECK` exige `published_at` para `published,partial,superseded` | Nulo em manifesto ainda não promovido; histórico após promoção. |

### `configuration_comparisons` e `configuration_publication_domain_scores`

| Tabela/coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `configuration_comparisons.id uuid`, `tenant_id uuid`, `configuration_publication_id uuid`, `configuration_fact_id uuid`, `configuration_matrix_line_id uuid`, `configuration_baseline_profile_item_id uuid`, `configuration_baseline_item_id uuid`, `subject_key varchar(512)` | `configuration_fact_id` sim; demais não | PK/FKs; FK composta tenant/item; CHECK/FK garantem que fato não nulo possui a mesma `matrix_line_id` homologada; UNIQUE `(tenant_id, publication_id, line_id, subject_key)` | Só fato associado a uma linha homologada produz comparação. `configuration_fact_id` é nulo somente para `unavailable` sem fato atual; `subject_key` mantém a unicidade sem fabricar fato. |
| `comparisons.status varchar(16)`, `eligible boolean`, `comparable boolean`, `contribution numeric(7,4)`, `gate_triggered boolean` | não | CHECK `conformant,divergent,unavailable,ineligible`; índice tenant/publication/status | unavailable+elegível → zero, não comparável, sem gate. |
| `comparisons.expected_value jsonb`, `actual_summary jsonb`, `reason text`, `evaluated_at timestamptz` | não/não/sim/não | — | Interpretação auditável/redigida. |
| `domain_scores.id uuid`, `tenant_id uuid`, `configuration_publication_id uuid`, `configuration_domain_id uuid` | não | PK/FKs; UNIQUE `(publication_id, domain_id)` | Aggregate por domínio. |
| `domain_scores.numerator numeric(7,4)`, `denominator numeric(7,4)`, `coverage numeric(5,2)`, `score numeric(5,2)` | não | CHECK valores >=0/0–100 | Evita recomputar score de tela. |

### `critical_classifications` e `critical_classification_audits`

| Tabela/coluna | Null | Chave/índice | Responsabilidade |
|---|---:|---|---|
| `critical_classifications.id uuid`, `tenant_id uuid`, `microsoft_connection_id uuid`, `classification_type varchar(48)`, `external_reference varchar(512)` | não/não/sim/não/não | PK; UNIQUE `(tenant_id, classification_type, external_reference)` | CA/inbound/outbound; a referência continua através de reconnect. |
| `configuration_matrix_line_id uuid`, `is_critical boolean`, `state varchar(16)`, `lock_version integer` | sim/não/não/não | FK global; CHECK `active,inactive`; índice tenant/state/type | Objeto nasce active/não crítico; update `WHERE lock_version = expected`. |
| `effective_from timestamptz`, `last_seen_at timestamptz`, `inactive_at timestamptz`, `inactive_reason text`, `created_by uuid`, `updated_by uuid` | não/sim/sim/sim/não/não | FKs usuário; índice tenant/reference | Última vez que o objeto classificável foi reencontrado na coleta canônica; não é `lastObservedChangeAt`. Vigência prospectiva; inativação só por ausência canônica conclusiva. |
| `critical_classification_audits.id uuid`, `tenant_id uuid`, `critical_classification_id uuid`, `actor_id uuid` | não | PK/FKs; índice tenant/classification/occurred DESC | Audit imutável. |
| `action varchar(32)`, `before jsonb`, `after jsonb`, `expected_lock_version integer`, `resulting_lock_version integer`, `correlation_id uuid`, `occurred_at timestamptz` | não/sim/não/sim/sim/não | CHECK action | `created`, mark/unmark, inactive/reactivated, conflict rejected. |

### Snapshots, events and evidence

| Tabela | Colunas/tipos e invariantes |
|---|---|
| `configuration_snapshots` | `id uuid` PK; `tenant_id uuid`, `microsoft_connection_id uuid`, `configuration_publication_id uuid`, `configuration_fact_id uuid` FKs não nulas; `configuration_matrix_line_id uuid` FK **nula**; `source_key varchar(120)`, `source_contract_version varchar(64)`, `source_contract_checksum char(64)`, `fact_key varchar(180)`, `subject_key varchar(512)` não nulos; `normalized_value jsonb`, `redacted_value jsonb`, `value_hash char(64)`, `last_collected_at timestamptz`, `source_updated_at timestamptz`, `recorded_at timestamptz`. UNIQUE `(publication_id, source_key, source_contract_version, fact_key, subject_key)`; a MatrixLine só enriquece snapshot de fato comparável; retenção 365d. |
| `configuration_change_events` | `id uuid` PK; tenant/connection/publication FKs; `before_configuration_fact_id uuid`/`after_configuration_fact_id uuid` FKs, pelo menos uma não nula; `configuration_matrix_line_id uuid` FK **nula**; `source_key varchar(120)`, `source_contract_version varchar(64)`, `source_contract_checksum char(64)`, `fact_key varchar(180)`, `subject_key varchar(512)` não nulos; `external_reference varchar(512)`, `before_snapshot_id uuid`, `after_snapshot_id uuid`, `before_hash char(64)`, `after_hash char(64)`, `origin varchar(32)`, `source_event_correlation varchar(256)`, `observed_change_at timestamptz`, `recorded_at timestamptz`. CHECK de ao menos um fato/snapshot; UNIQUE `(tenant, publication, source_key, source_contract_version, fact_key, subject_key, before_hash, after_hash)`; `source_event_correlation` guarda somente identidade/referência canônica já publicada, nunca cria nova ingestão, watermark ou correlação especulativa; alteração factual pode existir sem MatrixLine; retenção 365d. |
| `configuration_drift_events` | `id uuid` PK; tenant/connection/change-event FKs; `configuration_matrix_line_id uuid`, `comparison_before_id uuid`, `comparison_after_id uuid` FKs **nulas**; `risk varchar(16)`, `severity varchar(16)` **nulos**; `status varchar(16)`, `detected_at timestamptz`, `recorded_at timestamptz`. Índice tenant/detected DESC; é drift factual quando só há change event, e é enriquecido por risco/severidade/comparações apenas quando a MatrixLine existe; nunca é aprovação/remediação; retenção 365d. |
| `configuration_technical_evidence` | `id uuid` PK; tenant/connection/generation FKs; `source_key varchar(120)`, `request_correlation varchar(256)`, `attempt smallint`, `metadata jsonb`, `error_category varchar(48)`, `http_status smallint`, `retry_after_at timestamptz`, `last_collected_at timestamptz`. Índice tenant/coleta; `metadata` contém somente classificação/contagens/identificadores permitidos já sanitizados pela boundary; payload, exceção, URL, header, credencial e identificadores não autorizados nunca são salvos/projetados. Retenção seis meses-calendário; FKs opcionais de source state/readiness usam `ON DELETE SET NULL`, para expiração resultar em `retention_expired`. |

### Fronteira de retenção e `app:prune-microsoft365 <tenant> all`

O pruner normal preserva current/source state atual e aplica os prazos da
feature. O modo explícito `all` substitui essa preservação para apagar
integralmente o data-plane Microsoft 365 daquele tenant; ele não apaga dados
cuja autoridade seja Orkestria/customer.

| Grupo/tabelas | Normal | `all` M365 | Motivo |
|---|---|---|---|
| `configuration_generations`, `configuration_facts`, `configuration_source_states`, `configuration_tcm_readiness` | histórico 365d; current/state atual enquanto existir customer | remove | coleta Graph/TCM/Intune e estado derivado reconstruíveis. |
| `configuration_publications`, `configuration_baseline_versions`, `configuration_baseline_items`, `configuration_comparisons`, `configuration_publication_domain_scores`, `configuration_snapshots`, `configuration_change_events`, `configuration_drift_events` e auditoria derivada | cadeia histórica 365d | remove | interpretação e histórico derivados da coleta Microsoft. |
| `configuration_technical_evidence` | seis meses-calendário | remove | telemetria/evidência técnica de coleta Microsoft. |
| `critical_classifications`, `critical_classification_audits` e futuras preferências/decisões locais tenant-scoped | enquanto existir customer, conforme sua própria política | **preserva** | autoridade local do Orkestria/customer; referência externa permite reencontrar a classificação após nova coleta. |
| `configuration_matrix_versions`, `configuration_domains`, `configuration_matrix_lines`, `configuration_baseline_profiles`, `configuration_baseline_profile_items` | enquanto interpretarem publicação preservada | **preserva** | catálogo global versionado, não é dado Microsoft coletado do tenant. |

## Cardinality, promotion and temporal invariants

1. `ConfigurationSourceContractRegistry` é allowlist code-level: Contract 1:N ObservedFact/SourceState por `source_key`+versão; ele não depende de MatrixLine. MatrixVersion 1:N Domain/Line/Profile; Domain 1:N Line; Line/ProfileItem referenciam `source_contract_key`+versão+`fact_key` apenas para leitura que participa de comparação. Nenhuma FK global aponta para tenant.
2. Tenant+connection 1:N BaselineVersion; cada versão materializa um Profile integral e tem 1:N BaselineItem. Tenant+connection 1:N Generation; Generation 1:N SourceState/Readiness/ObservedFact e 0..1 Publication. Uma ObservedFact pode não ter MatrixLine; só fatos com linha homologada participam de Comparison. A Publication nasce `staging`, é 1:N Comparison/DomainScore/Snapshot/Event e aponta uma BaselineVersion. Snapshot sempre ancora um fato e sua identidade de source/fact/subject; Event ancora fatos/snapshots antes/depois e pode existir sem MatrixLine. Drift pode apontar apenas ao event factual; as referências de comparação/linha e risco/severidade são opcionais.
3. Antes da promoção, I/O externo e normalização terminam; manifesto `staging`, fatos/source states/readiness, comparação, score/agregados, snapshots, diffs/change/drift e validação são persistidos em operações curtas. Campos derivados/published_at podem ser nulos somente em `staging,abandoned`; `CHECK` exige-os em `published,partial,superseded`. A promotion transaction somente revalida o manifesto já preparado, supersede a current anterior, troca `is_current` e marca geração/publicação `published` ou `partial`; I/O, retry, serialização e processamento volumoso nunca ocorrem nela. `staging`/`abandoned` são invisíveis; `failed`/`abandoned` não mudam current.
4. Mudança de criticidade cria audit e nova vigência, sem reescrever publicação/comparação histórica. A mesma referência volta a active; referência nova nasce não crítica.
5. Freshness é avaliada pelo contrato de fonte. Fato stale aparece apenas como histórico; comparação atual é `unavailable`, contribution zero se elegível e nunca gate.
6. Disconnect não apaga. A retenção normal conserva a current/source state e classification local; remove em 365 dias a cadeia histórica Microsoft (publication, generation, observed facts, source/readiness históricos, materializações de baseline, comparisons/domain scores, snapshots, alterações/drift e audit derivado) e em seis meses-calendário evidence/telemetria técnica. O cutoff genérico dos demais módulos não altera essa política. `app:prune-microsoft365 <tenant> all` remove integralmente os dados coletados/derivados Microsoft — generations, facts, states/readiness, publications, materializações de baseline, comparisons/scores, snapshots, changes/drift e evidence — em ordem de FKs, mas preserva `critical_classifications` e seus audits, bem como toda configuração/preferência cuja autoridade é Orkestria/customer. O catálogo global só pode ser removido quando nenhuma publicação preservada o referencia.
