# Tasks: Workflow Documental de Governança

**Input**: Design documents from `/specs/001-governance-document-workflow/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include the tests required by the specification and constitution. When logic, navigation seams, shared UI contracts, or regressions are at risk, test tasks are NOT optional.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Application code: `orkestria360/app/`, `orkestria360/resources/js/`, `orkestria360/routes/`, `orkestria360/database/`, `orkestria360/tests/Feature/`
- Planning artifacts: `specs/001-governance-document-workflow/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the governance module for real workflow data instead of inline mocked payloads

- [X] T001 Extract the governance page entrypoint from `orkestria360/routes/web.php` into `orkestria360/app/Http/Controllers/Modules/GovernanceController.php`
- [X] T002 Create governance workflow feature test files `orkestria360/tests/Feature/Governance/GovernanceOverviewTest.php`, `orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php`, and `orkestria360/tests/Feature/Governance/GovernanceApprovalTest.php`
- [X] T003 [P] Create governance workflow frontend type contracts in `orkestria360/resources/js/data/modules/governance.ts` and `orkestria360/resources/js/types/modules.ts`
- [X] T004 Identify and preserve the shared UX patterns for status badges, tables, cards, and actions in `orkestria360/resources/js/components/modules/` while documenting the required `composer test` gate in `specs/001-governance-document-workflow/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Generate and complete the governance topic persistence layer in `orkestria360/app/Models/GovernanceTopic.php`, `orkestria360/database/migrations/*_create_governance_topics_table.php`, and `orkestria360/database/factories/GovernanceTopicFactory.php`
- [X] T006 [P] Generate and complete the active document persistence layer in `orkestria360/app/Models/GovernanceTopicDocument.php`, `orkestria360/database/migrations/*_create_governance_topic_documents_table.php`, and `orkestria360/database/factories/GovernanceTopicDocumentFactory.php`
- [X] T007 [P] Seed the fixed catalog of 8 governance topics and template metadata in `orkestria360/database/seeders/GovernanceTopicSeeder.php` and `orkestria360/database/seeders/DatabaseSeeder.php`
- [X] T008 [P] Add governance workflow form requests in `orkestria360/app/Http/Requests/Governance/UpdateGovernanceTopicMetadataRequest.php`, `orkestria360/app/Http/Requests/Governance/UploadGovernanceTopicDocumentRequest.php`, and `orkestria360/app/Http/Requests/Governance/ApproveGovernanceTopicRequest.php`
- [X] T009 Implement administrative authorization for governance approval actions in `orkestria360/app/Models/User.php` and `orkestria360/app/Providers/AppServiceProvider.php`
- [X] T010 Create the shared governance payload mapper and storage helpers in `orkestria360/app/Support/Governance/GovernancePageData.php` and `orkestria360/app/Support/Governance/GovernanceDocumentStorage.php`
- [X] T011 Register authenticated governance workflow routes for overview, detail, metadata, template download, upload, and approval in `orkestria360/routes/web.php`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Preparar um tópico documental (Priority: P1) 🎯 MVP

**Goal**: Permitir que o usuário operacional preencha metadados obrigatórios, veja o estado inicial corretamente e baixe o template oficial do tópico

**Independent Test**: Um usuário autenticado consegue abrir overview e detalhe, ver um tópico `Não iniciado`, preencher responsável/vigência, mudar para `Pendente` e baixar o template, levando o tópico para `Em andamento`

### Tests for User Story 1 ⚠️

- [X] T012 [P] [US1] Add overview and metadata transition tests in `orkestria360/tests/Feature/Governance/GovernanceOverviewTest.php`
- [X] T013 [P] [US1] Add topic detail and template download tests in `orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php`
- [X] T014 [P] [US1] Add guest and unauthorized access tests for topic detail and template download in `orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php`

### Implementation for User Story 1

- [X] T015 [US1] Implement the overview and detail read actions in `orkestria360/app/Http/Controllers/Modules/GovernanceController.php`
- [X] T016 [US1] Implement metadata update and first workflow status transition in `orkestria360/app/Http/Controllers/Governance/GovernanceTopicMetadataController.php`
- [X] T017 [US1] Implement template download registration and protected file response in `orkestria360/app/Http/Controllers/Governance/GovernanceTopicTemplateDownloadController.php`
- [X] T018 [P] [US1] Build the governance topic detail page shell in `orkestria360/resources/js/pages/modules/governance-topic.tsx`
- [X] T019 [P] [US1] Create metadata and template action UI components in `orkestria360/resources/js/components/modules/governance-topic-metadata-form.tsx` and `orkestria360/resources/js/components/modules/governance-topic-template-panel.tsx`
- [X] T020 [US1] Update the overview table and navigation links for `Não iniciado`, `Pendente` and `Em andamento` states in `orkestria360/resources/js/components/modules/governance-documents-table.tsx`, `orkestria360/resources/js/pages/modules/governance.tsx`, and `orkestria360/resources/js/lib/orkestria-navigation.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Enviar documento para análise (Priority: P2)

**Goal**: Permitir envio e substituição do documento vigente com transições corretas para `Em análise`

**Independent Test**: Após baixar o template, um usuário autenticado consegue enviar um documento, visualizar o documento vigente, ver a data do último envio no overview e reenviar uma nova versão mantendo ou retomando `Em análise`

### Tests for User Story 2 ⚠️

- [X] T021 [P] [US2] Add document upload and validation tests in `orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php`
- [X] T022 [P] [US2] Add completed-topic resubmission regression tests in `orkestria360/tests/Feature/Governance/GovernanceOverviewTest.php`
- [X] T023 [P] [US2] Add protected document preview/download access tests in `orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php`

### Implementation for User Story 2

- [X] T024 [US2] Implement document upload and replacement workflow rules in `orkestria360/app/Http/Controllers/Governance/GovernanceTopicDocumentController.php`
- [X] T025 [US2] Implement document read/view and download access in `orkestria360/app/Http/Controllers/Governance/GovernanceTopicDocumentViewController.php`
- [X] T026 [P] [US2] Add upload, document history, and protected preview UI to `orkestria360/resources/js/components/modules/governance-topic-document-panel.tsx`
- [X] T027 [P] [US2] Extend the governance page data mapping for last submission, active document, and `Em análise` state in `orkestria360/app/Support/Governance/GovernancePageData.php`
- [X] T028 [US2] Wire the topic detail page and overview table to document submission states in `orkestria360/resources/js/pages/modules/governance-topic.tsx` and `orkestria360/resources/js/components/modules/governance-documents-table.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Aprovar e pontuar o tópico (Priority: P3)

**Goal**: Permitir revisão administrativa com score, conclusão do tópico, vigência iniciada e recálculo do score do módulo

**Independent Test**: Um usuário com papel `Administrador` consegue aprovar um tópico em `Em análise` com pontuação inteira válida, concluir o tópico, iniciar a vigência e atualizar o score do overview; usuários não administradores não conseguem executar essa ação

### Tests for User Story 3 ⚠️

- [X] T029 [P] [US3] Add approval authorization and validation tests in `orkestria360/tests/Feature/Governance/GovernanceApprovalTest.php`
- [X] T030 [P] [US3] Add governance score recalculation tests in `orkestria360/tests/Feature/Governance/GovernanceOverviewTest.php`

### Implementation for User Story 3

- [X] T031 [US3] Implement the approval and scoring workflow in `orkestria360/app/Http/Controllers/Governance/GovernanceTopicApprovalController.php`
- [X] T032 [US3] Finalize score, approval reset, and validity-start calculations in `orkestria360/app/Support/Governance/GovernancePageData.php` and `orkestria360/app/Models/GovernanceTopic.php`
- [X] T033 [P] [US3] Add the administrative review and scoring UI in `orkestria360/resources/js/components/modules/governance-topic-approval-panel.tsx`
- [X] T034 [US3] Integrate completed-state, admin action mapping, and validity display in `orkestria360/resources/js/pages/modules/governance-topic.tsx`, `orkestria360/resources/js/pages/modules/governance.tsx`, and `orkestria360/resources/js/data/modules/governance.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T035 [P] Add template/document storage setup notes and topic template maintenance guidance in `specs/001-governance-document-workflow/quickstart.md` and `orkestria360/database/seeders/GovernanceTopicSeeder.php`
- [X] T036 Review UX consistency across overview and detail states in `orkestria360/resources/js/components/modules/` and `orkestria360/resources/js/pages/modules/`
- [X] T037 Harden protected file access, validation messaging, and non-happy-path redirects in `orkestria360/app/Http/Controllers/Governance/` and `orkestria360/app/Http/Requests/Governance/`
- [X] T038 Normalize the canonical governance status mapper and naming usage in `orkestria360/app/Support/Governance/GovernancePageData.php`, `orkestria360/resources/js/data/modules/governance.ts`, and `orkestria360/resources/js/pages/modules/governance-topic.tsx`
- [X] T039 Run the required full gate `composer test` in `orkestria360/`
- [X] T040 Run the end-to-end validation scenarios from `specs/001-governance-document-workflow/quickstart.md` and record any required artifact updates in `specs/001-governance-document-workflow/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories then proceed in priority order because US2 depends on US1 workflow states and US3 depends on US2 document review flow
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - establishes detail page, metadata state, and template download baseline
- **User Story 2 (P2)**: Depends on User Story 1 because upload requires metadata, detail UI, and template download tracking
- **User Story 3 (P3)**: Depends on User Story 2 because approval requires an active submitted document and under-review state

### Within Each User Story

- Tests MUST be written and fail before implementation
- Shared patterns before one-off UI exceptions unless the spec justifies them
- Models and workflow rules before controllers
- Controllers before frontend wiring
- Core implementation before integration refinement
- Required gate must pass before the feature is marked complete

### Parallel Opportunities

- T003 can run in parallel with T001-T002
- T005-T010 contain parallelizable infrastructure work across migrations, seeders, requests, authorization, and mapping helpers
- T012 and T013 can run in parallel for US1
- T018 and T019 can run in parallel for US1 after backend contracts stabilize
- T021, T022, and T023 can run in parallel for US2
- T026 and T027 can run in parallel for US2
- T029 and T030 can run in parallel for US3
- T033 can run in parallel with T031-T032 after approval contract is fixed

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add overview and metadata transition tests in orkestria360/tests/Feature/Governance/GovernanceOverviewTest.php"
Task: "Add topic detail and template download tests in orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php"
Task: "Add guest and unauthorized access tests for topic detail and template download in orkestria360/tests/Feature/Governance/GovernanceTopicDetailTest.php"

# Launch UI work for User Story 1 together after backend contracts exist:
Task: "Build the governance topic detail page shell in orkestria360/resources/js/pages/modules/governance-topic.tsx"
Task: "Create metadata and template action UI components in orkestria360/resources/js/components/modules/governance-topic-metadata-form.tsx and orkestria360/resources/js/components/modules/governance-topic-template-panel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run the US1 feature tests and manually verify metadata + template download flow
5. Demo the MVP governance workflow baseline

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo
3. Add User Story 2 → Test independently → Demo
4. Add User Story 3 → Test independently → Demo
5. Finish with polish tasks and full `composer test` gate

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 backend controllers and requests
   - Developer B: US1/US2 frontend detail and overview wiring
   - Developer C: test coverage and data mapping support
3. After US1 stabilizes:
   - Developer A: US2 upload flow
   - Developer B: US3 admin UI
   - Developer C: authorization, score recalculation, and regression tests

---

## Notes

- [P] tasks = different files, no dependencies
- [US1], [US2], [US3] labels map tasks to specific user stories for traceability
- Each user story is independently testable at its checkpoint
- The required gate for feature completion is `composer test`
