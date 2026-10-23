# Research — Multi-tenancy Microsoft 365

## Decisions

### Tenant types and controlled provisioning

**Decision**: Model `tenants.kind` as `platform` or `customer`. Seed only platform/admin@example.com. Platform admin provisions inactive customer, `role=admin`/`purpose=customer_bootstrap` invitation and Governance atomically; acceptance creates User/membership and write-once `activated_at`.

**Rationale**: `admin` alone is insufficient because customer admins also use that role. The tenant kind makes the control-plane authority explicit without granting platform users operational access to customer data.

**Alternatives considered**: Public/self-service tenant creation and e-mail-domain discovery were rejected. A global role outside the tenant model was rejected in favor of the platform tenant requested for future evolution.

### Memberships and invitations

**Decision**: Keep only `unique (tenant_id, user_id)`. `role` (`admin`/`member`) and `purpose` (`customer_bootstrap`/`access`) are independent. Bootstrap is only admin/customer_bootstrap; all additional admin invitations are admin/access. An idempotent scheduled command expires pending invitation after seven days and deletes recoverable ciphertext.

**Rationale**: This closes self-service access while preserving a reversible future path.

**Alternatives considered**: A global unique user-to-tenant constraint would block future product evolution; public registration and domain-based membership violate the approved closed-product boundary.

### Isolation and RLS

**Decision**: Use an explicit scoped `CurrentTenant` only after control-plane authorization, plus transaction-local PostgreSQL RLS for every customer data-plane table. Runtime database role must not own tables, be superuser or have `BYPASSRLS`.

**Rationale**: Laravel scoped bindings are flushed per request/job lifecycle, while policies/gates handle user authority. RLS protects query-builder, raw SQL, jobs and worker reuse that ORM scopes cannot secure alone.

**Alternatives considered**: Middleware or Eloquent global scopes alone are insufficient. Spatie tenancy is deferred because explicit tenant+connection synchronization is the required boundary.

### Microsoft Graph onboarding and runtime

**Decision**: A customer has zero or one Graph connection; platform has none. Runtime accepts only a connected customer connection, obtains a client-credentials token against that connection's tenant authority with `.default`, and never uses a global runtime tenant. Admin-consent callback validates opaque state and initiator membership, then verifies the candidate through `/organization` before promotion.

**Rationale**: Microsoft Graph documents client credentials against `{tenant}` with `.default`; Laravel supports scoped request/job bindings and policies/gates for the complementary application boundary.

**Alternatives considered**: One app registration per customer, delegated permissions, generic token authority, and token-claim decoding were rejected.

### Synchronization and clean rollout

**Decision**: Scheduler enumerates only active customer tenants and dispatches explicit `{tenant_id, microsoft_connection_id}` units. The supported rollout is a fresh deployment: current environments are disposable, `migrate:fresh` reaches the final schema, and new customers and connections arise only from provisioning and onboarding.

**Rationale**: Explicit payloads, locks, cache keys and idempotency by tenant+connection prevent cross-customer worker leakage. Upgrade in-place and preservation or import of earlier single-tenant data are outside this feature.

**Baseline decision**: Existing domain baseline migrations are edited in place after a new tenancy/connections foundation, so customer-scoped tables are created directly with final UUID keys, FKs, indexes and connection provenance. `microsoft_connection_id` is added only where provenance is direct; when paired with `tenant_id`, a composite FK targets `microsoft_connections (tenant_id, id)`.

**Alternatives considered**: Resolving tenant during route/console loading was rejected in favor of explicit tenant+connection execution units. Creating a baseline table with a string tenant key and converting it immediately in a later migration was rejected: it adds DDL ordering and maintenance without preserving any deployed data.
