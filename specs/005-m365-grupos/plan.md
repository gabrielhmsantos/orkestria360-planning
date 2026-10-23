# Implementation Plan: Grupos Microsoft 365 V2

**Branch**: `feat/005-m365-grupos` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-m365-grupos/spec.md`

## Summary

Entregar oito superfícies de investigação de Grupos Microsoft 365 a partir de uma
fotografia publicada do tenant Contoso. O backend coleta somente leituras do
diretório Microsoft 365, preserva dados e evidências temporais necessárias para
atividade, licenciamento, ciclo de vida e auditoria, e entrega props tipadas à
página Inertia. Cada bloco declara origem, cobertura, frescor e disponibilidade;
dados ausentes nunca se tornam zero, inatividade confirmada ou conclusão positiva.
Todas as ações mutáveis e exportações permanecem `coming_soon`.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7, React 19.2

**Primary Dependencies**: Laravel 13.7, Inertia React 3, Tailwind CSS 4,
shadcn/ui, Recharts 3.8, cliente Microsoft Graph app-only existente

**Storage**: banco Laravel já configurado, com dados escopados ao tenant Contoso;
snapshots e eventos de Grupos persistidos conforme o modelo desta feature

**Testing**: PHPUnit 12 com `ModulePageTestCase`; Feature tests, ESLint,
Prettier, PHPStan e gates Composer

**Target Platform**: aplicação web Laravel/Inertia servida no ambiente POC

**Project Type**: aplicação web monolítica Laravel + Inertia + React

**Performance Goals**: em tenant de teste com até 10.000 grupos, carregamento
inicial, filtro e abertura de detalhe mostram conteúdo ou estado explícito em até
5 segundos

**Constraints**: Graph é acessado somente no backend e somente para leitura;
uma página lê uma fotografia publicada coerente; estados por fonte são
`available`, `restricted`, `unavailable` ou `coming_soon`; não há exportação,
mutação no tenant, RBAC, hierarquia de acesso ou restrição por campo

**Scale/Scope**: tenant único Contoso; oito superfícies e respectivos detalhes;
reconciliação atual de diretório/relações e histórico apenas para atividade,
licenciamento, ciclo de vida e auditoria

## Constitution Check

### Before Phase 0

- **Laravel-Conventional by Default — PASS**: usar migrations, models,
  command agendado, controller invocável, serviços de sincronização/page data,
  rotas e Feature tests gerados por Artisan. Estender `GraphClient` e
  `GraphDataClient`; não criar cliente ou serviço externo paralelo.
- **Consistent User Experience — PASS**: a página será um shell fino de abas
  com `PageScaffold`, `ModuleHero`, `ModuleTabBar`, `OperationalMetricGrid`,
  `OperationalSectionCard`, `OperationalTable`, `DataAvailabilityPanel`,
  `SourceMetadata` e `DataFreshness`. Gráficos Recharts permanecem encapsulados
  em `ChartPanel` e terão legenda, valores e resumo textual equivalente.
- **Verifiable Quality Gates — PASS**: cada lote executa testes Feature da
  superfície e `composer ci:check`; a entrega completa exige `composer test` no
  repositório `orkestria360/`.
- **POC Scope with Controlled Full-Stack Evolution — PASS**: sincronização,
  persistência e leitura Graph são reais. Score, limiares, custo, dados internos
  de governança sem fonte aprovada, revisões executáveis, simulador, exportações
  e qualquer alteração no tenant ficam fora do escopo.
- **Simplicity Without Overengineering — PASS**: um domínio `Groups` dentro da
  aplicação monolítica, uma geração publicada e o conector Graph existente
  resolvem consistência. Não haverá microserviço, fila distribuída, API pública
  ou nova aplicação.
- **Surface-to-Story Traceability — PASS**: cada aba do módulo possui uma fase
  independente: Dashboard (US1), Diretório (US2), Membros e Proprietários
  (US3), Dinâmicos (US4), Licenciamento (US5), Governança/Ciclo de Vida (US6),
  Atividade/Inatividade (US7) e Histórico/Auditoria (US8).
- **Single Application Audience — PASS**: o módulo reutiliza a autenticação
  existente; qualquer usuário criado e autenticado vê os mesmos dados
  disponíveis. Não haverá Gate, papel, perfil, hierarquia ou regra por campo.

### After Phase 1

Todos os itens continuam **PASS**. Os artefatos documentam sincronização
read-only, dados escopados ao tenant, estados de disponibilidade, contratos
Inertia e a ausência deliberada de RBAC e mutações. Nenhuma violação requer
Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/005-m365-grupos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── groups-inertia.md
│   └── groups-sync.md
└── tasks.md                    # criado posteriormente por /speckit-tasks
```

### Source Code

```text
orkestria360/
├── app/
│   ├── Console/Commands/SyncMicrosoft365Groups.php
│   ├── Http/Controllers/Modules/GroupsController.php
│   ├── Models/                 # grupos, relações, snapshots, eventos e estados
│   ├── Services/Microsoft365/Groups/
│   │   ├── GroupsSynchronizer.php
│   │   ├── GroupsPageData.php
│   │   ├── GroupSourceStateRecorder.php
│   │   └── collectors/         # diretório, relações, dinâmicos, ciclo, atividade, licença e auditoria
│   └── Support/Microsoft365/   # extensão do GraphClient/GraphDataClient
├── database/migrations/
├── resources/js/
│   ├── components/modules/groups/
│   ├── pages/modules/groups.tsx
│   ├── routes/groups/
│   └── types/modules/groups.ts
├── routes/web.php
└── tests/Feature/Groups/
```

**Structure Decision**: manter a aplicação monolítica. `GroupsPageData` é a
única entrada de props para a página; cada aba possui componente próprio; o
conector Graph existente é a única fronteira de integração externa.

## Implementation Approach

1. Criar o domínio de Grupos usando os padrões de Usuários e Contas: run de
   sincronização, geração `staging`/`published`/`failed`, estado por fonte e
   modelos tenant-scoped. Relações ficam na tabela tipada `group_relationships`:
   `GroupMembership` e `GroupOwner` são projeções de escopo fixo para membro e
   proprietário, sem misturar relação superior ou associação direta/transitiva.
   A geração anterior segue legível até uma promoção atômica bem-sucedida.
2. Estender o contrato Graph com leituras paginadas de grupos, delta,
   membros/proprietários e relações superiores, regras dinâmicas, atribuições e
   erros de licença, ciclo de vida, relatórios de atividade e auditoria. O
   conector central trata paginação, 429/5xx e erros sanitizados; cada coletor
   converte 403, lacuna de licença, 404, resposta vazia e cursor inválido em
   estados distintos.
3. Executar uma carga inicial e, depois, delta/reconciliações por tenant usando
   lock. Alterações e auditoria podem ser coletadas em ciclos curtos; diretório,
   relações, atividade, licença e ciclo de vida são reconciliados diariamente.
   Essas frequências são configuração operacional a validar, não SLA de produto.
4. Persistir o catálogo corrente e relações; criar snapshots somente para os
   recortes temporais aprovados. Eventos de auditoria são normalizados com fonte
   e cobertura. Cursor delta permanece opaco; 410 ou cursor inválido reinicia a
   reconciliação sem publicar dados incompletos.
5. Montar `GroupsPageData` exclusivamente da geração publicada e de estados de
   fonte. Busca, filtros, paginação e aba ativa usam query string; cada aba
   retorna `no_matches`, `empty_valid_response`, `restricted`, `unavailable` ou
   `coming_soon` sem inferência indevida.
6. Criar uma página de Grupos fina e componentes por superfície. Tabelas mantêm
   cabeçalho, caption acessível e rolagem horizontal; gráficos possuem valores e
   resumo textual. Ações de modificar, revisar, simular ou exportar aparecem
   como intenção sem rota de escrita.
7. Cobrir o contrato de abas, fotografia publicada, fonte/frescor, filtros e
   paginação, ausência de dados, ações `coming_soon` e o limite de cinco
   segundos. A autenticação existente é suficiente; não há testes de RBAC.

## Story-to-Implementation Mapping

| Story | Superfície | Entrega independente | Evidência principal |
|---|---|---|---|
| US1 | Dashboard Executivo | KPIs, distribuição, tendência e atenção | geração publicada, fonte e estado |
| US2 | Diretório de Grupos | busca, filtros, paginação e detalhe | catálogo corrente e query string |
| US3 | Membros e Proprietários | relações e contexto do grupo | tipo de vínculo e cobertura |
| US4 | Grupos Dinâmicos | regras, processamento e mudanças | licença, regra e estado de fonte |
| US5 | Licenciamento por Grupo | distribuição, erros e oportunidades | atribuições, erro e frescor |
| US6 | Governança e Ciclo de Vida | estado, expiração e capacidades | fonte, política e `coming_soon` |
| US7 | Atividade e Inatividade | faixas e candidatos à revisão | relatório, tipo de grupo e cobertura |
| US8 | Histórico e Auditoria | filtros, detalhe e retenção | evento, ator, período e cobertura |

## Implementation Roadmap

| Marco | Estado | Dependência |
|---|---|---|
| Fundação de Grupos: contrato Graph, geração e estados de fonte | concluído | migrations e conector existente |
| US1–US3: Dashboard, Diretório e Membros/Proprietários | concluído | fundação publicada |
| US4–US6: Dinâmicos, Licenciamento e Ciclo de Vida | concluído | fontes e snapshots aplicáveis |
| US7–US8: Atividade e Auditoria | concluído | relatórios, eventos e retenção |
| Validação final | concluído | todas as superfícies e `composer test` |
| Aceite humano de sucesso | planejado | validação técnica final e público previsto |

## Complexity Tracking

Nenhuma violação constitucional identificada.
