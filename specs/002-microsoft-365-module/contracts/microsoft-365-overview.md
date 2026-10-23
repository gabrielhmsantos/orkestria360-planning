# Contract: Microsoft 365 Overview

## Scope

Contrato interno entre backend Laravel e frontend Inertia/React para a overview executiva do módulo Microsoft 365 em `/microsoft-365`, alimentada por dados reais do Microsoft Graph em modo app-only.

Neste contrato, `tenant` significa o contexto autenticado atual da Contoso Ltda. no POC. Esta feature não expõe fluxo de configuração da integração nem API pública separada para terceiros. As credenciais do App Registration no Entra ID do tenant Contoso já estão disponíveis no ambiente do backend.

## Route Contract

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/microsoft-365` | Renderiza a overview executiva do tenant Microsoft 365 | Authenticated |

## Inertia Page Contract: `/microsoft-365`

```ts
type BlockFreshness = {
  lastUpdatedAt: string | null;
  fresh: boolean;
};

type Microsoft365OverviewPageData = {
  summaryCards: Array<{
    id: string;
    label: string;
    value: string | number;
    trend?: string | null;
    source: 'graph-users' | 'graph-groups' | 'graph-subscribed-skus' | 'graph-service-health';
  } & BlockFreshness>;
  secureScore: {
    value: number;
    maxValue: number;
    targetLabel: string;
    source: 'graph-secure-scores';
  } & BlockFreshness;
  serviceStatus: Array<{
    id: string;
    name: string;
    status: 'healthy' | 'attention' | 'risk';
    detail: string;
    source: 'graph-service-health';
  } & BlockFreshness>;
  licenseDistribution: Array<{
    label: string;
    value: number;
    skuPartNumber?: string | null;
    source: 'graph-subscribed-skus';
  } & BlockFreshness>;
  serviceUsage30d: Array<{
    label: string;
    value: number;
    workload?: string | null;
    period: 'D30';
    source: 'graph-reports';
  } & BlockFreshness>;
  recommendations: Array<{
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category?: string | null;
    potentialScoreImpact?: number | null;
    source: 'graph-secure-score-controls';
  } & BlockFreshness>;
  tenantHighlights: Array<{
    id: string;
    title: string;
    detail: string;
    source: 'editorial';
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    timeLabel: string;
    category?: 'service' | 'identity' | 'security' | 'usage' | 'license';
    source: 'editorial';
  }>;
  nextStep: {
    title: string;
    body: string;
    actionLabel: string;
    source: 'editorial';
  };
};
```

> **Convenção de `source`**: valores `graph-*` refletem chamadas reais ao Microsoft Graph. `editorial` identifica blocos curados ancorados nos sinais estruturados reais. Não existe `mock`: a origem dos blocos estruturados é sempre o Graph real.
>
> **Convenção de `BlockFreshness`**: todo bloco estruturado carrega `lastUpdatedAt` (timestamp ISO do último sucesso da chamada Graph) e `fresh` (booleano indicando se o valor exibido foi obtido em tempo real nesta requisição). Quando `fresh: false`, o bloco está sendo servido a partir de um **cache/snapshot** do último valor bem-sucedido, e a UI deve exibir o indicador "Última att. em {tempo relativo}" para o usuário. Blocos editoriais não carregam `BlockFreshness`.

## Contract Rules

- Todos os blocos essenciais da overview devem ser enviados em uma única resposta Inertia.
- A página deve permanecer acessível a qualquer usuário autenticado nesta fase.
- O contrato deve aceitar combinação de blocos `graph-*` (origem real do Graph) e `editorial`. Não existe `mock`.
- Todo bloco estruturado carrega `lastUpdatedAt` e `fresh`; quando `fresh: false`, o valor é servido de cache/snapshot e a UI exibe "Última att. em {tempo relativo}".
- `recentActivity`, `tenantHighlights` e `nextStep` permanecem editoriais por design, ancorados nos sinais estruturados reais agora disponíveis via Graph; não carregam `BlockFreshness`.
- O contrato deve tolerar dados vazios ou workloads não habilitados vindos do Graph sem quebrar a renderização.
- O contrato desta página é a referência normativa para a feature Microsoft 365 overview; `discovery/` permanece como racional de origem e visão de evolução.
- `summaryCards` contém exatamente 4 itens fixos: `users`, `groups`, `licenses`, `services`.
- `serviceStatus` contém exatamente 8 serviços monitorados na fase 1.
- `recommendations` contém exatamente 5 itens, ordenados por severidade e impacto executivo.
- `tenantHighlights` contém de 2 a 4 insights editoriais.
- `recentActivity` contém de 3 a 5 eventos executivos coerentes com os demais blocos.
- `nextStep` contém exatamente uma ação recomendada.
- Blocos editoriais são obrigatórios, mas não substituem nem contradizem os blocos estruturados reais.

## Canonical Status Mapping for Service Health

| Functional label | Technical key |
|------------------|---------------|
| `Saudável` | `healthy` |
| `Atenção` | `attention` |
| `Risco` | `risk` |

## Integration Seam Expectations

- A integração com Microsoft Graph é backend-only e ativa nesta feature.
- O padrão de autenticação é `app_only` com `ClientCredentialContext` (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET` via ambiente).
- O client é `GraphServiceClient` do stack oficial PHP composto por `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle`, com escopo padrão `https://graph.microsoft.com/.default`.
- O token é obtido, cacheado e renovado automaticamente pelo SDK.
- Chamadas HTTP manuais não devem ser o caminho principal do módulo; só como fallback pontual para exceções de endpoint (ex: CSV de reports).

## Official Endpoint Mapping

| Overview block | Microsoft Graph endpoint | Method | Response shape | Application permissions baseline | Notes |
|----------------|--------------------------|--------|----------------|----------------------------------|-------|
| `summaryCards[users]` | `/users` | `GET` | JSON collection in `value[]` of `user` | `User.Read.All` or `Directory.Read.All` | Supports `$count`, `$filter`, `$orderby`, `$search`, `$select`, `$top`; advanced queries may require `ConsistencyLevel: eventual` |
| `summaryCards[groups]` | `/groups` | `GET` | JSON collection in `value[]` of `group` | `Group.Read.All` or `Directory.Read.All` | Supports `$count`, `$filter`, `$orderby`, `$search`, `$select`, `$top`; advanced queries may require `ConsistencyLevel: eventual` |
| `summaryCards[licenses]` and `licenseDistribution` | `/subscribedSkus` | `GET` | JSON collection in `value[]` of `subscribedSku` | `LicenseAssignment.Read.All` | Key fields include `skuId`, `skuPartNumber`, `capabilityStatus`, `consumedUnits`, `prepaidUnits`, `servicePlans` |
| `summaryCards[services]` | Derived from the fixed 8-service monitored catalog reconciled with `/admin/serviceAnnouncement/healthOverviews` | `GET` | Derived scalar from `serviceHealth` collection plus fixed catalog | `ServiceHealth.Read.All` | Not a separate reports endpoint; the card represents the fixed quantity of monitored services present in the overview |
| `secureScore` | `/security/secureScores?$top=1` | `GET` | JSON collection in `value[]` of `secureScore` | `SecurityEvents.Read.All` | Use latest record for executive snapshot; key fields include `currentScore`, `maxScore`, `createdDateTime` |
| `recommendations` | `/security/secureScoreControlProfiles` | `GET` | JSON collection in `value[]` of `secureScoreControlProfile` | `SecurityEvents.Read.All` | Key fields include `title`, `controlCategory`, `remediation`, `implementationCost`, `remediationImpact`, `rank`, `maxScore` |
| `serviceStatus` | `/admin/serviceAnnouncement/healthOverviews` | `GET` | JSON collection in `value[]` of `serviceHealth` | `ServiceHealth.Read.All` | Base fields include `id`, `service`, `status`; may expand issues later |
| `serviceUsage30d` | `/reports/getOffice365ServicesUserCounts(period='D30')` | `GET` | `302 Found` to temporary CSV download | `Reports.Read.All` | This is a contract exception: backend must download and parse CSV instead of consuming `value[]` JSON |

## Key Response Fields by Block

- `users`: `id`, `displayName`, `mail`, `userPrincipalName`
- `groups`: `id`, `displayName`, `groupTypes`, `mail`, `mailNickname`
- `subscribedSkus`: `skuId`, `skuPartNumber`, `consumedUnits`, `prepaidUnits.enabled`, `capabilityStatus`
- `secureScores`: `currentScore`, `maxScore`, `createdDateTime`, `licensedUserCount`, `controlScores`
- `secureScoreControlProfiles`: `id`, `title`, `controlCategory`, `remediation`, `implementationCost`, `remediationImpact`, `rank`, `maxScore`
- `healthOverviews`: `id`, `service`, `status`
- `getOffice365ServicesUserCounts` CSV: `Report Refresh Date`, `Exchange Active`, `OneDrive Active`, `SharePoint Active`, `Teams Active`, `Office 365 Active`, `Report Period`

## Block State Rules

- `summaryCards`: nunca desaparecem; valores devem permanecer coerentes entre si e com os demais blocos; o card `services` representa a quantidade fixa de serviços monitorados na overview, não um relatório de adoção 30d.
- `serviceStatus`: cada um dos 8 serviços permanece no payload mesmo quando o workload estiver não habilitado, sem sinal suficiente ou com dado parcial; o detalhe comunica estado informativo.
- `licenseDistribution`: pode retornar vazio quando não houver composição útil para o tenant, mas o bloco permanece presente.
- `serviceUsage30d`: pode representar estado parcial ou vazio sem expor CSV bruto ao cliente.
- `recommendations`: se menos de 5 recomendações estruturadas estiverem disponíveis, o backend mantém uma lista executiva coerente com os sinais disponíveis sem quebrar a cardinalidade prevista da página.
- `tenantHighlights`, `recentActivity` e `nextStep`: devem permanecer coerentes com os blocos estruturados e com as premissas documentadas do tenant.

## Error and Empty-State Contract

- A ausência de dados do Graph para um bloco não deve impedir a renderização da overview completa.
- Workloads não habilitados devem ser comunicados como estado informativo, não como falha de sistema.
- Se uma chamada Graph falhar (timeout, 429, 5xx, token expirado), o backend deve servir o **cache/snapshot** do último valor bem-sucedido daquele bloco, marcar `fresh: false` e preencher `lastUpdatedAt` com o timestamp do snapshot; a UI exibe "Última att. em {tempo relativo}".
- Se não existir snapshot cacheado para o bloco (primeira execução ou cache expirado/inválido), o backend normaliza o bloco para estado `empty` ou `informational`, sem servir dados fictícios.
- O bloco `serviceUsage30d` deve aceitar transformação backend a partir do CSV oficial (`302` → download → parsing) sem expor esse formato bruto ao contrato Inertia.
- Credenciais, tokens, consentimentos e detalhes sensíveis do seam Graph não fazem parte do contrato Inertia e não podem ser expostos ao cliente.
- O backend deve conseguir distinguir internamente blocos `graph-backed` (fresco), `stale` (cache/snapshot servido), `partial`, `editorial`, `empty` e `informational` para diagnóstico sem alterar o shape público do contrato.
- Se as credenciais do App Registration estiverem ausentes ou inválidas, o backend deve comunicar indisponibilidade de forma segura e estruturada ao usuário autenticado, sem expor detalhes de autenticação.
