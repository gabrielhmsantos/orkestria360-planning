# Data Model: Módulo Microsoft 365

## Overview

O domínio desta feature organiza a overview executiva do tenant Microsoft 365 como um payload agregado servido por backend Laravel, alimentado por dados reais do Microsoft Graph em modo app-only. Não há persistência obrigatória nova nesta fase; o modelo descreve entidades de contrato, o seam de integração Graph ativo no backend e o mecanismo de cache/snapshot que sustenta os blocos quando uma chamada Graph falha transitóriamente.

## Entity: Microsoft365Overview

**Purpose**: Representa a composição executiva completa da página `/microsoft-365`.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `summaryCards` | collection | Required, exactly 4 indicadores executivos |
| `secureScore` | object | Required |
| `serviceStatus` | collection | Required, exactly 8 monitored services in phase 1 |
| `licenseDistribution` | collection | Required, values must be non-negative |
| `serviceUsage30d` | collection | Required, period fixed to 30-day executive view |
| `recommendations` | collection | Required, exactly 5 executive recommendations |
| `tenantHighlights` | collection | Required, 2 to 4 editorial insights |
| `recentActivity` | collection | Required, 3 to 5 executive events |
| `nextStep` | object | Required, exactly 1 recommended action block |

**Relationships**:

- Composed of `SummaryIndicator`
- Composed of `SecureScoreSnapshot`
- Composed of `ServiceHealthItem`
- Composed of `LicenseDistributionSlice`
- Composed of `UsageSignal`
- Composed of `Recommendation`
- Composed of `EditorialInsight`
- Composed of `RecentActivityItem`
- Composed of `NextStepRecommendation`

**Validation Rules**:

- Todos os blocos essenciais da overview devem existir no payload, mesmo quando algum dado vier vazio ou parcial do Graph.
- A ordem dos blocos deve permanecer compatível com a UX atual do módulo.
- O payload deve aceitar combinação de dados `graph-backed` (fresco ou stale de cache/snapshot) e `editorial` sem quebrar a leitura executiva. Não existe `mock`.
- Todo bloco estruturado carrega `lastUpdatedAt` e `fresh`; quando `fresh: false`, o valor vem de cache/snapshot e a UI exibe "Última att. em {tempo relativo}".
- Blocos editoriais são obrigatórios como suporte contextual, mas não substituem nem contradizem blocos estruturados reais.

## Entity: SummaryIndicator

**Purpose**: Representa um KPI agregado da escala do tenant.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required, unique in page scope |
| `label` | string | Required |
| `value` | number or formatted string | Required |
| `trend` | string nullable | Optional |
| `lastUpdatedAt` | datetime nullable | Timestamp of last successful Graph call |
| `fresh` | boolean | `true` when value is live; `false` when served from cache/snapshot |
| `source` | enum | `graph-users`, `graph-groups`, `graph-subscribed-skus`, `graph-service-health` |

**Derived Rules**:

- Deve cobrir ao menos usuários, grupos, licenças e serviços monitorados.
- Valores devem ser coerentes com os demais blocos da overview.
- Os quatro indicadores executivos da fase 1 são fixos: `users`, `groups`, `licenses`, `services`.
- `source` reflete a origem real da chamada Graph; não existe `mock`.
- Quando `fresh: false`, o valor exibido é o último snapshot cacheado e a UI mostra "Última att. em {tempo relativo}".

## Entity: SecureScoreSnapshot

**Purpose**: Representa a fotografia atual da postura de segurança do tenant.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `value` | number | Required, non-negative |
| `maxValue` | number | Required, greater than `0` |
| `targetLabel` | string | Required |
| `lastUpdatedAt` | datetime nullable | Timestamp of last successful Graph call |
| `fresh` | boolean | `true` when live; `false` when served from cache/snapshot |
| `source` | enum | `graph-secure-scores` |

**Validation Rules**:

- `value` não pode exceder `maxValue`.
- O snapshot deve permitir leitura executiva mesmo sem data de atualização real.
- `source` reflete a chamada real a `/security/secureScores`; não existe `mock`.
- Quando `fresh: false`, o snapshot é o último valor cacheado e a UI mostra "Última att. em {tempo relativo}".

## Entity: ServiceHealthItem

**Purpose**: Representa o estado resumido de um serviço Microsoft 365 monitorado.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required, unique |
| `name` | string | Required |
| `status` | enum | `healthy`, `attention`, `risk` |
| `detail` | string | Required |
| `lastUpdatedAt` | datetime nullable | Timestamp of last successful Graph call |
| `fresh` | boolean | `true` when live; `false` when served from cache/snapshot |
| `source` | enum | `graph-service-health` |

**Validation Rules**:

- Deve aceitar serviços com estado parcial ou sem sinal suficiente.
- O status deve ser coerente com a linguagem visual padrão do produto.
- Quando o serviço não estiver habilitado ou sem sinal suficiente, o item continua presente com estado informativo normalizado no detalhe.

## Entity: LicenseDistributionSlice

**Purpose**: Representa a distribuição executiva de licenças contratadas/consumidas.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `label` | string | Required |
| `value` | number | Required, non-negative |
| `skuPartNumber` | string nullable | Optional |
| `lastUpdatedAt` | datetime nullable | Timestamp of last successful Graph call |
| `fresh` | boolean | `true` when live; `false` when served from cache/snapshot |
| `source` | enum | `graph-subscribed-skus` |

## Entity: UsageSignal

**Purpose**: Representa um recorte agregado de adoção de workloads no período executivo de 30 dias.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `label` | string | Required |
| `value` | number | Required, non-negative |
| `workload` | string nullable | Optional |
| `period` | enum | Fixed as `D30` in current overview |
| `lastUpdatedAt` | datetime nullable | Timestamp of last successful Graph call |
| `fresh` | boolean | `true` when live; `false` when served from cache/snapshot |
| `source` | enum | `graph-reports` |

**Derived Rules**:

- Quando vier de Microsoft Graph real, este bloco pode depender de transformação de CSV intermediário em coleção interna do backend.
- O modelo interno deve abstrair a origem tabular do relatório para preservar um contrato de página consistente.
- A ausência de dados do relatório não remove o bloco; o backend devolve estado vazio ou parcial coerente com o restante da overview.

## Entity: Recommendation

**Purpose**: Representa uma ação priorizada para elevar a postura ou reduzir risco do tenant.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required, unique |
| `title` | string | Required |
| `severity` | enum | `critical`, `high`, `medium`, `low` |
| `category` | string nullable | Optional |
| `potentialScoreImpact` | number nullable | Optional |
| `lastUpdatedAt` | datetime nullable | Timestamp of last successful Graph call |
| `fresh` | boolean | `true` when live; `false` when served from cache/snapshot |
| `source` | enum | `graph-secure-score-controls` |

**Derived Rules**:

- Recomendações devem ser ordenadas por severidade ou impacto.
- A overview exibe exatamente 5 recomendações executivas, não o catálogo completo.

## Entity: EditorialInsight

**Purpose**: Representa highlights narrativos que ajudam a explicar o estado atual do tenant.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required |
| `title` | string | Required |
| `detail` | string | Required |
| `source` | enum | Fixed as `editorial` in current phase |

**Validation Rules**:

- Deve haver entre 2 e 4 insights por overview.
- Cada insight deve ser coerente com sinais estruturados ou premissas documentadas do tenant.

## Entity: RecentActivityItem

**Purpose**: Representa um evento recente relevante para a leitura executiva do tenant.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required |
| `title` | string | Required |
| `timeLabel` | string | Required |
| `category` | enum nullable | `service`, `identity`, `security`, `usage`, `license` |
| `source` | enum | `editorial`, `graph-service-comms`, `graph-reports`, `future-audit` |

**Validation Rules**:

- Permanece editorial por design nesta feature, ancorado nos sinais estruturados reais agora disponíveis.
- Deve aceitar ausência de fonte canônica única sem comprometer o restante do payload.
- Deve conter entre 3 e 5 itens em linguagem executiva coerente com os demais blocos.

## Entity: NextStepRecommendation

**Purpose**: Representa a ação executiva única sugerida ao usuário ao final da overview.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `title` | string | Required |
| `body` | string | Required |
| `actionLabel` | string | Required |
| `source` | enum | Fixed as `editorial` in current phase |

**Validation Rules**:

- Deve existir exatamente um `nextStep` por overview.
- Deve derivar do principal gap de risco, adoção, operação ou postura de segurança percebido na página.

## Entity: MicrosoftGraphIntegrationSeam

**Purpose**: Representa o seam técnico do backend que consome Microsoft Graph em modo app-only para alimentar os blocos estruturados da overview, com cache/snapshot para resiliência.

**Fields**:

| Field | Type | Rules |
|-------|------|-------|
| `authMode` | enum | Fixed as `app_only` for this feature |
| `clientLibrary` | string | Baseline `microsoft/microsoft-graph` with `microsoft/kiota-authentication-phpleague` and `microsoft/kiota-http-guzzle` |
| `credentialInputs` | collection | `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET` via environment |
| `scope` | string | `https://graph.microsoft.com/.default` |
| `fallbackPolicy` | string | Manual HTTP only for endpoint-specific gaps (ex: CSV de reports) |
| `reportParseExceptions` | collection | Includes report endpoints that return CSV instead of Graph JSON collections |
| `cachePolicy` | object | Cache storage nativo do Laravel (driver de `config/cache.php`) per-block: `Cache::put("m365.block.{key}", { value, lastUpdatedAt }, TTL)`; TTL configurável por bloco (valores específicos são decisão de implementação, não requisito de especificação); serve snapshot with `fresh: false` on Graph failure; snapshot atualizado automaticamente em recovery |
| `diagnosticStates` | collection | `graph-backed`, `stale`, `partial`, `editorial`, `empty`, `informational` |

**State Transitions**:

| From | Trigger | To |
|------|---------|----|
| `unconfigured` | env credentials present and valid | `graph_active` |
| `graph_active` | successful Graph call for a block | `graph-backed` (fresh) |
| `graph_active` | transient Graph failure (timeout/429/5xx) on a block with cached snapshot | `stale` (cache/snapshot served, `fresh: false`) |
| `graph_active` | transient Graph failure on a block without cached snapshot | `empty` or `informational` |
| `graph_active` | endpoint returns empty or workload not enabled | `block_informational` |
| `stale` | Graph recovers on next request | `graph-backed` (fresh) |

## Scale Assumptions

- Overview atual mantém 4 summary cards e 8 serviços monitorados, lidos do tenant real.
- O contrato deve suportar tenants com dados vazios, parciais ou não habilitados vindos do Graph.
- A primeira entrega não exige histórico persistido nem paginação de blocos na overview; o cache/snapshot usa o cache storage nativo do Laravel (driver de `config/cache.php`, TTL controlado por bloco) e serve como resiliência em falhas transitórias.
- A integração ativa deve suportar tanto coleções JSON `value[]` quanto relatórios CSV temporários vindos de endpoints específicos de reports.
- Credenciais, tokens e detalhes sensíveis do seam Graph permanecem exclusivamente no backend ou ambiente seguro.
- Falhas transitórias do Graph não derrubam a overview; o bloco afetado é servido do cache/snapshot (`fresh: false`) com indicador "Última att. em {tempo relativo}", ou normalizado para `empty`/`informational` quando não há snapshot disponível.
