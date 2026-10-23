# Data Model — Relatórios Microsoft 365 V1

## Convenções físicas e isolamento

- Tabelas novas de Relatórios usam UUID como PK. Isso não altera os tipos das
  tabelas existentes: `users.id`, `licensing_sync_runs.id`,
  `license_consumption_snapshots.id`, `license_inventory_snapshots.id` e
  `tenant_license_skus.id` são `bigint` (`$table->id()`). `tenants.id` e
  `microsoft_connections.id` são UUID.
- Toda tabela nova de data plane possui `tenant_id UUID NOT NULL`, FK para
  `tenants`, índice tenant-first, RLS `ENABLE` + `FORCE`, política deny-by-default
  `USING` e `WITH CHECK` baseada em `app.current_tenant_id`.
- Onde a origem Microsoft é direta, a tabela também possui
  `microsoft_connection_id UUID NOT NULL` e FK composta
  `(tenant_id, microsoft_connection_id) → microsoft_connections(tenant_id, id)`.
  Assim uma conexão de outro tenant não pode ser vinculada por escrita direta.
- FKs de autoria usam `*_user_id BIGINT`, exatamente como `users.id`.
  Nenhum campo de usuário é UUID. Datas são `timestamptz`; contagens são
  inteiros não negativos; PII, conteúdo de arquivo e payload externo não entram
  nas tabelas abaixo.
- `availability` é `available`, `unavailable`, `restricted` ou `coming_soon`;
  razão estruturada é obrigatória fora de `available`. Zero é valor factual e
  nunca codifica ausência, falha ou restrição.

## Relações

```text
ReportTemplate 1 ── * ReportTemplateBlock * ── 1 ReportBlockDefinition
                         │
Tenant + MicrosoftConnection ── * ReportConfiguration ── * ReportRequest
                                                │             │
                                                │             ├── 1 ReportSourceManifest
                                                │             ├── 0..1 ReportArtifact
                                                │             └── * ReportAuditEvent
                                                │
                                                └── ManifestSource (referência tipada)

LicensingSyncRun (BIGINT) ── * LicenseUsagePublication (UUID)
                            ├─ * LicensedPopulationPublication (UUID)
                            └─ * LicenseInventoryPublication (UUID)
                                      \__ mesma publication_generation_id __/
```

## Catálogo global/control plane

`report_templates`, `report_block_definitions` e `report_template_blocks` não
pertencem ao data plane e não têm `tenant_id`.

### `report_templates`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Identidade da versão. |
| `key`, `version` | varchar(80), smallint | `UNIQUE(key, version)`; uma única versão ativa por chave via índice parcial. |
| `title`, `purpose` | varchar/text | Metadado do catálogo. |
| `allowed_formats` | jsonb | Apenas `csv` e `xlsx`. |
| `partial_output_policy` | varchar(24) | `forbidden` ou `labelled_allowed`. |
| `lifecycle_status` | varchar(16) | `active` ou `retired`; histórico resolve versão retirada. |
| `created_at`, `retired_at` | timestamptz | Sem exclusão física de versão referenciada. |

### `report_block_definitions` e `report_template_blocks`

`report_block_definitions` contém `id UUID`, `key/version` únicos,
`source_contract`, `projection_definition`, `allowed_filters`, `pii_policy`,
`requirement_mode` (`required`/`degradable`) e lifecycle. Não contém SQL,
GraphQL, query Graph, fórmula arbitrária, código, URL ou upload executável.

`report_template_blocks` tem `id UUID`, `template_id UUID FK`,
`block_definition_id UUID FK`, `display_order`, `requirement_override` nullable e
`enabled_by_default`; possui `UNIQUE(template_id, display_order)` e
`UNIQUE(template_id, block_definition_id)`.

## Tabelas tenant-scoped de Relatórios

Todas as entidades desta seção têm o conjunto de RLS e FKs de conexão descrito
em Convenções. Toda tabela pai que recebe FK composta de um filho expõe
`UNIQUE(tenant_id, id)` para que o banco comprove a mesma tenant.

### `report_configurations`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Configuração local. |
| `tenant_id`, `microsoft_connection_id` | UUID | Não nulos; FK tenant e FK composta de conexão. |
| `template_id` | UUID FK | Versão de catálogo selecionada. |
| `name` | varchar(160) nullable | Nome local, sem conteúdo de saída. |
| `selected_block_ids`, `filters` | jsonb | Subconjunto/allowlist validados no servidor. |
| `report_period` | varchar(8) nullable | Somente permitido pelo template; uso V1 aceita `D7`, `D30`, `D90` ou `D180`. |
| `created_by_user_id`, `updated_by_user_id` | bigint FK | Referenciam `users.id`; segundo pode ser nulo no início. |
| timestamps | timestamptz | Configuração pode evoluir sem alterar pedido aceito. |

Índices: `(tenant_id, microsoft_connection_id, updated_at DESC)` e
`UNIQUE(tenant_id, id)`. `tenant_id` e conexão não são mutáveis.

### `report_requests`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Só existe após aceite de preflight válido. |
| `tenant_id`, `microsoft_connection_id` | UUID | Não nulos, tenant/connection scoped. |
| `configuration_id` | UUID nullable | FK composta `(tenant_id, configuration_id)`; preserva origem, não é a fotografia. |
| `manifest_id` | UUID unique | FK composta `(tenant_id, manifest_id)` criada após o manifesto na mesma transação. |
| `requested_format` | varchar(8) | `csv` ou `xlsx`, validado contra template. |
| `state` | varchar(24) | Apenas `preflight_passed`, `generating`, `completed`, `failed`. |
| `partial` | boolean | Só verdadeiro com política e razão congeladas. |
| `requested_by_user_id` | bigint FK | `users.id`. |
| `accepted_at` | timestamptz | Instante de aceite; não é critério de retention. |
| `completed_at` | timestamptz nullable | Instante canônico em que a execução entra em estado terminal; obrigatório em `completed`/`failed` e `NULL` em `preflight_passed`/`generating`. |
| `failure_code` | varchar(80) nullable | Sanitizado; não contém payload externo. |

**Lifecycle persistido:** preflight bloqueado não cria request. Aceite cria
`preflight_passed` + manifesto; `POST /download` faz a única transição
`preflight_passed → generating → completed|failed`. Uma segunda chamada é
rejeitada. Novo download exige novo preflight, request e manifesto.

Índices: `(tenant_id, microsoft_connection_id, state, created_at DESC)`,
`(tenant_id, id)` único e checks de estado/terminalidade, inclusive
`CHECK ((state IN ('completed', 'failed')) = (completed_at IS NOT NULL))`.

### `report_source_manifests`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Fotografia imutável de uma solicitação aceita. |
| `tenant_id`, `microsoft_connection_id` | UUID | Data plane materializado e connection FK composta. |
| `template_key`, `template_version` | varchar, smallint | Identidade lógica da versão. |
| `normalized_parameters` | jsonb | Blocos, período e filtros canônicos. |
| `overall_status`, `coverage`, `freshness_at` | varchar/jsonb/timestamptz | Resultado factual do aceite. |
| `partial_reason_codes` | jsonb | Vazio em completo; obrigatório se parcial. |
| `canonical_hash` | char(64) | SHA-256 indexado **não único**; manifestos distintos podem ser semanticamente iguais. |
| `created_at` | timestamptz | Sem update/delete. |

Índices: `INDEX(canonical_hash)` e
`(tenant_id, microsoft_connection_id, created_at DESC)`, além de
`UNIQUE(tenant_id, id)`. Prévia e download leem exclusivamente este registro e
suas fontes congeladas.

### `report_manifest_sources`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Linha de evidência de fonte congelada. |
| `tenant_id`, `microsoft_connection_id`, `manifest_id` | UUID | Materializados; FKs compostas para conexão e manifesto. |
| `block_definition_id` | UUID FK | Bloco que consome a fonte. |
| `source_contract` | varchar(80) | Ex.: `license_usage_publication`, `licensed_population_publication`, `license_inventory_publication`, `secure_score_publication`. |
| `source_record_id_text` | varchar(80) | Identificador normalizado (`"42"` para PK bigint, UUID textual para PK UUID), somente de proveniência/evidência/auditoria. Não é FK, requisito de existência futura, lookup runtime, fallback ou reconstrução. |
| `source_generation_id` | UUID nullable | Obrigatório para blocos que exigem geração, inclusive adoção. |
| `source_status`, `reason_code` | varchar | Estado/razão da fonte no aceite. |
| `coverage`, `freshness_at`, `evidence` | jsonb/timestamptz/jsonb | Metadados permitidos da fonte. |
| `frozen_projection` | jsonb | Valores canônicos permitidos que a prévia/stream precisa renderizar; gravados no aceite, sem PII/payload bruto e sem reconsulta ao registro atual. |
| `access_policy_snapshot` | jsonb | Granularidade, máscara, anonimização e restrições. |

**Referência de publicação concreta:** é polimórfica segura, não uma FK
impossível. Somente no aceite, o serviço resolve `source_contract`, localiza a
publicação permitida, valida tenant, Microsoft connection, estado, geração,
período, cobertura e autorização/PII, converte sua PK para
`source_record_id_text` e grava a fotografia. Copia também
`source_generation_id`, status/razão, cobertura, frescor, evidência permitida,
`frozen_projection` e `access_policy_snapshot`. Após o aceite, a publicação
original não é dependência operacional: preview e download usam exclusivamente
manifesto/fontes congelados e não verificam a existência de
`source_record_id_text`, não relêem a fonte nem fazem fallback para geração mais
nova. Histórico exibe essa proveniência congelada mesmo se a origem foi podada.
`UNIQUE(tenant_id, manifest_id,
block_definition_id, source_contract, source_record_id_text)` impede duplicação.

### `report_artifacts` e `report_audit_events`

`report_artifacts` tem `id UUID`, `tenant_id`, `microsoft_connection_id`,
`request_id UUID`, formato, `byte_size BIGINT`, `content_sha256 CHAR(64)`,
resultado sanitizado e `delivered_at`. Possui FK composta para request/conexão e
`UNIQUE(request_id)` e `UNIQUE(tenant_id, id)`; não possui blob, path, URL, token, expiração, retenção ou
download posterior. `byte_size` e `content_sha256` são calculados sobre os bytes
do arquivo efêmero efetivamente transmitido; falha não cria artifact.

`report_audit_events` tem `id UUID`, `tenant_id`, `microsoft_connection_id`,
`request_id UUID nullable`, `artifact_id UUID nullable`, `actor_user_id BIGINT
nullable`, `event_type`, `metadata` sanitizado e `occurred_at`. Tem FKs compostas
para request/artifact, FK bigint para usuário, check de que ao menos
`request_id` ou `artifact_id` está preenchido, e índice
`(tenant_id, microsoft_connection_id, occurred_at DESC)`. Ambos são RLS e não
herdam tenant apenas de seus pais.

## Publicações append-only de Licenciamento

As três tabelas abaixo pertencem a Licenciamento, são criadas por migration
incremental e seguem o mesmo RLS/tenant/conexão das tabelas de Relatórios. Elas
não modificam as migrations nem a semântica mutável de
`license_consumption_snapshots`.

### `license_usage_publications`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Publicação histórica de uso. |
| `tenant_id`, `microsoft_connection_id` | UUID | Boundary materializado/FK composta. |
| `licensing_sync_run_id` | bigint FK | Mesmo tipo de `licensing_sync_runs.id`; migration incremental acrescenta `UNIQUE(tenant_id, id)` nos runs para permitir FK composta `(tenant_id, licensing_sync_run_id)`. |
| `publication_generation_id` | UUID | Identificador inequívoco, compartilhado com população somente na família de adoção. |
| `published_at` | timestamptz NOT NULL | Instante imutável da promoção canônica; único timestamp de cutoff da retention. |
| `report_period`, `workload`, `metric_key` | varchar | Uso: `D7`, `D30`, `D90` ou `D180`/`active_users`; Detail: `D30`/`Office 365`/`active_users_detail`. |
| `report_date` | date nullable | Obrigatória exclusivamente em `active_users_daily`; identifica cada observação D180 dentro da geração única do lote. |
| `metric_value` | unsigned integer | Valor publicado pelo CSV já coletado. |
| `publication_status`, `coverage`, `report_updated_at` | varchar/jsonb/timestamptz | Sem sucesso técnico fictício. |
| `technical_synced_at`, `evidence_reference` | timestamptz/varchar nullable | Metadados; não definem identidade, promoção nem cutoff. |
| `created_at` | timestamptz | Append-only. |

Índices: unicidade parcial diária inclui `report_date`; a unicidade parcial não-diária preserva `(tenant_id, microsoft_connection_id, publication_generation_id, report_period, workload, metric_key)`. O
coletor chama `getOffice365ServicesUserCounts(period)` sem chamada Graph em
Relatórios: operação `routine` e `--force` usam exclusivamente `D30`; o modo
`--recollect-days=N` usa o período correspondente (`D7`, `D30`, `D90` ou
`D180`) e publica essa fotografia local.

`getOffice365ActiveUserDetail(D30)` pode retornar CSV por URL pré-autorizada. O
cliente valida o redirect e o baixa sem bearer token; o coletor descarta as linhas
e persiste somente contagem, `Report Refresh Date` e telemetria agregada.

### `licensed_population_publications`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Denominador histórico. |
| `tenant_id`, `microsoft_connection_id` | UUID | Boundary materializado/FK composta. |
| `licensing_sync_run_id` | bigint FK | Mesmo contrato composto por tenant da tabela de runs. |
| `publication_generation_id` | UUID | Igual ao da publicação de uso compatível. |
| `published_at` | timestamptz NOT NULL | Mesmo instante imutável de promoção da `publication_generation_id`. |
| `eligible_distinct_person_count` | unsigned integer | Uma pessoa elegível conta uma vez, por atribuição direta ou grupo. |
| `publication_status`, `coverage`, `unavailable_reason` | varchar/jsonb/varchar nullable | Fonte incompleta/restrita não vira zero. |
| `calculation_setting_snapshot`, `evidence` | jsonb | Registra SKUs e `included_in_calculation` congelados. |
| `technical_synced_at`, `created_at` | timestamptz | Metadado temporal e criação append-only; não definem cutoff. |

Índices: `UNIQUE(tenant_id, microsoft_connection_id, publication_generation_id)`
e lookup por tenant/conexão/criação. Uma mudança futura em
`included_in_calculation` apenas participa de geração nova.

### `license_inventory_publications`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | Linha histórica por SKU. |
| `tenant_id`, `microsoft_connection_id` | UUID | Boundary materializado/FK composta. |
| `licensing_sync_run_id` | bigint FK | Mesmo contrato composto por tenant da tabela de runs. |
| `publication_generation_id` | UUID | Geração factual independente do inventário. |
| `published_at` | timestamptz NOT NULL | Instante imutável da promoção do inventário. |
| `sku_id`, `sku_part_number`, `sku_display_name` | varchar | Identidade e rótulo da SKU publicados. |
| `enabled_units`, `consumed_units`, `available_units` | unsigned integer | Capacidade factual da fotografia. |
| `capability_status`, `technical_status`, `included_in_calculation`, `service_plans` | varchar/boolean/jsonb | Estado normalizado e regra congelada para reconstrução histórica. |
| `publication_status`, `coverage`, `freshness_at`, `evidence` | varchar/jsonb/timestamptz/jsonb | Sem PII, sem sucesso fictício. |
| `created_at` | timestamptz | Append-only. |

Índices: `UNIQUE(tenant_id, microsoft_connection_id, publication_generation_id,
sku_part_number)` e lookup por tenant/conexão/geração. Ela materializa a
fotografia permitida de `TenantLicenseSku`/`LicenseInventorySnapshot` no fim do
ciclo e é a única fonte de inventário para Relatórios; ela é promovida mesmo que
uma família Graph Reports independente falhe. Os snapshots correntes nunca são
lidos para reconstruir request aceito.

## Retention e purge

Todo prune ocorre pelo tenant do comando central; o predicado é sempre
`tenant_id`, abrangendo todas as suas connections sem receber connection como
entrada. RLS/FKs são limites adicionais, não substituem esse filtro.

### Publicações de Licenciamento

`LicensingRetentionPruner` é estendido, sem novo pruner paralelo. Em janela, ele
identifica primeiro gerações com `published_at < cutoff` e só remove uma geração
inteira quando ela não é âncora factual. `published_at` é fixado uma vez na
promoção append-only, não muda em rerun e deve coincidir nas três tabelas para a
mesma `(tenant_id, microsoft_connection_id, publication_generation_id)`;
`technical_synced_at`, `created_at` e `LicensingSyncRun.finished_at` não são
critérios de cutoff. Preserva: a última publicação `available` de
uso por `(tenant_id, microsoft_connection_id, report_period, workload,
metric_key)` — independentemente para `D7`, `D30`, `D90`, `D180` —, a população
da mesma `publication_generation_id` de todo uso preservado e a geração factual
de inventário mais recente por tenant/conexão. Logo, populações órfãs antigas e
gerações não ancoradas são removíveis, mas uso/população de adoção jamais são
separados.

Ordem normal e `all`: (1) publicações uso/população/inventário elegíveis;
(2) fatos históricos de Licenciamento já cobertos pelo pruner existente;
(3) `licensing_sync_runs` antigos/conclusos somente sem referência de qualquer
uma das três publicações. As FKs das publicações para runs usam `RESTRICT`; a
ordem explícita, não `CASCADE`, evita erro previsível. Em `all`, todas as três
publicações do tenant saem antes de todos os runs.

### Data plane de Relatórios

`report_configurations` é operacional/corrente e fica preservada no prune por
janela, ainda que antiga. Só `report_requests` em `completed` ou `failed` com
`completed_at < cutoff` são unidades históricas removíveis; `accepted_at` e
`created_at` não bastam. Requests `preflight_passed` e `generating` permanecem,
mesmo antigos, para lifecycle/recovery fora desta política. São dependentes
removíveis do request selecionado:
`report_requests`, `report_source_manifests`, `report_manifest_sources`,
`report_artifacts` e `report_audit_events`. O `ReportsRetentionPruner` remove
uma execução como unidade em ordem: audit events → artifacts → manifest sources
→ requests → manifests. O manifesto pertence ao request selecionado e nunca é
selecionado isoladamente por `created_at`. Requests saem antes de manifests porque
materializam a FK `manifest_id`; events saem antes de request/artifact. Ausência
de filhos é sucesso e rerun é idempotente.

O prune de uma publicação-fonte não altera request/manifesto ainda retido: a
referência polimórfica não bloqueia sua remoção e a ausência posterior da origem
não torna o request `unavailable`, não cria preflight e não substitui a geração
congelada. Preview, CSV/XLSX e histórico continuam pela fotografia persistida.

Em `all`, a mesma ordem remove todo esse histórico e então
`report_configurations`, sempre apenas do tenant. `report_templates`,
`report_block_definitions` e `report_template_blocks` são globais/control plane e
nunca entram no pruner. O artifact é só metadado; CSV/XLSX já não existe desde a
entrega. A remoção de publicação de fonte não invalida manifesto ainda retido:
`frozen_projection` e políticas congeladas são sua fotografia suficiente, sem FK
polimórfica adicional.

### Regra derivada: `taxa-de-adocao`

O manifesto fixa duas linhas append-only com o mesmo `(tenant_id,
microsoft_connection_id, publication_generation_id)`: `license_usage_publications`
para `Office 365 Active`/período solicitado e `licensed_population_publications`. Calcula
`metric_value ÷ eligible_distinct_person_count × 100` somente se ambos estão
`available`, possuem cobertura compatível e denominador positivo. Falta de linha,
geração, período, escopo, cobertura ou regra reproduzível retorna `unavailable`.
Ele nunca usa `LicenseConsumptionSnapshot` ou `UserLicenseAssignment` correntes;
`technical_synced_at` não é chave de associação.

## Mutabilidade e migrations

| Registro | Mutabilidade | Retenção de conteúdo |
|---|---|---|
| Catálogo | nova versão em mudança material | não contém dados customer. |
| Configuração | editável, sem reescrever pedido aceito | metadados permitidos. |
| Request/manifesto/fontes/auditoria | imutável após criação | sem PII ampliada/payload bruto. |
| Artifact | uma evidência por request | sem arquivo persistido. |
| Publicações de uso/população/inventário | append-only; `published_at` imutável | evidência sanitizada, sem lista de pessoas. |

Toda evolução é migration incremental: novas tabelas, índices, checks, FKs
compostas e políticas RLS; a migration histórica de consumo não é alterada. A
migration valida em PostgreSQL 18 inserção cross-tenant, tipos FK, RLS
`SELECT/INSERT/UPDATE/DELETE`, unicidade de artifact, terminalidade de
`ReportRequest.completed_at`, temporalidade coerente/imutável de `published_at`
por geração e repetição idempotente da publicação por geração.
