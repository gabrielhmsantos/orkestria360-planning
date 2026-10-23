# Modelo de dados frontend — Microsoft 365 OneDrive UI

## Limite do modelo

Este é um modelo TypeScript de apresentação e adaptação. Não define tabelas, migrations, payloads Microsoft/Graph, caches, collectors ou persistência. A semântica de cada campo continua definida nos oito `contratos.md` do discovery; o modelo cria somente nomes e unions para consumi-los com segurança na UI.

## Identidade de superfície permanente

```ts
export const onedriveSurfaceOrder = [
  'dashboard-executivo',
  'contas-e-armazenamento',
  'arquivos-e-conteudo',
  'compartilhamento-e-acessos',
  'atividade-e-sincronizacao',
  'usuarios-desligados-e-retencao',
  'configuracoes-e-seguranca',
  'historico-e-auditoria',
] as const;

export type OnedriveSurfaceKey = (typeof onedriveSurfaceOrder)[number];
```

`OnedriveSurfaceKey` é a única identidade de seleção conhecida pela UI e pelo seam permanente. Cenários pertencem exclusivamente ao harness de fixtures de desenvolvimento/teste; componentes e adapters futuros não os conhecem.

## Disponibilidade discriminada

```ts
export type AvailabilityState =
  | 'available'
  | 'unavailable'
  | 'restricted'
  | 'partial'
  | 'stale'
  | 'failed';

export interface DataAvailability {
  state: AvailabilityState;
  asOf?: string | null;
  reason?: string | null;
  affectedFields?: string[];
}
```

`available` indica que a publicação está disponível; não é uma licença para substituir valores ausentes. `empty` é um resultado factual — por exemplo, uma coleção vazia num cenário cujo `state` é `available` — e recebe a mensagem de vazio sem se tornar valor de `AvailabilityState`. `unavailable` e `restricted` alimentam `DataAvailabilityPanel`; `partial` mantém os dados observáveis junto com alerta e escopo afetado; `stale` expõe `asOf` em `LastUpdatedIndicator` sem ação de refresh; `failed` exibe o alerta destrutivo sem retry. A projection pode ter disponibilidade global e disponibilidades próprias de bloco, como exigido pelos contratos.

## Envelope e datasource

```ts
export interface OnedriveSurfaceEnvelope<TProjection> {
  surface: OnedriveSurfaceKey;
  availability: DataAvailability;
  data: TProjection | null;
}

export interface OnedriveUiDataSource {
  getSurface<TProjection>(
    surface: OnedriveSurfaceKey,
  ): OnedriveSurfaceEnvelope<TProjection>;
}
```

Na implementação, a associação de `surface` para projection concreta é feita por overload/map discriminado, não por cast arbitrário. O envelope só transporta a semântica que a UI precisa renderizar. Um adapter futuro implementa esta única operação de leitura, sem cenário, fixture, provenance ou API de catálogo.

## Harness transitório de fixtures

```ts
export type OnedriveFixtureScenario = string;

export interface OnedriveFixtureHarness {
  createDataSource(scenario?: OnedriveFixtureScenario): OnedriveUiDataSource;
  getDefaultScenario(surface: OnedriveSurfaceKey): OnedriveFixtureScenario;
  listScenarios(surface: OnedriveSurfaceKey): readonly OnedriveFixtureScenario[];
}
```

O harness, `OnedriveFixtureDataSource`, catálogo, `defaultScenario`, seleção
explícita, scenario override e metadata de provenance existem somente no
diretório de infraestrutura de fixtures. O harness recebe um cenário único para
o tenant inteiro, valida sua presença nas oito superfícies e falha para valor
desconhecido, sem recair em outro payload. Provenance, `fixtureVersion` e a
origem no discovery são metadados de validação do harness e não pertencem ao
envelope entregue às tabs.

## Projections por superfície

Cada projection conserva os grupos do contrato correspondente e seus subestados:

| Superfície | Projection de UI | Grupos a manter |
|---|---|---|
| Dashboard Executivo | `ExecutiveDashboardProjection` | `summary`, tendências/distribuições, recomendações e freshness publicados |
| Contas e Armazenamento | `AccountsStorageProjection` | KPIs, conta/armazenamento, filtros, paginação e bloco de capacidade |
| Arquivos e Conteúdo | `FilesContentProjection` | KPIs de conteúdo, distribuição/tendência, inventário e filtros publicados |
| Compartilhamento e Acessos | `SharingAccessProjection` | KPIs, risco/distribuições, tabela read-only, filtros e detalhe inline quando publicado |
| Atividade e Sincronização | `ActivitySyncProjection` | KPIs, séries, atividade/sincronização e respectivos estados de cobertura |
| Usuários Desligados e Retenção | `OffboardRetentionProjection` | KPIs, etapas de retenção, lista/tabela e estados do processo |
| Configurações e Segurança | `SettingsSecurityProjection` | score, configuração, recomendações, validade e disponibilidade por bloco |
| Histórico e Auditoria | `AuditHistoryProjection` | KPIs, eventos, filtros/paginação e detalhe inline quando publicado |

Tipos internos nomeiam campos exatamente como os fixtures/contratos aprovados, conservando opcionalidade e `null`. Formatters recebem `number | null | undefined`, data/hora ou string de contrato e retornam uma apresentação de ausência aprovada; nunca sintetizam percentual, quantidade, usuário ou data.

## Estado de interação local

```ts
interface SurfaceViewState {
  filters: Record<string, string | string[] | undefined>;
  page: number;
  selectedRowId: string | null;
}
```

Esse estado só existe nas superfícies que possuem filtro, paginação ou painel inline no blueprint. Alterar um filtro limpa `selectedRowId` e reposiciona `page` de acordo com o guia frontend. Ele não é persistido, enviado ao servidor nem usado para simular ação administrativa.

## Integridade fixture → UI

1. `tenant-scenarios.json` é a única base local; o catálogo TypeScript gerado
   declara sua provenance e contém somente dados sintéticos aprovados.
2. O harness valida que `defaultScenario` existe e que uma seleção explícita
   pertence à matriz global antes de criar o datasource configurado.
3. Um cenário sem `data` mantém `data: null` e sua disponibilidade — não usa outro cenário.
4. Testes/aceitação percorrem os mesmos cenários globais em todas as superfícies
   para provar as apresentações de cada estado publicado.
5. A troca futura remove `OnedriveFixtureDataSource`, harness, override e fixtures runtime; tabs continuam recebendo somente projections e `DataAvailability` via `OnedriveUiDataSource`.
