# Implementation Plan: Otimização dos Syncs Microsoft 365

**Branch**: `feat/006-otimizar-sync-m365` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação e diagnóstico em MICROSOFT365-SYNC-AVALIACAO.md (referência histórica não disponível neste escopo).

## Summary

Substituir os três syncs independentes por um ciclo coordenado por tenant. O ciclo manterá coleções canônicas de identidades, grupos e eventos; aplicará delta efetivo a recursos de estado e watermark de 15 minutos a eventos; reutilizará a fotografia de identidades para Licenciamento; e publicará etapas independentes mesmo quando uma fonte primária de outra etapa falhar. O foco é eliminar leituras duplicadas, reduzir N+1 aos objetos alterados, preservar gerações íntegras e tornar cobertura, frescor e desempenho observáveis.

## Technical Context

**Language/Version**: PHP 8.3+; TypeScript 5.7 para ajustes de apresentação quando necessários.  
**Primary Dependencies**: Laravel 13.7, Inertia React 3, Microsoft Graph SDK/Kiota 2, PHPUnit 12.  
**Storage**: Banco relacional já usado pela aplicação; snapshots, gerações e eventos existentes, com novas tabelas de ciclo, etapa, posição de coleta e política de retenção.  
**Testing**: PHPUnit feature tests, mocks do `GraphClient`, lint/format/type checks pelos scripts Composer.  
**Target Platform**: Aplicação web Laravel executada por agendador/CLI; uma única audiência autenticada.  
**Project Type**: Aplicação web monolítica com comandos de sincronização internos.  
**Performance Goals**: Para 10.000 grupos, ler relacionamentos apenas de grupos alterados no ciclo incremental; obter cada coleção canônica compartilhada no máximo uma vez por ciclo; registrar duração, páginas, itens, tentativas e throttling em 100% das etapas.  
**Constraints**: Eventos com overlap inicial de 15 minutos, retenção local inicial ajustável de 180 dias, reconciliação completa de relacionamentos semanal, ciclo diário às 03:00 no timezone do tenant, frescor de até 26 horas, nenhuma chamada HTTP dentro da transação de promoção e nenhuma publicação parcial de etapa dependente. Quando o Graph limitar a data inicial de `directoryAudits`, a coleta tenta a janela de 180 dias, persiste a menor data aceita retornada no erro e repete uma única vez a partir dela; a janela local não é reduzida.
**Scale/Scope**: Um tenant por execução; Usuários, Licenciamento, Grupos, auditoria de diretório, sign-ins e snapshots periódicos existentes de roles, PIM, MFA e risco. Overview Microsoft 365 permanece fora de escopo.

## Constitution Check

### Antes da pesquisa

- **Laravel-Conventional by Default**: Usar comandos Artisan, scheduler, migrations, Eloquent, cache locks e `upsert`; criar artefatos Laravel com `php artisan make:*`. O coordenador é justificado pela repetição e dependências hoje distribuídas nos três comandos.
- **Consistent User Experience**: Não haverá nova tela. Estados existentes usarão `SourceMetadata`, `DataFreshness` e `DataAvailabilityPanel` para declarar cobertura, frescor ou indisponibilidade, se dados dessas fontes já forem exibidos.
- **Verifiable Quality Gates**: A alteração é de fluxo completo; `composer test` é obrigatório ao encerrar a feature. Cada lote também passa por `composer ci:check`.
- **POC Scope with Controlled Full-Stack Evolution**: Persistência e Microsoft Graph são integrações reais já presentes. Não há novas fontes, RBAC, reativação da Overview ou fila distribuída nesta feature.
- **Simplicity Without Overengineering**: O coordenador permanece síncrono em comando Artisan; execução em background só será considerada após medir a redução de carga. Não introduzir filas, eventos de domínio ou repositórios genéricos sem repetição comprovada.
- **Surface-to-Story Traceability**: US1 mapeia snapshots de Usuários/Licenciamento/Grupos; US2 mapeia as telas de histórico de Usuários e Grupos; US3 mapeia a operação do comando e estados de fonte. Não há superfície nova independente.
- **Single Application Audience**: Reutilizar autenticação e dados uniformes; não criar diferenciação de acesso.

**Resultado do gate**: aprovado. Não há violação de princípios nem `NEEDS CLARIFICATION` pendente.

### Depois do design

- O design reutiliza as gerações e eventos existentes, acrescentando apenas tabelas de estado diretamente ligadas ao ciclo; não cria camada genérica de integração.
- O contrato de comando é interno e a UI reaproveita componentes de disponibilidade/frescor quando os campos novos forem expostos.
- Os testes cobrem delta, tombstone, paginação, deduplicação, falha de dependência, retenção, telemetria e ausência das chamadas redundantes.

**Resultado do gate**: aprovado.

## Project Structure

### Documentation (this feature)

```text
specs/006-otimizar-sync-m365/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── sync-command.md
│   └── source-state.md
└── tasks.md                 # criado por /speckit-tasks
```

### Source Code

```text
orkestria360/
├── app/
│   ├── Console/Commands/SyncMicrosoft365.php             # novo orquestrador
│   ├── Models/                                           # ciclos, etapas, posições e retenção
│   ├── Services/Microsoft365/
│   │   ├── Sync/CoordinatedSyncCoordinator.php            # novo
│   │   ├── UsersAccounts/UsersAccountsSynchronizer.php
│   │   ├── UsersAccounts/AuditEventsCollector.php
│   │   ├── Groups/GroupsSynchronizer.php
│   │   ├── Groups/collectors/
│   │   └── Licensing/
│   └── Support/Microsoft365/
│       ├── Contracts/GraphClient.php
│       └── GraphDataClient.php
├── database/migrations/
├── routes/console.php
└── tests/Feature/{UsersAccounts,Groups}/
```

**Structure Decision**: Toda implementação permanece no monólito `orkestria360/`. O domínio novo `Services/Microsoft365/Sync` é limitado à coordenação entre sincronizadores existentes; coletores e projeções continuam nos domínios atuais.

## Delivery Plan

### Phase 1 — Fundamentos observáveis e contrato Graph

1. Criar migrations, modelos e serviços para ciclo coordenado, etapas, posição incremental por fonte, lote de ingestão/publicação de eventos e política de retenção; relacionar `run_id`/geração às execuções existentes sem violar retries no mesmo dia.
2. Evoluir `GraphClient` e `GraphDataClient` para devolver metadados de coleta (páginas, itens, tentativas, espera e links opacos), paginação integral e política de retry que respeite integralmente `Retry-After` e use backoff com jitter na ausência dele.
3. Instrumentar métricas por etapa/coleção e estender os source states para cobertura, janela temporal, frescor, motivo e telemetria.
4. Criar testes de cliente para paginação, retry, 410, `@removed` e metadados; não manter como verdade os testes que afirmam primeira página de sign-ins.

### Phase 2 — Coleções canônicas e delta efetivo

1. Definir o superset estável de atributos do delta de usuários, validando explicitamente os campos necessários a Licenciamento e relações; tratar separadamente qualquer atributo indisponível no delta. A atividade deve ser projetada dos sign-ins canônicos, sem solicitar `signInActivity` no delta de usuários.
2. Refatorar `UsersAccountsSynchronizer` para copiar a geração publicada ao staging, aplicar somente itens delta e tombstones e promover em transação curta, sem `GET /users` completo em ciclo incremental válido.
3. Refatorar Grupos com o mesmo padrão; `DirectoryGroupsCollector` recebe os itens materializados em vez de chamar a fonte completa. Propagar os IDs alterados a coletores derivados.
4. Em token inválido/expirado, reiniciar a sincronização completa como recuperação explícita e registrar o reset; não avançar cursor de ciclo incompleto.
5. Fazer as consultas das telas derivarem seleção, ordenação, limite e filtros da fotografia canônica local quando houver superset; reservar Graph para fonte materialmente distinta.

### Phase 3 — Eventos canônicos, watermark e retenção

1. Extrair auditoria de diretório e sign-ins para coleta canônica por tenant/fonte, com janela fechada no início do ciclo, limite inferior inclusivo e superior exclusivo, overlap de 15 minutos, deduplicação por `external_id`, paginação total, lote de ingestão e avanço atômico do watermark após publicação bem-sucedida. Para `directoryAudits`, registrar `earliest_available_at` e refazer uma única vez a consulta a partir da menor data aceita informada pelo Graph quando o limite de disponibilidade impedir a primeira tentativa de 180 dias. Replays associam o evento já publicado a um novo lote sem remover seu vínculo anterior.
2. Fazer `GroupAuditCollector` projetar localmente a coleção canônica a partir de lotes publicados, removendo a segunda coleta de auditoria. Preservar a última projeção/sinal de fonte em caso de falha.
3. Executar a manutenção de retenção de eventos segundo política inicial de 180 dias ajustável, com índice por tenant e data de ocorrência; excluir somente eventos de lotes publicados e nunca de janela pendente ou falha.
4. Atualizar a UI de histórico apenas onde necessário para deixar explícita a cobertura e o recorte temporário enquanto uma fonte não estiver completa.

### Phase 4 — Projeções dependentes e eficiência

1. Fazer Licenciamento derivar atribuições da fotografia de identidades publicada no mesmo ciclo, mantendo SKUs e CSV de uso como fontes próprias; pular Licenciamento derivado quando Identidades falhar.
2. Recoletar membros, proprietários e erros de licença apenas dos grupos afetados; atualizar `user → memberOf` apenas para identidades afetadas; executar reconciliação completa semanal nas duas direções para detectar remoções ou alterações sem delta. Definir `transitiveMembers` como coletado ou indisponível — jamais zero inferido.
3. Reutilizar CSVs de relatório enquanto `reportRefreshDate` não mudar.
4. Remover HTTP de transações abertas e substituir persistência linha a linha por `upsert` em lotes quando não houver efeito de domínio por item.

### Phase 5 — Orquestração, agendamento e regressão

1. Criar `app:sync-microsoft365` com lock global renovável/compatível com a duração medida, dependências explícitas, resultados por etapa e progresso de console.
2. Trocar os três agendamentos pela execução coordenada diária às 03:00 no timezone do tenant; agendar a manutenção de eventos depois do ciclo e manter o prune de identidades como manutenção separada; não habilitar paralelismo Graph até as métricas demonstrarem segurança.
3. Manter roles, PIM, MFA e risco como etapas de snapshot periódico independentes, com data de referência, cobertura e frescor próprios; não aplicar delta ou watermark a essas fontes sem novo contrato.
4. Atualizar testes de Usuários, Grupos, Licenciamento e históricos para o novo contrato; incluir cenários de falha primária, etapa pulada, fonte secundária indisponível e recuperação.
5. Executar `composer ci:check` ao concluir cada lote e `composer test` no encerramento da feature.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Coordenador de sync dedicado | Os três comandos compartilham fontes e têm dependências de publicação/falha que não cabem em schedules independentes. | Manter comandos isolados preserva duplicação, locks concorrentes e não permite pular dependentes de forma explícita. |
| Tabelas de ciclo, etapa e posição de evento | Gerações atuais armazenam apenas delta de diretório e não representam watermark, telemetria nem correlação global. | Guardar tudo nos source states mistura estado publicado, métricas e cursores, dificultando recuperação atômica e auditoria. |
