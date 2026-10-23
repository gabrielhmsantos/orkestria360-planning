# Implementation Plan: Módulo Microsoft 365

**Branch**: `feat/002-microsoft-365-module` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-microsoft-365-module/spec.md`

## Summary

Estruturar a overview executiva do módulo Microsoft 365 em `/microsoft-365`, migrando o payload mockado inline para um controller Laravel com contrato estável Inertia/React que consome **dados reais** do Microsoft Graph do tenant Contoso via SDK oficial PHP em modo app-only (`ClientCredentialContext` + `GraphServiceClient`), preservando a UX atual, tratando exceções de endpoint (CSV de reports) e garantindo resiliência via cache/snapshot com indicador "Última att. em {tempo relativo}" quando uma chamada Graph falha. Não existe mock.

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7, React 19

**Primary Dependencies**: Laravel 13, Inertia Laravel 3, Inertia React 3, Tailwind CSS 4, shadcn/ui, Recharts, Microsoft Graph SDK for PHP (`microsoft/microsoft-graph`) com o stack explícito de autenticação/transporte `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle`

**Storage**: Sem nova persistência analítica nesta fase; blocos estruturados são lidos em tempo de execução do Microsoft Graph; cache/snapshot por bloco via cache storage nativo do Laravel (driver configurado em `config/cache.php`, com TTL controlado por bloco) para resiliência em falhas transitórias; credenciais do App Registration no Entra ID do tenant Contoso via variáveis de ambiente

**Testing**: PHPUnit feature tests, Inertia assertions, TypeScript check, ESLint, Prettier, PHPStan

**Target Platform**: Aplicação web Laravel + Inertia para desktop e mobile web

**Project Type**: Monólito web full-stack com frontend React server-driven via Inertia

**Performance Goals**: Carregar `/microsoft-365` com todos os blocos da overview em uma única resposta Inertia, montada no backend a partir de chamadas Graph paralelizáveis, sem roundtrips adicionais do cliente para compor a página

**Constraints**: Usar convenções nativas do Laravel; manter a overview como entrega funcional única desta feature; não introduzir login Microsoft para usuário final; consumir Microsoft Graph em modo app-only com `ClientCredentialContext` e escopo `.default`; tratar o SDK oficial PHP como caminho principal; preservar linguagem visual e componentes atuais do módulo; tratar exceção de CSV em `serviceUsage30d` com parser backend; em falha transitória do Graph, servir cache/snapshot do bloco com `fresh: false` e indicador "Última att. em {tempo relativo}" ou normalizar para `empty`/`informational` quando não há snapshot; não existe mock em hipótese alguma

**Scale/Scope**: 1 overview executiva, 4 summary cards, 1 card de secure score, 8 serviços monitorados, 1 gráfico de licenças, 1 gráfico de adoção 30d, recomendações, highlights, recent activity e next step; subáreas permanecem como evolução futura

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Laravel-Conventional by Default**: Reutilizar `routes/web.php` ou controller web dedicado, props Inertia, classes de suporte simples no backend e feature tests Laravel. Se novos artefatos Laravel forem necessários em implementação, eles devem ser gerados com `php artisan make:*`. O seam de integração Graph ficará em provider/service leve com `GraphServiceClient`, sem repositories ou camadas extras.
- **Consistent User Experience**: Preservar a linguagem visual do módulo atual em `/microsoft-365`, incluindo summary cards, secure score, grid de status, gráficos, recomendações, highlights, recent activity e next step. Estados vazios, parciais, informativos e de atenção devem seguir o mesmo padrão de labels, tons e cards já usados no produto.
- **Verifiable Quality Gates**: O gate mínimo intermediário é `composer ci:check`, mas o gate final da feature é `composer test`, já que esta entrega altera backend, contrato Inertia, UI e comportamento full-flow com integração Graph real. Testes devem cobrir acesso autenticado, contrato do payload, consistência de estados parciais, comportamento de cache/snapshot em falha transitória e indicador "Última att.".
- **POC Scope with Controlled Full-Stack Evolution**: A overview consome dados reais do Microsoft Graph do tenant Contoso via app-only auth. A parametrização da integração permanece fora da UI; credenciais vivem no ambiente. Blocos editoriais (`tenantHighlights`, `recentActivity`, `nextStep`) permanecem editoriais por design, ancorados nos sinais reais agora disponíveis. Não existe mock: falhas transitórias do Graph são tratadas via cache/snapshot + indicador de stale, ou normalização para `empty`/`informational`.
- **Simplicity Without Overengineering**: O plano evita persistência analítica, filas, repositórios e abstrações prematuras. A complexidade intencional é o parser de CSV para `serviceUsage30d`, o cache/snapshot por bloco via Cache Laravel e o indicador "Última att." na UI.

## Project Structure

### Documentation (this feature)

```text
specs/002-microsoft-365-module/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── microsoft-365-overview.md
└── tasks.md
```

### Source Code (repository root)

```text
orkestria360/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   └── Support/
├── resources/
│   └── js/
│       ├── components/
│       │   └── modules/
│       ├── data/
│       │   └── modules/
│       ├── pages/
│       │   └── modules/
│       └── types/
├── routes/
│   └── web.php
└── tests/
    ├── Feature/
    └── TestCase/
```

**Structure Decision**: Manter o monólito Laravel + Inertia existente em `orkestria360/`, movendo o módulo Microsoft 365 de payload inline em rota para controller dedicado e uma classe de montagem de payload/backend provider simples. O frontend continua em React com contrato typed em `resources/js`, sem API pública separada.

## Phase 0: Research Summary

- A integração com Microsoft Graph usa autenticação app-only com `ClientCredentialContext`, sem login Microsoft para o usuário final. Padrão confirmado via Context7: `GraphServiceClient` instanciado com `ClientCredentialContext($tenantId, $clientId, $clientSecret)`, escopo padrão `https://graph.microsoft.com/.default`, token automático e cache gerido pelo SDK.
- O seam técnico para Graph no backend é o stack oficial PHP composto por `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle`; HTTP manual só entra como fallback pontual para exceções de endpoint.
- Esta feature implementa Graph real: formaliza o contrato da overview e consome dados reais do tenant Contoso no backend Laravel. Não existe mock.
- O contrato da overview aceita blocos `graph-backed` (fresco ou stale de cache/snapshot) e `editorial`, distinguindo origem e freshness para facilitar evolução gradual e transparência ao usuário.
- `recentActivity` permanece editorial nesta feature porque não há uma única fonte canônica simples que sustente esse feed executivo, mas agora é ancorado nos sinais estruturados reais.
- O endpoint `getOffice365ServicesUserCounts` é uma exceção de contrato relevante: ele retorna `302` para um CSV temporário, não uma coleção JSON padrão do Graph. Esta feature inclui o parser backend.
- O contrato autoritativo da feature passa a ser `contracts/microsoft-365-overview.md`; `discovery/` permanece como racional técnico e visão futura.

## Phase 1: Design Decisions

- Criar `Microsoft365Controller` para servir `/microsoft-365` com um payload unificado e typed para a overview, montado a partir de chamadas reais ao Microsoft Graph.
- Introduzir uma classe/backend provider do módulo que instancia `GraphServiceClient` via `ClientCredentialContext` e monta `Microsoft365OverviewPageData` a partir dos endpoints oficiais, isolando a origem dos blocos e gerenciando o cache/snapshot por bloco.
- Manter a UI atual da overview, ajustando apenas o contrato de dados e a centralização do payload fora da rota; adicionar o indicador "Última att. em {tempo relativo}" para blocos com `fresh: false`.
- Implementar o seam técnico ativo com o stack oficial PHP do Graph (`microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague`, `microsoft/kiota-http-guzzle`) via variáveis de ambiente (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`), sem expor configuração na UI.
- Formalizar a rastreabilidade entre blocos da overview e endpoints oficiais do Microsoft Graph, agora como consumo real.
- Tratar o bloco `serviceUsage30d` como parser CSV/backend adapter específico, dado que `/reports/getOffice365ServicesUserCounts(period='D30')` retorna `302` para CSV.
- Tratar `summaryCards` como conjunto fixo de quatro blocos, `serviceStatus` como catálogo fixo de oito serviços e `recommendations` como top 5 executivo derivado dos control profiles reais.
- Tratar `tenantHighlights`, `recentActivity` e `nextStep` como blocos editoriais obrigatórios, ancorados nos sinais estruturados reais agora disponíveis, sempre subordinados aos blocos estruturados da overview.
- Tratar falhas transitórias do Graph (timeout, 429, 5xx, token expirado) servindo cache/snapshot do bloco com `fresh: false` e `lastUpdatedAt` preenchido, exibindo "Última att. em {tempo relativo}"; quando não há snapshot, normalizar para `empty`/`informational`. Não existe mock.

## Post-Design Constitution Check

- **Laravel-Conventional by Default**: Pass. O desenho usa controller web, props Inertia, provider leve com `GraphServiceClient` e testes Laravel sem camadas fora do padrão.
- **Consistent User Experience**: Pass. A overview preserva a composição e a linguagem do módulo atual enquanto troca a origem do payload de mock para Graph real, com indicador "Última att." para blocos stale.
- **Verifiable Quality Gates**: Pass. `composer ci:check` permanece como gate intermediário e `composer test` como gate final, cobrindo lint, types e testes necessários para a mudança planejada, incluindo testes de contrato, estados parciais, autenticação/acesso e comportamento de cache/snapshot em falha.
- **POC Scope with Controlled Full-Stack Evolution**: Pass. A integração Graph real é ativada com credenciais já disponíveis, sem login Microsoft nem parametrização na UI. Resiliência via cache/snapshot, não mock.
- **Simplicity Without Overengineering**: Pass. O plano não adiciona persistência analítica, jobs ou abstrações especulativas; a complexidade intencional é o parser de CSV, o cache/snapshot por bloco via Cache Laravel e o indicador "Última att." na UI.

## Implementation Notes

- Gerar futuros artefatos Laravel a partir de `orkestria360/` com `php artisan make:*` quando a implementação começar.
- Adicionar `microsoft/microsoft-graph`, `microsoft/kiota-authentication-phpleague` e `microsoft/kiota-http-guzzle` ao `composer.json` e instanciar `GraphServiceClient` com `ClientCredentialContext($tenantId, $clientId, $clientSecret)` no provider do módulo.
- Evoluir o contrato TypeScript atual para `Microsoft365OverviewPageData` e alinhar o payload Inertia a `contracts/microsoft-365-overview.md`, mantendo `discovery/microsoft-365/data-contracts.md` apenas como racional histórico complementar.
- Criar um provider/service que sirva dados reais do Graph hoje, gerencie o cache/snapshot por bloco via cache storage nativo do Laravel (driver de `config/cache.php`, TTL controlado por bloco; guarda último valor bem-sucedido + timestamp) e marque `fresh: false` quando servir snapshot em falha transitória. Não existe mock. Valores específicos de TTL por bloco são decisão de implementação, não requisito de especificação; apenas a granularidade por bloco e a política de atualização automática em recovery são requisitos.
- Tratar variáveis de ambiente de integração (`MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`) como seam técnico privado do backend, fora da interface do produto.
- Registrar que `users`, `groups`, `subscribedSkus`, `secureScores`, `secureScoreControlProfiles` e `healthOverviews` seguem coleção JSON `value[]`, enquanto `getOffice365ServicesUserCounts` exige fluxo de download/parsing de CSV.
- Tratar `serviceStatus` indisponível, `serviceUsage30d` parcial e demais falhas de fonte como cache/snapshot (`fresh: false`) quando houver snapshot, ou normalização para `empty`/`informational` quando não há, nunca como queda integral da overview.
- Garantir que credenciais, tokens, consentimentos e detalhes sensíveis de integração permaneçam exclusivamente no backend/ambiente e fora do payload Inertia.
- Registrar requisitos mínimos de diagnóstico interno para diferenciar blocos `graph-backed` (fresco), `stale` (cache/snapshot), `partial`, `editorial`, `empty` e `informational`.
- Implementar o indicador "Última att. em {tempo relativo}" na UI para todo bloco estruturado com `fresh: false`, de forma visível e compreensível.
- Reaproveitar componentes e wrappers existentes do módulo para charts, cards e status antes de considerar novos componentes.

## Complexity Tracking

Nenhuma violação constitucional prevista. A complexidade intencional adicional é o parser de CSV para `serviceUsage30d`, o cache/snapshot por bloco via Cache Laravel e o indicador "Última att." na UI.
