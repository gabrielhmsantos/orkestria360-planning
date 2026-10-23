# Contract: Estado de Fonte e Cobertura

Este contrato define os dados que as páginas existentes podem receber para declarar frescor, cobertura e indisponibilidade sem expor detalhes técnicos ou credenciais.

| Campo | Tipo/valores | Semântica |
|---|---|---|
| `availability_status` | `available`, `unavailable`, `restricted` | Se a fonte pôde ser usada. |
| `freshness` | `fresh`, `stale`, `unavailable` | Situação da última coleção publicada. |
| `result_state` | `items`, `empty_valid_response`, `failed`, `skipped` | Resultado da etapa. |
| `last_successful_at` | ISO-8601 ou `null` | Última publicação íntegra. |
| `coverage.window_started_at` | ISO-8601 ou `null` | Início efetivo da janela de evento. |
| `coverage.window_ended_at` | ISO-8601 ou `null` | Fim efetivo da janela de evento. |
| `coverage.retention_days` | inteiro ou `null` | Retenção publicada para eventos, inicialmente 180. |
| `coverage.pages`, `coverage.items` | inteiros | Cobertura da coleta, quando disponível. |
| `coverage.kind` | `complete_window`, `complete_snapshot`, `recent_sample`, `unknown`, `not_collected` | Completude declarada; não inferir a partir de contagem. |
| `coverage.data_as_of` | ISO-8601 ou `null` | Instante de referência do dado publicado. |
| `reason` | texto sanitizado ou `null` | Motivo compreensível de indisponibilidade ou skip. |

## Combinações válidas

| availability_status | result_state | coverage.kind | Apresentação |
|---|---|---|---|
| `available` | `items` ou `empty_valid_response` | `complete_window` | Dado fresco se `last_successful_at` tiver menos de 26 horas; caso contrário, dado defasado. |
| `available` | `items` ou `empty_valid_response` | `complete_snapshot` | Snapshot periódico íntegro; apresentar `data_as_of` e frescor próprios da fonte. |
| `available` | `items` | `recent_sample` | Declarar explicitamente recorte recente; nunca histórico completo. |
| `unavailable` ou `restricted` | `failed` | `unknown` | Exibir indisponibilidade/restrição e a última referência íntegra, se houver. |
| `available`, `unavailable` ou `restricted` | `skipped` | `not_collected` | Informar etapa pulada e sua dependência; preservar o último dado, sem mostrar zero. |

## Regras de apresentação

- `skipped` é resultado de etapa, não disponibilidade; a disponibilidade informa a condição da última fonte conhecida.
- Uma fonte com mais de 26 horas desde `last_successful_at` é defasada, mesmo que mantenha dados publicados.
- Dados de sign-ins sem janela incremental completa devem ser identificados como recorte recente.
- Roles, PIM, MFA e risco são `complete_snapshot` quando a coleta periódica concluir; não devem ser apresentados como delta ou histórico temporal.
- Relações indiretas sem coleta devem ser exibidas como indisponíveis; nenhuma tela pode transformá-las em zero.
- Métricas de requisição são operacionais e não aparecem como conteúdo principal de KPI; podem constar em diagnóstico/progresso do ciclo.
