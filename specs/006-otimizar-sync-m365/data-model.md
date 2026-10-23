# Data Model: Otimização dos Syncs Microsoft 365

## Reutilização de entidades existentes

| Entidade | Papel após a feature | Chave/regra relevante |
|---|---|---|
| `DirectoryIdentity` + `IdentitySnapshotGeneration` + `IdentitySnapshot` | Fotografia canônica de identidades e licenças | Identidade por tenant + Graph ID; tombstone em `removed_at`; geração só é publicada após concluir delta. |
| `DirectoryGroup` + `GroupSnapshotGeneration` + `GroupSnapshot` | Fotografia canônica de grupos | Grupo por tenant + Graph ID; delta aplica inclusão, alteração e remoção. |
| `DirectoryAuditEvent` e `SignInEvent` | Coleções canônicas de eventos | Exclusividade por tenant + `external_id`; não pertencem exclusivamente a uma geração ao reprocessar a janela. |
| `GroupAuditEvent` | Projeção local de auditoria de grupos | Derivada de `DirectoryAuditEvent`; não consulta a fonte remota. |
| `IdentitySourceState` e `GroupSourceState` | Estado publicado de fonte por superfície | Incluir cobertura, frescor, resultado e vínculo com telemetria/ciclo. |
| `LicensingSourceState` | Estado publicado de SKU e relatório de uso | Preserva a última referência íntegra de cada fonte própria de Licenciamento. |
| `UserLicenseAssignment` | Projeção de licenciamento por usuário | Derivada da fotografia de identidades compatível, não de nova leitura de usuários. |

## Novas entidades

### Microsoft365SyncCycle

Representa uma execução coordenada por tenant.

| Campo | Regra |
|---|---|
| `id` / `cycle_id` | Identificador interno e UUID de correlação. |
| `tenant_id` | Parte da exclusividade do ciclo. |
| `status` | `running`, `completed`, `completed_with_warnings`, `failed`, `skipped`. |
| `started_at`, `finished_at` | Calculam duração. |
| `lock_owner`, `failure_reason` | Diagnóstico sanitizado, sem credenciais/payloads sensíveis. |

### Microsoft365SyncStage

Representa cada etapa executada, falha ou pulada do ciclo.

| Campo | Regra |
|---|---|
| `cycle_id`, `stage_key` | Único por ciclo + etapa. |
| `depends_on` | Chaves das etapas que precisam publicar antes da execução. |
| `status` | `running`, `completed`, `failed`, `skipped`. |
| `source`, `generation_id` | Vincula origem e geração publicada. |
| `started_at`, `finished_at`, `duration_ms` | Métrica operacional. |
| `pages`, `items_read`, `items_persisted`, `items_deduplicated`, `attempts` | Cobertura e telemetria. |
| `retry_after_seconds`, `failure_reason` | Throttling e falha sanitizada. |

### Microsoft365CollectionPosition

Controla a continuidade de cada fonte incremental por tenant.

| Campo | Regra |
|---|---|
| `tenant_id`, `source_key` | Único por tenant + fonte (`directory_audits`, `sign_ins`, etc.). |
| `delta_link` | Exclusivo para recursos de estado que oferecem delta. Armazenado protegido. |
| `watermark_at` | Exclusivo para fontes de evento; avança apenas após publicação íntegra. |
| `overlap_minutes` | Inicialmente 15 para eventos. |
| `window_started_at`, `window_ended_at`, `last_successful_at` | Evidenciam cobertura e recuperação. |
| `status`, `reset_reason` | Identificam execução incompleta ou reinicialização. |

### Microsoft365EventIngestionBatch

Isola uma janela de eventos até sua publicação íntegra.

| Campo | Regra |
|---|---|
| `cycle_id`, `stage_id`, `source_key` | Correlacionam tenant, ciclo, etapa e fonte. |
| `window_started_at`, `window_ended_at` | Janela fechada no início: início inclusivo, fim exclusivo. |
| `status` | `staging`, `published`, `failed`; somente `published` pode avançar watermark ou entrar em retenção. |
| `pages`, `items_read`, `items_persisted`, `items_deduplicated` | Evidência de cobertura. |
| `published_at`, `failed_at` | Auditoria da transição do lote. |

### Microsoft365EventIngestionBatchEvent

Associação append-only entre evento canônico e lote, usada para replays seguros.

| Campo | Regra |
|---|---|
| `batch_id`, `event_kind`, `event_id` | Único por lote + tipo + evento; um evento pode pertencer a mais de um lote. |
| `persisted_at` | Registra a observação no lote sem alterar a publicação anterior. |

As projeções leem somente associações de lotes `published`. Um replay em lote `staging` não remove nem torna invisível o evento já publicado; se o novo lote falhar, a posição e a cobertura publicadas permanecem intactas.

### Microsoft365RetentionPolicy

Política ajustável de limpeza de eventos.

| Campo | Regra |
|---|---|
| `tenant_id`, `event_kind` | Único por tenant + tipo (`sign_in`, `directory_audit`). |
| `retention_days` | Inicialmente 180; valor positivo. |
| `effective_at`, `updated_at` | Permitem aplicar a alteração no próximo ciclo de manutenção. |

### LicensingSourceState

Expõe a mesma matriz de disponibilidade, frescor e cobertura das outras superfícies para `subscribed_skus` e relatórios de uso.

| Campo | Regra |
|---|---|
| `tenant_id`, `source_key` | Único por tenant + fonte de Licenciamento. |
| `availability_status`, `freshness`, `result_state` | Seguem contracts/source-state.md, inclusive preservação da última referência íntegra. |
| `coverage`, `last_successful_at`, `reason` | Informam período, data de referência e falha compreensível sem zerar dados publicados. |

## Transições principais

```text
Ciclo: running → completed | completed_with_warnings | failed | skipped
Etapa: running → completed | failed | skipped
Geração: staging → published | failed
Posição de evento: pending window → published watermark | unchanged after failure
```

## Integridade e índices

- Eventos continuam idempotentes por `(tenant_id, external_id)`; incluir índice de manutenção por `(tenant_id, occurred_at)`.
- Eventos de lote `staging` ou `failed` não são visíveis como cobertura publicada nem elegíveis ao prune.
- A retenção remove eventos somente quando todas as associações de lote publicadas elegíveis estiverem vencidas; nunca por associação staging/falha.
- Nenhum cursor/watermark muda antes da conclusão integral de sua etapa.
- A promoção de geração atualiza o status da geração anterior somente em transação curta.
- Uma etapa dependente não tem geração nova quando sua dependência falha; o estado deve ser `skipped` com motivo.
- Relações indiretas não coletadas são representadas como indisponíveis no estado da fonte, nunca como contagem zero.
