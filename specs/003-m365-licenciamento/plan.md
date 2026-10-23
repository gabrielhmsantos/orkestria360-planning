# Implementation Plan: Licenciamento Microsoft 365 V2

**Branch**: `feat/003-m365-licenciamento` | **Date**: 2026-07-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-m365-licenciamento/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Entregar as sete abas de Licenciamento como uma extensão do módulo Microsoft 365 existente. O backend Laravel coleta e normaliza a fotografia técnica, snapshots, evidências de consumo e eventos por tenant; o frontend Inertia/React apresenta investigação, recomendações explicáveis e estados explícitos de dados comerciais indisponíveis. A entrega não escreve no Microsoft Graph, não cria workflow comercial e não inventa valores financeiros.

## Technical Context

**Language/Version**: PHP/Laravel, TypeScript/React (versões definidas no projeto)

**Primary Dependencies**: Laravel, Inertia.js React, Tailwind/shadcn, Recharts encapsulado; cliente Microsoft Graph já existente

**Storage**: banco Laravel existente para estado técnico, snapshots, eventos e oportunidades; evidência CSV protegida por referência

**Testing**: PHPUnit feature tests com `ModulePageTestCase`, testes de serviços/mappers e verificações Inertia

**Target Platform**: aplicação web Laravel/Inertia autenticada

**Project Type**: monólito web Laravel + Inertia

**Performance Goals**: dashboard utilizável em até 3 minutos; páginas servidas de snapshots locais após a coleta; nenhuma chamada Graph por interação de tabela

**Constraints**: sincronização diária, isolamento obrigatório por tenant, PII fora de logs, frescor separado para coleta técnica e report, Graph somente leitura; preço/contrato/workflow fora da V2

**Scale/Scope**: sete páginas internas Microsoft 365, SKUs, usuários, planos, relatórios de uso, snapshots e eventos do tenant autenticado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Laravel-Conventional by Default**: criar modelos, migrations, controllers e testes com `php artisan make:*`; estender `GraphClient`, `GraphDataClient`, `BlockSnapshotStore` e o controller Microsoft 365 existentes, sem API pública paralela.
- **Consistent User Experience**: reutilizar `PageScaffold`, `ChartPanel`, `MetricCard`, `StatusBadge`, tabelas e indicadores de atualização; criar componentes de licenciamento somente quando uma composição for reutilizada entre abas.
- **Verifiable Quality Gates**: testes de navegação/contrato Inertia, persistência e regras; `composer ci:check` a cada lote build e `composer test` obrigatório ao final.
- **POC Scope with Controlled Full-Stack Evolution**: leitura Graph, persistência técnica e regras explicáveis são reais; preços, contratos, importação CSV comercial, alterações Graph, aprovações e compras continuam indisponíveis.
- **Simplicity Without Overengineering**: não haverá CQRS, filas distribuídas ou workflow engine; um serviço de sincronização e serviços de apresentação por domínio são suficientes para o MVP.

## Project Structure

### Documentation (this feature)

```text
specs/003-m365-licenciamento/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
```text
orkestria360/
├── app/Http/Controllers/Modules/          # controlador do submódulo
├── app/Models/                            # estado técnico e histórico de licença
├── app/Services/Microsoft365/Licensing/   # sincronização, normalização e regras
├── app/Support/Microsoft365/              # cliente Graph e snapshots existentes
├── database/migrations/                   # persistência mínima da V2
├── resources/js/pages/modules/            # shell e abas de licenciamento
├── resources/js/components/modules/       # painéis/tabelas reutilizáveis
├── resources/js/types/modules/            # contratos tipados Inertia
└── tests/Feature/                         # fluxo autenticado e contratos
```

**Structure Decision**: manter o monólito em `orkestria360/`; o submódulo é roteado sob Microsoft 365 e recebe um payload Inertia tipado. Persistência existe apenas para fatos técnicos e histórico que o Graph não preserva.

## Execution Decisions

- **Tenant context**: a V2 introduz um `TenantContext` autorizado; mesmo no tenant Contoso único, seu identificador Graph é obrigatório em cache, consultas, índices e respostas. O cache atual sem escopo não será reutilizado para Licenciamento.
- **Sync seguro**: `licensing_sync_runs` registra tenant, ciclo diário, fontes, início/fim, estado, contagens, falha sanitizada, versão e próxima execução. Um lock por tenant e chave idempotente protegem o ciclo. Dados são coletados/paginados antes de publicar a nova fotografia; falha preserva o último snapshot completo.
- **Leitura confiável**: requests Inertia servem exclusivamente a fotografia persistida pelo ciclo diário; sem snapshot concluído, o estado é `unavailable`, sem inferir coleta recente ou consultar Graph durante a navegação. O CSV `getOffice365ServicesUserCounts` é agregado e retorna `reportingState: anonymized`.
- **Reconciliação e evolução**: atribuições preservam cada origem direta ou por grupo e fatos ausentes de uma coleta integral são desativados; snapshots por SKU/ciclo expõem capacidade, consumo e variação contra a fotografia anterior. Frescor técnico e de relatório são calculados separadamente a partir dos timestamps persistidos.
- **Confiança de evidência**: `Report Refresh Date` do CSV é a data do relatório (separada da hora de ingestão). Variações inferidas apenas de snapshots ficam `pending`; somente evidência causal externa pode confirmá-las.
- **Fontes**: usuários paginados com atribuições/planos/estados são autoritativos. `licenseDetails` é capability opcional por tenant, com timeout/403/404 observáveis. Delta é otimização e não substitui reconciliação integral.
- **Segurança**: artefatos CSV ficam em disco privado por referência; UPN, nome e atributos organizacionais não entram em logs/erros. Exportações vêm somente da fotografia local autorizada.
- **Cenários e exceções**: Planejamento é somente leitura nesta V2. Oportunidades ficam `open` ou `insufficient_evidence`; exceções, simulação e ações são `coming_soon`.

## Experience and State Matrix

| Área | Estados obrigatórios | Interação/teste mínimo |
|---|---|---|
| Dashboard | sem snapshot, `fresh`, `stale`, `unavailable`, próxima coleta/falha | preserva último dado completo; período compartilhado chega às abas seguintes |
| Inventário | sem SKU, filtro vazio, detalhe nominal indisponível | filtros por produto/elegibilidade operáveis por teclado; não expõe exportação ou detalhe nominal nesta V2 |
| Consumo | identificado, anonimizado, insuficiente, sem permissão, report atrasado | não mostra pessoa em anonimizado; exibe frescor técnico e do report separadamente |
| Custos | comercial indisponível em resumo, evolução, produto, departamento, usuário, eficiência, orçamento, alertas e renovação | cada bloco preserva propósito, fonte/cobertura/frescor e condição Assessment/CSV, sem zero; CTA não cria solicitação |
| Otimização | sem evidência, bloqueio, oportunidade aberta | payload mostra regra, versão, período, fontes, prioridade, confiança, recursos e impedimentos |
| Histórico | sem cobertura antes da implantação, evento pendente/confirmado | conserva origem e evidência; linha do tempo filtrável |
| Planejamento | renovação sem vigência, cenário sem evidência | apresenta premissas e limites; não possui comando de escrita |

Todas as abas usam um objeto de sincronização por fonte: `source`, `lastSuccessfulAt`, `freshness`, `nextExpectedAt`, `status`, `reason` e `lastFailureAt`. Tabs usam semântica ARIA/teclas direcionais; detalhes devolvem foco ao fechar; tabelas anunciam ordenação e gráficos possuem resumo textual.

## Extension — illustrated sponsor surfaces

The seven sponsor illustrations are the information-completeness reference for this feature. The execution preserves each decision surface even when its source is not yet available. The detailed mapping is maintained in `discovery/microsoft-365/v2/licenciamento/expectativas-ilustradas.md`.

- **Availability contract**: each prepared section exposes `available`, `unavailable`, `restricted` or `coming_soon`, together with purpose, missing condition, source/coverage and a safe next step. Missing data never becomes a zero KPI, blank chart or hidden decision surface.
- **Dashboard composition**: KPI ribbon, utilisation donut, cost evolution, opportunities, product inventory, department allocation, utilisation trend and alerts use a common per-block presentation contract. Commercial data stays unavailable; nominal and department detail stays restricted when report identification or tenant authorization is absent.
- **Inventory and consumption**: the product detail shell retains summary, service plans, users/assignments, commercial contracts and change history; consumption retains products, people, departments, trend and alerts. Only technically permitted aggregates are populated. User, department and contract sections declare their boundary instead of receiving an invented value.
- **Analytical surfaces**: optimisation retains queue, evidence, categories, simulator, exceptions and outcomes; history retains timeline, quantitative/financial evolution and product/user history; planning retains scenarios, roadmap, renewals and commercial workspace. Technical evidence is inspectable read-only, while commercial values, workflow and tenant mutations remain unavailable or coming soon.
- **Historical nominal boundary**: filters and details by person or department are `restricted` presentation surfaces in this V2. They cannot populate, query or expose nominal data until an identified report and approved tenant authorization model exist; product, period, origin and confirmation remain the active technical filters.
- **Metric integrity**: `TenantLicenseSkuCalculationSetting.included_in_calculation` is applied before every technical capacity total, donut, trend, opportunity and planning scenario. The sync persists every technical SKU and creates an included setting only when it is absent. The idempotent seed initializes existing SKUs and excludes `POWERAPPS_DEV` (`5b631642-bd26-49fe-bd20-1daaa972ef80`), `POWER_BI_STANDARD` (`a403ebcc-fae0-4ca2-8c8c-7a907fd6c235`), `WINDOWS_STORE` (`6470687e-a428-4b7a-bef2-8a291ad947c9`) and `FLOW_FREE` (`f30db892-07e9-47e9-837c-80727f46fd3d`); excluded SKUs remain visible in inventory/history. Names are resolved from `storage/app/microsoft365/licenses_display_name.json`. Workload counts cannot be labelled as unique users unless reconciled by an identified source.
- **Accessibility**: prepared panels remain keyboard discoverable, tabs follow ARIA behaviour, details restore focus, chart summaries are textual, and an available evidence-review action is never represented only as a disabled control.
