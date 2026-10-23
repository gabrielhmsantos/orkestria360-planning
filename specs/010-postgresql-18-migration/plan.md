# Implementation Plan: Migração PostgreSQL 18

**Branch**: `feat/010-postgresql-18-migration` | **Date**: 2026-08-17 | **Spec**: [spec.md](./spec.md)

## Summary

Substituir a cadeia histórica de 71 migrations por um baseline PostgreSQL 18 de oito migrations por domínio, tornar PostgreSQL o único banco de desenvolvimento, testes e CI, e corrigir consultas, persistência concorrente e ambientes que hoje dependem de SQLite. A entrega não migra dados legados nem altera contratos Microsoft 365/Licenciamento V2.

## Technical Context

**Language/Version**: PHP 8.3+, Laravel 13.7; PHP 8.3–8.5 na matriz CI.

**Primary Dependencies**: Laravel migrations/query builder/cache locks, PHPUnit 12, PostgreSQL 18, Docker Compose e GitHub Actions.

**Storage**: PostgreSQL 18 exclusivamente; `jsonb` para documentos estruturados não criptografados, `text` para ciphertext, `timestamptz` UTC para instantes e `date` para datas civis.

**Testing**: PHPUnit com `RefreshDatabase`, testes de integração PostgreSQL, migrations fresh, testes de schema/concorrência e gate `composer ci:check`, que inclui a suíte PHP.

**Target Platform**: aplicação Laravel monolítica em Linux, Compose local e GitHub Actions Linux.

**Project Type**: aplicação web monolítica com sincronização Microsoft 365 existente.

**Performance Goals**: validar a contenção JSONB `@>` de `directory_groups.group_types` com `EXPLAIN (ANALYZE, BUFFERS)` antes de introduzir GIN/índice de expressão; paginação de grupos estável para nulos e datas repetidas.

**Constraints**: baseline incompatível sem backfill; `migrate:fresh` apenas sobre banco/volume recriado; sem SQLite; HTTP externo fora de transações; lock compartilhado no cache `database`; CI usa somente credenciais de teste.

**Scale/Scope**: oito migrations baseline, todos os domínios persistentes atuais, Compose local para `orkestria360`, banco local de teste `orkestria360_test` provisionado manualmente e uma base exclusiva no CI; paralelismo inicialmente desativado.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Antes da pesquisa

- Laravel convencional: consolidar schema em migrations Laravel por domínio e usar query builder/cache lock existentes; SQL explícito só para invariantes não expressos pelo builder.
- UX consistente: não há superfície nova; os contratos de projeção e disponibilidade existentes permanecem inalterados.
- Qualidade verificável: `migrate:fresh`, constraints diretas, lock real, regressões de query e gates completos em PostgreSQL.
- POC controlado: sem migração de dados, RBAC, API nova ou HTTP contra tenant real para validação.
- Simplicidade: oito baselines evitam patches por engine; GIN só entra se medição justificar.
- Rastreabilidade de telas: não aplicável; não há tela, aba ou subpágina.
- Audiência única: sem alteração de acesso.

**Resultado antes da pesquisa**: aprovado.

### Após o design

As decisões preservam os princípios: nenhuma abstração ou superfície nova, contratos Microsoft 365 preservados, gates mensuráveis e riscos de banco contidos por constraints/testes.

**Resultado após o design**: aprovado.

## Project Structure

### Documentation (this feature)

```text
specs/010-postgresql-18-migration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/database-and-sync-compat.md
```

### Source Code (repository root)
```text
orkestria360/
├── config/database.php
├── database/{migrations,factories,seeders}/
├── docker-compose.yml
├── app/{Models,Services/Microsoft365}/
├── tests/Feature/
├── phpunit.xml
├── .env.example
└── .github/workflows/tests.yml
```

**Structure Decision**: todo código permanece em `orkestria360/`; os artefatos desta feature apenas documentam a execução.

## Delivery Plan

### Phase 1 — Baseline e integridade de schema

1. Inventariar cada tabela/cast/índice contra o Mapa obrigatório (referência histórica não disponível neste escopo) e substituir `database/migrations/` pelos oito baselines na ordem definida.
2. Consolidar estado final sem branches SQLite/MySQL/MariaDB, `after()`, rebuild, backfill, troca temporária de unique ou limites históricos sem justificativa de domínio.
3. Declarar nomes explícitos (≤63 bytes), checks/`NOT NULL`, índices compostos e validação UTF-8. A cadeia baseline incompatível não promete rollback; migration posterior só expõe reversão quando sua condição segura estiver documentada.
4. Modelar `microsoft365_sync_cycles` com id técnico identity + UUID `cycle_id` e unique `(tenant_id, cycle_id)`. `microsoft365_sync_stages` mantém FK direta ao id técnico com `RESTRICT`; batches e filhos Secure Score que representam execução usam `tenant_id` + UUID `sync_cycle_id` e FK composta/`RESTRICT`, mantendo `sync_stage_id` técnico quando aplicável. Posições, retenção e source states sem ciclo preservam suas chaves sem novo acoplamento.
5. Aplicar `numeric(12,4)` para scores, `numeric(5,2)` para meta, checks de meta/fonte/contadores, `timestamptz` UTC, `date` civil, `jsonb` e `text` correto para ciphertext.

**Gate**: PostgreSQL vazio executa `migrate:fresh`; cada linha do mapa tem evidência de schema, constraint/índice/query; inserts inválidos, tenant cruzado e delete histórico falham.

### Phase 2 — Aplicação, queries e sincronização

1. Corrigir booleano PostgreSQL e `DirectoryGroupsQuery`: `ILIKE` com binding, `ASC NULLS FIRST`/`DESC NULLS LAST` e `id` como desempate via whitelist.
2. Auditar `firstOrCreate`, `updateOrCreate`, `upsert` e revisão; usar lock coordenado por tenant ou retry/reconsulta delimitada após unique violation, com métricas factuais. O lock de Licenciamento mantém a topologia independente atual.
3. Validar `Cache::lock` coordenado por tenant no store `database`: aquisição concorrente, refresh, perda, release e finalização de cycle/stage/batch/generation ativos com razão sanitizada e horário terminal.
4. Manter checksum Secure Score calculado no payload canônico antes do JSONB e preservar publicação/frescor/fallback Licensing sem HTTP externo em transação ou projeção, inclusive a primeira falha sem publicação anterior: source state factual, sem fabricar publicação, dado comercial vazio ou zero.

**Gate**: regressões de booleano, ciphertext, JSONB, UTC/offset, busca/paginação, lock real, rerun/concorrência, telemetria e ausência de HTTP.

### Phase 3 — Ambiente local e testes

1. Adicionar o único Compose PostgreSQL 18 com referência imutável `postgres:18.<menor>@sha256:<digest>` resolvida da imagem oficial e registrada no arquivo versionado, volume `/var/lib/postgresql` e healthcheck para `orkestria360`. O banco local `orkestria360_test` é criado manualmente, após verificação de existência, e nunca por Compose ou aplicação.
2. Alinhar fallback `pgsql`, `.env.example`, Composer/setup, `DB_*`, `DB_SSLMODE` e `DB_URL`; remover SQLite.
3. Não versionar nem exigir `.env.testing`; o executor pode mantê-lo localmente como cópia de `.env.example`, com `APP_ENV=testing`, `APP_KEY` própria e `DB_*` de `orkestria360_test`. `phpunit.xml` não declara `DB_CONNECTION`, `DB_DATABASE`, `DB_URL` ou `CACHE_STORE`. No bootstrap local, executar `php artisan config:clear` e confirmar ausência de `bootstrap/cache/config.php`. Documentar no quickstart o roteiro obrigatório antes de cada `migrate:fresh --env=testing`: confirmar alvo descartável e efetivo, `APP_KEY`, driver `pgsql`, `DB_URL=''`, conexão acessível e banco `orkestria360_test` distinto do app. PHPUnit e os gates locais usam diretamente os comandos Composer padrão.
4. Executar migrations, factories e seeders em PostgreSQL; provar idempotência de seeders. Reset recria somente `orkestria360`; o executor recria `orkestria360_test` manualmente quando necessário. Paralelismo permanece desativado.

**Gate**: clone limpo sobe, migra, semeia e inicia sem SQLite; testes não tocam o banco de desenvolvimento.

### Phase 4 — CI e homologação

1. Configurar service PostgreSQL 18 com referência imutável `postgres:18.<menor>@sha256:<digest>`, healthcheck `pg_isready`, porta, credenciais exclusivas e banco `orkestria360_test`. Declarar no `env:` do job `APP_ENV=testing`, `DB_*`, `DB_URL=''` e `CACHE_STORE=database`, habilitar `pdo_pgsql`/`pgsql`, gerar a chave no `.env` efêmero do workspace e rodar `php artisan migrate --env=testing --force`. O Actions não depende de `.env.testing` nem de arquivo de ambiente de teste.
2. Remover `touch database/database.sqlite` e as declarações `DB_*`/`CACHE_STORE=array` no `phpunit.xml`; preservar a composição atual de build, `composer types:check` e `php artisan test`. Adicionar guarda de infraestrutura que confirma driver `pgsql`, banco `orkestria360_test` e store `database` antes da suíte tocar dados. Manter actions pinadas por SHA e reduzir `lint.yml` para `contents: read`, pois não publica alterações.
3. Homologar `migrate:fresh`, schema, seeders, sync fake, lock e `EXPLAIN`; GIN/expressão só se medição justificar.
4. Rodar `composer ci:check` e o workflow remoto com sua composição atual; registrar evidências SC-001–SC-012.

**Gate**: CI saudável, sem secret produtivo/SQLite, com todos os critérios da spec evidenciados.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Reescrever toda a cadeia de migrations | o histórico é incompatível e contém patches por engine/rollback incompleto | acrescentar migrations preservaria caminhos SQLite e não provaria schema final |
