# Implementation Plan: Modos Operacionais do Sync Microsoft 365

**Branch**: `feat/008-sync-operation-flags` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação de quatro modos operacionais para o ciclo coordenado Microsoft 365.

## Summary

Substituir a flag legada `--full-reconciliation` por uma intenção operacional explícita, resolvida no início de `app:sync-microsoft365`: rotina, forçada, recoleta por período, por data e pela data atual do tenant. O comando validará opções antes de obter o lock; o coordenador passará o mesmo objeto de operação a **todos os coletores do ciclo**, preservará a exclusividade por tenant e registrará intenção, janelas UTC solicitada e efetiva, timezone e cobertura. Nas recoletas, fontes de estado reconstruirão fotografias completas e fontes temporais aplicarão a janela solicitada; nenhuma flag reduz o conjunto de coletores elegíveis. Cada fonte continua publicando atomicamente e falhas não impedem fontes independentes nem substituem a dependência exigida no ciclo atual.

## Technical Context

**Language/Version**: PHP 8.3+, Laravel 13.7; TypeScript 5.7 sem alteração de UI prevista.
**Primary Dependencies**: Laravel Artisan, Scheduler, cache locks e Eloquent; Microsoft Graph SDK/Kiota 2 já encapsulado por `GraphClient`.
**Storage**: Banco relacional existente; `microsoft365_sync_cycles`, `microsoft365_sync_stages`, posições de coleta e lotes de ingestão/publicação existentes.
**Testing**: PHPUnit 12, testes de comando/scheduler/coordenador/coletores Graph; `composer ci:check` por lote e `composer test` ao fim.
**Target Platform**: Monólito Laravel, execução CLI e scheduler para um tenant configurado; timezone vem de `TenantActivitySetting`.
**Project Type**: Aplicação web monolítica com comando operacional interno.
**Performance Goals**: Cada modo aciona todos os coletores elegíveis uma vez por ciclo; nas recoletas, apenas a leitura das fontes temporais fica limitada ao intervalo solicitado. `--force` mantém a coleta incremental e a deduplicação das fontes.
**Constraints**: Validar opções antes de criar ciclo ou chamar fonte; janelas são calculadas uma vez no timezone do tenant e persistidas em UTC; uma recoleta da data atual, explícita ou por `recollect_today`, declara cobertura parcial até `observed_at` UTC congelado no início do ciclo; lock global por tenant é renovado antes de expirar inclusive em paginação/retries e a perda de ownership aborta antes de nova promoção; nenhuma chamada Graph ocorre na transação de promoção; última publicação válida sobrevive a falha; recoletas não alteram posições incrementais.
**Scale/Scope**: Um tenant por execução, todas as etapas do ciclo coordenado existente (identidades, grupos, relações, licenciamento, snapshots e eventos); sem nova tela, RBAC, multi-tenant batch, fila ou nova fonte Graph.

## Constitution Check

### Antes da pesquisa

- **Laravel-Conventional by Default**: Estender o `#[Signature]` do comando Artisan, a definição `Schedule::command`, migrations e modelos Eloquent existentes. O modo será um value object PHP focado no comando/coordenador, necessário para evitar combinações de booleans ambíguas e para transportar janela e semântica iguais a todos os coletores.
- **Consistent User Experience**: Não há superfície visual. As páginas existentes continuam consumindo `SourceMetadata`, `DataFreshness` e estados publicados; o contrato de cobertura terá a janela efetiva sem inventar UI.
- **Verifiable Quality Gates**: A mudança alcança comando, agendamento, persistência e fluxos Graph: testar parsing/validação, lock, propagação, janelas, publicação e falhas; rodar `composer ci:check` em checkpoints e `composer test` ao encerrar.
- **POC Scope with Controlled Full-Stack Evolution**: As integrações Graph e as publicações locais já são reais. A feature muda somente sua operação; não adiciona novas fontes, telas, permissões, jobs distribuídos ou remoção antecipada de dados.
- **Simplicity Without Overengineering**: Um objeto imutável de operação e colunas diretamente no ciclo/lote bastam; não introduzir máquina de workflow, command bus ou configuração dinâmica de estratégias por fonte.
- **Surface-to-Story Traceability**: US1–US4 são operação de CLI e especificam `N/A` para superfícies/cards. Não há tela, tab ou subpágina a mapear.
- **Single Application Audience**: A execução continua restrita ao ambiente operacional já autorizado; não há RBAC, perfis ou diferenciação de dados.

**Resultado do gate**: aprovado. Não há clarificação pendente.

### Depois do design

- O objeto `SyncOperation` centraliza somente a intenção, as opções e a janela calculada, e os coletores continuam donos de suas estratégias de persistência/publicação; o lock do coordenador é renovado a cada etapa segura.
- `Microsoft365SyncCycle` armazena o modo e a janela solicitada; lotes temporais registram `coverage` v1 com janelas solicitada/efetiva, limite observado, status e razão. Assim o relatório não infere cobertura de valores transitórios ou horas futuras.
- Os contratos mantêm `--force` como modo independente de frequência e preservação de cursor, enquanto qualquer `--recollect-*` seleciona reconstrução. As duas intenções são mutuamente exclusivas, eliminando uma combinação redundante e ambígua.
- Os testes mantêm fontes independentes em execução e dependentes puladas com motivo ao falhar a publicação corrente.

**Resultado do gate**: aprovado. O value object é a menor complexidade que elimina os dois booleans incompatíveis e não viola princípios.

## Project Structure

### Documentation (this feature)

```text
specs/008-sync-operation-flags/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── sync-operation-command.md
└── tasks.md                         # criado por /speckit-tasks
```

### Source Code

```text
orkestria360/
├── app/
│   ├── Console/Commands/SyncMicrosoft365.php
│   ├── Models/
│   │   ├── Microsoft365SyncCycle.php
│   │   └── Microsoft365EventIngestionBatch.php
│   └── Services/Microsoft365/
│       ├── Sync/
│       │   ├── CoordinatedSyncCoordinator.php
│       │   ├── SyncOperation.php                 # novo value object
│       │   └── CanonicalAuditEventsCollector.php
│       ├── UsersAccounts/
│       │   ├── UsersAccountsSynchronizer.php
│       │   └── GroupMembershipsCollector.php
│       ├── Groups/GroupsSynchronizer.php
│       ├── Licensing/LicensingSynchronizer.php
│       └── Mfa/RiskDetectionsCollector.php
├── database/migrations/
│   ├── *_add_operation_metadata_to_microsoft365_sync_cycles_table.php
│   └── *_add_requested_window_and_coverage_to_microsoft365_event_ingestion_batches_table.php
├── routes/console.php
└── tests/Feature/Microsoft365/
    ├── CoordinatedSyncTest.php
    ├── CoordinatedSyncScheduleTest.php
    └── CanonicalAuditEventsCollectorTest.php
```

**Structure Decision**: A implementação fica no monólito e no ciclo coordenado existente. `SyncOperation` é um contrato interno, sem nova camada de serviço: o comando o cria e valida, o coordenador o persiste e os sincronizadores/coletores recebem suas decisões explícitas.

## Delivery Plan

### Phase 1 — Contrato operacional e validação antecipada

1. Criar `SyncOperation` imutável com modos `routine`, `force`, `recollect_days`, `recollect_date` e `recollect_today`; representar se deve ignorar cadência, reconstruir estado, preservar posições incrementais e qual é a janela temporal. Resolver `today` e limites de dia uma vez, no timezone do tenant, para UTC.
2. Trocar a assinatura pública por `--force`, `--recollect-days=`, `--recollect-date=` e `--recollect-today`; remover `--full-reconciliation`. Validar que `--recollect-days` seja exatamente `7`, `30`, `90` ou `180` (períodos Learn `D7`, `D30`, `D90`, `D180`), data ISO existente/não futura e exclusividade entre todos os modos (`--force` ou exatamente um `--recollect-*`) antes de lock, ciclo, seed ou acesso Graph; rejeitar inclusive `60` e `--force` combinado a recoleta.
3. Adaptar resumo do console para identificar modo solicitado, timezone, janela solicitada/efetiva e cobertura/restrições por etapa, preservando o código de saída atual para lock ou ausência de etapa primária publicada.
4. Escrever primeiro os testes de console para os quatro valores aceitos de período, `60`/zero/negativo/texto como inválidos, qualquer combinação de dois modos (inclusive `--force` + recoleta), data futura e lock; retirar expectativas de `--full-reconciliation`.

### Phase 2 — Propagação ao ciclo e publicação de fontes

1. Evoluir `CoordinatedSyncCoordinator::synchronize()` e **cada chamada de coletor** para receber `SyncOperation`, mantendo ordem de dependências e lock global renovável. Em todos os modos, tentar identidades, memberships, licenciamento, atividade, privilégios, MFA, riscos, grupos, relações, atividade/licenciamento de grupos, políticas MFA, auditorias, sign-ins e risk detections conforme suas dependências. Registrar no ciclo modo, flags normalizadas, timezone e janela solicitada; preservar compatibilidade dos dados históricos com colunas anuláveis/default seguro.
2. Nas fontes de estado e snapshots (identidades, memberships, licenciamento, atividade/projeções, privilégios, registro MFA, usuários de risco, grupos, relações, atividade/licenciamento de grupos e políticas MFA), fazer todo `--recollect-*` disparar a fotografia/reconciliação atual compatível com a fonte e ignorar controles de cadência/progresso que impediriam a reconstrução. Corrigir os sincronizadores de identidades/grupos para que `--force` não descarte `delta_link`: ele reexecuta todos os coletores elegíveis, mas não converte delta em full reconciliation nem reseta cursor/watermark.
3. Nas fontes temporais (`directory_audits`, `sign_ins`, `risk_detections`), usar a janela explícita como parte da recoleta global, sempre delimitada por inícios de dia no timezone do tenant e persistida em UTC: `recollect-days=N` usa `[00:00 do dia atual − N dias, 00:00 do dia atual)`; data/today solicitam `[00:00 da data, 00:00 do dia seguinte)`. Para `today` antes do fim do dia, `SyncOperation.observedAt` é congelado uma vez e limita igualmente as três fontes, que publicam `partial`/`dia_em_curso`. Renovar o lock antes de expirar entre páginas/retries e abortar antes de promoção se a renovação falhar. Em rotina e `--force`, manter watermark + overlap; em recoleta, preservar cursores/watermarks incrementais e não limitar a cobertura declarada ao solicitado quando Graph expuser limite menor.
4. Propagar modo e janela aos lotes/estados de fonte e ao `SyncStageRecorder` quando necessário para que falha preserve a última publicação válida e o resultado operacional revele modo, janelas solicitada/efetiva, cobertura versionada e limitação real.

### Phase 3 — Agendamento, independência e regressão

1. Substituir a execução semanal `--full-reconciliation` por `--recollect-today`, preservando timezone, horário e `withoutOverlapping`; manter a rotina diária e os prunes separados.
2. Cobrir por testes a reconstrução das fontes de estado, as janelas exatas dos três coletores temporais delimitadas às 00:00:00 do tenant (inclusive quando o comando roda no meio do dia), equivalência entre `--recollect-today` e a data local, estabilidade perto da mudança de dia, preservação de cursor em `--force` e deduplicação de conteúdo inalterado.
3. Cobrir isolamento: lock renovado bloqueia todos os modos, inclusive uma recoleta de 180 dias; falha de fonte preserva sua publicação, fontes independentes continuam e dependentes ficam `skipped` com motivo da dependência do ciclo atual.
4. Executar `composer ci:check` após cada lote e `composer test` para a feature completa; revisar a remoção de todos os consumidores públicos de `--full-reconciliation`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Value object `SyncOperation` | Os quatro modos carregam intenção, validação, janela e decisões que não podem ser representadas sem ambiguidade por dois ou mais booleans. | Acrescentar flags booleanas ao coordenador perpetua `force/full-reconciliation`, não transporta uma janela coerente e torna combinações inválidas fáceis de aceitar. |
