# Data Model: Baseline PostgreSQL 18

## Baseline Chain

| Ordem | Migration | Domínios |
| --- | --- | --- |
| 01 | `0001_01_01_000000_create_laravel_core_tables.php` | users, sessões, cache, jobs |
| 02 | `0001_01_01_000100_create_governance_tables.php` | governança |
| 03 | `0001_01_01_000200_create_licensing_tables.php` | licenciamento |
| 04 | `0001_01_01_000300_create_identity_tables.php` | identidades e auditoria |
| 05 | `0001_01_01_000400_create_group_tables.php` | grupos e relações |
| 06 | `0001_01_01_000500_create_microsoft365_sync_tables.php` | ciclos, stages, batches e posições |
| 07 | `0001_01_01_000600_create_mfa_projection_tables.php` | MFA e risco |
| 08 | `0001_01_01_000700_create_secure_score_tables.php` | Secure Score |

O Mapa obrigatório (referência histórica não disponível neste escopo) é a fonte por tabela e migration histórica.

## Reconciliação do mapa histórico

Cada linha do mapa foi incorporada em uma única migration final: operações
incrementais, `after()`, backfills e ramos por engine ficaram fora do baseline.
O teste `PostgresBaselineSchemaTest` exige os oito arquivos, todas as tabelas
resultantes e os índices/constraints que definem as relações entre domínios.

| Baseline | Linhas históricas reconciliadas | Evidência direta no PostgreSQL 18 |
| --- | --- | --- |
| 000000 core | users, cache e jobs | oito migrations exatas e tabelas core |
| 000100 governança | topics, documents, score histories | tabelas/FKs e `date` civil |
| 000200 licenciamento | sync, SKUs, eventos, snapshots, cenários e settings | tabelas finais preservadas |
| 000300 identidade | runs, gerações, identities, snapshots, estados, auditoria, exports, sinais, risco e MFA | tabelas, `timestamptz`, JSONB e checks de contadores |
| 000400 grupos | gerações, groups, snapshots, relações, auditoria e source states | `group_types jsonb` e `directory_groups_pagination_idx` |
| 000500 sync | cycles, stages, batches, positions, retenção, source states e ligações de eventos | unique tenant/UUID, FKs `RESTRICT` e checks de telemetria |
| 000600 MFA | policy snapshots, classifications, coverage e risk detections | `configurations text` com cast encrypted e `source_state jsonb` |
| 000700 Secure Score | snapshots, controls, intermediárias, perfis, publicações, estados, relacionados e metas | FKs compostas tenant/cycle e tenant/pais, uniques, `numeric`, checks e `RESTRICT` |

`PostgresIntegrityConstraintsTest` prova por escrita direta as duplicidades,
nulos obrigatórios, valores fora do domínio, tenant cruzado e deleções
restringidas. `PostgresTypesAndIndexesTest` prova ciphertext, JSONB consultável,
tipos, UTC, chave UTF-8 e ausência de dependência de IDs contíguos.

## Cross-Cutting Rules

| Concern | Final rule |
| --- | --- |
| Identidade técnica | `$table->id()`/identity; não há promessa de IDs sem lacunas. |
| Tenant/ciclo | ciclo: id técnico + UUID `cycle_id` + unique `(tenant_id, cycle_id)`; filhos de domínio: `tenant_id` + UUID `sync_cycle_id` e FK composta. |
| Deleção | histórico/publicações usam `RESTRICT`; stages usam FK ao id técnico do ciclo com `RESTRICT`. |
| Tempo | instantes: `timestamptz` UTC; calendário/revisão civil: `date`. |
| Documentos | JSON não criptografado: `jsonb`; casts `encrypted`: `text`. |
| Números | scores `numeric(12,4)`; metas `numeric(5,2)`; contadores operacionais têm `CHECK >= 0`. |
| Names | FKs, checks, uniques e índices compostos explícitos, até 63 bytes. |

## Explicit Invariants

| Surface | Constraint / relationship | Required proof |
| --- | --- | --- |
| Secure Score target | meta 0–100 e fonte `product_default/configured`, `NOT NULL` | invalid insert rejected |
| Related snapshot | unique `(tenant_id, source, sync_cycle_id, checksum)` | max UTF-8 + checksum 64 + rerun |
| Publication | unique `(tenant_id, snapshot_id, profile_version_id, sync_cycle_id)` | tenant isolation + rerun |
| Source state | unique `(tenant_id, source, sync_cycle_id)` | retry + tenant-cross rejection |
| MFA policy snapshot | configurations `text`; source_state JSONB não criptografado | encrypted round-trip + JSON query |
| Directory groups | group_types JSONB; contenção `@>` é a única query JSONB sob avaliação de índice nesta entrega | ILIKE/null/repeated-date + EXPLAIN |

## Cycle Relationship Matrix

| Child surface | Cycle relationship | Additional relationship | Delete policy |
| --- | --- | --- | --- |
| `microsoft365_sync_stages` | FK direta `sync_cycle_id` → id técnico do ciclo | — | `RESTRICT` |
| `microsoft365_event_ingestion_batches` | `tenant_id` + UUID `sync_cycle_id` → `(tenant_id, cycle_id)` | `sync_stage_id` → stage técnico | `RESTRICT` para dados históricos |
| snapshots, publications, source states e ciclos intermediários Secure Score | `tenant_id` + UUID `sync_cycle_id` → `(tenant_id, cycle_id)` | FKs de snapshot/perfil/publicação existentes | `RESTRICT` |

Pessoas/posições de coleta, políticas de retenção e source states que não representam uma execução de ciclo preservam suas chaves atuais; o baseline não lhes acrescenta ciclo. Nenhum filho histórico usa cascade/null-on-delete para apagar ou desassociar evidência.

## Lifecycle Notes

- Na perda de lock, cycle/stage/batch/generation ativos ficam terminais, com motivo sanitizado e horário final; publicação anterior persiste.
- Sem publicação anterior, falha de fonte não cria publicação, valor zero nem dado comercial vazio; o source state local registra indisponibilidade, frescor e razão factual.
- Checksum é calculado no payload canônico antes de JSONB; JSONB não é fonte de checksum.
# Evidência de execução — 2026-08-20

`php artisan migrate:fresh --env=testing --force` foi executado em PostgreSQL 18.4
contra `orkestria360_test`, criando exclusivamente os oito baselines `000000` a
`000700`. Os testes de schema cobrem a presença das tabelas de cada domínio,
constraints de meta e FKs compostas tenant/cycle; `PostgresTypesAndIndexesTest`
confirma `jsonb`, `timestamptz`, `numeric(5,2)` e nomes de constraints até 63 bytes.
