# Tasks: Modos Operacionais do Sync Microsoft 365

**Input**: Artefatos de `/specs/008-sync-operation-flags/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [sync-operation-command.md](./contracts/sync-operation-command.md), [quickstart.md](./quickstart.md)

**Tests**: Obrigatórios. A feature altera contrato Artisan, scheduler, cursores, janelas temporais, persistência e integrações Graph. Escrever/regredir os testes da história antes da alteração correspondente; executar `composer ci:check` por lote e `composer test` antes de concluir.

**Organization**: As histórias são operações CLI sem superfície visual; portanto, não há cards ou representação estrutural de tela. Todas as tarefas de aplicação pertencem ao repositório aninhado `orkestria360/`.

## Phase 1: Setup

**Purpose**: Fixar o contrato aprovado e a linha de base dos pontos afetados.

- [X] T001 Revisar os contratos e cenários de validação em `specs/008-sync-operation-flags/contracts/sync-operation-command.md` e `specs/008-sync-operation-flags/quickstart.md` antes de alterar o ciclo.
- [X] T002 [P] Mapear as expectativas legadas de `--full-reconciliation` e `--force` em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php`, `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php`, `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php`, `orkestria360/tests/Feature/Groups/GroupsSyncTest.php` e `orkestria360/tests/Feature/LicensingSyncTest.php`.
- [X] T003 [P] Executar a linha de base dos testes de sync em `orkestria360/tests/Feature/Microsoft365/`, `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php`, `orkestria360/tests/Feature/Groups/GroupsSyncTest.php`, `orkestria360/tests/Feature/LicensingSyncTest.php` e `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php`.

---

## Phase 2: Foundational

**Purpose**: Criar o contrato interno e a persistência que bloqueiam todas as histórias.

**⚠️ CRITICAL**: Nenhuma história começa antes desta fase.

- [X] T004 Criar o value object imutável `SyncOperation` em `orkestria360/app/Services/Microsoft365/Sync/SyncOperation.php`, com modos exclusivos `routine`, `force`, `recollect_days`, `recollect_date` e `recollect_today`, allowlist `7|30|90|180`, timezone do tenant, janelas delimitadas por 00:00:00 e `observedAt` UTC único congelado no início do ciclo.
- [X] T005 [P] Criar a migration aditiva `orkestria360/database/migrations/*_add_operation_metadata_to_microsoft365_sync_cycles_table.php` para modo, opções normalizadas, timezone e janela UTC solicitada sem reescrever ciclos históricos.
- [X] T006 [P] Criar a migration aditiva `orkestria360/database/migrations/*_add_requested_window_and_coverage_to_microsoft365_event_ingestion_batches_table.php` para limites solicitados/efetivos e `coverage` v1 (`requested_window`, `effective_window`, `collected_through_at`, `coverage_status`, `limitation_reason` e `source_limit_at`) por fonte temporal.
- [X] T007 Atualizar casts/fillable e relações em `orkestria360/app/Models/Microsoft365SyncCycle.php`, `orkestria360/app/Models/Microsoft365SyncStage.php` e `orkestria360/app/Models/Microsoft365EventIngestionBatch.php` para a nova telemetria operacional e leitura de registros legados sem metadados.
- [X] T008 Adaptar `orkestria360/app/Services/Microsoft365/Sync/SyncStageRecorder.php` para registrar a cobertura estruturada v1 de cada estágio sem substituir publicação ou motivo de falha.
- [X] T009 Criar a matriz de parsing, exclusividade de modos, períodos permitidos, resolução de janelas e `observedAt` único em `orkestria360/tests/Feature/Microsoft365/SyncOperationCommandTest.php` antes de conectar o comando ao coordenador.
- [X] T010 Definir o callback/contrato de heartbeat entre `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php`, `orkestria360/app/Support/Microsoft365/Contracts/GraphClient.php` e `orkestria360/app/Support/Microsoft365/GraphDataClient.php` e criar antes da implementação a regressão em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php` que prova renovação antes do vencimento entre páginas/retries, impossibilidade de segunda aquisição e aborto antes de nova publicação após perda de ownership.
- [X] T011 Evoluir `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php` para receber um único `SyncOperation`, persistir sua intenção no ciclo, propagá-lo a todos os coletores e integrar o heartbeat do lock definido em T010, preservando estágios independentes e skips de dependência.

**Checkpoint**: `SyncOperation`, persistência de intenção/cobertura e propagação global estão disponíveis para todas as histórias.

---

## Phase 3: User Story 1 — Executar o ciclo fora da cadência normal (Priority: P1) 🎯 MVP

**Goal**: Disponibilizar `--force` como operação global sem resetar cursores, watermarks ou publicações válidas.

**Independent Test**: Após um ciclo publicado, `php artisan app:sync-microsoft365 --force` tenta todos os coletores elegíveis, preserva posições incrementais/deduplicação e ainda recusa execução concorrente.

### Tests for User Story 1

- [X] T012 [P] [US1] Atualizar os testes do comando, resumo operacional, lock e assinatura em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php` para esperar `SyncOperation::force`, remover `--full-reconciliation` e provar renovação de lock em ciclo longo.
- [X] T013 [P] [US1] Adicionar regressões de `--force` preservando `delta_link`, watermark e deduplicação em `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php`, `orkestria360/tests/Feature/Groups/GroupsSyncTest.php` e `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php`.
- [X] T014 [P] [US1] Adicionar regressão de `--force` para snapshots e eventos de risco em `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php` e para licenciamento em `orkestria360/tests/Feature/LicensingSyncTest.php`.

### Implementation for User Story 1

- [X] T015 [US1] Substituir a assinatura e o parsing de `--full-reconciliation` em `orkestria360/app/Console/Commands/SyncMicrosoft365.php`, validar `--force` antes de lock/Graph e exibir modo, timezone, janela e cobertura no resumo.
- [X] T016 [US1] Separar em `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsSynchronizer.php` e `orkestria360/app/Services/Microsoft365/UsersAccounts/GroupMembershipsCollector.php` o bypass de cadência da reconstrução, garantindo que `--force` não descarte `delta_link` nem transforme memberships em reconciliação completa.
- [X] T017 [US1] Separar em `orkestria360/app/Services/Microsoft365/Groups/GroupsSynchronizer.php` e seus coletores de relações o bypass de cadência da reconstrução, garantindo que `--force` preserve cursor, IDs afetados e publicação anterior.
- [X] T018 [US1] Ajustar `orkestria360/app/Services/Microsoft365/Licensing/LicensingSynchronizer.php`, `orkestria360/app/Services/Microsoft365/Sync/CanonicalAuditEventsCollector.php` e `orkestria360/app/Services/Microsoft365/Mfa/RiskDetectionsCollector.php` para reexecutar em `--force` sem redefinir janela incremental, watermark ou deduplicação.
- [X] T019 [US1] Executar `composer ci:check` em `orkestria360/` e corrigir somente as regressões introduzidas pelos arquivos da US1.

**Checkpoint**: US1 funciona de forma independente com lock, cursores e publicações preservados.

---

## Phase 4: User Story 2 — Recoletar um período histórico (Priority: P1)

**Goal**: Executar todos os coletores em modo de reconstrução com períodos permitidos e janela temporal fechada em inícios de dia do tenant.

**Independent Test**: `php artisan app:sync-microsoft365 --recollect-days=180` executa todos os coletores, reconstrói fotografias/relações e consulta as três fontes temporais em `[00:00 local − 180 dias, 00:00 local)`; `7`, `30` e `90` também são aceitos, enquanto `60`, zero, negativo e texto falham antes do ciclo.

### Tests for User Story 2

- [X] T020 [P] [US2] Cobrir em `orkestria360/tests/Feature/Microsoft365/SyncOperationCommandTest.php` os valores `7|30|90|180`, os inválidos `60|0|-1|texto`, exclusividade com `--force` e ausência de criação de ciclo/chamada Graph em erro.
- [X] T021 [P] [US2] Cobrir em `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php` as janelas UTC de `directory_audits` e `sign_ins` fechadas em 00:00:00, `coverage` v1 limitada pelo Graph e preservação de publicação/watermark em falha ou recoleta.
- [X] T022 [P] [US2] Cobrir em `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php` a janela de `risk_detections`, `coverage` v1 efetiva e preservação do último lote publicado em falha/restrição/recoleta.
- [X] T023 [P] [US2] Cobrir reconstrução global de fotografia e relações em `orkestria360/tests/Feature/UsersAccounts/UsersAccountsSyncTest.php`, `orkestria360/tests/Feature/Groups/GroupsSyncTest.php` e `orkestria360/tests/Feature/LicensingSyncTest.php`, incluindo a preservação de cursores em recoleta.

### Implementation for User Story 2

- [X] T024 [US2] Implementar em `orkestria360/app/Services/Microsoft365/Sync/SyncOperation.php` a janela `recollect_days` `[00:00 do dia local atual − N dias, 00:00 do dia local atual)` e expor decisões de reconstrução para todos os coletores.
- [X] T025 [US2] Aplicar `recollect_days` em `orkestria360/app/Services/Microsoft365/Sync/CanonicalAuditEventsCollector.php` e `orkestria360/app/Services/Microsoft365/Mfa/RiskDetectionsCollector.php`, gravando `coverage` v1 com limites solicitados/efetivos e motivo de limitação, sem avançar posições incrementais em nenhuma recoleta.
- [X] T026 [US2] Aplicar a reconstrução global em `orkestria360/app/Services/Microsoft365/UsersAccounts/UsersAccountsSynchronizer.php`, `orkestria360/app/Services/Microsoft365/UsersAccounts/GroupMembershipsCollector.php`, `orkestria360/app/Services/Microsoft365/Groups/GroupsSynchronizer.php` e coletores derivados de grupos para incluir fotografia e relações completas.
- [X] T027 [US2] Aplicar o bypass de cadência/reconstrução em `orkestria360/app/Services/Microsoft365/Licensing/LicensingSynchronizer.php` e nas chamadas de snapshots de identidade, MFA e risco em `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php`, preservando as dependências publicadas no ciclo atual.
- [X] T028 [US2] Expor `coverage` v1 e limitações de recoleta nas projeções existentes em `orkestria360/app/Services/Microsoft365/UsersAccounts/AuditEventsCollector.php`, `orkestria360/app/Services/Microsoft365/Mfa/MfaPageData.php` e `orkestria360/app/Services/Microsoft365/Sync/SyncStageRecorder.php` sem criar nova UI.
- [X] T029 [US2] Executar `composer ci:check` em `orkestria360/` e executar os testes específicos da US2 listados em `specs/008-sync-operation-flags/quickstart.md`.

**Checkpoint**: US2 é testável de forma independente; todos os coletores recebem a recoleta e a cobertura temporal é honesta.

---

## Phase 5: User Story 3 — Recoletar uma data informada (Priority: P2)

**Goal**: Recoletar o ciclo completo usando o dia civil explícito do tenant para fontes temporais.

**Independent Test**: `php artisan app:sync-microsoft365 --recollect-date=2026-08-13` reconstrói todas as fontes e usa `[2026-08-13 00:00, 2026-08-14 00:00)` convertido para UTC; datas inválidas/futuras falham antes do lock ou Graph.

### Tests for User Story 3

- [X] T030 [P] [US3] Adicionar parsing de data ISO, data inexistente/futura, exclusividade de opções e nenhuma alteração antes da validação em `orkestria360/tests/Feature/Microsoft365/SyncOperationCommandTest.php`.
- [X] T031 [P] [US3] Adicionar janelas UTC explícitas de dia civil e cobertura `complete|limited` para auditorias/sign-ins em `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php` e para riscos em `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php`.

### Implementation for User Story 3

- [X] T032 [US3] Implementar a validação de data e a janela semiaberta de `recollect_date` em `orkestria360/app/Services/Microsoft365/Sync/SyncOperation.php` e conectá-la à mensagem de erro em `orkestria360/app/Console/Commands/SyncMicrosoft365.php`.
- [X] T033 [US3] Propagar a janela de data resolvida para `orkestria360/app/Services/Microsoft365/Sync/CanonicalAuditEventsCollector.php`, `orkestria360/app/Services/Microsoft365/Mfa/RiskDetectionsCollector.php` e `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php`, mantendo a reconstrução dos coletores não temporais.
- [X] T034 [US3] Executar `composer ci:check` em `orkestria360/` e os testes de US3 em `orkestria360/tests/Feature/Microsoft365/SyncOperationCommandTest.php`, `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php` e `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php`.

**Checkpoint**: US3 é validável de forma independente por uma data explícita, timezone do tenant e janelas de dia civil.

---

## Phase 6: User Story 4 — Recoletar hoje rapidamente (Priority: P3)

**Goal**: Oferecer o atalho de recoleta do dia atual sem permitir que a mudança de dia durante o ciclo altere seus limites.

**Independent Test**: `php artisan app:sync-microsoft365 --recollect-today` é equivalente à data local resolvida uma vez no início do ciclo, mesmo perto de meia-noite; o scheduler semanal usa esse único modo.

### Tests for User Story 4

- [X] T035 [US4] Adicionar equivalência de janela solicitada entre `--recollect-today` e `--recollect-date` com relógio congelado no timezone do tenant, inclusive cruzando meia-noite, e provar em `orkestria360/tests/Feature/Microsoft365/SyncOperationCommandTest.php`, `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php` e `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php` que as três fontes temporais recebem o mesmo `observedAt` e cobertura `partial` até ele.
- [X] T036 [P] [US4] Atualizar a expectativa do agendamento semanal e remover a referência pública legada em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php`.

### Implementation for User Story 4

- [X] T037 [US4] Resolver `recollect_today` uma única vez como janela solicitada `[00:00 local, próximo 00:00 local)` em `orkestria360/app/Services/Microsoft365/Sync/SyncOperation.php`, calculando `effective_window` parcial até o `observedAt` comum enquanto o dia estiver em curso, e reutilizar a data resolvida no coordenador.
- [X] T038 [US4] Substituir o agendamento semanal `--full-reconciliation` por `--recollect-today` em `orkestria360/routes/console.php`, preservando horário, timezone e `withoutOverlapping()`.
- [X] T039 [US4] Executar `composer ci:check` em `orkestria360/` e os testes da US4 em `orkestria360/tests/Feature/Microsoft365/SyncOperationCommandTest.php`, `orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php`, `orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php` e `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php`.

**Checkpoint**: US4 é testável de forma independente, reproduz a data local e atualiza o agendamento semanal.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificar o contrato completo, remoções legadas e a entrega do ciclo.

- [X] T040 [P] Remover todas as referências públicas remanescentes a `--full-reconciliation` em `orkestria360/app/`, `orkestria360/routes/` e `orkestria360/tests/`.
- [X] T041 [P] Revisar telemetria, razões sanitizadas, publicações preservadas, etapas independentes e skips de dependência em `orkestria360/app/Services/Microsoft365/Sync/CoordinatedSyncCoordinator.php` e `orkestria360/app/Services/Microsoft365/Sync/SyncStageRecorder.php` contra `specs/008-sync-operation-flags/contracts/sync-operation-command.md`.
- [X] T042 Executar todos os cenários de `specs/008-sync-operation-flags/quickstart.md` em `orkestria360/`, incluindo `composer ci:check` e `composer test`.
- [X] T043 Atualizar o estado e os checkpoints concluídos em `specs/008-sync-operation-flags/tasks.md` somente após os gates de T042 passarem.
- [X] T044 [P] Criar regressões de compatibilidade de ciclos/lotes anteriores às novas colunas em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php` e `orkestria360/tests/Feature/Mfa/MfaPageDataTest.php`.
- [X] T045 [P] Criar em `orkestria360/tests/Feature/Microsoft365/CoordinatedSyncTest.php` uma matriz que prova a entrega do mesmo `SyncOperation`, incluindo o mesmo `observedAt`, a todos os coletores elegíveis, incluindo privilégios, MFA registration, risk users/detections, políticas MFA, atividade/licenciamento de grupos e projeções.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: sem dependências.
- **Phase 2**: depende de Phase 1 e bloqueia todas as histórias.
- **US1 e US2 (P1)**: dependem de Phase 2; implementar US1 antes de US2, pois US2 estende o contrato global de operação e a separação entre force/reconstrução.
- **US3 (P2)**: depende da infraestrutura de janelas de US2.
- **US4 (P3)**: depende da resolução de data de US3 e do contrato de janelas.
- **Polish**: depende de todas as histórias selecionadas.

### User Story Dependencies

```text
Setup → Foundation → US1 (force) → US2 (período) → US3 (data) → US4 (hoje) → Polish
```

As US2–US4 compartilham `SyncOperation` e os coletores temporais; por isso não devem ser implementadas em paralelo entre si. Os testes marcados `[P]` dentro de uma fase podem ser preparados em paralelo quando não editarem o mesmo arquivo.

### Parallel Opportunities

- Phase 1: T002 e T003.
- Phase 2: T005 e T006.
- US1: T012, T013 e T014.
- US2: T020, T021, T022 e T023.
- US3: T030 e T031.
- US4: T035 e T036.
- Polish: T040, T041, T044 e T045.

## Parallel Example: User Story 2

```text
Task: "Cobrir janelas e cobertura de auditorias/sign-ins em orkestria360/tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php"
Task: "Cobrir janela e preservação de risco em orkestria360/tests/Feature/Mfa/MfaSynchronizationTest.php"
Task: "Cobrir reconstrução de users, groups e licensing nos testes específicos em orkestria360/tests/Feature/"
```

## Implementation Strategy

### MVP First

1. Concluir Setup e Foundation.
2. Concluir US1 (`--force`) e executar seu checkpoint.
3. Demonstrar a execução forçada sem reset de cursores/publicações.

### Incremental Delivery

1. US1 entrega a operação forçada segura.
2. US2 entrega a reconstrução global por períodos oficiais e é a base das janelas.
3. US3 adiciona a data explícita sobre a mesma base.
4. US4 adiciona o atalho diário e migra o scheduler semanal.
5. T042 valida todos os fluxos e gates antes de marcar a feature concluída.

## Format Validation

Todas as 45 tarefas usam checkbox, ID sequencial, `[P]` somente quando paralelizáveis, rótulo `[US#]` em tarefas de história e pelo menos um caminho de arquivo explícito.
