# Local Projection Contracts — Microsoft 365 / Configurações

Estes contratos descrevem page data Inertia e mutações locais. Não são contratos para o Microsoft 365: nenhuma rota de tela/exportação aciona Graph, TCM ou outro serviço externo.

## Common envelope

Todo `GET` recebe somente a publicação local selecionada pelo tenant atual:

```ts
type ConfigurationPageEnvelope = {
  activeTab: ConfigurationTab;
  tabs: Array<{ key: ConfigurationTab; label: string; href: string }>;
  tenant: { name: string; timezone: string };
  publication: {
    id: string;
    status: 'published' | 'partial' | 'superseded';
    publishedAt: string;
    matrixVersion: string;
    baselineVersion: {
      id: string;
      key: string;
      version: string;
      type: string;
      origin: string;
      status: 'materialized' | 'retired';
      materializedAt: string;
      retiredAt: string | null;
    };
    isCurrent: boolean;
  } | null;
  sourceStates: ConfigurationSourceState[];
  filters: AppliedConfigurationFilters;
  resultState: 'available' | 'partial' | 'unavailable' | 'restricted';
  reason: string | null;
};

type ConfigurationSourceState = {
  source: string;
  sourceContractVersion: string;
  apiVersion: string | null;
  availabilityStatus: 'available' | 'restricted' | 'unavailable';
  resultState: 'complete' | 'partial' | 'empty_valid' | 'failed' | 'not_collected';
  coverage: ConfigurationCoverage;
  freshness: 'fresh' | 'stale' | 'unavailable';
  freshnessContract: string | null;
  lastCollectedAt: string | null;
  lastSuccessfulAt: string | null;
  reason: string | null;
};

type ConfigurationCoverage = {
  eligible: number | null;
  attempted: number | null;
  observed: number | null;
  matched: number | null;
  excluded: number | null;
  failed: number | null;
  unknown: number | null;
  comparable: number | null;
  percentage: number | null;
  applicable: Array<'eligible' | 'attempted' | 'observed' | 'matched' | 'excluded' | 'failed' | 'unknown' | 'comparable'>;
  description: string;
};

type PageDateMetadata = {
  sourceLastModifiedAt: string | null;
  lastObservedChangeAt: string | null;
  lastCollectedAt: string | null;
  publishedAt: string | null;
};
```

`sourceLastModifiedAt` vem apenas da fonte; `lastObservedChangeAt` vem apenas de diferença factual observada; `lastCollectedAt` vem da coleta/tentativa. `publishedAt` permanece metadata da publicação. `stale` preserva essas datas do último fato conhecido, reason e coverage, mas não aparece como `conformant`, `divergent`, `gateTriggered` nem contribui para score atual. Sem publicação, o envelope retorna `resultState: 'unavailable'`, coleção vazia e razão de primeira sincronização, nunca dados mockados.

`ConfigurationCoverage` conserva todas as populações que a fonte consegue
provar. Campos não aplicáveis ficam `null` e não são transformados em zero; a
UI pode resumir a cobertura, mas exportação e detalhe preservam os campos
originais. Em fan-out, `observed`/`matched` são fatos comprovados e nunca
sinônimos de “há uma row publicada”.

## Routes, filters and pagination

| Route (Inertia/local) | Tab/projection | Query filters |
|---|---|---|
| `GET /microsoft-365/configuracoes` | `dashboard` | `publication`, `domain`, `service`, `risk`, `availability`, `period` |
| `GET /microsoft-365/configuracoes/tenant` | `tenant` | acima + `status`, `source` |
| `GET /microsoft-365/configuracoes/identidade-acesso` | `identity-access` | acima + `critical`, `classificationState` |
| `GET /microsoft-365/configuracoes/colaboracao-compartilhamento` | `collaboration-sharing` | acima |
| `GET /microsoft-365/configuracoes/seguranca-compliance` | `security-compliance` | acima + `workload` |
| `GET /microsoft-365/configuracoes/por-servico` | `by-service` | acima + `service`, `category`, `setting` |
| `GET /microsoft-365/configuracoes/baselines-conformidade` | `baselines-compliance` | acima + `baseline` |
| `GET /microsoft-365/configuracoes/historico-auditoria` | `history-audit` | acima + `origin`, `drift`, `objectReference` |
| `GET /microsoft-365/configuracoes/exportar` | CSV UTF-8 | aceita exatamente filtros da superfície/consulta indicada; mesma query e mesma publicação local. |

Tabelas paginadas retornam:

```ts
type LocalPagination<T> = {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  previous: { label: 'Anterior'; href: string | null };
  next: { label: 'Próxima'; href: string | null };
};
```

Filtros inválidos são rejeitados/normalizados pelo controller antes da query; sempre incluem `publication` (current por padrão) e nunca recebem `tenant_id` ou `microsoft_connection_id` do browser.

## Common comparison, score and object shapes

```ts
type ObservedConfigurationFact = {
  factKey: string;
  subjectKey: string;
  externalReference: string | null;
  value: unknown | null;
  matrixLineKey: string | null;
  source: { key: string; contractVersion: string; name: string; apiVersion: string | null };
  availability: Pick<ConfigurationSourceState, 'availabilityStatus' | 'freshness' | 'coverage' | 'reason'>;
  comparability: 'comparable' | 'unavailable' | 'stale' | 'restricted' | 'not_applicable';
  dates: PageDateMetadata;
};

type ConfigurationComparison = {
  lineKey: string;
  title: string;
  domain: string;
  service: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'conformant' | 'divergent' | 'unavailable' | 'ineligible';
  eligible: boolean;
  comparable: boolean;
  contribution: number;
  gateTriggered: boolean;
  baseline: unknown;
  actual: unknown | null;
  source: { key: string; contractVersion: string; name: string; apiVersion: string | null; permissions: string[] };
  availability: Pick<ConfigurationSourceState, 'availabilityStatus' | 'freshness' | 'coverage' | 'reason'>;
  dates: PageDateMetadata;
};

type UnavailableConfigurationComparison = ConfigurationComparison & {
  status: 'unavailable';
  eligible: true;
  comparable: false;
  contribution: 0;
  gateTriggered: false;
  actual: null;
};

type ConfigurationSettingView =
  | {
      kind: 'observed';
      fact: ObservedConfigurationFact;
      comparison: ConfigurationComparison | null;
    }
  | {
      kind: 'unavailable-comparison';
      fact: null;
      comparison: UnavailableConfigurationComparison;
    };

type ConfigurationScore = {
  value: number | null;
  eligibleCount: number;
  comparableCount: number;
  conformantCount: number;
  divergentCount: number;
  unavailableEligibleCount: number;
  coveragePercentage: number | null;
  domainScores: Array<{ domain: string; weight: number; score: number | null; coverage: number | null }>;
  gates: Array<{ key: string; title: string; triggered: boolean; evidence: string | null }>;
};

type UnavailableCard = {
  resultState: 'unavailable';
  reason: string;
  enabledWhen: string;
  availability: Pick<ConfigurationSourceState, 'availabilityStatus' | 'coverage' | 'freshness'>;
  dates: PageDateMetadata;
};

type ConfigurationHistoryChange =
  | {
      kind: 'observed-fact-change';
      id: string;
      fact: Pick<ObservedConfigurationFact, 'factKey' | 'subjectKey' | 'externalReference' | 'source' | 'dates'>;
      before: unknown | null;
      after: unknown | null;
      matrix: null;
      comparison: null;
      risk: null;
      severity: null;
      baseline: null;
      gateTriggered: null;
    }
  | {
      kind: 'matrix-line-change';
      id: string;
      fact: Pick<ObservedConfigurationFact, 'factKey' | 'subjectKey' | 'externalReference' | 'source' | 'dates'>;
      before: unknown | null;
      after: unknown | null;
      matrix: { lineKey: string; domain: string; risk: 'low' | 'medium' | 'high' | 'critical'; severity: string };
      comparison: ConfigurationComparison | null;
      risk: 'low' | 'medium' | 'high' | 'critical';
      severity: string;
      baseline: unknown | null;
      gateTriggered: boolean;
    };
```

`ObservedConfigurationFact` carrega disponibilidade da leitura e
comparabilidade separadamente, podendo alimentar cards, inventários e detalhes
sem `matrixLineKey`; somente o fato com vínculo a uma linha homologada entra em
`ConfigurationComparison`. A ausência desse vínculo nunca é compensada com uma
linha artificial de matriz.

Razões, coverage, telemetry, `technicalInformation`, evidência e erros de mutation são contratos seguros: carregam apenas categoria, contagens, datas e identificadores explicitamente permitidos. Nunca serializam exceção/provider message, stack trace, URL/query, header Authorization, token, secret, OAuth/state, payload técnico bruto ou identificador não autorizado. A redação ocorre antes de persistir source state/readiness/evidence; projection/CSV não podem revertê-la. `externalReference` necessário à classificação local permanece somente nas formas que já o declaram.

`ConfigurationSettingView` é uma união discriminada para tabela/detalhe de
settings. `kind: 'observed'` cobre fato observado com comparison opcional;
`kind: 'unavailable-comparison'` cobre linha elegível cuja fonte atual não
produziu fato: `fact=null` e comparison obrigatoriamente `unavailable`, zero,
não comparável e sem gate. A UI não oculta o fato quando `comparison=null` nem
cria um fato vazio para satisfazer a linha indisponível.

Uma linha eligible/unavailable tem `eligible: true`, `status: 'unavailable'`, `contribution: 0`, `comparable: false`, `gateTriggered: false`. Uma linha dependente de criticidade sem marcação explícita é `ineligible`, não reduz score e não aparece como falha.

## Surface payloads

Cada propriedade abaixo que alimenta um card deve expor seu próprio bloco de
metadados `{ availability, dates }`, `ObservedConfigurationFact`,
`ConfigurationSettingView` ou `ConfigurationComparison` equivalente que os
contenha. O envelope global não substitui metadados por card: `unavailable`,
`restricted`, `stale`, `coverage`, `freshness` e `reason` precisam identificar
a fonte que efetivamente alimenta ou limita aquele card.

| Tab | Campos próprios, sempre dentro de `ConfigurationPageEnvelope` |
|---|---|
| `dashboard` | `score: ConfigurationScore`; `kpis`; `workloadsWithDrift`; `pendingChanges: UnavailableCard` e `changes30d: UnavailableCard` enquanto não houver change-management canônico; `riskDistribution`; `activeBaselines`; `withoutCollection`; `workloadCompliance`; `scoreHistory`; `topCritical`; `recentChanges`; `recommendations: UnavailableCard` enquanto não houver `recommendation_rule` homologada. Cada bloco/card preserva metadados próprios de fonte/estado/datas. |
| `tenant` | `organizationInformation`; `tenantBranding`; `verifiedDomains: LocalPagination<VerifiedDomain>`; `organizationContacts`; `enabledServices`; `synchronizationAndDirectories`; `generalTenantSettings: LocalPagination<ConfigurationSettingView>`. Os sete campos correspondem, nesta ordem, aos sete cards canônicos da superfície. |
| `identity-access` | `identityKpis`; `conditionalAccess: LocalPagination<ConditionalAccessObject>`; `authenticationMethods`; `passwordProtection`; `adminRoles`; `pimAssignments`; `usersAccess`; `enterpriseApplications`; `identityEvents`; `classifications`; `recommendations: UnavailableCard` sem `recommendation_rule` homologada. |
| `collaboration-sharing` | `sharingKpis`; `externalSharing`; `defaultLinkTypes`; `sharingActivity`; `guestAccess`; `allowedDomains: LocalPagination<AllowedDomain>` (10 itens por página); `groupAndSitePolicies`; `teamsSettings`; `oneDriveSettings`; `sharingChanges`; `recommendations: UnavailableCard` sem `recommendation_rule` homologada. Cada dado não coletado retorna seu próprio source state U/D. |
| `security-compliance` | `securityPosture`; `score`; `dlpIncidents`; `defenderProtections`; `dataProtection`; `auditing`; `sensitivityLabels`; `retentionPolicies`; `baselines`; `criticalFindings`; `postureHistory`; `workloadCoverage`; `recommendations: UnavailableCard` sem `recommendation_rule` homologada. |
| `by-service` | `serviceSelectors`; `categories`; `settings: LocalPagination<ConfigurationSettingView>`; `selectedSetting: ConfigurationSettingView | null`; `serviceCompliance`; `mostDivergentServices`; `mostCriticalServices`; `recommendations: UnavailableCard` sem `recommendation_rule` homologada. |
| `baselines-compliance` | `baselineKpis`; `baselines: LocalPagination<BaselineView>`; `coverageByService`; `divergenceByRisk`; `divergentSettings: LocalPagination<ConfigurationComparison>`. |
| `history-audit` | `historyKpis`; `changes: LocalPagination<ConfigurationHistoryChange>`; `originDistribution`; `selectedChange: ConfigurationHistoryChange | null`; `valueDiff`; `technicalInformation`; `changesByService`; `changesByRisk`; `evidence`; `relatedDrifts`. Fatos sem MatrixLine são `observed-fact-change`: investigáveis, sem risco/severidade/baseline/gate inventados. |

`ConditionalAccessObject` e `ExchangeConnectorObject` incluem `externalReference`, display name, observed state, `criticalClassification` e `dates`; eles nunca expõem um valor inferido quando a fonte atual é unavailable. Seleção de conector pode aparecer em `by-service`/history com o mesmo contrato.

### Tenant payload — seven canonical cards

Cada bloco abaixo contém `availability`, `freshness`, `coverage`, `reason`,
`resultState` e `dates: PageDateMetadata`; `restricted` remove somente os
campos sensíveis, preservando agregado e razão. Nenhum bloco chama Graph.

```ts
type TenantBlock<T> = T & {
  availability: Pick<ConfigurationSourceState,
    'availabilityStatus' | 'freshness' | 'coverage' | 'reason' | 'resultState'>;
  dates: PageDateMetadata;
};

type TenantSurfacePayload = {
  // Informações da Organização — detalhe em duas colunas
  organizationInformation: TenantBlock<{
    displayName: string | null; tenantId: string | null; defaultDomain: string | null;
    country: string | null; preferredLanguage: string | null; directoryType: string | null;
  }>;
  // Identidade Visual do Tenant — mídia e metadados
  tenantBranding: TenantBlock<{
    logoUrl: string | null; squareLogoUrl: string | null; backgroundImageUrl: string | null;
    signInText: string | null; usernameHintText: string | null; backgroundColor: string | null;
  }>;
  // Domínios Verificados — tabela
  verifiedDomains: LocalPagination<TenantBlock<{
    id: string; domainName: string; isDefault: boolean | null; isInitial: boolean | null;
    isVerified: boolean | null; supportedServices: string[];
  }>>;
  // Contatos da Organização — cartões
  organizationContacts: TenantBlock<{
    technical: RestrictedContact; privacy: RestrictedContact; security: RestrictedContact;
  }>;
  // Serviços Habilitados no Tenant — grade
  enabledServices: TenantBlock<{ items: Array<{ key: string; label: string; status: string | null }> }>;
  // Sincronização e Diretórios — detalhe
  synchronizationAndDirectories: TenantBlock<{
    connectionState: string | null; lastSyncedAt: string | null; directorySync: string | null;
    usersCount: number | null; groupsCount: number | null; organizationalUnits: number | null;
  }>;
  // Configurações Gerais do Tenant — tabela
  generalTenantSettings: LocalPagination<ConfigurationSettingView>;
};

type RestrictedContact = { displayName: string | null; channels: string[] | null; restricted: boolean };
```

Os outros sete payloads da tabela anterior foram confrontados com seus cards:
dashboard agrega seus 17 blocos; identity-access seus 15; collaboration-sharing
seus 17; security-compliance seus 17; by-service seus 15; baselines-compliance
seus 7; e history-audit seus 12. O nome de cada propriedade permanece o grupo
de card correspondente, e detalhes/tabelas paginadas usam as formas comuns
acima.

## Critical classification — local mutation

```ts
type CriticalClassification = {
  id: string;
  objectType: 'conditional_access_policy' | 'exchange_inbound_connector' | 'exchange_outbound_connector';
  externalReference: string;
  displayName: string | null;
  isCritical: boolean;
  state: 'active' | 'inactive';
  lockVersion: number;
  effectiveFrom: string;
  lastSeenAt: string | null;
  inactiveAt: string | null;
  inactiveReason: string | null;
};
```

- `PATCH /microsoft-365/configuracoes/classificacoes-criticas/{classification}`: body `{ isCritical, expectedLockVersion }`; somente `customer admin`, no tenant corrente. Não chama Microsoft.
- Sucesso retorna a classificação atualizada e auditoria de mudança; a eficácia inicia naquele instante e futuras publicações a usam.
- Conflito otimista retorna HTTP 409 com `{ code: 'classification_conflict', current: CriticalClassification, message }`; a UI exige recarga, sem last-write-wins.
- `inactive` só é derivado por ausência em coleta canônica válida/conclusiva. Falha/restricted/unavailable/partial inconclusivo não inativa. Retorno da mesma referência reativa; nova referência cria outro objeto não crítico.

## CSV UTF-8

`GET .../exportar?surface=...` devolve `text/csv; charset=UTF-8`, com BOM quando necessário para interoperabilidade Excel. As linhas são a mesma população filtrada/paginada logicamente (a exportação não corta por página). Toda linha observada contém `factKey`, sujeito/referência externa autorizada, atual redigido, source contract/API, availability/result state/coverage/freshness/reason e as quatro datas nomeadas (`sourceLastModifiedAt`, `lastObservedChangeAt`, `lastCollectedAt`, `publishedAt`). Somente se `comparison` existir inclui domínio/serviço, risco, status, eligible/comparable, baseline, matrix/baseline version, contribuição e gate. O CSV não inclui payload técnico sensível, erro bruto, URL/header/credencial, identificador não autorizado nem dado de outro tenant.
