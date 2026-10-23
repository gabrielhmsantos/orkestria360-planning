# Data Model: Workflow Documental de Governança

## Overview

O domínio adiciona persistência real ao módulo de governança para 8 tópicos fixos, cada um com metadados, template, documento vigente, decisão administrativa e score agregado no overview.

## Entity: GovernanceTopic

**Purpose**: Representa um dos 8 tópicos documentais do módulo.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | bigint | Primary key |
| `slug` | string | Required, unique, fixo para cada tópico |
| `title` | string | Required |
| `template_path` | string | Required |
| `owner_name` | string nullable | Required para iniciar fluxo |
| `validity_months` | unsigned tiny/int nullable | Must be one of `3, 6, 9, 12, 24, 36, 48, 60` |
| `validity_starts_at` | date nullable | Preenchido na aprovação |
| `last_reviewed_at` | date nullable | Opcional |
| `notes` | text nullable | Opcional |
| `status` | string | Enum: `not_started`, `pending`, `in_progress`, `under_review`, `completed` |
| `template_downloaded_at` | datetime nullable | Primeiro download do template |
| `template_downloaded_by` | foreignId nullable | Usuário que baixou o template |
| `admin_score` | unsigned tiny/int nullable | Inteiro entre 0 e 100 |
| `approved_at` | datetime nullable | Data da aprovação vigente |
| `approved_by` | foreignId nullable | Usuário administrador que aprovou |
| `created_at` | timestamp | Laravel default |
| `updated_at` | timestamp | Laravel default |

**Relationships**:

- `currentDocument` hasOne `GovernanceTopicDocument`
- `templateDownloader` belongsTo `User` como trilha mínima de auditoria do primeiro download do template
- `approver` belongsTo `User`

**State Transitions**:

| From | Trigger | To |
|------|---------|----|
| `not_started` | preenchimento válido de `owner_name` e `validity_months` | `pending` |
| `pending` | template baixado pela primeira vez | `in_progress` |
| `in_progress` | documento enviado | `under_review` |
| `under_review` | novo envio antes da aprovação | `under_review` |
| `under_review` | aprovação com score | `completed` |
| `completed` | novo envio substituto | `under_review` |

**Derived Rules**:

- O tópico nasce em `not_started`.
- Quando `owner_name` e `validity_months` forem preenchidos pela primeira vez, o tópico passa a `pending`.
- `template_downloaded_by` registra o primeiro usuário autenticado que baixou o template oficial para fins mínimos de auditoria, sem exigir histórico completo de downloads.
- Quando aprovado, `validity_starts_at` recebe a data da aprovação.
- Quando um documento substitui uma versão já concluída, `admin_score`, `approved_at` e `approved_by` deixam de representar a versão atual até nova aprovação.
- O score do módulo é a média simples dos 8 `admin_score`, considerando `0` para tópicos não concluídos.

## Entity: GovernanceTopicDocument

**Purpose**: Representa o documento vigente submetido para um tópico.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | bigint | Primary key |
| `governance_topic_id` | foreignId | Required, unique enquanto houver um único documento ativo |
| `original_name` | string | Required |
| `storage_path` | string | Required |
| `mime_type` | string | Required |
| `uploaded_at` | datetime | Required |
| `uploaded_by` | foreignId | Required |
| `created_at` | timestamp | Laravel default |
| `updated_at` | timestamp | Laravel default |

**Relationships**:

- belongsTo `GovernanceTopic`
- belongs to `User` as uploader

**Validation Rules**:

- Upload permitido apenas após download do template
- Novo upload substitui o documento vigente
- Arquivo deve representar um documento aceito pelo fluxo definido em implementação
- O documento vigente deve permanecer acessível apenas para usuários autenticados do tenant

## Entity: GovernanceOverviewProjection

**Purpose**: Estrutura derivada para montar o payload Inertia do dashboard.

**Derived Fields**:

| Field | Source |
|-------|--------|
| `score.value` | média dos 8 tópicos |
| `summaryCards` | contagem por status + total |
| `documentRows` | tópicos com responsável, vigência, status, último envio e ação principal |
| `statusDistribution` | agregação por status |
| `nextStep` | próxima ação sugerida a partir do primeiro tópico crítico |

## Seed Data

Os 8 tópicos devem ser seedados com os seguintes slugs e títulos:

1. `inventario-de-ativos-de-ti`
2. `inventario-de-licencas-e-softwares`
3. `matriz-de-acessos-e-permissoes`
4. `mapa-de-rede-e-infraestrutura`
5. `politica-de-seguranca-da-informacao`
6. `procedimentos-de-controle-de-acessos`
7. `documentacao-de-processos-de-ti`
8. `relatorios-de-diagnostico-e-recomendacoes`

Os templates oficiais devem apontar para arquivos locais versionados ou preparados pelo app para cada slug.
