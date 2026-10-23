# Data Model: Modos Operacionais do Sync Microsoft 365

## `SyncOperation` (contrato interno, não persistido)

Objeto imutável criado pelo comando antes de iniciar o ciclo.

| Campo | Tipo | Regras |
|---|---|---|
| `mode` | enum | `routine`, `force`, `recollect_days`, `recollect_date`, `recollect_today` |
| `forceRequested` | boolean | Verdadeiro somente no modo `force`; é inválido nos modos de recoleta. |
| `recollectDays` | inteiro nulo | Obrigatório somente em `recollect_days`; allowlist: `7`, `30`, `90`, `180` (respectivamente `D7`, `D30`, `D90`, `D180`). |
| `requestedDate` | data ISO nula | Obrigatória somente em `recollect_date`; deve existir e não ser futura no timezone do tenant. |
| `tenantTimezone` | IANA timezone | Vem de `TenantActivitySetting`, com fallback configurado. |
| `startedAt` | instante UTC | Registrado no começo do ciclo; não é usado como limite de dia civil da recoleta. |
| `observedAt` | instante UTC | Congelado uma única vez ao iniciar o ciclo; teto único de leitura e publicação das fontes temporais quando a janela solicitada alcança o futuro. |
| `windowStartedAt` / `windowEndedAt` | instante UTC nulo | Janela solicitada para recoleta temporal; derivada dos inícios de dia civil do tenant, com início inclusivo e fim exclusivo. |

Deriva `rebuildStateSnapshots`, `bypassCadence`, `preserveIncrementalPositions` e a estratégia temporal. O coordenador entrega esse contexto a todos os coletores, que aplicam a decisão segundo sua capacidade: a rotina mantém o comportamento incremental; `force` preserva posições; qualquer recoleta reconstrói estado/snapshot atual ou, quando a fonte é temporal, usa a janela correspondente. Cada fonte substitui somente sua própria publicação coletada com êxito.

## `microsoft365_sync_cycles` (evolução)

Cada execução coordenada mantém seu registro atual e recebe metadados operacionais auditáveis.

| Campo novo | Tipo | Regra |
|---|---|---|
| `operation_mode` | string | Enum persistido do modo efetivo; preenchido para novos ciclos, seguro para registros históricos. |
| `operation_options` | JSON nulo | Opções normalizadas sem credenciais: `force_requested`, `recollect_days`, `requested_date`, instante de resolução e `observed_at`. |
| `tenant_timezone` | string nula | Timezone usado para resolver data/janela. |
| `window_started_at` / `window_ended_at` | timestamp UTC nulo | Janela temporal solicitada do ciclo quando aplicável. |

Relação existente: um ciclo possui muitas `Microsoft365SyncStage`; seus lotes de eventos referenciam `sync_cycle_id`. A migration deve permitir a leitura dos ciclos anteriores e não reescrever histórico.

## `microsoft365_sync_stages` e lotes de eventos

`Microsoft365SyncStage` continua registrando status, dependências e telemetria; seu metadado de cobertura deve declarar modo, fotografia completa ou limitação sem transformar falha em vazio. `Microsoft365EventIngestionBatch` já persiste status, disponibilidade e razão por fonte; a evolução adiciona o JSON versionado `coverage` e limites efetivos para diferenciar intenção de janela realmente obtida. Nas recoletas esses valores são a evidência por fonte, incluindo `risk_detections`; elas não alteram o cursor/watermark incremental publicado. Caso uma fonte imponha mínimo histórico, o limite efetivo publicado substitui a pretensão apenas no metadado de cobertura, não fabrica eventos indisponíveis.

### Schema mínimo de `coverage`

| Campo | Tipo | Semântica |
|---|---|---|
| `version` | inteiro | Versão inicial `1`. |
| `requested_window` | objeto UTC nulo | `{started_at, ended_at}` solicitado pela operação. |
| `effective_window` | objeto UTC nulo | `{started_at, ended_at}` efetivamente coletado/publicado. |
| `collected_through_at` | UTC nulo | Instante máximo observado; em dia em curso é exatamente `observed_at` compartilhado pelo ciclo. |
| `coverage_status` | enum | `complete`, `partial`, `limited`, `not_applicable`, `failed`. |
| `limitation_reason` | texto nulo | Razão sanitizada: `dia_em_curso`, limite Graph ou outra limitação conhecida. |
| `source_limit_at` | UTC nulo | Menor instante disponibilizado pela fonte quando ela limita o histórico. |

Para uma recoleta da data local atual, por `recollect_date` ou `recollect_today`, iniciada antes do fim do dia, `requested_window` é o dia civil completo, `effective_window.ended_at` e `collected_through_at` são exatamente `observed_at` e `coverage_status` é `partial` com `limitation_reason` `dia_em_curso`. As três fontes temporais usam o mesmo `observed_at`.

## Transições relevantes

```text
opções CLI válidas
  -> SyncOperation resolvida (data, janela e observed_at congelados)
  -> lock por tenant obtido
  -> lock renovado antes de expirar, entre páginas/retries e após cada etapa segura
  -> abortar antes de publicação se a renovação perder ownership
  -> ciclo running (modo/janela persistidos)
  -> estágio/lote staging
  -> published + posição atualizada, ou failed + publicação anterior preservada
  -> ciclo completed | completed_with_warnings | failed
```

Uma dependência só executa se a publicação necessária ocorrer no ciclo corrente. Uma fonte independente segue mesmo que outra falhe. Cursores e watermarks só avançam após publicação válida de rotina ou `force`; uma recoleta preserva as posições previamente publicadas.
