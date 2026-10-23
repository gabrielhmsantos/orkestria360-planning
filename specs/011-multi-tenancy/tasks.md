---

description: "Tarefas de implementação para Multi-tenancy Microsoft 365"
---

# Tasks: Multi-tenancy Microsoft 365

**Input**: Artefatos em `/specs/011-multi-tenancy/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/control-plane.md](contracts/control-plane.md), [quickstart.md](quickstart.md)

**Tests**: Obrigatórios. A Spec, o Planning e o plano de testes exigem PHPUnit para fresh deployment, autorização, convite, RLS e sincronização; mudanças frontend devem passar typecheck, lint e build.

**Organization**: As tarefas são agrupadas por história para permitir incrementos verificáveis. A Fase 2 é bloqueadora porque estabelece a fronteira de dados, o contexto e as garantias de banco comuns.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode ser executada em paralelo, em arquivos distintos e sem dependência de tarefa ainda incompleta.
- **[Story]**: história rastreada (`[US1]` a `[US6]`).
- Todo item aponta para o caminho de implementação ou teste afetado.

## Path Conventions

- Aplicação Laravel/Inertia: `orkestria360/`
- Backend: `orkestria360/app/`, `orkestria360/routes/`, `orkestria360/config/`
- Banco: `orkestria360/database/{migrations,seeders,factories}/`
- Frontend: `orkestria360/resources/js/`
- Testes: `orkestria360/tests/{Feature,Unit}/`

## Surface-to-Story Traceability

| Story | Structural surface and exact cards | Primary task IDs |
|---|---|---|
| US1 — Aceitar convite fechado | `Aceitar convite — formulário de credenciais` | T016–T022 |
| US2 — Administrar organizações | `Organizações — cabeçalho de página`; `Provisionar organização — ação de criação`; `Lista de organizações — tabela operacional` | T023–T025 |
| US3 — Acompanhar bootstrap | `Organização — cabeçalho de detalhe`; `Situação de bootstrap — status factual`; `Convite de bootstrap do customer — card operacional` | T026–T028 |
| US4 — Conectar e sincronizar Microsoft 365 | `Conexão Microsoft 365 — cabeçalho de página`; `Conexão Microsoft 365 — card de conexão`; `Disponibilidade dos dados Microsoft 365 — painel de disponibilidade` | T029–T039 |
| US5 — Administrar membros sem acesso cruzado | `Usuários — cabeçalho de página`; `Convidar pessoa — ação de criação`; `Usuários — tabela operacional`; `Convites pendentes — tabela operacional` | T040–T044 |
| US6 — Identificar organização autorizada no shell | `Organização atual — identificação passiva` | T045 |
| US7 — Administrar acessos da plataforma | `Usuários — cabeçalho de página`; `Convidar administrador da plataforma — ação de criação`; `Usuários — tabela operacional`; `Convites pendentes da plataforma — tabela operacional` | T045a–T045c |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar a configuração final para fresh deployment antes de alterar schema, rotas ou runtime.

- [X] T001 Atualizar `orkestria360/.env.example` e `orkestria360/config/services.php` para credencial global Graph via secret manager, removendo `MS_GRAPH_TENANT_ID` do contrato.
- [X] T002 [P] Criar factories de suporte em `orkestria360/database/factories/TenantFactory.php`, `TenantMembershipFactory.php`, `TenantAccessInvitationFactory.php` e `MicrosoftConnectionFactory.php` para customers, memberships, convites e connections de teste.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fazer `migrate:fresh` chegar ao schema final e estabelecer control plane, RLS, contexto, autorização e seed mínimo.

**⚠️ CRITICAL**: Nenhuma história deve começar antes de concluir esta fase.

- [X] T003 Criar as novas fundações de tenancy/control plane, `microsoft_connections`, catálogo Governance e instâncias customer-scoped em `orkestria360/database/migrations/` após Laravel core e antes dos baselines de domínio que dependem delas.
- [X] T004 Ajustar in place as migrations baseline customer-scoped em `orkestria360/database/migrations/` para nascerem com UUID `tenant_id NOT NULL`, FKs, constraints e índices/uniques finais; adicionar `microsoft_connection_id` somente com provenance direta e, junto a tenant, FK composta para `microsoft_connections (tenant_id, id)`, sem conversion, alter-type, backfill ou rekey posterior.
- [X] T005 Criar ou ajustar migrations em `orkestria360/database/migrations/` para RLS deny-by-default, inclusive `microsoft_connections`, com `USING`/`WITH CHECK`, `FORCE ROW LEVEL SECURITY` quando aplicável e role runtime sem owner, superuser ou `BYPASSRLS`.
- [X] T006 [P] Criar `orkestria360/app/Models/Tenant.php`, `TenantMembership.php`, `TenantAccessInvitation.php`, `ControlPlaneAuditEvent.php`, `MicrosoftConnection.php`, `MicrosoftConnectionAttempt.php` e `app/Models/Concerns/BelongsToTenant.php` com casts, relações e escopos que não substituem autorização.
- [X] T007 Criar `orkestria360/app/Tenancy/CurrentTenant.php`, `TenantExecutionRunner.php`, `TenantAccessResolver.php` e `TenantContextMiddleware.php` para binding scoped, autorização antes de contexto e `set_config('app.current_tenant_id', ..., true)` em transação curta, com limpeza garantida.
- [X] T008 Criar policies em `orkestria360/app/Policies/`, migrar consumidores de autorização por e-mail e proteger a remoção em `orkestria360/tests/Feature/Tenancy/NoEmailBasedAuthorizationTest.php`.
- [X] T009 Atualizar `orkestria360/app/Providers/AppServiceProvider.php` e `FortifyServiceProvider.php` para bindings scoped, Gates/Policies e acesso fechado sem registro público.
- [X] T010 Criar `orkestria360/database/seeders/PlatformTenantSeeder.php` e atualizar `DatabaseSeeder.php` para criar somente `platform`, `admin@example.com` e membership `admin active`; não criar/citar `test@example.com`, customer ou Microsoft connection.
- [X] T011 Migrar consumidores de `orkestria360/app/Services/Microsoft365/Licensing/TenantContext.php`, shell, rotas e controllers para `CurrentTenant`/tenant explícito, remover a classe e criar `orkestria360/tests/Feature/Tenancy/NoGlobalTenantFallbackTest.php` contra `TenantContext`, fallback `contoso` e tenant global de runtime.
- [X] T012 [P] Criar `orkestria360/tests/Feature/Database/TenantRowLevelSecurityTest.php` para role runtime sem bypass e ataques cross-tenant por Eloquent, `DB::table` e SQL direto em `SELECT`, `INSERT`, `UPDATE` e `DELETE`.
- [X] T013 [P] Criar `orkestria360/tests/Feature/Database/TenantControlPlaneSchemaTest.php` e `FreshDeploymentSeedTest.php`, e `orkestria360/tests/Feature/Tenancy/TenantExecutionRunnerTest.php`, para UUID/NOT NULL e FKs de `tenant_id`, índices/uniques finais, nullability contratual/ausência de `microsoft_connection_id`, FK composta que recusa tenant A + connection B, ausência de migration de conversão, platform único, seed mínimo, zero customers/connections e contexto transaction-local.
- [X] T014 [P] Criar `orkestria360/tests/Feature/Tenancy/TenantAuthorizationTest.php` para negar domínio, e-mail hardcoded, `member` administrativo, tenant da request e contextos sem membership ativa.
- [X] T015 Executar `cd orkestria360 && php artisan migrate:fresh --seed && php artisan test tests/Feature/Database tests/Feature/Tenancy` e corrigir os artefatos da Foundation.

**Checkpoint**: `migrate:fresh` + seed mínimo, control plane, schema final, RLS, contexto, policies e isolamento estão verificáveis; as histórias podem prosseguir.

---

## Phase 3: User Story 1 — Aceitar convite fechado (Priority: P1) 🎯 MVP

**Goal**: Entregar `Aceitar convite — formulário de credenciais`.

- [X] T016 [P] [US1] Criar `InvitationAcceptanceTest.php` e `ExpireTenantAccessInvitationsTest.php` em `orkestria360/tests/Feature/Tenancy/` para criação atômica, role/purpose, replay, TTL, ciphertext e logs sanitizados.
- [X] T017 [P] [US1] Criar `orkestria360/tests/Feature/Auth/ClosedRegistrationTest.php` para negar registro público e permitir somente aceite de convite.
- [X] T018 [US1] Criar `InvitationService.php`, `TenantAccessInvitationNotification.php` e `ExpireTenantAccessInvitations.php` em `orkestria360/app/`, agendado em `routes/console.php`, para emissão, URL recuperável, expiração factual e auditoria.
- [X] T019 [US1] Criar `AcceptTenantAccessInvitation.php` e `AcceptTenantAccessInvitationController.php` em `orkestria360/app/` para validar hash/token/e-mail, criar/reusar User, membership e `activated_at` bootstrap.
- [X] T020 [US1] Atualizar `orkestria360/config/fortify.php`, `FortifyServiceProvider.php`, `routes/web.php` e `resources/js/pages/auth/login.tsx`, e remover `orkestria360/resources/js/pages/auth/register.tsx`, para substituir cadastro por convite.
- [X] T021 [P] [US1] Criar `orkestria360/resources/js/pages/auth/accept-tenant-invitation.tsx` conforme a representação estrutural, com estados inválido, expirado e revogado.
- [X] T022 [US1] Executar os testes de convite e registro fechado em `orkestria360/tests/Feature/Tenancy/` e `tests/Feature/Auth/`.

---

## Phase 4: User Story 2 — Administrar organizações (Priority: P1)

**Goal**: Entregar listagem e provisioning no control plane.

- [X] T023 [P] [US2] Criar `orkestria360/tests/Feature/Tenancy/CustomerProvisioningTest.php` para customer inativo, convite bootstrap, tópicos Governance, auditoria e negação a customer admin.
- [X] T024 [US2] Criar `CustomerProvisioner.php`, `Platform/CustomerProvisioningController.php` e Requests em `orkestria360/app/` para provisioning transacional sem User/membership prévios.
- [X] T025 [P] [US2] Criar `orkestria360/resources/js/pages/platform/customers/index.tsx` conforme a representação, sem expor dados customer-scoped.

---

## Phase 5: User Story 3 — Acompanhar bootstrap de uma organização (Priority: P1)

**Goal**: Entregar detalhe, estado factual e lifecycle do bootstrap.

- [X] T026 [P] [US3] Criar `orkestria360/tests/Feature/Tenancy/CustomerBootstrapRecoveryTest.php` para pending válido, reemissão, auditoria e `activated_at` write-once.
- [X] T027 [US3] Criar `orkestria360/app/Services/Tenancy/CustomerBootstrapRecoveryService.php` para reemissão sem alterar histórico terminal.
- [X] T028 [US3] Criar controller/Requests de bootstrap em `orkestria360/app/Http/` e `resources/js/pages/platform/customers/show.tsx` para detalhe, reemissão e cancelamento.

---

## Phase 6: User Story 4 — Conectar e sincronizar Microsoft 365 (Priority: P1)

**Goal**: Entregar conexão e sync isolado por tenant+connection.

- [X] T029 [P] [US4] Criar `MicrosoftConnectionOnboardingTest.php` em `orkestria360/tests/Feature/Microsoft365/` para state, callback, `/organization`, colisão e consentimento.
- [X] T030 [US4] Criar verifier/controller e atualizar factory Graph em `orkestria360/app/Support/Microsoft365/` e `app/Http/Controllers/Microsoft365/` para consentimento e promoção verificada.
- [X] T031 [US4] Criar `resources/js/pages/settings/microsoft-connection.tsx` e atualizar `settings/security.tsx` conforme a representação, incluindo desconexão acessível.
- [X] T032 [P] [US4] Atualizar `CoordinatedSyncScheduleTest.php` e criar `TenantConnectionDispatchTest.php` para customers ativos, connections elegíveis e payload explícito.
- [X] T033 [P] [US4] Atualizar `CoordinatedSyncTest.php`, `DatabaseLockIntegrationTest.php` e criar `MicrosoftConnectionDisconnectTest.php` para disconnect, auditoria, locks, revalidação e histórico.
- [X] T034 [P] [US4] Criar `GraphClientFactoryTenantTest.php` para authority explícita, `.default`, connection customer e rejeição de configuração global.
- [X] T035 [US4] Atualizar `SyncMicrosoft365.php`, `routes/console.php` e `CoordinatedSyncCoordinator.php` para executar uma unidade explícita por connection.
- [X] T036 [US4] Atualizar operações/stages/preflight e criar disconnect service/controller em `orkestria360/app/Services/Microsoft365/` para revalidar tenant, connection e estado antes de write.
- [X] T037 [US4] Atualizar factory, data client e sincronizadores/collectors em `orkestria360/app/Services/Microsoft365/` para tenant+connection e cache/lock/idempotência pela dupla.
- [X] T038 [US4] Atualizar `SyncExceptionLogger.php` e `GraphAccessFailure.php` para taxonomia AADSTS/Graph/HTTP/`Retry-After` sem segredos e sem inferência de `401`/`403`.
- [X] T039 [US4] Executar os testes Microsoft 365 da US4 em `orkestria360/tests/Feature/Microsoft365/`.
- [X] T039a [US4] Permitir authority Entra explícita no consentimento em `MicrosoftConnectionController`, `MicrosoftConnectionOnboarding` e `microsoft_connection_attempts`; adicionar diálogo com Tenant ID GUID e link de ajuda na tela de conexão, validar igualdade callback/intenção e cobrir authority padrão, divergência e erro/cancelamento em `MicrosoftConnectionOnboardingTest.php`.

---

## Phase 7: User Story 5 — Administrar membros sem acesso cruzado (Priority: P1)

**Goal**: Entregar os quatro cards de membros/convites e o isolamento customer-scoped.

- [X] T040 [P] [US5] Criar testes de memberships, acesso de módulo, isolamento Governance e auditoria em `orkestria360/tests/Feature/Tenancy/` e `tests/Feature/Governance/`.
- [X] T041 [US5] Criar `CustomerMembershipService.php` e `Settings/TenantMembershipController.php` em `orkestria360/app/` para convites e revogação somente no customer autorizado.
- [X] T042 [P] [US5] Criar `orkestria360/resources/js/pages/settings/tenant-memberships.tsx` conforme a representação, sem seletor de tenant.
- [X] T043 [US5] Atualizar page-data services/controllers Microsoft 365, Governance e modelos/document storage em `orkestria360/app/` para `CurrentTenant`, tópicos customer e relações do mesmo tenant.
- [X] T044 [US5] Executar os testes de memberships, módulo, Governance e auditoria da US5.

---

## Phase 8: User Story 6 — Identificar organização autorizada no shell (Priority: P1)

**Goal**: Entregar `Organização atual — identificação passiva`, sem seletor ou troca de tenant.

- [X] T045 [US6] Atualizar `resources/js/components/app-shell.tsx`, `app-sidebar.tsx` e `app-header.tsx` para receber tenant autorizado do backend sem UI de seleção/troca.

---

## Phase 8.5: User Story 7 — Administrar acessos da plataforma (Priority: P1)

**Goal**: Entregar os quatro cards de acessos do control plane sem abrir data plane de customers.

- [X] T045a [P] [US7] Criar testes de convite, recuperação de URL, cancelamento, revogação, último administrador, auditoria e negação em `orkestria360/tests/Feature/Tenancy/`.
- [X] T045b [US7] Criar serviço e controller de control plane, e rotas `platform/access`, para invitations/memberships `admin/access` do tenant `platform`, sem `TenantExecutionRunner`, RLS ou `tenant_audit_events`.
- [X] T045c [US7] Criar `orkestria360/resources/js/pages/platform/access/index.tsx` conforme a representação; atualizar o shell para sidebar exclusiva de `platform` com `Organizações` e `Usuários`.
- [X] T045d [US3][US4] Unificar solicitações manual e agendada de sync Microsoft 365 em `microsoft_sync_requests`, com diagnóstico agregado limitado no detalhe platform e sem acesso ao data plane customer.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Completar segurança, documentação e validação fim a fim.

- [X] T046 [P] Atualizar `orkestria360/README.md` e `.env.example` com fresh deployment, seed platform, provisioning fechado, convite, secret manager e Graph, sem upgrade.
- [X] T047 [P] Atualizar `specs/011-multi-tenancy/quickstart.md` com comandos reais e evidência dos testes Foundation, Tenancy e Microsoft 365.
- [X] T048 Revisar `orkestria360/app/`, `config/` e `routes/` para ausência de token, URL/ciphertext/state bruto, segredo Microsoft, `MS_GRAPH_TENANT_ID`, fallback de tenant global e autorização por e-mail.
- [X] T049 Registrar em `orkestria360/README.md` a evidência operacional fornecida pela infraestrutura para owner, rotação e monitoramento de expiração da credencial global; bloquear implantação quando essa evidência não existir.
- [X] T050 Executar `cd orkestria360 && npm run lint:check && npm run types:check && npm run build && composer ci:check`, corrigindo os arquivos apontados e registrando bloqueios no quickstart.
- [X] T051 Executar os cenários de uma organização do quickstart em PostgreSQL 18 e registrar evidência de fresh deployment, bootstrap, Graph e disconnect; manter a cobertura automatizada cross-tenant.

---

## Phase 10: Remediação do review de segurança e concorrência

- [X] T052 [P1][US1] Separar aceite de convite para conta nova e existente: senha é criada somente para `User` novo; conta existente autentica-se pelo Fortify e confirma o mesmo e-mail antes de consumir o convite.
- [X] T053 [P1][US4] Bloquear disconnect com ciclo `running`, revalidar connection antes de Graph e terminalizar factual e seguramente um ciclo interrompido por connection inelegível.
- [X] T054 [P1][US4] Implementar claim persistida com token e lease renovado por heartbeat para requests de sync, protegendo entrega duplicada e permitindo recuperação após worker interrompido.
- [X] T055 [P1][US4] Executar retenção agendada por todos os customers via `TenantExecutionRunner`, inclusive connections desconectadas, sem contexto implícito no scheduler.
- [X] T056 [P1] Manter init versionado do Compose para bootstrap da role runtime, sem poluir o CI funcional; registrar como gate de deploy que o Laravel usa uma role PostgreSQL de runtime sem ownership, superuser, `BYPASSRLS` ou possibilidade de assumir DDL.

---

## Dependencies & Execution Order

- Phase 1–2 bloqueiam todas as histórias.
- US1 e US2 podem avançar após Foundation; US3 depende de US2.
- US4, US5 e US6 dependem de US1; US4 pode seguir após US1 porque o primeiro customer admin nasce no aceite, enquanto US5 administra memberships adicionais e a propagação operacional.
- Phase 9 depende de US1–US6.

```text
Setup → Foundation → US1 → {US4, US5, US6}
                     └→ US2 → US3
US3 + US4 + US5 + US6 + US7 → Polish
```

## Notes

- Cada fase preserva os cards nomeados na matriz de rastreabilidade.
- Não há seletor/troca de tenant, migrator, importação de dados nem caminho de upgrade.
