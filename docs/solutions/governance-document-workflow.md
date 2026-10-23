# Governance Document Workflow
> Governance module now runs as a persisted document workflow

Entry: `orkestria360/routes/web.php` — `governance*` routes

Overview: `orkestria360/app/Http/Controllers/Modules/GovernanceController.php`
- `__invoke()` → overview Inertia payload
- `show()` → topic detail payload

Domain: `orkestria360/app/Models/GovernanceTopic.php`
- Fixed 8-topic catalog via `seededTopics()`
- Statuses: `not_started` → `pending` → `in_progress` → `under_review` → `completed`
- Re-submit after completed clears approval + score, returns to `under_review`

Payload mapping: `orkestria360/app/Support/Governance/GovernancePageData.php`
- Overview score = average of 8 topics, non-completed count as `0`
- Primary action label derived server-side by status + admin capability
- Detail payload drives metadata/template/document/approval panels

Files: `orkestria360/app/Support/Governance/GovernanceDocumentStorage.php`
- Templates on `local` disk under `governance/templates/`
- Missing template file is generated lazily on first download
- Current document stored under `governance/documents/{topic-slug}/`

Auth: `orkestria360/app/Providers/AppServiceProvider.php`
- Gate `approve-governance-topic`
- Admin check currently minimal: `App\Models\User::isAdministrator()` by William's email

Frontend: `orkestria360/resources/js/pages/modules/governance.tsx`, `orkestria360/resources/js/pages/modules/governance-topic.tsx`
- Overview row action always navigates to detail
- Template download uses regular POST form + CSRF meta from `resources/views/app.blade.php`
- Upload/approval use Inertia `useForm`

Tests: `orkestria360/tests/Feature/Governance/`
- `GovernanceOverviewTest.php`
- `GovernanceTopicDetailTest.php`
- `GovernanceApprovalTest.php`

Updated: 2026-06-26
