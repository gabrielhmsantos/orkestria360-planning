# Quickstart: Validation of PostgreSQL 18 Migration

## Prerequisites

- PHP com `pdo_pgsql`/`pgsql`, Composer, Node e Docker/Compose.
- `.env` local com credenciais não versionadas de `orkestria360`.

## Local Bootstrap

1. Usar a referência imutável registrada no Compose: `postgres:18.4@sha256:4cc13dede823cab4e05290c7fb3350fb4e599ecabd9b07e6706b5d5e8f5bc929`.
2. Subir o serviço com `docker compose up -d` e aguardar `pg_isready` saudável. O Compose provisiona somente o banco operacional `orkestria360`.
3. Verificar se o banco local de testes já existe:

   ```bash
   docker compose exec postgres psql -U orkestria360 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'orkestria360_test'"
   ```

   Quando a consulta não retornar uma linha, criá-lo explicitamente com `docker compose exec postgres createdb -U orkestria360 orkestria360_test`. O Compose e a aplicação não criam bancos de teste.
4. Criar localmente, sem versionar, `.env.testing` como cópia de `.env.example`, com `APP_ENV=testing`, `APP_KEY` própria, `DB_CONNECTION=pgsql`, `DB_HOST=127.0.0.1`, `DB_PORT=5432`, `DB_USERNAME=orkestria360`, `DB_PASSWORD=orkestria360`, `DB_DATABASE=orkestria360_test`, `DB_URL=''` e `CACHE_STORE=database`. `phpunit.xml` não declara variáveis `DB_*` nem `CACHE_STORE`.
5. Cumprir o roteiro obrigatório abaixo antes de `php artisan migrate:fresh --env=testing --force`; depois da migração, executar factories/seeders e o gate padrão `composer ci:check` sem wrapper.

## Roteiro obrigatório antes de `migrate:fresh`

1. Parar se o alvo tiver dados não descartáveis, for produção, homologação ou instância compartilhada. O reset/recriação do volume precisa ser explícito.
2. Confirmar o alvo efetivo `host:porta:banco` do ambiente `testing`: ele deve ser o PostgreSQL 18 acessível, com credencial não produtiva, banco exatamente `orkestria360_test` e diferente de `orkestria360`.
3. Conferir as variáveis efetivas do processo e `phpunit.xml`: `APP_ENV=testing`, `APP_KEY` exclusiva de teste, `DB_CONNECTION=pgsql`, `DB_DATABASE=orkestria360_test`, `DB_URL=''` e `CACHE_STORE=database`; o PHPUnit não pode sobrescrever nenhuma delas. Confirme com `php artisan about --only=environment` e interrompa se o driver, conexão ou banco efetivos divergirem.
4. Executar `php artisan config:clear` e confirmar que `bootstrap/cache/config.php` está ausente. A `APP_KEY` de teste é fornecida pelo ambiente e não deve ser gravada ou incluída em commit.
5. Sem trocar ambiente ou conexão após essas verificações, executar `php artisan migrate:fresh --env=testing --force`.

## Reset

Parar o serviço, remover somente o volume nomeado do Compose (`docker compose down -v`) e subir novamente. O novo volume recria somente `orkestria360`; recrie `orkestria360_test` manualmente, se necessário. `POSTGRES_*` não reconfigura volume existente.

## Matriz de evidências (SC-001–SC-012)

Todos os comandos abaixo usam as variáveis explícitas do bootstrap e o banco
descartável `orkestria360_test`. A revalidação final executou o roteiro
obrigatório, `config:clear`, a ausência de `bootstrap/cache/config.php`,
`migrate:fresh`, dois `db:seed` consecutivos e os testes direcionados de banco,
queries e sincronização (199 testes, 3.362 assertions, aprovados).

| Critério | Comando / prova | Evidência |
| --- | --- | --- |
| SC-001 | roteiro obrigatório + `migrate:fresh --env=testing --force` | as oito migrations baseline criam a estrutura em PostgreSQL 18, sem SQLite |
| SC-002 | `PostgresIntegrityConstraintsTest` e `PostgresTypesAndIndexesTest` | FKs compostas, uniques, checks, nulidade, tipos e `RESTRICT` rejeitam escrita inválida |
| SC-003 | testes `Microsoft365`, `LicensingSyncTest` e `LicensingAuthorizationTest` com fakes | coleta, persistência, publicação e projeção local não fazem HTTP durante leitura |
| SC-004 | `DatabaseLockIntegrationTest`, `CoordinatedSyncTest` e testes Secure Score | disputa, rerun e colisão não duplicam dados nem cruzam tenant |
| SC-005 | validação manual registrada neste roteiro | configuração, scripts e fluxo de bootstrap não criam, selecionam nem dependem de `database/database.sqlite` |
| SC-006 | `composer ci:check` | lint, formatação, tipos, análise estática e suíte rodam contra PostgreSQL isolado |
| SC-007 | `PostgresBaselineSchemaTest` + mapa de baseline | cada linha do mapa é reconciliada com uma das oito migrations e sua prova aplicável |
| SC-008 | `composer ci:check`; workflow `tests.yml` | gate local e job remoto usam `pgsql`, service PostgreSQL e variáveis explícitas |
| SC-009 | `EXPLAIN (ANALYZE, BUFFERS)` registrado em `research.md` | decisão rastreável pelo B-tree de paginação; nenhum GIN especulativo foi incluído |
| SC-010 | `DatabaseLockIntegrationTest`, `SyncStageRecorderTest` e `CoordinatedSyncTest` | acquire, refresh, perda e release deixam cycle/stage/batch/generations em estado terminal |
| SC-011 | `migrate:fresh` + dois `db:seed --force`; `PostgresSeederAndFactoryTest` | migrations, factories e seeders passam em PostgreSQL vazio e o rerun é idempotente |
| SC-012 | testes `SecureScoreSynchronizationTest` e `SecureScorePublishedDataTest` | contadores de leitura, persistência, deduplicação, exclusão, tentativas e retry correspondem às ações persistidas |

## Safety Stops

- Dado não descartável: parar e abrir plano de exportação/importação separado.
- Não habilitar paralelo sem `CREATEDB` e `--parallel --recreate-databases`.
- Não adicionar GIN, migration incremental ou fallback SQLite para fazer gate passar.
