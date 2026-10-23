# Data Model — Multi-tenancy Microsoft 365

## Control plane

| Entity | Key fields and invariants |
|---|---|
| `tenants` | UUID `id`; `kind` (`platform`/`customer`); name, slug, state and nullable write-once `activated_at` for customers. Exactly one `platform`, bootstrap/seeded with `admin@example.com` as active admin. Provisioning leaves a new customer inactive; the first valid `customer_bootstrap` acceptance sets `activated_at` permanently. |
| `tenant_memberships` | `tenant_id`, `user_id`, `role` (`admin`/`member`), `status` (`active`/`revoked`); unique `(tenant_id, user_id)`. It exists only after invitation acceptance (or platform bootstrap); only `active` memberships authorize access. In V1, at most one membership per user is active globally, enforced transactionally by normalized e-mail; the schema remains extensible for future multi-membership. Explicit access source; no domain-derived access. |
| `tenant_access_invitations` | Tenant, normalized recipient e-mail, independent `role` (`admin`/`member`) and `purpose` (`customer_bootstrap`/`access`), initiator, token hash for validation, encrypted recoverable issued token, status, sent/accepted/expired/revoked timestamps and revocation reason. No `user_id` is required before acceptance. A customer with `activated_at IS NULL` has at most one valid `pending` `customer_bootstrap`; it always has `role=admin`. The recoverable ciphertext exists only while `pending` and is deleted when that status ends. Single-use, 7-day expiry. Active or accepted recipient blocks a new V1 invitation; expired does not. |
| `control_plane_audit_events` | Platform/control-plane actor, action, target tenant/user/invitation, sanitized metadata, correlation and timestamps. Records provisioning, platform-admin invitations and platform administrative actions without RLS based on a customer tenant. |
| `microsoft_connection_attempts` | Customer tenant, initiating user, state hash, optional normalized `expected_microsoft_tenant_id` (Entra GUID), return path allowlist, expiry, consumption/status and sanitized correlation IDs. The expected ID is intent stored outside `state`; `NULL` means the `organizations` authority was used. |

Control-plane tables do not use RLS based on `app.current_tenant_id`; policies and opaque state govern their access. The encrypted issued token is readable only by the authorized invitation initiator while the invitation is `pending`; the hash remains the validation source and neither form is logged.

## Access status lifecycle

| Entity | Status | Condition and allowed transition |
|---|---|---|
| Invitation | `pending` | Created with the recipient e-mail, tenant and intended role; no `User` or membership exists yet. It can be accepted, explicitly revoked, or expire after seven days. |
| Invitation | `accepted` | The recipient accepted once and defined credentials. In the same transaction, create/reuse the `User`, create the `active` membership using invitation `role`, consume the token and, for `customer_bootstrap`, set customer `activated_at`. It is final; revoking future access changes the membership, not this invitation. |
| Invitation | `expired` | The pending invitation reached its seven-day TTL. It cannot authorize access and does not block a new V1 invitation. It remains `expired` permanently: a later invitation, including a `customer_bootstrap` reissue, creates a distinct `pending` record and does not rewrite this factual history. |
| Invitation | `revoked` | Final and hidden from the active invitation list. Reached only by an explicitly authorized cancellation while pending, retaining its factual revocation reason. A later invitation, including a permitted `customer_bootstrap` reissue, never changes it or any `expired` invitation. |
| Membership | `active` | Created only at invitation acceptance (or platform bootstrap), or restored from `revoked` by an authorized admin, and authorizes the scoped tenant access. |
| Membership | `revoked` | Access removal, reached through an explicit administrative cancellation. An authorized admin of the same customer or platform may restore it directly only when the user has no active membership in another tenant; the record ID, role and invitation history are preserved and `revoked_at` is cleared. Invitation expiry cannot revoke a membership because none exists before acceptance. |

## Customer data plane

| Entity | Key fields and invariants |
|---|---|
| `microsoft_connections` | Customer tenant only and protected by RLS; global unique `id` and candidate key `unique (tenant_id, id)`, plus global unique `microsoft_tenant_id`; at most one connection per customer; no connection for platform. State: pending consent, verifying, connected, consent required, revoked, error, disconnected. |
| `tenant_audit_events` | Customer tenant, optional actor, action/target, sanitized before/after, correlation and timestamps. |
| `tenant_governance_topics` | Customer instance of each global `governance_topic_definitions` record; unique `(tenant_id, definition_id)`. Platform receives none. |
| Existing M365 tables | Customer-scoped rows are born with internal UUID `tenant_id NOT NULL`, FK, tenant-first index and business unique where relevant. Add `microsoft_connection_id` only for direct connection provenance. It is `NOT NULL` when the fact cannot exist without a connection; otherwise its documented lifecycle justifies `NULL`. A row with both IDs references `(tenant_id, microsoft_connection_id)` to `microsoft_connections (tenant_id, id)`, preventing cross-tenant pairs; independent FKs are not equivalent. |

Every customer data-plane table has non-null `tenant_id`, tenant-first index, tenant-first business unique where relevant, and RLS `USING`/`WITH CHECK` policies. Runtime sets `app.current_tenant_id` only inside short authorized transactions.

## Relationships and lifecycle

```text
platform tenant --< memberships (admin provisions)
platform admin --< customer tenant --< memberships
                         |             ^
                         |             | invitation acceptance
                         +-- 0..1 microsoft connection --< sync cycles
                         +--< microsoft sync requests (control plane)
                         +--< tenant governance topics >-- global definitions
```

Customer provisioning atomically creates inactive tenant, `role=admin`/`purpose=customer_bootstrap` invitation and Governance topics. Public registration is disabled. Invitation acceptance defines credentials, consumes the invitation, creates the `active` initial `admin` membership and sets `activated_at` in one transaction; Microsoft consent does not affect activation. Disconnect stops future sync but historical data remains until a future explicit deletion workflow.

An active platform admin may recover bootstrap only for `customer` with `activated_at IS NULL`, no active admin membership and no valid pending `customer_bootstrap`: it may create a new pending bootstrap only after the prior invitation is `expired` or explicitly `revoked`. The earlier record and its terminal factual status remain unchanged; the new issuance and audit are atomic. `activated_at` is write-once, so later revocation of the first admin never reopens bootstrap.

`microsoft_sync_requests` is a control-plane dispatch ledger for every sync. It records the customer, connection, `origin` (`platform` or `routine`), nullable human initiator, the normalized routine options when applicable, lifecycle and optional cycle link. `origin=platform` always derives `--force`; no redundant request mode exists. The actual `operation_mode` remains exclusively on the RLS-protected sync cycle as factual execution state.
