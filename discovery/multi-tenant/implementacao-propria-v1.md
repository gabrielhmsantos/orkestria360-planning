# Blueprint — implementação própria de multi-tenancy V1

## Decisão

O V1 implementa multi-tenancy como capacidade de plataforma própria, com contratos explícitos e limites verificáveis. Não adota `spatie/laravel-multitenancy` neste momento, mas preserva uma porta de substituição: a implementação concreta de contexto pode delegar ao package no futuro sem alterar synchronizers, domínio, schema ou contratos Graph.

Middleware, trait e global scope não são uma solução isolada; cada camada abaixo é obrigatória.

## Escopo V1

- Existe exatamente um tenant `platform`, criado por bootstrap/seed, e tenants `customer` provisionados pela plataforma. Apenas tenant `customer` pode ter zero ou uma `microsoft_connection` Graph; tenant `platform` não tem connection. Várias conexões por customer não são uma evolução prevista e o schema deve manter essa cardinalidade.
- Ciclos e eventos de auditoria registram `microsoft_connection_id`; locks, cache e idempotência usam tenant + connection.
- `microsoft_tenant_id` é único global: a mesma organização Microsoft não pode ser conectada a dois tenants internos. A unique no banco, lock/idempotência e resposta sanitizada resolvem inclusive tentativas concorrentes.

## Contratos obrigatórios

```php
interface CurrentTenant { public function require(): OrkestriaTenant; }
interface TenantAccessAuthorizer { public function authorize(User $user, OrkestriaTenant $tenant, string $ability): void; }
interface MicrosoftConnectionResolver { public function connectedFor(OrkestriaTenant $tenant): MicrosoftConnection; }
interface TenantExecutionRunner { public function run(OrkestriaTenant $tenant, Closure $operation): mixed; }
interface TenantConnectionSyncDispatcher { public function dispatch(string $tenantId, string $connectionId, SyncOperation $operation): void; }
interface MicrosoftConnectionVerifier { public function verify(MicrosoftConnectionAttempt $attempt, string $candidateMicrosoftTenantId): VerifiedMicrosoftOrganization; }
```

`tenants`, `tenant_memberships`, `tenant_access_invitations` e `microsoft_connection_attempts` formam o control plane e não usam RLS baseado em `app.current_tenant_id`; eles resolvem entrada, capacidade, convites e callback por `state`. Provisioning exige `tenant.kind=platform` e `membership.role=admin`; `admin` de customer não pode provisionar customer. `CurrentTenant` é binding Laravel `scoped`, nunca singleton. `require()` falha fora de execução autorizada; não há fallback `contoso` nem leitura de tenant global. O runner instala o contexto e o limpa em `finally`, inclusive em exceção. Resolver um tenant candidato não pode instalar `CurrentTenant` nem RLS: membership/capacidade é lida no control plane e deve ser provada antes. Resolvers são stateless; Graph client é transitório por operação/conexão.

## HTTP e onboarding

1. Seed cria somente `platform` com `admin@example.com` ativo. Provisioning cria customer inativo, convite `role=admin`/`purpose=customer_bootstrap` e temas Governance; não cria User/membership. `role` define capacidade e `purpose` lifecycle; admins adicionais são `admin/access`. Platform pode reemitir bootstrap apenas para customer com `activated_at=null`, sem admin ativo/pending válido e após convite anterior expired/revoked; a reemissão cria novo pending e preserva o status factual anterior. Aceite cria User/membership admin active e preenche `activated_at` write-once, sem depender de consentimento. Scheduler expira pending em 7 dias, apaga ciphertext e é idempotente. Customers surgem somente por provisioning e connections somente por onboarding normal.
2. O V1 não oferece seletor, troca, rota ou subdomínio de tenant; por isso o front opera um único tenant por vez, sem transformar essa limitação em constraint estrutural de memberships. Policy/Gate prova membership e capacidade antes de middleware abrir `CurrentTenant` ou RLS. O administrador do tenant `platform` só pode provisionar organizações no control plane; `admin` do tenant `customer` administra connection, configuração e memberships do próprio tenant; `member` mantém somente capacidades operacionais. Não há RBAC amplo nem package de roles.
3. Convites separam `role` de `purpose`: bootstrap é `admin/customer_bootstrap`; admins/members adicionais usam `access`. `pending` expira por scheduler idempotente com remoção de ciphertext; `customer_bootstrap` só reemite após expired/revoked e nunca após `activated_at`. Membership só é active após aceite e revoga explicitamente. Admin customer administra o próprio tenant e disconnect; platform só control plane. Fortify não oferece registro público e domínio/e-mail não autoriza acesso.
4. Consentimento cria tentativa vinculada a tenant e iniciador. `state` é opaco, hash-only, uso único, TTL curto e não logado; `return_path` é allowlist.
5. Callback resolve a tentativa por `state`, não por sessão/`CurrentTenant`; valida o membership `admin` persistido do iniciador antes de I/O credenciado. `MicrosoftConnectionVerifier`, separado da factory runtime, confirma connection `pending`/`verifying` por token app-only + `GET /organization` e promove a conexão somente se a unique global de `microsoft_tenant_id` permitir o vínculo.

## Jobs, scheduler e console

Scheduler enumera tenants `customer` ativos no control plane, sem `BYPASSRLS`, e abre runner com contexto RLS para cada tenant antes de descobrir suas conexões `connected` elegíveis e despachar `{tenant_id, microsoft_connection_id, operation}`. Handler recarrega ambas, confirma vínculo/estado e que o tenant é `customer`, abre runner, adquire lock pela dupla e cria Graph client. Laravel Context contém só IDs de correlação depois dessa validação.

O entry point continua `app:sync-microsoft365`: `--all-eligible` é exclusivo do scheduler; execução dirigida exige `--tenant` e `--connection`. Pruners seguem a mesma dupla. `routes/console.php` não pode resolver tenant durante a carga.

## Graph, consultas e escrita

`GraphClientFactory::forConnection()` aceita somente connection `connected` de tenant `customer`, valida vínculo, UUID Entra e credencial global e cria Kiota com authority da conexão e `.default`. `MicrosoftConnectionVerifier` é a única via de onboarding e pode validar tentativa/conexão `pending`/`verifying` de customer; ele obtém token e chama `/organization` sem reutilizar a factory runtime. Classificação de erro depende de etapa, HTTP status, código AADSTS/Graph e `Retry-After`; `401` ou `403` isolados não determinam estado. HTTP Graph nunca roda em transação e o token é opaco para a aplicação.

Trait `BelongsToTenant` e global scopes só aplicam `where tenant_id` a Eloquent. Não protegem `DB::table`, SQL raw, joins, bulk writes, inserts, relações, console ou jobs; esses caminhos exigem tenant explícito, constraints e testes. Bypass apenas por API administrativa nomeada, auditada e em transação curta.

Writes derivam tenant da unidade/ciclo validado, nunca da request, Context ou payload Graph. Toda tabela de fato de cliente nasce no baseline com `tenant_id UUID NOT NULL`, FK, índice iniciado por tenant e unique de negócio iniciada por tenant; relações filho→pai tenant-scoped provam o mesmo tenant por FK composta ou constraint equivalente. `microsoft_connection_id` só existe quando a provenance é direta e é `NOT NULL` se o fato não pode existir sem connection. Quando ambos os IDs existem, a filha referencia a chave candidata `microsoft_connections (tenant_id, id)` pela FK composta `(tenant_id, microsoft_connection_id)`; FKs separadas não bastam.

## RLS obrigatório

RLS protege todo tenant data plane desde a primeira implementação multi-tenant: `microsoft_connections`, Governance tenant-scoped, documentos/históricos e módulos Microsoft 365. `tenants`, `tenant_memberships`, `tenant_access_invitations`, `microsoft_connection_attempts` e o catálogo global são control/product plane e ficam fora dessa policy por `app.current_tenant_id`. A role de runtime é distinta da role de DDL/migration e não pode ser superuser, owner ou `BYPASSRLS`. Policies deny-by-default usam `USING` e `WITH CHECK`; aplicar `FORCE ROW LEVEL SECURITY` quando necessário. Depois de a capacidade ser provada no control plane, o runner abre transação curta, define `set_config('app.current_tenant_id', ..., true)` e executa somente as leituras/escritas protegidas. HTTP Graph nunca é envolvido na transação. Testes comprovam ausência de contexto, acesso cross-tenant por Eloquent/`DB::table`/SQL direto, reuso de worker e impossibilidade de bypass da role runtime.

Reavaliar Spatie apenas com requisito aprovado de troca de banco, filesystem/cache/config/URL/credencial por tenant, herança automática massiva em jobs/comandos ou crescimento de módulos/equipes. Antes: POC Laravel/Kiota, `composer require --dry-run`, mapa da porta `CurrentTenant` e prova de preservação de constraints/payload explícito.
