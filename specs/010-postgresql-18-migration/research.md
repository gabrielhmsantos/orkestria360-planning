# Research: Migração PostgreSQL 18

## Decisions

### Baseline único e incompatível

**Decision**: substituir as 71 migrations pelo baseline de oito arquivos do mapa, executado somente via `migrate:fresh` em banco recriado.

**Rationale**: o histórico contém branches por engine, patches corretivos e rollback incompleto; não há requisito de migração de dados.

**Alternatives considered**: manter histórico e anexar migrations finais; rejeitada pois preserva incompatibilidades e não garante estado final.

### Tipos, constraints e relações PostgreSQL

**Decision**: `timestamptz` UTC, `date` civil, `jsonb` não criptografado, `text` para ciphertext, checks/`NOT NULL` e FKs compostas por tenant/ciclo com `RESTRICT` para histórico.

**Rationale**: preserva os invariantes explícitos dos insumos. Laravel 13 fornece `timestampTz`/`timestampsTz`; PostgreSQL normaliza JSONB e suporta FKs/ações de deleção compostas.

**Alternatives considered**: JSON para ciphertext, timestamp sem timezone e FKs simples; rejeitadas por semântica inválida, perda de UTC e risco de tenant cruzado.

### Lock, telemetria e colisões

**Decision**: lock coordenado por tenant no cache `database`; o ciclo é criado após obter exclusividade. O lock de Licenciamento permanece independente; unique violations recebem retry ou reconsulta delimitada e telemetria vem do resultado real de persistência.

**Rationale**: mocks não provam exclusividade compartilhada; `firstOrCreate`, `upsert` e revisões podem disputar chaves.

**Alternatives considered**: lock em memória ou ignorar unique violation; rejeitados por não oferecerem exclusividade nem estado determinístico.

#### Inventário de operações de persistência Microsoft 365 (T033)

| Área | Operações | Proteção/decisão |
|---|---|---|
| `Sync` | posições, batches, eventos e stages com `firstOrCreate`/`updateOrCreate` | O lock coordenado do tenant protege o ciclo; chaves únicas tornam o rerun idempotente. Eventos usam reconsulta após colisão, sem HTTP em transação. |
| `SecureScore` | snapshots/ciclos, source states, related snapshots, perfis/ciclos, publication/controls e `MAX(revision)+1` | Protegido pelo lock coordenado. `MAX(revision)+1` requer retry delimitado após unique violation; vínculos idempotentes devem reconsultar a linha vencedora. |
| `Groups` | `upsert` de grupos, estados e auditoria | Protegido pelo lock coordenado; o `upsert` usa a chave natural já única e a auditoria reconsulta em colisão. |
| `UsersAccounts` | snapshots, sinais, privilégios, MFA, risco, memberships e source states | Protegido pelo lock coordenado; as chaves naturais por tenant/geração permitem rerun. Colisão recebe reconsulta delimitada, sem nova coleta HTTP. |
| `Licensing` | run, SKU/configuração, snapshots, atribuições, oportunidades e source states | Topologia independente: lock `licensing:{tenant}:sync`; operações diárias são idempotentes pela chave tenant/ciclo ou tenant/SKU. Não compartilha nem toma o lock coordenado. |
| `Mfa` | políticas, posições, detecções e eventos de batch | Protegido pelo lock coordenado; posições e deduplicação de eventos reconsultam após colisão. |

**Decisão aplicável**: toda escrita de ciclo coordenado acontece após a leitura HTTP e dentro de operação curta; uma colisão de unique é tratada por reconsulta/retry único somente para obter a linha já persistida. Não há retry cego, nem HTTP dentro de transaction. O lock de Licenciamento permanece isolado por tenant.

### Índices JSONB

**Decision**: nesta entrega, avaliar somente a contenção `@>` de `directory_groups.group_types`; começar sem GIN e adicionar GIN/expressão apenas com ganho por `EXPLAIN (ANALYZE, BUFFERS)` em carga representativa. Outra consulta JSONB exige decisão explícita antes de entrar nesse critério.

**Rationale**: índice adicional tem custo de escrita e não deve ser especulativo.

**Matriz executada (2026-08-20)**: a fixture
`orkestria360/tests/Fixtures/directory-groups-jsonb.php` registra 3.000 grupos
na mesma geração: 900 `['Unified']` (30%), 600 `['Security']` (20%) e 1.500
arrays vazios (50%). Foi carregada no PostgreSQL 18.4 e consultada com:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id
FROM directory_groups
WHERE tenant_id = 'fixture-tenant'
  AND generation_id = '00000000-0000-4000-8000-000000000201'::uuid
  AND group_types @> '["Unified"]'::jsonb;
```

Antes do candidato, o plano usou `directory_groups_pagination_idx`, retornou
900 linhas e levou 0,781 ms. Após criar temporariamente
`CREATE INDEX directory_groups_group_types_gin_candidate ON directory_groups
USING gin (group_types)`, o planejador continuou no índice B-tree de tenant e
paginação (`directory_groups_pagination_idx`); a execução foi 0,763 ms. O
candidato foi removido com `DROP INDEX`.

**Decisão**: não adicionar GIN ao baseline. Na carga/filtro representativos o
ganho não foi material e o plano usa o B-tree existente de tenant/paginação,
filtrando a geração e a contenção JSONB; um GIN passa a exigir nova matriz que
demonstre ganho necessário.

### Local, testes e CI

**Decision (superseded)**: a decisão de Compose com init de dois bancos foi substituída na remediação do PR #9. O único Compose local provisiona `orkestria360`; `orkestria360_test` é criado manualmente quando ausente. PHPUnit/CI continuam usando exclusivamente `orkestria360_test`. `.env.testing` não é versionado nem obrigatório, mas pode ser mantido localmente como cópia de `.env.example` com credenciais do banco de teste. No CI, o service PostgreSQL e o `env:` do job são a fonte de verdade; o job executa `migrate` em banco vazio e preserva a composição atual de build, análise estática e testes.

**Rationale**: o estado atual usa SQLite e não prova a semântica oficial.

**Environment decision**: `.env.testing` não é versionado nem requerido. Localmente, o executor pode copiá-lo de `.env.example` e definir `APP_ENV=testing`, `APP_KEY` própria, host, porta, database, usuário, senha, `DB_URL=''` e `CACHE_STORE=database`; `phpunit.xml` não fixa `DB_*` nem `CACHE_STORE`, evitando sobrepor essas variáveis ou o `env:` do job. O bootstrap local executa `php artisan config:clear` e verifica que não há `bootstrap/cache/config.php`. Antes de uma migração destrutiva local, o executor segue o roteiro versionado no quickstart para conferir driver `pgsql`, `DB_URL` vazio, alvo efetivo `orkestria360_test`, `APP_KEY` e conexão. No CI, service e `env:` do job explicitam conexão e `CACHE_STORE=database`; `php artisan key:generate` grava a chave no `.env` efêmero, `migrate` prova o bootstrap em banco vazio e uma guarda de infraestrutura confirma que a suíte usa `pgsql` e o lock real de banco. A composição remota atual é preservada; o gate local é `composer ci:check`, sem wrapper nem comando auxiliar.

**Residual risk accepted**: sem um comando próprio, a confirmação local do alvo é procedimental e auditável pelo roteiro, não uma rejeição automática em runtime. O roteiro não é dispensável; CI permanece protegido pela configuração declarativa de serviço, credenciais e sequência de bootstrap.

### CI least privilege

**Decision**: manter actions SHA-pinadas e reduzir o workflow de lint para `contents: read`.

**Rationale**: lint não publica commit/release e não precisa de permissão de escrita; a mudança atende o hardening previsto sem ampliar escopo.

## Official Evidence Consulted

- Laravel 13 migrations: `timestampTz`/`timestampsTz` e FKs nomeadas.
- Laravel 13 database testing: `RefreshDatabase` para isolamento por teste.
- PostgreSQL 18: JSONB normaliza ordem/espaçamento; constraints e FKs aplicam integridade; GIN atende consultas JSONB.
- GitHub Actions: service PostgreSQL em Linux usa healthcheck, portas e ambiente explícito.

## Deferred Execution Choices

- Resolver a tag menor/digest da imagem oficial e registrá-los como referência imutável no Compose antes da implementação.
- Habilitar testes paralelos apenas após validar `CREATEDB` e `--parallel --recreate-databases`.
