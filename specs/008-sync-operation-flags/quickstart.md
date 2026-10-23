# Quickstart: Validar modos operacionais do Sync Microsoft 365

## Pré-requisitos

1. Estar em `orkestria360/` com dependências PHP instaladas, banco de teste disponível e configuração Graph/tenant usada pela suíte.
2. Ter migrations aplicadas no ambiente de teste e uma `TenantActivitySetting` com timezone conhecido (por exemplo, `America/Sao_Paulo`).
3. Usar doubles/fakes do `GraphClient` nos cenários automatizados; não usar dados reais para validar limites de datas.

## Cenários automatizados

```bash
cd orkestria360
php artisan test tests/Feature/Microsoft365/CoordinatedSyncTest.php
php artisan test tests/Feature/Microsoft365/CanonicalAuditEventsCollectorTest.php
php artisan test tests/Feature/Microsoft365/CoordinatedSyncScheduleTest.php
composer ci:check
composer test
```

Os testes devem provar o contrato em [sync-operation-command.md](./contracts/sync-operation-command.md) e as transições em [data-model.md](./data-model.md):

1. Sem flags conserva o incremental; `--force` volta a tentar as fontes sem alterar cursor/watermark e mantém deduplicação.
2. `--recollect-days=180` encaminha o modo a todos os coletores: recria estado, relações e snapshots atuais compatíveis e envia `directory_audits`, `sign_ins` e `risk_detections` entre 00:00:00 do dia atual menos 180 dias e 00:00:00 do dia atual, no timezone do tenant e convertido para UTC; executar o teste no meio do dia e confirmar que os limites não usam a hora do comando. Cobertura limitada pelo Graph fica explícita.
3. `--recollect-date=2026-08-13` também aciona todos os coletores, aplicando os limites do dia civil do tenant às fontes temporais; data inválida ou futura falha antes de criar ciclo/chamar fonte.
4. `--recollect-today` e `--recollect-date` da data local atual produzem a mesma janela civil solicitada resolvida no início do ciclo, inclusive quando o relógio cruza meia-noite durante a execução; antes do fim do dia, a cobertura efetiva das três fontes temporais termina no mesmo `observed_at` UTC congelado e é `partial` com razão `dia_em_curso`.
5. `--recollect-days` aceita somente `7`, `30`, `90` e `180`; validar que `60`, zero, negativos e texto falham antecipadamente. Qualquer combinação de dois modos também falha, inclusive `--force` + recoleta.
6. O scheduler contém somente a rotina diária e a recoleta semanal por `--recollect-today`; nenhuma referência pública a `--full-reconciliation` permanece.
7. Lock renovável bloqueia qualquer modo, inclusive paginação/retries de uma recoleta de 180 dias; se a renovação falhar, o ciclo aborta antes de nova promoção. Uma falha preserva a publicação anterior, permite fontes independentes e pula dependentes com motivo. Recoletas preservam cursores/watermarks incrementais e registros históricos sem metadados novos continuam legíveis.

## Verificação manual de console

Em um ambiente seguro com as credenciais já configuradas, execute um único modo por vez e confirme no resumo: modo, timezone, limites da janela (quando aplicável), cobertura efetiva, estágios concluídos/pulados/falhos e a preservação das fontes que falharam. Não execute uma recoleta ampla somente para esta validação se a fonte ou tenant não estiver autorizado para a carga operacional.
