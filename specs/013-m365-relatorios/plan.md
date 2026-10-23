# Implementation Plan: Relatórios Microsoft 365 V1

**Branch**: `feat/013-m365-relatorios` | **Date**: 2026-09-02 | **Spec**: [spec.md](spec.md)

**Input**: feature specification at [spec.md](spec.md).

## Summary

Camada tenant-scoped de composição local: catálogo fechado, preflight, manifesto
imutável, CSV/XLSX one-shot efêmero e auditoria sanitizada. Licenciamento publica
uso e população append-only na mesma geração quando há denominador compatível;
inventário e o agregado `ActiveUserDetail D30` são famílias independentes por
tenant+conexão. Relatórios apenas os consome. Rotina/`--force` publicam `D30`, enquanto `--recollect-days` publica o
período histórico solicitado; `recollect_date` e `recollect_today` não criam
publicação de Licenciamento utilizável por Relatórios. Retention usa o pruner
central por tenant: estende Licenciamento e adiciona `ReportsRetentionPruner`.

## Technical Context

**Language/Version**: PHP/Laravel, TypeScript/React

**Primary Dependencies**: Inertia, PostgreSQL, componentes operacionais existentes,
`phpoffice/phpspreadsheet:^5.0` para XLSX server-side

**Storage**: PostgreSQL; arquivo de saída não persistido. CSV/XLSX usam somente
temporário local controlado durante a resposta, removido em `finally`.

**Testing**: PHPUnit feature tests, TypeScript/build e `composer ci:check`

**Target Platform**: aplicação web autenticada

**Project Type**: web application Laravel/Inertia

**Performance Goals**: composição de dados já publicados, sem chamada Graph no request; a UX apresenta preflight e estados de indisponibilidade sem bloquear o restante da página.

**Constraints**: isolamento estrito por tenant e conexão; PII não é ampliada;
CSV e XLSX serializam a mesma `frozen_projection`; XLSX é escrito com
PhpSpreadsheet e CSV com `fputcsv`, ambos para temporário efêmero. Hash/tamanho
vêm dos bytes do mesmo temporário transmitido; artefatos guardam somente esses
metadados, nunca path/blob/URL/storage persistente.

**Retention**: nenhuma rota/comando novo. `Microsoft365DataRetentionPruner`
orquestra `LicensingRetentionPruner` estendido e `ReportsRetentionPruner`;
janela preserva as âncoras factuais atuais e `all` remove integralmente o data
plane do tenant em ordem child→parent, com contagens de deletes reais. O cutoff
da geração de Licenciamento é exclusivamente `published_at` imutável; o de
Relatórios é `completed_at` de requests `completed`/`failed`.

**Scale/Scope**: oito superfícies de Relatórios M365 e três templates fechados na V1.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Passa: usa convenções existentes, uma história por superfície, estados explícitos, tenant isolation e testes de contrato. Nenhuma integração externa em request.

## Project Structure

### Documentation (this feature)

```text
specs/013-m365-relatorios/
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
├── app/Models, app/Services/Microsoft365/{Licensing,Reports}
├── database/migrations
├── resources/js/pages/modules, resources/js/components/modules
└── tests/Feature
```

**Structure Decision**: o módulo Relatórios fica no app; Licenciamento mantém a publicação histórica que lhe pertence.

## Decisão complementar — isolamento e famílias de coleta

- Cada customer tenant possui uma única conexão Microsoft; `licensing_sync_runs`
  e `licensing_source_states` permanecem tenant-scoped e a publicação guarda a
  conexão canônica do tenant.
- `/subscribedSkus` promove inventário independente de qualquer falha do Graph
  Reports. Uso e população só são promovidos juntos, para preservar a fórmula de
  adoção na mesma geração.
- `getOffice365ActiveUserDetail(D30)` publica somente a contagem agregada em
  `license_usage_publications` (`Office 365`/`active_users_detail`), sem CSV ou
  PII persistidos.
- A migration incremental de inventário congela a regra histórica de SKU; não há
  expansão de cardinalidade de conexão no domínio de sync.

## Complexity Tracking

Não há violações de constituição que exijam justificativa.
