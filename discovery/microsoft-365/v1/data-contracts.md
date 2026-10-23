# Data Contracts — Microsoft 365

## Objetivo

Definir os contratos futuros do módulo Microsoft 365 de forma compatível com Inertia + React e alinhada às superfícies oficiais da Microsoft Graph.

Os contratos abaixo não obrigam a integração real já na POC, mas servem como alvo estável para a implementação.

## Contrato da Overview

```ts
type Microsoft365OverviewPageData = {
  summaryCards: MetricCardData[];
  secureScore: {
    value: number;
    maxValue: number;
    targetLabel: string;
    lastUpdatedAt: string | null;
    source: 'mock' | 'graph-secure-scores';
  };
  serviceStatus: {
    id: string;
    name: string;
    status: 'healthy' | 'attention' | 'risk';
    detail: string;
    source: 'mock' | 'graph-service-health';
  }[];
  licenseDistribution: {
    label: string;
    value: number;
    skuPartNumber?: string | null;
    source: 'mock' | 'graph-subscribed-skus';
  }[];
  serviceUsage30d: {
    label: string;
    value: number;
    workload?: string | null;
    period: 'D30';
    source: 'mock' | 'graph-reports';
  }[];
  recommendations: {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category?: string | null;
    potentialScoreImpact?: number | null;
    source: 'mock' | 'graph-secure-score-controls';
  }[];
  tenantHighlights: {
    id: string;
    title: string;
    detail: string;
    source: 'editorial';
  }[];
  recentActivity: {
    id: string;
    title: string;
    timeLabel: string;
    category?: 'service' | 'identity' | 'security' | 'usage' | 'license';
    source: 'mock' | 'graph-service-comms' | 'graph-reports' | 'future-audit';
  }[];
  nextStep: {
    title: string;
    body: string;
    actionLabel: string;
    source: 'editorial';
  };
};
```

## Rastreabilidade por Bloco

| Campo | Origem oficial futura recomendada |
| --- | --- |
| `summaryCards[users]` | `/users` e/ou `getOffice365ActiveUserCounts` |
| `summaryCards[licenses]` | `/subscribedSkus` |
| `summaryCards[services]` | `healthOverviews` ou catálogo fixo de serviços monitorados |
| `summaryCards[groups]` | `/groups` |
| `secureScore` | `/security/secureScores` |
| `serviceStatus` | `/admin/serviceAnnouncement/healthOverviews` |
| `licenseDistribution` | `/subscribedSkus` |
| `serviceUsage30d` | `/reports/getOffice365ServicesUserCounts` e relatórios por workload |
| `recommendations` | `/security/secureScoreControlProfiles` |
| `tenantHighlights` | composição editorial baseada nos demais blocos |
| `recentActivity` | `serviceAnnouncement`, `reports/*` e futura auditoria |
| `nextStep` | composição editorial baseada em remediações e gaps |

## Contratos Futuros por Subárea

### Licenciamento

```ts
type Microsoft365LicensingPageData = {
  summaryCards: MetricCardData[];
  skuRows: {
    id: string;
    displayName: string;
    skuPartNumber: string;
    capabilityStatus: string;
    consumedUnits: number;
    totalUnits: number;
    availableUnits: number;
    source: 'mock' | 'graph-subscribed-skus';
  }[];
  optimizationHighlights: RecommendationItem[];
};
```

### Usuários e Contas

```ts
type Microsoft365UsersPageData = {
  summaryCards: MetricCardData[];
  userRows: {
    id: string;
    displayName: string;
    userPrincipalName: string;
    department?: string | null;
    accountEnabled?: boolean | null;
    lastActivityDate?: string | null;
    source: 'mock' | 'graph-users' | 'graph-reports';
  }[];
};
```

### Grupos

```ts
type Microsoft365GroupsPageData = {
  summaryCards: MetricCardData[];
  groupRows: {
    id: string;
    displayName: string;
    typeLabel: string;
    memberCount?: number | null;
    activityScore?: number | null;
    source: 'mock' | 'graph-groups' | 'graph-group-reports';
  }[];
};
```

### MFA

```ts
type Microsoft365MfaPageData = {
  coverage: {
    registeredUsers: number;
    enabledUsers: number;
    capableUsers: number;
    source: 'mock' | 'graph-auth-methods';
  };
  signInMetrics: {
    successRate: number;
    period: 'PT1M' | 'D7' | 'D30';
    source: 'mock' | 'graph-mfa-metrics';
  };
};
```

### Secure Score

```ts
type Microsoft365SecureScorePageData = {
  score: {
    value: number;
    maxValue: number;
    lastUpdatedAt: string | null;
    source: 'mock' | 'graph-secure-scores';
  };
  controls: {
    id: string;
    title: string;
    category?: string | null;
    remediation?: string | null;
    tenantScore?: number | null;
    maxScore?: number | null;
    source: 'mock' | 'graph-secure-score-controls';
  }[];
};
```

## Notas de Implementação

- O contrato atual `Microsoft365PageData` pode evoluir para `Microsoft365OverviewPageData` sem quebrar a UX existente.
- A fase 1 não precisa expor todos os campos novos visualmente; alguns podem entrar primeiro como estrutura backend-friendly.
- `source` foi incluído para facilitar testes, staging mockado e futura troca gradual de origem de dados.
