# Implementation Plan: Multi-tenancy Microsoft 365

**Branch**: `feat/011-multi-tenancy` | **Date**: 2026-08-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification and [discovery/multi-tenant](../../discovery/multi-tenant/)

## Summary

Transform the single-organization application into a controlled multi-tenant platform. Seed creates only platform/admin@example.com; platform admins provision inactive customers and `admin/customer_bootstrap` invitations, whose acceptance sets write-once `activated_at`. Customer data is isolated by explicit tenant context, database constraints and PostgreSQL RLS; Microsoft Graph uses one optional, verified connection per customer and never connects the platform tenant.

## Technical Context

**Language/Version**: PHP ^8.3, TypeScript, Laravel 13, Inertia/React

**Primary Dependencies**: Laravel Fortify, Kiota Microsoft Graph client, PostgreSQL 18, Tailwind/shadcn UI

**Storage**: PostgreSQL 18; control plane, tenant data plane under RLS, and global Governance catalog

**Testing**: PHPUnit feature/integration tests, PostgreSQL schema/RLS policy tests, frontend type/lint/build gates. The CI database validates schema and policy behavior; production runtime-role provisioning is a deploy control.

**Target Platform**: Linux web and queue workers

**Project Type**: Laravel web application with Inertia SPA and scheduled Microsoft 365 synchronization

**Performance Goals**: Customer sync failures never block eligible customers; all tenant-scoped reads/writes remain isolated in two-customer integration scenarios.

**Constraints**: One `platform` tenant; V1 UI operates one tenant at a time; Fortify public registration and the sign-up entry are disabled; invitation acceptance is the only account-creation flow; invitation expiry 7 days; one optional Graph connection per customer; no client secrets in database; Graph calls outside database transactions. A aplicação consome a credencial via secret manager; rotação e monitoramento de expiração são dependência operacional externa, com owner e evidência de conformidade definidos pela infraestrutura.

**Scale/Scope**: Existing Governance and Microsoft 365 modules, all sync jobs/commands/scheduler paths, user provisioning/invitations, and a fresh deployment that reaches the final multi-tenant schema directly from an empty PostgreSQL 18 database.

**Rollout**: Current environments are disposable. `migrate:fresh` must create the final control plane, global catalog and customer data plane with its FKs, constraints and RLS policies; the official seed then creates only `platform`, `admin@example.com`, and its active admin membership. The versioned Compose init accelerates bootstrap of the runtime role in a fresh cluster; deploy infrastructure supplies the equivalent production credential, ownership separation and evidence. The functional CI workflow does not provision the production role topology. Baseline migrations are mutable: create the tenancy/connections foundation after Laravel core and before domain baselines, then edit each affected domain baseline to create its final UUID `tenant_id`, FK, tenant-first indexes/uniques and required same-tenant relations directly. New migrations are only for genuinely new structures or invariants outside a table's natural baseline definition; no conversion, expand, alter-type, backfill, rekey or generic loop may correct a table created earlier in the same fresh run. `microsoft_connections` is created early only for FK order and remains customer data plane under RLS. Where direct connection provenance is required, `microsoft_connection_id` has contract-defined nullability and, with `tenant_id`, uses a composite FK to the intentional candidate key `(tenant_id, id)` on `microsoft_connections`; two independent FKs are insufficient.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-design gate: PASS.**

- Laravel conventions remain primary: use framework migrations, policies/gates, scoped bindings, notifications and queues; do not add Spatie tenancy or permission packages.
- UX impact is limited to the approved provisioning/invitation and connection states; existing shell/module states must stay consistent.
- Full-stack security/data behavior has explicit verification: PostgreSQL RLS, constraints, authorization, Graph mock integration and `composer ci:check` before delivery; neste projeto, esse script já executa `@test` (`php artisan test`), portanto não há gate duplicado de `composer test`.
- The only complexity beyond a simple global scope is justified: control plane plus RLS, explicit connection payloads and a separate Graph verifier are required to prevent cross-tenant data access and unsafe consent promotion.
- As seis telas da representação estrutural aprovada em `discovery/multi-tenant/representacao-estrutural-telas.md` — aceite, organizações, detalhe de organização, conexão, membros/convites e identificação passiva do shell — são rastreadas por histórias independentes, com os nomes exatos dos cards preservados em spec e tasks.
- A diferenciação `platform admin`/`customer admin`/`member` é a exceção de multi-tenancy aprovada na Constituição 2.4.0; não introduz framework genérico de RBAC nem acesso operacional do platform a customers.

| Story | Superfície | Cards implementados |
|---|---|---|
| US1 | Aceitar convite | `Aceitar convite — formulário de credenciais` |
| US2 | Organizações | `Organizações — cabeçalho de página`; `Provisionar organização — ação de criação`; `Lista de organizações — tabela operacional` |
| US3 | Organização | `Organização — cabeçalho de detalhe`; `Situação da organização — status factual`; `Convite de bootstrap do customer — card operacional`; `Sincronização Microsoft 365 — tabela operacional` |
| US4 | Conexão Microsoft 365 | `Conexão Microsoft 365 — cabeçalho de página`; `Conexão Microsoft 365 — card de conexão`; `Disponibilidade dos dados Microsoft 365 — painel de disponibilidade` |
| US5 | Usuários | `Usuários — cabeçalho de página`; `Convidar pessoa — ação de criação`; `Usuários — tabela operacional`; `Convites pendentes — tabela operacional` |
| US6 | Organização atual — identificação passiva | `Organização atual — identificação passiva` |
| US7 | Usuários | `Usuários — cabeçalho de página`; `Convidar administrador da plataforma — ação de criação`; `Usuários — tabela operacional`; `Convites pendentes da plataforma — tabela operacional` |

## Project Structure

### Documentation (this feature)

```text
specs/011-multi-tenancy/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)
```text
orkestria360/
├── app/
│   ├── Actions/Fortify/          # invitation acceptance and closed registration flow
│   ├── Console/Commands/         # explicit tenant+connection operations
│   ├── Http/{Controllers,Middleware}/
│   ├── Models/                   # tenants, memberships, invitations, connections
│   ├── Providers/                # scoped tenant context and authorization bindings
│   ├── Services/Microsoft365/    # connection-aware synchronization
│   └── Support/Microsoft365/     # Graph factory and onboarding verifier
├── config/                       # Fortify, Graph, database, mail and queue configuration
├── database/{factories,migrations,seeders}/
├── resources/js/{components,pages}/
├── routes/
└── tests/{Feature,Unit}/
```

**Structure Decision**: Use the existing Laravel/Inertia application under `orkestria360/`; planning artifacts remain in this root repository. New tenant concerns belong in conventional Laravel models, migrations, policies, middleware, actions and services rather than a parallel application or package.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| RLS + explicit tenant runner | ORM scopes cannot protect raw SQL, workers or bulk writes | Global scopes/middleware alone do not provide a database isolation boundary |
| Control plane outside tenant RLS | Membership, invitation and callback must resolve before authorized tenant context exists | Applying `app.current_tenant_id` to these tables would block secure onboarding and callback validation |

## Constitution Check — Post-design

**PASS.** The design retains Laravel-native patterns, scopes data isolation through explicit contracts plus RLS, and applies only the Constitution 2.4.0 exception of `platform admin`/`customer admin`/`member`, without a reusable RBAC framework or platform access to customer operations. `composer ci:check` includes `@test`/`php artisan test` and is the documented full-flow gate. The application consumes the integration credential through a secret manager; credential rotation and expiry monitoring remain an external operational dependency with owner/evidence supplied by infrastructure. Invitation validation uses only a token hash; while an invitation is `pending`, its original issued token is additionally retained as application-encrypted ciphertext solely so the authorized initiator can recover the URL, and that ciphertext is deleted as soon as the invitation leaves `pending`. The `platform`/`customer` distinction is the minimum approved complexity needed to separate provisioning authority from customer operations.
