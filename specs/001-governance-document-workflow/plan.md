# Implementation Plan: Workflow Documental de Governança

**Branch**: `feat/001-governance-document-workflow` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-governance-document-workflow/spec.md`

## Summary

Transformar o módulo de governança atual em um workflow documental para 8 tópicos, preservando o dashboard Inertia/React existente e adicionando o menor conjunto de backend Laravel necessário para persistir metadados, download de template, upload do documento vigente, aprovação administrativa, score e vigência em meses sem introduzir camadas extras além de models, migrations, form requests, controllers e feature tests.

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7, React 19

**Primary Dependencies**: Laravel 13, Inertia Laravel 3, Inertia React 3, Tailwind CSS 4, shadcn/ui

**Storage**: SQLite/MySQL via Eloquent para persistência relacional; disco local do Laravel para templates e documentos enviados

**Testing**: PHPUnit feature tests, Inertia assertions, TypeScript check, ESLint, Prettier, PHPStan

**Target Platform**: Aplicação web Laravel + Inertia para desktop e mobile web

**Project Type**: Monólito web full-stack com frontend React server-driven via Inertia

**Performance Goals**: Abrir `/governance` com os 8 tópicos e renderizar overview e detalhe sem paginação extra; submissões e aprovações devem refletir imediatamente no payload Inertia da sessão atual

**Constraints**: Seguir convenções nativas do Laravel; evitar serviços/repositories sem necessidade comprovada; manter integrações externas mockadas; usar `php artisan make:*` para artefatos Laravel; preservar consistência visual do módulo atual

**Scale/Scope**: 8 tópicos fixos, 1 documento ativo por tópico, 1 template oficial por tópico, 1 score administrativo por tópico, 2 perfis funcionais principais (`operacional` e `Administrador`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Laravel-Conventional by Default**: Reutilizar `routes/web.php`, controllers Inertia, Eloquent models, form requests, policies/gates simples se necessários, `Storage` para arquivos e feature tests em `tests/Feature`. Artefatos Laravel serão gerados com `php artisan make:model`, `make:controller`, `make:request` e `make:test`. Nenhuma abstraction não padrão é necessária nesta fase.
- **Consistent User Experience**: Preservar `PageScaffold`, `ScoreCard`, `MetricCard`, `GovernanceDocumentsTable`, `GovernanceInsightsPanel`, `StatusBadge` e o padrão de payload `data` já usado no módulo. O overview continua em `/governance`, com evolução para ações por linha e detalhe por tópico usando a mesma linguagem visual.
- **Verifiable Quality Gates**: O gate planejado é `composer test`, porque haverá mudança full-stack com novas rotas, persistência, validação e testes de fluxo. Testes cobrirão overview, detalhe do tópico, transições de status, autorização administrativa e regras de score/vigência.
- **POC Scope with Credible Outcomes**: Templates e uploads usarão armazenamento local; não haverá integração com Microsoft Graph, assinatura eletrônica, versionamento completo, workflow formal de reprovação nem notificações assíncronas. A solução pode derivar dados do backend real apenas para validar o workflow documental.
- **Simplicity Without Overengineering**: A modelagem ficará centrada em poucas tabelas relacionais e controllers por recurso. Não serão introduzidos repository pattern, event sourcing, filas ou histórico de versões completo. Complexidade adicional não é necessária no desenho atual.

## Project Structure

### Documentation (this feature)

```text
specs/001-governance-document-workflow/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── governance-document-workflow.md
└── tasks.md
```

### Source Code (repository root)

```text
orkestria360/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   └── Models/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
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

**Structure Decision**: Manter o monólito Laravel + Inertia existente em `orkestria360/`, evoluindo o módulo de governança com rotas web, controllers Inertia, models Eloquent, migrations e componentes React já alinhados ao dashboard atual. Não há necessidade de separar frontend/backend nem introduzir novos pacotes internos.

## Phase 0: Research Summary

- Persistência e workflow devem seguir Eloquent + migrations + form requests, sem repositories.
- Upload e download devem usar `Storage` e requests multipart, com validação server-side e submissão via `useForm`.
- O contrato principal é o payload Inertia de overview e detalhe, não uma API pública separada.
- O score do módulo será derivado no backend a partir dos 8 tópicos persistidos, tratando não concluídos como `0`.

## Phase 1: Design Decisions

- Persistir um registro por tópico de governança e um registro por documento ativo, mantendo 8 tópicos fixos e seedados.
- Modelar transições de status diretamente no domínio do tópico, incluindo o estado inicial `Não iniciado`, com regras aplicadas em controller/request ao invés de state machine framework.
- Expor overview e detalhe com rotas Laravel autenticadas; ações de metadados, download, upload e aprovação usarão POST/PATCH tradicionais com redirect de volta para páginas Inertia.
- Centralizar o cálculo de score e distribuição de status no backend que monta o payload da página `governance`.
- Tratar o usuário administrador por autorização Laravel simples baseada no papel funcional `Administrador`, sem ACL complexa nesta fase.

## Post-Design Constitution Check

- **Laravel-Conventional by Default**: Pass. O desenho usa apenas recursos nativos do framework e os diretórios já existentes.
- **Consistent User Experience**: Pass. O overview continua no mesmo módulo e os novos estados aproveitam os componentes atuais.
- **Verifiable Quality Gates**: Pass. O plano prevê `composer test` e feature tests específicos do fluxo.
- **POC Scope with Credible Outcomes**: Pass. O escopo segue local/mock onde possível e adiciona backend apenas onde valida o produto.
- **Simplicity Without Overengineering**: Pass. A solução evita camadas extras e mantém apenas o domínio mínimo necessário.

## Implementation Notes

- Gerar artefatos Laravel no diretório `orkestria360/` com Artisan.
- Espelhar os 8 tópicos fixos a partir de `discovery/estruturacao-governanca/forms/`.
- Atualizar `resources/js/data/modules/governance.ts` para refletir o novo contrato do overview e detalhe, reduzindo dados mockados de rota inline.
- Migrar o payload atual de `routes/web.php` para um controller dedicado de governança antes de expandir ações.

## Complexity Tracking

Nenhuma violação constitucional prevista.
