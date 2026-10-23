# Implementation Plan: Microsoft 365 — Autenticação (MFA)

**Branch**: `feat/007-m365-mfa` | **Date**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação MFA e discovery validado em `discovery/microsoft-365/v2/autenticacao-mfa`.

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Entregar as oito abas de Autenticação (MFA) como consumidores de projeções locais publicadas. Estender o sync coordenado com snapshots de registro MFA e política de métodos, eventos canônicos de sign-in/auditoria e snapshots de risco; construir projeções de página e componentes por aba. O módulo é somente leitura: não expõe Atualizar, exportação nem ações de tenant.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7.

**Primary Dependencies**: Laravel 13, Inertia React, Tailwind/shadcn UI, Recharts, Microsoft Graph/Kiota.

**Storage**: Banco relacional existente; snapshots de identidade, estados de fonte, lotes canônicos de eventos e novas fotografias de política/classificação MFA.

**Testing**: PHPUnit feature tests e testes do cliente Graph; `composer ci:check` e `composer test`.

**Target Platform**: Aplicação web Laravel e sync coordenado agendado por tenant.

**Project Type**: Monólito web Laravel/Inertia.

**Performance Goals**: Uma leitura por fonte canônica/ciclo; páginas leem apenas dados publicados; toda etapa registra páginas, itens, duração, tentativas e throttling.

**Constraints**: Sem HTTP Graph nas páginas ou dentro de promoção; eventos com watermark/overlap já canônico; snapshots MFA/política/risco preservam última publicação; eventos e auditoria retêm 180 dias por tenant e snapshots 12 meses.

**Scale/Scope**: Um tenant por ciclo, oito abas MFA, fontes de registro, política, sign-ins, risco e auditoria; uma audiência autenticada uniforme.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Antes da pesquisa

- **Laravel-Conventional by Default**: reutilizar `GraphClient`, sync coordenado, Eloquent, migrations, `ModulePageTestCase` e serviços de page data; novos modelos/collectors somente para fatos ainda sem projeção.
- **Consistent User Experience**: reutilizar shell e tabs Microsoft 365, `OperationalKpiCard`, `OperationalMetricGrid`, `ChartPanel`, `OperationalTable`, `DataAvailabilityPanel`, `SourceMetadata` e `DataFreshness`.
- **Verifiable Quality Gates**: é fluxo completo; executar `composer ci:check` por lote e `composer test` antes da conclusão. Cobrir contratos, fonte restrita, estados de disponibilidade, políticas SMS/Voice e rotas/tabs.
- **POC Scope with Controlled Full-Stack Evolution**: Graph e persistência são reais. Score, alertas, exceções, ações e exportação seguem indisponíveis até regras/workflows aprovados.
- **Simplicity Without Overengineering**: não criar RBAC, filas, novos comandos públicos nem chamadas Graph por tela. Usar o sync coordenado e as projeções existentes.
- **Surface-to-Story Traceability**: os títulos canônicos dos cards vêm da referência do sponsor; tipo visual é separado. US1: MFA Health Score, Cobertura de MFA, Evolução da cobertura de MFA, Métodos mais utilizados, Principais riscos e alertas, Distribuição por tipo de usuário e Top 5 aplicações com maior uso de MFA. US2: Distribuição por status de MFA, Evolução da cobertura de MFA, Cobertura por tipo de usuário, Usuários por status de MFA, Destaques e Oportunidades de melhoria. US3: Distribuição de usuários por método registrado, Adoção dos métodos ao longo do tempo, Distribuição por nível de segurança dos métodos, Métodos de autenticação disponíveis, Recomendações e Métodos mais utilizados. US4: Autenticações ao longo do tempo, Autenticações por método/aplicação/localização/dispositivo, Taxa de sucesso por método, Últimos eventos de autenticação e Insights e recomendações. US5: Falhas ao longo do tempo, Falhas por categoria/método, Usuários com falhas recorrentes, IPs com maior volume de falhas, Aplicações com mais falhas, Últimos eventos de falha e Ações recomendadas. US6: MFA Protection Score, Políticas de Métodos, Forças, Acesso Condicional, Resumo de Proteções, Exceções e Exclusões e Status das Políticas. US7: Evolução de usuários de risco, Riscos por tipo, Risco por localização, Usuários de risco, Ações rápidas e Insights e recomendações. US8: Eventos de auditoria, Filtros rápidos de atividade, Origens dos eventos, Retenção e armazenamento, Ações disponíveis, Detalhes do evento selecionado e Informações adicionais. Referência: [representação estrutural](../../discovery/microsoft-365/v2/autenticacao-mfa/representacao-estrutural-das-telas.md).
- **Single Application Audience**: reutilizar acesso autenticado uniforme; nenhum RBAC.

**Resultado do gate**: aprovado.

### Depois do design

O desenho usa fontes canônicas e snapshots publicados; `mobilePhone` é qualificado por políticas SMS/Voice e por grupos locais, sem hardcode ou leitura por página. O contrato Inertia é o único limite entre páginas e page-data. **Resultado do gate: aprovado.**

## Project Structure

### Documentation (this feature)

```text
specs/007-m365-mfa/
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
├── app/Services/Microsoft365/{Sync,UsersAccounts,Mfa}/
├── app/Support/Microsoft365/{Contracts,GraphDataClient.php}/
├── app/Models/
├── app/Http/Controllers/Modules/
├── database/migrations/
├── resources/js/pages/modules/
├── resources/js/components/modules/mfa/
├── routes/
└── tests/Feature/{Microsoft365,UsersAccounts,Mfa}/
```

**Structure Decision**: Implementação no monólito `orkestria360/`; sincronização e projeções em serviços PHP, composição visual em componentes MFA por aba e páginas Inertia finas.

## Delivery Plan

### Phase 1 — Fundamentos e fontes publicadas

1. Criar entidades/migrations para fotografia de política MFA e tabela de classificação por método; popular os defaults aprovados, inclusive `sms`/`voice` como fracos com aplicabilidade dinâmica, e registrar estados de fonte.
2. Estender o cliente/contrato Graph e o sync coordenado para snapshots de política: `authenticationMethodsPolicy` (incluindo `Sms`/`Voice`, alvos e `isOfficePhoneAllowed`), authentication strengths, Conditional Access e security defaults. Cada origem publica disponibilidade independente, sem chamadas individuais redundantes.
3. Reutilizar registro MFA, identidades, grupos, sign-ins e auditoria canônicos; separar snapshots de risky users e risk detections quando a licença/consentimento permitir, estendendo apenas os coletores que ainda não materializam campos exclusivos.
4. Cobrir 200, 403/licença, vazio válido, paginação, preservação de publicação e cruzamento de alvo de política com grupos locais.

### Phase 2 — Projeções de domínio e contrato Inertia

1. Criar serviço de page data MFA que compõe as oito abas exclusivamente de snapshots/eventos publicados e estados de fonte.
2. Aplicar regra de elegibilidade e classificação: `mobilePhone` deriva canais de SMS/Voice e escopo de grupos; sem escopo publicado, canal indisponível.
3. Criar snapshots históricos de cobertura quando o ciclo aprovado existir; manter score, alertas, exceções e derivações normativas como indisponíveis até fonte/regra.
4. Definir rota, controller e payload Inertia tipado conforme `contracts/mfa-inertia.md`.

### Phase 3 — Superfícies e consistência

1. Criar shell/page e oito componentes de aba seguindo a representação estrutural e os nomes exatos de cards.
2. Reutilizar componentes operacionais e estados de disponibilidade; estender `ChartPanel` com gauge quando necessário, remover o controle Atualizar do header MFA e manter apenas última coleta.
3. Implementar filtros, tabelas, detalhes e resumos textuais apenas quando o dado publicado suporta a interação; preservar PII minimizada e acessibilidade.

### Phase 4 — Verificação e entrega

1. Testar source states, cálculos, políticas SMS/Voice, navegação/tabs, payloads Inertia, responsividade e indisponibilidades.
2. Executar `composer ci:check` por lote e `composer test` no fim; atualizar roadmap e criar commits atômicos no repositório da aplicação para código e no raiz para artefatos.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Snapshot de política MFA | Políticas SMS/Voice e seus alvos são fonte real necessária para classificar `mobilePhone` corretamente. | Hardcode perde alterações do tenant e induz rótulos incorretos. |
