# Princípios do Orkestria 360

## Core Principles

### I. Approved Intent and Artifact Integrity
Approved feature requirements, decisions, contracts, and acceptance criteria MUST remain the intent against which implementation is evaluated. They MUST NOT be silently weakened to accommodate existing code, technical difficulty, implementer preference, or a failed gate. Existing code is evidence and context, not a silent replacement for an approved product or architectural decision.

When a material product or architectural change is necessary, the corresponding authoritative artifact MUST be explicitly amended through its applicable governance workflow before implementation relies on it. Specifications, plans, research, and contracts MUST NOT be retroactively changed merely to justify produced code. Implementation MUST converge on approved intent unless that intent has been explicitly amended.

Rationale: Separating approved intent, implementation evidence, and explicit amendment makes delivery accountable without treating current implementation as the source of product truth.

### II. Canonical Architecture and Simplicity
Implementation MUST prefer the established canonical architecture, adopted framework conventions, and shared implementations that safely meet the current need. A parallel abstraction or local competing boundary MUST NOT be introduced when an existing canonical boundary can be extended safely.

New architectural complexity MUST solve a concrete present problem and be justifiable against a simpler alternative. Speculative abstractions, configuration surfaces, and capabilities for hypothetical future needs MUST NOT be built.

Rationale: Extending proven boundaries and demanding a present justification for complexity preserves maintainability while avoiding premature platform design.

### III. Data Truth and Explicit Availability
Domain facts and derived values MUST remain factual. Semantically distinct states MUST NOT be collapsed where the domain distinguishes them, including factual zero, factual empty, not collected, unavailable, restricted, partial, stale, failed, and not yet published. Absence or failure of evidence MUST NOT appear as success, healthy, compliant, empty, or zero.

Metrics, labels, percentages, classifications, and decisions MUST describe the factual population, period, coverage, and source state actually used. Domain data MUST NOT be fabricated to complete a user interface, chart, score, report, or test. A fallback is permitted only when its factual meaning is documented.

Rationale: Explicit availability and factual semantics prevent a polished surface from misrepresenting what the product knows.

### IV. Experience Contract and Design-System Consistency
User-facing surfaces MUST honor approved structural contracts when they exist and preserve the established design system and canonical shared patterns. Equivalent interactions and states MUST use consistent visual and behavioral semantics across modules. A parallel visual language or local competing pattern MUST NOT be introduced when a canonical pattern applies.

An exception requires an approved product or design decision and MUST improve clarity or behavior. Data unavailability does not authorize removing or structurally falsifying a required surface.

Rationale: Consistent experience contracts make product behavior recognizable and preserve required surfaces even when factual availability varies.

### V. Tenant Isolation and Minimal Authorization
`platform admin` operates only the permitted control plane; `customer admin` administers only its own organization; and `member` uses only the permitted operational capabilities of its own organization. `platform admin` MUST NOT gain operational access to a customer's data plane solely by holding a platform role.

This model exists solely for tenant isolation and controlled provisioning. It MUST NOT authorize generic RBAC, arbitrary profile hierarchies, field-level permissions, new roles, or a capability framework. Any such expansion requires an explicit product decision and a constitution amendment when applicable.

Rationale: A narrow authorization model protects tenant boundaries without creating an unapproved access-control product.

### VI. Requirement and Surface Traceability
Every required capability MUST be traceable to a verifiable requirement and acceptance criterion. Every required user-facing surface MUST be traceable to the approved behavior it materializes. When an approved structural representation or other UI contract exists, the specification MUST reference it and preserve its required surfaces, states, and elements.

User stories MUST represent independently verifiable user outcomes or journeys; a screen, tab, or subpage does not automatically require its own story. A story MAY span multiple surfaces when they form a coherent journey, and a surface MAY support multiple requirements or acceptance scenarios. Plans and tasks MUST retain enough traceability to demonstrate coverage during implementation and acceptance, without duplicating structural-contract content that can be unambiguously referenced.

Frontend and backend MAY be specified, planned, and implemented as independent tracks when an approved semantic contract defines the required shapes, states, availability, and an explicit integration seam. Both tracks MUST preserve the same approved product truth and contract; frontend readiness MUST be assessed against its own verifiable contract and MUST NOT be blocked solely because the backend track is `blocked` or `not_assessed`.

Rationale: Traceability proves coverage while letting product journeys and independently verifiable tracks, rather than artificial delivery boundaries, determine planning structure.

### VII. Verifiable Delivery and Scope Discipline
Work MUST NOT be considered complete until applicable project, feature, and artifact gates are satisfied, with validation proving behavior at the boundary where its requirement is observable. A valid failed gate is evidence to investigate the implementation; it does not authorize weakening a correct requirement, contract, or test. Regressions introduced by a change are part of the change's correction scope.

Approved artifacts determine implementation depth. Persistence, integrations, and backend behavior MUST be implemented when necessary for the approved outcome; simulated, mocked, or deferred seams are permitted only when explicit in scope. Speculative capabilities MUST NOT be delivered for hypothetical needs. A legitimate interruption requires a real impediment that cannot be resolved from available artifacts, code, documentation, or decisions.

Authorized fixtures and mocks MAY support frontend development and validation before a backend track is delivered when they instantiate the approved contract and preserve its availability semantics. They MUST remain isolated from backend and production truth, and MUST NOT simulate a real backend, conceal a missing integration seam, or become a factual production fallback.

Rationale: Credible delivery requires observable evidence and explicit scope while allowing contract-faithful frontend progress without turning temporary fixtures into domain truth.

## Implementation Boundaries

- Architectural and security boundaries that protect approved intent, data truth, experience consistency, tenant isolation, traceability, or verifiable delivery MUST be preserved.
- Domain behavior MUST use authoritative, appropriately scoped sources and retain the factual availability and history required to interpret its outcomes.
- Security-sensitive data, tenant boundaries, and auditable outcomes MUST retain the protection, scope, and evidence required by their approved artifacts.
- Technology-specific conventions, paths, commands, component choices, and operational implementation procedures belong to specialized guidance, not this Constitution.

## Delivery Workflow

- Planning MUST demonstrate adherence to this Constitution and justify material complexity against a simpler alternative.
- Requirements, acceptance criteria, user outcomes, and required surfaces MUST remain traceable through specifications, plans, tasks, implementation, and acceptance evidence.
- A full-stack feature with independently verifiable tracks MUST plan and validate those tracks independently when their approved semantic contract and explicit integration seam permit it. Frontend and backend MUST NOT be forced into separate tracks when a real dependency prevents independent verification.
- Applicable gates MUST be satisfied before delivery is declared complete; that declaration MUST be supported by evidence.
- Material changes to approved intent or this Constitution MUST follow their respective explicit amendment processes.

## Governance

Este documento é a fonte de governança em `docs/PRINCIPIOS.md`. Planejamento, análise e validação devem avaliar os princípios vigentes.

Emendas precisam ser explícitas, registrar motivo e distinguir intenção aprovada de evidência do código existente. Mudança material de produto exige a decisão correspondente.

Versioning policy:

- MAJOR: removes or materially redefines a principle or governance rule in a backward-incompatible way.
- MINOR: adds a principle, mandatory section, or materially expanded governing requirement.
- PATCH: clarifies wording or makes non-semantic refinements without changing governing intent.

**Version**: 3.1.1 | **Ratified**: 2026-06-25 | **Last Amended**: 2026-10-23
