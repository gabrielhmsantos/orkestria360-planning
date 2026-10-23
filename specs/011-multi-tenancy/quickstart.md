# Validation Quickstart — Multi-tenancy Microsoft 365

## Prerequisites

- PostgreSQL 18 environment with separate DDL and runtime roles as described in [data-model.md](data-model.md).
- Global Microsoft client credential supplied by secret manager; no customer secret stored in the database.
- One test customer organization that can grant admin consent.

## Clean starting state

Run `migrate:fresh` followed by the official seed. The result must contain only the `platform` tenant, `admin@example.com`, and its `platform/admin/active` membership. It contains zero customers and zero Microsoft connections; no seed creates or cites `test@example.com`, and no runtime or seed depends on `MS_GRAPH_TENANT_ID`.

## Validation scenarios

1. Run `cd orkestria360 && APP_ENV=testing APP_KEY='base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' DB_CONNECTION=pgsql DB_DATABASE=orkestria360_test DB_URL='' CACHE_STORE=database php artisan migrate:fresh --seed`. Verify exactly the clean starting state above, including neither Graph connection nor customer Governance topics. The test database is exclusive: `composer test` and `composer ci:check` clean residual sessions in `orkestria360_test` and set its idle-transaction timeout to 60 seconds; they never touch `orkestria360`.
2. As platform admin, provision customer A. Verify one atomic inactive customer/`admin`+`customer_bootstrap` invitation/Governance result, a control-plane audit event, no customer user or membership before acceptance, and no public registration path.
3. Simulate e-mail delivery failure. Verify only the authorized initiator can retrieve the invitation URL from its encrypted recoverable token; accept once, define credentials and create the active membership atomically, reject replay, and verify expiry after seven days. Verify explicit cancellation revokes only a pending invitation, expiry creates no membership, and later issuance preserves an expired invitation as `expired` while creating a distinct pending invitation. Verify active or accepted e-mail blocks a second V1 invitation while an expired invitation does not.
4. Let A's `customer_bootstrap` invitation expire before acceptance, then reissue it as platform admin. Verify reissue is blocked while a valid pending bootstrap exists, allowed only after `expired`/explicit `revoked`, audited, and acceptance creates A's first active admin plus write-once `activated_at`. Verify a platform admin can never reissue bootstrap after activation.
5. Attempt reads/writes without tenant context through Eloquent, query builder and raw SQL. Verify RLS and constraints reject them.
6. Complete consent for A. Verify the connection is customer-scoped, Graph token authority is A's Microsoft tenant, and platform cannot connect. Repeat after selecting the standard authority (`organizations`), then with A's Entra Tenant ID GUID: the latter must redirect to `https://login.microsoftonline.com/{tenant-id}/adminconsent`, persist the expected ID outside the opaque `state`, and reject a callback whose candidate tenant differs. Verify a callback with provider error/cancel marks only its pending attempt as failed and a callback without valid state changes nothing.
7. As A's active customer admin, disconnect its connection and verify audit, `disconnected`, future ineligibility, revalidation/no write of an already dispatched job, and factual freshness with preserved history.
8. Run the applicable feature/database tests, frontend checks, then `cd orkestria360 && composer ci:check`.

## Evidência operacional registrada

Em 23/08/2026, a instância local PostgreSQL 18.4 registrou o cenário com uma organização customer: provisioning e convite bootstrap aceito, conexão Microsoft confirmada, uma solicitação `platform` com ciclo `force` concluído com alertas de cobertura do tenant e 20 etapas concluídas. A desconexão foi confirmada por `tenant_audit_events`; o estado final da conexão é `disconnected`, com histórico do último ciclo preservado.

Os gates frontend `npm run lint:check`, `npm run types:check` e `npm run build`, bem como a suíte `php artisan test` e `composer ci:check`, foram executados com sucesso.

## Escopo operacional aprovado

Por decisão operacional, este roteiro valida Graph com uma única organização customer. Esta validação é suficiente para a entrega da feature 011; a cobertura automatizada de RLS e cenários cross-tenant continua obrigatória.

See [control-plane.md](contracts/control-plane.md) for authorization/lifecycle expectations and [data-model.md](data-model.md) for storage invariants.
