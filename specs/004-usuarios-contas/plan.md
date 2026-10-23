# Implementation Plan: Usuários e Contas Microsoft 365 V2

**Branch**: `feat/004-usuarios-contas` | **Date**: 2026-07-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-usuarios-contas/spec.md`

## Summary

Entregar as oito superfícies investigativas de Usuários e Contas para pessoas usuárias autenticadas. A aplicação coleta dados Microsoft Graph apenas no backend, persiste uma fotografia geracional e apresenta-a por Inertia sem chamadas Graph no navegador. O Diretório, sinais de atividade, privilégios, convidados e auditoria mantêm disponibilidade, cobertura e frescor por fonte; Convidados preserva estado B2B (`externalUserState`) e análises sobre a geração publicada; Saúde publica o catálogo inicial aprovado, mantendo score, triagem, evolução e recomendações indisponíveis. Licenciamento continua como fonte suplementar de atribuições. A versão é integralmente somente leitura: exportações protegidas usam CSV e ações de ciclo de vida permanecem `coming_soon`.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7, React 19.2

**Primary Dependencies**: Laravel 13.7, Inertia Laravel/React 3, Tailwind CSS 4, shadcn/ui, Recharts 3.8, Microsoft Graph PHP/Kiota (app-only)

**Storage**: banco Laravel já configurado por ambiente; disco privado Laravel somente para evidência permitida e exportações transitórias auditáveis

**Testing**: PHPUnit 12 com `ModulePageTestCase`; testes Feature de autorização, sincronização, contratos Inertia e exportação; ESLint, Prettier e PHPStan

**Target Platform**: aplicação web Laravel servida no ambiente POC

**Project Type**: aplicação web monolítica Laravel + Inertia + React

**Performance Goals**: Dashboard permite apontar a investigação inicial em até 3 minutos; Diretório localiza e abre uma identidade em até 3 interações; a navegação lê somente a fotografia persistida.

**Constraints**: Graph exclusivamente backend/app-only; nenhum write no tenant configurado; PII, dados de autenticação, auditoria e CSV fora de logs e URLs temporárias; uma geração publicada não pode misturar dados de outra; snapshots e eventos próprios por 12 meses, escopados por `tenant_id`.

**Scale/Scope**: aplicação single-tenant com `tenant_id` como escopo de dados, oito superfícies e detalhe de identidade; cada fonte pode ter disponibilidade independente (`available`, `restricted`, `unavailable`, `coming_soon`).

## Constitution Check

### Before Phase 0

- **Laravel-Conventional by Default — PASS**: usar rotas, controller fino, serviços de page data, command agendado, migrations/models e Feature tests. Reutilizar `GraphClientFactory`, `GraphClient`, `GraphDataClient`, `TenantContext` e o padrão de sincronização de Licenciamento; apenas estender o contrato Graph com leituras específicas de identidade.
- **Consistent User Experience — PASS**: seguir `PageScaffold`, navegação por abas do Licenciamento, tabelas, filtros preservados na query string, estados vazios explícitos e componentes de módulos Microsoft 365. Cada bloco expõe fonte, cobertura, atualização, disponibilidade e frescor.
- **Verifiable Quality Gates — PASS**: cada lote de implementação roda testes Feature direcionados e `composer ci:check`; a entrega completa exige `composer test` no repositório `orkestria360/`.
- **POC Scope with Controlled Full-Stack Evolution — PASS**: integração de leitura Graph, persistência e sincronização são reais; cálculo de score, fontes de RH/patrocinador/revisão, XLSX e qualquer workflow ou alteração de tenant ficam fora do escopo.
- **Simplicity Without Overengineering — PASS**: um módulo Laravel isolado e fotografia geracional do tenant configurado, com `tenant_id` como escopo persistido, resolvem consistência sem nova aplicação, fila distribuída ou serviço externo.
- **Surface-to-Story Traceability — PASS**: as oito abas são preservadas como oito fases testáveis: Dashboard (US1), Diretório/detalhe/exportação (US2), Saúde (US3), Atividade (US4), Privilegiadas (US5), Convidados (US6), Ciclo de Vida (US7) e Histórico/exportação (US8).

### After Phase 1

Todos os itens continuam **PASS**. `research.md`, `data-model.md`, os contratos e `quickstart.md` mantêm a separação entre disponibilidade e frescor, documentam a promoção atômica de geração e não incluem operações de escrita no tenant. Não há violações que exijam Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/004-usuarios-contas/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── users-accounts-inertia.md
│   └── users-accounts-sync.md
└── tasks.md                    # criado posteriormente por /speckit-tasks
```

### Source Code

```text
orkestria360/
├── app/
│   ├── Console/Commands/SyncMicrosoft365UsersAccounts.php
│   ├── Http/Controllers/Modules/UsersAccountsController.php
│   ├── Models/                 # fotografia, sinais, achados, privilégios, eventos e exportações
│   ├── Services/Microsoft365/UsersAccounts/
│   │   ├── UsersAccountsPageData.php
│   │   ├── UsersAccountsSynchronizer.php
│   │   └── TenantActivitySettings.php
│   └── Support/Microsoft365/    # extensão read-only de GraphClient/GraphDataClient
├── database/migrations/
├── resources/js/
│   ├── components/modules/users-accounts/
│   ├── pages/modules/users-accounts.tsx
│   └── types/modules/users-accounts.ts
├── routes/
│   ├── console.php
│   └── web.php
└── tests/Feature/UsersAccounts/
```

**Structure Decision**: manter a aplicação monolítica existente. O módulo fica sob `Services/Microsoft365/UsersAccounts`, o conector Graph existente permanece o único limite de integração e a página React é um shell de abas com componentes por superfície.

## Implementation Approach

1. Reutilizar somente `auth` e `verified` das rotas atuais; esta V2 não cria Gate, papel local, matriz de visibilidade ou segregação por perfil.
2. Estender o seam Graph com métodos de leitura paginada e sanitização de falha para usuários/delta, convidados, funções permanentes, PIM, registro MFA, atividade e auditoria. Cada coletor retorna dados ou diagnóstico de cobertura; `403`, `404`, `400 AadPremiumLicenseRequired` e coleção vazia válida nunca se convertem em zero.
3. Executar `SyncMicrosoft365UsersAccounts` somente para o tenant configurado, diariamente no seu timezone IANA (inicialmente `America/Sao_Paulo`), com lock e ciclo idempotente. A geração de staging começa materializada da publicada, faz merge por `graph_id`, aplica `@removed` como tombstone e só promove, numa única transação com ponteiro exclusivo, a fotografia íntegra e seu cursor/delta link protegido. Um reset de delta reinicia a reconciliação completa sem retirar a geração publicada anterior da leitura.
4. Reconciliar diariamente em `GET /users` os campos `assignedLicenses`, `assignedPlans` e `licenseAssignmentStates` na própria geração de identidades; `/users/delta` não é fonte suficiente para essas atribuições. `UserLicenseAssignment` e `TenantLicenseSku` de Licenciamento são apenas leitura suplementar, com frescor declarado, nunca a base de uma geração publicada.
5. Montar `UsersAccountsPageData` exclusivamente da geração publicada e da configuração do tenant. Cada resposta Inertia inclui `availabilityStatus`, `freshness`, `source`, `coverage`, `lastUpdatedAt`, `reason` e `snapshotGeneration` onde aplicável.
6. Entregar uma rota e componente por superfície, com busca, filtros, ordenação e paginação de Diretório/Auditoria preservados na URL. O perfil recebe o contexto de filtro de origem. Saúde projeta categorias e severidades do catálogo inicial, mantendo score, triagem, evolução e recomendações `unavailable`; Ciclo de Vida somente exibe capacidades `coming_soon`.
7. Exportar apenas CSV do recorte local autenticado, usando controller dedicado, revalidação da sessão, allowlist de colunas, neutralização de fórmulas de planilha e trilha de auditoria. Não persistir conteúdo CSV bruto em logs, nem entregar URL temporária.
8. Criar tarefa de retenção do tenant configurado para snapshots e eventos com mais de 12 meses; nunca prometer retenção maior do que a fonte Graph.

## Story-to-Implementation Mapping

| Story | Superfície | Entrega independente | Evidência principal |
|---|---|---|---|
| US1 | Dashboard Executivo | resumo da geração e blocos de cobertura | identidade, distribuição, fonte/estado |
| US2 | Diretório de Usuários | lista, filtros, detalhe e CSV autorizado | fotografia, licenças reutilizadas |
| US3 | Saúde das Contas | categorias e severidades explicáveis | catálogo inicial sobre a geração publicada |
| US4 | Atividade e Inatividade | faixas 15/30/60/90 configuráveis | sinal, período e cobertura |
| US5 | Contas Privilegiadas | funções permanentes e PIM restrito quando aplicável | privilégio, escopo, diagnóstico PIM |
| US6 | Convidados e Externos | dados B2B base e campos futuros indisponíveis | tipo guest, domínio, licença |
| US7 | Ciclo de Vida | mapa de capacidades sem operação | `coming_soon`, condição habilitadora |
| US8 | Histórico e Auditoria | filtros, detalhe e CSV autorizado | evento, ator/alvo, retenção/cobertura |

## Complexity Tracking

Nenhuma violação constitucional identificada.
