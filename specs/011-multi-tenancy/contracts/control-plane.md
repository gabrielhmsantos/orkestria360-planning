# Control-plane Contract

## Authorization rules

| Operation | Required authority | Result |
|---|---|---|
| Provision customer | `active` `admin` membership in the unique `platform` tenant | Atomically creates inactive customer, its `role=admin`/`purpose=customer_bootstrap` invitation and customer Governance topics; records a control-plane audit event. The `User`, `active` `admin` membership and `activated_at` are created only on invitation acceptance. |
| Recover customer bootstrap | `active` `admin` membership in `platform`; target is `customer` with `activated_at IS NULL`, no `active` admin and no valid pending bootstrap invitation | May issue a replacement `role=admin`/`purpose=customer_bootstrap` only after the previous bootstrap invitation is `expired` or explicitly `revoked`. The authority ends permanently on the first valid bootstrap acceptance; each reissue is audited. |
| Invite platform admin | `admin` membership in `platform` | Creates a platform-admin invitation. |
| Invite customer user | `admin` membership in that customer | Creates an invitation scoped to that customer only. |
| Reactivate platform admin | `admin` membership in `platform` | Restores a revoked platform-admin membership directly when that person has no active membership in another tenant; preserves role and membership identity and records control-plane audit. |
| Reactivate customer user | `admin` membership in that customer | Restores a revoked membership in that customer directly when that person has no active membership in another tenant; preserves role and membership identity and records tenant-scoped audit. |
| Start/stop Graph connection | `admin` membership in that customer | Allowed only for `customer`; platform is rejected. |
| Request Microsoft sync | `active` `admin` membership in `platform`; target has connected customer connection | Creates a `platform` request, which derives `--force`, records control-plane audit and exposes only sanitized aggregate execution diagnostics. |

No public registration, domain matching or request tenant ID grants authority. Fortify registration and the public sign-up entry are disabled; invitation acceptance is the only public-facing account activation endpoint.

## Invitation lifecycle

| Status | Condition and transition |
|---|---|
| `pending` | Active for seven days. It has a recipient e-mail but no `User` or membership. It may become `accepted`, `expired`, or `revoked` by explicit cancellation. Delivery is an independent, optional result: failure never deactivates the invitation. |
| `accepted` | Final. Acceptance defines credentials, creates/reuses the `User`, creates the `active` membership and consumes the token atomically. A future access removal revokes the membership, not this invitation. |
| `expired` | Terminal for authorization and no longer blocks a new V1 invitation. It remains `expired`: another invitation, including bootstrap reissue, creates a distinct pending record and never alters this factual terminal status. |
| `revoked` | Final and omitted from the active-invitation UI. It is reached only through explicit authorized cancellation of a pending invitation and retains its factual reason; it is never caused by another pending, accepted or reissued invitation. |

`role` grants capacity after acceptance and `purpose` controls lifecycle: bootstrap is only `role=admin`/`purpose=customer_bootstrap`; every additional admin or member invitation is `purpose=access`. For `customer_bootstrap`, platform may reissue only for inactive customer after prior `expired`/explicitly `revoked` invitation; a valid pending bootstrap blocks new emission. Reissue creates a new pending invitation, preserving every earlier invitation and its factual `expired` or explicitly revoked status. Its acceptance transaction creates/reuses the User, creates active admin membership and sets write-once `activated_at`, permanently closing the exception. The issued token is stored as a one-way hash for validation and an application-encrypted recoverable value solely to re-display the original URL to its authorized initiator while pending; delete that ciphertext as part of every transition out of `pending`. Replays, expired tokens and tokens for a mismatched recipient are rejected. URLs, raw tokens and encrypted values are excluded from logs. A membership has only `active` and `revoked` states: it is created active at acceptance (or platform bootstrap), can be revoked through explicit access cancellation and can be reactivated directly by the authorized admin of its tenant; reactivation requires no active membership in another tenant and retains its ID, role and invitation history.

## Control-plane audit

`control_plane_audit_events` records platform provisioning, invitations, membership activation and administrative changes. Customer operational audit remains in `tenant_audit_events`; platform events never rely on customer RLS context.

## Microsoft connection lifecycle

`pending_consent` → `verifying` → `connected`; factual transitions also include `consent_required`, `revoked`, `error`, and `disconnected`. Only active customer admin may disconnect: it audits, marks `disconnected`, stops future eligibility and preserves history/freshness; dispatched jobs revalidate before writes. Platform is rejected. Before consent, the admin selects `organizations` or provides a normalized Entra Tenant ID GUID persisted as optional `expected_microsoft_tenant_id` on the attempt, never in `state`. Callback consumes state once, verifies initiator is still customer admin and, when an expected ID exists, requires equality with the callback candidate before Graph I/O; it then proves that candidate via Microsoft Graph organization before connection promotion. Error/cancel callbacks fail only their pending correlated attempt; a global collision on Microsoft tenant ID is sanitized.

Every sync starts as a `microsoft_sync_requests` control-plane record. The scheduler creates `routine` requests (with no human actor); a platform admin creates `platform` requests, which always derive `--force`. The request stores no redundant execution mode: the factual `operation_mode` is recorded only on the customer RLS cycle. The job consumes the request, receives its explicit tenant/connection IDs, revalidates under customer RLS and persists operational data there; the platform sees only the five most recent request/cycle projections with state, timestamps, aggregate counters, coverage and sanitized reasons.
