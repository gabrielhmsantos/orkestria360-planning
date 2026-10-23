# Implementation Plan: Módulo Secure Score

**Branch**: `feat/009-secure-score-module` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

## Summary

Entregar as oito superfícies do Secure Score em leitura, consumindo projeções locais publicadas pelo ciclo coordenado Microsoft 365. Score e perfis serão coletados, paginados e versionados de forma independente; um manifesto composto, vinculado ao mesmo ciclo, garante coerência temporal. MFA reutiliza a projeção canônica existente; SharePoint/OneDrive, Exchange, Intune e Defender são coletores correlatos independentes, com estados próprios.

## Technical Context

**Language/Version**: PHP 8.3+, Laravel 13.7; TypeScript 5.7.
**Primary Dependencies**: Laravel, Inertia, React, Tailwind, cliente Graph/Kiota e componentes de módulo existentes.
**Storage**: banco relacional existente; gerações de score com checksum e revisão, versões de perfil por checksum, manifesto composto, fotografias correlatas e estados de fonte.
**Testing**: PHPUnit 12; `composer ci:check` por lote e `composer test` final.
**Target Platform**: monólito web Laravel e ciclo operacional Microsoft 365 existente.
**Project Type**: aplicação web monolítica com coleta externa coordenada.
**Performance Goals**: uma execução por fonte/ciclo, paginação completa e leitura de tela apenas local.
**Constraints**: somente leitura; respeitar paginação/`Retry-After`; sem HTTP externo em promoção; preservar publicação anterior em falha; SharePoint exclusivamente GET por allow-list aplicada no limite do cliente HTTP; Defender usa cliente/audiência própria; telas nunca chamam Graph/Defender.
**Scale/Scope**: um tenant por ciclo, oito superfícies; fontes correlatas são dinâmicas por publicação.

## Constitution Check

### Antes da pesquisa

- Laravel convencional: estender serviços, modelos, migrations e coordenador existentes; sem comando ou scheduler paralelo.
- UX consistente: reutilizar shell, estados de disponibilidade, tabelas, gráficos e painéis existentes.
- Qualidade verificável: cobrir paginação, retry, estados, join, histórico e ausência de chamada externa na tela.
- POC controlado: persistência e leitura Graph são necessárias; workflows de plano/meta/exceção/auditoria continuam futuros.
- Simplicidade: score/perfis formam um manifesto composto; fontes correlatas publicam isoladamente, sem nova plataforma de eventos.
- Rastreabilidade: US1–US8 já citam cards e representação estrutural.
- Audiência única: sem RBAC.

**Resultado**: aprovado antes e depois do design. O manifesto composto é a menor estrutura que evita join temporal ambíguo.

## Project Structure

```text
specs/009-secure-score-module/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── secure-score-sync.md
    └── secure-score-published-data.md

orkestria360/
├── app/Models/
├── app/Services/Microsoft365/{Sync,SecureScore}/
├── app/Support/Microsoft365/
├── database/migrations/
├── resources/js/{pages/microsoft-365,components/modules/secure-score}/
└── tests/Feature/Microsoft365/
```

## Delivery Plan

## Mapa de entrega, invariantes e gates

| Artefato | Responsabilidade | Gate de aceite |
| --- | --- | --- |
| migrations e modelos Secure Score | snapshots, revisões, perfis e estados imutáveis | unicidade, idempotência e publicação temporalmente compatível |
| clientes e sincronização Microsoft 365 | coleta paginada, métricas e proteção de leitura | `Retry-After`, SharePoint somente `GET` e nenhuma chamada externa nas telas |
| projeções e controller | dados locais autoritativos por superfície | disponibilidade, cobertura, frescor e motivos explícitos |
| componentes Secure Score | oito superfícies e seus estados | faixas, ordem, responsividade e acessibilidade da representação estrutural |
| testes de feature | contratos, sincronização e jornadas | cenários de falha, dados vazios, histórico e limites de capacidades futuras |

### Invariantes de implementação

- A tela lê exclusivamente dados locais publicados; nunca Graph ou Defender.
- Um manifesto liga somente score e perfil íntegros do mesmo `sync_cycle_id` (ou chave de compatibilidade persistida).
- Repetição com checksum idêntico é no-op; uma fotografia publicada jamais é sobrescrita.
- Falha posterior preserva a publicação anterior e torna seu frescor defasado; primeira falha é `unavailable`.
- SharePoint é protegido no limite HTTP por allow-list de host/path e aceita somente `GET`.
- Recursos de plano, metas, exceções, auditoria operacional e exportação permanecem explicitamente indisponíveis ou futuros quando não houver fonte publicada.

### Gates por Phase

1. Marcar cada task somente após sua validação local e executar a revisão `tech_lead` ao término de toda Phase; executar também `qa_ux_ui` em Phases com UI.
2. Corrigir qualquer achado bloqueante antes da Phase seguinte e registrar um commit atômico no repositório proprietário.
3. Nas fases de sincronização, executar os testes Secure Score afetados; nas fases de UI, executar build e os testes da jornada correspondente.
4. No encerramento, validar os oito journeys do `quickstart.md`, executar `composer ci:check` e `composer test` no repositório da aplicação.

### Phase 1 — Persistência e contratos

1. Criar gerações de score com chave natural `tenant + graph_score_id`, checksum/revisão imutável, controles por geração, versões de perfil imutáveis por checksum, perfis por versão e manifesto composto com `sync_cycle_id`/chave de compatibilidade explícita.
2. Persistir fotografias/estados correlatos independentes e definir envelope que separe disponibilidade publicada do resultado da última tentativa, com frescor/defasagem e motivo sanitizado.
3. Definir a allow-list SharePoint e bloquear métodos diferentes de `GET` no cliente HTTP antes de habilitar a coleta.
4. Testar unicidade/idempotência, imutabilidade, transições staging/publicado/falha e matriz de primeira falha versus falha posterior.

### Phase 2 — Coleta coordenada

1. Adicionar `secure_scores`, `secure_score_profiles` e coletores correlatos independentes ao `CoordinatedSyncCoordinator`; reutilizar a projeção MFA existente e tratar a ausência da geração de identidades como `skipped`/`restricted` apenas para Exchange.
2. Coletar páginas, respeitar retry e registrar métricas por fonte.
3. Promover fonte íntegra de forma independente; criar manifesto apenas com score e perfil íntegros do mesmo `sync_cycle_id`/chave de compatibilidade. Retry com checksum idêntico é no-op; payload alterado de uma fotografia já publicada cria revisão compatível, sem reescrever o histórico.
4. Associar `controlName → profile.id` por match exato e fallback normalizado auditável; ausências/colisões reduzem cobertura.
5. Preservar manifesto anterior em falha parcial; nunca juntar score novo a perfil antigo arbitrariamente. Coletores correlatos não bloqueiam score/perfis nem o manifesto.

### Phase 3 — Projeções e telas

1. Substituir leitura direta de Secure Score por projeções publicadas e expor uma prop Inertia por superfície; cálculos de score, prioridade e cobertura permanecem autoritativos no backend.
2. Construir componentes por superfície, mantendo cards, faixas, spans, ordem e comportamento móvel da representação estrutural.
3. Exibir estados por bloco, incluindo vazio válido, primeira falha `unavailable`, dado defasado, restrição dinâmica, loading sem zerar publicação e base histórica insuficiente.
4. Implementar Histórico Observado: coletas desde a primeira publicação, diffs após duas publicações comparáveis, sem causa/autoria inferida.

### Phase 4 — Validação

1. Cobrir paginação, throttling, 401/403 dinâmicos, vazio válido, primeira/falha posterior, join por ciclo e versionamento de perfil.
2. Validar os oito journeys, as tabelas móveis/detalhes anunciados e ausência de escrita no tenant/exportação.
3. Rodar os gates definidos.
