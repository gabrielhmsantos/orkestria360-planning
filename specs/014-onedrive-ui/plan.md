# Plano de implementação: Microsoft 365 — OneDrive UI

**Branch**: `feat/014-onedrive-ui` | **Data**: 2026-09-12 | **Spec**: [spec.md](./spec.md)

## Resumo

Entregar a interface read-only do módulo OneDrive em oito superfícies, na ordem aprovada pelo discovery, usando somente cenários sintéticos de contrato. A página será montada por uma rota autenticada mínima e obterá dados de um `OnedriveUiDataSource` tipado e semanticamente permanente. Durante este track, um fixture harness transitório configurará a primeira implementação, `OnedriveFixtureDataSource`; componentes de apresentação não importarão JSON, catálogo ou override de fixture: receberão projections normalizadas pelo datasource, preservando a disponibilidade `available`, `partial`, `unavailable`, `restricted`, `stale` e `failed`, bem como o resultado factual `empty` em coleções disponíveis.

O desenho visual, a estrutura de cada superfície, a disponibilidade e as interações são os do [UI Blueprint reconciliado](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md); este plano não os redesenha. Não há collectors, Graph, persistência, sincronização, actions administrativas, retry, exportação ou fonte de produção nesta feature.

## Contexto técnico

**Linguagem/versão**: PHP 8.2+ / Laravel 12; TypeScript 5.7 strict; React 19.2

**Dependências primárias**: Laravel, Inertia React 3, Tailwind CSS 4, shadcn/ui, Recharts 3; componentes operacionais já existentes do repositório

**Armazenamento**: N/A — fixtures estáticas de desenvolvimento em memória; sem banco, cache, collector ou persistência adicionados

**Testes**: testes de rota/Inertia em PHPUnit; `npm run types:check`, `npm run lint:check`, `npm run build`; validação comportamental determinística em navegador para cenários das fixtures e viewports wide/compact

**Plataforma-alvo**: aplicação web Laravel/Inertia já autenticada, navegadores modernos desktop e mobile

**Tipo de projeto**: extensão frontend de aplicação web existente, com montagem Laravel mínima

**Metas de desempenho**: troca de aba, filtro, paginação e painel inline inteiramente locais e responsivos para cada payload sintético aprovado; sem chamadas de rede para dados OneDrive

**Restrições**: frontend-only; manter as oito superfícies e sua ordem; usar somente contratos/fixtures aprovados; nenhum fallback silencioso; nenhum controle mutável ou refresh manual; acessibilidade de teclado e estados de indisponibilidade distintos

**Escopo**: uma página Inertia, oito views de superfície, um boundary de dados
tipado e um catálogo local gerado da fixture global canônica do discovery

## Constituição — verificação

### Antes da pesquisa — aprovado

| Gate constitucional | Decisão do plano |
|---|---|
| Intenção e artefatos aprovados | A [spec](./spec.md), os oito `contratos.md`, fixtures e o [UI Blueprint](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md) são fonte de comportamento. O plano apenas os torna implementáveis. |
| Escopo mínimo e sem complexidade paralela | Uma página, um datasource e componentes locais à feature; nenhum serviço, provider, banco, queue ou endpoint de dados. |
| Disponibilidade como contrato | O union de disponibilidade é transportado até a renderização; `available`, `partial`, `unavailable`, `restricted`, `stale` e `failed` não compartilham fallback nem texto semântico. Uma coleção vazia em cenário `available` continua sendo um resultado factual `empty`, não um estado de disponibilidade. |
| Tenant e autorização | Reutilizar somente o middleware autenticado e a boundary de tenant existente. A feature não recebe nem persiste identificador de tenant adicional. |
| Fixture global | O fixture harness seleciona um cenário para o tenant inteiro a partir de `tenant-scenarios.json`; página e tabs recebem somente `OnedriveUiDataSource` e não apresentam fixtures como dados reais. |
| Verificabilidade e rastreabilidade | Cada superfície é ligada ao contrato/fixture correspondente e cada cenário aprovado é exercitável sem backend. |

Não há violação que exija justificativa de complexidade.

### Após o design — aprovado

O modelo de dados, contrato de datasource e quickstart preservam os mesmos gates. A rota é somente o ponto de entrada Inertia e transmite a aba ativa; não introduz backend de domínio. O fixture harness fica fora do seam e entrega um datasource já configurado, evitando que componentes ou um adapter futuro conheçam cenário, override ou provenance de fixture.

## Decisões de implementação

1. Adicionar uma entrada autenticada `microsoft-365/onedrive` e rotas de aba publicadas, seguindo a convenção dos módulos Microsoft 365 existentes. Um controller de montagem devolverá somente a página Inertia e a aba ativa; ele não terá serviço de PageData, consulta, API ou persistência.
2. Implementar `OnedriveUiDataSource` como seam permanente com somente `getSurface(surface)`. `OnedriveFixtureDataSource` será a única implementação neste escopo, configurada pelo fixture harness; trocar para uma fonte real depois significa criar outro adapter no mesmo contrato, sem cenário, catálogo ou fixture, e sem reescrever a UI.
3. Manter os contratos aprovados como origem semântica: tipos TypeScript discriminados modelam envelope, disponibilidade, filtros, paginação e projections de cada superfície. O fixture harness transitório contém provenance, versão, catálogo gerado, `defaultScenario` e seleção global de desenvolvimento/teste; ele não é fallback de produção nem parte do contrato consumido pela UI.
4. Manter `pages/modules/onedrive.tsx` fina: `PageScaffold`, hero, tab bar e seleção de superfície. Cada tab substancial fica em `components/modules/onedrive/`, compondo apenas componentes operacionais existentes e pequenas composições locais justificadas pelas regras específicas do OneDrive.
5. Centralizar somente as regras repetidas de disponibilidade, formatação e seleção local. Não criar um renderer genérico de tabelas/cards que esconda campos ou semânticas distintas entre contratos.

O racional, alternativas rejeitadas e evidências estão em [research.md](./research.md).

## Estrutura do projeto

```text
specs/014-onedrive-ui/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── onedrive-ui-contract.md

orkestria360/
├── app/Http/Controllers/Modules/
│   └── OnedriveController.php                 # entrada Inertia sem dados de domínio
├── routes/web.php                              # somente GETs autenticados publicados
├── resources/js/
│   ├── pages/modules/onedrive.tsx              # shell fina, hero e navegação
│   ├── types/modules/onedrive.ts               # contrato semântico TypeScript
│   ├── data/modules/onedrive/
│   │   ├── onedrive-ui-data-source.ts          # seam semântico permanente
│   │   ├── onedrive-fixture-data-source.ts     # adapter transitório configurado pelo harness
│   │   ├── onedrive-fixture-harness.ts         # catálogo, seleção e provenance transitórios
│   │   ├── onedrive-scenario-override.ts       # override somente dev/teste/validação
│   │   └── fixtures/                           # fixtures locais, fiéis e identificadas
│   └── components/modules/onedrive/
│       ├── onedrive-availability.tsx           # composição local de estados aprovados
│       ├── onedrive-formatters.ts
│       ├── dashboard-tab.tsx
│       ├── accounts-storage-tab.tsx
│       ├── files-content-tab.tsx
│       ├── sharing-access-tab.tsx
│       ├── activity-sync-tab.tsx
│       ├── offboard-retention-tab.tsx
│       ├── settings-security-tab.tsx
│       └── audit-history-tab.tsx
└── tests/Feature/Onedrive/
    ├── OnedriveRoutesTest.php
    └── OnedriveFoundationTest.php
```

**Decisão estrutural**: o código de aplicação permanece exclusivamente em `orkestria360/`. Tipos, fixture adapter e componentes pertencem ao módulo, mantendo a page e o controller deliberadamente finos. Artefatos de planejamento permanecem em `specs/014-onedrive-ui/`.

## Mapeamento de entrega e rastreabilidade

| Ordem | Superfície | Componente de superfície | Contrato e fixture aprovados |
|---:|---|---|---|
| 1 | Dashboard Executivo | `dashboard-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/dashboard-executivo/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 2 | Contas e Armazenamento | `accounts-storage-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/contas-e-armazenamento/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 3 | Arquivos e Conteúdo | `files-content-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/arquivos-e-conteudo/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 4 | Compartilhamento e Acessos | `sharing-access-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/compartilhamento-e-acessos/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 5 | Atividade e Sincronização | `activity-sync-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/atividade-e-sincronizacao/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 6 | Usuários Desligados e Retenção | `offboard-retention-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/usuarios-desligados-e-retencao/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 7 | Configurações e Segurança | `settings-security-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/configuracoes-e-seguranca/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |
| 8 | Histórico e Auditoria | `audit-history-tab.tsx` | [contrato](../../discovery/microsoft-365/v2/onedrive/historico-e-auditoria/contratos.md) · [fixture global](../../discovery/microsoft-365/v2/onedrive/fixtures/tenant-scenarios.json) |

As métricas, tabelas, filtros, tooltips, drill-downs publicados, breakpoints, mensagens e controles de cada linha acima são os definidos no [UI Blueprint](../../discovery/microsoft-365/v2/onedrive/ui-blueprint.md). Onde ele determina `Action: none` ou ação administrativa pendente, a implementação não renderiza uma ação substituta.

## Sequência de implementação

1. Criar os tipos e o seam semântico `OnedriveUiDataSource`, e portar as fixtures aprovadas para o harness transitório, que concentra checagem de cenário/versão, provenance e override.
2. Criar a rota/controller de entrada e a page shell com a sequência canônica de tabs e links internos acessíveis, consumindo somente o datasource semântico já configurado pela composição dev/teste.
3. Implementar a composição compartilhada de disponibilidade e os formatters, validando que estados e valores ausentes não são normalizados para sucesso ou zero.
4. Implementar as oito superfícies na ordem de rastreabilidade acima, usando os componentes aprovados e apenas as interações publicadas (filtros, paginação, seleção e painel inline quando previstos).
5. Adicionar testes de rota/Inertia e executar a matriz de fixtures, navegador, teclado, responsividade e gates de qualidade descritos no [quickstart](./quickstart.md).

## Complexidade

Nenhuma complexidade excepcional ou violação constitucional a registrar.
