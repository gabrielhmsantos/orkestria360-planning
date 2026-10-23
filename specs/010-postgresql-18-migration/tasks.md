# Tasks: Migração PostgreSQL 18

**Input**: Artefatos em `specs/010-postgresql-18-migration/` e insumos em `docs/postgresql-18-migration/`.

**Prerequisites**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [database-and-sync-compat.md](./contracts/database-and-sync-compat.md) e [quickstart.md](./quickstart.md).

**Tests**: Obrigatórios. A feature altera schema, persistência, sincronização e ambiente; toda correção deve ter regressão direta em PostgreSQL 18. O executor cumpre o roteiro do quickstart antes de `migrate:fresh`; os gates usam os comandos Composer padrão.

**Path convention**: código, configuração, migrations, scripts e testes pertencem a `orkestria360/`; artefatos/evidências do planejamento permanecem no repositório raiz.

## Format: `[ID] [P?] [Story] Description`

- `[P]` indica arquivos independentes, sem dependência de tarefa incompleta.
- `[US#]` liga a tarefa à história em `spec.md`; setup/fundação/finalização não recebem rótulo de história.

## Phase 1: Setup — ambiente PostgreSQL isolado

**Purpose**: criar a única entrada segura para banco de desenvolvimento/teste e a base para validar todas as fases.

- [X] T001 Criar `orkestria360/docker-compose.yml` com a referência imutável oficial `postgres:18.<menor>@sha256:<digest>`, volume em `/var/lib/postgresql` e `pg_isready` para o único banco provisionado, `orkestria360`; registrar a referência resolvida em `docs/postgresql-18-migration/OFFICIAL-REFERENCES.md` antes de subir o serviço.
- [X] T002 [P] Documentar o provisionamento manual e condicional de `orkestria360_test`, mantendo `orkestria360` como base da aplicação e sem init SQL, entrypoint ou criação pela aplicação.
- [X] T003 Atualizar `orkestria360/.env.example` e `orkestria360/phpunit.xml`: não criar nem versionar `.env.testing`; remover do PHPUnit as declarações `DB_CONNECTION`, `DB_DATABASE`, `DB_URL` e `CACHE_STORE`. Documentar o contrato de variáveis explícitas do processo local (`APP_ENV`, `APP_KEY`, `pgsql`, `DB_*`, `DB_URL=''`, `CACHE_STORE=database`) sem sobrepor o `env:` do CI.
- [X] T004 Atualizar o roteiro obrigatório de [quickstart.md](./quickstart.md) para orientar o executor, antes de `php artisan migrate:fresh --env=testing --force`, a confirmar alvo descartável, ausência de config cache, `APP_KEY`, driver `pgsql`, `DB_URL=''`, conexão acessível e banco `orkestria360_test` distinto de `orkestria360`, sem criar comando ou script auxiliar.
- [X] T005 Atualizar `orkestria360/config/database.php` e `orkestria360/composer.json` para `pgsql` como único fallback operacional e remover conexões, post-create/setup e criação de `database/database.sqlite`; remover o arquivo `orkestria360/database/database.sqlite` e ajustar `orkestria360/database/.gitignore` para não recriá-lo.
- [X] T006 [P] Criar uma guarda de infraestrutura inicial da suíte em `orkestria360/tests/TestCase.php` e a regressão correspondente em `orkestria360/tests/Feature/Database/PostgresEnvironmentContractTest.php`, cobrindo driver efetivo `pgsql`, `DB_URL` vazio, banco isolado `orkestria360_test`, `CACHE_STORE=database` e ausência de dependência da base local ou SQLite antes de qualquer teste tocar dados.
- [X] T007 Executar o bootstrap de [quickstart.md](./quickstart.md) em volume novo, incluindo as variáveis explícitas de teste, `php artisan config:clear`, confirmação de ausência de `bootstrap/cache/config.php` e o roteiro antes de `migrate:fresh`; registrar os comandos finais de start/reset/validação sem usar credencial de produção.

**Checkpoint**: Compose saudável cria ambos os bancos em volume novo, e nenhum comando de teste tem rota operacional para SQLite ou para o banco local da aplicação.

---

## Phase 2: Foundational — baseline e contratos persistentes

**Purpose**: substituir integralmente o histórico por oito migrations PostgreSQL finais. **BLOCKS US1, US2 e US3.**

- [X] T008 Criar `orkestria360/tests/Feature/Database/PostgresBaselineSchemaTest.php` para inspecionar, na base já preparada pela suíte, ausência de SQLite, as oito migrations e a existência de tabelas/índices/constraints do mapa em `docs/postgresql-18-migration/BASELINE-MIGRATION-MAP.md`; não executar `migrate:fresh` dentro do PHPUnit.
- [X] T009 Remover a cadeia histórica em `orkestria360/database/migrations/` e criar `0001_01_01_000000_create_laravel_core_tables.php` com users, sessions, cache/cache_locks, jobs, failed_jobs e tipos PostgreSQL finais; não prometer rollback do baseline.
- [X] T010 Criar `orkestria360/database/migrations/0001_01_01_000100_create_governance_tables.php` com o estado final de governança, FKs, uniques, defaults e nomes SQL explícitos do mapa.
- [X] T011 Criar `orkestria360/database/migrations/0001_01_01_000200_create_licensing_tables.php` com inventário, consumo, atribuições, eventos, oportunidades e configurações finais, preservando apenas os contratos de dados já publicados.
- [X] T012 Criar `orkestria360/database/migrations/0001_01_01_000300_create_identity_tables.php` com identities, snapshots, source states, auditoria, risco e MFA, usando `timestamptz` UTC, `date` civil, `jsonb` consultável e checks de contadores aplicáveis.
- [X] T013 Criar `orkestria360/database/migrations/0001_01_01_000400_create_group_tables.php` com grupos, gerações, relações, snapshots e source states; incluir `group_types` em `jsonb` e o índice alinhado à consulta, sem GIN especulativo.
- [X] T014 Criar `orkestria360/database/migrations/0001_01_01_000500_create_microsoft365_sync_tables.php` com ciclo identity + UUID, unique `(tenant_id, cycle_id)`, stages por FK técnica `RESTRICT`, batches por `(tenant_id, sync_cycle_id)` composta `RESTRICT` e posições/retenção/source states sem ciclo preservando chaves atuais.
- [X] T015 Criar `orkestria360/database/migrations/0001_01_01_000600_create_mfa_projection_tables.php` com `mfa_method_policy_snapshots.configurations` em `text`, JSONB somente para dados não criptografados e constraints finais de MFA/risco.
- [X] T016 Criar `orkestria360/database/migrations/0001_01_01_000700_create_secure_score_tables.php` com tenant nas intermediárias, UUID/FKs compostas `RESTRICT`, uniques finais, `numeric(12,4)`/`numeric(5,2)`, checksum de 64 e checks de meta/fonte/contadores.
- [X] T017 Atualizar os modelos afetados em `orkestria360/app/Models/` (incluindo `MfaMethodPolicySnapshot.php`, `Microsoft365SyncCycle.php`, `Microsoft365SyncStage.php`, `Microsoft365EventIngestionBatch.php` e modelos Secure Score) para casts, UUIDs, timestamps e relações coerentes com o baseline.
- [X] T018 Criar `orkestria360/tests/Feature/Database/PostgresIntegrityConstraintsTest.php` que insere diretamente relações inválidas/tenant cruzado, duplicidades, meta fora de 0–100, fonte inválida, nulos e contadores negativos, e prova `RESTRICT` para stage, batch, publicação e histórico.
- [X] T019 Criar `orkestria360/tests/Feature/Database/PostgresTypesAndIndexesTest.php` para ciphertext `text` com cast `encrypted:array`, JSONB válido/consultável, precisão numérica, UTC com `Z`/offset em borda de dia, `date` civil, nomes ≤63 bytes, chave composta UTF-8 e ausência de pressuposto de IDs contíguos.
- [X] T020 Cumprir o roteiro de [quickstart.md](./quickstart.md) e depois executar `php artisan migrate:fresh --env=testing --force`; reconciliar cada linha do mapa de baseline (referência histórica não disponível neste escopo) com uma migration e, quando aplicável, teste de constraint/índice/query em `specs/010-postgresql-18-migration/data-model.md`.

**Checkpoint**: PostgreSQL vazio prepara somente o baseline de oito arquivos; invariantes persistentes rejeitam escrita direta inválida e nenhum dado histórico/publicado é apagável em cascata.

---

## Phase 3: User Story 1 — Operar com dados confiáveis (Priority: P1) 🎯 MVP

**Goal**: dados publicados existentes mantêm tipos, buscas, ordenação, seed e integridade no PostgreSQL final.

**Independent Test**: com Phase 1–2 pronta, popular dados sintéticos de módulos, consultar projeções locais e executar os testes desta fase em PostgreSQL sem SQLite.

- [X] T021 [P] [US1] Atualizar `orkestria360/tests/Feature/Groups/DirectoryTest.php` para busca `ILIKE` case-insensitive, nulos e datas repetidas com paginação estável ASC/DESC; cobrir `directory_groups.group_types @>` como JSONB.
- [X] T022 [P] [US1] Atualizar `orkestria360/tests/Feature/UsersAccounts/ExecutiveDashboardTest.php` para `account_enabled` verdadeiro, falso e ausente, preservando semântica booleana PostgreSQL.
- [X] T023 [P] [US1] Criar `orkestria360/tests/Feature/Database/PostgresSeederAndFactoryTest.php` para factories aplicáveis e `DatabaseSeeder`/`GovernanceTopicSeeder`/`MfaMethodClassificationSeeder`/`TenantLicenseSkuCalculationSettingSeeder`, comprovando execução e rerun idempotente.
- [X] T024 [US1] Atualizar `orkestria360/app/Services/Microsoft365/Groups/DirectoryGroupsQuery.php` para `ILIKE` com binding, whitelist de ordenação, `ASC NULLS FIRST`/`DESC NULLS LAST` e `id` como desempate.
- [X] T025 [US1] Atualizar `orkestria360/app/Services/Microsoft365/UsersAccounts/ExecutiveDashboardPageData.php` para predicados `IS TRUE`/`IS FALSE` (ou query builder equivalente), sem comparação numérica.
- [X] T026 [US1] Ajustar `orkestria360/database/factories/` e `orkestria360/database/seeders/` afetados pelo schema final, mantendo idempotência e sem introduzir dados ficticiamente disponíveis para estados indisponíveis.
- [X] T027 [US1] Criar fixture versionada em `orkestria360/tests/Fixtures/directory-groups-jsonb.php` com cardinalidade e distribuição de `group_types` registradas, executar `EXPLAIN (ANALYZE, BUFFERS)` da contenção `directory_groups.group_types @>` antes/depois de índice candidato e registrar comando, fixture e decisão em `specs/010-postgresql-18-migration/research.md`; alterar a migration de grupos somente se a mesma matriz demonstrar ganho necessário.

**Checkpoint**: buscas, booleanos, JSONB, horários e dados semeados seguem contratos factuais e os testes da história passam exclusivamente em PostgreSQL.

---

## Phase 4: User Story 2 — Executar sincronização Microsoft 365 com segurança (Priority: P1)

**Goal**: uma sincronização coordenada por tenant mantém exclusividade, idempotência, telemetria factual e publicação segura em falhas.

**Independent Test**: fontes Graph/Defender falsas executam uma coleta, rerun, colisão e perda de lock em PostgreSQL com `CACHE_STORE=database`, sem HTTP na leitura.

- [X] T028 [P] [US2] Criar `orkestria360/tests/Feature/Microsoft365/DatabaseLockIntegrationTest.php` como integração não transacional, com schema já preparado e limpeza explícita somente das chaves/linhas de teste, usando dois processos PHP/conexões PostgreSQL independentes, barreira e TTL controlado contra `cache_locks` para cobrir owner, aquisição concorrente, `refresh`, expiração/perda, `release` e lock por tenant antes da criação de `cycle_id`.
- [X] T029 [US2] Atualizar `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php` e `SyncStageRecorderTest.php` com double determinístico de perda de lock, depois da prova real de T028, para terminalizar cycle/stage/batch/generation com status falho, motivo sanitizado, `finished_at`, release e bloqueio de coleta/promoção posteriores sem concorrer com `RefreshDatabase`.
- [X] T030 [P] [US2] Atualizar `orkestria360/tests/Feature/Microsoft365/SecureScore/SecureScoreSynchronizationTest.php` e `SecureScorePublishedDataTest.php` para UUID/tenant composto, checksum do payload canônico pré-JSONB, rerun sem duplicidade e preservação da publicação válida.
- [X] T031 [P] [US2] Atualizar `orkestria360/tests/Feature/LicensingSyncTest.php` e `LicensingAuthorizationTest.php` para fallback `licenseDetails → /users`, nenhuma escrita no tenant, dado comercial indisponível até Assessment/CSV e primeira falha sem publicação/vazio/zero fabricado.
- [X] T032 [US2] Atualizar `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php`, `SyncStageRecorder.php` e `SyncOperation.php` para renovar/validar lock por tenant, terminalizar todos os registros ativos e impedir novas coletas/promoções ao detectar perda.
- [X] T033 [US2] Inventariar em `specs/010-postgresql-18-migration/research.md` cada uso de `firstOrCreate`, `updateOrCreate`, `upsert` e `MAX(revision)+1` em `orkestria360/app/Services/Microsoft365/{Sync,SecureScore,Groups,UsersAccounts,Licensing,Mfa}/`, registrando por operação lock, retry/reconsulta ou justificativa de não concorrência.
- [X] T034 [US2] Aplicar as decisões inventariadas de T033 nas persistências de `orkestria360/app/Services/Microsoft365/{Sync,SecureScore,Groups,UsersAccounts,Licensing,Mfa}/`, com retry delimitado/reconsulta após unique violation quando necessário e sem HTTP em transação; preservar explicitamente a topologia independente do lock de Licenciamento.
- [X] T035 [US2] Atualizar `orkestria360/app/Services/Microsoft365/SecureScore/SecureScoreSynchronizer.php`, `SecureScorePublicationBuilder.php` e source states correlatos para métricas factuais de lido/processado/criado/atualizado/persistido/deduplicado/excluído/tentativa/retry, sem contar tamanho do payload como persistência.
- [X] T036 [US2] Atualizar synchronizers/projeções de `orkestria360/app/Services/Microsoft365/{Licensing,SecureScore,Sync}/` para manter publicação anterior como stale em falha e, na primeira falha, publicar somente source state local de indisponibilidade/frescor/razão factual, sem HTTP externo em leitura.
- [X] T037 [US2] Executar os testes Microsoft 365 desta fase com fakes em `php artisan test tests/Feature/Microsoft365 tests/Feature/LicensingSyncTest.php` e anexar a evidência de contratos preservados a `specs/010-postgresql-18-migration/contracts/database-and-sync-compat.md`.

**Checkpoint**: concorrência não mistura tenant nem cria duplicidade; lock perdido não deixa registros ativos; telemetria e disponibilidade correspondem à persistência e às fontes reais.

---

## Phase 5: User Story 3 — Preparar ambientes reproduzíveis (Priority: P2)

**Goal**: clone limpo, testes e CI usam somente PostgreSQL 18 isolado, preservando a composição remota atual de build, análise estática e testes.

**Independent Test**: em volume novo e runner Linux, a estrutura, factories/seeders, build, análise estática e testes rodam sem criar/selecionar SQLite ou banco local.

- [X] T038 [P] [US3] Atualizar `orkestria360/.github/workflows/tests.yml` com service `postgres:18.<menor>@sha256:<digest>`, `POSTGRES_DB=orkestria360_test`, credenciais exclusivas, healthcheck `pg_isready`, porta `5432:5432` e `env:` explícito (`APP_ENV=testing`, `DB_*`, `DB_URL=''`, `CACHE_STORE=database`). Habilitar `pdo_pgsql`/`pgsql`, gerar a chave no workspace efêmero, executar `php artisan migrate --env=testing --force`, remover SQLite e preservar build, `composer types:check` e `php artisan test`.
- [X] T039 [P] [US3] Atualizar `orkestria360/.github/workflows/lint.yml` para `permissions: contents: read`, preservando actions pinadas por SHA e sem service/testes redundantes.
- [X] T040 [US3] Atualizar `orkestria360/phpunit.xml`, `orkestria360/.env.example` e a documentação para não criar nem versionar `.env.testing`, manter o PHPUnit sem declarações `DB_*` nem `CACHE_STORE` e exigir que CI e executor local forneçam conexão e store explicitamente por ambiente, sem fallback SQLite/array; preservar a composição atual do job remoto.
- [X] T041 [US3] Complementar a guarda inicial da suíte com prova de `DB::connection()->getDriverName() === 'pgsql'`, database `orkestria360_test` e `CACHE_STORE=database`. A ausência de SQLite neste marco é validada manualmente no quickstart, sem teste de regressão dedicado.
- [X] T042 [US3] Executar o reset de volume e as matrizes de [quickstart.md](./quickstart.md), cumprindo o roteiro antes de `migrate:fresh`; factories, seeders e ambos os gates locais padrão seguem no mesmo ambiente. Manter paralelismo desligado e documentar o pré-requisito `CREATEDB`/`--parallel --recreate-databases` se ele for habilitado futuramente.

**Checkpoint**: local e CI são reproduzíveis, isolados, sem segredo produtivo/SQLite e o workflow remoto mantém a composição validada.

---

## Phase 6: Finalização e evidências transversais

**Purpose**: encerrar a entrega com a evidência exigida pelos artefatos, sem expandir escopo funcional.

- [X] T043 Reexecutar o roteiro antes de cada `migrate:fresh`, todas as validações de schema, queries, sync e ambiente, e atualizar a matriz de evidências em `specs/010-postgresql-18-migration/quickstart.md` para SC-001–SC-012.
- [X] T044 Executar `composer ci:check` em `orkestria360/` (inclui a suíte PHP); registrar falhas/limitações reais, se houver, em `specs/010-postgresql-18-migration/research.md` sem reinstalar SQLite ou criar fallback.
- [X] T045 Revisar `orkestria360/` com `git diff --check`, `git diff` e `git status`; confirmar que não há código de migração incremental, backfill, SQLite, HTTP externo em transação/leitura, dados comerciais inventados ou alteração de contratos Microsoft 365/Licensing V2.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** não depende de implementação anterior; T001–T005 bloqueiam T007–T008.
- **Phase 2** depende do contrato de ambiente de T001–T005; T009 → T010–T016 pela ordem das FKs. T017–T020 dependem das oito migrations.
- **US1 (Phase 3)** depende de Phase 2; T021–T023 podem começar em paralelo, T024–T026 seguem seus testes, e T027 ocorre após T013/T024.
- **US2 (Phase 4)** depende de Phase 2 e deve preservar US1; T028, T030 e T031 podem começar em paralelo. T029 depende de T028; T032–T036 seguem os testes/inventário correspondentes; T037 depende de T028–T036.
- **US3 (Phase 5)** depende de Phase 1 e do baseline de Phase 2; T038–T039 podem seguir em paralelo, T040–T042 dependem do contrato CI/schema final.
- **Phase 6** depende de US1, US2 e US3 concluídas.

### User Story Dependencies

- **US1 (P1)**: depende apenas da fundação e é o MVP de dados confiáveis.
- **US2 (P1)**: depende do baseline e usa as mesmas garantias de schema; não depende da query de grupos de US1.
- **US3 (P2)**: o setup é pré-requisito de todas as histórias; os ajustes finais de CI/validação são a entrega independente desta história.

### Parallel Opportunities

- T002 e T006 podem avançar em paralelo após a referência de imagem de T001.
- As migrations T010–T016 exigem a ordem de dependências declarada e não devem ser paralelizadas no mesmo diretório.
- T021–T023, T028/T030/T031 e T038–T039 podem ser executadas em paralelo por responsáveis diferentes porque cobrem conjuntos de arquivos distintos.

## Implementation Strategy

### MVP First

1. Completar Phases 1 e 2, incluindo testes reais de schema.
2. Completar US1 e validar buscas, tipos, factories/seeders e integridade em PostgreSQL.
3. Parar no checkpoint de US1 antes de introduzir mudanças de sincronização.

### Incremental Delivery

1. Ambiente seguro + baseline → banco novo e invariantes verificáveis.
2. US1 → leituras e dados existentes confiáveis.
3. US2 → sincronização concorrente e publicação segura.
4. US3 → CI e reprodução em clone limpo.
5. Phase 6 → gates e evidências SC-001–SC-012.

## Notes

- Não há UI, telas, rotas ou contrato visual novos; revisão `qa_ux_ui` não é aplicável.
- Nenhuma task autoriza migração de dados, backfill, coleta contra tenant real, RBAC ou API pública nova.
- Toda task de teste deve executar em PostgreSQL 18 após a preparação explícita das variáveis de ambiente pelo executor local ou pelo `env:` do job no CI; mocks/fakes são permitidos apenas nas fronteiras Graph/Defender, nunca para provar lock de banco.
